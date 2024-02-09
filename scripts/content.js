chrome.storage.sync.get('sitesToRedirect').then((sitesToRedirect) => {
  let condition = sitesToRedirect.sitesToRedirect.includes(window.location.href) 
                  || sitesToRedirect.sitesToRedirect.includes(window.location.origin)
                  || sitesToRedirect.sitesToRedirect.includes(window.location.host);
  if (condition) {
    window.location = 'https://www.duolingo.com/learn'
  }
})
