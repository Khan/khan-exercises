// ASCIIsvg-wrapper.js
// written by: Omar Rizwan
//
// This wrapper is based on the original ASCIIsvg.js code;
// it takes a subset of ASCIIsvg API calls which exercises use and
// then uses Raphael as a rendering backend.
//
// Wrapping Raphael instead of ASCIIsvg gives us immediate support for
// browsers without SVG (that means IE without the Adobe SVGviewer).
//

/* ASCIIsvg.js
   ==============
   JavaScript routines to dynamically generate Scalable Vector Graphics
   using a mathematical xy-coordinate system (y increases upwards) and
   very intuitive JavaScript commands (no programming experience required).
   ASCIIsvg.js is good for learning math and illustrating online math texts.
   Works with Internet Explorer+Adobe SVGviewer and SVG enabled Mozilla/Firefox.

   Version of Sept 12, 2009 (c) Peter Jipsen http://www.chapman.edu/~jipsen
   Latest version at http://www.chapman.edu/~jipsen/svg/ASCIIsvg.js
   If you use it on a webpage, please send the URL to jipsen@chapman.edu

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or (at
   your option) any later version.

   This program is distributed in the hope that it will be useful, 
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   General Public License (at http://www.gnu.org/copyleft/gpl.html) 
   for more details.*/

var xunitlength = 20;  // pixels
var yunitlength = 20;  // pixels
var origin = [0,0];   // in pixels (default is bottom left corner)
var defaultwidth = 300; defaultheight = 200; defaultborder = 0;
var border = defaultborder;
var strokewidth, strokedasharray, stroke, fill;
var fontstyle, fontfamily, fontsize, fontweight, fontstroke, fontfill;
var markerstrokewidth = "1";
var markerstroke = "black";
var markerfill = "yellow";
var markersize = 4;
var marker = "none";
var arrowfill = stroke;
var dotradius = 4;
var ticklength = 4;
var axesstroke = "black";
var gridstroke = "grey";
var pointerpos = null;
var coordinates = null;
var above = "above";
var below = "below";
var left = "left";
var right = "right";
var aboveleft = "aboveleft";
var aboveright = "aboveright";
var belowleft = "belowleft";
var belowright = "belowright";
var cpi = "\u03C0", ctheta = "\u03B8";
var pi = Math.PI, ln = Math.log, e = Math.E;
var arcsin = Math.asin, arccos = Math.acos, arctan = Math.atan;
var sec = function(x) { return 1/Math.cos(x) };
var csc = function(x) { return 1/Math.sin(x) };
var cot = function(x) { return 1/Math.tan(x) };
var xmin, xmax, ymin, ymax, xscl, yscl, 
xgrid, ygrid, xtick, ytick;

var picture, svgpicture, doc, width, height, a, b, c, d, i, n, p, t, x, y;
var paper;
var arcsec = function(x) { return arccos(1/x) };
var arccsc = function(x) { return arcsin(1/x) };
var arccot = function(x) { return arctan(1/x) };
var sinh = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
var cosh = function(x) { return (Math.exp(x)+Math.exp(-x))/2 };
var tanh = 
    function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)) };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsinh = function(x) { return ln(x+Math.sqrt(x*x+1)) };
var arccosh = function(x) { return ln(x+Math.sqrt(x*x-1)) };
var arctanh = function(x) { return ln((1+x)/(1-x))/2 };
var sech = function(x) { return 1/cosh(x) };
var csch = function(x) { return 1/sinh(x) };
var coth = function(x) { return 1/tanh(x) };
var arcsech = function(x) { return arccosh(1/x) };
var arccsch = function(x) { return arcsinh(1/x) };
var arccoth = function(x) { return arctanh(1/x) };
var sign = function(x) { return (x==0?0:(x<0?-1:1)) };

// Need a map to keep track of nodes by user-defined ID,
// because Raphael doesn't like us to set the IDs manually
var svgNodes = {};

function factorial(x,n) {
    if (n==null) n=1;
    for (var i=x-n; i>0; i-=n) x*=i;
    return (x<0?NaN:(x==0?1:x));
}

