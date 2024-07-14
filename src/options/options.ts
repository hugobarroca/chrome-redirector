interface ListStore {
  storeName: string;
  buttonId: string;
  inputId: string;
  listId: string;
  className: string;
}

const LUCKY_STORE: ListStore = {
  storeName: "luckySites",
  buttonId: "add-lucky-website-button",
  inputId: "add-lucky-website-input",
  listId: "lucky-sites-list",
  className: "lucky-site",
};

const BLOCKED_STORE: ListStore = {
  storeName: "blockedSites",
  buttonId: "add-blocked-website-button",
  inputId: "add-blocked-website-input",
  listId: "blocked-sites-list",
  className: "blocked-site",
};

const removeProtocolFromWebsite = (website: string) => {
  return website.replace(/(^\w+:|^)\/\//, "");
};

Startup();

function Startup() {
  document.addEventListener("DOMContentLoaded", function () {
    let addBlockedButton: HTMLElement | null = document.getElementById(BLOCKED_STORE.buttonId);
    let addLuckyButton: HTMLElement | null = document.getElementById(LUCKY_STORE.buttonId);

    if (!addBlockedButton) {
      console.error("Add blocked button is null");
      return;
    }
    if (!addLuckyButton) {
      console.error("Add lucky button is null");
      return;
    }

    addBlockedButton.addEventListener("click", () => addInputToChromeStore(BLOCKED_STORE));
    addLuckyButton.addEventListener("click", () => addInputToChromeStore(LUCKY_STORE));
    updateLists();
  });
}

const addInputToChromeStore = (store: ListStore) => {
  let input: HTMLInputElement = document.getElementById(store.inputId) as HTMLInputElement;
  let inputValue = input?.value;
  if (!inputValue) {
    console.error("Input " + store.inputId + " is null");
    return;
  }

  inputValue = removeProtocolFromWebsite(inputValue);

  console.log("Adding " + inputValue + " to " + store.storeName);
  console.log("Store: " + JSON.stringify(store, null, 4));
  console.log("Store name: " + store.storeName);

  chrome.storage.sync.get(store.storeName).then((oldSites) => {
    let newList: string[];

    console.log("Old sites: " + JSON.stringify(oldSites, null, 4));

    if (isEmpty(oldSites)) {
      newList = [inputValue];
    } else {
      newList = [...oldSites[store.storeName], inputValue];
    }

    chrome.storage.sync.set({ [store.storeName]: newList }, () => {
      updateLists();
    });
  });
};

const updateLists = () => {
  chrome.storage.sync.get(BLOCKED_STORE.storeName).then((blockedSites) => {
    createListRepresentation(blockedSites[BLOCKED_STORE.storeName], BLOCKED_STORE);
  });

  chrome.storage.sync.get(LUCKY_STORE.storeName).then((luckySites) => {
    createListRepresentation(luckySites[LUCKY_STORE.storeName], LUCKY_STORE);
  });
};

const removeFromChromeStore = (itemToRemove: string, store: ListStore) => {
  console.log("Removing " + itemToRemove + " from " + store.storeName);

  chrome.storage.sync.get(store.storeName).then((oldSites) => {
    let newList = [...oldSites[store.storeName].filter((x: string) => x !== itemToRemove)];
    chrome.storage.sync.set({ [store.storeName]: newList }, () => {
      updateLists();
    });
  });
};

const createListRepresentation = (list: string[], store: ListStore) => {
  let listContainer: HTMLElement | null = document.getElementById(store.listId);
  if (!listContainer) {
    console.error("List container is null with id: " + store.listId);
    return;
  }
  listContainer.innerHTML = "";
  let listDiv = document.createElement("div");

  if (!list) {
    list = [];
  }

  list.forEach(function (listItem) {
    let htmlListItem: HTMLElement = document.createElement("p");
    htmlListItem.className = store.className;
    htmlListItem.addEventListener("click", function () {
      removeFromChromeStore(listItem, store);
    });

    htmlListItem.textContent = listItem;
    listDiv.appendChild(htmlListItem);
  });
  listContainer.appendChild(listDiv);
};

const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

// const addBlocked = () => {
//   addFromInputToChromeStore(BLOCKED_STORE, unblockSite);
// };

// // const addLucky = () => {
// //   addFromInputToChromeStore(LUCKY_STORE.inputId, LUCKY_STORE.listId, LUCKY_STORE.className, LUCKY_STORE.storeName, removeLuckySite);
// // };

// const removeFromChromeStore = (itemToRemove: string, store: ListStore, removeFunction: (itemToRemove: string) => void) => {
//   console.log("Removing " + itemToRemove + " from " + store.storeName);

//   chrome.storage.sync.get(store.storeName).then((oldSites) => {
//     console.log("Old sites: " + console.log(JSON.stringify(oldSites, null, 4)));
//     let newList = [...oldSites[store.storeName].filter((x: string) => x !== itemToRemove)];
//     chrome.storage.sync.set({ [store.storeName]: newList }, () => {
//       createListRepresentation(newList, store.listContainerId, store.className, removeFunction);
//     });
//   });
// };

// const addFromInputToChromeStore = (store: ListStore, removeFunction: (itemToRemove: string) => void) => {
//   let input: HTMLInputElement = document.getElementById(store.inputId) as HTMLInputElement;
//   let inputValue = input?.value;
//   if (!inputValue) {
//     console.error("Input " + store.inputId + " is null");
//     return;
//   }

//   inputValue = removeProtocolFromWebsite(inputValue);

//   console.log("Adding " + inputValue + " to " + store.storeName);

//   chrome.storage.sync.get(store.storeName).then((oldSites) => {
//     let newList: string[];

//     if (isEmpty(oldSites)) {
//       newList = [inputValue];
//     } else {
//       newList = [...oldSites[store.storeName], inputValue];
//     }
//     chrome.storage.sync.set({ [store.storeName]: newList }, () => {
//       createListRepresentation(newList, store.listId, store.className, removeFunction);
//     });
//   });
// };

// const unblockSite = (websiteToUnblock: string) => {
//   removeFromChromeStore(websiteToUnblock, BLOCKED_STORE, unblockSite);
// };

// // const removeLuckySite = (luckySiteToRemove: string) => {
// //   removeFromChromeStore(luckySiteToRemove, LUCKY_STORE, removeLuckySite);
// // };

// // const createListOfBlockedSites = (blockedSites: string[]) => {
// //   createListRepresentation(blockedSites, BLOCKED_STORE.listContainerId, BLOCKED_STORE.className, unblockSite);
// // };

// // const createListOfLuckySites = (luckySites: string[]) => {
// //   createListRepresentation(luckySites, LUCKY_STORE.listContainerId, LUCKY_STORE.className, removeLuckySite);
// // };

// // const createRemoveIcon = () => {
// //   var removeIcon = document.createElement("img");
// //   removeIcon.src = "icons8-close.svg";
// //   removeIcon.alt = "Remove";
// //   removeIcon.width = 20;
// //   removeIcon.height = 20;
// //   removeIcon.style.cursor = "pointer";
// //   return removeIcon;
// // };

// // const addToChromeStore = (item: string, store: ListStore, removeFunction: (itemToRemove: string) => void) => {
// //   chrome.storage.sync.get(store).then((oldSites) => {
// //     let newList = [...oldSites[store.storeName], item];
// //     chrome.storage.sync.set({ [store.storeName]: newList }, () => {
// //       createListRepresentation(newList, store.listContainerId, store.className, removeFunction);
// //     });
// //   });
// // };
