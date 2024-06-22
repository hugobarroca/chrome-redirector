// Startup code for the options page
document.addEventListener("DOMContentLoaded", function () {
  let addButton = document.getElementById("add-blocked-website-button");
  if (!addButton) {
    console.error("Add button is null");
    return;
  }
  addButton.addEventListener("click", addWebsite);
  createListWithSavedOptions();
});

const clickButtonOnEnter = () => {
  let input = document.getElementById("add-website-input");
  if (!input) {
    console.error("Input is null");
    return;
  }
  input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const addBlockedWebsiteButton = document.getElementById(
        "add-blocked-website-button"
      );
      if (!addBlockedWebsiteButton) {
        console.error("Add button is null");
        return;
      }
      addBlockedWebsiteButton.click();
    }
  });
};

clickButtonOnEnter();

// Makes the input field to be focused when the options page is opened
const addWebsiteInput = document.getElementById("add-website-input");
if (!addWebsiteInput) {
  console.error("Add website input is null");
} else addWebsiteInput.focus();

// === Functions === //
const addWebsite = () => {
  let addWebsiteInput: HTMLInputElement = document.getElementById(
    "add-website-input"
  ) as HTMLInputElement;

  if (!addWebsiteInput) {
    console.error("Website input is null");
    return;
  }

  let websiteToRedirect = addWebsiteInput.value;

  if (websiteToRedirect === "") {
    return;
  }

  websiteToRedirect = removeProtocolFromWebsite(websiteToRedirect);

  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    console.log(oldSites);
    let newList;
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

const removeProtocolFromWebsite = (website: string) => {
  return website.replace(/(^\w+:|^)\/\//, "");
};

const createListWithSavedOptions = () => {
  chrome.storage.sync.get("sitesToRedirect").then((result) => {
    createListOfRedirectedSites(result.sitesToRedirect);
  });
};

const addValue = (newValue: string) => {
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    let newList = [...oldSites.sitesToRedirect, newValue];
    chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
      createListOfRedirectedSites(newList);
    });
  });
};

const removeValue = (keyToRemove: string) => {
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    let newList = [
      ...oldSites.sitesToRedirect.filter((x: string) => x !== keyToRemove),
    ];
    chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
      createListOfRedirectedSites(newList);
    });
  });
};

const createListOfRedirectedSites = (websitesToRedirect: string[]) => {
  console.log("Running create list...");
  var listContainer = document.getElementById("listContainer");
  if (!listContainer) {
    console.error("List container is null");
    return;
  }
  listContainer.innerHTML = "";
  var blockedSitesDiv = document.createElement("div");
  websitesToRedirect.forEach(function (item) {
    var blockedSiteItem = document.createElement("p");
    blockedSiteItem.className = "blocked-site";
    blockedSiteItem.addEventListener("click", function () {
      console.log("Remove button clicked!");
      removeValue(item);
    });
    blockedSiteItem.textContent = item;
    blockedSitesDiv.appendChild(blockedSiteItem);
  });
  listContainer.appendChild(blockedSitesDiv);
};

const createRemoveIcon = () => {
  var removeIcon = document.createElement("img");
  removeIcon.src = "icons8-close.svg";
  removeIcon.alt = "Remove";
  removeIcon.width = 20;
  removeIcon.height = 20;
  removeIcon.style.cursor = "pointer";
  return removeIcon;
};

const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};