function C(x,k) {
    var res=1;
    for (var i=0; i<k; i++) res*=(x-i)/(k-i);
    return res;
}

function chop(x,n) {
    if (n==null) n=0;
    return Math.floor(x*Math.pow(10,n))/Math.pow(10,n);
}

function ran(a,b,n) {
    if (n==null) n=0;
    return chop((b+Math.pow(10,-n)-a)*Math.random()+a,n);
}

function less(x,y) { return x < y }  // used for scripts in XML files
// since IE does not handle CDATA well
function setText(st,id) { 
    var node = document.getElementById(id);
    if (node!=null)
        if (node.childNodes.length!=0) node.childNodes[0].nodeValue = st;
    else node.appendChild(document.createTextNode(st));
}

function setBorder(x) { border = x }

function initPicture(x_min,x_max,y_min,y_max) {
    strokewidth = "1"; // pixel
    strokedasharray = null;
    stroke = "black"; // default line color
    fill = "none";    // default fill color
    fontstyle = "italic"; // default shape for text labels
    fontfamily = "times"; // default font
    fontsize = "16";      // default size
    fontweight = "normal";
    fontstroke = "none";  // default font outline color
    fontfill = "none";    // default font color
    marker = "none";

    if (x_min!=null) xmin = x_min;
    if (x_max!=null) xmax = x_max;
    if (y_min!=null) ymin = y_min;
    if (y_max!=null) ymax = y_max;
    if (xmin==null) xmin = -5;
    if (xmax==null) xmax = 5;
    if (typeof xmin != "number" || typeof xmax != "number" || xmin >= xmax) 
        alert("Picture requires at least two numbers: xmin < xmax");
    else if (y_max != null && (typeof y_min != "number" || 
                               typeof y_max != "number" || y_min >= y_max))
        alert("initPicture(xmin,xmax,ymin,ymax) requires numbers ymin < ymax");
    else {
        xunitlength = (width-2*border)/(xmax-xmin);
        yunitlength = xunitlength;
        //alert(xmin+" "+xmax+" "+ymin+" "+ymax)
        if (ymin==null) {
            origin = [-xmin*xunitlength+border,height/2];
            ymin = -(height-2*border)/(2*yunitlength);
            ymax = -ymin;
        } else {
            if (ymax!=null) yunitlength = (height-2*border)/(ymax-ymin);
            else ymax = (height-2*border)/yunitlength + ymin;
            origin = [-xmin*xunitlength+border,-ymin*yunitlength+border];
        }
        var node = paper.rect(0, 0, width, height);
        
        node.attr({
            "stroke": "white",
            "stroke-width": 0,
            "fill": "white"
        });

        border = defaultborder;
        return node;
    }
}

// scale and coord functions for directly manipulating the Raphael paper
function xscale(x) {
    return x*xunitlength;
}

function yscale(y) {
    return y*yunitlength;
}

function xcoord(x) {
    return xscale(x)+origin[0];
}

function ycoord(y) {
    return height-yscale(y)-origin[1];
}

function coord(x, y) {
    if(x.length) {
        y = x[1];
        x = x[0];
    }
    return xcoord(x) + ',' + ycoord(y);
}

function line(p,q,id) { // segment connecting points p,q (coordinates in units)
    var node;
    if (id!=null) node = svgNodes[id];
    if (typeof node == "undefined" || node==null) {
        node = paper.path();
        svgNodes[id] = node;
    }
    node.attr("path","M"+(p[0]*xunitlength+origin[0])+","+
                      (height-p[1]*yunitlength-origin[1])+" "+
                      (q[0]*xunitlength+origin[0])+","+(height-q[1]*yunitlength-origin[1]));
    node.attr("stroke-width", strokewidth);
    if (strokedasharray!=null) {
        node.attr("stroke-dasharray", '.');
    }
    node.attr("stroke", stroke);
    if (fill != "none") {
        node.attr("fill", fill);
    }
    if (marker=="dot" || marker=="arrowdot") {
        ASdot(p,markersize,markerstroke,markerfill);
        if (marker=="arrowdot") arrowhead(p,q);
        ASdot(q,markersize,markerstroke,markerfill);
    } else if (marker=="arrow") arrowhead(p,q);

    return node;
}

