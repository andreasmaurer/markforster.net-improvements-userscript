// ==UserScript==
// @name           markforster.net improvements
// @namespace      http://andreashofmann.net/
// @description    Adds missing features and remedies annoyances
// @version        2.0.4
// @include        http://www.markforster.net/*
// @include        http://markforster.squarespace.com/*
// ==/UserScript==

var isEscBlocked, isOpenInNewWindow, isJumpToLastPage, isJumpToBottom, isHighlightNewPosts, commentPosts = [], previousChecked;
var changes, lastChecked, lastReplies, lastTopic, tempReplies, tempTopic, first, count, rows, cells, i, j, debug, isHighlightMark, isHighlightNorman, isShowOnlyNorman, isNormanInBlack, isCompactPostsBox, isRemoveRedundantComments, isCompactCommentsBox;

debug = 0;

loadSettings();
createMenu();

if (isEscBlocked == '1') {
  blockEsc();
}

if (document.location.pathname == '/forum' || document.location.pathname == '/forum/') {
  if (isOpenInNewWindow == '1'
  || isJumpToLastPage == '1'
  || isJumpToBottom == '1') {
    modifyLinks();
  }
  if (isHighlightNewPosts == '1') {
    highlightNewTopics();
  }
}

if (document.location.pathname.indexOf('/forum/post') != -1) {
  if (isHighlightNewPosts == '1' || isHighlightMark == '1' || isHighlightNorman == '1' || isShowOnlyNorman == '1' || isNormanInBlack == '1') {
    highlightPosts();
  }
}

if (isCompactPostsBox == '1') {
  modifyPostsBox();
}

if (isRemoveRedundantComments == '1' || isCompactCommentsBox == '1') {
  modifyCommentsBox();
}


function loadSettings() {
  isEscBlocked = loadSetting('isEscBlocked');
  if (isEscBlocked === '') {
    isEscBlocked = 1;
    saveSetting('isEscBlocked', isEscBlocked);
  }
  isOpenInNewWindow = loadSetting('isOpenInNewWindow');
  if (isOpenInNewWindow === '') {
    isOpenInNewWindow = 0;
    saveSetting('isOpenInNewWindow', isOpenInNewWindow);
  }
  isJumpToLastPage = loadSetting('isJumpToLastPage');
  if (isJumpToLastPage === '') {
    isJumpToLastPage = 1;
    saveSetting('isJumpToLastPage', isJumpToLastPage);
  }
  isJumpToBottom = loadSetting('isJumpToBottom');
  if (isJumpToBottom === '') {
    isJumpToBottom = 1;
    saveSetting('isJumpToBottom', isJumpToBottom);
  }
  isHighlightNewPosts = loadSetting('isHighlightNewPosts');
  if (isHighlightNewPosts === '') {
    isHighlightNewPosts = 1;
    saveSetting('isHighlightNewPosts', isHighlightNewPosts);
  }
  lastChecked = loadSetting("lastCheckedForum");
  if (lastChecked === '') {
    lastChecked = getCookie("lastCheckedForum");
  }
  lastReplies = loadSetting("lastRepliesForum");
  if (lastReplies === '') {
    lastReplies = getCookie("lastRepliesForum");
  }
  previousChecked = loadSetting("previousCheckedForum");
  if (previousChecked === '') {
    previousChecked = getCookie("previousCheckedForum");
  }
  isHighlightMark = loadSetting('isHighlightMark');
  if (isHighlightMark === '') {
    isHighlightMark = 0;
    saveSetting('isHighlightMark', isHighlightMark);
  }
  isHighlightNorman = loadSetting('isHighlightNorman');
  if (isHighlightNorman === '') {
    isHighlightNorman = 0;
    saveSetting('isHighlightNorman', isHighlightNorman);
  }
  isShowOnlyNorman = loadSetting('isShowOnlyNorman');
  if (isShowOnlyNorman === '') {
    isShowOnlyNorman = 0;
    saveSetting('isShowOnlyNorman', isShowOnlyNorman);
  }
  isNormanInBlack = loadSetting('isNormanInBlack');
  if (isNormanInBlack === '') {
    isNormanInBlack = 0;
    saveSetting('isNormanInBlack', isNormanInBlack);
  }
  isCompactPostsBox = loadSetting('isCompactPostsBox');
  if (isCompactPostsBox === '') {
    isCompactPostsBox = 1;
    saveSetting('isCompactPostsBox', isCompactPostsBox);
  }
  isRemoveRedundantComments = loadSetting('isRemoveRedundantComments');
  if (isRemoveRedundantComments === '') {
    isRemoveRedundantComments = 1;
    saveSetting('isRemoveRedundantComments', isRemoveRedundantComments);
  }
  isCompactCommentsBox = loadSetting('isCompactCommentsBox');
  if (isCompactCommentsBox === '') {
    isCompactCommentsBox = 1;
    saveSetting('isCompactCommentsBox', isCompactCommentsBox);
  }
}

