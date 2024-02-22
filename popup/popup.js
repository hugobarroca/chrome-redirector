document.getElementById("options").addEventListener("click", function () {
  chrome.tabs.create({ url: "options/options.html" });
});

document
  .getElementById("10-minutes-button")
  .addEventListener("click", function () {
    disableRedirector(10);
  });

document
  .getElementById("30-minutes-button")
  .addEventListener("click", function () {
    disableRedirector(30);
  });

document.getElementById("1-hour-button").addEventListener("click", function () {
  disableRedirector(60);
});

updateTimerAndEnableButton();
setInterval(updateTimerAndEnableButton, 1000);

function updateTimerAndEnableButton() {
  updateTimer();
  updateEnableLabel();
  updateEnableButton();
}

function updateTimer() {
  chrome.alarms.get("enable", (alarm) => {
    if (alarm) {
      const timerDisplay = document.getElementById("timerDisplay");

      const timeRemaining = alarm.scheduledTime - Date.now();

      let hoursRemaining = Math.floor(timeRemaining / 3600000);
      hoursRemaining =
        hoursRemaining < 10 ? `0${hoursRemaining}` : hoursRemaining;

      let minutesRemaining = Math.floor(timeRemaining / 60000);
      minutesRemaining =
        minutesRemaining < 10 ? `0${minutesRemaining}` : minutesRemaining;

      let secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);
      secondsRemaining =
        secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;

      timerDisplay.textContent = `Time remaining: ${hoursRemaining}:${minutesRemaining}:${secondsRemaining}`;
    } else {
      timerDisplay.textContent = "";
    }
  });
}

function updateEnableButton() {
  chrome.storage.sync.get("disabled", (data) => {
    const disableButton = document.getElementById("disable");
    if (data.disabled) {
      disableButton.removeEventListener("click", disableRedirectorCustomTime);
      disableButton.textContent = "Enable";
      disableButton.addEventListener("click", reenableRedirector);
    } else {
      disableButton.removeEventListener("click", reenableRedirector);
      disableButton.textContent = "Disable";
      disableButton.addEventListener("click", disableRedirectorCustomTime);
    }
  });
}

async function reenableRedirector() {
  await chrome.alarms.clear("enable");
  chrome.storage.sync.set({ disabled: false }, () => {
    console.log("Enabled");
  });
}

function updateEnableLabel() {
  chrome.storage.sync.get("disabled", (data) => {
    const disabledLabel = document.getElementById("disabledLabel");
    if (data.disabled) {
      disabledLabel.textContent = "Disabled";
      disabledLabel.style.color = "red";
    } else {
      disabledLabel.textContent = "Enabled";
      disabledLabel.style.color = "green";
    }
  });
}

function disableRedirectorCustomTime() {
  const disableTime = document.getElementById("disableTime").value.split(":");
  const hoursInMinutes = parseInt(disableTime[0]) * 60;
  const minutes = parseInt(disableTime[1]);
  const disableTimeInMinutes = hoursInMinutes + minutes;
  disableRedirector(disableTimeInMinutes);
}

function disableRedirector(disableTimeInMinutes) {
  chrome.storage.sync.set({ disabled: true }, () => {
    chrome.alarms.create("enable", {
      delayInMinutes: disableTimeInMinutes,
    });
  });
}
