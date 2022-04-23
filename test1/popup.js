let listURLAndTitle = [];
let listURL = [];
let listTitle = [];
let N = 10;
//let listing = '';

function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
  });
}
  
function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  for (var i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }
  
  return list;
  }
  
function dumpNode(bookmarkNode, query) {

  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title.toLowerCase()).indexOf(query.toLowerCase()) == -1) {
        return $('<span></span>');
      }
    }

    if (bookmarkNode.url != undefined) {
      listURLAndTitle.push([bookmarkNode.title, bookmarkNode.url]);
      listURL.push([bookmarkNode.url]);
      listTitle.push([bookmarkNode.title]);
      //listing.append(bookmarkNode.title);
      //listURLAndTitle.push([bookmarkNode.url]);
    }



    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);
    anchor.click(function () {
      chrome.tabs.create({ url: bookmarkNode.url });
    });
    var span = $('<span>');
    span.hover(function () {
    },
    ).
    append(anchor);
    }
  
       
  
    var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
    //var li = $(bookmarkNode.url ? '<li>' : '<div>').append(span);
    if (bookmarkNode.children && bookmarkNode.children.length > 0) {
      li.append(dumpTreeNodes(bookmarkNode.children, query));
    }
  
    return li;
  }
  

  document.addEventListener('DOMContentLoaded', function () {
    dumpBookmarks();
    // getKeywordFromURL();
  })



function getKeywordFromURL() {
  id = 'e378e3e186b3d39372e5bdde754b68aa1451b75e2a45a10620dc731d3c8411fd';
  title = 'bookmarks';
  body = '';

  for (var element in listTitle) {
    body = body + ' ' + listTitle[element];
  }
  

  var max_num = 10;

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

    fetch(myRequest).then(function(response) {
      return response.json();
    }).then(function(data) {
      return data.keywords;
    }).then(function(data) {
      return data.map(element=>Object.keys(element));
    }).then(function(data) {
      return data.map(element=>element[0]);
    }).then(function(data) {
      _categorizing(data, listURL, listTitle);
    }).catch(console.error);
}
  
function _categorizing (data, listURL, listTitle){
  data.push('その他');
  var flag = new Array(listTitle.length).fill(0);
  var ul1 = $('<ul>');
  for (var i = 0; i < data.length; i++){
    var li1 = $('<li>')
      .append($('<span>').append(
        $('<a>')
          .text(data[i])
      ));
      var ul2 = $('<ul>');
      for (j = 0; j < listTitle.length; j++){
        if (j<listTitle.length-1) {
          if (String(listTitle[j]).indexOf(data[i]) != -1) {
            flag[j] = 1;
            var li2 = $('<li>')
            .append($('<span>').append(
              $('<a>')
                .attr('href', listURL[j])
                .text(listTitle[j])
                .click(function () {
                  chrome.tabs.create({ url: listURL[j] });
                })
            ));
            ul2.append(li2);
            if(j==0) ul2.append($('<div>'));
          }
        } else {
          if (flag==0) {
            var li2 = $('<li>')
            .append($('<span>').append(
              $('<a>')
                .attr('href', listURL[j])
                .text(listTitle[j])
                .click(function () {
                  chrome.tabs.create({ url: listURL[j] });
                })
            ));
            ul2.append(li2);
          }
        }
      }
    ul1.append(li1.append(ul2));
  }
  $('#bookmarks').children().remove();
  $('#bookmarks').append(ul1);
}

document.getElementById('change').addEventListener('click', getKeywordFromURL);