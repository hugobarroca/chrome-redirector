document.addEventListener("DOMContentLoaded", function () {
  var myButton = document.getElementById("save");

  myButton.addEventListener("click", function () {
    console.log("Button clicked!");
    saveOptions();
  });
});

// Saves options to chrome.storage
const saveOptions = () => {
  const websiteToRedirect = document.getElementById("websiteToRedirect").value;
  console.log("Website value: " + websiteToRedirect);
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    newList = [...oldSites.sitesToRedirect, websiteToRedirect];
    debugger;
    chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
      createList(newList);
    });
  });
};

const createList = (items) => {
  console.log("Running create list...");
  var listContainer = document.getElementById("listContainer");
  listContainer.innerHTML = "";
  var ul = document.createElement("ul");
  items.forEach(function (item) {
    var li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
  listContainer.appendChild(ul);
};

document.addEventListener("DOMContentLoaded", function () {
  restoreOptions();
});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get("sitesToRedirect").then((result) => {
    debugger;
    createList(result.sitesToRedirect);
  });
};

// document.addEventListener("DOMContentLoaded", restoreOptions);
// document.getElementById("save").addEventListener("click", saveOptions);
