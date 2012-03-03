/*
The MIT License (MIT)
Copyright (c) 2012 Lodewijk Bogaards
www.mrhobo.nl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function () {

/*------------------------------------------------
--------------- ConicsUtil -----------------------
-------------------------------------------------*/


var ConicsUtil = {
	clone: function(obj) {
		return jQuery.extend({}, obj);
	},

	requestAnimFrame: function(renderFunc) {
		var reqFunc = window.requestAnimationFrame       ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame    ||
	        window.oRequestAnimationFrame      ||
	        window.msRequestAnimationFrame     ||
	        function( callback ){
	          window.setTimeout(callback, 1000 / 30);
	        };
		reqFunc(renderFunc);
	},

	mul3x3: function(m1, m2) {
		return [
			m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6],
			m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7],
			m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],
			m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6],
			m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7],
			m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],
			m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6],
			m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7],
			m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8]
		];
	},

	mul3x3p: function(m, p) {
		return {
			x: m[0] * p.x + m[1] * p.y + m[2] * p.z,
			y: m[3] * p.x + m[4] * p.y + m[5] * p.z,
			z: m[6] * p.x + m[7] * p.y + m[8] * p.z
		};
	},

	getXRot: function(yaw) {
		var c = Math.cos(yaw);
		var s = Math.sin(yaw);
		return [
			1, 0, 0,
			0, c, s,
			0, -s, c
		];
	},

	getYRot: function(pitch) {
		c = Math.cos(pitch);
		s = Math.sin(pitch);
		return [
			c, 0, -s,
			0, 1, 0,
			s, 0, c
		];
	},

	rot2d: function(p, r) {
		return {
			x: Math.cos(r) * p.x - p.y * Math.sin(r),
			y: Math.sin(r) * p.x + p.y * Math.cos(r)
		};
	},

	// (x - cx)^2 / rx^2 + (y - cy)^2 / ry^2 = 1
	drawEllipse: function(cx, cy, rx, ry, segments, drawCallback) {
		var PI2 = Math.PI * 2;
		var t_inc = PI2 / segments;
		lp = null;
		for (t = 0; t < PI2+t_inc; t += t_inc) {
			var p = {
				x: cx + Math.sin(t) * rx,
				y: cy + Math.cos(t) * ry
			};

			if (lp != null)
			 drawCallback(lp, p);

			lp = ConicsUtil.clone(p);
		}
	},

	// (y - cy)^2/ry^2 - (x - cx)^2/rx^2 = 1, rx & ry != 0
	// bx < ex
	drawHyperbola: function(cx, cy, rx, ry, bx, ex, segments, drawCallback1, drawCallback2) {
		var lp1 = null;
		var lp2 = null;
		if (!drawCallback2) drawCallback2 = drawCallback1;
		t_inc = (ex - bx) / segments;
		var b2 = ry * ry;
		var rx2 = rx*rx;
		for (var t = bx; t < ex; t+=t_inc) {
			var x = t - cx;
			var p1 = {
				x: t,
				y: -Math.sqrt( Math.abs( b2 + (b2*x*x) / rx2 ))
			};
			var p2 = {
				x: p1.x,
				y: -p1.y + cy
			};
			p1.y += cy;

			if (lp1 != null) {
				drawCallback1(lp1, p1);
				drawCallback2(lp2, p2);
			}

			lp1 = ConicsUtil.clone(p1);
			lp2 = ConicsUtil.clone(p2);
		}
	},

	// A(x - cx)^2 + cy = y, A != 0
	// bx < ex
	drawParabola: function(cx, cy, rx, bx, ex, segments, drawCallback) {
		var lp = null;
		var t_inc = (ex - bx) / segments
		for (var t = bx; t < ex; t+=t_inc) {
			var x1 = t - cx;
			var p = {
				x: t,
				y: rx * x1*x1 + cy
			};

			if (lp != null)
			 drawCallback(lp, p);

			lp = ConicsUtil.clone(p);
		}
	}
};

/*------------------------------------------------
--------------- Conics3D -------------------------
-------------------------------------------------*/

