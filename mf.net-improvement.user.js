// ==UserScript==
// @name           markforster.net improvements
// @namespace      http://andreashofmann.net/
// @description    Adds missing features and remedies annoyances
// @include        http://www.markforster.net/*
// ==/UserScript==

var isEscBlocked;

loadSettings();
createMenu();

if (isEscBlocked == '1') BlockEsc();

function loadSettings() {
  isEscBlocked = loadSetting('isEscBlocked');
  if (isEscBlocked === '') {
    isEscBlocked = 1;
    saveSetting('isEscBlocked', isEscBlocked);
  }
}

function createMenu() {
  var sidebar1 = document.getElementById('sidebar1');
  var menuBox = document.createElement('div');
  menuBox.setAttribute('class', 'sectionWrapper');
  menuBox.innerHTML = '<div class="iw-s1"><div class="iw-s2">'
                    + '<div class="iw-s3"><div class="iw-s4">'
                    + '<div class="section">'
                    + '<div class="caption">Options</div>'
                    + '<div class="content-passthrough">'
                    + '<div id="imp" class="widget-wrapper widget-type-page">'
                    + '<input type="checkbox"'
                    + (isEscBlocked == '1' ? ' checked="checked"' : '')
                    + ' id="checkEscBlocked" /> '
                    + '<label for="checkEscBlocked">Block Esc Key Login</label>'
                    + '</div></div></div></div></div></div></div></div>';
  sidebar1.appendChild(menuBox);
  var checkbox = document.getElementById('checkEscBlocked');
  checkbox.addEventListener('click', toggleEscBlocked, false);
}

function loadSetting(setting) {
  if (GM_getValue) {
    // Script is running in Greasemonkey, storing data without cookies
    return GM_getValue(setting, '');
  } else {
    // Script is not running in Greasemonkey storing data with cookies
    return getCookie(setting);
  }
}

function saveSetting(setting, value) {
  if (GM_getValue) {
    // Script is running in Greasemonkey, storing data without cookies
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
    BlockEsc();
  } else {
    UnblockEsc();
  }
}

function BlockEsc() {
  window.addEventListener('keyup', keyHandler, true);
}

function UnblockEsc() {
  window.removeEventListener('keyup', keyHandler, true);
}

function keyHandler(event) {
  if (event.keyCode == 27) {  
    event.stopPropagation();
    return true; 
  }
  return false;
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
