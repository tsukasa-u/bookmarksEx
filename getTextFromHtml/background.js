
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);

  fetch("https://github.co.jp/").then(function(response) {
    // console.log(response);
    return response.text()
  }).then(function(text) {
    return text.match(/<[^>]*>|[^<>]+/g).filter(element=> element.indexOf("\n")<0);
  }).then(function(texts) {
    var flag = false;
    return texts.reduce(function (accumulator, currentValue, currentIndex, array) {
      if (flag) {
        if (currentValue.match(/<([^\S]|\n)*\/([^\S]|\n)*script([^\S]|\n)*.*?>/)!=null) flag = false;
        return accumulator;
      } else {
        if (currentValue.match(/<([^\S]|\n)*script([^\S]|\n)*.*?>/)!=null) flag = true;
        return accumulator + (null==currentValue.match(/<(".*?"|'.*?'|[^'"])*?>/) ? " " + currentValue : "");
      }
    }, "");
  }).then(function(text) {
    console.log(text);
  }).catch(console.error);

});