function path(plist,id,c) {
    if (c==null) c="";
    var node, st, i;
    if (id!=null) node = svgNodes[id];
    if (typeof node == "undefined" || node==null) {
        node = paper.path();
        svgNodes[id] = node;
    }
    if (typeof plist == "string") st = plist;
    else {
        st = "M";
        st += (plist[0][0]*xunitlength+origin[0])+","+
            (height-plist[0][1]*yunitlength-origin[1])+" "+c;
        for (i=1; i<plist.length; i++)
            st += (plist[i][0]*xunitlength+origin[0])+","+
            (height-plist[i][1]*yunitlength-origin[1])+" ";
    }
    node.attr("path", st);
    node.attr("stroke-width", strokewidth);
    if (strokedasharray!=null) 
        node.attr("stroke-dasharray", strokedasharray);
    node.attr("stroke", stroke);
    node.attr("fill", fill);
    if (marker=="dot" || marker=="arrowdot")
        for (i=0; i<plist.length; i++)
            if (c!="C" && c!="T" || i!=1 && i!=2)
                ASdot(plist[i],markersize,markerstroke,markerfill);
}

function curve(plist,id) {
    path(plist,id,"T");
}

function circle(center,radius,id) { // coordinates in units
    var node;
    if (id!=null) node = svgNodes[id];
    if (typeof node == "undefined" || node==null) {
        node = paper.circle();
        svgNodes[id] = node;
    }
    node.attr("cx",center[0]*xunitlength+origin[0]);
    node.attr("cy",height-center[1]*yunitlength-origin[1]);
    node.attr("r",radius*xunitlength);
    node.attr("stroke-width", strokewidth);
    node.attr("stroke", stroke);
    node.attr("fill", fill);
}

function loop(p,d,id) { 
    // d is a direction vector e.g. [1,0] means loop starts in that direction
    if (d==null) d=[1,0];
    path([p,[p[0]+d[0],p[1]+d[1]],[p[0]-d[1],p[1]+d[0]],p],id,"C");
    if (marker=="arrow" || marker=="arrowdot") 
        arrowhead([p[0]+Math.cos(1.4)*d[0]-Math.sin(1.4)*d[1],
                   p[1]+Math.sin(1.4)*d[0]+Math.cos(1.4)*d[1]],p);
}

function arc(start,end,radius,id) { // coordinates in units
    return arc_elliptical(start, end, radius, radius, id);
}

function ellipse(center,rx,ry,id) { // coordinates in units
    var node;
    if (id!=null) node = svgNodes[id];
    if (typeof node == "undefined" || node==null) {
        node = paper.ellipse();
        svgNodes[id] = node;
    }
    node.attr("cx",center[0]*xunitlength+origin[0]);
    node.attr("cy",height-center[1]*yunitlength-origin[1]);
    node.attr("rx",rx*xunitlength);
    node.attr("ry",ry*yunitlength);
    node.attr("stroke-width", strokewidth);
    node.attr("stroke", stroke);
    node.attr("fill", fill);
    return node;
}

function arc_elliptical(start,end,rx,ry,id) { // coordinates in units
    var node, v;
    //alert([fill, stroke, origin, xunitlength, yunitlength, height])
    if (id!=null) node = svgNodes[id];
    if (rx==null) {
        v=[end[0]-start[0],end[1]-start[1]];
        rx = ry = Math.sqrt(v[0]*v[0]+v[1]*v[1]);
    }
    if (typeof node == "undefined" || node==null) {
        node = paper.path();
        svgNodes[id] = node;
    }
    var path = "M"+(start[0]*xunitlength+origin[0])+","+
            (height-start[1]*yunitlength-origin[1])+" A"+rx*xunitlength+","+
            ry*yunitlength+" 0 0,0 "+(end[0]*xunitlength+origin[0])+","+
            (height-end[1]*yunitlength-origin[1]);
    node.attr("path", path);
    node.attr("stroke-width", strokewidth);
    node.attr("stroke", stroke);
    node.attr("fill", fill);
    if (marker=="arrow" || marker=="arrowdot") {
        u = [(end[1]-start[1])/4,(start[0]-end[0])/4];
        v = [(end[0]-start[0])/2,(end[1]-start[1])/2];
        v = [start[0]+v[0]+u[0],start[1]+v[1]+u[1]];
    } else v=[start[0],start[1]];
    if (marker=="dot" || marker=="arrowdot") {
        ASdot(start,markersize,markerstroke,markerfill);
        if (marker=="arrowdot") arrowhead(v,end);
        ASdot(end,markersize,markerstroke,markerfill);
    } else if (marker=="arrow") arrowhead(v,end);
    return node;
}

