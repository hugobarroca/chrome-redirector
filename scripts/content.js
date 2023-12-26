window.addEventListener("yt-navigate-finish", (e) => {
  console.log("Youtube URL changed", e);
  window.location = "https://www.duolingo.com/learn";
});

window.location = "https://www.duolingo.com/learn";
