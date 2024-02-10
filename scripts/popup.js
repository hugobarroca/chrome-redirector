document.getElementById("options").addEventListener("click", function () {
  chrome.tabs.create({ url: "options.html" });
});

document.getElementById("disable").addEventListener("click", function () {
  chrome.storage.sync.set({ disabled: true }, () => {
    console.log("Disabled");

    let disableTimeInMinutes = document.getElementById("disableTime").value;
    let disableTimeInMilliseconds = disableTimeInMinutes * 60 * 1000;

    setTimeout(function () {
      chrome.storage.sync.set({ disabled: false }, () => {
        console.log("Enabled");
      });
    }, disableTimeInMilliseconds);
  });
  window.close();
});

chrome.storage.sync.get("disabled", (data) => {
  const disableButton = document.getElementById("disable");
  if (data.disabled) {
    disableButton.textContent = "Enable";
    disableButton.addEventListener("click", function () {
      chrome.storage.sync.set({ disabled: false }, () => {
        console.log("Enabled");
      });
      window.close();
    });
  } else {
    disableButton.textContent = "Disable";
    disableButton.addEventListener("click", function () {
      chrome.storage.sync.set({ disabled: true }, () => {
        console.log("Disabled");
      });
      window.close();
    });
  }
});

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