function Conics3D(w, h, maxConeRadius, changeEvent) {
	this.changeEvent = changeEvent;
	this.z_shift = 1200;
	this.focal_length = 800;
	// zoom so that the top of the cone is at the
	// top of the screen and the bottom at the bottom
	this.zoom = 1 / maxConeRadius * h / 2;
	this.width = w;
	this.height = h;
	// save a few clockcycles per to2d call :)
	this.half_height	= h * 0.5;
	this.half_width		= w * 0.5;

	this.yaw =  0;
	this.pitch = 0;
	this.updateRot();
}

Conics3D.prototype = {
 	changed : function() {
		if (typeof this.changeEvent == "function")
			this.changeEvent();
	},

	updateRot : function() {
		this.rot = ConicsUtil.mul3x3(
			ConicsUtil.getXRot(this.yaw),
			ConicsUtil.getYRot(this.pitch)
		);
	},

	incYaw: function(pYaw) {
		this.yaw += pYaw;
		this.updateRot();
		this.changed();
	},

	incPitch: function (pPitch) {
		this.pitch += pPitch;
		this.updateRot();
		this.changed();
	},

	setYaw: function(pYaw) {
		this.yaw = pYaw;
		this.updateRot();
		this.changed();
	},

	getYaw: function() {
		return this.yaw;
	},

	setPitch: function(pPitch) {
		this.pitch = pPitch;
		this.updateRot();
		this.changed();
	},

	getPitch: function() {
		return this.pitch;
	},

	isInFront: function(p1, p2) {
		var d1 = ConicsUtil.mul3x3p(this.rot, p1);
		var d2 = ConicsUtil.mul3x3p(this.rot, p2);

		return d1.z < d2.z;
	},

	to2d: function(p) {
		var d = ConicsUtil.mul3x3p(this.rot, p);
		return {
			x:
				d.x * this.focal_length /
				(d.z + this.z_shift) * this.zoom + this.half_width,
			y:
				d.y * this.focal_length /
				(d.z + this.z_shift) * this.zoom + this.half_height
		};
	}
};

/*------------------------------------------------
--------------- Conics --------------------------
-------------------------------------------------*/

function Conics(maxConeRadius, drawDOMNode, width, height) {
	this.drawEl = drawDOMNode;
	this.width = width;
	this.height = height;

	this.cone = {
		maxConeRadius: maxConeRadius
	};

	this.plane = {
		p1: { x: -maxConeRadius * 1.5, y: 0 },
		p2: { x: maxConeRadius * 1.5, y: 0},
		offset: { x: 0, y: 0, z: 0 },
		rot: 0
	};

	var self = this;
	if (drawDOMNode) {
		// init 3d
		this.c3d = new Conics3D(
			this.width,
			this.height,
			maxConeRadius,
			// changed event for c3d updates the redrawNeeded
			// for the conic, thus if the camera changes a
			// redraw is marked as needed.
			function() {
				self.redrawNeeded = true;
			}
		);

		// init raphael
		this.paper = new Raphael(
			drawDOMNode,
			this.width,
			this.height
		);

		this.redrawNeeded = true;
	} else {
		// no drawing
		this.redrawNeeded = false;
		this.paper = null;
		this.c3d = null;
	}
}

// enum
var ConicType = {
	CIRCLE: 0,
	ELLIPSE: 1,
	PARABOLA: 2,
	HYPERBOLA: 3,
	//TODO: following two currently not implemented
	POINT: 4,
	INTERSECTING_LINE: 5
};

