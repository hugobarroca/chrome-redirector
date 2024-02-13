document.getElementById("options").addEventListener("click", function () {
  chrome.tabs.create({ url: "options/options.html" });
});

function updateEnableButton() {
  chrome.storage.sync.get("disabled", (data) => {
    const disableButton = document.getElementById("disable");
    if (data.disabled) {
      disableButton.textContent = "Enable";
      disableButton.addEventListener("click", function () {
        chrome.storage.sync.set({ disabled: false }, () => {
          console.log("Enabled");
        });
      });
    } else {
      disableButton.textContent = "Disable";
      disableButton.addEventListener("click", disableButtonFunctionality);
    }
  });
}

function updateTimer() {
  chrome.alarms.get("enable", (alarm) => {
    if (alarm) {
      const timerDisplay = document.getElementById("timerDisplay");
      const timeRemaining = alarm.scheduledTime - Date.now();
      const minutesRemaining = Math.floor(timeRemaining / 60000);
      const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);
      timerDisplay.textContent = `Time remaining: ${minutesRemaining}:${secondsRemaining}`;
    }
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

// If an alarm with the name "enable" exists, it sets the value of the timerDisplay element to the time remaining until the alarm triggers
function updateDisplay() {
  updateTimer();
  updateEnableLabel();
  updateEnableButton();
}

// Updates display when the popup is opened
updateDisplay();

// Update the timer display every second
setInterval(updateDisplay, 1000);

// Disables the extension and sets an alarm to enable the extension after a specified amount of time
function disableButtonFunctionality() {
  chrome.storage.sync.set({ disabled: true }, () => {
    let disableTimeInMinutes = parseInt(
      document.getElementById("disableTime").value
    );

    chrome.alarms.create("enable", {
      delayInMinutes: disableTimeInMinutes, // Convert disableTimeInMinutes to a number
    });
  });
}
