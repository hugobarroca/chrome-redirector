# Easy Redirector [![Build Status](https://dev.azure.com/hugobarroca98/Study%20for%20AZ-400/_apis/build/status%2Fhugobarroca.chrome-redirector?branchName=main)](https://dev.azure.com/hugobarroca98/Study%20for%20AZ-400/_build/latest?definitionId=1&branchName=main)

Easy Redirector is a Chrome extension designed to boost productivity by redirecting users away from time-wasting websites. It leverages Chrome's extension capabilities to provide a seamless and customizable experience for managing your focus and productivity.

## Features

- **Website Redirection:** Automatically redirects you from blacklisted websites to a more productive site of your choice.
- **Customizable Options:** Through the [options page](options/options.html), users can easily add or remove websites from the redirection list.
- **Visual Feedback:** A popup UI ([popup.html](popup/popup.html)) provides quick access to the extension's features and settings.
- **Content Scripting:** Utilizes content scripts ([content.js](scripts/content.js)) to detect and redirect web page requests in real-time.

## Getting Started

To get started with Scald's Redirector, clone this repository to your local machine.

```sh
git clone https://github.com/hugobarroca/chrome-redirector.git
```

After you have a local copy of the code, make sure you have npm installed. You can install all the required dependencies with
```
npm install
```
 To test the extension locally, you can run 
 ```
npm run build
```
This will compile all the necessary files in the **dist** directory, and you can load it directly into chrome from the chrome://extensions screen.

Buy me a coffee ☕ https://ko-fi.com/scald