function createMenu() {
  var sidebar1 = document.getElementById('sidebar1');
  var menuBox = document.createElement('div');
  menuBox.setAttribute('class', 'sectionWrapper');
  menuBox.innerHTML = '<div class="iw-s1"><div class="iw-s2">'
                    + '<div class="iw-s3"><div class="iw-s4">'
                    + '<div class="section">'
                    + '<div class="caption">Userscript Options</div>'
                    + '<div class="content-passthrough">'
                    + '<div id="imp" class="widget-wrapper widget-type-page">'
                    + '<b>Forum</b><br />'
                    + '<input type="checkbox"'
                    + (isHighlightNewPosts == '1' ? ' checked="checked"' : '')
                    + ' id="checkHighlightNewPosts" /> '
                    + '<label for="checkHighlightNewPosts">Highlight New Topics/Posts</label>'
                    + '<br /><input type="checkbox"'
                    + (isHighlightMark == '1' ? ' checked="checked"' : '')
                    + ' id="checkHighlightMark" /> '
                    + '<label for="checkHighlightMark">Highlight Mark&#39;s Posts</label>'
                    + '<br /><input type="checkbox"'
                    + (isJumpToLastPage == '1' ? ' checked="checked"' : '')
                    + ' id="checkJumpToLastPage" /> '
                    + '<label for="checkJumpToLastPage">Open Topic: Go to Last Page</label>'
                    + '<br /><input type="checkbox"'
                    + (isJumpToBottom == '1' ? ' checked="checked"' : '')
                    + ' id="checkJumpToBottom" /> '
                    + '<label for="checkJumpToBottom">Open Topic: Jump to Bottom</label>'
                    + '<br /><input type="checkbox"'
                    + (isOpenInNewWindow == '1' ? ' checked="checked"' : '')
                    + ' id="checkOpenInNewWindow" /> '
                    + '<label for="checkOpenInNewWindow">Open Topic: New Tab/Window</label>'
                    + '<br /><b>Sidebar (Reload to Apply)</b>'
                    + '<br /><input type="checkbox"'
                    + (isCompactPostsBox == '1' ? ' checked="checked"' : '')
                    + ' id="checkCompactPostsBox" /> '
                    + '<label for="checkCompactPostsBox">Compact Posts</label>'
                    + '<br /><input type="checkbox"'
                    + (isCompactCommentsBox == '1' ? ' checked="checked"' : '')
                    + ' id="checkCompactCommentsBox" /> '
                    + '<label for="checkCompactCommentsBox">Compact Comments</label>'
                    + '<br /><input type="checkbox"'
                    + (isRemoveRedundantComments == '1' ? ' checked="checked"' : '')
                    + ' id="checkRemoveRedundantComments" /> '
                    + '<label for="checkRemoveRedundantComments">No Redundant Comments</label>'
                    + '<br /><b>General</b><br />'
                    + '<input type="checkbox"'
                    + (isEscBlocked == '1' ? ' checked="checked"' : '')
                    + ' id="checkEscBlocked" /> '
                    + '<label for="checkEscBlocked">Block Esc Key Login</label>'
                    + '<br /><b>Best Sense</b>'
                    + '<br /><input type="checkbox"'
                    + (isHighlightNorman == '1' ? ' checked="checked"' : '')
                    + ' id="checkHighlightNorman" /> '
                    + '<label for="checkHighlightNorman">Highlight Norman&#39;s Posts</label>'
                    + '<br /><input type="checkbox"'
                    + (isShowOnlyNorman == '1' ? ' checked="checked"' : '')
                    + ' id="checkShowOnlyNorman" /> '
                    + '<label for="checkShowOnlyNorman">Show Norman&#39;s Posts Only</label>'
                    + '<br /><input type="checkbox"'
                    + (isNormanInBlack == '1' ? ' checked="checked"' : '')
                    + ' id="checkNormanInBlack" /> '
                    + '<label for="checkNormanInBlack">Norman In Black</label>'
                    + '<p style="font-size:10px;margin-top:5px;">'
                    + 'Copyright &copy; 2010 <a href="http://andreashofmann.info/">Andreas Hofmann</a>'
                    + '</p>'
                    + '</div></div></div></div></div></div></div></div>';
  sidebar1.appendChild(menuBox);
  var checkbox = document.getElementById('checkEscBlocked');
  checkbox.addEventListener('click', toggleEscBlocked, false);
  checkbox = document.getElementById('checkJumpToLastPage');
  checkbox.addEventListener('click', toggleJumpToLastPage, false);
  checkbox = document.getElementById('checkJumpToBottom');
  checkbox.addEventListener('click', toggleJumpToBottom, false);
  checkbox = document.getElementById('checkOpenInNewWindow');
  checkbox.addEventListener('click', toggleOpenInNewWindow, false);
  checkbox = document.getElementById('checkHighlightNewPosts');
  checkbox.addEventListener('click', toggleHighlightNewPosts, false);
  checkbox = document.getElementById('checkHighlightMark');
  checkbox.addEventListener('click', toggleHighlightMark, false);
  checkbox = document.getElementById('checkHighlightNorman');
  checkbox.addEventListener('click', toggleHighlightNorman, false);
  checkbox = document.getElementById('checkShowOnlyNorman');
  checkbox.addEventListener('click', toggleShowOnlyNorman, false);
  checkbox = document.getElementById('checkNormanInBlack');
  checkbox.addEventListener('click', toggleNormanInBlack, false);
  checkbox = document.getElementById('checkCompactPostsBox');
  checkbox.addEventListener('click', toggleCompactPostsBox, false);
  checkbox = document.getElementById('checkRemoveRedundantComments');
  checkbox.addEventListener('click', toggleRemoveRedundantComments, false);
  checkbox = document.getElementById('checkCompactCommentsBox');
  checkbox.addEventListener('click', toggleCompactCommentsBox, false);
}

