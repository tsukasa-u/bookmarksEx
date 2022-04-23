
chrome.runtime.onInstalled.addListener(async () => {
  let url = chrome.runtime.getURL("hello.html");
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);

  id = 'e378e3e186b3d39372e5bdde754b68aa1451b75e2a45a10620dc731d3c8411fd';
  title = 'test';
  body = 'text array consol bytes text array';
  var max_num = 2;

  var myRequest = new Request(
    'https://labs.goo.ne.jp/api/keyword',
    {
      method: 'POST',
      Headers: new Headers({
        'Content-type': 'application/json'
      }),

      body: new Blob([JSON.stringify({
        'app_id':id,
        'title':title,
        'body':body,
        'max_num':max_num
      })],
      {
        type : 'application/json'
      })
    });
    console.log(myRequest);

    fetch(myRequest).then(function(response) {
      // console.log("!1");
      // console.log(response);
      return response.json();
    }).then(function(data) {
      // console.log("!2");
      console.log(data);
      return data.keywords;
    }).then(function(data) {
      console.log(typeof data);
    }).catch(console.error);

    // keyword_list.forEach(function(value) {
    //   console.log([value.key, value.value]);
    // })

});
