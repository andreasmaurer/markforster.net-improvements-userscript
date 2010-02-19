// ==UserScript==
// @name           markforster.net improvements
// @namespace      http://andreashofmann.net/
// @description    Adds missing features and remedies annoyances
// @include        http://www.markforster.net/*
// ==/UserScript==

var isEscBlocked, isOpenInNewWindow, isJumpToLastPage, isJumpToBottom;

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