function isNewerTopic(lastCheck, currentChecked)
{
  var then, now;
  then = getNumericalDate(lastCheck);
  now = getNumericalDate(currentChecked);
  if (debug) alert (now + " > " + then + " ?");

  return now > then;
}

function getNumericalDate(dateString)
{
  var date = 0;
  var month = 0;
  var parts = dateString.split(" ");
  switch(parts[0]) {
  case "January":
    month = 1;
    break;
  case "February":
    month = 2;
    break;
  case "March":
    month = 3;
    break;
  case "April":
    month = 4;
    break;
  case "May":
    month = 5;
    break;
  case "June":
    month = 6;
    break;
  case "July":
    month = 7;
    break;
  case "August":
    month = 8;
    break;
  case "September":
    month = 9;
    break;
  case "October":
    month = 10;
    break;
  case "November":
    month = 11;
    break;
  case "December":
    month = 12;
    break;
  default:
    break;
}
  date += month * 1000000;
  if (debug) alert(parts[0] + " -> " + date);
  var day = parts[1].substring(0, parts[1].length-1);
  date += day * 10000;
  if (debug) alert(parts[1] + " -> " + date);
  var year = parts[2];
  date += year * 100000000;
  if (debug) alert(parts[2] + " -> " + date);
  var time = parts[4].split(":");
  date += time[0] * 100;
  if (debug) alert(parts[4] + " -> " + date);

  date += time[1] *1;
  if (debug) alert(parts[4] + " -> " + date);
  return date;
}

