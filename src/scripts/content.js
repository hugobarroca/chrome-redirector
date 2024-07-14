chrome.storage.sync.get(["blockedSites", "disabled"]).then((data) => {
  const { blockedSites, disabled } = data;
  const shouldRedirect = !disabled && [window.location.href, window.location.origin, window.location.host].some((url) => blockedSites.includes(url));
  if (shouldRedirect) {
    window.location = "https://www.duolingo.com/learn";
  }
});
