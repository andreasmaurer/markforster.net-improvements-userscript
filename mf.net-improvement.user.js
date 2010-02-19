// ==UserScript==
// @name           markforster.net improvements
// @namespace      http://andreashofmann.net/
// @description    Adds missing features and remedies annoyances
// @include        http://www.markforster.net/*
// ==/UserScript==

var isEscBlocked, isOpenInNewWindow, isJumpToLastPage, isJumpToBottom, isHighlightNewPosts;
var changes, lastChecked, lastReplies, lastTopic, tempReplies, tempTopic, first, count, rows, cells, i, j, debug;                                                      

debug = 0;

loadSettings();
createMenu();

if (isEscBlocked == '1') {
  blockEsc();
}

if (document.location == 'http://www.markforster.net/forum' || document.location == 'http://www.markforster.net/forum/') {
  if (isOpenInNewWindow == '1'
  || isJumpToLastPage == '1'
  || isJumpToBottom == '1') {
    modifyLinks();
  }
  if (isHighlightNewPosts == '1') {
    highlightNewTopics();
  }
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
                    + '<br /><b>General</b><br />'
                    + '<input type="checkbox"'
                    + (isEscBlocked == '1' ? ' checked="checked"' : '')
                    + ' id="checkEscBlocked" /> '
                    + '<label for="checkEscBlocked">Block Esc Key Login</label>'
                    + '<p style="font-size:10px;margin-top:5px;">'
                    + 'Copyright &copy; 2010 <a href="http://andreashofmann.info/">Andreas Hofmann</a>'
                    + '</p>'
                    + '</div></div></div></div></div></div></div></div>';
  sidebar1.appendChild(menuBox);
  var checkbox = document.getElementById('checkEscBlocked');
  checkbox.addEventListener('click', toggleEscBlocked, false);
  var checkbox = document.getElementById('checkJumpToLastPage');
  checkbox.addEventListener('click', toggleJumpToLastPage, false);
  var checkbox = document.getElementById('checkJumpToBottom');
  checkbox.addEventListener('click', toggleJumpToBottom, false);
  var checkbox = document.getElementById('checkOpenInNewWindow');
  checkbox.addEventListener('click', toggleOpenInNewWindow, false);
  var checkbox = document.getElementById('checkHighlightNewPosts');
  checkbox.addEventListener('click', toggleHighlightNewPosts, false);
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
  day = parts[1].substring(0, parts[1].length-1);  
  date += day * 10000;
  if (debug) alert(parts[1] + " -> " + date);
  year = parts[2];
  date += year * 100000000;
  if (debug) alert(parts[2] + " -> " + date);
  var time =  parts[4].split(":");
  date += time[0] * 100;
  if (debug) alert(parts[4] + " -> " + date);
 
  date += time[1] *1;
  if (debug) alert(parts[4] + " -> " + date);
  return date;
}

function loadSetting(setting) {
  if (typeof GM_getValue == 'function') {
    // Greasemonkey-compatible, storing data without cookies
    return GM_getValue(setting, '');
  } else {
    // Script is not running in Greasemonkey storing data with cookies
    return getCookie(setting);
  }
}

function saveSetting(setting, value) {
  if (typeof GM_getValue == 'function') {
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
}

function highlightNewTopics() {
  changes = 0;
  
  count = 0;
  rows = document.getElementsByTagName('tr');
  
  for (var i = 0; i < rows.length; i++)
  { 
    if (debug) alert("i: " + i);
    count += 1;
    if (count == 1) continue;
    if (debug) alert("Schleifendurchgang " + count);
  
    cells = rows[i].getElementsByTagName('td');
    for (var j = 0; j < cells.length; j++)
    {
      if (count == 2)
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
            tempChecked = cells[j].childNodes[1].innerHTML;
  
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


/* http://www.w3schools.com/jS/js_cookies.asp */
function setCookie(c_name,value,expiredays) {
  var exdate=new Date();
  exdate.setDate(exdate.getDate()+expiredays);
  document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";path=/;expires="+exdate.toGMTString());
}

/* http://www.w3schools.com/jS/js_cookies.asp */
function getCookie(c_name) {
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