function loadSetting(setting) {
  if (typeof GM_getValue == 'function' && GM_getValue('test', true)) {
    // Greasemonkey-compatible, storing data without cookies
    return GM_getValue(setting, '');
  } else {
    // Script is not running in Greasemonkey storing data with cookies
    return getCookie(setting);
  }
}

function saveSetting(setting, value) {
  if (typeof GM_getValue == 'function' && GM_getValue('test', true)) {
    // Greasemonkey-compatible, storing data without cookies
    GM_setValue(setting, value);
  } else {
    // Script is not running in Greasemonkey storing data with cookies
    setCookie(setting, value, 356);
  }
}

function toggleEscBlocked() {
  var checkbox = document.getElementById('checkEscBlocked');
  isEscBlocked = checkbox.checked ? '1':'0'
  saveSetting('isEscBlocked', isEscBlocked);
  if (isEscBlocked == '1') {
    blockEsc();
  } else {
    unblockEsc();
  }
}

function blockEsc() {
  window.addEventListener('keyup', keyHandler, true);
}

function unblockEsc() {
  window.removeEventListener('keyup', keyHandler, true);
}

function keyHandler(event) {
  if (event.keyCode == 27) {
    event.stopPropagation();
    return true;
  }
  return false;
}

function toggleJumpToLastPage() {
  var checkbox = document.getElementById('checkJumpToLastPage');
  isJumpToLastPage = checkbox.checked ? '1':'0'
  saveSetting('isJumpToLastPage', isJumpToLastPage);
  modifyLinks();
}

function toggleJumpToBottom() {
  var checkbox = document.getElementById('checkJumpToBottom');
  isJumpToBottom = checkbox.checked ? '1':'0'
  saveSetting('isJumpToBottom', isJumpToBottom);
  modifyLinks();
}

function toggleOpenInNewWindow() {
  var checkbox = document.getElementById('checkOpenInNewWindow');
  isOpenInNewWindow = checkbox.checked ? '1':'0'
  saveSetting('isOpenInNewWindow', isOpenInNewWindow);
  modifyLinks();
}

function modifyLinks() {
  var topicLinks = document.evaluate("//a[contains(@href,'/forum/post/')]",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < topicLinks.snapshotLength; i++) {
    modifyLink(topicLinks.snapshotItem(i));
  }
}

function modifyLink(link) {
  var address = link.getAttribute('href');
  if (address.indexOf('?') != -1) {
    address = address.substring(0, address.indexOf('?'));
  }
  if (address.indexOf('#') != -1) {
    address = address.substring(0, address.indexOf('#'));
  }
  link.setAttribute('href', address
    + (isJumpToLastPage == '1' ? '?lastPage=true' : '')
    + (isJumpToBottom == '1' ? '#new-post-button' : ''));
  if (isOpenInNewWindow == '1') {
    link.setAttribute('target', '_blank');
  } else {
    link.removeAttribute('target');
  }
}

function toggleHighlightNewPosts() {
  var checkbox = document.getElementById('checkHighlightNewPosts');
  isHighlightNewPosts = checkbox.checked ? '1':'0'
  saveSetting('isHighlightNewPosts', isHighlightNewPosts);
  if (isHighlightNewPosts == '1') {
    highlightNewTopics();
  } else {
    unhighlightNewTopics();
  }
  highlightPosts();
}

function toggleHighlightMark() {
  var checkbox = document.getElementById('checkHighlightMark');
  isHighlightMark = checkbox.checked ? '1':'0'
  saveSetting('isHighlightMark', isHighlightMark);
  highlightPosts();
}

function toggleHighlightNorman() {
  var checkbox = document.getElementById('checkHighlightNorman');
  isHighlightNorman = checkbox.checked ? '1':'0'
  saveSetting('isHighlightNorman', isHighlightNorman);
  highlightPosts();
}

function toggleShowOnlyNorman() {
  var checkbox = document.getElementById('checkShowOnlyNorman');
  isShowOnlyNorman = checkbox.checked ? '1':'0'
  saveSetting('isShowOnlyNorman', isShowOnlyNorman);
  highlightPosts();
}

