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

// Saves options to chrome.storage
const removeValue = (keyToRemove) => {
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    newList = [...oldSites.sitesToRedirect.filter((x) => x !== keyToRemove)];
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
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
      console.log("Remove button clicked!");
      removeValue(item);
    });
    li.textContent = item;
    ul.appendChild(li).append(removeButton);
    // ul.appendChild(removeButton);
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