Conics.prototype = {
	needRedraw: function() {
		this.redrawNeeded = true;
	},

	setPlaneX: function (px) {
		this.plane.offset.x = px;
		this.needRedraw();
	},

	getPlaneX: function(x) {
		return this.plane.offset.x;
	},

	setPlaneY: function(py) {
		this.plane.offset.y = py;
		this.needRedraw();
	},

	getPlaneY: function() {
		return this.plane.offset.y;
	},

	setPlaneZ: function(pz) {
		this.plane.offset.z = pz;
		this.needRedraw();
	},

	getPlaneZ: function() {
		return this.plane.offset.z;
	},

	getPlaneRot: function() {
		return this.plane.rot;
	},

	setPlaneRot: function(rad) {
		this.plane.rot = rad;
		this.needRedraw();
	},

	getSVG: function() {
		if (Raphael.svg)
			return this.drawEl.innerHTML;
		else
			return "";
	},

	getPlane: function() {
		var p1 = ConicsUtil.rot2d(this.plane.p1, this.plane.rot);
		var p2 = ConicsUtil.rot2d(this.plane.p2, this.plane.rot);
		p1.x += this.plane.offset.x;
		p2.x += this.plane.offset.x;
		p1.y += this.plane.offset.y;
		p2.y += this.plane.offset.y;
		rtn = ConicsUtil.clone(this.plane);
		rtn.p1 = p1;
		rtn.p2 = p2;
		rtn.depth = this.cone.maxConeRadius * 2;
		return  rtn;
	},

	defaultDrawOptions: {
		// how many line segments for an ellipse, hyperbola (per curve)
		// and parabola
		curveLineSegments: 64,
		plane: {
			stroke: "#000000"
		},
		intersection: {
			stroke: "#FF00FF"
		},
		coneEndings: {
			stroke: "#555555",
			"fill-opacity": "0.6",
			fill: "#EFEFEF"
		},
		coneLines: {
			stroke: "#555555"
		}
	},

	/**
	 * Draws the cone, plane and intersection if a redraw
	 *  is needed (automatically detected). A redraw cange
	 *   be forced by calling Conics.needRedraw() first.
	 *
	 *  options: see defaultDrawOptions for list
	 **/
	draw: function(options) {
		if (!this.redrawNeeded || !this.paper)
			return false;
		this.redrawNeeded = false;

		this.drawOptions = options || this.defaultDrawOptions;
		var plane = this.getPlane();

		this.paper.clear();

		this.drawCone(this.cone.maxConeRadius);
		this.drawPlane(plane);
		this.drawIntersect(this.getIntersection(), plane, this.cone.maxConeRadius);

		return true;
	},

	// x^2 + z^2 = y^2
	drawCone: function(max_radius) {
		var cone = {
			tl: {x: -max_radius, y: -max_radius, z: 0 },
			tr: {x: max_radius, y: -max_radius, z: 0 },
			tf: {x: 0, y: -max_radius, z: max_radius },
			tb: {x: 0, y: -max_radius, z: -max_radius },
			bl: {x: -max_radius, y: max_radius, z: 0 },
			br: {x: max_radius, y: max_radius, z: 0 },
			bf: {x: 0, y: max_radius, z: max_radius },
			bb: {x: 0, y: max_radius, z: -max_radius }
		};

		var yrot = ConicsUtil.getYRot(-this.c3d.pitch);
		for (var pos in cone) {
			cone[pos] = ConicsUtil.mul3x3p(yrot, cone[pos]);
			cone[pos] = this.c3d.to2d(cone[pos]);
		}

		var txr = Math.abs(cone.tr.x-cone.tl.x) * 0.5;
		var tyr = Math.abs(cone.tf.y-cone.tb.y) * 0.5;
		var bxr = Math.abs(cone.br.x-cone.bl.x) * 0.5;
		var byr = Math.abs(cone.bf.y-cone.bb.y) * 0.5;

		// use of the inbuilt ellipse function may cause
		// a bit of perspective distortion, but I found it worth it
		// since filling a cone manually renders s.l.o.w.
		var top = this.paper.ellipse(
				cone.tl.x + txr,
				Math.min(cone.tf.y, cone.tb.y) + tyr,
				txr,
				tyr
			);

		var bottom = this.paper.ellipse(
				cone.bl.x + bxr,
				Math.min(cone.bf.y, cone.bb.y) + byr,
				bxr,
				byr
			);

		var lines = this.paper.path(
				"M " + cone.tl.x +" " + cone.tl.y +
				" L "+ cone.br.x +" "+ cone.br.y +
				" M " + cone.tr.x +" " + cone.tr.y +
				" L "+ cone.bl.x +" "+ cone.bl.y
			).attr(this.drawOptions.coneLines);

		// fill one of the ellipses with transparent white
		// in front of the lines depending which one is in front
		var front = this.c3d.isInFront(
				{ x: 0, y: -max_radius, z: 0 },
				{ x: 0, y: max_radius, z: 0 }
			) ? top : bottom;
		front = front.insertAfter(lines);

		top.attr(this.drawOptions.coneEndings);
		bottom.attr(this.drawOptions.coneEndings);
	},

	// ax+by+0z=c
	drawPlane: function(plane) {
		var d = plane.depth * 0.5;
		var p1 = this.c3d.to2d({ x: plane.p1.x, y: plane.p1.y, z: d + plane.offset.z});
		var p2 = this.c3d.to2d({ x: plane.p1.x, y: plane.p1.y, z: -d + plane.offset.z});
		var p3 = this.c3d.to2d({ x: plane.p2.x, y: plane.p2.y, z: d + plane.offset.z});
		var p4 = this.c3d.to2d({ x: plane.p2.x, y: plane.p2.y, z: -d + plane.offset.z});

		this.paper.path(
			"M " + p1.x +" " + p1.y +
			" l "+ (p2.x-p1.x) +" "+ (p2.y-p1.y) +
			" l "+ (p4.x-p2.x) +" "+ (p4.y-p2.y) +
			" l "+ (p3.x-p4.x) +" "+ (p3.y-p4.y) +
			" l "+ (p1.x-p3.x) +" "+ (p1.y-p3.y)
		).attr(this.drawOptions.plane);
	},

	getIntersection: function(plane) {
		if (!plane) plane = this.getPlane();

		// calc type, major and minor axis radius & center
		var s = (plane.p2.y-plane.p1.y) / (plane.p2.x-plane.p1.x);
		var a = plane.offset.x;
		var b = plane.offset.y;

		var C = ((s*s) - 1) / ((s*s) + 1);
		var E = ((2*b*s) - (2*a)) / Math.sqrt((s*s) + 1);
		var A = (b*b) - (a*a) - ((E*E) / (4*C));

		function isParabola() {
			return C < 0.05 && C > -0.05;
		}

		var cx = plane.offset.z;
		var cy = 0;
		var rx = 0;
		var type;
		if (isParabola()) {
			cy = -(b*b - a*a) / E;
			rx = 1 / E;
		}
		else {
			cy = -E/(2*C);
			rx = Math.sqrt( Math.abs( A ) );
		}
		var ry = 0;
		if (C != 0)
			ry = Math.sqrt( Math.abs( A / C ) );

		if (isParabola()) {
			type = ConicType.PARABOLA;
		} else if (C < 0) {
			if (Math.abs(rx - ry) < 0.1)
				type = ConicType.CIRCLE;
			else
				type = ConicType.ELLIPSE;
		}
		else
			type = ConicType.HYPERBOLA;

		return {
			type: type, // curve type
			cx: cx, // center x
			cy: cy, // center y
			A: A, // x^2 conics coefficient
			C: C, // y^2 conics coefficient
			E: E, // y conics coefficient
			rx: rx, // radius x
			ry: ry, // radius y
			s: s // slope
		};
	},

	drawIntersect: function(intsec, plane, max_radius) {

		var self = this;
		var min = {
			x: Math.max(Math.min(plane.p1.x, plane.p2.x), -max_radius),
			y: Math.max(Math.min(plane.p1.y, plane.p2.y), -max_radius),
			z: Math.max(-plane.depth * 0.5 + plane.offset.z, -max_radius)
		};
		var max = {
			x: Math.min(Math.max(plane.p1.x, plane.p2.x), max_radius),
			y: Math.min(Math.max(plane.p1.y, plane.p2.y), max_radius),
			z: Math.min(plane.depth * 0.5 + plane.offset.z, max_radius)
		};

		function checkBounds(p) {
			var rtn = 0;
			if (p.x < min.x || p.x > max.x)
				rtn |= 1;
			if (p.y < min.y || p.y > max.y)
				rtn |= 2;
			if (p.z < min.z || p.z > max.z)
				rtn |= 4;
			return rtn;
		};

		function clipLine(from, dest) {
			var b = checkBounds(dest);
			var l = Number.MAX_VALUE;
			if (b & 1) {
				var nx = dest.x < min.x ? min.x : max.x;
				l = Math.min(l, (nx - from.x) / (dest.x - from.x));
			}
			if (b & 2) {
				var ny = dest.y < min.y ? min.y : max.y;
				l = Math.min(l, (ny - from.y) / (dest.y - from.y));
			}
			if (b & 4) {
				var nz = dest.z < min.z ? min.z : max.z;
				l = Math.min(l, (nz - from.z) / (dest.z - from.z));
			}
			if (l < Number.MAX_VALUE) {
				return {
					x: from.x + l * (dest.x - from.x),
					y: from.y + l * (dest.y - from.y),
					z: from.z + l * (dest.z - from.z)
				}
			}
			else
				return dest;
		}

		function plane2dto3d(p) {
			var s = intsec.s;
			var c = Math.sqrt( s*s + 1);
			return {
				x: p.y / c + plane.offset.x,
				y: (p.y * s) / c + plane.offset.y,
				z: p.x - plane.offset.z
			};
		};

		function drawLineOnPlane(l1, l2) {
			var p1 = plane2dto3d(l1);
			var p2 = plane2dto3d(l2);

			p1Bounds = checkBounds(p1);
			p2Bounds = checkBounds(p2);
			if (p1Bounds && p2Bounds)
				// both points out of bounds
				// do nothing
				return;
			else if (p1Bounds)
				p1 = clipLine(p2, p1);
			else if (p2Bounds)
				p2 = clipLine(p1, p2);

			p1 = self.c3d.to2d(p1);
			p2 = self.c3d.to2d(p2);

			self.paper.path(
				"M "+ p1.x +" "+ p1.y +
				"L "+ p2.x +" "+ p2.y
			).attr(self.drawOptions.intersection);
		};

		// draw
		var hd = plane.depth*0.5;
		var minx = -hd + plane.offset.z;
		var maxx = hd  + plane.offset.z;
		switch(intsec.type) {
			case ConicType.CIRCLE:
			case ConicType.ELLIPSE: {
				ConicsUtil.drawEllipse(
					intsec.cx, intsec.cy,
					intsec.rx, intsec.ry,
					this.drawOptions.curveLineSegments,
					drawLineOnPlane
				);
				break;
			}
			case ConicType.HYPERBOLA: {
				ConicsUtil.drawHyperbola(
					intsec.cx, intsec.cy,
					intsec.rx, intsec.ry,
					minx, maxx,
					this.drawOptions.curveLineSegments,
					drawLineOnPlane
				);
				break;
			}
			case ConicType.PARABOLA: {
				ConicsUtil.drawParabola(
					intsec.cx, intsec.cy,
					intsec.rx, minx, maxx,
					this.drawOptions.curveLineSegments,
					drawLineOnPlane
				);
				break;
			}
		}
	}
};