function toggleNormanInBlack() {
  var checkbox = document.getElementById('checkNormanInBlack');
  isNormanInBlack = checkbox.checked ? '1':'0'
  saveSetting('isNormanInBlack', isNormanInBlack);
  highlightPosts();
}

function toggleCompactPostsBox() {
  var checkbox = document.getElementById('checkCompactPostsBox');
  isCompactPostsBox = checkbox.checked ? '1':'0'
  saveSetting('isCompactPostsBox', isCompactPostsBox);
}

function toggleRemoveRedundantComments() {
  var checkbox = document.getElementById('checkRemoveRedundantComments');
  isRemoveRedundantComments = checkbox.checked ? '1':'0'
  saveSetting('isRemoveRedundantComments', isRemoveRedundantComments);
}

function toggleCompactCommentsBox() {
  var checkbox = document.getElementById('checkCompactCommentsBox');
  isCompactCommentsBox = checkbox.checked ? '1':'0'
  saveSetting('isCompactCommentsBox', isCompactCommentsBox);
}

function modifyCommentsBox() {
  var box = document.getElementById('moduleContent6087109');
  if (!box) return;
  var posts = box.getElementsByTagName('li');
  var first = 1;
  var length, index, j;
  for (var i = 0; i < posts.length; i++) {
    if (isCompactCommentsBox == '1' ) {
      if (first == 1) {
        posts[i].setAttribute('style', 'margin:0;padding:0 0 5px 0;');
        first = 0;
      } else {
        posts[i].setAttribute('style', 'margin:0;padding:5px 0;');
      }
      length = posts[i].childNodes.length;
      for (j = 1 ; j <= length ; j++) {
        index = length - j;
        if(posts[i].childNodes[index].nodeName != 'A') {
          posts[i].removeChild(posts[i].childNodes[index]);
        }
      }
    }
    if (isRemoveRedundantComments == '1' ) {
      length = posts[i].childNodes.length;
      for (j = 1 ; j <= length ; j++) {
        index = length - j;
        if(posts[i].childNodes[index].nodeName == 'A') {
          var title = posts[i].childNodes[index].innerHTML;
          if (commentPosts.indexOf(title) == -1) {
            commentPosts[commentPosts.length] = title;
          } else {
            posts[i].setAttribute('style', 'display:none');
          }
        }
      }
    }
  }
}

function modifyPostsBox() {
  var box = document.getElementById('moduleContent6069483');
  if (!box) return;
  var posts = box.getElementsByTagName('li');
  var first = 1;
  for (var i = 0; i < posts.length; i++)
  {
    if (isCompactPostsBox == '1' ) {
      if (first == 1) {
        posts[i].setAttribute('style', 'margin:0;padding:0 0 5px 0;');
        first = 0;
      } else {
        posts[i].setAttribute('style', 'margin:0;padding:5px 0;');
      }
      var length = posts[i].childNodes.length;
      for (var j = 1 ; j <= length ; j++) {
        var index = length - j;
        if(posts[i].childNodes[index].nodeName != 'A') {
          posts[i].removeChild(posts[i].childNodes[index]);
        }
      }
    }
  }
}