function rect(p,q,id,rx,ry) { // opposite corners in units, rounded by radii
    var node;
    if (id!=null) node = svgNodes[id];
    if (typeof node == "undefined" || node==null) {
        node = paper.rect();
        svgNodes[id] = node;
    }
    node.attr("x",p[0]*xunitlength+origin[0]);
    node.attr("y",height-q[1]*yunitlength-origin[1]);
    node.attr("width",(q[0]-p[0])*xunitlength);
    node.attr("height",(q[1]-p[1])*yunitlength);
    if (rx!=null) node.attr("rx",rx*xunitlength);
    if (ry!=null) node.attr("ry",ry*yunitlength);
    node.attr("stroke-width", strokewidth);
    node.attr("stroke", stroke);
    node.attr("fill", fill);
    return node;
}

function text(p,st,pos,id,fontsty) {
    st = st + ''; // make sure st is a string, IE handles st=0 strangely
    if (st == '') {
        st = ' '; // Raphael doesn't like empty text
    }
    var textanchor = "middle";
    var dx = 0;
    var dy = fontsize/3;

    if (pos!=null) {
        if (pos.slice(0,5)=="above") {
            dy = -fontsize/1.2;
        } else if (pos.slice(0,5)=="below") {
            dy = fontsize-0;
        }

        if (pos.slice(0,5)=="right" || pos.slice(5,10)=="right") {
            textanchor = "start";
            dx = fontsize/2;
        } else if (pos.slice(0,4)=="left" || pos.slice(5,9)=="left") {
            textanchor = "end";
            dx = -fontsize/2;
        }
    }

    var node;
    if (id!=null) node = svgNodes[id];
    if (typeof node == "undefined" || node==null) {
        node = paper.text();
        svgNodes[id] = node;
    }
    var textx = p[0]*xunitlength+origin[0]+dx;
    var texty = height-p[1]*yunitlength-origin[1]+dy;

    if (paper.raphael.vml) {
        // VML text adjustment from
        // https://groups.google.com/group/raphaeljs/browse_thread/thread/daf44c4c1557b898
        textx -= 2; // be careful, use 'minus equal' assignment here
        texty += 2.2 + fontsize/10;
    } else {
        // font-style doesn't work in VML on IE
        node.attr("font-style",(fontsty!=null?fontsty:fontstyle));
    }
    node.attr("x", textx);
    node.attr("y", texty);

    node.attr("text",st);
    node.attr("font-family",fontfamily);
    node.attr("font-size",fontsize);
    node.attr("font-weight",fontweight);
    node.attr("text-anchor",textanchor);
    if (fontstroke!="none") node.attr("stroke",fontstroke);
    if (fontfill!="none") node.attr("fill",fontfill);
    return p;
}

function ASdot(center,radius,s,f) { // coordinates in units, radius in pixel
    if (s==null) s = stroke; if (f==null) f = fill;
    var node = paper.circle();
    node.attr("cx",center[0]*xunitlength+origin[0]);
    node.attr("cy",height-center[1]*yunitlength-origin[1]);
    node.attr("r",radius);
    node.attr("stroke-width", strokewidth);
    node.attr("stroke", s);
    node.attr("fill", f);
    return node;
}

