// Adds an event listener to the "enable" alarm that sets the value of the disabled key in storage to false when the alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "enable") {
    chrome.storage.sync.set({ disabled: false });
  }
});
