document.addEventListener("DOMContentLoaded", function () {
  var myButton = document.getElementById("save");
  myButton.addEventListener("click", function () {
    saveOptions();
  });
  createListWithSavedOptions();
});

const saveOptions = () => {
  const websiteToRedirect = document.getElementById("websiteToRedirect").value;
  console.log("Website value: " + websiteToRedirect);
  chrome.storage.sync.get("sitesToRedirect").then((oldSites) => {
    console.log(oldSites);
    if (isEmpty(oldSites)) {
      newList = [websiteToRedirect];
      chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
        createListOfRedirectedSites(newList);
      });
    } else {
      newList = [...oldSites?.sitesToRedirect, websiteToRedirect];
      chrome.storage.sync.set({ sitesToRedirect: newList }, () => {
        createListOfRedirectedSites(newList);
      });
    }
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
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
      console.log("Remove button clicked!");
      removeValue(item);
    });
    li.textContent = item;
    ul.appendChild(li).append(removeButton);
  });
  listContainer.appendChild(ul);
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