function dot(center, typ, label, pos, id) {
    var node;
    var cx = center[0]*xunitlength+origin[0];
    var cy = height-center[1]*yunitlength-origin[1];
    if (id!=null) node = svgNodes[id];
    if (typ=="+" || typ=="-" || typ=="|") {
        if (typeof node == "undefined" || node==null) {
            node = paper.path();
            svgNodes[id] = node;
        }
        if (typ=="+") {
            node.attr("path",
                              " M "+(cx-ticklength)+" "+cy+" L "+(cx+ticklength)+" "+cy+
                              " M "+cx+" "+(cy-ticklength)+" L "+cx+" "+(cy+ticklength));
            node.attr("stroke-width", .5);
            node.attr("stroke", axesstroke);
        } else {
            if (typ=="-") node.attr("path",
                                            " M "+(cx-ticklength)+" "+cy+" L "+(cx+ticklength)+" "+cy);
            else node.attr("path",
                                   " M "+cx+" "+(cy-ticklength)+" L "+cx+" "+(cy+ticklength));
            node.attr("stroke-width", strokewidth);
            node.attr("stroke", stroke);
        }
    } else {
        if (typeof node == "undefined" || node==null) {
            node = paper.circle();
            svgNodes[id] = node;
        }
        node.attr("cx",cx);
        node.attr("cy",cy);
        node.attr("r",dotradius);
        node.attr("stroke-width", strokewidth);
        node.attr("stroke", stroke);
        node.attr("fill", (typ=="open"?"white":stroke));
    }
    if (label!=null) 
        text(center,label,(pos==null?"below":pos),(id==null?id:id+"label"))
}

function arrowhead(p,q) { // draw arrowhead at q (in units)
    var up;
    var v = [p[0]*xunitlength+origin[0],height-p[1]*yunitlength-origin[1]];
    var w = [q[0]*xunitlength+origin[0],height-q[1]*yunitlength-origin[1]];
    var u = [w[0]-v[0],w[1]-v[1]];
    var d = Math.sqrt(u[0]*u[0]+u[1]*u[1]);
    if (d > 0.00000001) {
        u = [u[0]/d, u[1]/d];
        up = [-u[1],u[0]];
        var node = paper.path();
        node.attr("path","M "+(w[0]-15*u[0]-4*up[0])+" "+
                          (w[1]-15*u[1]-4*up[1])+" L "+(w[0]-3*u[0])+" "+(w[1]-3*u[1])+" L "+
                          (w[0]-15*u[0]+4*up[0])+" "+(w[1]-15*u[1]+4*up[1])+" z");
        node.attr("stroke-width", markerstrokewidth);
        node.attr("stroke", stroke); /*was markerstroke*/
        node.attr("fill", stroke); /*was arrowfill*/
    }
}

function hopZ(st) {
    var k = st.indexOf(".");
    if (k==-1) return st;
    for (var i=st.length-1; i>k && st.charAt(i)=="0"; i--);
    if (i==k) i--;
    return st.slice(0,i+1);
}

function grid(dx,dy) { // for backward compatibility
    axes(dx,dy,null,dx,dy)
}

