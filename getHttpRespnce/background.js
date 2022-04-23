
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);

  fetch("https://github.co.jp/").then(function(response) {
    console.log(response);
    return response.text()
  }).then(function(text) {
    console.log(text);
  }).catch(console.error);

});