/*------------------------------------------------
--------------- ConicsUI -------------------------
-------------------------------------------------*/

var CONIC_UI = "conic_ui";
var DRAG_CONIC_UI = "dragging_conic_ui";

/**
	* planeControls: a jQuery DOM object in which the
	*  plane controls will be initalized
	*	conicsContainer: a jQuery DOM object in which Raphael
	*		can be initialized and the 3D Conic can be drawn
	* options: an object with the properties:
	*		- pitch:		sets the initial camera pitch
	*		- yaw:    	sets the initial camera yaw
	* 	- planeY: 	plane Y offset
	* 	- planeX: 	plane X offset
	* 	- planeZ: 	plane Z offset
	* 	- planeRot: plane rotation in radians
	*   - maxConeRadius: the radius of the cone at the top and bottom
	*   - disableCameraDragging: set to true to disable camera dragging
	*   - updateRealtime set to true to see every changes redrawn in realtime
	* 	- drawOptions: see Conics.draw() @ options
	*   - onPlaneUpdate: event handler for plane updates (called on draw events)
	*   - onDraw: event handler to extend drawing
**/
function ConicsUI(planeControls, conicsContainer, options) {
	this.planeControls = planeControls;
	this.planeUpdated = false;

	// init options
	function setOptDefault(prop, val) {
		if (typeof options[prop] == "undefined")
			options[prop] = val;
	}

	if (!options) options = {};
	setOptDefault("updateRealtime", true);
	setOptDefault("maxConeRadius", 10);
	setOptDefault("yaw", Math.PI/ 8);
	setOptDefault("pitch", Math.PI / 8);
	this.options = options;

	// init conic
	this.conicsEl = conicsContainer;
	this.conics = new Conics(
		options.maxConeRadius,
		this.conicsEl.get(0),
		this.conicsEl.width(),
		this.conicsEl.height()
	);
	this.conicsEl.data(CONIC_UI, this);

	if (options.pitch)		this.conics.c3d.setPitch(options.pitch);
	if (options.yaw)			this.conics.c3d.setYaw(options.yaw);
	if (options.planeX)		this.conics.setPlaneX(options.planeX);
	if (options.planeY)		this.conics.setPlaneY(options.planeY);
	if (options.planeZ)		this.conics.setPlaneZ(options.planeZ);
	if (options.planeRot)	this.conics.setPlaneRot(options.planeRot);

	if (!options.disableCameraDragging)
		this.initCameraDrag();

	this.initDrawLoop();

	// first time update
	this.onPlaneUpdate();
}

