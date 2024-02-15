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
    // Assuming the value is a string in the format hours:minutes (e.g. "1:30"), split the string into an array of two strings
    const disableTime = document.getElementById("disableTime").value.split(":");
    // Convert the first string in the array to a number and multiply it by 60 to convert hours to minutes
    const hoursInMinutes = parseInt(disableTime[0]) * 60;
    // Convert the second string in the array to a number
    const minutes = parseInt(disableTime[1]);
    // Add the two numbers together to get the total number of minutes
    const disableTimeInMinutes = hoursInMinutes + minutes;
    // let disableTimeInMinutes = parseInt(
    //   document.getElementById("disableTime").value
    // );

    chrome.alarms.create("enable", {
      delayInMinutes: disableTimeInMinutes, // Convert disableTimeInMinutes to a number
    });
  });
}