function axes(dx,dy,labels,gdx,gdy) {
    //xscl=x is equivalent to xtick=x; xgrid=x; labels=true;
    var x, y, ldx, ldy, lx, ly, lxp, lyp, pnode, st;

    if (typeof dx=="string") { labels = dx; dx = null; }
    if (typeof dy=="string") { gdx = dy; dy = null; }
    if (xscl!=null) {dx = xscl; gdx = xscl; labels = dx}
    if (yscl!=null) {dy = yscl; gdy = yscl}
    if (xtick!=null) {dx = xtick}
    if (ytick!=null) {dy = ytick}
    //alert(null)
    dx = (dx==null?xunitlength:dx*xunitlength);
    dy = (dy==null?yunitlength:dy*yunitlength);
    fontsize = Math.min(dx/2,dy/2,16);//alert(fontsize)
    ticklength = fontsize/4;
    if (xgrid!=null) gdx = xgrid;
    if (ygrid!=null) gdy = ygrid;
    if (gdx!=null) {
        gdx = (typeof gdx=="string"?dx:gdx*xunitlength);
        gdy = (gdy==null?dy:gdy*yunitlength);
        pnode = paper.path();
        st="";
        for (x = origin[0]; x<width; x = x+gdx)
            st += " M"+x+",0"+" "+x+","+height;
        for (x = origin[0]-gdx; x>0; x = x-gdx)
            st += " M"+x+",0"+" "+x+","+height;
        for (y = height-origin[1]; y<height; y = y+gdy)
            st += " M0,"+y+" "+width+","+y;
        for (y = height-origin[1]-gdy; y>0; y = y-gdy)
            st += " M0,"+y+" "+width+","+y;
        pnode.attr("path",st);
        pnode.attr("stroke-width", .5);
        pnode.attr("stroke", gridstroke);
        pnode.attr("fill", fill);
    }
    pnode = paper.path();
    st="M0,"+(height-origin[1])+" "+width+","+
        (height-origin[1])+" M"+origin[0]+",0 "+origin[0]+","+height;
    for (x = origin[0]+dx; x<width; x = x+dx)
        st += " M"+x+","+(height-origin[1]+ticklength)+" "+x+","+
        (height-origin[1]-ticklength);
    for (x = origin[0]-dx; x>0; x = x-dx)
        st += " M"+x+","+(height-origin[1]+ticklength)+" "+x+","+
        (height-origin[1]-ticklength);
    for (y = height-origin[1]+dy; y<height; y = y+dy)
        st += " M"+(origin[0]+ticklength)+","+y+" "+(origin[0]-ticklength)+","+y;
    for (y = height-origin[1]-dy; y>0; y = y-dy)
        st += " M"+(origin[0]+ticklength)+","+y+" "+(origin[0]-ticklength)+","+y;
    if (labels!=null) with (Math) {
        ldx = dx/xunitlength;
        ldy = dy/yunitlength;
        lx = (xmin>0 || xmax<0?xmin:0);
        ly = (ymin>0 || ymax<0?ymin:0);
        lxp = (ly==0?"below":"above");
        lyp = (lx==0?"left":"right");
        var ddx = floor(1.1-log(ldx)/log(10))+1;
        var ddy = floor(1.1-log(ldy)/log(10))+1;
        for (x = ldx; x<=xmax; x = x+ldx)
            text([x,ly],chopZ(x.toFixed(ddx)),lxp);
        for (x = -ldx; xmin<=x; x = x-ldx)
            text([x,ly],chopZ(x.toFixed(ddx)),lxp);
        for (y = ldy; y<=ymax; y = y+ldy)
            text([lx,y],chopZ(y.toFixed(ddy)),lyp);
        for (y = -ldy; ymin<=y; y = y-ldy)
            text([lx,y],chopZ(y.toFixed(ddy)),lyp);
    }
    pnode.attr("path",st);
    pnode.attr("stroke-width", .5);
    pnode.attr("stroke", axesstroke);
    pnode.attr("fill", fill);
}

