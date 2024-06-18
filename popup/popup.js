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
      const hourDisplay = document.getElementById("hourDisplay");
      const hourDisplayLabel = document.getElementById("hourDisplayLabel");

      const minuteDisplay = document.getElementById("minuteDisplay");
      const minuteDisplayLabel = document.getElementById("minuteDisplayLabel");

      const secondDisplay = document.getElementById("secondDisplay");
      const secondDisplayLabel = document.getElementById("secondDisplayLabel");

      const timeRemaining = alarm.scheduledTime - Date.now();

      let hoursRemaining = Math.floor(timeRemaining / 3600000);
      hoursRemaining =
        hoursRemaining < 10 ? `0${hoursRemaining}` : hoursRemaining;

      // Fix: Calculate minutes remaining after subtracting hours
      let minutesRemaining = Math.floor((timeRemaining % 3600000) / 60000);
      minutesRemaining =
        minutesRemaining < 10 ? `0${minutesRemaining}` : minutesRemaining;

      // Fix: Calculate seconds remaining correctly
      let secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);
      secondsRemaining =
        secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;

      // Update the display elements
      hourDisplay.textContent = hoursRemaining;
      hourDisplayLabel.textContent = hoursRemaining === "01" ? "Hour" : "Hours";

      minuteDisplay.textContent = minutesRemaining;
      minuteDisplayLabel.textContent =
        minutesRemaining === "01" ? "Minute" : "Minutes";

      secondDisplay.textContent = secondsRemaining;
      secondDisplayLabel.textContent =
        secondsRemaining === "01" ? "Second" : "Seconds";

      if (hoursRemaining > 0) {
        hourDisplay.style.display = "block";
        hourDisplayLabel.style.display = "block";
        hourDisplay.textContent = `${hoursRemaining}`;
        hourDisplayLabel.textContent = "Hours";
      } else {
        // Hides hourDisplay and hourDisplayLabel.
        hourDisplay.style.display = "none";
        hourDisplayLabel.style.display = "none";
      }

      if (minutesRemaining > 0) {
        minuteDisplay.textContent = `${minutesRemaining}`;
        minuteDisplayLabel.textContent = "Minutes";
        minuteDisplay.style.display = "block";
        minuteDisplayLabel.style.display = "block";
      } else {
        // Hides minuteDisplay and minuteDisplayLabel.
        minuteDisplay.style.display = "none";
        minuteDisplayLabel.style.display = "none";
      }

      if (secondsRemaining > 0) {
        secondDisplay.textContent = `${secondsRemaining}`;
        secondDisplayLabel.textContent = "Seconds";
        secondDisplay.style.display = "block";
        secondDisplayLabel.style.display = "block";
      } else {
        // Hides secondDisplay and secondDisplayLabel.
        secondDisplay.style.display = "none";
        secondDisplayLabel.style.display = "none";
      }
    } else {
      hourDisplay.style.display = "none";
      hourDisplayLabel.style.display = "none";
      minuteDisplay.style.display = "none";
      minuteDisplayLabel.style.display = "none";
      secondDisplay.style.display = "none";
      secondDisplayLabel.style.display = "none";
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
  try {
    // Clear the "enable" alarm.
    const wasCleared = await chrome.alarms.clear("enable");
    if (!wasCleared) {
      console.error("Failed to clear the alarm.");
      return;
    }

    // Use a promise to handle the storage operation for consistency with async/await.
    await new Promise((resolve, reject) => {
      chrome.storage.sync.set({ disabled: false }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          console.log("Enabled");
          resolve();
        }
      });
    });
  } catch (error) {
    console.error(`Error re-enabling the redirector: ${error.message}`);
  }
}

function updateUI() {
  chrome.storage.sync.get("disabled", (data) => {
    updateEnableLabel(data);
    updateTimerInput(data);
  });
}

function updateEnableLabel(data) {
  const title = document.getElementById("title");
  if (data.disabled) {
    title.textContent = "Easy Redirector " + String.fromCodePoint(0x274c);
    title.style.color = "red";
  } else {
    title.textContent = "Easy Redirector " + String.fromCodePoint(0x2705);
    title.style.color = "green";
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
  } else {
    timeSelectionSection.style.display = "inline-block";
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
