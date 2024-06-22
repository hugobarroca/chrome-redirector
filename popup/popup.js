"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const optionsButton = document.getElementById("options");
if (optionsButton) {
    optionsButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "options/options.html" });
    });
}
console.log("Popup script loaded");
const tenMinutesButton = document.getElementById("10-minutes-button");
if (tenMinutesButton) {
    tenMinutesButton.addEventListener("click", () => {
        disableRedirector(10);
    });
}
const thirtyMinutebutton = document.getElementById("30-minutes-button");
if (thirtyMinutebutton) {
    thirtyMinutebutton.addEventListener("click", () => {
        disableRedirector(30);
    });
}
const oneHourButton = document.getElementById("1-hour-button");
if (oneHourButton) {
    oneHourButton.addEventListener("click", () => {
        disableRedirector(60);
    });
}
updateTimerAndEnableButton();
setInterval(updateTimerAndEnableButton, 1000);
function updateTimerAndEnableButton() {
    updateTimer();
    updateUI();
    updateEnableButton();
}
function updateTimer() {
    chrome.alarms.get("enable", (alarm) => {
        const hourDisplay = document.getElementById("hourDisplay");
        const hourDisplayLabel = document.getElementById("hourDisplayLabel");
        const minuteDisplay = document.getElementById("minuteDisplay");
        const minuteDisplayLabel = document.getElementById("minuteDisplayLabel");
        const secondDisplay = document.getElementById("secondDisplay");
        const secondDisplayLabel = document.getElementById("secondDisplayLabel");
        if (!(hourDisplay &&
            hourDisplayLabel &&
            minuteDisplay &&
            minuteDisplayLabel &&
            secondDisplay &&
            secondDisplayLabel)) {
            console.error("One or more elements are null");
            return;
        }
        if (alarm) {
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
            }
            else {
                // Hides hourDisplay and hourDisplayLabel.
                hourDisplay.style.display = "none";
                hourDisplayLabel.style.display = "none";
            }
            if (minutesRemaining > 0) {
                minuteDisplay.textContent = `${minutesRemaining}`;
                minuteDisplayLabel.textContent = "Minutes";
                minuteDisplay.style.display = "block";
                minuteDisplayLabel.style.display = "block";
            }
            else {
                // Hides minuteDisplay and minuteDisplayLabel.
                minuteDisplay.style.display = "none";
                minuteDisplayLabel.style.display = "none";
            }
            if (secondsRemaining > 0) {
                secondDisplay.textContent = `${secondsRemaining}`;
                secondDisplayLabel.textContent = "Seconds";
                secondDisplay.style.display = "block";
                secondDisplayLabel.style.display = "block";
            }
            else {
                // Hides secondDisplay and secondDisplayLabel.
                secondDisplay.style.display = "none";
                secondDisplayLabel.style.display = "none";
            }
        }
        else {
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
        if (!disableButton) {
            console.error("Disable button is null");
            return;
        }
        if (data.disabled) {
            disableButton.removeEventListener("click", disableRedirectorCustomTime);
            disableButton.textContent = "Enable";
            disableButton.addEventListener("click", reenableRedirector);
        }
        else {
            disableButton.removeEventListener("click", reenableRedirector);
            disableButton.textContent = "Disable";
            disableButton.addEventListener("click", disableRedirectorCustomTime);
        }
    });
}
function reenableRedirector() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Clear the "enable" alarm.
            const wasCleared = yield chrome.alarms.clear("enable");
            if (!wasCleared) {
                console.error("Failed to clear the alarm.");
                return;
            }
            // Use a promise to handle the storage operation for consistency with async/await.
            yield new Promise((resolve, reject) => {
                chrome.storage.sync.set({ disabled: false }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        console.log("Enabled");
                        resolve(null);
                    }
                });
            });
        }
        catch (error) {
            console.error(`Error re-enabling the redirector: ${error.message}`);
        }
    });
}
function updateUI() {
    chrome.storage.sync.get("disabled", (data) => {
        updateEnableLabel(data);
        updateTimerInput(data);
    });
}
function updateEnableLabel(data) {
    const title = document.getElementById("title");
    if (!title) {
        console.error("Title is null");
        return;
    }
    if (data.disabled) {
        title.textContent = "Easy Redirector " + String.fromCodePoint(0x274c);
        title.style.color = "red";
    }
    else {
        title.textContent = "Easy Redirector " + String.fromCodePoint(0x2705);
        title.style.color = "green";
    }
}
function updateTimerInput(data) {
    const timeSelectionSection = document.getElementById("timeSelectionSection");
    if (!timeSelectionSection) {
        console.error("Time selection section is null");
        return;
    }
    if (data.disabled) {
        timeSelectionSection.style.display = "none";
    }
    else {
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
    console.log("Redirector disabled for", disableTimeInMinutes, "minutes");
    chrome.storage.sync.set({ disabled: true }, () => {
        chrome.alarms.create("enable", {
            delayInMinutes: disableTimeInMinutes,
        });
    });
}