function mathjs(st) {
    //translate a math formula to js function notation
    // a^b --> pow(a,b)
    // na --> n*a
    // (...)d --> (...)*d
    // n! --> factorial(n)
    // sin^-1 --> arcsin etc.
    //while ^ in string, find term on left and right
    //slice and concat new formula string
    st = st.replace(/\s/g,"");
    if (st.indexOf("^-1")!=-1) {
        st = st.replace(/sin\^-1/g,"arcsin");
        st = st.replace(/cos\^-1/g,"arccos");
        st = st.replace(/tan\^-1/g,"arctan");
        st = st.replace(/sec\^-1/g,"arcsec");
        st = st.replace(/csc\^-1/g,"arccsc");
        st = st.replace(/cot\^-1/g,"arccot");
        st = st.replace(/sinh\^-1/g,"arcsinh");
        st = st.replace(/cosh\^-1/g,"arccosh");
        st = st.replace(/tanh\^-1/g,"arctanh");
        st = st.replace(/sech\^-1/g,"arcsech");
        st = st.replace(/csch\^-1/g,"arccsch");
        st = st.replace(/coth\^-1/g,"arccoth");
    }
    st = st.replace(/^e$/g,"(E)");
    st = st.replace(/^e([^a-zA-Z])/g,"(E)$1");
    st = st.replace(/([^a-zA-Z])e([^a-zA-Z])/g,"$1(E)$2");
    st = st.replace(/([0-9])([\(a-zA-Z])/g,"$1*$2");
    st = st.replace(/\)([\(0-9a-zA-Z])/g,"\)*$1");
    var i,j,k, ch, nested;
    while ((i=st.indexOf("^"))!=-1) {
        //find left argument
        if (i==0) return "Error: missing argument";
        j = i-1;
        ch = st.charAt(j);
        if (ch>="0" && ch<="9") {// look for (decimal) number
            j--;
            while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
            if (ch==".") {
                j--;
                while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
            }
        } else if (ch==")") {// look for matching opening bracket and function name
            nested = 1;
            j--;
            while (j>=0 && nested>0) {
                ch = st.charAt(j);
                if (ch=="(") nested--;
                else if (ch==")") nested++;
                j--;
            }
            while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
                j--;
        } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
            j--;
            while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
                j--;
        } else { 
            return "Error: incorrect syntax in "+st+" at position "+j;
        }
        //find right argument
        if (i==st.length-1) return "Error: missing argument";
        k = i+1;
        ch = st.charAt(k);
        if (ch>="0" && ch<="9" || ch=="-") {// look for signed (decimal) number
            k++;
            while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
            if (ch==".") {
                k++;
                while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
            }
        } else if (ch=="(") {// look for matching closing bracket and function name
            nested = 1;
            k++;
            while (k<st.length && nested>0) {
                ch = st.charAt(k);
                if (ch=="(") nested++;
                else if (ch==")") nested--;
                k++;
            }
        } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
            k++;
            while (k<st.length && (ch=st.charAt(k))>="a" && ch<="z" ||
                   ch>="A" && ch<="Z") k++;
        } else { 
            return "Error: incorrect syntax in "+st+" at position "+k;
        }
        st = st.slice(0,j+1)+"pow("+st.slice(j+1,i)+","+st.slice(i+1,k)+")"+
            st.slice(k);
    }
    while ((i=st.indexOf("!"))!=-1) {
        //find left argument
        if (i==0) return "Error: missing argument";
        j = i-1;
        ch = st.charAt(j);
        if (ch>="0" && ch<="9") {// look for (decimal) number
            j--;
            while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
            if (ch==".") {
                j--;
                while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
            }
        } else if (ch==")") {// look for matching opening bracket and function name
            nested = 1;
            j--;
            while (j>=0 && nested>0) {
                ch = st.charAt(j);
                if (ch=="(") nested--;
                else if (ch==")") nested++;
                j--;
            }
            while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
                j--;
        } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
            j--;
            while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z")
                j--;
        } else { 
            return "Error: incorrect syntax in "+st+" at position "+j;
        }
        st = st.slice(0,j+1)+"factorial("+st.slice(j+1,i)+")"+st.slice(i+1);
    }
    return st;
}

function functionFrom(exp) {
    // warning: don't let stuff which is not from user input or the exercise in here
    eval("var fn = function(x){ with(Math) return "+mathjs(exp)+" }");
    return fn;
}

function plot(fun,x_min,x_max,points,id) {
    var pth = [];
    var f = function(x) { return x }, g = fun;
    var name = null;
    if (typeof fun=="string") 
        eval("g = function(x){ with(Math) return "+mathjs(fun)+" }");
    else if (typeof fun=="object") {
        eval("f = function(t){ with(Math) return "+mathjs(fun[0])+" }");
        eval("g = function(t){ with(Math) return "+mathjs(fun[1])+" }");
    }
    if (typeof x_min=="string") { name = x_min; x_min = xmin }
    else name = id;
    var min = (x_min==null?xmin:x_min);
    var max = (x_max==null?xmax:x_max);
    var inc = max-min-0.000001*(max-min);
    inc = (points==null?inc/200:inc/points);
    var gt;
    //alert(typeof g(min))
    for (var t = min; t <= max; t += inc) {
        gt = g(t);
        if (!(isNaN(gt)||Math.abs(gt)=="Infinity")) pth[pth.length] = [f(t), gt];
    }
    path(pth,name)
    return p;
}