ConicsUI.prototype = {
	initCameraDrag: function() {

		$(this.conicsEl).mousedown(function(event) {
			var self = $(this).data(CONIC_UI);
			if (!self) {
				alert("Could not find conicUI data on conic DOM element");
				return;
			}

			self.dragging = true;
			$(document).data(DRAG_CONIC_UI, self);
			self.md_x = event.screenX;
			self.md_y = event.screenY;

			document.body.style.cursor = "move";

			// prevent text selecting
			document.body.focus();
			document.onselectstart = function () { return false; };
		});

		$(document).mousemove(function(event) {
			var self = $(document).data(DRAG_CONIC_UI);
			if (!self || !self.dragging) return;

			// get delta x and y
			var d_x = event.screenX - self.md_x;
			var d_y = event.screenY - self.md_y;
			self.md_x = event.screenX;
			self.md_y = event.screenY;

			// update camera
			var c3d = self.conics.c3d;
			var yaw = c3d.getYaw();
			var pitch = c3d.getPitch();
			var inc_yaw		= d_y / self.conicsEl.height()	* Math.PI;
			var inc_pitch	= d_x / self.conicsEl.width()		* Math.PI;
			c3d.setYaw(		yaw + inc_yaw );
			c3d.setPitch(	pitch + inc_pitch );
		});

		$(document).mouseup(function(event) {
			var self = $(document).data(DRAG_CONIC_UI);
			if (!self) return;
			$(document).removeData(CONIC_UI);
			if (!self.dragging) return;

			self.dragging = false;

			document.body.style.cursor = "default";

			// (un)prevent text selecting IE
			document.onselectstart = null;
		});
	},

	initDrawLoop: function() {
		var self = this;
		(function drawLoop(){
			ConicsUtil.requestAnimFrame(drawLoop);

			if (self.planeUpdated && typeof self.options.onPlaneUpdate == "function") {
				self.planeUpdated = false;
				self.options.onPlaneUpdate(self);
			}

			if (typeof self.options.drawOptions != "undefined")
				self.conics.draw(self.options.drawOptions);
			else
				self.conics.draw();

			if (typeof self.options.onDraw == "function") {
				self.options.onDraw(self);
			}
		})();
	},

	_createSlider: function(s) {
		var self = this;
		var slider = $("<div></div>");
		slider.slider(s.sliderOpts);

		slider.bind("slide slidechange", function(event, ui) {
			if (
				(event.type == "slide" && self.options.updateRealtime) ||
				(event.type == "slidechange")) {
					s.setValue(ui.value);
					s.valueContainer.html(s.getValue());
			 }
		});

		s.valueContainer.html(s.getValue());

		s.sliderContainer.append(slider);

		return s;
	},

	createXSlider: function(sliderEl, valueEl, opts) {
		var self = this;
		if (!opts) opts = {};
		this._createSlider({
			sliderContainer: sliderEl,
			setValue: function(v) { self.setPlaneX(v); },
			valueContainer: valueEl,
			getValue: function() { return self.getPlaneX().toFixed(1); },
			sliderOpts: {
				value: self.getPlaneX(),
				min: -this.options.maxConeRadius,
				max: this.options.maxConeRadius,
				step: 0.5,
				orientation: opts.vertical ? "vertical" : "horizontal"
			}
		});
	},

	createYSlider: function(sliderEl, valueEl, opts) {
		var self = this;
		if (!opts) opts = {};
		this._createSlider({
			sliderContainer: sliderEl,
			setValue: function(v) { self.setPlaneY(v); },
			valueContainer: valueEl,
			getValue: function() { return self.getPlaneY().toFixed(1); },
			sliderOpts: {
				value: self.getPlaneY(),
				min: -this.options.maxConeRadius,
				max: this.options.maxConeRadius,
				step: 0.5,
				orientation: opts.vertical ? "vertical" : "horizontal"
			}
		});
	},

	createZSlider: function(sliderEl, valueEl, opts) {
		var self = this;
		if (!opts) opts = {};
		this._createSlider({
			sliderContainer: sliderEl,
			setValue: function(v) { self.setPlaneZ(v); },
			valueContainer: valueEl,
			getValue: function() { return self.getPlaneZ().toFixed(1); },
			sliderOpts: {
				value: self.getPlaneZ(),
				min: -this.options.maxConeRadius,
				max: this.options.maxConeRadius,
				step: 0.5,
				orientation: opts.vertical ? "vertical" : "horizontal"
			}
		});
	},

	createRotSlider: function(sliderEl, valueEl, opts) {
		var self = this;
		if (!opts) opts = {};
		var TO_RAD = (Math.PI * 0.5 / 90);
		var TO_DEG = (360 / (Math.PI * 2));
		this._createSlider({
			sliderContainer: sliderEl,
			setValue: function(v) {
					self.setPlaneRot(
						v * TO_RAD
					);
				},
			valueContainer: valueEl,
			getValue: function() {
					var deg = self.getPlaneRot() * TO_DEG;
					return deg.toFixed(0) + "&deg;";
				},
			sliderOpts: {
				value: self.getPlaneRot() * TO_DEG,
				min: -90,
				max: 90,
				orientation: opts.vertical ? "vertical" : "horizontal"
			}
		});
	},

	createRealtimeCheckbox:  function(containerEl, enabler) {
		var self = this;
		var checked = '';
		if (this.options.updateRealtime && enabler)
			checked = ' checked="checked" ';
		var realtimeCbox = $('<input type="checkbox"'+ checked +'/>');
		var form = $("<form></form>");
		form.append(realtimeCbox);
		realtimeCbox.click(function() {
			var c = $(this).is(':checked');
			if (!enabler) c = !c;
			self.options.updateRealtime = c;
		});
		containerEl.append(form);
	},

	onPlaneUpdate: function () {
		this.planeUpdated = true;
	},

	setPlaneX: function(x) {
		this.conics.setPlaneX(x);
		this.onPlaneUpdate();
	},

	getPlaneX: function() {
		return this.conics.getPlaneX();
	},

	setPlaneY: function(y) {
		this.conics.setPlaneY(y);
		this.onPlaneUpdate();
	},

	getPlaneY: function() {
		return this.conics.getPlaneY();
	},

	setPlaneZ: function(z) {
		this.conics.setPlaneZ(z);
		this.onPlaneUpdate();
	},

	getPlaneZ: function() {
		return this.conics.getPlaneZ();
	},

	setPlaneRot: function(rot) {
		this.conics.setPlaneRot(rot);
		this.onPlaneUpdate();
	},

	getPlaneRot: function(rot) {
		return this.conics.getPlaneRot();
	}
};

// register globals
window.Conics = Conics;
window.ConicsUtil = ConicsUtil;
window.ConicsUI = ConicsUI;
window.ConicType = ConicType;
})();