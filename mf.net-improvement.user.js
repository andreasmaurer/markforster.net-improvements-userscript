// ==UserScript==
// @name           markforster.net improvements
// @namespace      http://andreashofmann.net/
// @description    Adds missing features and remedies annoyances
// @include        http://www.markforster.net/*
// ==/UserScript==

createMenu();

function createMenu() {
  var sidebar1 = document.getElementById("sidebar1");
  menuBox = document.createElement('div');
  menuBox.setAttribute("class", "sectionWrapper");
  menuBox.innerHTML = '<div class="iw-s1"><div class="iw-s2">'
                    + '<div class="iw-s3"><div class="iw-s4">'
                    + '<div class="section">'
                    + '<div class="caption">Options</div>'
                    + '<div class="content-passthrough">'
                    + '<div class="widget-wrapper  widget-type-page">'
                    + '</div></div></div></div></div></div></div></div>';
  sidebar1.appendChild(menuBox);
}