function slopefield(fun,dx,dy) {
    var g = fun;
    if (typeof fun=="string") 
        eval("g = function(x,y){ with(Math) return "+mathjs(fun)+" }");
    var gxy,x,y,u,v,dz;
    if (dx==null) dx=1;
    if (dy==null) dy=1;
    dz = Math.sqrt(dx*dx+dy*dy)/6;
    var x_min = Math.ceil(xmin/dx);
    var y_min = Math.ceil(ymin/dy);
    for (x = x_min; x <= xmax; x += dx)
        for (y = y_min; y <= ymax; y += dy) {
            gxy = g(x,y);
            if (!isNaN(gxy)) {
                if (Math.abs(gxy)=="Infinity") {u = 0; v = dz;}
                else {u = dz/Math.sqrt(1+gxy*gxy); v = gxy*u;}
                line([x-u,y-v],[x+u,y+v]);
            }
        }
}

// :'(
var present = window;
var pointRegister = [];
var initialObjectsToDraw  = [];

jQuery.extend(KhanUtil, {
	initGraph: function( elem ) {
		present.width = jQuery(elem).width();
		present.height = jQuery(elem).height();
		present.paper = Raphael( elem, width, height );
	},
	
	drawPlane: function( min_x, max_x, min_y, max_y ) {
		if ( arguments.length === 0 ) {
			min_x = min_y = -10;
			max_x = max_y = 10;
		}
		
		present.initPicture( min_x, max_x, min_y, max_y );
		present.fontstyle = "normal";
		present.fontsize = "10";
		present.stroke = "#DDDDDD";
		present.strokewidth = "2";
		present.marker = "none";

		for ( var i = min_x; i <= max_x; i++ ) {
			if ( i !== 0 ) {
				present.line([i, min_y], [i,max_y]);
				present.line([min_x,i], [max_x,i]);
				present.text([i, .1], i, below);
				present.text([0, i], i, right);
			}
		}
		
		present.axes();
	}
});

jQuery.fn.graph = function() {
	return this.find(".graph").each(function() {			
		// Grab code for later execution
		var code = jQuery(this).text();

		// Remove any of the code that's in there
		jQuery(this).empty();
		
		// Initialize the graph
		if ( !jQuery(this).hasClass("update") ) {
			KhanUtil.initGraph( this, jQuery(this).width(), jQuery(this).height() );
		}
		
		// Draw a plane, if it was asked for
		// TODO: Make this generic and support different styles of graphs
		if ( jQuery(this).data("graph-type") === "plane" ) {
			KhanUtil.drawPlane();
		}
		
		// Pre-populate all style information from the style attribute
		jQuery.each( (jQuery(this).data("style") || "").split(/\s*;\s*/), function( i, prop ) {
			// Properties are formatted using the typical CSS convention
			var parts = prop.split(/:\s*/),
				name = parts[0].replace(/-/g, ""),
				value = parts[1];

			// Only set the property if it already exists
			if ( typeof present[ name ] !== "number" ) {
				present[ name ] = value;
			} else if ( name === "fontsize" ) {
				// Special-case code for fontsize -- we have to strip the px from the css value
				// since some graphing functions do math on the fontsize string (WTF?)

				// Also fontsize's typeof *is* number when we check it ^^, but becomes a string later
				present["fontsize"] = value.replace(/px/, "");
			}
		});

		// Execute the graph-specific code
		// Depends upon the math module
		jQuery.getVAR( code );
	}).end();
};

// Load Raphael
Khan.scriptWait(function( scriptLoaded ) {
	var script = document.createElement("script");
	script.src = "http://ajax.cdnjs.com/ajax/libs/raphael/1.5.2/raphael-min.js";
	script.onload = scriptLoaded;
	document.documentElement.appendChild( script );
});