function highlightNewTopics() {
  if (document.getElementsByClassName('activePage')[0].innerText != '1') {
    return;
  }
  changes = 0;

  count = 0;
  rows = document.getElementsByClassName('discussion-table-row');

  for (var i = 0; i < rows.length; i++)
  {
    if (debug) alert("i: " + i);
    count += 1;
    if (debug) alert("Schleifendurchgang " + count);

    cells = rows[i].getElementsByTagName('td');
    for (var j = 0; j < cells.length; j++)
    {
      if (count == 1)
      {
        if ((cells[j].getAttribute("class") == "replycount-cell"
        && lastReplies != cells[j].innerHTML)) {
          tempReplies = cells[j].innerHTML;
          if (debug) alert(tempReplies + " != " + lastReplies);
        }
        if (cells[j].getAttribute("class") == "updated-cell") {
          if (debug) alert ("updated cell");
          if (!tempReplies && lastChecked == cells[j].childNodes[1].innerHTML) {
            if (debug) alert("No changes!");
            break;
          } else {
            if (debug && !tempReplies) alert(lastChecked + "!= " + cells[j].childNodes[1].innerHTML);
            changes = 1;
            var tempChecked = cells[j].childNodes[1].innerHTML;

            if (tempReplies) saveSetting("lastRepliesForum", tempReplies);
            saveSetting("lastCheckedForum", tempChecked);
            saveSetting("previousCheckedForum", lastChecked);

          }
        }
      }

      if (debug) alert("changes: " + changes);
      if (cells[j].getAttribute("class") == "updated-cell")
      {
        if (isNewerTopic(lastChecked, cells[j].childNodes[1].innerHTML))
        {
          if (debug) alert ("Found newer topic!");
          rows[i].setAttribute("style","background-color:#FFA;");
        } else {
          if (debug) alert ("No more new topics!");
          changes = 0;
        }

      }
    }
  }
}

function unhighlightNewTopics() {
  count = 0;
  rows = document.getElementsByTagName('tr');

  for (var i = 0; i < rows.length; i++)
  {
    count += 1;
    if (count == 1) continue;
    rows[i].removeAttribute("style");
  }

}

function highlightPosts() {
  var divs = document.getElementById('content').getElementsByClassName('signature');
  var first = 1;
  var date, post;
  for (var i = 0; i < divs.length; i++) {
    date = divs[i].childNodes[0].nodeValue.trim();
    date = date.substr(0,date.length-2);
    if (isHighlightNewPosts == '1' && previousChecked != "" && isNewerTopic(previousChecked, date)) {
      post = divs[i].parentNode.parentNode;
      if (isHighlightMark == '1'
          && post.getAttribute("class").indexOf("authored-by-markforster") != -1) {
        post.getElementsByClassName('comment')[0].setAttribute("style","background-color:#AFA;");
      } else if (isHighlightNorman == '1'
                 && divs[i].innerHTML.indexOf("Norman U") != -1) {
        post.getElementsByClassName('comment')[0].setAttribute("style","background-color:#FAA;");
      } else {
        post.getElementsByClassName('comment')[0].setAttribute("style","background-color:#FFA;");
      }
      if (first) {
        first = 0;
        window.scrollTo(0, post.offsetTop);
      }
    } else {
      post = divs[i].parentNode.parentNode;
      if (isHighlightMark == '1'
          && post.getAttribute("class").indexOf("authored-by-markforster") != -1) {
        post.getElementsByClassName('comment')[0].setAttribute("style","background-color:#DDFFDD;");
      } else if (isHighlightNorman == '1'
                 && divs[i].innerHTML.indexOf("Norman U") != -1) {
        post.getElementsByClassName('comment')[0].setAttribute("style","background-color:#FFDDDD;");
      } else {
        post.getElementsByClassName('comment')[0].removeAttribute("style");
      }
    }
    if (isNormanInBlack == '1' && divs[i].innerHTML.indexOf("Norman U") != -1) {
      post.getElementsByClassName('comment')[0].setAttribute("style","background-color:#000;color:#000;");
    }
    if (isShowOnlyNorman == '1' && divs[i].innerHTML.indexOf("Norman U") == -1) {
      post.setAttribute("style","display:none;");
    }
  }
}

/* http://www.w3schools.com/jS/js_cookies.asp */
function setCookie(c_name,value,expiredays) {
  var exdate=new Date();
  exdate.setDate(exdate.getDate()+expiredays);
  document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";path=/;expires="+exdate.toGMTString());
}

/* http://www.w3schools.com/jS/js_cookies.asp */
function getCookie(c_name) {
  var c_start, c_end;
  if (document.cookie.length>0) {
    c_start=document.cookie.indexOf(c_name + "=");
    if (c_start!=-1) {
      c_start=c_start + c_name.length+1;
      c_end=document.cookie.indexOf(";",c_start);
      if (c_end==-1) c_end=document.cookie.length;
      return unescape(document.cookie.substring(c_start,c_end));
    }
  }
  return '';
}


