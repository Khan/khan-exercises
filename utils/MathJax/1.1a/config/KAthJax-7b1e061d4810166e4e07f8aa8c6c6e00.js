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
}(MathJax.Message.Init), MathJax.Hub.Startup.onload(), MathJax.Ajax.Preloading("[MathJax]/extensions/MathZoom.js", "[MathJax]/extensions/TeX/AMSmath.js", "[MathJax]/extensions/TeX/AMSsymbols.js", "[MathJax]/extensions/TeX/noErrors.js", "[MathJax]/extensions/TeX/noUndefined.js", "[MathJax]/extensions/TeX/newcommand.js", "[MathJax]/extensions/TeX/boldsymbol.js", "[MathJax]/extensions/tex2jax.js", "[MathJax]/jax/element/mml/jax.js", "[MathJax]/jax/input/TeX/config.js", "[MathJax]/jax/input/TeX/jax.js", "[MathJax]/jax/output/HTML-CSS/config.js", "[MathJax]/jax/output/HTML-CSS/jax.js"), MathJax.Hub.Config({
"v1.0-compatible": !1
}), function(e, t, n, r, i) {
var s = "1.1", o = e.CombineConfig("MathZoom", {
delay: 400,
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
"font-family": "serif",
"font-size": "85%",
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
}
}
}), u = function(e) {
return e || (e = window.event), e && (e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1), !1;
}, a = MathJax.Extension.MathZoom = {
version: s,
settings: e.config.menuSettings,
HandleEvent: function(e, t, n) {
return e || (e = window.event), a.settings.CTRL && !e.ctrlKey ? !0 : a.settings.ALT && !e.altKey ? !0 : a.settings.CMD && !e.metaKey ? !0 : a.settings.Shift && !e.shiftKey ? !0 : a[t](e, n);
},
Click: function(e, t) {
if (this.settings.zoom === "Click") return this.Zoom(t, e);
},
DblClick: function(e, t) {
if (this.settings.zoom === "Double-Click") return this.Zoom(t, e);
},
Mouseover: function(e, t) {
if (this.settings.zoom === "Hover") return a.oldMouseOver = t.onmouseover, t.onmouseover = null, t.onmousemove = this.Mousemove, t.onmouseout = this.Mouseout, a.Timer(e, t);
},
Mouseout: function(e) {
return this.onmouseover = a.oldMouseOver, delete a.oldMouseOver, this.onmousemove = this.onmouseout = null, a.ClearTimer(), u(e);
},
Mousemove: function(e) {
return a.Timer(e || window.event, this);
},
Timer: function(e, t) {
return this.ClearTimer(), this.timer = setTimeout(MathJax.Callback([ "Zoom", this, t, {} ]), o.delay), u(e);
},
ClearTimer: function() {
this.timer && (clearTimeout(this.timer), delete this.timer);
},
Zoom: function(n, s) {
this.ClearTimer(), this.Remove();
var a = n.parentNode;
a.className === "MathJax_MathContainer" && (a = a.parentNode), a.parentNode.className === "MathJax_MathContainer" && (a = a.parentNode.parentNode);
var f = (String(a.className).match(/^MathJax_(MathML|Display)$/) ? a : n).nextSibling, l = e.getJaxFor(f), p = l.root, v = r && l.outputJax.isa(r.constructor) ? "HTMLCSS" : i && l.outputJax.isa(i.constructor) ? "MathML" : null;
if (!v) return;
var m = Math.floor(.85 * document.body.clientWidth), y = Math.floor(.85 * document.body.clientHeight), w = t.Element("span", {
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
"max-width": m + "px",
"max-height": y + "px"
}
}, [ [ "span" ] ] ] ]), E = w.lastChild, S = E.firstChild, x = w.firstChild;
n.parentNode.insertBefore(w, n);
if (this.msieZIndexBug) {
var T = t.Element("img", {
src: "about:blank",
id: "MathJax_ZoomTracker",
style: {
width: 0,
height: 0,
position: "relative"
}
});
document.body.appendChild(w), w.style.position = "absolute", w.style.zIndex = o.styles["#MathJax_ZoomOverlay"]["z-index"], w = T;
}
var N = this["Zoom" + v](p, S, n);
return this.msiePositionBug ? (this.msieIE8Bug && (S.style.position = "absolute", E.style.height = S.offsetHeight, S.style.position = "", E.offsetHeight <= y && E.offsetWidth <= m && (E.style.overflow = "visible")), this.msieWidthBug ? E.style.width = Math.min(m, N.w) : N.w > m && (E.style.width = m), E.offsetHeight > y && (E.style.Height = y + "px"), n.nextSibling ? n.parentNode.insertBefore(w, n.nextSibling) : a.appendChild(w)) : this.operaPositionBug && (E.style.width = Math.min(m, S.offsetWidth) + "px"), this.Position(E, N, v === "MathML" && a.nodeName.toLowerCase() === "div"), E.style.visibility = "", this.settings.zoom === "Hover" && (x.onmouseover = this.Remove), window.addEventListener ? addEventListener("resize", this.Resize, !1) : window.attachEvent ? attachEvent("onresize", this.Resize) : (this.onresize = window.onresize, window.onresize = this.Resize), u(s);
},
ZoomHTMLCSS: function(e, t, n) {
t.className = "MathJax", r.idPostfix = "-zoom", r.getScales(t, t), e.toHTML(t, t);
var i = e.HTMLspanElement().bbox;
r.idPostfix = "";
if (i.width && i.width !== "100%") {
var s = Math.floor(.85 * document.body.clientWidth);
t.style.width = s + "px", t.style.display = "inline-block";
var o = (e.id || "MathJax-Span-" + e.spanID) + "-zoom", u = document.getElementById(o).firstChild;
while (u && u.style.width !== i.width) u = u.nextSibling;
u && (u.style.width = "100%");
}
t.appendChild(this.topImg);
var a = this.topImg.offsetTop;
t.removeChild(this.topImg);
var f = this.msieWidthBug ? r.getW(n) * r.em : n.offsetWidth;
return {
w: i.w * r.em,
Y: -a,
W: f
};
},
ZoomMathML: function(e, t, n) {
e.toNativeMML(t, t);
var r;
t.appendChild(this.topImg), r = this.topImg.offsetTop, t.removeChild(this.topImg);
var i = (this.ffMMLwidthBug ? n.parentNode : n).offsetWidth;
return {
w: t.offsetWidth,
Y: -r,
W: i
};
},
Position: function(e, t, n) {
var r = this.Resize(), i = r.x, s = r.y, o = t.W;
this.msiePositionBug && (o = -o), n && this.ffMMLcenterBug && (o = 0);
var u = -Math.floor((e.offsetWidth - o) / 2), a = t.Y;
e.style.left = Math.max(u, 20 - i) + "px", e.style.top = Math.max(a, 20 - s) + "px";
},
Resize: function(e) {
a.onresize && a.onresize(e);
var t = 0, n = 0, r = document.getElementById("MathJax_ZoomFrame"), i = document.getElementById("MathJax_ZoomOverlay"), s = a.msieZIndexBug ? document.getElementById("MathJax_ZoomTracker") : r;
a.operaPositionBug && (r.style.border = "1px solid");
if (s.offsetParent) do t += s.offsetLeft, n += s.offsetTop; while (s = s.offsetParent);
return a.operaPositionBug && (r.style.border = ""), a.msieZIndexBug && (r.style.left = t + "px", r.style.top = n + "px"), i.style.left = -t + "px", i.style.top = -n + "px", a.msiePositionBug ? setTimeout(a.SetWH, 0) : a.SetWH(), {
x: t,
y: n
};
},
SetWH: function() {
var e = document.getElementById("MathJax_ZoomOverlay");
e.style.width = e.style.height = "1px", e.style.width = document.body.scrollWidth + "px", e.style.height = document.body.scrollHeight + "px";
},
Remove: function(e) {
var n = document.getElementById("MathJax_ZoomFrame");
if (n) {
n.parentNode.removeChild(n), n = document.getElementById("MathJax_ZoomTracker"), n && n.parentNode.removeChild(n);
if (a.operaRefreshBug) {
var r = t.addElement(document.body, "div", {
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
document.body.removeChild(r);
}
window.removeEventListener ? removeEventListener("resize", a.Resize, !1) : window.detachEvent ? detachEvent("onresize", a.Resize) : (window.onresize = a.onresize, delete a.onresize);
}
return u(e);
}
};
e.Register.StartupHook("HTML-CSS Jax Ready", function() {
r = MathJax.OutputJax["HTML-CSS"], r.Augment({
HandleEvent: a.HandleEvent
});
}), e.Register.StartupHook("NativeMML Jax Ready", function() {
i = MathJax.OutputJax.NativeMML, i.Augment({
HandleEvent: a.HandleEvent,
MSIEmouseup: function(e, t, n) {
return this.trapUp ? (delete this.trapUp, !0) : this.MSIEzoomKeys(e) ? !0 : !1;
},
MSIEclick: function(e, t, n) {
return this.trapClick ? (delete this.trapClick, !0) : this.MSIEzoomKeys(e) ? this.settings.zoom.match(/Click/) ? a.Click(e, t) === !1 : !1 : !1;
},
MSIEdblclick: function(e, t, n) {
return this.MSIEzoomKeys(e) ? a.DblClick(e, t) === !1 : !1;
},
MSIEmouseover: function(e, t, n) {
return this.settings.zoom !== "Hover" ? !1 : (a.Timer(e, t), !0);
},
MSIEmouseout: function(e, t, n) {
return this.settings.zoom !== "Hover" ? !1 : (a.ClearTimer(), !0);
},
MSIEmousemove: function(e, t, n) {
return this.settings.zoom !== "Hover" ? !1 : (a.Timer(e, t), !0);
},
MSIEzoomKeys: function(e) {
return this.settings.CTRL && !e.ctrlKey ? !1 : this.settings.CMD && !e.metaKey ? !1 : this.settings.ALT && !e.altKey ? !1 : this.settings.Shift && !e.shiftKey ? !1 : !0;
}
});
}), e.Browser.Select({
MSIE: function(e) {
var t = document.compatMode === "BackCompat", n = e.versionAtLeast("8.0") && document.documentMode > 7;
a.msiePositionBug = !0, a.msieWidthBug = !t, a.msieIE8Bug = n, a.msieZIndexBug = !n, a.msieInlineBlockAlignBug = !n || t, document.documentMode >= 9 && delete o.styles["#MathJax_Zoom"].filter;
},
Opera: function(e) {
a.operaPositionBug = !0, a.operaRefreshBug = !0;
},
Firefox: function(e) {
a.ffMMLwidthBug = !0, a.ffMMLcenterBug = !0;
}
}), a.topImg = a.msieInlineBlockAlignBug ? t.Element("img", {
style: {
width: 0,
height: 0
},
src: "about:blank"
}) : t.Element("span", {
style: {
width: 0,
height: 0,
display: "inline-block"
}
}), a.operaPositionBug && (a.topImg.style.border = "1px solid"), MathJax.Callback.Queue([ "Styles", n, o.styles ], [ "Post", e.Startup.signal, "MathZoom Ready" ], [ "loadComplete", n, "[MathJax]/extensions/MathZoom.js" ]);
}(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.OutputJax["HTML-CSS"], MathJax.OutputJax.NativeMML), MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = "1.1", t = MathJax.ElementJax.mml, n = MathJax.InputJax.TeX, r = n.Definitions, i = n.Stack.Item, s = function(e) {
return e.join("em ") + "em";
};
MathJax.Hub.Insert(r, {
macros: {
mathring: [ "Accent", "2DA" ],
nobreakspace: "Tilde",
negmedspace: [ "Spacer", t.LENGTH.NEGATIVEMEDIUMMATHSPACE ],
negthickspace: [ "Spacer", t.LENGTH.NEGATIVETHICKMATHSPACE ],
intI: [ "Macro", "\\mathchoice{\\!}{}{}{}\\!\\!\\int" ],
iiiint: [ "MultiIntegral", "\\int\\intI\\intI\\intI" ],
idotsint: [ "MultiIntegral", "\\int\\cdots\\int" ],
dddot: [ "Macro", "\\mathop{#1}\\limits^{\\textstyle \\mathord{.}\\mathord{.}\\mathord{.}}", 1 ],
ddddot: [ "Macro", "\\mathop{#1}\\limits^{\\textstyle \\mathord{.}\\mathord{.}\\mathord{.}\\mathord{.}}", 1 ],
sideset: [ "Macro", "\\mathop{\\mathop{\\rlap{\\phantom{#3}}}\\nolimits#1\\!\\mathop{#3}\\nolimits#2}", 3 ],
boxed: [ "Macro", "\\fbox{$\\displaystyle{#1}$}", 1 ],
tag: "HandleTag",
notag: "HandleNoTag",
substack: [ "Macro", "\\begin{subarray}{c}#1\\end{subarray}", 1 ],
injlim: [ "Macro", "\\mathop{\\rm inj\\,lim}" ],
projlim: [ "Macro", "\\mathop{\\rm proj\\,lim}" ],
varliminf: [ "Macro", "\\mathop{\\underline{\\rm lim}}" ],
varlimsup: [ "Macro", "\\mathop{\\overline{\\rm lim}}" ],
varinjlim: [ "Macro", "\\mathop{\\underrightarrow{\\rm lim\\Rule{-1pt}{0pt}{1pt}}\\Rule{0pt}{0pt}{.45em}}" ],
varprojlim: [ "Macro", "\\mathop{\\underleftarrow{\\rm lim\\Rule{-1pt}{0pt}{1pt}}\\Rule{0pt}{0pt}{.45em}}" ],
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
shoveleft: [ "HandleShove", t.ALIGN.LEFT ],
shoveright: [ "HandleShove", t.ALIGN.RIGHT ],
xrightarrow: [ "xArrow", 8594, 5, 6 ],
xleftarrow: [ "xArrow", 8592, 7, 3 ]
},
environment: {
align: [ "AMSarray", null, !0, !0, "rlrlrlrlrlrl", s([ 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18 ]) ],
"align*": [ "AMSarray", null, !1, !0, "rlrlrlrlrlrl", s([ 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18 ]) ],
multline: [ "Multline", null, !0 ],
"multline*": [ "Multline", null, !1 ],
split: [ "AMSarray", null, !1, !1, "rl", s([ 5 / 18 ]) ],
gather: [ "AMSarray", null, !0, !0, "c" ],
"gather*": [ "AMSarray", null, !1, !0, "c" ],
alignat: [ "AlignAt", null, !0, !0 ],
"alignat*": [ "AlignAt", null, !1, !0 ],
alignedat: [ "AlignAt", null, !1, !1 ],
aligned: [ "Array", null, null, null, "rlrlrlrlrlrl", s([ 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18, 2, 5 / 18 ]), ".5em", "D" ],
gathered: [ "Array", null, null, null, "c", null, ".5em", "D" ],
subarray: [ "Array", null, null, null, null, s([ 0, 0, 0, 0 ]), "0.1em", "S", 1 ],
smallmatrix: [ "Array", null, null, null, "c", s([ 1 / 3 ]), ".2em", "S", 1 ]
},
delimiter: {
"\\lvert": [ "2223", {
texClass: t.TEXCLASS.OPEN
} ],
"\\rvert": [ "2223", {
texClass: t.TEXCLASS.CLOSE
} ],
"\\lVert": [ "2225", {
texClass: t.TEXCLASS.OPEN
} ],
"\\rVert": [ "2225", {
texClass: t.TEXCLASS.CLOSE
} ]
}
}), n.Parse.Augment({
HandleTag: function(e) {
var r = this.trimSpaces(this.GetArgument(e));
r === "*" ? r = this.GetArgument(e) : r = "(" + r + ")", this.stack.global.notag && n.Error(e + " not allowed in " + this.stack.global.notag + " environment"), this.stack.global.tag && n.Error("Multiple " + e), this.stack.global.tag = t.mtd.apply(t, this.InternalMath(r));
},
HandleNoTag: function(e) {
this.stack.global.tag && delete this.stack.global.tag;
},
HandleDeclareOp: function(e) {
var t = "", r = this.trimSpaces(this.GetArgument(e));
r == "*" && (t = "\\limits", r = this.trimSpaces(this.GetArgument(e))), r.charAt(0) == "\\" && (r = r.substr(1));
var i = this.GetArgument(e);
i = i.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}"), n.Definitions.macros[r] = [ "Macro", "\\mathop{\\rm " + i + "}" + t ];
},
HandleOperatorName: function(e) {
var t = "\\nolimits", n = this.trimSpaces(this.GetArgument(e));
n == "*" && (t = "\\limits", n = this.trimSpaces(this.GetArgument(e))), n = n.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}"), this.string = "\\mathop{\\rm " + n + "}" + t + " " + this.string.slice(this.i), this.i = 0;
},
HandleShove: function(e, t) {
var r = this.stack.Top();
(r.type !== "multline" || r.data.length) && n.Error(e + " must come at the beginning of the line"), r.data.shove = t;
},
CFrac: function(e) {
var r = this.trimSpaces(this.GetBrackets(e)), i = this.GetArgument(e), s = this.GetArgument(e), o = t.mfrac(n.Parse("\\strut\\textstyle{" + i + "}", this.stack.env).mml(), n.Parse("\\strut\\textstyle{" + s + "}", this.stack.env).mml());
r = {
l: t.ALIGN.LEFT,
r: t.ALIGN.RIGHT,
"": ""
}[r], r == null && n.Error("Illegal alignment specified in " + e), r && (o.numalign = o.denomalign = r), this.Push(o);
},
Genfrac: function(e, r, i, s, o) {
r == null ? r = this.GetDelimiterArg(e) : r = this.convertDelimiter(r), i == null ? i = this.GetDelimiterArg(e) : i = this.convertDelimiter(i), s == null && (s = this.GetArgument(e)), o == null && (o = this.trimSpaces(this.GetArgument(e)));
var u = this.ParseArg(e), l = this.ParseArg(e), c = t.mfrac(u, l);
s !== "" && (c.linethickness = s);
if (r || i) c = t.mfenced(c).With({
open: r,
close: i
});
if (o !== "") {
var h = [ "D", "T", "S", "SS" ][o];
h == null && n.Error("Bad math style for " + e), c = t.mstyle(c), h === "D" ? (c.displaystyle = !0, c.scriptlevel = 0) : (c.displaystyle = !1, c.scriptlevel = o - 1);
}
this.Push(c);
},
Multline: function(e, t) {
return this.Push(e), i.multline().With({
arraydef: {
displaystyle: !0,
rowspacing: ".5em",
width: n.config.MultLineWidth,
columnwidth: "100%",
side: n.config.TagSide,
minlabelspacing: n.config.TagIndent
}
});
},
AMSarray: function(e, t, r, s, o) {
return this.Push(e), s = s.replace(/[^clr]/g, "").split("").join(" "), s = s.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center"), i.AMSarray(e.name, t, r, this.stack).With({
arraydef: {
displaystyle: !0,
rowspacing: ".5em",
columnalign: s,
columnspacing: o || "1em",
rowspacing: "3pt",
side: n.config.TagSide,
minlabelspacing: n.config.TagIndent
}
});
},
AlignAt: function(e, t, r) {
var i = this.GetArgument("\\begin{" + e.name + "}");
i.match(/[^0-9]/) && n.Error("Argument to \\begin{" + e.name + "} must me a positive integer"), align = "", spacing = [];
while (i > 0) align += "rl", spacing.push("0em 0em"), i--;
return spacing = spacing.join(" "), r ? this.AMSarray(e, t, r, align, spacing) : this.Array(e, null, null, align, spacing, ".5em", "D");
},
MultiIntegral: function(e, t) {
var n = this.GetNext();
if (n === "\\") {
var r = this.i;
n = this.GetArgument(e), this.i = r, n === "\\limits" && (e === "\\idotsint" ? t = "\\!\\!\\mathop{\\,\\," + t + "}" : t = "\\!\\!\\!\\mathop{\\,\\,\\," + t + "}");
}
this.string = t + " " + this.string.slice(this.i), this.i = 0;
},
xArrow: function(e, r, i, s) {
var o = {
width: "+" + (i + s) + "mu",
lspace: i + "mu"
}, u = this.GetBrackets(e), l = this.ParseArg(e), c = t.mo(t.chars(String.fromCharCode(r))).With({
stretchy: !0,
texClass: t.TEXCLASS.REL
}), h = t.munderover(c);
h.SetData(h.over, t.mpadded(l).With(o).With({
voffset: ".15em"
})), u && (u = n.Parse(u, this.stack.env).mml(), h.SetData(h.under, t.mpadded(u).With(o).With({
voffset: "-.24em"
}))), this.Push(h);
},
GetDelimiterArg: function(e) {
var t = this.trimSpaces(this.GetArgument(e));
return t == "" ? null : (r.delimiter[t] || n.Error("Missing or unrecognized delimiter for " + e), this.convertDelimiter(t));
}
}), i.multline = i.array.Subclass({
type: "multline",
EndEntry: function() {
var e = t.mtd.apply(t, this.data);
this.data.shove && (e.columnalign = this.data.shove), this.row.push(e), this.data = [];
},
EndRow: function() {
this.row.length != 1 && n.Error("multline rows must have exactly one column"), this.table.push(this.row), this.row = [];
},
EndTable: function() {
this.SUPER(arguments).EndTable.call(this);
if (this.table.length) {
var e = this.table.length - 1, n;
this.table[0][0].columnalign || (this.table[0][0].columnalign = t.ALIGN.LEFT), this.table[e][0].columnalign || (this.table[e][0].columnalign = t.ALIGN.RIGHT);
var r = t.mtr;
this.global.tag && (this.table[0] = [ this.global.tag ].concat(this.table[0]), delete this.global.tag, r = t.mlabeledtr), this.table[0] = r.apply(t, this.table[0]);
for (n = 1, e = this.table.length; n < e; n++) this.table[n] = t.mtr.apply(t, this.table[n]);
}
}
}), i.AMSarray = i.array.Subclass({
type: "AMSarray",
Init: function(e, t, n, r) {
this.SUPER(arguments).Init.apply(this), this.numbered = t, this.save_notag = r.global.notag, r.global.notag = n ? null : e;
},
EndRow: function() {
var e = t.mtr;
this.global.tag && (this.row = [ this.global.tag ].concat(this.row), e = t.mlabeledtr, delete this.global.tag), this.table.push(e.apply(t, this.row)), this.row = [];
},
EndTable: function() {
this.SUPER(arguments).EndTable.call(this), this.global.notag = this.save_notag;
}
}), i.start.Augment({
oldCheckItem: i.start.prototype.checkItem,
checkItem: function(e) {
if (e.type === "stop") {
var r = this.mmlData();
if (this.global.tag) {
var s = [ this.global.tag, t.mtd(r) ];
delete this.global.tag;
var o = {
side: n.config.TagSide,
minlabelspacing: n.config.TagIndent,
columnalign: r.displayAlign
};
r.displayAlign === t.INDENTALIGN.LEFT ? (o.width = "100%", r.displayIndent && !String(r.displayIndent).match(/^0+(\.0*)?($|[a-z%])/) && (o.columnwidth = r.displayIndent + " fit", o.columnspacing = "0", s = [ s[0], t.mtd(), s[1] ])) : r.displayAlign === t.INDENTALIGN.RIGHT && (o.width = "100%", r.displayIndent && !String(r.displayIndent).match(/^0+(\.0*)?($|[a-z%])/) && (o.columnwidth = "fit " + r.displayIndent, o.columnspacing = "0", s[2] = t.mtd())), r = t.mtable(t.mlabeledtr.apply(t, s)).With(o);
}
return i.mml(r);
}
return this.SUPER(arguments).checkItem.call(this, e);
}
}), MathJax.Hub.Startup.signal.Post("TeX AMSmath Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSmath.js"), MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = "1.1.2", t = MathJax.ElementJax.mml;
MathJax.Hub.Insert(MathJax.InputJax.TeX.Definitions, {
mathchar0mi: {
digamma: "03DD",
varkappa: "03F0",
varGamma: [ "0393", {
mathvariant: t.VARIANT.ITALIC
} ],
varDelta: [ "0394", {
mathvariant: t.VARIANT.ITALIC
} ],
varTheta: [ "0398", {
mathvariant: t.VARIANT.ITALIC
} ],
varLambda: [ "039B", {
mathvariant: t.VARIANT.ITALIC
} ],
varXi: [ "039E", {
mathvariant: t.VARIANT.ITALIC
} ],
varPi: [ "03A0", {
mathvariant: t.VARIANT.ITALIC
} ],
varSigma: [ "03A3", {
mathvariant: t.VARIANT.ITALIC
} ],
varUpsilon: [ "03A5", {
mathvariant: t.VARIANT.ITALIC
} ],
varPhi: [ "03A6", {
mathvariant: t.VARIANT.ITALIC
} ],
varPsi: [ "03A8", {
mathvariant: t.VARIANT.ITALIC
} ],
varOmega: [ "03A9", {
mathvariant: t.VARIANT.ITALIC
} ],
beth: "2136",
gimel: "2137",
daleth: "2138",
backprime: [ "2035", {
variantForm: !0
} ],
hslash: [ "210F", {
variantForm: !0
} ],
varnothing: [ "2205", {
variantForm: !0
} ],
blacktriangle: "25B2",
triangledown: "25BD",
blacktriangledown: "25BC",
square: "25A1",
Box: "25A1",
blacksquare: "25A0",
lozenge: "25CA",
Diamond: "25CA",
blacklozenge: "29EB",
circledS: [ "24C8", {
mathvariant: t.VARIANT.NORMAL
} ],
bigstar: "2605",
sphericalangle: "2222",
measuredangle: "2221",
nexists: "2204",
complement: "2201",
mho: "2127",
eth: [ "00F0", {
mathvariant: t.VARIANT.NORMAL
} ],
Finv: "2132",
diagup: "2571",
Game: "2141",
diagdown: "2572",
Bbbk: [ "006B", {
mathvariant: t.VARIANT.DOUBLESTRUCK
} ],
yen: "00A5",
circledR: "00AE",
checkmark: "2713",
maltese: "2720"
},
mathchar0mo: {
dotplus: "2214",
ltimes: "22C9",
smallsetminus: [ "2216", {
variantForm: !0
} ],
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
thickapprox: "2248",
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
blacktriangleleft: "25C0",
blacktriangleright: "25B6",
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
"\\ulcorner": "250C",
"\\urcorner": "2510",
"\\llcorner": "2514",
"\\lrcorner": "2518"
},
macros: {
implies: [ "Macro", "\\;\\Longrightarrow\\;" ],
impliedby: [ "Macro", "\\;\\Longleftarrow\\;" ]
}
});
var n = t.mo.OPTYPES.REL;
MathJax.Hub.Insert(t.mo.prototype, {
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
});
}), MathJax.Hub.Register.StartupHook("HTML-CSS Jax Ready", function() {
var e = MathJax.OutputJax["HTML-CSS"], t = e.FONTDATA.VARIANT;
e.fontInUse === "TeX" && (t["-TeX-variant"] = {
fonts: [ "MathJax_AMS", "MathJax_Main", "MathJax_Size1" ],
remap: {
8808: 57356,
8809: 57357,
8816: 57361,
8817: 57358,
10887: 57360,
10888: 57359,
8740: 57350,
8742: 57351,
8840: 57366,
8841: 57368,
8842: 57370,
8843: 57371,
10955: 57367,
10956: 57369,
988: 57352,
1008: 57353
}
}, e.msieIE6 && MathJax.Hub.Insert(t["-TeX-variant"].remap, {
8592: [ 58049, "-WinIE6" ],
8594: [ 58048, "-WinIE6" ],
8739: [ 58050, "-WinIE6" ],
8741: [ 58051, "-WinIE6" ],
8764: [ 58052, "-WinIE6" ],
9651: [ 58067, "-WinIE6" ]
})), e.fontInUse === "STIX" && MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = MathJax.InputJax.TeX.Definitions;
e.mathchar0mi.varnothing = "2205", e.mathchar0mi.hslash = "210F", e.mathchar0mi.blacktriangle = "25B4", e.mathchar0mi.blacktriangledown = "25BE", e.mathchar0mi.square = "25FB", e.mathchar0mi.blacksquare = "25FC", e.mathchar0mi.vartriangle = [ "25B3", {
mathsize: "71%"
} ], e.mathchar0mi.triangledown = [ "25BD", {
mathsize: "71%"
} ], e.mathchar0mo.blacktriangleleft = "25C2", e.mathchar0mo.blacktriangleright = "25B8", e.mathchar0mo.smallsetminus = "2216", MathJax.Hub.Insert(t["-STIX-variant"], {
remap: {
10887: 57360,
10888: 57359,
8816: 57361,
8817: 57358,
8928: 57419,
8929: 57423,
8840: 57366,
8841: 57368
}
});
}), MathJax.Hub.Startup.signal.Post("TeX AMSsymbols Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSsymbols.js"), function() {
var e = "1.1", t = MathJax.Hub.CombineConfig("TeX.noErrors", {
multiLine: !0,
inlineDelimiters: [ "", "" ],
style: {
"font-family": "serif",
"font-size": "80%",
"text-align": "left",
color: "black",
padding: "1px 3px",
border: "1px solid"
}
}), n = "\u00a0";
MathJax.Extension["TeX/noErrors"] = {
version: e,
config: t
}, MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
MathJax.InputJax.TeX.Augment({
formatError: function(e, r, i, s) {
var o = t.inlineDelimiters, u = i || t.multiLine;
return i || (r = o[0] + r + o[1]), u ? r = r.replace(/ /g, n) : r = r.replace(/\n/g, " "), MathJax.ElementJax.mml.merror(r).With({
isError: !0,
multiLine: u
});
}
});
}), MathJax.Hub.Register.StartupHook("HTML-CSS Jax Config", function() {
MathJax.Hub.Config({
"HTML-CSS": {
styles: {
".MathJax .merror": MathJax.Hub.Insert({
"font-style": null,
"background-color": null,
"vertical-align": MathJax.Hub.Browser.isMSIE && t.multiLine ? "-2px" : ""
}, t.style)
}
}
});
});
}(), MathJax.Hub.Register.StartupHook("HTML-CSS Jax Ready", function() {
var e = MathJax.ElementJax.mml, t = MathJax.OutputJax["HTML-CSS"], n = e.math.prototype.toHTML;
e.math.Augment({
toHTML: function(e, t) {
return this.data[0] && this.data[0].data[0] && this.data[0].data[0].isError ? this.data[0].data[0].toHTML(e) : n.call(this, e, t);
}
}), e.merror.Augment({
toHTML: function(n) {
if (!this.isError) return e.mbase.prototype.toHTML.call(this, n);
n = this.HTMLcreateSpan(n), this.multiLine && (n.style.display = "inline-block");
var r = this.data[0].data[0].data.join("").split(/\n/);
for (var i = 0, s = r.length; i < s; i++) t.addText(n, r[i]), i !== s - 1 && t.addElement(n, "br");
var o = t.getHD(n.parentNode), u = t.getW(n.parentNode);
if (s > 1) {
var f = (o.h + o.d) / 2, l = t.TeX.x_height / 2, c = t.config.styles[".MathJax .merror"]["font-size"];
c && c.match(/%/) && (l *= parseInt(c) / 100), n.parentNode.style.verticalAlign = t.Em(o.d + (l - f)), o.h = l + f, o.d = f - l;
}
return n.bbox = {
h: o.h,
d: o.d,
w: u,
lw: 0,
rw: u
}, n;
}
}), MathJax.Hub.Startup.signal.Post("TeX noErrors Ready");
}), MathJax.Hub.Register.StartupHook("NativeMML Jax Ready", function() {
var e = MathJax.ElementJax.mml, t = MathJax.Extension["TeX/noErrors"].config, n = e.math.prototype.toNativeMML;
e.math.Augment({
toNativeMML: function(e) {
return this.data[0] && this.data[0].data[0] && this.data[0].data[0].isError ? this.data[0].data[0].toNativeMML(e) : n.call(this, e);
}
}), e.merror.Augment({
toNativeMML: function(n) {
if (!this.isError) return e.mbase.prototype.toNativeMML.call(this, n);
n = n.appendChild(document.createElement("span"));
var r = this.data[0].data[0].data.join("").split(/\n/);
for (var i = 0, s = r.length; i < s; i++) n.appendChild(document.createTextNode(r[i])), i !== s - 1 && n.appendChild(document.createElement("br"));
this.multiLine && (n.style.display = "inline-block", s > 1 && (n.style.verticalAlign = "middle"));
for (var o in t.style) if (t.style.hasOwnProperty(o)) {
var u = o.replace(/-./g, function(e) {
return e.charAt(1).toUpperCase();
});
n.style[u] = t.style[o];
}
return n;
}
}), MathJax.Hub.Startup.signal.Post("TeX noErrors Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noErrors.js"), MathJax.Extension["TeX/noUndefined"] = {
version: "1.1",
config: MathJax.Hub.CombineConfig("TeX.noUndefined", {
attributes: {
mathcolor: "red"
}
})
}, MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = MathJax.Extension["TeX/noUndefined"].config, t = MathJax.ElementJax.mml;
MathJax.InputJax.TeX.Parse.Augment({
csUndefined: function(n) {
this.Push(t.mtext(n).With(e.attributes));
}
}), MathJax.Hub.Startup.signal.Post("TeX noUndefined Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noUndefined.js"), MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = "1.1", t = MathJax.InputJax.TeX, n = t.Definitions;
MathJax.Hub.Insert(n, {
macros: {
newcommand: "NewCommand",
renewcommand: "NewCommand",
newenvironment: "NewEnvironment",
def: "MacroDef"
}
}), t.Parse.Augment({
NewCommand: function(e) {
var r = this.trimSpaces(this.GetArgument(e)), i = this.trimSpaces(this.GetBrackets(e)), s = this.GetArgument(e);
i === "" && (i = null), r.charAt(0) === "\\" && (r = r.substr(1)), r.match(/^(.|[a-z]+)$/i) || t.Error("Illegal control sequence name for " + e), i != null && !i.match(/^[0-9]+$/) && t.Error("Illegal number of parameters specified in " + e), n.macros[r] = [ "Macro", s, i ];
},
NewEnvironment: function(e) {
var r = this.trimSpaces(this.GetArgument(e)), i = this.trimSpaces(this.GetBrackets(e)), s = this.GetArgument(e), o = this.GetArgument(e);
i === "" && (i = null), i != null && !i.match(/^[0-9]+$/) && t.Error("Illegal number of parameters specified in " + e), n.environment[r] = [ "BeginEnv", "EndEnv", s, o, i ];
},
MacroDef: function(e) {
var t = this.GetCSname(e), r = this.GetTemplate(e, "\\" + t), i = this.GetArgument(e);
r instanceof Array ? n.macros[t] = [ "MacroWithTemplate", i, r[0], r[1] ] : n.macros[t] = [ "Macro", i, r ];
},
GetCSname: function(e) {
var n = this.GetNext();
n !== "\\" && t.Error("\\ must be followed by a control sequence");
var r = this.trimSpaces(this.GetArgument(e));
return r.substr(1);
},
GetTemplate: function(e, n) {
var r, i = [], s = 0;
r = this.GetNext();
var o = this.i;
while (this.i < this.string.length) {
r = this.GetNext();
if (r === "#") o !== this.i && (i[s] = this.string.substr(o, this.i - o)), r = this.string.charAt(++this.i), r.match(/^[1-9]$/) || t.Error("Illegal use of # in template for " + n), parseInt(r) != ++s && t.Error("Parameters for " + n + " must be numbered sequentially"), o = this.i + 1; else if (r === "{") return o !== this.i && (i[s] = this.string.substr(o, this.i - o)), i.length > 0 ? [ s, i ] : s;
this.i++;
}
t.Error("Missing replacement string for definition of " + e);
},
MacroWithTemplate: function(e, n, r, i) {
if (r) {
var s = [];
this.GetNext(), i[0] && !this.MatchParam(i[0]) && t.Error("Use of " + e + " doesn't match its definition");
for (var o = 0; o < r; o++) s.push(this.GetParameter(e, i[o + 1]));
n = this.SubstituteArgs(s, n);
}
this.string = this.AddArgs(n, this.string.slice(this.i)), this.i = 0, ++this.macroCount > t.config.MAXMACROS && t.Error("MathJax maximum macro substitution count exceeded; is there a recursive macro call?");
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
GetParameter: function(e, n) {
if (n == null) return this.GetArgument(e);
var r = this.i, i = 0, s = 0;
while (this.i < this.string.length) if (this.string.charAt(this.i) === "{") this.i === r && (s = 1), this.GetArgument(e), i = this.i - r; else {
if (this.MatchParam(n)) return s && (r++, i -= 2), this.string.substr(r, i);
this.i++, i++, s = 0;
}
t.Error("Runaway argument for " + e + "?");
},
MatchParam: function(e) {
return this.string.substr(this.i, e.length) !== e ? 0 : (this.i += e.length, 1);
}
}), t.Environment = function(e) {
n.environment[e] = [ "BeginEnv", "EndEnv" ].concat([].slice.call(arguments, 1));
}, MathJax.Hub.Startup.signal.Post("TeX newcommand Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/newcommand.js"), MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
var e = "1.1", t = MathJax.ElementJax.mml, n = MathJax.InputJax.TeX, r = n.Definitions, i = {};
i[t.VARIANT.NORMAL] = t.VARIANT.BOLD, i[t.VARIANT.ITALIC] = t.VARIANT.BOLDITALIC, i[t.VARIANT.FRAKTUR] = t.VARIANT.BOLDFRAKTUR, i[t.VARIANT.SCRIPT] = t.VARIANT.BOLDSCRIPT, i[t.VARIANT.SANSSERIF] = t.VARIANT.BOLDSANSSERIF, i["-tex-caligraphic"] = "-tex-caligraphic-bold", i["-tex-oldstyle"] = "-tex-oldstyle-bold", r.macros.boldsymbol = "Boldsymbol", n.Parse.Augment({
mmlToken: function(e) {
if (this.stack.env.boldsymbol) {
var n = e.Get("mathvariant");
n == null ? e.mathvariant = t.VARIANT.BOLD : e.mathvariant = i[n] || n;
}
return e;
},
Boldsymbol: function(e) {
var t = this.stack.env.boldsymbol, n = this.stack.env.font;
this.stack.env.boldsymbol = !0, this.stack.env.font = null;
var r = this.ParseArg(e);
this.stack.env.font = n, this.stack.env.boldsymbol = t, this.Push(r);
}
});
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
}), MathJax.Hub.Startup.signal.Post("TeX boldsymbol Ready");
}), MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/boldsymbol.js"), MathJax.Extension.tex2jax = {
version: "1.1.3",
config: {
inlineMath: [ [ "\\(", "\\)" ] ],
displayMath: [ [ "$$", "$$" ], [ "\\[", "\\]" ] ],
skipTags: [ "script", "noscript", "style", "textarea", "pre", "code" ],
ignoreClass: "tex2jax_ignore",
processClass: "tex2jax_process",
processEscapes: !1,
processEnvironments: !0,
preview: "TeX"
},
PreProcess: function(e) {
this.configured || (this.config = MathJax.Hub.CombineConfig("tex2jax", this.config), this.config.Augment && MathJax.Hub.Insert(this, this.config.Augment), typeof this.config.previewTeX != "undefined" && !this.config.previewTeX && (this.config.preview = "none"), this.configured = !0), typeof e == "string" && (e = document.getElementById(e)), e || (e = document.body), this.createPatterns(), this.scanElement(e, e.nextSibling);
},
createPatterns: function() {
var e = [], t, n, r = this.config;
this.match = {};
for (t = 0, n = r.inlineMath.length; t < n; t++) e.push(this.patternQuote(r.inlineMath[t][0])), this.match[r.inlineMath[t][0]] = {
mode: "",
end: r.inlineMath[t][1],
pattern: this.endPattern(r.inlineMath[t][1])
};
for (t = 0, n = r.displayMath.length; t < n; t++) e.push(this.patternQuote(r.displayMath[t][0])), this.match[r.displayMath[t][0]] = {
mode: "; mode=display",
end: r.displayMath[t][1],
pattern: this.endPattern(r.displayMath[t][1])
};
this.start = new RegExp(e.sort(this.sortLength).join("|") + (r.processEnvironments ? "|\\\\begin\\{([^}]*)\\}" : "") + (r.processEscapes ? "|\\\\*\\\\\\$" : ""), "g"), this.skipTags = new RegExp("^(" + r.skipTags.join("|") + ")$", "i"), this.ignoreClass = new RegExp("(^| )(" + r.ignoreClass + ")( |$)"), this.processClass = new RegExp("(^| )(" + r.processClass + ")( |$)");
},
patternQuote: function(e) {
return e.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, "\\$1");
},
endPattern: function(e) {
return new RegExp(this.patternQuote(e) + "|\\\\.", "g");
},
sortLength: function(e, t) {
return e.length !== t.length ? t.length - e.length : e == t ? 0 : e < t ? -1 : 1;
},
scanElement: function(e, t, n) {
var r, i, s;
while (e && e != t) e.nodeName.toLowerCase() === "#text" ? n || (e = this.scanText(e)) : (r = typeof e.className == "undefined" ? "" : e.className, i = typeof e.tagName == "undefined" ? "" : e.tagName, typeof r != "string" && (r = String(r)), e.firstChild && !r.match(/(^| )MathJax/) && !this.skipTags.exec(i) && (s = (n || this.ignoreClass.exec(r)) && !this.processClass.exec(r), this.scanElement(e.firstChild, t, s))), e && (e = e.nextSibling);
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
if (!e || e.nodeName !== "#text") return n;
}
}
return e;
},
startMatch: function(e, t) {
var n = this.match[e[0]];
if (n != null) this.search = {
end: n.end,
mode: n.mode,
open: t,
olen: e[0].length,
opos: this.pattern.lastIndex - e[0].length
}, this.switchPattern(n.pattern); else if (e[0].substr(0, 6) === "\\begin") this.search = {
end: "\\end{" + e[1] + "}",
mode: "; mode=display",
open: t,
olen: 0,
opos: this.pattern.lastIndex - e[0].length,
isBeginEnd: !0
}, this.switchPattern(this.endPattern(this.search.end)); else {
var r = e[0].substr(0, e[0].length - 1), i, s;
r.length % 2 === 0 ? (s = [ r.replace(/\\\\/g, "\\") ], i = 1) : (s = [ r.substr(1).replace(/\\\\/g, "\\"), "$" ], i = 0), s = MathJax.HTML.Element("span", null, s);
var o = MathJax.HTML.TextNode(t.nodeValue.substr(0, e.index));
t.nodeValue = t.nodeValue.substr(e.index + e[0].length - i), t.parentNode.insertBefore(s, t), t.parentNode.insertBefore(o, s), this.pattern.lastIndex = i;
}
return t;
},
endMatch: function(e, t) {
return e[0] == this.search.end && (this.search.close = t, this.search.cpos = this.pattern.lastIndex, this.search.clen = this.search.isBeginEnd ? 0 : e[0].length, this.search.matched = !0, t = this.encloseMath(t), this.switchPattern(this.start)), t;
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
this.config.preview === "TeX" ? n = [ this.filterTeX(t) ] : this.config.preview instanceof Array && (n = this.config.preview), n && (n = MathJax.HTML.Element("span", {
className: MathJax.Hub.config.preRemoveClass
}, n), this.insertNode(n));
},
createMathTag: function(e, t) {
var n = document.createElement("script");
return n.type = "math/tex" + e, MathJax.HTML.setScript(n, t), this.insertNode(n), n;
},
filterTeX: function(e) {
return e;
},
msieNewlineBug: MathJax.Hub.Browser.isMSIE && document.documentMode < 9
}, MathJax.Hub.Register.PreProcessor([ "PreProcess", MathJax.Extension.tex2jax ]), MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js"), MathJax.ElementJax.mml = MathJax.ElementJax({
mimeType: "jax/mml"
}, {
id: "mml",
version: "1.1.1",
directory: MathJax.ElementJax.directory + "/mml",
extensionDir: MathJax.ElementJax.extensionDir + "/mml",
optableDir: MathJax.ElementJax.directory + "/mml/optable"
}), MathJax.ElementJax.mml.Augment({
Init: function() {
arguments.length === 1 && arguments[0].type === "math" ? this.root = arguments[0] : this.root = MathJax.ElementJax.mml.math.apply(this, arguments), this.root.mode && (!this.root.display && this.root.mode === "display" && (this.root.display = "block"), delete this.root.mode);
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
PLANE1: String.fromCharCode(55349)
}), function(e) {
var t = !1, n = !0;
e.mbase = MathJax.Object.Subclass({
type: "base",
isToken: t,
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT
},
noInherit: {},
Init: function() {
this.data = [], this.inferRow && (arguments.length !== 1 || !arguments[0].inferred) && this.Append(e.mrow().With({
inferred: n
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
if (typeof this[t] != "undefined") return this[t];
var r = this.Parent();
if (r && r["adjustChild_" + t] != null) return r["adjustChild_" + t](r.childPosition(this));
var i = this.inherit, s = i;
while (i) {
if (typeof i[t] != "undefined") {
var o = i.noInherit[this.type];
if (!o || !o[t]) return i[t];
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
return t;
},
isEmbellished: function() {
return t;
},
Core: function() {
return this;
},
CoreMO: function() {
return this;
},
lineBreak: function() {
return this.isEmbellished() ? this.CoreMO().lineBreak() : "none";
},
array: function() {
return this.inferred ? this.data : [ this ];
},
toString: function() {
return this.type + "(" + this.data.join(",") + ")";
}
}, {
childrenSpacelike: function() {
for (var e = 0; e < this.data.length; e++) if (!this.data[e].isSpacelike()) return t;
return n;
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
setBaseTeXclasses: function(e) {
this.getPrevClass(e), this.texClass = null, this.isEmbellished() ? (e = this.data[0].setTeXclass(e), this.updateTeXclass(this.Core())) : (this.data[0] && this.data[0].setTeXclass(), e = this);
for (var t = 1, n = this.data.length; t < n; t++) this.data[t] && this.data[t].setTeXclass();
return e;
},
setSeparateTeXclasses: function(e) {
this.getPrevClass(e);
for (var t = 0, n = this.data.length; t < n; t++) this.data[t] && this.data[t].setTeXclass();
return this.isEmbellished() && this.updateTeXclass(this.Core()), this;
}
}), e.mi = e.mbase.Subclass({
type: "mi",
isToken: n,
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
return n.length === 1 || n.length === 2 && n.charCodeAt(0) === this.PLANE1 ? e.VARIANT.ITALIC : e.VARIANT.NORMAL;
}
return "";
}
}), e.mn = e.mbase.Subclass({
type: "mn",
isToken: n,
texClass: e.TEXCLASS.ORD,
defaults: {
mathvariant: e.INHERIT,
mathsize: e.INHERIT,
mathbackground: e.INHERIT,
mathcolor: e.INHERIT
}
}), e.mo = e.mbase.Subclass({
type: "mo",
isToken: n,
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
fence: t,
separator: t,
lspace: e.LENGTH.THICKMATHSPACE,
rspace: e.LENGTH.THICKMATHSPACE,
stretchy: t,
symmetric: n,
maxsize: e.SIZE.INFINITY,
minsize: "0em",
largeop: t,
movablelimits: t,
accent: t,
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
t.charAt(0) === e.PLANE1 && (n = t.charCodeAt(1) + 119808 - 56320);
for (var r = 0, i = this.RANGES.length; r < i && this.RANGES[r][0] <= n; r++) if (n <= this.RANGES[r][1]) {
if (this.RANGES[r][3]) {
var s = e.optableDir + "/" + this.RANGES[r][3] + ".js";
this.RANGES[r][3] = null, MathJax.Hub.RestartAfter(MathJax.Ajax.Require(s));
}
var o = [ "ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER" ][this.RANGES[r][2]];
return o = this.OPTABLE.infix[t] = e.mo.OPTYPES[o === "BIN" ? "BIN3" : o], this.makeDef(o);
}
return null;
},
makeDef: function(e) {
e[2] == null && (e[2] = this.defaultDef.texClass), e[3] || (e[3] = {});
var t = MathJax.Hub.Insert({}, e[3]);
return t.lspace = this.SPACE[e[0]], t.rspace = this.SPACE[e[1]], t.texClass = e[2], t;
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
return n;
},
lineBreak: function() {
var t = this.getValues("linebreak", "linebreakstyle");
return t.linebreak === e.LINEBREAK.NEWLINE ? (t.linebreakstyle === e.LINEBREAKSTYLE.INFIXLINEBREAKSTYLE && (t.linebreakstyle = this.Get("infixlinebreakstyle")), t.linebreakstyle) : "none";
},
setTeXclass: function(t) {
return this.getValues("lspace", "rspace"), this.useMMLspacing ? (this.texClass = e.TEXCLASS.NONE, this) : (this.texClass = this.Get("texClass"), t ? (this.prevClass = t.texClass || e.TEXCLASS.ORD, this.prevLevel = t.Get("scriptlevel")) : this.prevClass = e.TEXCLASS.NONE, this.texClass !== e.TEXCLASS.BIN || this.prevClass !== e.TEXCLASS.NONE && this.prevClass !== e.TEXCLASS.BIN && this.prevClass !== e.TEXCLASS.OP && this.prevClass !== e.TEXCLASS.REL && this.prevClass !== e.TEXCLASS.OPEN && this.prevClass !== e.TEXCLASS.PUNCT ? this.prevClass === e.TEXCLASS.BIN && (this.texClass === e.TEXCLASS.REL || this.texClass === e.TEXCLASS.CLOSE || this.texClass === e.TEXCLASS.PUNCT) && (t.texClass = this.prevClass = e.TEXCLASS.ORD) : this.texClass = e.TEXCLASS.ORD, this);
}
}), e.mtext = e.mbase.Subclass({
type: "mtext",
isToken: n,
isSpacelike: function() {
return n;
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
isToken: n,
isSpacelike: function() {
return n;
},
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
width: "0em",
height: "0ex",
depth: "0ex",
linebreak: e.LINEBREAK.AUTO
},
lineBreak: function() {
return this.Get("linebreak") === e.LINEBREAK.NEWLINE ? e.LINEBREAKSTYLE.AFTER : "none";
}
}), e.ms = e.mbase.Subclass({
type: "ms",
isToken: n,
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
isToken: n,
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
inferred: t,
isEmbellished: function() {
var e = t;
for (var r = 0, i = this.data.length; r < i; r++) {
if (this.data[r] == null) continue;
if (this.data[r].isEmbellished()) {
if (e) return t;
e = n, this.core = r;
} else if (!this.data[r].isSpacelike()) return t;
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
bevelled: t
},
adjustChild_displaystyle: function(e) {
return t;
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
inferRow: n,
texClass: e.TEXCLASS.ORD,
setTeXclass: e.mbase.setSeparateTeXclasses,
adjustChild_texprimestyle: function(e) {
return n;
}
}), e.mroot = e.mbase.Subclass({
type: "mroot",
texClass: e.TEXCLASS.ORD,
adjustChild_displaystyle: function(e) {
return e === 1 ? t : this.Get("displaystyle");
},
adjustChild_scriptlevel: function(e) {
var t = this.Get("scriptlevel");
return e === 1 && (t += 2), t;
},
adjustChild_texprimestyle: function(e) {
return e === 0 ? n : this.Get("texprimestyle");
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.mstyle = e.mbase.Subclass({
type: "mstyle",
isSpacelike: e.mbase.childrenSpacelike,
isEmbellished: e.mbase.childEmbellished,
Core: e.mbase.childCore,
CoreMO: e.mbase.childCoreMO,
inferRow: n,
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
inheritFromMe: n,
noInherit: {
mpadded: {
width: n,
height: n,
depth: n,
lspace: n,
voffset: n
},
mtable: {
width: n,
height: n,
depth: n,
align: n
}
},
setTeXclass: e.mbase.setChildTeXclass
}), e.merror = e.mbase.Subclass({
type: "merror",
inferRow: n,
texClass: e.TEXCLASS.ORD
}), e.mpadded = e.mbase.Subclass({
type: "mpadded",
inferRow: n,
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
inferRow: n,
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
inferRow: n,
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
return e > 0 ? t : this.Get("displaystyle");
},
adjustChild_scriptlevel: function(e) {
var t = this.Get("scriptlevel");
return e > 0 && t++, t;
},
adjustChild_texprimestyle: function(e) {
return e === this.sub ? n : this.Get("texprimestyle");
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
return e % 2 === 1 ? n : this.Get("texprimestyle");
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
autoDefault: function(n) {
return n === "texClass" ? this.isEmbellished() ? this.CoreMO().Get(n) : e.TEXCLASS.ORD : n === "accent" && this.data[this.over] ? this.data[this.over].CoreMO().Get("accent") : n === "accentunder" && this.data[this.under] ? this.data[this.under].CoreMO().Get("accent") : t;
},
adjustChild_displaystyle: function(e) {
return e > 0 ? t : this.Get("displaystyle");
},
adjustChild_scriptlevel: function(e) {
var t = this.Get("scriptlevel");
return e == this.under && !this.Get("accentunder") && t++, e == this.over && !this.Get("accent") && t++, t;
},
adjustChild_texprimestyle: function(e) {
return e === this.base && this.data[this.over] ? n : this.Get("texprimestyle");
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
alignmentscope: n,
columnwidth: e.WIDTH.AUTO,
width: e.WIDTH.AUTO,
rowspacing: "1ex",
columnspacing: ".8em",
rowlines: e.LINES.NONE,
columnlines: e.LINES.NONE,
frame: e.LINES.NONE,
framespacing: "0.4em 0.5ex",
equalrows: t,
equalcolumns: t,
displaystyle: t,
side: e.SIDE.RIGHT,
minlabelspacing: "0.8em",
texClass: e.TEXCLASS.ORD,
useHeight: 1
},
inheritFromMe: n,
noInherit: {
mtable: {
align: n,
rowalign: n,
columnalign: n,
groupalign: n,
alignmentscope: n,
columnwidth: n,
width: n,
rowspacing: n,
columnspacing: n,
rowlines: n,
columnlines: n,
frame: n,
framespacing: n,
equalrows: n,
equalcolumns: n,
side: n,
minlabelspacing: n,
texClass: n,
useHeight: 1
}
},
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
inheritFromMe: n,
noInherit: {
mrow: {
rowalign: n,
columnalign: n,
groupalign: n
},
mtable: {
rowalign: n,
columnalign: n,
groupalign: n
}
},
Append: function() {
for (var t = 0, n = arguments.length; t < n; t++) arguments[t] instanceof e.mtd || (arguments[t] = e.mtd(arguments[t]));
this.SUPER(arguments).Append.apply(this, arguments);
},
setTeXclass: e.mbase.setSeparateTeXclasses
}), e.mtd = e.mbase.Subclass({
type: "mtd",
inferRow: n,
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
return n;
},
defaults: {
mathbackground: e.INHERIT,
mathcolor: e.INHERIT,
groupalign: e.INHERIT
},
inheritFromMe: n,
noInherit: {
mrow: {
groupalign: n
},
mtable: {
groupalign: n
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
return n;
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
isToken: n,
defaults: {
definitionURL: null,
encoding: null,
cd: "mathmlkeys",
name: "",
src: null
}
}), e["annotation-xml"] = e.mbase.Subclass({
type: "annotation-xml",
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
decimalseparator: ".",
texprimestyle: t
},
autoDefault: function(e) {
return e === "displaystyle" ? this.Get("display") === "block" : "";
},
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
return e <= 65535 ? String.fromCharCode(e) : this.PLANE1 + String.fromCharCode(e - 119808 + 56320);
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
t = document.createElement(e.nodeName), e.className && (t.className = iNode.className);
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
inferRow: n,
texClass: e.TEXCLASS.ORD,
setTeXclass: function(e) {
return this.getPrevClass(e), this.data[0].setTeXclass(), this;
}
}), e.NULL = e.mbase().With({
type: "null"
});
var r = e.TEXCLASS, i = {
ORD: [ 0, 0, r.ORD ],
ORD11: [ 1, 1, r.ORD ],
ORD21: [ 2, 1, r.ORD ],
ORD02: [ 0, 2, r.ORD ],
ORD55: [ 5, 5, r.ORD ],
OP: [ 1, 2, r.OP, {
largeop: !0,
movablelimits: !0,
symmetric: !0
} ],
OPFIXED: [ 1, 2, r.OP, {
largeop: !0,
movablelimits: !0
} ],
INTEGRAL: [ 0, 1, r.OP, {
largeop: !0,
symmetric: !0
} ],
INTEGRAL2: [ 1, 2, r.OP, {
largeop: !0,
symmetric: !0
} ],
BIN3: [ 3, 3, r.BIN ],
BIN4: [ 4, 4, r.BIN ],
BIN01: [ 0, 1, r.BIN ],
TALLBIN: [ 4, 4, r.BIN, {
stretchy: !0
} ],
BINOP: [ 4, 4, r.BIN, {
largeop: !0,
movablelimits: !0
} ],
REL: [ 5, 5, r.REL ],
REL1: [ 1, 1, r.REL, {
stretchy: !0
} ],
REL4: [ 4, 4, r.REL ],
WIDEREL: [ 5, 5, r.REL, {
stretchy: !0
} ],
RELACCENT: [ 5, 5, r.REL, {
accent: !0,
stretchy: !0
} ],
OPEN: [ 0, 0, r.OPEN, {
fence: !0,
stretchy: !0,
symmetric: !0
} ],
CLOSE: [ 0, 0, r.CLOSE, {
fence: !0,
stretchy: !0,
symmetric: !0
} ],
INNER: [ 0, 0, r.INNER ],
PUNCT: [ 0, 3, r.PUNCT ],
ACCENT: [ 0, 0, r.ORD, {
accent: !0
} ],
WIDEACCENT: [ 0, 0, r.ORD, {
accent: !0,
stretchy: !0
} ]
};
e.mo.Augment({
SPACE: [ "0em", "0.1111em", "0.1667em", "0.2222em", "0.2667em", "0.3333em" ],
RANGES: [ [ 32, 127, r.REL, "BasicLatin" ], [ 160, 255, r.ORD, "Latin1Supplement" ], [ 256, 383, r.ORD ], [ 384, 591, r.ORD ], [ 688, 767, r.ORD, "SpacingModLetters" ], [ 768, 879, r.ORD, "CombDiacritMarks" ], [ 880, 1023, r.ORD, "GreekAndCoptic" ], [ 7680, 7935, r.ORD ], [ 8192, 8303, r.PUNCT, "GeneralPunctuation" ], [ 8304, 8351, r.ORD ], [ 8352, 8399, r.ORD ], [ 8400, 8447, r.ORD, "CombDiactForSymbols" ], [ 8448, 8527, r.ORD, "LetterlikeSymbols" ], [ 8528, 8591, r.ORD ], [ 8592, 8703, r.REL, "Arrows" ], [ 8704, 8959, r.BIN, "MathOperators" ], [ 8960, 9215, r.ORD, "MiscTechnical" ], [ 9312, 9471, r.ORD ], [ 9632, 9727, r.ORD, "GeometricShapes" ], [ 9984, 10175, r.ORD, "Dingbats" ], [ 10176, 10223, r.ORD, "MiscMathSymbolsA" ], [ 10496, 10623, r.REL, "SupplementalArrowsB" ], [ 10624, 10751, r.ORD, "MiscMathSymbolsB" ], [ 10752, 11007, r.BIN, "SuppMathOperators" ], [ 11008, 11263, r.ORD ], [ 119808, 120831, r.ORD ] ],
OPTABLE: {
prefix: {
"\u2111": i.ORD11,
"\u2113": i.ORD11,
"\u211c": i.ORD11,
"\u2200": i.ORD21,
"\u2202": i.ORD21,
"\u2203": i.ORD21,
"\u2207": i.ORD21,
"\u220f": i.OP,
"\u2210": i.OP,
"\u2211": i.OP,
"\u2212": i.BIN01,
"\u2213": i.BIN01,
"\u221a": [ 1, 1, r.ORD, {
stretchy: !0
} ],
"\u2220": i.ORD,
"\u222b": i.INTEGRAL,
"\u222e": i.INTEGRAL,
"\u22c0": i.OP,
"\u22c1": i.OP,
"\u22c2": i.OP,
"\u22c3": i.OP,
"\u2308": i.OPEN,
"\u230a": i.OPEN,
"\u27e8": i.OPEN,
"\u2a00": i.OP,
"\u2a01": i.OP,
"\u2a02": i.OP,
"\u2a04": i.OP,
"\u2a06": i.OP,
"\u00ac": i.ORD21,
"\u00b1": i.BIN01,
"(": i.OPEN,
"+": i.BIN01,
"-": i.BIN01,
"[": i.OPEN,
"{": i.OPEN,
"|": i.OPEN
},
postfix: {
"!": [ 1, 0, r.CLOSE ],
"&": i.ORD,
"\u2032": i.ORD02,
"\u203e": i.WIDEACCENT,
"\u2309": i.CLOSE,
"\u230b": i.CLOSE,
"\u23de": i.WIDEACCENT,
"\u23df": i.WIDEACCENT,
"\u266d": i.ORD02,
"\u266e": i.ORD02,
"\u266f": i.ORD02,
"\u27e9": i.CLOSE,
"\u02c6": i.WIDEACCENT,
"\u02c7": i.WIDEACCENT,
"\u02d8": i.ACCENT,
"\u02d9": i.ACCENT,
"\u02dc": i.WIDEACCENT,
"\u0302": i.ACCENT,
"\u00a8": i.ACCENT,
"\u00af": i.WIDEACCENT,
")": i.CLOSE,
"]": i.CLOSE,
"^": i.WIDEACCENT,
_: i.WIDEACCENT,
"`": i.ACCENT,
"|": i.CLOSE,
"}": i.CLOSE,
"~": i.WIDEACCENT
},
infix: {
"%": [ 3, 3, r.ORD ],
"\u2022": i.BIN4,
"\u2026": i.INNER,
"\u2044": i.TALLBIN,
"\u2061": i.ORD,
"\u2062": i.ORD,
"\u2063": [ 0, 0, r.ORD, {
separator: !0
} ],
"\u2064": i.ORD,
"\u2190": i.RELACCENT,
"\u2191": i.WIDEREL,
"\u2192": i.RELACCENT,
"\u2193": i.WIDEREL,
"\u2194": i.RELACCENT,
"\u2195": i.WIDEREL,
"\u2196": i.WIDEREL,
"\u2197": i.WIDEREL,
"\u2198": i.WIDEREL,
"\u2199": i.WIDEREL,
"\u21a6": i.WIDEREL,
"\u21a9": i.WIDEREL,
"\u21aa": i.WIDEREL,
"\u21bc": i.RELACCENT,
"\u21bd": i.WIDEREL,
"\u21c0": i.RELACCENT,
"\u21c1": i.WIDEREL,
"\u21cc": i.WIDEREL,
"\u21d0": i.WIDEREL,
"\u21d1": i.WIDEREL,
"\u21d2": i.WIDEREL,
"\u21d3": i.WIDEREL,
"\u21d4": i.WIDEREL,
"\u21d5": i.WIDEREL,
"\u2208": i.REL,
"\u2209": i.REL,
"\u220b": i.REL,
"\u2212": i.BIN4,
"\u2213": i.BIN4,
"\u2215": i.TALLBIN,
"\u2216": i.BIN4,
"\u2217": i.BIN4,
"\u2218": i.BIN4,
"\u2219": i.BIN4,
"\u221d": i.REL,
"\u2223": i.REL,
"\u2225": i.REL,
"\u2227": i.BIN4,
"\u2228": i.BIN4,
"\u2229": i.BIN4,
"\u222a": i.BIN4,
"\u223c": i.REL,
"\u2240": i.BIN4,
"\u2243": i.REL,
"\u2245": i.REL,
"\u2248": i.REL,
"\u224d": i.REL,
"\u2250": i.REL,
"\u2260": i.REL,
"\u2261": i.REL,
"\u2264": i.REL,
"\u2265": i.REL,
"\u226a": i.REL,
"\u226b": i.REL,
"\u227a": i.REL,
"\u227b": i.REL,
"\u2282": i.REL,
"\u2283": i.REL,
"\u2286": i.REL,
"\u2287": i.REL,
"\u228e": i.BIN4,
"\u2291": i.REL,
"\u2292": i.REL,
"\u2293": i.BIN4,
"\u2294": i.BIN4,
"\u2295": i.BIN4,
"\u2296": i.BIN4,
"\u2297": i.BIN4,
"\u2298": i.BIN4,
"\u2299": i.BIN4,
"\u22a2": i.REL,
"\u22a3": i.REL,
"\u22a4": i.ORD55,
"\u22a5": i.REL,
"\u22a8": i.REL,
"\u22c4": i.BIN4,
"\u22c5": i.BIN4,
"\u22c6": i.BIN4,
"\u22c8": i.REL,
"\u22ee": i.ORD55,
"\u22ef": i.INNER,
"\u22f1": [ 5, 5, r.INNER ],
"\u2500": [ 0, 0, r.ORD, {
stretchy: !0
} ],
"\u25b3": i.BIN4,
"\u25b5": i.BIN4,
"\u25b9": i.BIN4,
"\u25bd": i.BIN4,
"\u25bf": i.BIN4,
"\u25c3": i.BIN4,
"\u2758": [ 4, 4, r.REL, {
fence: !0,
stretchy: !0,
symmetric: !0
} ],
"\u27f5": i.REL1,
"\u27f6": i.REL1,
"\u27f7": i.REL1,
"\u27f8": i.REL1,
"\u27f9": i.REL1,
"\u27fa": i.REL1,
"\u2a2f": i.BIN4,
"\u2a3f": i.BIN4,
"\u2aaf": i.REL,
"\u2ab0": i.REL,
"\u00b1": i.BIN4,
"\u00b7": i.BIN4,
"\u00d7": i.BIN4,
"\u00f7": i.BIN4,
"*": i.BIN3,
"+": i.BIN4,
",": [ 0, 3, r.PUNCT, {
separator: !0
} ],
"-": i.BIN4,
".": [ 3, 3, r.ORD ],
"/": i.ORD11,
":": [ 1, 2, r.REL ],
";": [ 0, 3, r.PUNCT, {
separator: !0
} ],
"<": i.REL,
"=": i.REL,
">": i.REL,
"?": [ 1, 1, r.CLOSE ],
"\\": i.ORD,
_: i.ORD11,
"|": [ 2, 2, r.ORD, {
fence: !0,
stretchy: !0,
symmetric: !0
} ],
"#": i.ORD,
$: i.ORD,
".": [ 0, 3, r.PUNCT, {
separator: !0
} ],
"\u02b9": i.ORD,
"\u02c9": i.ACCENT,
"\u02ca": i.ACCENT,
"\u02cb": i.ACCENT,
"\u0300": i.ACCENT,
"\u0301": i.ACCENT,
"\u0303": i.WIDEACCENT,
"\u0304": i.ACCENT,
"\u0306": i.ACCENT,
"\u0307": i.ACCENT,
"\u0308": i.ACCENT,
"\u030c": i.ACCENT,
"\u0332": i.WIDEACCENT,
"\u0338": i.REL4,
"\u2015": [ 0, 0, r.ORD, {
stretchy: !0
} ],
"\u2017": [ 0, 0, r.ORD, {
stretchy: !0
} ],
"\u2020": i.BIN3,
"\u2021": i.BIN3,
"\u20d7": i.ACCENT,
"\u2118": i.ORD,
"\u2205": i.ORD,
"\u221e": i.ORD,
"\u2305": i.BIN3,
"\u2306": i.BIN3,
"\u2322": i.REL4,
"\u2323": i.REL4,
"\u2329": i.OPEN,
"\u232a": i.CLOSE,
"\u23aa": i.ORD,
"\u23af": [ 0, 0, r.ORD, {
stretchy: !0
} ],
"\u23b0": i.OPEN,
"\u23b1": i.CLOSE,
"\u25ef": i.BIN3,
"\u2660": i.ORD,
"\u2661": i.ORD,
"\u2662": i.ORD,
"\u2663": i.ORD,
"\u27ee": i.OPEN,
"\u27ef": i.CLOSE,
"\u27fc": i.REL4,
"\u3008": i.OPEN,
"\u3009": i.CLOSE,
"\ufe37": i.WIDEACCENT,
"\ufe38": i.WIDEACCENT
}
}
}, {
OPTYPES: i
});
}(MathJax.ElementJax.mml), MathJax.ElementJax.mml.loadComplete("jax.js"), MathJax.InputJax.TeX = MathJax.InputJax({
id: "TeX",
version: "1.1.1",
directory: MathJax.InputJax.directory + "/TeX",
extensionDir: MathJax.InputJax.extensionDir + "/TeX",
config: {
TagSide: "right",
TagIndent: "0.8em",
MultLineWidth: "85%"
}
}), MathJax.InputJax.TeX.Register("math/tex"), MathJax.InputJax.TeX.loadComplete("config.js"), function(e) {
var t = !0, n = !1, r, i = String.fromCharCode(160), s = MathJax.Object.Subclass({
Init: function(e) {
this.global = {}, this.data = [ o.start().With({
global: this.global
}) ], e && (this.data[0].env = e), this.env = this.data[0].env;
},
Push: function() {
var e, n, i, s;
for (e = 0, n = arguments.length; e < n; e++) {
i = arguments[e], i instanceof r.mbase && (i = o.mml(i)), i.global = this.global, s = this.data.length ? this.Top().checkItem(i) : t;
if (s instanceof Array) this.Pop(), this.Push.apply(this, s); else if (s instanceof o) this.Pop(), this.Push(s); else if (s) {
this.data.push(i);
if (i.env) {
for (var u in this.env) this.env.hasOwnProperty(u) && (i.env[u] = this.env[u]);
this.env = i.env;
} else i.env = this.env;
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
mmlData: function(e, n) {
return e == null && (e = t), this.data.length === 1 && !n ? this.data[0] : r.mrow.apply(r, this.data).With(e ? {
inferred: t
} : {});
},
checkItem: function(r) {
return r.type === "over" && this.isOpen && (r.num = this.mmlData(n), this.data = []), r.type === "cell" && this.isOpen && e.Error("Misplaced " + r.name), r.isClose && this[r.type + "Error"] && e.Error(this[r.type + "Error"]), r.isNotStack ? (this.Push(r.data[0]), n) : t;
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
isOpen: t,
checkItem: function(e) {
return e.type === "stop" ? o.mml(this.mmlData()) : this.SUPER(arguments).checkItem.call(this, e);
}
}), o.stop = o.Subclass({
type: "stop",
isClose: t
}), o.open = o.Subclass({
type: "open",
isOpen: t,
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
isClose: t
}), o.subsup = o.Subclass({
type: "subsup",
stopError: "Missing superscript or subscript argument",
checkItem: function(n) {
var r = [ "", "subscript", "superscript" ][this.position];
if (n.type === "open" || n.type === "left") return t;
if (n.type === "mml") return this.data[0].SetData(this.position, n.data[0]), o.mml(this.data[0]);
this.SUPER(arguments).checkItem.call(this, n) && e.Error("Missing open brace for " + r);
},
Pop: function() {}
}), o.over = o.Subclass({
type: "over",
isClose: t,
name: "\\over",
checkItem: function(i, s) {
i.type === "over" && e.Error("Ambiguous use of " + i.name);
if (i.isClose) {
var u = r.mfrac(this.num, this.mmlData(n));
this.thickness != null && (u.linethickness = this.thickness);
if (this.open || this.close) u.texClass = r.TEXCLASS.INNER, u.texWithDelims = t, u = r.mfenced(u).With({
open: this.open,
close: this.close
});
return [ o.mml(u), i ];
}
return this.SUPER(arguments).checkItem.call(this, i);
},
toString: function() {
return "over[" + this.num + " / " + this.data.join("; ") + "]";
}
}), o.left = o.Subclass({
type: "left",
isOpen: t,
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
isClose: t,
delim: ")"
}), o.begin = o.Subclass({
type: "begin",
isOpen: t,
checkItem: function(t) {
return t.type === "end" ? (t.name !== this.name && e.Error("\\begin{" + this.name + "} ended with \\end{" + t.name + "}"), this.end ? this.parse[this.end].call(this.parse, this, this.data) : o.mml(this.mmlData())) : (t.type === "stop" && e.Error("Missing \\end{" + this.name + "}"), this.SUPER(arguments).checkItem.call(this, t));
}
}), o.end = o.Subclass({
type: "end",
isClose: t
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
isOpen: t,
arraydef: {},
Init: function() {
this.table = [], this.row = [], this.env = {}, this.SUPER(arguments).Init.apply(this, arguments);
},
checkItem: function(t) {
if (t.isClose && t.type !== "over") {
if (t.isEntry) return this.EndEntry(), this.clearEnv(), n;
if (t.isCR) return this.EndEntry(), this.EndRow(), this.clearEnv(), n;
this.EndTable(), this.clearEnv();
var i = r.mtable.apply(r, this.table).With(this.arraydef);
if (this.open || this.close) i = r.mfenced(i).With({
open: this.open,
close: this.close
});
i = o.mml(i);
if (this.requireClose) {
if (t.type === "close") return i;
e.Error("Missing close brace");
}
return [ i, t ];
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
e.length === this.table.length ? (this.arraydef.frame = e.pop(), this.arraydef.rowlines = e.join(" ")) : e.length < this.table.length - 1 && (this.arraydef.rowlines += " none");
}
},
clearEnv: function() {
for (var e in this.env) this.env.hasOwnProperty(e) && delete this.env[e];
}
}), o.cell = o.Subclass({
type: "cell",
isClose: t
}), o.mml = o.Subclass({
type: "mml",
isNotStack: t,
Push: function() {
for (var e = 0, n = arguments.length; e < n; e++) arguments[e].type !== "mo" && arguments[e].isEmbellished() && (arguments[e] = r.TeXAtom(arguments[e]).With({
isEmbellishedWrapper: t
}));
this.data.push.apply(this.data, arguments);
},
Add: function() {
return this.data.push.apply(this.data, arguments), this;
}
});
var u = {}, a = function() {
r = MathJax.ElementJax.mml, MathJax.Hub.Insert(u, {
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
S: "00A7",
aleph: [ "2135", {
mathvariant: r.VARIANT.NORMAL
} ],
hbar: "210F",
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
mathvariant: r.VARIANT.NORMAL
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
mathvariant: r.VARIANT.NORMAL
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
movesupsub: t
} ],
bigvee: [ "22C1", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
bigwedge: [ "22C0", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
biguplus: [ "2A04", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
bigcap: [ "22C2", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
bigcup: [ "22C3", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
"int": [ "222B", {
texClass: r.TEXCLASS.OP
} ],
intop: [ "222B", {
texClass: r.TEXCLASS.OP,
movesupsub: t,
movablelimits: t
} ],
iint: [ "222C", {
texClass: r.TEXCLASS.OP
} ],
iiint: [ "222D", {
texClass: r.TEXCLASS.OP
} ],
prod: [ "220F", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
sum: [ "2211", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
bigotimes: [ "2A02", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
bigoplus: [ "2A01", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
bigodot: [ "2A00", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
oint: [ "222E", {
texClass: r.TEXCLASS.OP
} ],
bigsqcup: [ "2A06", {
texClass: r.TEXCLASS.OP,
movesupsub: t
} ],
smallint: [ "222B", {
largeop: n
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
largeop: n
} ],
oslash: [ "2298", {
largeop: n
} ],
otimes: [ "2297", {
largeop: n
} ],
ominus: [ "2296", {
largeop: n
} ],
oplus: [ "2295", {
largeop: n
} ],
mp: "2213",
pm: "00B1",
circ: "2218",
bigcirc: "25EF",
setminus: "2216",
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
notChar: "0338",
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
dots: "2026",
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
displaystyle: [ "SetStyle", "D", t, 0 ],
textstyle: [ "SetStyle", "T", n, 0 ],
scriptstyle: [ "SetStyle", "S", n, 1 ],
scriptscriptstyle: [ "SetStyle", "SS", n, 2 ],
rm: [ "SetFont", r.VARIANT.NORMAL ],
mit: [ "SetFont", r.VARIANT.ITALIC ],
oldstyle: [ "SetFont", r.VARIANT.OLDSTYLE ],
cal: [ "SetFont", r.VARIANT.CALIGRAPHIC ],
it: [ "SetFont", r.VARIANT.ITALIC ],
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
arcsin: [ "NamedOp", 0 ],
arccos: [ "NamedOp", 0 ],
arctan: [ "NamedOp", 0 ],
arg: [ "NamedOp", 0 ],
cos: [ "NamedOp", 0 ],
cosh: [ "NamedOp", 0 ],
cot: [ "NamedOp", 0 ],
coth: [ "NamedOp", 0 ],
csc: [ "NamedOp", 0 ],
deg: [ "NamedOp", 0 ],
det: "NamedOp",
dim: [ "NamedOp", 0 ],
exp: [ "NamedOp", 0 ],
gcd: "NamedOp",
hom: [ "NamedOp", 0 ],
inf: "NamedOp",
ker: [ "NamedOp", 0 ],
lg: [ "NamedOp", 0 ],
lim: "NamedOp",
liminf: [ "NamedOp", null, "lim&thinsp;inf" ],
limsup: [ "NamedOp", null, "lim&thinsp;sup" ],
ln: [ "NamedOp", 0 ],
log: [ "NamedOp", 0 ],
max: "NamedOp",
min: "NamedOp",
Pr: "NamedOp",
sec: [ "NamedOp", 0 ],
sin: [ "NamedOp", 0 ],
sinh: [ "NamedOp", 0 ],
sup: "NamedOp",
tan: [ "NamedOp", 0 ],
tanh: [ "NamedOp", 0 ],
limits: [ "Limits", 1 ],
nolimits: [ "Limits", 0 ],
overline: [ "UnderOver", "203E" ],
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
llap: "Lap",
rlap: "Lap",
raise: "RaiseLower",
lower: "RaiseLower",
moveleft: "MoveLeftRight",
moveright: "MoveLeftRight",
",": [ "Spacer", r.LENGTH.THINMATHSPACE ],
":": [ "Spacer", r.LENGTH.THINMATHSPACE ],
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
acute: [ "Accent", "02CA" ],
grave: [ "Accent", "02CB" ],
ddot: [ "Accent", "00A8" ],
tilde: [ "Accent", "02DC" ],
bar: [ "Accent", "02C9" ],
breve: [ "Accent", "02D8" ],
check: [ "Accent", "02C7" ],
hat: [ "Accent", "02C6" ],
vec: [ "Accent", "20D7" ],
dot: [ "Accent", "02D9" ],
widetilde: [ "Accent", "02DC", 1 ],
widehat: [ "Accent", "02C6", 1 ],
matrix: "Matrix",
array: "Matrix",
pmatrix: [ "Matrix", "(", ")" ],
cases: [ "Matrix", "{", "", "left left", null, ".1em" ],
eqalign: [ "Matrix", null, null, "right left", r.LENGTH.THICKMATHSPACE, ".5em", "D" ],
displaylines: [ "Matrix", null, null, "center", null, ".5em", "D" ],
cr: "Cr",
"\\": "Cr",
newline: "Cr",
hline: [ "HLine", "solid" ],
hdashline: [ "HLine", "dashed" ],
eqalignno: [ "Matrix", null, null, "right left right", r.LENGTH.THICKMATHSPACE + " 3em", ".5em", "D" ],
leqalignno: [ "Matrix", null, null, "right left right", r.LENGTH.THICKMATHSPACE + " 3em", ".5em", "D" ],
bmod: [ "Macro", "\\mathbin{\\rm mod}" ],
pmod: [ "Macro", "\\pod{{\\rm mod}\\kern 6mu #1}", 1 ],
mod: [ "Macro", "\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}{\\rm mod}\\,\\,#1", 1 ],
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
not: [ "Macro", "\\mathrel{\\rlap{\\kern.5em\\notChar}}" ],
" ": [ "Macro", "\\text{ }" ],
space: "Tilde",
begin: "Begin",
end: "End",
newcommand: [ "Extension", "newcommand" ],
renewcommand: [ "Extension", "newcommand" ],
newenvironment: [ "Extension", "newcommand" ],
def: [ "Extension", "newcommand" ],
verb: [ "Extension", "verb" ],
boldsymbol: [ "Extension", "boldsymbol" ],
tag: [ "Extension", "AMSmath" ],
notag: [ "Extension", "AMSmath" ],
label: [ "Macro", "", 1 ],
nonumber: [ "Macro", "" ],
unicode: [ "Extension", "unicode" ],
color: "Color",
href: [ "Extension", "HTML" ],
"class": [ "Extension", "HTML" ],
style: [ "Extension", "HTML" ],
cssId: [ "Extension", "HTML" ],
require: "Require"
},
environment: {
array: [ "Array" ],
matrix: [ "Array", null, null, null, "c" ],
pmatrix: [ "Array", null, "(", ")", "c" ],
bmatrix: [ "Array", null, "[", "]", "c" ],
Bmatrix: [ "Array", null, "\\{", "\\}", "c" ],
vmatrix: [ "Array", null, "\\vert", "\\vert", "c" ],
Vmatrix: [ "Array", null, "\\Vert", "\\Vert", "c" ],
cases: [ "Array", null, "\\{", ".", "ll", null, ".1em" ],
eqnarray: [ "Array", null, null, null, "rcl", r.LENGTH.THICKMATHSPACE, ".5em", "D" ],
"eqnarray*": [ "Array", null, null, null, "rcl", r.LENGTH.THICKMATHSPACE, ".5em", "D" ],
equation: [ null, "Equation" ],
"equation*": [ null, "Equation" ],
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
for (var i in e) e.hasOwnProperty(i) && (typeof e[i] == "string" ? u.macros[i] = [ "Macro", e[i] ] : u.macros[i] = [ "Macro" ].concat(e[i]));
}
}, f = MathJax.Object.Subclass({
Init: function(t, n) {
this.string = t, this.i = 0, this.macroCount = 0;
var r;
if (n) {
r = {};
for (var i in n) n.hasOwnProperty(i) && (r[i] = n[i]);
}
this.stack = e.Stack(r), this.Parse(), this.Push(o.stop());
},
Parse: function() {
var e;
while (this.i < this.string.length) e = this.string.charAt(this.i++), u.special[e] ? this[u.special[e]](e) : u.letter.test(e) ? this.Variable(e) : u.digit.test(e) ? this.Number(e) : this.Other(e);
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
var t = this.GetCS(), i, s;
if (u.macros[t]) {
var o = u.macros[t];
o instanceof Array || (o = [ o ]);
var a = o[0];
a instanceof Function || (a = this[a]), a.apply(this, [ "\\" + t ].concat(o.slice(1)));
} else if (u.mathchar0mi[t]) i = u.mathchar0mi[t], s = {
mathvariant: r.VARIANT.ITALIC
}, i instanceof Array && (s = i[1], i = i[0]), this.Push(this.mmlToken(r.mi(r.entity("#x" + i)).With(s))); else if (u.mathchar0mo[t]) i = u.mathchar0mo[t], s = {
stretchy: n
}, i instanceof Array && (s = i[1], s.stretchy = n, i = i[0]), this.Push(this.mmlToken(r.mo(r.entity("#x" + i)).With(s))); else if (u.mathchar7[t]) i = u.mathchar7[t], s = {
mathvariant: r.VARIANT.NORMAL
}, i instanceof Array && (s = i[1], i = i[0]), this.stack.env.font && (s.mathvariant = this.stack.env.font), this.Push(this.mmlToken(r.mi(r.entity("#x" + i)).With(s))); else if (u.delimiter["\\" + t] != null) {
var f = u.delimiter["\\" + t];
s = {}, f instanceof Array && (s = f[1], f = f[0]), f.length === 4 ? f = r.entity("#x" + f) : f = r.chars(f), this.Push(this.mmlToken(r.mo(f).With({
fence: n,
stretchy: n
}).With(s)));
} else this.csUndefined("\\" + t);
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
Superscript: function(n) {
var i, s = this.stack.Prev();
s || (s = r.mi("")), s.isEmbellishedWrapper && (s = s.data[0].data[0]);
if (s.type === "msubsup") s.data[s.sup] && (s.data[s.sup].isPrime || e.Error("Double exponent: use braces to clarify"), s = r.msubsup(s, null, null)), i = s.sup; else if (s.movesupsub) {
if (s.type !== "munderover" || s.data[s.over]) s = r.munderover(s, null, null).With({
movesupsub: t
});
i = s.over;
} else s = r.msubsup(s, null, null), i = s.sup;
this.Push(o.subsup(s).With({
position: i
}));
},
Subscript: function(n) {
var i, s = this.stack.Prev();
s || (s = r.mi("")), s.isEmbellishedWrapper && (s = s.data[0].data[0]);
if (s.type === "msubsup") s.data[s.sub] && e.Error("Double subscripts: use braces to clarify"), i = s.sub; else if (s.movesupsub) {
if (s.type !== "munderover" || s.data[s.under]) s = r.munderover(s, null, null).With({
movesupsub: t
});
i = s.under;
} else s = r.msubsup(s, null, null), i = s.sub;
this.Push(o.subsup(s).With({
position: i
}));
},
PRIME: String.fromCharCode(8242),
SMARTQUOTE: String.fromCharCode(8217),
Prime: function(n) {
var i = this.stack.Prev();
i || (i = r.mi()), i.type === "msubsup" && i.data[i.sup] && e.Error("Prime causes double exponent: use braces to clarify");
var s = "";
this.i--;
do s += this.PRIME, this.i++, n = this.GetNext(); while (n === "'" || n === this.SMARTQUOTE);
s = this.mmlToken(r.mo(r.chars(s)).With({
isPrime: t,
variantForm: e.isSTIX
})), this.Push(r.msubsup(i, null, s));
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
this.stack.env.font && (t.mathvariant = this.stack.env.font), u.remap[e] ? (e = u.remap[e], e instanceof Array && (t = e[1], e = e[0]), n = r.mo(r.entity("#x" + e))) : n = r.mo(e), n.autoDefault("texClass", true) == "" && (n = r.TeXAtom(n)), this.Push(this.mmlToken(n.With(t)));
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
scriptlevel: 1
}));
},
LeftRight: function(e) {
this.Push(o[e.substr(1)]().With({
delim: this.GetDelimiter(e)
}));
},
NamedOp: function(e, i, s) {
var o = i != null && i === 0 ? n : t;
s || (s = e.substr(1)), i = i || i == null ? t : n, s = s.replace(/&thinsp;/, String.fromCharCode(8198));
var u = r.mo(s).With({
movablelimits: i,
movesupsub: o,
form: r.FORM.PREFIX,
texClass: r.TEXCLASS.OP
});
u.useMMLspacing &= ~u.SPACE_ATTR.form, this.Push(this.mmlToken(u));
},
Limits: function(i, s) {
var o = this.stack.Prev("nopop");
o.texClass !== r.TEXCLASS.OP && e.Error(i + " is allowed only on operators"), o.movesupsub = s ? t : n, o.movablelimits = n;
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
Sqrt: function(e) {
var t = this.GetBrackets(e), n = this.ParseArg(e);
t == "" ? n = r.msqrt.apply(r, n.array()) : n = r.mroot(n, this.parseRoot(t)), this.Push(n);
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
Accent: function(e, i, s) {
var o = this.ParseArg(e), u = {
accent: !0
};
this.stack.env.font && (u.mathvariant = this.stack.env.font);
var a = this.mmlToken(r.mo(r.entity("#x" + i)).With(u));
a.stretchy = s ? t : n, this.Push(r.munderover(o, null, a).With({
accent: t
}));
},
UnderOver: function(e, n, i) {
var s = {
o: "over",
u: "under"
}[e.charAt(1)], o = this.ParseArg(e);
o.Get("movablelimits") && (o.movablelimits = !1);
var u = r.munderover(o, null, null);
i && (u.movesupsub = t), u.data[u[s]] = this.mmlToken(r.mo(r.entity("#x" + n)).With({
stretchy: t,
accent: s == "under"
})), this.Push(u);
},
Overset: function(e) {
var t = this.ParseArg(e), n = this.ParseArg(e);
this.Push(r.munderover(n, null, t));
},
Underset: function(e) {
var t = this.ParseArg(e), n = this.ParseArg(e);
this.Push(r.munderover(n, t, null));
},
TeXAtom: function(n, i) {
var s = {
texClass: i
}, o;
if (i == r.TEXCLASS.OP) {
s.movesupsub = s.movablelimits = t;
var u = this.GetArgument(n), a = u.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
a ? (o = this.mmlToken(r.mo(a[1]).With({
movablelimits: t,
movesupsub: t,
mathvariant: r.VARIANT.NORMAL,
form: r.FORM.PREFIX,
texClass: r.TEXCLASS.OP
})), o.useMMLspacing &= ~o.SPACE_ATTR.form) : o = r.TeXAtom(e.Parse(u, this.stack.env).mml()).With(s);
} else o = r.TeXAtom(this.ParseArg(n)).With(s);
this.Push(o);
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
this.Push(i);
},
Smash: function(e) {
var t = this.trimSpaces(this.GetBrackets(e)), n = r.mpadded(this.ParseArg(e));
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
this.Push(n);
},
Lap: function(e) {
var t = r.mpadded(this.ParseArg(e)).With({
width: 0
});
e === "\\llap" && (t.lspace = "-1 width"), this.Push(t);
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
mathsize: r.SIZE.NORMAL,
scriptlevel: 1
}),
right: r.mspace().With({
width: n,
mathsize: r.SIZE.NORMAL,
scriptlevel: 1
})
}));
},
Hskip: function(e) {
this.Push(r.mspace().With({
width: this.GetDimen(e),
mathsize: r.SIZE.NORMAL,
scriptlevel: 0
}));
},
Rule: function(e, t) {
var n = this.GetDimen(e), i = this.GetDimen(e), s = this.GetDimen(e), o, u = {
width: n,
height: i,
depth: s
};
t !== "blank" ? (o = r.mpadded(r.mrow()).With(u), parseFloat(n) && parseFloat(i) + parseFloat(s) && (o = r.mstyle(o).With({
mathbackground: this.stack.env.color || "black"
}))) : o = r.mspace().With(u), this.Push(o);
},
MakeBig: function(e, n, i) {
i *= u.p_height, i = String(i).replace(/(\.\d\d\d).+/, "$1") + "em";
var s = this.GetDelimiter(e);
this.Push(r.TeXAtom(r.mo(s).With({
minsize: i,
maxsize: i,
scriptlevel: 0,
fence: t,
stretchy: t,
symmetric: t
})).With({
texClass: n
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
Require: function(e) {
var t = this.GetArgument(e);
this.Extension(null, t);
},
Extension: function(t, n, r) {
t && !typeof t === "string" && (t = t.name), n = e.extensionDir + "/" + n, n.match(/\.js$/) || (n += ".js"), MathJax.Ajax.loaded[MathJax.Ajax.fileURL(n)] || (t != null && delete u[r || "macros"][t.replace(/^\\/, "")], MathJax.Hub.RestartAfter(MathJax.Ajax.Require(n)));
},
Macro: function(t, n, r) {
if (r) {
var i = [];
for (var s = 0; s < r; s++) i.push(this.GetArgument(t));
n = this.SubstituteArgs(i, n);
}
this.string = this.AddArgs(n, this.string.slice(this.i)), this.i = 0, ++this.macroCount > e.config.MAXMACROS && e.Error("MathJax maximum macro substitution count exceeded; is there a recursive macro call?");
},
Matrix: function(n, r, i, s, u, a, f) {
var l = this.GetNext();
l === "" && e.Error("Missing argument for " + n), l === "{" ? this.i++ : (this.string = l + "}" + this.string.slice(this.i + 1), this.i = 0);
var h = o.array().With({
requireClose: t,
arraydef: {
rowspacing: a || "4pt",
columnspacing: u || "1em"
}
});
if (r || i) h.open = r, h.close = i;
f === "D" && (h.arraydef.displaystyle = t), s != null && (h.arraydef.columnalign = s), this.Push(h);
},
Entry: function(e) {
this.Push(o.cell().With({
isEntry: t,
name: e
}));
},
Cr: function(e) {
this.Push(o.cell().With({
isCR: t,
name: e
}));
},
HLine: function(t, n) {
n == null && (n = "solid");
var r = this.stack.Top();
(r.type !== "array" || r.data.length) && e.Error("Misplaced " + t);
if (r.table.length == 0) r.arraydef.frame = n; else {
var i = r.arraydef.rowlines ? r.arraydef.rowlines.split(/ /) : [];
while (i.length < r.table.length) i.push("none");
i[r.table.length - 1] = n, r.arraydef.rowlines = i.join(" ");
}
},
Begin: function(t) {
var n = this.GetArgument(t);
n.match(/[^a-z*]/i) && e.Error('Invalid environment name "' + n + '"'), u.environment[n] || e.Error('Unknown environment "' + n + '"'), ++this.macroCount > e.config.MAXMACROS && e.Error("MathJax maximum substitution count exceeded; is there a recursive latex environment?");
var r = u.environment[n];
r instanceof Array || (r = [ r ]);
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
Equation: function(e, t) {
return t;
},
ExtensionEnv: function(e, t) {
this.Extension(e.name, t, "environment");
},
Array: function(e, r, i, s, u, a, f, l) {
s || (s = this.GetArgument("\\begin{" + e.name + "}"));
var h = ("c" + s).replace(/[^clr|:]/g, "").replace(/[^|:]([|:])+/g, "$1");
s = s.replace(/[^clr]/g, "").split("").join(" "), s = s.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
var p = o.array().With({
arraydef: {
columnalign: s,
columnspacing: u || "1em",
rowspacing: a || "4pt"
}
});
if (h.match(/[|:]/)) {
var d = (h.charAt(0) + h.charAt(h.length - 1)).replace(/[^|:]/g, "");
d !== "" && (p.arraydef.frame = {
"|": "solid",
":": "dashed"
}[d.charAt(0)], p.arraydef.framespacing = ".5em .5ex"), h = h.substr(1, h.length - 2), p.arraydef.columnlines = h.split("").join(" ").replace(/[^|: ]/g, "none").replace(/\|/g, "solid").replace(/:/g, "dashed");
}
return r && (p.open = this.convertDelimiter(r)), i && (p.close = this.convertDelimiter(i)), f === "D" && (p.arraydef.displaystyle = t), f === "S" && (p.arraydef.scriptlevel = 1), l && (p.arraydef.useHeight = n), this.Push(e), p;
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
GetBrackets: function(t) {
if (this.GetNext() != "[") return "";
var n = ++this.i, r = 0;
while (this.i < this.string.length) switch (this.string.charAt(this.i++)) {
case "{":
r++;
break;
case "\\":
this.i++;
break;
case "}":
r-- <= 0 && e.Error("Extra close brace while looking for ']'");
break;
case "]":
if (r == 0) return this.string.slice(n, this.i - 1);
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
InternalMath: function(t, i) {
var s = {
displaystyle: n
};
i != null && (s.scriptlevel = i), this.stack.env.font && (s.mathvariant = this.stack.env.font);
if (!t.match(/\$|\\\(/)) return [ this.InternalText(t, s) ];
var o = 0, u = 0, a, f = "", l = [];
while (o < t.length) a = t.charAt(o++), a === "$" ? f === "$" ? (l.push(r.TeXAtom(e.Parse(t.slice(u, o - 1)).mml().With(s))), f = "", u = o) : f === "" && (u < o - 1 && l.push(this.InternalText(t.slice(u, o - 1), s)), f = "$", u = o) : a === "\\" && (a = t.charAt(o++), a === "(" && f === "" ? (u < o - 2 && l.push(this.InternalText(t.slice(u, o - 2), s)), f = ")", u = o) : a === ")" && f === ")" && (l.push(r.TeXAtom(e.Parse(t.slice(u, o - 2)).mml().With(s))), f = "", u = o));
return f !== "" && e.Error("Math not terminated in text box"), u < t.length && l.push(this.InternalText(t.slice(u), s)), l;
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
Translate: function(t) {
var n, i = t.innerHTML.replace(/^\s+/, "").replace(/\s+$/, "");
MathJax.Hub.Browser.isKonqueror && (i = i.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
var s = t.type.replace(/\n/g, " ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null;
i = e.prefilterMath(i, s, t);
try {
n = e.Parse(i).mml();
} catch (o) {
if (!o.texError) throw o;
n = this.formatError(o, i, s, t);
}
return n.inferred ? n = r.apply(MathJax.ElementJax, n.data) : n = r(n), s && (n.root.display = "block"), this.postfilterMath(n, s, t);
},
prefilterMath: function(e, t, n) {
return e.replace(/([_^]\s*\d)([0-9.,])/g, "$1 $2");
},
postfilterMath: function(e, t, n) {
return this.combineRelations(e.root), e;
},
formatError: function(e, t, n, i) {
return r.merror(e.message.replace(/\n.*/, ""));
},
Error: function(e) {
throw MathJax.Hub.Insert(Error(e), {
texError: t
});
},
Macro: function(e, t, n) {
u.macros[e] = [ "Macro" ].concat([].slice.call(arguments, 1));
},
combineRelations: function(e) {
for (var t = 0, n = e.data.length; t < n; t++) if (e.data[t]) {
if (e.isa(r.mrow)) while (t + 1 < n && e.data[t + 1] && e.data[t].isa(r.mo) && e.data[t + 1].isa(r.mo) && e.data[t].Get("texClass") === r.TEXCLASS.REL && e.data[t + 1].Get("texClass") === r.TEXCLASS.REL) e.data[t].Append.apply(e.data[t], e.data[t + 1].data), e.data.splice(t + 1, 1), n--;
e.data[t].isToken || this.combineRelations(e.data[t]);
}
}
}), e.loadComplete("jax.js");
}(MathJax.InputJax.TeX), MathJax.OutputJax["HTML-CSS"] = MathJax.OutputJax({
id: "HTML-CSS",
version: "1.1.5",
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
showMathMenu: !0,
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
"font-family": "serif",
"font-style": "normal",
"font-size": "90%"
},
".MathJax_Preview": {
color: "#888888"
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
r.inputJax.id === "TeX" && (r.root.Get("displaystyle") ? (s = n.displayMathDelimiters, i = [ s[0] + r.originalText + s[1] ], n.multilineDisplay && (i = i[0].split(/\n/))) : (s = n.inlineMathDelimiters, i = [ s[0] + r.originalText.replace(/^\s+/, "").replace(/\s+$/, "") + s[1] ]));
for (var u = 0, f = i.length; u < f; u++) o.appendChild(document.createTextNode(i[u])), u < f - 1 && o.appendChild(document.createElement("br"));
t.parentNode.insertBefore(o, t);
}
}, e.config["HTML-CSS"] || {});
e.Browser.version !== "0.0" && !e.Browser.versionAtLeast(n.minBrowserVersion[e.Browser] || 0) && (t.Translate = n.minBrowserTranslate, e.Config({
showProcessingMessages: !1
}), MathJax.Message.Set("Your browser does not support MathJax", null, 4e3), e.Startup.signal.Post("MathJax not supported"));
}, MathJax.Hub, MathJax.OutputJax["HTML-CSS"] ]), MathJax.OutputJax["HTML-CSS"].loadComplete("config.js"), function(e, t, n) {
var r, i = MathJax.Object.Subclass({
timeout: 5e3,
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
style: {
position: "absolute",
visibility: "hidden",
top: 0,
left: 0,
width: "auto",
padding: 0,
border: 0,
margin: 0,
textAlign: "left",
textIndent: 0,
textTransform: "none",
lineHeight: "normal",
letterSpacing: "normal",
wordSpacing: "normal",
fontSize: this.testSize[0],
fontWeight: "normal",
fontStyle: "normal"
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
if (this.div.offsetWidth != t[3]) {
if (e.noStyleChar || !n.FONTDATA || !n.FONTDATA.hasStyleChar) return !0;
for (var r = 0, i = this.testSize.length; r < i; r++) if (this.testStyleChar(e, this.testSize[r])) return !0;
}
}
return !1;
},
styleChar: String.fromCharCode(61437),
versionChar: String.fromCharCode(61438),
compChar: String.fromCharCode(61439),
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
var r = this.div.offsetWidth, i = -1;
n.safariWebFontSerif && (this.div.style.fontFamily = n.safariWebFontSerif[0], i = this.div.offsetWidth);
for (var s = 1, o = this.comparisonFont.length; s < o; s++) {
this.div.style.fontFamily = this.comparisonFont[s];
if (this.div.offsetWidth != r) return [ r, this.div.offsetWidth, s, i ];
}
return null;
},
loadWebFont: function(r) {
t.Startup.signal.Post("HTML-CSS Jax - Web-Font " + n.fontInUse + "/" + r.directory);
var i = MathJax.Message.File("Web-Font " + n.fontInUse + "/" + r.directory), s = MathJax.Callback({}), o = MathJax.Callback([ "loadComplete", this, r, i, s ]);
return e.timer.start(e, [ this.checkWebFont, r, o ], 1, this.timeout), s;
},
loadComplete: function(r, i, s, o) {
MathJax.Message.Clear(i);
if (o === e.STATUS.OK) {
s();
return;
}
this.loadError(r);
if (t.Browser.isFirefox && n.allowWebFonts) {
var u = document.location.protocol + "//" + document.location.hostname;
document.location.port != "" && (u += ":" + document.location.port), u += "/", e.fileURL(n.webfontDir).substr(0, u.length) !== u && this.firefoxFontError(r);
}
n.loadWebFontError(r, s);
},
loadError: function(e) {
MathJax.Message.Set("Can't load web font " + n.fontInUse + "/" + e.directory, null, 2e3);
},
firefoxFontError: function(e) {
MathJax.Message.Set("Firefox can't load web fonts from a remote host", null, 3e3);
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
r === "svg" && (u.src += " format('svg')");
if (!n.FontFaceBug || !i.isWebFont) t.match(/-bold/) && (u["font-weight"] = "bold"), t.match(/-italic/) && (u["font-style"] = "italic");
return u;
}
});
n.Augment({
config: {
styles: {
".MathJax": {
display: "inline",
"font-family": "serif",
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
"white-space": "nowrap"
},
".MathJax img": {
display: "inline ! important"
},
".MathJax_Processing": {
visibility: "hidden",
position: "fixed",
width: 0,
height: 0,
overflow: "hidden"
},
".MathJax .MathJax_HitBox": {
cursor: "text"
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
background: "transparent"
}
}
},
settings: t.config.menuSettings,
LEFTBUTTON: t.Browser.isMSIE ? 1 : 0,
MENUKEY: "altKey",
Font: null,
Config: function() {
this.Font = i(), this.SUPER(arguments).Config.call(this);
var e = this.settings;
this.adjustAvailableFonts && this.adjustAvailableFonts(this.config.availableFonts), e.scale && (this.config.scale = e.scale), e.font && e.font !== "Auto" && (e.font === "TeX (local)" ? (this.config.availableFonts = [ "TeX" ], this.config.preferredFont = "TeX", this.config.webFont = "TeX") : e.font === "STIX (local)" ? (this.config.availableFonts = [ "STIX" ], this.config.preferredFont = "STIX", this.config.webFont = "TeX") : e.font === "TeX (web)" ? (this.config.availableFonts = [], this.config.preferredFont = "", this.config.webFont = "TeX") : e.font === "TeX (image)" && (this.config.availableFonts = [], this.config.preferredFont = "", this.config.webFont = ""));
var n = this.Font.findFont(this.config.availableFonts, this.config.preferredFont);
!n && this.allowWebFonts && (n = this.config.webFont, n && (this.webFonts = !0)), !n && this.config.imageFont && (n = this.config.imageFont, this.imgFonts = !0), n ? (this.fontInUse = n, this.fontDir += "/" + n, this.webfontDir += "/" + n, this.require || (this.require = []), this.require.push(this.fontDir + "/fontdata.js"), this.imgFonts && (this.require.push(this.directory + "/imageFonts.js"), t.Startup.signal.Post("HTML-CSS Jax - using image fonts"))) : (MathJax.Message.Set("Can't find a valid font using [" + this.config.availableFonts.join(", ") + "]", null, 3e3), this.FONTDATA = {
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
}, MathJax.InputJax.TeX && MathJax.InputJax.TeX.Definitions && (MathJax.InputJax.TeX.Definitions.macros.overline[1] = "002D", MathJax.InputJax.TeX.Definitions.macros.underline[1] = "002D"), t.Startup.signal.Post("HTML-CSS Jax - no valid font"));
},
Startup: function() {
var t = [], r = this.FONTDATA.VARIANT.normal.fonts;
r instanceof Array || (r = [ r ]);
for (var i = 0, s = r.length; i < s; i++) t[i] = this.FONTDATA.FONTS[r[i]].family, t[i] || (t[i] = r[i]);
this.config.styles[".MathJax .math span"] = this.config.styles["#MathJax_getScales"] = {
"font-family": t.join(",")
}, this.hiddenDiv = this.Element("div", {
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
var o = this.addElement(this.hiddenDiv, "div", {
style: {
width: "5in"
}
});
this.pxPerInch = o.offsetWidth / 5, this.hiddenDiv.removeChild(o), this.startMarker = n.createStrut(this.Element("span"), 10, !0), this.endMarker = this.addText(this.Element("span"), "x").parentNode, this.HDspan = this.Element("span"), this.operaHeightBug && this.createStrut(this.HDspan, 0);
if (this.msieInlineBlockAlignBug) {
this.HDimg = this.addElement(this.HDspan, "img", {
style: {
height: "0px",
width: "1px"
}
});
try {
this.HDimg.src = "about:blank";
} catch (u) {}
} else this.HDimg = n.createStrut(this.HDspan, 0);
this.HDMspan = this.Element("span", {
style: {
position: "absolute",
"font-size-adjust": "none"
}
});
if (this.msieInlineBlockAlignBug) {
this.HDMimg = this.addElement(this.HDMspan, "img", {
style: {
height: "0px",
width: "1px",
"max-width": "none",
"max-height": "none",
border: 0,
padding: 0,
margin: 0
}
});
try {
this.HDMimg.src = "about:blank";
} catch (u) {}
} else this.HDMimg = n.createStrut(this.HDMspan, 0), this.HDMimg.style.marginRight = "";
return this.marginCheck = n.Element("span", null, [ [ "span", {
style: {
display: "inline-block",
width: "5em"
}
} ] ]), this.marginMove = n.addElement(this.marginCheck, "span", {
style: {
display: "inline-block",
width: "5em",
marginLeft: "-5em"
}
}), e.Styles(this.config.styles, [ "PreloadWebFonts", this ]);
},
PreloadWebFonts: function() {
if (!n.allowWebFonts || !n.config.preloadWebFonts) return;
for (var e = 0, t = n.config.preloadWebFonts.length; e < t; e++) {
var r = n.FONTDATA.FONTS[n.config.preloadWebFonts[e]];
r.available || n.Font.testFont(r);
}
},
Translate: function(e) {
if (!e.parentNode) return;
var t = e.previousSibling;
t && String(t.className).match(/^MathJax(_MathML|_Display)?$/) && t.parentNode.removeChild(t);
var n = e.MathJax.elementJax.root, r, i, s;
r = i = s = this.Element("span", {
className: "MathJax",
oncontextmenu: this.ContextMenu,
onmousedown: this.Mousedown,
onmouseover: this.Mouseover,
onclick: this.Click,
ondblclick: this.DblClick
});
var o = n.Get("display") === "block";
o && (i = s = this.Element("div", {
className: "MathJax_Display",
style: {
width: "100%",
position: "relative"
}
}), i.appendChild(r)), i.setAttribute("role", "textbox"), i.setAttribute("aria-readonly", "true"), this.useProcessingFrame && (s = this.Element(o ? "div" : "span", {
className: "MathJax_Processing"
}), s.appendChild(i)), e.parentNode.insertBefore(s, e);
var u;
try {
this.getScales(r), u = this.em === 0 || String(this.em) === "NaN";
} catch (a) {
u = !0;
}
u && (this.hiddenDiv.appendChild(s), this.getScales(r)), this.initImg(r), this.initHTML(n, r), n.setTeXclass();
try {
n.toHTML(r, i);
} catch (a) {
throw a.restart && s.parentNode.removeChild(s), a;
}
u && e.parentNode.insertBefore(s, e), this.useProcessingFrame && s.parentNode.replaceChild(i, s);
},
ContextMenu: function(r, i) {
if (n.config.showMathMenu && (n.settings.context === "MathJax" || i)) {
n.safariContextMenuBug && setTimeout("window.getSelection().empty()", 0);
if (!r || n.msieEventBug) r = window.event;
var s = MathJax.Menu;
if (s) {
var o = this.parentNode.className === "MathJax_Display" ? this.parentNode : this;
return s.jax = t.getJaxFor(o.nextSibling), s.menu.items[1].menu.items[1].name = s.jax.inputJax.id === "MathML" ? "Original" : s.jax.inputJax.id, s.menu.Post(r);
}
if (!e.loadingMathMenu) {
e.loadingMathMenu = !0;
var u = {
pageX: r.pageX,
pageY: r.pageY,
clientX: r.clientX,
clientY: r.clientY
};
MathJax.Callback.Queue(e.Require("[MathJax]/extensions/MathMenu.js"), function() {
delete e.loadingMathMenu;
}, [ this, arguments.callee, u, i ]);
}
return r || (r = window.event), r.preventDefault && r.preventDefault(), r.stopPropagation && r.stopPropagation(), r.cancelBubble = !0, r.returnValue = !1, !1;
}
},
Mousedown: function(e) {
if (n.config.showMathMenu) {
e || (e = window.event);
if (n.settings.context === "MathJax") {
if (!n.noContextMenuBug || e.button !== 2) return;
} else if (!e[n.MENUKEY] || e.button !== n.LEFTBUTTON) return;
return n.ContextMenu.call(this, e, !0);
}
},
Mouseover: function(e) {
n.HandleEvent(e, "Mouseover", this);
},
Click: function(e) {
n.HandleEvent(e, "Click", this);
},
DblClick: function(e) {
n.HandleEvent(e, "DblClick", this);
},
HandleEvent: function(e, t, n) {},
initImg: function(e) {},
initHTML: function(e, t) {},
initFont: function(t) {
var r = n.FONTDATA.FONTS, i = n.config.availableFonts;
return i && i.length && n.Font.testFont(r[t]) ? (r[t].available = !0, null) : this.allowWebFonts ? (r[t].isWebFont = !0, n.FontFaceBug && (r[t].family = t, n.msieFontCSSBug && (r[t].family += "-Web")), e.Styles({
"@font-face": this.Font.fontFace(t)
})) : null;
},
Remove: function(e) {
var t = e.SourceElement();
if (!t) return;
t = t.previousSibling;
if (!t) return;
t.className.match(/^MathJax/) && t.parentNode.removeChild(t);
},
getScales: function(e) {
e.parentNode.insertBefore(this.HDMspan, e), this.HDMspan.className = "", this.HDMspan.id = "", this.HDMspan.style.fontSize = "", this.HDMimg.style.height = "1px", this.HDMimg.style.width = "60ex";
var t = this.HDMspan.offsetWidth / 60;
this.HDMspan.className = "MathJax", this.HDMspan.id = "MathJax_getScales", this.HDMimg.style.width = "60em";
var n = this.outerEm = this.HDMspan.offsetWidth / 60;
this.scale = Math.floor(Math.max(this.config.minScaleAdjust / 100, t / this.TeX.x_height / n) * this.config.scale), e.style.fontSize = this.HDMspan.style.fontSize = this.scale + "%", this.em = r.mbase.prototype.em = this.HDMspan.offsetWidth / 60, this.operaFontSizeBug && n === this.em && this.scale !== 100 && (this.em = r.mbase.prototype.em = n * this.scale / 100), e.parentNode.removeChild(this.HDMspan), this.msieMarginScale = this.getMarginScale(e);
},
getMarginScale: function(e) {
return 1;
},
getMSIEmarginScale: function(e) {
e.appendChild(this.marginCheck);
var t = this.marginCheck.offsetWidth, n = this.marginMove.offsetWidth, r = 2 * n - t ? n / (2 * n - t) : 1;
return e.removeChild(this.marginCheck), r;
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
var t = e.offsetWidth, n = e.bbox ? e.bbox.w : -1, r = e;
if ((n < 0 || this.negativeSkipBug) && t >= 0) {
if (this.negativeSkipBug) {
var i = e.style.position;
e.style.position = "absolute", r = this.startMarker, e.firstChild ? e.insertBefore(r, e.firstChild) : e.appendChild(r), r = this.startMarker;
}
e.appendChild(this.endMarker), t = this.endMarker.offsetLeft - r.offsetLeft, e.removeChild(this.endMarker), this.negativeSkipBug && (e.removeChild(r), e.style.position = i);
}
return t / this.em;
},
Measured: function(e, t) {
if (e.bbox.width == null && e.bbox.w && !e.bbox.isMultiline) {
var n = this.getW(e);
e.bbox.rw += n - e.bbox.w, e.bbox.w = n;
}
return t || (t = e.parentNode), t.bbox || (t.bbox = e.bbox), e;
},
Remeasured: function(e, t) {
t.bbox = this.Measured(e, t).bbox;
},
Em: function(e) {
return Math.abs(e) < 6e-4 ? "0em" : e.toFixed(3).replace(/\.?0+$/, "") + "em";
},
Percent: function(e) {
return (100 * e).toFixed(1).replace(/\.?0+$/, "") + "%";
},
length2percent: function(e) {
return this.Percent(this.length2em(e));
},
length2em: function(e, t) {
typeof e != "string" && (e = e.toString());
if (e === "") return "";
if (e === r.SIZE.NORMAL) return 1;
if (e === r.SIZE.BIG) return 2;
if (e === r.SIZE.SMALL) return .71;
if (e === "infinity") return n.BIGDIMEN;
var i = this.FONTDATA.TeX_factor;
if (e.match(/mathspace$/)) return n.MATHSPACE[e] * i;
var s = e.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/), o = parseFloat(s[1] || "1"), u = s[2];
return t == null && (t = 1), u === "em" ? o * i : u === "ex" ? o * n.TeX.x_height * i : u === "%" ? o / 100 * t : u === "px" ? o / n.em : u === "pt" ? o / 10 * i : u === "pc" ? o * 1.2 * i : u === "in" ? o * this.pxPerInch / n.em : u === "cm" ? o * this.pxPerInch / n.em / 2.54 : u === "mm" ? o * this.pxPerInch / n.em / 25.4 : u === "mu" ? o / 18 * i : o * i * t;
},
thickness2em: function(e) {
var t = n.TeX.rule_thickness;
return e === r.LINETHICKNESS.MEDIUM ? t : e === r.LINETHICKNESS.THIN ? .67 * t : e === r.LINETHICKNESS.THICK ? 1.67 * t : this.length2em(e, t);
},
createStrut: function(e, t, n) {
var r = this.Element("span", {
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
}
});
return n ? e.insertBefore(r, e.firstChild) : e.appendChild(r), r;
},
createSpace: function(e, t, i, s, o) {
var u = this.Em(Math.max(0, t + i)), f = this.Em(-i);
return this.msieInlineBlockAlignBug && (f = this.Em(n.getHD(e.parentNode).d - i)), e.isBox || e.className == "mspace" ? (e.bbox = {
h: t * e.scale,
d: i * e.scale,
w: s * e.scale,
rw: s * e.scale,
lw: 0
}, e.style.height = u, e.style.verticalAlign = f) : e = this.addElement(e, "span", {
style: {
height: u,
verticalAlign: f
}
}), s >= 0 ? (e.style.width = this.Em(s), e.style.display = "inline-block") : (this.msieNegativeSpaceBug && (e.style.height = ""), e.style.marginLeft = this.Em(s), n.safariNegativeSpaceBug && e.parentNode.firstChild == e && this.createBlank(e, 0, !0)), o && o !== r.COLOR.TRANSPARENT && (e.style.backgroundColor = o), e;
},
createRule: function(e, t, r, i, s) {
var o = n.TeX.min_rule_thickness;
i > 0 && i * this.em < o && (i = o / this.em);
if (t + r > 0 && (t + r) * this.em < o) {
var u = 1 / (t + r) * (o / this.em);
t *= u, r *= u;
}
s ? s = "solid " + s : s = "solid", s = this.Em(i) + " " + s;
var a = this.Em(t + r), f = this.Em(-r), l = this.addElement(e, "span", {
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
lw: 0
},
noAdjust: !0
});
i > 0 && l.offsetWidth == 0 && (l.style.width = this.Em(i));
if (e.isBox || e.className == "mspace") e.bbox = l.bbox;
return l;
},
createFrame: function(e, t, n, r, i, s) {
var o = this.msieBorderWidthBug ? 0 : 2 * i, u = this.Em(t + n - o), a = this.Em(-n - i), f = this.Em(r - o), l = this.Em(i) + " " + s, c = this.addElement(e, "span", {
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
lw: 0
},
noAdjust: !0
});
return a && (c.style.verticalAlign = a), c;
},
createStack: function(e, t, n) {
this.msiePaddingWidthBug && this.createStrut(e, 0);
var r = String(n).match(/%$/), i = !r && n != null ? n : 0;
return e = this.addElement(e, "span", {
noAdjust: !0,
style: {
display: "inline-block",
position: "relative",
width: r ? "100%" : this.Em(i),
height: 0
}
}), t || (e.parentNode.bbox = e.bbox = {
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
isBox: !0
});
return t != null && (n.style.width = t), n;
},
addBox: function(e, t) {
return t.style.position = "absolute", t.isBox = !0, e.appendChild(t);
},
placeBox: function(e, t, r, i) {
var s = e.parentNode, o = e.bbox, u = s.bbox;
this.msiePlaceBoxBug && this.addText(e, this.NBSP), this.imgSpaceBug && this.addText(e, this.imgSpace);
var a = e.offsetHeight / this.em + 1, f = 0;
e.noAdjust ? a -= 1 : this.msieInlineBlockAlignBug ? this.addElement(e, "img", {
className: "MathJax_strut",
border: 0,
src: "about:blank",
style: {
width: 0,
height: this.Em(a)
}
}) : this.addElement(e, "span", {
style: {
display: "inline-block",
width: 0,
height: this.Em(a)
}
}), e.style.top = this.Em(-r - a), e.style.left = this.Em(t + f);
if (o) {
this.negativeSkipBug && (o.lw < 0 && (f = o.lw, n.createBlank(e, -f, !0), v = 0), o.rw > o.w && n.createBlank(e, o.rw - o.w + .1));
if (!this.msieClipRectBug && !o.noclip && !i) {
var l = 3 / this.em, c = o.H == null ? o.h : o.H, h = o.D == null ? o.d : o.D, p = a - c - l, d = a + h + l, v = o.lw - 3 * l, m = 1e3;
o.isFixed && (m = o.width - v), e.style.clip = "rect(" + this.Em(p) + " " + this.Em(m) + " " + this.Em(d) + " " + this.Em(v) + ")";
}
}
o && u && (o.H != null && (u.H == null || o.H + r > u.H) && (u.H = o.H + r), o.D != null && (u.D == null || o.D - r > u.D) && (u.D = o.D - r), o.h + r > u.h && (u.h = o.h + r), o.d - r > u.d && (u.d = o.d - r), u.H != null && u.H <= u.h && delete u.H, u.D != null && u.D <= u.d && delete u.D, o.w + t > u.w && (u.w = o.w + t, u.width == null && (s.style.width = this.Em(u.w))), o.rw + t > u.rw && (u.rw = o.rw + t), o.lw + t < u.lw && (u.lw = o.lw + t), o.width != null && !o.isFixed && (u.width == null && (s.style.width = u.width = "100%"), e.style.width = o.width));
},
alignBox: function(e, n, r) {
this.placeBox(e, 0, r);
var i = e.bbox;
if (i.isMultiline) return;
var s = i.width != null && !i.isFixed, o = 0, u = -i.w / 2, a = "50%";
this.negativeSkipBug && (o = i.w - i.rw - .1, u += i.lw), u = this.Em(u * this.msieMarginScale), s && (u = "", a = 50 - parseFloat(i.width) / 2 + "%"), t.Insert(e.style, {
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
typeof t == "number" ? (e.style.width = this.Em(Math.max(0, t)), e.bbox && (e.bbox.w = t), e.parentNode.bbox && (e.parentNode.bbox.w = t)) : (e.style.width = e.parentNode.style.width = "100%", e.bbox && (e.bbox.width = t), e.parentNode.bbox && (e.parentNode.bbox.width = t));
},
createDelimiter: function(e, t, n, i, s) {
if (!t) {
e.bbox = {
h: 0,
d: 0,
w: this.TeX.nulldelimiterspace,
lw: 0
}, e.bbox.rw = e.bbox.w, this.createSpace(e, e.bbox.h, e.bbox.d, e.bbox.w);
return;
}
i || (i = 1), n instanceof Array || (n = [ n, n ]);
var o = n[1];
n = n[0];
var u = {
alias: t
};
while (u.alias) t = u.alias, u = this.FONTDATA.DELIMITERS[t], u || (u = {
HW: [ 0, this.FONTDATA.VARIANT[r.VARIANT.NORMAL] ]
});
for (var f = 0, l = u.HW.length; f < l; f++) if (u.HW[f][0] * i >= n - .01 || f == l - 1 && !u.stretch) {
u.HW[f][2] && (i *= u.HW[f][2]), u.HW[f][3] && (t = u.HW[f][3]);
var c = this.addElement(e, "span");
this.createChar(c, [ t, u.HW[f][1] ], i, s), e.bbox = c.bbox, e.offset = .65 * e.bbox.w, e.scale = i;
return;
}
u.stretch && this["extendDelimiter" + u.dir](e, o, u.stretch, i, s);
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
this.placeBox(o, 0, h, !0), h -= o.bbox.d, n.mid && (f = this.createBox(s), this.createChar(f, n.mid, r, i), c += f.bbox.h + f.bbox.d);
if (t > c) {
a = this.Element("span"), this.createChar(a, n.ext, r, i);
var p = a.bbox.h + a.bbox.d, d = p - .05, v, m, g = n.mid ? 2 : 1;
m = v = Math.ceil((t - c) / (g * d)), n.fullExtenders || (d = (t - c) / (g * v));
var y = v / (v + 1) * (p - d);
d = p - y, h += y + d - a.bbox.h;
while (g-- > 0) {
while (v-- > 0) this.msieCloneNodeBug ? (l = this.Element("span"), this.createChar(l, n.ext, r, i)) : l = a.cloneNode(!0), h -= d, this.placeBox(this.addBox(s, l), 0, h, !0);
h += y - a.bbox.d, n.mid && g && (this.placeBox(f, 0, h - f.bbox.h, !0), v = m, h += -(f.bbox.h + f.bbox.d) + y + d - a.bbox.h);
}
} else h += (c - t) / 2, n.mid && (this.placeBox(f, 0, h - f.bbox.h, !0), h += -(f.bbox.h + f.bbox.d)), h += (c - t) / 2;
this.placeBox(u, 0, h - u.bbox.h, !0), h -= u.bbox.h + u.bbox.d, e.bbox = {
w: Math.max(o.bbox.w, a.bbox.w, u.bbox.w, f.bbox.w),
lw: Math.min(o.bbox.lw, a.bbox.lw, u.bbox.lw, f.bbox.lw),
rw: Math.max(o.bbox.rw, a.bbox.rw, u.bbox.rw, f.bbox.rw),
h: 0,
d: -h
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
n.mid && (f = this.createBox(s), this.createChar(f, n.mid, r, i), c += f.bbox.w);
if (t > c) {
var d = a.bbox.rw - a.bbox.lw, v = d - .05, m, g, y = n.mid ? 2 : 1;
g = m = Math.ceil((t - c) / (y * v)), v = (t - c) / (y * m), p = m / (m + 1) * (d - v), v = d - p, h -= a.bbox.lw + p;
while (y-- > 0) {
while (m-- > 0) this.msieCloneNodeBug ? (l = this.Element("span"), this.createChar(l, n.rep, r, i)) : l = a.cloneNode(!0), this.placeBox(this.addBox(s, l), h, 0, !0), h += v;
n.mid && y && (this.placeBox(f, h, 0, !0), h += f.bbox.w - p, m = g);
}
} else p = Math.min(c - t, o.bbox.w / 2), h -= p / 2, n.mid && (this.placeBox(f, h, 0, !0), h += f.bbox.w), h -= p / 2;
this.placeBox(u, h, 0, !0), e.bbox = {
w: h + u.bbox.rw,
lw: 0,
rw: h + u.bbox.rw,
H: Math.max(o.bbox.h, a.bbox.h, u.bbox.h, f.bbox.h),
D: Math.max(o.bbox.d, a.bbox.d, u.bbox.d, f.bbox.d),
h: a.bbox.h,
d: a.bbox.d
}, e.scale = r, e.isMultiChar = !0, this.setStackWidth(s, e.bbox.w);
},
createChar: function(e, t, i, s) {
var o = e, u = "", f = {
fonts: [ t[1] ],
noRemap: !0
};
s && s === r.VARIANT.BOLD && (f.fonts = [ t[1] + "-bold", t[1] ]), typeof t[1] != "string" && (f = t[1]);
if (t[0] instanceof Array) for (var l = 0, c = t[0].length; l < c; l++) u += String.fromCharCode(t[0][l]); else u = String.fromCharCode(t[0]);
i !== 1 ? (o = this.addElement(e, "span", {
style: {
fontSize: this.Percent(i)
},
scale: i
}), this.handleVariant(o, f, u), e.bbox = o.bbox) : this.handleVariant(e, f, u), t[2] && (e.style.marginLeft = this.Em(t[2])), this.AccentBug && e.bbox.w === 0 && (o.firstChild.nodeValue += this.NBSP, n.createSpace(e, 0, 0, -e.offsetWidth / n.em));
},
positionDelimiter: function(e, t) {
t -= e.bbox.h, e.bbox.d -= t, e.bbox.h += t, t && (this.safariVerticalAlignBug || this.msieVerticalAlignBug || this.konquerorVerticalAlignBug || this.operaVerticalAlignBug && e.isMultiChar ? (e.firstChild.style.display === "" && e.style.top !== "" && (e = e.firstChild, t -= parseFloat(e.style.top)), e.style.position = "relative", e.style.top = this.Em(-t)) : (e.style.verticalAlign = this.Em(t), n.ffVerticalAlignBug && n.createRule(e.parentNode, e.bbox.h, 0, 0)));
},
handleVariant: function(e, t, n) {
var i = "", s, o, u, f, l, c, h = e;
if (n.length === 0) return;
e.bbox || (e.bbox = {
w: 0,
h: -this.BIGDIMEN,
d: -this.BIGDIMEN,
rw: -this.BIGDIMEN,
lw: this.BIGDIMEN
}), t || (t = this.FONTDATA.VARIANT[r.VARIANT.NORMAL]), c = t;
for (var p = 0, d = n.length; p < d; p++) {
t = c, s = n.charCodeAt(p), o = n.charAt(p);
if (o === this.PLANE1) {
p++, s = n.charCodeAt(p) + 119808 - 56320;
if (this.FONTDATA.RemapPlane1) {
var v = this.FONTDATA.RemapPlane1(s, t);
s = v.n, t = v.variant;
}
} else {
var m, g, y = this.FONTDATA.RANGES;
for (m = 0, g = y.length; m < g; m++) {
if (y[m].name === "alpha" && t.noLowerCase) continue;
var b = t["offset" + y[m].offset];
if (b && s >= y[m].low && s <= y[m].high) {
y[m].remap && y[m].remap[s] ? s = b + y[m].remap[s] : (s = s - y[m].low + b, y[m].add && (s += y[m].add)), t["variant" + y[m].offset] && (t = this.FONTDATA.VARIANT[t["variant" + y[m].offset]]);
break;
}
}
}
if (t.remap && t.remap[s]) if (t.remap[s] instanceof Array) {
var w = t.remap[s];
s = w[0], t = this.FONTDATA.VARIANT[w[1]];
} else s = t.remap[s], t.remap.variant && (t = this.FONTDATA.VARIANT[t.remap.variant]);
this.FONTDATA.REMAP[s] && !t.noRemap && (s = this.FONTDATA.REMAP[s]), u = this.lookupChar(t, s), o = u[s], t !== l && !o[5].img && (i.length && (this.addText(h, i), i = ""), h = e, l = f, t !== l && (l ? h = this.addElement(e, "span") : f = t), this.handleFont(h, u, h !== e), l = t), i = this.handleChar(h, u, o, s, i), o[0] / 1e3 > e.bbox.h && (e.bbox.h = o[0] / 1e3), o[1] / 1e3 > e.bbox.d && (e.bbox.d = o[1] / 1e3), e.bbox.w + o[3] / 1e3 < e.bbox.lw && (e.bbox.lw = e.bbox.w + o[3] / 1e3), e.bbox.w + o[4] / 1e3 > e.bbox.rw && (e.bbox.rw = e.bbox.w + o[4] / 1e3), e.bbox.w += o[2] / 1e3;
}
i.length && this.addText(h, i), e.scale && e.scale !== 1 && (e.bbox.h *= e.scale, e.bbox.d *= e.scale, e.bbox.w *= e.scale, e.bbox.lw *= e.scale, e.bbox.rw *= e.scale), n.length == 1 && u.skew && u.skew[s] && (e.bbox.skew = u.skew[s]);
},
handleFont: function(e, t, r) {
e.style.fontFamily = t.family;
if (!n.FontFaceBug || !t.isWebFont) {
var i = t.style || "normal", s = t.weight || "normal";
if (i !== "normal" || r) e.style.fontStyle = i;
if (s !== "normal" || r) e.style.fontWeight = s;
}
},
handleChar: function(e, t, r, i, s) {
var o = r[5];
if (o.img) return this.handleImg(e, t, r, i, s);
if (o.isUnknown && this.FONTDATA.DELIMITERS[i]) {
s.length && this.addText(e, s);
var u = e.scale;
return n.createDelimiter(e, i, 0, 1, t), e.scale = u, r[0] = e.bbox.h * 1e3, r[1] = e.bbox.d * 1e3, r[2] = e.bbox.w * 1e3, r[3] = e.bbox.lw * 1e3, r[4] = e.bbox.rw * 1e3, "";
}
return o.c == null && (i <= 65535 ? o.c = String.fromCharCode(i) : o.c = this.PLANE1 + String.fromCharCode(i - 119808 + 56320)), r[2] || !this.msieAccentBug || s.length ? s + o.c : (n.createShift(e, r[3] / 1e3), n.createShift(e, (r[4] - r[3]) / 1e3), this.addText(e, o.c), n.createShift(e, -r[4] / 1e3), "");
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
var a = e.defaultFont || {
family: n.config.undefinedFamily
};
return e.bold && (a.weight = "bold"), e.italic && (a.style = "italic"), a[t] = [ 800, 200, 500, 0, 500, {
isUnknown: !0
} ], a;
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
PLANE1: String.fromCharCode(55349),
NBSP: String.fromCharCode(160),
rfuzz: 0
}), MathJax.Hub.Register.StartupHook("mml Jax Ready", function() {
r = MathJax.ElementJax.mml, r.mbase.Augment({
toHTML: function(e) {
var t = this.HTMLlineBreaks();
if (t.length > 2) return this.toHTMLmultiline(e, t);
e = this.HTMLcreateSpan(e), this.type != "mrow" && (e = this.HTMLhandleSize(e));
for (var n = 0, r = this.data.length; n < r; n++) this.data[n] && this.data[n].toHTML(e);
var i = this.HTMLcomputeBBox(e), s = e.bbox.h, o = e.bbox.d;
for (n = 0, r = i.length; n < r; n++) i[n].HTMLstretchV(e, s, o);
return i.length && this.HTMLcomputeBBox(e, !0), this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLlineBreaks: function() {
var e = [ [ 0, this ] ];
for (var t = 0, n = this.data.length; t < n; t++) if (this.data[t]) {
var r = this.data[t].lineBreak();
if (r !== "none") {
var i = r === "after" ? t + 1 : t;
e.length === 0 || e[e.length - 1] !== i ? e.push([ i, this.data[t] ]) : e[e.length - 1] = [ i, this.data[t] ];
}
}
return e.push([ this.data.length, e[e.length - 1][1] ]), e;
},
toHTMLmultiline: function(e) {
r.mbase.HTMLautoloadFile("multiline");
},
HTMLcomputeBBox: function(e, t, n, r) {
n == null && (n = 0), r == null && (r = this.data.length);
var i = e.bbox = {}, s = [];
while (n < r) {
var o = this.data[n];
if (!o) continue;
!t && o.HTMLcanStretch("Vertical") && (s.push(o), o = o.CoreMO() || o), this.HTMLcombineBBoxes(o, i), n++;
}
return this.HTMLcleanBBox(i), s;
},
HTMLcombineBBoxes: function(e, t) {
t.w == null && this.HTMLemptyBBox(t);
var n = e.HTMLspanElement();
if (!n || !n.bbox) return;
var r = n.bbox;
r.d > t.d && (t.d = r.d), r.h > t.h && (t.h = r.h), r.D != null && r.D > t.D && (t.D = r.D), r.H != null && r.H > t.H && (t.H = r.H), n.style.paddingLeft && (t.w += parseFloat(n.style.paddingLeft) * (n.scale || 1)), t.w + r.lw < t.lw && (t.lw = t.w + r.lw), t.w + r.rw > t.rw && (t.rw = t.w + r.rw), t.w += r.w, n.style.paddingRight && (t.w += parseFloat(n.style.paddingRight) * (n.scale || 1)), r.width && (t.width = r.width);
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
return this.isEmbellished() ? this.Core().HTMLcanStretch(e) : !1;
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
this.data[e] != null ? n.Measured(this.data[e].toHTML(t), t) : t.bbox = this.HTMLzeroBBox();
},
HTMLcreateSpan: function(e) {
if (this.spanID) {
var t = this.HTMLspanElement();
if (t) {
while (t.firstChild) t.removeChild(t.firstChild);
return t.bbox = {
w: 0,
h: 0,
d: 0,
lw: 0,
rw: 0
}, t.scale = 1, t.isMultChar = null, t.style.cssText = "", t;
}
}
return this.href && (e = n.addElement(e, "a", {
href: this.href
})), e = n.addElement(e, "span", {
className: this.type
}), n.imgHeightBug && (e.style.display = "inline-block"), this["class"] != null && (e.className += " " + this["class"]), this.style && (e.style.cssText = this.style, e.style.fontSize && (this.mathsize = e.style.fontSize, e.style.fontSize = "")), this.spanID = n.GetID(), e.id = (this.id || "MathJax-Span-" + this.spanID) + n.idPostfix, e.bbox = {
w: 0,
h: 0,
d: 0,
lw: 0,
lr: 0
}, this.href && (e.parentNode.bbox = e.bbox), e;
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
this.mathbackground && (t.mathbackground = this.mathbackground), this.background && (t.background = this.background), this.style && e.style.backgroundColor && (t.mathbackground = e.style.backgroundColor, e.style.backgroundColor = "transparent"), t.color && !this.mathcolor && (t.mathcolor = t.color), t.background && !this.mathbackground && (t.mathbackground = t.background), t.mathcolor && (e.style.color = t.mathcolor);
if (t.mathbackground && t.mathbackground !== r.COLOR.TRANSPARENT) {
var i = 1 / n.em, s = 0, o = 0;
this.isToken && (s = e.bbox.lw, o = e.bbox.rw - e.bbox.w), e.style.paddingLeft !== "" && (s += parseFloat(e.style.paddingLeft) * (e.scale || 1)), e.style.paddingRight !== "" && (o -= parseFloat(e.style.paddingRight) * (e.scale || 1));
var u = Math.max(0, n.getW(e) + (n.PaddingWidthBug ? 0 : o - s));
n.msieCharPaddingWidthBug && e.style.paddingLeft !== "" && (u += parseFloat(e.style.paddingLeft) * (e.scale || 1));
var f = e.bbox.h + e.bbox.d, l = -e.bbox.d;
u > 0 && (u += 2 * i, s -= i), f > 0 && (f += 2 * i, l -= i), o = -u - s;
var c = n.Element("span", {
id: "MathJax-Color-" + this.spanID + n.idPostfix,
style: {
display: "inline-block",
backgroundColor: t.mathbackground,
width: n.Em(u),
height: n.Em(f),
verticalAlign: n.Em(l),
marginLeft: n.Em(s),
marginRight: n.Em(o)
}
});
return n.msieInlineBlockAlignBug && (c.style.position = "relative", c.style.width = c.style.height = 0, c.style.verticalAlign = c.style.marginLeft = c.style.marginRight = "", n.placeBox(n.addElement(c, "span", {
noAdjust: !0,
style: {
display: "inline-block",
position: "absolute",
overflow: "hidden",
width: n.Em(u),
height: n.Em(f),
background: t.mathbackground
}
}), s, e.bbox.h + i)), e.parentNode.insertBefore(c, e), n.msieColorPositionBug && (e.style.position = "relative"), c;
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
t.lspace = Math.max(0, n.length2em(t.lspace)), t.rspace = Math.max(0, n.length2em(t.rspace));
var r = this, i = this.Parent();
while (i && i.isEmbellished() && i.Core() === r) r = i, i = i.Parent(), e = r.HTMLspanElement();
t.lspace && (e.style.paddingLeft = n.Em(t.lspace)), t.rspace && (e.style.paddingRight = n.Em(t.rspace));
}
} else {
var s = this.texSpacing();
s !== "" && (s = n.length2em(s) / (e.scale || 1), e.style.paddingLeft && (s += parseFloat(e.style.paddingLeft)), e.style.paddingLeft = n.Em(s));
}
},
HTMLgetScale: function() {
var e = 1, t = this.getValues("mathsize", "scriptlevel", "fontsize", "scriptminsize");
if (this.style) {
var r = this.HTMLspanElement();
r.style.fontSize != "" && (t.fontsize = r.style.fontSize);
}
return t.fontsize && !this.mathsize && (t.mathsize = t.fontsize), t.scriptlevel !== 0 && (t.scriptlevel > 2 && (t.scriptlevel = 2), e = Math.pow(this.Get("scriptsizemultiplier"), t.scriptlevel), t.scriptminsize = n.length2em(t.scriptminsize), e < t.scriptminsize && (e = t.scriptminsize)), e *= n.length2em(t.mathsize), e;
},
HTMLgetVariant: function() {
var e = this.getValues("mathvariant", "fontfamily", "fontweight", "fontstyle");
if (this.style) {
var t = this.HTMLspanElement();
t.style.fontFamily && (e.fontfamily = t.style.fontFamily), t.style.fontWeight && (e.fontweight = t.style.fontWeight), t.style.fontStyle && (e.fontStyle = t.style.fontStyle);
}
var i = e.mathvariant;
return this.variantForm && (i = "-" + n.fontInUse + "-variant"), e.fontfamily && !this.mathvariant ? (!e.fontweight && e.mathvariant.match(/bold/) && (e.fontweight = "bold"), !e.fontstyle && e.mathvariant.match(/italic/) && (e.fontstyle = "italic"), {
FONTS: [],
fonts: [],
noRemap: !0,
defaultFont: {
family: e.fontfamily,
style: e.fontstyle,
weight: e.fontweight
}
}) : (e.fontweight === "bold" ? i = {
normal: r.VARIANT.BOLD,
italic: r.VARIANT.BOLDITALIC,
fraktur: r.VARIANT.BOLDFRAKTUR,
script: r.VARIANT.BOLDSCRIPT,
"sans-serif": r.VARIANT.BOLDSANSSERIF,
"sans-serif-italic": r.VARIANT.SANSSERIFBOLDITALIC
}[i] || i : e.fontweight === "normal" && (i = {
bold: r.VARIANT.normal,
"bold-italic": r.VARIANT.ITALIC,
"bold-fraktur": r.VARIANT.FRAKTUR,
"bold-script": r.VARIANT.SCRIPT,
"bold-sans-serif": r.VARIANT.SANSSERIF,
"sans-serif-bold-italic": r.VARIANT.SANSSERIFITALIC
}[i] || i), e.fontstyle === "italic" ? i = {
normal: r.VARIANT.ITALIC,
bold: r.VARIANT.BOLDITALIC,
"sans-serif": r.VARIANT.SANSSERIFITALIC,
"bold-sans-serif": r.VARIANT.SANSSERIFBOLDITALIC
}[i] || i : e.fontstyle === "normal" && (i = {
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
toHTML: function(e, t) {
this.HTMLhandleVariant(e, t, this.data.join("").replace(/[\u2061-\u2064]/g, ""));
}
}), r.entity.Augment({
toHTML: function(e, t) {
this.HTMLhandleVariant(e, t, this.toString().replace(/[\u2061-\u2064]/g, ""));
}
}), r.mi.Augment({
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
var t = this.data.join(""), r = this.HTMLgetVariant(), i = this.getValues("largeop", "displaystyle");
i.largeop && (r = n.FONTDATA.VARIANT[i.displaystyle ? "-largeOp" : "-smallOp"]);
for (var s = 0, o = this.data.length; s < o; s++) this.data[s] && this.data[s].toHTML(e, r);
e.bbox || (e.bbox = {
w: 0,
h: 0,
d: 0,
rw: 0,
lw: 0
}), t.length !== 1 && delete e.bbox.skew, n.AccentBug && e.bbox.w === 0 && t.length === 1 && e.firstChild && (e.firstChild.nodeValue += n.NBSP, n.createSpace(e, 0, 0, -e.offsetWidth / n.em));
if (i.largeop) {
var u = (e.bbox.h - e.bbox.d) / 2 - n.TeX.axis_height * e.scale;
n.safariVerticalAlignBug && e.lastChild.nodeName === "IMG" ? e.lastChild.style.verticalAlign = n.Em(parseFloat(e.lastChild.style.verticalAlign || 0) / n.em - u / e.scale) : n.konquerorVerticalAlignBug && e.lastChild.nodeName === "IMG" ? (e.style.position = "relative", e.lastChild.style.position = "relative", e.lastChild.style.top = n.Em(u / e.scale)) : e.style.verticalAlign = n.Em(-u / e.scale), e.bbox.h -= u, e.bbox.d += u, e.bbox.rw > e.bbox.w && (e.bbox.ic = e.bbox.rw - e.bbox.w, n.createBlank(e, e.bbox.ic), e.bbox.w = e.bbox.rw);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLcanStretch: function(e) {
if (!this.Get("stretchy")) return !1;
var t = this.data.join("");
return t.length > 1 ? !1 : (t = n.FONTDATA.DELIMITERS[t.charCodeAt(0)], t && t.dir == e.substr(0, 1));
},
HTMLstretchV: function(e, t, r) {
this.HTMLremoveColor();
var i = this.getValues("symmetric", "maxsize", "minsize"), s = this.HTMLspanElement(), o, u = n.TeX.axis_height, a = s.scale;
return i.symmetric ? o = 2 * Math.max(t - u, r + u) : o = t + r, i.maxsize = n.length2em(i.maxsize, s.bbox.h + s.bbox.d), i.minsize = n.length2em(i.minsize, s.bbox.h + s.bbox.d), o = Math.max(i.minsize, Math.min(i.maxsize, o)), s = this.HTMLcreateSpan(e), n.createDelimiter(s, this.data.join("").charCodeAt(0), o, a), i.symmetric ? o = (s.bbox.h + s.bbox.d) / 2 + u : o = (s.bbox.h + s.bbox.d) * t / (t + r), n.positionDelimiter(s, o), this.HTMLhandleSpace(s), this.HTMLhandleColor(s), s;
},
HTMLstretchH: function(e, t) {
this.HTMLremoveColor();
var i = this.getValues("maxsize", "minsize", "mathvariant", "fontweight");
i.fontweight === "bold" && !this.mathvariant && (i.mathvariant = r.VARIANT.BOLD);
var s = this.HTMLspanElement(), o = s.scale;
return i.maxsize = n.length2em(i.maxsize, s.bbox.w), i.minsize = n.length2em(i.minsize, s.bbox.w), t = Math.max(i.minsize, Math.min(i.maxsize, t)), s = this.HTMLcreateSpan(e), n.createDelimiter(s, this.data.join("").charCodeAt(0), t, o, i.mathvariant), this.HTMLhandleSpace(s), this.HTMLhandleColor(s), s;
}
}), r.mtext.Augment({
toHTML: function(e) {
e = this.HTMLhandleSize(this.HTMLcreateSpan(e)), e.bbox = null;
if (this.Parent().type === "merror") {
n.addText(e, this.data.join(""));
var t = n.getHD(e), r = n.getW(e);
e.bbox = {
h: t.h,
d: t.d,
w: r,
lw: 0,
rw: r
};
} else {
var i = this.HTMLgetVariant();
for (var s = 0, o = this.data.length; s < o; s++) this.data[s] && this.data[s].toHTML(e, i);
e.bbox || (e.bbox = {
w: 0,
h: 0,
d: 0,
rw: 0,
lw: 0
}), this.data.join("").length !== 1 && delete e.bbox.skew;
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
}
}), r.ms.Augment({
toHTML: r.mbase.HTMLautoload
}), r.mglyph.Augment({
toHTML: r.mbase.HTMLautoload
}), r.mspace.Augment({
toHTML: function(e) {
e = this.HTMLhandleSize(this.HTMLcreateSpan(e));
var t = this.getValues("height", "depth", "width");
t.mathbackground = this.mathbackground, this.background && !this.mathbackground && (t.mathbackground = this.background);
var r = n.length2em(t.height), i = n.length2em(t.depth), s = n.length2em(t.width);
return n.createSpace(e, r, i, s, t.mathbackground), e;
}
}), r.mphantom.Augment({
toHTML: function(e, t, r) {
e = this.HTMLcreateSpan(e);
if (this.data[0] != null) {
var i = n.Measured(this.data[0].toHTML(e), e);
r != null ? n.Remeasured(this.data[0].HTMLstretchV(e, t, r), e) : t != null && n.Remeasured(this.data[0].HTMLstretchH(e, t), e), e.bbox = {
w: i.bbox.w,
h: i.bbox.h,
d: i.bbox.d,
lw: 0,
rw: 0
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
var i = n.createStack(e, !0), s = n.createBox(i);
n.Measured(this.data[0].toHTML(s), s), r != null ? n.Remeasured(this.data[0].HTMLstretchV(s, t, r), s) : t != null && n.Remeasured(this.data[0].HTMLstretchH(s, t), s);
var o = this.getValues("height", "depth", "width", "lspace", "voffset"), u = 0, a = 0;
o.lspace && (u = this.HTMLlength2em(s, o.lspace)), o.voffset && (a = this.HTMLlength2em(s, o.voffset)), n.placeBox(s, u, a), e.bbox = {
h: s.bbox.h,
d: s.bbox.d,
w: s.bbox.w,
lw: Math.min(0, s.bbox.lw + u),
rw: Math.max(s.bbox.w, s.bbox.rw + u),
H: Math.max(s.bbox.H == null ? -n.BIGDIMEN : s.bbox.H, s.bbox.h + a),
D: Math.max(s.bbox.D == null ? -n.BIGDIMEN : s.bbox.D, s.bbox.d - a)
}, o.height !== "" && (e.bbox.h = this.HTMLlength2em(s, o.height, "h", 0)), o.depth !== "" && (e.bbox.d = this.HTMLlength2em(s, o.depth, "d", 0)), o.width !== "" && (e.bbox.w = this.HTMLlength2em(s, o.width, "w", 0)), e.bbox.H <= e.bbox.h && delete e.bbox.H, e.bbox.D <= e.bbox.d && delete e.bbox.D, n.setStackWidth(i, e.bbox.w);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLlength2em: function(e, t, r, i) {
i == null && (i = -n.BIGDIMEN);
var s = String(t).match(/width|height|depth/), o = s ? e.bbox[s[0].charAt(0)] : r ? e.bbox[r] : null, u = n.length2em(t, o);
return r && String(t).match(/^\s*[-+]/) ? Math.max(i, e.bbox[r] + u) : u;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.mrow.Augment({
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
toHTML: function(e) {
return this.data[0] != null && (e = this.data[0].toHTML(e), this.spanID = this.data[0].spanID, this.HTMLhandleSpace(e), this.HTMLhandleColor(e)), e;
},
HTMLspanElement: function() {
return this.data[0] != null ? this.data[0].HTMLspanElement() : null;
},
HTMLstretchH: function(e, t) {
return this.data[0] != null ? this.data[0].HTMLstretchH(e, t) : e;
},
HTMLstretchV: function(e, t, n) {
return this.data[0] != null ? this.data[0].HTMLstretchV(e, t, n) : e;
}
}), r.mfrac.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e);
var t = n.createStack(e), r = n.createBox(t), i = n.createBox(t);
this.HTMLmeasureChild(0, r), this.HTMLmeasureChild(1, i);
var s = this.getValues("displaystyle", "linethickness", "numalign", "denomalign", "bevelled"), o = this.HTMLgetScale(), u = s.displaystyle, a = n.TeX.axis_height * o;
if (s.bevelled) {
var f = u ? .4 : .15, l = Math.max(r.bbox.h + r.bbox.d, i.bbox.h + i.bbox.d) + 2 * f, c = n.createBox(t);
n.createDelimiter(c, 47, l), n.placeBox(r, 0, (r.bbox.d - r.bbox.h) / 2 + a + f), n.placeBox(c, r.bbox.w - f / 2, (c.bbox.d - c.bbox.h) / 2 + a), n.placeBox(i, r.bbox.w + c.bbox.w - f, (i.bbox.d - i.bbox.h) / 2 + a - f);
} else {
var h = Math.max(r.bbox.w, i.bbox.w), p = n.thickness2em(s.linethickness), d, v, m, g, y = n.TeX.min_rule_thickness / this.em;
u ? (m = n.TeX.num1, g = n.TeX.denom1) : (m = p === 0 ? n.TeX.num3 : n.TeX.num2, g = n.TeX.denom2), m *= o, g *= o;
if (p === 0) d = Math.max((u ? 7 : 3) * n.TeX.rule_thickness, 2 * y), v = m - r.bbox.d - (i.bbox.h - g), v < d && (m += (d - v) / 2, g += (d - v) / 2); else {
d = Math.max((u ? 2 : 0) * y + p, p / 2 + 1.5 * y), v = m - r.bbox.d - (a + p / 2), v < d && (m += d - v), v = a - p / 2 - (i.bbox.h - g), v < d && (g += d - v);
var b = n.createBox(t);
n.createRule(b, p, 0, h + 2 * p), n.placeBox(b, 0, a - p / 2);
}
n.alignBox(r, s.numalign, m), n.alignBox(i, s.denomalign, -g);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLcanStretch: function(e) {
return !1;
},
HTMLhandleSpace: function(e) {
if (!this.texWithDelims) {
var t = (this.useMMLspacing ? 0 : n.length2em(this.texSpacing() || 0)) + .12;
e.style.paddingLeft = n.Em(t), e.style.paddingRight = ".12em";
}
}
}), r.msqrt.Augment({
toHTML: function(e) {
e = this.HTMLcreateSpan(e);
var t = n.createStack(e), r = n.createBox(t), i = n.createBox(t), s = n.createBox(t);
this.HTMLmeasureChild(0, r);
var o = this.HTMLgetScale(), u = n.TeX.rule_thickness * o, a, f, l, c;
this.Get("displaystyle") ? a = n.TeX.x_height * o : a = u, f = Math.max(u + a / 4, 1.5 * n.TeX.min_rule_thickness / this.em), l = r.bbox.h + r.bbox.d + f + u, c = r.bbox.w, n.createDelimiter(s, 8730, l, o), n.Measured(s);
var h = 0;
if (s.isMultiChar || n.AdjustSurd && n.imgFonts) s.bbox.w *= .95;
s.bbox.h + s.bbox.d > l && (f = (s.bbox.h + s.bbox.d - (l - u)) / 2);
var p = n.FONTDATA.DELIMITERS[n.FONTDATA.RULECHAR];
return !p || c < p.HW[0][0] * o || o < .75 ? n.createRule(i, u, 0, c) : n.createDelimiter(i, n.FONTDATA.RULECHAR, c, o), l = r.bbox.h + f + u, h = this.HTMLaddRoot(t, s, h, s.bbox.h + s.bbox.d - l, o), n.placeBox(s, h, l - s.bbox.h), n.placeBox(i, h + s.bbox.w, l - i.bbox.h + n.rfuzz), n.placeBox(r, h + s.bbox.w, 0), this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
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
toHTML: function(e) {
return this.data[0] != null && (e = this.data[0].toHTML(e), this.spanID = this.data[0].spanID, this.HTMLhandleSpace(e)), e;
},
HTMLspanElement: function() {
return this.data[0] != null ? this.data[0].HTMLspanElement() : null;
},
HTMLstretchH: function(e, t) {
return this.data[0] != null ? this.data[0].HTMLstretchH(e, t) : e;
},
HTMLstretchV: function(e, t, n) {
return this.data[0] != null ? this.data[0].HTMLstretchV(e, t, n) : e;
}
}), r.munderover.Augment({
toHTML: function(e, t, i) {
var s = this.getValues("displaystyle", "accent", "accentunder", "align");
if (!s.displaystyle && this.data[this.base] != null && this.data[this.base].Get("movablelimits")) return r.msubsup.prototype.toHTML.call(this, e);
e = this.HTMLcreateSpan(e);
var o = this.HTMLgetScale(), u = n.createStack(e), f = [], l = [], c, h, p, d = -n.BIGDIMEN, v = d;
for (h = 0, p = this.data.length; h < p; h++) this.data[h] != null && (c = f[h] = n.createBox(u), n.Measured(this.data[h].toHTML(c), c), h == this.base ? (i != null ? n.Remeasured(this.data[this.base].HTMLstretchV(c, t, i), c) : t != null && n.Remeasured(this.data[this.base].HTMLstretchH(c, t), c), l[h] = i == null && t != null ? !1 : this.data[h].HTMLcanStretch("Horizontal")) : l[h] = this.data[h].HTMLcanStretch("Horizontal"), c.bbox.w > v && (v = c.bbox.w), !l[h] && v > d && (d = v));
i == null && t != null ? d = t : d == -n.BIGDIMEN && (d = v);
for (h = v = 0, p = this.data.length; h < p; h++) this.data[h] && (c = f[h], l[h] && (c.bbox = this.data[h].HTMLstretchH(c, d).bbox), c.bbox.w > v && (v = c.bbox.w));
var m = n.TeX.rule_thickness, g = n.FONTDATA.TeX_factor, y = f[this.base] || {
bbox: this.HTMLzeroBBox()
}, b = y.bbox.ic || 0, w, E, S, x, T, N, C;
for (h = 0, p = this.data.length; h < p; h++) if (this.data[h] != null) {
c = f[h], T = n.TeX.big_op_spacing5 * o;
var k = h != this.base && s[this.ACCENTS[h]];
k && c.bbox.w <= 1 / n.em + 1e-4 && (c.bbox.w = c.bbox.rw - c.bbox.lw, c.bbox.noclip = !0, c.bbox.lw && !n.zeroWidthBug && c.insertBefore(n.createSpace(c.parentNode, 0, 0, -c.bbox.lw), c.firstChild), n.createBlank(c, 0, 0, c.bbox.rw + .1)), N = {
left: 0,
center: (v - c.bbox.w) / 2,
right: v - c.bbox.w
}[s.align], w = N, E = 0, h == this.over ? (k ? (C = Math.max(m * o * g, 2.5 / this.em), T = 0, y.bbox.skew && (w += y.bbox.skew)) : (S = n.TeX.big_op_spacing1 * o * g, x = n.TeX.big_op_spacing3 * o * g, C = Math.max(S, x - Math.max(0, c.bbox.d))), C = Math.max(C, 1.5 / this.em), w += b, E = y.bbox.h + c.bbox.d + C, c.bbox.h += T) : h == this.under && (k ? (C = 3 * m * o * g, T = 0) : (S = n.TeX.big_op_spacing2 * o * g, x = n.TeX.big_op_spacing4 * o * g, C = Math.max(S, x - c.bbox.h)), C = Math.max(C, 1.5 / this.em), w -= b, E = -(y.bbox.d + c.bbox.h + C), c.bbox.d += T), n.placeBox(c, w, E);
}
return this.HTMLhandleSpace(e), this.HTMLhandleColor(e), e;
},
HTMLstretchH: r.mbase.HTMLstretchH,
HTMLstretchV: r.mbase.HTMLstretchV
}), r.msubsup.Augment({
toHTML: function(e, t, r) {
e = this.HTMLcreateSpan(e);
var i = this.HTMLgetScale(), s = n.createStack(e), o, u = n.createBox(s);
this.HTMLmeasureChild(this.base, u), this.data[this.base] && (r != null ? n.Remeasured(this.data[this.base].HTMLstretchV(u, t, r), u) : t != null && n.Remeasured(this.data[this.base].HTMLstretchH(u, t), u)), n.placeBox(u, 0, 0);
var a = (this.data[this.sup] || this.data[this.sub] || this).HTMLgetScale(), f = n.TeX.x_height * i, l = n.TeX.scriptspace * i * .75, c, h;
this.HTMLnotEmpty(this.data[this.sup]) && (c = n.createBox(s), n.Measured(this.data[this.sup].toHTML(c), c), c.bbox.w += l, c.bbox.rw = Math.max(c.bbox.w, c.bbox.rw)), this.HTMLnotEmpty(this.data[this.sub]) && (h = n.createBox(s), n.Measured(this.data[this.sub].toHTML(h), h), h.bbox.w += l, h.bbox.rw = Math.max(h.bbox.w, h.bbox.rw));
var p = n.TeX.sup_drop * a, d = n.TeX.sub_drop * a, v = u.bbox.h - p, m = u.bbox.d + d, g = 0, y;
u.bbox.ic && (g = u.bbox.ic), this.data[this.base] && (this.data[this.base].type === "mi" || this.data[this.base].type === "mo") && this.data[this.base].data.join("").length === 1 && u.bbox.scale === 1 && !this.data[this.base].Get("largeop") && (v = m = 0);
var b = this.getValues("subscriptshift", "superscriptshift");
b.subscriptshift = b.subscriptshift === "" ? 0 : n.length2em(b.subscriptshift), b.superscriptshift = b.superscriptshift === "" ? 0 : n.length2em(b.superscriptshift);
if (!c) h && (m = Math.max(m, n.TeX.sub1 * i, h.bbox.h - .8 * f, b.subscriptshift), n.placeBox(h, u.bbox.w + l - g, -m, h.bbox)); else if (!h) o = this.getValues("displaystyle", "texprimestyle"), y = n.TeX[o.displaystyle ? "sup1" : o.texprimestyle ? "sup3" : "sup2"], v = Math.max(v, y * i, c.bbox.d + .25 * f, b.superscriptshift), n.placeBox(c, u.bbox.w + l, v, c.bbox); else {
m = Math.max(m, n.TeX.sub2 * i);
var w = n.TeX.rule_thickness * i;
v - c.bbox.d - (h.bbox.h - m) < 3 * w && (m = 3 * w - v + c.bbox.d + h.bbox.h, p = .8 * f - (v - c.bbox.d), p > 0 && (v += p, m -= p)), n.placeBox(c, u.bbox.w + l, Math.max(v, b.superscriptshift)), n.placeBox(h, u.bbox.w + l - g, -Math.max(m, b.subscriptshift));
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
s && i.setAttribute("aria-label", s);
var o = n.addElement(e, "nobr");
e = this.HTMLcreateSpan(o);
var u = n.createStack(e), f = n.createBox(u), l;
u.style.fontSize = o.parentNode.style.fontSize, o.parentNode.style.fontSize = "", this.data[0] != null && (n.msieColorBug && (this.background && (this.data[0].background = this.background, delete this.background), this.mathbackground && (this.data[0].mathbackground = this.mathbackground, delete this.mathbackground)), r.mbase.prototype.displayAlign = t.config.displayAlign, r.mbase.prototype.displayIndent = t.config.displayIndent, l = n.Measured(this.data[0].toHTML(f), f)), n.placeBox(f, 0, 0);
var c = n.em / n.outerEm;
n.em /= c, e.bbox.h *= c, e.bbox.d *= c, e.bbox.w *= c, e.bbox.lw *= c, e.bbox.rw *= c, l && l.bbox.width != null && (u.style.width = l.bbox.width, f.style.width = "100%"), this.HTMLhandleColor(e), l && n.createRule(e, l.bbox.h * c, l.bbox.d * c, 0);
if (!this.isMultiline && this.Get("display") === "block" && e.bbox.width == null) {
var h = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
h.indentalignfirst !== r.INDENTALIGN.INDENTALIGN && (h.indentalign = h.indentalignfirst), h.indentalign === r.INDENTALIGN.AUTO && (h.indentalign = this.displayAlign), i.style.textAlign = h.indentalign, h.indentshiftfirst !== r.INDENTSHIFT.INDENTSHIFT && (h.indentshift = h.indentshiftfirst), h.indentshift === "auto" && (h.indentshift = this.displayIndent), h.indentshift && h.indentalign !== r.INDENTALIGN.CENTER && (e.style[{
left: "marginLeft",
right: "marginRight"
}[h.indentalign]] = n.Em(n.length2em(h.indentshift)));
}
return e;
}
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
var t = e.versionAtLeast("7.0"), r = e.versionAtLeast("8.0") && document.documentMode > 7, i = document.compatMode === "BackCompat";
n.config.styles[".MathJax .MathJax_HitBox"]["background-color"] = "white", n.config.styles[".MathJax .MathJax_HitBox"].opacity = 0, n.config.styles[".MathJax .MathJax_HitBox"].filter = "alpha(opacity=0)", n.Augment({
getMarginScale: n.getMSIEmarginScale,
PaddingWidthBug: !0,
msieEventBug: e.isIE9,
msieAccentBug: !0,
msieColorBug: !0,
msieColorPositionBug: !0,
msieRelativeWidthBug: i,
msieMarginWidthBug: !0,
msiePaddingWidthBug: !0,
msieCharPaddingWidthBug: r && !i,
msieBorderWidthBug: i,
msieInlineBlockAlignBug: !r || i,
msieVerticalAlignBug: r && !i,
msiePlaceBoxBug: r && !i,
msieClipRectBug: !r,
msieNegativeSpaceBug: i,
msieCloneNodeBug: r && e.version === "8.0",
negativeSkipBug: !0,
msieIE6: !t,
msieItalicWidthBug: !0,
zeroWidthBug: !0,
FontFaceBug: !0,
msieFontCSSBug: e.isIE9,
allowWebFonts: "eot"
});
},
Firefox: function(e) {
var r = !1;
if (e.versionAtLeast("3.5")) {
var i = String(document.location).replace(/[^\/]*$/, "");
if (document.location.protocol !== "file:" || (t.config.root + "/").substr(0, i.length) === i) r = "otf";
}
n.Augment({
useProcessingFrame: !0,
ffVerticalAlignBug: !0,
AccentBug: !0,
allowWebFonts: r
});
},
Safari: function(e) {
var r = e.versionAtLeast("3.0"), i = e.versionAtLeast("3.1");
e.isMobile = navigator.appVersion.match(/Mobile/i) != null;
var s = navigator.appVersion.match(/ Android (\d+)\.(\d+)/), o = i && e.isMobile && (navigator.platform.match(/iPad|iPod|iPhone/) && !e.versionAtLeast("5.0") || s != null && (s[1] < 2 || s[1] == 2 && s[2] < 2));
n.Augment({
config: {
styles: {
".MathJax img, .MathJax nobr, .MathJax a": {
"max-width": "5000em",
"max-height": "5000em"
}
}
},
useProcessingFrame: !0,
rfuzz: .05,
AccentBug: !0,
AdjustSurd: !0,
safariContextMenuBug: !0,
safariNegativeSpaceBug: !0,
safariVerticalAlignBug: !i,
safariTextNodeBug: !r,
safariWebFontSerif: [ "serif" ],
allowWebFonts: i && !o ? "otf" : !1
});
if (o) {
var u = t.config["HTML-CSS"];
u ? (u.availableFonts = [], u.preferredFont = null) : t.config["HTML-CSS"] = {
availableFonts: [],
preferredFont: null
};
}
},
Chrome: function(e) {
n.Augment({
useProcessingFrame: !0,
rfuzz: .05,
AccentBug: !0,
AdjustSurd: !0,
allowWebFonts: e.versionAtLeast("4.0") ? "otf" : "svg",
safariNegativeSpaceBug: !0,
safariWebFontSerif: [ "" ]
});
},
Opera: function(e) {
e.isMini = navigator.appVersion.match("Opera Mini") != null, n.config.styles[".MathJax .merror"]["vertical-align"] = null, n.Augment({
useProcessingFrame: !0,
operaHeightBug: !0,
operaVerticalAlignBug: !0,
operaFontSizeBug: e.versionAtLeast("10.61"),
negativeSkipBug: !0,
zeroWidthBug: !0,
FontFaceBug: !0,
PaddingWidthBug: !0,
allowWebFonts: e.versionAtLeast("10.0") && !e.isMini ? "otf" : !1,
adjustAvailableFonts: function(e) {
for (var t = 0, n = e.length; t < n; t++) e[t] === "STIX" && (e.splice(t, 1), n--, t--);
this.config.preferredFont === "STIX" && (this.config.preferredFont = e[0]);
}
});
},
Konqueror: function(e) {
n.Augment({
konquerorVerticalAlignBug: !0,
noContextMenuBug: !0
});
}
});
}), MathJax.Hub.Register.StartupHook("End Cookie", function() {
t.config.menuSettings.zoom !== "None" && e.Require("[MathJax]/extensions/MathZoom.js");
});
}(MathJax.Ajax, MathJax.Hub, MathJax.OutputJax["HTML-CSS"]), function(e) {
for (var t in e.loading) /KAthJax-[0-9a-f]{32}.js$/.test(t) && e.loadComplete(t);
}(MathJax.Ajax);