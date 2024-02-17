// Startup code for the options page
document.addEventListener("DOMContentLoaded", function () {
  var myButton = document.getElementById("save");
  myButton.addEventListener("click", saveOptions);
  createListWithSavedOptions();
});

clickButtonOnEnter();

// Makes the input field to be focused when the options page is opened
document.getElementById("block-input").focus();

// === Functions === //

const saveOptions = () => {
  let websiteToRedirect = document.getElementById("block-input").value;

  if (websiteToRedirect === "") {
    return;
  }

  websiteToRedirect = websiteToRedirect.replace(/(^\w+:|^)\/\//, "");

  console.log("Website value: " + websiteToRedirect);
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    console.log(oldSites);
    if (isEmpty(oldSites)) {
      newList = [websiteToRedirect];
    } else {
      newList = [...oldSites?.sitesToRedirect, websiteToRedirect];
    }
    chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
      createListOfRedirectedSites(newList);
    });
  });
};

const createListWithSavedOptions = () => {
  chrome.storage.sync.get("sitesToRedirect").then((result) => {
    createListOfRedirectedSites(result.sitesToRedirect);
  });
};

const addValue = (newValue) => {
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    newList = [...oldSites.sitesToRedirect, newValue];
    chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
      createListOfRedirectedSites(newList);
    });
  });
};

const removeValue = (keyToRemove) => {
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    newList = [...oldSites.sitesToRedirect.filter((x) => x !== keyToRemove)];
    chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
      createListOfRedirectedSites(newList);
    });
  });
};

const createListOfRedirectedSites = (websitesToRedirect) => {
  console.log("Running create list...");
  var listContainer = document.getElementById("listContainer");
  listContainer.innerHTML = "";
  var blockedSitesDiv = document.createElement("div");
  websitesToRedirect.forEach(function (item) {
    var blockedSiteItem = document.createElement("p");
    blockedSiteItem.className = "blocked-site";
    var removeIcon = createRemoveIcon();
    blockedSiteItem.addEventListener("click", function () {
      console.log("Remove button clicked!");
      removeValue(item);
    });
    blockedSiteItem.textContent = item;
    blockedSitesDiv.appendChild(blockedSiteItem);
  });
  listContainer.appendChild(blockedSitesDiv);
};

function createRemoveIcon() {
  var removeIcon = document.createElement("img");
  removeIcon.src = "icons8-close.svg";
  removeIcon.alt = "Remove";
  removeIcon.width = 20;
  removeIcon.height = 20;
  removeIcon.style.cursor = "pointer";
  return removeIcon;
}

function clickButtonOnEnter() {
  let input = document.getElementById("block-input");
  input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save").click();
    }
  });
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
