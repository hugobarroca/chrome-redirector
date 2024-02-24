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
  updateUI();
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

      if (hoursRemaining > 0) {
        timerDisplay.textContent = `Time remaining: ${hoursRemaining}:${minutesRemaining}:${secondsRemaining}`;
      } else {
        timerDisplay.textContent = `Time remaining: ${minutesRemaining}:${secondsRemaining}`;
      }
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

function updateUI() {
  chrome.storage.sync.get("disabled", (data) => {
    updateEnableLabel(data);
    updateTimerInput(data);
  });
}

function updateEnableLabel(data) {
  const disabledLabel = document.getElementById("disabledLabel");
  if (data.disabled) {
    disabledLabel.textContent = "Disabled";
    disabledLabel.style.color = "red";
  } else {
    disabledLabel.textContent = "Enabled";
    disabledLabel.style.color = "green";
  }
}

function updateTimerInput(data) {
  const disableTime = document.getElementById("disableTime");
  const tenMinutesButton = document.getElementById("10-minutes-button");
  const thirtyMinutesButton = document.getElementById("30-minutes-button");
  const oneHourButton = document.getElementById("1-hour-button");
  const disableTimeLabel = document.getElementById("disableTimeLabel");

  if (data.disabled) {
    timeSelectionSection.style.display = "none";

    // disableTime.style.display = "none";
    // tenMinutesButton.style.display = "none";
    // thirtyMinutesButton.style.display = "none";
    // oneHourButton.style.display = "none";
    // disableTimeLabel.style.display = "none";
  } else {
    timeSelectionSection.style.display = "inline-block";
    
    // disableTime.style.display = "inline-block";
    // tenMinutesButton.style.display = "inline-block";
    // thirtyMinutesButton.style.display = "inline-block";
    // oneHourButton.style.display = "inline-block";
    // disableTimeLabel.style.display = "inline-block";
  }
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
