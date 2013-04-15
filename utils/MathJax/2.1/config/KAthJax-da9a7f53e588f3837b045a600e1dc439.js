MathJax.Hub.Config({
messageStyle: "none",
skipStartupTypeset: !0,
jax: [ "input/TeX", "output/HTML-CSS" ],
extensions: [ "tex2jax.js", "MathZoom.js" ],
TeX: {
extensions: [ "AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js", "newcommand.js", "boldsymbol.js" ],
Macros: {
RR: "\\mathbb{R}",
blue: "\\color{#6495ED}",
orange: "\\color{#FFA500}",
pink: "\\color{#FF00AF}",
red: "\\color{#DF0030}",
green: "\\color{#28AE7B}",
gray: "\\color{gray}",
purple: "\\color{#9D38BD}"
},
Augment: {
Definitions: {
macros: {
lrsplit: "LRSplit",
cancel: "Cancel",
lcm: [ "NamedOp", 0 ]
}
},
Parse: {
prototype: {
LRSplit: function(e) {
var t = this.GetArgument(e), n = this.GetArgument(e), r = MathJax.ElementJax.mml.mfrac(MathJax.InputJax.TeX.Parse("\\strut\\textstyle{" + t + "\\qquad}", this.stack.env).mml(), MathJax.InputJax.TeX.Parse("\\strut\\textstyle{\\qquad " + n + "}", this.stack.env).mml());
r.numalign = MathJax.ElementJax.mml.ALIGN.LEFT, r.denomalign = MathJax.ElementJax.mml.ALIGN.RIGHT, r.linethickness = "0em", this.Push(r);
},
Cancel: function(e) {
this.Push(MathJax.ElementJax.mml.menclose(this.ParseArg(e)).With({
notation: MathJax.ElementJax.mml.NOTATION.UPDIAGONALSTRIKE
}));
}
}
}
}
},
"HTML-CSS": {
scale: 100,
showMathMenu: !1,
availableFonts: [ "TeX" ],
imageFont: null
}
}), MathJax.Ajax.timeout = 6e4, MathJax.Ajax.loadError = function(e) {
return function(t) {
Khan.warnTimeout(), MathJax.Ajax.loadComplete = function(e) {}, e.call(this, t);
};
}(MathJax.Ajax.loadError), MathJax.Hub.Register.StartupHook("HTML-CSS Jax - disable web fonts", function() {
Khan.warnFont();
}), MathJax.Message.Init = function(e) {
return function(t) {
if (this.div && this.div.parentNode == null) {
var n = document.getElementById("MathJax_Message");
if (n && n.firstChild == null) {
var r = n.parentNode;
r && r.removeChild(n);
}
}
e.call(this, t);
};
}(MathJax.Message.Init), MathJax.Hub.Startup.onload(), MathJax.Ajax.Preloading("[MathJax]/extensions/MathEvents.js", "[MathJax]/extensions/MathMenu.js", "[MathJax]/extensions/MathZoom.js", "[MathJax]/extensions/TeX/AMSmath.js", "[MathJax]/extensions/TeX/AMSsymbols.js", "[MathJax]/extensions/TeX/noErrors.js", "[MathJax]/extensions/TeX/noUndefined.js", "[MathJax]/extensions/TeX/newcommand.js", "[MathJax]/extensions/TeX/boldsymbol.js", "[MathJax]/extensions/tex2jax.js", "[MathJax]/jax/element/mml/jax.js", "[MathJax]/jax/input/TeX/config.js", "[MathJax]/jax/input/TeX/jax.js", "[MathJax]/jax/output/HTML-CSS/config.js", "[MathJax]/jax/output/HTML-CSS/jax.js"), MathJax.Hub.Config({
"v1.0-compatible": !1
}), function(e, t, n, r, i, s) {
var o = "2.1", u = MathJax.Extension, a = u.MathEvents = {
version: o
}, f = e.config.menuSettings, l = {
hover: 500,
frame: {
x: 3.5,
y: 5,
bwidth: 1,
bcolor: "#A6D",
hwidth: "15px",
hcolor: "#83A"
},
button: {
x: -4,
y: -3,
wx: -2,
src: n.fileURL(i.imageDir + "/MenuArrow-15.png")
},
fadeinInc: .2,
fadeoutInc: .05,
fadeDelay: 50,
fadeoutStart: 400,
fadeoutDelay: 15e3,
styles: {
".MathJax_Hover_Frame": {
"border-radius": ".25em",
"-webkit-border-radius": ".25em",
"-moz-border-radius": ".25em",
"-khtml-border-radius": ".25em",
"box-shadow": "0px 0px 15px #83A",
"-webkit-box-shadow": "0px 0px 15px #83A",
"-moz-box-shadow": "0px 0px 15px #83A",
"-khtml-box-shadow": "0px 0px 15px #83A",
border: "1px solid #A6D ! important",
display: "inline-block",
position: "absolute"
},
".MathJax_Hover_Arrow": {
position: "absolute",
width: "15px",
height: "11px",
cursor: "pointer"
}
}
}, c = a.Event = {
LEFTBUTTON: 0,
RIGHTBUTTON: 2,
MENUKEY: "altKey",
Mousedown: function(e) {
return c.Handler(e, "Mousedown", this);
},
Mouseup: function(e) {
return c.Handler(e, "Mouseup", this);
},
Mousemove: function(e) {
return c.Handler(e, "Mousemove", this);
},
Mouseover: function(e) {
return c.Handler(e, "Mouseover", this);
},
Mouseout: function(e) {
return c.Handler(e, "Mouseout", this);
},
Click: function(e) {
return c.Handler(e, "Click", this);
},
DblClick: function(e) {
return c.Handler(e, "DblClick", this);
},
Menu: function(e) {
return c.Handler(e, "ContextMenu", this);
},
Handler: function(e, t, r) {
if (n.loadingMathMenu) return c.False(e);
var s = i[r.jaxID];
e || (e = window.event), e.isContextMenu = t === "ContextMenu";
if (s[t]) return s[t](e, r);
if (u.MathZoom) return u.MathZoom.HandleEvent(e, t, r);
},
False: function(e) {
return e || (e = window.event), e && (e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1), !1;
},
ContextMenu: function(t, o, u) {
var l = i[o.jaxID], p = l.getJaxFromMath(o), d = (l.config.showMathMenu != null ? l : e).config.showMathMenu;
if (!d || f.context !== "MathJax" && !u) return;
a.msieEventBug && (t = window.event || t), c.ClearSelection(), h.ClearHoverTimer(), p.hover && (p.hover.remove && (clearTimeout(p.hover.remove), delete p.hover.remove), p.hover.nofade = !0);
var v = MathJax.Menu;
if (v) {
v.jax = p;
var y = v.menu.Find("Show Math As").menu;
y.items[1].name = s[p.inputJax].sourceMenuTitle || "Original Form", y.items[0].hidden = p.inputJax === "Error";
var w = v.menu.Find("Math Settings", "MathPlayer");
return w.hidden = p.outputJax !== "NativeMML" || !e.Browser.hasMathPlayer, v.menu.Post(t);
}
if (!n.loadingMathMenu) {
n.loadingMathMenu = !0;
var E = {
pageX: t.pageX,
pageY: t.pageY,
clientX: t.clientX,
clientY: t.clientY
};
r.Queue(n.Require("[MathJax]/extensions/MathMenu.js"), function() {
delete n.loadingMathMenu, MathJax.Menu || (MathJax.Menu = {});
}, [ "ContextMenu", this, E, o, u ]);
}
return c.False(t);
},
AltContextMenu: function(t, n) {
var r = i[n.jaxID], s = (r.config.showMathMenu != null ? r : e).config.showMathMenu;
if (s) {
s = (r.config.showMathMenuMSIE != null ? r : e).config.showMathMenuMSIE;
if (f.context === "MathJax" && !f.mpContext && s) {
if (!a.noContextMenuBug || t.button !== c.RIGHTBUTTON) return;
} else if (!t[c.MENUKEY] || t.button !== c.LEFTBUTTON) return;
return r.ContextMenu(t, n, !0);
}
},
ClearSelection: function() {
a.safariContextMenuBug && setTimeout("window.getSelection().empty()", 0), document.selection && setTimeout("document.selection.empty()", 0);
},
getBBox: function(e) {
e.appendChild(a.topImg);
var t = a.topImg.offsetTop, n = e.offsetHeight - t, r = e.offsetWidth;
return e.removeChild(a.topImg), {
w: r,
h: t,
d: n
};
}
}, h = a.Hover = {
Mouseover: function(t, n) {
if (f.discoverable || f.zoom === "Hover") {
var r = t.fromElement || t.relatedTarget, i = t.toElement || t.target;
if (r && i && (r.isMathJax != i.isMathJax || e.getJaxFor(r) !== e.getJaxFor(i))) {
var s = this.getJaxFromMath(n);
return s.hover ? h.ReHover(s) : h.HoverTimer(s, n), c.False(t);
}
}
},
Mouseout: function(t, n) {
if (f.discoverable || f.zoom === "Hover") {
var r = t.fromElement || t.relatedTarget, i = t.toElement || t.target;
if (r && i && (r.isMathJax != i.isMathJax || e.getJaxFor(r) !== e.getJaxFor(i))) {
var s = this.getJaxFromMath(n);
return s.hover ? h.UnHover(s) : h.ClearHoverTimer(), c.False(t);
}
}
},
Mousemove: function(e, t) {
if (f.discoverable || f.zoom === "Hover") {
var n = this.getJaxFromMath(t);
if (n.hover) return;
if (h.lastX == e.clientX && h.lastY == e.clientY) return;
return h.lastX = e.clientX, h.lastY = e.clientY, h.HoverTimer(n, t), c.False(e);
}
},
HoverTimer: function(e, t) {
this.ClearHoverTimer(), this.hoverTimer = setTimeout(r([ "Hover", this, e, t ]), l.hover);
},
ClearHoverTimer: function() {
this.hoverTimer && (clearTimeout(this.hoverTimer), delete this.hoverTimer);
},
Hover: function(n, r) {
if (u.MathZoom && u.MathZoom.Hover({}, r)) return;
var s = i[n.outputJax], o = s.getHoverSpan(n, r), f = s.getHoverBBox(n, o, r), c = (s.config.showMathMenu != null ? s : e).config.showMathMenu, h = l.frame.x, p = l.frame.y, d = l.frame.bwidth;
a.msieBorderWidthBug && (d = 0), n.hover = {
opacity: 0,
id: n.inputID + "-Hover"
};
var v = t.Element("span", {
id: n.hover.id,
isMathJax: !0,
style: {
display: "inline-block",
width: 0,
height: 0,
position: "relative"
}
}, [ [ "span", {
className: "MathJax_Hover_Frame",
isMathJax: !0,
style: {
display: "inline-block",
position: "absolute",
top: this.Px(-f.h - p - d - (f.y || 0)),
left: this.Px(-h - d + (f.x || 0)),
width: this.Px(f.w + 2 * h),
height: this.Px(f.h + f.d + 2 * p),
opacity: 0,
filter: "alpha(opacity=0)"
}
} ] ]), m = t.Element("span", {
isMathJax: !0,
id: n.hover.id + "Menu",
style: {
display: "inline-block",
"z-index": 1,
width: 0,
height: 0,
position: "relative"
}
}, [ [ "img", {
className: "MathJax_Hover_Arrow",
isMathJax: !0,
math: r,
src: l.button.src,
onclick: this.HoverMenu,
jax: s.id,
style: {
left: this.Px(f.w + h + d + (f.x || 0) + l.button.x),
top: this.Px(-f.h - p - d - (f.y || 0) - l.button.y),
opacity: 0,
filter: "alpha(opacity=0)"
}
} ] ]);
f.width && (v.style.width = m.style.width = f.width, v.style.marginRight = m.style.marginRight = "-" + f.width, v.firstChild.style.width = f.width, m.firstChild.style.left = "", m.firstChild.style.right = this.Px(l.button.wx)), o.parentNode.insertBefore(v, o), c && o.parentNode.insertBefore(m, o), o.style && (o.style.position = "relative"), this.ReHover(n);
},
ReHover: function(e) {
e.hover.remove && clearTimeout(e.hover.remove), e.hover.remove = setTimeout(r([ "UnHover", this, e ]), l.fadeoutDelay), this.HoverFadeTimer(e, l.fadeinInc);
},
UnHover: function(e) {
e.hover.nofade || this.HoverFadeTimer(e, -l.fadeoutInc, l.fadeoutStart);
},
HoverFade: function(e) {
delete e.hover.timer, e.hover.opacity = Math.max(0, Math.min(1, e.hover.opacity + e.hover.inc)), e.hover.opacity = Math.floor(1e3 * e.hover.opacity) / 1e3;
var t = document.getElementById(e.hover.id), n = document.getElementById(e.hover.id + "Menu");
t.firstChild.style.opacity = e.hover.opacity, t.firstChild.style.filter = "alpha(opacity=" + Math.floor(100 * e.hover.opacity) + ")", n && (n.firstChild.style.opacity = e.hover.opacity, n.firstChild.style.filter = t.style.filter);
if (e.hover.opacity === 1) return;
if (e.hover.opacity > 0) {
this.HoverFadeTimer(e, e.hover.inc);
return;
}
t.parentNode.removeChild(t), n && n.parentNode.removeChild(n), e.hover.remove && clearTimeout(e.hover.remove), delete e.hover;
},
HoverFadeTimer: function(e, t, n) {
e.hover.inc = t, e.hover.timer || (e.hover.timer = setTimeout(r([ "HoverFade", this, e ]), n || l.fadeDelay));
},
HoverMenu: function(e) {
return e || (e = window.event), i[this.jax].ContextMenu(e, this.math, !0);
},
ClearHover: function(e) {
e.hover.remove && clearTimeout(e.hover.remove), e.hover.timer && clearTimeout(e.hover.timer), h.ClearHoverTimer(), delete e.hover;
},
Px: function(e) {
return Math.abs(e) < .006 ? "0px" : e.toFixed(2).replace(/\.?0+$/, "") + "px";
},
getImages: function() {
var e = new Image;
e.src = l.button.src;
}
}, p = a.Touch = {
last: 0,
delay: 500,
start: function(e) {
var t = (new Date).getTime(), n = t - p.last < p.delay && p.up;
p.last = t, p.up = !1, n && (p.timeout = setTimeout(p.menu, p.delay, e, this), e.preventDefault());
},
end: function(e) {
var t = (new Date).getTime();
p.up = t - p.last < p.delay;
if (p.timeout) return clearTimeout(p.timeout), delete p.timeout, p.last = 0, p.up = !1, e.preventDefault(), c.Handler(e.touches[0] || e.touch, "DblClick", this);
},
menu: function(e, t) {
return delete p.timeout, p.last = 0, p.up = !1, c.Handler(e.touches[0] || e.touch, "ContextMenu", t);
}
};
if (e.Browser.isMobile) {
var d = l.styles[".MathJax_Hover_Arrow"];
d.width = "25px", d.height = "18px", l.button.x = -6;
}
e.Browser.Select({
MSIE: function(e) {
var t = document.documentMode || 0, n = e.versionAtLeast("8.0");
a.msieBorderWidthBug = document.compatMode === "BackCompat", a.msieEventBug = e.isIE9, a.msieAlignBug = !n || t < 8, t < 9 && (c.LEFTBUTTON = 1);
},
Safari: function(e) {
a.safariContextMenuBug = !0;
},
Opera: function(e) {
a.operaPositionBug = !0;
},
Konqueror: function(e) {
a.noContextMenuBug = !0;
}
}), a.topImg = a.msieAlignBug ? t.Element("img", {
style: {
width: 0,
height: 0,
position: "relative"
},
src: "about:blank"
}) : t.Element("span", {
style: {
width: 0,
height: 0,
display: "inline-block"
}
}), a.operaPositionBug && (a.topImg.style.border = "1px solid"), a.config = l = e.CombineConfig("MathEvents", l);
var v = function() {
var e = l.styles[".MathJax_Hover_Frame"];
e.border = l.frame.bwidth + "px solid " + l.frame.bcolor + " ! important", e["box-shadow"] = e["-webkit-box-shadow"] = e["-moz-box-shadow"] = e["-khtml-box-shadow"] = "0px 0px " + l.frame.hwidth + " " + l.frame.hcolor;
};
r.Queue(e.Register.StartupHook("End Config", {}), [ v ], [ "getImages", h ], [ "Styles", n, l.styles ], [ "Post", e.Startup.signal, "MathEvents Ready" ], [ "loadComplete", n, "[MathJax]/extensions/MathEvents.js" ]);
}(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.OutputJax, MathJax.InputJax), function(e, t, n, r, i) {
var s = "2.1", o = MathJax.Callback.Signal("menu");
MathJax.Extension.MathMenu = {
version: s,
signal: o
};
var u = e.Browser.isPC, a = e.Browser.isMSIE, f = (document.documentMode || 0) > 8, l = u ? null : "5px", c = e.CombineConfig("MathMenu", {
delay: 150,
helpURL: "http://www.mathjax.org/help-v2/user/",
closeImg: n.fileURL(i.imageDir + "/CloseX-31.png"),
showRenderer: !0,
showMathPlayer: !0,
showFontMenu: !1,
showContext: !1,
showDiscoverable: !1,
windowSettings: {
status: "no",
toolbar: "no",
locationbar: "no",
menubar: "no",
directories: "no",
personalbar: "no",
resizable: "yes",
scrollbars: "yes",
width: 400,
height: 300,
left: Math.round((screen.width - 400) / 2),
top: Math.round((screen.height - 300) / 3)
},
styles: {
"#MathJax_About": {
position: "fixed",
left: "50%",
width: "auto",
"text-align": "center",
border: "3px outset",
padding: "1em 2em",
"background-color": "#DDDDDD",
color: "black",
cursor: "default",
"font-family": "message-box",
"font-size": "120%",
"font-style": "normal",
"text-indent": 0,
"text-transform": "none",
"line-height": "normal",
"letter-spacing": "normal",
"word-spacing": "normal",
"word-wrap": "normal",
"white-space": "nowrap",
"float": "none",
"z-index": 201,
"border-radius": "15px",
"-webkit-border-radius": "15px",
"-moz-border-radius": "15px",
"-khtml-border-radius": "15px",
"box-shadow": "0px 10px 20px #808080",
"-webkit-box-shadow": "0px 10px 20px #808080",
"-moz-box-shadow": "0px 10px 20px #808080",
"-khtml-box-shadow": "0px 10px 20px #808080",
filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
},
".MathJax_Menu": {
position: "absolute",
"background-color": "white",
color: "black",
width: "auto",
padding: u ? "2px" : "5px 0px",
border: "1px solid #CCCCCC",
margin: 0,
cursor: "default",
font: "menu",
"text-align": "left",
"text-indent": 0,
"text-transform": "none",
"line-height": "normal",
"letter-spacing": "normal",
"word-spacing": "normal",
"word-wrap": "normal",
"white-space": "nowrap",
"float": "none",
"z-index": 201,
"border-radius": l,
"-webkit-border-radius": l,
"-moz-border-radius": l,
"-khtml-border-radius": l,
"box-shadow": "0px 10px 20px #808080",
"-webkit-box-shadow": "0px 10px 20px #808080",
"-moz-box-shadow": "0px 10px 20px #808080",
"-khtml-box-shadow": "0px 10px 20px #808080",
filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
},
".MathJax_MenuItem": {
padding: u ? "2px 2em" : "1px 2em",
background: "transparent"
},
".MathJax_MenuTitle": {
"background-color": "#CCCCCC",
margin: u ? "-1px -1px 1px -1px" : "-5px 0 0 0",
"text-align": "center",
"font-style": "italic",
"font-size": "80%",
color: "#444444",
padding: "2px 0",
overflow: "hidden"
},
".MathJax_MenuArrow": {
position: "absolute",
right: ".5em",
color: "#666666",
"font-family": a ? "'Arial unicode MS'" : null
},
".MathJax_MenuActive .MathJax_MenuArrow": {
color: "white"
},
".MathJax_MenuCheck": {
position: "absolute",
left: ".7em",
"font-family": a ? "'Arial unicode MS'" : null
},
".MathJax_MenuRadioCheck": {
position: "absolute",
left: u ? "1em" : ".7em"
},
".MathJax_MenuLabel": {
padding: u ? "2px 2em 4px 1.33em" : "1px 2em 3px 1.33em",
"font-style": "italic"
},
".MathJax_MenuRule": {
"border-top": u ? "1px solid #CCCCCC" : "1px solid #DDDDDD",
margin: u ? "4px 1px 0px" : "4px 3px"
},
".MathJax_MenuDisabled": {
color: "GrayText"
},
".MathJax_MenuActive": {
"background-color": u ? "Highlight" : "#606872",
color: u ? "HighlightText" : "white"
},
".MathJax_Menu_Close": {
position: "absolute",
width: "31px",
height: "31px",
top: "-15px",
left: "-15px"
}
}
}), h, p;
e.Register.StartupHook("MathEvents Ready", function() {
h = MathJax.Extension.MathEvents.Event.False, p = MathJax.Extension.MathEvents.Hover;
});
var d = MathJax.Menu = MathJax.Object.Subclass({
version: s,
items: [],
posted: !1,
title: null,
margin: 5,
Init: function(e) {
this.items = [].slice.call(arguments, 0);
},
With: function(t) {
return t && e.Insert(this, t), this;
},
Post: function(e, n) {
e || (e = window.event);
var r = this.title ? [ [ "div", {
className: "MathJax_MenuTitle"
}, [ this.title ] ] ] : null, i = document.getElementById("MathJax_MenuFrame");
i || (i = d.Background(this), delete v.lastItem, delete v.lastMenu, delete d.skipUp, o.Post([ "post", d.jax ]));
var s = t.addElement(i, "div", {
onmouseup: d.Mouseup,
ondblclick: h,
ondragstart: h,
onselectstart: h,
oncontextmenu: h,
menuItem: this,
className: "MathJax_Menu"
}, r);
for (var a = 0, f = this.items.length; a < f; a++) this.items[a].Create(s);
d.isMobile && t.addElement(s, "span", {
className: "MathJax_Menu_Close",
menu: n,
ontouchstart: d.Close,
ontouchend: h,
onmousedown: d.Close,
onmouseup: h
}, [ [ "img", {
src: c.closeImg,
style: {
width: "100%",
height: "100%"
}
} ] ]), this.posted = !0, s.style.width = s.offsetWidth + 2 + "px";
var l = e.pageX, p = e.pageY;
!l && !p && (l = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, p = e.clientY + document.body.scrollTop + document.documentElement.scrollTop);
if (!n) l + s.offsetWidth > document.body.offsetWidth - this.margin && (l = document.body.offsetWidth - s.offsetWidth - this.margin), d.isMobile && (l = Math.max(5, l - Math.floor(s.offsetWidth / 2)), p -= 20), d.skipUp = e.isContextMenu; else {
var y = "left", b = n.offsetWidth;
l = d.isMobile ? 30 : b - 2, p = 0;
while (n && n !== i) l += n.offsetLeft, p += n.offsetTop, n = n.parentNode;
l + s.offsetWidth > document.body.offsetWidth - this.margin && !d.isMobile && (y = "right", l = Math.max(this.margin, l - b - s.offsetWidth + 6)), u || (s.style["borderRadiusTop" + y] = 0, s.style["WebkitBorderRadiusTop" + y] = 0, s.style["MozBorderRadiusTop" + y] = 0, s.style["KhtmlBorderRadiusTop" + y] = 0);
}
return s.style.left = l + "px", s.style.top = p + "px", document.selection && document.selection.empty && document.selection.empty(), h(e);
},
Remove: function(e, t) {
o.Post([ "unpost", d.jax ]);
var n = document.getElementById("MathJax_MenuFrame");
return n && (n.parentNode.removeChild(n), this.msieFixedPositionBug && detachEvent("onresize", d.Resize)), d.jax.hover && (delete d.jax.hover.nofade, p.UnHover(d.jax)), h(e);
},
Find: function(e) {
var t = [].slice.call(arguments, 1);
for (var n = 0, r = this.items.length; n < r; n++) if (this.items[n].name === e) return t.length ? this.items[n].menu ? this.items[n].menu.Find.apply(this.items[n].menu, t) : null : this.items[n];
return null;
},
IndexOf: function(e) {
for (var t = 0, n = this.items.length; t < n; t++) if (this.items[t].name === e) return t;
return null;
}
}, {
config: c,
div: null,
Close: function(e) {
return d.Event(e, this.menu || this.parentNode, this.menu ? "Touchend" : "Remove");
},
Remove: function(e) {
return d.Event(e, this, "Remove");
},
Mouseover: function(e) {
return d.Event(e, this, "Mouseover");
},
Mouseout: function(e) {
return d.Event(e, this, "Mouseout");
},
Mousedown: function(e) {
return d.Event(e, this, "Mousedown");
},
Mouseup: function(e) {
return d.Event(e, this, "Mouseup");
},
Touchstart: function(e) {
return d.Event(e, this, "Touchstart");
},
Touchend: function(e) {
return d.Event(e, this, "Touchend");
},
Event: function(e, t, n, r) {
if (d.skipMouseover && n === "Mouseover" && !r) return h(e);
if (d.skipUp) {
if (n.match(/Mouseup|Touchend/)) return delete d.skipUp, h(e);
(n === "Touchstart" || n === "Mousedown" && !d.skipMousedown) && delete d.skipUp;
}
e || (e = window.event);
var i = t.menuItem;
return i && i[n] ? i[n](e, t) : null;
},
BGSTYLE: {
position: "absolute",
left: 0,
top: 0,
"z-index": 200,
width: "100%",
height: "100%",
border: 0,
padding: 0,
margin: 0
},
Background: function(e) {
var n = t.addElement(document.body, "div", {
style: this.BGSTYLE,
id: "MathJax_MenuFrame"
}, [ [ "div", {
style: this.BGSTYLE,
menuItem: e,
onmousedown: this.Remove
} ] ]), r = n.firstChild;
return e.msieBackgroundBug && (r.style.backgroundColor = "white", r.style.filter = "alpha(opacity=0)"), e.msieFixedPositionBug ? (n.width = n.height = 0, this.Resize(), attachEvent("onresize", this.Resize)) : r.style.position = "fixed", n;
},
Resize: function() {
setTimeout(d.SetWH, 0);
},
SetWH: function() {
var e = document.getElementById("MathJax_MenuFrame");
e && (e = e.firstChild, e.style.width = e.style.height = "1px", e.style.width = document.body.scrollWidth + "px", e.style.height = document.body.scrollHeight + "px");
},
saveCookie: function() {
t.Cookie.Set("menu", this.cookie);
},
getCookie: function() {
this.cookie = t.Cookie.Get("menu");
},
getImages: function() {
if (d.isMobile) {
var e = new Image;
e.src = c.closeImg;
}
}
}), v = d.ITEM = MathJax.Object.Subclass({
name: "",
Create: function(e) {
if (!this.hidden) {
var n = {
onmouseover: d.Mouseover,
onmouseout: d.Mouseout,
onmouseup: d.Mouseup,
onmousedown: d.Mousedown,
ondragstart: h,
onselectstart: h,
onselectend: h,
ontouchstart: d.Touchstart,
ontouchend: d.Touchend,
className: "MathJax_MenuItem",
menuItem: this
};
this.disabled && (n.className += " MathJax_MenuDisabled"), t.addElement(e, "div", n, this.Label(n, e));
}
},
Mouseover: function(e, t) {
this.disabled || this.Activate(t);
if (!this.menu || !this.menu.posted) {
var n = document.getElementById("MathJax_MenuFrame").childNodes, r = t.parentNode.childNodes;
for (var i = 0, s = r.length; i < s; i++) {
var o = r[i].menuItem;
o && o.menu && o.menu.posted && o.Deactivate(r[i]);
}
s = n.length - 1;
while (s >= 0 && t.parentNode.menuItem !== n[s].menuItem) n[s].menuItem.posted = !1, n[s].parentNode.removeChild(n[s]), s--;
this.Timer && !d.isMobile && this.Timer(e, t);
}
},
Mouseout: function(e, t) {
(!this.menu || !this.menu.posted) && this.Deactivate(t), this.timer && (clearTimeout(this.timer), delete this.timer);
},
Mouseup: function(e, t) {
return this.Remove(e, t);
},
Touchstart: function(e, t) {
return this.TouchEvent(e, t, "Mousedown");
},
Touchend: function(e, t) {
return this.TouchEvent(e, t, "Mouseup");
},
TouchEvent: function(e, t, n) {
return this !== v.lastItem && (v.lastMenu && d.Event(e, v.lastMenu, "Mouseout"), d.Event(e, t, "Mouseover", !0), v.lastItem = this, v.lastMenu = t), this.nativeTouch ? null : (d.Event(e, t, n), !1);
},
Remove: function(e, t) {
return t = t.parentNode.menuItem, t.Remove(e, t);
},
Activate: function(e) {
this.Deactivate(e), e.className += " MathJax_MenuActive";
},
Deactivate: function(e) {
e.className = e.className.replace(/ MathJax_MenuActive/, "");
},
With: function(t) {
return t && e.Insert(this, t), this;
}
});
d.ITEM.COMMAND = d.ITEM.Subclass({
action: function() {},
Init: function(e, t, n) {
this.name = e, this.action = t, this.With(n);
},
Label: function(e, t) {
return [ this.name ];
},
Mouseup: function(e, t) {
return this.disabled || (this.Remove(e, t), o.Post([ "command", this ]), this.action.call(this, e)), h(e);
}
}), d.ITEM.SUBMENU = d.ITEM.Subclass({
menu: null,
marker: u && !e.Browser.isSafari ? "\u25b6" : "\u25b8",
Init: function(e, t) {
this.name = e;
var n = 1;
t instanceof d.ITEM || (this.With(t), n++), this.menu = d.apply(d, [].slice.call(arguments, n));
},
Label: function(e, t) {
return this.menu.posted = !1, [ this.name + " ", [ "span", {
className: "MathJax_MenuArrow"
}, [ this.marker ] ] ];
},
Timer: function(e, t) {
this.timer && clearTimeout(this.timer), e = {
clientX: e.clientX,
clientY: e.clientY
}, this.timer = setTimeout(r([ "Mouseup", this, e, t ]), c.delay);
},
Touchend: function(e, t) {
var n = this.menu.posted, r = this.SUPER(arguments).Touchend.apply(this, arguments);
return n && (this.Deactivate(t), delete v.lastItem, delete v.lastMenu), r;
},
Mouseup: function(e, t) {
if (!this.disabled) if (!this.menu.posted) this.timer && (clearTimeout(this.timer), delete this.timer), this.menu.Post(e, t); else {
var n = document.getElementById("MathJax_MenuFrame").childNodes, r = n.length - 1;
while (r >= 0) {
var i = n[r];
i.menuItem.posted = !1, i.parentNode.removeChild(i);
if (i.menuItem === this.menu) break;
r--;
}
}
return h(e);
}
}), d.ITEM.RADIO = d.ITEM.Subclass({
variable: null,
marker: u ? "\u25cf" : "\u2713",
Init: function(e, t, n) {
this.name = e, this.variable = t, this.With(n), this.value == null && (this.value = this.name);
},
Label: function(e, t) {
var n = {
className: "MathJax_MenuRadioCheck"
};
return c.settings[this.variable] !== this.value && (n = {
style: {
display: "none"
}
}), [ [ "span", n, [ this.marker ] ], " " + this.name ];
},
Mouseup: function(e, t) {
if (!this.disabled) {
var n = t.parentNode.childNodes;
for (var r = 0, i = n.length; r < i; r++) {
var s = n[r].menuItem;
s && s.variable === this.variable && (n[r].firstChild.style.display = "none");
}
t.firstChild.display = "", c.settings[this.variable] = this.value, d.cookie[this.variable] = c.settings[this.variable], d.saveCookie(), o.Post([ "radio button", this ]);
}
return this.Remove(e, t), this.action && !this.disabled && this.action.call(d, this), h(e);
}
}), d.ITEM.CHECKBOX = d.ITEM.Subclass({
variable: null,
marker: "\u2713",
Init: function(e, t, n) {
this.name = e, this.variable = t, this.With(n);
},
Label: function(e, t) {
var n = {
className: "MathJax_MenuCheck"
};
return c.settings[this.variable] || (n = {
style: {
display: "none"
}
}), [ [ "span", n, [ this.marker ] ], " " + this.name ];
},
Mouseup: function(e, t) {
return this.disabled || (t.firstChild.display = c.settings[this.variable] ? "none" : "", c.settings[this.variable] = !c.settings[this.variable], d.cookie[this.variable] = c.settings[this.variable], d.saveCookie(), o.Post([ "checkbox", this ])), this.Remove(e, t), this.action && !this.disabled && this.action.call(d, this), h(e);
}
}), d.ITEM.LABEL = d.ITEM.Subclass({
Init: function(e, t) {
this.name = e, this.With(t);
},
Label: function(e, t) {
return delete e.onmouseover, delete e.onmouseout, delete e.onmousedown, e.className += " MathJax_MenuLabel", [ this.name ];
}
}), d.ITEM.RULE = d.ITEM.Subclass({
Label: function(e, t) {
return delete e.onmouseover, delete e.onmouseout, delete e.onmousedown, e.className += " MathJax_MenuRule", null;
}
}), d.About = function() {
var n = i["HTML-CSS"] || {
fontInUse: ""
}, r = n.webFonts ? "" : "local ", s = n.webFonts ? " web" : "", o = (n.imgFonts ? "Image" : r + n.fontInUse + s) + " fonts";
o === "local  fonts" && i.SVG && (o = "web SVG fonts");
var u = [ "MathJax.js v" + MathJax.fileversion, [ "br" ] ];
u.push([ "div", {
style: {
"border-top": "groove 2px",
margin: ".25em 0"
}
} ]), d.About.GetJax(u, MathJax.InputJax, "Input Jax"), d.About.GetJax(u, MathJax.OutputJax, "Output Jax"), d.About.GetJax(u, MathJax.ElementJax, "Element Jax"), u.push([ "div", {
style: {
"border-top": "groove 2px",
margin: ".25em 0"
}
} ]), d.About.GetJax(u, MathJax.Extension, "Extension", !0), u.push([ "div", {
style: {
"border-top": "groove 2px",
margin: ".25em 0"
}
} ], [ "center", {}, [ e.Browser + " v" + e.Browser.version + (n.webFonts && !n.imgFonts ? " \u2014 " + n.allowWebFonts.replace(/otf/, "woff or otf") + " fonts" : "") ] ]), d.About.div = d.Background(d.About);
var a = t.addElement(d.About.div, "div", {
id: "MathJax_About"
}, [ [ "b", {
style: {
fontSize: "120%"
}
}, [ "MathJax" ] ], " v" + MathJax.version, [ "br" ], "using " + o, [ "br" ], [ "br" ], [ "span", {
style: {
display: "inline-block",
"text-align": "left",
"font-size": "80%",
"max-height": "20em",
overflow: "auto",
"background-color": "#E4E4E4",
padding: ".4em .6em",
border: "1px inset"
}
}, u ], [ "br" ], [ "br" ], [ "a", {
href: "http://www.mathjax.org/"
}, [ "www.mathjax.org" ] ], [ "img", {
src: c.closeImg,
style: {
width: "21px",
height: "21px",
position: "absolute",
top: ".2em",
right: ".2em"
},
onclick: d.About.Remove
} ] ]), f = document.documentElement || {}, l = window.innerHeight || f.clientHeight || f.scrollHeight || 0;
d.prototype.msieAboutBug ? (a.style.width = "20em", a.style.position = "absolute", a.style.left = Math.floor((document.documentElement.scrollWidth - a.offsetWidth) / 2) + "px", a.style.top = Math.floor((l - a.offsetHeight) / 3) + document.body.scrollTop + "px") : (a.style.marginLeft = Math.floor(-a.offsetWidth / 2) + "px", a.style.top = Math.floor((l - a.offsetHeight) / 3) + "px");
}, d.About.Remove = function(e) {
d.About.div && (document.body.removeChild(d.About.div), delete d.About.div);
}, d.About.GetJax = function(e, t, n, r) {
var i = [];
for (var s in t) t.hasOwnProperty(s) && t[s] && (r && t[s].version || t[s].isa && t[s].isa(t)) && i.push((t[s].id || s) + " " + n + " v" + t[s].version);
i.sort();
for (var o = 0, u = i.length; o < u; o++) e.push(i[o], [ "br" ]);
return e;
}, d.Help = function() {
window.open(c.helpURL, "MathJaxHelp");
}, d.ShowSource = function(e) {
e || (e = window.event);
var t = {
screenX: e.screenX,
screenY: e.screenY
};
if (!d.jax) return;
if (this.format === "MathML") {
var i = MathJax.ElementJax.mml;
if (i && typeof i.mbase.prototype.toMathML != "undefined") try {
d.ShowSource.Text(d.jax.root.toMathML(), e);
} catch (s) {
if (!s.restart) throw s;
r.After([ this, d.ShowSource, t ], s.restart);
} else if (!n.loadingToMathML) {
n.loadingToMathML = !0, d.ShowSource.Window(e), r.Queue(n.Require("[MathJax]/extensions/toMathML.js"), function() {
delete n.loadingToMathML, i.mbase.prototype.toMathML || (i.mbase.prototype.toMathML = function() {});
}, [ this, d.ShowSource, t ]);
return;
}
} else {
if (d.jax.originalText == null) {
alert("No original form available");
return;
}
d.ShowSource.Text(d.jax.originalText, e);
}
}, d.ShowSource.Window = function(e) {
if (!d.ShowSource.w) {
var t = [], n = c.windowSettings;
for (var r in n) n.hasOwnProperty(r) && t.push(r + "=" + n[r]);
d.ShowSource.w = window.open("", "_blank", t.join(","));
}
return d.ShowSource.w;
}, d.ShowSource.Text = function(e, t) {
var n = d.ShowSource.Window(t);
delete d.ShowSource.w, e = e.replace(/^\s*/, "").replace(/\s*$/, ""), e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
if (d.isMobile) n.document.open(), n.document.write("<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0' /><title>MathJax Equation Source</title></head><body style='font-size:85%'>"), n.document.write("<pre>" + e + "</pre>"), n.document.write("<hr><input type='button' value='Close' onclick='window.close()' />"), n.document.write("</body></html>"), n.document.close(); else {
n.document.open(), n.document.write("<html><head><title>MathJax Equation Source</title></head><body style='font-size:85%'>"), n.document.write("<table><tr><td><pre>" + e + "</pre></td></tr></table>"), n.document.write("</body></html>"), n.document.close();
var r = n.document.body.firstChild;
setTimeout(function() {
var e = n.outerHeight - n.innerHeight || 30, i = n.outerWidth - n.innerWidth || 30, s, o;
i = Math.max(100, Math.min(Math.floor(.5 * screen.width), r.offsetWidth + i + 25)), e = Math.max(40, Math.min(Math.floor(.5 * screen.height), r.offsetHeight + e + 25)), n.resizeTo(i, e), t && t.screenX != null && (s = Math.max(0, Math.min(t.screenX - Math.floor(i / 2), screen.width - i - 20)), o = Math.max(0, Math.min(t.screenY - Math.floor(e / 2), screen.height - e - 20)), n.moveTo(s, o));
}, 50);
}
}, d.Scale = function() {
var t = i["HTML-CSS"], n = i.NativeMML, r = i.SVG, s = (t || n || r || {
config: {
scale: 100
}
}).config.scale, o = prompt("Scale all mathematics (compared to surrounding text) by", s + "%");
o && (o.match(/^\s*\d+(\.\d*)?\s*%?\s*$/) ? (o = parseFloat(o), o ? o !== s && (t && (t.config.scale = o), n && (n.config.scale = o), r && (r.config.scale = o), d.cookie.scale = o, d.saveCookie(), e.Reprocess()) : alert("The scale should not be zero")) : alert("The scale should be a percentage (e.g., 120%)"));
}, d.Zoom = function() {
MathJax.Extension.MathZoom || n.Require("[MathJax]/extensions/MathZoom.js");
}, d.Renderer = function() {
var t = e.outputJax["jax/mml"];
if (t[0] !== c.settings.renderer) {
var n = e.Browser, r, i = d.Renderer.Messages, s;
switch (c.settings.renderer) {
case "NativeMML":
c.settings.warnedMML || (n.isChrome || n.isSafari && !n.versionAtLeast("5.0") ? r = i.MML.WebKit : n.isMSIE ? n.hasMathPlayer || (r = i.MML.MSIE) : r = i.MML[n], s = "warnedMML");
break;
case "SVG":
c.settings.warnedSVG || n.isMSIE && !f && (r = i.SVG.MSIE);
}
if (r) {
r += "\n\nSwitch the renderer anyway?\n\n(Press OK to switch, CANCEL to continue with the current renderer)", d.cookie.renderer = t[0].id, d.saveCookie();
if (!confirm(r)) return;
s && (d.cookie[s] = c.settings[s] = !0), d.cookie.renderer = c.settings.renderer, d.saveCookie();
}
e.Queue([ "setRenderer", e, c.settings.renderer, "jax/mml" ], [ "Rerender", e ]);
}
}, d.Renderer.Messages = {
MML: {
WebKit: "Your browser doesn't seem to support MathML natively, so switching to MathML output may cause the mathematics on the page to become unreadable.",
MSIE: "Internet Explorer requires the MathPlayer plugin in order to process MathML output.",
Opera: "Opera's support for MathML is limited, so switching to MathML output may cause some expressions to render poorly.",
Safari: "Your browser's native MathML does not implement all the features used by MathJax, so some expressions may not render properly.",
Firefox: "Your browser's native MathML does not implement all the features used by MathJax, so some expressions may not render properly."
},
SVG: {
MSIE: "SVG is not implemented in Internet Explorer prior to IE9, or when the browser is emulating IE8 or below. Switching to SVG output will cause the mathemtics to not display properly."
}
}, d.Font = function() {
var e = i["HTML-CSS"];
if (!e) return;
document.location.reload();
}, d.MPEvents = function(e) {
var t = c.settings.discoverable, n = d.MPEvents.Messages;
if (!f) {
if (c.settings.mpMouse && !confirm(n.IE8warning)) {
delete d.cookie.mpContext, delete c.settings.mpContext, delete d.cookie.mpMouse, delete c.settings.mpMouse, d.saveCookie();
return;
}
c.settings.mpContext = c.settings.mpMouse, d.cookie.mpContext = d.cookie.mpMouse = c.settings.mpMouse, d.saveCookie(), MathJax.Hub.Queue([ "Rerender", MathJax.Hub ]);
} else !t && e.name === "Menu Events" && c.settings.mpContext && alert(n.IE9warning);
}, d.MPEvents.Messages = {
IE8warning: "This will disable the MathJax menu and zoom features, but you can Alt-Click on an expression to obtain the MathJax menu instead.\n\nReally change the MathPlayer settings?",
IE9warning: "The MathJax contextual menu will be disabled, but you can Alt-Click on an expression to obtain the MathJax menu instead."
}, e.Browser.Select({
MSIE: function(e) {
var t = document.compatMode === "BackCompat", n = e.versionAtLeast("8.0") && document.documentMode > 7;
d.Augment({
margin: 20,
msieBackgroundBug: document.documentMode < 9,
msieFixedPositionBug: t || !n,
msieAboutBug: t
}), f && (delete c.styles["#MathJax_About"].filter, delete c.styles[".MathJax_Menu"].filter);
},
Firefox: function(e) {
d.skipMouseover = e.isMobile && e.versionAtLeast("6.0"), d.skipMousedown = e.isMobile;
}
}), d.isMobile = e.Browser.isMobile, d.noContextMenu = e.Browser.noContextMenu, e.Register.StartupHook("End Config", function() {
c.settings = e.config.menuSettings, typeof c.settings.showRenderer != "undefined" && (c.showRenderer = c.settings.showRenderer), typeof c.settings.showFontMenu != "undefined" && (c.showFontMenu = c.settings.showFontMenu), typeof c.settings.showContext != "undefined" && (c.showContext = c.settings.showContext), d.getCookie(), d.menu = d(v.SUBMENU("Show Math As", v.COMMAND("MathML Code", d.ShowSource, {
nativeTouch: !0,
format: "MathML"
}), v.COMMAND("Original Form", d.ShowSource, {
nativeTouch: !0
}), v.RULE(), v.CHECKBOX("Show TeX hints in MathML", "texHints")), v.RULE(), v.SUBMENU("Math Settings", v.SUBMENU("Zoom Trigger", v.RADIO("Hover", "zoom", {
action: d.Zoom
}), v.RADIO("Click", "zoom", {
action: d.Zoom
}), v.RADIO("Double-Click", "zoom", {
action: d.Zoom
}), v.RADIO("No Zoom", "zoom", {
value: "None"
}), v.RULE(), v.LABEL("Trigger Requires:"), v.CHECKBOX(e.Browser.isMac ? "Option" : "Alt", "ALT"), v.CHECKBOX("Command", "CMD", {
hidden: !e.Browser.isMac
}), v.CHECKBOX("Control", "CTRL", {
hidden: e.Browser.isMac
}), v.CHECKBOX("Shift", "Shift")), v.SUBMENU("Zoom Factor", v.RADIO("125%", "zscale"), v.RADIO("133%", "zscale"), v.RADIO("150%", "zscale"), v.RADIO("175%", "zscale"), v.RADIO("200%", "zscale"), v.RADIO("250%", "zscale"), v.RADIO("300%", "zscale"), v.RADIO("400%", "zscale")), v.RULE(), v.SUBMENU("Math Renderer", {
hidden: !c.showRenderer
}, v.RADIO("HTML-CSS", "renderer", {
action: d.Renderer
}), v.RADIO("MathML", "renderer", {
action: d.Renderer,
value: "NativeMML"
}), v.RADIO("SVG", "renderer", {
action: d.Renderer
})), v.SUBMENU("MathPlayer", {
hidden: !e.Browser.isMSIE || !c.showMathPlayer,
disabled: !e.Browser.hasMathPlayer
}, v.LABEL("Let MathPlayer Handle:"), v.CHECKBOX("Menu Events", "mpContext", {
action: d.MPEvents,
hidden: !f
}), v.CHECKBOX("Mouse Events", "mpMouse", {
action: d.MPEvents,
hidden: !f
}), v.CHECKBOX("Mouse and Menu Events", "mpMouse", {
action: d.MPEvents,
hidden: f
})), v.SUBMENU("Font Preference", {
hidden: !c.showFontMenu
}, v.LABEL("For HTML-CSS:"), v.RADIO("Auto", "font", {
action: d.Font
}), v.RULE(), v.RADIO("TeX (local)", "font", {
action: d.Font
}), v.RADIO("TeX (web)", "font", {
action: d.Font
}), v.RADIO("TeX (image)", "font", {
action: d.Font
}), v.RULE(), v.RADIO("STIX (local)", "font", {
action: d.Font
})), v.SUBMENU("Contextual Menu", {
hidden: !c.showContext
}, v.RADIO("MathJax", "context"), v.RADIO("Browser", "context")), v.COMMAND("Scale All Math ...", d.Scale), v.RULE().With({
hidden: !c.showDiscoverable,
name: "discover_rule"
}), v.CHECKBOX("Highlight on Hover", "discoverable", {
hidden: !c.showDiscoverable
})), v.RULE(), v.COMMAND("About MathJax", d.About), v.COMMAND("MathJax Help", d.Help)), d.isMobile && function() {
var e = c.settings, t = d.menu.Find("Math Settings", "Zoom Trigger").menu;
t.items[0].disabled = t.items[1].disabled = !0;
if (e.zoom === "Hover" || e.zoom == "Click") e.zoom = "None";
t.items = t.items.slice(0, 4), navigator.appVersion.match(/[ (]Android[) ]/) && d.ITEM.SUBMENU.Augment({
marker: "\u00bb"
});
}();
}), d.showRenderer = function(e) {
d.cookie.showRenderer = c.showRenderer = e, d.saveCookie(), d.menu.Find("Math Settings", "Math Renderer").hidden = !e;
}, d.showMathPlayer = function(e) {
d.cookie.showMathPlayer = c.showMathPlayer = e, d.saveCookie(), d.menu.Find("Math Settings", "MathPlayer").hidden = !e;
}, d.showFontMenu = function(e) {
d.cookie.showFontMenu = c.showFontMenu = e, d.saveCookie(), d.menu.Find("Math Settings", "Font Preference").hidden = !e;
}, d.showContext = function(e) {
d.cookie.showContext = c.showContext = e, d.saveCookie(), d.menu.Find("Math Settings", "Contextual Menu").hidden = !e;
}, d.showDiscoverable = function(e) {
d.cookie.showContext = c.showContext = e, d.saveCookie(), d.menu.Find("Math Settings", "Highlight on Hover").hidden = !e, d.menu.Find("Math Settings", "discover_rule").hidden = !e;
}, MathJax.Hub.Register.StartupHook("HTML-CSS Jax Ready", function() {
MathJax.OutputJax["HTML-CSS"].config.imageFont || (d.menu.Find("Math Settings", "Font Preference", "TeX (image)").disabled = !0);
}), r.Queue(e.Register.StartupHook("End Config", {}), [ "getImages", d ], [ "Styles", n, c.styles ], [ "Post", e.Startup.signal, "MathMenu Ready" ], [ "loadComplete", n, "[MathJax]/extensions/MathMenu.js" ]);
}(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.CallBack, MathJax.OutputJax), function(e, t, n, r, i) {
var s = "2.1", o = e.CombineConfig("MathZoom", {
styles: {
"#MathJax_Zoom": {
position: "absolute",
"background-color": "#F0F0F0",
overflow: "auto",
display: "block",
"z-index": 301,
padding: ".5em",
border: "1px solid black",
margin: 0,
"font-weight": "normal",
"font-style": "normal",
"text-align": "left",
"text-indent": 0,
"text-transform": "none",
"line-height": "normal",
"letter-spacing": "normal",
"word-spacing": "normal",
"word-wrap": "normal",
"white-space": "nowrap",
"float": "none",
"box-shadow": "5px 5px 15px #AAAAAA",
"-webkit-box-shadow": "5px 5px 15px #AAAAAA",
"-moz-box-shadow": "5px 5px 15px #AAAAAA",
"-khtml-box-shadow": "5px 5px 15px #AAAAAA",
filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
},
"#MathJax_ZoomOverlay": {
position: "absolute",
left: 0,
top: 0,
"z-index": 300,
display: "inline-block",
width: "100%",
height: "100%",
border: 0,
padding: 0,
margin: 0,
"background-color": "white",
opacity: 0,
filter: "alpha(opacity=0)"
},
"#MathJax_ZoomEventTrap": {
position: "absolute",
left: 0,
top: 0,
"z-index": 302,
display: "inline-block",
border: 0,
padding: 0,
margin: 0,
"background-color": "white",
opacity: 0,
filter: "alpha(opacity=0)"
}
}
}), u, a, f;
MathJax.Hub.Register.StartupHook("MathEvents Ready", function() {
f = MathJax.Extension.MathEvents.Event, u = MathJax.Extension.MathEvents.Event.False, a = MathJax.Extension.MathEvents.Hover;
});
var l = MathJax.Extension.MathZoom = {
version: s,
settings: e.config.menuSettings,
scrollSize: 18,
HandleEvent: function(e, t, n) {
return l.settings.CTRL && !e.ctrlKey ? !0 : l.settings.ALT && !e.altKey ? !0 : l.settings.CMD && !e.metaKey ? !0 : l.settings.Shift && !e.shiftKey ? !0 : l[t] ? l[t](e, n) : !0;
},
Click: function(e, t) {
if (this.settings.zoom === "Click") return this.Zoom(e, t);
},
DblClick: function(e, t) {
if (this.settings.zoom === "Double-Click") return this.Zoom(e, t);
},
Hover: function(e, t) {
return this.settings.zoom === "Hover" ? (this.Zoom(e, t), !0) : !1;
},
Zoom: function(n, r) {
this.Remove(), a.ClearHoverTimer(), f.ClearSelection();
var i = MathJax.OutputJax[r.jaxID], s = i.getJaxFromMath(r);
s.hover && a.UnHover(s);
var l = Math.floor(.85 * document.body.clientWidth), c = Math.floor(.85 * Math.max(document.body.clientHeight, document.documentElement.clientHeight)), h = t.Element("span", {
style: {
position: "relative",
display: "inline-block",
height: 0,
width: 0
},
id: "MathJax_ZoomFrame"
}, [ [ "span", {
id: "MathJax_ZoomOverlay",
onmousedown: this.Remove
} ], [ "span", {
id: "MathJax_Zoom",
onclick: this.Remove,
style: {
visibility: "hidden",
fontSize: this.settings.zscale,
"max-width": l + "px",
"max-height": c + "px"
}
}, [ [ "span", {
style: {
display: "inline-block",
"white-space": "nowrap"
}
} ] ] ] ]), p = h.lastChild, v = p.firstChild, m = h.firstChild;
r.parentNode.insertBefore(h, r), r.parentNode.insertBefore(r, h), v.addEventListener && v.addEventListener("mousedown", this.Remove, !0);
if (this.msieTrapEventBug) {
var y = t.Element("span", {
id: "MathJax_ZoomEventTrap",
onmousedown: this.Remove
});
h.insertBefore(y, p);
}
if (this.msieZIndexBug) {
var w = t.addElement(document.body, "img", {
src: "about:blank",
id: "MathJax_ZoomTracker",
width: 0,
height: 0,
style: {
width: 0,
height: 0,
position: "relative"
}
});
h.style.position = "relative", h.style.zIndex = o.styles["#MathJax_ZoomOverlay"]["z-index"], h = w;
}
var E = i.Zoom(s, v, r, l, c);
return this.msiePositionBug && (this.msieSizeBug && (p.style.height = E.zH + "px", p.style.width = E.zW + "px"), p.offsetHeight > c && (p.style.height = c + "px", p.style.width = E.zW + this.scrollSize + "px"), p.offsetWidth > l && (p.style.width = l + "px", p.style.height = E.zH + this.scrollSize + "px")), this.operaPositionBug && (p.style.width = Math.min(l, E.zW) + "px"), p.offsetWidth < l && p.offsetHeight < c && (p.style.overflow = "visible"), this.Position(p, E), this.msieTrapEventBug && (y.style.height = p.clientHeight + "px", y.style.width = p.clientWidth + "px", y.style.left = parseFloat(p.style.left) + p.clientLeft + "px", y.style.top = parseFloat(p.style.top) + p.clientTop + "px"), p.style.visibility = "", this.settings.zoom === "Hover" && (m.onmouseover = this.Remove), window.addEventListener ? addEventListener("resize", this.Resize, !1) : window.attachEvent ? attachEvent("onresize", this.Resize) : (this.onresize = window.onresize, window.onresize = this.Resize), e.signal.Post([ "math zoomed", s ]), u(n);
},
Position: function(e, t) {
var n = this.Resize(), r = n.x, i = n.y, s = t.mW, o = -s - Math.floor((e.offsetWidth - s) / 2), u = t.Y;
e.style.left = Math.max(o, 10 - r) + "px", e.style.top = Math.max(u, 10 - i) + "px", l.msiePositionBug || l.SetWH();
},
Resize: function(e) {
l.onresize && l.onresize(e);
var t = 0, n = 0, r, i = document.getElementById("MathJax_ZoomFrame"), s = document.getElementById("MathJax_ZoomOverlay");
r = i;
while (r.offsetParent) t += r.offsetLeft, r = r.offsetParent;
l.operaPositionBug && (i.style.border = "1px solid"), r = i;
while (r.offsetParent) n += r.offsetTop, r = r.offsetParent;
return l.operaPositionBug && (i.style.border = ""), s.style.left = -t + "px", s.style.top = -n + "px", l.msiePositionBug ? setTimeout(l.SetWH, 0) : l.SetWH(), {
x: t,
y: n
};
},
SetWH: function() {
var e = document.getElementById("MathJax_ZoomOverlay");
e.style.width = e.style.height = "1px";
var t = document.documentElement || document.body;
e.style.width = t.scrollWidth + "px", e.style.height = Math.max(t.clientHeight, t.scrollHeight) + "px";
},
Remove: function(n) {
var r = document.getElementById("MathJax_ZoomFrame");
if (r) {
var i = MathJax.OutputJax[r.previousSibling.jaxID], s = i.getJaxFromMath(r.previousSibling);
e.signal.Post([ "math unzoomed", s ]), r.parentNode.removeChild(r), r = document.getElementById("MathJax_ZoomTracker"), r && r.parentNode.removeChild(r);
if (l.operaRefreshBug) {
var o = t.addElement(document.body, "div", {
style: {
position: "fixed",
left: 0,
top: 0,
width: "100%",
height: "100%",
backgroundColor: "white",
opacity: 0
},
id: "MathJax_OperaDiv"
});
document.body.removeChild(o);
}
window.removeEventListener ? removeEventListener("resize", l.Resize, !1) : window.detachEvent ? detachEvent("onresize", l.Resize) : (window.onresize = l.onresize, delete l.onresize);
}
return u(n);
}
};
e.Browser.Select({
MSIE: function(e) {
var t = document.documentMode || 0, n = t >= 9;
l.msiePositionBug = !n, l.msieSizeBug = e.versionAtLeast("7.0") && (!document.documentMode || t === 7 || t === 8), l.msieZIndexBug = t <= 7, l.msieInlineBlockAlignBug = t <= 7, l.msieTrapEventBug = !window.addEventListener, document.compatMode === "BackCompat" && (l.scrollSize = 52), n && delete o.styles["#MathJax_Zoom"].filter;
},
Opera: function(e) {
l.operaPositionBug = !0, l.operaRefreshBug = !0;
}
}), l.topImg = l.msieInlineBlockAlignBug ? t.Element("img", {
style: {
width: 0,
height: 0,
position: "relative"
},
src: "about:blank"
}) : t.Element("span", {
style: {
width: 0,
height: 0,
display: "inline-block"
}
});
if (l.operaPositionBug || l.msieTopBug) l.topImg.style.border = "1px solid";
MathJax.Callback.Queue([ "StartupHook", MathJax.Hub.Register, "Begin Styles", {} ], [ "Styles", n, o.styles ], [ "Post", e.Startup.signal, "MathZoom Ready" ], [ "loadComplete", n, "[MathJax]/extensions/MathZoom.js" ]);
}(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.OutputJax["HTML-CSS"], MathJax.OutputJax.NativeMML), MathJax.Extension["TeX/AMSmath"] = {
version: "2.1",
number: 0,
startNumber: 0,
labels: {},
eqlabels: {},
refs: []
}, MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = MathJax.ElementJax.mml, t = MathJax.InputJax.TeX, n = MathJax.Extension["TeX/AMSmath"], r = t.Definitions, i = t.Stack.Item, s = t.config.equationNumbers, o = function(e) {
var n = [];
for (var r = 0, i = e.length; r < i; r++) n[r] = t.Parse.prototype.Em(e[r]);
return n.join(" ");
};
r.Add({
mathchar0mo: {
iiiint: [ "2A0C", {
texClass: e.TEXCLASS.OP
} ]
},
macros: {
mathring: [ "Accent", "2DA" ],
nobreakspace: "Tilde",
negmedspace: [ "Spacer", e.LENGTH.NEGATIVEMEDIUMMATHSPACE ],
negthickspace: [ "Spacer", e.LENGTH.NEGATIVETHICKMATHSPACE ],
idotsint: [ "MultiIntegral", "\\int\\cdots\\int" ],
dddot: [ "Accent", "20DB" ],
ddddot: [ "Accent", "20DC" ],
sideset: [ "Macro", "\\mathop{\\mathop{\\rlap{\\phantom{#3}}}\\nolimits#1\\!\\mathop{#3}\\nolimits#2}", 3 ],
boxed: [ "Macro", "\\fbox{$\\displaystyle{#1}$}", 1 ],
tag: "HandleTag",
notag: "HandleNoTag",
label: "HandleLabel",
ref: "HandleRef",
eqref: [ "HandleRef", !0 ],
substack: [ "Macro", "\\begin{subarray}{c}#1\\end{subarray}", 1 ],
injlim: [ "NamedOp", "inj&thinsp;lim" ],
projlim: [ "NamedOp", "proj&thinsp;lim" ],
varliminf: [ "Macro", "\\mathop{\\underline{\\mmlToken{mi}{lim}}}" ],
varlimsup: [ "Macro", "\\mathop{\\overline{\\mmlToken{mi}{lim}}}" ],
varinjlim: [ "Macro", "\\mathop{\\underrightarrow{\\mmlToken{mi}{lim}\\Rule{-1pt}{0pt}{1pt}}\\Rule{0pt}{0pt}{.45em}}" ],
varprojlim: [ "Macro", "\\mathop{\\underleftarrow{\\mmlToken{mi}{lim}\\Rule{-1pt}{0pt}{1pt}}\\Rule{0pt}{0pt}{.45em}}" ],
DeclareMathOperator: "HandleDeclareOp",
operatorname: "HandleOperatorName",
genfrac: "Genfrac",
frac: [ "Genfrac", "", "", "", "" ],
tfrac: [ "Genfrac", "", "", "", 1 ],
dfrac: [ "Genfrac", "", "", "", 0 ],
binom: [ "Genfrac", "(", ")", "0em", "" ],
tbinom: [ "Genfrac", "(", ")", "0em", 1 ],
dbinom: [ "Genfrac", "(", ")", "0em", 0 ],
cfrac: "CFrac",
shoveleft: [ "HandleShove", e.ALIGN.LEFT ],
shoveright: [ "HandleShove", e.ALIGN.RIGHT ],
xrightarrow: [ "xArrow", 8594, 5, 6 ],
xleftarrow: [ "xArrow", 8592, 7, 3 ]
},
environment: {
align: [ "AMSarray", null, !0, !0, "rlrlrlrlrlrl", o([ 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18 ]) ],
"align*": [ "AMSarray", null, !1, !0, "rlrlrlrlrlrl", o([ 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18 ]) ],
multline: [ "Multline", null, !0 ],
"multline*": [ "Multline", null, !1 ],
split: [ "AMSarray", null, !1, !1, "rl", o([ 5 / 18 ]) ],
gather: [ "AMSarray", null, !0, !0, "c" ],
"gather*": [ "AMSarray", null, !1, !0, "c" ],
alignat: [ "AlignAt", null, !0, !0 ],
"alignat*": [ "AlignAt", null, !1, !0 ],
alignedat: [ "AlignAt", null, !1, !1 ],
aligned: [ "AlignedArray", null, null, null, "rlrlrlrlrlrl", o([ 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18 ]), ".5em", "D" ],
gathered: [ "AlignedArray", null, null, null, "c", null, ".5em", "D" ],
subarray: [ "Array", null, null, null, null, o([ 0, 0, 0, 0 ]), "0.1em", "S", 1 ],
smallmatrix: [ "Array", null, null, null, "c", o([ 1 / 3 ]), ".2em", "S", 1 ],
equation: [ "EquationBegin", "Equation", !0 ],
"equation*": [ "EquationBegin", "EquationStar", !1 ],
eqnarray: [ "AMSarray", null, !0, !0, "rcl", e.LENGTH.THICKMATHSPACE, ".5em" ],
"eqnarray*": [ "AMSarray", null, !1, !0, "rcl", e.LENGTH.THICKMATHSPACE, ".5em" ]
},
delimiter: {
"\\lvert": [ "2223", {
texClass: e.TEXCLASS.OPEN
} ],
"\\rvert": [ "2223", {
texClass: e.TEXCLASS.CLOSE
} ],
"\\lVert": [ "2225", {
texClass: e.TEXCLASS.OPEN
} ],
"\\rVert": [ "2225", {
texClass: e.TEXCLASS.CLOSE
} ]
}
}, null, !0), t.Parse.Augment({
HandleTag: function(n) {
var r = this.GetStar(), i = this.trimSpaces(this.GetArgument(n)), o = i;
r || (i = s.formatTag(i));
var u = this.stack.global;
u.tagID = o, u.notags && t.Error(n + " not allowed in " + u.notags + " environment"), u.tag && t.Error("Multiple " + n), u.tag = e.mtd.apply(e, this.InternalMath(i)).With({
id: s.formatID(o)
});
},
HandleNoTag: function(e) {
this.stack.global.tag && delete this.stack.global.tag, this.stack.global.notag = !0;
},
HandleLabel: function(e) {
var r = this.stack.global, i = this.GetArgument(e);
if (i === "") return;
n.refUpdate || (r.label && t.Error("Multiple " + e + "'s"), r.label = i, (n.labels[i] || n.eqlabels[i]) && t.Error("Label '" + i + "' mutiply defined"), n.eqlabels[i] = "???");
},
HandleRef: function(t, r) {
var i = this.GetArgument(t), o = n.labels[i] || n.eqlabels[i];
o || (o = "??", n.badref = !n.refUpdate);
var u = o;
r && (u = s.formatTag(u)), s.useLabelIds && (o = i), this.Push(e.mrow.apply(e, this.InternalMath(u)).With({
href: s.formatURL(s.formatID(o)),
"class": "MathJax_ref"
}));
},
HandleDeclareOp: function(e) {
var n = this.GetStar() ? "\\limits" : "", r = this.trimSpaces(this.GetArgument(e));
r.charAt(0) == "\\" && (r = r.substr(1));
var i = this.GetArgument(e);
i = i.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}"), t.Definitions.macros[r] = [ "Macro", "\\mathop{\\rm " + i + "}" + n ];
},
HandleOperatorName: function(e) {
var t = this.GetStar() ? "\\limits" : "\\nolimits", n = this.trimSpaces(this.GetArgument(e));
n = n.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}"), this.string = "\\mathop{\\rm " + n + "}" + t + " " + this.string.slice(this.i), this.i = 0;
},
HandleShove: function(e, n) {
var r = this.stack.Top();
(r.type !== "multline" || r.data.length) && t.Error(e + " must come at the beginning of the line"), r.data.shove = n;
},
CFrac: function(n) {
var r = this.trimSpaces(this.GetBrackets(n, "")), i = this.GetArgument(n), s = this.GetArgument(n), o = e.mfrac(t.Parse("\\strut\\textstyle{" + i + "}", this.stack.env).mml(), t.Parse("\\strut\\textstyle{" + s + "}", this.stack.env).mml());
r = {
l: e.ALIGN.LEFT,
r: e.ALIGN.RIGHT,
"": ""
}[r], r == null && t.Error("Illegal alignment specified in " + n), r && (o.numalign = o.denomalign = r), this.Push(o);
},
Genfrac: function(n, r, i, s, o) {
r == null ? r = this.GetDelimiterArg(n) : r = this.convertDelimiter(r), i == null ? i = this.GetDelimiterArg(n) : i = this.convertDelimiter(i), s == null && (s = this.GetArgument(n)), o == null && (o = this.trimSpaces(this.GetArgument(n)));
var u = this.ParseArg(n), a = this.ParseArg(n), f = e.mfrac(u, a);
s !== "" && (f.linethickness = s);
if (r || i) f = e.mfenced(f).With({
open: r,
close: i
});
if (o !== "") {
var l = [ "D", "T", "S", "SS" ][o];
l == null && t.Error("Bad math style for " + n), f = e.mstyle(f), l === "D" ? (f.displaystyle = !0, f.scriptlevel = 0) : (f.displaystyle = !1, f.scriptlevel = o - 1);
}
this.Push(f);
},
Multline: function(e, n) {
return this.Push(e), this.checkEqnEnv(), i.multline(n, this.stack).With({
arraydef: {
displaystyle: !0,
rowspacing: ".5em",
width: t.config.MultLineWidth,
columnwidth: "100%",
side: t.config.TagSide,
minlabelspacing: t.config.TagIndent
}
});
},
AMSarray: function(e, n, r, s, o) {
return this.Push(e), r && this.checkEqnEnv(), s = s.replace(/[^clr]/g, "").split("").join(" "), s = s.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center"), i.AMSarray(e.name, n, r, this.stack).With({
arraydef: {
displaystyle: !0,
rowspacing: ".5em",
columnalign: s,
columnspacing: o || "1em",
rowspacing: "3pt",
side: t.config.TagSide,
minlabelspacing: t.config.TagIndent
}
});
},
AlignAt: function(e, n, r) {
var i, s, o = "", u = [];
r || (s = this.GetBrackets("\\begin{" + e.name + "}")), i = this.GetArgument("\\begin{" + e.name + "}"), i.match(/[^0-9]/) && t.Error("Argument to \\begin{" + e.name + "} must me a positive integer");
while (i > 0) o += "rl", u.push("0em 0em"), i--;
u = u.join(" ");
if (r) return this.AMSarray(e, n, r, o, u);
var a = this.Array.call(this, e, null, null, o, u, ".5em", "D");
return this.setArrayAlign(a, s);
},
EquationBegin: function(e, t) {
return this.checkEqnEnv(), this.stack.global.forcetag = t && s.autoNumber !== "none", e;
},
EquationStar: function(e, t) {
return this.stack.global.tagged = !0, t;
},
checkEqnEnv: function() {
this.stack.global.eqnenv && t.Error("Erroneous nesting of equation structures"), this.stack.global.eqnenv = !0;
},
MultiIntegral: function(e, t) {
var n = this.GetNext();
if (n === "\\") {
var r = this.i;
n = this.GetArgument(e), this.i = r, n === "\\limits" && (e === "\\idotsint" ? t = "\\!\\!\\mathop{\\,\\," + t + "}" : t = "\\!\\!\\!\\mathop{\\,\\,\\," + t + "}");
}
this.string = t + " " + this.string.slice(this.i), this.i = 0;
},
xArrow: function(n, r, i, s) {
var o = {
width: "+" + (i + s) + "mu",
lspace: i + "mu"
}, u = this.GetBrackets(n), a = this.ParseArg(n), f = e.mo(e.chars(String.fromCharCode(r))).With({
stretchy: !0,
texClass: e.TEXCLASS.REL
}), l = e.munderover(f);
l.SetData(l.over, e.mpadded(a).With(o).With({
voffset: ".15em"
})), u && (u = t.Parse(u, this.stack.env).mml(), l.SetData(l.under, e.mpadded(u).With(o).With({
voffset: "-.24em"
}))), this.Push(l);
},
GetDelimiterArg: function(e) {
var n = this.trimSpaces(this.GetArgument(e));
return n == "" ? null : (r.delimiter[n] == null && t.Error("Missing or unrecognized delimiter for " + e), this.convertDelimiter(n));
},
GetStar: function() {
var e = this.GetNext() === "*";
return e && this.i++, e;
}
}), i.Augment({
autoTag: function() {
var r = this.global;
if (!r.notag) {
n.number++, r.tagID = s.formatNumber(n.number.toString());
var i = t.Parse("\\text{" + s.formatTag(r.tagID) + "}", {}).mml();
r.tag = e.mtd(i.With({
id: s.formatID(r.tagID)
}));
}
},
getTag: function() {
var e = this.global, t = e.tag;
return e.tagged = !0, e.label && (n.eqlabels[e.label] = e.tagID, s.useLabelIds && (t.id = s.formatID(e.label))), delete e.tag, delete e.tagID, delete e.label, t;
}
}), i.multline = i.array.Subclass({
type: "multline",
Init: function(e, t) {
this.SUPER(arguments).Init.apply(this), this.numbered = e && s.autoNumber !== "none", this.save = {
notag: t.global.notag
}, t.global.tagged = !e && !t.global.forcetag;
},
EndEntry: function() {
var t = e.mtd.apply(e, this.data);
this.data.shove && (t.columnalign = this.data.shove), this.row.push(t), this.data = [];
},
EndRow: function() {
this.row.length != 1 && t.Error("multline rows must have exactly one column"), this.table.push(this.row), this.row = [];
},
EndTable: function() {
this.SUPER(arguments).EndTable.call(this);
if (this.table.length) {
var t = this.table.length - 1, n, r = -1;
this.table[0][0].columnalign || (this.table[0][0].columnalign = e.ALIGN.LEFT), this.table[t][0].columnalign || (this.table[t][0].columnalign = e.ALIGN.RIGHT), !this.global.tag && this.numbered && this.autoTag(), this.global.tag && !this.global.notags && (r = this.arraydef.side === "left" ? 0 : this.table.length - 1, this.table[r] = [ this.getTag() ].concat(this.table[r]));
for (n = 0, t = this.table.length; n < t; n++) {
var i = n === r ? e.mlabeledtr : e.mtr;
this.table[n] = i.apply(e, this.table[n]);
}
}
this.global.notag = this.save.notag;
}
}), i.AMSarray = i.array.Subclass({
type: "AMSarray",
Init: function(e, t, n, r) {
this.SUPER(arguments).Init.apply(this), this.numbered = t && s.autoNumber !== "none", this.save = {
notags: r.global.notags,
notag: r.global.notag
}, r.global.notags = n ? null : e, r.global.tagged = !t && !r.global.forcetag;
},
EndRow: function() {
var t = e.mtr;
!this.global.tag && this.numbered && this.autoTag(), this.global.tag && !this.global.notags && (this.row = [ this.getTag() ].concat(this.row), t = e.mlabeledtr), this.numbered && delete this.global.notag, this.table.push(t.apply(e, this.row)), this.row = [];
},
EndTable: function() {
this.SUPER(arguments).EndTable.call(this), this.global.notags = this.save.notags, this.global.notag = this.save.notag;
}
}), i.start.Augment({
oldCheckItem: i.start.prototype.checkItem,
checkItem: function(r) {
if (r.type === "stop") {
var o = this.mmlData(), u = this.global;
n.display && !u.tag && !u.tagged && !u.isInner && (s.autoNumber === "all" || u.forcetag) && this.autoTag();
if (u.tag) {
var l = [ this.getTag(), e.mtd(o) ], c = {
side: t.config.TagSide,
minlabelspacing: t.config.TagIndent,
columnalign: o.displayAlign
};
o.displayAlign === e.INDENTALIGN.LEFT ? (c.width = "100%", o.displayIndent && !String(o.displayIndent).match(/^0+(\.0*)?($|[a-z%])/) && (c.columnwidth = o.displayIndent + " fit", c.columnspacing = "0", l = [ l[0], e.mtd(), l[1] ])) : o.displayAlign === e.INDENTALIGN.RIGHT && (c.width = "100%", o.displayIndent && !String(o.displayIndent).match(/^0+(\.0*)?($|[a-z%])/) && (c.columnwidth = "fit " + o.displayIndent, c.columnspacing = "0", l[2] = e.mtd())), o = e.mtable(e.mlabeledtr.apply(e, l)).With(c);
}
return i.mml(o);
}
return this.oldCheckItem.call(this, r);
}
}), t.prefilterHooks.Add(function(e) {
n.display = e.display, n.number = n.startNumber, n.eqlabels = {}, n.badref = !1, n.refUpdate && (n.number = e.script.MathJax.startNumber);
}), t.postfilterHooks.Add(function(e) {
e.script.MathJax.startNumber = n.startNumber, n.startNumber = n.number, MathJax.Hub.Insert(n.labels, n.eqlabels), n.badref && !e.math.texError && n.refs.push(e.script);
}), MathJax.Hub.Register.MessageHook("Begin Math Input", function() {
n.refs = [], n.refUpdate = !1;
}), MathJax.Hub.Register.MessageHook("End Math Input", function(e) {
if (n.refs.length) {
n.refUpdate = !0;
for (var t = 0, r = n.refs.length; t < r; t++) n.refs[t].MathJax.state = MathJax.ElementJax.STATE.UPDATE;
return MathJax.Hub.processInput({
scripts: n.refs,
start: (new Date).getTime(),
i: 0,
j: 0,
jax: {},
jaxIDs: []
});
}
return null;
}), t.resetEquationNumbers = function(e, t) {
n.startNumber = e || 0, t || (n.labels = {});
}, MathJax.Hub.Startup.signal.Post("TeX AMSmath Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSmath.js"), MathJax.Extension["TeX/AMSsymbols"] = {
version: "2.1"
}, MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = MathJax.ElementJax.mml, t = MathJax.InputJax.TeX.Definitions;
t.Add({
mathchar0mi: {
digamma: "03DD",
varkappa: "03F0",
varGamma: [ "0393", {
mathvariant: e.VARIANT.ITALIC
} ],
varDelta: [ "0394", {
mathvariant: e.VARIANT.ITALIC
} ],
varTheta: [ "0398", {
mathvariant: e.VARIANT.ITALIC
} ],
varLambda: [ "039B", {
mathvariant: e.VARIANT.ITALIC
} ],
varXi: [ "039E", {
mathvariant: e.VARIANT.ITALIC
} ],
varPi: [ "03A0", {
mathvariant: e.VARIANT.ITALIC
} ],
varSigma: [ "03A3", {
mathvariant: e.VARIANT.ITALIC
} ],
varUpsilon: [ "03A5", {
mathvariant: e.VARIANT.ITALIC
} ],
varPhi: [ "03A6", {
mathvariant: e.VARIANT.ITALIC
} ],
varPsi: [ "03A8", {
mathvariant: e.VARIANT.ITALIC
} ],
varOmega: [ "03A9", {
mathvariant: e.VARIANT.ITALIC
} ],
beth: "2136",
gimel: "2137",
daleth: "2138",
backprime: [ "2035", {
variantForm: !0
} ],
hslash: "210F",
varnothing: [ "2205", {
variantForm: !0
} ],
blacktriangle: "25B4",
triangledown: [ "25BD", {
variantForm: !0
} ],
blacktriangledown: "25BE",
square: "25FB",
Box: "25FB",
blacksquare: "25FC",
lozenge: "25CA",
Diamond: "25CA",
blacklozenge: "29EB",
circledS: [ "24C8", {
mathvariant: e.VARIANT.NORMAL
} ],
bigstar: "2605",
sphericalangle: "2222",
measuredangle: "2221",
nexists: "2204",
complement: "2201",
mho: "2127",
eth: [ "00F0", {
mathvariant: e.VARIANT.NORMAL
} ],
Finv: "2132",
diagup: "2571",
Game: "2141",
diagdown: "2572",
Bbbk: [ "006B", {
mathvariant: e.VARIANT.DOUBLESTRUCK
} ],
yen: "00A5",
circledR: "00AE",
checkmark: "2713",
maltese: "2720"
},
mathchar0mo: {
dotplus: "2214",
ltimes: "22C9",
smallsetminus: "2216",
rtimes: "22CA",
Cap: "22D2",
doublecap: "22D2",
leftthreetimes: "22CB",
Cup: "22D3",
doublecup: "22D3",
rightthreetimes: "22CC",
barwedge: "22BC",
curlywedge: "22CF",
veebar: "22BB",
curlyvee: "22CE",
doublebarwedge: "2A5E",
boxminus: "229F",
circleddash: "229D",
boxtimes: "22A0",
circledast: "229B",
boxdot: "22A1",
circledcirc: "229A",
boxplus: "229E",
centerdot: "22C5",
divideontimes: "22C7",
intercal: "22BA",
leqq: "2266",
geqq: "2267",
leqslant: "2A7D",
geqslant: "2A7E",
eqslantless: "2A95",
eqslantgtr: "2A96",
lesssim: "2272",
gtrsim: "2273",
lessapprox: "2A85",
gtrapprox: "2A86",
approxeq: "224A",
lessdot: "22D6",
gtrdot: "22D7",
lll: "22D8",
llless: "22D8",
ggg: "22D9",
gggtr: "22D9",
lessgtr: "2276",
gtrless: "2277",
lesseqgtr: "22DA",
gtreqless: "22DB",
lesseqqgtr: "2A8B",
gtreqqless: "2A8C",
doteqdot: "2251",
Doteq: "2251",
eqcirc: "2256",
risingdotseq: "2253",
circeq: "2257",
fallingdotseq: "2252",
triangleq: "225C",
backsim: "223D",
thicksim: [ "223C", {
variantForm: !0
} ],
backsimeq: "22CD",
thickapprox: [ "2248", {
variantForm: !0
} ],
subseteqq: "2AC5",
supseteqq: "2AC6",
Subset: "22D0",
Supset: "22D1",
sqsubset: "228F",
sqsupset: "2290",
preccurlyeq: "227C",
succcurlyeq: "227D",
curlyeqprec: "22DE",
curlyeqsucc: "22DF",
precsim: "227E",
succsim: "227F",
precapprox: "2AB7",
succapprox: "2AB8",
vartriangleleft: "22B2",
lhd: "22B2",
vartriangleright: "22B3",
rhd: "22B3",
trianglelefteq: "22B4",
unlhd: "22B4",
trianglerighteq: "22B5",
unrhd: "22B5",
vDash: "22A8",
Vdash: "22A9",
Vvdash: "22AA",
smallsmile: "2323",
shortmid: [ "2223", {
variantForm: !0
} ],
smallfrown: "2322",
shortparallel: [ "2225", {
variantForm: !0
} ],
bumpeq: "224F",
between: "226C",
Bumpeq: "224E",
pitchfork: "22D4",
varpropto: "221D",
backepsilon: "220D",
blacktriangleleft: "25C2",
blacktriangleright: "25B8",
therefore: "2234",
because: "2235",
eqsim: "2242",
vartriangle: [ "25B3", {
variantForm: !0
} ],
Join: "22C8",
nless: "226E",
ngtr: "226F",
nleq: "2270",
ngeq: "2271",
nleqslant: [ "2A87", {
variantForm: !0
} ],
ngeqslant: [ "2A88", {
variantForm: !0
} ],
nleqq: [ "2270", {
variantForm: !0
} ],
ngeqq: [ "2271", {
variantForm: !0
} ],
lneq: "2A87",
gneq: "2A88",
lneqq: "2268",
gneqq: "2269",
lvertneqq: [ "2268", {
variantForm: !0
} ],
gvertneqq: [ "2269", {
variantForm: !0
} ],
lnsim: "22E6",
gnsim: "22E7",
lnapprox: "2A89",
gnapprox: "2A8A",
nprec: "2280",
nsucc: "2281",
npreceq: [ "22E0", {
variantForm: !0
} ],
nsucceq: [ "22E1", {
variantForm: !0
} ],
precneqq: "2AB5",
succneqq: "2AB6",
precnsim: "22E8",
succnsim: "22E9",
precnapprox: "2AB9",
succnapprox: "2ABA",
nsim: "2241",
ncong: "2246",
nshortmid: [ "2224", {
variantForm: !0
} ],
nshortparallel: [ "2226", {
variantForm: !0
} ],
nmid: "2224",
nparallel: "2226",
nvdash: "22AC",
nvDash: "22AD",
nVdash: "22AE",
nVDash: "22AF",
ntriangleleft: "22EA",
ntriangleright: "22EB",
ntrianglelefteq: "22EC",
ntrianglerighteq: "22ED",
nsubseteq: "2288",
nsupseteq: "2289",
nsubseteqq: [ "2288", {
variantForm: !0
} ],
nsupseteqq: [ "2289", {
variantForm: !0
} ],
subsetneq: "228A",
supsetneq: "228B",
varsubsetneq: [ "228A", {
variantForm: !0
} ],
varsupsetneq: [ "228B", {
variantForm: !0
} ],
subsetneqq: "2ACB",
supsetneqq: "2ACC",
varsubsetneqq: [ "2ACB", {
variantForm: !0
} ],
varsupsetneqq: [ "2ACC", {
variantForm: !0
} ],
leftleftarrows: "21C7",
rightrightarrows: "21C9",
leftrightarrows: "21C6",
rightleftarrows: "21C4",
Lleftarrow: "21DA",
Rrightarrow: "21DB",
twoheadleftarrow: "219E",
twoheadrightarrow: "21A0",
leftarrowtail: "21A2",
rightarrowtail: "21A3",
looparrowleft: "21AB",
looparrowright: "21AC",
leftrightharpoons: "21CB",
rightleftharpoons: [ "21CC", {
variantForm: !0
} ],
curvearrowleft: "21B6",
curvearrowright: "21B7",
circlearrowleft: "21BA",
circlearrowright: "21BB",
Lsh: "21B0",
Rsh: "21B1",
upuparrows: "21C8",
downdownarrows: "21CA",
upharpoonleft: "21BF",
upharpoonright: "21BE",
downharpoonleft: "21C3",
restriction: "21BE",
multimap: "22B8",
downharpoonright: "21C2",
leftrightsquigarrow: "21AD",
rightsquigarrow: "21DD",
leadsto: "21DD",
dashrightarrow: "21E2",
dashleftarrow: "21E0",
nleftarrow: "219A",
nrightarrow: "219B",
nLeftarrow: "21CD",
nRightarrow: "21CF",
nleftrightarrow: "21AE",
nLeftrightarrow: "21CE"
},
delimiter: {
"\\ulcorner": "231C",
"\\urcorner": "231D",
"\\llcorner": "231E",
"\\lrcorner": "231F"
},
macros: {
implies: [ "Macro", "\\;\\Longrightarrow\\;" ],
impliedby: [ "Macro", "\\;\\Longleftarrow\\;" ]
}
}, null, !0);
var n = e.mo.OPTYPES.REL;
MathJax.Hub.Insert(e.mo.prototype, {
OPTABLE: {
infix: {
"\u2322": n,
"\u2323": n,
"\u25b3": n,
"\ue006": n,
"\ue007": n,
"\ue00c": n,
"\ue00d": n,
"\ue00e": n,
"\ue00f": n,
"\ue010": n,
"\ue011": n,
"\ue016": n,
"\ue017": n,
"\ue018": n,
"\ue019": n,
"\ue01a": n,
"\ue01b": n,
"\ue04b": n,
"\ue04f": n
}
}
}), MathJax.Hub.Startup.signal.Post("TeX AMSsymbols Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSsymbols.js"), function(e, t) {
var n = "2.1", r = e.CombineConfig("TeX.noErrors", {
disabled: !1,
multiLine: !0,
inlineDelimiters: [ "", "" ],
style: {
"font-size": "90%",
"text-align": "left",
color: "black",
padding: "1px 3px",
border: "1px solid"
}
}), i = "\u00a0";
MathJax.Extension["TeX/noErrors"] = {
version: n,
config: r
}, e.Register.StartupHook("TeX Jax Ready", function() {
var t = MathJax.InputJax.TeX.formatError;
MathJax.InputJax.TeX.Augment({
formatError: function(n, s, o, u) {
if (r.disabled) return t.apply(this, arguments);
var l = n.message.replace(/\n.*/, "");
e.signal.Post([ "TeX Jax - parse error", l, s, o, u ]);
var h = r.inlineDelimiters, p = o || r.multiLine;
return o || (s = h[0] + s + h[1]), p ? s = s.replace(/ /g, i) : s = s.replace(/\n/g, " "), MathJax.ElementJax.mml.merror(s).With({
isError: !0,
multiLine: p
});
}
});
}), e.Register.StartupHook("HTML-CSS Jax Config", function() {
e.Config({
"HTML-CSS": {
styles: {
".MathJax .noError": e.Insert({
"vertical-align": e.Browser.isMSIE && r.multiLine ? "-2px" : ""
}, r.style)
}
}
});
}), e.Register.StartupHook("HTML-CSS Jax Ready", function() {
var e = MathJax.ElementJax.mml, t = MathJax.OutputJax["HTML-CSS"], n = e.math.prototype.toHTML, r = e.merror.prototype.toHTML;
e.math.Augment({
toHTML: function(e, t) {
var r = this.data[0];
return r && r.data[0] && r.data[0].isError ? (e.style.fontSize = "", e = this.HTMLcreateSpan(e), e.bbox = r.data[0].toHTML(e).bbox) : e = n.call(this, e, t), e;
}
}), e.merror.Augment({
toHTML: function(e) {
if (!this.isError) return r.call(this, e);
e = this.HTMLcreateSpan(e), e.className = "noError", this.multiLine && (e.style.display = "inline-block");
var n = this.data[0].data[0].data.join("").split(/\n/);
for (var i = 0, s = n.length; i < s; i++) t.addText(e, n[i]), i !== s - 1 && t.addElement(e, "br", {
isMathJax: !0
});
var o = t.getHD(e.parentNode), u = t.getW(e.parentNode);
if (s > 1) {
var a = (o.h + o.d) / 2, f = t.TeX.x_height / 2;
e.parentNode.style.verticalAlign = t.Em(o.d + (f - a)), o.h = f + a, o.d = a - f;
}
return e.bbox = {
h: o.h,
d: o.d,
w: u,
lw: 0,
rw: u
}, e;
}
});
}), e.Register.StartupHook("SVG Jax Config", function() {
e.Config({
SVG: {
styles: {
".MathJax_SVG .noError": e.Insert({
"vertical-align": e.Browser.isMSIE && r.multiLine ? "-2px" : ""
}, r.style)
}
}
});
}), e.Register.StartupHook("SVG Jax Ready", function() {
var e = MathJax.ElementJax.mml, n = e.math.prototype.toSVG, r = e.merror.prototype.toSVG;
e.math.Augment({
toSVG: function(e, t) {
var r = this.data[0];
return r && r.data[0] && r.data[0].isError ? e = r.data[0].toSVG(e) : e = n.call(this, e, t), e;
}
}), e.merror.Augment({
toSVG: function(e) {
if (!this.isError || this.Parent().type !== "math") return r.call(this, e);
e = t.addElement(e, "span", {
className: "noError",
isMathJax: !0
}), this.multiLine && (e.style.display = "inline-block");
var n = this.data[0].data[0].data.join("").split(/\n/);
for (var i = 0, s = n.length; i < s; i++) t.addText(e, n[i]), i !== s - 1 && t.addElement(e, "br", {
isMathJax: !0
});
if (s > 1) {
var o = e.offsetHeight / 2;
e.style.verticalAlign = -o + o / s + "px";
}
return e;
}
});
}), e.Register.StartupHook("NativeMML Jax Ready", function() {
var e = MathJax.ElementJax.mml, t = MathJax.Extension["TeX/noErrors"].config, n = e.math.prototype.toNativeMML, r = e.merror.prototype.toNativeMML;
e.math.Augment({
toNativeMML: function(e) {
var t = this.data[0];
return t && t.data[0] && t.data[0].isError ? e = t.data[0].toNativeMML(e) : e = n.call(this, e), e;
}
}), e.merror.Augment({
toNativeMML: function(e) {
if (!this.isError) return r.call(this, e);
e = e.appendChild(document.createElement("span"));
var n = this.data[0].data[0].data.join("").split(/\n/);
for (var i = 0, s = n.length; i < s; i++) e.appendChild(document.createTextNode(n[i])), i !== s - 1 && e.appendChild(document.createElement("br"));
this.multiLine && (e.style.display = "inline-block", s > 1 && (e.style.verticalAlign = "middle"));
for (var o in t.style) if (t.style.hasOwnProperty(o)) {
var u = o.replace(/-./g, function(e) {
return e.charAt(1).toUpperCase();
});
e.style[u] = t.style[o];
}
return e;
}
});
}), e.Startup.signal.Post("TeX noErrors Ready");
}(MathJax.Hub, MathJax.HTML), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noErrors.js"), MathJax.Extension["TeX/noUndefined"] = {
version: "2.1",
config: MathJax.Hub.CombineConfig("TeX.noUndefined", {
disabled: !1,
attributes: {
mathcolor: "red"
}
})
}, MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = MathJax.Extension["TeX/noUndefined"].config, t = MathJax.ElementJax.mml, n = MathJax.InputJax.TeX.Parse.prototype.csUndefined;
MathJax.InputJax.TeX.Parse.Augment({
csUndefined: function(r) {
if (e.disabled) return n.apply(this, arguments);
MathJax.Hub.signal.Post([ "TeX Jax - undefined control sequence", r ]), this.Push(t.mtext(r).With(e.attributes));
}
}), MathJax.Hub.Startup.signal.Post("TeX noUndefined Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noUndefined.js"), MathJax.Extension["TeX/newcommand"] = {
version: "2.1"
}, MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = MathJax.InputJax.TeX, t = e.Definitions;
t.Add({
macros: {
newcommand: "NewCommand",
renewcommand: "NewCommand",
newenvironment: "NewEnvironment",
renewenvironment: "NewEnvironment",
def: "MacroDef",
let: "Let"
}
}, null, !0), e.Parse.Augment({
NewCommand: function(t) {
var n = this.trimSpaces(this.GetArgument(t)), r = this.GetBrackets(t), i = this.GetBrackets(t), s = this.GetArgument(t);
n.charAt(0) === "\\" && (n = n.substr(1)), n.match(/^(.|[a-z]+)$/i) || e.Error("Illegal control sequence name for " + t), r && (r = this.trimSpaces(r), r.match(/^[0-9]+$/) || e.Error("Illegal number of parameters specified in " + t)), this.setDef(n, [ "Macro", s, r, i ]);
},
NewEnvironment: function(t) {
var n = this.trimSpaces(this.GetArgument(t)), r = this.GetBrackets(t), i = this.GetArgument(t), s = this.GetArgument(t);
r && (r = this.trimSpaces(r), r.match(/^[0-9]+$/) || e.Error("Illegal number of parameters specified in " + t)), this.setEnv(n, [ "BeginEnv", "EndEnv", i, s, r ]);
},
MacroDef: function(e) {
var t = this.GetCSname(e), n = this.GetTemplate(e, "\\" + t), r = this.GetArgument(e);
n instanceof Array ? this.setDef(t, [ "MacroWithTemplate", r ].concat(n)) : this.setDef(t, [ "Macro", r, n ]);
},
Let: function(e) {
var n = this.GetCSname(e), r, i = this.GetNext();
i === "=" && (this.i++, i = this.GetNext()), i === "\\" ? (e = this.GetCSname(e), r = this.csFindMacro(e), r || (t.mathchar0mi[e] ? r = [ "csMathchar0mi", t.mathchar0mi[e] ] : t.mathchar0mo[e] ? r = [ "csMathchar0mo", t.mathchar0mo[e] ] : t.mathchar7[e] ? r = [ "csMathchar7", t.mathchar7[e] ] : t.delimiter["\\" + e] != null && (r = [ "csDelimiter", t.delimiter["\\" + e] ]))) : (r = [ "Macro", i ], this.i++), this.setDef(n, r);
},
setDef: function(e, n) {
n.isUser = !0, t.macros[e] = n;
},
setEnv: function(e, n) {
n.isUser = !0, t.environment[e] = n;
},
GetCSname: function(t) {
var n = this.GetNext();
n !== "\\" && e.Error("\\ must be followed by a control sequence");
var r = this.trimSpaces(this.GetArgument(t));
return r.substr(1);
},
GetTemplate: function(t, n) {
var r, i = [], s = 0;
r = this.GetNext();
var o = this.i;
while (this.i < this.string.length) {
r = this.GetNext();
if (r === "#") o !== this.i && (i[s] = this.string.substr(o, this.i - o)), r = this.string.charAt(++this.i), r.match(/^[1-9]$/) || e.Error("Illegal use of # in template for " + n), parseInt(r) != ++s && e.Error("Parameters for " + n + " must be numbered sequentially"), o = this.i + 1; else if (r === "{") return o !== this.i && (i[s] = this.string.substr(o, this.i - o)), i.length > 0 ? [ s, i ] : s;
this.i++;
}
e.Error("Missing replacement string for definition of " + t);
},
MacroWithTemplate: function(t, n, r, i) {
if (r) {
var s = [];
this.GetNext(), i[0] && !this.MatchParam(i[0]) && e.Error("Use of " + t + " doesn't match its definition");
for (var o = 0; o < r; o++) s.push(this.GetParameter(t, i[o + 1]));
n = this.SubstituteArgs(s, n);
}
this.string = this.AddArgs(n, this.string.slice(this.i)), this.i = 0, ++this.macroCount > e.config.MAXMACROS && e.Error("MathJax maximum macro substitution count exceeded; is there a recursive macro call?");
},
BeginEnv: function(e, t, n, r) {
if (r) {
var i = [];
for (var s = 0; s < r; s++) i.push(this.GetArgument("\\begin{" + name + "}"));
t = this.SubstituteArgs(i, t), n = this.SubstituteArgs(i, n);
}
return e.edef = n, this.string = this.AddArgs(t, this.string.slice(this.i)), this.i = 0, e;
},
EndEnv: function(e, t) {
return this.string = this.AddArgs(e.edef, this.string.slice(this.i)), this.i = 0, t;
},
GetParameter: function(t, n) {
if (n == null) return this.GetArgument(t);
var r = this.i, i = 0, s = 0;
while (this.i < this.string.length) if (this.string.charAt(this.i) === "{") this.i === r && (s = 1), this.GetArgument(t), i = this.i - r; else {
if (this.MatchParam(n)) return s && (r++, i -= 2), this.string.substr(r, i);
this.i++, i++, s = 0;
}
e.Error("Runaway argument for " + t + "?");
},
MatchParam: function(e) {
return this.string.substr(this.i, e.length) !== e ? 0 : (this.i += e.length, 1);
}
}), e.Environment = function(e) {
t.environment[e] = [ "BeginEnv", "EndEnv" ].concat([].slice.call(arguments, 1)), t.environment[e].isUser = !0;
}, MathJax.Hub.Startup.signal.Post("TeX newcommand Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/newcommand.js"), MathJax.Extension["TeX/boldsymbol"] = {
version: "2.1"
}, MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = MathJax.ElementJax.mml, t = MathJax.InputJax.TeX, n = t.Definitions, r = {};
r[e.VARIANT.NORMAL] = e.VARIANT.BOLD, r[e.VARIANT.ITALIC] = e.VARIANT.BOLDITALIC, r[e.VARIANT.FRAKTUR] = e.VARIANT.BOLDFRAKTUR, r[e.VARIANT.SCRIPT] = e.VARIANT.BOLDSCRIPT, r[e.VARIANT.SANSSERIF] = e.VARIANT.BOLDSANSSERIF, r["-tex-caligraphic"] = "-tex-caligraphic-bold", r["-tex-oldstyle"] = "-tex-oldstyle-bold", n.Add({
macros: {
boldsymbol: "Boldsymbol"
}
}, null, !0), t.Parse.Augment({
mmlToken: function(t) {
if (this.stack.env.boldsymbol) {
var n = t.Get("mathvariant");
n == null ? t.mathvariant = e.VARIANT.BOLD : t.mathvariant = r[n] || n;
}
return t;
},
Boldsymbol: function(e) {
var t = this.stack.env.boldsymbol, n = this.stack.env.font;
this.stack.env.boldsymbol = !0, this.stack.env.font = null;
var r = this.ParseArg(e);
this.stack.env.font = n, this.stack.env.boldsymbol = t, this.Push(r);
}
}), MathJax.Hub.Startup.signal.Post("TeX boldsymbol Ready");
}), MathJax.Hub.Register.StartupHook("HTML-CSS Jax Ready", function() {
var e = MathJax.OutputJax["HTML-CSS"], t = e.FONTDATA.FONTS, n = e.FONTDATA.VARIANT;
e.fontInUse === "TeX" ? (t["MathJax_Caligraphic-bold"] = "Caligraphic/Bold/Main.js", n["-tex-caligraphic-bold"] = {
fonts: [ "MathJax_Caligraphic-bold", "MathJax_Main-bold", "MathJax_Main", "MathJax_Math", "MathJax_Size1" ],
offsetA: 65,
variantA: "bold-italic"
}, n["-tex-oldstyle-bold"] = {
fonts: [ "MathJax_Caligraphic-bold", "MathJax_Main-bold", "MathJax_Main", "MathJax_Math", "MathJax_Size1" ]
}, e.msieCheckGreek && e.Font.testFont({
family: "MathJax_Greek",
weight: "bold",
style: "italic",
testString: e.msieCheckGreek
}) && (n["bold-italic"].offsetG = 913, n["bold-italic"].variantG = "-Greek-Bold-Italic", n["-Greek-Bold-Italic"] = {
fonts: [ "MathJax_Greek-bold-italic" ]
}, t["MathJax_Greek-bold-italic"] = "Greek/BoldItalic/Main.js"), MathJax.Hub.Browser.isChrome && !MathJax.Hub.Browser.versionAtLeast("5.0") && (n["-tex-caligraphic-bold"].remap = {
84: [ 58096, "-WinChrome" ]
})) : e.fontInUse === "STIX" && (n["-tex-caligraphic-bold"] = {
fonts: [ "STIXGeneral-bold-italic", "STIXNonUnicode-bold-italic", "STIXNonUnicode", "STIXGeneral", "STIXSizeOneSym" ],
offsetA: 57927,
noLowerCase: 1
}, n["-tex-oldstyle-bold"] = {
fonts: [ "STIXGeneral-bold", "STIXNonUnicode-bold", "STIXGeneral", "STIXSizeOneSym" ],
offsetN: 57955,
remap: {
57956: 57959,
57957: 57963,
57958: 57967,
57959: 57971,
57960: 57975,
57961: 57979,
57962: 57983,
57963: 57987,
57964: 57991
}
});
}), MathJax.Hub.Register.StartupHook("SVG Jax Ready", function() {
var e = MathJax.OutputJax.SVG, t = e.FONTDATA.FONTS, n = e.FONTDATA.VARIANT;
t["MathJax_Caligraphic-bold"] = "Caligraphic/Bold/Main.js", n["-tex-caligraphic-bold"] = {
fonts: [ "MathJax_Caligraphic-bold", "MathJax_Main-bold", "MathJax_Main", "MathJax_Math", "MathJax_Size1" ],
offsetA: 65,
variantA: "bold-italic"
}, n["-tex-oldstyle-bold"] = {
fonts: [ "MathJax_Caligraphic-bold", "MathJax_Main-bold", "MathJax_Main", "MathJax_Math", "MathJax_Size1" ]
};
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/boldsymbol.js"), MathJax.Extension.tex2jax = {
version: "2.1",
config: {
inlineMath: [ [ "\\(", "\\)" ] ],
displayMath: [ [ "$$", "$$" ], [ "\\[", "\\]" ] ],
balanceBraces: !0,
skipTags: [ "script", "noscript", "style", "textarea", "pre", "code" ],
ignoreClass: "tex2jax_ignore",
processClass: "tex2jax_process",
processEscapes: !1,
processEnvironments: !0,
processRefs: !0,
preview: "TeX"
},
PreProcess: function(e) {
this.configured || (this.config = MathJax.Hub.CombineConfig("tex2jax", this.config), this.config.Augment && MathJax.Hub.Insert(this, this.config.Augment), typeof this.config.previewTeX != "undefined" && !this.config.previewTeX && (this.config.preview = "none"), this.configured = !0), typeof e == "string" && (e = document.getElementById(e)), e || (e = document.body), this.createPatterns() && this.scanElement(e, e.nextSibling);
},
createPatterns: function() {
var e = [], t = [], n, r, i = this.config;
this.match = {};
for (n = 0, r = i.inlineMath.length; n < r; n++) e.push(this.patternQuote(i.inlineMath[n][0])), this.match[i.inlineMath[n][0]] = {
mode: "",
end: i.inlineMath[n][1],
pattern: this.endPattern(i.inlineMath[n][1])
};
for (n = 0, r = i.displayMath.length; n < r; n++) e.push(this.patternQuote(i.displayMath[n][0])), this.match[i.displayMath[n][0]] = {
mode: "; mode=display",
end: i.displayMath[n][1],
pattern: this.endPattern(i.displayMath[n][1])
};
return e.length && t.push(e.sort(this.sortLength).join("|")), i.processEnvironments && t.push("\\\\begin\\{([^}]*)\\}"), i.processEscapes && t.push("\\\\*\\\\\\$"), i.processRefs && t.push("\\\\(eq)?ref\\{[^}]*\\}"), this.start = new RegExp(t.join("|"), "g"), this.skipTags = new RegExp("^(" + i.skipTags.join("|") + ")$", "i"), this.ignoreClass = new RegExp("(^| )(" + i.ignoreClass + ")( |$)"), this.processClass = new RegExp("(^| )(" + i.processClass + ")( |$)"), t.length > 0;
},
patternQuote: function(e) {
return e.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, "\\$1");
},
endPattern: function(e) {
return new RegExp(this.patternQuote(e) + "|\\\\.|[{}]", "g");
},
sortLength: function(e, t) {
return e.length !== t.length ? t.length - e.length : e == t ? 0 : e < t ? -1 : 1;
},
scanElement: function(e, t, n) {
var r, i, s, o;
while (e && e != t) e.nodeName.toLowerCase() === "#text" ? n || (e = this.scanText(e)) : (r = typeof e.className == "undefined" ? "" : e.className, i = typeof e.tagName == "undefined" ? "" : e.tagName, typeof r != "string" && (r = String(r)), o = this.processClass.exec(r), e.firstChild && !r.match(/(^| )MathJax/) && (o || !this.skipTags.exec(i)) && (s = (n || this.ignoreClass.exec(r)) && !o, this.scanElement(e.firstChild, t, s))), e && (e = e.nextSibling);
},
scanText: function(e) {
if (e.nodeValue.replace(/\s+/, "") == "") return e;
var t, n;
this.search = {
start: !0
}, this.pattern = this.start;
while (e) {
this.pattern.lastIndex = 0;
while (e && e.nodeName.toLowerCase() === "#text" && (t = this.pattern.exec(e.nodeValue))) this.search.start ? e = this.startMatch(t, e) : e = this.endMatch(t, e);
this.search.matched && (e = this.encloseMath(e));
if (e) {
do n = e, e = e.nextSibling; while (e && (e.nodeName.toLowerCase() === "br" || e.nodeName.toLowerCase() === "#comment"));
if (!e || e.nodeName !== "#text") return this.search.close ? this.prevEndMatch() : n;
}
}
return e;
},
startMatch: function(e, t) {
var n = this.match[e[0]];
if (n != null) this.search = {
end: n.end,
mode: n.mode,
pcount: 0,
open: t,
olen: e[0].length,
opos: this.pattern.lastIndex - e[0].length
}, this.switchPattern(n.pattern); else if (e[0].substr(0, 6) === "\\begin") this.search = {
end: "\\end{" + e[1] + "}",
mode: "; mode=display",
pcount: 0,
open: t,
olen: 0,
opos: this.pattern.lastIndex - e[0].length,
isBeginEnd: !0
}, this.switchPattern(this.endPattern(this.search.end)); else {
if (e[0].substr(0, 4) === "\\ref" || e[0].substr(0, 6) === "\\eqref") return this.search = {
mode: "",
end: "",
open: t,
pcount: 0,
olen: 0,
opos: this.pattern.lastIndex - e[0].length
}, this.endMatch([ "" ], t);
var r = e[0].substr(0, e[0].length - 1), i, s;
r.length % 2 === 0 ? (s = [ r.replace(/\\\\/g, "\\") ], i = 1) : (s = [ r.substr(1).replace(/\\\\/g, "\\"), "$" ], i = 0), s = MathJax.HTML.Element("span", null, s);
var o = MathJax.HTML.TextNode(t.nodeValue.substr(0, e.index));
t.nodeValue = t.nodeValue.substr(e.index + e[0].length - i), t.parentNode.insertBefore(s, t), t.parentNode.insertBefore(o, s), this.pattern.lastIndex = i;
}
return t;
},
endMatch: function(e, t) {
var n = this.search;
if (e[0] == n.end) {
if (!n.close || n.pcount === 0) n.close = t, n.cpos = this.pattern.lastIndex, n.clen = n.isBeginEnd ? 0 : e[0].length;
n.pcount === 0 && (n.matched = !0, t = this.encloseMath(t), this.switchPattern(this.start));
} else e[0] === "{" ? n.pcount++ : e[0] === "}" && n.pcount && n.pcount--;
return t;
},
prevEndMatch: function() {
this.search.matched = !0;
var e = this.encloseMath(this.search.close);
return this.switchPattern(this.start), e;
},
switchPattern: function(e) {
e.lastIndex = this.pattern.lastIndex, this.pattern = e, this.search.start = e === this.start;
},
encloseMath: function(e) {
var t = this.search, n = t.close, r, i;
t.cpos === n.length ? n = n.nextSibling : n = n.splitText(t.cpos), n || (r = n = MathJax.HTML.addText(t.close.parentNode, "")), t.close = n, i = t.opos ? t.open.splitText(t.opos) : t.open;
while (i.nextSibling && i.nextSibling !== n) i.nextSibling.nodeValue !== null ? i.nextSibling.nodeName === "#comment" ? i.nodeValue += i.nextSibling.nodeValue.replace(/^\[CDATA\[((.|\n|\r)*)\]\]$/, "$1") : i.nodeValue += i.nextSibling.nodeValue : this.msieNewlineBug ? i.nodeValue += i.nextSibling.nodeName.toLowerCase() === "br" ? "\n" : " " : i.nodeValue += " ", i.parentNode.removeChild(i.nextSibling);
var s = i.nodeValue.substr(t.olen, i.nodeValue.length - t.olen - t.clen);
return i.parentNode.removeChild(i), this.config.preview !== "none" && this.createPreview(t.mode, s), i = this.createMathTag(t.mode, s), this.search = {}, this.pattern.lastIndex = 0, r && r.parentNode.removeChild(r), i;
},
insertNode: function(e) {
var t = this.search;
t.close.parentNode.insertBefore(e, t.close);
},
createPreview: function(e, t) {
var n;
this.config.preview === "TeX" ? n = [ this.filterPreview(t) ] : this.config.preview instanceof Array && (n = this.config.preview), n && (n = MathJax.HTML.Element("span", {
className: MathJax.Hub.config.preRemoveClass
}, n), this.insertNode(n));
},
createMathTag: function(e, t) {
var n = document.createElement("script");
return n.type = "math/tex" + e, MathJax.HTML.setScript(n, t), this.insertNode(n), n;
},
filterPreview: function(e) {
return e;
},
msieNewlineBug: MathJax.Hub.Browser.isMSIE && document.documentMode < 9
}, MathJax.Hub.Register.PreProcessor([ "PreProcess", MathJax.Extension.tex2jax ]), MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js"), MathJax.ElementJax.mml = MathJax.ElementJax({
mimeType: "jax/mml"
}, {
id: "mml",
version: "2.1",
directory: MathJax.ElementJax.directory + "/mml",
extensionDir: MathJax.ElementJax.extensionDir + "/mml",
optableDir: MathJax.ElementJax.directory + "/mml/optable"
}), MathJax.ElementJax.mml.Augment({
Init: function() {
arguments.length === 1 && arguments[0].type === "math" ? this.root = arguments[0] : this.root = MathJax.ElementJax.mml.math.apply(this, arguments);
if (this.root.attr && this.root.attr.mode) {
!this.root.display && this.root.attr.mode === "display" && (this.root.display = "block", this.root.attrNames.push("display")), delete this.root.attr.mode;
for (var e = 0, t = this.root.attrNames.length; e < t; e++) if (this.root.attrNames[e] === "mode") {
this.root.attrNames.splice(e, 1);
break;
}
}
}
}, {
INHERIT: "_inherit_",
AUTO: "_auto_",
SIZE: {
INFINITY: "infinity",
SMALL: "small",
NORMAL: "normal",
BIG: "big"
},
COLOR: {
TRANSPARENT: "transparent"
},
VARIANT: {
NORMAL: "normal",
BOLD: "bold",
ITALIC: "italic",
BOLDITALIC: "bold-italic",
DOUBLESTRUCK: "double-struck",
FRAKTUR: "fraktur",
BOLDFRAKTUR: "bold-fraktur",
SCRIPT: "script",
BOLDSCRIPT: "bold-script",
SANSSERIF: "sans-serif",
BOLDSANSSERIF: "bold-sans-serif",
SANSSERIFITALIC: "sans-serif-italic",
SANSSERIFBOLDITALIC: "sans-serif-bold-italic",
MONOSPACE: "monospace",
INITIAL: "inital",
TAILED: "tailed",
LOOPED: "looped",
STRETCHED: "stretched",
CALIGRAPHIC: "-tex-caligraphic",
OLDSTYLE: "-tex-oldstyle"
},
FORM: {
PREFIX: "prefix",
INFIX: "infix",
POSTFIX: "postfix"
},
LINEBREAK: {
AUTO: "auto",
NEWLINE: "newline",
NOBREAK: "nobreak",
GOODBREAK: "goodbreak",
BADBREAK: "badbreak"
},
LINEBREAKSTYLE: {
BEFORE: "before",
AFTER: "after",
DUPLICATE: "duplicate",
INFIXLINBREAKSTYLE: "infixlinebreakstyle"
},
INDENTALIGN: {
LEFT: "left",
CENTER: "center",
RIGHT: "right",
AUTO: "auto",
ID: "id",
INDENTALIGN: "indentalign"
},
INDENTSHIFT: {
INDENTSHIFT: "indentshift"
},
LINETHICKNESS: {
THIN: "thin",
MEDIUM: "medium",
THICK: "thick"
},
NOTATION: {
LONGDIV: "longdiv",
ACTUARIAL: "actuarial",
RADICAL: "radical",
BOX: "box",
ROUNDEDBOX: "roundedbox",
CIRCLE: "circle",
LEFT: "left",
RIGHT: "right",
TOP: "top",
BOTTOM: "bottom",
UPDIAGONALSTRIKE: "updiagonalstrike",
DOWNDIAGONALSTRIKE: "downdiagonalstrike",
VERTICALSTRIKE: "verticalstrike",
HORIZONTALSTRIKE: "horizontalstrike",
MADRUWB: "madruwb"
},
ALIGN: {
TOP: "top",
BOTTOM: "bottom",
CENTER: "center",
BASELINE: "baseline",
AXIS: "axis",
LEFT: "left",
RIGHT: "right"
},
LINES: {
NONE: "none",
SOLID: "solid",
DASHED: "dashed"
},
SIDE: {
LEFT: "left",
RIGHT: "right",
LEFTOVERLAP: "leftoverlap",
RIGHTOVERLAP: "rightoverlap"
},
WIDTH: {
AUTO: "auto",
FIT: "fit"
},
ACTIONTYPE: {
TOGGLE: "toggle",
STATUSLINE: "statusline",
TOOLTIP: "tooltip",
INPUT: "input"
},
LENGTH: {
VERYVERYTHINMATHSPACE: "veryverythinmathspace",
VERYTHINMATHSPACE: "verythinmathspace",
THINMATHSPACE: "thinmathspace",
MEDIUMMATHSPACE: "mediummathspace",
THICKMATHSPACE: "thickmathspace",
VERYTHICKMATHSPACE: "verythickmathspace",
VERYVERYTHICKMATHSPACE: "veryverythickmathspace",
NEGATIVEVERYVERYTHINMATHSPACE: "negativeveryverythinmathspace",
NEGATIVEVERYTHINMATHSPACE: "negativeverythinmathspace",
NEGATIVETHINMATHSPACE: "negativethinmathspace",
NEGATIVEMEDIUMMATHSPACE: "negativemediummathspace",
NEGATIVETHICKMATHSPACE: "negativethickmathspace",
NEGATIVEVERYTHICKMATHSPACE: "negativeverythickmathspace",
NEGATIVEVERYVERYTHICKMATHSPACE: "negativeveryverythickmathspace"
},
OVERFLOW: {
LINBREAK: "linebreak",
SCROLL: "scroll",
ELIDE: "elide",
TRUNCATE: "truncate",
SCALE: "scale"
},
UNIT: {
EM: "em",
EX: "ex",
PX: "px",
IN: "in",
CM: "cm",
MM: "mm",
PT: "pt",
PC: "pc"
},
TEXCLASS: {
ORD: 0,
OP: 1,
BIN: 2,
REL: 3,
OPEN: 4,
CLOSE: 5,
PUNCT: 6,
INNER: 7,
VCENTER: 8,
NONE: -1
},
TEXCLASSNAMES: [ "ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER", "VCENTER" ],
copyAttributes: {
fontfamily: !0,
fontsize: !0,
fontweight: !0,
fontstyle: !0,
color: !0,
background: !0,
id: !0,
"class": !0,
href: !0,
style: !0
},
skipAttributes: {
texClass: !0,
useHeight: !0,
texprimestyle: !0
},
copyAttributeNames: [ "fontfamily", "fontsize", "fontweight", "fontstyle", "color", "background", "id", "class", "href", "style" ]
}), function(e) {
e.mbase = MathJax.Object.Subclass({
type: "base",
isToken: !1,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT
},
noInherit: {},
noInheritAttribute: {
texClass: !0
},
linebreakContainer: !1,
Init: function() {
this.data = [], this.inferRow && (arguments.length !== 1 || !arguments[0].inferred) && this.Append(e.mrow().With({
inferred: !0
})), this.Append.apply(this, arguments);
},
With: function(e) {
for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
return this;
},
Append: function() {
if (this.inferRow && this.data.length) this.data[0].Append.apply(this.data[0], arguments); else for (var e = 0, t = arguments.length; e < t; e++) this.SetData(this.data.length, arguments[e]);
},
SetData: function(t, n) {
n != null && (n instanceof e.mbase || (n = this.isToken ? e.chars(n) : e.mtext(n)), n.parent = this, n.setInherit(this.inheritFromMe ? this : this.inherit)), this.data[t] = n;
},
Parent: function() {
var e = this.parent;
while (e && e.inferred) e = e.parent;
return e;
},
Get: function(t, n) {
if (this[t] != null) return this[t];
if (this.attr && this.attr[t] != null) return this.attr[t];
var r = this.Parent();
if (r && r["adjustChild_" + t] != null) return r["adjustChild_" + t](r.childPosition(this));
var i = this.inherit, s = i;
while (i) {
var o = i[t];
o == null && i.attr && (o = i.attr[t]);
if (o != null && !i.noInheritAttribute[t]) {
var u = i.noInherit[this.type];
if (!u || !u[t]) return o;
}
s = i, i = i.inherit;
}
if (!n) {
if (this.defaults[t] === e.AUTO) return this.autoDefault(t);
if (this.defaults[t] !== e.INHERIT && this.defaults[t] != null) return this.defaults[t];
if (s) return s.defaults[t];
}
return null;
},
hasValue: function(e) {
return this.Get(e, true) != null;
},
getValues: function() {
var e = {};
for (var t = 0, n = arguments.length; t < n; t++) e[arguments[t]] = this.Get(arguments[t]);
return e;
},
adjustChild_scriptlevel: function(e) {
return this.Get("scriptlevel");
},
adjustChild_displaystyle: function(e) {
return this.Get("displaystyle");
},
adjustChild_texprimestyle: function(e) {
return this.Get("texprimestyle");
},
childPosition: function(e) {
e.parent.inferred && (e = e.parent);
for (var t = 0, n = this.data.length; t < n; t++) if (this.data[t] === e) return t;
return null;
},
setInherit: function(e) {
if (e !== this.inherit && this.inherit == null) {
this.inherit = e;
for (var t = 0, n = this.data.length; t < n; t++) this.data[t] && this.data[t].setInherit && this.data[t].setInherit(e);
}
},
setTeXclass: function(e) {
return this.getPrevClass(e), typeof this.texClass != "undefined" ? this : e;
},
getPrevClass: function(e) {
e && (this.prevClass = e.Get("texClass"), this.prevLevel = e.Get("scriptlevel"));
},
updateTeXclass: function(e) {
e && (this.prevClass = e.prevClass, delete e.prevClass, this.prevLevel = e.prevLevel, delete e.prevLevel, this.texClass = e.Get("texClass"));
},
texSpacing: function() {
var t = this.prevClass != null ? this.prevClass : e.TEXCLASS.NONE, n = this.Get("texClass") || e.TEXCLASS.ORD;
if (t === e.TEXCLASS.NONE || n === e.TEXCLASS.NONE) return "";
t === e.TEXCLASS.VCENTER && (t = e.TEXCLASS.ORD), n === e.TEXCLASS.VCENTER && (n = e.TEXCLASS.ORD);
var r = this.TEXSPACE[t][n];
return this.prevLevel > 0 && this.Get("scriptlevel") > 0 && r >= 0 ? "" : this.TEXSPACELENGTH[Math.abs(r)];
},
TEXSPACELENGTH: [ "", e.LENGTH.THINMATHSPACE, e.LENGTH.MEDIUMMATHSPACE, e.LENGTH.THICKMATHSPACE ],
TEXSPACE: [ [ 0, -1, 2, 3, 0, 0, 0, 1 ], [ -1, -1, 0, 3, 0, 0, 0, 1 ], [ 2, 2, 0, 0, 2, 0, 0, 2 ], [ 3, 3, 0, 0, 3, 0, 0, 3 ], [ 0, 0, 0, 0, 0, 0, 0, 0 ], [ 0, -1, 2, 3, 0, 0, 0, 1 ], [ 1, 1, 0, 1, 1, 1, 1, 1 ], [ 1, -1, 2, 3, 1, 0, 1, 1 ] ],
autoDefault: function(e) {
return "";
},
isSpacelike: function() {
return !1;
},
isEmbellished: function() {
return !1;
},
Core: function() {
return this;
},
CoreMO: function() {
return this;
},
hasNewline: function() {
if (this.isEmbellished()) return this.CoreMO().hasNewline();
if (this.isToken || this.linebreakContainer) return !1;
for (var e = 0, t = this.data.length; e < t; e++) if (this.data[e] && this.data[e].hasNewline()) return !0;
return !1;
},
array: function() {
return this.inferred ? this.data : [ this ];
},
toString: function() {
return this.type + "(" + this.data.join(",") + ")";
}
}, {
childrenSpacelike: function() {
for (var e = 0, t = this.data.length; e < t; e++) if (!this.data[e].isSpacelike()) return !1;
return !0;
},
childEmbellished: function() {
return this.data[0] && this.data[0].isEmbellished();
},
childCore: function() {
return this.data[0];
},
childCoreMO: function() {
return this.data[0] ? this.data[0].CoreMO() : null;
},
setChildTeXclass: function(e) {
return this.data[0] && (e = this.data[0].setTeXclass(e), this.updateTeXclass(this.data[0])), e;
},
setBaseTeXclasses: function(t) {
this.getPrevClass(t), this.texClass = null, this.isEmbellished() || this.data[0].isa(e.mi) ? (t = this.data[0].setTeXclass(t), this.updateTeXclass(this.Core())) : (this.data[0] && this.data[0].setTeXclass(), t = this);
for (var n = 1, r = this.data.length; n < r; n++) this.data[n] && this.data[n].setTeXclass();
return t;
},
setSeparateTeXclasses: function(e) {
this.getPrevClass(e);
for (var t = 0, n = this.data.length; t < n; t++) this.data[t] && this.data[t].setTeXclass();
return this.isEmbellished() && this.updateTeXclass(this.Core()), this;
}
}), e.mi = e.mbase.Subclass({
type: "mi",
isToken: !0,
texClass: e.TEXCLASS.ORD,
defaults: {
mathvariant: e.AUTO,
mathsize: e.INHERIT,
mathbackground: e.INHERIT,
mathcolor: e.INHERIT
},
autoDefault: function(t) {
if (t === "mathvariant") {
var n = (this.data[0] || "").toString();
return n.length === 1 || n.length === 2 && n.charCodeAt(0) >= 55296 && n.charCodeAt(0) < 56320 ? e.VARIANT.ITALIC : e.VARIANT.NORMAL;
}
return "";
},
setTeXclass: function(t) {
this.getPrevClass(t);
var n = this.data.join("");
return n.length > 1 && n.match(/^[a-z][a-z0-9]*$/i) && this.texClass === e.TEXCLASS.ORD && (this.texClass = e.TEXCLASS.OP, this.autoOP = !0), this;
}
}), e.mn = e.mbase.Subclass({
type: "mn",
isToken: !0,
texClass: e.TEXCLASS.ORD,
defaults: {
mathvariant: e.INHERIT,
mathsize: e.INHERIT,
mathbackground: e.INHERIT,
mathcolor: e.INHERIT
}
}), e.mo = e.mbase.Subclass({
type: "mo",
isToken: !0,
defaults: {
mathvariant: e.INHERIT,
mathsize: e.INHERIT,
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
form: e.AUTO,
fence: e.AUTO,
separator: e.AUTO,
lspace: e.AUTO,
rspace: e.AUTO,
stretchy: e.AUTO,
symmetric: e.AUTO,
maxsize: e.AUTO,
minsize: e.AUTO,
largeop: e.AUTO,
movablelimits: e.AUTO,
accent: e.AUTO,
linebreak: e.LINEBREAK.AUTO,
lineleading: e.INHERIT,
linebreakstyle: e.AUTO,
linebreakmultchar: e.INHERIT,
indentalign: e.INHERIT,
indentshift: e.INHERIT,
indenttarget: e.INHERIT,
indentalignfirst: e.INHERIT,
indentshiftfirst: e.INHERIT,
indentalignlast: e.INHERIT,
indentshiftlast: e.INHERIT,
texClass: e.AUTO
},
defaultDef: {
form: e.FORM.INFIX,
fence: !1,
separator: !1,
lspace: e.LENGTH.THICKMATHSPACE,
rspace: e.LENGTH.THICKMATHSPACE,
stretchy: !1,
symmetric: !0,
maxsize: e.SIZE.INFINITY,
minsize: "0em",
largeop: !1,
movablelimits: !1,
accent: !1,
linebreak: e.LINEBREAK.AUTO,
lineleading: "1ex",
linebreakstyle: "before",
indentalign: e.INDENTALIGN.AUTO,
indentshift: "0",
indenttarget: "",
indentalignfirst: e.INDENTALIGN.INDENTALIGN,
indentshiftfirst: e.INDENTSHIFT.INDENTSHIFT,
indentalignlast: e.INDENTALIGN.INDENTALIGN,
indentshiftlast: e.INDENTSHIFT.INDENTSHIFT,
texClass: e.TEXCLASS.REL
},
SPACE_ATTR: {
lspace: 1,
rspace: 2,
form: 4
},
useMMLspacing: 7,
autoDefault: function(t, n) {
var r = this.def;
if (!r) {
if (t === "form") return this.useMMLspacing &= ~this.SPACE_ATTR.form, this.getForm();
var i = this.data.join(""), s = [ this.Get("form"), e.FORM.INFIX, e.FORM.POSTFIX, e.FORM.PREFIX ];
for (var o = 0, u = s.length; o < u; o++) {
var f = this.OPTABLE[s[o]][i];
if (f) {
r = this.makeDef(f);
break;
}
}
r || (r = this.CheckRange(i)), !r && n ? r = {} : (r || (r = MathJax.Hub.Insert({}, this.defaultDef)), r.form = s[0], this.def = r);
}
return this.useMMLspacing &= ~(this.SPACE_ATTR[t] || 0), r[t] != null ? r[t] : n ? "" : this.defaultDef[t];
},
CheckRange: function(t) {
var n = t.charCodeAt(0);
n >= 55296 && n < 56320 && (n = (n - 55296 << 10) + (t.charCodeAt(1) - 56320) + 65536);
for (var r = 0, i = this.RANGES.length; r < i && this.RANGES[r][0] <= n; r++) if (n <= this.RANGES[r][1]) {
if (this.RANGES[r][3]) {
var s = e.optableDir + "/" + this.RANGES[r][3] + ".js";
this.RANGES[r][3] = null, MathJax.Hub.RestartAfter(MathJax.Ajax.Require(s));
}
var o = e.TEXCLASSNAMES[this.RANGES[r][2]];
return o = this.OPTABLE.infix[t] = e.mo.OPTYPES[o === "BIN" ? "BIN3" : o], this.makeDef(o);
}
return null;
},
makeDef: function(t) {
t[2] == null && (t[2] = this.defaultDef.texClass), t[3] || (t[3] = {});
var n = MathJax.Hub.Insert({}, t[3]);
return n.lspace = this.SPACE[t[0]], n.rspace = this.SPACE[t[1]], n.texClass = t[2], n.texClass === e.TEXCLASS.REL && (this.movablelimits || this.data.join("").match(/^[a-z]+$/i)) && (n.texClass = e.TEXCLASS.OP), n;
},
getForm: function() {
var t = this, n = this.parent, r = this.Parent();
while (r && r.isEmbellished()) t = n, n = r.parent, r = r.Parent();
if (n && n.type === "mrow" && n.NonSpaceLength() !== 1) {
if (n.FirstNonSpace() === t) return e.FORM.PREFIX;
if (n.LastNonSpace() === t) return e.FORM.POSTFIX;
}
return e.FORM.INFIX;
},
isEmbellished: function() {
return !0;
},
hasNewline: function() {
return this.Get("linebreak") === e.LINEBREAK.NEWLINE;
},
setTeXclass: function(t) {
return this.getValues("lspace", "rspace"), this.useMMLspacing ? (this.texClass = e.TEXCLASS.NONE, this) : (this.texClass = this.Get("texClass"), this.data.join("") === "\u2061" ? (t.texClass = e.TEXCLASS.OP, this.texClass = this.prevClass = e.TEXCLASS.NONE, t) : this.adjustTeXclass(t));
},
adjustTeXclass: function(t) {
return this.texClass === e.TEXCLASS.NONE ? t : (t ? (t.autoOP && (this.texClass === e.TEXCLASS.BIN || this.texClass === e.TEXCLASS.REL) && (t.texClass = e.TEXCLASS.ORD), this.prevClass = t.texClass || e.TEXCLASS.ORD, this.prevLevel = t.Get("scriptlevel")) : this.prevClass = e.TEXCLASS.NONE, this.texClass !== e.TEXCLASS.BIN || this.prevClass !== e.TEXCLASS.NONE && this.prevClass !== e.TEXCLASS.BIN && this.prevClass !== e.TEXCLASS.OP && this.prevClass !== e.TEXCLASS.REL && this.prevClass !== e.TEXCLASS.OPEN && this.prevClass !== e.TEXCLASS.PUNCT ? this.prevClass === e.TEXCLASS.BIN && (this.texClass === e.TEXCLASS.REL || this.texClass === e.TEXCLASS.CLOSE || this.texClass === e.TEXCLASS.PUNCT) && (t.texClass = this.prevClass = e.TEXCLASS.ORD) : this.texClass = e.TEXCLASS.ORD, this);
}
}), e.mtext = e.mbase.Subclass({
type: "mtext",
isToken: !0,
isSpacelike: function() {
return !0;
},
texClass: e.TEXCLASS.ORD,
defaults: {
mathvariant: e.INHERIT,
mathsize: e.INHERIT,
mathbackground: e.INHERIT,
mathcolor: e.INHERIT
}
}), e.mspace = e.mbase.Subclass({
type: "mspace",
isToken: !0,
isSpacelike: function() {
return !0;
},
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
width: "0em",
height: "0ex",
depth: "0ex",
linebreak: e.LINEBREAK.AUTO
},
hasNewline: function() {
return this.Get("linebreak") === e.LINEBREAK.NEWLINE;
}
}), e.ms = e.mbase.Subclass({
type: "ms",
isToken: !0,
texClass: e.TEXCLASS.ORD,
defaults: {
mathvariant: e.INHERIT,
mathsize: e.INHERIT,
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
lquote: '"',
rquote: '"'
}
}), e.mglyph = e.mbase.Subclass({
type: "mglyph",
isToken: !0,
texClass: e.TEXCLASS.ORD,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
alt: "",
src: "",
width: e.AUTO,
height: e.AUTO,
valign: "0em"
}
}), e.mrow = e.mbase.Subclass({
type: "mrow",
isSpacelike: e.mbase.childrenSpacelike,
inferred: !1,
isEmbellished: function() {
var e = !1;
for (var t = 0, n = this.data.length; t < n; t++) {
if (this.data[t] == null) continue;
if (this.data[t].isEmbellished()) {
if (e) return !1;
e = !0, this.core = t;
} else if (!this.data[t].isSpacelike()) return !1;
}
return e;
},
NonSpaceLength: function() {
var e = 0;
for (var t = 0, n = this.data.length; t < n; t++) this.data[t] && !this.data[t].isSpacelike() && e++;
return e;
},
FirstNonSpace: function() {
for (var e = 0, t = this.data.length; e < t; e++) if (this.data[e] && !this.data[e].isSpacelike()) return this.data[e];
return null;
},
LastNonSpace: function() {
for (var e = this.data.length - 1; e >= 0; e--) if (this.data[0] && !this.data[e].isSpacelike()) return this.data[e];
return null;
},
Core: function() {
return !this.isEmbellished() || typeof this.core == "undefined" ? this : this.data[this.core];
},
CoreMO: function() {
return !this.isEmbellished() || typeof this.core == "undefined" ? this : this.data[this.core].CoreMO();
},
toString: function() {
return this.inferred ? "[" + this.data.join(",") + "]" : this.SUPER(arguments).toString.call(this);
},
setTeXclass: function(e) {
for (var t = 0, n = this.data.length; t < n; t++) this.data[t] && (e = this.data[t].setTeXclass(e));
return this.data[0] && this.updateTeXclass(this.data[0]), e;
}
}), e.mfrac = e.mbase.Subclass({
type: "mfrac",
num: 0,
den: 1,
linebreakContainer: !0,
texClass: e.TEXCLASS.INNER,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
linethickness: e.LINETHICKNESS.MEDIUM,
numalign: e.ALIGN.CENTER,
denomalign: e.ALIGN.CENTER,
bevelled: !1
},
adjustChild_displaystyle: function(e) {
return !1;
},
adjustChild_scriptlevel: function(e) {
var t = this.Get("scriptlevel");
return (!this.Get("displaystyle") || t > 0) && t++, t;
},
adjustChild_texprimestyle: function(e) {
return e == this.den ? !0 : this.Get("texprimestyle");
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.msqrt = e.mbase.Subclass({
type: "msqrt",
inferRow: !0,
linebreakContainer: !0,
texClass: e.TEXCLASS.ORD,
setTeXclass: e.mbase.setSeparateTeXclasses,
adjustChild_texprimestyle: function(e) {
return !0;
}
}), e.mroot = e.mbase.Subclass({
type: "mroot",
linebreakContainer: !0,
texClass: e.TEXCLASS.ORD,
adjustChild_displaystyle: function(e) {
return e === 1 ? !1 : this.Get("displaystyle");
},
adjustChild_scriptlevel: function(e) {
var t = this.Get("scriptlevel");
return e === 1 && (t += 2), t;
},
adjustChild_texprimestyle: function(e) {
return e === 0 ? !0 : this.Get("texprimestyle");
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.mstyle = e.mbase.Subclass({
type: "mstyle",
isSpacelike: e.mbase.childrenSpacelike,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
inferRow: !0,
defaults: {
scriptlevel: e.INHERIT,
displaystyle: e.INHERIT,
scriptsizemultiplier: Math.sqrt(.5),
scriptminsize: "8pt",
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
infixlinebreakstyle: e.LINEBREAKSTYLE.BEFORE,
decimalseparator: "."
},
adjustChild_scriptlevel: function(e) {
var t = this.scriptlevel;
if (t == null) t = this.Get("scriptlevel"); else if (String(t).match(/^ *[-+]/)) {
delete this.scriptlevel;
var n = this.Get("scriptlevel");
this.scriptlevel = t, t = n + parseInt(t);
}
return t;
},
inheritFromMe: !0,
noInherit: {
mpadded: {
width: !0,
height: !0,
depth: !0,
lspace: !0,
voffset: !0
},
mtable: {
width: !0,
height: !0,
depth: !0,
align: !0
}
},
setTeXclass: e.mbase.setChildTeXclass
}), e.merror = e.mbase.Subclass({
type: "merror",
inferRow: !0,
linebreakContainer: !0,
texClass: e.TEXCLASS.ORD
}), e.mpadded = e.mbase.Subclass({
type: "mpadded",
inferRow: !0,
isSpacelike: e.mbase.childrenSpacelike,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
width: "",
height: "",
depth: "",
lspace: 0,
voffset: 0
},
setTeXclass: e.mbase.setChildTeXclass
}), e.mphantom = e.mbase.Subclass({
type: "mphantom",
texClass: e.TEXCLASS.ORD,
inferRow: !0,
isSpacelike: e.mbase.childrenSpacelike,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
setTeXclass: e.mbase.setChildTeXclass
}), e.mfenced = e.mbase.Subclass({
type: "mfenced",
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
open: "(",
close: ")",
separators: ","
},
texClass: e.TEXCLASS.OPEN,
setTeXclass: function(t) {
this.getPrevClass(t);
var n = this.getValues("open", "close", "separators");
n.open = n.open.replace(/[ \t\n\r]/g, ""), n.close = n.close.replace(/[ \t\n\r]/g, ""), n.separators = n.separators.replace(/[ \t\n\r]/g, ""), n.open !== "" && (this.SetData("open", e.mo(n.open).With({
stretchy: !0,
texClass: e.TEXCLASS.OPEN
})), t = this.data.open.setTeXclass(t));
if (n.separators !== "") while (n.separators.length < this.data.length) n.separators += n.separators.charAt(n.separators.length - 1);
this.data[0] && (t = this.data[0].setTeXclass(t));
for (var r = 1, i = this.data.length; r < i; r++) this.data[r] && (n.separators !== "" && (this.SetData("sep" + r, e.mo(n.separators.charAt(r - 1))), t = this.data["sep" + r].setTeXclass(t)), t = this.data[r].setTeXclass(t));
return n.close !== "" && (this.SetData("close", e.mo(n.close).With({
stretchy: !0,
texClass: e.TEXCLASS.CLOSE
})), t = this.data.close.setTeXclass(t)), this.updateTeXclass(this.data.open), t;
}
}), e.menclose = e.mbase.Subclass({
type: "menclose",
inferRow: !0,
linebreakContainer: !0,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
notation: e.NOTATION.LONGDIV,
texClass: e.TEXCLASS.ORD
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.msubsup = e.mbase.Subclass({
type: "msubsup",
base: 0,
sub: 1,
sup: 2,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
subscriptshift: "",
superscriptshift: "",
texClass: e.AUTO
},
autoDefault: function(t) {
return t === "texClass" ? this.isEmbellished() ? this.CoreMO().Get(t) : e.TEXCLASS.ORD : 0;
},
adjustChild_displaystyle: function(e) {
return e > 0 ? !1 : this.Get("displaystyle");
},
adjustChild_scriptlevel: function(e) {
var t = this.Get("scriptlevel");
return e > 0 && t++, t;
},
adjustChild_texprimestyle: function(e) {
return e === this.sub ? !0 : this.Get("texprimestyle");
},
setTeXclass: e.mbase.setBaseTeXclasses
}), e.msub = e.msubsup.Subclass({
type: "msub"
}), e.msup = e.msubsup.Subclass({
type: "msup",
sub: 2,
sup: 1
}), e.mmultiscripts = e.msubsup.Subclass({
type: "mmultiscripts",
adjustChild_texprimestyle: function(e) {
return e % 2 === 1 ? !0 : this.Get("texprimestyle");
}
}), e.mprescripts = e.mbase.Subclass({
type: "mprescripts"
}), e.none = e.mbase.Subclass({
type: "none"
}), e.munderover = e.mbase.Subclass({
type: "munderover",
base: 0,
under: 1,
over: 2,
sub: 1,
sup: 2,
ACCENTS: [ "", "accentunder", "accent" ],
linebreakContainer: !0,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
accent: e.AUTO,
accentunder: e.AUTO,
align: e.ALIGN.CENTER,
texClass: e.AUTO,
subscriptshift: "",
superscriptshift: ""
},
autoDefault: function(t) {
return t === "texClass" ? this.isEmbellished() ? this.CoreMO().Get(t) : e.TEXCLASS.ORD : t === "accent" && this.data[this.over] ? this.data[this.over].CoreMO().Get("accent") : t === "accentunder" && this.data[this.under] ? this.data[this.under].CoreMO().Get("accent") : !1;
},
adjustChild_displaystyle: function(e) {
return e > 0 ? !1 : this.Get("displaystyle");
},
adjustChild_scriptlevel: function(e) {
var t = this.Get("scriptlevel"), n = this.data[this.base] && !this.Get("displaystyle") && this.data[this.base].CoreMO().Get("movablelimits");
return e == this.under && (n || !this.Get("accentunder")) && t++, e == this.over && (n || !this.Get("accent")) && t++, t;
},
adjustChild_texprimestyle: function(e) {
return e === this.base && this.data[this.over] ? !0 : this.Get("texprimestyle");
},
setTeXclass: e.mbase.setBaseTeXclasses
}), e.munder = e.munderover.Subclass({
type: "munder"
}), e.mover = e.munderover.Subclass({
type: "mover",
over: 1,
under: 2,
sup: 1,
sub: 2,
ACCENTS: [ "", "accent", "accentunder" ]
}), e.mtable = e.mbase.Subclass({
type: "mtable",
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
align: e.ALIGN.AXIS,
rowalign: e.ALIGN.BASELINE,
columnalign: e.ALIGN.CENTER,
groupalign: "{left}",
alignmentscope: !0,
columnwidth: e.WIDTH.AUTO,
width: e.WIDTH.AUTO,
rowspacing: "1ex",
columnspacing: ".8em",
rowlines: e.LINES.NONE,
columnlines: e.LINES.NONE,
frame: e.LINES.NONE,
framespacing: "0.4em 0.5ex",
equalrows: !1,
equalcolumns: !1,
displaystyle: !1,
side: e.SIDE.RIGHT,
minlabelspacing: "0.8em",
texClass: e.TEXCLASS.ORD,
useHeight: 1
},
inheritFromMe: !0,
noInherit: {
mover: {
align: !0
},
munder: {
align: !0
},
munderover: {
align: !0
},
mtable: {
align: !0,
rowalign: !0,
columnalign: !0,
groupalign: !0,
alignmentscope: !0,
columnwidth: !0,
width: !0,
rowspacing: !0,
columnspacing: !0,
rowlines: !0,
columnlines: !0,
frame: !0,
framespacing: !0,
equalrows: !0,
equalcolumns: !0,
side: !0,
minlabelspacing: !0,
texClass: !0,
useHeight: 1
}
},
linebreakContainer: !0,
Append: function() {
for (var t = 0, n = arguments.length; t < n; t++) arguments[t] instanceof e.mtr || arguments[t] instanceof e.mlabeledtr || (arguments[t] = e.mtd(arguments[t]));
this.SUPER(arguments).Append.apply(this, arguments);
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.mtr = e.mbase.Subclass({
type: "mtr",
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
rowalign: e.INHERIT,
columnalign: e.INHERIT,
groupalign: e.INHERIT
},
inheritFromMe: !0,
noInherit: {
mrow: {
rowalign: !0,
columnalign: !0,
groupalign: !0
},
mtable: {
rowalign: !0,
columnalign: !0,
groupalign: !0
}
},
linebreakContainer: !0,
Append: function() {
for (var t = 0, n = arguments.length; t < n; t++) arguments[t] instanceof e.mtd || (arguments[t] = e.mtd(arguments[t]));
this.SUPER(arguments).Append.apply(this, arguments);
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.mtd = e.mbase.Subclass({
type: "mtd",
inferRow: !0,
linebreakContainer: !0,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
rowspan: 1,
columnspan: 1,
rowalign: e.INHERIT,
columnalign: e.INHERIT,
groupalign: e.INHERIT
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.maligngroup = e.mbase.Subclass({
type: "malign",
isSpacelike: function() {
return !0;
},
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
groupalign: e.INHERIT
},
inheritFromMe: !0,
noInherit: {
mrow: {
groupalign: !0
},
mtable: {
groupalign: !0
}
}
}), e.malignmark = e.mbase.Subclass({
type: "malignmark",
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
edge: e.SIDE.LEFT
},
isSpacelike: function() {
return !0;
}
}), e.mlabeledtr = e.mtr.Subclass({
type: "mlabeledtr"
}), e.maction = e.mbase.Subclass({
type: "maction",
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
actiontype: e.ACTIONTYPE.TOGGLE,
selection: 1
},
selected: function() {
return this.data[this.Get("selection") - 1] || e.NULL;
},
isEmbellished: function() {
return this.selected().isEmbellished();
},
isSpacelike: function() {
return this.selected().isSpacelike();
},
Core: function() {
return this.selected().Core();
},
CoreMO: function() {
return this.selected().CoreMO();
},
setTeXclass: function(e) {
return this.selected().setTeXclass(e);
}
}), e.semantics = e.mbase.Subclass({
type: "semantics",
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
defaults: {
definitionURL: null,
encoding: null
},
setTeXclass: e.mbase.setChildTeXclass
}), e.annotation = e.mbase.Subclass({
type: "annotation",
isToken: !0,
linebreakContainer: !0,
defaults: {
definitionURL: null,
encoding: null,
cd: "mathmlkeys",
name: "",
src: null
}
}), e["annotation-xml"] = e.mbase.Subclass({
type: "annotation-xml",
linebreakContainer: !0,
defaults: {
definitionURL: null,
encoding: null,
cd: "mathmlkeys",
name: "",
src: null
}
}), e.math = e.mstyle.Subclass({
type: "math",
defaults: {
mathvariant: e.VARIANT.NORMAL,
mathsize: e.SIZE.NORMAL,
mathcolor: "",
mathbackground: e.COLOR.TRANSPARENT,
scriptlevel: 0,
displaystyle: e.AUTO,
display: "inline",
maxwidth: "",
overflow: e.OVERFLOW.LINEBREAK,
altimg: "",
"altimg-width": "",
"altimg-height": "",
"altimg-valign": "",
alttext: "",
cdgroup: "",
scriptsizemultiplier: Math.sqrt(.5),
scriptminsize: "8px",
infixlinebreakstyle: e.LINEBREAKSTYLE.BEFORE,
lineleading: "1ex",
indentshift: "auto",
indentalign: e.INDENTALIGN.AUTO,
indentalignfirst: e.INDENTALIGN.INDENTALIGN,
indentshiftfirst: e.INDENTSHIFT.INDENTSHIFT,
indentalignlast: e.INDENTALIGN.INDENTALIGN,
indentshiftlast: e.INDENTSHIFT.INDENTSHIFT,
decimalseparator: ".",
texprimestyle: !1
},
autoDefault: function(e) {
return e === "displaystyle" ? this.Get("display") === "block" : "";
},
linebreakContainer: !0,
setTeXclass: e.mbase.setChildTeXclass
}), e.chars = e.mbase.Subclass({
type: "chars",
Append: function() {
this.data.push.apply(this.data, arguments);
},
value: function() {
return this.data.join("");
},
toString: function() {
return this.data.join("");
}
}), e.entity = e.mbase.Subclass({
type: "entity",
Append: function() {
this.data.push.apply(this.data, arguments);
},
value: function() {
return this.data[0].substr(0, 2) === "#x" ? parseInt(this.data[0].substr(2), 16) : this.data[0].substr(0, 1) === "#" ? parseInt(this.data[0].substr(1)) : 0;
},
toString: function() {
var e = this.value();
return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296) + String.fromCharCode((e & 1023) + 56320));
}
}), e.xml = e.mbase.Subclass({
type: "xml",
Init: function() {
return this.div = document.createElement("div"), this.SUPER(arguments).Init.apply(this, arguments);
},
Append: function() {
for (var e = 0, t = arguments.length; e < t; e++) {
var n = this.Import(arguments[e]);
this.data.push(n), this.div.appendChild(n);
}
},
Import: function(e) {
if (document.importNode) return document.importNode(e, !0);
var t, n, r;
if (e.nodeType === 1) {
t = document.createElement(e.nodeName);
for (n = 0, r = e.attributes.length; n < r; n++) {
var i = e.attributes[n];
i.specified && i.nodeValue != null && i.nodeValue != "" && t.setAttribute(i.nodeName, i.nodeValue), i.nodeName === "style" && (t.style.cssText = i.nodeValue);
}
e.className && (t.className = e.className);
} else if (e.nodeType === 3 || e.nodeType === 4) t = document.createTextNode(e.nodeValue); else {
if (e.nodeType !== 8) return document.createTextNode("");
t = document.createComment(e.nodeValue);
}
for (n = 0, r = e.childNodes.length; n < r; n++) t.appendChild(this.Import(e.childNodes[n]));
return t;
},
value: function() {
return this.div;
},
toString: function() {
return this.div.innerHTML;
}
}), e.TeXAtom = e.mbase.Subclass({
type: "texatom",
inferRow: !0,
texClass: e.TEXCLASS.ORD,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
isEmbellished: e.mbase.childEmbellished,
setTeXclass: function(e) {
return this.data[0].setTeXclass(), this.adjustTeXclass(e);
},
adjustTeXclass: e.mo.prototype.adjustTeXclass
}), e.NULL = e.mbase().With({
type: "null"
});
var t = e.TEXCLASS, n = {
ORD: [ 0, 0, t.ORD ],
ORD11: [ 1, 1, t.ORD ],
ORD21: [ 2, 1, t.ORD ],
ORD02: [ 0, 2, t.ORD ],
ORD55: [ 5, 5, t.ORD ],
OP: [ 1, 2, t.OP, {
largeop: !0,
movablelimits: !0,
symmetric: !0
} ],
OPFIXED: [ 1, 2, t.OP, {
largeop: !0,
movablelimits: !0
} ],
INTEGRAL: [ 0, 1, t.OP, {
largeop: !0,
symmetric: !0
} ],
INTEGRAL2: [ 1, 2, t.OP, {
largeop: !0,
symmetric: !0
} ],
BIN3: [ 3, 3, t.BIN ],
BIN4: [ 4, 4, t.BIN ],
BIN01: [ 0, 1, t.BIN ],
BIN5: [ 5, 5, t.BIN ],
TALLBIN: [ 4, 4, t.BIN, {
stretchy: !0
} ],
BINOP: [ 4, 4, t.BIN, {
largeop: !0,
movablelimits: !0
} ],
REL: [ 5, 5, t.REL ],
REL1: [ 1, 1, t.REL, {
stretchy: !0
} ],
REL4: [ 4, 4, t.REL ],
RELSTRETCH: [ 5, 5, t.REL, {
stretchy: !0
} ],
RELACCENT: [ 5, 5, t.REL, {
accent: !0
} ],
WIDEREL: [ 5, 5, t.REL, {
accent: !0,
stretchy: !0
} ],
OPEN: [ 0, 0, t.OPEN, {
fence: !0,
stretchy: !0,
symmetric: !0
} ],
CLOSE: [ 0, 0, t.CLOSE, {
fence: !0,
stretchy: !0,
symmetric: !0
} ],
INNER: [ 0, 0, t.INNER ],
PUNCT: [ 0, 3, t.PUNCT ],
ACCENT: [ 0, 0, t.ORD, {
accent: !0
} ],
WIDEACCENT: [ 0, 0, t.ORD, {
accent: !0,
stretchy: !0
} ]
};
e.mo.Augment({
SPACE: [ "0em", "0.1111em", "0.1667em", "0.2222em", "0.2667em", "0.3333em" ],
RANGES: [ [ 32, 127, t.REL, "BasicLatin" ], [ 160, 255, t.ORD, "Latin1Supplement" ], [ 256, 383, t.ORD ], [ 384, 591, t.ORD ], [ 688, 767, t.ORD, "SpacingModLetters" ], [ 768, 879, t.ORD, "CombDiacritMarks" ], [ 880, 1023, t.ORD, "GreekAndCoptic" ], [ 7680, 7935, t.ORD ], [ 8192, 8303, t.PUNCT, "GeneralPunctuation" ], [ 8304, 8351, t.ORD ], [ 8352, 8399, t.ORD ], [ 8400, 8447, t.ORD, "CombDiactForSymbols" ], [ 8448, 8527, t.ORD, "LetterlikeSymbols" ], [ 8528, 8591, t.ORD ], [ 8592, 8703, t.REL, "Arrows" ], [ 8704, 8959, t.BIN, "MathOperators" ], [ 8960, 9215, t.ORD, "MiscTechnical" ], [ 9312, 9471, t.ORD ], [ 9472, 9631, t.ORD ], [ 9632, 9727, t.ORD, "GeometricShapes" ], [ 9984, 10175, t.ORD, "Dingbats" ], [ 10176, 10223, t.ORD, "MiscMathSymbolsA" ], [ 10224, 10239, t.REL, "SupplementalArrowsA" ], [ 10496, 10623, t.REL, "SupplementalArrowsB" ], [ 10624, 10751, t.ORD, "MiscMathSymbolsB" ], [ 10752, 11007, t.BIN, "SuppMathOperators" ], [ 11008, 11263, t.ORD, "MiscSymbolsAndArrows" ], [ 119808, 120831, t.ORD ] ],
OPTABLE: {
prefix: {
"\u2200": n.ORD21,
"\u2202": n.ORD21,
"\u2203": n.ORD21,
"\u2207": n.ORD21,
"\u220f": n.OP,
"\u2210": n.OP,
"\u2211": n.OP,
"\u2212": n.BIN01,
"\u2213": n.BIN01,
"\u221a": [ 1, 1, t.ORD, {
stretchy: !0
} ],
"\u2220": n.ORD,
"\u222b": n.INTEGRAL,
"\u222e": n.INTEGRAL,
"\u22c0": n.OP,
"\u22c1": n.OP,
"\u22c2": n.OP,
"\u22c3": n.OP,
"\u2308": n.OPEN,
"\u230a": n.OPEN,
"\u27e8": n.OPEN,
"\u27ee": n.OPEN,
"\u2a00": n.OP,
"\u2a01": n.OP,
"\u2a02": n.OP,
"\u2a04": n.OP,
"\u2a06": n.OP,
"\u00ac": n.ORD21,
"\u00b1": n.BIN01,
"(": n.OPEN,
"+": n.BIN01,
"-": n.BIN01,
"[": n.OPEN,
"{": n.OPEN,
"|": n.OPEN
},
postfix: {
"!": [ 1, 0, t.CLOSE ],
"&": n.ORD,
"\u2032": n.ORD02,
"\u203e": n.WIDEACCENT,
"\u2309": n.CLOSE,
"\u230b": n.CLOSE,
"\u23de": n.WIDEACCENT,
"\u23df": n.WIDEACCENT,
"\u266d": n.ORD02,
"\u266e": n.ORD02,
"\u266f": n.ORD02,
"\u27e9": n.CLOSE,
"\u27ef": n.CLOSE,
"\u02c6": n.WIDEACCENT,
"\u02c7": n.WIDEACCENT,
"\u02c9": n.WIDEACCENT,
"\u02ca": n.ACCENT,
"\u02cb": n.ACCENT,
"\u02d8": n.ACCENT,
"\u02d9": n.ACCENT,
"\u02dc": n.WIDEACCENT,
"\u0302": n.WIDEACCENT,
"\u00a8": n.ACCENT,
"\u00af": n.WIDEACCENT,
")": n.CLOSE,
"]": n.CLOSE,
"^": n.WIDEACCENT,
_: n.WIDEACCENT,
"`": n.ACCENT,
"|": n.CLOSE,
"}": n.CLOSE,
"~": n.WIDEACCENT
},
infix: {
"": n.ORD,
"%": [ 3, 3, t.ORD ],
"\u2022": n.BIN4,
"\u2026": n.INNER,
"\u2044": n.TALLBIN,
"\u2061": n.ORD,
"\u2062": n.ORD,
"\u2063": [ 0, 0, t.ORD, {
linebreakstyle: "after",
separator: !0
} ],
"\u2064": n.ORD,
"\u2190": n.WIDEREL,
"\u2191": n.RELSTRETCH,
"\u2192": n.WIDEREL,
"\u2193": n.RELSTRETCH,
"\u2194": n.WIDEREL,
"\u2195": n.RELSTRETCH,
"\u2196": n.RELSTRETCH,
"\u2197": n.RELSTRETCH,
"\u2198": n.RELSTRETCH,
"\u2199": n.RELSTRETCH,
"\u21a6": n.WIDEREL,
"\u21a9": n.WIDEREL,
"\u21aa": n.WIDEREL,
"\u21bc": n.WIDEREL,
"\u21bd": n.WIDEREL,
"\u21c0": n.WIDEREL,
"\u21c1": n.WIDEREL,
"\u21cc": n.WIDEREL,
"\u21d0": n.WIDEREL,
"\u21d1": n.RELSTRETCH,
"\u21d2": n.WIDEREL,
"\u21d3": n.RELSTRETCH,
"\u21d4": n.WIDEREL,
"\u21d5": n.RELSTRETCH,
"\u2208": n.REL,
"\u2209": n.REL,
"\u220b": n.REL,
"\u2212": n.BIN4,
"\u2213": n.BIN4,
"\u2215": n.TALLBIN,
"\u2216": n.BIN4,
"\u2217": n.BIN4,
"\u2218": n.BIN4,
"\u2219": n.BIN4,
"\u221d": n.REL,
"\u2223": n.REL,
"\u2225": n.REL,
"\u2227": n.BIN4,
"\u2228": n.BIN4,
"\u2229": n.BIN4,
"\u222a": n.BIN4,
"\u223c": n.REL,
"\u2240": n.BIN4,
"\u2243": n.REL,
"\u2245": n.REL,
"\u2248": n.REL,
"\u224d": n.REL,
"\u2250": n.REL,
"\u2260": n.REL,
"\u2261": n.REL,
"\u2264": n.REL,
"\u2265": n.REL,
"\u226a": n.REL,
"\u226b": n.REL,
"\u227a": n.REL,
"\u227b": n.REL,
"\u2282": n.REL,
"\u2283": n.REL,
"\u2286": n.REL,
"\u2287": n.REL,
"\u228e": n.BIN4,
"\u2291": n.REL,
"\u2292": n.REL,
"\u2293": n.BIN4,
"\u2294": n.BIN4,
"\u2295": n.BIN4,
"\u2296": n.BIN4,
"\u2297": n.BIN4,
"\u2298": n.BIN4,
"\u2299": n.BIN4,
"\u22a2": n.REL,
"\u22a3": n.REL,
"\u22a4": n.ORD55,
"\u22a5": n.REL,
"\u22a8": n.REL,
"\u22c4": n.BIN4,
"\u22c5": n.BIN4,
"\u22c6": n.BIN4,
"\u22c8": n.REL,
"\u22ee": n.ORD55,
"\u22ef": n.INNER,
"\u22f1": [ 5, 5, t.INNER ],
"\u25b3": n.BIN4,
"\u25b5": n.BIN4,
"\u25b9": n.BIN4,
"\u25bd": n.BIN4,
"\u25bf": n.BIN4,
"\u25c3": n.BIN4,
"\u2758": n.REL,
"\u27f5": n.WIDEREL,
"\u27f6": n.WIDEREL,
"\u27f7": n.WIDEREL,
"\u27f8": n.WIDEREL,
"\u27f9": n.WIDEREL,
"\u27fa": n.WIDEREL,
"\u27fc": n.WIDEREL,
"\u2a2f": n.BIN4,
"\u2a3f": n.BIN4,
"\u2aaf": n.REL,
"\u2ab0": n.REL,
"\u00b1": n.BIN4,
"\u00b7": n.BIN4,
"\u00d7": n.BIN4,
"\u00f7": n.BIN4,
"*": n.BIN3,
"+": n.BIN4,
",": [ 0, 3, t.PUNCT, {
linebreakstyle: "after",
separator: !0
} ],
"-": n.BIN4,
".": [ 3, 3, t.ORD ],
"/": n.ORD11,
":": [ 1, 2, t.REL ],
";": [ 0, 3, t.PUNCT, {
linebreakstyle: "after",
separator: !0
} ],
"<": n.REL,
"=": n.REL,
">": n.REL,
"?": [ 1, 1, t.CLOSE ],
"\\": n.ORD,
"^": n.ORD11,
_: n.ORD11,
"|": [ 2, 2, t.ORD, {
fence: !0,
stretchy: !0,
symmetric: !0
} ],
"#": n.ORD,
$: n.ORD,
".": [ 0, 3, t.PUNCT, {
separator: !0
} ],
"\u02b9": n.ORD,
"\u0300": n.ACCENT,
"\u0301": n.ACCENT,
"\u0303": n.WIDEACCENT,
"\u0304": n.ACCENT,
"\u0306": n.ACCENT,
"\u0307": n.ACCENT,
"\u0308": n.ACCENT,
"\u030c": n.ACCENT,
"\u0332": n.WIDEACCENT,
"\u0338": n.REL4,
"\u2015": [ 0, 0, t.ORD, {
stretchy: !0
} ],
"\u2017": [ 0, 0, t.ORD, {
stretchy: !0
} ],
"\u2020": n.BIN3,
"\u2021": n.BIN3,
"\u20d7": n.ACCENT,
"\u2111": n.ORD,
"\u2113": n.ORD,
"\u2118": n.ORD,
"\u211c": n.ORD,
"\u2205": n.ORD,
"\u221e": n.ORD,
"\u2305": n.BIN3,
"\u2306": n.BIN3,
"\u2322": n.REL4,
"\u2323": n.REL4,
"\u2329": n.OPEN,
"\u232a": n.CLOSE,
"\u23aa": n.ORD,
"\u23af": [ 0, 0, t.ORD, {
stretchy: !0
} ],
"\u23b0": n.OPEN,
"\u23b1": n.CLOSE,
"\u2500": n.ORD,
"\u25ef": n.BIN3,
"\u2660": n.ORD,
"\u2661": n.ORD,
"\u2662": n.ORD,
"\u2663": n.ORD,
"\u3008": n.OPEN,
"\u3009": n.CLOSE,
"\ufe37": n.WIDEACCENT,
"\ufe38": n.WIDEACCENT
}
}
}, {
OPTYPES: n
}), e.mo.prototype.OPTABLE.infix["^"] = n.WIDEREL, e.mo.prototype.OPTABLE.infix._ = n.WIDEREL;
}(MathJax.ElementJax.mml), MathJax.ElementJax.mml.loadComplete("jax.js"), MathJax.InputJax.TeX = MathJax.InputJax({
id: "TeX",
version: "2.1",
directory: MathJax.InputJax.directory + "/TeX",
extensionDir: MathJax.InputJax.extensionDir + "/TeX",
config: {
TagSide: "right",
TagIndent: "0.8em",
MultLineWidth: "85%",
equationNumbers: {
autoNumber: "none",
formatNumber: function(e) {
return e;
},
formatTag: function(e) {
return "(" + e + ")";
},
formatID: function(e) {
return "mjx-eqn-" + String(e).replace(/[:"'<>&]/g, "");
},
formatURL: function(e) {
return "#" + escape(e);
},
useLabelIds: !0
}
}
}), MathJax.InputJax.TeX.Register("math/tex"), MathJax.InputJax.TeX.loadComplete("config.js"), function(e, t, n) {
var r, i = "\u00a0", s = MathJax.Object.Subclass({
Init: function(e, t) {
this.global = {
isInner: t
}, this.data = [ o.start(this.global) ], e && (this.data[0].env = e), this.env = this.data[0].env;
},
Push: function() {
var e, t, n, i;
for (e = 0, t = arguments.length; e < t; e++) {
n = arguments[e], n instanceof r.mbase && (n = o.mml(n)), n.global = this.global, i = this.data.length ? this.Top().checkItem(n) : !0;
if (i instanceof Array) this.Pop(), this.Push.apply(this, i); else if (i instanceof o) this.Pop(), this.Push(i); else if (i) {
this.data.push(n);
if (n.env) {
for (var s in this.env) this.env.hasOwnProperty(s) && (n.env[s] = this.env[s]);
this.env = n.env;
} else n.env = this.env;
}
}
},
Pop: function() {
var e = this.data.pop();
return e.isOpen || delete e.env, this.env = this.data.length ? this.Top().env : {}, e;
},
Top: function(e) {
return e == null && (e = 1), this.data.length < e ? null : this.data[this.data.length - e];
},
Prev: function(e) {
var t = this.Top();
return e ? t.data[t.data.length - 1] : t.Pop();
},
toString: function() {
return "stack[\n  " + this.data.join("\n  ") + "\n]";
}
}), o = s.Item = MathJax.Object.Subclass({
type: "base",
closeError: "Extra close brace or missing open brace",
rightError: "Missing \\left or extra \\right",
Init: function() {
this.isOpen && (this.env = {}), this.data = [], this.Push.apply(this, arguments);
},
Push: function() {
this.data.push.apply(this.data, arguments);
},
Pop: function() {
return this.data.pop();
},
mmlData: function(e, t) {
return e == null && (e = !0), this.data.length === 1 && !t ? this.data[0] : r.mrow.apply(r, this.data).With(e ? {
inferred: !0
} : {});
},
checkItem: function(t) {
t.type === "over" && this.isOpen && (t.num = this.mmlData(!1), this.data = []);
if (t.type === "cell" && this.isOpen) {
if (t.linebreak) return !1;
e.Error("Misplaced " + t.name);
}
return t.isClose && this[t.type + "Error"] && e.Error(this[t.type + "Error"]), t.isNotStack ? (this.Push(t.data[0]), !1) : !0;
},
With: function(e) {
for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
return this;
},
toString: function() {
return this.type + "[" + this.data.join("; ") + "]";
}
});
o.start = o.Subclass({
type: "start",
isOpen: !0,
Init: function(e) {
this.SUPER(arguments).Init.call(this), this.global = e;
},
checkItem: function(e) {
return e.type === "stop" ? o.mml(this.mmlData()) : this.SUPER(arguments).checkItem.call(this, e);
}
}), o.stop = o.Subclass({
type: "stop",
isClose: !0
}), o.open = o.Subclass({
type: "open",
isOpen: !0,
stopError: "Extra open brace or missing close brace",
checkItem: function(e) {
if (e.type === "close") {
var t = this.mmlData();
return o.mml(r.TeXAtom(t));
}
return this.SUPER(arguments).checkItem.call(this, e);
}
}), o.close = o.Subclass({
type: "close",
isClose: !0
}), o.prime = o.Subclass({
type: "prime",
checkItem: function(e) {
return this.data[0].type !== "msubsup" ? [ r.msup(this.data[0], this.data[1]), e ] : (this.data[0].SetData(this.data[0].sup, this.data[1]), [ this.data[0], e ]);
}
}), o.subsup = o.Subclass({
type: "subsup",
stopError: "Missing superscript or subscript argument",
checkItem: function(t) {
var n = [ "", "subscript", "superscript" ][this.position];
if (t.type === "open" || t.type === "left") return !0;
if (t.type === "mml") return this.primes && (this.position !== 2 ? this.data[0].SetData(2, this.primes) : t.data[0] = r.mrow(this.primes.With({
variantForm: !0
}), t.data[0])), this.data[0].SetData(this.position, t.data[0]), o.mml(this.data[0]);
this.SUPER(arguments).checkItem.call(this, t) && e.Error("Missing open brace for " + n);
},
Pop: function() {}
}), o.over = o.Subclass({
type: "over",
isClose: !0,
name: "\\over",
checkItem: function(t, n) {
t.type === "over" && e.Error("Ambiguous use of " + t.name);
if (t.isClose) {
var i = r.mfrac(this.num, this.mmlData(!1));
this.thickness != null && (i.linethickness = this.thickness);
if (this.open || this.close) i.texClass = r.TEXCLASS.INNER, i.texWithDelims = !0, i = r.mfenced(i).With({
open: this.open,
close: this.close
});
return [ o.mml(i), t ];
}
return this.SUPER(arguments).checkItem.call(this, t);
},
toString: function() {
return "over[" + this.num + " / " + this.data.join("; ") + "]";
}
}), o.left = o.Subclass({
type: "left",
isOpen: !0,
delim: "(",
stopError: "Extra \\left or missing \\right",
checkItem: function(e) {
if (e.type === "right") {
var t = r.mfenced(this.data.length === 1 ? this.data[0] : r.mrow.apply(r, this.data));
return o.mml(t.With({
open: this.delim,
close: e.delim
}));
}
return this.SUPER(arguments).checkItem.call(this, e);
}
}), o.right = o.Subclass({
type: "right",
isClose: !0,
delim: ")"
}), o.begin = o.Subclass({
type: "begin",
isOpen: !0,
checkItem: function(t) {
return t.type === "end" ? (t.name !== this.name && e.Error("\\begin{" + this.name + "} ended with \\end{" + t.name + "}"), this.end ? this.parse[this.end].call(this.parse, this, this.data) : o.mml(this.mmlData())) : (t.type === "stop" && e.Error("Missing \\end{" + this.name + "}"), this.SUPER(arguments).checkItem.call(this, t));
}
}), o.end = o.Subclass({
type: "end",
isClose: !0
}), o.style = o.Subclass({
type: "style",
checkItem: function(e) {
if (!e.isClose) return this.SUPER(arguments).checkItem.call(this, e);
var t = r.mstyle.apply(r, this.data).With(this.styles);
return [ o.mml(t), e ];
}
}), o.position = o.Subclass({
type: "position",
checkItem: function(t) {
t.isClose && e.Error("Missing box for " + this.name);
if (t.isNotStack) {
var n = t.mmlData();
switch (this.move) {
case "vertical":
return n = r.mpadded(n).With({
height: this.dh,
depth: this.dd,
voffset: this.dh
}), [ o.mml(n) ];
case "horizontal":
return [ o.mml(this.left), t, o.mml(this.right) ];
}
}
return this.SUPER(arguments).checkItem.call(this, t);
}
}), o.array = o.Subclass({
type: "array",
isOpen: !0,
arraydef: {},
Init: function() {
this.table = [], this.row = [], this.env = {}, this.frame = [], this.SUPER(arguments).Init.apply(this, arguments);
},
checkItem: function(t) {
if (t.isClose && t.type !== "over") {
if (t.isEntry) return this.EndEntry(), this.clearEnv(), !1;
if (t.isCR) return this.EndEntry(), this.EndRow(), this.clearEnv(), !1;
this.EndTable(), this.clearEnv();
var n = r.mtable.apply(r, this.table).With(this.arraydef);
if (this.frame.length === 4) n.frame = this.frame.dashed ? "dashed" : "solid"; else if (this.frame.length) {
n.hasFrame = !0, this.arraydef.rowlines && (this.arraydef.rowlines = this.arraydef.rowlines.replace(/none( none)+$/, "none")), n = r.menclose(n).With({
notation: this.frame.join(" "),
isFrame: !0
});
if ((this.arraydef.columnlines || "none") != "none" || (this.arraydef.rowlines || "none") != "none") n.padding = 0;
}
if (this.open || this.close) n = r.mfenced(n).With({
open: this.open,
close: this.close
});
n = o.mml(n);
if (this.requireClose) {
if (t.type === "close") return n;
e.Error("Missing close brace");
}
return [ n, t ];
}
return this.SUPER(arguments).checkItem.call(this, t);
},
EndEntry: function() {
this.row.push(r.mtd.apply(r, this.data)), this.data = [];
},
EndRow: function() {
this.table.push(r.mtr.apply(r, this.row)), this.row = [];
},
EndTable: function() {
if (this.data.length || this.row.length) this.EndEntry(), this.EndRow();
this.checkLines();
},
checkLines: function() {
if (this.arraydef.rowlines) {
var e = this.arraydef.rowlines.split(/ /);
e.length === this.table.length ? (this.frame.push("bottom"), e.pop(), this.arraydef.rowlines = e.join(" ")) : e.length < this.table.length - 1 && (this.arraydef.rowlines += " none");
}
if (this.rowspacing) {
var t = this.arraydef.rowspacing.split(/ /);
while (t.length < this.table.length) t.push(this.rowspacing + "em");
this.arraydef.rowspacing = t.join(" ");
}
},
clearEnv: function() {
for (var e in this.env) this.env.hasOwnProperty(e) && delete this.env[e];
}
}), o.cell = o.Subclass({
type: "cell",
isClose: !0
}), o.mml = o.Subclass({
type: "mml",
isNotStack: !0,
Add: function() {
return this.data.push.apply(this.data, arguments), this;
}
}), o.fn = o.Subclass({
type: "fn",
checkItem: function(e) {
if (this.data[0]) {
if (e.type !== "mml" || !e.data[0]) return [ this.data[0], e ];
if (e.data[0].isa(r.mspace)) return [ this.data[0], e ];
var t = e.data[0];
return t.isEmbellished() && (t = t.CoreMO()), [ 0, 0, 1, 1, 0, 1, 1, 0, 0, 0 ][t.Get("texClass")] ? [ this.data[0], e ] : [ this.data[0], r.mo(r.entity("#x2061")).With({
texClass: r.TEXCLASS.NONE
}), e ];
}
return this.SUPER(arguments).checkItem.apply(this, arguments);
}
}), o.not = o.Subclass({
type: "not",
checkItem: function(e) {
var t, n;
if (e.type === "open" || e.type === "left") return !0;
if (e.type === "mml" && e.data[0].type.match(/^(mo|mi|mtext)$/)) {
t = e.data[0], n = t.data.join("");
if (n.length === 1 && !t.movesupsub) return n = o.not.remap[n.charCodeAt(0)], n ? t.SetData(0, r.chars(String.fromCharCode(n))) : t.Append(r.chars("\u0338")), e;
}
return t = r.mpadded(r.mtext("\u29f8")).With({
width: 0
}), t = r.TeXAtom(t).With({
texClass: r.TEXCLASS.REL
}), [ t, e ];
}
}), o.not.remap = {
8592: 8602,
8594: 8603,
8596: 8622,
8656: 8653,
8658: 8655,
8660: 8654,
8712: 8713,
8715: 8716,
8739: 8740,
8741: 8742,
8764: 8769,
126: 8769,
8771: 8772,
8773: 8775,
8776: 8777,
8781: 8813,
61: 8800,
8801: 8802,
60: 8814,
62: 8815,
8804: 8816,
8805: 8817,
8818: 8820,
8819: 8821,
8822: 8824,
8823: 8825,
8826: 8832,
8827: 8833,
8834: 8836,
8835: 8837,
8838: 8840,
8839: 8841,
8866: 8876,
8872: 8877,
8873: 8878,
8875: 8879,
8828: 8928,
8829: 8929,
8849: 8930,
8850: 8931,
8882: 8938,
8883: 8939,
8884: 8940,
8885: 8941,
8707: 8708
}, o.dots = o.Subclass({
type: "dots",
checkItem: function(e) {
if (e.type === "open" || e.type === "left") return !0;
var t = this.ldots;
if (e.type === "mml" && e.data[0].isEmbellished()) {
var n = e.data[0].CoreMO().Get("texClass");
if (n === r.TEXCLASS.BIN || n === r.TEXCLASS.REL) t = this.cdots;
}
return [ t, e ];
}
});
var u = {
Add: function(e, t, n) {
t || (t = this);
for (var r in e) if (e.hasOwnProperty(r)) if (typeof e[r] != "object" || e[r] instanceof Array || typeof t[r] != "object" && typeof t[r] != "function") {
if (!t[r] || !t[r].isUser || !n) t[r] = e[r];
} else this.Add(e[r], t[r], e[r], n);
return t;
}
}, a = function() {
r = MathJax.ElementJax.mml, t.Insert(u, {
letter: /[a-z]/i,
digit: /[0-9.]/,
number: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,
special: {
"\\": "ControlSequence",
"{": "Open",
"}": "Close",
"~": "Tilde",
"^": "Superscript",
_: "Subscript",
" ": "Space",
"	": "Space",
"\r": "Space",
"\n": "Space",
"'": "Prime",
"%": "Comment",
"&": "Entry",
"#": "Hash",
"\u2019": "Prime"
},
remap: {
"-": "2212",
"*": "2217"
},
mathchar0mi: {
alpha: "03B1",
beta: "03B2",
gamma: "03B3",
delta: "03B4",
epsilon: "03F5",
zeta: "03B6",
eta: "03B7",
theta: "03B8",
iota: "03B9",
kappa: "03BA",
lambda: "03BB",
mu: "03BC",
nu: "03BD",
xi: "03BE",
omicron: "03BF",
pi: "03C0",
rho: "03C1",
sigma: "03C3",
tau: "03C4",
upsilon: "03C5",
phi: "03D5",
chi: "03C7",
psi: "03C8",
omega: "03C9",
varepsilon: "03B5",
vartheta: "03D1",
varpi: "03D6",
varrho: "03F1",
varsigma: "03C2",
varphi: "03C6",
S: [ "00A7", {
mathvariant: r.VARIANT.NORMAL
} ],
aleph: [ "2135", {
mathvariant: r.VARIANT.NORMAL
} ],
hbar: [ "210F", {
variantForm: !0
} ],
imath: "0131",
jmath: "0237",
ell: "2113",
wp: [ "2118", {
mathvariant: r.VARIANT.NORMAL
} ],
Re: [ "211C", {
mathvariant: r.VARIANT.NORMAL
} ],
Im: [ "2111", {
mathvariant: r.VARIANT.NORMAL
} ],
partial: [ "2202", {
mathvariant: r.VARIANT.NORMAL
} ],
infty: [ "221E", {
mathvariant: r.VARIANT.NORMAL
} ],
prime: [ "2032", {
mathvariant: r.VARIANT.NORMAL,
variantForm: !0
} ],
emptyset: [ "2205", {
mathvariant: r.VARIANT.NORMAL
} ],
nabla: [ "2207", {
mathvariant: r.VARIANT.NORMAL
} ],
top: [ "22A4", {
mathvariant: r.VARIANT.NORMAL
} ],
bot: [ "22A5", {
mathvariant: r.VARIANT.NORMAL
} ],
angle: [ "2220", {
mathvariant: r.VARIANT.NORMAL
} ],
triangle: [ "25B3", {
mathvariant: r.VARIANT.NORMAL
} ],
backslash: [ "2216", {
mathvariant: r.VARIANT.NORMAL,
variantForm: !0
} ],
forall: [ "2200", {
mathvariant: r.VARIANT.NORMAL
} ],
exists: [ "2203", {
mathvariant: r.VARIANT.NORMAL
} ],
neg: [ "00AC", {
mathvariant: r.VARIANT.NORMAL
} ],
lnot: [ "00AC", {
mathvariant: r.VARIANT.NORMAL
} ],
flat: [ "266D", {
mathvariant: r.VARIANT.NORMAL
} ],
natural: [ "266E", {
mathvariant: r.VARIANT.NORMAL
} ],
sharp: [ "266F", {
mathvariant: r.VARIANT.NORMAL
} ],
clubsuit: [ "2663", {
mathvariant: r.VARIANT.NORMAL
} ],
diamondsuit: [ "2662", {
mathvariant: r.VARIANT.NORMAL
} ],
heartsuit: [ "2661", {
mathvariant: r.VARIANT.NORMAL
} ],
spadesuit: [ "2660", {
mathvariant: r.VARIANT.NORMAL
} ]
},
mathchar0mo: {
surd: "221A",
coprod: [ "2210", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
bigvee: [ "22C1", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
bigwedge: [ "22C0", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
biguplus: [ "2A04", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
bigcap: [ "22C2", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
bigcup: [ "22C3", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
"int": [ "222B", {
texClass: r.TEXCLASS.OP
} ],
intop: [ "222B", {
texClass: r.TEXCLASS.OP,
movesupsub: !0,
movablelimits: !0
} ],
iint: [ "222C", {
texClass: r.TEXCLASS.OP
} ],
iiint: [ "222D", {
texClass: r.TEXCLASS.OP
} ],
prod: [ "220F", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
sum: [ "2211", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
bigotimes: [ "2A02", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
bigoplus: [ "2A01", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
bigodot: [ "2A00", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
oint: [ "222E", {
texClass: r.TEXCLASS.OP
} ],
bigsqcup: [ "2A06", {
texClass: r.TEXCLASS.OP,
movesupsub: !0
} ],
smallint: [ "222B", {
largeop: !1
} ],
triangleleft: "25C3",
triangleright: "25B9",
bigtriangleup: "25B3",
bigtriangledown: "25BD",
wedge: "2227",
land: "2227",
vee: "2228",
lor: "2228",
cap: "2229",
cup: "222A",
ddagger: "2021",
dagger: "2020",
sqcap: "2293",
sqcup: "2294",
uplus: "228E",
amalg: "2A3F",
diamond: "22C4",
bullet: "2219",
wr: "2240",
div: "00F7",
odot: [ "2299", {
largeop: !1
} ],
oslash: [ "2298", {
largeop: !1
} ],
otimes: [ "2297", {
largeop: !1
} ],
ominus: [ "2296", {
largeop: !1
} ],
oplus: [ "2295", {
largeop: !1
} ],
mp: "2213",
pm: "00B1",
circ: "2218",
bigcirc: "25EF",
setminus: [ "2216", {
variantForm: !0
} ],
cdot: "22C5",
ast: "2217",
times: "00D7",
star: "22C6",
propto: "221D",
sqsubseteq: "2291",
sqsupseteq: "2292",
parallel: "2225",
mid: "2223",
dashv: "22A3",
vdash: "22A2",
leq: "2264",
le: "2264",
geq: "2265",
ge: "2265",
lt: "003C",
gt: "003E",
succ: "227B",
prec: "227A",
approx: "2248",
succeq: "2AB0",
preceq: "2AAF",
supset: "2283",
subset: "2282",
supseteq: "2287",
subseteq: "2286",
"in": "2208",
ni: "220B",
notin: "2209",
owns: "220B",
gg: "226B",
ll: "226A",
sim: "223C",
simeq: "2243",
perp: "22A5",
equiv: "2261",
asymp: "224D",
smile: "2323",
frown: "2322",
ne: "2260",
neq: "2260",
cong: "2245",
doteq: "2250",
bowtie: "22C8",
models: "22A8",
notChar: "29F8",
Leftrightarrow: "21D4",
Leftarrow: "21D0",
Rightarrow: "21D2",
leftrightarrow: "2194",
leftarrow: "2190",
gets: "2190",
rightarrow: "2192",
to: "2192",
mapsto: "21A6",
leftharpoonup: "21BC",
leftharpoondown: "21BD",
rightharpoonup: "21C0",
rightharpoondown: "21C1",
nearrow: "2197",
searrow: "2198",
nwarrow: "2196",
swarrow: "2199",
rightleftharpoons: "21CC",
hookrightarrow: "21AA",
hookleftarrow: "21A9",
longleftarrow: "27F5",
Longleftarrow: "27F8",
longrightarrow: "27F6",
Longrightarrow: "27F9",
Longleftrightarrow: "27FA",
longleftrightarrow: "27F7",
longmapsto: "27FC",
ldots: "2026",
cdots: "22EF",
vdots: "22EE",
ddots: "22F1",
dotsc: "2026",
dotsb: "22EF",
dotsm: "22EF",
dotsi: "22EF",
dotso: "2026",
ldotp: [ "002E", {
texClass: r.TEXCLASS.PUNCT
} ],
cdotp: [ "22C5", {
texClass: r.TEXCLASS.PUNCT
} ],
colon: [ "003A", {
texClass: r.TEXCLASS.PUNCT
} ]
},
mathchar7: {
Gamma: "0393",
Delta: "0394",
Theta: "0398",
Lambda: "039B",
Xi: "039E",
Pi: "03A0",
Sigma: "03A3",
Upsilon: "03A5",
Phi: "03A6",
Psi: "03A8",
Omega: "03A9",
_: "005F",
"#": "0023",
$: "0024",
"%": "0025",
"&": "0026",
And: "0026"
},
delimiter: {
"(": "(",
")": ")",
"[": "[",
"]": "]",
"<": "27E8",
">": "27E9",
"\\lt": "27E8",
"\\gt": "27E9",
"/": "/",
"|": [ "|", {
texClass: r.TEXCLASS.ORD
} ],
".": "",
"\\\\": "\\",
"\\lmoustache": "23B0",
"\\rmoustache": "23B1",
"\\lgroup": "27EE",
"\\rgroup": "27EF",
"\\arrowvert": "23D0",
"\\Arrowvert": "2016",
"\\bracevert": "23AA",
"\\Vert": [ "2225", {
texClass: r.TEXCLASS.ORD
} ],
"\\|": [ "2225", {
texClass: r.TEXCLASS.ORD
} ],
"\\vert": [ "|", {
texClass: r.TEXCLASS.ORD
} ],
"\\uparrow": "2191",
"\\downarrow": "2193",
"\\updownarrow": "2195",
"\\Uparrow": "21D1",
"\\Downarrow": "21D3",
"\\Updownarrow": "21D5",
"\\backslash": "\\",
"\\rangle": "27E9",
"\\langle": "27E8",
"\\rbrace": "}",
"\\lbrace": "{",
"\\}": "}",
"\\{": "{",
"\\rceil": "2309",
"\\lceil": "2308",
"\\rfloor": "230B",
"\\lfloor": "230A",
"\\lbrack": "[",
"\\rbrack": "]"
},
macros: {
displaystyle: [ "SetStyle", "D", !0, 0 ],
textstyle: [ "SetStyle", "T", !1, 0 ],
scriptstyle: [ "SetStyle", "S", !1, 1 ],
scriptscriptstyle: [ "SetStyle", "SS", !1, 2 ],
rm: [ "SetFont", r.VARIANT.NORMAL ],
mit: [ "SetFont", r.VARIANT.ITALIC ],
oldstyle: [ "SetFont", r.VARIANT.OLDSTYLE ],
cal: [ "SetFont", r.VARIANT.CALIGRAPHIC ],
it: [ "SetFont", "-tex-mathit" ],
bf: [ "SetFont", r.VARIANT.BOLD ],
bbFont: [ "SetFont", r.VARIANT.DOUBLESTRUCK ],
scr: [ "SetFont", r.VARIANT.SCRIPT ],
frak: [ "SetFont", r.VARIANT.FRAKTUR ],
sf: [ "SetFont", r.VARIANT.SANSSERIF ],
tt: [ "SetFont", r.VARIANT.MONOSPACE ],
tiny: [ "SetSize", .5 ],
Tiny: [ "SetSize", .6 ],
scriptsize: [ "SetSize", .7 ],
small: [ "SetSize", .85 ],
normalsize: [ "SetSize", 1 ],
large: [ "SetSize", 1.2 ],
Large: [ "SetSize", 1.44 ],
LARGE: [ "SetSize", 1.73 ],
huge: [ "SetSize", 2.07 ],
Huge: [ "SetSize", 2.49 ],
arcsin: [ "NamedFn" ],
arccos: [ "NamedFn" ],
arctan: [ "NamedFn" ],
arg: [ "NamedFn" ],
cos: [ "NamedFn" ],
cosh: [ "NamedFn" ],
cot: [ "NamedFn" ],
coth: [ "NamedFn" ],
csc: [ "NamedFn" ],
deg: [ "NamedFn" ],
det: "NamedOp",
dim: [ "NamedFn" ],
exp: [ "NamedFn" ],
gcd: "NamedOp",
hom: [ "NamedFn" ],
inf: "NamedOp",
ker: [ "NamedFn" ],
lg: [ "NamedFn" ],
lim: "NamedOp",
liminf: [ "NamedOp", "lim&thinsp;inf" ],
limsup: [ "NamedOp", "lim&thinsp;sup" ],
ln: [ "NamedFn" ],
log: [ "NamedFn" ],
max: "NamedOp",
min: "NamedOp",
Pr: "NamedOp",
sec: [ "NamedFn" ],
sin: [ "NamedFn" ],
sinh: [ "NamedFn" ],
sup: "NamedOp",
tan: [ "NamedFn" ],
tanh: [ "NamedFn" ],
limits: [ "Limits", 1 ],
nolimits: [ "Limits", 0 ],
overline: [ "UnderOver", "00AF" ],
underline: [ "UnderOver", "005F" ],
overbrace: [ "UnderOver", "23DE", 1 ],
underbrace: [ "UnderOver", "23DF", 1 ],
overrightarrow: [ "UnderOver", "2192" ],
underrightarrow: [ "UnderOver", "2192" ],
overleftarrow: [ "UnderOver", "2190" ],
underleftarrow: [ "UnderOver", "2190" ],
overleftrightarrow: [ "UnderOver", "2194" ],
underleftrightarrow: [ "UnderOver", "2194" ],
overset: "Overset",
underset: "Underset",
stackrel: [ "Macro", "\\mathrel{\\mathop{#2}\\limits^{#1}}", 2 ],
over: "Over",
overwithdelims: "Over",
atop: "Over",
atopwithdelims: "Over",
above: "Over",
abovewithdelims: "Over",
brace: [ "Over", "{", "}" ],
brack: [ "Over", "[", "]" ],
choose: [ "Over", "(", ")" ],
frac: "Frac",
sqrt: "Sqrt",
root: "Root",
uproot: [ "MoveRoot", "upRoot" ],
leftroot: [ "MoveRoot", "leftRoot" ],
left: "LeftRight",
right: "LeftRight",
middle: "Middle",
llap: "Lap",
rlap: "Lap",
raise: "RaiseLower",
lower: "RaiseLower",
moveleft: "MoveLeftRight",
moveright: "MoveLeftRight",
",": [ "Spacer", r.LENGTH.THINMATHSPACE ],
":": [ "Spacer", r.LENGTH.MEDIUMMATHSPACE ],
">": [ "Spacer", r.LENGTH.MEDIUMMATHSPACE ],
";": [ "Spacer", r.LENGTH.THICKMATHSPACE ],
"!": [ "Spacer", r.LENGTH.NEGATIVETHINMATHSPACE ],
enspace: [ "Spacer", ".5em" ],
quad: [ "Spacer", "1em" ],
qquad: [ "Spacer", "2em" ],
thinspace: [ "Spacer", r.LENGTH.THINMATHSPACE ],
negthinspace: [ "Spacer", r.LENGTH.NEGATIVETHINMATHSPACE ],
hskip: "Hskip",
hspace: "Hskip",
kern: "Hskip",
mskip: "Hskip",
mspace: "Hskip",
mkern: "Hskip",
Rule: [ "Rule" ],
Space: [ "Rule", "blank" ],
big: [ "MakeBig", r.TEXCLASS.ORD, .85 ],
Big: [ "MakeBig", r.TEXCLASS.ORD, 1.15 ],
bigg: [ "MakeBig", r.TEXCLASS.ORD, 1.45 ],
Bigg: [ "MakeBig", r.TEXCLASS.ORD, 1.75 ],
bigl: [ "MakeBig", r.TEXCLASS.OPEN, .85 ],
Bigl: [ "MakeBig", r.TEXCLASS.OPEN, 1.15 ],
biggl: [ "MakeBig", r.TEXCLASS.OPEN, 1.45 ],
Biggl: [ "MakeBig", r.TEXCLASS.OPEN, 1.75 ],
bigr: [ "MakeBig", r.TEXCLASS.CLOSE, .85 ],
Bigr: [ "MakeBig", r.TEXCLASS.CLOSE, 1.15 ],
biggr: [ "MakeBig", r.TEXCLASS.CLOSE, 1.45 ],
Biggr: [ "MakeBig", r.TEXCLASS.CLOSE, 1.75 ],
bigm: [ "MakeBig", r.TEXCLASS.REL, .85 ],
Bigm: [ "MakeBig", r.TEXCLASS.REL, 1.15 ],
biggm: [ "MakeBig", r.TEXCLASS.REL, 1.45 ],
Biggm: [ "MakeBig", r.TEXCLASS.REL, 1.75 ],
mathord: [ "TeXAtom", r.TEXCLASS.ORD ],
mathop: [ "TeXAtom", r.TEXCLASS.OP ],
mathopen: [ "TeXAtom", r.TEXCLASS.OPEN ],
mathclose: [ "TeXAtom", r.TEXCLASS.CLOSE ],
mathbin: [ "TeXAtom", r.TEXCLASS.BIN ],
mathrel: [ "TeXAtom", r.TEXCLASS.REL ],
mathpunct: [ "TeXAtom", r.TEXCLASS.PUNCT ],
mathinner: [ "TeXAtom", r.TEXCLASS.INNER ],
vcenter: [ "TeXAtom", r.TEXCLASS.VCENTER ],
mathchoice: [ "Extension", "mathchoice" ],
buildrel: "BuildRel",
hbox: [ "HBox", 0 ],
text: "HBox",
mbox: [ "HBox", 0 ],
fbox: "FBox",
strut: "Strut",
mathstrut: [ "Macro", "\\vphantom{(}" ],
phantom: "Phantom",
vphantom: [ "Phantom", 1, 0 ],
hphantom: [ "Phantom", 0, 1 ],
smash: "Smash",
acute: [ "Accent", "00B4" ],
grave: [ "Accent", "0060" ],
ddot: [ "Accent", "00A8" ],
tilde: [ "Accent", "007E" ],
bar: [ "Accent", "00AF" ],
breve: [ "Accent", "02D8" ],
check: [ "Accent", "02C7" ],
hat: [ "Accent", "005E" ],
vec: [ "Accent", "2192" ],
dot: [ "Accent", "02D9" ],
widetilde: [ "Accent", "007E", 1 ],
widehat: [ "Accent", "005E", 1 ],
matrix: "Matrix",
array: "Matrix",
pmatrix: [ "Matrix", "(", ")" ],
cases: [ "Matrix", "{", "", "left left", null, ".1em", null, !0 ],
eqalign: [ "Matrix", null, null, "right left", r.LENGTH.THICKMATHSPACE, ".5em", "D" ],
displaylines: [ "Matrix", null, null, "center", null, ".5em", "D" ],
cr: "Cr",
"\\": "CrLaTeX",
newline: "Cr",
hline: [ "HLine", "solid" ],
hdashline: [ "HLine", "dashed" ],
eqalignno: [ "Matrix", null, null, "right left right", r.LENGTH.THICKMATHSPACE + " 3em", ".5em", "D" ],
leqalignno: [ "Matrix", null, null, "right left right", r.LENGTH.THICKMATHSPACE + " 3em", ".5em", "D" ],
bmod: [ "Macro", "\\mathbin{\\mmlToken{mo}{mod}}" ],
pmod: [ "Macro", "\\pod{\\mmlToken{mi}{mod}\\kern 6mu #1}", 1 ],
mod: [ "Macro", "\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,#1", 1 ],
pod: [ "Macro", "\\mathchoice{\\kern18mu}{\\kern8mu}{\\kern8mu}{\\kern8mu}(#1)", 1 ],
iff: [ "Macro", "\\;\\Longleftrightarrow\\;" ],
skew: [ "Macro", "{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}", 3 ],
mathcal: [ "Macro", "{\\cal #1}", 1 ],
mathscr: [ "Macro", "{\\scr #1}", 1 ],
mathrm: [ "Macro", "{\\rm #1}", 1 ],
mathbf: [ "Macro", "{\\bf #1}", 1 ],
mathbb: [ "Macro", "{\\bbFont #1}", 1 ],
Bbb: [ "Macro", "{\\bbFont #1}", 1 ],
mathit: [ "Macro", "{\\it #1}", 1 ],
mathfrak: [ "Macro", "{\\frak #1}", 1 ],
mathsf: [ "Macro", "{\\sf #1}", 1 ],
mathtt: [ "Macro", "{\\tt #1}", 1 ],
textrm: [ "Macro", "\\mathord{\\rm\\text{#1}}", 1 ],
textit: [ "Macro", "\\mathord{\\it{\\text{#1}}}", 1 ],
textbf: [ "Macro", "\\mathord{\\bf{\\text{#1}}}", 1 ],
pmb: [ "Macro", "\\rlap{#1}\\kern1px{#1}", 1 ],
TeX: [ "Macro", "T\\kern-.14em\\lower.5ex{E}\\kern-.115em X" ],
LaTeX: [ "Macro", "L\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX" ],
" ": [ "Macro", "\\text{ }" ],
not: "Not",
dots: "Dots",
space: "Tilde",
begin: "Begin",
end: "End",
newcommand: [ "Extension", "newcommand" ],
renewcommand: [ "Extension", "newcommand" ],
newenvironment: [ "Extension", "newcommand" ],
renewenvironment: [ "Extension", "newcommand" ],
def: [ "Extension", "newcommand" ],
let: [ "Extension", "newcommand" ],
verb: [ "Extension", "verb" ],
boldsymbol: [ "Extension", "boldsymbol" ],
tag: [ "Extension", "AMSmath" ],
notag: [ "Extension", "AMSmath" ],
label: [ "Extension", "AMSmath" ],
ref: [ "Extension", "AMSmath" ],
eqref: [ "Extension", "AMSmath" ],
nonumber: [ "Macro", "\\notag" ],
unicode: [ "Extension", "unicode" ],
color: "Color",
href: [ "Extension", "HTML" ],
"class": [ "Extension", "HTML" ],
style: [ "Extension", "HTML" ],
cssId: [ "Extension", "HTML" ],
bbox: [ "Extension", "bbox" ],
mmlToken: "MmlToken",
require: "Require"
},
environment: {
array: [ "AlignedArray" ],
matrix: [ "Array", null, null, null, "c" ],
pmatrix: [ "Array", null, "(", ")", "c" ],
bmatrix: [ "Array", null, "[", "]", "c" ],
Bmatrix: [ "Array", null, "\\{", "\\}", "c" ],
vmatrix: [ "Array", null, "\\vert", "\\vert", "c" ],
Vmatrix: [ "Array", null, "\\Vert", "\\Vert", "c" ],
cases: [ "Array", null, "\\{", ".", "ll", null, ".1em" ],
equation: [ null, "Equation" ],
"equation*": [ null, "Equation" ],
eqnarray: [ "ExtensionEnv", null, "AMSmath" ],
"eqnarray*": [ "ExtensionEnv", null, "AMSmath" ],
align: [ "ExtensionEnv", null, "AMSmath" ],
"align*": [ "ExtensionEnv", null, "AMSmath" ],
aligned: [ "ExtensionEnv", null, "AMSmath" ],
multline: [ "ExtensionEnv", null, "AMSmath" ],
"multline*": [ "ExtensionEnv", null, "AMSmath" ],
split: [ "ExtensionEnv", null, "AMSmath" ],
gather: [ "ExtensionEnv", null, "AMSmath" ],
"gather*": [ "ExtensionEnv", null, "AMSmath" ],
gathered: [ "ExtensionEnv", null, "AMSmath" ],
alignat: [ "ExtensionEnv", null, "AMSmath" ],
"alignat*": [ "ExtensionEnv", null, "AMSmath" ],
alignedat: [ "ExtensionEnv", null, "AMSmath" ]
},
p_height: 1.2 / .85
});
if (this.config.Macros) {
var e = this.config.Macros;
for (var n in e) e.hasOwnProperty(n) && (typeof e[n] == "string" ? u.macros[n] = [ "Macro", e[n] ] : u.macros[n] = [ "Macro" ].concat(e[n]), u.macros[n].isUser = !0);
}
}, f = MathJax.Object.Subclass({
Init: function(t, n) {
this.string = t, this.i = 0, this.macroCount = 0;
var r;
if (n) {
r = {};
for (var i in n) n.hasOwnProperty(i) && (r[i] = n[i]);
}
this.stack = e.Stack(r, !!n), this.Parse(), this.Push(o.stop());
},
Parse: function() {
var e, t;
while (this.i < this.string.length) e = this.string.charAt(this.i++), t = e.charCodeAt(0), t >= 55296 && t < 56320 && (e += this.string.charAt(this.i++)), u.special[e] ? this[u.special[e]](e) : u.letter.test(e) ? this.Variable(e) : u.digit.test(e) ? this.Number(e) : this.Other(e);
},
Push: function() {
this.stack.Push.apply(this.stack, arguments);
},
mml: function() {
return this.stack.Top().type !== "mml" ? null : this.stack.Top().data[0];
},
mmlToken: function(e) {
return e;
},
ControlSequence: function(e) {
var t = this.GetCS(), n = this.csFindMacro(t);
if (n) {
n instanceof Array || (n = [ n ]);
var r = n[0];
r instanceof Function || (r = this[r]), r.apply(this, [ e + t ].concat(n.slice(1)));
} else u.mathchar0mi[t] ? this.csMathchar0mi(t, u.mathchar0mi[t]) : u.mathchar0mo[t] ? this.csMathchar0mo(t, u.mathchar0mo[t]) : u.mathchar7[t] ? this.csMathchar7(t, u.mathchar7[t]) : u.delimiter["\\" + t] != null ? this.csDelimiter(t, u.delimiter["\\" + t]) : this.csUndefined(e + t);
},
csFindMacro: function(e) {
return u.macros[e];
},
csMathchar0mi: function(e, t) {
var n = {
mathvariant: r.VARIANT.ITALIC
};
t instanceof Array && (n = t[1], t = t[0]), this.Push(this.mmlToken(r.mi(r.entity("#x" + t)).With(n)));
},
csMathchar0mo: function(e, t) {
var n = {
stretchy: !1
};
t instanceof Array && (n = t[1], n.stretchy = !1, t = t[0]), this.Push(this.mmlToken(r.mo(r.entity("#x" + t)).With(n)));
},
csMathchar7: function(e, t) {
var n = {
mathvariant: r.VARIANT.NORMAL
};
t instanceof Array && (n = t[1], t = t[0]), this.stack.env.font && (n.mathvariant = this.stack.env.font), this.Push(this.mmlToken(r.mi(r.entity("#x" + t)).With(n)));
},
csDelimiter: function(e, t) {
var n = {};
t instanceof Array && (n = t[1], t = t[0]), t.length === 4 ? t = r.entity("#x" + t) : t = r.chars(t), this.Push(this.mmlToken(r.mo(t).With({
fence: !1,
stretchy: !1
}).With(n)));
},
csUndefined: function(t) {
e.Error("Undefined control sequence " + t);
},
Variable: function(e) {
var t = {};
this.stack.env.font && (t.mathvariant = this.stack.env.font), this.Push(this.mmlToken(r.mi(r.chars(e)).With(t)));
},
Number: function(e) {
var t, n = this.string.slice(this.i - 1).match(u.number);
n ? (t = r.mn(n[0].replace(/[{}]/g, "")), this.i += n[0].length - 1) : t = r.mo(r.chars(e)), this.stack.env.font && (t.mathvariant = this.stack.env.font), this.Push(this.mmlToken(t));
},
Open: function(e) {
this.Push(o.open());
},
Close: function(e) {
this.Push(o.close());
},
Tilde: function(e) {
this.Push(r.mtext(r.chars(i)));
},
Space: function(e) {},
Superscript: function(t) {
this.GetNext().match(/\d/) && (this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1));
var n, i, s, u = this.stack.Top();
u.type === "prime" ? (s = u.data[0], i = u.data[1], this.stack.Pop()) : (s = this.stack.Prev(), s || (s = r.mi(""))), s.isEmbellishedWrapper && (s = s.data[0].data[0]);
if (s.type === "msubsup") s.data[s.sup] && e.Error("Double exponent: use braces to clarify"), n = s.sup; else if (s.movesupsub) {
if (s.type !== "munderover" || s.data[s.over]) s.movablelimits && s.isa(r.mi) && (s = this.mi2mo(s)), s = r.munderover(s, null, null).With({
movesupsub: !0
});
n = s.over;
} else s = r.msubsup(s, null, null), n = s.sup;
this.Push(o.subsup(s).With({
position: n,
primes: i
}));
},
Subscript: function(t) {
this.GetNext().match(/\d/) && (this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1));
var n, i, s, u = this.stack.Top();
u.type === "prime" ? (s = u.data[0], i = u.data[1], this.stack.Pop()) : (s = this.stack.Prev(), s || (s = r.mi(""))), s.isEmbellishedWrapper && (s = s.data[0].data[0]);
if (s.type === "msubsup") s.data[s.sub] && e.Error("Double subscripts: use braces to clarify"), n = s.sub; else if (s.movesupsub) {
if (s.type !== "munderover" || s.data[s.under]) s.movablelimits && s.isa(r.mi) && (s = this.mi2mo(s)), s = r.munderover(s, null, null).With({
movesupsub: !0
});
n = s.under;
} else s = r.msubsup(s, null, null), n = s.sub;
this.Push(o.subsup(s).With({
position: n,
primes: i
}));
},
PRIME: "\u2032",
SMARTQUOTE: "\u2019",
Prime: function(t) {
var n = this.stack.Prev();
n || (n = r.mi()), n.type === "msubsup" && n.data[n.sup] && e.Error("Prime causes double exponent: use braces to clarify");
var i = "";
this.i--;
do i += this.PRIME, this.i++, t = this.GetNext(); while (t === "'" || t === this.SMARTQUOTE);
i = [ "", "\u2032", "\u2033", "\u2034", "\u2057" ][i.length] || i, this.Push(o.prime(n, this.mmlToken(r.mo(i))));
},
mi2mo: function(e) {
var t = r.mo();
t.Append.apply(t, e.data);
var n;
for (n in t.defaults) t.defaults.hasOwnProperty(n) && e[n] != null && (t[n] = e[n]);
for (n in r.copyAttributes) r.copyAttributes.hasOwnProperty(n) && e[n] != null && (t[n] = e[n]);
return t;
},
Comment: function(e) {
while (this.i < this.string.length && this.string.charAt(this.i) != "\n") this.i++;
},
Hash: function(t) {
e.Error("You can't use 'macro parameter character #' in math mode");
},
Other: function(e) {
var t = {
stretchy: !1
}, n;
this.stack.env.font && (t.mathvariant = this.stack.env.font), u.remap[e] ? (e = u.remap[e], e instanceof Array && (t = e[1], e = e[0]), n = r.mo(r.entity("#x" + e)).With(t)) : n = r.mo(e).With(t), n.autoDefault("texClass", true) == "" && (n = r.TeXAtom(n)), this.Push(this.mmlToken(n));
},
SetFont: function(e, t) {
this.stack.env.font = t;
},
SetStyle: function(e, t, n, r) {
this.stack.env.style = t, this.stack.env.level = r, this.Push(o.style().With({
styles: {
displaystyle: n,
scriptlevel: r
}
}));
},
SetSize: function(e, t) {
this.stack.env.size = t, this.Push(o.style().With({
styles: {
mathsize: t + "em"
}
}));
},
Color: function(e) {
var t = this.GetArgument(e), n = this.stack.env.color;
this.stack.env.color = t;
var i = this.ParseArg(e);
n ? this.stack.env.color : delete this.stack.env.color, this.Push(r.mstyle(i).With({
mathcolor: t
}));
},
Spacer: function(e, t) {
this.Push(r.mspace().With({
width: t,
mathsize: r.SIZE.NORMAL,
scriptlevel: 0
}));
},
LeftRight: function(e) {
this.Push(o[e.substr(1)]().With({
delim: this.GetDelimiter(e)
}));
},
Middle: function(t) {
var n = this.GetDelimiter(t);
this.stack.Top().type !== "left" && e.Error(t + " must be within \\left and \\right"), this.Push(r.mo(n).With({
stretchy: !0
}));
},
NamedFn: function(e, t) {
t || (t = e.substr(1));
var n = r.mi(t).With({
texClass: r.TEXCLASS.OP
});
this.Push(o.fn(this.mmlToken(n)));
},
NamedOp: function(e, t) {
t || (t = e.substr(1)), t = t.replace(/&thinsp;/, "\u2006");
var n = r.mo(t).With({
movablelimits: !0,
movesupsub: !0,
form: r.FORM.PREFIX,
texClass: r.TEXCLASS.OP
});
n.useMMLspacing &= ~n.SPACE_ATTR.form, this.Push(this.mmlToken(n));
},
Limits: function(t, n) {
var i = this.stack.Prev("nopop");
(!i || i.texClass !== r.TEXCLASS.OP) && e.Error(t + " is allowed only on operators"), i.movesupsub = n ? !0 : !1, i.movablelimits = !1;
},
Over: function(e, t, n) {
var r = o.over().With({
name: e
});
t || n ? (r.open = t, r.close = n) : e.match(/withdelims$/) && (r.open = this.GetDelimiter(e), r.close = this.GetDelimiter(e));
if (e.match(/^\\above/)) r.thickness = this.GetDimen(e); else if (e.match(/^\\atop/) || t || n) r.thickness = 0;
this.Push(r);
},
Frac: function(e) {
var t = this.ParseArg(e), n = this.ParseArg(e);
this.Push(r.mfrac(t, n));
},
Sqrt: function(t) {
var n = this.GetBrackets(t), i = this.GetArgument(t);
i === "\\frac" && (i += "{" + this.GetArgument(i) + "}{" + this.GetArgument(i) + "}");
var s = e.Parse(i, this.stack.env).mml();
n ? s = r.mroot(s, this.parseRoot(n)) : s = r.msqrt.apply(r, s.array()), this.Push(s);
},
Root: function(e) {
var t = this.GetUpTo(e, "\\of"), n = this.ParseArg(e);
this.Push(r.mroot(n, this.parseRoot(t)));
},
parseRoot: function(t) {
var n = this.stack.env, i = n.inRoot;
n.inRoot = !0;
var s = e.Parse(t, n);
t = s.mml();
var o = s.stack.global;
if (o.leftRoot || o.upRoot) t = r.mpadded(t), o.leftRoot && (t.width = o.leftRoot), o.upRoot && (t.voffset = o.upRoot, t.height = o.upRoot);
return n.inRoot = i, t;
},
MoveRoot: function(t, n) {
this.stack.env.inRoot || e.Error(t + " can appear only within a root"), this.stack.global[n] && e.Error("Multiple use of " + t);
var r = this.GetArgument(t);
r.match(/-?[0-9]+/) || e.Error("The argument to " + t + " must be an integer"), r = r / 15 + "em", r.substr(0, 1) !== "-" && (r = "+" + r), this.stack.global[n] = r;
},
Accent: function(e, t, n) {
var i = this.ParseArg(e), s = {
accent: !0
};
this.stack.env.font && (s.mathvariant = this.stack.env.font);
var o = this.mmlToken(r.mo(r.entity("#x" + t)).With(s));
o.stretchy = n ? !0 : !1, this.Push(r.TeXAtom(r.munderover(i, null, o).With({
accent: !0
})));
},
UnderOver: function(e, t, n) {
var i = {
o: "over",
u: "under"
}[e.charAt(1)], s = this.ParseArg(e);
s.Get("movablelimits") && (s.movablelimits = !1);
var o = r.munderover(s, null, null);
n && (o.movesupsub = !0), o.data[o[i]] = this.mmlToken(r.mo(r.entity("#x" + t)).With({
stretchy: !0,
accent: i == "under"
})), this.Push(o);
},
Overset: function(e) {
var t = this.ParseArg(e), n = this.ParseArg(e);
this.Push(r.mover(n, t));
},
Underset: function(e) {
var t = this.ParseArg(e), n = this.ParseArg(e);
this.Push(r.munder(n, t));
},
TeXAtom: function(t, n) {
var i = {
texClass: n
}, s;
if (n == r.TEXCLASS.OP) {
i.movesupsub = i.movablelimits = !0;
var u = this.GetArgument(t), a = u.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
a ? (i.mathvariant = r.VARIANT.NORMAL, s = o.fn(this.mmlToken(r.mi(a[1]).With(i)))) : s = o.fn(r.TeXAtom(e.Parse(u, this.stack.env).mml()).With(i));
} else s = r.TeXAtom(this.ParseArg(t)).With(i);
this.Push(s);
},
MmlToken: function(t) {
var n = this.GetArgument(t), i = this.GetBrackets(t, "").replace(/^\s+/, ""), s = this.GetArgument(t), o = {
attrNames: []
}, u;
(!r[n] || !r[n].prototype.isToken) && e.Error(n + " is not a token element");
while (i !== "") u = i.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ]*)\s*/i), u || e.Error("Invalid MathML attribute: " + i), !r[n].prototype.defaults[u[1]] && !this.MmlTokenAllow[u[1]] && e.Error(u[1] + " is not a recognized attribute for " + n), o[u[1]] = u[2].replace(/^(['"])(.*)\1$/, "$2"), o.attrNames.push(u[1]), i = i.substr(u[0].length);
this.Push(this.mmlToken(r[n](s).With(o)));
},
MmlTokenAllow: {
fontfamily: 1,
fontsize: 1,
fontweight: 1,
fontstyle: 1,
color: 1,
background: 1,
id: 1,
"class": 1,
href: 1,
style: 1
},
Strut: function(e) {
this.Push(r.mpadded(r.mrow()).With({
height: "8.6pt",
depth: "3pt",
width: 0
}));
},
Phantom: function(e, t, n) {
var i = r.mphantom(this.ParseArg(e));
if (t || n) i = r.mpadded(i), n && (i.height = i.depth = 0), t && (i.width = 0);
this.Push(r.TeXAtom(i));
},
Smash: function(e) {
var t = this.trimSpaces(this.GetBrackets(e, "")), n = r.mpadded(this.ParseArg(e));
switch (t) {
case "b":
n.depth = 0;
break;
case "t":
n.height = 0;
break;
default:
n.height = n.depth = 0;
}
this.Push(r.TeXAtom(n));
},
Lap: function(e) {
var t = r.mpadded(this.ParseArg(e)).With({
width: 0
});
e === "\\llap" && (t.lspace = "-1 width"), this.Push(r.TeXAtom(t));
},
RaiseLower: function(e) {
var t = this.GetDimen(e), n = o.position().With({
name: e,
move: "vertical"
});
t.charAt(0) === "-" && (t = t.slice(1), e = {
raise: "\\lower",
lower: "\\raise"
}[e.substr(1)]), e === "\\lower" ? (n.dh = "-" + t, n.dd = "+" + t) : (n.dh = "+" + t, n.dd = "-" + t), this.Push(n);
},
MoveLeftRight: function(e) {
var t = this.GetDimen(e), n = t.charAt(0) === "-" ? t.slice(1) : "-" + t;
if (e === "\\moveleft") {
var i = t;
t = n, n = i;
}
this.Push(o.position().With({
name: e,
move: "horizontal",
left: r.mspace().With({
width: t,
mathsize: r.SIZE.NORMAL
}),
right: r.mspace().With({
width: n,
mathsize: r.SIZE.NORMAL
})
}));
},
Hskip: function(e) {
this.Push(r.mspace().With({
width: this.GetDimen(e),
mathsize: r.SIZE.NORMAL
}));
},
Rule: function(e, t) {
var n = this.GetDimen(e), i = this.GetDimen(e), s = this.GetDimen(e), o, u = {
width: n,
height: i,
depth: s
};
t !== "blank" ? (parseFloat(n) && parseFloat(i) + parseFloat(s) && (u.mathbackground = this.stack.env.color || "black"), o = r.mpadded(r.mrow()).With(u)) : o = r.mspace().With(u), this.Push(o);
},
MakeBig: function(e, t, n) {
n *= u.p_height, n = String(n).replace(/(\.\d\d\d).+/, "$1") + "em";
var i = this.GetDelimiter(e);
this.Push(r.TeXAtom(r.mo(i).With({
minsize: n,
maxsize: n,
scriptlevel: 0,
fence: !0,
stretchy: !0,
symmetric: !0
})).With({
texClass: t
}));
},
BuildRel: function(e) {
var t = this.ParseUpTo(e, "\\over"), n = this.ParseArg(e);
this.Push(r.TeXAtom(r.munderover(n, null, t)).With({
mclass: r.TEXCLASS.REL
}));
},
HBox: function(e, t) {
this.Push.apply(this, this.InternalMath(this.GetArgument(e), t));
},
FBox: function(e) {
this.Push(r.menclose.apply(r, this.InternalMath(this.GetArgument(e))).With({
notation: "box"
}));
},
Not: function(e) {
this.Push(o.not());
},
Dots: function(e) {
this.Push(o.dots().With({
ldots: this.mmlToken(r.mo(r.entity("#x2026")).With({
stretchy: !1
})),
cdots: this.mmlToken(r.mo(r.entity("#x22EF")).With({
stretchy: !1
}))
}));
},
Require: function(e) {
var t = this.GetArgument(e).replace(/.*\//, "").replace(/[^a-z0-9_.-]/ig, "");
this.Extension(null, t);
},
Extension: function(r, i, s) {
r && !typeof r === "string" && (r = r.name), i = e.extensionDir + "/" + i, i.match(/\.js$/) || (i += ".js"), n.loaded[n.fileURL(i)] || (r != null && delete u[s || "macros"][r.replace(/^\\/, "")], t.RestartAfter(n.Require(i)));
},
Macro: function(t, n, r, i) {
if (r) {
var s = [];
if (i != null) {
var o = this.GetBrackets(t);
s.push(o == null ? i : o);
}
for (var u = s.length; u < r; u++) s.push(this.GetArgument(t));
n = this.SubstituteArgs(s, n);
}
this.string = this.AddArgs(n, this.string.slice(this.i)), this.i = 0, ++this.macroCount > e.config.MAXMACROS && e.Error("MathJax maximum macro substitution count exceeded; is there a recursive macro call?");
},
Matrix: function(t, n, r, i, s, u, a, f) {
var l = this.GetNext();
l === "" && e.Error("Missing argument for " + t), l === "{" ? this.i++ : (this.string = l + "}" + this.string.slice(this.i + 1), this.i = 0);
var c = o.array().With({
requireClose: !0,
arraydef: {
rowspacing: u || "4pt",
columnspacing: s || "1em"
}
});
f && (c.isCases = !0);
if (n || r) c.open = n, c.close = r;
a === "D" && (c.arraydef.displaystyle = !0), i != null && (c.arraydef.columnalign = i), this.Push(c);
},
Entry: function(t) {
this.Push(o.cell().With({
isEntry: !0,
name: t
}));
if (this.stack.Top().isCases) {
var n = this.string, r = 0, i = this.i, s = n.length;
while (i < s) {
var u = n.charAt(i);
u === "{" ? (r++, i++) : u === "}" ? r === 0 ? s = 0 : (r--, i++) : u === "&" && r === 0 ? e.Error("Extra alignment tab in \\cases text") : u === "\\" ? n.substr(i).match(/^((\\cr)[^a-zA-Z]|\\\\)/) ? s = 0 : i += 2 : i++;
}
var a = n.substr(this.i, i - this.i);
a.match(/^\s*\\text[^a-zA-Z]/) || (this.Push.apply(this, this.InternalMath(a)), this.i = i);
}
},
Cr: function(e) {
this.Push(o.cell().With({
isCR: !0,
name: e
}));
},
CrLaTeX: function(t) {
var n;
this.string.charAt(this.i) === "[" && (n = this.GetBrackets(t, "").replace(/ /g, ""), n && !n.match(/^((-?(\.\d+|\d+(\.\d*)?))(pt|em|ex|mu|mm|cm|in|pc))$/) && e.Error("Bracket argument to " + t + " must be a dimension")), this.Push(o.cell().With({
isCR: !0,
name: t,
linebreak: !0
}));
var i = this.stack.Top();
if (i.isa(o.array)) {
if (n && i.arraydef.rowspacing) {
var s = i.arraydef.rowspacing.split(/ /);
i.rowspacing || (i.rowspacing = this.dimen2em(s[0]));
while (s.length < i.table.length) s.push(this.Em(i.rowspacing));
s[i.table.length - 1] = this.Em(Math.max(0, i.rowspacing + this.dimen2em(n))), i.arraydef.rowspacing = s.join(" ");
}
} else n && this.Push(r.mspace().With({
depth: n
})), this.Push(r.mo().With({
linebreak: r.LINEBREAK.NEWLINE
}));
},
emPerInch: 7.2,
dimen2em: function(e) {
var t = e.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(pt|em|ex|mu|pc|in|mm|cm)/), n = parseFloat(t[1] || "1"), r = t[2];
return r === "em" ? n : r === "ex" ? n * .43 : r === "pt" ? n / 10 : r === "pc" ? n * 1.2 : r === "in" ? n * this.emPerInch : r === "cm" ? n * this.emPerInch / 2.54 : r === "mm" ? n * this.emPerInch / 25.4 : r === "mu" ? n / 18 : 0;
},
Em: function(e) {
return Math.abs(e) < 6e-4 ? "0em" : e.toFixed(3).replace(/\.?0+$/, "") + "em";
},
HLine: function(t, n) {
n == null && (n = "solid");
var r = this.stack.Top();
(!r.isa(o.array) || r.data.length) && e.Error("Misplaced " + t);
if (r.table.length == 0) r.frame.push("top"); else {
var i = r.arraydef.rowlines ? r.arraydef.rowlines.split(/ /) : [];
while (i.length < r.table.length) i.push("none");
i[r.table.length - 1] = n, r.arraydef.rowlines = i.join(" ");
}
},
Begin: function(t) {
var n = this.GetArgument(t);
n.match(/[^a-z*]/i) && e.Error('Invalid environment name "' + n + '"');
var r = this.envFindName(n);
r || e.Error('Unknown environment "' + n + '"'), ++this.macroCount > e.config.MAXMACROS && e.Error("MathJax maximum substitution count exceeded; is there a recursive latex environment?"), r instanceof Array || (r = [ r ]);
var i = o.begin().With({
name: n,
end: r[1],
parse: this
});
r[0] && this[r[0]] && (i = this[r[0]].apply(this, [ i ].concat(r.slice(2)))), this.Push(i);
},
End: function(e) {
this.Push(o.end().With({
name: this.GetArgument(e)
}));
},
envFindName: function(e) {
return u.environment[e];
},
Equation: function(e, t) {
return t;
},
ExtensionEnv: function(e, t) {
this.Extension(e.name, t, "environment");
},
Array: function(e, t, n, r, i, s, u, a) {
r || (r = this.GetArgument("\\begin{" + e.name + "}"));
var f = ("c" + r).replace(/[^clr|:]/g, "").replace(/[^|:]([|:])+/g, "$1");
r = r.replace(/[^clr]/g, "").split("").join(" "), r = r.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
var l = o.array().With({
arraydef: {
columnalign: r,
columnspacing: i || "1em",
rowspacing: s || "4pt"
}
});
return f.match(/[|:]/) && (f.charAt(0).match(/[|:]/) && (l.frame.push("left"), l.frame.dashed = f.charAt(0) === ":"), f.charAt(f.length - 1).match(/[|:]/) && l.frame.push("right"), f = f.substr(1, f.length - 2), l.arraydef.columnlines = f.split("").join(" ").replace(/[^|: ]/g, "none").replace(/\|/g, "solid").replace(/:/g, "dashed")), t && (l.open = this.convertDelimiter(t)), n && (l.close = this.convertDelimiter(n)), u === "D" && (l.arraydef.displaystyle = !0), u === "S" && (l.arraydef.scriptlevel = 1), a && (l.arraydef.useHeight = !1), this.Push(e), l;
},
AlignedArray: function(e) {
var t = this.GetBrackets("\\begin{" + e.name + "}");
return this.setArrayAlign(this.Array.apply(this, arguments), t);
},
setArrayAlign: function(e, t) {
return t = this.trimSpaces(t || ""), t === "t" ? e.arraydef.align = "baseline 1" : t === "b" ? e.arraydef.align = "baseline -1" : t === "c" ? e.arraydef.align = "center" : t && (e.arraydef.align = t), e;
},
convertDelimiter: function(e) {
return e && (e = u.delimiter[e]), e == null ? null : (e instanceof Array && (e = e[0]), e.length === 4 && (e = String.fromCharCode(parseInt(e, 16))), e);
},
trimSpaces: function(e) {
return typeof e != "string" ? e : e.replace(/^\s+|\s+$/g, "");
},
nextIsSpace: function() {
return this.string.charAt(this.i).match(/[ \n\r\t]/);
},
GetNext: function() {
while (this.nextIsSpace()) this.i++;
return this.string.charAt(this.i);
},
GetCS: function() {
var e = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
return e ? (this.i += e[1].length, e[1]) : (this.i++, " ");
},
GetArgument: function(t, n) {
switch (this.GetNext()) {
case "":
return n || e.Error("Missing argument for " + t), null;
case "}":
return n || e.Error("Extra close brace or missing open brace"), null;
case "\\":
return this.i++, "\\" + this.GetCS();
case "{":
var r = ++this.i, i = 1;
while (this.i < this.string.length) switch (this.string.charAt(this.i++)) {
case "\\":
this.i++;
break;
case "{":
i++;
break;
case "}":
i == 0 && e.Error("Extra close brace");
if (--i == 0) return this.string.slice(r, this.i - 1);
}
e.Error("Missing close brace");
}
return this.string.charAt(this.i++);
},
GetBrackets: function(t, n) {
if (this.GetNext() != "[") return n;
var r = ++this.i, i = 0;
while (this.i < this.string.length) switch (this.string.charAt(this.i++)) {
case "{":
i++;
break;
case "\\":
this.i++;
break;
case "}":
i-- <= 0 && e.Error("Extra close brace while looking for ']'");
break;
case "]":
if (i == 0) return this.string.slice(r, this.i - 1);
}
e.Error("Couldn't find closing ']' for argument to " + t);
},
GetDelimiter: function(t) {
while (this.nextIsSpace()) this.i++;
var n = this.string.charAt(this.i);
if (this.i < this.string.length) {
this.i++, n == "\\" && (n += this.GetCS(t));
if (u.delimiter[n] != null) return this.convertDelimiter(n);
}
e.Error("Missing or unrecognized delimiter for " + t);
},
GetDimen: function(t) {
var n;
this.nextIsSpace() && this.i++;
if (this.string.charAt(this.i) == "{") {
n = this.GetArgument(t);
if (n.match(/^\s*([-+]?(\.\d+|\d+(\.\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/)) return n.replace(/ /g, "");
} else {
n = this.string.slice(this.i);
var r = n.match(/^\s*(([-+]?(\.\d+|\d+(\.\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);
if (r) return this.i += r[0].length, r[1].replace(/ /g, "");
}
e.Error("Missing dimension or its units for " + t);
},
GetUpTo: function(t, n) {
while (this.nextIsSpace()) this.i++;
var r = this.i, i, s, o = 0;
while (this.i < this.string.length) {
i = this.i, s = this.string.charAt(this.i++);
switch (s) {
case "\\":
s += this.GetCS();
break;
case "{":
o++;
break;
case "}":
o == 0 && e.Error("Extra close brace while looking for " + n), o--;
}
if (o == 0 && s == n) return this.string.slice(r, i);
}
e.Error("Couldn't find " + n + " for " + t);
},
ParseArg: function(t) {
return e.Parse(this.GetArgument(t), this.stack.env).mml();
},
ParseUpTo: function(t, n) {
return e.Parse(this.GetUpTo(t, n), this.stack.env).mml();
},
InternalMath: function(t, n) {
var i = {
displaystyle: !1
};
n != null && (i.scriptlevel = n), this.stack.env.font && (i.mathvariant = this.stack.env.font);
if (!t.match(/\$|\\\(|\\(eq)?ref\s*\{/)) return [ this.InternalText(t, i) ];
var s = 0, o = 0, u, a = "", f = [];
while (s < t.length) u = t.charAt(s++), u === "$" ? a === "$" ? (f.push(r.TeXAtom(e.Parse(t.slice(o, s - 1), {}).mml().With(i))), a = "", o = s) : a === "" && (o < s - 1 && f.push(this.InternalText(t.slice(o, s - 1), i)), a = "$", o = s) : u === "}" && a === "}" ? (f.push(r.TeXAtom(e.Parse(t.slice(o, s), {}).mml().With(i))), a = "", o = s) : u === "\\" && (a === "" && t.substr(s).match(/^(eq)?ref\s*\{/) ? (o < s - 1 && f.push(this.InternalText(t.slice(o, s - 1), i)), a = "}", o = s - 1) : (u = t.charAt(s++), u === "(" && a === "" ? (o < s - 2 && f.push(this.InternalText(t.slice(o, s - 2), i)), a = ")", o = s) : u === ")" && a === ")" && (f.push(r.TeXAtom(e.Parse(t.slice(o, s - 2), {}).mml().With(i))), a = "", o = s)));
return a !== "" && e.Error("Math not terminated in text box"), o < t.length && f.push(this.InternalText(t.slice(o), i)), f;
},
InternalText: function(e, t) {
return e = e.replace(/^\s+/, i).replace(/\s+$/, i), r.mtext(r.chars(e)).With(t);
},
SubstituteArgs: function(t, n) {
var r = "", i = "", s, o = 0;
while (o < n.length) s = n.charAt(o++), s === "\\" ? r += s + n.charAt(o++) : s === "#" ? (s = n.charAt(o++), s === "#" ? r += s : ((!s.match(/[1-9]/) || s > t.length) && e.Error("Illegal macro parameter reference"), i = this.AddArgs(this.AddArgs(i, r), t[s - 1]), r = "")) : r += s;
return this.AddArgs(i, r);
},
AddArgs: function(t, n) {
return n.match(/^[a-z]/i) && t.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i) && (t += " "), t.length + n.length > e.config.MAXBUFFER && e.Error("MathJax internal buffer size exceeded; is there a recursive macro call?"), t + n;
}
});
e.Augment({
Stack: s,
Parse: f,
Definitions: u,
Startup: a,
config: {
MAXMACROS: 1e4,
MAXBUFFER: 5120
},
sourceMenuTitle: "TeX Commands",
prefilterHooks: MathJax.Callback.Hooks(!0),
postfilterHooks: MathJax.Callback.Hooks(!0),
Config: function() {
this.SUPER(arguments).Config.apply(this, arguments), this.config.equationNumbers.autoNumber !== "none" && (this.config.extensions || (this.config.extensions = []), this.config.extensions.push("AMSmath.js"));
},
Translate: function(t) {
var n, i = !1, s = MathJax.HTML.getScript(t), o = t.type.replace(/\n/g, " ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null, u = {
math: s,
display: o,
script: t
};
this.prefilterHooks.Execute(u), s = u.math;
try {
n = e.Parse(s).mml();
} catch (a) {
if (!a.texError) throw a;
n = this.formatError(a, s, o, t), i = !0;
}
return n.inferred ? n = r.apply(MathJax.ElementJax, n.data) : n = r(n), o && (n.root.display = "block"), i && (n.texError = !0), u.math = n, this.postfilterHooks.Execute(u), u.math;
},
prefilterMath: function(e, t, n) {
return e;
},
postfilterMath: function(e, t, n) {
return this.combineRelations(e.root), e;
},
formatError: function(e, n, i, s) {
var o = e.message.replace(/\n.*/, "");
return t.signal.Post([ "TeX Jax - parse error", o, n, i, s ]), r.merror(o);
},
Error: function(e) {
throw t.Insert(Error(e), {
texError: !0
});
},
Macro: function(e, t, n) {
u.macros[e] = [ "Macro" ].concat([].slice.call(arguments, 1)), u.macros[e].isUser = !0;
},
combineRelations: function(e) {
var t, n, i, s;
for (t = 0, n = e.data.length; t < n; t++) if (e.data[t]) {
if (e.isa(r.mrow)) while (t + 1 < n && (i = e.data[t]) && (s = e.data[t + 1]) && i.isa(r.mo) && s.isa(r.mo) && i.Get("texClass") === r.TEXCLASS.REL && s.Get("texClass") === r.TEXCLASS.REL) i.variantForm == s.variantForm && i.Get("mathvariant") == s.Get("mathvariant") && i.style == s.style && i["class"] == s["class"] && !i.id && !s.id ? (i.Append.apply(i, s.data), e.data.splice(t + 1, 1), n--) : (i.rspace = s.lspace = "0pt", t++);
e.data[t].isToken || this.combineRelations(e.data[t]);
}
}
}), e.prefilterHooks.Add(function(t) {
t.math = e.prefilterMath(t.math, t.display, t.script);
}), e.postfilterHooks.Add(function(t) {
t.math = e.postfilterMath(t.math, t.display, t.script);
}), e.loadComplete("jax.js");
}(MathJax.InputJax.TeX, MathJax.Hub, MathJax.Ajax), MathJax.OutputJax["HTML-CSS"] = MathJax.OutputJax({
id: "HTML-CSS",
version: "2.1",
directory: MathJax.OutputJax.directory + "/HTML-CSS",
extensionDir: MathJax.OutputJax.extensionDir + "/HTML-CSS",
autoloadDir: MathJax.OutputJax.directory + "/HTML-CSS/autoload",
fontDir: MathJax.OutputJax.directory + "/HTML-CSS/fonts",
webfontDir: MathJax.OutputJax.fontDir + "/HTML-CSS",
config: {
scale: 100,
minScaleAdjust: 50,
availableFonts: [ "STIX", "TeX" ],
preferredFont: "TeX",
webFont: "TeX",
imageFont: "TeX",
undefinedFamily: "STIXGeneral,'Arial Unicode MS',serif",
mtextFontInherit: !1,
EqnChunk: MathJax.Hub.Browser.isMobile ? 10 : 50,
EqnChunkFactor: 1.5,
EqnChunkDelay: 100,
linebreaks: {
automatic: !1,
width: "container"
},
styles: {
".MathJax_Display": {
"text-align": "center",
margin: "1em 0em"
},
".MathJax .merror": {
"background-color": "#FFFF88",
color: "#CC0000",
border: "1px solid #CC0000",
padding: "1px 3px",
"font-style": "normal",
"font-size": "90%"
},
"#MathJax_Tooltip": {
"background-color": "InfoBackground",
color: "InfoText",
border: "1px solid black",
"box-shadow": "2px 2px 5px #AAAAAA",
"-webkit-box-shadow": "2px 2px 5px #AAAAAA",
"-moz-box-shadow": "2px 2px 5px #AAAAAA",
"-khtml-box-shadow": "2px 2px 5px #AAAAAA",
filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')",
padding: "3px 4px"
}
}
}
}), MathJax.Hub.Browser.isMSIE && document.documentMode >= 9 && delete MathJax.OutputJax["HTML-CSS"].config.styles["#MathJax_Tooltip"].filter, MathJax.Hub.config.delayJaxRegistration || MathJax.OutputJax["HTML-CSS"].Register("jax/mml"), MathJax.Hub.Register.StartupHook("End Config", [ function(e, t) {
var n = e.Insert({
minBrowserVersion: {
Firefox: 3,
Opera: 9.52,
MSIE: 6,
Chrome: .3,
Safari: 2,
Konqueror: 4
},
inlineMathDelimiters: [ "$", "$" ],
displayMathDelimiters: [ "$$", "$$" ],
multilineDisplay: !0,
minBrowserTranslate: function(t) {
var r = e.getJaxFor(t), i = [ "[Math]" ], s, o = document.createElement("span", {
className: "MathJax_Preview"
});
r.inputJax === "TeX" && (r.root.Get("displaystyle") ? (s = n.displayMathDelimiters, i = [ s[0] + r.originalText + s[1] ], n.multilineDisplay && (i = i[0].split(/\n/))) : (s = n.inlineMathDelimiters, i = [ s[0] + r.originalText.replace(/^\s+/, "").replace(/\s+$/, "") + s[1] ]));
for (var u = 0, f = i.length; u < f; u++) o.appendChild(document.createTextNode(i[u])), u < f - 1 && o.appendChild(document.createElement("br"));
t.parentNode.insertBefore(o, t);
}
}, e.config["HTML-CSS"] || {});
e.Browser.version !== "0.0" && !e.Browser.versionAtLeast(n.minBrowserVersion[e.Browser] || 0) && (t.Translate = n.minBrowserTranslate, e.Config({
showProcessingMessages: !1
}), MathJax.Message.Set("Your browser does not support MathJax", null, 4e3), e.Startup.signal.Post("MathJax not supported"));
}, MathJax.Hub, MathJax.OutputJax["HTML-CSS"] ]), MathJax.OutputJax["HTML-CSS"].loadComplete("config.js"), function(e, t, n) {
var r, i = t.Browser.isMobile, s = MathJax.Object.Subclass({
timeout: (i ? 15 : 8) * 1e3,
FontInfo: {
STIX: {
family: "STIXSizeOneSym",
testString: "() {} []"
},
TeX: {
family: "MathJax_Size1",
testString: "() {} []"
}
},
comparisonFont: [ "sans-serif", "monospace", "script", "Times", "Courier", "Arial", "Helvetica" ],
testSize: [ "40px", "50px", "60px", "30px", "20px" ],
Init: function() {
this.div = MathJax.HTML.addElement(document.body, "div", {
id: "MathJax_Font_Test",
style: {
position: "absolute",
visibility: "hidden",
top: 0,
left: 0,
width: "auto",
padding: 0,
border: 0,
margin: 0,
whiteSpace: "nowrap",
textAlign: "left",
textIndent: 0,
textTransform: "none",
lineHeight: "normal",
letterSpacing: "normal",
wordSpacing: "normal",
fontSize: this.testSize[0],
fontWeight: "normal",
fontStyle: "normal",
fontSizeAdjust: "none"
}
}, [ "" ]), this.text = this.div.firstChild;
},
findFont: function(e, t) {
if (t && this.testCollection(t)) return t;
for (var n = 0, r = e.length; n < r; n++) {
if (e[n] === t) continue;
if (this.testCollection(e[n])) return e[n];
}
return null;
},
testCollection: function(e) {
return this.testFont(this.FontInfo[e]);
},
testFont: function(e) {
e.isWebFont && n.FontFaceBug ? this.div.style.fontWeight = this.div.style.fontStyle = "normal" : (this.div.style.fontWeight = e.weight || "normal", this.div.style.fontStyle = e.style || "normal");
var t = this.getComparisonWidths(e.testString, e.noStyleChar);
if (t) {
this.div.style.fontFamily = "'" + e.family + "'," + this.comparisonFont[0];
if (this.div.offsetWidth == t[0]) {
this.div.style.fontFamily = "'" + e.family + "'," + this.comparisonFont[t[2]];
if (this.div.offsetWidth == t[1]) return !1;
}
if (this.div.offsetWidth != t[3] || this.div.offsetHeight != t[4]) {
if (e.noStyleChar || !n.FONTDATA || !n.FONTDATA.hasStyleChar) return !0;
for (var r = 0, i = this.testSize.length; r < i; r++) if (this.testStyleChar(e, this.testSize[r])) return !0;
}
}
return !1;
},
styleChar: "\ueffd",
versionChar: "\ueffe",
compChar: "\uefff",
testStyleChar: function(e, t) {
var r = 3 + (e.weight ? 2 : 0) + (e.style ? 4 : 0), i = "", s = 0, o = this.div.style.fontSize;
this.div.style.fontSize = t, n.msieItalicWidthBug && e.style === "italic" && (this.text.nodeValue = i = this.compChar, s = this.div.offsetWidth), n.safariTextNodeBug ? this.div.innerHTML = this.compChar + i : this.text.nodeValue = this.compChar + i;
var u = this.div.offsetWidth - s;
n.safariTextNodeBug ? this.div.innerHTML = this.styleChar + i : this.text.nodeValue = this.styleChar + i;
var a = Math.floor((this.div.offsetWidth - s) / u + .5);
return a === r && (n.safariTextNodeBug ? this.div.innerHTML = this.versionChar + i : this.text.nodeValue = this.versionChar + i, e.version = Math.floor((this.div.offsetWidth - s) / u + 1.5) / 2), this.div.style.fontSize = o, a === r;
},
getComparisonWidths: function(e, t) {
n.FONTDATA && n.FONTDATA.hasStyleChar && !t && (e += this.styleChar + " " + this.compChar), n.safariTextNodeBug ? this.div.innerHTML = e : this.text.nodeValue = e, this.div.style.fontFamily = this.comparisonFont[0];
var r = this.div.offsetWidth;
this.div.style.fontFamily = n.webFontDefault;
var i = this.div.offsetWidth, s = this.div.offsetHeight;
for (var o = 1, u = this.comparisonFont.length; o < u; o++) {
this.div.style.fontFamily = this.comparisonFont[o];
if (this.div.offsetWidth != r) return [ r, this.div.offsetWidth, o, i, s ];
}
return null;
},
loadWebFont: function(r) {
t.Startup.signal.Post("HTML-CSS Jax - Web-Font " + n.fontInUse + "/" + r.directory);
var i = MathJax.Message.File("Web-Font " + n.fontInUse + "/" + r.directory), s = MathJax.Callback({}), o = MathJax.Callback([ "loadComplete", this, r, i, s ]);
return e.timer.start(e, [ this.checkWebFont, r, o ], 0, this.timeout), s;
},
loadComplete: function(r, i, s, o) {
MathJax.Message.Clear(i);
if (o === e.STATUS.OK) {
this.webFontLoaded = !0, s();
return;
}
this.loadError(r);
if (t.Browser.isFirefox && n.allowWebFonts) {
var u = document.location.protocol + "//" + document.location.hostname;
document.location.port != "" && (u += ":" + document.location.port), u += "/", e.fileURL(n.webfontDir).substr(0, u.length) !== u && this.firefoxFontError(r);
}
this.webFontLoaded ? s() : n.loadWebFontError(r, s);
},
loadError: function(e) {
MathJax.Message.Set("Can't load web font " + n.fontInUse + "/" + e.directory, null, 2e3), t.Startup.signal.Post([ "HTML-CSS Jax - web font error", n.fontInUse + "/" + e.directory, e ]);
},
firefoxFontError: function(e) {
MathJax.Message.Set("Firefox can't load web fonts from a remote host", null, 3e3), t.Startup.signal.Post("HTML-CSS Jax - Firefox web fonts on remote host error");
},
checkWebFont: function(e, t, r) {
if (e.time(r)) return;
n.Font.testFont(t) ? r(e.STATUS.OK) : setTimeout(e, e.delay);
},
fontFace: function(t) {
var r = n.allowWebFonts, i = n.FONTDATA.FONTS[t];
n.msieFontCSSBug && !i.family.match(/-Web$/) && (i.family += "-Web");
var s = e.fileURL(n.webfontDir + "/" + r), o = t.replace(/-b/, "-B").replace(/-i/, "-I").replace(/-Bold-/, "-Bold");
o.match(/-/) || (o += "-Regular"), r === "svg" ? o += ".svg#" + o : o += "." + r;
var u = {
"font-family": i.family,
src: "url('" + s + "/" + o + "')"
};
r === "otf" ? (u.src += " format('opentype')", s = e.fileURL(n.webfontDir + "/woff"), u.src = "url('" + s + "/" + o.replace(/otf$/, "woff") + "') format('woff'), " + u.src) : r !== "eot" && (u.src += " format('" + r + "')");
if (!n.FontFaceBug || !i.isWebFont) t.match(/-bold/) && (u["font-weight"] = "bold"), t.match(/-italic/) && (u["font-style"] = "italic");
return u;
}
}), o, u, a;
n.Augment({
config: {
styles: {
".MathJax": {
display: "inline",
"font-style": "normal",
"font-weight": "normal",
"line-height": "normal",
"font-size": "100%",
"font-size-adjust": "none",
"text-indent": 0,
"text-align": "left",
"text-transform": "none",
"letter-spacing": "normal",
"word-spacing": "normal",
"word-wrap": "normal",
"white-space": "nowrap",
"float": "none",
direction: "ltr",
border: 0,
padding: 0,
margin: 0
},
".MathJax_Display": {
position: "relative",
display: "block",
width: "100%"
},
".MathJax img, .MathJax nobr, .MathJax a": {
border: 0,
padding: 0,
margin: 0,
"max-width": "none",
"max-height": "none",
"vertical-align": 0,
"line-height": "normal",
"text-decoration": "none"
},
"img.MathJax_strut": {
border: "0 !important",
padding: "0 !important",
margin: "0 !important",
"vertical-align": "0 !important"
},
".MathJax span": {
display: "inline",
position: "static",
border: 0,
padding: 0,
margin: 0,
"vertical-align": 0,
"line-height": "normal",
"text-decoration": "none"
},
".MathJax nobr": {
"white-space": "nowrap ! important"
},
".MathJax img": {
display: "inline ! important",
"float": "none ! important"
},
".MathJax_Processing": {
visibility: "hidden",
position: "fixed",
width: 0,
height: 0,
overflow: "hidden"
},
".MathJax_Processed": {
display: "none!important"
},
".MathJax_ExBox": {
display: "block",
overflow: "hidden",
width: "1px",
height: "60ex"
},
".MathJax .MathJax_EmBox": {
display: "block",
overflow: "hidden",
width: "1px",
height: "60em"
},
".MathJax .MathJax_HitBox": {
cursor: "text",
background: "white",
opacity: 0,
filter: "alpha(opacity=0)"
},
".MathJax .MathJax_HitBox *": {
filter: "none",
opacity: 1,
background: "transparent"
},
"#MathJax_Tooltip": {
position: "absolute",
left: 0,
top: 0,
width: "auto",
height: "auto",
display: "none"
},
"#MathJax_Tooltip *": {
filter: "none",
opacity: 1,
background: "transparent"
},
"@font-face": {
"font-family": "MathJax_Blank",
src: "url('about:blank')"
}
}
},
settings: t.config.menuSettings,
hideProcessedMath: !0,
Font: null,
webFontDefault: "MathJax_Blank",
allowWebFonts: "otf",
Config: function() {
this.require || (this.require = []), this.Font = s(), this.SUPER(arguments).Config.call(this);
var e = this.settings;
this.adjustAvailableFonts && this.adjustAvailableFonts(this.config.availableFonts), e.scale && (this.config.scale = e.scale), e.font && e.font !== "Auto" && (e.font === "TeX (local)" ? (this.config.availableFonts = [ "TeX" ], this.config.preferredFont = "TeX", this.config.webFont = "TeX") : e.font === "STIX (local)" ? (this.config.availableFonts = [ "STIX" ], this.config.preferredFont = "STIX", this.config.webFont = "TeX") : e.font === "TeX (web)" ? (this.config.availableFonts = [], this.config.preferredFont = "", this.config.webFont = "TeX") : e.font === "TeX (image)" && (this.config.availableFonts = [], this.config.preferredFont = "", this.config.webFont = ""));
var n = this.Font.findFont(this.config.availableFonts, this.config.preferredFont);
!n && this.allowWebFonts && (n = this.config.webFont, n && (this.webFonts = !0)), !n && this.config.imageFont && (n = this.config.imageFont, this.imgFonts = !0), n ? (this.fontInUse = n, this.fontDir += "/" + n, this.webfontDir += "/" + n, this.require.push(this.fontDir + "/fontdata.js"), this.imgFonts && (this.require.push(this.directory + "/imageFonts.js"), t.Startup.signal.Post("HTML-CSS Jax - using image fonts"))) : (MathJax.Message.Set("Can't find a valid font using [" + this.config.availableFonts.join(", ") + "]", null, 3e3), this.FONTDATA = {
TeX_factor: 1,
baselineskip: 1.2,
lineH: .8,
lineD: .2,
ffLineH: .8,
FONTS: {},
VARIANT: {
normal: {
fonts: []
}
},
RANGES: [],
DELIMITERS: {},
RULECHAR: 45,
REMAP: {}
}, MathJax.InputJax.TeX && MathJax.InputJax.TeX.Definitions && (MathJax.InputJax.TeX.Definitions.macros.overline[1] = "002D", MathJax.InputJax.TeX.Definitions.macros.underline[1] = "002D"), t.Startup.signal.Post("HTML-CSS Jax - no valid font")), this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
},
Startup: function() {
o = MathJax.Extension.MathEvents.Event, u = MathJax.Extension.MathEvents.Touch, a = MathJax.Extension.MathEvents.Hover, this.ContextMenu = o.ContextMenu, this.Mousedown = o.AltContextMenu, this.Mouseover = a.Mouseover, this.Mouseout = a.Mouseout, this.Mousemove = a.Mousemove, this.hiddenDiv = this.Element("div", {
style: {
visibility: "hidden",
overflow: "hidden",
position: "absolute",
top: 0,
height: "1px",
width: "auto",
padding: 0,
border: 0,
margin: 0,
textAlign: "left",
textIndent: 0,
textTransform: "none",
lineHeight: "normal",
letterSpacing: "normal",
wordSpacing: "normal"
}
}), document.body.firstChild ? document.body.insertBefore(this.hiddenDiv, document.body.firstChild) : document.body.appendChild(this.hiddenDiv), this.hiddenDiv = this.addElement(this.hiddenDiv, "div", {
id: "MathJax_Hidden"
});
var t = this.addElement(this.hiddenDiv, "div", {
style: {
width: "5in"
}
});
this.pxPerInch = t.offsetWidth / 5, this.hiddenDiv.removeChild(t), this.startMarker = this.createStrut(this.Element("span"), 10, !0), this.endMarker = this.addText(this.Element("span"), "x").parentNode, this.HDspan = this.Element("span"), this.operaHeightBug && this.createStrut(this.HDspan, 0);
if (this.msieInlineBlockAlignBug) {
this.HDimg = this.addElement(this.HDspan, "img", {
style: {
height: "0px",
width: "1px"
}
});
try {
this.HDimg.src = "about:blank";
} catch (n) {}
} else this.HDimg = this.createStrut(this.HDspan, 0);
return this.EmExSpan = this.Element("span", {
style: {
position: "absolute",
"font-size-adjust": "none"
}
}, [ [ "span", {
className: "MathJax_ExBox"
} ], [ "span", {
className: "MathJax"
}, [ [ "span", {
className: "MathJax_EmBox"
} ] ] ] ]), this.linebreakSpan = this.Element("span", null, [ [ "hr", {
style: {
width: "100%",
size: 1,
padding: 0,
border: 0,
margin: 0
}
} ] ]), e.Styles(this.config.styles, [ "InitializeHTML", this ]);
},
removeSTIXfonts: function(e) {
for (var t = 0, n = e.length; t < n; t++) e[t] === "STIX" && (e.splice(t, 1), n--, t--);
this.config.preferredFont === "STIX" && (this.config.preferredFont = e[0]);
},
PreloadWebFonts: function() {
if (!n.allowWebFonts || !n.config.preloadWebFonts) return;
for (var e = 0, t = n.config.preloadWebFonts.length; e < t; e++) {
var r = n.FONTDATA.FONTS[n.config.preloadWebFonts[e]];
r.available || n.Font.testFont(r);
}
},
InitializeHTML: function() {
this.PreloadWebFonts(), document.body.appendChild(this.EmExSpan), document.body.appendChild(this.linebreakSpan), this.defaultEx = this.EmExSpan.firstChild.offsetHeight / 60, this.defaultEm = this.EmExSpan.lastChild.firstChild.offsetHeight / 60, this.defaultWidth = this.linebreakSpan.firstChild.offsetWidth, document.body.removeChild(this.linebreakSpan), document.body.removeChild(this.EmExSpan);
},
preTranslate: function(e) {
var n = e.jax[this.id], r, i = n.length, s, a, f, l, c, h, p, d, v, m, g = !1, y = this.config.linebreaks.automatic, w = this.config.linebreaks.width;
y ? (g = w.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/) != null, g ? w = w.replace(/\s*container\s*/, "") : m = this.defaultWidth, w === "" && (w = "100%")) : m = 1e5;
for (r = 0; r < i; r++) {
s = n[r];
if (!s.parentNode) continue;
a = s.previousSibling, a && String(a.className).match(/^MathJax(_Display)?( MathJax_Processing)?$/) && a.parentNode.removeChild(a), h = s.MathJax.elementJax;
if (!h) continue;
h.HTMLCSS = {
display: h.root.Get("display") === "block"
}, f = l = this.Element("span", {
className: "MathJax",
id: h.inputID + "-Frame",
isMathJax: !0,
jaxID: this.id,
oncontextmenu: o.Menu,
onmousedown: o.Mousedown,
onmouseover: o.Mouseover,
onmouseout: o.Mouseout,
onmousemove: o.Mousemove,
onclick: o.Click,
ondblclick: o.DblClick
}), t.Browser.noContextMenu && (f.ontouchstart = u.start, f.ontouchend = u.end), h.HTMLCSS.display ? (l = this.Element("div", {
className: "MathJax_Display"
}), l.appendChild(f)) : this.msieDisappearingBug && (f.style.display = "inline-block"), l.setAttribute("role", "textbox"), l.setAttribute("aria-readonly", "true"), l.className += " MathJax_Processing", s.parentNode.insertBefore(l, s), s.parentNode.insertBefore(this.EmExSpan.cloneNode(!0), s), g && l.parentNode.insertBefore(this.linebreakSpan.cloneNode(!0), l);
}
for (r = 0; r < i; r++) {
s = n[r];
if (!s.parentNode) continue;
c = s.previousSibling, l = c.previousSibling, h = s.MathJax.elementJax;
if (!h) continue;
p = c.firstChild.offsetHeight / 60, d = c.lastChild.firstChild.offsetHeight / 60, g && (m = l.previousSibling.firstChild.offsetWidth);
if (p === 0 || p === "NaN") this.hiddenDiv.appendChild(l), h.HTMLCSS.isHidden = !0, p = this.defaultEx, d = this.defaultEm, g && (m = this.defaultWidth);
v = Math.floor(Math.max(this.config.minScaleAdjust / 100, p / this.TeX.x_height / d) * this.config.scale), h.HTMLCSS.scale = v / 100, h.HTMLCSS.fontSize = v + "%", h.HTMLCSS.em = h.HTMLCSS.outerEm = d, this.em = d * v / 100, h.HTMLCSS.ex = p, h.HTMLCSS.lineWidth = y ? this.length2em(w, 1, m / this.em) : 1e6;
}
for (r = 0; r < i; r++) {
s = n[r];
if (!s.parentNode) continue;
c = n[r].previousSibling, h = n[r].MathJax.elementJax;
if (!h) continue;
g && (f = c.previousSibling, h.HTMLCSS.isHidden || (f = f.previousSibling), f.parentNode.removeChild(f)), c.parentNode.removeChild(c);
}
e.HTMLCSSeqn = e.HTMLCSSlast = 0, e.HTMLCSSi = -1, e.HTMLCSSchunk = this.config.EqnChunk, e.HTMLCSSdelay = !1;
},
Translate: function(e, n) {
if (!e.parentNode) return;
n.HTMLCSSdelay && (n.HTMLCSSdelay = !1, t.RestartAfter(MathJax.Callback.Delay(this.config.EqnChunkDelay)));
var i = e.MathJax.elementJax, s = i.root, o = document.getElementById(i.inputID + "-Frame"), u = i.HTMLCSS.display ? o.parentNode : o;
this.em = r.mbase.prototype.em = i.HTMLCSS.em * i.HTMLCSS.scale, this.outerEm = i.HTMLCSS.em, this.scale = i.HTMLCSS.scale, this.linebreakWidth = i.HTMLCSS.lineWidth, o.style.fontSize = i.HTMLCSS.fontSize, this.initImg(o), this.initHTML(s, o), s.setTeXclass();
try {
s.toHTML(o, u);
} catch (a) {
if (a.restart) while (o.firstChild) o.removeChild(o.firstChild);
throw a;
}
i.HTMLCSS.isHidden && e.parentNode.insertBefore(u, e), u.className = u.className.split(/ /)[0], this.hideProcessedMath && (u.className += " MathJax_Processed", e.MathJax.preview && (i.HTMLCSS.preview = e.MathJax.preview, delete e.MathJax.preview), n.HTMLCSSeqn += n.i - n.HTMLCSSi, n.HTMLCSSi = n.i, n.HTMLCSSeqn >= n.HTMLCSSlast + n.HTMLCSSchunk && (this.postTranslate(n), n.HTMLCSSchunk = Math.floor(n.HTMLCSSchunk * this.config.EqnChunkFactor), n.HTMLCSSdelay = !0));
},
postTranslate: function(e) {
var t = e.jax[this.id];
if (!this.hideProcessedMath) return;
for (var n = e.HTMLCSSlast, r = e.HTMLCSSeqn; n < r; n++) {
var i = t[n];
if (i && i.MathJax.elementJax) {
i.previousSibling.className = i.previousSibling.className.split(/ /)[0];
var s = i.MathJax.elementJax.HTMLCSS;
s.preview && (s.preview.innerHTML = "", i.MathJax.preview = s.preview, delete s.preview);
}
}
if (this.forceReflow) {
var o = (document.styleSheets || [])[0] || {};
o.disabled = !0, o.disabled = !1;
}
e.HTMLCSSlast = e.HTMLCSSeqn;
},
getJaxFromMath: function(e) {
e.parentNode.className === "MathJax_Display" && (e = e.parentNode);
do e = e.nextSibling; while (e && e.nodeName.toLowerCase() !== "script");
return t.getJaxFor(e);
},
getHoverSpan: function(e, t) {
return e.root.HTMLspanElement();
},
getHoverBBox: function(e, t, n) {
var r = t.bbox, i = e.HTMLCSS.outerEm, s = {
w: r.w * i,
h: r.h * i,
d: r.d * i
};
return r.width && (s.width = r.width), s;
},
Zoom: function(e, t, i, s, u) {
t.className = "MathJax", t.style.fontSize = e.HTMLCSS.fontSize;
var a = t.appendChild(this.EmExSpan.cloneNode(!0)), l = a.lastChild.firstChild.offsetHeight / 60;
this.em = r.mbase.prototype.em = l, this.outerEm = l / e.HTMLCSS.scale, a.parentNode.removeChild(a), this.idPostfix = "-zoom", e.root.toHTML(t, t), this.idPostfix = "";
var c = e.root.HTMLspanElement().bbox.width;
if (c) {
t.style.width = Math.floor(s - 1.5 * n.em) + "px", t.style.display = "inline-block";
var h = (e.root.id || "MathJax-Span-" + e.root.spanID) + "-zoom", p = document.getElementById(h).firstChild;
while (p && p.style.width !== c) p = p.nextSibling;
p && (p.style.width = "100%");
}
t.style.position = i.style.position = "absolute";
var v = t.offsetWidth, m = t.offsetHeight, g = i.offsetHeight, y = i.offsetWidth;
return y === 0 && (y = i.parentNode.offsetWidth), t.style.position = i.style.position = "", {
Y: -o.getBBox(t).h,
mW: y,
mH: g,
zW: v,
zH: m
};
},
initImg: function(e) {},
initHTML: function(e, t) {},
initFont: function(t) {
var r = n.FONTDATA.FONTS, i = n.config.availableFonts;
return i && i.length && n.Font.testFont(r[t]) ? (r[t].available = !0, null) : this.allowWebFonts ? (r[t].isWebFont = !0, n.FontFaceBug && (r[t].family = t, n.msieFontCSSBug && (r[t].family += "-Web")), e.Styles({
"@font-face": this.Font.fontFace(t)
})) : null;
},
Remove: function(e) {
var t = document.getElementById(e.inputID + "-Frame");
t && (e.HTMLCSS.display && (t = t.parentNode), t.parentNode.removeChild(t)), delete e.HTMLCSS;
},
getHD: function(e) {
var t = e.style.position;
e.style.position = "absolute", this.HDimg.style.height = "0px", e.appendChild(this.HDspan);
var n = {
h: e.offsetHeight
};
return this.HDimg.style.height = n.h + "px", n.d = e.offsetHeight - n.h, n.h -= n.d, n.h /= this.em, n.d /= this.em, e.removeChild(this.HDspan), e.style.position = t, n;
},
getW: function(e) {
var t, n, r = (e.bbox || {}).w, i = e;
if (e.bbox && e.bbox.exactW) return r;
if (e.bbox && r >= 0 && !this.initialSkipBug || this.negativeBBoxes || !e.firstChild) t = e.offsetWidth, n = e.parentNode.offsetHeight; else if (e.bbox && r < 0 && this.msieNegativeBBoxBug) t = -e.offsetWidth, n = e.parentNode.offsetHeight; else {
if (this.initialSkipBug) {
var s = e.style.position;
e.style.position = "absolute", i = this.startMarker, e.insertBefore(i, e.firstChild);
}
e.appendChild(this.endMarker), t = this.endMarker.offsetLeft - i.offsetLeft, e.removeChild(this.endMarker), this.initialSkipBug && (e.removeChild(i), e.style.position = s);
}
return n != null && (e.parentNode.HH = n / this.em), t / this.em;
},
Measured: function(e, t) {
var n = e.bbox;
if (n.width == null && n.w && !n.isMultiline) {
var r = this.getW(e);
n.rw += r - n.w, n.w = r, n.exactW = !0;
}
return t || (t = e.parentNode), t.bbox || (t.bbox = n), e;
},
Remeasured: function(e, t) {
t.bbox = this.Measured(e, t).bbox;
},
MeasureSpans: function(e) {
var t = [], n, r, i, s, o, u, a;
for (r = 0, i = e.length; r < i; r++) {
n = e[r];
if (!n) continue;
s = n.bbox;
if (s.exactW || s.width || s.w === 0 || s.isMultiline) {
n.parentNode.bbox || (n.parentNode.bbox = s);
continue;
}
this.negativeBBoxes || !n.firstChild || s.w >= 0 && !this.initialSkipBug || s.w < 0 && this.msieNegativeBBoxBug ? t.push([ n ]) : this.initialSkipBug ? (o = this.startMarker.cloneNode(!0), u = this.endMarker.cloneNode(!0), n.insertBefore(o, n.firstChild), n.appendChild(u), t.push([ n, o, u, n.style.position ]), n.style.position = "absolute") : (u = this.endMarker.cloneNode(!0), n.appendChild(u), t.push([ n, null, u ]));
}
for (r = 0, i = t.length; r < i; r++) {
n = t[r][0], s = n.bbox;
var f = n.parentNode;
s.w >= 0 && !this.initialSkipBug || this.negativeBBoxes || !n.firstChild ? (a = n.offsetWidth, f.HH = n.parentNode.offsetHeight / this.em) : s.w < 0 && this.msieNegativeBBoxBug ? (a = -n.offsetWidth, f.HH = n.parentNode.offsetHeight / this.em) : a = t[r][2].offsetLeft - ((t[r][1] || {}).offsetLeft || 0), a /= this.em, s.rw += a - s.w, s.w = a, s.exactW = !0, f.bbox || (f.bbox = s);
}
for (r = 0, i = t.length; r < i; r++) n = t[r], n[1] && (n[1].parentNode.removeChild(n[1]), n[0].style.position = n[3]), n[2] && n[2].parentNode.removeChild(n[2]);
},
Em: function(e) {
return Math.abs(e) < 6e-4 ? "0em" : e.toFixed(3).replace(/\.?0+$/, "") + "em";
},
unEm: function(e) {
return parseFloat(e);
},
Px: function(e) {
e *= this.em;
var t = e < 0 ? "-" : "";
return t + Math.abs(e).toFixed(1).replace(/\.?0+$/, "") + "px";
},
unPx: function(e) {
return parseFloat(e) / this.em;
},
Percent: function(e) {
return (100 * e).toFixed(1).replace(/\.?0+$/, "") + "%";
},
length2em: function(e, t, i) {
typeof e != "string" && (e = e.toString());
if (e === "") return "";
if (e === r.SIZE.NORMAL) return 1;
if (e === r.SIZE.BIG) return 2;
if (e === r.SIZE.SMALL) return .71;
if (e === "infinity") return n.BIGDIMEN;
var s = this.FONTDATA.TeX_factor;
if (e.match(/mathspace$/)) return n.MATHSPACE[e] * s;
var o = e.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/), u = parseFloat(o[1] || "1"), a = o[2];
return i == null && (i = 1), t == null && (t = 1), a === "em" ? u * s : a === "ex" ? u * n.TeX.x_height * s : a === "%" ? u / 100 * i : a === "px" ? u / n.em : a === "pt" ? u / 10 * s : a === "pc" ? u * 1.2 * s : a === "in" ? u * this.pxPerInch / n.em : a === "cm" ? u * this.pxPerInch / n.em / 2.54 : a === "mm" ? u * this.pxPerInch / n.em / 25.4 : a === "mu" ? u / 18 * s * t : u * s * i;
},
thickness2em: function(e, t) {
var i = n.TeX.rule_thickness;
return e === r.LINETHICKNESS.MEDIUM ? i : e === r.LINETHICKNESS.THIN ? .67 * i : e === r.LINETHICKNESS.THICK ? 1.67 * i : this.length2em(e, t, i);
},
getPadding: function(e) {
var t = {
top: 0,
right: 0,
bottom: 0,
left: 0
}, n = !1;
for (var r in t) if (t.hasOwnProperty(r)) {
var i = e.style["padding" + r.charAt(0).toUpperCase() + r.substr(1)];
i && (t[r] = this.length2em(i), n = !0);
}
return n ? t : !1;
},
getBorders: function(e) {
var t = {
top: 0,
right: 0,
bottom: 0,
left: 0
}, n = {}, r = !1;
for (var i in t) if (t.hasOwnProperty(i)) {
var s = "border" + i.charAt(0).toUpperCase() + i.substr(1), o = e.style[s + "Style"];
o && (r = !0, t[i] = this.length2em(e.style[s + "Width"]), n[s] = [ e.style[s + "Width"], e.style[s + "Style"], e.style[s + "Color"] ].join(" "));
}
return t.css = n, r ? t : !1;
},
setBorders: function(e, t) {
if (t) for (var n in t.css) t.css.hasOwnProperty(n) && (e.style[n] = t.css[n]);
},
createStrut: function(e, t, n) {
var r = this.Element("span", {
isMathJax: !0,
style: {
display: "inline-block",
overflow: "hidden",
height: t + "px",
width: "1px",
marginRight: "-1px"
}
});
return n ? e.insertBefore(r, e.firstChild) : e.appendChild(r), r;
},
createBlank: function(e, t, n) {
var r = this.Element("span", {
isMathJax: !0,
style: {
display: "inline-block",
overflow: "hidden",
height: "1px",
width: this.Em(t)
}
});
return n ? e.insertBefore(r, e.firstChild) : e.appendChild(r), r;
},
createShift: function(e, t, n) {
var r = this.Element("span", {
style: {
marginLeft: this.Em(t)
},
isMathJax: !0
});
return n ? e.insertBefore(r, e.firstChild) : e.appendChild(r), r;
},
createSpace: function(e, t, i, s, o, u) {
t < -i && (i = -t);
var a = this.Em(t + i), l = this.Em(-i);
this.msieInlineBlockAlignBug && (l = this.Em(n.getHD(e.parentNode).d - i));
if (e.isBox || u) {
var c = e.scale == null ? 1 : e.scale;
e.bbox = {
exactW: !0,
h: t * c,
d: i * c,
w: s * c,
rw: s * c,
lw: 0
}, e.style.height = a, e.style.verticalAlign = l, e.HH = (t + i) * c;
} else e = this.addElement(e, "span", {
style: {
height: a,
verticalAlign: l
},
isMathJax: !0
});
return s >= 0 ? (e.style.width = this.Em(s), e.style.display = "inline-block", e.style.overflow = "hidden") : (this.msieNegativeSpaceBug && (e.style.height = ""), e.style.marginLeft = this.Em(s), n.safariNegativeSpaceBug && e.parentNode.firstChild == e && this.createBlank(e, 0, !0)), o && o !== r.COLOR.TRANSPARENT && (e.style.backgroundColor = o, e.style.position = "relative"), e;
},
createRule: function(e, t, r, i, s) {
t < -r && (r = -t);
var o = n.TeX.min_rule_thickness, u = 1;
i > 0 && i * this.em < o && (i = o / this.em), t + r > 0 && (t + r) * this.em < o && (u = 1 / (t + r) * (o / this.em), t *= u, r *= u), s ? s = "solid " + s : s = "solid", s = this.Em(i) + " " + s;
var a = u === 1 ? this.Em(t + r) : o + "px", f = this.Em(-r), l = this.addElement(e, "span", {
style: {
borderLeft: s,
display: "inline-block",
overflow: "hidden",
width: 0,
height: a,
verticalAlign: f
},
bbox: {
h: t,
d: r,
w: i,
rw: i,
lw: 0,
exactW: !0
},
noAdjust: !0,
HH: t + r,
isMathJax: !0
});
i > 0 && l.offsetWidth == 0 && (l.style.width = this.Em(i));
if (e.isBox || e.className == "mspace") e.bbox = l.bbox, e.HH = t + r;
return l;
},
createFrame: function(e, t, n, r, i, s) {
t < -n && (n = -t);
var o = 2 * i;
this.msieFrameSizeBug && (r < o && (r = o), t + n < o && (t = o - n)), this.msieBorderWidthBug && (o = 0);
var u = this.Em(t + n - o), a = this.Em(-n - i), f = this.Em(r - o), l = this.Em(i) + " " + s, c = this.addElement(e, "span", {
style: {
border: l,
display: "inline-block",
overflow: "hidden",
width: f,
height: u
},
bbox: {
h: t,
d: n,
w: r,
rw: r,
lw: 0,
exactW: !0
},
noAdjust: !0,
HH: t + n,
isMathJax: !0
});
return a && (c.style.verticalAlign = a), c;
},
createStack: function(e, t, n) {
this.msiePaddingWidthBug && this.createStrut(e, 0);
var r = String(n).match(/%$/), i = !r && n != null ? n : 0;
return e = this.addElement(e, "span", {
noAdjust: !0,
HH: 0,
isMathJax: !0,
style: {
display: "inline-block",
position: "relative",
width: r ? "100%" : this.Em(i),
height: 0
}
}), t || (e.parentNode.bbox = e.bbox = {
exactW: !0,
h: -this.BIGDIMEN,
d: -this.BIGDIMEN,
w: i,
lw: this.BIGDIMEN,
rw: !r && n != null ? n : -this.BIGDIMEN
}, r && (e.bbox.width = n)), e;
},
createBox: function(e, t) {
var n = this.addElement(e, "span", {
style: {
position: "absolute"
},
isBox: !0,
isMathJax: !0
});
return t != null && (n.style.width = t), n;
},
addBox: function(e, t) {
return t.style.position = "absolute", t.isBox = t.isMathJax = !0, e.appendChild(t);
},
placeBox: function(e, t, r, i) {
e.isMathJax = !0;
var s = e.parentNode, o = e.bbox, u = s.bbox;
this.msiePlaceBoxBug && this.addText(e, this.NBSP), this.imgSpaceBug && this.addText(e, this.imgSpace);
var a, f = 0;
e.HH != null ? a = e.HH : o ? a = Math.max(3, o.h + o.d) : a = e.offsetHeight / this.em, e.noAdjust || (a += 1, a = Math.round(a * this.em) / this.em, this.msieInlineBlockAlignBug ? this.addElement(e, "img", {
className: "MathJax_strut",
border: 0,
src: "about:blank",
isMathJax: !0,
style: {
width: 0,
height: this.Em(a)
}
}) : (this.addElement(e, "span", {
isMathJax: !0,
style: {
display: "inline-block",
width: 0,
height: this.Em(a)
}
}), n.chromeHeightBug && (a -= (e.lastChild.offsetHeight - Math.round(a * this.em)) / this.em)));
if (o) {
this.initialSkipBug && (o.lw < 0 && (f = o.lw, n.createBlank(e, -f, !0)), o.rw > o.w && n.createBlank(e, o.rw - o.w + .1));
if (!this.msieClipRectBug && !o.noclip && !i) {
var l = 3 / this.em, c = o.H == null ? o.h : o.H, h = o.D == null ? o.d : o.D, p = a - c - l, v = a + h + l, m = o.lw - 3 * l, g = 1e3;
this.initialSkipBug && o.lw < 0 && (m = -3 * l), o.isFixed && (g = o.width - m), e.style.clip = "rect(" + this.Em(p) + " " + this.Em(g) + " " + this.Em(v) + " " + this.Em(m) + ")";
}
}
e.style.top = this.Em(-r - a), e.style.left = this.Em(t + f), o && u && (o.H != null && (u.H == null || o.H + r > u.H) && (u.H = o.H + r), o.D != null && (u.D == null || o.D - r > u.D) && (u.D = o.D - r), o.h + r > u.h && (u.h = o.h + r), o.d - r > u.d && (u.d = o.d - r), u.H != null && u.H <= u.h && delete u.H, u.D != null && u.D <= u.d && delete u.D, o.w + t > u.w && (u.w = o.w + t, u.width == null && (s.style.width = this.Em(u.w))), o.rw + t > u.rw && (u.rw = o.rw + t), o.lw + t < u.lw && (u.lw = o.lw + t), o.width != null && !o.isFixed && (u.width == null && (s.style.width = u.width = "100%"), e.style.width = o.width));
},
alignBox: function(e, n, r) {
this.placeBox(e, 0, r);
var i = e.bbox;
if (i.isMultiline) return;
var s = i.width != null && !i.isFixed, o = 0, u = -i.w / 2, a = "50%";
this.initialSkipBug && (o = i.w - i.rw - .1, u += i.lw), this.msieMarginScaleBug ? u = u * this.em + "px" : u = this.Em(u), s && (u = "", a = 50 - parseFloat(i.width) / 2 + "%"), t.Insert(e.style, {
right: {
left: "",
right: this.Em(o)
},
center: {
left: a,
marginLeft: u
}
}[n]);
},
setStackWidth: function(e, t) {
if (typeof t == "number") {
e.style.width = this.Em(Math.max(0, t));
var n = e.bbox;
n && (n.w = t, n.exactW = !0), n = e.parentNode.bbox, n && (n.w = t, n.exactW = !0);
} else e.style.width = e.parentNode.style.width = "100%", e.bbox && (e.bbox.width = t), e.parentNode.bbox && (e.parentNode.bbox.width = t);
},
createDelimiter: function(n, i, s, o, u) {
if (!i) {
n.bbox = {
h: 0,
d: 0,
w: this.TeX.nulldelimiterspace,
lw: 0
}, n.bbox.rw = n.bbox.w, this.createSpace(n, n.bbox.h, n.bbox.d, n.bbox.w);
return;
}
o || (o = 1), s instanceof Array || (s = [ s, s ]);
var a = s[1];
s = s[0];
var l = {
alias: i
};
while (l.alias) i = l.alias, l = this.FONTDATA.DELIMITERS[i], l || (l = {
HW: [ 0, this.FONTDATA.VARIANT[r.VARIANT.NORMAL] ]
});
l.load && t.RestartAfter(e.Require(this.fontDir + "/fontdata-" + l.load + ".js"));
for (var c = 0, h = l.HW.length; c < h; c++) if (l.HW[c][0] * o >= s - .01 || c == h - 1 && !l.stretch) {
l.HW[c][2] && (o *= l.HW[c][2]), l.HW[c][3] && (i = l.HW[c][3]);
var p = this.addElement(n, "span");
this.createChar(p, [ i, l.HW[c][1] ], o, u), n.bbox = p.bbox, n.offset = .65 * n.bbox.w, n.scale = o;
return;
}
l.stretch && this["extendDelimiter" + l.dir](n, a, l.stretch, o, u);
},
extendDelimiterV: function(e, t, n, r, i) {
var s = this.createStack(e, !0), o = this.createBox(s), u = this.createBox(s);
this.createChar(o, n.top || n.ext, r, i), this.createChar(u, n.bot || n.ext, r, i);
var a = {
bbox: {
w: 0,
lw: 0,
rw: 0
}
}, f = a, l, c = o.bbox.h + o.bbox.d + u.bbox.h + u.bbox.d, h = -o.bbox.h;
this.placeBox(o, 0, h, !0), h -= o.bbox.d, n.mid && (f = this.createBox(s), this.createChar(f, n.mid, r, i), c += f.bbox.h + f.bbox.d), n.min && t < c * n.min && (t = c * n.min);
if (t > c) {
a = this.Element("span"), this.createChar(a, n.ext, r, i);
var p = a.bbox.h + a.bbox.d, d = p - .05, v, m, g = n.mid ? 2 : 1;
m = v = Math.ceil((t - c) / (g * d)), n.fullExtenders || (d = (t - c) / (g * v));
var y = v / (v + 1) * (p - d);
d = p - y, h += y + d - a.bbox.h;
while (g-- > 0) {
while (v-- > 0) this.msieCloneNodeBug ? (l = this.Element("span"), this.createChar(l, n.ext, r, i)) : l = a.cloneNode(!0), l.bbox = a.bbox, h -= d, this.placeBox(this.addBox(s, l), 0, h, !0);
h += y - a.bbox.d, n.mid && g && (this.placeBox(f, 0, h - f.bbox.h, !0), v = m, h += -(f.bbox.h + f.bbox.d) + y + d - a.bbox.h);
}
} else h += (c - t) / 2, n.mid && (this.placeBox(f, 0, h - f.bbox.h, !0), h += -(f.bbox.h + f.bbox.d)), h += (c - t) / 2;
this.placeBox(u, 0, h - u.bbox.h, !0), h -= u.bbox.h + u.bbox.d, e.bbox = {
w: Math.max(o.bbox.w, a.bbox.w, u.bbox.w, f.bbox.w),
lw: Math.min(o.bbox.lw, a.bbox.lw, u.bbox.lw, f.bbox.lw),
rw: Math.max(o.bbox.rw, a.bbox.rw, u.bbox.rw, f.bbox.rw),
h: 0,
d: -h,
exactW: !0
}, e.scale = r, e.offset = .55 * e.bbox.w, e.isMultiChar = !0, this.setStackWidth(s, e.bbox.w);
},
extendDelimiterH: function(e, t, n, r, i) {
var s = this.createStack(e, !0), o = this.createBox(s), u = this.createBox(s);
this.createChar(o, n.left || n.rep, r, i), this.createChar(u, n.right || n.rep, r, i);
var a = this.Element("span");
this.createChar(a, n.rep, r, i);
var f = {
bbox: {
h: -this.BIGDIMEN,
d: -this.BIGDIMEN
}
}, l;
this.placeBox(o, -o.bbox.lw, 0, !0);
var c = o.bbox.rw - o.bbox.lw + (u.bbox.rw - u.bbox.lw) - .05, h = o.bbox.rw - o.bbox.lw - .025, p;
n.mid && (f = this.createBox(s), this.createChar(f, n.mid, r, i), c += f.bbox.w), n.min && t < c * n.min && (t = c * n.min);
if (t > c) {
var d = a.bbox.rw - a.bbox.lw, v = d - .05, m, g, y = n.mid ? 2 : 1;
g = m = Math.ceil((t - c) / (y * v)), n.fillExtenders || (v = (t - c) / (y * m)), p = m / (m + 1) * (d - v), v = d - p, h -= a.bbox.lw + p;
while (y-- > 0) {
while (m-- > 0) this.cloneNodeBug ? (l = this.Element("span"), this.createChar(l, n.rep, r, i)) : l = a.cloneNode(!0), l.bbox = a.bbox, this.placeBox(this.addBox(s, l), h, 0, !0), h += v;
n.mid && y && (this.placeBox(f, h, 0, !0), h += f.bbox.w - p, m = g);
}
} else h -= (c - t) / 2, n.mid && (this.placeBox(f, h, 0, !0), h += f.bbox.w), h -= (c - t) / 2;
this.placeBox(u, h, 0, !0), e.bbox = {
w: h + u.bbox.rw,
lw: 0,
rw: h + u.bbox.rw,
H: Math.max(o.bbox.h, a.bbox.h, u.bbox.h, f.bbox.h),
D: Math.max(o.bbox.d, a.bbox.d, u.bbox.d, f.bbox.d),
h: a.bbox.h,
d: a.bbox.d,
exactW: !0
}, e.scale = r, e.isMultiChar = !0, this.setStackWidth(s, e.bbox.w);
},
createChar: function(e, t, n, i) {
e.isMathJax = !0;
var s = e, o = "", u = {
fonts: [ t[1] ],
noRemap: !0
};
i && i === r.VARIANT.BOLD && (u.fonts = [ t[1] + "-bold", t[1] ]), typeof t[1] != "string" && (u = t[1]);
if (t[0] instanceof Array) for (var a = 0, l = t[0].length; a < l; a++) o += String.fromCharCode(t[0][a]); else o = String.fromCharCode(t[0]);
t[4] && (n *= t[4]), n !== 1 || t[3] ? (s = this.addElement(e, "span", {
style: {
fontSize: this.Percent(n)
},
scale: n,
isMathJax: !0
}), this.handleVariant(s, u, o), e.bbox = s.bbox) : this.handleVariant(e, u, o), t[2] && (e.style.marginLeft = this.Em(t[2])), t[3] && (e.firstChild.style.verticalAlign = this.Em(t[3]), e.bbox.h += t[3], e.bbox.h < 0 && (e.bbox.h = 0)), t[5] && (e.bbox.h += t[5]), t[6] && (e.bbox.d += t[6]), this.AccentBug && e.bbox.w === 0 && (s.firstChild.nodeValue += this.NBSP);
},
positionDelimiter: function(e, t) {
t -= e.bbox.h, e.bbox.d -= t, e.bbox.h += t, t && (this.safariVerticalAlignBug || this.konquerorVerticalAlignBug || this.operaVerticalAlignBug && e.isMultiChar ? (e.firstChild.style.display === "" && e.style.top !== "" && (e = e.firstChild, t -= n.unEm(e.style.top)), e.style.position = "relative", e.style.top = this.Em(-t)) : (e.style.verticalAlign = this.Em(t), n.ffVerticalAlignBug && n.createRule(e.parentNode, e.bbox.h, 0, 0)));
},
handleVariant: function(e, t, n) {
var i = "", s, o, u, a, l = e, c = !!e.style.fontFamily;
if (n.length === 0) return;
e.bbox || (e.bbox = {
w: 0,
h: -this.BIGDIMEN,
d: -this.BIGDIMEN,
rw: -this.BIGDIMEN,
lw: this.BIGDIMEN
}), t || (t = this.FONTDATA.VARIANT[r.VARIANT.NORMAL]), a = t;
for (var h = 0, p = n.length; h < p; h++) {
t = a, s = n.charCodeAt(h), o = n.charAt(h);
if (s >= 55296 && s < 56319) {
h++, s = (s - 55296 << 10) + (n.charCodeAt(h) - 56320) + 65536;
if (this.FONTDATA.RemapPlane1) {
var d = this.FONTDATA.RemapPlane1(s, t);
s = d.n, t = d.variant;
}
} else {
var v, m, g = this.FONTDATA.RANGES;
for (v = 0, m = g.length; v < m; v++) {
if (g[v].name === "alpha" && t.noLowerCase) continue;
var y = t["offset" + g[v].offset];
if (y && s >= g[v].low && s <= g[v].high) {
g[v].remap && g[v].remap[s] ? s = y + g[v].remap[s] : (s = s - g[v].low + y, g[v].add && (s += g[v].add)), t["variant" + g[v].offset] && (t = this.FONTDATA.VARIANT[t["variant" + g[v].offset]]);
break;
}
}
}
if (t.remap && t.remap[s]) if (t.remap[s] instanceof Array) {
var b = t.remap[s];
s = b[0], t = this.FONTDATA.VARIANT[b[1]];
} else typeof t.remap[s] == "string" ? (n = t.remap[s] + n.substr(h + 1), h = 0, p = n.length, s = n.charCodeAt(0)) : (s = t.remap[s], t.remap.variant && (t = this.FONTDATA.VARIANT[t.remap.variant]));
this.FONTDATA.REMAP[s] && !t.noRemap && (s = this.FONTDATA.REMAP[s], s instanceof Array && (t = this.FONTDATA.VARIANT[s[1]], s = s[0]), typeof s == "string" && (n = s + n.substr(h + 1), h = 0, p = n.length, s = s.charCodeAt(0))), u = this.lookupChar(t, s), o = u[s];
if (c || !this.checkFont(u, l.style) && !o[5].img) {
i.length && (this.addText(l, i), i = "");
var w = !!l.style.fontFamily || !!e.style.fontStyle || !!e.style.fontWeight || !u.directory || c;
c = !1, l !== e && (w = !this.checkFont(u, e.style), l = e), w && (l = this.addElement(e, "span", {
isMathJax: !0,
subSpan: !0
})), this.handleFont(l, u, l !== e);
}
i = this.handleChar(l, u, o, s, i), (o[5] || {}).space || (o[0] / 1e3 > e.bbox.h && (e.bbox.h = o[0] / 1e3), o[1] / 1e3 > e.bbox.d && (e.bbox.d = o[1] / 1e3)), e.bbox.w + o[3] / 1e3 < e.bbox.lw && (e.bbox.lw = e.bbox.w + o[3] / 1e3), e.bbox.w + o[4] / 1e3 > e.bbox.rw && (e.bbox.rw = e.bbox.w + o[4] / 1e3), e.bbox.w += o[2] / 1e3;
}
i.length && this.addText(l, i), e.scale && e.scale !== 1 && (e.bbox.h *= e.scale, e.bbox.d *= e.scale, e.bbox.w *= e.scale, e.bbox.lw *= e.scale, e.bbox.rw *= e.scale), n.length == 1 && u.skew && u.skew[s] && (e.bbox.skew = u.skew[s]);
},
checkFont: function(e, t) {
var n = t.fontWeight || "normal";
return n.match(/^\d+$/) && (n = parseInt(n) >= 600 ? "bold" : "normal"), e.family.replace(/'/g, "") === t.fontFamily.replace(/'/g, "") && (e.style || "normal") === (t.fontStyle || "normal") && (e.weight || "normal") === n;
},
handleFont: function(e, t, r) {
e.style.fontFamily = t.family, t.directory || (e.style.fontSize = Math.floor(100 / n.scale + .5) + "%");
if (!n.FontFaceBug || !t.isWebFont) {
var i = t.style || "normal", s = t.weight || "normal";
if (i !== "normal" || r) e.style.fontStyle = i;
if (s !== "normal" || r) e.style.fontWeight = s;
}
},
handleChar: function(e, t, r, i, s) {
var o = r[5];
if (o.space) return s.length && this.addText(e, s), n.createShift(e, r[2] / 1e3), "";
if (o.img) return this.handleImg(e, t, r, i, s);
if (o.isUnknown && this.FONTDATA.DELIMITERS[i]) {
s.length && this.addText(e, s);
var u = e.scale;
return n.createDelimiter(e, i, 0, 1, t), this.FONTDATA.DELIMITERS[i].dir === "V" && (e.style.verticalAlign = this.Em(e.bbox.d), e.bbox.h += e.bbox.d, e.bbox.d = 0), e.scale = u, r[0] = e.bbox.h * 1e3, r[1] = e.bbox.d * 1e3, r[2] = e.bbox.w * 1e3, r[3] = e.bbox.lw * 1e3, r[4] = e.bbox.rw * 1e3, "";
}
if (o.c == null) if (i <= 65535) o.c = String.fromCharCode(i); else {
var a = i - 65536;
o.c = String.fromCharCode((a >> 10) + 55296) + String.fromCharCode((a & 1023) + 56320);
}
return o.rfix ? (this.addText(e, s + o.c), n.createShift(e, o.rfix / 1e3), "") : r[2] || !this.msieAccentBug || s.length ? s + o.c : (n.createShift(e, r[3] / 1e3), n.createShift(e, (r[4] - r[3]) / 1e3), this.addText(e, o.c), n.createShift(e, -r[4] / 1e3), "");
},
handleImg: function(e, t, n, r, i) {
return i;
},
lookupChar: function(e, t) {
var r, i;
if (!e.FONTS) {
var s = this.FONTDATA.FONTS, o = e.fonts || this.FONTDATA.VARIANT.normal.fonts;
o instanceof Array || (o = [ o ]), e.fonts != o && (e.fonts = o), e.FONTS = [];
for (r = 0, i = o.length; r < i; r++) s[o[r]] && (e.FONTS.push(s[o[r]]), s[o[r]].name = o[r]);
}
for (r = 0, i = e.FONTS.length; r < i; r++) {
var u = e.FONTS[r];
typeof u == "string" && (delete e.FONTS, this.loadFont(u));
if (u[t]) {
u[t].length === 5 && (u[t][5] = {});
if (!n.allowWebFonts || !!u.available) return u;
this.loadWebFont(u);
} else this.findBlock(u, t);
}
return this.unknownChar(e, t);
},
unknownChar: function(e, r) {
var i = e.defaultFont || {
family: n.config.undefinedFamily
};
return e.bold && (i.weight = "bold"), e.italic && (i.style = "italic"), i[r] || (i[r] = [ 800, 200, 500, 0, 500, {
isUnknown: !0
} ]), t.signal.Post([ "HTML-CSS Jax - unknown char", r, e ]), i;
},
findBlock: function(e, t) {
if (e.Ranges) for (var n = 0, r = e.Ranges.length; n < r; n++) {
if (t < e.Ranges[n][0]) return;
if (t <= e.Ranges[n][1]) {
var i = e.Ranges[n][2];
for (var s = e.Ranges.length - 1; s >= 0; s--) e.Ranges[s][2] == i && e.Ranges.splice(s, 1);
this.loadFont(e.directory + "/" + i + ".js");
}
}
},
loadFont: function(r) {
var i = MathJax.Callback.Queue();
i.Push([ "Require", e, this.fontDir + "/" + r ]), this.imgFonts && (MathJax.isPacked || (r = r.replace(/\/([^\/]*)$/, n.imgPacked + "/$1")), i.Push([ "Require", e, this.webfontDir + "/png/" + r ])), t.RestartAfter(i.Push({}));
},
loadWebFont: function(e) {
e.available = e.isWebFont = !0, n.FontFaceBug && (e.family = e.name, n.msieFontCSSBug && (e.family += "-Web")), t.RestartAfter(this.Font.loadWebFont(e));
},
loadWebFontError: function(n, r) {
t.Startup.signal.Post("HTML-CSS Jax - disable web fonts"), n.isWebFont = !1, this.config.imageFont && this.config.imageFont === this.fontInUse ? (this.imgFonts = !0, t.Startup.signal.Post("HTML-CSS Jax - switch to image fonts"), t.Startup.signal.Post("HTML-CSS Jax - using image fonts"), MathJax.Message.Set("Web-Fonts not available -- using image fonts instead", null, 3e3), e.Require(this.directory + "/imageFonts.js", r)) : (this.allowWebFonts = !1, r());
},
Element: MathJax.HTML.Element,
addElement: MathJax.HTML.addElement,
TextNode: MathJax.HTML.TextNode,
addText: MathJax.HTML.addText,
ucMatch: MathJax.HTML.ucMatch,
BIGDIMEN: 1e7,
ID: 0,
idPostfix: "",
GetID: function() {
return this.ID++, this.ID;
},
MATHSPACE: {
veryverythinmathspace: 1 / 18,
verythinmathspace: 2 / 18,
thinmathspace: 3 / 18,
mediummathspace: 4 / 18,
thickmathspace: 5 / 18,
verythickmathspace: 6 / 18,
veryverythickmathspace: 7 / 18,
negativeveryverythinmathspace: -1 / 18,
negativeverythinmathspace: -2 / 18,
negativethinmathspace: -3 / 18,
negativemediummathspace: -4 / 18,
negativethickmathspace: -5 / 18,
negativeverythickmathspace: -6 / 18,
negativeveryverythickmathspace: -7 / 18
},
TeX: {
x_height: .430554,
quad: 1,
num1: .676508,
num2: .393732,
num3: .44373,
denom1: .685951,
denom2: .344841,
sup1: .412892,
sup2: .362892,
sup3: .288888,
sub1: .15,
sub2: .247217,
sup_drop: .386108,
sub_drop: .05,
delim1: 2.39,
delim2: 1,
axis_height: .25,
rule_thickness: .06,
big_op_spacing1: .111111,
big_op_spacing2: .166666,
big_op_spacing3: .2,
big_op_spacing4: .6,
big_op_spacing5: .1,
scriptspace: .1,
nulldelimiterspace: .12,
delimiterfactor: 901,
delimitershortfall: .1,
min_rule_thickness: 1.25
},
NBSP: "\u00a0",
rfuzz: 0
}), MathJax.Hub.Register.StartupHook("mml Jax Ready", function() {
r = MathJax.ElementJax.mml, r.mbase.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e), this.type != "mrow" && (e = this.HTMLhandleSize(e));
for (var t = 0, n = this.data.length; t < n; t++) this.data[t] && this.data[t].toHTML(e);
var r = this.HTMLcomputeBBox(e), i = e.bbox.h, s = e.bbox.d;
for (t = 0, n = r.length; t < n; t++) r[t].HTMLstretchV(e, i, s);
return r.length && this.HTMLcomputeBBox(e, !0), this.HTMLlineBreaks(e) && (e = this.HTMLmultiline(e)), this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLlineBreaks: function() {
return !1;
},
HTMLmultiline: function() {
r.mbase.HTMLautoloadFile("multiline");
},
HTMLcomputeBBox: function(e, t, n, r) {
n == null && (n = 0), r == null && (r = this.data.length);
var i = e.bbox = {
exactW: !0
}, s = [];
while (n < r) {
var o = this.data[n];
if (!o) continue;
!t && o.HTMLcanStretch("Vertical") && (s.push(o), o = o.CoreMO() || o), this.HTMLcombineBBoxes(o, i), n++;
}
return this.HTMLcleanBBox(i), s;
},
HTMLcombineBBoxes: function(e, t) {
t.w == null && this.HTMLemptyBBox(t);
var r = e.bbox ? e : e.HTMLspanElement();
if (!r || !r.bbox) return;
var i = r.bbox;
i.d > t.d && (t.d = i.d), i.h > t.h && (t.h = i.h), i.D != null && i.D > t.D && (t.D = i.D), i.H != null && i.H > t.H && (t.H = i.H), r.style.paddingLeft && (t.w += n.unEm(r.style.paddingLeft) * (r.scale || 1)), t.w + i.lw < t.lw && (t.lw = t.w + i.lw), t.w + i.rw > t.rw && (t.rw = t.w + i.rw), t.w += i.w, r.style.paddingRight && (t.w += n.unEm(r.style.paddingRight) * (r.scale || 1)), i.width && (t.width = i.width), i.ic ? t.ic = i.ic : delete t.ic, t.exactW && !i.exactW && delete t.exactW;
},
HTMLemptyBBox: function(e) {
return e.h = e.d = e.H = e.D = e.rw = -n.BIGDIMEN, e.w = 0, e.lw = n.BIGDIMEN, e;
},
HTMLcleanBBox: function(e) {
e.h === this.BIGDIMEN && (e.h = e.d = e.H = e.D = e.w = e.rw = e.lw = 0), e.D <= e.d && delete e.D, e.H <= e.h && delete e.H;
},
HTMLzeroBBox: function() {
return {
h: 0,
d: 0,
w: 0,
lw: 0,
rw: 0
};
},
HTMLcanStretch: function(e) {
if (this.isEmbellished()) {
var t = this.Core();
if (t && t !== this) return t.HTMLcanStretch(e);
}
return !1;
},
HTMLstretchH: function(e, t) {
return this.HTMLspanElement();
},
HTMLstretchV: function(e, t, n) {
return this.HTMLspanElement();
},
HTMLnotEmpty: function(e) {
while (e) {
if (e.type !== "mrow" && e.type !== "texatom" || e.data.length > 1) return !0;
e = e.data[0];
}
return !1;
},
HTMLmeasureChild: function(e, t) {
this.data[e] ? n.Measured(this.data[e].toHTML(t), t) : t.bbox = this.HTMLzeroBBox();
},
HTMLboxChild: function(e, t) {
return this.data[e] ? this.data[e].toHTML(t) : (t.bbox || (t.bbox = this.HTMLzeroBBox()), null);
},
HTMLcreateSpan: function(e) {
if (this.spanID) {
var t = this.HTMLspanElement();
if (t && (t.parentNode === e || (t.parentNode || {}).parentNode === e)) {
while (t.firstChild) t.removeChild(t.firstChild);
return t.bbox = {
w: 0,
h: 0,
d: 0,
lw: 0,
rw: 0
}, t.scale = 1, t.isMultChar = t.HH = null, t.style.cssText = "", t;
}
}
return this.href && (e = n.addElement(e, "a", {
href: this.href,
isMathJax: !0
})), e = n.addElement(e, "span", {
className: this.type,
isMathJax: !0
}), n.imgHeightBug && (e.style.display = "inline-block"), this["class"] && (e.className += " " + this["class"]), this.spanID || (this.spanID = n.GetID()), e.id = (this.id || "MathJax-Span-" + this.spanID) + n.idPostfix, e.bbox = {
w: 0,
h: 0,
d: 0,
lw: 0,
rw: 0
}, this.styles = {}, this.style && (e.style.cssText = this.style, e.style.fontSize && (this.mathsize = e.style.fontSize, e.style.fontSize = ""), this.styles = {
border: n.getBorders(e),
padding: n.getPadding(e)
}, this.styles.border && (e.style.border = ""), this.styles.padding && (e.style.padding = "")), this.href && (e.parentNode.bbox = e.bbox), e;
},
HTMLspanElement: function() {
return this.spanID ? document.getElementById((this.id || "MathJax-Span-" + this.spanID) + n.idPostfix) : null;
},
HTMLhandleVariant: function(e, t, r) {
n.handleVariant(e, t, r);
},
HTMLhandleSize: function(e) {
return e.scale || (e.scale = this.HTMLgetScale(), e.scale !== 1 && (e.style.fontSize = n.Percent(e.scale))), e;
},
HTMLhandleColor: function(e) {
var t = this.getValues("mathcolor", "color");
this.mathbackground && (t.mathbackground = this.mathbackground), this.background && (t.background = this.background), this.style && e.style.backgroundColor && (t.mathbackground = e.style.backgroundColor, e.style.backgroundColor = "transparent");
var i = (this.styles || {}).border, s = (this.styles || {}).padding;
t.color && !this.mathcolor && (t.mathcolor = t.color), t.background && !this.mathbackground && (t.mathbackground = t.background), t.mathcolor && (e.style.color = t.mathcolor);
if (t.mathbackground && t.mathbackground !== r.COLOR.TRANSPARENT || i || s) {
var o = e.bbox, u = o.exact ? 0 : 1 / n.em, a = 0, l = 0, c = e.style.paddingLeft, h = e.style.paddingRight;
this.isToken && (a = o.lw, l = o.rw - o.w), c !== "" && (a += n.unEm(c) * (e.scale || 1)), h !== "" && (l -= n.unEm(h) * (e.scale || 1));
var p = n.PaddingWidthBug || o.keepPadding || o.exactW ? 0 : l - a, v = Math.max(0, n.getW(e) + p), m = o.h + o.d, g = -o.d, y = 0, b = 0;
v > 0 && (v += 2 * u, a -= u), m > 0 && (m += 2 * u, g -= u), l = -v - a, i && (l -= i.right, g -= i.bottom, y += i.left, b += i.right, o.h += i.top, o.d += i.bottom, o.w += i.left + i.right, o.lw -= i.left, o.rw += i.right), s && (m += s.top + s.bottom, v += s.left + s.right, l -= s.right, g -= s.bottom, y += s.left, b += s.right, o.h += s.top, o.d += s.bottom, o.w += s.left + s.right, o.lw -= s.left, o.rw += s.right), b && (e.style.paddingRight = n.Em(b));
var w = n.Element("span", {
id: "MathJax-Color-" + this.spanID + n.idPostfix,
isMathJax: !0,
style: {
display: "inline-block",
backgroundColor: t.mathbackground,
width: n.Em(v),
height: n.Em(m),
verticalAlign: n.Em(g),
marginLeft: n.Em(a),
marginRight: n.Em(l)
}
});
return n.setBorders(w, i), o.width && (w.style.width = o.width, w.style.marginRight = "-" + o.width), n.msieInlineBlockAlignBug && (w.style.position = "relative", w.style.width = w.style.height = 0, w.style.verticalAlign = w.style.marginLeft = w.style.marginRight = "", w.style.border = w.style.padding = "", i && n.msieBorderWidthBug && (m += i.top + i.bottom, v += i.left + i.right), w.style.width = n.Em(y + u), n.placeBox(n.addElement(w, "span", {
noAdjust: !0,
isMathJax: !0,
style: {
display: "inline-block",
position: "absolute",
overflow: "hidden",
background: t.mathbackground || "transparent",
width: n.Em(v),
height: n.Em(m)
}
}), a, o.h + u), n.setBorders(w.firstChild, i)), e.parentNode.insertBefore(w, e), n.msieColorPositionBug && (e.style.position = "relative"), w;
}
return null;
},
HTMLremoveColor: function() {
var e = document.getElementById("MathJax-Color-" + this.spanID + n.idPostfix);
e && e.parentNode.removeChild(e);
},
HTMLhandleSpace: function(e) {
if (this.useMMLspacing) {
if (this.type !== "mo") return;
var t = this.getValues("scriptlevel", "lspace", "rspace");
if (t.scriptlevel <= 0 || this.hasValue("lspace") || this.hasValue("rspace")) {
var r = this.HTMLgetMu(e);
t.lspace = Math.max(0, n.length2em(t.lspace, r)), t.rspace = Math.max(0, n.length2em(t.rspace, r));
var i = this, s = this.Parent();
while (s && s.isEmbellished() && s.Core() === i) i = s, s = s.Parent(), e = i.HTMLspanElement();
t.lspace && (e.style.paddingLeft = n.Em(t.lspace)), t.rspace && (e.style.paddingRight = n.Em(t.rspace));
}
} else {
var o = this.texSpacing();
o !== "" && (o = n.length2em(o, this.HTMLgetScale()) / (e.scale || 1), e.style.paddingLeft && (o += n.unEm(e.style.paddingLeft)), e.style.paddingLeft = n.Em(o));
}
},
HTMLgetScale: function() {
var e = 1, t = this.getValues("mathsize", "scriptlevel", "fontsize");
if (this.style) {
var r = this.HTMLspanElement();
r.style.fontSize != "" && (t.fontsize = r.style.fontSize);
}
return t.fontsize && !this.mathsize && (t.mathsize = t.fontsize), t.scriptlevel !== 0 && (t.scriptlevel > 2 && (t.scriptlevel = 2), e = Math.pow(this.Get("scriptsizemultiplier"), t.scriptlevel), t.scriptminsize = n.length2em(this.Get("scriptminsize")), e < t.scriptminsize && (e = t.scriptminsize)), this.isToken && (e *= n.length2em(t.mathsize)), e;
},
HTMLgetMu: function(e) {
var t = 1, n = this.getValues("scriptlevel", "scriptsizemultiplier");
return e.scale && e.scale !== 1 && (t = 1 / e.scale), n.scriptlevel !== 0 && (n.scriptlevel > 2 && (n.scriptlevel = 2), t = Math.sqrt(Math.pow(n.scriptsizemultiplier, n.scriptlevel))), t;
},
HTMLgetVariant: function() {
var e = this.getValues("mathvariant", "fontfamily", "fontweight", "fontstyle");
e.hasVariant = this.Get("mathvariant", !0), e.hasVariant || (e.family = e.fontfamily, e.weight = e.fontweight, e.style = e.fontstyle);
if (this.style) {
var t = this.HTMLspanElement();
!e.family && t.style.fontFamily && (e.family = t.style.fontFamily), !e.weight && t.style.fontWeight && (e.weight = t.style.fontWeight), !e.style && t.style.fontStyle && (e.style = t.style.fontStyle);
}
e.weight && e.weight.match(/^\d+$/) && (e.weight = parseInt(e.weight) > 600 ? "bold" : "normal");
var i = e.mathvariant;
return this.variantForm && (i = "-" + n.fontInUse + "-variant"), e.family && !e.hasVariant ? (!e.weight && e.mathvariant.match(/bold/) && (e.weight = "bold"), !e.style && e.mathvariant.match(/italic/) && (e.style = "italic"), {
FONTS: [],
fonts: [],
noRemap: !0,
defaultFont: {
family: e.family,
style: e.style,
weight: e.weight
}
}) : (e.weight === "bold" ? i = {
normal: r.VARIANT.BOLD,
italic: r.VARIANT.BOLDITALIC,
fraktur: r.VARIANT.BOLDFRAKTUR,
script: r.VARIANT.BOLDSCRIPT,
"sans-serif": r.VARIANT.BOLDSANSSERIF,
"sans-serif-italic": r.VARIANT.SANSSERIFBOLDITALIC
}[i] || i : e.weight === "normal" && (i = {
bold: r.VARIANT.normal,
"bold-italic": r.VARIANT.ITALIC,
"bold-fraktur": r.VARIANT.FRAKTUR,
"bold-script": r.VARIANT.SCRIPT,
"bold-sans-serif": r.VARIANT.SANSSERIF,
"sans-serif-bold-italic": r.VARIANT.SANSSERIFITALIC
}[i] || i), e.style === "italic" ? i = {
normal: r.VARIANT.ITALIC,
bold: r.VARIANT.BOLDITALIC,
"sans-serif": r.VARIANT.SANSSERIFITALIC,
"bold-sans-serif": r.VARIANT.SANSSERIFBOLDITALIC
}[i] || i : e.style === "normal" && (i = {
italic: r.VARIANT.NORMAL,
"bold-italic": r.VARIANT.BOLD,
"sans-serif-italic": r.VARIANT.SANSSERIF,
"sans-serif-bold-italic": r.VARIANT.BOLDSANSSERIF
}[i] || i), n.FONTDATA.VARIANT[i]);
}
}, {
HTMLautoload: function() {
var r = n.autoloadDir + "/" + this.type + ".js";
t.RestartAfter(e.Require(r));
},
HTMLautoloadFile: function(r) {
var i = n.autoloadDir + "/" + r + ".js";
t.RestartAfter(e.Require(i));
},
HTMLstretchH: function(e, t) {
return this.HTMLremoveColor(), this.toHTML(e, t);
},
HTMLstretchV: function(e, t, n) {
return this.HTMLremoveColor(), this.toHTML(e, t, n);
}
}), r.chars.Augment({
toHTML: function(e, t, r, i) {
var s = this.data.join("").replace(/[\u2061-\u2064]/g, "");
r && (s = r(s, i));
if (t.fontInherit) {
var o = Math.floor(100 / n.scale + .5) + "%";
n.addElement(e, "span", {
style: {
"font-size": o
}
}, [ s ]), t.bold && (e.lastChild.style.fontWeight = "bold"), t.italic && (e.lastChild.style.fontStyle = "italic");
var u = n.getHD(e), a = n.getW(e);
e.bbox = {
h: u.h,
d: u.d,
w: a,
lw: 0,
rw: a,
exactW: !0
};
} else this.HTMLhandleVariant(e, t, s);
}
}), r.entity.Augment({
toHTML: function(e, t, r, i) {
var s = this.toString().replace(/[\u2061-\u2064]/g, "");
r && (s = r(s, i));
if (t.fontInherit) {
var o = Math.floor(100 / n.scale + .5) + "%";
n.addElement(e, "span", {
style: {
"font-size": o
}
}, [ s ]), t.bold && (e.lastChild.style.fontWeight = "bold"), t.italic && (e.lastChild.style.fontStyle = "italic");
var u = n.getHD(e), a = n.getW(e);
e.bbox = {
h: u.h,
d: u.d,
w: a,
lw: 0,
rw: a,
exactW: !0
};
} else this.HTMLhandleVariant(e, t, s);
}
}), r.mi.Augment({
toHTML: function(e) {
e = this.HTMLhandleSize(this.HTMLcreateSpan(e)), e.bbox = null;
var t = this.HTMLgetVariant();
for (var r = 0, i = this.data.length; r < i; r++) this.data[r] && this.data[r].toHTML(e, t);
e.bbox || (e.bbox = {
w: 0,
h: 0,
d: 0,
rw: 0,
lw: 0
});
var s = this.data.join(""), o = e.bbox;
return o.skew && s.length !== 1 && delete o.skew, o.rw > o.w && s.length === 1 && !t.noIC && (o.ic = o.rw - o.w, n.createBlank(e, o.ic), o.w = o.rw), this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
}
}), r.mn.Augment({
toHTML: function(e) {
e = this.HTMLhandleSize(this.HTMLcreateSpan(e)), e.bbox = null;
var t = this.HTMLgetVariant();
for (var n = 0, r = this.data.length; n < r; n++) this.data[n] && this.data[n].toHTML(e, t);
return e.bbox || (e.bbox = {
w: 0,
h: 0,
d: 0,
rw: 0,
lw: 0
}), this.data.join("").length !== 1 && delete e.bbox.skew, this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
}
}), r.mo.Augment({
toHTML: function(e) {
e = this.HTMLhandleSize(this.HTMLcreateSpan(e));
if (this.data.length == 0) return e;
e.bbox = null;
var t = this.data.join(""), i = this.HTMLgetVariant(), s = this.getValues("largeop", "displaystyle");
s.largeop && (i = n.FONTDATA.VARIANT[s.displaystyle ? "-largeOp" : "-smallOp"]);
var o = this.CoreParent(), u = o && o.isa(r.msubsup) && this !== o.data[o.base], a = u ? this.HTMLremapChars : null;
if (t.length === 1 && o && o.isa(r.munderover) && this.CoreText(o.data[o.base]).length === 1) {
var l = o.data[o.over], c = o.data[o.under];
l && this === l.CoreMO() && o.Get("accent") ? a = n.FONTDATA.REMAPACCENT : c && this === c.CoreMO() && o.Get("accentunder") && (a = n.FONTDATA.REMAPACCENTUNDER);
}
u && t.match(/['`"\u00B4\u2032-\u2037\u2057]/) && (i = n.FONTDATA.VARIANT["-" + n.fontInUse + "-variant"]);
for (var h = 0, p = this.data.length; h < p; h++) this.data[h] && this.data[h].toHTML(e, i, this.HTMLremap, a);
e.bbox || (e.bbox = {
w: 0,
h: 0,
d: 0,
rw: 0,
lw: 0
}), t.length !== 1 && delete e.bbox.skew, n.AccentBug && e.bbox.w === 0 && t.length === 1 && e.firstChild && (e.firstChild.nodeValue += n.NBSP, n.createSpace(e, 0, 0, -e.offsetWidth / n.em));
if (s.largeop) {
var v = (e.bbox.h - e.bbox.d) / 2 - n.TeX.axis_height * e.scale;
n.safariVerticalAlignBug && e.lastChild.nodeName === "IMG" ? e.lastChild.style.verticalAlign = n.Em(n.unEm(e.lastChild.style.verticalAlign || 0) / n.em - v / e.scale) : n.konquerorVerticalAlignBug && e.lastChild.nodeName === "IMG" ? (e.style.position = "relative", e.lastChild.style.position = "relative", e.lastChild.style.top = n.Em(v / e.scale)) : e.style.verticalAlign = n.Em(-v / e.scale), e.bbox.h -= v, e.bbox.d += v, e.bbox.rw > e.bbox.w && (e.bbox.ic = e.bbox.rw - e.bbox.w, n.createBlank(e, e.bbox.ic), e.bbox.w = e.bbox.rw);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
CoreParent: function() {
var e = this;
while (e && e.isEmbellished() && e.CoreMO() === this && !e.isa(r.math)) e = e.Parent();
return e;
},
CoreText: function(e) {
if (!e) return "";
if (e.isEmbellished()) return e.CoreMO().data.join("");
while ((e.isa(r.mrow) || e.isa(r.TeXAtom)) && e.data.length === 1 && e.data[0]) e = e.data[0];
return e.isToken ? e.data.join("") : "";
},
HTMLremapChars: {
"*": "\u2217",
'"': "\u2033",
"\u00b0": "\u2218",
"\u00b2": "2",
"\u00b3": "3",
"\u00b4": "\u2032",
"\u00b9": "1"
},
HTMLremap: function(e, t) {
return e = e.replace(/-/g, "\u2212"), t && (e = e.replace(/'/g, "\u2032").replace(/`/g, "\u2035"), e.length === 1 && (e = t[e] || e)), e;
},
HTMLcanStretch: function(e) {
if (!this.Get("stretchy")) return !1;
var t = this.data.join("");
if (t.length > 1) return !1;
var i = this.CoreParent();
if (i && i.isa(r.munderover) && this.CoreText(i.data[i.base]).length === 1) {
var s = i.data[i.over], o = i.data[i.under];
s && this === s.CoreMO() && i.Get("accent") ? t = n.FONTDATA.REMAPACCENT[t] || t : o && this === o.CoreMO() && i.Get("accentunder") && (t = n.FONTDATA.REMAPACCENTUNDER[t] || t);
}
return t = n.FONTDATA.DELIMITERS[t.charCodeAt(0)], t && t.dir == e.substr(0, 1);
},
HTMLstretchV: function(e, t, r) {
this.HTMLremoveColor();
var i = this.getValues("symmetric", "maxsize", "minsize"), s = this.HTMLspanElement(), o = this.HTMLgetMu(s), u, a = n.TeX.axis_height, f = s.scale;
return i.symmetric ? u = 2 * Math.max(t - a, r + a) : u = t + r, i.maxsize = n.length2em(i.maxsize, o, s.bbox.h + s.bbox.d), i.minsize = n.length2em(i.minsize, o, s.bbox.h + s.bbox.d), u = Math.max(i.minsize, Math.min(i.maxsize, u)), s = this.HTMLcreateSpan(e), n.createDelimiter(s, this.data.join("").charCodeAt(0), u, f), i.symmetric ? u = (s.bbox.h + s.bbox.d) / 2 + a : u = (s.bbox.h + s.bbox.d) * t / (t + r), n.positionDelimiter(s, u), this.HTMLhandleSpace(s), this.HTMLhandleColor(s), s;
},
HTMLstretchH: function(e, t) {
this.HTMLremoveColor();
var i = this.getValues("maxsize", "minsize", "mathvariant", "fontweight");
(i.fontweight === "bold" || parseInt(i.fontweight) >= 600) && !this.Get("mathvariant", !0) && (i.mathvariant = r.VARIANT.BOLD);
var s = this.HTMLspanElement(), o = this.HTMLgetMu(s), u = s.scale;
return i.maxsize = n.length2em(i.maxsize, o, s.bbox.w), i.minsize = n.length2em(i.minsize, o, s.bbox.w), t = Math.max(i.minsize, Math.min(i.maxsize, t)), s = this.HTMLcreateSpan(e), n.createDelimiter(s, this.data.join("").charCodeAt(0), t, u, i.mathvariant), this.HTMLhandleSpace(s), this.HTMLhandleColor(s), s;
}
}), r.mtext.Augment({
toHTML: function(e) {
e = this.HTMLhandleSize(this.HTMLcreateSpan(e));
var t = this.HTMLgetVariant();
if (n.config.mtextFontInherit || this.Parent().type === "merror") t = {
bold: t.bold,
italic: t.italic,
fontInherit: !0
};
for (var r = 0, i = this.data.length; r < i; r++) this.data[r] && this.data[r].toHTML(e, t);
return e.bbox || (e.bbox = {
w: 0,
h: 0,
d: 0,
rw: 0,
lw: 0
}), this.data.join("").length !== 1 && delete e.bbox.skew, this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
}
}), r.merror.Augment({
toHTML: function(e) {
var t = MathJax.HTML.addElement(e, "span", {
style: {
display: "inline-block"
}
});
e = this.SUPER(arguments).toHTML.call(this, t);
var r = n.getHD(t), i = n.getW(t);
return t.bbox = {
h: r.h,
d: r.d,
w: i,
lw: 0,
rw: i,
exactW: !0
}, t.id = e.id, e.id = null, t;
}
}), r.ms.Augment({
toHTML: r.mbase.HTMLautoload
}), r.mglyph.Augment({
toHTML: r.mbase.HTMLautoload
}), r.mspace.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e);
var t = this.getValues("height", "depth", "width"), r = this.HTMLgetMu(e);
t.mathbackground = this.mathbackground, this.background && !this.mathbackground && (t.mathbackground = this.background);
var i = n.length2em(t.height, r), s = n.length2em(t.depth, r), o = n.length2em(t.width, r);
return n.createSpace(e, i, s, o, t.mathbackground, !0), e;
}
}), r.mphantom.Augment({
toHTML: function(e, t, r) {
e = this.HTMLcreateSpan(e);
if (this.data[0] != null) {
var i = this.data[0].toHTML(e);
r != null ? n.Remeasured(this.data[0].HTMLstretchV(e, t, r), e) : t != null ? n.Remeasured(this.data[0].HTMLstretchH(e, t), e) : i = n.Measured(i, e), e.bbox = {
w: i.bbox.w,
h: i.bbox.h,
d: i.bbox.d,
lw: 0,
rw: 0,
exactW: !0
};
for (var s = 0, o = e.childNodes.length; s < o; s++) e.childNodes[s].style.visibility = "hidden";
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.mpadded.Augment({
toHTML: function(e, t, r) {
e = this.HTMLcreateSpan(e);
if (this.data[0] != null) {
var i = n.createStack(e, !0), s = n.createBox(i), o = this.data[0].toHTML(s);
r != null ? n.Remeasured(this.data[0].HTMLstretchV(s, t, r), s) : t != null ? n.Remeasured(this.data[0].HTMLstretchH(s, t), s) : n.Measured(o, s);
var u = this.getValues("height", "depth", "width", "lspace", "voffset"), a = 0, f = 0, l = this.HTMLgetMu(e);
u.lspace && (a = this.HTMLlength2em(s, u.lspace, l)), u.voffset && (f = this.HTMLlength2em(s, u.voffset, l)), n.placeBox(s, a, f), e.bbox = {
h: s.bbox.h,
d: s.bbox.d,
w: s.bbox.w,
exactW: !0,
lw: Math.min(0, s.bbox.lw + a),
rw: Math.max(s.bbox.w, s.bbox.rw + a),
H: Math.max(s.bbox.H == null ? -n.BIGDIMEN : s.bbox.H, s.bbox.h + f),
D: Math.max(s.bbox.D == null ? -n.BIGDIMEN : s.bbox.D, s.bbox.d - f)
}, u.height !== "" && (e.bbox.h = this.HTMLlength2em(s, u.height, l, "h", 0)), u.depth !== "" && (e.bbox.d = this.HTMLlength2em(s, u.depth, l, "d", 0)), u.width !== "" && (e.bbox.w = this.HTMLlength2em(s, u.width, l, "w", 0)), e.bbox.H <= e.bbox.h && delete e.bbox.H, e.bbox.D <= e.bbox.d && delete e.bbox.D;
var c = /^\s*(\d+(\.\d*)?|\.\d+)\s*(pt|em|ex|mu|px|pc|in|mm|cm)\s*$/;
e.bbox.exact = !!(this.data[0] && this.data[0].data.length == 0 || c.exec(u.height) || c.exec(u.width) || c.exec(u.depth)), n.setStackWidth(i, e.bbox.w);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLlength2em: function(e, t, r, i, s) {
s == null && (s = -n.BIGDIMEN);
var o = String(t).match(/width|height|depth/), u = o ? e.bbox[o[0].charAt(0)] : i ? e.bbox[i] : 0, a = n.length2em(t, r, u);
return i && String(t).match(/^\s*[-+]/) ? Math.max(s, e.bbox[i] + a) : a;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.mrow.Augment({
HTMLlineBreaks: function(e) {
return this.parent.linebreakContainer ? n.config.linebreaks.automatic && e.bbox.w > n.linebreakWidth || this.hasNewline() : !1;
},
HTMLstretchH: function(e, t) {
this.HTMLremoveColor();
var n = this.HTMLspanElement();
return this.data[this.core].HTMLstretchH(n, t), this.HTMLcomputeBBox(n, !0), this.HTMLhandleColor(n), n;
},
HTMLstretchV: function(e, t, n) {
this.HTMLremoveColor();
var r = this.HTMLspanElement();
return this.data[this.core].HTMLstretchV(r, t, n), this.HTMLcomputeBBox(r, !0), this.HTMLhandleColor(r), r;
}
}), r.mstyle.Augment({
toHTML: function(e, t, n) {
e = this.HTMLcreateSpan(e);
if (this.data[0] != null) {
var r = this.data[0].toHTML(e);
n != null ? this.data[0].HTMLstretchV(e, t, n) : t != null && this.data[0].HTMLstretchH(e, t), e.bbox = r.bbox;
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.mfrac.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e);
var t = n.createStack(e), r = n.createBox(t), i = n.createBox(t);
n.MeasureSpans([ this.HTMLboxChild(0, r), this.HTMLboxChild(1, i) ]);
var s = this.getValues("displaystyle", "linethickness", "numalign", "denomalign", "bevelled"), o = this.HTMLgetScale(), u = s.displaystyle, a = n.TeX.axis_height * o;
if (s.bevelled) {
var f = u ? .4 : .15, l = Math.max(r.bbox.h + r.bbox.d, i.bbox.h + i.bbox.d) + 2 * f, c = n.createBox(t);
n.createDelimiter(c, 47, l), n.placeBox(r, 0, (r.bbox.d - r.bbox.h) / 2 + a + f), n.placeBox(c, r.bbox.w - f / 2, (c.bbox.d - c.bbox.h) / 2 + a), n.placeBox(i, r.bbox.w + c.bbox.w - f, (i.bbox.d - i.bbox.h) / 2 + a - f);
} else {
var h = Math.max(r.bbox.w, i.bbox.w), p = n.thickness2em(s.linethickness, o), v, m, g, y, b = n.TeX.min_rule_thickness / this.em;
u ? (g = n.TeX.num1, y = n.TeX.denom1) : (g = p === 0 ? n.TeX.num3 : n.TeX.num2, y = n.TeX.denom2), g *= o, y *= o;
if (p === 0) v = Math.max((u ? 7 : 3) * n.TeX.rule_thickness, 2 * b), m = g - r.bbox.d - (i.bbox.h - y), m < v && (g += (v - m) / 2, y += (v - m) / 2); else {
v = Math.max((u ? 2 : 0) * b + p, p / 2 + 1.5 * b), m = g - r.bbox.d - (a + p / 2), m < v && (g += v - m), m = a - p / 2 - (i.bbox.h - y), m < v && (y += v - m);
var w = n.createBox(t);
n.createRule(w, p, 0, h + 2 * p), n.placeBox(w, 0, a - p / 2);
}
n.alignBox(r, s.numalign, g), n.alignBox(i, s.denomalign, -y);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLcanStretch: function(e) {
return !1;
},
HTMLhandleSpace: function(e) {
if (!this.texWithDelims) {
var t = (this.useMMLspacing ? 0 : n.length2em(this.texSpacing() || 0)) + .12;
e.style.paddingLeft = n.Em(t), e.style.paddingRight = n.Em(.12);
}
}
}), r.msqrt.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e);
var t = n.createStack(e), r = n.createBox(t), i = n.createBox(t), s = n.createBox(t), o = this.HTMLgetScale(), u = n.TeX.rule_thickness * o, a, f, l, c;
this.Get("displaystyle") ? a = n.TeX.x_height * o : a = u, f = Math.max(u + a / 4, 1.5 * n.TeX.min_rule_thickness / this.em);
var h = this.HTMLboxChild(0, r);
l = h.bbox.h + h.bbox.d + f + u, n.createDelimiter(s, 8730, l, o), n.MeasureSpans([ h, s ]), c = h.bbox.w;
var p = 0;
if (s.isMultiChar || n.AdjustSurd && n.imgFonts) s.bbox.w *= .95;
s.bbox.h + s.bbox.d > l && (f = (s.bbox.h + s.bbox.d - (l - u)) / 2);
var v = n.FONTDATA.DELIMITERS[n.FONTDATA.RULECHAR];
return !v || c < v.HW[0][0] * o || o < .75 ? n.createRule(i, 0, u, c) : n.createDelimiter(i, n.FONTDATA.RULECHAR, c, o), l = h.bbox.h + f + u, f = l * n.rfuzz, s.isMultiChar && (f = n.rfuzz), p = this.HTMLaddRoot(t, s, p, s.bbox.h + s.bbox.d - l, o), n.placeBox(s, p, l - s.bbox.h), n.placeBox(i, p + s.bbox.w, l - i.bbox.h + f), n.placeBox(r, p + s.bbox.w, 0), this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLaddRoot: function(e, t, n, r, i) {
return n;
}
}), r.mroot.Augment({
toHTML: r.msqrt.prototype.toHTML,
HTMLaddRoot: function(e, t, r, i, s) {
var o = n.createBox(e);
if (this.data[1]) {
var u = this.data[1].toHTML(o);
u.style.paddingRight = u.style.paddingLeft = "", n.Measured(u, o);
} else o.bbox = this.HTMLzeroBBox();
var a = this.HTMLrootHeight(t.bbox.h + t.bbox.d, s, o) - i, f = Math.min(o.bbox.w, o.bbox.rw);
return r = Math.max(f, t.offset), n.placeBox(o, r - f, a), r - t.offset;
},
HTMLrootHeight: function(e, t, n) {
return .45 * (e - .9 * t) + .6 * t + Math.max(0, n.bbox.d - .075);
}
}), r.mfenced.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e), this.data.open && this.data.open.toHTML(e), this.data[0] != null && this.data[0].toHTML(e);
for (var t = 1, n = this.data.length; t < n; t++) this.data[t] && (this.data["sep" + t] && this.data["sep" + t].toHTML(e), this.data[t].toHTML(e));
this.data.close && this.data.close.toHTML(e);
var r = this.HTMLcomputeBBox(e), i = e.bbox.h, s = e.bbox.d;
for (t = 0, n = r.length; t < n; t++) r[t].HTMLstretchV(e, i, s);
return r.length && this.HTMLcomputeBBox(e, !0), this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLcomputeBBox: function(e, t) {
var n = e.bbox = {}, r = [];
this.HTMLcheckStretchy(this.data.open, n, r, t), this.HTMLcheckStretchy(this.data[0], n, r, t);
for (var i = 1, s = this.data.length; i < s; i++) this.data[i] && (this.HTMLcheckStretchy(this.data["sep" + i], n, r, t), this.HTMLcheckStretchy(this.data[i], n, r, t));
return this.HTMLcheckStretchy(this.data.close, n, r, t), this.HTMLcleanBBox(n), r;
},
HTMLcheckStretchy: function(e, t, n, r) {
e && (!r && e.HTMLcanStretch("Vertical") && (n.push(e), e = e.CoreMO() || e), this.HTMLcombineBBoxes(e, t));
}
}), r.menclose.Augment({
toHTML: r.mbase.HTMLautoload
}), r.maction.Augment({
toHTML: r.mbase.HTMLautoload
}), r.semantics.Augment({
toHTML: function(e, t, n) {
e = this.HTMLcreateSpan(e);
if (this.data[0] != null) {
var r = this.data[0].toHTML(e);
n != null ? this.data[0].HTMLstretchV(e, t, n) : t != null && this.data[0].HTMLstretchH(e, t), e.bbox = r.bbox;
}
return this.HTMLhandleSpace(e), e;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.munderover.Augment({
toHTML: function(e, t, i) {
var s = this.getValues("displaystyle", "accent", "accentunder", "align");
if (!s.displaystyle && this.data[this.base] != null && this.data[this.base].CoreMO().Get("movablelimits")) return r.msubsup.prototype.toHTML.call(this, e);
e = this.HTMLcreateSpan(e);
var o = this.HTMLgetScale(), u = n.createStack(e), a = [], l = [], c = [], h, p, v;
for (p = 0, v = this.data.length; p < v; p++) this.data[p] != null && (h = a[p] = n.createBox(u), l[p] = this.data[p].toHTML(h), p == this.base ? (i != null ? this.data[this.base].HTMLstretchV(h, t, i) : t != null && this.data[this.base].HTMLstretchH(h, t), c[p] = i == null && t != null ? !1 : this.data[p].HTMLcanStretch("Horizontal")) : c[p] = this.data[p].HTMLcanStretch("Horizontal"));
n.MeasureSpans(l);
var m = -n.BIGDIMEN, g = m;
for (p = 0, v = this.data.length; p < v; p++) this.data[p] && (a[p].bbox.w > g && (g = a[p].bbox.w), !c[p] && g > m && (m = g));
i == null && t != null ? m = t : m == -n.BIGDIMEN && (m = g);
for (p = g = 0, v = this.data.length; p < v; p++) this.data[p] && (h = a[p], c[p] && (h.bbox = this.data[p].HTMLstretchH(h, m).bbox), h.bbox.w > g && (g = h.bbox.w));
var y = n.TeX.rule_thickness, b = n.FONTDATA.TeX_factor, w = a[this.base] || {
bbox: this.HTMLzeroBBox()
}, E, S, x, T, N, C, k, L = 0;
w.bbox.ic && (L = 1.3 * w.bbox.ic + .05);
for (p = 0, v = this.data.length; p < v; p++) if (this.data[p] != null) {
h = a[p], N = n.TeX.big_op_spacing5 * o;
var A = p != this.base && s[this.ACCENTS[p]];
A && h.bbox.w <= 1 / n.em + 1e-4 && (h.bbox.w = h.bbox.rw - h.bbox.lw, h.bbox.noclip = !0, h.bbox.lw && h.insertBefore(n.createSpace(h.parentNode, 0, 0, -h.bbox.lw), h.firstChild), n.createBlank(h, 0, 0, h.bbox.rw + .1)), C = {
left: 0,
center: (g - h.bbox.w) / 2,
right: g - h.bbox.w
}[s.align], E = C, S = 0, p == this.over ? (A ? (k = Math.max(y * o * b, 2.5 / this.em), N = 0, w.bbox.skew && (E += w.bbox.skew)) : (x = n.TeX.big_op_spacing1 * o * b, T = n.TeX.big_op_spacing3 * o * b, k = Math.max(x, T - Math.max(0, h.bbox.d))), k = Math.max(k, 1.5 / this.em), E += L / 2, S = w.bbox.h + h.bbox.d + k, h.bbox.h += N) : p == this.under && (A ? (k = 3 * y * o * b, N = 0) : (x = n.TeX.big_op_spacing2 * o * b, T = n.TeX.big_op_spacing4 * o * b, k = Math.max(x, T - h.bbox.h)), k = Math.max(k, 1.5 / this.em), E -= L / 2, S = -(w.bbox.d + h.bbox.h + k), h.bbox.d += N), n.placeBox(h, E, S);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.msubsup.Augment({
toHTML: function(e, t, r) {
e = this.HTMLcreateSpan(e);
var i = this.HTMLgetScale(), s = this.HTMLgetMu(e), o = n.createStack(e), u, a = [], f = n.createBox(o);
this.data[this.base] ? (a.push(this.data[this.base].toHTML(f)), r != null ? this.data[this.base].HTMLstretchV(f, t, r) : t != null && this.data[this.base].HTMLstretchH(f, t)) : f.bbox = this.HTMLzeroBBox();
var l = n.TeX.x_height * i, c = n.TeX.scriptspace * i * .75, h, p;
this.HTMLnotEmpty(this.data[this.sup]) && (h = n.createBox(o), a.push(this.data[this.sup].toHTML(h))), this.HTMLnotEmpty(this.data[this.sub]) && (p = n.createBox(o), a.push(this.data[this.sub].toHTML(p))), n.MeasureSpans(a), h && (h.bbox.w += c, h.bbox.rw = Math.max(h.bbox.w, h.bbox.rw)), p && (p.bbox.w += c, p.bbox.rw = Math.max(p.bbox.w, p.bbox.rw)), n.placeBox(f, 0, 0);
var v = (this.data[this.sup] || this.data[this.sub] || this).HTMLgetScale(), m = n.TeX.sup_drop * v, g = n.TeX.sub_drop * v, y = f.bbox.h - m, b = f.bbox.d + g, w = 0, E;
f.bbox.ic && (f.bbox.w -= f.bbox.ic, w = 1.3 * f.bbox.ic + .05), this.data[this.base] && (this.data[this.base].type === "mi" || this.data[this.base].type === "mo") && this.data[this.base].data.join("").length === 1 && f.bbox.scale === 1 && !this.data[this.base].Get("largeop") && (y = b = 0);
var S = this.getValues("subscriptshift", "superscriptshift");
S.subscriptshift = S.subscriptshift === "" ? 0 : n.length2em(S.subscriptshift, s), S.superscriptshift = S.superscriptshift === "" ? 0 : n.length2em(S.superscriptshift, s);
if (!h) p && (b = Math.max(b, n.TeX.sub1 * i, p.bbox.h - .8 * l, S.subscriptshift), n.placeBox(p, f.bbox.w, -b, p.bbox)); else if (!p) u = this.getValues("displaystyle", "texprimestyle"), E = n.TeX[u.displaystyle ? "sup1" : u.texprimestyle ? "sup3" : "sup2"], y = Math.max(y, E * i, h.bbox.d + .25 * l, S.superscriptshift), n.placeBox(h, f.bbox.w + w, y, h.bbox); else {
b = Math.max(b, n.TeX.sub2 * i);
var x = n.TeX.rule_thickness * i;
y - h.bbox.d - (p.bbox.h - b) < 3 * x && (b = 3 * x - y + h.bbox.d + p.bbox.h, m = .8 * l - (y - h.bbox.d), m > 0 && (y += m, b -= m)), n.placeBox(h, f.bbox.w + w, Math.max(y, S.superscriptshift)), n.placeBox(p, f.bbox.w, -Math.max(b, S.subscriptshift));
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.mmultiscripts.Augment({
toHTML: r.mbase.HTMLautoload
}), r.mtable.Augment({
toHTML: r.mbase.HTMLautoload
}), r["annotation-xml"].Augment({
toHTML: r.mbase.HTMLautoload
}), r.math.Augment({
toHTML: function(e, i) {
var s = this.Get("alttext");
s && s !== "" && i.setAttribute("aria-label", s);
var o = n.addElement(e, "nobr", {
isMathJax: !0
});
e = this.HTMLcreateSpan(o);
var u = n.createStack(e), a = n.createBox(u), l;
u.style.fontSize = o.parentNode.style.fontSize, o.parentNode.style.fontSize = "";
if (this.data[0] != null) {
n.msieColorBug && (this.background && (this.data[0].background = this.background, delete this.background), this.mathbackground && (this.data[0].mathbackground = this.mathbackground, delete this.mathbackground)), r.mbase.prototype.displayAlign = t.config.displayAlign, r.mbase.prototype.displayIndent = t.config.displayIndent;
var c = this.data[0].toHTML(a);
c.bbox.exactW = !1, l = n.Measured(c, a);
}
n.placeBox(a, 0, 0), u.style.width = Math.round(n.unEm(u.style.width) * this.em) + "px";
var h = 1 / n.em, p = n.em / n.outerEm;
n.em /= p, e.bbox.h *= p, e.bbox.d *= p, e.bbox.w *= p, e.bbox.lw *= p, e.bbox.rw *= p, l && l.bbox.width != null && (u.style.width = l.bbox.width, a.style.width = "100%"), this.HTMLhandleColor(e), l && n.createRule(e, (l.bbox.h + h) * p, (l.bbox.d + h) * p, 0);
if (!this.isMultiline && this.Get("display") === "block" && e.bbox.width == null) {
var v = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
v.indentalignfirst !== r.INDENTALIGN.INDENTALIGN && (v.indentalign = v.indentalignfirst), v.indentalign === r.INDENTALIGN.AUTO && (v.indentalign = this.displayAlign), i.style.textAlign = v.indentalign, v.indentshiftfirst !== r.INDENTSHIFT.INDENTSHIFT && (v.indentshift = v.indentshiftfirst), v.indentshift === "auto" && (v.indentshift = this.displayIndent), v.indentshift && v.indentalign !== r.INDENTALIGN.CENTER && (e.style[{
left: "marginLeft",
right: "marginRight"
}[v.indentalign]] = n.Em(n.length2em(v.indentshift)));
}
return e;
},
HTMLspanElement: r.mbase.prototype.HTMLspanElement
}), r.TeXAtom.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e);
if (this.data[0] != null) if (this.texClass === r.TEXCLASS.VCENTER) {
var t = n.createStack(e), i = n.createBox(t);
n.Measured(this.data[0].toHTML(i), i), n.placeBox(i, 0, n.TeX.axis_height - (i.bbox.h + i.bbox.d) / 2 + i.bbox.d);
} else e.bbox = this.data[0].toHTML(e).bbox;
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
}
}), MathJax.Hub.Register.StartupHook("onLoad", function() {
setTimeout(MathJax.Callback([ "loadComplete", n, "jax.js" ]), 0);
});
}), t.Register.StartupHook("End Config", function() {
t.Browser.Select({
MSIE: function(e) {
var t = document.documentMode || 0, r = e.versionAtLeast("7.0"), i = e.versionAtLeast("8.0") && t > 7, s = document.compatMode === "BackCompat";
t < 9 && (n.config.styles[".MathJax .MathJax_HitBox"]["background-color"] = "white", n.config.styles[".MathJax .MathJax_HitBox"].opacity = 0, n.config.styles[".MathJax .MathJax_HitBox"].filter = "alpha(opacity=0)"), n.Augment({
PaddingWidthBug: !0,
msieAccentBug: !0,
msieColorBug: !0,
msieColorPositionBug: !0,
msieRelativeWidthBug: s,
msieDisappearingBug: t >= 8,
msieMarginScaleBug: t < 8,
msiePaddingWidthBug: !0,
msieBorderWidthBug: s,
msieFrameSizeBug: t <= 8,
msieInlineBlockAlignBug: !i || s,
msiePlaceBoxBug: i && !s,
msieClipRectBug: !i,
msieNegativeSpaceBug: s,
cloneNodeBug: i && e.version === "8.0",
initialSkipBug: t < 8,
msieNegativeBBoxBug: t >= 8,
msieIE6: !r,
msieItalicWidthBug: !0,
FontFaceBug: !0,
msieFontCSSBug: e.isIE9,
allowWebFonts: t >= 9 ? "woff" : "eot"
});
},
Firefox: function(e) {
var r = !1;
if (e.versionAtLeast("3.5")) {
var i = String(document.location).replace(/[^\/]*$/, "");
if (document.location.protocol !== "file:" || t.config.root.match(/^https?:\/\//) || (t.config.root + "/").substr(0, i.length) === i) r = "otf";
}
n.Augment({
ffVerticalAlignBug: !0,
AccentBug: !0,
allowWebFonts: r
});
},
Safari: function(e) {
var r = e.versionAtLeast("3.0"), i = e.versionAtLeast("3.1"), s = navigator.appVersion.match(/ Safari\/\d/) && navigator.appVersion.match(/ Version\/\d/) && navigator.vendor.match(/Apple/), o = navigator.appVersion.match(/ Android (\d+)\.(\d+)/), u = i && e.isMobile && (navigator.platform.match(/iPad|iPod|iPhone/) && !e.versionAtLeast("5.0") || o != null && (o[1] < 2 || o[1] == 2 && o[2] < 2));
n.Augment({
config: {
styles: {
".MathJax img, .MathJax nobr, .MathJax a": {
"max-width": "5000em",
"max-height": "5000em"
}
}
},
rfuzz: .011,
AccentBug: !0,
AdjustSurd: !0,
negativeBBoxes: !0,
safariNegativeSpaceBug: !0,
safariVerticalAlignBug: !i,
safariTextNodeBug: !r,
forceReflow: !0,
allowWebFonts: i && !u ? "otf" : !1
}), s && n.Augment({
webFontDefault: e.isMobile ? "sans-serif" : "serif"
}), e.isPC && n.Augment({
adjustAvailableFonts: n.removeSTIXfonts,
checkWebFontsTwice: !0
});
if (u) {
var a = t.config["HTML-CSS"];
a ? (a.availableFonts = [], a.preferredFont = null) : t.config["HTML-CSS"] = {
availableFonts: [],
preferredFont: null
};
}
},
Chrome: function(e) {
n.Augment({
Em: n.Px,
unEm: n.unPx,
chromeHeightBug: !0,
cloneNodeBug: !0,
rfuzz: .011,
AccentBug: !0,
AdjustSurd: !0,
negativeBBoxes: !0,
safariNegativeSpaceBug: !0,
safariWebFontSerif: [ "" ],
forceReflow: !0,
allowWebFonts: e.versionAtLeast("4.0") ? "otf" : "svg"
});
},
Opera: function(e) {
e.isMini = navigator.appVersion.match("Opera Mini") != null, n.config.styles[".MathJax .merror"]["vertical-align"] = null, n.config.styles[".MathJax span"]["z-index"] = 0, n.Augment({
operaHeightBug: !0,
operaVerticalAlignBug: !0,
operaFontSizeBug: e.versionAtLeast("10.61"),
initialSkipBug: !0,
FontFaceBug: !0,
PaddingWidthBug: !0,
allowWebFonts: e.versionAtLeast("10.0") && !e.isMini ? "otf" : !1,
adjustAvailableFonts: n.removeSTIXfonts
});
},
Konqueror: function(e) {
n.Augment({
konquerorVerticalAlignBug: !0
});
}
});
}), MathJax.Hub.Register.StartupHook("End Cookie", function() {
t.config.menuSettings.zoom !== "None" && e.Require("[MathJax]/extensions/MathZoom.js");
});
}(MathJax.Ajax, MathJax.Hub, MathJax.OutputJax["HTML-CSS"]), function(e) {
for (var t in e.loading) /KAthJax-[0-9a-f]{32}.js$/.test(t) && e.loadComplete(t);
}(MathJax.Ajax);