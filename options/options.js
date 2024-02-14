document.addEventListener("DOMContentLoaded", function () {
  var myButton = document.getElementById("save");
  myButton.addEventListener("click", saveOptions);
  createListWithSavedOptions();
});

const saveOptions = () => {
  let websiteToRedirect = document.getElementById("websiteToRedirect").value;
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
  var ul = document.createElement("ul");
  websitesToRedirect.forEach(function (item) {
    var li = document.createElement("li");
    var removeIcon = createRemoveIcon();
    removeIcon.addEventListener("click", function () {
      console.log("Remove button clicked!");
      removeValue(item);
    });
    li.textContent = item;
    ul.appendChild(li).append(removeIcon);
  });
  listContainer.appendChild(ul);
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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
