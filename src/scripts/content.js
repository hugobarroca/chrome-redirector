console.log("Content script loaded");
chrome.storage.sync.get(["blockedSites", "luckySites", "disabled"]).then((data) => {
  const { blockedSites, luckySites, disabled } = data;
  const shouldRedirect = !disabled && [window.location.href, window.location.origin, window.location.host].some((url) => blockedSites.includes(url));
  if (shouldRedirect) {
    let siteToRedirect = luckySites[Math.floor(Math.random() * luckySites.length)];
    if (!siteToRedirect.startsWith("http://") && !siteToRedirect.startsWith("https://")) {
      siteToRedirect = "https://" + siteToRedirect; // Default to https if no scheme is present
    }
    window.location = siteToRedirect;
  }
});
