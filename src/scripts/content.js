chrome.storage.sync.get(["sitesToRedirect", "disabled"]).then((data) => {
  const { sitesToRedirect, disabled } = data;
  const shouldRedirect =
    !disabled &&
    [window.location.href, window.location.origin, window.location.host].some(
      (url) => sitesToRedirect.includes(url)
    );
  if (shouldRedirect) {
    window.location = "https://www.duolingo.com/learn";
  }
});
