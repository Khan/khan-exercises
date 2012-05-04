$.extend(KhanUtil, {
    createMinecraftWorld: function(f) {
      $("#problem-and-answer").css({width: '1150px', marginLeft: '5px'});
      Minecraft.start(f);
    }
});
(function() {
  var abstract_method, abstract_property, callIt, clone, define, eq, isAbstract, methods, methodsOfInstance, methodsOfInstanceWhile, methodsWhile, mixin, mixinWith, patch, puts, raise;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty;
  puts = function() {
    var _i, _len, _ref, arg, args;
    args = __slice.call(arguments, 0);
    if (!(this["console"])) {
      return null;
    }
    _ref = args;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      arg = _ref[_i];
      console.log(arg);
    }
    return null;
  };
  raise = function(message) {
    throw new Error(message);
  };
  abstract_method = function() {
    return raise("Subclass responsability");
  };
  abstract_property = function() {
    return raise("Abstract property");
  };
  clone = function(obj) {
    var _ref, k, ret, v;
    if (!(typeof obj !== "undefined" && obj !== null)) {
      return obj;
    }
    ret = {};
    _ref = obj;
    for (k in _ref) {
      if (!__hasProp.call(_ref, k)) continue;
      v = _ref[k];
      ret[k] = v;
    }
    return ret;
  };
  eq = function(x, y) {
    return x == y;
  };
  define = function(clas, methodName, func) {
    return (clas.prototype[methodName] = func);
  };
  patch = function(clas, mixed) {
    var _ref, method, name;
    _ref = mixed;
    for (name in _ref) {
      if (!__hasProp.call(_ref, name)) continue;
      method = _ref[name];
      (define(clas, name, method));
    }
    return null;
  };
  isAbstract = function(m) {
    return m === abstract_method || m === abstract_property;
  };
  mixinWith = function(clas, mixed) {
    var _ref, _ref2, m, name;
    _ref = mixed;
    for (name in _ref) {
      if (!__hasProp.call(_ref, name)) continue;
      m = _ref[name];
      if (!(isAbstract(m) || ((typeof (_ref2 = clas.prototype[name]) !== "undefined" && _ref2 !== null) && !isAbstract(clas.prototype[name])))) {
        define(clas, name, m);
      }
    }
    return null;
  };
  mixin = function(clas) {
    var _i, _len, _ref, trait, traits;
    traits = __slice.call(arguments, 1);
    _ref = traits;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      trait = _ref[_i];
      mixinWith(clas, trait);
    }
    return null;
  };
  methods = function(clas) {
    var _i, _ref, _result, c, ret;
    ret = (function() {
      _result = []; _ref = clas.prototype;
      for (c in _ref) {
        if (!__hasProp.call(_ref, c)) continue;
        _i = _ref[c];
        _result.push(c);
      }
      return _result;
    })();
    if (!(clas.__super__)) {
      return ret;
    }
    return ret.concat(methods(clas.__super__.constructor));
  };
  methodsWhile = function(clas, func) {
    var _i, _ref, _result, c, ret;
    if (!(func(clas))) {
      return [];
    }
    ret = (function() {
      _result = []; _ref = clas.prototype;
      for (c in _ref) {
        if (!__hasProp.call(_ref, c)) continue;
        _i = _ref[c];
        _result.push(c);
      }
      return _result;
    })();
    if (!(clas.__super__)) {
      return ret;
    }
    return ret.concat(methodsWhile(clas.__super__.constructor, func));
  };
  methodsOfInstance = function(instance) {
    return methods(instance.constructor);
  };
  methodsOfInstanceWhile = function(instance, func) {
    return methodsWhile(instance.constructor, func);
  };
  callIt = function(f) {
    return f();
  };
window.abstract_method = abstract_method
window.abstract_property = abstract_property
window.callIt = callIt
window.clone = clone
window.define = define
window.eq = eq
window.isAbstract = isAbstract
window.methods = methods
window.methodsOfInstance = methodsOfInstance
window.methodsOfInstanceWhile = methodsOfInstanceWhile
window.methodsWhile = methodsWhile
window.mixin = mixin
window.mixinWith = mixinWith
window.patch = patch
window.puts = puts
window.raise = raise
}).call(this);

  patch(Number, {
    mod: function(arg) {
      if (this >= 0) return this % arg;
      return (this + arg) % arg;
    },
    div: function(arg) {
      return Math.floor(this / arg);
    },
    times: function(fn) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this) {
        _results.push(fn(i++));
      }
      return _results;
    },
    toRadians: function() {
      return (this * Math.PI) / 180;
    },
    toDegrees: function() {
      return (this * 180) / Math.PI;
    }
  });

  window.assoc = function(o, i) {
    var k, v;
    for (k in i) {
      v = i[k];
      o[k] = v;
    }
    return o;
  };
/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * https://github.com/tzuryby/jquery.hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){

	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},

		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {

                var stopEvent = function(evt) {
                    evt.cancelBubble=true;
                    evt.returnValue=false;
                    evt.keyCode=0;
                    return false;
                }

		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}

		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");

		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}

			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}

			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					var ret = origHandler.apply( this, arguments );
                                        stopEvent(event);
                                        return ret;
				}
			}
                        stopEvent(event);

		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = {add: keyHandler};
	});

})( jQuery );
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },

    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			window.setTimeout( callback, 1000 / 60 );

		};

	} )();

}
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

	canvas : !! window.CanvasRenderingContext2D,
	webgl : ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers : !! window.Worker,
	fileapi : window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage : function () {

		var domElement = document.createElement( 'div' );

		domElement.style.fontFamily = 'monospace';
		domElement.style.fontSize = '13px';
		domElement.style.textAlign = 'center';
		domElement.style.background = '#eee';
		domElement.style.color = '#000';
		domElement.style.padding = '1em';
		domElement.style.width = '475px';
		domElement.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			domElement.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' );

		}

		return domElement;

	},

	addGetWebGLMessage : function ( parameters ) {

		var parent, id, domElement;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		domElement = Detector.getWebGLErrorMessage();
		domElement.id = id;

		parent.appendChild( domElement );

	}

};
// Three.js r46 - http://github.com/mrdoob/three.js
/**
 * @author mr.doob / http://mrdoob.com/
 */

var THREE = THREE || {};

if ( ! self.Int32Array ) {

	self.Int32Array = Array;
	self.Float32Array = Array;

}
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Clock = function ( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.running = false;

};

THREE.Clock.prototype.start = function () {

	this.startTime = Date.now();
	this.oldTime = this.startTime;

	this.running = true;

};

THREE.Clock.prototype.stop = function () {

	this.getElapsedTime();

	this.running = false;

};

THREE.Clock.prototype.getElapsedTime = function () {

	this.elapsedTime += this.getDelta();

	return this.elapsedTime;

};


THREE.Clock.prototype.getDelta = function () {

	var diff = 0;

	if ( this.autoStart && ! this.running ) {

		this.start();

	}

	if ( this.running ) {

		var newTime = Date.now();
		diff = 0.001 * ( newTime - this.oldTime );
		this.oldTime = newTime;

		this.elapsedTime += diff;

	}

	return diff;

};/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Color = function ( hex ) {

	if ( hex !== undefined ) this.setHex( hex );
	return this;

};

THREE.Color.prototype = {

	constructor: THREE.Color,

	r: 1, g: 1, b: 1,

	copy: function ( color ) {

		this.r = color.r;
		this.g = color.g;
		this.b = color.b;

		return this;

	},

	copyGammaToLinear: function ( color ) {

		this.r = color.r * color.r;
		this.g = color.g * color.g;
		this.b = color.b * color.b;

		return this;

	},

	copyLinearToGamma: function ( color ) {

		this.r = Math.sqrt( color.r );
		this.g = Math.sqrt( color.g );
		this.b = Math.sqrt( color.b );

		return this;

	},

	setRGB: function ( r, g, b ) {

		this.r = r;
		this.g = g;
		this.b = b;

		return this;

	},

	setHSV: function ( h, s, v ) {

		// based on MochiKit implementation by Bob Ippolito
		// h,s,v ranges are < 0.0 - 1.0 >

		var i, f, p, q, t;

		if ( v === 0 ) {

			this.r = this.g = this.b = 0;

		} else {

			i = Math.floor( h * 6 );
			f = ( h * 6 ) - i;
			p = v * ( 1 - s );
			q = v * ( 1 - ( s * f ) );
			t = v * ( 1 - ( s * ( 1 - f ) ) );

			switch ( i ) {

				case 1: this.r = q; this.g = v; this.b = p; break;
				case 2: this.r = p; this.g = v; this.b = t; break;
				case 3: this.r = p; this.g = q; this.b = v; break;
				case 4: this.r = t; this.g = p; this.b = v; break;
				case 5: this.r = v; this.g = p; this.b = q; break;
				case 6: // fall through
				case 0: this.r = v; this.g = t; this.b = p; break;

			}

		}

		return this;

	},

	setHex: function ( hex ) {

		hex = Math.floor( hex );

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	},

	getHex: function () {

		return ~~ ( this.r * 255 ) << 16 ^ ~~ ( this.g * 255 ) << 8 ^ ~~ ( this.b * 255 );

	},

	getContextStyle: function () {

		return 'rgb(' + Math.floor( this.r * 255 ) + ',' + Math.floor( this.g * 255 ) + ',' + Math.floor( this.b * 255 ) + ')';

	},

	clone: function () {

		return new THREE.Color().setRGB( this.r, this.g, this.b );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

THREE.Vector2.prototype = {

	constructor: THREE.Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	clone: function () {

		return new THREE.Vector2( this.x, this.y );

	},


	add: function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	sub: function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;

		} else {

			this.set( 0, 0 );

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( -1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},


	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},

	equals: function( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

THREE.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};


THREE.Vector3.prototype = {

	constructor: THREE.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	clone: function () {

		return new THREE.Vector3( this.x, this.y, this.z );

	},


	add: function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	sub: function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	multiply: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	multiplySelf: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	divideSelf: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( -1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	lengthManhattan: function () {

		// correct version
		// return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		return this.x + this.y + this.z;

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},


	cross: function ( a, b ) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	crossSelf: function ( v ) {

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},


	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		return new THREE.Vector3().sub( this, v ).lengthSq();

	},


	setPositionFromMatrix: function ( m ) {

		this.x = m.n14;
		this.y = m.n24;
		this.z = m.n34;

	},

	setRotationFromMatrix: function ( m ) {

		var cosY = Math.cos( this.y );

		this.y = Math.asin( m.n13 );

		if ( Math.abs( cosY ) > 0.00001 ) {

			this.x = Math.atan2( - m.n23 / cosY, m.n33 / cosY );
			this.z = Math.atan2( - m.n12 / cosY, m.n11 / cosY );

		} else {

			this.x = 0;
			this.z = Math.atan2( m.n21, m.n22 );

		}

	},

	isZero: function () {

		return ( this.lengthSq() < 0.0001 /* almostZero */ );

	}

};
/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

THREE.Vector4 = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

	constructor: THREE.Vector4,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

	},

	clone: function () {

		return new THREE.Vector4( this.x, this.y, this.z, this.w );

	},


	add: function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;
		this.w = v1.w + v2.w;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	sub: function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;
		this.w = v1.w - v2.w;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.w *= s;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;
			this.w /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( -1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq: function () {

		return this.dot( this );

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},


	lerpSelf: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		this.w += ( v.w - this.w ) * alpha;

		return this;

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Ray = function ( origin, direction ) {

	this.origin = origin || new THREE.Vector3();
	this.direction = direction || new THREE.Vector3();

	this.intersectScene = function ( scene ) {

		return this.intersectObjects( scene.children );

	};

	this.intersectObjects = function ( objects ) {

		var i, l, object,
		intersects = [];

		for ( i = 0, l = objects.length; i < l; i ++ ) {

			Array.prototype.push.apply( intersects, this.intersectObject( objects[ i ] ) );

		}

		intersects.sort( function ( a, b ) { return a.distance - b.distance; } );

		return intersects;

	};

	var a = new THREE.Vector3();
	var b = new THREE.Vector3();
	var c = new THREE.Vector3();
	var d = new THREE.Vector3();

	var origin = new THREE.Vector3();
	var direction = new THREE.Vector3();
	var vector = new THREE.Vector3();
	var normal = new THREE.Vector3();
	var intersectPoint = new THREE.Vector3()

	this.intersectObject = function ( object ) {

		var intersect, intersects = [];

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			Array.prototype.push.apply( intersects, this.intersectObject( object.children[ i ] ) );

		}

		if ( object instanceof THREE.Particle ) {

			var distance = distanceFromIntersection( this.origin, this.direction, object.matrixWorld.getPosition() );

			if ( distance === null || distance > object.scale.x ) {

				return [];

			}

			intersect = {

				distance: distance,
				point: object.position,
				face: null,
				object: object

			};

			intersects.push( intersect );

		} else if ( object instanceof THREE.Mesh ) {

			// Checking boundingSphere

			var distance = distanceFromIntersection( this.origin, this.direction, object.matrixWorld.getPosition() );

			if ( distance === null || distance > object.geometry.boundingSphere.radius * Math.max( object.scale.x, Math.max( object.scale.y, object.scale.z ) ) ) {

				return intersects;

			}

			// Checking faces

			var f, fl, face, dot, scalar,
			geometry = object.geometry,
			vertices = geometry.vertices,
			objMatrix;

			object.matrixRotationWorld.extractRotation( object.matrixWorld );

			for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

				face = geometry.faces[ f ];

				origin.copy( this.origin );
				direction.copy( this.direction );

				objMatrix = object.matrixWorld;

				// check if face.centroid is behind the origin

				vector = objMatrix.multiplyVector3( vector.copy( face.centroid ) ).subSelf( origin );
				dot = vector.dot( direction );

				if ( dot <= 0 ) continue;

				//

				a = objMatrix.multiplyVector3( a.copy( vertices[ face.a ].position ) );
				b = objMatrix.multiplyVector3( b.copy( vertices[ face.b ].position ) );
				c = objMatrix.multiplyVector3( c.copy( vertices[ face.c ].position ) );
				d = face instanceof THREE.Face4 ? objMatrix.multiplyVector3( d.copy( vertices[ face.d ].position ) ) : null;

				normal = object.matrixRotationWorld.multiplyVector3( normal.copy( face.normal ) );
				dot = direction.dot( normal );

				if ( object.doubleSided || ( object.flipSided ? dot > 0 : dot < 0 ) ) { // Math.abs( dot ) > 0.0001

					scalar = normal.dot( vector.sub( a, origin ) ) / dot;
					intersectPoint.add( origin, direction.multiplyScalar( scalar ) );

					if ( face instanceof THREE.Face3 ) {

						if ( pointInFace3( intersectPoint, a, b, c ) ) {

							intersect = {

								distance: origin.distanceTo( intersectPoint ),
								point: intersectPoint.clone(),
								face: face,
								object: object

							};

							intersects.push( intersect );

						}

					} else if ( face instanceof THREE.Face4 ) {

						if ( pointInFace3( intersectPoint, a, b, d ) || pointInFace3( intersectPoint, b, c, d ) ) {

							intersect = {

								distance: origin.distanceTo( intersectPoint ),
								point: intersectPoint.clone(),
								face: face,
								object: object

							};

							intersects.push( intersect );

						}

					}

				}

			}

		}

		return intersects;

	}

	var v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
	var dot, intersect, distance;

	function distanceFromIntersection( origin, direction, position ) {

		v0.sub( position, origin );
		dot = v0.dot( direction );

		if ( dot <= 0 ) return null; // check if position behind origin.

		intersect = v1.add( origin, v2.copy( direction ).multiplyScalar( dot ) );
		distance = position.distanceTo( intersect );

		return distance;

	}

	// http://www.blackpawn.com/texts/pointinpoly/default.html

	var dot00, dot01, dot02, dot11, dot12, invDenom, u, v;

	function pointInFace3( p, a, b, c ) {

		v0.sub( c, a );
		v1.sub( b, a );
		v2.sub( p, a );

		dot00 = v0.dot( v0 );
		dot01 = v0.dot( v1 );
		dot02 = v0.dot( v2 );
		dot11 = v1.dot( v1 );
		dot12 = v1.dot( v2 );

		invDenom = 1 / ( dot00 * dot11 - dot01 * dot01 );
		u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
		v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

		return ( u >= 0 ) && ( v >= 0 ) && ( u + v < 1 );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Rectangle = function () {

	var _left, _top, _right, _bottom,
	_width, _height, _isEmpty = true;

	function resize() {

		_width = _right - _left;
		_height = _bottom - _top;

	}

	this.getX = function () {

		return _left;

	};

	this.getY = function () {

		return _top;

	};

	this.getWidth = function () {

		return _width;

	};

	this.getHeight = function () {

		return _height;

	};

	this.getLeft = function() {

		return _left;

	};

	this.getTop = function() {

		return _top;

	};

	this.getRight = function() {

		return _right;

	};

	this.getBottom = function() {

		return _bottom;

	};

	this.set = function ( left, top, right, bottom ) {

		_isEmpty = false;

		_left = left; _top = top;
		_right = right; _bottom = bottom;

		resize();

	};

	this.addPoint = function ( x, y ) {

		if ( _isEmpty ) {

			_isEmpty = false;
			_left = x; _top = y;
			_right = x; _bottom = y;

			resize();

		} else {

			_left = _left < x ? _left : x; // Math.min( _left, x );
			_top = _top < y ? _top : y; // Math.min( _top, y );
			_right = _right > x ? _right : x; // Math.max( _right, x );
			_bottom = _bottom > y ? _bottom : y; // Math.max( _bottom, y );

			resize();
		}

	};

	this.add3Points = function ( x1, y1, x2, y2, x3, y3 ) {

		if (_isEmpty) {

			_isEmpty = false;
			_left = x1 < x2 ? ( x1 < x3 ? x1 : x3 ) : ( x2 < x3 ? x2 : x3 );
			_top = y1 < y2 ? ( y1 < y3 ? y1 : y3 ) : ( y2 < y3 ? y2 : y3 );
			_right = x1 > x2 ? ( x1 > x3 ? x1 : x3 ) : ( x2 > x3 ? x2 : x3 );
			_bottom = y1 > y2 ? ( y1 > y3 ? y1 : y3 ) : ( y2 > y3 ? y2 : y3 );

			resize();

		} else {

			_left = x1 < x2 ? ( x1 < x3 ? ( x1 < _left ? x1 : _left ) : ( x3 < _left ? x3 : _left ) ) : ( x2 < x3 ? ( x2 < _left ? x2 : _left ) : ( x3 < _left ? x3 : _left ) );
			_top = y1 < y2 ? ( y1 < y3 ? ( y1 < _top ? y1 : _top ) : ( y3 < _top ? y3 : _top ) ) : ( y2 < y3 ? ( y2 < _top ? y2 : _top ) : ( y3 < _top ? y3 : _top ) );
			_right = x1 > x2 ? ( x1 > x3 ? ( x1 > _right ? x1 : _right ) : ( x3 > _right ? x3 : _right ) ) : ( x2 > x3 ? ( x2 > _right ? x2 : _right ) : ( x3 > _right ? x3 : _right ) );
			_bottom = y1 > y2 ? ( y1 > y3 ? ( y1 > _bottom ? y1 : _bottom ) : ( y3 > _bottom ? y3 : _bottom ) ) : ( y2 > y3 ? ( y2 > _bottom ? y2 : _bottom ) : ( y3 > _bottom ? y3 : _bottom ) );

			resize();

		};

	};

	this.addRectangle = function ( r ) {

		if ( _isEmpty ) {

			_isEmpty = false;
			_left = r.getLeft(); _top = r.getTop();
			_right = r.getRight(); _bottom = r.getBottom();

			resize();

		} else {

			_left = _left < r.getLeft() ? _left : r.getLeft(); // Math.min(_left, r.getLeft() );
			_top = _top < r.getTop() ? _top : r.getTop(); // Math.min(_top, r.getTop() );
			_right = _right > r.getRight() ? _right : r.getRight(); // Math.max(_right, r.getRight() );
			_bottom = _bottom > r.getBottom() ? _bottom : r.getBottom(); // Math.max(_bottom, r.getBottom() );

			resize();

		}

	};

	this.inflate = function ( v ) {

		_left -= v; _top -= v;
		_right += v; _bottom += v;

		resize();

	};

	this.minSelf = function ( r ) {

		_left = _left > r.getLeft() ? _left : r.getLeft(); // Math.max( _left, r.getLeft() );
		_top = _top > r.getTop() ? _top : r.getTop(); // Math.max( _top, r.getTop() );
		_right = _right < r.getRight() ? _right : r.getRight(); // Math.min( _right, r.getRight() );
		_bottom = _bottom < r.getBottom() ? _bottom : r.getBottom(); // Math.min( _bottom, r.getBottom() );

		resize();

	};

	this.intersects = function ( r ) {

		return Math.min( _right, r.getRight() ) - Math.max( _left, r.getLeft() ) >= 0 &&
		        Math.min( _bottom, r.getBottom() ) - Math.max( _top, r.getTop() ) >= 0;

	};

	this.empty = function () {

		_isEmpty = true;

		_left = 0; _top = 0;
		_right = 0; _bottom = 0;

		resize();

	};

	this.isEmpty = function () {

		return _isEmpty;

	};

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Math = {

	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	clampBottom: function ( x, a ) {

		return x < a ? a : x;

	},

	mapLinear: function( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// Get 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function() {

		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;

	}

};
THREE.Matrix3 = function () {

	this.m = [];

};

THREE.Matrix3.prototype = {

	constructor: THREE.Matrix3,

	transpose: function () {

		var tmp, m = this.m;

		tmp = m[1]; m[1] = m[3]; m[3] = tmp;
		tmp = m[2]; m[2] = m[6]; m[6] = tmp;
		tmp = m[5]; m[5] = m[7]; m[7] = tmp;

		return this;

	},

	transposeIntoArray: function ( r ) {

		var m = this.m;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 */

THREE.Matrix4 = function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

	this.set(

		( n11 !== undefined ) ? n11 : 1, n12 || 0, n13 || 0, n14 || 0,
		n21 || 0, ( n22 !== undefined ) ? n22 : 1, n23 || 0, n24 || 0,
		n31 || 0, n32 || 0, ( n33 !== undefined ) ? n33 : 1, n34 || 0,
		n41 || 0, n42 || 0, n43 || 0, ( n44 !== undefined ) ? n44 : 1

	);

	this.flat = new Array( 16 );
	this.m33 = new THREE.Matrix3();

};

THREE.Matrix4.prototype = {

	constructor: THREE.Matrix4,

	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		this.n11 = n11; this.n12 = n12; this.n13 = n13; this.n14 = n14;
		this.n21 = n21; this.n22 = n22; this.n23 = n23; this.n24 = n24;
		this.n31 = n31; this.n32 = n32; this.n33 = n33; this.n34 = n34;
		this.n41 = n41; this.n42 = n42; this.n43 = n43; this.n44 = n44;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		this.set(

			m.n11, m.n12, m.n13, m.n14,
			m.n21, m.n22, m.n23, m.n24,
			m.n31, m.n32, m.n33, m.n34,
			m.n41, m.n42, m.n43, m.n44

		);

		return this;

	},

	lookAt: function ( eye, center, up ) {

		var x = THREE.Matrix4.__v1, y = THREE.Matrix4.__v2, z = THREE.Matrix4.__v3;

		z.sub( eye, center ).normalize();

		if ( z.length() === 0 ) {

			z.z = 1;

		}

		x.cross( up, z ).normalize();

		if ( x.length() === 0 ) {

			z.x += 0.0001;
			x.cross( up, z ).normalize();

		}

		y.cross( z, x ).normalize();


		this.n11 = x.x; this.n12 = y.x; this.n13 = z.x;
		this.n21 = x.y; this.n22 = y.y; this.n23 = z.y;
		this.n31 = x.z; this.n32 = y.z; this.n33 = z.z;

		return this;

	},

	multiply: function ( a, b ) {

		var a11 = a.n11, a12 = a.n12, a13 = a.n13, a14 = a.n14,
		a21 = a.n21, a22 = a.n22, a23 = a.n23, a24 = a.n24,
		a31 = a.n31, a32 = a.n32, a33 = a.n33, a34 = a.n34,
		a41 = a.n41, a42 = a.n42, a43 = a.n43, a44 = a.n44,

		b11 = b.n11, b12 = b.n12, b13 = b.n13, b14 = b.n14,
		b21 = b.n21, b22 = b.n22, b23 = b.n23, b24 = b.n24,
		b31 = b.n31, b32 = b.n32, b33 = b.n33, b34 = b.n34,
		b41 = b.n41, b42 = b.n42, b43 = b.n43, b44 = b.n44;

		this.n11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		this.n12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		this.n13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		this.n14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		this.n21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		this.n22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		this.n23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		this.n24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		this.n31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		this.n32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		this.n33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		this.n34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		this.n41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		this.n42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		this.n43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		this.n44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplySelf: function ( m ) {

		return this.multiply( this, m );

	},

	multiplyToArray: function ( a, b, r ) {

		this.multiply( a, b );

		r[ 0 ] = this.n11; r[ 1 ] = this.n21; r[ 2 ] = this.n31; r[ 3 ] = this.n41;
		r[ 4 ] = this.n12; r[ 5 ] = this.n22; r[ 6 ] = this.n32; r[ 7 ] = this.n42;
		r[ 8 ]  = this.n13; r[ 9 ]  = this.n23; r[ 10 ] = this.n33; r[ 11 ] = this.n43;
		r[ 12 ] = this.n14; r[ 13 ] = this.n24; r[ 14 ] = this.n34; r[ 15 ] = this.n44;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.n11 *= s; this.n12 *= s; this.n13 *= s; this.n14 *= s;
		this.n21 *= s; this.n22 *= s; this.n23 *= s; this.n24 *= s;
		this.n31 *= s; this.n32 *= s; this.n33 *= s; this.n34 *= s;
		this.n41 *= s; this.n42 *= s; this.n43 *= s; this.n44 *= s;

		return this;

	},

	multiplyVector3: function ( v ) {

		var vx = v.x, vy = v.y, vz = v.z,
		d = 1 / ( this.n41 * vx + this.n42 * vy + this.n43 * vz + this.n44 );

		v.x = ( this.n11 * vx + this.n12 * vy + this.n13 * vz + this.n14 ) * d;
		v.y = ( this.n21 * vx + this.n22 * vy + this.n23 * vz + this.n24 ) * d;
		v.z = ( this.n31 * vx + this.n32 * vy + this.n33 * vz + this.n34 ) * d;

		return v;

	},

	multiplyVector4: function ( v ) {

		var vx = v.x, vy = v.y, vz = v.z, vw = v.w;

		v.x = this.n11 * vx + this.n12 * vy + this.n13 * vz + this.n14 * vw;
		v.y = this.n21 * vx + this.n22 * vy + this.n23 * vz + this.n24 * vw;
		v.z = this.n31 * vx + this.n32 * vy + this.n33 * vz + this.n34 * vw;
		v.w = this.n41 * vx + this.n42 * vy + this.n43 * vz + this.n44 * vw;

		return v;

	},

	rotateAxis: function ( v ) {

		var vx = v.x, vy = v.y, vz = v.z;

		v.x = vx * this.n11 + vy * this.n12 + vz * this.n13;
		v.y = vx * this.n21 + vy * this.n22 + vz * this.n23;
		v.z = vx * this.n31 + vy * this.n32 + vz * this.n33;

		v.normalize();

		return v;

	},

	crossVector: function ( a ) {

		var v = new THREE.Vector4();

		v.x = this.n11 * a.x + this.n12 * a.y + this.n13 * a.z + this.n14 * a.w;
		v.y = this.n21 * a.x + this.n22 * a.y + this.n23 * a.z + this.n24 * a.w;
		v.z = this.n31 * a.x + this.n32 * a.y + this.n33 * a.z + this.n34 * a.w;

		v.w = ( a.w ) ? this.n41 * a.x + this.n42 * a.y + this.n43 * a.z + this.n44 * a.w : 1;

		return v;

	},

	determinant: function () {

		var n11 = this.n11, n12 = this.n12, n13 = this.n13, n14 = this.n14,
		n21 = this.n21, n22 = this.n22, n23 = this.n23, n24 = this.n24,
		n31 = this.n31, n32 = this.n32, n33 = this.n33, n34 = this.n34,
		n41 = this.n41, n42 = this.n42, n43 = this.n43, n44 = this.n44;

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
		return (
			n14 * n23 * n32 * n41-
			n13 * n24 * n32 * n41-
			n14 * n22 * n33 * n41+
			n12 * n24 * n33 * n41+

			n13 * n22 * n34 * n41-
			n12 * n23 * n34 * n41-
			n14 * n23 * n31 * n42+
			n13 * n24 * n31 * n42+

			n14 * n21 * n33 * n42-
			n11 * n24 * n33 * n42-
			n13 * n21 * n34 * n42+
			n11 * n23 * n34 * n42+

			n14 * n22 * n31 * n43-
			n12 * n24 * n31 * n43-
			n14 * n21 * n32 * n43+
			n11 * n24 * n32 * n43+

			n12 * n21 * n34 * n43-
			n11 * n22 * n34 * n43-
			n13 * n22 * n31 * n44+
			n12 * n23 * n31 * n44+

			n13 * n21 * n32 * n44-
			n11 * n23 * n32 * n44-
			n12 * n21 * n33 * n44+
			n11 * n22 * n33 * n44
		);

	},

	transpose: function () {

		var tmp;

		tmp = this.n21; this.n21 = this.n12; this.n12 = tmp;
		tmp = this.n31; this.n31 = this.n13; this.n13 = tmp;
		tmp = this.n32; this.n32 = this.n23; this.n23 = tmp;

		tmp = this.n41; this.n41 = this.n14; this.n14 = tmp;
		tmp = this.n42; this.n42 = this.n24; this.n24 = tmp;
		tmp = this.n43; this.n43 = this.n34; this.n43 = tmp;

		return this;

	},

	clone: function () {

		var m = new THREE.Matrix4();

		m.n11 = this.n11; m.n12 = this.n12; m.n13 = this.n13; m.n14 = this.n14;
		m.n21 = this.n21; m.n22 = this.n22; m.n23 = this.n23; m.n24 = this.n24;
		m.n31 = this.n31; m.n32 = this.n32; m.n33 = this.n33; m.n34 = this.n34;
		m.n41 = this.n41; m.n42 = this.n42; m.n43 = this.n43; m.n44 = this.n44;

		return m;

	},

	flatten: function () {

		this.flat[ 0 ] = this.n11; this.flat[ 1 ] = this.n21; this.flat[ 2 ] = this.n31; this.flat[ 3 ] = this.n41;
		this.flat[ 4 ] = this.n12; this.flat[ 5 ] = this.n22; this.flat[ 6 ] = this.n32; this.flat[ 7 ] = this.n42;
		this.flat[ 8 ]  = this.n13; this.flat[ 9 ]  = this.n23; this.flat[ 10 ] = this.n33; this.flat[ 11 ] = this.n43;
		this.flat[ 12 ] = this.n14; this.flat[ 13 ] = this.n24; this.flat[ 14 ] = this.n34; this.flat[ 15 ] = this.n44;

		return this.flat;

	},

	flattenToArray: function ( flat ) {

		flat[ 0 ] = this.n11; flat[ 1 ] = this.n21; flat[ 2 ] = this.n31; flat[ 3 ] = this.n41;
		flat[ 4 ] = this.n12; flat[ 5 ] = this.n22; flat[ 6 ] = this.n32; flat[ 7 ] = this.n42;
		flat[ 8 ]  = this.n13; flat[ 9 ]  = this.n23; flat[ 10 ] = this.n33; flat[ 11 ] = this.n43;
		flat[ 12 ] = this.n14; flat[ 13 ] = this.n24; flat[ 14 ] = this.n34; flat[ 15 ] = this.n44;

		return flat;

	},

	flattenToArrayOffset: function( flat, offset ) {

		flat[ offset ] = this.n11;
		flat[ offset + 1 ] = this.n21;
		flat[ offset + 2 ] = this.n31;
		flat[ offset + 3 ] = this.n41;

		flat[ offset + 4 ] = this.n12;
		flat[ offset + 5 ] = this.n22;
		flat[ offset + 6 ] = this.n32;
		flat[ offset + 7 ] = this.n42;

		flat[ offset + 8 ]  = this.n13;
		flat[ offset + 9 ]  = this.n23;
		flat[ offset + 10 ] = this.n33;
		flat[ offset + 11 ] = this.n43;

		flat[ offset + 12 ] = this.n14;
		flat[ offset + 13 ] = this.n24;
		flat[ offset + 14 ] = this.n34;
		flat[ offset + 15 ] = this.n44;

		return flat;

	},

	setTranslation: function( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	setScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	setRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, -s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	setRotationY: function( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			-s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	setRotationZ: function( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, -s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	setRotationAxis: function( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle ),
		s = Math.sin( angle ),
		t = 1 - c,
		x = axis.x, y = axis.y, z = axis.z,
		tx = t * x, ty = t * y;

		this.set(

		 	tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	setPosition: function ( v ) {

		this.n14 = v.x;
		this.n24 = v.y;
		this.n34 = v.z;

		return this;

	},

	getPosition: function () {

		return THREE.Matrix4.__v1.set( this.n14, this.n24, this.n34 );

	},

	getColumnX: function () {

		return THREE.Matrix4.__v1.set( this.n11, this.n21, this.n31 );

	},

	getColumnY: function () {

		return THREE.Matrix4.__v1.set( this.n12, this.n22, this.n32 );

	},

	getColumnZ: function() {

		return THREE.Matrix4.__v1.set( this.n13, this.n23, this.n33 );

	},

	getInverse: function ( m ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm

		var n11 = m.n11, n12 = m.n12, n13 = m.n13, n14 = m.n14,
		n21 = m.n21, n22 = m.n22, n23 = m.n23, n24 = m.n24,
		n31 = m.n31, n32 = m.n32, n33 = m.n33, n34 = m.n34,
		n41 = m.n41, n42 = m.n42, n43 = m.n43, n44 = m.n44;

		this.n11 = n23*n34*n42 - n24*n33*n42 + n24*n32*n43 - n22*n34*n43 - n23*n32*n44 + n22*n33*n44;
		this.n12 = n14*n33*n42 - n13*n34*n42 - n14*n32*n43 + n12*n34*n43 + n13*n32*n44 - n12*n33*n44;
		this.n13 = n13*n24*n42 - n14*n23*n42 + n14*n22*n43 - n12*n24*n43 - n13*n22*n44 + n12*n23*n44;
		this.n14 = n14*n23*n32 - n13*n24*n32 - n14*n22*n33 + n12*n24*n33 + n13*n22*n34 - n12*n23*n34;
		this.n21 = n24*n33*n41 - n23*n34*n41 - n24*n31*n43 + n21*n34*n43 + n23*n31*n44 - n21*n33*n44;
		this.n22 = n13*n34*n41 - n14*n33*n41 + n14*n31*n43 - n11*n34*n43 - n13*n31*n44 + n11*n33*n44;
		this.n23 = n14*n23*n41 - n13*n24*n41 - n14*n21*n43 + n11*n24*n43 + n13*n21*n44 - n11*n23*n44;
		this.n24 = n13*n24*n31 - n14*n23*n31 + n14*n21*n33 - n11*n24*n33 - n13*n21*n34 + n11*n23*n34;
		this.n31 = n22*n34*n41 - n24*n32*n41 + n24*n31*n42 - n21*n34*n42 - n22*n31*n44 + n21*n32*n44;
		this.n32 = n14*n32*n41 - n12*n34*n41 - n14*n31*n42 + n11*n34*n42 + n12*n31*n44 - n11*n32*n44;
		this.n33 = n13*n24*n41 - n14*n22*n41 + n14*n21*n42 - n11*n24*n42 - n12*n21*n44 + n11*n22*n44;
		this.n34 = n14*n22*n31 - n12*n24*n31 - n14*n21*n32 + n11*n24*n32 + n12*n21*n34 - n11*n22*n34;
		this.n41 = n23*n32*n41 - n22*n33*n41 - n23*n31*n42 + n21*n33*n42 + n22*n31*n43 - n21*n32*n43;
		this.n42 = n12*n33*n41 - n13*n32*n41 + n13*n31*n42 - n11*n33*n42 - n12*n31*n43 + n11*n32*n43;
		this.n43 = n13*n22*n41 - n12*n23*n41 - n13*n21*n42 + n11*n23*n42 + n12*n21*n43 - n11*n22*n43;
		this.n44 = n12*n23*n31 - n13*n22*n31 + n13*n21*n32 - n11*n23*n32 - n12*n21*n33 + n11*n22*n33;
		this.multiplyScalar( 1 / m.determinant() );

		return this;

	},

	setRotationFromEuler: function( v, order ) {

		var x = v.x, y = v.y, z = v.z,
		a = Math.cos( x ), b = Math.sin( x ),
		c = Math.cos( y ), d = Math.sin( y ),
		e = Math.cos( z ), f = Math.sin( z );

		switch ( order ) {

			case 'YXZ':

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				this.n11 = ce + df * b;
				this.n12 = de * b - cf;
				this.n13 = a * d;

				this.n21 = a * f;
				this.n22 = a * e;
				this.n23 = - b;

				this.n31 = cf * b - de;
				this.n32 = df + ce * b;
				this.n33 = a * c;
				break;

			case 'ZXY':

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				this.n11 = ce - df * b;
				this.n12 = - a * f;
				this.n13 = de + cf * b;

				this.n21 = cf + de * b;
				this.n22 = a * e;
				this.n23 = df - ce * b;

				this.n31 = - a * d;
				this.n32 = b;
				this.n33 = a * c;
				break;

			case 'ZYX':

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				this.n11 = c * e;
				this.n12 = be * d - af;
				this.n13 = ae * d + bf;

				this.n21 = c * f;
				this.n22 = bf * d + ae;
				this.n23 = af * d - be;

				this.n31 = - d;
				this.n32 = b * c;
				this.n33 = a * c;
				break;

			case 'YZX':

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				this.n11 = c * e;
				this.n12 = bd - ac * f;
				this.n13 = bc * f + ad;

				this.n21 = f;
				this.n22 = a * e;
				this.n23 = - b * e;

				this.n31 = - d * e;
				this.n32 = ad * f + bc;
				this.n33 = ac - bd * f;
				break;

			case 'XZY':

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				this.n11 = c * e;
				this.n12 = - f;
				this.n13 = d * e;

				this.n21 = ac * f + bd;
				this.n22 = a * e;
				this.n23 = ad * f - bc;

				this.n31 = bc * f - ad;
				this.n32 = b * e;
				this.n33 = bd * f + ac;
				break;

			default: // 'XYZ'

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				this.n11 = c * e;
				this.n12 = - c * f;
				this.n13 = d;

				this.n21 = af + be * d;
				this.n22 = ae - bf * d;
				this.n23 = - b * c;

				this.n31 = bf - ae * d;
				this.n32 = be + af * d;
				this.n33 = a * c;
				break;

		}

		return this;

	},


	setRotationFromQuaternion: function( q ) {

		var x = q.x, y = q.y, z = q.z, w = q.w,
		x2 = x + x, y2 = y + y, z2 = z + z,
		xx = x * x2, xy = x * y2, xz = x * z2,
		yy = y * y2, yz = y * z2, zz = z * z2,
		wx = w * x2, wy = w * y2, wz = w * z2;

		this.n11 = 1 - ( yy + zz );
		this.n12 = xy - wz;
		this.n13 = xz + wy;

		this.n21 = xy + wz;
		this.n22 = 1 - ( xx + zz );
		this.n23 = yz - wx;

		this.n31 = xz - wy;
		this.n32 = yz + wx;
		this.n33 = 1 - ( xx + yy );

		return this;

	},

	scale: function ( v ) {

		var x = v.x, y = v.y, z = v.z;

		this.n11 *= x; this.n12 *= y; this.n13 *= z;
		this.n21 *= x; this.n22 *= y; this.n23 *= z;
		this.n31 *= x; this.n32 *= y; this.n33 *= z;
		this.n41 *= x; this.n42 *= y; this.n43 *= z;

		return this;

	},

	compose: function ( translation, rotation, scale ) {

		var mRotation = THREE.Matrix4.__m1;
		var mScale = THREE.Matrix4.__m2;

		mRotation.identity();
		mRotation.setRotationFromQuaternion( rotation );

		mScale.setScale( scale.x, scale.y, scale.z );

		this.multiply( mRotation, mScale );

		this.n14 = translation.x;
		this.n24 = translation.y;
		this.n34 = translation.z;

		return this;

	},

	decompose: function ( translation, rotation, scale ) {

		// grab the axis vectors

		var x = THREE.Matrix4.__v1;
		var y = THREE.Matrix4.__v2;
		var z = THREE.Matrix4.__v3;

		x.set( this.n11, this.n21, this.n31 );
		y.set( this.n12, this.n22, this.n32 );
		z.set( this.n13, this.n23, this.n33 );

		translation = ( translation instanceof THREE.Vector3 ) ? translation : new THREE.Vector3();
		rotation = ( rotation instanceof THREE.Quaternion ) ? rotation : new THREE.Quaternion();
		scale = ( scale instanceof THREE.Vector3 ) ? scale : new THREE.Vector3();

		scale.x = x.length();
		scale.y = y.length();
		scale.z = z.length();

		translation.x = this.n14;
		translation.y = this.n24;
		translation.z = this.n34;

		// scale the rotation part

		var matrix = THREE.Matrix4.__m1;

		matrix.copy( this );

		matrix.n11 /= scale.x;
		matrix.n21 /= scale.x;
		matrix.n31 /= scale.x;

		matrix.n12 /= scale.y;
		matrix.n22 /= scale.y;
		matrix.n32 /= scale.y;

		matrix.n13 /= scale.z;
		matrix.n23 /= scale.z;
		matrix.n33 /= scale.z;

		rotation.setFromRotationMatrix( matrix );

		return [ translation, rotation, scale ];

	},

	extractPosition: function ( m ) {

		this.n14 = m.n14;
		this.n24 = m.n24;
		this.n34 = m.n34;

		return this;

	},

	extractRotation: function ( m ) {

		var vector = THREE.Matrix4.__v1;

		var scaleX = 1 / vector.set( m.n11, m.n21, m.n31 ).length();
		var scaleY = 1 / vector.set( m.n12, m.n22, m.n32 ).length();
		var scaleZ = 1 / vector.set( m.n13, m.n23, m.n33 ).length();

		this.n11 = m.n11 * scaleX;
		this.n21 = m.n21 * scaleX;
		this.n31 = m.n31 * scaleX;

		this.n12 = m.n12 * scaleY;
		this.n22 = m.n22 * scaleY;
		this.n32 = m.n32 * scaleY;

		this.n13 = m.n13 * scaleZ;
		this.n23 = m.n23 * scaleZ;
		this.n33 = m.n33 * scaleZ;

		return this;

	}

};

THREE.Matrix4.makeInvert3x3 = function ( m1 ) {

	// input:  THREE.Matrix4, output: THREE.Matrix3
	// ( based on http://code.google.com/p/webgl-mjs/ )

	var m33 = m1.m33, m33m = m33.m,
	a11 =   m1.n33 * m1.n22 - m1.n32 * m1.n23,
	a21 = - m1.n33 * m1.n21 + m1.n31 * m1.n23,
	a31 =   m1.n32 * m1.n21 - m1.n31 * m1.n22,
	a12 = - m1.n33 * m1.n12 + m1.n32 * m1.n13,
	a22 =   m1.n33 * m1.n11 - m1.n31 * m1.n13,
	a32 = - m1.n32 * m1.n11 + m1.n31 * m1.n12,
	a13 =   m1.n23 * m1.n12 - m1.n22 * m1.n13,
	a23 = - m1.n23 * m1.n11 + m1.n21 * m1.n13,
	a33 =   m1.n22 * m1.n11 - m1.n21 * m1.n12,

	det = m1.n11 * a11 + m1.n21 * a12 + m1.n31 * a13,

	idet;

	// no inverse

	if ( det === 0 ) {

		console.error( 'THREE.Matrix4.makeInvert3x3: Matrix not invertible.' );

	}

	idet = 1.0 / det;

	m33m[ 0 ] = idet * a11; m33m[ 1 ] = idet * a21; m33m[ 2 ] = idet * a31;
	m33m[ 3 ] = idet * a12; m33m[ 4 ] = idet * a22; m33m[ 5 ] = idet * a32;
	m33m[ 6 ] = idet * a13; m33m[ 7 ] = idet * a23; m33m[ 8 ] = idet * a33;

	return m33;

}

THREE.Matrix4.makeFrustum = function ( left, right, bottom, top, near, far ) {

	var m, x, y, a, b, c, d;

	m = new THREE.Matrix4();

	x = 2 * near / ( right - left );
	y = 2 * near / ( top - bottom );

	a = ( right + left ) / ( right - left );
	b = ( top + bottom ) / ( top - bottom );
	c = - ( far + near ) / ( far - near );
	d = - 2 * far * near / ( far - near );

	m.n11 = x;  m.n12 = 0;  m.n13 = a;   m.n14 = 0;
	m.n21 = 0;  m.n22 = y;  m.n23 = b;   m.n24 = 0;
	m.n31 = 0;  m.n32 = 0;  m.n33 = c;   m.n34 = d;
	m.n41 = 0;  m.n42 = 0;  m.n43 = - 1; m.n44 = 0;

	return m;

};

THREE.Matrix4.makePerspective = function ( fov, aspect, near, far ) {

	var ymax, ymin, xmin, xmax;

	ymax = near * Math.tan( fov * Math.PI / 360 );
	ymin = - ymax;
	xmin = ymin * aspect;
	xmax = ymax * aspect;

	return THREE.Matrix4.makeFrustum( xmin, xmax, ymin, ymax, near, far );

};

THREE.Matrix4.makeOrtho = function ( left, right, top, bottom, near, far ) {

	var m, x, y, z, w, h, p;

	m = new THREE.Matrix4();

	w = right - left;
	h = top - bottom;
	p = far - near;

	x = ( right + left ) / w;
	y = ( top + bottom ) / h;
	z = ( far + near ) / p;

	m.n11 = 2 / w; m.n12 = 0;     m.n13 = 0;      m.n14 = -x;
	m.n21 = 0;     m.n22 = 2 / h; m.n23 = 0;      m.n24 = -y;
	m.n31 = 0;     m.n32 = 0;     m.n33 = -2 / p; m.n34 = -z;
	m.n41 = 0;     m.n42 = 0;     m.n43 = 0;      m.n44 = 1;

	return m;

};

THREE.Matrix4.__v1 = new THREE.Vector3();
THREE.Matrix4.__v2 = new THREE.Vector3();
THREE.Matrix4.__v3 = new THREE.Vector3();

THREE.Matrix4.__m1 = new THREE.Matrix4();
THREE.Matrix4.__m2 = new THREE.Matrix4();
/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Object3D = function () {

	this.name = '';

	this.id = THREE.Object3DCount ++;

	this.parent = undefined;
	this.children = [];

	this.up = new THREE.Vector3( 0, 1, 0 );

	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.eulerOrder = 'XYZ';
	this.scale = new THREE.Vector3( 1, 1, 1 );

	this.dynamic = false; // when true it retains arrays so they can be updated with __dirty*

	this.doubleSided = false;
	this.flipSided = false;

	this.renderDepth = null;

	this.rotationAutoUpdate = true;

	this.matrix = new THREE.Matrix4();
	this.matrixWorld = new THREE.Matrix4();
	this.matrixRotationWorld = new THREE.Matrix4();

	this.matrixAutoUpdate = true;
	this.matrixWorldNeedsUpdate = true;

	this.quaternion = new THREE.Quaternion();
	this.useQuaternion = false;

	this.boundRadius = 0.0;
	this.boundRadiusScale = 1.0;

	this.visible = true;

	this.castShadow = false;
	this.receiveShadow = false;

	this.frustumCulled = true;

	this._vector = new THREE.Vector3();

};


THREE.Object3D.prototype = {

	constructor: THREE.Object3D,

	translate: function ( distance, axis ) {

		this.matrix.rotateAxis( axis );
		this.position.addSelf( axis.multiplyScalar( distance ) );

	},

	translateX: function ( distance ) {

		this.translate( distance, this._vector.set( 1, 0, 0 ) );

	},

	translateY: function ( distance ) {

		this.translate( distance, this._vector.set( 0, 1, 0 ) );

	},

	translateZ: function ( distance ) {

		this.translate( distance, this._vector.set( 0, 0, 1 ) );

	},

	lookAt: function ( vector ) {

		// TODO: Add hierarchy support.

		this.matrix.lookAt( vector, this.position, this.up );

		if ( this.rotationAutoUpdate ) {

			this.rotation.setRotationFromMatrix( this.matrix );

		}

	},

	add: function ( object ) {

		if ( this.children.indexOf( object ) === - 1 ) {

			if ( object.parent !== undefined ) {

				object.parent.remove( object );

			}

			object.parent = this;
			this.children.push( object );

			// add to scene

			var scene = this;

			while ( scene.parent !== undefined ) {

				scene = scene.parent;

			}

			if ( scene !== undefined && scene instanceof THREE.Scene )  {

				scene.addObject( object );

			}

		}

	},

	remove: function ( object ) {

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = undefined;
			this.children.splice( index, 1 );

			// remove from scene

			var scene = this;

			while ( scene.parent !== undefined ) {

				scene = scene.parent;

			}

			if ( scene !== undefined && scene instanceof THREE.Scene ) {

				scene.removeObject( object );

			}

		}

	},

	getChildByName: function ( name, doRecurse ) {

		var c, cl, child, recurseResult;

		for ( c = 0, cl = this.children.length; c < cl; c ++ ) {

			child = this.children[ c ];

			if ( child.name === name ) {

				return child;

			}

			if ( doRecurse ) {

				recurseResult = child.getChildByName( name, doRecurse );

				if ( recurseResult !== undefined ) {

					return recurseResult;

				}

			}

		}

		return undefined;

	},

	updateMatrix: function () {

		this.matrix.setPosition( this.position );

		if ( this.useQuaternion )  {

			this.matrix.setRotationFromQuaternion( this.quaternion );

		} else {

			this.matrix.setRotationFromEuler( this.rotation, this.eulerOrder );

		}

		if ( this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1 ) {

			this.matrix.scale( this.scale );
			this.boundRadiusScale = Math.max( this.scale.x, Math.max( this.scale.y, this.scale.z ) );

		}

		this.matrixWorldNeedsUpdate = true;

	},

	updateMatrixWorld: function ( force ) {

		this.matrixAutoUpdate && this.updateMatrix();

		// update matrixWorld

		if ( this.matrixWorldNeedsUpdate || force ) {

			if ( this.parent ) {

				this.matrixWorld.multiply( this.parent.matrixWorld, this.matrix );

			} else {

				this.matrixWorld.copy( this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	}

};

THREE.Object3DCount = 0;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.Projector = function() {

	var _object, _objectCount, _objectPool = [],
	_vertex, _vertexCount, _vertexPool = [],
	_face, _face3Count, _face3Pool = [], _face4Count, _face4Pool = [],
	_line, _lineCount, _linePool = [],
	_particle, _particleCount, _particlePool = [],

	_renderData = { objects: [], sprites: [], lights: [], elements: [] },

	_vector3 = new THREE.Vector3(),
	_vector4 = new THREE.Vector4(),

	_projScreenMatrix = new THREE.Matrix4(),
	_projScreenobjectMatrixWorld = new THREE.Matrix4(),

	_frustum = [
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4()
	 ],

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4(),

	_face3VertexNormals;

	this.computeFrustum = function ( m ) {

		_frustum[ 0 ].set( m.n41 - m.n11, m.n42 - m.n12, m.n43 - m.n13, m.n44 - m.n14 );
		_frustum[ 1 ].set( m.n41 + m.n11, m.n42 + m.n12, m.n43 + m.n13, m.n44 + m.n14 );
		_frustum[ 2 ].set( m.n41 + m.n21, m.n42 + m.n22, m.n43 + m.n23, m.n44 + m.n24 );
		_frustum[ 3 ].set( m.n41 - m.n21, m.n42 - m.n22, m.n43 - m.n23, m.n44 - m.n24 );
		_frustum[ 4 ].set( m.n41 - m.n31, m.n42 - m.n32, m.n43 - m.n33, m.n44 - m.n34 );
		_frustum[ 5 ].set( m.n41 + m.n31, m.n42 + m.n32, m.n43 + m.n33, m.n44 + m.n34 );

		for ( var i = 0; i < 6; i ++ ) {

			var plane = _frustum[ i ];
			plane.divideScalar( Math.sqrt( plane.x * plane.x + plane.y * plane.y + plane.z * plane.z ) );

		}

	}

	this.projectVector = function ( vector, camera ) {

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
		_projScreenMatrix.multiplyVector3( vector );

		return vector;

	};

	this.unprojectVector = function ( vector, camera ) {

		camera.projectionMatrixInverse.getInverse( camera.projectionMatrix );

		_projScreenMatrix.multiply( camera.matrixWorld, camera.projectionMatrixInverse );
		_projScreenMatrix.multiplyVector3( vector );

		return vector;

	};

	/**
	 * Translates a 2D point from NDC to a THREE.Ray
	 * that can be used for picking.
	 * @vector - THREE.Vector3 that represents 2D point
	 * @camera - THREE.Camera
	 */
	this.pickingRay = function ( vector, camera ) {

		var end, ray, t;

		// set two vectors with opposing z values
		vector.z = -1.0;
		end = new THREE.Vector3( vector.x, vector.y, 1.0 );

		this.unprojectVector( vector, camera );
		this.unprojectVector( end, camera );

		// find direction from vector to end
		end.subSelf( vector ).normalize();

		return new THREE.Ray( vector, end );

	};

	this.projectGraph = function ( root, sort ) {

		_objectCount = 0;

		_renderData.objects.length = 0;
		_renderData.sprites.length = 0;
		_renderData.lights.length = 0;

		var projectObject = function ( object ) {

			if ( object.visible === false ) return;

			if ( ( object instanceof THREE.Mesh || object instanceof THREE.Line ) &&
			( object.frustumCulled === false || isInFrustum( object ) ) ) {

				_projScreenMatrix.multiplyVector3( _vector3.copy( object.position ) );

				_object = getNextObjectInPool();
				_object.object = object;
				_object.z = _vector3.z;

				_renderData.objects.push( _object );

			} else if ( object instanceof THREE.Sprite || object instanceof THREE.Particle ) {

				_projScreenMatrix.multiplyVector3( _vector3.copy( object.position ) );

				_object = getNextObjectInPool();
				_object.object = object;
				_object.z = _vector3.z;

				_renderData.sprites.push( _object );

			} else if ( object instanceof THREE.Light ) {

				_renderData.lights.push( object );

			}

			for ( var c = 0, cl = object.children.length; c < cl; c ++ ) {

				projectObject( object.children[ c ] );

			}

		};

		projectObject( root );

		sort && _renderData.objects.sort( painterSort );

		return _renderData;

	};

	this.projectScene = function ( scene, camera, sort ) {

		var near = camera.near, far = camera.far,
		o, ol, v, vl, f, fl, n, nl, c, cl, u, ul, object,
		objectMatrixWorld, objectMatrixWorldRotation, objectMaterial,
		geometry, geometryMaterials, vertices, vertex, vertexPositionScreen,
		faces, face, faceVertexNormals, normal, faceVertexUvs, uvs,
		v1, v2, v3, v4;

		_face3Count = 0;
		_face4Count = 0;
		_lineCount = 0;
		_particleCount = 0;

		_renderData.elements.length = 0;

		if ( camera.parent === undefined ) {

			console.warn( 'DEPRECATED: Camera hasn\'t been added to a Scene. Adding it...' );
			scene.add( camera );

		}

		scene.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );

		this.computeFrustum( _projScreenMatrix );

		_renderData = this.projectGraph( scene, false );

		for ( o = 0, ol = _renderData.objects.length; o < ol; o++ ) {

			object = _renderData.objects[ o ].object;

			objectMatrixWorld = object.matrixWorld;
			objectMaterial = object.material;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				geometry = object.geometry;
				geometryMaterials = object.geometry.materials;
				vertices = geometry.vertices;
				faces = geometry.faces;
				faceVertexUvs = geometry.faceVertexUvs;

				objectMatrixWorldRotation = object.matrixRotationWorld.extractRotation( objectMatrixWorld );

				for ( v = 0, vl = vertices.length; v < vl; v ++ ) {

					_vertex = getNextVertexInPool();
					_vertex.positionWorld.copy( vertices[ v ].position );

					objectMatrixWorld.multiplyVector3( _vertex.positionWorld );

					_vertex.positionScreen.copy( _vertex.positionWorld );
					_projScreenMatrix.multiplyVector4( _vertex.positionScreen );

					_vertex.positionScreen.x /= _vertex.positionScreen.w;
					_vertex.positionScreen.y /= _vertex.positionScreen.w;

					_vertex.visible = _vertex.positionScreen.z > near && _vertex.positionScreen.z < far;

				}

				for ( f = 0, fl = faces.length; f < fl; f ++ ) {

					face = faces[ f ];

					if ( face instanceof THREE.Face3 ) {

						v1 = _vertexPool[ face.a ];
						v2 = _vertexPool[ face.b ];
						v3 = _vertexPool[ face.c ];

						if ( v1.visible && v2.visible && v3.visible &&
							( object.doubleSided || ( object.flipSided !=
							( v3.positionScreen.x - v1.positionScreen.x ) * ( v2.positionScreen.y - v1.positionScreen.y ) -
							( v3.positionScreen.y - v1.positionScreen.y ) * ( v2.positionScreen.x - v1.positionScreen.x ) < 0 ) ) ) {

							_face = getNextFace3InPool();

							_face.v1.copy( v1 );
							_face.v2.copy( v2 );
							_face.v3.copy( v3 );

						} else {

							continue;

						}

					} else if ( face instanceof THREE.Face4 ) {

						v1 = _vertexPool[ face.a ];
						v2 = _vertexPool[ face.b ];
						v3 = _vertexPool[ face.c ];
						v4 = _vertexPool[ face.d ];

						if ( v1.visible && v2.visible && v3.visible && v4.visible &&
							( object.doubleSided || ( object.flipSided !=
							( ( v4.positionScreen.x - v1.positionScreen.x ) * ( v2.positionScreen.y - v1.positionScreen.y ) -
							( v4.positionScreen.y - v1.positionScreen.y ) * ( v2.positionScreen.x - v1.positionScreen.x ) < 0 ||
							( v2.positionScreen.x - v3.positionScreen.x ) * ( v4.positionScreen.y - v3.positionScreen.y ) -
							( v2.positionScreen.y - v3.positionScreen.y ) * ( v4.positionScreen.x - v3.positionScreen.x ) < 0 ) ) ) ) {

							_face = getNextFace4InPool();

							_face.v1.copy( v1 );
							_face.v2.copy( v2 );
							_face.v3.copy( v3 );
							_face.v4.copy( v4 );

						} else {

							continue;

						}

					}

					_face.normalWorld.copy( face.normal );
					objectMatrixWorldRotation.multiplyVector3( _face.normalWorld );

					_face.centroidWorld.copy( face.centroid );
					objectMatrixWorld.multiplyVector3( _face.centroidWorld );

					_face.centroidScreen.copy( _face.centroidWorld );
					_projScreenMatrix.multiplyVector3( _face.centroidScreen );

					faceVertexNormals = face.vertexNormals;

					for ( n = 0, nl = faceVertexNormals.length; n < nl; n ++ ) {

						normal = _face.vertexNormalsWorld[ n ];
						normal.copy( faceVertexNormals[ n ] );
						objectMatrixWorldRotation.multiplyVector3( normal );

					}

					for ( c = 0, cl = faceVertexUvs.length; c < cl; c ++ ) {

						uvs = faceVertexUvs[ c ][ f ];

						if ( !uvs ) continue;

						for ( u = 0, ul = uvs.length; u < ul; u ++ ) {

							_face.uvs[ c ][ u ] = uvs[ u ];

						}

					}

					_face.material = objectMaterial;
					_face.faceMaterial = face.materialIndex !== null ? geometryMaterials[ face.materialIndex ] : null;

					_face.z = _face.centroidScreen.z;

					_renderData.elements.push( _face );

				}

			} else if ( object instanceof THREE.Line ) {

				_projScreenobjectMatrixWorld.multiply( _projScreenMatrix, objectMatrixWorld );

				vertices = object.geometry.vertices;

				v1 = getNextVertexInPool();
				v1.positionScreen.copy( vertices[ 0 ].position );
				_projScreenobjectMatrixWorld.multiplyVector4( v1.positionScreen );

				for ( v = 1, vl = vertices.length; v < vl; v++ ) {

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ v ].position );
					_projScreenobjectMatrixWorld.multiplyVector4( v1.positionScreen );

					v2 = _vertexPool[ _vertexCount - 2 ];

					_clippedVertex1PositionScreen.copy( v1.positionScreen );
					_clippedVertex2PositionScreen.copy( v2.positionScreen );

					if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) ) {

						// Perform the perspective divide
						_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
						_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

						_line = getNextLineInPool();
						_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
						_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

						_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );

						_line.material = objectMaterial;

						_renderData.elements.push( _line );

					}

				}

			}

		}

		for ( o = 0, ol = _renderData.sprites.length; o < ol; o++ ) {

			object = _renderData.sprites[ o ].object;

			objectMatrixWorld = object.matrixWorld;

			if ( object instanceof THREE.Particle ) {

				_vector4.set( objectMatrixWorld.n14, objectMatrixWorld.n24, objectMatrixWorld.n34, 1 );
				_projScreenMatrix.multiplyVector4( _vector4 );

				_vector4.z /= _vector4.w;

				if ( _vector4.z > 0 && _vector4.z < 1 ) {

					_particle = getNextParticleInPool();
					_particle.x = _vector4.x / _vector4.w;
					_particle.y = _vector4.y / _vector4.w;
					_particle.z = _vector4.z;

					_particle.rotation = object.rotation.z;

					_particle.scale.x = object.scale.x * Math.abs( _particle.x - ( _vector4.x + camera.projectionMatrix.n11 ) / ( _vector4.w + camera.projectionMatrix.n14 ) );
					_particle.scale.y = object.scale.y * Math.abs( _particle.y - ( _vector4.y + camera.projectionMatrix.n22 ) / ( _vector4.w + camera.projectionMatrix.n24 ) );

					_particle.material = object.material;

					_renderData.elements.push( _particle );

				}

			}

		}

		sort && _renderData.elements.sort( painterSort );

		return _renderData;

	};

	// Pools

	function getNextObjectInPool() {

		var object = _objectPool[ _objectCount ] = _objectPool[ _objectCount ] || new THREE.RenderableObject();

		_objectCount ++;

		return object;

	}

	function getNextVertexInPool() {

		var vertex = _vertexPool[ _vertexCount ] = _vertexPool[ _vertexCount ] || new THREE.RenderableVertex();

		_vertexCount ++;

		return vertex;

	}

	function getNextFace3InPool() {

		var face = _face3Pool[ _face3Count ] = _face3Pool[ _face3Count ] || new THREE.RenderableFace3();

		_face3Count ++;

		return face;

	}

	function getNextFace4InPool() {

		var face = _face4Pool[ _face4Count ] = _face4Pool[ _face4Count ] || new THREE.RenderableFace4();

		_face4Count ++;

		return face;

	}

	function getNextLineInPool() {

		var line = _linePool[ _lineCount ] = _linePool[ _lineCount ] || new THREE.RenderableLine();

		_lineCount ++;

		return line;

	}

	function getNextParticleInPool() {

		var particle = _particlePool[ _particleCount ] = _particlePool[ _particleCount ] || new THREE.RenderableParticle();
		_particleCount ++;
		return particle;

	}

	//

	function painterSort( a, b ) {

		return b.z - a.z;

	}

	function isInFrustum( object ) {

		var distance, matrix = object.matrixWorld,
		radius = - object.geometry.boundingSphere.radius * Math.max( object.scale.x, Math.max( object.scale.y, object.scale.z ) );

		for ( var i = 0; i < 6; i ++ ) {

			distance = _frustum[ i ].x * matrix.n14 + _frustum[ i ].y * matrix.n24 + _frustum[ i ].z * matrix.n34 + _frustum[ i ].w;
			if ( distance <= radius ) return false;

		}

		return true;

	};

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0) || (bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerpSelf( s2, alpha1 );
				s2.lerpSelf( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Quaternion = function( x, y, z, w ) {

	this.set(

		x || 0,
		y || 0,
		z || 0,
		w !== undefined ? w : 1

	);

};

THREE.Quaternion.prototype = {

	constructor: THREE.Quaternion,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	copy: function ( q ) {

		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;

		return this;

	},

	setFromEuler: function ( vec3 ) {

		var c = Math.PI / 360, // 0.5 * Math.PI / 360, // 0.5 is an optimization
		x = vec3.x * c,
		y = vec3.y * c,
		z = vec3.z * c,

		c1 = Math.cos( y  ),
		s1 = Math.sin( y  ),
		c2 = Math.cos( -z ),
		s2 = Math.sin( -z ),
		c3 = Math.cos( x  ),
		s3 = Math.sin( x  ),

		c1c2 = c1 * c2,
		s1s2 = s1 * s2;

		this.w = c1c2 * c3  - s1s2 * s3;
	  	this.x = c1c2 * s3  + s1s2 * c3;
		this.y = s1 * c2 * c3 + c1 * s2 * s3;
		this.z = c1 * s2 * c3 - s1 * c2 * s3;

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
		// axis have to be normalized

		var halfAngle = angle / 2,
			s = Math.sin( halfAngle );

		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos( halfAngle );

		return this;

	},

	setFromRotationMatrix: function ( m ) {
		// Adapted from: http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
		function copySign(a, b) {
			return b < 0 ? -Math.abs(a) : Math.abs(a);
		}
		var absQ = Math.pow(m.determinant(), 1.0 / 3.0);
		this.w = Math.sqrt( Math.max( 0, absQ + m.n11 + m.n22 + m.n33 ) ) / 2;
		this.x = Math.sqrt( Math.max( 0, absQ + m.n11 - m.n22 - m.n33 ) ) / 2;
		this.y = Math.sqrt( Math.max( 0, absQ - m.n11 + m.n22 - m.n33 ) ) / 2;
		this.z = Math.sqrt( Math.max( 0, absQ - m.n11 - m.n22 + m.n33 ) ) / 2;
		this.x = copySign( this.x, ( m.n32 - m.n23 ) );
		this.y = copySign( this.y, ( m.n13 - m.n31 ) );
		this.z = copySign( this.z, ( m.n21 - m.n12 ) );
		this.normalize();
		return this;
	},

	calculateW : function () {

		this.w = - Math.sqrt( Math.abs( 1.0 - this.x * this.x - this.y * this.y - this.z * this.z ) );

		return this;

	},

	inverse: function () {

		this.x *= -1;
		this.y *= -1;
		this.z *= -1;

		return this;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	normalize: function () {

		var l = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

		if ( l === 0 ) {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 0;

		} else {

			l = 1 / l;

			this.x = this.x * l;
			this.y = this.y * l;
			this.z = this.z * l;
			this.w = this.w * l;

		}

		return this;

	},

	multiplySelf: function ( quat2 ) {

		var qax = this.x,  qay = this.y,  qaz = this.z,  qaw = this.w,
		qbx = quat2.x, qby = quat2.y, qbz = quat2.z, qbw = quat2.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;

	},

	multiply: function ( q1, q2 ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		this.x =  q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
		this.y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
		this.z =  q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
		this.w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;

		return this;

	},

	multiplyVector3: function ( vec, dest ) {

		if( !dest ) { dest = vec; }

		var x    = vec.x,  y  = vec.y,  z  = vec.z,
			qx   = this.x, qy = this.y, qz = this.z, qw = this.w;

		// calculate quat * vec

		var ix =  qw * x + qy * z - qz * y,
			iy =  qw * y + qz * x - qx * z,
			iz =  qw * z + qx * y - qy * x,
			iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return dest;

	}

}

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

	// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

	var cosHalfTheta = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;

	if (cosHalfTheta < 0) {
		qm.w = -qb.w; qm.x = -qb.x; qm.y = -qb.y; qm.z = -qb.z;
		cosHalfTheta = -cosHalfTheta;
	} else {
		qm.copy(qb);
	}

	if ( Math.abs( cosHalfTheta ) >= 1.0 ) {

		qm.w = qa.w; qm.x = qa.x; qm.y = qa.y; qm.z = qa.z;
		return qm;

	}

	var halfTheta = Math.acos( cosHalfTheta ),
	sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

	if ( Math.abs( sinHalfTheta ) < 0.001 ) {

		qm.w = 0.5 * ( qa.w + qb.w );
		qm.x = 0.5 * ( qa.x + qb.x );
		qm.y = 0.5 * ( qa.y + qb.y );
		qm.z = 0.5 * ( qa.z + qb.z );

		return qm;

	}

	var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
	ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

	qm.w = ( qa.w * ratioA + qm.w * ratioB );
	qm.x = ( qa.x * ratioA + qm.x * ratioB );
	qm.y = ( qa.y * ratioA + qm.y * ratioB );
	qm.z = ( qa.z * ratioA + qm.z * ratioB );

	return qm;

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Vertex = function ( position ) {

	this.position = position || new THREE.Vector3();

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color, materialIndex ) {

	this.a = a;
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [ ];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materialIndex = materialIndex;

	this.centroid = new THREE.Vector3();

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face4 = function ( a, b, c, d, normal, color, materialIndex ) {

	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [ ];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materialIndex = materialIndex;

	this.centroid = new THREE.Vector3();

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.UV = function ( u, v ) {

	this.u = u || 0;
	this.v = v || 0;

};

THREE.UV.prototype = {

	constructor: THREE.UV,

	set: function ( u, v ) {

		this.u = u;
		this.v = v;

		return this;

	},

	copy: function ( uv ) {

		this.u = uv.u;
		this.v = uv.v;

		return this;

	},

	clone: function () {

		return new THREE.UV( this.u, this.v );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Geometry = function () {

	this.id = THREE.GeometryCount ++;

	this.vertices = [];
	this.colors = []; // one-to-one vertex colors, used in ParticleSystem, Line and Ribbon

	this.materials = [];

	this.faces = [];

	this.faceUvs = [[]];
	this.faceVertexUvs = [[]];

	this.morphTargets = [];
	this.morphColors = [];

	this.skinWeights = [];
	this.skinIndices = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	this.hasTangents = false;

	this.dynamic = false; // unless set to true the *Arrays will be deleted once sent to a buffer.

};

THREE.Geometry.prototype = {

	constructor : THREE.Geometry,

	applyMatrix: function ( matrix ) {

		var matrixRotation = new THREE.Matrix4();
		matrixRotation.extractRotation( matrix, new THREE.Vector3( 1, 1, 1 ) );

		for ( var i = 0, il = this.vertices.length; i < il; i ++ ) {

			var vertex = this.vertices[ i ];

			matrix.multiplyVector3( vertex.position );

		}

		for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

			var face = this.faces[ i ];

			matrixRotation.multiplyVector3( face.normal );

			for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				matrixRotation.multiplyVector3( face.vertexNormals[ j ] );

			}

			matrix.multiplyVector3( face.centroid );

		}

	},

	computeCentroids: function () {

		var f, fl, face;

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];
			face.centroid.set( 0, 0, 0 );

			if ( face instanceof THREE.Face3 ) {

				face.centroid.addSelf( this.vertices[ face.a ].position );
				face.centroid.addSelf( this.vertices[ face.b ].position );
				face.centroid.addSelf( this.vertices[ face.c ].position );
				face.centroid.divideScalar( 3 );

			} else if ( face instanceof THREE.Face4 ) {

				face.centroid.addSelf( this.vertices[ face.a ].position );
				face.centroid.addSelf( this.vertices[ face.b ].position );
				face.centroid.addSelf( this.vertices[ face.c ].position );
				face.centroid.addSelf( this.vertices[ face.d ].position );
				face.centroid.divideScalar( 4 );

			}

		}

	},

	computeFaceNormals: function ( useVertexNormals ) {

		var n, nl, v, vl, vertex, f, fl, face, vA, vB, vC,
		cb = new THREE.Vector3(), ab = new THREE.Vector3();

		/*
		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertex = this.vertices[ v ];
			vertex.normal.set( 0, 0, 0 );

		}
		*/

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( useVertexNormals && face.vertexNormals.length  ) {

				cb.set( 0, 0, 0 );

				for ( n = 0, nl = face.vertexNormals.length; n < nl; n++ ) {

					cb.addSelf( face.vertexNormals[n] );

				}

				cb.divideScalar( 3 );

				if ( ! cb.isZero() ) {

					cb.normalize();

				}

				face.normal.copy( cb );

			} else {

				vA = this.vertices[ face.a ];
				vB = this.vertices[ face.b ];
				vC = this.vertices[ face.c ];

				cb.sub( vC.position, vB.position );
				ab.sub( vA.position, vB.position );
				cb.crossSelf( ab );

				if ( !cb.isZero() ) {

					cb.normalize();

				}

				face.normal.copy( cb );

			}

		}

	},

	computeVertexNormals: function () {

		var v, vl, f, fl, face, vertices;

		// create internal buffers for reuse when calling this method repeatedly
		// (otherwise memory allocation / deallocation every frame is big resource hog)

		if ( this.__tmpVertices === undefined ) {

			this.__tmpVertices = new Array( this.vertices.length );
			vertices = this.__tmpVertices;

			for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

				vertices[ v ] = new THREE.Vector3();

			}

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				if ( face instanceof THREE.Face3 ) {

					face.vertexNormals = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

				} else if ( face instanceof THREE.Face4 ) {

					face.vertexNormals = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

				}

			}

		} else {

			vertices = this.__tmpVertices;

			for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

				vertices[ v ].set( 0, 0, 0 );

			}

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( face instanceof THREE.Face3 ) {

				vertices[ face.a ].addSelf( face.normal );
				vertices[ face.b ].addSelf( face.normal );
				vertices[ face.c ].addSelf( face.normal );

			} else if ( face instanceof THREE.Face4 ) {

				vertices[ face.a ].addSelf( face.normal );
				vertices[ face.b ].addSelf( face.normal );
				vertices[ face.c ].addSelf( face.normal );
				vertices[ face.d ].addSelf( face.normal );

			}

		}

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ].normalize();

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( face instanceof THREE.Face3 ) {

				face.vertexNormals[ 0 ].copy( vertices[ face.a ] );
				face.vertexNormals[ 1 ].copy( vertices[ face.b ] );
				face.vertexNormals[ 2 ].copy( vertices[ face.c ] );

			} else if ( face instanceof THREE.Face4 ) {

				face.vertexNormals[ 0 ].copy( vertices[ face.a ] );
				face.vertexNormals[ 1 ].copy( vertices[ face.b ] );
				face.vertexNormals[ 2 ].copy( vertices[ face.c ] );
				face.vertexNormals[ 3 ].copy( vertices[ face.d ] );

			}

		}

	},

	computeTangents: function () {

		// based on http://www.terathon.com/code/tangent.html
		// tangents go to vertices

		var f, fl, v, vl, i, il, vertexIndex,
			face, uv, vA, vB, vC, uvA, uvB, uvC,
			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r, t, test,
			tan1 = [], tan2 = [],
			sdir = new THREE.Vector3(), tdir = new THREE.Vector3(),
			tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(),
			n = new THREE.Vector3(), w;

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			tan1[ v ] = new THREE.Vector3();
			tan2[ v ] = new THREE.Vector3();

		}

		function handleTriangle( context, a, b, c, ua, ub, uc ) {

			vA = context.vertices[ a ].position;
			vB = context.vertices[ b ].position;
			vC = context.vertices[ c ].position;

			uvA = uv[ ua ];
			uvB = uv[ ub ];
			uvC = uv[ uc ];

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;
			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;
			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.u - uvA.u;
			s2 = uvC.u - uvA.u;
			t1 = uvB.v - uvA.v;
			t2 = uvC.v - uvA.v;

			r = 1.0 / ( s1 * t2 - s2 * t1 );
			sdir.set( ( t2 * x1 - t1 * x2 ) * r,
					  ( t2 * y1 - t1 * y2 ) * r,
					  ( t2 * z1 - t1 * z2 ) * r );
			tdir.set( ( s1 * x2 - s2 * x1 ) * r,
					  ( s1 * y2 - s2 * y1 ) * r,
					  ( s1 * z2 - s2 * z1 ) * r );

			tan1[ a ].addSelf( sdir );
			tan1[ b ].addSelf( sdir );
			tan1[ c ].addSelf( sdir );

			tan2[ a ].addSelf( tdir );
			tan2[ b ].addSelf( tdir );
			tan2[ c ].addSelf( tdir );

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];
			uv = this.faceVertexUvs[ 0 ][ f ]; // use UV layer 0 for tangents

			if ( face instanceof THREE.Face3 ) {

				handleTriangle( this, face.a, face.b, face.c, 0, 1, 2 );

			} else if ( face instanceof THREE.Face4 ) {

				handleTriangle( this, face.a, face.b, face.c, 0, 1, 2 );
				handleTriangle( this, face.a, face.b, face.d, 0, 1, 3 );

			}

		}

		var faceIndex = [ 'a', 'b', 'c', 'd' ];

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			for ( i = 0; i < face.vertexNormals.length; i++ ) {

				n.copy( face.vertexNormals[ i ] );

				vertexIndex = face[ faceIndex[ i ] ];

				t = tan1[ vertexIndex ];

				// Gram-Schmidt orthogonalize

				tmp.copy( t );
				tmp.subSelf( n.multiplyScalar( n.dot( t ) ) ).normalize();

				// Calculate handedness

				tmp2.cross( face.vertexNormals[ i ], t );
				test = tmp2.dot( tan2[ vertexIndex ] );
				w = (test < 0.0) ? -1.0 : 1.0;

				face.vertexTangents[ i ] = new THREE.Vector4( tmp.x, tmp.y, tmp.z, w );

			}

		}

		this.hasTangents = true;

	},

	computeBoundingBox: function () {

		var vertex;

		if ( this.vertices.length > 0 ) {

			this.boundingBox = { 'x': [ this.vertices[ 0 ].position.x, this.vertices[ 0 ].position.x ],
			'y': [ this.vertices[ 0 ].position.y, this.vertices[ 0 ].position.y ],
			'z': [ this.vertices[ 0 ].position.z, this.vertices[ 0 ].position.z ] };

			for ( var v = 1, vl = this.vertices.length; v < vl; v ++ ) {

				vertex = this.vertices[ v ];

				if ( vertex.position.x < this.boundingBox.x[ 0 ] ) {

					this.boundingBox.x[ 0 ] = vertex.position.x;

				} else if ( vertex.position.x > this.boundingBox.x[ 1 ] ) {

					this.boundingBox.x[ 1 ] = vertex.position.x;

				}

				if ( vertex.position.y < this.boundingBox.y[ 0 ] ) {

					this.boundingBox.y[ 0 ] = vertex.position.y;

				} else if ( vertex.position.y > this.boundingBox.y[ 1 ] ) {

					this.boundingBox.y[ 1 ] = vertex.position.y;

				}

				if ( vertex.position.z < this.boundingBox.z[ 0 ] ) {

					this.boundingBox.z[ 0 ] = vertex.position.z;

				} else if ( vertex.position.z > this.boundingBox.z[ 1 ] ) {

					this.boundingBox.z[ 1 ] = vertex.position.z;

				}

			}

		}

	},

	computeBoundingSphere: function () {

		// var radius = this.boundingSphere === null ? 0 : this.boundingSphere.radius;

		var radius = 0;

		for ( var v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			radius = Math.max( radius, this.vertices[ v ].position.length() );

		}

		this.boundingSphere = { radius: radius };

	},

	/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */

	mergeVertices: function() {

		var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
		var unique = [], changes = [];

		var v, key;
		var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
		var precision = Math.pow( 10, precisionPoints );
		var i,il, face;

		for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

			v = this.vertices[ i ].position;
			key = [ Math.round( v.x * precision ), Math.round( v.y * precision ), Math.round( v.z * precision ) ].join( '_' );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		};


		// Start to patch face indices

		for( i = 0, il = this.faces.length; i < il; i ++ ) {

			face = this.faces[ i ];

			if ( face instanceof THREE.Face3 ) {

				face.a = changes[ face.a ];
				face.b = changes[ face.b ];
				face.c = changes[ face.c ];

			} else if ( face instanceof THREE.Face4 ) {

				face.a = changes[ face.a ];
				face.b = changes[ face.b ];
				face.c = changes[ face.c ];
				face.d = changes[ face.d ];

			}

		}

		// Use unique set of vertices

		this.vertices = unique;

	}

};

THREE.GeometryCount = 0;
/**
 * Spline from Tween.js, slightly optimized (and trashed)
 * http://sole.github.com/tween.js/examples/05_spline.html
 *
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Spline = function ( points ) {

	this.points = points;

	var c = [], v3 = { x: 0, y: 0, z: 0 },
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;

	this.initFromArray = function( a ) {

		this.points = [];

		for ( var i = 0; i < a.length; i++ ) {

			this.points[ i ] = { x: a[ i ][ 0 ], y: a[ i ][ 1 ], z: a[ i ][ 2 ] };

		}

	};

	this.getPoint = function ( k ) {

		point = ( this.points.length - 1 ) * k;
		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint > this.points.length - 2 ? intPoint : intPoint + 1;
		c[ 3 ] = intPoint > this.points.length - 3 ? intPoint : intPoint + 2;

		pa = this.points[ c[ 0 ] ];
		pb = this.points[ c[ 1 ] ];
		pc = this.points[ c[ 2 ] ];
		pd = this.points[ c[ 3 ] ];

		w2 = weight * weight;
		w3 = weight * w2;

		v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
		v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
		v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

		return v3;

	};

	this.getControlPointsArray = function () {

		var i, p, l = this.points.length,
			coords = [];

		for ( i = 0; i < l; i ++ ) {

			p = this.points[ i ];
			coords[ i ] = [ p.x, p.y, p.z ];

		}

		return coords;

	};

	// approximate length by summing linear segments

	this.getLength = function ( nSubDivisions ) {

		var i, index, nSamples, position,
			point = 0, intPoint = 0, oldIntPoint = 0,
			oldPosition = new THREE.Vector3(),
			tmpVec = new THREE.Vector3(),
			chunkLengths = [],
			totalLength = 0;

		// first point has 0 length

		chunkLengths[ 0 ] = 0;

		if ( !nSubDivisions ) nSubDivisions = 100;

		nSamples = this.points.length * nSubDivisions;

		oldPosition.copy( this.points[ 0 ] );

		for ( i = 1; i < nSamples; i ++ ) {

			index = i / nSamples;

			position = this.getPoint( index );
			tmpVec.copy( position );

			totalLength += tmpVec.distanceTo( oldPosition );

			oldPosition.copy( position );

			point = ( this.points.length - 1 ) * index;
			intPoint = Math.floor( point );

			if ( intPoint != oldIntPoint ) {

				chunkLengths[ intPoint ] = totalLength;
				oldIntPoint = intPoint;

			}

		}

		// last point ends with total length

		chunkLengths[ chunkLengths.length ] = totalLength;

		return { chunks: chunkLengths, total: totalLength };

	};

	this.reparametrizeByArcLength = function ( samplingCoef ) {

		var i, j,
			index, indexCurrent, indexNext,
			linearDistance, realDistance,
			sampling, position,
			newpoints = [],
			tmpVec = new THREE.Vector3(),
			sl = this.getLength();

		newpoints.push( tmpVec.copy( this.points[ 0 ] ).clone() );

		for ( i = 1; i < this.points.length; i++ ) {

			//tmpVec.copy( this.points[ i - 1 ] );
			//linearDistance = tmpVec.distanceTo( this.points[ i ] );

			realDistance = sl.chunks[ i ] - sl.chunks[ i - 1 ];

			sampling = Math.ceil( samplingCoef * realDistance / sl.total );

			indexCurrent = ( i - 1 ) / ( this.points.length - 1 );
			indexNext = i / ( this.points.length - 1 );

			for ( j = 1; j < sampling - 1; j++ ) {

				index = indexCurrent + j * ( 1 / sampling ) * ( indexNext - indexCurrent );

				position = this.getPoint( index );
				newpoints.push( tmpVec.copy( position ).clone() );

			}

			newpoints.push( tmpVec.copy( this.points[ i ] ).clone() );

		}

		this.points = newpoints;

	};

	// Catmull-Rom

	function interpolate( p0, p1, p2, p3, t, t2, t3 ) {

		var v0 = ( p2 - p0 ) * 0.5,
			v1 = ( p3 - p1 ) * 0.5;

		return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	};

};
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Edge = function( v1, v2, vi1, vi2 ) {

	this.vertices = [ v1, v2 ]; // vertex references
	this.vertexIndices = [ vi1, vi2 ]; // vertex indices

	this.faces = []; // face references
	this.faceIndices = [];	// face indices

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Camera = function () {

	if ( arguments.length ) {

		console.warn( 'DEPRECATED: Camera() is now PerspectiveCamera() or OrthographicCamera().' );
		return new THREE.PerspectiveCamera( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ], arguments[ 3 ] );

	}

	THREE.Object3D.call( this );

	this.matrixWorldInverse = new THREE.Matrix4();

	this.projectionMatrix = new THREE.Matrix4();
	this.projectionMatrixInverse = new THREE.Matrix4();


};

THREE.Camera.prototype = new THREE.Object3D();
THREE.Camera.prototype.constructor = THREE.Camera;

THREE.Camera.prototype.lookAt = function ( vector ) {

	// TODO: Add hierarchy support.

	this.matrix.lookAt( this.position, vector, this.up );

	if ( this.rotationAutoUpdate ) {

		this.rotation.setRotationFromMatrix( this.matrix );

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.OrthographicCamera = function ( left, right, top, bottom, near, far ) {

	THREE.Camera.call( this );

	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.near = ( near !== undefined ) ? near : 0.1;
	this.far = ( far !== undefined ) ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.OrthographicCamera.prototype = new THREE.Camera();
THREE.OrthographicCamera.prototype.constructor = THREE.OrthographicCamera;

THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {

	this.projectionMatrix = THREE.Matrix4.makeOrtho( this.left, this.right, this.top, this.bottom, this.near, this.far );

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.PerspectiveCamera = function ( fov, aspect, near, far ) {

	THREE.Camera.call( this );

	this.fov = fov !== undefined ? fov : 50;
	this.aspect = aspect !== undefined ? aspect : 1;
	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype = new THREE.Camera();
THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera;


/**
 * Uses Focal Length (in mm) to estimate and set FOV
 * 35mm (fullframe) camera is used if frame size is not specified;
 * Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
 */

THREE.PerspectiveCamera.prototype.setLens = function ( focalLength, frameSize ) {

	frameSize = frameSize !== undefined ? frameSize : 43.25; // 36x24mm

	this.fov = 2 * Math.atan( frameSize / ( focalLength * 2 ) );
	this.fov = 180 / Math.PI * this.fov;

	this.updateProjectionMatrix();

}


/**
 * Sets an offset in a larger frustum. This is useful for multi-window or
 * multi-monitor/multi-machine setups.
 *
 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
 * the monitors are in grid like this
 *
 *   +---+---+---+
 *   | A | B | C |
 *   +---+---+---+
 *   | D | E | F |
 *   +---+---+---+
 *
 * then for each monitor you would call it like this
 *
 *   var w = 1920;
 *   var h = 1080;
 *   var fullWidth = w * 3;
 *   var fullHeight = h * 2;
 *
 *   --A--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
 *   --B--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
 *   --C--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
 *   --D--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
 *   --E--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
 *   --F--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
 *
 *   Note there is no reason monitors have to be the same size or in a grid.
 */

THREE.PerspectiveCamera.prototype.setViewOffset = function ( fullWidth, fullHeight, x, y, width, height ) {

	this.fullWidth = fullWidth;
	this.fullHeight = fullHeight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.updateProjectionMatrix();

};


THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function () {

	if ( this.fullWidth ) {

		var aspect = this.fullWidth / this.fullHeight;
		var top = Math.tan( this.fov * Math.PI / 360 ) * this.near;
		var bottom = -top;
		var left = aspect * bottom;
		var right = aspect * top;
		var width = Math.abs( right - left );
		var height = Math.abs( top - bottom );

		this.projectionMatrix = THREE.Matrix4.makeFrustum(
			left + this.x * width / this.fullWidth,
			left + ( this.x + this.width ) * width / this.fullWidth,
			top - ( this.y + this.height ) * height / this.fullHeight,
			top - this.y * height / this.fullHeight,
			this.near,
			this.far );

	} else {

		this.projectionMatrix = THREE.Matrix4.makePerspective( this.fov, this.aspect, this.near, this.far );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
 
THREE.Light = function ( hex ) {

	THREE.Object3D.call( this );

	this.color = new THREE.Color( hex );

};

THREE.Light.prototype = new THREE.Object3D();
THREE.Light.prototype.constructor = THREE.Light;
THREE.Light.prototype.supr = THREE.Object3D.prototype;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.AmbientLight = function ( hex ) {

	THREE.Light.call( this, hex );

};

THREE.AmbientLight.prototype = new THREE.Light();
THREE.AmbientLight.prototype.constructor = THREE.AmbientLight; 
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.DirectionalLight = function ( hex, intensity, distance ) {

	THREE.Light.call( this, hex );

	this.position = new THREE.Vector3( 0, 1, 0 );
	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;

};

THREE.DirectionalLight.prototype = new THREE.Light();
THREE.DirectionalLight.prototype.constructor = THREE.DirectionalLight;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.PointLight = function ( hex, intensity, distance ) {

	THREE.Light.call( this, hex );

	this.position = new THREE.Vector3( 0, 0, 0 );
	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;

};

THREE.PointLight.prototype = new THREE.Light();
THREE.PointLight.prototype.constructor = THREE.PointLight;
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpotLight = function ( hex, intensity, distance, castShadow ) {

	THREE.Light.call( this, hex );

	this.position = new THREE.Vector3( 0, 1, 0 );
	this.target = new THREE.Object3D();

	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;

	this.castShadow = ( castShadow !== undefined ) ? castShadow : false;

};

THREE.SpotLight.prototype = new THREE.Light();
THREE.SpotLight.prototype.constructor = THREE.SpotLight;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Material = function ( parameters ) {

	this.name = '';

	this.id = THREE.MaterialCount ++;

	parameters = parameters || {};

	this.opacity = parameters.opacity !== undefined ? parameters.opacity : 1;
	this.transparent = parameters.transparent !== undefined ? parameters.transparent : false;

	this.blending = parameters.blending !== undefined ? parameters.blending : THREE.NormalBlending;

	this.depthTest = parameters.depthTest !== undefined ? parameters.depthTest : true;
	this.depthWrite = parameters.depthWrite !== undefined ? parameters.depthWrite : true;

	this.polygonOffset = parameters.polygonOffset !== undefined ? parameters.polygonOffset : false;
	this.polygonOffsetFactor = parameters.polygonOffsetFactor !== undefined ? parameters.polygonOffsetFactor : 0;
	this.polygonOffsetUnits = parameters.polygonOffsetUnits !== undefined ? parameters.polygonOffsetUnits : 0;

	this.alphaTest = parameters.alphaTest !== undefined ? parameters.alphaTest : 0;

	this.overdraw = parameters.overdraw !== undefined ? parameters.overdraw : false; // Boolean for fixing antialiasing gaps in CanvasRenderer 

}

THREE.MaterialCount = 0;

THREE.NoShading = 0;
THREE.FlatShading = 1;
THREE.SmoothShading = 2;

THREE.NoColors = 0;
THREE.FaceColors = 1;
THREE.VertexColors = 2;

THREE.NormalBlending = 0;
THREE.AdditiveBlending = 1;
THREE.SubtractiveBlending = 2;
THREE.MultiplyBlending = 3;
THREE.AdditiveAlphaBlending = 4;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round",
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineBasicMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );

	this.linewidth = parameters.linewidth !== undefined ? parameters.linewidth : 1;
	this.linecap = parameters.linecap !== undefined ? parameters.linecap : 'round';
	this.linejoin = parameters.linejoin !== undefined ? parameters.linejoin : 'round';

	this.vertexColors = parameters.vertexColors ? parameters.vertexColors : false;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

};

THREE.LineBasicMaterial.prototype = new THREE.Material();
THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: false / THREE.VertexColors / THREE.FaceColors,
 *  skinning: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshBasicMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );

	this.map = parameters.map !== undefined ? parameters.map : null;

	this.lightMap = parameters.lightMap !== undefined ? parameters.lightMap : null;

	this.envMap = parameters.envMap !== undefined ? parameters.envMap : null;
	this.combine = parameters.combine !== undefined ? parameters.combine : THREE.MultiplyOperation;
	this.reflectivity = parameters.reflectivity !== undefined ? parameters.reflectivity : 1;
	this.refractionRatio = parameters.refractionRatio !== undefined ? parameters.refractionRatio : 0.98;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

	this.shading = parameters.shading !== undefined ? parameters.shading : THREE.SmoothShading;

	this.wireframe = parameters.wireframe !== undefined ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth !== undefined ? parameters.wireframeLinewidth : 1;
	this.wireframeLinecap = parameters.wireframeLinecap !== undefined ? parameters.wireframeLinecap : 'round';
	this.wireframeLinejoin = parameters.wireframeLinejoin !== undefined ? parameters.wireframeLinejoin : 'round';

	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : false;

	this.skinning = parameters.skinning !== undefined ? parameters.skinning : false;
	this.morphTargets = parameters.morphTargets !== undefined ? parameters.morphTargets : false;

};

THREE.MeshBasicMaterial.prototype = new THREE.Material();
THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  ambient: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: false / THREE.VertexColors / THREE.FaceColors,
 *  skinning: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshLambertMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );
	this.ambient = parameters.ambient !== undefined ? new THREE.Color( parameters.ambient ) : new THREE.Color( 0x050505 );

	this.map = parameters.map !== undefined ? parameters.map : null;

	this.lightMap = parameters.lightMap !== undefined ? parameters.lightMap : null;

	this.envMap = parameters.envMap !== undefined ? parameters.envMap : null;
	this.combine = parameters.combine !== undefined ? parameters.combine : THREE.MultiplyOperation;
	this.reflectivity = parameters.reflectivity !== undefined ? parameters.reflectivity : 1;
	this.refractionRatio = parameters.refractionRatio !== undefined ? parameters.refractionRatio : 0.98;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

	this.shading = parameters.shading !== undefined ? parameters.shading : THREE.SmoothShading;

	this.wireframe = parameters.wireframe !== undefined ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth !== undefined ? parameters.wireframeLinewidth : 1;
	this.wireframeLinecap = parameters.wireframeLinecap !== undefined ? parameters.wireframeLinecap : 'round';
	this.wireframeLinejoin = parameters.wireframeLinejoin !== undefined ? parameters.wireframeLinejoin : 'round';

	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : false;

	this.skinning = parameters.skinning !== undefined ? parameters.skinning : false;
	this.morphTargets = parameters.morphTargets !== undefined ? parameters.morphTargets : false;

};

THREE.MeshLambertMaterial.prototype = new THREE.Material();
THREE.MeshLambertMaterial.prototype.constructor = THREE.MeshLambertMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  ambient: <hex>,
 *  specular: <hex>,
 *  shininess: <float>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: false / THREE.VertexColors / THREE.FaceColors,
 *  skinning: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshPhongMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );
	this.ambient = parameters.ambient !== undefined ? new THREE.Color( parameters.ambient ) : new THREE.Color( 0x050505 );
	this.specular = parameters.specular !== undefined ? new THREE.Color( parameters.specular ) : new THREE.Color( 0x111111 );
	this.shininess = parameters.shininess !== undefined ? parameters.shininess : 30;

	this.metal = parameters.metal !== undefined ? parameters.metal : false;
	this.perPixel = parameters.perPixel !== undefined ? parameters.perPixel : false;

	this.map = parameters.map !== undefined ? parameters.map : null;

	this.lightMap = parameters.lightMap !== undefined ? parameters.lightMap : null;

	this.envMap = parameters.envMap !== undefined ? parameters.envMap : null;
	this.combine = parameters.combine !== undefined ? parameters.combine : THREE.MultiplyOperation;
	this.reflectivity = parameters.reflectivity !== undefined ? parameters.reflectivity : 1;
	this.refractionRatio = parameters.refractionRatio !== undefined ? parameters.refractionRatio : 0.98;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

	this.shading = parameters.shading !== undefined ? parameters.shading : THREE.SmoothShading;

	this.wireframe = parameters.wireframe !== undefined ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth !== undefined ? parameters.wireframeLinewidth : 1;
	this.wireframeLinecap = parameters.wireframeLinecap !== undefined ? parameters.wireframeLinecap : 'round';
	this.wireframeLinejoin = parameters.wireframeLinejoin !== undefined ? parameters.wireframeLinejoin : 'round';

	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : false;

	this.skinning = parameters.skinning !== undefined ? parameters.skinning : false;
	this.morphTargets = parameters.morphTargets !== undefined ? parameters.morphTargets : false;

};

THREE.MeshPhongMaterial.prototype = new THREE.Material();
THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  opacity: <float>,
 
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * } 
 */

THREE.MeshDepthMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.shading = parameters.shading !== undefined ? parameters.shading : THREE.SmoothShading; // doesn't really apply here, normals are not used

	this.wireframe = parameters.wireframe !== undefined ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth !== undefined ? parameters.wireframeLinewidth : 1;

};

THREE.MeshDepthMaterial.prototype = new THREE.Material();
THREE.MeshDepthMaterial.prototype.constructor = THREE.MeshDepthMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>,
 
 *  shading: THREE.FlatShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshNormalMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.shading = parameters.shading ? parameters.shading : THREE.FlatShading;

	this.wireframe = parameters.wireframe ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth ? parameters.wireframeLinewidth : 1;

};

THREE.MeshNormalMaterial.prototype = new THREE.Material();
THREE.MeshNormalMaterial.prototype.constructor = THREE.MeshNormalMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.MeshFaceMaterial = function () {

};
THREE.MeshShaderMaterial = function ( parameters ) {

	console.warn( 'DEPRECATED: MeshShaderMaterial() is now ShaderMaterial().' );

	return new THREE.ShaderMaterial( parameters );

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  vertexColors: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.ParticleBasicMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );

	this.map = parameters.map !== undefined ? parameters.map : null;

	this.size = parameters.size !== undefined ? parameters.size : 1;
	this.sizeAttenuation = parameters.sizeAttenuation !== undefined ? parameters.sizeAttenuation : true;

	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : false;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

};

THREE.ParticleBasicMaterial.prototype = new THREE.Material();
THREE.ParticleBasicMaterial.prototype.constructor = THREE.ParticleBasicMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 *
 * parameters = {
 *  color: <hex>,
 *  program: <function>,
 *  opacity: <float>,
 *  blending: THREE.NormalBlending
 * }
 */

THREE.ParticleCanvasMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );
	this.program = parameters.program !== undefined ? parameters.program : function ( context, color ) {};

};

THREE.ParticleCanvasMaterial.prototype = new THREE.Material();
THREE.ParticleCanvasMaterial.prototype.constructor = THREE.ParticleCanvasMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.ParticleDOMMaterial = function ( domElement ) {

	THREE.Material.call( this );

	this.domElement = domElement;

};
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  fragmentShader: <string>,
 *  vertexShader: <string>,

 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },

 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,

 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,

 *  lights: <bool>,
 *  vertexColors: <bool>,
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 * }
 */

THREE.ShaderMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.fragmentShader = parameters.fragmentShader !== undefined ? parameters.fragmentShader : "void main() {}";
	this.vertexShader = parameters.vertexShader !== undefined ? parameters.vertexShader : "void main() {}";
	this.uniforms = parameters.uniforms !== undefined ? parameters.uniforms : {};
	this.attributes = parameters.attributes;

	this.shading = parameters.shading !== undefined ? parameters.shading : THREE.SmoothShading;

	this.wireframe = parameters.wireframe !== undefined ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth !== undefined ? parameters.wireframeLinewidth : 1;

	this.fog = parameters.fog !== undefined ? parameters.fog : false; // set to use scene fog
	this.lights = parameters.lights !== undefined ? parameters.lights : false; // set to use scene lights
	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : false; // set to use "color" attribute stream
	this.skinning = parameters.skinning !== undefined ? parameters.skinning : false; // set to use skinning attribute streams
	this.morphTargets = parameters.morphTargets !== undefined ? parameters.morphTargets : false; // set to use morph targets

};

THREE.ShaderMaterial.prototype = new THREE.Material();
THREE.ShaderMaterial.prototype.constructor = THREE.ShaderMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.Texture = function ( image, mapping, wrapS, wrapT, magFilter, minFilter ) {

	this.id = THREE.TextureCount ++;

	this.image = image;

	this.mapping = mapping !== undefined ? mapping : new THREE.UVMapping();

	this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
	this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.needsUpdate = false;
	this.onUpdate = null;

};

THREE.Texture.prototype = {

	constructor: THREE.Texture,

	clone: function () {

		var clonedTexture = new THREE.Texture( this.image, this.mapping, this.wrapS, this.wrapT, this.magFilter, this.minFilter );

		clonedTexture.offset.copy( this.offset );
		clonedTexture.repeat.copy( this.repeat );

		return clonedTexture;

	}

};

THREE.TextureCount = 0;

THREE.MultiplyOperation = 0;
THREE.MixOperation = 1;

// Mapping modes

THREE.CubeReflectionMapping = function () {};
THREE.CubeRefractionMapping = function () {};

THREE.LatitudeReflectionMapping = function () {};
THREE.LatitudeRefractionMapping = function () {};

THREE.SphericalReflectionMapping = function () {};
THREE.SphericalRefractionMapping = function () {};

THREE.UVMapping = function () {};

// Wrapping modes

THREE.RepeatWrapping = 0;
THREE.ClampToEdgeWrapping = 1;
THREE.MirroredRepeatWrapping = 2;

// Filters

THREE.NearestFilter = 3;
THREE.NearestMipMapNearestFilter = 4;
THREE.NearestMipMapLinearFilter = 5;
THREE.LinearFilter = 6;
THREE.LinearMipMapNearestFilter = 7;
THREE.LinearMipMapLinearFilter = 8;

// Types

THREE.ByteType = 9;
THREE.UnsignedByteType = 10;
THREE.ShortType = 11;
THREE.UnsignedShortType = 12;
THREE.IntType = 13;
THREE.UnsignedIntType = 14;
THREE.FloatType = 15;

// Formats

THREE.AlphaFormat = 16;
THREE.RGBFormat = 17;
THREE.RGBAFormat = 18;
THREE.LuminanceFormat = 19;
THREE.LuminanceAlphaFormat = 20;
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DataTexture = function ( data, width, height, format, mapping, wrapS, wrapT, magFilter, minFilter ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter );

	this.image = { data: data, width: width, height: height };

	this.format = format !== undefined ? format : THREE.RGBAFormat;

};

THREE.DataTexture.prototype = new THREE.Texture();
THREE.DataTexture.prototype.constructor = THREE.DataTexture;

THREE.DataTexture.prototype.clone = function () {

	var clonedTexture = new THREE.DataTexture( this.data.slice( 0 ), this.mapping, this.wrapS, this.wrapT, this.magFilter, this.minFilter );

	clonedTexture.offset.copy( this.offset );
	clonedTexture.repeat.copy( this.repeat );

	return clonedTexture;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Particle = function ( material ) {

	THREE.Object3D.call( this );

	this.material = material;

};

THREE.Particle.prototype = new THREE.Object3D();
THREE.Particle.prototype.constructor = THREE.Particle;
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ParticleSystem = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.geometry = geometry;
	this.material = material;

	this.sortParticles = false;

};

THREE.ParticleSystem.prototype = new THREE.Object3D();
THREE.ParticleSystem.prototype.constructor = THREE.ParticleSystem;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Line = function ( geometry, material, type ) {

	THREE.Object3D.call( this );

	this.geometry = geometry;
	this.material = material;

	this.type = ( type !== undefined ) ? type : THREE.LineStrip;

	if ( this.geometry ) {

		if ( ! this.geometry.boundingSphere ) {

			this.geometry.computeBoundingSphere();

		}

	}

};

THREE.LineStrip = 0;
THREE.LinePieces = 1;

THREE.Line.prototype = new THREE.Object3D();
THREE.Line.prototype.constructor = THREE.Line;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Mesh = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.geometry = geometry;
	this.material = material;

	if ( material instanceof Array ) {

		console.warn( 'DEPRECATED: Mesh material can no longer be an Array. Using material at index 0...' );
		this.material = material[ 0 ];

	}

	if ( this.geometry ) {

		// calc bound radius

		if( !this.geometry.boundingSphere ) {

			this.geometry.computeBoundingSphere();

		}

		this.boundRadius = geometry.boundingSphere.radius;


		// setup morph targets

		if( this.geometry.morphTargets.length ) {

			this.morphTargetBase = -1;
			this.morphTargetForcedOrder = [];
			this.morphTargetInfluences = [];
			this.morphTargetDictionary = {};

			for( var m = 0; m < this.geometry.morphTargets.length; m ++ ) {

				this.morphTargetInfluences.push( 0 );
				this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;

			}

		}

	}

}

THREE.Mesh.prototype = new THREE.Object3D();
THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Mesh.prototype.supr = THREE.Object3D.prototype;


/*
 * Get Morph Target Index by Name
 */

THREE.Mesh.prototype.getMorphTargetIndexByName = function( name ) {

	if ( this.morphTargetDictionary[ name ] !== undefined ) {

		return this.morphTargetDictionary[ name ];
	}

	console.log( "THREE.Mesh.getMorphTargetIndexByName: morph target " + name + " does not exist. Returning 0." );
	return 0;

}
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Bone = function( belongsToSkin ) {

	THREE.Object3D.call( this );

	this.skin = belongsToSkin;
	this.skinMatrix = new THREE.Matrix4();

};

THREE.Bone.prototype = new THREE.Object3D();
THREE.Bone.prototype.constructor = THREE.Bone;
THREE.Bone.prototype.supr = THREE.Object3D.prototype;


THREE.Bone.prototype.update = function( parentSkinMatrix, forceUpdate ) {

	// update local

	if ( this.matrixAutoUpdate ) {

		forceUpdate |= this.updateMatrix();

	}

	// update skin matrix

	if ( forceUpdate || this.matrixWorldNeedsUpdate ) {

		if( parentSkinMatrix ) {

			this.skinMatrix.multiply( parentSkinMatrix, this.matrix );

		} else {

			this.skinMatrix.copy( this.matrix );

		}

		this.matrixWorldNeedsUpdate = false;
		forceUpdate = true;

	}

	// update children

	var child, i, l = this.children.length;

	for ( i = 0; i < l; i ++ ) {

		this.children[ i ].update( this.skinMatrix, forceUpdate );

	}

};

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SkinnedMesh = function( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	// init bones

	this.identityMatrix = new THREE.Matrix4();

	this.bones = [];
	this.boneMatrices = [];

	var b, bone, gbone, p, q, s;

	if ( this.geometry.bones !== undefined ) {

		for ( b = 0; b < this.geometry.bones.length; b ++ ) {

			gbone = this.geometry.bones[ b ];

			p = gbone.pos;
			q = gbone.rotq;
			s = gbone.scl;

			bone = this.addBone();

			bone.name = gbone.name;
			bone.position.set( p[0], p[1], p[2] );
			bone.quaternion.set( q[0], q[1], q[2], q[3] );
			bone.useQuaternion = true;

			if ( s !== undefined ) {

				bone.scale.set( s[0], s[1], s[2] );

			} else {

				bone.scale.set( 1, 1, 1 );

			}

		}

		for ( b = 0; b < this.bones.length; b ++ ) {

			gbone = this.geometry.bones[ b ];
			bone = this.bones[ b ];

			if ( gbone.parent === -1 ) {

				this.add( bone );

			} else {

				this.bones[ gbone.parent ].add( bone );

			}

		}

		this.boneMatrices = new Float32Array( 16 * this.bones.length );

		this.pose();

	}

};

THREE.SkinnedMesh.prototype = new THREE.Mesh();
THREE.SkinnedMesh.prototype.constructor = THREE.SkinnedMesh;

THREE.SkinnedMesh.prototype.addBone = function( bone ) {

	if ( bone === undefined ) {

		bone = new THREE.Bone( this );

	}

	this.bones.push( bone );

	return bone;

};

THREE.SkinnedMesh.prototype.updateMatrixWorld = function ( force ) {

	this.matrixAutoUpdate && this.updateMatrix();

	// update matrixWorld

	if ( this.matrixWorldNeedsUpdate || force ) {

		if ( this.parent ) {

			this.matrixWorld.multiply( this.parent.matrixWorld, this.matrix );

		} else {

			this.matrixWorld.copy( this.matrix );

		}

		this.matrixWorldNeedsUpdate = false;

		force = true;

	}

	// update children

	for ( var i = 0, l = this.children.length; i < l; i ++ ) {

		var child = this.children[ i ];

		if ( child instanceof THREE.Bone ) {

			child.update( this.identityMatrix, false );

		} else {

			child.updateMatrixWorld( true );

		}

	}

	// flatten bone matrices to array

	var b, bl = this.bones.length,
		ba = this.bones,
		bm = this.boneMatrices;

	for ( b = 0; b < bl; b ++ ) {

		ba[ b ].skinMatrix.flattenToArrayOffset( bm, b * 16 );

	}

};

/*
 * Pose
 */

THREE.SkinnedMesh.prototype.pose = function() {

	this.updateMatrixWorld( true );

	var bim, bone, boneInverses = [];

	for ( var b = 0; b < this.bones.length; b ++ ) {

		bone = this.bones[ b ];

		var inverseMatrix = new THREE.Matrix4();
		inverseMatrix.getInverse( bone.skinMatrix );

		boneInverses.push( inverseMatrix );

		bone.skinMatrix.flattenToArrayOffset( this.boneMatrices, b * 16 );

	}

	// project vertices to local

	if ( this.geometry.skinVerticesA === undefined ) {

		this.geometry.skinVerticesA = [];
		this.geometry.skinVerticesB = [];

		var orgVertex, vertex;

		for ( var i = 0; i < this.geometry.skinIndices.length; i ++ ) {

			orgVertex = this.geometry.vertices[ i ].position;

			var indexA = this.geometry.skinIndices[ i ].x;
			var indexB = this.geometry.skinIndices[ i ].y;

			vertex = new THREE.Vector3( orgVertex.x, orgVertex.y, orgVertex.z );
			this.geometry.skinVerticesA.push( boneInverses[ indexA ].multiplyVector3( vertex ) );

			vertex = new THREE.Vector3( orgVertex.x, orgVertex.y, orgVertex.z );
			this.geometry.skinVerticesB.push( boneInverses[ indexB ].multiplyVector3( vertex ) );

			// todo: add more influences

			// normalize weights

			if ( this.geometry.skinWeights[ i ].x + this.geometry.skinWeights[ i ].y !== 1 ) {

				var len = ( 1.0 - ( this.geometry.skinWeights[ i ].x + this.geometry.skinWeights[ i ].y ) ) * 0.5;
				this.geometry.skinWeights[ i ].x += len;
				this.geometry.skinWeights[ i ].y += len;

			}

		}

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MorphAnimMesh = function( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	// API

	this.duration = 1000; // milliseconds
	this.mirroredLoop = false;
	this.time = 0;

	// internals

	this.lastKeyframe = 0;
	this.currentKeyframe = 0;

	this.direction = 1;
	this.directionBackwards = false;

};

THREE.MorphAnimMesh.prototype = new THREE.Mesh();
THREE.MorphAnimMesh.prototype.constructor = THREE.MorphAnimMesh;

THREE.MorphAnimMesh.prototype.updateAnimation = function ( delta ) {

	var frameTime = this.duration / ( this.geometry.morphTargets.length - 1 );

	this.time += this.direction * delta;

	if ( this.mirroredLoop ) {

		if ( this.time > this.duration || this.time < 0 ) {

			this.direction *= -1;

			if ( this.time > this.duration ) {

				this.time = this.duration;
				this.directionBackwards = true;

			}

			if ( this.time < 0 ) {

				this.time = 0;
				this.directionBackwards = false;

			}

		}

	} else {

		this.time = this.time % this.duration;

	}

	var keyframe = THREE.Math.clamp( Math.floor( this.time / frameTime ), 0, this.geometry.morphTargets.length - 1 );

	if ( keyframe != this.currentKeyframe ) {

		this.morphTargetInfluences[ this.lastKeyframe ] = 0;
		this.morphTargetInfluences[ this.currentKeyframe ] = 1;

		this.morphTargetInfluences[ keyframe ] = 0;

		this.lastKeyframe = this.currentKeyframe;
		this.currentKeyframe = keyframe;

	}

	var mix = ( this.time % frameTime ) / frameTime;

	if ( this.directionBackwards ) {

		mix = 1 - mix;

	}

	this.morphTargetInfluences[ this.currentKeyframe ] = mix;
	this.morphTargetInfluences[ this.lastKeyframe ] = 1 - mix;

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Ribbon = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.geometry = geometry;
	this.material = material;

};

THREE.Ribbon.prototype = new THREE.Object3D();
THREE.Ribbon.prototype.constructor = THREE.Ribbon;
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

THREE.LOD = function () {

	THREE.Object3D.call( this );

	this.LODs = [];

};

THREE.LOD.prototype = new THREE.Object3D();
THREE.LOD.prototype.constructor = THREE.LOD;
THREE.LOD.prototype.supr = THREE.Object3D.prototype;

THREE.LOD.prototype.addLevel = function ( object3D, visibleAtDistance ) {

	if ( visibleAtDistance === undefined ) {

		visibleAtDistance = 0;

	}

	visibleAtDistance = Math.abs( visibleAtDistance );

	for ( var l = 0; l < this.LODs.length; l++ ) {

		if ( visibleAtDistance < this.LODs[ l ].visibleAtDistance ) {

			break;

		}

	}

	this.LODs.splice( l, 0, { visibleAtDistance: visibleAtDistance, object3D: object3D } );
	this.add( object3D );

};

THREE.LOD.prototype.update = function ( camera ) {

	if ( this.LODs.length > 1 ) {

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var inverse  = camera.matrixWorldInverse;
		var radius   = this.boundRadius * this.boundRadiusScale;
		var distance = -( inverse.n31 * this.position.x + inverse.n32 * this.position.y + inverse.n33 * this.position.z + inverse.n34 );

		this.LODs[ 0 ].object3D.visible = true;

		for ( var l = 1; l < this.LODs.length; l ++ ) {

			if( distance >= this.LODs[ l ].visibleAtDistance ) {

				this.LODs[ l - 1 ].object3D.visible = false;
				this.LODs[ l     ].object3D.visible = true;

			} else {

				break;

			}

		}

		for( ; l < this.LODs.length; l ++ ) {

			this.LODs[ l ].object3D.visible = false;

		}

	}

};
/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Sprite = function ( parameters ) {

	THREE.Object3D.call( this );

	this.color = ( parameters.color !== undefined ) ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );
	this.map = ( parameters.map instanceof THREE.Texture ) ? parameters.map : THREE.ImageUtils.loadTexture( parameters.map );
	this.blending = ( parameters.blending !== undefined ) ? parameters.blending : THREE.NormalBlending;

	this.useScreenCoordinates = ( parameters.useScreenCoordinates !== undefined ) ? parameters.useScreenCoordinates : true;
	this.mergeWith3D = ( parameters.mergeWith3D !== undefined ) ? parameters.mergeWith3D : !this.useScreenCoordinates;
	this.affectedByDistance = ( parameters.affectedByDistance !== undefined ) ? parameters.affectedByDistance : !this.useScreenCoordinates;
	this.scaleByViewport = ( parameters.scaleByViewport !== undefined ) ? parameters.scaleByViewport : !this.affectedByDistance;
	this.alignment = ( parameters.alignment instanceof THREE.Vector2 ) ? parameters.alignment : THREE.SpriteAlignment.center;

	this.rotation3d = this.rotation;
	this.rotation = 0;
	this.opacity = 1;

	this.uvOffset = new THREE.Vector2( 0, 0 );
	this.uvScale  = new THREE.Vector2( 1, 1 );

};

THREE.Sprite.prototype = new THREE.Object3D();
THREE.Sprite.prototype.constructor = THREE.Sprite;


/*
 * Custom update matrix
 */

THREE.Sprite.prototype.updateMatrix = function () {

	this.matrix.setPosition( this.position );

	this.rotation3d.set( 0, 0, this.rotation );
	this.matrix.setRotationFromEuler( this.rotation3d );

	if ( this.scale.x !== 1 || this.scale.y !== 1 ) {

		this.matrix.scale( this.scale );
		this.boundRadiusScale = Math.max( this.scale.x, this.scale.y );

	}

	this.matrixWorldNeedsUpdate = true;

};

/*
 * Alignment
 */

THREE.SpriteAlignment = {};
THREE.SpriteAlignment.topLeft = new THREE.Vector2( 1, -1 );
THREE.SpriteAlignment.topCenter = new THREE.Vector2( 0, -1 );
THREE.SpriteAlignment.topRight = new THREE.Vector2( -1, -1 );
THREE.SpriteAlignment.centerLeft = new THREE.Vector2( 1, 0 );
THREE.SpriteAlignment.center = new THREE.Vector2( 0, 0 );
THREE.SpriteAlignment.centerRight = new THREE.Vector2( -1, 0 );
THREE.SpriteAlignment.bottomLeft = new THREE.Vector2( 1, 1 );
THREE.SpriteAlignment.bottomCenter = new THREE.Vector2( 0, 1 );
THREE.SpriteAlignment.bottomRight = new THREE.Vector2( -1, 1 );
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.fog = null;
	this.overrideMaterial = null;

	this.matrixAutoUpdate = false;

	this.objects = [];
	this.lights = [];

	this.__objectsAdded = [];
	this.__objectsRemoved = [];

};

THREE.Scene.prototype = new THREE.Object3D();
THREE.Scene.prototype.constructor = THREE.Scene;

THREE.Scene.prototype.addObject = function ( object ) {

	if ( object instanceof THREE.Light ) {

		if ( this.lights.indexOf( object ) === - 1 ) {

			this.lights.push( object );

		}

	} else if ( !( object instanceof THREE.Camera || object instanceof THREE.Bone ) ) {

		if ( this.objects.indexOf( object ) === - 1 ) {

			this.objects.push( object );
			this.__objectsAdded.push( object );

			// check if previously removed

			var i = this.__objectsRemoved.indexOf( object );

			if ( i !== -1 ) {

				this.__objectsRemoved.splice( i, 1 );

			}

		}

	}

	for ( var c = 0; c < object.children.length; c ++ ) {

		this.addObject( object.children[ c ] );

	}

};

THREE.Scene.prototype.removeObject = function ( object ) {

	if ( object instanceof THREE.Light ) {

		var i = this.lights.indexOf( object );

		if ( i !== -1 ) {

			this.lights.splice( i, 1 );

		}

	} else if ( !( object instanceof THREE.Camera ) ) {

		var i = this.objects.indexOf( object );

		if( i !== -1 ) {

			this.objects.splice( i, 1 );
			this.__objectsRemoved.push( object );

			// check if previously added

			var ai = this.__objectsAdded.indexOf( object );

			if ( ai !== -1 ) {

				this.__objectsAdded.splice( ai, 1 );

			}

		}

	}

	for ( var c = 0; c < object.children.length; c ++ ) {

		this.removeObject( object.children[ c ] );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Fog = function ( hex, near, far ) {

	this.color = new THREE.Color( hex );

	this.near = ( near !== undefined ) ? near : 1;
	this.far = ( far !== undefined ) ? far : 1000;

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.FogExp2 = function ( hex, density ) {

	this.color = new THREE.Color( hex );
	this.density = ( density !== undefined ) ? density : 0.00025;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.DOMRenderer = function () {

	THREE.Renderer.call( this );

	var _renderList = null,
	_projector = new THREE.Projector(),
	_div = document.createElement( 'div' ),
	_width, _height, _widthHalf, _heightHalf;

	this.domElement = _div;

	this.setSize = function ( width, height ) {

		_width = width; _height = height;
		_widthHalf = _width / 2; _heightHalf = _height / 2;

	};

	this.render = function ( scene, camera ) {

		var e, el, m, ml, element, material, dom, v1x, v1y;

		_renderList = _projector.projectScene( scene, camera );

		for ( e = 0, el = _renderList.length; e < el; e++ ) {

			element = _renderList[ e ];

			if ( element instanceof THREE.RenderableParticle ) {

				v1x = element.x * _widthHalf + _widthHalf; v1y = element.y * _heightHalf + _heightHalf;

				for ( m = 0, ml = element.material.length; m < ml; m++ ) {

					material = element.material[ m ];

					if ( material instanceof THREE.ParticleDOMMaterial ) {

						dom = material.domElement;
						dom.style.left = v1x + 'px';
						dom.style.top = v1y + 'px';

					}

				}

			}

		}

	};

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.CanvasRenderer = function ( parameters ) {

	var _this = this,
	_renderData, _elements, _lights,
	_projector = new THREE.Projector(),

	parameters = parameters || {},

	_canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' ),

	_canvasWidth, _canvasHeight, _canvasWidthHalf, _canvasHeightHalf,
	_context = _canvas.getContext( '2d' ),

	_clearColor = new THREE.Color( 0x000000 ),
	_clearOpacity = 0,

	_contextGlobalAlpha = 1,
	_contextGlobalCompositeOperation = 0,
	_contextStrokeStyle = null,
	_contextFillStyle = null,
	_contextLineWidth = null,
	_contextLineCap = null,
	_contextLineJoin = null,

	_v1, _v2, _v3, _v4,
	_v5 = new THREE.RenderableVertex(),
	_v6 = new THREE.RenderableVertex(),

	_v1x, _v1y, _v2x, _v2y, _v3x, _v3y,
	_v4x, _v4y, _v5x, _v5y, _v6x, _v6y,

	_color = new THREE.Color(),
	_color1 = new THREE.Color(),
	_color2 = new THREE.Color(),
	_color3 = new THREE.Color(),
	_color4 = new THREE.Color(),

	_patterns = [], _imagedatas = [],

	_near, _far,

	_image, _uvs,
	_uv1x, _uv1y, _uv2x, _uv2y, _uv3x, _uv3y,

	_clipRect = new THREE.Rectangle(),
	_clearRect = new THREE.Rectangle(),
	_bboxRect = new THREE.Rectangle(),

	_enableLighting = false,
	_ambientLight = new THREE.Color(),
	_directionalLights = new THREE.Color(),
	_pointLights = new THREE.Color(),

	_pi2 = Math.PI * 2,
	_vector3 = new THREE.Vector3(), // Needed for PointLight

	_pixelMap, _pixelMapContext, _pixelMapImage, _pixelMapData,
	_gradientMap, _gradientMapContext, _gradientMapQuality = 16;

	_pixelMap = document.createElement( 'canvas' );
	_pixelMap.width = _pixelMap.height = 2;

	_pixelMapContext = _pixelMap.getContext( '2d' );
	_pixelMapContext.fillStyle = 'rgba(0,0,0,1)';
	_pixelMapContext.fillRect( 0, 0, 2, 2 );

	_pixelMapImage = _pixelMapContext.getImageData( 0, 0, 2, 2 );
	_pixelMapData = _pixelMapImage.data;

	_gradientMap = document.createElement( 'canvas' );
	_gradientMap.width = _gradientMap.height = _gradientMapQuality;

	_gradientMapContext = _gradientMap.getContext( '2d' );
	_gradientMapContext.translate( - _gradientMapQuality / 2, - _gradientMapQuality / 2 );
	_gradientMapContext.scale( _gradientMapQuality, _gradientMapQuality );

	_gradientMapQuality --; // Fix UVs

	this.domElement = _canvas;

	this.autoClear = true;
	this.sortObjects = true;
	this.sortElements = true;

	this.info = {

		render: {

			vertices: 0,
			faces: 0

		}

	}

	this.setSize = function ( width, height ) {

		_canvasWidth = width;
		_canvasHeight = height;
		_canvasWidthHalf = Math.floor( _canvasWidth / 2 );
		_canvasHeightHalf = Math.floor( _canvasHeight / 2 );

		_canvas.width = _canvasWidth;
		_canvas.height = _canvasHeight;

		_clipRect.set( - _canvasWidthHalf, - _canvasHeightHalf, _canvasWidthHalf, _canvasHeightHalf );
		_clearRect.set( - _canvasWidthHalf, - _canvasHeightHalf, _canvasWidthHalf, _canvasHeightHalf );

		_contextGlobalAlpha = 1;
		_contextGlobalCompositeOperation = 0;
		_contextStrokeStyle = null;
		_contextFillStyle = null;
		_contextLineWidth = null;
		_contextLineCap = null;
		_contextLineJoin = null;

	};

	this.setClearColor = function( color, opacity ) {

		_clearColor.copy( color );
		_clearOpacity = opacity;

		_clearRect.set( - _canvasWidthHalf, - _canvasHeightHalf, _canvasWidthHalf, _canvasHeightHalf );

	};

	this.setClearColorHex = function( hex, opacity ) {

		_clearColor.setHex( hex );
		_clearOpacity = opacity;

		_clearRect.set( - _canvasWidthHalf, - _canvasHeightHalf, _canvasWidthHalf, _canvasHeightHalf );

	};

	this.clear = function () {

		_context.setTransform( 1, 0, 0, - 1, _canvasWidthHalf, _canvasHeightHalf );

		if ( !_clearRect.isEmpty() ) {

			_clearRect.minSelf( _clipRect );
			_clearRect.inflate( 2 );

			if ( _clearOpacity < 1 ) {

				_context.clearRect( Math.floor( _clearRect.getX() ), Math.floor( _clearRect.getY() ), Math.floor( _clearRect.getWidth() ), Math.floor( _clearRect.getHeight() ) );

			}

			if ( _clearOpacity > 0 ) {

				setBlending( THREE.NormalBlending );
				setOpacity( 1 );

				setFillStyle( 'rgba(' + Math.floor( _clearColor.r * 255 ) + ',' + Math.floor( _clearColor.g * 255 ) + ',' + Math.floor( _clearColor.b * 255 ) + ',' + _clearOpacity + ')' );

				_context.fillRect( Math.floor( _clearRect.getX() ), Math.floor( _clearRect.getY() ), Math.floor( _clearRect.getWidth() ), Math.floor( _clearRect.getHeight() ) );

			}

			_clearRect.empty();

		}


	};

	this.render = function ( scene, camera ) {

		var e, el, element, material;

		this.autoClear ? this.clear() : _context.setTransform( 1, 0, 0, - 1, _canvasWidthHalf, _canvasHeightHalf );

		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;

		_renderData = _projector.projectScene( scene, camera, this.sortElements );
		_elements = _renderData.elements;
		_lights = _renderData.lights;

		/* DEBUG
		_context.fillStyle = 'rgba( 0, 255, 255, 0.5 )';
		_context.fillRect( _clipRect.getX(), _clipRect.getY(), _clipRect.getWidth(), _clipRect.getHeight() );
		*/

		_enableLighting = _lights.length > 0;

		if ( _enableLighting ) {

			 calculateLights( _lights );

		}

		for ( e = 0, el = _elements.length; e < el; e++ ) {

			element = _elements[ e ];

			material = element.material;
			material = material instanceof THREE.MeshFaceMaterial ? element.faceMaterial : material;

			if ( material == null || material.opacity == 0 ) continue;

			_bboxRect.empty();

			if ( element instanceof THREE.RenderableParticle ) {

				_v1 = element;
				_v1.x *= _canvasWidthHalf; _v1.y *= _canvasHeightHalf;

				renderParticle( _v1, element, material, scene );

			} else if ( element instanceof THREE.RenderableLine ) {

				_v1 = element.v1; _v2 = element.v2;

				_v1.positionScreen.x *= _canvasWidthHalf; _v1.positionScreen.y *= _canvasHeightHalf;
				_v2.positionScreen.x *= _canvasWidthHalf; _v2.positionScreen.y *= _canvasHeightHalf;

				_bboxRect.addPoint( _v1.positionScreen.x, _v1.positionScreen.y );
				_bboxRect.addPoint( _v2.positionScreen.x, _v2.positionScreen.y );

				if ( _clipRect.intersects( _bboxRect ) ) {

					renderLine( _v1, _v2, element, material, scene );

				}


			} else if ( element instanceof THREE.RenderableFace3 ) {

				_v1 = element.v1; _v2 = element.v2; _v3 = element.v3;

				_v1.positionScreen.x *= _canvasWidthHalf; _v1.positionScreen.y *= _canvasHeightHalf;
				_v2.positionScreen.x *= _canvasWidthHalf; _v2.positionScreen.y *= _canvasHeightHalf;
				_v3.positionScreen.x *= _canvasWidthHalf; _v3.positionScreen.y *= _canvasHeightHalf;

				if ( material.overdraw ) {

					expand( _v1.positionScreen, _v2.positionScreen );
					expand( _v2.positionScreen, _v3.positionScreen );
					expand( _v3.positionScreen, _v1.positionScreen );

				}

				_bboxRect.add3Points( _v1.positionScreen.x, _v1.positionScreen.y,
						      _v2.positionScreen.x, _v2.positionScreen.y,
						      _v3.positionScreen.x, _v3.positionScreen.y );

				if ( _clipRect.intersects( _bboxRect ) ) {

					renderFace3( _v1, _v2, _v3, 0, 1, 2, element, material, scene );

				}

			} else if ( element instanceof THREE.RenderableFace4 ) {

				_v1 = element.v1; _v2 = element.v2; _v3 = element.v3; _v4 = element.v4;

				_v1.positionScreen.x *= _canvasWidthHalf; _v1.positionScreen.y *= _canvasHeightHalf;
				_v2.positionScreen.x *= _canvasWidthHalf; _v2.positionScreen.y *= _canvasHeightHalf;
				_v3.positionScreen.x *= _canvasWidthHalf; _v3.positionScreen.y *= _canvasHeightHalf;
				_v4.positionScreen.x *= _canvasWidthHalf; _v4.positionScreen.y *= _canvasHeightHalf;

				_v5.positionScreen.copy( _v2.positionScreen );
				_v6.positionScreen.copy( _v4.positionScreen );

				if ( material.overdraw ) {

					expand( _v1.positionScreen, _v2.positionScreen );
					expand( _v2.positionScreen, _v4.positionScreen );
					expand( _v4.positionScreen, _v1.positionScreen );

					expand( _v3.positionScreen, _v5.positionScreen );
					expand( _v3.positionScreen, _v6.positionScreen );

				}

				_bboxRect.addPoint( _v1.positionScreen.x, _v1.positionScreen.y );
				_bboxRect.addPoint( _v2.positionScreen.x, _v2.positionScreen.y );
				_bboxRect.addPoint( _v3.positionScreen.x, _v3.positionScreen.y );
				_bboxRect.addPoint( _v4.positionScreen.x, _v4.positionScreen.y );

				if ( _clipRect.intersects( _bboxRect ) ) {

					renderFace4( _v1, _v2, _v3, _v4, _v5, _v6, element, material, scene );

				}

			}

			/*
			_context.lineWidth = 1;
			_context.strokeStyle = 'rgba( 0, 255, 0, 0.5 )';
			_context.strokeRect( _bboxRect.getX(), _bboxRect.getY(), _bboxRect.getWidth(), _bboxRect.getHeight() );
			*/

			_clearRect.addRectangle( _bboxRect );


		}

		/* DEBUG
		_context.lineWidth = 1;
		_context.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
		_context.strokeRect( _clearRect.getX(), _clearRect.getY(), _clearRect.getWidth(), _clearRect.getHeight() );
		*/

		_context.setTransform( 1, 0, 0, 1, 0, 0 );

		//

		function calculateLights( lights ) {

			var l, ll, light, lightColor;

			_ambientLight.setRGB( 0, 0, 0 );
			_directionalLights.setRGB( 0, 0, 0 );
			_pointLights.setRGB( 0, 0, 0 );

			for ( l = 0, ll = lights.length; l < ll; l ++ ) {

				light = lights[ l ];
				lightColor = light.color;

				if ( light instanceof THREE.AmbientLight ) {

					_ambientLight.r += lightColor.r;
					_ambientLight.g += lightColor.g;
					_ambientLight.b += lightColor.b;

				} else if ( light instanceof THREE.DirectionalLight ) {

					// for particles

					_directionalLights.r += lightColor.r;
					_directionalLights.g += lightColor.g;
					_directionalLights.b += lightColor.b;

				} else if ( light instanceof THREE.PointLight ) {

					// for particles

					_pointLights.r += lightColor.r;
					_pointLights.g += lightColor.g;
					_pointLights.b += lightColor.b;

				}

			}

		}

		function calculateLight( lights, position, normal, color ) {

			var l, ll, light, lightColor, lightPosition, amount;

			for ( l = 0, ll = lights.length; l < ll; l ++ ) {

				light = lights[ l ];
				lightColor = light.color;

				if ( light instanceof THREE.DirectionalLight ) {

					lightPosition = light.matrixWorld.getPosition();

					amount = normal.dot( lightPosition );

					if ( amount <= 0 ) continue;

					amount *= light.intensity;

					color.r += lightColor.r * amount;
					color.g += lightColor.g * amount;
					color.b += lightColor.b * amount;

				} else if ( light instanceof THREE.PointLight ) {

					lightPosition = light.matrixWorld.getPosition();

					amount = normal.dot( _vector3.sub( lightPosition, position ).normalize() );

					if ( amount <= 0 ) continue;

					amount *= light.distance == 0 ? 1 : 1 - Math.min( position.distanceTo( lightPosition ) / light.distance, 1 );

					if ( amount == 0 ) continue;

					amount *= light.intensity;

					color.r += lightColor.r * amount;
					color.g += lightColor.g * amount;
					color.b += lightColor.b * amount;

				}

			}

		}

		function renderParticle ( v1, element, material, scene ) {

			setOpacity( material.opacity );
			setBlending( material.blending );

			var width, height, scaleX, scaleY,
			bitmap, bitmapWidth, bitmapHeight;

			if ( material instanceof THREE.ParticleBasicMaterial ) {

				if ( material.map ) {

					bitmap = material.map.image;
					bitmapWidth = bitmap.width >> 1;
					bitmapHeight = bitmap.height >> 1;

					scaleX = element.scale.x * _canvasWidthHalf;
					scaleY = element.scale.y * _canvasHeightHalf;

					width = scaleX * bitmapWidth;
					height = scaleY * bitmapHeight;

					// TODO: Rotations break this...

					_bboxRect.set( v1.x - width, v1.y - height, v1.x  + width, v1.y + height );

					if ( !_clipRect.intersects( _bboxRect ) ) {

						return;

					}

					_context.save();
					_context.translate( v1.x, v1.y );
					_context.rotate( - element.rotation );
					_context.scale( scaleX, - scaleY );

					_context.translate( - bitmapWidth, - bitmapHeight );
					_context.drawImage( bitmap, 0, 0 );

					_context.restore();

				}

				/* DEBUG
				_context.beginPath();
				_context.moveTo( v1.x - 10, v1.y );
				_context.lineTo( v1.x + 10, v1.y );
				_context.moveTo( v1.x, v1.y - 10 );
				_context.lineTo( v1.x, v1.y + 10 );
				_context.closePath();
				_context.strokeStyle = 'rgb(255,255,0)';
				_context.stroke();
				*/

			} else if ( material instanceof THREE.ParticleCanvasMaterial ) {

				width = element.scale.x * _canvasWidthHalf;
				height = element.scale.y * _canvasHeightHalf;

				_bboxRect.set( v1.x - width, v1.y - height, v1.x + width, v1.y + height );

				if ( !_clipRect.intersects( _bboxRect ) ) {

					return;

				}

				setStrokeStyle( material.color.getContextStyle() );
				setFillStyle( material.color.getContextStyle() );

				_context.save();
				_context.translate( v1.x, v1.y );
				_context.rotate( - element.rotation );
				_context.scale( width, height );

				material.program( _context );

				_context.restore();

			}

		}

		function renderLine( v1, v2, element, material, scene ) {

			setOpacity( material.opacity );
			setBlending( material.blending );

			_context.beginPath();
			_context.moveTo( v1.positionScreen.x, v1.positionScreen.y );
			_context.lineTo( v2.positionScreen.x, v2.positionScreen.y );
			_context.closePath();

			if ( material instanceof THREE.LineBasicMaterial ) {

				setLineWidth( material.linewidth );
				setLineCap( material.linecap );
				setLineJoin( material.linejoin );
				setStrokeStyle( material.color.getContextStyle() );

				_context.stroke();
				_bboxRect.inflate( material.linewidth * 2 );

			}

		}

		function renderFace3( v1, v2, v3, uv1, uv2, uv3, element, material, scene ) {

			_this.info.render.vertices += 3;
			_this.info.render.faces ++;

			setOpacity( material.opacity );
			setBlending( material.blending );

			_v1x = v1.positionScreen.x; _v1y = v1.positionScreen.y;
			_v2x = v2.positionScreen.x; _v2y = v2.positionScreen.y;
			_v3x = v3.positionScreen.x; _v3y = v3.positionScreen.y;

			drawTriangle( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y );

			if ( material instanceof THREE.MeshBasicMaterial ) {

				if ( material.map/* && !material.wireframe*/ ) {

					if ( material.map.mapping instanceof THREE.UVMapping ) {

						_uvs = element.uvs[ 0 ];
						patternPath( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uvs[ uv1 ].u, _uvs[ uv1 ].v, _uvs[ uv2 ].u, _uvs[ uv2 ].v, _uvs[ uv3 ].u, _uvs[ uv3 ].v, material.map );

					}


				} else if ( material.envMap ) {

					if ( material.envMap.mapping instanceof THREE.SphericalReflectionMapping ) {

						var cameraMatrix = camera.matrixWorldInverse;

						_vector3.copy( element.vertexNormalsWorld[ uv1 ] );
						_uv1x = ( _vector3.x * cameraMatrix.n11 + _vector3.y * cameraMatrix.n12 + _vector3.z * cameraMatrix.n13 ) * 0.5 + 0.5;
						_uv1y = - ( _vector3.x * cameraMatrix.n21 + _vector3.y * cameraMatrix.n22 + _vector3.z * cameraMatrix.n23 ) * 0.5 + 0.5;

						_vector3.copy( element.vertexNormalsWorld[ uv2 ] );
						_uv2x = ( _vector3.x * cameraMatrix.n11 + _vector3.y * cameraMatrix.n12 + _vector3.z * cameraMatrix.n13 ) * 0.5 + 0.5;
						_uv2y = - ( _vector3.x * cameraMatrix.n21 + _vector3.y * cameraMatrix.n22 + _vector3.z * cameraMatrix.n23 ) * 0.5 + 0.5;

						_vector3.copy( element.vertexNormalsWorld[ uv3 ] );
						_uv3x = ( _vector3.x * cameraMatrix.n11 + _vector3.y * cameraMatrix.n12 + _vector3.z * cameraMatrix.n13 ) * 0.5 + 0.5;
						_uv3y = - ( _vector3.x * cameraMatrix.n21 + _vector3.y * cameraMatrix.n22 + _vector3.z * cameraMatrix.n23 ) * 0.5 + 0.5;

						patternPath( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uv1x, _uv1y, _uv2x, _uv2y, _uv3x, _uv3y, material.envMap );

					}/* else if ( material.envMap.mapping == THREE.SphericalRefractionMapping ) {

						

					}*/


				} else {

					material.wireframe ? strokePath( material.color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( material.color );

				}

			} else if ( material instanceof THREE.MeshLambertMaterial ) {

				if ( material.map && !material.wireframe ) {

					if ( material.map.mapping instanceof THREE.UVMapping ) {

						_uvs = element.uvs[ 0 ];
						patternPath( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uvs[ uv1 ].u, _uvs[ uv1 ].v, _uvs[ uv2 ].u, _uvs[ uv2 ].v, _uvs[ uv3 ].u, _uvs[ uv3 ].v, material.map );

					}

					setBlending( THREE.SubtractiveBlending );

				}

				if ( _enableLighting ) {

					if ( !material.wireframe && material.shading == THREE.SmoothShading && element.vertexNormalsWorld.length == 3 ) {

						_color1.r = _color2.r = _color3.r = _ambientLight.r;
						_color1.g = _color2.g = _color3.g = _ambientLight.g;
						_color1.b = _color2.b = _color3.b = _ambientLight.b;

						calculateLight( _lights, element.v1.positionWorld, element.vertexNormalsWorld[ 0 ], _color1 );
						calculateLight( _lights, element.v2.positionWorld, element.vertexNormalsWorld[ 1 ], _color2 );
						calculateLight( _lights, element.v3.positionWorld, element.vertexNormalsWorld[ 2 ], _color3 );

						_color1.r = Math.max( 0, Math.min( material.color.r * _color1.r, 1 ) );
						_color1.g = Math.max( 0, Math.min( material.color.g * _color1.g, 1 ) );
						_color1.b = Math.max( 0, Math.min( material.color.b * _color1.b, 1 ) );

						_color2.r = Math.max( 0, Math.min( material.color.r * _color2.r, 1 ) );
						_color2.g = Math.max( 0, Math.min( material.color.g * _color2.g, 1 ) );
						_color2.b = Math.max( 0, Math.min( material.color.b * _color2.b, 1 ) );

						_color3.r = Math.max( 0, Math.min( material.color.r * _color3.r, 1 ) );
						_color3.g = Math.max( 0, Math.min( material.color.g * _color3.g, 1 ) );
						_color3.b = Math.max( 0, Math.min( material.color.b * _color3.b, 1 ) );

						_color4.r = ( _color2.r + _color3.r ) * 0.5;
						_color4.g = ( _color2.g + _color3.g ) * 0.5;
						_color4.b = ( _color2.b + _color3.b ) * 0.5;

						_image = getGradientTexture( _color1, _color2, _color3, _color4 );

						clipImage( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, 0, 0, 1, 0, 0, 1, _image );

					} else {

						_color.r = _ambientLight.r;
						_color.g = _ambientLight.g;
						_color.b = _ambientLight.b;

						calculateLight( _lights, element.centroidWorld, element.normalWorld, _color );

						_color.r = Math.max( 0, Math.min( material.color.r * _color.r, 1 ) );
						_color.g = Math.max( 0, Math.min( material.color.g * _color.g, 1 ) );
						_color.b = Math.max( 0, Math.min( material.color.b * _color.b, 1 ) );

						material.wireframe ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( _color );

					}

				} else {

					material.wireframe ? strokePath( material.color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( material.color );

				}

			} else if ( material instanceof THREE.MeshDepthMaterial ) {

				_near = camera.near;
				_far = camera.far;

				_color1.r = _color1.g = _color1.b = 1 - smoothstep( v1.positionScreen.z, _near, _far );
				_color2.r = _color2.g = _color2.b = 1 - smoothstep( v2.positionScreen.z, _near, _far );
				_color3.r = _color3.g = _color3.b = 1 - smoothstep( v3.positionScreen.z, _near, _far );

				_color4.r = ( _color2.r + _color3.r ) * 0.5;
				_color4.g = ( _color2.g + _color3.g ) * 0.5;
				_color4.b = ( _color2.b + _color3.b ) * 0.5;

				_image = getGradientTexture( _color1, _color2, _color3, _color4 );

				clipImage( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, 0, 0, 1, 0, 0, 1, _image );

			} else if ( material instanceof THREE.MeshNormalMaterial ) {

				_color.r = normalToComponent( element.normalWorld.x );
				_color.g = normalToComponent( element.normalWorld.y );
				_color.b = normalToComponent( element.normalWorld.z );

				material.wireframe ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( _color );

			}

		}

		function renderFace4( v1, v2, v3, v4, v5, v6, element, material, scene ) {

			_this.info.render.vertices += 4;
			_this.info.render.faces ++;

			setOpacity( material.opacity );
			setBlending( material.blending );

			if ( material.map || material.envMap ) {

				// Let renderFace3() handle this

				renderFace3( v1, v2, v4, 0, 1, 3, element, material, scene );
				renderFace3( v5, v3, v6, 1, 2, 3, element, material, scene );

				return;

			}

			_v1x = v1.positionScreen.x; _v1y = v1.positionScreen.y;
			_v2x = v2.positionScreen.x; _v2y = v2.positionScreen.y;
			_v3x = v3.positionScreen.x; _v3y = v3.positionScreen.y;
			_v4x = v4.positionScreen.x; _v4y = v4.positionScreen.y;
			_v5x = v5.positionScreen.x; _v5y = v5.positionScreen.y;
			_v6x = v6.positionScreen.x; _v6y = v6.positionScreen.y;

			if ( material instanceof THREE.MeshBasicMaterial ) {

				drawQuad( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _v4x, _v4y );

				material.wireframe ? strokePath( material.color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( material.color );

			} else if ( material instanceof THREE.MeshLambertMaterial ) {

				if ( _enableLighting ) {

					if ( !material.wireframe && material.shading == THREE.SmoothShading && element.vertexNormalsWorld.length == 4 ) {

						_color1.r = _color2.r = _color3.r = _color4.r = _ambientLight.r;
						_color1.g = _color2.g = _color3.g = _color4.g = _ambientLight.g;
						_color1.b = _color2.b = _color3.b = _color4.b = _ambientLight.b;

						calculateLight( _lights, element.v1.positionWorld, element.vertexNormalsWorld[ 0 ], _color1 );
						calculateLight( _lights, element.v2.positionWorld, element.vertexNormalsWorld[ 1 ], _color2 );
						calculateLight( _lights, element.v4.positionWorld, element.vertexNormalsWorld[ 3 ], _color3 );
						calculateLight( _lights, element.v3.positionWorld, element.vertexNormalsWorld[ 2 ], _color4 );

						_color1.r = Math.max( 0, Math.min( material.color.r * _color1.r, 1 ) );
						_color1.g = Math.max( 0, Math.min( material.color.g * _color1.g, 1 ) );
						_color1.b = Math.max( 0, Math.min( material.color.b * _color1.b, 1 ) );

						_color2.r = Math.max( 0, Math.min( material.color.r * _color2.r, 1 ) );
						_color2.g = Math.max( 0, Math.min( material.color.g * _color2.g, 1 ) );
						_color2.b = Math.max( 0, Math.min( material.color.b * _color2.b, 1 ) );

						_color3.r = Math.max( 0, Math.min( material.color.r * _color3.r, 1 ) );
						_color3.g = Math.max( 0, Math.min( material.color.g * _color3.g, 1 ) );
						_color3.b = Math.max( 0, Math.min( material.color.b * _color3.b, 1 ) );

						_color4.r = Math.max( 0, Math.min( material.color.r * _color4.r, 1 ) );
						_color4.g = Math.max( 0, Math.min( material.color.g * _color4.g, 1 ) );
						_color4.b = Math.max( 0, Math.min( material.color.b * _color4.b, 1 ) );

						_image = getGradientTexture( _color1, _color2, _color3, _color4 );

						// TODO: UVs are incorrect, v4->v3?

						drawTriangle( _v1x, _v1y, _v2x, _v2y, _v4x, _v4y );
						clipImage( _v1x, _v1y, _v2x, _v2y, _v4x, _v4y, 0, 0, 1, 0, 0, 1, _image );

						drawTriangle( _v5x, _v5y, _v3x, _v3y, _v6x, _v6y );
						clipImage( _v5x, _v5y, _v3x, _v3y, _v6x, _v6y, 1, 0, 1, 1, 0, 1, _image );

					} else {

						_color.r = _ambientLight.r;
						_color.g = _ambientLight.g;
						_color.b = _ambientLight.b;

						calculateLight( _lights, element.centroidWorld, element.normalWorld, _color );

						_color.r = Math.max( 0, Math.min( material.color.r * _color.r, 1 ) );
						_color.g = Math.max( 0, Math.min( material.color.g * _color.g, 1 ) );
						_color.b = Math.max( 0, Math.min( material.color.b * _color.b, 1 ) );

						drawQuad( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _v4x, _v4y );

						material.wireframe ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( _color );

					}

				} else {

					drawQuad( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _v4x, _v4y );

					material.wireframe ? strokePath( material.color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( material.color );

				}

			} else if ( material instanceof THREE.MeshNormalMaterial ) {

				_color.r = normalToComponent( element.normalWorld.x );
				_color.g = normalToComponent( element.normalWorld.y );
				_color.b = normalToComponent( element.normalWorld.z );

				drawQuad( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _v4x, _v4y );

				material.wireframe ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin ) : fillPath( _color );

			} else if ( material instanceof THREE.MeshDepthMaterial ) {

				_near = camera.near;
				_far = camera.far;

				_color1.r = _color1.g = _color1.b = 1 - smoothstep( v1.positionScreen.z, _near, _far );
				_color2.r = _color2.g = _color2.b = 1 - smoothstep( v2.positionScreen.z, _near, _far );
				_color3.r = _color3.g = _color3.b = 1 - smoothstep( v4.positionScreen.z, _near, _far );
				_color4.r = _color4.g = _color4.b = 1 - smoothstep( v3.positionScreen.z, _near, _far );

				_image = getGradientTexture( _color1, _color2, _color3, _color4 );

				// TODO: UVs are incorrect, v4->v3?

				drawTriangle( _v1x, _v1y, _v2x, _v2y, _v4x, _v4y );
				clipImage( _v1x, _v1y, _v2x, _v2y, _v4x, _v4y, 0, 0, 1, 0, 0, 1, _image );

				drawTriangle( _v5x, _v5y, _v3x, _v3y, _v6x, _v6y );
				clipImage( _v5x, _v5y, _v3x, _v3y, _v6x, _v6y, 1, 0, 1, 1, 0, 1, _image );

			}

		}

		//

		function drawTriangle( x0, y0, x1, y1, x2, y2 ) {

			_context.beginPath();
			_context.moveTo( x0, y0 );
			_context.lineTo( x1, y1 );
			_context.lineTo( x2, y2 );
			_context.lineTo( x0, y0 );
			_context.closePath();

		}

		function drawQuad( x0, y0, x1, y1, x2, y2, x3, y3 ) {

			_context.beginPath();
			_context.moveTo( x0, y0 );
			_context.lineTo( x1, y1 );
			_context.lineTo( x2, y2 );
			_context.lineTo( x3, y3 );
			_context.lineTo( x0, y0 );
			_context.closePath();

		}

		function strokePath( color, linewidth, linecap, linejoin ) {

			setLineWidth( linewidth );
			setLineCap( linecap );
			setLineJoin( linejoin );
			setStrokeStyle( color.getContextStyle() );

			_context.stroke();

			_bboxRect.inflate( linewidth * 2 );

		}

		function fillPath( color ) {

			setFillStyle( color.getContextStyle() );
			_context.fill();

		}

		function patternPath( x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2, texture ) {

			if ( texture.image.width == 0 ) return;

			if ( texture.needsUpdate == true || _patterns[ texture.id ] == undefined ) {

				var repeatX = texture.wrapS == THREE.RepeatWrapping;
				var repeatY = texture.wrapT == THREE.RepeatWrapping;

				_patterns[ texture.id ] = _context.createPattern( texture.image, repeatX && repeatY ? 'repeat' : repeatX && !repeatY ? 'repeat-x' : !repeatX && repeatY ? 'repeat-y' : 'no-repeat' );

				texture.needsUpdate = false;

			}

			setFillStyle( _patterns[ texture.id ] );

			// http://extremelysatisfactorytotalitarianism.com/blog/?p=2120

			var a, b, c, d, e, f, det, idet,
			offsetX = texture.offset.x / texture.repeat.x,
			offsetY = texture.offset.y / texture.repeat.y,
			width = texture.image.width * texture.repeat.x,
			height = texture.image.height * texture.repeat.y;

			u0 = ( u0 + offsetX ) * width;
			v0 = ( v0 + offsetY ) * height;

			u1 = ( u1 + offsetX ) * width;
			v1 = ( v1 + offsetY ) * height;

			u2 = ( u2 + offsetX ) * width;
			v2 = ( v2 + offsetY ) * height;

			x1 -= x0; y1 -= y0;
			x2 -= x0; y2 -= y0;

			u1 -= u0; v1 -= v0;
			u2 -= u0; v2 -= v0;

			det = u1 * v2 - u2 * v1;

			if ( det == 0 ) {

				if ( _imagedatas[ texture.id ] == undefined ) {

					var canvas = document.createElement( 'canvas' )
					canvas.width = texture.image.width;
					canvas.height = texture.image.height;

					var context = canvas.getContext( '2d' );
					context.drawImage( texture.image, 0, 0 );

					_imagedatas[ texture.id ] = context.getImageData( 0, 0, texture.image.width, texture.image.height ).data;

					delete canvas;

				}

				var data = _imagedatas[ texture.id ];
				var index = ( Math.floor( u0 ) + Math.floor( v0 ) * texture.image.width ) * 4;

				_color.setRGB( data[ index ] / 255, data[ index + 1 ] / 255, data[ index + 2 ] / 255 );
				fillPath( _color );

				return;

			}

			idet = 1 / det;

			a = ( v2 * x1 - v1 * x2 ) * idet;
			b = ( v2 * y1 - v1 * y2 ) * idet;
			c = ( u1 * x2 - u2 * x1 ) * idet;
			d = ( u1 * y2 - u2 * y1 ) * idet;

			e = x0 - a * u0 - c * v0;
			f = y0 - b * u0 - d * v0;

			_context.save();
			_context.transform( a, b, c, d, e, f );
			_context.fill();
			_context.restore();

		}

		function clipImage( x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2, image ) {

			// http://extremelysatisfactorytotalitarianism.com/blog/?p=2120

			var a, b, c, d, e, f, det, idet,
			width = image.width - 1,
			height = image.height - 1;

			u0 *= width; v0 *= height;
			u1 *= width; v1 *= height;
			u2 *= width; v2 *= height;

			x1 -= x0; y1 -= y0;
			x2 -= x0; y2 -= y0;

			u1 -= u0; v1 -= v0;
			u2 -= u0; v2 -= v0;

			det = u1 * v2 - u2 * v1;

			idet = 1 / det;

			a = ( v2 * x1 - v1 * x2 ) * idet;
			b = ( v2 * y1 - v1 * y2 ) * idet;
			c = ( u1 * x2 - u2 * x1 ) * idet;
			d = ( u1 * y2 - u2 * y1 ) * idet;

			e = x0 - a * u0 - c * v0;
			f = y0 - b * u0 - d * v0;

			_context.save();
			_context.transform( a, b, c, d, e, f );
			_context.clip();
			_context.drawImage( image, 0, 0 );
			_context.restore();

		}

		function getGradientTexture( color1, color2, color3, color4 ) {

			// http://mrdoob.com/blog/post/710

			var c1r = ~~ ( color1.r * 255 ), c1g = ~~ ( color1.g * 255 ), c1b = ~~ ( color1.b * 255 ),
			c2r = ~~ ( color2.r * 255 ), c2g = ~~ ( color2.g * 255 ), c2b = ~~ ( color2.b * 255 ),
			c3r = ~~ ( color3.r * 255 ), c3g = ~~ ( color3.g * 255 ), c3b = ~~ ( color3.b * 255 ),
			c4r = ~~ ( color4.r * 255 ), c4g = ~~ ( color4.g * 255 ), c4b = ~~ ( color4.b * 255 );

			_pixelMapData[ 0 ] = c1r < 0 ? 0 : c1r > 255 ? 255 : c1r;
			_pixelMapData[ 1 ] = c1g < 0 ? 0 : c1g > 255 ? 255 : c1g;
			_pixelMapData[ 2 ] = c1b < 0 ? 0 : c1b > 255 ? 255 : c1b;

			_pixelMapData[ 4 ] = c2r < 0 ? 0 : c2r > 255 ? 255 : c2r;
			_pixelMapData[ 5 ] = c2g < 0 ? 0 : c2g > 255 ? 255 : c2g;
			_pixelMapData[ 6 ] = c2b < 0 ? 0 : c2b > 255 ? 255 : c2b;

			_pixelMapData[ 8 ] = c3r < 0 ? 0 : c3r > 255 ? 255 : c3r;
			_pixelMapData[ 9 ] = c3g < 0 ? 0 : c3g > 255 ? 255 : c3g;
			_pixelMapData[ 10 ] = c3b < 0 ? 0 : c3b > 255 ? 255 : c3b;

			_pixelMapData[ 12 ] = c4r < 0 ? 0 : c4r > 255 ? 255 : c4r;
			_pixelMapData[ 13 ] = c4g < 0 ? 0 : c4g > 255 ? 255 : c4g;
			_pixelMapData[ 14 ] = c4b < 0 ? 0 : c4b > 255 ? 255 : c4b;

			_pixelMapContext.putImageData( _pixelMapImage, 0, 0 );
			_gradientMapContext.drawImage( _pixelMap, 0, 0 );

			return _gradientMap;

		}

		function smoothstep( value, min, max ) {

			var x = ( value - min ) / ( max - min );
			return x * x * ( 3 - 2 * x );

		}

		function normalToComponent( normal ) {

			var component = ( normal + 1 ) * 0.5;
			return component < 0 ? 0 : ( component > 1 ? 1 : component );

		}

		// Hide anti-alias gaps

		function expand( v1, v2 ) {

			var x = v2.x - v1.x, y =  v2.y - v1.y,
			det = x * x + y * y, idet;

			if ( det == 0 ) return;

			idet = 1 / Math.sqrt( det );

			x *= idet; y *= idet;

			v2.x += x; v2.y += y;
			v1.x -= x; v1.y -= y;

		}
	};

	// Context cached methods.

	function setOpacity( value ) {

		if ( _contextGlobalAlpha != value ) {

			_context.globalAlpha = _contextGlobalAlpha = value;

		}

	}

	function setBlending( value ) {

		if ( _contextGlobalCompositeOperation != value ) {

			switch ( value ) {

				case THREE.NormalBlending:

					_context.globalCompositeOperation = 'source-over';

					break;

				case THREE.AdditiveBlending:

					_context.globalCompositeOperation = 'lighter';

					break;

				case THREE.SubtractiveBlending:

					_context.globalCompositeOperation = 'darker';

					break;

			}

			_contextGlobalCompositeOperation = value;

		}

	}

	function setLineWidth( value ) {

		if ( _contextLineWidth != value ) {

			_context.lineWidth = _contextLineWidth = value;

		}

	}

	function setLineCap( value ) {

		// "butt", "round", "square"

		if ( _contextLineCap != value ) {

			_context.lineCap = _contextLineCap = value;

		}

	}

	function setLineJoin( value ) {

		// "round", "bevel", "miter"

		if ( _contextLineJoin != value ) {

			_context.lineJoin = _contextLineJoin = value;

		}

	}

	function setStrokeStyle( style ) {

		if ( _contextStrokeStyle != style ) {

			_context.strokeStyle = _contextStrokeStyle = style;

		}

	}

	function setFillStyle( style ) {

		if ( _contextFillStyle != style ) {

			_context.fillStyle = _contextFillStyle = style;

		}

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.SVGRenderer = function () {

	var _this = this,
	_renderData, _elements, _lights,
	_projector = new THREE.Projector(),
	_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
	_svgWidth, _svgHeight, _svgWidthHalf, _svgHeightHalf,

	_v1, _v2, _v3, _v4,

	_clipRect = new THREE.Rectangle(),
	_bboxRect = new THREE.Rectangle(),

	_enableLighting = false,
	_color = new THREE.Color(),
	_ambientLight = new THREE.Color(),
	_directionalLights = new THREE.Color(),
	_pointLights = new THREE.Color(),

	_w, // z-buffer to w-buffer
	_vector3 = new THREE.Vector3(), // Needed for PointLight

	_svgPathPool = [], _svgCirclePool = [], _svgLinePool = [],
	_svgNode, _pathCount, _circleCount, _lineCount,
	_quality = 1;

	this.domElement = _svg;

	this.autoClear = true;
	this.sortObjects = true;
	this.sortElements = true;

	this.info = {

		render: {

			vertices: 0,
			faces: 0

		}

	}

	this.setQuality = function( quality ) {

		switch(quality) {

			case "high": _quality = 1; break;
			case "low": _quality = 0; break;

		}

	};

	this.setSize = function( width, height ) {

		_svgWidth = width; _svgHeight = height;
		_svgWidthHalf = _svgWidth / 2; _svgHeightHalf = _svgHeight / 2;

		_svg.setAttribute( 'viewBox', ( - _svgWidthHalf ) + ' ' + ( - _svgHeightHalf ) + ' ' + _svgWidth + ' ' + _svgHeight );
		_svg.setAttribute( 'width', _svgWidth );
		_svg.setAttribute( 'height', _svgHeight );

		_clipRect.set( - _svgWidthHalf, - _svgHeightHalf, _svgWidthHalf, _svgHeightHalf );

	};

	this.clear = function () {

		while ( _svg.childNodes.length > 0 ) {

			_svg.removeChild( _svg.childNodes[ 0 ] );

		}

	};

	this.render = function ( scene, camera ) {

		var e, el, element, material;

		this.autoClear && this.clear();

		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;

		_renderData = _projector.projectScene( scene, camera, this.sortElements );
		_elements = _renderData.elements;
		_lights = _renderData.lights;

		_pathCount = 0; _circleCount = 0; _lineCount = 0;

		_enableLighting = _lights.length > 0;

		if ( _enableLighting ) {

			 calculateLights( _lights );

		}

		for ( e = 0, el = _elements.length; e < el; e ++ ) {

			element = _elements[ e ];

			material = element.material;
			material = material instanceof THREE.MeshFaceMaterial ? element.faceMaterial : material;

			if ( material == null || material.opacity == 0 ) continue;

			_bboxRect.empty();

			if ( element instanceof THREE.RenderableParticle ) {

				_v1 = element;
				_v1.x *= _svgWidthHalf; _v1.y *= -_svgHeightHalf;

				renderParticle( _v1, element, material, scene );

			} else if ( element instanceof THREE.RenderableLine ) {

				_v1 = element.v1; _v2 = element.v2;

				_v1.positionScreen.x *= _svgWidthHalf; _v1.positionScreen.y *= - _svgHeightHalf;
				_v2.positionScreen.x *= _svgWidthHalf; _v2.positionScreen.y *= - _svgHeightHalf;

				_bboxRect.addPoint( _v1.positionScreen.x, _v1.positionScreen.y );
				_bboxRect.addPoint( _v2.positionScreen.x, _v2.positionScreen.y );

				if ( !_clipRect.intersects( _bboxRect ) ) {

					continue;

				}

				renderLine( _v1, _v2, element, material, scene );

			} else if ( element instanceof THREE.RenderableFace3 ) {

				_v1 = element.v1; _v2 = element.v2; _v3 = element.v3;

				_v1.positionScreen.x *= _svgWidthHalf; _v1.positionScreen.y *= - _svgHeightHalf;
				_v2.positionScreen.x *= _svgWidthHalf; _v2.positionScreen.y *= - _svgHeightHalf;
				_v3.positionScreen.x *= _svgWidthHalf; _v3.positionScreen.y *= - _svgHeightHalf;

				_bboxRect.addPoint( _v1.positionScreen.x, _v1.positionScreen.y );
				_bboxRect.addPoint( _v2.positionScreen.x, _v2.positionScreen.y );
				_bboxRect.addPoint( _v3.positionScreen.x, _v3.positionScreen.y );

				if ( !_clipRect.intersects( _bboxRect ) ) {

					continue;

				}

				renderFace3( _v1, _v2, _v3, element, material, scene );

			} else if ( element instanceof THREE.RenderableFace4 ) {

				_v1 = element.v1; _v2 = element.v2; _v3 = element.v3; _v4 = element.v4;

				_v1.positionScreen.x *= _svgWidthHalf; _v1.positionScreen.y *= -_svgHeightHalf;
				_v2.positionScreen.x *= _svgWidthHalf; _v2.positionScreen.y *= -_svgHeightHalf;
				_v3.positionScreen.x *= _svgWidthHalf; _v3.positionScreen.y *= -_svgHeightHalf;
				_v4.positionScreen.x *= _svgWidthHalf; _v4.positionScreen.y *= -_svgHeightHalf;

				_bboxRect.addPoint( _v1.positionScreen.x, _v1.positionScreen.y );
				_bboxRect.addPoint( _v2.positionScreen.x, _v2.positionScreen.y );
				_bboxRect.addPoint( _v3.positionScreen.x, _v3.positionScreen.y );
				_bboxRect.addPoint( _v4.positionScreen.x, _v4.positionScreen.y );

				if ( !_clipRect.intersects( _bboxRect) ) {

					continue;

				}

				renderFace4( _v1, _v2, _v3, _v4, element, material, scene );

			}

		}

	};

	function calculateLights( lights ) {

		var l, ll, light, lightColor;

		_ambientLight.setRGB( 0, 0, 0 );
		_directionalLights.setRGB( 0, 0, 0 );
		_pointLights.setRGB( 0, 0, 0 );

		for ( l = 0, ll = lights.length; l < ll; l++ ) {

			light = lights[ l ];
			lightColor = light.color;

			if ( light instanceof THREE.AmbientLight ) {

				_ambientLight.r += lightColor.r;
				_ambientLight.g += lightColor.g;
				_ambientLight.b += lightColor.b;

			} else if ( light instanceof THREE.DirectionalLight ) {

				_directionalLights.r += lightColor.r;
				_directionalLights.g += lightColor.g;
				_directionalLights.b += lightColor.b;

			} else if ( light instanceof THREE.PointLight ) {

				_pointLights.r += lightColor.r;
				_pointLights.g += lightColor.g;
				_pointLights.b += lightColor.b;

			}

		}

	}

	function calculateLight( lights, position, normal, color ) {

		var l, ll, light, lightColor, lightPosition, amount;

		for ( l = 0, ll = lights.length; l < ll; l ++ ) {

			light = lights[ l ];
			lightColor = light.color;

			if ( light instanceof THREE.DirectionalLight ) {

				lightPosition = light.matrixWorld.getPosition();

				amount = normal.dot( lightPosition );

				if ( amount <= 0 ) continue;

				amount *= light.intensity;

				color.r += lightColor.r * amount;
				color.g += lightColor.g * amount;
				color.b += lightColor.b * amount;

			} else if ( light instanceof THREE.PointLight ) {

				lightPosition = light.matrixWorld.getPosition();

				amount = normal.dot( _vector3.sub( lightPosition, position ).normalize() );

				if ( amount <= 0 ) continue;

				amount *= light.distance == 0 ? 1 : 1 - Math.min( position.distanceTo( lightPosition ) / light.distance, 1 );

				if ( amount == 0 ) continue;

				amount *= light.intensity;

				color.r += lightColor.r * amount;
				color.g += lightColor.g * amount;
				color.b += lightColor.b * amount;

			}

		}

	}

	function renderParticle( v1, element, material, scene ) {

		/*
		_svgNode = getCircleNode( _circleCount++ );
		_svgNode.setAttribute( 'cx', v1.x );
		_svgNode.setAttribute( 'cy', v1.y );
		_svgNode.setAttribute( 'r', element.scale.x * _svgWidthHalf );

		if ( material instanceof THREE.ParticleCircleMaterial ) {

			if ( _enableLighting ) {

				_color.r = _ambientLight.r + _directionalLights.r + _pointLights.r;
				_color.g = _ambientLight.g + _directionalLights.g + _pointLights.g;
				_color.b = _ambientLight.b + _directionalLights.b + _pointLights.b;

				_color.r = material.color.r * _color.r;
				_color.g = material.color.g * _color.g;
				_color.b = material.color.b * _color.b;

				_color.updateStyleString();

			} else {

				_color = material.color;

			}

			_svgNode.setAttribute( 'style', 'fill: ' + _color.__styleString );

		}

		_svg.appendChild( _svgNode );
		*/

	}

	function renderLine ( v1, v2, element, material, scene ) {

		_svgNode = getLineNode( _lineCount ++ );

		_svgNode.setAttribute( 'x1', v1.positionScreen.x );
		_svgNode.setAttribute( 'y1', v1.positionScreen.y );
		_svgNode.setAttribute( 'x2', v2.positionScreen.x );
		_svgNode.setAttribute( 'y2', v2.positionScreen.y );

		if ( material instanceof THREE.LineBasicMaterial ) {

			_svgNode.setAttribute( 'style', 'fill: none; stroke: ' + material.color.getContextStyle() + '; stroke-width: ' + material.linewidth + '; stroke-opacity: ' + material.opacity + '; stroke-linecap: ' + material.linecap + '; stroke-linejoin: ' + material.linejoin );

			_svg.appendChild( _svgNode );

		}

	}

	function renderFace3( v1, v2, v3, element, material, scene ) {

		_this.info.render.vertices += 3;
		_this.info.render.faces ++;

		_svgNode = getPathNode( _pathCount ++ );
		_svgNode.setAttribute( 'd', 'M ' + v1.positionScreen.x + ' ' + v1.positionScreen.y + ' L ' + v2.positionScreen.x + ' ' + v2.positionScreen.y + ' L ' + v3.positionScreen.x + ',' + v3.positionScreen.y + 'z' );

		if ( material instanceof THREE.MeshBasicMaterial ) {

			_color.copy( material.color );

		} else if ( material instanceof THREE.MeshLambertMaterial ) {

			if ( _enableLighting ) {

				_color.r = _ambientLight.r;
				_color.g = _ambientLight.g;
				_color.b = _ambientLight.b;

				calculateLight( _lights, element.centroidWorld, element.normalWorld, _color );

				_color.r = Math.max( 0, Math.min( material.color.r * _color.r, 1 ) );
				_color.g = Math.max( 0, Math.min( material.color.g * _color.g, 1 ) );
				_color.b = Math.max( 0, Math.min( material.color.b * _color.b, 1 ) );

			} else {

				_color.copy( material.color );

			}

		} else if ( material instanceof THREE.MeshDepthMaterial ) {

			_w = 1 - ( material.__2near / (material.__farPlusNear - element.z * material.__farMinusNear) );
			_color.setRGB( _w, _w, _w );

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			_color.setRGB( normalToComponent( element.normalWorld.x ), normalToComponent( element.normalWorld.y ), normalToComponent( element.normalWorld.z ) );

		}

		if ( material.wireframe ) {

			_svgNode.setAttribute( 'style', 'fill: none; stroke: ' + _color.getContextStyle() + '; stroke-width: ' + material.wireframeLinewidth + '; stroke-opacity: ' + material.opacity + '; stroke-linecap: ' + material.wireframeLinecap + '; stroke-linejoin: ' + material.wireframeLinejoin );

		} else {

			_svgNode.setAttribute( 'style', 'fill: ' + _color.getContextStyle() + '; fill-opacity: ' + material.opacity );

		}

		_svg.appendChild( _svgNode );

	}

	function renderFace4( v1, v2, v3, v4, element, material, scene ) {

		_this.info.render.vertices += 4;
		_this.info.render.faces ++;

		_svgNode = getPathNode( _pathCount ++ );
		_svgNode.setAttribute( 'd', 'M ' + v1.positionScreen.x + ' ' + v1.positionScreen.y + ' L ' + v2.positionScreen.x + ' ' + v2.positionScreen.y + ' L ' + v3.positionScreen.x + ',' + v3.positionScreen.y + ' L ' + v4.positionScreen.x + ',' + v4.positionScreen.y + 'z' );

		if ( material instanceof THREE.MeshBasicMaterial ) {

			_color.copy( material.color );

		} else if ( material instanceof THREE.MeshLambertMaterial ) {

			if ( _enableLighting ) {

				_color.r = _ambientLight.r;
				_color.g = _ambientLight.g;
				_color.b = _ambientLight.b;

				calculateLight( _lights, element.centroidWorld, element.normalWorld, _color );

				_color.r = Math.max( 0, Math.min( material.color.r * _color.r, 1 ) );
				_color.g = Math.max( 0, Math.min( material.color.g * _color.g, 1 ) );
				_color.b = Math.max( 0, Math.min( material.color.b * _color.b, 1 ) );

			} else {

				_color.copy( material.color );

			}

		} else if ( material instanceof THREE.MeshDepthMaterial ) {

			_w = 1 - ( material.__2near / (material.__farPlusNear - element.z * material.__farMinusNear) );
			_color.setRGB( _w, _w, _w );

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			_color.setRGB( normalToComponent( element.normalWorld.x ), normalToComponent( element.normalWorld.y ), normalToComponent( element.normalWorld.z ) );

		}

		if ( material.wireframe ) {

			_svgNode.setAttribute( 'style', 'fill: none; stroke: ' + _color.getContextStyle() + '; stroke-width: ' + material.wireframeLinewidth + '; stroke-opacity: ' + material.opacity + '; stroke-linecap: ' + material.wireframeLinecap + '; stroke-linejoin: ' + material.wireframeLinejoin );

		} else {

			_svgNode.setAttribute( 'style', 'fill: ' + _color.getContextStyle() + '; fill-opacity: ' + material.opacity );

		}

		_svg.appendChild( _svgNode );

	}

	function getLineNode( id ) {

		if ( _svgLinePool[ id ] == null ) {

			_svgLinePool[ id ] = document.createElementNS( 'http://www.w3.org/2000/svg', 'line' );

			if ( _quality == 0 ) {

				_svgLinePool[ id ].setAttribute( 'shape-rendering', 'crispEdges' ); //optimizeSpeed

			}

			return _svgLinePool[ id ];

		}

		return _svgLinePool[ id ];

	}

	function getPathNode( id ) {

		if ( _svgPathPool[ id ] == null ) {

			_svgPathPool[ id ] = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

			if ( _quality == 0 ) {

				_svgPathPool[ id ].setAttribute( 'shape-rendering', 'crispEdges' ); //optimizeSpeed

			}

			return _svgPathPool[ id ];

		}

		return _svgPathPool[ id ];

	}

	function getCircleNode( id ) {

		if ( _svgCirclePool[id] == null ) {

			_svgCirclePool[ id ] = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );

			if ( _quality == 0 ) {

				_svgCirclePool[id].setAttribute( 'shape-rendering', 'crispEdges' ); //optimizeSpeed

			}

			return _svgCirclePool[ id ];

		}

		return _svgCirclePool[ id ];

	}

	function normalToComponent( normal ) {

		var component = ( normal + 1 ) * 0.5;
		return component < 0 ? 0 : ( component > 1 ? 1 : component );

	}

	function pad( str ) {

		while ( str.length < 6 ) str = '0' + str;
		return str;

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.ShaderChunk = {

	// FOG

	fog_pars_fragment: [

		"#ifdef USE_FOG",

			"uniform vec3 fogColor;",

			"#ifdef FOG_EXP2",

				"uniform float fogDensity;",

			"#else",

				"uniform float fogNear;",
				"uniform float fogFar;",

			"#endif",

		"#endif"

	].join("\n"),

	fog_fragment: [

		"#ifdef USE_FOG",

			"float depth = gl_FragCoord.z / gl_FragCoord.w;",

			"#ifdef FOG_EXP2",

				"const float LOG2 = 1.442695;",
				"float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );",
				"fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );",

			"#else",

				"float fogFactor = smoothstep( fogNear, fogFar, depth );",

			"#endif",

			"gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );",

		"#endif"

	].join("\n"),

	// ENVIRONMENT MAP

	envmap_pars_fragment: [

		"#ifdef USE_ENVMAP",

			"varying vec3 vReflect;",

			"uniform float reflectivity;",
			"uniform samplerCube envMap;",
			"uniform float flipEnvMap;",
			"uniform int combine;",

		"#endif"

	].join("\n"),

	envmap_fragment: [

		"#ifdef USE_ENVMAP",

			"vec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * vReflect.x, vReflect.yz ) );",

			"#ifdef GAMMA_INPUT",

				"cubeColor.xyz *= cubeColor.xyz;",

			"#endif",

			"if ( combine == 1 ) {",

				"gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity );",

			"} else {",

				"gl_FragColor.xyz = gl_FragColor.xyz * cubeColor.xyz;",

			"}",

		"#endif"

	].join("\n"),

	envmap_pars_vertex: [

		"#ifdef USE_ENVMAP",

			"varying vec3 vReflect;",

			"uniform float refractionRatio;",
			"uniform bool useRefract;",

		"#endif"

	].join("\n"),

	envmap_vertex : [

		"#ifdef USE_ENVMAP",

			"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
			"vec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;",

			"if ( useRefract ) {",

				"vReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );",

			"} else {",

				"vReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );",

			"}",

		"#endif"

	].join("\n"),

	// COLOR MAP (particles)

	map_particle_pars_fragment: [

		"#ifdef USE_MAP",

			"uniform sampler2D map;",

		"#endif"

	].join("\n"),


	map_particle_fragment: [

		"#ifdef USE_MAP",

			"gl_FragColor = gl_FragColor * texture2D( map, gl_PointCoord );",

		"#endif"

	].join("\n"),

	// COLOR MAP (triangles)

	map_pars_vertex: [

		"#ifdef USE_MAP",

			"varying vec2 vUv;",
			"uniform vec4 offsetRepeat;",

		"#endif"

	].join("\n"),

	map_pars_fragment: [

		"#ifdef USE_MAP",

			"varying vec2 vUv;",
			"uniform sampler2D map;",

		"#endif"

	].join("\n"),

	map_vertex: [

		"#ifdef USE_MAP",

			"vUv = uv * offsetRepeat.zw + offsetRepeat.xy;",

		"#endif"

	].join("\n"),

	map_fragment: [

		"#ifdef USE_MAP",

			"#ifdef GAMMA_INPUT",

				"vec4 texelColor = texture2D( map, vUv );",
				"texelColor.xyz *= texelColor.xyz;",

				"gl_FragColor = gl_FragColor * texelColor;",

			"#else",

				"gl_FragColor = gl_FragColor * texture2D( map, vUv );",

			"#endif",

		"#endif"

	].join("\n"),

	// LIGHT MAP

	lightmap_pars_fragment: [

		"#ifdef USE_LIGHTMAP",

			"varying vec2 vUv2;",
			"uniform sampler2D lightMap;",

		"#endif"

	].join("\n"),

	lightmap_pars_vertex: [

		"#ifdef USE_LIGHTMAP",

			"varying vec2 vUv2;",

		"#endif"

	].join("\n"),

	lightmap_fragment: [

		"#ifdef USE_LIGHTMAP",

			"gl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );",

		"#endif"

	].join("\n"),

	lightmap_vertex: [

		"#ifdef USE_LIGHTMAP",

			"vUv2 = uv2;",

		"#endif"

	].join("\n"),

	// LIGHTS LAMBERT

	lights_lambert_pars_vertex: [

		"uniform vec3 ambient;",
		"uniform vec3 diffuse;",

		"uniform vec3 ambientLightColor;",

		"#if MAX_DIR_LIGHTS > 0",

			"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
			"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",

		"#endif",

		"#if MAX_POINT_LIGHTS > 0",

			"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
			"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
			"uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

		"#endif"

	].join("\n"),

	lights_lambert_vertex: [

		"vLightWeighting = vec3( 0.0 );",

		"#if MAX_DIR_LIGHTS > 0",

		"for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {",

			"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",
			"float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );",
			"vLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;",

		"}",

		"#endif",

		"#if MAX_POINT_LIGHTS > 0",

			"for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

				"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",

				"vec3 lVector = lPosition.xyz - mvPosition.xyz;",

				"float lDistance = 1.0;",

				"if ( pointLightDistance[ i ] > 0.0 )",
					"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",

				"lVector = normalize( lVector );",

				"float pointLightWeighting = max( dot( transformedNormal, lVector ), 0.0 );",
				"vLightWeighting += pointLightColor[ i ] * pointLightWeighting * lDistance;",

			"}",

		"#endif",

		"vLightWeighting = vLightWeighting * diffuse + ambient * ambientLightColor;",

	].join("\n"),

	// LIGHTS PHONG

	lights_phong_pars_vertex: [

		"#if MAX_POINT_LIGHTS > 0",
		"#ifndef PHONG_PER_PIXEL",

			"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
			"uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

			"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",

		"#endif",
		"#endif"

	].join("\n"),


	lights_phong_vertex: [

		"#if MAX_POINT_LIGHTS > 0",
		"#ifndef PHONG_PER_PIXEL",

			"for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

				"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",

				"vec3 lVector = lPosition.xyz - mvPosition.xyz;",

				"float lDistance = 1.0;",

				"if ( pointLightDistance[ i ] > 0.0 )",
					"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",

				"lVector = normalize( lVector );",

				"vPointLight[ i ] = vec4( lVector, lDistance );",

			"}",

		"#endif",
		"#endif"

	].join("\n"),

	lights_phong_pars_fragment: [

		"uniform vec3 ambientLightColor;",

		"#if MAX_DIR_LIGHTS > 0",

			"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
			"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",

		"#endif",

		"#if MAX_POINT_LIGHTS > 0",

			"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",

			"#ifdef PHONG_PER_PIXEL",

				"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
				"uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

			"#else",

				"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",

			"#endif",

		"#endif",

		"varying vec3 vViewPosition;",
		"varying vec3 vNormal;"

	].join("\n"),

	lights_phong_fragment: [

		"vec3 normal = normalize( vNormal );",
		"vec3 viewPosition = normalize( vViewPosition );",

		"#if MAX_POINT_LIGHTS > 0",

			"vec3 pointDiffuse  = vec3( 0.0 );",
			"vec3 pointSpecular = vec3( 0.0 );",

			"for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

				"#ifdef PHONG_PER_PIXEL",

					"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",

					"vec3 lVector = lPosition.xyz + vViewPosition.xyz;",

					"float lDistance = 1.0;",

					"if ( pointLightDistance[ i ] > 0.0 )",
						"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",

					"lVector = normalize( lVector );",

				"#else",

					"vec3 lVector = normalize( vPointLight[ i ].xyz );",
					"float lDistance = vPointLight[ i ].w;",

				"#endif",

				"vec3 pointHalfVector = normalize( lVector + viewPosition );",
				"float pointDistance = lDistance;",

				"float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
				"float pointDiffuseWeight = max( dot( normal, lVector ), 0.0 );",

				"float pointSpecularWeight = pow( pointDotNormalHalf, shininess );",

				"#ifdef PHYSICALLY_BASED_SHADING",

					"vec3 schlick = specular + vec3( 1.0 - specular ) * pow( dot( lVector, pointHalfVector ), 5.0 );",
					"pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance;",

				"#else",

					"pointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance;",

				"#endif",

				"pointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * pointDistance;",

			"}",

		"#endif",

		"#if MAX_DIR_LIGHTS > 0",

			"vec3 dirDiffuse  = vec3( 0.0 );",
			"vec3 dirSpecular = vec3( 0.0 );" ,

			"for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {",

				"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",

				"vec3 dirVector = normalize( lDirection.xyz );",
				"vec3 dirHalfVector = normalize( lDirection.xyz + viewPosition );",

				"float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
				"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

				"float dirSpecularWeight = pow( dirDotNormalHalf, shininess );",

				"#ifdef PHYSICALLY_BASED_SHADING",

					/*
					// fresnel term from skin shader
					"const float F0 = 0.128;",

					"float base = 1.0 - dot( viewPosition, dirHalfVector );",
					"float exponential = pow( base, 5.0 );",

					"float fresnel = exponential + F0 * ( 1.0 - exponential );",
					*/

					/*
					// fresnel term from fresnel shader
					"const float mFresnelBias = 0.08;",
					"const float mFresnelScale = 0.3;",
					"const float mFresnelPower = 5.0;",

					"float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );",
					*/

					// normalization factor
					//float specularNormalization = ( shininess + 2.0 ) / 8.0;

					//"dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;",

					"vec3 schlick = specular + vec3( 1.0 - specular ) * pow( dot( dirVector, dirHalfVector ), 5.0 );",
					"dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;",

				"#else",

					"dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;",

				"#endif",

				"dirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;",

			"}",

		"#endif",

		"vec3 totalDiffuse = vec3( 0.0 );",
		"vec3 totalSpecular = vec3( 0.0 );",

		"#if MAX_DIR_LIGHTS > 0",

			"totalDiffuse += dirDiffuse;",
			"totalSpecular += dirSpecular;",

		"#endif",

		"#if MAX_POINT_LIGHTS > 0",

			"totalDiffuse += pointDiffuse;",
			"totalSpecular += pointSpecular;",

		"#endif",

		"#ifdef METAL",

			"gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient + totalSpecular );",

		"#else",

			"gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient ) + totalSpecular;",

		"#endif"

	].join("\n"),

	// VERTEX COLORS

	color_pars_fragment: [

		"#ifdef USE_COLOR",

			"varying vec3 vColor;",

		"#endif"

	].join("\n"),


	color_fragment: [

		"#ifdef USE_COLOR",

			"gl_FragColor = gl_FragColor * vec4( vColor, opacity );",

		"#endif"

	].join("\n"),

	color_pars_vertex: [

		"#ifdef USE_COLOR",

			"varying vec3 vColor;",

		"#endif"

	].join("\n"),


	color_vertex: [

		"#ifdef USE_COLOR",

			"#ifdef GAMMA_INPUT",

				"vColor = color * color;",

			"#else",

				"vColor = color;",

			"#endif",

		"#endif"

	].join("\n"),

	// SKINNING

	skinning_pars_vertex: [

		"#ifdef USE_SKINNING",

			"uniform mat4 boneGlobalMatrices[ MAX_BONES ];",

		"#endif"

	].join("\n"),

	skinning_vertex: [

		"#ifdef USE_SKINNING",

			"gl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;",
			"gl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;",

			// this doesn't work, no idea why
			//"gl_Position  = projectionMatrix * cameraInverseMatrix * objectMatrix * gl_Position;",

			"gl_Position  = projectionMatrix * viewMatrix * objectMatrix * gl_Position;",

		"#endif"

	].join("\n"),

	// MORPHING

	morphtarget_pars_vertex: [

		"#ifdef USE_MORPHTARGETS",

			"uniform float morphTargetInfluences[ 8 ];",

		"#endif"

	].join("\n"),

	morphtarget_vertex: [

		"#ifdef USE_MORPHTARGETS",

			"vec3 morphed = vec3( 0.0, 0.0, 0.0 );",
			"morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];",
			"morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];",
			"morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];",
			"morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];",
			"morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];",
			"morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];",
			"morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];",
			"morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];",
			"morphed += position;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );",

		"#endif"

	].join("\n"),

	default_vertex : [

		"#ifndef USE_MORPHTARGETS",
		"#ifndef USE_SKINNING",

			"gl_Position = projectionMatrix * mvPosition;",

		"#endif",
		"#endif"

	].join("\n"),

	// SHADOW MAP

	// based on SpiderGL shadow map and Fabien Sanglard's GLSL shadow mapping examples
	//  http://spidergl.org/example.php?id=6
	// 	http://fabiensanglard.net/shadowmapping

	shadowmap_pars_fragment: [

		"#ifdef USE_SHADOWMAP",

			"uniform sampler2D shadowMap[ MAX_SHADOWS ];",

			"uniform float shadowDarkness;",
			"uniform float shadowBias;",

			"varying vec4 vShadowCoord[ MAX_SHADOWS ];",

			"float unpackDepth( const in vec4 rgba_depth ) {",

				"const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );",
				"float depth = dot( rgba_depth, bit_shift );",
				"return depth;",

			"}",

		"#endif"

	].join("\n"),

	shadowmap_fragment: [

		"#ifdef USE_SHADOWMAP",

			"#ifdef SHADOWMAP_SOFT",

				"const float xPixelOffset = 1.0 / SHADOWMAP_WIDTH;",
				"const float yPixelOffset = 1.0 / SHADOWMAP_HEIGHT;",

			"#endif",

			"vec3 shadowColor = vec3( 1.0 );",

			"for( int i = 0; i < MAX_SHADOWS; i ++ ) {",

				"vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;",
				"shadowCoord.z += shadowBias;",

				"if ( shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0 ) {",

					"#ifdef SHADOWMAP_SOFT",

						// Percentage-close filtering
						// (9 pixel kernel)
						// http://fabiensanglard.net/shadowmappingPCF/

						"float shadow = 0.0;",

						"for ( float y = -1.25; y <= 1.25; y += 1.25 )",
							"for ( float x = -1.25; x <= 1.25; x += 1.25 ) {",

								"vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );",

								// doesn't seem to produce any noticeable visual difference compared to simple "texture2D" lookup
								//"vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );",

								"float fDepth = unpackDepth( rgbaDepth );",

								"if ( fDepth < shadowCoord.z )",
									"shadow += 1.0;",

						"}",

						"shadow /= 9.0;",
						"shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness * shadow ) );",

					"#else",

						"vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );",
						"float fDepth = unpackDepth( rgbaDepth );",

						"if ( fDepth < shadowCoord.z )",

							// spot with multiple shadows is darker

							"shadowColor = shadowColor * vec3( shadowDarkness );",

							// spot with multiple shadows has the same color as single shadow spot

							//"shadowColor = min( shadowColor, vec3( shadowDarkness ) );",

					"#endif",

				"}",


				// uncomment to see light frustum boundaries
				//"if ( !( shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0 ) )",
				//	"gl_FragColor.xyz =  gl_FragColor.xyz * vec3( 1.0, 0.0, 0.0 );",

			"}",

			"#ifdef GAMMA_OUTPUT",

				"shadowColor *= shadowColor;",

			"#endif",

			"gl_FragColor.xyz = gl_FragColor.xyz * shadowColor;",

		"#endif"

	].join("\n"),

	shadowmap_pars_vertex: [

		"#ifdef USE_SHADOWMAP",

			"varying vec4 vShadowCoord[ MAX_SHADOWS ];",
			"uniform mat4 shadowMatrix[ MAX_SHADOWS ];",

		"#endif"

	].join("\n"),

	shadowmap_vertex: [

		"#ifdef USE_SHADOWMAP",

			"for( int i = 0; i < MAX_SHADOWS; i ++ ) {",

				"vShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( position, 1.0 );",

			"}",

		"#endif"

	].join("\n"),

	// ALPHATEST

	alphatest_fragment: [

		"#ifdef ALPHATEST",

			"if ( gl_FragColor.a < ALPHATEST ) discard;",

		"#endif"

	].join("\n"),

	// LINEAR SPACE

	linear_to_gamma_fragment: [

		"#ifdef GAMMA_OUTPUT",

			"gl_FragColor.xyz = sqrt( gl_FragColor.xyz );",

		"#endif"

	].join("\n"),


};

THREE.UniformsUtils = {

	merge: function ( uniforms ) {

		var u, p, tmp, merged = {};

		for ( u = 0; u < uniforms.length; u++ ) {

			tmp = this.clone( uniforms[ u ] );

			for ( p in tmp ) {

				merged[ p ] = tmp[ p ];

			}

		}

		return merged;

	},

	clone: function ( uniforms_src ) {

		var u, p, parameter, parameter_src, uniforms_dst = {};

		for ( u in uniforms_src ) {

			uniforms_dst[ u ] = {};

			for ( p in uniforms_src[ u ] ) {

				parameter_src = uniforms_src[ u ][ p ];

				if ( parameter_src instanceof THREE.Color ||
					 parameter_src instanceof THREE.Vector2 ||
					 parameter_src instanceof THREE.Vector3 ||
					 parameter_src instanceof THREE.Vector4 ||
					 parameter_src instanceof THREE.Matrix4 ||
					 parameter_src instanceof THREE.Texture ) {

					uniforms_dst[ u ][ p ] = parameter_src.clone();

				} else if ( parameter_src instanceof Array ) {

					uniforms_dst[ u ][ p ] = parameter_src.slice();

				} else {

					uniforms_dst[ u ][ p ] = parameter_src;

				}

			}

		}

		return uniforms_dst;

	}

};

THREE.UniformsLib = {

	common: {

		"diffuse" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },

		"map" : { type: "t", value: 0, texture: null },
		"offsetRepeat" : { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) },

		"lightMap" : { type: "t", value: 2, texture: null },

		"envMap" : { type: "t", value: 1, texture: null },
		"flipEnvMap" : { type: "f", value: -1 },
		"useRefract" : { type: "i", value: 0 },
		"reflectivity" : { type: "f", value: 1.0 },
		"refractionRatio" : { type: "f", value: 0.98 },
		"combine" : { type: "i", value: 0 },

		"morphTargetInfluences" : { type: "f", value: 0 }

	},

	fog : {

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	lights: {

		"ambientLightColor" : { type: "fv", value: [] },
		"directionalLightDirection" : { type: "fv", value: [] },
		"directionalLightColor" : { type: "fv", value: [] },
		"pointLightColor" : { type: "fv", value: [] },
		"pointLightPosition" : { type: "fv", value: [] },
		"pointLightDistance" : { type: "fv1", value: [] }

	},

	particle: {

		"psColor" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },
		"size" : { type: "f", value: 1.0 },
		"scale" : { type: "f", value: 1.0 },
		"map" : { type: "t", value: 0, texture: null },

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	shadowmap: {

		"shadowMap": { type: "tv", value: 6, texture: [] },
		"shadowMatrix" : { type: "m4v", value: [] },

		"shadowBias" : { type: "f", value: 0.0039 },
		"shadowDarkness": { type: "f", value: 0.2 }

	}

};

THREE.ShaderLib = {

	'sprite': {

		vertexShader: [

			"uniform int useScreenCoordinates;",
			"uniform int affectedByDistance;",
			"uniform vec3 screenPosition;",
			"uniform mat4 modelViewMatrix;",
			"uniform mat4 projectionMatrix;",
			"uniform float rotation;",
			"uniform vec2 scale;",
			"uniform vec2 alignment;",
			"uniform vec2 uvOffset;",
			"uniform vec2 uvScale;",

			"attribute vec2 position;",
			"attribute vec2 uv;",

			"varying vec2 vUV;",

			"void main() {",

				"vUV = uvOffset + uv * uvScale;",

				"vec2 alignedPosition = position + alignment;",

				"vec2 rotatedPosition;",
				"rotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;",
				"rotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;",

				"vec4 finalPosition;",

				"if( useScreenCoordinates != 0 ) {",

					"finalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );",

				"} else {",

					"finalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );",
					"finalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );",

				"}",

				"gl_Position = finalPosition;",

			"}"

		].join( "\n" ),

		fragmentShader: [

			"#ifdef GL_ES",
				"precision highp float;",
			"#endif",

			"uniform vec3 color;",
			"uniform sampler2D map;",
			"uniform float opacity;",

			"varying vec2 vUV;",

			"void main() {",

				"vec4 texture = texture2D( map, vUV );",
				"gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );",

			"}"

		].join( "\n" )

	},

	'depth': {

		uniforms: {

			"mNear": { type: "f", value: 1.0 },
			"mFar" : { type: "f", value: 2000.0 },
			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float mNear;",
			"uniform float mFar;",
			"uniform float opacity;",

			"void main() {",

				"float depth = gl_FragCoord.z / gl_FragCoord.w;",
				"float color = 1.0 - smoothstep( mNear, mFar, depth );",
				"gl_FragColor = vec4( vec3( color ), opacity );",

			"}"

		].join("\n")

	},

	'normal': {

		uniforms: {

			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec3 vNormal;",

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
				"vNormal = normalize( normalMatrix * normal );",

				"gl_Position = projectionMatrix * mvPosition;",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",
			"varying vec3 vNormal;",

			"void main() {",

				"gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );",

			"}"

		].join("\n")

	},

	'basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'lambert': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"ambient"  : { type: "c", value: new THREE.Color( 0x050505 ) }
			}

		] ),

		vertexShader: [

			"varying vec3 vLightWeighting;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_lambert_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				"vec3 transformedNormal = normalize( normalMatrix * normal );",

				THREE.ShaderChunk[ "lights_lambert_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],


			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",

			"varying vec3 vLightWeighting;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( vec3 ( 1.0 ), opacity );",

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],

				"gl_FragColor.xyz = gl_FragColor.xyz * vLightWeighting;",

				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'phong': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"ambient"  : { type: "c", value: new THREE.Color( 0x050505 ) },
				"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
				"shininess": { type: "f", value: 30 }
			}

		] ),

		vertexShader: [

			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "map_vertex" ],
				THREE.ShaderChunk[ "lightmap_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				"#ifndef USE_ENVMAP",

					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",

				"#endif",

				"vViewPosition = -mvPosition.xyz;",

				"vec3 transformedNormal = normalMatrix * normal;",
				"vNormal = transformedNormal;",

				THREE.ShaderChunk[ "lights_phong_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform vec3 ambient;",
			"uniform vec3 specular;",
			"uniform float shininess;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( vec3 ( 1.0 ), opacity );",

				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],

				THREE.ShaderChunk[ "lights_phong_fragment" ],

				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	'particle_basic': {

		uniforms:  THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "particle" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			"uniform float size;",
			"uniform float scale;",

			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				"#ifdef USE_SIZEATTENUATION",
					"gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
				"#else",
					"gl_PointSize = size;",
				"#endif",

				"gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 psColor;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_particle_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

			"void main() {",

				"gl_FragColor = vec4( psColor, opacity );",

				THREE.ShaderChunk[ "map_particle_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"}"

		].join("\n")

	},

	// Depth encoding into RGBA texture
	// 	based on SpiderGL shadow map example
	// 		http://spidergl.org/example.php?id=6
	// 	originally from
	//		http://www.gamedev.net/topic/442138-packing-a-float-into-a-a8r8g8b8-texture-shader/page__whichpage__1%25EF%25BF%25BD
	// 	see also here:
	//		http://aras-p.info/blog/2009/07/30/encoding-floats-to-rgba-the-final/

	'depthRGBA': {

		uniforms: {},

		vertexShader: [

			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

			"void main() {",

				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"vec4 pack_depth( const in float depth ) {",

				"const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );",
				"const vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );",
				"vec4 res = fract( depth * bit_shift );",
				"res -= res.xxyz * bit_mask;",
				"return res;",

			"}",

			"void main() {",

				"gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );",

				//"gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z / gl_FragCoord.w );",
				//"float z = ( ( gl_FragCoord.z / gl_FragCoord.w ) - 3.0 ) / ( 4000.0 - 3.0 );",
				//"gl_FragData[ 0 ] = pack_depth( z );",
				//"gl_FragData[ 0 ] = vec4( z, z, z, 1.0 );",

			"}"

		].join("\n")

	}

};/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.WebGLRenderer = function ( parameters ) {

	// constructor parameters

	var parameters = parameters || {},

	_canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' ),

	_precision = parameters.precision !== undefined ? parameters.precision : 'highp',
	_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
	_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
	_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,

	_clearColor = parameters.clearColor !== undefined ? new THREE.Color( parameters.clearColor ) : new THREE.Color( 0x000000 ),
	_clearAlpha = parameters.clearAlpha !== undefined ? parameters.clearAlpha : 0,

	_maxLights = parameters.maxLights !== undefined ? parameters.maxLights : 4;

	// public properties

	this.domElement = _canvas;
	this.context = null;

	// clearing

	this.autoClear = true;
	this.autoClearColor = true;
	this.autoClearDepth = true;
	this.autoClearStencil = true;

	// scene graph

	this.sortObjects = true;

	this.autoUpdateObjects = true;
	this.autoUpdateScene = true;

	// physically based shading

	this.gammaInput = false;
	this.gammaOutput = false;
	this.physicallyBasedShading = false;

	// shadow map

	this.shadowMapBias = 0.0039;
	this.shadowMapDarkness = 0.5;
	this.shadowMapWidth = 512;
	this.shadowMapHeight = 512;

	this.shadowCameraNear = 1;
	this.shadowCameraFar = 5000;
	this.shadowCameraFov = 50;

	this.shadowMap = [];

	this.shadowMapEnabled = false;
	this.shadowMapAutoUpdate = true;
	this.shadowMapSoft = true;

	// morphs

	this.maxMorphTargets = 8;

	// info

	this.info = {

		memory: {

			programs: 0,
			geometries: 0,
			textures: 0

		},

		render: {

			calls: 0,
			vertices: 0,
			faces: 0

		}

	};

	// internal properties

	var _this = this,

	_gl,

	_programs = [],

	// internal state cache

	_currentProgram = null,
	_currentFramebuffer = null,
	_currentMaterialId = -1,
	_currentGeometryGroupHash = null,
	_geometryGroupCounter = 0,

	// GL state cache

	_oldDoubleSided = null,
	_oldFlipSided = null,
	_oldBlending = null,
	_oldDepthTest = null,
	_oldDepthWrite = null,
	_oldPolygonOffset = null,
	_oldPolygonOffsetFactor = null,
	_oldPolygonOffsetUnits = null,
	_oldLineWidth = null,

	_viewportX = 0,
	_viewportY = 0,
	_viewportWidth = 0,
	_viewportHeight = 0,

	// frustum cache

	_frustum = [
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4()
	 ],

	 // camera matrices cache

	_projScreenMatrix = new THREE.Matrix4(),
	_projectionMatrixArray = new Float32Array( 16 ),
	_viewMatrixArray = new Float32Array( 16 ),

	_vector3 = new THREE.Vector4(),

	// light arrays cache

	_lights = {

		ambient: [ 0, 0, 0 ],
		directional: { length: 0, colors: new Array(), positions: new Array() },
		point: { length: 0, colors: new Array(), positions: new Array(), distances: new Array() }

	};

	// shadow maps

	var _cameraLight, _shadowMatrix = [];
	var _depthMaterial, _depthMaterialMorph;

	// sprites

	var _sprite = {};
	var _spriteAttributesEnabled = false;

	// initialize

	_gl = initGL();

	setDefaultGLState();

	initSprites();
	initShadowmaps();

	this.context = _gl;

	var _supportsVertexTextures = ( maxVertexTextures() > 0 );

	// API

	this.getContext = function () {

		return _gl;

	};

	this.supportsVertexTextures = function () {

		return _supportsVertexTextures;

	};

	this.setSize = function ( width, height ) {

		_canvas.width = width;
		_canvas.height = height;

		this.setViewport( 0, 0, _canvas.width, _canvas.height );

	};

	this.setViewport = function ( x, y, width, height ) {

		_viewportX = x;
		_viewportY = y;

		_viewportWidth = width;
		_viewportHeight = height;

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

	};

	this.setScissor = function ( x, y, width, height ) {

		_gl.scissor( x, y, width, height );

	};

	this.enableScissorTest = function ( enable ) {

		enable ? _gl.enable( _gl.SCISSOR_TEST ) : _gl.disable( _gl.SCISSOR_TEST );

	};

	// Clearing

	this.setClearColorHex = function ( hex, alpha ) {

		_clearColor.setHex( hex );
		_clearAlpha = alpha;

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.setClearColor = function ( color, alpha ) {

		_clearColor.copy( color );
		_clearAlpha = alpha;

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.getClearColor = function () {

		return _clearColor;

	};

	this.getClearAlpha = function () {

		return _clearAlpha;

	};

	this.clear = function ( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

		_gl.clear( bits );

	};

	this.clearTarget = function ( renderTarget, color, depth, stencil ) {

		setRenderTarget( renderTarget );
		this.clear( color, depth, stencil );

	};

	// Deallocation

	this.deallocateObject = function ( object ) {

		if ( ! object.__webglInit ) return;

		object.__webglInit = false;

		delete object._modelViewMatrix;

		delete object._normalMatrixArray;
		delete object._modelViewMatrixArray;
		delete object._objectMatrixArray;

		if ( object instanceof THREE.Mesh ) {

			for ( var g in object.geometry.geometryGroups ) {

				deleteMeshBuffers( object.geometry.geometryGroups[ g ] );

			}

		} else if ( object instanceof THREE.Ribbon ) {

			deleteRibbonBuffers( object.geometry );

		} else if ( object instanceof THREE.Line ) {

			deleteLineBuffers( object.geometry );

		} else if ( object instanceof THREE.ParticleSystem ) {

			deleteParticleBuffers( object.geometry );

		}

	};

	this.deallocateTexture = function ( texture ) {

		if ( ! texture.__webglInit ) return;

		texture.__webglInit = false;
		_gl.deleteTexture( texture.__webglTexture );

		_this.info.memory.textures --;

	};

	// Rendering

	this.updateShadowMap = function ( scene, camera ) {

		renderShadowMap( scene, camera );

	};

	// Internal functions

	// Buffer allocation

	function createParticleBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

		_this.info.geometries ++;

	};

	function createLineBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

		_this.info.memory.geometries ++;

	};

	function createRibbonBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

		_this.info.memory.geometries ++;

	};

	function createMeshBuffers ( geometryGroup ) {

		geometryGroup.__webglVertexBuffer = _gl.createBuffer();
		geometryGroup.__webglNormalBuffer = _gl.createBuffer();
		geometryGroup.__webglTangentBuffer = _gl.createBuffer();
		geometryGroup.__webglColorBuffer = _gl.createBuffer();
		geometryGroup.__webglUVBuffer = _gl.createBuffer();
		geometryGroup.__webglUV2Buffer = _gl.createBuffer();

		geometryGroup.__webglSkinVertexABuffer = _gl.createBuffer();
		geometryGroup.__webglSkinVertexBBuffer = _gl.createBuffer();
		geometryGroup.__webglSkinIndicesBuffer = _gl.createBuffer();
		geometryGroup.__webglSkinWeightsBuffer = _gl.createBuffer();

		geometryGroup.__webglFaceBuffer = _gl.createBuffer();
		geometryGroup.__webglLineBuffer = _gl.createBuffer();

		if ( geometryGroup.numMorphTargets ) {

			var m, ml;

			geometryGroup.__webglMorphTargetsBuffers = [];

			for ( m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

				geometryGroup.__webglMorphTargetsBuffers.push( _gl.createBuffer() );

			}

		}

		_this.info.memory.geometries ++;

	};

	// Buffer deallocation

	function deleteParticleBuffers ( geometry ) {

		_gl.deleteBuffer( geometry.__webglVertexBuffer );
		_gl.deleteBuffer( geometry.__webglColorBuffer );

		_this.info.memory.geometries --;

	};

	function deleteLineBuffers ( geometry ) {

		_gl.deleteBuffer( geometry.__webglVertexBuffer );
		_gl.deleteBuffer( geometry.__webglColorBuffer );

		_this.info.memory.geometries --;

	};

	function deleteRibbonBuffers ( geometry ) {

		_gl.deleteBuffer( geometry.__webglVertexBuffer );
		_gl.deleteBuffer( geometry.__webglColorBuffer );

		_this.info.memory.geometries --;

	};

	function deleteMeshBuffers ( geometryGroup ) {

		_gl.deleteBuffer( geometryGroup.__webglVertexBuffer );
		_gl.deleteBuffer( geometryGroup.__webglNormalBuffer );
		_gl.deleteBuffer( geometryGroup.__webglTangentBuffer );
		_gl.deleteBuffer( geometryGroup.__webglColorBuffer );
		_gl.deleteBuffer( geometryGroup.__webglUVBuffer );
		_gl.deleteBuffer( geometryGroup.__webglUV2Buffer );

		_gl.deleteBuffer( geometryGroup.__webglSkinVertexABuffer );
		_gl.deleteBuffer( geometryGroup.__webglSkinVertexBBuffer );
		_gl.deleteBuffer( geometryGroup.__webglSkinIndicesBuffer );
		_gl.deleteBuffer( geometryGroup.__webglSkinWeightsBuffer );

		_gl.deleteBuffer( geometryGroup.__webglFaceBuffer );
		_gl.deleteBuffer( geometryGroup.__webglLineBuffer );

		if ( geometryGroup.numMorphTargets ) {

			for ( var m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

				_gl.deleteBuffer( geometryGroup.__webglMorphTargetsBuffers[ m ] );

			}

		}


		if ( geometryGroup.__webglCustomAttributesList ) {

			for ( var id in geometryGroup.__webglCustomAttributesList ) {

				_gl.deleteBuffer( geometryGroup.__webglCustomAttributesList[ id ].buffer );

			}

		}

		_this.info.memory.geometries --;

	};

	// Buffer initialization

	function initCustomAttributes ( geometry, object ) {

		var nvertices = geometry.vertices.length;

		var material = object.material;

		if ( material.attributes ) {

			if ( geometry.__webglCustomAttributesList === undefined ) {

				geometry.__webglCustomAttributesList = [];

			}

			for ( var a in material.attributes ) {

				var attribute = material.attributes[ a ];

				if( !attribute.__webglInitialized || attribute.createUniqueBuffers ) {

					attribute.__webglInitialized = true;

					var size = 1;		// "f" and "i"

					if ( attribute.type === "v2" ) size = 2;
					else if ( attribute.type === "v3" ) size = 3;
					else if ( attribute.type === "v4" ) size = 4;
					else if ( attribute.type === "c"  ) size = 3;

					attribute.size = size;

					attribute.array = new Float32Array( nvertices * size );

					attribute.buffer = _gl.createBuffer();
					attribute.buffer.belongsToAttribute = a;

					attribute.needsUpdate = true;

				}

				geometry.__webglCustomAttributesList.push( attribute );

			}

		}

	};

	function initParticleBuffers ( geometry, object ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__sortArray = [];

		geometry.__webglParticleCount = nvertices;

		initCustomAttributes ( geometry, object );

	};

	function initLineBuffers ( geometry, object ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__webglLineCount = nvertices;

		initCustomAttributes ( geometry, object );

	};

	function initRibbonBuffers ( geometry ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__webglVertexCount = nvertices;

	};

	function initMeshBuffers ( geometryGroup, object ) {

		var geometry = object.geometry,
			faces3 = geometryGroup.faces3,
			faces4 = geometryGroup.faces4,

			nvertices = faces3.length * 3 + faces4.length * 4,
			ntris     = faces3.length * 1 + faces4.length * 2,
			nlines    = faces3.length * 3 + faces4.length * 4,

			material = getBufferMaterial( object, geometryGroup ),

			uvType = bufferGuessUVType( material ),
			normalType = bufferGuessNormalType( material ),
			vertexColorType = bufferGuessVertexColorType( material );

		//console.log( "uvType", uvType, "normalType", normalType, "vertexColorType", vertexColorType, object, geometryGroup, material );

		geometryGroup.__vertexArray = new Float32Array( nvertices * 3 );

		if ( normalType ) {

			geometryGroup.__normalArray = new Float32Array( nvertices * 3 );

		}

		if ( geometry.hasTangents ) {

			geometryGroup.__tangentArray = new Float32Array( nvertices * 4 );

		}

		if ( vertexColorType ) {

			geometryGroup.__colorArray = new Float32Array( nvertices * 3 );

		}

		if ( uvType ) {

			if ( geometry.faceUvs.length > 0 || geometry.faceVertexUvs.length > 0 ) {

				geometryGroup.__uvArray = new Float32Array( nvertices * 2 );

			}

			if ( geometry.faceUvs.length > 1 || geometry.faceVertexUvs.length > 1 ) {

				geometryGroup.__uv2Array = new Float32Array( nvertices * 2 );

			}

		}

		if ( object.geometry.skinWeights.length && object.geometry.skinIndices.length ) {

			geometryGroup.__skinVertexAArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinVertexBArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinIndexArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinWeightArray = new Float32Array( nvertices * 4 );

		}

		geometryGroup.__faceArray = new Uint16Array( ntris * 3 );
		geometryGroup.__lineArray = new Uint16Array( nlines * 2 );

		if ( geometryGroup.numMorphTargets ) {

			geometryGroup.__morphTargetsArrays = [];

			for ( var m = 0, ml = geometryGroup.numMorphTargets; m < ml; m ++ ) {

				geometryGroup.__morphTargetsArrays.push( new Float32Array( nvertices * 3 ) );

			}

		}

		geometryGroup.__webglFaceCount = ntris * 3;
		geometryGroup.__webglLineCount = nlines * 2;


		// custom attributes

		if ( material.attributes ) {

			if ( geometryGroup.__webglCustomAttributesList === undefined ) {

				geometryGroup.__webglCustomAttributesList = [];

			}

			for ( var a in material.attributes ) {

				// Do a shallow copy of the attribute object so different geometryGroup chunks use different
				// attribute buffers which are correctly indexed in the setMeshBuffers function

				var originalAttribute = material.attributes[ a ];

				var attribute = {};

				for ( var property in originalAttribute ) {

					attribute[ property ] = originalAttribute[ property ];

				}

				if( !attribute.__webglInitialized || attribute.createUniqueBuffers ) {

					attribute.__webglInitialized = true;

					var size = 1;		// "f" and "i"

					if( attribute.type === "v2" ) size = 2;
					else if( attribute.type === "v3" ) size = 3;
					else if( attribute.type === "v4" ) size = 4;
					else if( attribute.type === "c"  ) size = 3;

					attribute.size = size;

					attribute.array = new Float32Array( nvertices * size );

					attribute.buffer = _gl.createBuffer();
					attribute.buffer.belongsToAttribute = a;

					originalAttribute.needsUpdate = true;
					attribute.__original = originalAttribute;

				}

				geometryGroup.__webglCustomAttributesList.push( attribute );

			}

		}

		geometryGroup.__inittedArrays = true;

	};

	function getBufferMaterial( object, geometryGroup ) {

		if ( object.material && ! ( object.material instanceof THREE.MeshFaceMaterial ) ) {

			return object.material;

		} else if ( geometryGroup.materialIndex >= 0 ) {

			return object.geometry.materials[ geometryGroup.materialIndex ];

		}

	};

	function materialNeedsSmoothNormals ( material ) {

		return material && material.shading !== undefined && material.shading === THREE.SmoothShading;

	};

	function bufferGuessNormalType ( material ) {

		// only MeshBasicMaterial and MeshDepthMaterial don't need normals

		if ( ( material instanceof THREE.MeshBasicMaterial && !material.envMap ) || material instanceof THREE.MeshDepthMaterial ) {

			return false;

		}

		if ( materialNeedsSmoothNormals( material ) ) {

			return THREE.SmoothShading;

		} else {

			return THREE.FlatShading;

		}

	};

	function bufferGuessVertexColorType ( material ) {

		if ( material.vertexColors ) {

			return material.vertexColors;

		}

		return false;

	};

	function bufferGuessUVType ( material ) {

		// material must use some texture to require uvs

		if ( material.map || material.lightMap || material instanceof THREE.ShaderMaterial ) {

			return true;

		}

		return false;

	};

	// Buffer setting

	function setParticleBuffers ( geometry, hint, object ) {

		var v, c, vertex, offset, index, color,

		vertices = geometry.vertices,
		vl = vertices.length,

		colors = geometry.colors,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		sortArray = geometry.__sortArray,

		dirtyVertices = geometry.__dirtyVertices,
		dirtyElements = geometry.__dirtyElements,
		dirtyColors = geometry.__dirtyColors,

		customAttributes = geometry.__webglCustomAttributesList,
		i, il,
		a, ca, cal, value,
		customAttribute;

		if ( object.sortParticles ) {

			_projScreenMatrix.multiplySelf( object.matrixWorld );

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ v ].position;

				_vector3.copy( vertex );
				_projScreenMatrix.multiplyVector3( _vector3 );

				sortArray[ v ] = [ _vector3.z, v ];

			}

			sortArray.sort( function( a, b ) { return b[ 0 ] - a[ 0 ]; } );

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ sortArray[v][1] ].position;

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			for ( c = 0; c < cl; c ++ ) {

				offset = c * 3;

				color = colors[ sortArray[c][1] ];

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			if ( customAttributes ) {

				for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

					customAttribute = customAttributes[ i ];

					if ( ! ( customAttribute.boundTo === undefined || customAttribute.boundTo === "vertices" ) ) continue;

					offset = 0;

					cal = customAttribute.value.length;

					if ( customAttribute.size === 1 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							customAttribute.array[ ca ] = customAttribute.value[ index ];

						}

					} else if ( customAttribute.size === 2 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							value = customAttribute.value[ index ];

							customAttribute.array[ offset ] 	= value.x;
							customAttribute.array[ offset + 1 ] = value.y;

							offset += 2;

						}

					} else if ( customAttribute.size === 3 ) {

						if ( customAttribute.type === "c" ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								index = sortArray[ ca ][ 1 ];

								value = customAttribute.value[ index ];

								customAttribute.array[ offset ]     = value.r;
								customAttribute.array[ offset + 1 ] = value.g;
								customAttribute.array[ offset + 2 ] = value.b;

								offset += 3;

							}

						} else {

							for ( ca = 0; ca < cal; ca ++ ) {

								index = sortArray[ ca ][ 1 ];

								value = customAttribute.value[ index ];

								customAttribute.array[ offset ] 	= value.x;
								customAttribute.array[ offset + 1 ] = value.y;
								customAttribute.array[ offset + 2 ] = value.z;

								offset += 3;

							}

						}

					} else if ( customAttribute.size === 4 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							index = sortArray[ ca ][ 1 ];

							value = customAttribute.value[ index ];

							customAttribute.array[ offset ]      = value.x;
							customAttribute.array[ offset + 1  ] = value.y;
							customAttribute.array[ offset + 2  ] = value.z;
							customAttribute.array[ offset + 3  ] = value.w;

							offset += 4;

						}

					}

				}

			}

		} else {

			if ( dirtyVertices ) {

				for ( v = 0; v < vl; v ++ ) {

					vertex = vertices[ v ].position;

					offset = v * 3;

					vertexArray[ offset ]     = vertex.x;
					vertexArray[ offset + 1 ] = vertex.y;
					vertexArray[ offset + 2 ] = vertex.z;

				}

			}

			if ( dirtyColors ) {

				for ( c = 0; c < cl; c ++ ) {

					color = colors[ c ];

					offset = c * 3;

					colorArray[ offset ]     = color.r;
					colorArray[ offset + 1 ] = color.g;
					colorArray[ offset + 2 ] = color.b;

				}

			}

			if ( customAttributes ) {

				for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

					customAttribute = customAttributes[ i ];

					if ( customAttribute.needsUpdate &&
					     ( customAttribute.boundTo === undefined ||
						   customAttribute.boundTo === "vertices") ) {

						cal = customAttribute.value.length;

						offset = 0;

						if ( customAttribute.size === 1 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								customAttribute.array[ ca ] = customAttribute.value[ ca ];

							}

						} else if ( customAttribute.size === 2 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ] 	= value.x;
								customAttribute.array[ offset + 1 ] = value.y;

								offset += 2;

							}

						} else if ( customAttribute.size === 3 ) {

							if ( customAttribute.type === "c" ) {

								for ( ca = 0; ca < cal; ca ++ ) {

									value = customAttribute.value[ ca ];

									customAttribute.array[ offset ] 	= value.r;
									customAttribute.array[ offset + 1 ] = value.g;
									customAttribute.array[ offset + 2 ] = value.b;

									offset += 3;

								}

							} else {

								for ( ca = 0; ca < cal; ca ++ ) {

									value = customAttribute.value[ ca ];

									customAttribute.array[ offset ] 	= value.x;
									customAttribute.array[ offset + 1 ] = value.y;
									customAttribute.array[ offset + 2 ] = value.z;

									offset += 3;

								}

							}

						} else if ( customAttribute.size === 4 ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ]      = value.x;
								customAttribute.array[ offset + 1  ] = value.y;
								customAttribute.array[ offset + 2  ] = value.z;
								customAttribute.array[ offset + 3  ] = value.w;

								offset += 4;

							}

						}

					}

				}

			}

		}

		if ( dirtyVertices || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( customAttribute.needsUpdate || object.sortParticles ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
					_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

				}

			}

		}


	};

	function setLineBuffers ( geometry, hint ) {

		var v, c, vertex, offset, color,

		vertices = geometry.vertices,
		colors = geometry.colors,
		vl = vertices.length,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		dirtyVertices = geometry.__dirtyVertices,
		dirtyColors = geometry.__dirtyColors,

		customAttributes = geometry.__webglCustomAttributesList,

		i, il,
		a, ca, cal, value,
		customAttribute;

		if ( dirtyVertices ) {

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ v ].position;

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors ) {

			for ( c = 0; c < cl; c ++ ) {

				color = colors[ c ];

				offset = c * 3;

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( customAttribute.needsUpdate &&
					 ( customAttribute.boundTo === undefined ||
					   customAttribute.boundTo === "vertices" ) ) {

					offset = 0;

					cal = customAttribute.value.length;

					if ( customAttribute.size === 1 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							customAttribute.array[ ca ] = customAttribute.value[ ca ];

						}

					} else if ( customAttribute.size === 2 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							value = customAttribute.value[ ca ];

							customAttribute.array[ offset ] 	= value.x;
							customAttribute.array[ offset + 1 ] = value.y;

							offset += 2;

						}

					} else if ( customAttribute.size === 3 ) {

						if ( customAttribute.type === "c" ) {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ] 	= value.r;
								customAttribute.array[ offset + 1 ] = value.g;
								customAttribute.array[ offset + 2 ] = value.b;

								offset += 3;

							}

						} else {

							for ( ca = 0; ca < cal; ca ++ ) {

								value = customAttribute.value[ ca ];

								customAttribute.array[ offset ] 	= value.x;
								customAttribute.array[ offset + 1 ] = value.y;
								customAttribute.array[ offset + 2 ] = value.z;

								offset += 3;

							}

						}

					} else if ( customAttribute.size === 4 ) {

						for ( ca = 0; ca < cal; ca ++ ) {

							value = customAttribute.value[ ca ];

							customAttribute.array[ offset ] 	 = value.x;
							customAttribute.array[ offset + 1  ] = value.y;
							customAttribute.array[ offset + 2  ] = value.z;
							customAttribute.array[ offset + 3  ] = value.w;

							offset += 4;

						}

					}

					_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
					_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

				}

			}

		}

	};

	function setRibbonBuffers ( geometry, hint ) {

		var v, c, vertex, offset, color,

		vertices = geometry.vertices,
		colors = geometry.colors,
		vl = vertices.length,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		dirtyVertices = geometry.__dirtyVertices,
		dirtyColors = geometry.__dirtyColors;

		if ( dirtyVertices ) {

			for ( v = 0; v < vl; v ++ ) {

				vertex = vertices[ v ].position;

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors ) {

			for ( c = 0; c < cl; c ++ ) {

				color = colors[ c ];

				offset = c * 3;

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

	};

	function setMeshBuffers( geometryGroup, object, hint, dispose, material ) {

		if ( ! geometryGroup.__inittedArrays ) {

			// console.log( object );
			return;

		}

		var normalType = bufferGuessNormalType( material ),
		vertexColorType = bufferGuessVertexColorType( material ),
		uvType = bufferGuessUVType( material ),

		needsSmoothNormals = ( normalType === THREE.SmoothShading );

		var f, fl, fi, face,
		vertexNormals, faceNormal, normal,
		vertexColors, faceColor,
		vertexTangents,
		uv, uv2, v1, v2, v3, v4, t1, t2, t3, t4,
		c1, c2, c3, c4,
		sw1, sw2, sw3, sw4,
		si1, si2, si3, si4,
		sa1, sa2, sa3, sa4,
		sb1, sb2, sb3, sb4,
		m, ml, i, il,
		vn, uvi, uv2i,
		vk, vkl, vka,
		a,

		vertexIndex = 0,

		offset = 0,
		offset_uv = 0,
		offset_uv2 = 0,
		offset_face = 0,
		offset_normal = 0,
		offset_tangent = 0,
		offset_line = 0,
		offset_color = 0,
		offset_skin = 0,
		offset_morphTarget = 0,
		offset_custom = 0,
		offset_customSrc = 0,

		value,

		vertexArray = geometryGroup.__vertexArray,
		uvArray = geometryGroup.__uvArray,
		uv2Array = geometryGroup.__uv2Array,
		normalArray = geometryGroup.__normalArray,
		tangentArray = geometryGroup.__tangentArray,
		colorArray = geometryGroup.__colorArray,

		skinVertexAArray = geometryGroup.__skinVertexAArray,
		skinVertexBArray = geometryGroup.__skinVertexBArray,
		skinIndexArray = geometryGroup.__skinIndexArray,
		skinWeightArray = geometryGroup.__skinWeightArray,

		morphTargetsArrays = geometryGroup.__morphTargetsArrays,

		customAttributes = geometryGroup.__webglCustomAttributesList,
		customAttribute,

		faceArray = geometryGroup.__faceArray,
		lineArray = geometryGroup.__lineArray,

		geometry = object.geometry, // this is shared for all chunks

		dirtyVertices = geometry.__dirtyVertices,
		dirtyElements = geometry.__dirtyElements,
		dirtyUvs = geometry.__dirtyUvs,
		dirtyNormals = geometry.__dirtyNormals,
		dirtyTangents = geometry.__dirtyTangents,
		dirtyColors = geometry.__dirtyColors,
		dirtyMorphTargets = geometry.__dirtyMorphTargets,

		vertices = geometry.vertices,
		chunk_faces3 = geometryGroup.faces3,
		chunk_faces4 = geometryGroup.faces4,
		obj_faces = geometry.faces,

		obj_uvs  = geometry.faceVertexUvs[ 0 ],
		obj_uvs2 = geometry.faceVertexUvs[ 1 ],

		obj_colors = geometry.colors,

		obj_skinVerticesA = geometry.skinVerticesA,
		obj_skinVerticesB = geometry.skinVerticesB,
		obj_skinIndices = geometry.skinIndices,
		obj_skinWeights = geometry.skinWeights,

		morphTargets = geometry.morphTargets;

		if ( dirtyVertices ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ] ];

				v1 = vertices[ face.a ].position;
				v2 = vertices[ face.b ].position;
				v3 = vertices[ face.c ].position;

				vertexArray[ offset ]     = v1.x;
				vertexArray[ offset + 1 ] = v1.y;
				vertexArray[ offset + 2 ] = v1.z;

				vertexArray[ offset + 3 ] = v2.x;
				vertexArray[ offset + 4 ] = v2.y;
				vertexArray[ offset + 5 ] = v2.z;

				vertexArray[ offset + 6 ] = v3.x;
				vertexArray[ offset + 7 ] = v3.y;
				vertexArray[ offset + 8 ] = v3.z;

				offset += 9;

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces4[ f ] ];

				v1 = vertices[ face.a ].position;
				v2 = vertices[ face.b ].position;
				v3 = vertices[ face.c ].position;
				v4 = vertices[ face.d ].position;

				vertexArray[ offset ]     = v1.x;
				vertexArray[ offset + 1 ] = v1.y;
				vertexArray[ offset + 2 ] = v1.z;

				vertexArray[ offset + 3 ] = v2.x;
				vertexArray[ offset + 4 ] = v2.y;
				vertexArray[ offset + 5 ] = v2.z;

				vertexArray[ offset + 6 ] = v3.x;
				vertexArray[ offset + 7 ] = v3.y;
				vertexArray[ offset + 8 ] = v3.z;

				vertexArray[ offset + 9 ]  = v4.x;
				vertexArray[ offset + 10 ] = v4.y;
				vertexArray[ offset + 11 ] = v4.z;

				offset += 12;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyMorphTargets ) {

			for ( vk = 0, vkl = morphTargets.length; vk < vkl; vk ++ ) {

				offset_morphTarget = 0;

				for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

					face = obj_faces[ chunk_faces3[ f ]	];

					v1 = morphTargets[ vk ].vertices[ face.a ].position;
					v2 = morphTargets[ vk ].vertices[ face.b ].position;
					v3 = morphTargets[ vk ].vertices[ face.c ].position;

					vka = morphTargetsArrays[ vk ];

					vka[ offset_morphTarget ] 	  = v1.x;
					vka[ offset_morphTarget + 1 ] = v1.y;
					vka[ offset_morphTarget + 2 ] = v1.z;

					vka[ offset_morphTarget + 3 ] = v2.x;
					vka[ offset_morphTarget + 4 ] = v2.y;
					vka[ offset_morphTarget + 5 ] = v2.z;

					vka[ offset_morphTarget + 6 ] = v3.x;
					vka[ offset_morphTarget + 7 ] = v3.y;
					vka[ offset_morphTarget + 8 ] = v3.z;

					offset_morphTarget += 9;

				}

				for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

					face = obj_faces[ chunk_faces4[ f ] ];

					v1 = morphTargets[ vk ].vertices[ face.a ].position;
					v2 = morphTargets[ vk ].vertices[ face.b ].position;
					v3 = morphTargets[ vk ].vertices[ face.c ].position;
					v4 = morphTargets[ vk ].vertices[ face.d ].position;

					vka = morphTargetsArrays[ vk ];

					vka[ offset_morphTarget ] 	  = v1.x;
					vka[ offset_morphTarget + 1 ] = v1.y;
					vka[ offset_morphTarget + 2 ] = v1.z;

					vka[ offset_morphTarget + 3 ] = v2.x;
					vka[ offset_morphTarget + 4 ] = v2.y;
					vka[ offset_morphTarget + 5 ] = v2.z;

					vka[ offset_morphTarget + 6 ] = v3.x;
					vka[ offset_morphTarget + 7 ] = v3.y;
					vka[ offset_morphTarget + 8 ] = v3.z;

					vka[ offset_morphTarget + 9 ]  = v4.x;
					vka[ offset_morphTarget + 10 ] = v4.y;
					vka[ offset_morphTarget + 11 ] = v4.z;

					offset_morphTarget += 12;

				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ vk ] );
				_gl.bufferData( _gl.ARRAY_BUFFER, morphTargetsArrays[ vk ], hint );

			}

		}

		if ( obj_skinWeights.length ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ]	];

				// weights

				sw1 = obj_skinWeights[ face.a ];
				sw2 = obj_skinWeights[ face.b ];
				sw3 = obj_skinWeights[ face.c ];

				skinWeightArray[ offset_skin ]     = sw1.x;
				skinWeightArray[ offset_skin + 1 ] = sw1.y;
				skinWeightArray[ offset_skin + 2 ] = sw1.z;
				skinWeightArray[ offset_skin + 3 ] = sw1.w;

				skinWeightArray[ offset_skin + 4 ] = sw2.x;
				skinWeightArray[ offset_skin + 5 ] = sw2.y;
				skinWeightArray[ offset_skin + 6 ] = sw2.z;
				skinWeightArray[ offset_skin + 7 ] = sw2.w;

				skinWeightArray[ offset_skin + 8 ]  = sw3.x;
				skinWeightArray[ offset_skin + 9 ]  = sw3.y;
				skinWeightArray[ offset_skin + 10 ] = sw3.z;
				skinWeightArray[ offset_skin + 11 ] = sw3.w;

				// indices

				si1 = obj_skinIndices[ face.a ];
				si2 = obj_skinIndices[ face.b ];
				si3 = obj_skinIndices[ face.c ];

				skinIndexArray[ offset_skin ]     = si1.x;
				skinIndexArray[ offset_skin + 1 ] = si1.y;
				skinIndexArray[ offset_skin + 2 ] = si1.z;
				skinIndexArray[ offset_skin + 3 ] = si1.w;

				skinIndexArray[ offset_skin + 4 ] = si2.x;
				skinIndexArray[ offset_skin + 5 ] = si2.y;
				skinIndexArray[ offset_skin + 6 ] = si2.z;
				skinIndexArray[ offset_skin + 7 ] = si2.w;

				skinIndexArray[ offset_skin + 8 ]  = si3.x;
				skinIndexArray[ offset_skin + 9 ]  = si3.y;
				skinIndexArray[ offset_skin + 10 ] = si3.z;
				skinIndexArray[ offset_skin + 11 ] = si3.w;

				// vertices A

				sa1 = obj_skinVerticesA[ face.a ];
				sa2 = obj_skinVerticesA[ face.b ];
				sa3 = obj_skinVerticesA[ face.c ];

				skinVertexAArray[ offset_skin ]     = sa1.x;
				skinVertexAArray[ offset_skin + 1 ] = sa1.y;
				skinVertexAArray[ offset_skin + 2 ] = sa1.z;
				skinVertexAArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

				skinVertexAArray[ offset_skin + 4 ] = sa2.x;
				skinVertexAArray[ offset_skin + 5 ] = sa2.y;
				skinVertexAArray[ offset_skin + 6 ] = sa2.z;
				skinVertexAArray[ offset_skin + 7 ] = 1;

				skinVertexAArray[ offset_skin + 8 ]  = sa3.x;
				skinVertexAArray[ offset_skin + 9 ]  = sa3.y;
				skinVertexAArray[ offset_skin + 10 ] = sa3.z;
				skinVertexAArray[ offset_skin + 11 ] = 1;

				// vertices B

				sb1 = obj_skinVerticesB[ face.a ];
				sb2 = obj_skinVerticesB[ face.b ];
				sb3 = obj_skinVerticesB[ face.c ];

				skinVertexBArray[ offset_skin ]     = sb1.x;
				skinVertexBArray[ offset_skin + 1 ] = sb1.y;
				skinVertexBArray[ offset_skin + 2 ] = sb1.z;
				skinVertexBArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

				skinVertexBArray[ offset_skin + 4 ] = sb2.x;
				skinVertexBArray[ offset_skin + 5 ] = sb2.y;
				skinVertexBArray[ offset_skin + 6 ] = sb2.z;
				skinVertexBArray[ offset_skin + 7 ] = 1;

				skinVertexBArray[ offset_skin + 8 ]  = sb3.x;
				skinVertexBArray[ offset_skin + 9 ]  = sb3.y;
				skinVertexBArray[ offset_skin + 10 ] = sb3.z;
				skinVertexBArray[ offset_skin + 11 ] = 1;

				offset_skin += 12;

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces4[ f ] ];

				// weights

				sw1 = obj_skinWeights[ face.a ];
				sw2 = obj_skinWeights[ face.b ];
				sw3 = obj_skinWeights[ face.c ];
				sw4 = obj_skinWeights[ face.d ];

				skinWeightArray[ offset_skin ]     = sw1.x;
				skinWeightArray[ offset_skin + 1 ] = sw1.y;
				skinWeightArray[ offset_skin + 2 ] = sw1.z;
				skinWeightArray[ offset_skin + 3 ] = sw1.w;

				skinWeightArray[ offset_skin + 4 ] = sw2.x;
				skinWeightArray[ offset_skin + 5 ] = sw2.y;
				skinWeightArray[ offset_skin + 6 ] = sw2.z;
				skinWeightArray[ offset_skin + 7 ] = sw2.w;

				skinWeightArray[ offset_skin + 8 ]  = sw3.x;
				skinWeightArray[ offset_skin + 9 ]  = sw3.y;
				skinWeightArray[ offset_skin + 10 ] = sw3.z;
				skinWeightArray[ offset_skin + 11 ] = sw3.w;

				skinWeightArray[ offset_skin + 12 ] = sw4.x;
				skinWeightArray[ offset_skin + 13 ] = sw4.y;
				skinWeightArray[ offset_skin + 14 ] = sw4.z;
				skinWeightArray[ offset_skin + 15 ] = sw4.w;

				// indices

				si1 = obj_skinIndices[ face.a ];
				si2 = obj_skinIndices[ face.b ];
				si3 = obj_skinIndices[ face.c ];
				si4 = obj_skinIndices[ face.d ];

				skinIndexArray[ offset_skin ]     = si1.x;
				skinIndexArray[ offset_skin + 1 ] = si1.y;
				skinIndexArray[ offset_skin + 2 ] = si1.z;
				skinIndexArray[ offset_skin + 3 ] = si1.w;

				skinIndexArray[ offset_skin + 4 ] = si2.x;
				skinIndexArray[ offset_skin + 5 ] = si2.y;
				skinIndexArray[ offset_skin + 6 ] = si2.z;
				skinIndexArray[ offset_skin + 7 ] = si2.w;

				skinIndexArray[ offset_skin + 8 ]  = si3.x;
				skinIndexArray[ offset_skin + 9 ]  = si3.y;
				skinIndexArray[ offset_skin + 10 ] = si3.z;
				skinIndexArray[ offset_skin + 11 ] = si3.w;

				skinIndexArray[ offset_skin + 12 ] = si4.x;
				skinIndexArray[ offset_skin + 13 ] = si4.y;
				skinIndexArray[ offset_skin + 14 ] = si4.z;
				skinIndexArray[ offset_skin + 15 ] = si4.w;

				// vertices A

				sa1 = obj_skinVerticesA[ face.a ];
				sa2 = obj_skinVerticesA[ face.b ];
				sa3 = obj_skinVerticesA[ face.c ];
				sa4 = obj_skinVerticesA[ face.d ];

				skinVertexAArray[ offset_skin ]     = sa1.x;
				skinVertexAArray[ offset_skin + 1 ] = sa1.y;
				skinVertexAArray[ offset_skin + 2 ] = sa1.z;
				skinVertexAArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

				skinVertexAArray[ offset_skin + 4 ] = sa2.x;
				skinVertexAArray[ offset_skin + 5 ] = sa2.y;
				skinVertexAArray[ offset_skin + 6 ] = sa2.z;
				skinVertexAArray[ offset_skin + 7 ] = 1;

				skinVertexAArray[ offset_skin + 8 ]  = sa3.x;
				skinVertexAArray[ offset_skin + 9 ]  = sa3.y;
				skinVertexAArray[ offset_skin + 10 ] = sa3.z;
				skinVertexAArray[ offset_skin + 11 ] = 1;

				skinVertexAArray[ offset_skin + 12 ] = sa4.x;
				skinVertexAArray[ offset_skin + 13 ] = sa4.y;
				skinVertexAArray[ offset_skin + 14 ] = sa4.z;
				skinVertexAArray[ offset_skin + 15 ] = 1;

				// vertices B

				sb1 = obj_skinVerticesB[ face.a ];
				sb2 = obj_skinVerticesB[ face.b ];
				sb3 = obj_skinVerticesB[ face.c ];
				sb4 = obj_skinVerticesB[ face.d ];

				skinVertexBArray[ offset_skin ]     = sb1.x;
				skinVertexBArray[ offset_skin + 1 ] = sb1.y;
				skinVertexBArray[ offset_skin + 2 ] = sb1.z;
				skinVertexBArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

				skinVertexBArray[ offset_skin + 4 ] = sb2.x;
				skinVertexBArray[ offset_skin + 5 ] = sb2.y;
				skinVertexBArray[ offset_skin + 6 ] = sb2.z;
				skinVertexBArray[ offset_skin + 7 ] = 1;

				skinVertexBArray[ offset_skin + 8 ]  = sb3.x;
				skinVertexBArray[ offset_skin + 9 ]  = sb3.y;
				skinVertexBArray[ offset_skin + 10 ] = sb3.z;
				skinVertexBArray[ offset_skin + 11 ] = 1;

				skinVertexBArray[ offset_skin + 12 ] = sb4.x;
				skinVertexBArray[ offset_skin + 13 ] = sb4.y;
				skinVertexBArray[ offset_skin + 14 ] = sb4.z;
				skinVertexBArray[ offset_skin + 15 ] = 1;

				offset_skin += 16;

			}

			if ( offset_skin > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexABuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinVertexAArray, hint );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexBBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinVertexBArray, hint );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinIndexArray, hint );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, skinWeightArray, hint );

			}

		}

		if ( dirtyColors && vertexColorType ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ]	];

				vertexColors = face.vertexColors;
				faceColor = face.color;

				if ( vertexColors.length === 3 && vertexColorType === THREE.VertexColors ) {

					c1 = vertexColors[ 0 ];
					c2 = vertexColors[ 1 ];
					c3 = vertexColors[ 2 ];

				} else {

					c1 = faceColor;
					c2 = faceColor;
					c3 = faceColor;

				}

				colorArray[ offset_color ]     = c1.r;
				colorArray[ offset_color + 1 ] = c1.g;
				colorArray[ offset_color + 2 ] = c1.b;

				colorArray[ offset_color + 3 ] = c2.r;
				colorArray[ offset_color + 4 ] = c2.g;
				colorArray[ offset_color + 5 ] = c2.b;

				colorArray[ offset_color + 6 ] = c3.r;
				colorArray[ offset_color + 7 ] = c3.g;
				colorArray[ offset_color + 8 ] = c3.b;

				offset_color += 9;

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces4[ f ] ];

				vertexColors = face.vertexColors;
				faceColor = face.color;

				if ( vertexColors.length === 4 && vertexColorType === THREE.VertexColors ) {

					c1 = vertexColors[ 0 ];
					c2 = vertexColors[ 1 ];
					c3 = vertexColors[ 2 ];
					c4 = vertexColors[ 3 ];

				} else {

					c1 = faceColor;
					c2 = faceColor;
					c3 = faceColor;
					c4 = faceColor;

				}

				colorArray[ offset_color ]     = c1.r;
				colorArray[ offset_color + 1 ] = c1.g;
				colorArray[ offset_color + 2 ] = c1.b;

				colorArray[ offset_color + 3 ] = c2.r;
				colorArray[ offset_color + 4 ] = c2.g;
				colorArray[ offset_color + 5 ] = c2.b;

				colorArray[ offset_color + 6 ] = c3.r;
				colorArray[ offset_color + 7 ] = c3.g;
				colorArray[ offset_color + 8 ] = c3.b;

				colorArray[ offset_color + 9 ]  = c4.r;
				colorArray[ offset_color + 10 ] = c4.g;
				colorArray[ offset_color + 11 ] = c4.b;

				offset_color += 12;

			}

			if ( offset_color > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

			}

		}

		if ( dirtyTangents && geometry.hasTangents ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ]	];

				vertexTangents = face.vertexTangents;

				t1 = vertexTangents[ 0 ];
				t2 = vertexTangents[ 1 ];
				t3 = vertexTangents[ 2 ];

				tangentArray[ offset_tangent ]     = t1.x;
				tangentArray[ offset_tangent + 1 ] = t1.y;
				tangentArray[ offset_tangent + 2 ] = t1.z;
				tangentArray[ offset_tangent + 3 ] = t1.w;

				tangentArray[ offset_tangent + 4 ] = t2.x;
				tangentArray[ offset_tangent + 5 ] = t2.y;
				tangentArray[ offset_tangent + 6 ] = t2.z;
				tangentArray[ offset_tangent + 7 ] = t2.w;

				tangentArray[ offset_tangent + 8 ]  = t3.x;
				tangentArray[ offset_tangent + 9 ]  = t3.y;
				tangentArray[ offset_tangent + 10 ] = t3.z;
				tangentArray[ offset_tangent + 11 ] = t3.w;

				offset_tangent += 12;

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces4[ f ] ];

				vertexTangents = face.vertexTangents;

				t1 = vertexTangents[ 0 ];
				t2 = vertexTangents[ 1 ];
				t3 = vertexTangents[ 2 ];
				t4 = vertexTangents[ 3 ];

				tangentArray[ offset_tangent ]     = t1.x;
				tangentArray[ offset_tangent + 1 ] = t1.y;
				tangentArray[ offset_tangent + 2 ] = t1.z;
				tangentArray[ offset_tangent + 3 ] = t1.w;

				tangentArray[ offset_tangent + 4 ] = t2.x;
				tangentArray[ offset_tangent + 5 ] = t2.y;
				tangentArray[ offset_tangent + 6 ] = t2.z;
				tangentArray[ offset_tangent + 7 ] = t2.w;

				tangentArray[ offset_tangent + 8 ]  = t3.x;
				tangentArray[ offset_tangent + 9 ]  = t3.y;
				tangentArray[ offset_tangent + 10 ] = t3.z;
				tangentArray[ offset_tangent + 11 ] = t3.w;

				tangentArray[ offset_tangent + 12 ] = t4.x;
				tangentArray[ offset_tangent + 13 ] = t4.y;
				tangentArray[ offset_tangent + 14 ] = t4.z;
				tangentArray[ offset_tangent + 15 ] = t4.w;

				offset_tangent += 16;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, tangentArray, hint );

		}

		if ( dirtyNormals && normalType ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ]	];

				vertexNormals = face.vertexNormals;
				faceNormal = face.normal;

				if ( vertexNormals.length === 3 && needsSmoothNormals ) {

					for ( i = 0; i < 3; i ++ ) {

						vn = vertexNormals[ i ];

						normalArray[ offset_normal ]     = vn.x;
						normalArray[ offset_normal + 1 ] = vn.y;
						normalArray[ offset_normal + 2 ] = vn.z;

						offset_normal += 3;

					}

				} else {

					for ( i = 0; i < 3; i ++ ) {

						normalArray[ offset_normal ]     = faceNormal.x;
						normalArray[ offset_normal + 1 ] = faceNormal.y;
						normalArray[ offset_normal + 2 ] = faceNormal.z;

						offset_normal += 3;

					}

				}

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces4[ f ] ];

				vertexNormals = face.vertexNormals;
				faceNormal = face.normal;

				if ( vertexNormals.length === 4 && needsSmoothNormals ) {

					for ( i = 0; i < 4; i ++ ) {

						vn = vertexNormals[ i ];

						normalArray[ offset_normal ]     = vn.x;
						normalArray[ offset_normal + 1 ] = vn.y;
						normalArray[ offset_normal + 2 ] = vn.z;

						offset_normal += 3;

					}

				} else {

					for ( i = 0; i < 4; i ++ ) {

						normalArray[ offset_normal ]     = faceNormal.x;
						normalArray[ offset_normal + 1 ] = faceNormal.y;
						normalArray[ offset_normal + 2 ] = faceNormal.z;

						offset_normal += 3;

					}

				}

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, normalArray, hint );

		}

		if ( dirtyUvs && obj_uvs && uvType ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				fi = chunk_faces3[ f ];

				face = obj_faces[ fi ];
				uv = obj_uvs[ fi ];

				if ( uv === undefined ) continue;

				for ( i = 0; i < 3; i ++ ) {

					uvi = uv[ i ];

					uvArray[ offset_uv ]     = uvi.u;
					uvArray[ offset_uv + 1 ] = uvi.v;

					offset_uv += 2;

				}

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				fi = chunk_faces4[ f ];

				face = obj_faces[ fi ];
				uv = obj_uvs[ fi ];

				if ( uv === undefined ) continue;

				for ( i = 0; i < 4; i ++ ) {

					uvi = uv[ i ];

					uvArray[ offset_uv ]     = uvi.u;
					uvArray[ offset_uv + 1 ] = uvi.v;

					offset_uv += 2;

				}

			}

			if ( offset_uv > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, uvArray, hint );

			}

		}

		if ( dirtyUvs && obj_uvs2 && uvType ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				fi = chunk_faces3[ f ];

				face = obj_faces[ fi ];
				uv2 = obj_uvs2[ fi ];

				if ( uv2 === undefined ) continue;

				for ( i = 0; i < 3; i ++ ) {

					uv2i = uv2[ i ];

					uv2Array[ offset_uv2 ]     = uv2i.u;
					uv2Array[ offset_uv2 + 1 ] = uv2i.v;

					offset_uv2 += 2;

				}

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				fi = chunk_faces4[ f ];

				face = obj_faces[ fi ];
				uv2 = obj_uvs2[ fi ];

				if ( uv2 === undefined ) continue;

				for ( i = 0; i < 4; i ++ ) {

					uv2i = uv2[ i ];

					uv2Array[ offset_uv2 ]     = uv2i.u;
					uv2Array[ offset_uv2 + 1 ] = uv2i.v;

					offset_uv2 += 2;

				}

			}

			if ( offset_uv2 > 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, uv2Array, hint );

			}

		}

		if ( dirtyElements ) {

			for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces3[ f ]	];

				faceArray[ offset_face ] 	 = vertexIndex;
				faceArray[ offset_face + 1 ] = vertexIndex + 1;
				faceArray[ offset_face + 2 ] = vertexIndex + 2;

				offset_face += 3;

				lineArray[ offset_line ]     = vertexIndex;
				lineArray[ offset_line + 1 ] = vertexIndex + 1;

				lineArray[ offset_line + 2 ] = vertexIndex;
				lineArray[ offset_line + 3 ] = vertexIndex + 2;

				lineArray[ offset_line + 4 ] = vertexIndex + 1;
				lineArray[ offset_line + 5 ] = vertexIndex + 2;

				offset_line += 6;

				vertexIndex += 3;

			}

			for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

				face = obj_faces[ chunk_faces4[ f ] ];

				faceArray[ offset_face ]     = vertexIndex;
				faceArray[ offset_face + 1 ] = vertexIndex + 1;
				faceArray[ offset_face + 2 ] = vertexIndex + 3;

				faceArray[ offset_face + 3 ] = vertexIndex + 1;
				faceArray[ offset_face + 4 ] = vertexIndex + 2;
				faceArray[ offset_face + 5 ] = vertexIndex + 3;

				offset_face += 6;

				lineArray[ offset_line ]     = vertexIndex;
				lineArray[ offset_line + 1 ] = vertexIndex + 1;

				lineArray[ offset_line + 2 ] = vertexIndex;
				lineArray[ offset_line + 3 ] = vertexIndex + 3;

				lineArray[ offset_line + 4 ] = vertexIndex + 1;
				lineArray[ offset_line + 5 ] = vertexIndex + 2;

				lineArray[ offset_line + 6 ] = vertexIndex + 2;
				lineArray[ offset_line + 7 ] = vertexIndex + 3;

				offset_line += 8;

				vertexIndex += 4;

			}

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, faceArray, hint );

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, lineArray, hint );

		}

		if ( customAttributes ) {

			for ( i = 0, il = customAttributes.length; i < il; i ++ ) {

				customAttribute = customAttributes[ i ];

				if ( ! customAttribute.__original.needsUpdate ) continue;

				offset_custom = 0;
				offset_customSrc = 0;

				if ( customAttribute.size === 1 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === "vertices" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ]	];

							customAttribute.array[ offset_custom ] 	   = customAttribute.value[ face.a ];
							customAttribute.array[ offset_custom + 1 ] = customAttribute.value[ face.b ];
							customAttribute.array[ offset_custom + 2 ] = customAttribute.value[ face.c ];

							offset_custom += 3;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces4[ f ] ];

							customAttribute.array[ offset_custom ] 	   = customAttribute.value[ face.a ];
							customAttribute.array[ offset_custom + 1 ] = customAttribute.value[ face.b ];
							customAttribute.array[ offset_custom + 2 ] = customAttribute.value[ face.c ];
							customAttribute.array[ offset_custom + 3 ] = customAttribute.value[ face.d ];

							offset_custom += 4;

						}

					} else if ( customAttribute.boundTo === "faces" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							customAttribute.array[ offset_custom ] 	   = value;
							customAttribute.array[ offset_custom + 1 ] = value;
							customAttribute.array[ offset_custom + 2 ] = value;

							offset_custom += 3;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces4[ f ] ];

							customAttribute.array[ offset_custom ] 	   = value;
							customAttribute.array[ offset_custom + 1 ] = value;
							customAttribute.array[ offset_custom + 2 ] = value;
							customAttribute.array[ offset_custom + 3 ] = value;

							offset_custom += 4;

						}

					}

				} else if ( customAttribute.size === 2 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === "vertices" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ]	];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom ] 	   = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							offset_custom += 6;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces4[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];
							v4 = customAttribute.value[ face.d ];

							customAttribute.array[ offset_custom ] 	   = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							customAttribute.array[ offset_custom + 6 ] = v4.x;
							customAttribute.array[ offset_custom + 7 ] = v4.y;

							offset_custom += 8;

						}

					} else if ( customAttribute.boundTo === "faces" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom ] 	   = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							offset_custom += 6;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces4[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;
							v4 = value;

							customAttribute.array[ offset_custom ] 	   = v1.x;
							customAttribute.array[ offset_custom + 1 ] = v1.y;

							customAttribute.array[ offset_custom + 2 ] = v2.x;
							customAttribute.array[ offset_custom + 3 ] = v2.y;

							customAttribute.array[ offset_custom + 4 ] = v3.x;
							customAttribute.array[ offset_custom + 5 ] = v3.y;

							customAttribute.array[ offset_custom + 6 ] = v4.x;
							customAttribute.array[ offset_custom + 7 ] = v4.y;

							offset_custom += 8;

						}

					}

				} else if ( customAttribute.size === 3 ) {

					var pp;

					if ( customAttribute.type === "c" ) {

						pp = [ "r", "g", "b" ];

					} else {

						pp = [ "x", "y", "z" ];

					}

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === "vertices" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ]	];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom ] 	   = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces4[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];
							v4 = customAttribute.value[ face.d ];

							customAttribute.array[ offset_custom  ] 	= v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1  ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2  ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3  ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4  ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5  ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6  ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7  ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8  ] = v3[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 9  ] = v4[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 10 ] = v4[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 11 ] = v4[ pp[ 2 ] ];

							offset_custom += 12;

						}

					} else if ( customAttribute.boundTo === "faces" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom ] 	   = v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1 ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2 ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3 ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4 ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5 ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6 ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7 ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8 ] = v3[ pp[ 2 ] ];

							offset_custom += 9;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces4[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;
							v4 = value;

							customAttribute.array[ offset_custom  ] 	= v1[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 1  ] = v1[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 2  ] = v1[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 3  ] = v2[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 4  ] = v2[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 5  ] = v2[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 6  ] = v3[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 7  ] = v3[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 8  ] = v3[ pp[ 2 ] ];

							customAttribute.array[ offset_custom + 9  ] = v4[ pp[ 0 ] ];
							customAttribute.array[ offset_custom + 10 ] = v4[ pp[ 1 ] ];
							customAttribute.array[ offset_custom + 11 ] = v4[ pp[ 2 ] ];

							offset_custom += 12;

						}

					}

				} else if ( customAttribute.size === 4 ) {

					if ( customAttribute.boundTo === undefined || customAttribute.boundTo === "vertices" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces3[ f ]	];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];

							customAttribute.array[ offset_custom  ] 	= v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							face = obj_faces[ chunk_faces4[ f ] ];

							v1 = customAttribute.value[ face.a ];
							v2 = customAttribute.value[ face.b ];
							v3 = customAttribute.value[ face.c ];
							v4 = customAttribute.value[ face.d ];

							customAttribute.array[ offset_custom  ] 	= v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							customAttribute.array[ offset_custom + 12 ] = v4.x;
							customAttribute.array[ offset_custom + 13 ] = v4.y;
							customAttribute.array[ offset_custom + 14 ] = v4.z;
							customAttribute.array[ offset_custom + 15 ] = v4.w;

							offset_custom += 16;

						}

					} else if ( customAttribute.boundTo === "faces" ) {

						for ( f = 0, fl = chunk_faces3.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces3[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;

							customAttribute.array[ offset_custom  ] 	= v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							offset_custom += 12;

						}

						for ( f = 0, fl = chunk_faces4.length; f < fl; f ++ ) {

							value = customAttribute.value[ chunk_faces4[ f ] ];

							v1 = value;
							v2 = value;
							v3 = value;
							v4 = value;

							customAttribute.array[ offset_custom  ] 	= v1.x;
							customAttribute.array[ offset_custom + 1  ] = v1.y;
							customAttribute.array[ offset_custom + 2  ] = v1.z;
							customAttribute.array[ offset_custom + 3  ] = v1.w;

							customAttribute.array[ offset_custom + 4  ] = v2.x;
							customAttribute.array[ offset_custom + 5  ] = v2.y;
							customAttribute.array[ offset_custom + 6  ] = v2.z;
							customAttribute.array[ offset_custom + 7  ] = v2.w;

							customAttribute.array[ offset_custom + 8  ] = v3.x;
							customAttribute.array[ offset_custom + 9  ] = v3.y;
							customAttribute.array[ offset_custom + 10 ] = v3.z;
							customAttribute.array[ offset_custom + 11 ] = v3.w;

							customAttribute.array[ offset_custom + 12 ] = v4.x;
							customAttribute.array[ offset_custom + 13 ] = v4.y;
							customAttribute.array[ offset_custom + 14 ] = v4.z;
							customAttribute.array[ offset_custom + 15 ] = v4.w;

							offset_custom += 16;

						}

					}

				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, customAttribute.buffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, customAttribute.array, hint );

			}

		}

		if ( dispose ) {

			delete geometryGroup.__inittedArrays;
			delete geometryGroup.__colorArray;
			delete geometryGroup.__normalArray;
			delete geometryGroup.__tangentArray;
			delete geometryGroup.__uvArray;
			delete geometryGroup.__uv2Array;
			delete geometryGroup.__faceArray;
			delete geometryGroup.__vertexArray;
			delete geometryGroup.__lineArray;
			delete geometryGroup.__skinVertexAArray;
			delete geometryGroup.__skinVertexBArray;
			delete geometryGroup.__skinIndexArray;
			delete geometryGroup.__skinWeightArray;

		}

	};

	// Buffer rendering

	function renderBufferImmediate ( object, program, shading ) {

		if ( ! object.__webglVertexBuffer ) object.__webglVertexBuffer = _gl.createBuffer();
		if ( ! object.__webglNormalBuffer ) object.__webglNormalBuffer = _gl.createBuffer();

		if ( object.hasPos ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW );
			_gl.enableVertexAttribArray( program.attributes.position );
			_gl.vertexAttribPointer( program.attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasNormal ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglNormalBuffer );

			if ( shading === THREE.FlatShading ) {

				var nx, ny, nz,
					nax, nbx, ncx, nay, nby, ncy, naz, nbz, ncz,
					normalArray,
					i, il = object.count * 3;

				for( i = 0; i < il; i += 9 ) {

					normalArray = object.normalArray;

					nax  = normalArray[ i ];
					nay  = normalArray[ i + 1 ];
					naz  = normalArray[ i + 2 ];

					nbx  = normalArray[ i + 3 ];
					nby  = normalArray[ i + 4 ];
					nbz  = normalArray[ i + 5 ];

					ncx  = normalArray[ i + 6 ];
					ncy  = normalArray[ i + 7 ];
					ncz  = normalArray[ i + 8 ];

					nx = ( nax + nbx + ncx ) / 3;
					ny = ( nay + nby + ncy ) / 3;
					nz = ( naz + nbz + ncz ) / 3;

					normalArray[ i ] 	 = nx;
					normalArray[ i + 1 ] = ny;
					normalArray[ i + 2 ] = nz;

					normalArray[ i + 3 ] = nx;
					normalArray[ i + 4 ] = ny;
					normalArray[ i + 5 ] = nz;

					normalArray[ i + 6 ] = nx;
					normalArray[ i + 7 ] = ny;
					normalArray[ i + 8 ] = nz;

				}

			}

			_gl.bufferData( _gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW );
			_gl.enableVertexAttribArray( program.attributes.normal );
			_gl.vertexAttribPointer( program.attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

		}

		_gl.drawArrays( _gl.TRIANGLES, 0, object.count );

		object.count = 0;

	};

	function renderBuffer ( camera, lights, fog, material, geometryGroup, object ) {

		if ( material.opacity === 0 ) return;

		var program, attributes, linewidth, primitives, a, attribute, i, il;

		program = setProgram( camera, lights, fog, material, object );

		attributes = program.attributes;

		var updateBuffers = false,
			wireframeBit = material.wireframe ? 1 : 0,
			geometryGroupHash = ( geometryGroup.id * 0xffffff ) + ( program.id * 2 ) + wireframeBit;

		if ( geometryGroupHash !== _currentGeometryGroupHash ) {

			_currentGeometryGroupHash = geometryGroupHash;
			updateBuffers = true;

		}

		// vertices

		if ( !material.morphTargets && attributes.position >= 0 ) {

			if ( updateBuffers ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
				_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

			}

		} else {

			if ( object.morphTargetBase ) {

				setupMorphTargets( material, geometryGroup, object );

			}

		}


		if ( updateBuffers ) {

			// custom attributes

			// Use the per-geometryGroup custom attribute arrays which are setup in initMeshBuffers

			if ( geometryGroup.__webglCustomAttributesList ) {

				for ( i = 0, il = geometryGroup.__webglCustomAttributesList.length; i < il; i ++ ) {

					attribute = geometryGroup.__webglCustomAttributesList[ i ];

					if( attributes[ attribute.buffer.belongsToAttribute ] >= 0 ) {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, attribute.buffer );
						_gl.vertexAttribPointer( attributes[ attribute.buffer.belongsToAttribute ], attribute.size, _gl.FLOAT, false, 0, 0 );

					}

				}

			}


			// colors

			if ( attributes.color >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
				_gl.vertexAttribPointer( attributes.color, 3, _gl.FLOAT, false, 0, 0 );

			}

			// normals

			if ( attributes.normal >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
				_gl.vertexAttribPointer( attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

			}

			// tangents

			if ( attributes.tangent >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
				_gl.vertexAttribPointer( attributes.tangent, 4, _gl.FLOAT, false, 0, 0 );

			}

			// uvs

			if ( attributes.uv >= 0 ) {

				if ( geometryGroup.__webglUVBuffer ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
					_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

					_gl.enableVertexAttribArray( attributes.uv );

				} else {

					_gl.disableVertexAttribArray( attributes.uv );

				}

			}

			if ( attributes.uv2 >= 0 ) {

				if ( geometryGroup.__webglUV2Buffer ) {

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
					_gl.vertexAttribPointer( attributes.uv2, 2, _gl.FLOAT, false, 0, 0 );

					_gl.enableVertexAttribArray( attributes.uv2 );

				} else {

					_gl.disableVertexAttribArray( attributes.uv2 );

				}

			}

			if ( material.skinning &&
				 attributes.skinVertexA >= 0 && attributes.skinVertexB >= 0 &&
				 attributes.skinIndex >= 0 && attributes.skinWeight >= 0 ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexABuffer );
				_gl.vertexAttribPointer( attributes.skinVertexA, 4, _gl.FLOAT, false, 0, 0 );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexBBuffer );
				_gl.vertexAttribPointer( attributes.skinVertexB, 4, _gl.FLOAT, false, 0, 0 );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
				_gl.vertexAttribPointer( attributes.skinIndex, 4, _gl.FLOAT, false, 0, 0 );

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
				_gl.vertexAttribPointer( attributes.skinWeight, 4, _gl.FLOAT, false, 0, 0 );

			}

		}

		// render mesh

		if ( object instanceof THREE.Mesh ) {

			// wireframe

			if ( material.wireframe ) {

				setLineWidth( material.wireframeLinewidth );

				if ( updateBuffers ) _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
				_gl.drawElements( _gl.LINES, geometryGroup.__webglLineCount, _gl.UNSIGNED_SHORT, 0 );

			// triangles

			} else {

				if ( updateBuffers ) _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
				_gl.drawElements( _gl.TRIANGLES, geometryGroup.__webglFaceCount, _gl.UNSIGNED_SHORT, 0 );

			}

			_this.info.render.calls ++;
			_this.info.render.vertices += geometryGroup.__webglFaceCount;
			_this.info.render.faces += geometryGroup.__webglFaceCount / 3;

		// render lines

		} else if ( object instanceof THREE.Line ) {

			primitives = ( object.type === THREE.LineStrip ) ? _gl.LINE_STRIP : _gl.LINES;

			setLineWidth( material.linewidth );

			_gl.drawArrays( primitives, 0, geometryGroup.__webglLineCount );

			_this.info.render.calls ++;

		// render particles

		} else if ( object instanceof THREE.ParticleSystem ) {

			_gl.drawArrays( _gl.POINTS, 0, geometryGroup.__webglParticleCount );

			_this.info.render.calls ++;

		// render ribbon

		} else if ( object instanceof THREE.Ribbon ) {

			_gl.drawArrays( _gl.TRIANGLE_STRIP, 0, geometryGroup.__webglVertexCount );

			_this.info.render.calls ++;

		}

	};

	function setupMorphTargets ( material, geometryGroup, object ) {

		// set base

		var attributes = material.program.attributes;

		if ( object.morphTargetBase !== - 1 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ object.morphTargetBase ] );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		} else if ( attributes.position >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.morphTargetForcedOrder.length ) {

			// set forced order

			var m = 0;
			var order = object.morphTargetForcedOrder;
			var influences = object.morphTargetInfluences;

			while ( m < material.numSupportedMorphTargets && m < order.length ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ order[ m ] ] );
				_gl.vertexAttribPointer( attributes[ "morphTarget" + m ], 3, _gl.FLOAT, false, 0, 0 );

				object.__webglMorphTargetInfluences[ m ] = influences[ order[ m ] ];

				m ++;
			}

		} else {

			// find most influencing

			var used = [];
			var candidateInfluence = - 1;
			var candidate = 0;
			var influences = object.morphTargetInfluences;
			var i, il = influences.length;
			var m = 0;

			if ( object.morphTargetBase !== - 1 ) {

				used[ object.morphTargetBase ] = true;

			}

			while ( m < material.numSupportedMorphTargets ) {

				for ( i = 0; i < il; i ++ ) {

					if ( !used[ i ] && influences[ i ] > candidateInfluence ) {

						candidate = i;
						candidateInfluence = influences[ candidate ];

					}

				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ candidate ] );
				_gl.vertexAttribPointer( attributes[ "morphTarget" + m ], 3, _gl.FLOAT, false, 0, 0 );

				object.__webglMorphTargetInfluences[ m ] = candidateInfluence;

				used[ candidate ] = 1;
				candidateInfluence = -1;
				m ++;

			}

		}

		// load updated influences uniform

		if( material.program.uniforms.morphTargetInfluences !== null ) {

			_gl.uniform1fv( material.program.uniforms.morphTargetInfluences, object.__webglMorphTargetInfluences );

		}

	}

	// Frustum

	function computeFrustum ( m ) {

		_frustum[ 0 ].set( m.n41 - m.n11, m.n42 - m.n12, m.n43 - m.n13, m.n44 - m.n14 );
		_frustum[ 1 ].set( m.n41 + m.n11, m.n42 + m.n12, m.n43 + m.n13, m.n44 + m.n14 );
		_frustum[ 2 ].set( m.n41 + m.n21, m.n42 + m.n22, m.n43 + m.n23, m.n44 + m.n24 );
		_frustum[ 3 ].set( m.n41 - m.n21, m.n42 - m.n22, m.n43 - m.n23, m.n44 - m.n24 );
		_frustum[ 4 ].set( m.n41 - m.n31, m.n42 - m.n32, m.n43 - m.n33, m.n44 - m.n34 );
		_frustum[ 5 ].set( m.n41 + m.n31, m.n42 + m.n32, m.n43 + m.n33, m.n44 + m.n34 );

		var i, plane;

		for ( i = 0; i < 6; i ++ ) {

			plane = _frustum[ i ];
			plane.divideScalar( Math.sqrt( plane.x * plane.x + plane.y * plane.y + plane.z * plane.z ) );

		}

	};

	function isInFrustum ( object ) {

		var distance, matrix = object.matrixWorld,
		radius = - object.geometry.boundingSphere.radius * Math.max( object.scale.x, Math.max( object.scale.y, object.scale.z ) );

		for ( var i = 0; i < 6; i ++ ) {

			distance = _frustum[ i ].x * matrix.n14 + _frustum[ i ].y * matrix.n24 + _frustum[ i ].z * matrix.n34 + _frustum[ i ].w;
			if ( distance <= radius ) return false;

		}

		return true;

	};


	function painterSort ( a, b ) {

		return b.z - a.z;

	};

	// Rendering

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		var i, il,

		program, material,
		webglObject, object,
		renderList,

		lights = scene.lights,
		fog = scene.fog;

		_currentMaterialId = -1;

		if ( this.autoUpdateObjects ) this.initWebGLObjects( scene );

		if ( this.shadowMapEnabled && this.shadowMapAutoUpdate ) renderShadowMap( scene, camera );

		_this.info.render.calls = 0;
		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;

		if ( camera.parent === undefined ) {

			console.warn( 'DEPRECATED: Camera hasn\'t been added to a Scene. Adding it...' );
			scene.add( camera );

		}

		if ( this.autoUpdateScene ) scene.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );
		camera.matrixWorldInverse.flattenToArray( _viewMatrixArray );
		camera.projectionMatrix.flattenToArray( _projectionMatrixArray );

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
		computeFrustum( _projScreenMatrix );

		setRenderTarget( renderTarget );

		if ( this.autoClear || forceClear ) {

			this.clear( this.autoClearColor, this.autoClearDepth, this.autoClearStencil );

		}

		// set matrices for regular objects (frustum culled)

		renderList = scene.__webglObjects;

		for ( i = 0, il = renderList.length; i < il; i ++ ) {

			webglObject = renderList[ i ];
			object = webglObject.object;

			webglObject.render = false;

			if ( object.visible ) {

				if ( ! ( object instanceof THREE.Mesh ) || ! ( object.frustumCulled ) || isInFrustum( object ) ) {

					object.matrixWorld.flattenToArray( object._objectMatrixArray );

					setupMatrices( object, camera, true );

					unrollBufferMaterial( webglObject );

					webglObject.render = true;

					if ( this.sortObjects ) {

						if ( object.renderDepth ) {

							webglObject.z = object.renderDepth;

						} else {

							_vector3.copy( object.position );
							_projScreenMatrix.multiplyVector3( _vector3 );

							webglObject.z = _vector3.z;

						}

					}

				}

			}

		}

		if ( this.sortObjects ) {

			renderList.sort( painterSort );

		}

		// set matrices for immediate objects

		renderList = scene.__webglObjectsImmediate;

		for ( i = 0, il = renderList.length; i < il; i ++ ) {

			webglObject = renderList[ i ];
			object = webglObject.object;

			if ( object.visible ) {

				if( object.matrixAutoUpdate ) {

					object.matrixWorld.flattenToArray( object._objectMatrixArray );

				}

				setupMatrices( object, camera, true );

				unrollImmediateBufferMaterial( webglObject );

			}

		}

		if ( scene.overrideMaterial ) {

			setBlending( scene.overrideMaterial.blending );
			setDepthTest( scene.overrideMaterial.depthTest );
			setDepthWrite( scene.overrideMaterial.depthWrite );
			setPolygonOffset( scene.overrideMaterial.polygonOffset, scene.overrideMaterial.polygonOffsetFactor, scene.overrideMaterial.polygonOffsetUnits );

			renderObjects( scene.__webglObjects, false, "", camera, lights, fog, true, scene.overrideMaterial );
			renderObjectsImmediate( scene.__webglObjectsImmediate, "", camera, lights, fog, false, scene.overrideMaterial );

		} else {

			// opaque pass (front-to-back order)

			setBlending( THREE.NormalBlending );

			renderObjects( scene.__webglObjects, true, "opaque", camera, lights, fog, false );
			renderObjectsImmediate( scene.__webglObjectsImmediate, "opaque", camera, lights, fog, false );

			// transparent pass (back-to-front order)

			renderObjects( scene.__webglObjects, false, "transparent", camera, lights, fog, true );
			renderObjectsImmediate( scene.__webglObjectsImmediate, "transparent", camera, lights, fog, true );

		}

		// render 2d

		if ( scene.__webglSprites.length ) {

			renderSprites( scene, camera );

		}

		// Generate mipmap if we're using any kind of mipmap filtering

		if ( renderTarget && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter ) {

			updateRenderTargetMipmap( renderTarget );

		}

		//_gl.finish();

	};

	function renderShadowMap ( scene, camera ) {

		var i, il, j, jl,

		shadowMap, shadowMatrix,
		program, buffer, material,
		webglObject, object, light,

		shadowIndex = 0,

		lights = scene.lights,
		fog = null;

		if ( ! _cameraLight ) {

			_cameraLight = new THREE.PerspectiveCamera( _this.shadowCameraFov, _this.shadowMapWidth / _this.shadowMapHeight, _this.shadowCameraNear, _this.shadowCameraFar );

		}

		for ( i = 0, il = lights.length; i < il; i ++ ) {

			light = lights[ i ];

			if ( light.castShadow && light instanceof THREE.SpotLight ) {

				_currentMaterialId = -1;

				if ( ! _this.shadowMap[ shadowIndex ] ) {

					var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };

					_this.shadowMap[ shadowIndex ] = new THREE.WebGLRenderTarget( _this.shadowMapWidth, _this.shadowMapHeight, pars );
					_shadowMatrix[ shadowIndex ] = new THREE.Matrix4();

				}

				shadowMap = _this.shadowMap[ shadowIndex ];
				shadowMatrix = _shadowMatrix[ shadowIndex ];

				_cameraLight.position.copy( light.position );
				_cameraLight.lookAt( light.target.position );

				if ( _cameraLight.parent == null ) {

					console.warn( "Camera is not on the Scene. Adding it..." );
					scene.add( _cameraLight );

				}

				if ( this.autoUpdateScene ) scene.updateMatrixWorld();

				_cameraLight.matrixWorldInverse.getInverse( _cameraLight.matrixWorld );

				// compute shadow matrix

				shadowMatrix.set( 0.5, 0.0, 0.0, 0.5,
								  0.0, 0.5, 0.0, 0.5,
								  0.0, 0.0, 0.5, 0.5,
								  0.0, 0.0, 0.0, 1.0 );

				shadowMatrix.multiplySelf( _cameraLight.projectionMatrix );
				shadowMatrix.multiplySelf( _cameraLight.matrixWorldInverse );

				// render shadow map

				_cameraLight.matrixWorldInverse.flattenToArray( _viewMatrixArray );
				_cameraLight.projectionMatrix.flattenToArray( _projectionMatrixArray );

				_projScreenMatrix.multiply( _cameraLight.projectionMatrix, _cameraLight.matrixWorldInverse );
				computeFrustum( _projScreenMatrix );

				setRenderTarget( shadowMap );

				// using arbitrary clear color in depth pass
				// creates variance in shadows

				_gl.clearColor( 1, 1, 1, 1 );
				//_gl.clearColor( 0, 0, 0, 1 );

				_this.clear();

				_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

				// set matrices & frustum culling

				jl = scene.__webglObjects.length;

				for ( j = 0; j < jl; j ++ ) {

					webglObject = scene.__webglObjects[ j ];
					object = webglObject.object;

					webglObject.render = false;

					if ( object.visible && object.castShadow ) {

						if ( ! ( object instanceof THREE.Mesh ) || ! ( object.frustumCulled ) || isInFrustum( object ) ) {

							object.matrixWorld.flattenToArray( object._objectMatrixArray );

							setupMatrices( object, _cameraLight, false );

							webglObject.render = true;

						}

					}

				}

				// render regular objects

				setDepthTest( true );
				setBlending( THREE.NormalBlending ); // maybe blending should be just disabled?

				//_gl.cullFace( _gl.FRONT );

				for ( j = 0; j < jl; j ++ ) {

					webglObject = scene.__webglObjects[ j ];

					if ( webglObject.render ) {

						object = webglObject.object;
						buffer = webglObject.buffer;

						setObjectFaces( object );

						if ( object.customDepthMaterial ) {

							material = object.customDepthMaterial;

						} else if ( object.geometry.morphTargets.length ) {

							material = _depthMaterialMorph;

						} else {

							material = _depthMaterial;

						}

						renderBuffer( _cameraLight, lights, fog, material, buffer, object );

					}

				}

				// set matrices and render immediate objects

				jl = scene.__webglObjectsImmediate.length;

				for ( j = 0; j < jl; j ++ ) {

					webglObject = scene.__webglObjectsImmediate[ j ];
					object = webglObject.object;

					if ( object.visible && object.castShadow ) {

						if( object.matrixAutoUpdate ) {

							object.matrixWorld.flattenToArray( object._objectMatrixArray );

						}

						_currentGeometryGroupHash = -1;

						setupMatrices( object, _cameraLight, false );

						setObjectFaces( object );

						program = setProgram( _cameraLight, lights, fog, _depthMaterial, object );

						if ( object.immediateRenderCallback ) {

							object.immediateRenderCallback( program, _gl, _frustum );

						} else {

							object.render( function( object ) { renderBufferImmediate( object, program, _depthMaterial.shading ); } );

						}

					}

				}

				//_gl.cullFace( _gl.BACK );

				shadowIndex ++;

			}

		}

	};

	function renderObjects ( renderList, reverse, materialType, camera, lights, fog, useBlending, overrideMaterial ) {

		var webglObject, object, buffer, material, start, end, delta;

		if ( reverse ) {

			start = renderList.length - 1;
			end = -1;
			delta = -1;

		} else {

			start = 0;
			end = renderList.length;
			delta = 1;
		}

		for ( var i = start; i !== end; i += delta ) {

			webglObject = renderList[ i ];

			if ( webglObject.render ) {

				object = webglObject.object;
				buffer = webglObject.buffer;

				if ( overrideMaterial ) {

					material = overrideMaterial;

				} else {

					material = webglObject[ materialType ];

					if ( ! material ) continue;

					if ( useBlending ) setBlending( material.blending );

					setDepthTest( material.depthTest );
					setDepthWrite( material.depthWrite );
					setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

				}

				setObjectFaces( object );

				renderBuffer( camera, lights, fog, material, buffer, object );

			}

		}

	};

	function renderObjectsImmediate ( renderList, materialType, camera, lights, fog, useBlending, overrideMaterial ) {

		var webglObject, object, material, program;

		for ( var i = 0, il = renderList.length; i < il; i ++ ) {

			webglObject = renderList[ i ];
			object = webglObject.object;

			if ( object.visible ) {

				_currentGeometryGroupHash = -1;

				if ( overrideMaterial ) {

					material = overrideMaterial;

				} else {

					material = webglObject[ materialType ];

					if ( ! material ) continue;

					if ( useBlending ) setBlending( material.blending );

					setDepthTest( material.depthTest );
					setDepthWrite( material.depthWrite );
					setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

				}

				setObjectFaces( object );

				program = setProgram( camera, lights, fog, material, object );

				if ( object.immediateRenderCallback ) {

					object.immediateRenderCallback( program, _gl, _frustum );

				} else {

					object.render( function( object ) { renderBufferImmediate( object, program, material.shading ); } );

				}

			}

		}

	};

	function unrollImmediateBufferMaterial ( globject ) {

		var object = globject.object,
			material = object.material;

		if ( material.transparent ) {

			globject.transparent = material;
			globject.opaque = null;

		} else {

			globject.opaque = material;
			globject.transparent = null;

		}

	};

	function unrollBufferMaterial ( globject ) {

		var object = globject.object,
			buffer = globject.buffer,
			material, materialIndex, meshMaterial;

		meshMaterial = object.material;

		if ( meshMaterial instanceof THREE.MeshFaceMaterial ) {

			materialIndex = buffer.materialIndex;

			if ( materialIndex >= 0 ) {

				material = object.geometry.materials[ materialIndex ];

				if ( material.transparent ) {

					globject.transparent = material;
					globject.opaque = null;

				} else {

					globject.opaque = material;
					globject.transparent = null;

				}

			}

		} else {

			material = meshMaterial;

			if ( material ) {

				if ( material.transparent ) {

					globject.transparent = material;
					globject.opaque = null;

				} else {

					globject.opaque = material;
					globject.transparent = null;

				}

			}

		}

	};

	function renderSprites ( scene, camera ) {

		var o, ol, object;
		var attributes = _sprite.attributes;
		var uniforms = _sprite.uniforms;
		var invAspect = _viewportHeight / _viewportWidth;
		var size, scale = [];
		var screenPosition;
		var halfViewportWidth = _viewportWidth * 0.5;
		var halfViewportHeight = _viewportHeight * 0.5;
		var mergeWith3D = true;

		// setup gl

		_gl.useProgram( _sprite.program );
		_currentProgram = _sprite.program;
		_oldBlending = -1;
		_oldDepthTest = -1;
		_currentGeometryGroupHash = -1;

		if ( !_spriteAttributesEnabled ) {

			_gl.enableVertexAttribArray( _sprite.attributes.position );
			_gl.enableVertexAttribArray( _sprite.attributes.uv );

			_spriteAttributesEnabled = true;

		}

		_gl.disable( _gl.CULL_FACE );
		_gl.enable( _gl.BLEND );
		_gl.depthMask( true );

		_gl.bindBuffer( _gl.ARRAY_BUFFER, _sprite.vertexBuffer );
		_gl.vertexAttribPointer( attributes.position, 2, _gl.FLOAT, false, 2 * 8, 0 );
		_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 2 * 8, 8 );

		_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _sprite.elementBuffer );

		_gl.uniformMatrix4fv( uniforms.projectionMatrix, false, _projectionMatrixArray );

		_gl.activeTexture( _gl.TEXTURE0 );
		_gl.uniform1i( uniforms.map, 0 );

		// update positions and sort

		for( o = 0, ol = scene.__webglSprites.length; o < ol; o ++ ) {

			object = scene.__webglSprites[ o ];

			if ( !object.visible || object.opacity === 0 ) continue;

			if( !object.useScreenCoordinates ) {

				object._modelViewMatrix.multiplyToArray( camera.matrixWorldInverse, object.matrixWorld, object._modelViewMatrixArray );
				object.z = -object._modelViewMatrix.n34;

			} else {

				object.z = -object.position.z;

			}

		}

		scene.__webglSprites.sort( painterSort );

		// render all sprites

		for ( o = 0, ol = scene.__webglSprites.length; o < ol; o ++ ) {

			object = scene.__webglSprites[ o ];

			if ( !object.visible || object.opacity === 0 ) continue;

			if ( object.map && object.map.image && object.map.image.width ) {

				if ( object.useScreenCoordinates ) {

					_gl.uniform1i( uniforms.useScreenCoordinates, 1 );
					_gl.uniform3f( uniforms.screenPosition, ( object.position.x - halfViewportWidth  ) / halfViewportWidth,
															( halfViewportHeight - object.position.y ) / halfViewportHeight,
															  Math.max( 0, Math.min( 1, object.position.z )));

				} else {

					_gl.uniform1i( uniforms.useScreenCoordinates, 0 );
					_gl.uniform1i( uniforms.affectedByDistance, object.affectedByDistance ? 1 : 0 );
					_gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, object._modelViewMatrixArray );

				}

				size = object.map.image.width / ( object.scaleByViewport ? _viewportHeight : 1 );

				scale[ 0 ] = size * invAspect * object.scale.x;
				scale[ 1 ] = size * object.scale.y;

				_gl.uniform2f( uniforms.uvScale, object.uvScale.x, object.uvScale.y );
				_gl.uniform2f( uniforms.uvOffset, object.uvOffset.x, object.uvOffset.y );
				_gl.uniform2f( uniforms.alignment, object.alignment.x, object.alignment.y );

				_gl.uniform1f( uniforms.opacity, object.opacity );
				_gl.uniform3f( uniforms.color, object.color.r, object.color.g, object.color.b );

				_gl.uniform1f( uniforms.rotation, object.rotation );
				_gl.uniform2fv( uniforms.scale, scale );

				if ( object.mergeWith3D && !mergeWith3D ) {

					_gl.enable( _gl.DEPTH_TEST );
					mergeWith3D = true;

				} else if ( !object.mergeWith3D && mergeWith3D ) {

					_gl.disable( _gl.DEPTH_TEST );
					mergeWith3D = false;

				}

				setBlending( object.blending );
				setTexture( object.map, 0 );

				_gl.drawElements( _gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0 );

			}

		}


		// restore gl

		_gl.enable( _gl.CULL_FACE );
		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthMask( _oldDepthWrite );

	}

	// Geometry splitting

	function sortFacesByMaterial ( geometry ) {

		var f, fl, face, materialIndex, vertices,
			materialHash, groupHash,
			hash_map = {};

		var numMorphTargets = geometry.morphTargets.length;

		geometry.geometryGroups = {};

		for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

			face = geometry.faces[ f ];
			materialIndex = face.materialIndex;

			materialHash = ( materialIndex !== undefined ) ? materialIndex : -1;

			if ( hash_map[ materialHash ] === undefined ) {

				hash_map[ materialHash ] = { 'hash': materialHash, 'counter': 0 };

			}

			groupHash = hash_map[ materialHash ].hash + '_' + hash_map[ materialHash ].counter;

			if ( geometry.geometryGroups[ groupHash ] === undefined ) {

				geometry.geometryGroups[ groupHash ] = { 'faces3': [], 'faces4': [], 'materialIndex': materialIndex, 'vertices': 0, 'numMorphTargets': numMorphTargets };

			}

			vertices = face instanceof THREE.Face3 ? 3 : 4;

			if ( geometry.geometryGroups[ groupHash ].vertices + vertices > 65535 ) {

				hash_map[ materialHash ].counter += 1;
				groupHash = hash_map[ materialHash ].hash + '_' + hash_map[ materialHash ].counter;

				if ( geometry.geometryGroups[ groupHash ] === undefined ) {

					geometry.geometryGroups[ groupHash ] = { 'faces3': [], 'faces4': [], 'materialIndex': materialIndex, 'vertices': 0, 'numMorphTargets': numMorphTargets };

				}

			}

			if ( face instanceof THREE.Face3 ) {

				geometry.geometryGroups[ groupHash ].faces3.push( f );

			} else {

				geometry.geometryGroups[ groupHash ].faces4.push( f );

			}

			geometry.geometryGroups[ groupHash ].vertices += vertices;

		}

		geometry.geometryGroupsList = [];

		for ( var g in geometry.geometryGroups ) {

			geometry.geometryGroups[ g ].id = _geometryGroupCounter ++;

			geometry.geometryGroupsList.push( geometry.geometryGroups[ g ] );

		}

	};

	// Objects refresh

	this.initWebGLObjects = function ( scene ) {

		if ( !scene.__webglObjects ) {

			scene.__webglObjects = [];
			scene.__webglObjectsImmediate = [];
			scene.__webglSprites = [];

		}

		while ( scene.__objectsAdded.length ) {

			addObject( scene.__objectsAdded[ 0 ], scene );
			scene.__objectsAdded.splice( 0, 1 );

		}

		while ( scene.__objectsRemoved.length ) {

			removeObject( scene.__objectsRemoved[ 0 ], scene );
			scene.__objectsRemoved.splice( 0, 1 );

		}

		// update must be called after objects adding / removal

		for ( var o = 0, ol = scene.__webglObjects.length; o < ol; o ++ ) {

			updateObject( scene.__webglObjects[ o ].object );

		}

	};

	// Objects adding

	function addObject ( object, scene ) {

		var g, geometry, geometryGroup;

		if ( ! object.__webglInit ) {

			object.__webglInit = true;

			object._modelViewMatrix = new THREE.Matrix4();

			object._normalMatrixArray = new Float32Array( 9 );
			object._modelViewMatrixArray = new Float32Array( 16 );
			object._objectMatrixArray = new Float32Array( 16 );

			object.matrixWorld.flattenToArray( object._objectMatrixArray );

			if ( object instanceof THREE.Mesh ) {

				geometry = object.geometry;

				if ( geometry.geometryGroups === undefined ) {

					sortFacesByMaterial( geometry );

				}

				// create separate VBOs per geometry chunk

				for ( g in geometry.geometryGroups ) {

					geometryGroup = geometry.geometryGroups[ g ];

					// initialise VBO on the first access

					if ( ! geometryGroup.__webglVertexBuffer ) {

						createMeshBuffers( geometryGroup );
						initMeshBuffers( geometryGroup, object );

						geometry.__dirtyVertices = true;
						geometry.__dirtyMorphTargets = true;
						geometry.__dirtyElements = true;
						geometry.__dirtyUvs = true;
						geometry.__dirtyNormals = true;
						geometry.__dirtyTangents = true;
						geometry.__dirtyColors = true;

					}

				}

			} else if ( object instanceof THREE.Ribbon ) {

				geometry = object.geometry;

				if( ! geometry.__webglVertexBuffer ) {

					createRibbonBuffers( geometry );
					initRibbonBuffers( geometry );

					geometry.__dirtyVertices = true;
					geometry.__dirtyColors = true;

				}

			} else if ( object instanceof THREE.Line ) {

				geometry = object.geometry;

				if( ! geometry.__webglVertexBuffer ) {

					createLineBuffers( geometry );
					initLineBuffers( geometry, object );

					geometry.__dirtyVertices = true;
					geometry.__dirtyColors = true;

				}

			} else if ( object instanceof THREE.ParticleSystem ) {

				geometry = object.geometry;

				if ( ! geometry.__webglVertexBuffer ) {

					createParticleBuffers( geometry );
					initParticleBuffers( geometry, object );

					geometry.__dirtyVertices = true;
					geometry.__dirtyColors = true;

				}

			}

		}

		if ( ! object.__webglActive ) {

			if ( object instanceof THREE.Mesh ) {

				geometry = object.geometry;

				for ( g in geometry.geometryGroups ) {

					geometryGroup = geometry.geometryGroups[ g ];

					addBuffer( scene.__webglObjects, geometryGroup, object );

				}

			} else if ( object instanceof THREE.Ribbon ||
						object instanceof THREE.Line ||
						object instanceof THREE.ParticleSystem ) {

				geometry = object.geometry;
				addBuffer( scene.__webglObjects, geometry, object );

			} else if ( THREE.MarchingCubes !== undefined && object instanceof THREE.MarchingCubes || object.immediateRenderCallback ) {

				addBufferImmediate( scene.__webglObjectsImmediate, object );

			} else if ( object instanceof THREE.Sprite ) {

				scene.__webglSprites.push( object );

			}

			object.__webglActive = true;

		}

	};

	function addBuffer ( objlist, buffer, object ) {

		objlist.push(
			{
				buffer: buffer,
				object: object,
				opaque: null,
				transparent: null
			}
		);

	};

	function addBufferImmediate ( objlist, object ) {

		objlist.push(
			{
				object: object,
				opaque: null,
				transparent: null
			}
		);

	};

	// Objects updates

	function updateObject ( object ) {

		var geometry = object.geometry,
			geometryGroup, customAttributesDirty, material;

		if ( object instanceof THREE.Mesh ) {

			// check all geometry groups

			for( var i = 0, il = geometry.geometryGroupsList.length; i < il; i ++ ) {

				geometryGroup = geometry.geometryGroupsList[ i ];

				material = getBufferMaterial( object, geometryGroup );

				customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

				if ( geometry.__dirtyVertices || geometry.__dirtyMorphTargets || geometry.__dirtyElements ||
					 geometry.__dirtyUvs || geometry.__dirtyNormals ||
					 geometry.__dirtyColors || geometry.__dirtyTangents || customAttributesDirty ) {

					setMeshBuffers( geometryGroup, object, _gl.DYNAMIC_DRAW, !geometry.dynamic, material );

				}

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyMorphTargets = false;
			geometry.__dirtyElements = false;
			geometry.__dirtyUvs = false;
			geometry.__dirtyNormals = false;
			geometry.__dirtyColors = false;
			geometry.__dirtyTangents = false;

			material.attributes && clearCustomAttributes( material );

		} else if ( object instanceof THREE.Ribbon ) {

			if ( geometry.__dirtyVertices || geometry.__dirtyColors ) {

				setRibbonBuffers( geometry, _gl.DYNAMIC_DRAW );

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyColors = false;

		} else if ( object instanceof THREE.Line ) {

			material = getBufferMaterial( object, geometryGroup );

			customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

			if ( geometry.__dirtyVertices ||  geometry.__dirtyColors || customAttributesDirty ) {

				setLineBuffers( geometry, _gl.DYNAMIC_DRAW );

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyColors = false;

			material.attributes && clearCustomAttributes( material );

		} else if ( object instanceof THREE.ParticleSystem ) {

			material = getBufferMaterial( object, geometryGroup );

			customAttributesDirty = material.attributes && areCustomAttributesDirty( material );

			if ( geometry.__dirtyVertices || geometry.__dirtyColors || object.sortParticles || customAttributesDirty ) {

				setParticleBuffers( geometry, _gl.DYNAMIC_DRAW, object );

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyColors = false;

			material.attributes && clearCustomAttributes( material );

		}

	};

	// Objects updates - custom attributes check

	function areCustomAttributesDirty ( material ) {

		for ( var a in material.attributes ) {

			if ( material.attributes[ a ].needsUpdate ) return true;

		}

		return false;

	};

	function clearCustomAttributes ( material ) {

		for ( var a in material.attributes ) {

			material.attributes[ a ].needsUpdate = false;

		}

	};

	// Objects removal

	function removeObject ( object, scene ) {

		if ( object instanceof THREE.Mesh  ||
			 object instanceof THREE.ParticleSystem ||
			 object instanceof THREE.Ribbon ||
			 object instanceof THREE.Line ) {

			removeInstances( scene.__webglObjects, object );

		} else if ( object instanceof THREE.Sprite ) {

			removeInstancesDirect( scene.__webglSprites, object );

		} else if ( object instanceof THREE.MarchingCubes || object.immediateRenderCallback ) {

			removeInstances( scene.__webglObjectsImmediate, object );

		}

		object.__webglActive = false;

	};

	function removeInstances ( objlist, object ) {

		for ( var o = objlist.length - 1; o >= 0; o -- ) {

			if ( objlist[ o ].object === object ) {

				objlist.splice( o, 1 );

			}

		}

	};

	function removeInstancesDirect ( objlist, object ) {

		for ( var o = objlist.length - 1; o >= 0; o -- ) {

			if ( objlist[ o ] === object ) {

				objlist.splice( o, 1 );

			}

		}

	};

	// Materials

	this.initMaterial = function ( material, lights, fog, object ) {

		var u, a, identifiers, i, parameters, maxLightCount, maxBones, maxShadows, shaderID;

		if ( material instanceof THREE.MeshDepthMaterial ) {

			shaderID = 'depth';

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			shaderID = 'normal';

		} else if ( material instanceof THREE.MeshBasicMaterial ) {

			shaderID = 'basic';

		} else if ( material instanceof THREE.MeshLambertMaterial ) {

			shaderID = 'lambert';

		} else if ( material instanceof THREE.MeshPhongMaterial ) {

			shaderID = 'phong';

		} else if ( material instanceof THREE.LineBasicMaterial ) {

			shaderID = 'basic';

		} else if ( material instanceof THREE.ParticleBasicMaterial ) {

			shaderID = 'particle_basic';

		}

		if ( shaderID ) {

			setMaterialShaders( material, THREE.ShaderLib[ shaderID ] );

		}

		// heuristics to create shader parameters according to lights in the scene
		// (not to blow over maxLights budget)

		maxLightCount = allocateLights( lights );

		maxShadows = allocateShadows( lights );

		maxBones = allocateBones( object );

		parameters = {

			map: !!material.map, envMap: !!material.envMap, lightMap: !!material.lightMap,
			vertexColors: material.vertexColors,
			fog: fog, useFog: material.fog,
			sizeAttenuation: material.sizeAttenuation,
			skinning: material.skinning,
			morphTargets: material.morphTargets,
			maxMorphTargets: this.maxMorphTargets,
			maxDirLights: maxLightCount.directional, maxPointLights: maxLightCount.point,
			maxBones: maxBones,
			shadowMapEnabled: this.shadowMapEnabled && object.receiveShadow,
			shadowMapSoft: this.shadowMapSoft,
			shadowMapWidth: this.shadowMapWidth,
			shadowMapHeight: this.shadowMapHeight,
			maxShadows: maxShadows,
			alphaTest: material.alphaTest,
			metal: material.metal,
			perPixel: material.perPixel

		};

		material.program = buildProgram( shaderID, material.fragmentShader, material.vertexShader, material.uniforms, material.attributes, parameters );

		var attributes = material.program.attributes;

		if ( attributes.position >= 0 ) _gl.enableVertexAttribArray( attributes.position );
		if ( attributes.color >= 0 ) _gl.enableVertexAttribArray( attributes.color );
		if ( attributes.normal >= 0 ) _gl.enableVertexAttribArray( attributes.normal );
		if ( attributes.tangent >= 0 ) _gl.enableVertexAttribArray( attributes.tangent );

		if ( material.skinning &&
			 attributes.skinVertexA >=0 && attributes.skinVertexB >= 0 &&
			 attributes.skinIndex >= 0 && attributes.skinWeight >= 0 ) {

			_gl.enableVertexAttribArray( attributes.skinVertexA );
			_gl.enableVertexAttribArray( attributes.skinVertexB );
			_gl.enableVertexAttribArray( attributes.skinIndex );
			_gl.enableVertexAttribArray( attributes.skinWeight );

		}

		if ( material.attributes ) {

			for ( a in material.attributes ) {

				if( attributes[ a ] !== undefined && attributes[ a ] >= 0 ) _gl.enableVertexAttribArray( attributes[ a ] );

			}

		}

		if ( material.morphTargets ) {

			material.numSupportedMorphTargets = 0;

			var id, base = "morphTarget";

			for ( i = 0; i < this.maxMorphTargets; i ++ ) {

				id = base + i;

				if ( attributes[ id ] >= 0 ) {

					_gl.enableVertexAttribArray( attributes[ id ] );
					material.numSupportedMorphTargets ++;

				}

			}

		}

		material.uniformsList = [];

		for ( u in material.uniforms ) {

			material.uniformsList.push( [ material.uniforms[ u ], u ] );

		}

	};

	function setMaterialShaders ( material, shaders ) {

		material.uniforms = THREE.UniformsUtils.clone( shaders.uniforms );
		material.vertexShader = shaders.vertexShader;
		material.fragmentShader = shaders.fragmentShader;

	};

	function setProgram ( camera, lights, fog, material, object ) {

		if ( ! material.program ) {

			_this.initMaterial( material, lights, fog, object );

		}

		if ( material.morphTargets ) {

			if ( ! object.__webglMorphTargetInfluences ) {

				object.__webglMorphTargetInfluences = new Float32Array( _this.maxMorphTargets );

				for ( var i = 0, il = _this.maxMorphTargets; i < il; i ++ ) {

					object.__webglMorphTargetInfluences[ i ] = 0;

				}

			}

		}

		var refreshMaterial = false;

		var program = material.program,
			p_uniforms = program.uniforms,
			m_uniforms = material.uniforms;

		if ( program !== _currentProgram ) {

			_gl.useProgram( program );
			_currentProgram = program;

			refreshMaterial = true;

		}

		if ( material.id !== _currentMaterialId ) {

			_currentMaterialId = material.id;
			refreshMaterial = true;

		}

		if ( refreshMaterial ) {

			_gl.uniformMatrix4fv( p_uniforms.projectionMatrix, false, _projectionMatrixArray );

			// refresh uniforms common to several materials

			if ( fog && material.fog ) {

				refreshUniformsFog( m_uniforms, fog );

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material.lights ) {

				setupLights( program, lights );
				refreshUniformsLights( m_uniforms, _lights );

			}

			if ( material instanceof THREE.MeshBasicMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsCommon( m_uniforms, material );

			}

			// refresh single material specific uniforms

			if ( material instanceof THREE.LineBasicMaterial ) {

				refreshUniformsLine( m_uniforms, material );

			} else if ( material instanceof THREE.ParticleBasicMaterial ) {

				refreshUniformsParticle( m_uniforms, material );

			} else if ( material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsPhong( m_uniforms, material );

			} else if ( material instanceof THREE.MeshLambertMaterial ) {

				refreshUniformsLambert( m_uniforms, material );

			} else if ( material instanceof THREE.MeshDepthMaterial ) {

				m_uniforms.mNear.value = camera.near;
				m_uniforms.mFar.value = camera.far;
				m_uniforms.opacity.value = material.opacity;

			} else if ( material instanceof THREE.MeshNormalMaterial ) {

				m_uniforms.opacity.value = material.opacity;

			}

			if ( object.receiveShadow && ! material._shadowPass ) {

				refreshUniformsShadow( m_uniforms, material );

			}

			// load common uniforms

			loadUniformsGeneric( program, material.uniformsList );

			// load material specific uniforms
			// (shader material also gets them for the sake of genericity)

			if ( material instanceof THREE.ShaderMaterial ||
				 material instanceof THREE.MeshPhongMaterial ||
				 material.envMap ) {

				if( p_uniforms.cameraPosition !== null ) {

					_gl.uniform3f( p_uniforms.cameraPosition, camera.position.x, camera.position.y, camera.position.z );

				}

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.ShaderMaterial ||
				 material.skinning ) {

				if( p_uniforms.viewMatrix !== null ) {

					_gl.uniformMatrix4fv( p_uniforms.viewMatrix, false, _viewMatrixArray );

				}

			}

			if ( material.skinning ) {

				loadUniformsSkinning( p_uniforms, object );

			}

		}

		loadUniformsMatrices( p_uniforms, object );

		if ( material instanceof THREE.ShaderMaterial ||
			 material.envMap ||
			 material.skinning ||
			 object.receiveShadow ) {

			if ( p_uniforms.objectMatrix !== null ) {

				_gl.uniformMatrix4fv( p_uniforms.objectMatrix, false, object._objectMatrixArray );

			}

		}

		return program;

	};

	// Uniforms (refresh uniforms objects)

	function refreshUniformsCommon ( uniforms, material ) {

		uniforms.opacity.value = material.opacity;

		if ( _this.gammaInput ) {

			uniforms.diffuse.value.copyGammaToLinear( material.color );

		} else {

			uniforms.diffuse.value = material.color;

		}

		uniforms.map.texture = material.map;

		if ( material.map ) {

			uniforms.offsetRepeat.value.set( material.map.offset.x, material.map.offset.y, material.map.repeat.x, material.map.repeat.y );

		}

		uniforms.lightMap.texture = material.lightMap;

		uniforms.envMap.texture = material.envMap;
		uniforms.flipEnvMap.value = ( material.envMap instanceof THREE.WebGLRenderTargetCube ) ? 1 : -1;

		if ( _this.gammaInput ) {

			//uniforms.reflectivity.value = material.reflectivity * material.reflectivity;
			uniforms.reflectivity.value = material.reflectivity;

		} else {

			uniforms.reflectivity.value = material.reflectivity;

		}

		uniforms.refractionRatio.value = material.refractionRatio;
		uniforms.combine.value = material.combine;
		uniforms.useRefract.value = material.envMap && material.envMap.mapping instanceof THREE.CubeRefractionMapping;

	};

	function refreshUniformsLine ( uniforms, material ) {

		uniforms.diffuse.value = material.color;
		uniforms.opacity.value = material.opacity;

	};

	function refreshUniformsParticle ( uniforms, material ) {

		uniforms.psColor.value = material.color;
		uniforms.opacity.value = material.opacity;
		uniforms.size.value = material.size;
		uniforms.scale.value = _canvas.height / 2.0; // TODO: Cache this.

		uniforms.map.texture = material.map;

	};

	function refreshUniformsFog ( uniforms, fog ) {

		uniforms.fogColor.value = fog.color;

		if ( fog instanceof THREE.Fog ) {

			uniforms.fogNear.value = fog.near;
			uniforms.fogFar.value = fog.far;

		} else if ( fog instanceof THREE.FogExp2 ) {

			uniforms.fogDensity.value = fog.density;

		}

	};

	function refreshUniformsPhong ( uniforms, material ) {

		uniforms.shininess.value = material.shininess;

		if ( _this.gammaInput ) {

			uniforms.ambient.value.copyGammaToLinear( material.ambient );
			uniforms.specular.value.copyGammaToLinear( material.specular );

		} else {

			uniforms.ambient.value = material.ambient;
			uniforms.specular.value = material.specular;

		}

	};

	function refreshUniformsLambert ( uniforms, material ) {

		if ( _this.gammaInput ) {

			uniforms.ambient.value.copyGammaToLinear( material.ambient );

		} else {

			uniforms.ambient.value = material.ambient;

		}

	};

	function refreshUniformsLights ( uniforms, lights ) {

		uniforms.ambientLightColor.value = lights.ambient;

		uniforms.directionalLightColor.value = lights.directional.colors;
		uniforms.directionalLightDirection.value = lights.directional.positions;

		uniforms.pointLightColor.value = lights.point.colors;
		uniforms.pointLightPosition.value = lights.point.positions;
		uniforms.pointLightDistance.value = lights.point.distances;

	};

	function refreshUniformsShadow ( uniforms, material ) {

		if ( uniforms.shadowMatrix ) {

			for ( var i = 0; i < _shadowMatrix.length; i ++ ) {

				uniforms.shadowMatrix.value[ i ] = _shadowMatrix[ i ];
				uniforms.shadowMap.texture[ i ] = _this.shadowMap[ i ];


			}

			uniforms.shadowDarkness.value = _this.shadowMapDarkness;
			uniforms.shadowBias.value = _this.shadowMapBias;

		}

	};

	// Uniforms (load to GPU)

	function loadUniformsSkinning ( uniforms, object ) {

		_gl.uniformMatrix4fv( uniforms.cameraInverseMatrix, false, _viewMatrixArray );
		_gl.uniformMatrix4fv( uniforms.boneGlobalMatrices, false, object.boneMatrices );

	};


	function loadUniformsMatrices ( uniforms, object ) {

		_gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, object._modelViewMatrixArray );

		if ( uniforms.normalMatrix ) {

			_gl.uniformMatrix3fv( uniforms.normalMatrix, false, object._normalMatrixArray );

		}

	};

	function loadUniformsGeneric ( program, uniforms ) {

		var uniform, value, type, location, texture, i, il, j, jl, offset;

		for( j = 0, jl = uniforms.length; j < jl; j ++ ) {

			location = program.uniforms[ uniforms[ j ][ 1 ] ];
			if ( !location ) continue;

			uniform = uniforms[ j ][ 0 ];

			type = uniform.type;
			value = uniform.value;

			// single integer

			if( type === "i" ) {

				_gl.uniform1i( location, value );

			// single float

			} else if( type === "f" ) {

				_gl.uniform1f( location, value );

			// single THREE.Vector2

			} else if( type === "v2" ) {

				_gl.uniform2f( location, value.x, value.y );

			// single THREE.Vector3

			} else if( type === "v3" ) {

				_gl.uniform3f( location, value.x, value.y, value.z );

			// single THREE.Vector4

			} else if( type === "v4" ) {

				_gl.uniform4f( location, value.x, value.y, value.z, value.w );

			// single THREE.Color

			} else if( type === "c" ) {

				_gl.uniform3f( location, value.r, value.g, value.b );

			// flat array of floats (JS or typed array)

			} else if( type === "fv1" ) {

				_gl.uniform1fv( location, value );

			// flat array of floats with 3 x N size (JS or typed array)

			} else if( type === "fv" ) {

				_gl.uniform3fv( location, value );

			// array of THREE.Vector3

			} else if( type === "v3v" ) {

				if ( ! uniform._array ) {

					uniform._array = new Float32Array( 3 * value.length );

				}

				for ( i = 0, il = value.length; i < il; i ++ ) {

					offset = i * 3;

					uniform._array[ offset ] 	 = value[ i ].x;
					uniform._array[ offset + 1 ] = value[ i ].y;
					uniform._array[ offset + 2 ] = value[ i ].z;

				}

				_gl.uniform3fv( location, uniform._array );

			// single THREE.Matrix4

			} else if( type === "m4" ) {

				if ( ! uniform._array ) {

					uniform._array = new Float32Array( 16 );

				}

				value.flattenToArray( uniform._array );
				_gl.uniformMatrix4fv( location, false, uniform._array );

			// array of THREE.Matrix4

			} else if( type === "m4v" ) {

				if ( ! uniform._array ) {

					uniform._array = new Float32Array( 16 * value.length );

				}

				for ( i = 0, il = value.length; i < il; i ++ ) {

					value[ i ].flattenToArrayOffset( uniform._array, i * 16 );

				}

				_gl.uniformMatrix4fv( location, false, uniform._array );


			// single THREE.Texture (2d or cube)

			} else if( type === "t" ) {

				_gl.uniform1i( location, value );

				texture = uniform.texture;

				if ( !texture ) continue;

				if ( texture.image instanceof Array && texture.image.length === 6 ) {

					setCubeTexture( texture, value );

				} else if ( texture instanceof THREE.WebGLRenderTargetCube ) {

					setCubeTextureDynamic( texture, value );

				} else {

					setTexture( texture, value );

				}

			// array of THREE.Texture (2d)

			} else if( type === "tv" ) {

				if ( ! uniform._array ) {

					uniform._array = [];

					for( i = 0, il = uniform.texture.length; i < il; i ++ ) {

						uniform._array[ i ] = value + i;

					}

				}

				_gl.uniform1iv( location, uniform._array );

				for( i = 0, il = uniform.texture.length; i < il; i ++ ) {

					texture = uniform.texture[ i ];

					if ( !texture ) continue;

					setTexture( texture, uniform._array[ i ] );

				}

			}

		}

	};

	function setupMatrices ( object, camera, computeNormalMatrix ) {

		object._modelViewMatrix.multiplyToArray( camera.matrixWorldInverse, object.matrixWorld, object._modelViewMatrixArray );

		if ( computeNormalMatrix ) {

			THREE.Matrix4.makeInvert3x3( object._modelViewMatrix ).transposeIntoArray( object._normalMatrixArray );

		}

	};

	function setupLights ( program, lights ) {

		var l, ll, light, n,
		r = 0, g = 0, b = 0,
		color, position, intensity, distance,

		zlights = _lights,

		dcolors = zlights.directional.colors,
		dpositions = zlights.directional.positions,

		pcolors = zlights.point.colors,
		ppositions = zlights.point.positions,
		pdistances = zlights.point.distances,

		dlength = 0,
		plength = 0,

		doffset = 0,
		poffset = 0;

		for ( l = 0, ll = lights.length; l < ll; l ++ ) {

			light = lights[ l ];
			color = light.color;

			position = light.position;
			intensity = light.intensity;
			distance = light.distance;

			if ( light instanceof THREE.AmbientLight ) {

				if ( _this.gammaInput ) {

					r += color.r * color.r;
					g += color.g * color.g;
					b += color.b * color.b;

				} else {

					r += color.r;
					g += color.g;
					b += color.b;

				}

			} else if ( light instanceof THREE.DirectionalLight ) {

				doffset = dlength * 3;

				if ( _this.gammaInput ) {

					dcolors[ doffset ]     = color.r * color.r * intensity * intensity;
					dcolors[ doffset + 1 ] = color.g * color.g * intensity * intensity;
					dcolors[ doffset + 2 ] = color.b * color.b * intensity * intensity;

				} else {

					dcolors[ doffset ]     = color.r * intensity;
					dcolors[ doffset + 1 ] = color.g * intensity;
					dcolors[ doffset + 2 ] = color.b * intensity;

				}

				dpositions[ doffset ]     = position.x;
				dpositions[ doffset + 1 ] = position.y;
				dpositions[ doffset + 2 ] = position.z;

				dlength += 1;

			} else if ( light instanceof THREE.SpotLight ) { // hack, not a proper spotlight

				doffset = dlength * 3;

				if ( _this.gammaInput ) {

					dcolors[ doffset ]     = color.r * color.r * intensity * intensity;
					dcolors[ doffset + 1 ] = color.g * color.g * intensity * intensity;
					dcolors[ doffset + 2 ] = color.b * color.b * intensity * intensity;

				} else {

					dcolors[ doffset ]     = color.r * intensity;
					dcolors[ doffset + 1 ] = color.g * intensity;
					dcolors[ doffset + 2 ] = color.b * intensity;

				}

				n = 1 / position.length();

				dpositions[ doffset ]     = position.x * n;
				dpositions[ doffset + 1 ] = position.y * n;
				dpositions[ doffset + 2 ] = position.z * n;

				dlength += 1;

			} else if( light instanceof THREE.PointLight ) {

				poffset = plength * 3;

				if ( _this.gammaInput ) {

					pcolors[ poffset ]     = color.r * color.r * intensity * intensity;
					pcolors[ poffset + 1 ] = color.g * color.g * intensity * intensity;
					pcolors[ poffset + 2 ] = color.b * color.b * intensity * intensity;

				} else {

					pcolors[ poffset ]     = color.r * intensity;
					pcolors[ poffset + 1 ] = color.g * intensity;
					pcolors[ poffset + 2 ] = color.b * intensity;

				}

				ppositions[ poffset ]     = position.x;
				ppositions[ poffset + 1 ] = position.y;
				ppositions[ poffset + 2 ] = position.z;

				pdistances[ plength ] = distance;

				plength += 1;

			}

		}

		// null eventual remains from removed lights
		// (this is to avoid if in shader)

		for ( l = dlength * 3, ll = dcolors.length; l < ll; l ++ ) dcolors[ l ] = 0.0;
		for ( l = plength * 3, ll = pcolors.length; l < ll; l ++ ) pcolors[ l ] = 0.0;

		zlights.point.length = plength;
		zlights.directional.length = dlength;

		zlights.ambient[ 0 ] = r;
		zlights.ambient[ 1 ] = g;
		zlights.ambient[ 2 ] = b;

	};

	// GL state setting

	this.setFaceCulling = function ( cullFace, frontFace ) {

		if ( cullFace ) {

			if ( !frontFace || frontFace === "ccw" ) {

				_gl.frontFace( _gl.CCW );

			} else {

				_gl.frontFace( _gl.CW );

			}

			if( cullFace === "back" ) {

				_gl.cullFace( _gl.BACK );

			} else if( cullFace === "front" ) {

				_gl.cullFace( _gl.FRONT );

			} else {

				_gl.cullFace( _gl.FRONT_AND_BACK );

			}

			_gl.enable( _gl.CULL_FACE );

		} else {

			_gl.disable( _gl.CULL_FACE );

		}

	};

	function setLineWidth ( width ) {

		if ( width !== _oldLineWidth ) {

			_gl.lineWidth( width );

			_oldLineWidth = width;

		}

	};

	function setObjectFaces ( object ) {

		if ( _oldDoubleSided !== object.doubleSided ) {

			if( object.doubleSided ) {

				_gl.disable( _gl.CULL_FACE );

			} else {

				_gl.enable( _gl.CULL_FACE );

			}

			_oldDoubleSided = object.doubleSided;

		}

		if ( _oldFlipSided !== object.flipSided ) {

			if( object.flipSided ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			_oldFlipSided = object.flipSided;

		}

	};

	function setDepthTest ( depthTest ) {

		if ( _oldDepthTest !== depthTest ) {

			if( depthTest ) {

				_gl.enable( _gl.DEPTH_TEST );

			} else {

				_gl.disable( _gl.DEPTH_TEST );

			}

			_oldDepthTest = depthTest;

		}

	};

	function setDepthWrite ( depthWrite ) {

		if ( _oldDepthWrite !== depthWrite ) {

			_gl.depthMask( depthWrite );
			_oldDepthWrite = depthWrite;

		}

	};

	function setPolygonOffset ( polygonoffset, factor, units ) {

		if ( _oldPolygonOffset !== polygonoffset ) {

			if ( polygonoffset ) {

				_gl.enable( _gl.POLYGON_OFFSET_FILL );

			} else {

				_gl.disable( _gl.POLYGON_OFFSET_FILL );

			}

			_oldPolygonOffset = polygonoffset;

		}

		if ( polygonoffset && ( _oldPolygonOffsetFactor !== factor || _oldPolygonOffsetUnits !== units ) ) {

			_gl.polygonOffset( factor, units );

			_oldPolygonOffsetFactor = factor;
			_oldPolygonOffsetUnits = units;

		}

	};

	function setBlending ( blending ) {

		if ( blending !== _oldBlending ) {

			switch ( blending ) {

				case THREE.AdditiveBlending:

					_gl.blendEquation( _gl.FUNC_ADD );
					_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE );

					break;

				case THREE.SubtractiveBlending:

					// TODO: Find blendFuncSeparate() combination

					_gl.blendEquation( _gl.FUNC_ADD );
					_gl.blendFunc( _gl.ZERO, _gl.ONE_MINUS_SRC_COLOR );

					break;

				case THREE.MultiplyBlending:

					// TODO: Find blendFuncSeparate() combination

					_gl.blendEquation( _gl.FUNC_ADD );
					_gl.blendFunc( _gl.ZERO, _gl.SRC_COLOR );

					break;

				default:

					_gl.blendEquationSeparate( _gl.FUNC_ADD, _gl.FUNC_ADD );
					_gl.blendFuncSeparate( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA );

					break;

			}

			_oldBlending = blending;

		}

	};

	// Shaders

	function buildProgram ( shaderID, fragmentShader, vertexShader, uniforms, attributes, parameters ) {

		var p, pl, program, code;
		var chunks = [];

		// Generate code

		if ( shaderID ) {

			chunks.push( shaderID );

		} else {

			chunks.push( fragmentShader );
			chunks.push( vertexShader );

		}

		for ( p in parameters ) {

			chunks.push( p );
			chunks.push( parameters[ p ] );

		}

		code = chunks.join();

		// Check if code has been already compiled

		for ( p = 0, pl = _programs.length; p < pl; p ++ ) {

			if ( _programs[ p ].code === code ) {

				// console.log( "Code already compiled." /*: \n\n" + code*/ );

				return _programs[ p ].program;

			}

		}

		//console.log( "building new program " );

		//

		program = _gl.createProgram();

		var prefix_vertex = [

			_supportsVertexTextures ? "#define VERTEX_TEXTURES" : "",

			_this.gammaInput ? "#define GAMMA_INPUT" : "",
			_this.gammaOutput ? "#define GAMMA_OUTPUT" : "",
			_this.physicallyBasedShading ? "#define PHYSICALLY_BASED_SHADING" : "",

			"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
			"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,

			"#define MAX_SHADOWS " + parameters.maxShadows,

			"#define MAX_BONES " + parameters.maxBones,

			parameters.map ? "#define USE_MAP" : "",
			parameters.envMap ? "#define USE_ENVMAP" : "",
			parameters.lightMap ? "#define USE_LIGHTMAP" : "",
			parameters.vertexColors ? "#define USE_COLOR" : "",
			parameters.skinning ? "#define USE_SKINNING" : "",
			parameters.morphTargets ? "#define USE_MORPHTARGETS" : "",
			parameters.perPixel ? "#define PHONG_PER_PIXEL" : "",

			parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
			parameters.shadowMapSoft ? "#define SHADOWMAP_SOFT" : "",

			parameters.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",

			"uniform mat4 objectMatrix;",
			"uniform mat4 modelViewMatrix;",
			"uniform mat4 projectionMatrix;",
			"uniform mat4 viewMatrix;",
			"uniform mat3 normalMatrix;",
			"uniform vec3 cameraPosition;",

			"uniform mat4 cameraInverseMatrix;",

			"attribute vec3 position;",
			"attribute vec3 normal;",
			"attribute vec2 uv;",
			"attribute vec2 uv2;",

			"#ifdef USE_COLOR",

				"attribute vec3 color;",

			"#endif",

			"#ifdef USE_MORPHTARGETS",

				"attribute vec3 morphTarget0;",
				"attribute vec3 morphTarget1;",
				"attribute vec3 morphTarget2;",
				"attribute vec3 morphTarget3;",
				"attribute vec3 morphTarget4;",
				"attribute vec3 morphTarget5;",
				"attribute vec3 morphTarget6;",
				"attribute vec3 morphTarget7;",

			"#endif",

			"#ifdef USE_SKINNING",

				"attribute vec4 skinVertexA;",
				"attribute vec4 skinVertexB;",
				"attribute vec4 skinIndex;",
				"attribute vec4 skinWeight;",

			"#endif",

			""

		].join("\n");

		var prefix_fragment = [

			"#ifdef GL_ES",
			"precision " + _precision + " float;",
			"#endif",

			"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
			"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,

			"#define MAX_SHADOWS " + parameters.maxShadows,

			parameters.alphaTest ? "#define ALPHATEST " + parameters.alphaTest: "",

			_this.gammaInput ? "#define GAMMA_INPUT" : "",
			_this.gammaOutput ? "#define GAMMA_OUTPUT" : "",
			_this.physicallyBasedShading ? "#define PHYSICALLY_BASED_SHADING" : "",

			( parameters.useFog && parameters.fog ) ? "#define USE_FOG" : "",
			( parameters.useFog && parameters.fog instanceof THREE.FogExp2 ) ? "#define FOG_EXP2" : "",

			parameters.map ? "#define USE_MAP" : "",
			parameters.envMap ? "#define USE_ENVMAP" : "",
			parameters.lightMap ? "#define USE_LIGHTMAP" : "",
			parameters.vertexColors ? "#define USE_COLOR" : "",

			parameters.metal ? "#define METAL" : "",
			parameters.perPixel ? "#define PHONG_PER_PIXEL" : "",

			parameters.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
			parameters.shadowMapSoft ? "#define SHADOWMAP_SOFT" : "",
			parameters.shadowMapSoft ? "#define SHADOWMAP_WIDTH " + parameters.shadowMapWidth.toFixed( 1 ) : "",
			parameters.shadowMapSoft ? "#define SHADOWMAP_HEIGHT " + parameters.shadowMapHeight.toFixed( 1 ) : "",

			"uniform mat4 viewMatrix;",
			"uniform vec3 cameraPosition;",
			""

		].join("\n");

		_gl.attachShader( program, getShader( "fragment", prefix_fragment + fragmentShader ) );
		_gl.attachShader( program, getShader( "vertex", prefix_vertex + vertexShader ) );

		_gl.linkProgram( program );

		if ( !_gl.getProgramParameter( program, _gl.LINK_STATUS ) ) {

			console.error( "Could not initialise shader\n" + "VALIDATE_STATUS: " + _gl.getProgramParameter( program, _gl.VALIDATE_STATUS ) + ", gl error [" + _gl.getError() + "]" );

		}

		//console.log( prefix_fragment + fragmentShader );
		//console.log( prefix_vertex + vertexShader );

		program.uniforms = {};
		program.attributes = {};

		var identifiers, u, a, i;

		// cache uniform locations

		identifiers = [

			'viewMatrix', 'modelViewMatrix', 'projectionMatrix', 'normalMatrix', 'objectMatrix', 'cameraPosition',
			'cameraInverseMatrix', 'boneGlobalMatrices', 'morphTargetInfluences'

		];

		for ( u in uniforms ) {

			identifiers.push( u );

		}

		cacheUniformLocations( program, identifiers );

		// cache attributes locations

		identifiers = [

			"position", "normal", "uv", "uv2", "tangent", "color",
			"skinVertexA", "skinVertexB", "skinIndex", "skinWeight"

		];

		for ( i = 0; i < parameters.maxMorphTargets; i ++ ) {

			identifiers.push( "morphTarget" + i );

		}

		for ( a in attributes ) {

			identifiers.push( a );

		}

		cacheAttributeLocations( program, identifiers );

		program.id = _programs.length;

		_programs.push( { program: program, code: code } );

		_this.info.memory.programs = _programs.length;

		return program;

	};

	// Shader parameters cache

	function cacheUniformLocations ( program, identifiers ) {

		var i, l, id;

		for( i = 0, l = identifiers.length; i < l; i++ ) {

			id = identifiers[ i ];
			program.uniforms[ id ] = _gl.getUniformLocation( program, id );

		}

	};

	function cacheAttributeLocations ( program, identifiers ) {

		var i, l, id;

		for( i = 0, l = identifiers.length; i < l; i++ ) {

			id = identifiers[ i ];
			program.attributes[ id ] = _gl.getAttribLocation( program, id );

		}

	};

	function getShader ( type, string ) {

		var shader;

		if ( type === "fragment" ) {

			shader = _gl.createShader( _gl.FRAGMENT_SHADER );

		} else if ( type === "vertex" ) {

			shader = _gl.createShader( _gl.VERTEX_SHADER );

		}

		_gl.shaderSource( shader, string );
		_gl.compileShader( shader );

		if ( !_gl.getShaderParameter( shader, _gl.COMPILE_STATUS ) ) {

			console.error( _gl.getShaderInfoLog( shader ) );
			console.error( string );
			return null;

		}

		return shader;

	};

	// Textures

	function setTextureParameters ( textureType, texture, image ) {

		if ( isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ) ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL( texture.wrapS ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL( texture.wrapT ) );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( texture.minFilter ) );

			return true;

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

			return false;

		}

	};

	function setTexture ( texture, slot ) {

		if ( texture.needsUpdate ) {

			if ( ! texture.__webglInit ) {

				texture.__webglInit = true;
				texture.__webglTexture = _gl.createTexture();

				_this.info.memory.textures ++;

			}

			_gl.activeTexture( _gl.TEXTURE0 + slot );
			_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

			var needsMipMaps = setTextureParameters( _gl.TEXTURE_2D, texture, texture.image );

			if ( texture instanceof THREE.DataTexture ) {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, paramThreeToGL( texture.format ), texture.image.width, texture.image.height, 0, paramThreeToGL( texture.format ), _gl.UNSIGNED_BYTE, texture.image.data );

			} else {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, texture.image );

			}

			if ( needsMipMaps ) {

				_gl.generateMipmap( _gl.TEXTURE_2D );

			}

			texture.needsUpdate = false;

			if ( texture.onUpdated ) texture.onUpdated();

		} else {

			_gl.activeTexture( _gl.TEXTURE0 + slot );
			_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

		}

	};

	function setCubeTexture ( texture, slot ) {

		if ( texture.image.length === 6 ) {

			if ( texture.needsUpdate ) {

				if ( ! texture.image.__webglTextureCube ) {

					texture.image.__webglTextureCube = _gl.createTexture();

				}

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

				var needsMipMaps = setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, texture.image[ 0 ] );

				for ( var i = 0; i < 6; i ++ ) {

					_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, texture.image[ i ] );

				}

				if ( needsMipMaps ) {

					_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

				}

				texture.needsUpdate = false;

			} else {

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

			}

		}

	};

	function setCubeTextureDynamic ( texture, slot ) {

		_gl.activeTexture( _gl.TEXTURE0 + slot );
		_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.__webglTexture );

	};

	// Render targets

	function setupFrameBuffer ( framebuffer, renderTarget, textureTarget ) {

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, textureTarget, renderTarget.__webglTexture, 0 );

	};

	function setupRenderBuffer ( renderbuffer, renderTarget  ) {

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

		if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		/* For some reason this is not working. Defaulting to RGBA4.
		} else if( ! renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.STENCIL_INDEX8, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );
		*/
		} else if( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height );

		}

	};

	function setRenderTarget ( renderTarget ) {

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );

		if ( renderTarget && ! renderTarget.__webglFramebuffer ) {

			if( renderTarget.depthBuffer === undefined ) renderTarget.depthBuffer = true;
			if( renderTarget.stencilBuffer === undefined ) renderTarget.stencilBuffer = true;

			renderTarget.__webglTexture = _gl.createTexture();

			// Setup texture, create render and frame buffers

			if ( isCube ) {

				renderTarget.__webglFramebuffer = [];
				renderTarget.__webglRenderbuffer = [];

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_CUBE_MAP, renderTarget, renderTarget );

				for ( var i = 0; i < 6; i ++ ) {

					renderTarget.__webglFramebuffer[ i ] = _gl.createFramebuffer();
					renderTarget.__webglRenderbuffer[ i ] = _gl.createRenderbuffer();

					_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, paramThreeToGL( renderTarget.format ), renderTarget.width, renderTarget.height, 0, paramThreeToGL( renderTarget.format ), paramThreeToGL( renderTarget.type ), null );

					setupFrameBuffer( renderTarget.__webglFramebuffer[ i ], renderTarget, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i );
					setupRenderBuffer( renderTarget.__webglRenderbuffer[ i ], renderTarget );

				}

			} else {

				renderTarget.__webglFramebuffer = _gl.createFramebuffer();
				renderTarget.__webglRenderbuffer = _gl.createRenderbuffer();

				_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_2D, renderTarget, renderTarget );

				_gl.texImage2D( _gl.TEXTURE_2D, 0, paramThreeToGL( renderTarget.format ), renderTarget.width, renderTarget.height, 0, paramThreeToGL( renderTarget.format ), paramThreeToGL( renderTarget.type ), null );

				setupFrameBuffer( renderTarget.__webglFramebuffer, renderTarget, _gl.TEXTURE_2D );
				setupRenderBuffer( renderTarget.__webglRenderbuffer, renderTarget );

			}

			// Release everything

			if ( isCube ) {

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

			} else {

				_gl.bindTexture( _gl.TEXTURE_2D, null );

			}

			_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );
			_gl.bindFramebuffer( _gl.FRAMEBUFFER, null);

		}

		var framebuffer, width, height, vx, vy;

		if ( renderTarget ) {

			if ( isCube ) {

				framebuffer = renderTarget.__webglFramebuffer[ renderTarget.activeCubeFace ];

			} else {

				framebuffer = renderTarget.__webglFramebuffer;

			}

			width = renderTarget.width;
			height = renderTarget.height;

			vx = 0;
			vy = 0;

		} else {

			framebuffer = null;

			width = _viewportWidth;
			height = _viewportHeight;

			vx = _viewportX;
			vy = _viewportY;

		}

		if ( framebuffer !== _currentFramebuffer ) {

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
			_gl.viewport( vx, vy, width, height );

			_currentFramebuffer = framebuffer;

		}

	};

	function updateRenderTargetMipmap ( renderTarget ) {

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );
			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

		} else {

			_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_2D );
			_gl.bindTexture( _gl.TEXTURE_2D, null );

		}

	};

	// fallback filters for non-power-of-2 textures

	function filterFallback ( f ) {

		switch ( f ) {

			case THREE.NearestFilter:
			case THREE.NearestMipMapNearestFilter:
			case THREE.NearestMipMapLinearFilter: return _gl.NEAREST; break;

			case THREE.LinearFilter:
			case THREE.LinearMipMapNearestFilter:
			case THREE.LinearMipMapLinearFilter:
			default:

				return _gl.LINEAR; break;

		}

	};

	function paramThreeToGL ( p ) {

		switch ( p ) {

			case THREE.RepeatWrapping: return _gl.REPEAT; break;
			case THREE.ClampToEdgeWrapping: return _gl.CLAMP_TO_EDGE; break;
			case THREE.MirroredRepeatWrapping: return _gl.MIRRORED_REPEAT; break;

			case THREE.NearestFilter: return _gl.NEAREST; break;
			case THREE.NearestMipMapNearestFilter: return _gl.NEAREST_MIPMAP_NEAREST; break;
			case THREE.NearestMipMapLinearFilter: return _gl.NEAREST_MIPMAP_LINEAR; break;

			case THREE.LinearFilter: return _gl.LINEAR; break;
			case THREE.LinearMipMapNearestFilter: return _gl.LINEAR_MIPMAP_NEAREST; break;
			case THREE.LinearMipMapLinearFilter: return _gl.LINEAR_MIPMAP_LINEAR; break;

			case THREE.ByteType: return _gl.BYTE; break;
			case THREE.UnsignedByteType: return _gl.UNSIGNED_BYTE; break;
			case THREE.ShortType: return _gl.SHORT; break;
			case THREE.UnsignedShortType: return _gl.UNSIGNED_SHORT; break;
			case THREE.IntType: return _gl.INT; break;
			case THREE.UnsignedShortType: return _gl.UNSIGNED_INT; break;
			case THREE.FloatType: return _gl.FLOAT; break;

			case THREE.AlphaFormat: return _gl.ALPHA; break;
			case THREE.RGBFormat: return _gl.RGB; break;
			case THREE.RGBAFormat: return _gl.RGBA; break;
			case THREE.LuminanceFormat: return _gl.LUMINANCE; break;
			case THREE.LuminanceAlphaFormat: return _gl.LUMINANCE_ALPHA; break;

		}

		return 0;

	};

	function isPowerOfTwo ( value ) {

		return ( value & ( value - 1 ) ) === 0;

	};

	// Allocations

	function allocateBones ( object ) {

		// default for when object is not specified
		// ( for example when prebuilding shader
		//   to be used with multiple objects )
		//
		// 	- leave some extra space for other uniforms
		//  - limit here is ANGLE's 254 max uniform vectors
		//    (up to 54 should be safe)

		var maxBones = 50;

		if ( object !== undefined && object instanceof THREE.SkinnedMesh ) {

			maxBones = object.bones.length;

		}

		return maxBones;

	};

	function allocateLights ( lights ) {

		var l, ll, light, dirLights, pointLights, maxDirLights, maxPointLights;
		dirLights = pointLights = maxDirLights = maxPointLights = 0;

		for ( l = 0, ll = lights.length; l < ll; l++ ) {

			light = lights[ l ];

			if ( light instanceof THREE.SpotLight ) dirLights ++; // hack, not a proper spotlight
			if ( light instanceof THREE.DirectionalLight ) dirLights ++;
			if ( light instanceof THREE.PointLight ) pointLights ++;

		}

		if ( ( pointLights + dirLights ) <= _maxLights ) {

			maxDirLights = dirLights;
			maxPointLights = pointLights;

		} else {

			maxDirLights = Math.ceil( _maxLights * dirLights / ( pointLights + dirLights ) );
			maxPointLights = _maxLights - maxDirLights;

		}

		return { 'directional' : maxDirLights, 'point' : maxPointLights };

	};

	function allocateShadows ( lights ) {

		var l, ll, light, maxShadows = 0;

		for ( l = 0, ll = lights.length; l < ll; l++ ) {

			light = lights[ l ];

			if ( light instanceof THREE.SpotLight && light.castShadow ) maxShadows ++;

		}

		return maxShadows;

	};

	function maxVertexTextures () {

		return _gl.getParameter( _gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );

	};

	// Initialization

	function initSprites () {

		_sprite.vertices = new Float32Array( 8 + 8 );
		_sprite.faces    = new Uint16Array( 6 );

		var i = 0;

		_sprite.vertices[ i++ ] = -1; _sprite.vertices[ i++ ] = -1;	// vertex 0
		_sprite.vertices[ i++ ] = 0;  _sprite.vertices[ i++ ] = 1;	// uv 0

		_sprite.vertices[ i++ ] = 1;  _sprite.vertices[ i++ ] = -1;	// vertex 1
		_sprite.vertices[ i++ ] = 1;  _sprite.vertices[ i++ ] = 1;	// uv 1

		_sprite.vertices[ i++ ] = 1;  _sprite.vertices[ i++ ] = 1;	// vertex 2
		_sprite.vertices[ i++ ] = 1;  _sprite.vertices[ i++ ] = 0;	// uv 2

		_sprite.vertices[ i++ ] = -1; _sprite.vertices[ i++ ] = 1;	// vertex 3
		_sprite.vertices[ i++ ] = 0;  _sprite.vertices[ i++ ] = 0;	// uv 3

		i = 0;

		_sprite.faces[ i++ ] = 0; _sprite.faces[ i++ ] = 1; _sprite.faces[ i++ ] = 2;
		_sprite.faces[ i++ ] = 0; _sprite.faces[ i++ ] = 2; _sprite.faces[ i++ ] = 3;

		_sprite.vertexBuffer  = _gl.createBuffer();
		_sprite.elementBuffer = _gl.createBuffer();

		_gl.bindBuffer( _gl.ARRAY_BUFFER, _sprite.vertexBuffer );
		_gl.bufferData( _gl.ARRAY_BUFFER, _sprite.vertices, _gl.STATIC_DRAW );

		_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _sprite.elementBuffer );
		_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, _sprite.faces, _gl.STATIC_DRAW );

		_sprite.program = _gl.createProgram();
		_gl.attachShader( _sprite.program, getShader( "fragment", THREE.ShaderLib.sprite.fragmentShader ) );
		_gl.attachShader( _sprite.program, getShader( "vertex",   THREE.ShaderLib.sprite.vertexShader   ) );
		_gl.linkProgram( _sprite.program );

		_sprite.attributes = {};
		_sprite.uniforms = {};

		_sprite.attributes.position           = _gl.getAttribLocation ( _sprite.program, "position" );
		_sprite.attributes.uv                 = _gl.getAttribLocation ( _sprite.program, "uv" );

		_sprite.uniforms.uvOffset             = _gl.getUniformLocation( _sprite.program, "uvOffset" );
		_sprite.uniforms.uvScale              = _gl.getUniformLocation( _sprite.program, "uvScale" );

		_sprite.uniforms.rotation             = _gl.getUniformLocation( _sprite.program, "rotation" );
		_sprite.uniforms.scale                = _gl.getUniformLocation( _sprite.program, "scale" );
		_sprite.uniforms.alignment            = _gl.getUniformLocation( _sprite.program, "alignment" );

		_sprite.uniforms.color                = _gl.getUniformLocation( _sprite.program, "color" );
		_sprite.uniforms.map                  = _gl.getUniformLocation( _sprite.program, "map" );
		_sprite.uniforms.opacity              = _gl.getUniformLocation( _sprite.program, "opacity" );

		_sprite.uniforms.useScreenCoordinates = _gl.getUniformLocation( _sprite.program, "useScreenCoordinates" );
		_sprite.uniforms.affectedByDistance   = _gl.getUniformLocation( _sprite.program, "affectedByDistance" );
		_sprite.uniforms.screenPosition    	  = _gl.getUniformLocation( _sprite.program, "screenPosition" );
		_sprite.uniforms.modelViewMatrix      = _gl.getUniformLocation( _sprite.program, "modelViewMatrix" );
		_sprite.uniforms.projectionMatrix     = _gl.getUniformLocation( _sprite.program, "projectionMatrix" );

		//_gl.enableVertexAttribArray( _sprite.attributes.position );
		//_gl.enableVertexAttribArray( _sprite.attributes.uv );

	};

	function initShadowmaps () {

		var depthShader = THREE.ShaderLib[ "depthRGBA" ];
		var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );

		_depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
		_depthMaterialMorph = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms, morphTargets: true } );

		_depthMaterial._shadowPass = true;
		_depthMaterialMorph._shadowPass = true;

	}

	function initGL () {

		var gl;

		try {

			if ( ! ( gl = _canvas.getContext( 'experimental-webgl', { antialias: _antialias, stencil: _stencil, preserveDrawingBuffer: _preserveDrawingBuffer } ) ) ) {

				throw 'Error creating WebGL context.';

			}

			console.log(
				navigator.userAgent + " | " +
				gl.getParameter( gl.VERSION ) + " | " +
				gl.getParameter( gl.VENDOR ) + " | " +
				gl.getParameter( gl.RENDERER ) + " | " +
				gl.getParameter( gl.SHADING_LANGUAGE_VERSION )
			);

		} catch ( error ) {

			console.error( error );

		}

		return gl;

	};

	function setDefaultGLState () {

		_gl.clearColor( 0, 0, 0, 1 );
		_gl.clearDepth( 1 );
		_gl.clearStencil( 0 );

		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthFunc( _gl.LEQUAL );

		_gl.frontFace( _gl.CCW );
		_gl.cullFace( _gl.BACK );
		_gl.enable( _gl.CULL_FACE );

		_gl.enable( _gl.BLEND );
		_gl.blendEquation( _gl.FUNC_ADD );
		_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA );

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

};
/**
 * @author szimek / https://github.com/szimek/
 */

THREE.WebGLRenderTarget = function ( width, height, options ) {

	this.width = width;
	this.height = height;

	options = options || {};

	this.wrapS = options.wrapS !== undefined ? options.wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = options.wrapT !== undefined ? options.wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = options.magFilter !== undefined ? options.magFilter : THREE.LinearFilter;
	this.minFilter = options.minFilter !== undefined ? options.minFilter : THREE.LinearMipMapLinearFilter;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.format = options.format !== undefined ? options.format : THREE.RGBAFormat;
	this.type = options.type !== undefined ? options.type : THREE.UnsignedByteType;

	this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
	this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;

};

THREE.WebGLRenderTarget.prototype.clone = function() {

	var tmp = new THREE.WebGLRenderTarget( this.width, this.height );

	tmp.wrapS = this.wrapS;
	tmp.wrapT = this.wrapT;

	tmp.magFilter = this.magFilter;
	tmp.minFilter = this.minFilter;

	tmp.offset.copy( this.offset );
	tmp.repeat.copy( this.repeat );

	tmp.format = this.format;
	tmp.type = this.type;

	tmp.depthBuffer = this.depthBuffer;
	tmp.stencilBuffer = this.stencilBuffer;

	return tmp;

};
/**
 * @author alteredq / http://alteredqualia.com
 */

THREE.WebGLRenderTargetCube = function ( width, height, options ) {

	THREE.WebGLRenderTarget.call( this, width, height, options );

	this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5

};

THREE.WebGLRenderTargetCube.prototype = new THREE.WebGLRenderTarget();
THREE.WebGLRenderTargetCube.prototype.constructor = THREE.WebGLRenderTargetCube;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableVertex = function () {

	this.positionWorld = new THREE.Vector3();
	this.positionScreen = new THREE.Vector4();

	this.visible = true;

};

THREE.RenderableVertex.prototype.copy = function ( vertex ) {

	this.positionWorld.copy( vertex.positionWorld );
	this.positionScreen.copy( vertex.positionScreen );

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableFace3 = function () {

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();

	this.centroidWorld = new THREE.Vector3();
	this.centroidScreen = new THREE.Vector3();

	this.normalWorld = new THREE.Vector3();
	this.vertexNormalsWorld = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

	this.material = null;
	this.faceMaterial = null;
	this.uvs = [[]];

	this.z = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableFace4 = function () {

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();
	this.v4 = new THREE.RenderableVertex();

	this.centroidWorld = new THREE.Vector3();
	this.centroidScreen = new THREE.Vector3();

	this.normalWorld = new THREE.Vector3();
	this.vertexNormalsWorld = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

	this.material = null;
	this.faceMaterial = null;
	this.uvs = [[]];

	this.z = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableObject = function () {

	this.object = null;
	this.z = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableParticle = function () {

	this.x = null;
	this.y = null;
	this.z = null;

	this.rotation = null;
	this.scale = new THREE.Vector2();

	this.material = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableLine = function () {

	this.z = null;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();

	this.material = null;

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ColorUtils = {

	adjustHSV : function ( color, h, s, v ) {

		var hsv = THREE.ColorUtils.__hsv;

		THREE.ColorUtils.rgbToHsv( color, hsv );

		hsv.h = THREE.Math.clamp( hsv.h + h, 0, 1 );
		hsv.s = THREE.Math.clamp( hsv.s + s, 0, 1 );
		hsv.v = THREE.Math.clamp( hsv.v + v, 0, 1 );

		color.setHSV( hsv.h, hsv.s, hsv.v );

	},

	// based on MochiKit implementation by Bob Ippolito

	rgbToHsv : function ( color, hsv ) {

		var r = color.r;
		var g = color.g;
		var b = color.b;

		var max = Math.max( Math.max( r, g ), b );
		var min = Math.min( Math.min( r, g ), b );

		var hue;
		var saturation;
		var value = max;

		if ( min === max )	{

			hue = 0;
			saturation = 0;

		} else {

			var delta = ( max - min );
			saturation = delta / max;

			if ( r === max ) {

				hue = ( g - b ) / delta;

			} else if ( g === max ) {

				hue = 2 + ( ( b - r ) / delta );

			} else	{

				hue = 4 + ( ( r - g ) / delta );
			}

			hue /= 6;

			if ( hue < 0 ) {

				hue += 1;

			}

			if ( hue > 1 ) {

				hue -= 1;

			}

		}

		if ( hsv === undefined ) {

			hsv = { h: 0, s: 0, v: 0 };

		}

		hsv.h = hue;
		hsv.s = saturation;
		hsv.v = value;

		return hsv;

	}

};

THREE.ColorUtils.__hsv = { h: 0, s: 0, v: 0 };/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.GeometryUtils = {

	merge: function ( geometry1, object2 /* mesh | geometry */ ) {

		var matrix, matrixRotation,
		vertexOffset = geometry1.vertices.length,
		uvPosition = geometry1.faceVertexUvs[ 0 ].length,
		geometry2 = object2 instanceof THREE.Mesh ? object2.geometry : object2,
		vertices1 = geometry1.vertices,
		vertices2 = geometry2.vertices,
		faces1 = geometry1.faces,
		faces2 = geometry2.faces,
		uvs1 = geometry1.faceVertexUvs[ 0 ],
		uvs2 = geometry2.faceVertexUvs[ 0 ];

		var geo1MaterialsMap = {};

		for ( var i = 0; i < geometry1.materials.length; i ++ ) {

			var id = geometry1.materials[ i ].id;

			geo1MaterialsMap[ id ] = i;

		}


		if ( object2 instanceof THREE.Mesh ) {

			object2.matrixAutoUpdate && object2.updateMatrix();

			matrix = object2.matrix;
			matrixRotation = new THREE.Matrix4();
			matrixRotation.extractRotation( matrix, object2.scale );

		}

		// vertices

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = new THREE.Vertex( vertex.position.clone() );

			if ( matrix ) matrix.multiplyVector3( vertexCopy.position );

			vertices1.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			if ( face instanceof THREE.Face3 ) {

				faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );

			} else if ( face instanceof THREE.Face4 ) {

				faceCopy = new THREE.Face4( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset, face.d + vertexOffset );

			}

			faceCopy.normal.copy( face.normal );

			if ( matrixRotation ) matrixRotation.multiplyVector3( faceCopy.normal );

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( matrixRotation ) matrixRotation.multiplyVector3( normal );

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			if ( face.materialIndex !== undefined ) {

				var material2 = geometry2.materials[ face.materialIndex ];
				var materialId2 = material2.id;

				var materialIndex = geo1MaterialsMap[ materialId2 ];

				if ( materialIndex === undefined ) {

					materialIndex = geometry1.materials.length;
					geometry1.materials.push( material2 );

				}

				faceCopy.materialIndex = materialIndex;

			}

			faceCopy.centroid.copy( face.centroid );
			if ( matrix ) matrix.multiplyVector3( faceCopy.centroid );

			faces1.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.UV( uv[ j ].u, uv[ j ].v ) );

			}

			uvs1.push( uvCopy );

		}

	},

	clone: function ( geometry ) {

		var cloneGeo = new THREE.Geometry();

		var i, il;

		var vertices = geometry.vertices,
			faces = geometry.faces,
			uvs = geometry.faceVertexUvs[ 0 ];

		// materials

		if ( geometry.materials ) {

			cloneGeo.materials = geometry.materials.slice();

		}

		// vertices

		for ( i = 0, il = vertices.length; i < il; i ++ ) {

			var vertex = vertices[ i ];
			var vertexCopy = new THREE.Vertex( vertex.position.clone() );

			cloneGeo.vertices.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces.length; i < il; i ++ ) {

			var face = faces[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			if ( face instanceof THREE.Face3 ) {

				faceCopy = new THREE.Face3( face.a, face.b, face.c );

			} else if ( face instanceof THREE.Face4 ) {

				faceCopy = new THREE.Face4( face.a, face.b, face.c, face.d );

			}

			faceCopy.normal.copy( face.normal );

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ];
				faceCopy.vertexNormals.push( normal.clone() );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materialIndex = face.materialIndex;

			faceCopy.centroid.copy( face.centroid );

			cloneGeo.faces.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs.length; i < il; i ++ ) {

			var uv = uvs[ i ], uvCopy = [];

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.UV( uv[ j ].u, uv[ j ].v ) );

			}

			cloneGeo.faceVertexUvs[ 0 ].push( uvCopy );

		}

		return cloneGeo;

	},

	// Get random point in triangle (via barycentric coordinates)
	// 	(uniform distribution)
	// 	http://www.cgafaq.info/wiki/Random_Point_In_Triangle

	randomPointInTriangle: function( vectorA, vectorB, vectorC ) {

		var a, b, c,
			point = new THREE.Vector3(),
			tmp = THREE.GeometryUtils.__v1;

		a = THREE.GeometryUtils.random();
		b = THREE.GeometryUtils.random();

		if ( ( a + b ) > 1 ) {

			a = 1 - a;
			b = 1 - b;

		}

		c = 1 - a - b;

		point.copy( vectorA );
		point.multiplyScalar( a );

		tmp.copy( vectorB );
		tmp.multiplyScalar( b );

		point.addSelf( tmp );

		tmp.copy( vectorC );
		tmp.multiplyScalar( c );

		point.addSelf( tmp );

		return point;

	},

	// Get random point in face (triangle / quad)
	// (uniform distribution)

	randomPointInFace: function( face, geometry, useCachedAreas ) {

		var vA, vB, vC, vD;

		if ( face instanceof THREE.Face3 ) {

			vA = geometry.vertices[ face.a ].position;
			vB = geometry.vertices[ face.b ].position;
			vC = geometry.vertices[ face.c ].position;

			return THREE.GeometryUtils.randomPointInTriangle( vA, vB, vC );

		} else if ( face instanceof THREE.Face4 ) {

			vA = geometry.vertices[ face.a ].position;
			vB = geometry.vertices[ face.b ].position;
			vC = geometry.vertices[ face.c ].position;
			vD = geometry.vertices[ face.d ].position;

			var area1, area2;

			if ( useCachedAreas ) {

				if ( face._area1 && face._area2 ) {

					area1 = face._area1;
					area2 = face._area2;

				} else {

					area1 = THREE.GeometryUtils.triangleArea( vA, vB, vD );
					area2 = THREE.GeometryUtils.triangleArea( vB, vC, vD );

					face._area1 = area1;
					face._area2 = area2;

				}

			} else {

				area1 = THREE.GeometryUtils.triangleArea( vA, vB, vD ),
				area2 = THREE.GeometryUtils.triangleArea( vB, vC, vD );

			}

			var r = THREE.GeometryUtils.random() * ( area1 + area2 );

			if ( r < area1 ) {

				return THREE.GeometryUtils.randomPointInTriangle( vA, vB, vD );

			} else {

				return THREE.GeometryUtils.randomPointInTriangle( vB, vC, vD );

			}

		}

	},

	// Get uniformly distributed random points in mesh
	// 	- create array with cumulative sums of face areas
	//  - pick random number from 0 to total area
	//  - find corresponding place in area array by binary search
	//	- get random point in face

	randomPointsInGeometry: function( geometry, n ) {

		var face, i,
			faces = geometry.faces,
			vertices = geometry.vertices,
			il = faces.length,
			totalArea = 0,
			cumulativeAreas = [],
			vA, vB, vC, vD;

		// precompute face areas

		for ( i = 0; i < il; i ++ ) {

			face = faces[ i ];

			if ( face instanceof THREE.Face3 ) {

				vA = vertices[ face.a ].position;
				vB = vertices[ face.b ].position;
				vC = vertices[ face.c ].position;

				face._area = THREE.GeometryUtils.triangleArea( vA, vB, vC );

			} else if ( face instanceof THREE.Face4 ) {

				vA = vertices[ face.a ].position;
				vB = vertices[ face.b ].position;
				vC = vertices[ face.c ].position;
				vD = vertices[ face.d ].position;

				face._area1 = THREE.GeometryUtils.triangleArea( vA, vB, vD );
				face._area2 = THREE.GeometryUtils.triangleArea( vB, vC, vD );

				face._area = face._area1 + face._area2;

			}

			totalArea += face._area;

			cumulativeAreas[ i ] = totalArea;

		}

		// binary search cumulative areas array

		function binarySearchIndices( value ) {

			function binarySearch( start, end ) {

				// return closest larger index
				// if exact number is not found

				if ( end < start )
					return start;

				var mid = start + Math.floor( ( end - start ) / 2 );

				if ( cumulativeAreas[ mid ] > value ) {

					return binarySearch( start, mid - 1 );

				} else if ( cumulativeAreas[ mid ] < value ) {

					return binarySearch( mid + 1, end );

				} else {

					return mid;

				}

			}

			var result = binarySearch( 0, cumulativeAreas.length - 1 )
			return result;

		}

		// pick random face weighted by face area

		var r, index,
			result = [];

		var stats = {};

		for ( i = 0; i < n; i ++ ) {

			r = THREE.GeometryUtils.random() * totalArea;

			index = binarySearchIndices( r );

			result[ i ] = THREE.GeometryUtils.randomPointInFace( faces[ index ], geometry, true );

			if ( ! stats[ index ] ) {

				stats[ index ] = 1;

			} else {

				stats[ index ] += 1;

			}

		}

		return result;

	},

	// Get triangle area (by Heron's formula)
	// 	http://en.wikipedia.org/wiki/Heron%27s_formula

	triangleArea: function( vectorA, vectorB, vectorC ) {

		var s, a, b, c,
			tmp = THREE.GeometryUtils.__v1;

		tmp.sub( vectorA, vectorB );
		a = tmp.length();

		tmp.sub( vectorA, vectorC );
		b = tmp.length();

		tmp.sub( vectorB, vectorC );
		c = tmp.length();

		s = 0.5 * ( a + b + c );

		return Math.sqrt( s * ( s - a ) * ( s - b ) * ( s - c ) );

	},

	center: function( geometry ) {

		geometry.computeBoundingBox();

		var matrix = new THREE.Matrix4();

		var dx = -0.5 * ( geometry.boundingBox.x[ 1 ] + geometry.boundingBox.x[ 0 ] );
		var dy = -0.5 * ( geometry.boundingBox.y[ 1 ] + geometry.boundingBox.y[ 0 ] );
		var dz = -0.5 * ( geometry.boundingBox.z[ 1 ] + geometry.boundingBox.z[ 0 ] );

		matrix.setTranslation( dx, dy, dz );

		geometry.applyMatrix( matrix );

		geometry.computeBoundingBox();

	}


};

THREE.GeometryUtils.random = THREE.Math.random16;

THREE.GeometryUtils.__v1 = new THREE.Vector3();
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageUtils = {

	loadTexture: function ( path, mapping, callback ) {

		var image = new Image(), texture = new THREE.Texture( image, mapping );

		image.onload = function () { texture.needsUpdate = true; if ( callback ) callback( this ); };
		image.crossOrigin = '';
		image.src = path;

		return texture;

	},

	loadTextureCube: function ( array, mapping, callback ) {

		var i, l, images = [], texture = new THREE.Texture( images, mapping );

		images.loadCount = 0;

		for ( i = 0, l = array.length; i < l; ++i ) {

			images[ i ] = new Image();
			images[ i ].onload = function () {

				images.loadCount += 1;
				if ( images.loadCount === 6 ) texture.needsUpdate = true;
				if ( callback ) callback( this );

			};

			images[ i ].crossOrigin = '';
			images[ i ].src = array[ i ];

		}

		return texture;

	},

	getNormalMap: function ( image, depth ) {

		// Adapted from http://www.paulbrunt.co.uk/lab/heightnormal/

		var cross = function ( a, b ) {

			return [ a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ], a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ], a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ] ];

		}

		var subtract = function ( a, b ) {

			return [ a[ 0 ] - b[ 0 ], a[ 1 ] - b[ 1 ], a[ 2 ] - b[ 2 ] ];

		}

		var normalize = function ( a ) {

			var l = Math.sqrt( a[ 0 ] * a[ 0 ] + a[ 1 ] * a[ 1 ] + a[ 2 ] * a[ 2 ] );
			return [ a[ 0 ] / l, a[ 1 ] / l, a[ 2 ] / l ];

		}

		var depth = depth | 1;
		var width = image.width;
		var height = image.height;

		var canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		var context = canvas.getContext( '2d' );
		context.drawImage( image, 0, 0 );

		var data = context.getImageData( 0, 0, width, height ).data;
		var imageData = context.createImageData( width, height );
		var output = imageData.data;

		for ( var x = 0; x < width; x ++ ) {

			for ( var y = 1; y < height; y ++ ) {

				var ly = y - 1 < 0 ? height - 1 : y - 1;
				var uy = ( y + 1 ) % height;
				var lx = x - 1 < 0 ? width - 1 : x - 1;
				var ux = ( x + 1 ) % width;

				var points = [];
				var origin = [ 0, 0, data[ ( y * width + x ) * 4 ] / 255 * depth ];
				points.push( [ - 1, 0, data[ ( y * width + lx ) * 4 ] / 255 * depth ] );
				points.push( [ - 1, - 1, data[ ( ly * width + lx ) * 4 ] / 255 * depth ] );
				points.push( [ 0, - 1, data[ ( ly * width + x ) * 4 ] / 255 * depth ] );
				points.push( [  1, - 1, data[ ( ly * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 1, 0, data[ ( y * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 1, 1, data[ ( uy * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 0, 1, data[ ( uy * width + x ) * 4 ] / 255 * depth ] );
				points.push( [ - 1, 1, data[ ( uy * width + lx ) * 4 ] / 255 * depth ] );

				var normals = [];
				var num_points = points.length;

				for ( var i = 0; i < num_points; i ++ ) {

					var v1 = points[ i ];
					var v2 = points[ ( i + 1 ) % num_points ];
					v1 = subtract( v1, origin );
					v2 = subtract( v2, origin );
					normals.push( normalize( cross( v1, v2 ) ) );

				}

				var normal = [ 0, 0, 0 ];

				for ( var i = 0; i < normals.length; i ++ ) {

					normal[ 0 ] += normals[ i ][ 0 ];
					normal[ 1 ] += normals[ i ][ 1 ];
					normal[ 2 ] += normals[ i ][ 2 ];

				}

				normal[ 0 ] /= normals.length;
				normal[ 1 ] /= normals.length;
				normal[ 2 ] /= normals.length;

				var idx = ( y * width + x ) * 4;

				output[ idx ] = ( ( normal[ 0 ] + 1.0 ) / 2.0 * 255 ) | 0;
				output[ idx + 1 ] = ( ( normal[ 1 ] + 1.0 / 2.0 ) * 255 ) | 0;
				output[ idx + 2 ] = ( normal[ 2 ] * 255 ) | 0;
				output[ idx + 3 ] = 255;

			}

		}

		context.putImageData( imageData, 0, 0 );

		return canvas;

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneUtils = {

	showHierarchy : function ( root, visible ) {

		THREE.SceneUtils.traverseHierarchy( root, function( node ) { node.visible = visible; } );

	},

	traverseHierarchy : function ( root, callback ) {

		var n, i, l = root.children.length;

		for ( i = 0; i < l; i ++ ) {

			n = root.children[ i ];

			callback( n );

			THREE.SceneUtils.traverseHierarchy( n, callback );

		}

	},

	createMultiMaterialObject : function ( geometry, materials ) {

		var i, il = materials.length,
			group = new THREE.Object3D();

		for ( i = 0; i < il; i ++ ) {

			var object = new THREE.Mesh( geometry, materials[ i ] );
			group.add( object );

		}

		return group;

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 *
 * ShaderUtils currently contains:
 *
 *	fresnel
 *	normal
 * 	cube
 *
 */

if ( THREE.WebGLRenderer ) {

THREE.ShaderUtils = {

	lib: {

		/* -------------------------------------------------------------------------
		//	Fresnel shader
		//	- based on Nvidia Cg tutorial
		 ------------------------------------------------------------------------- */

		'fresnel': {

			uniforms: {

				"mRefractionRatio": { type: "f", value: 1.02 },
				"mFresnelBias": { type: "f", value: 0.1 },
				"mFresnelPower": { type: "f", value: 2.0 },
				"mFresnelScale": { type: "f", value: 1.0 },
				"tCube": { type: "t", value: 1, texture: null }

			},

			fragmentShader: [

				"uniform samplerCube tCube;",

				"varying vec3 vReflect;",
				"varying vec3 vRefract[3];",
				"varying float vReflectionFactor;",

				"void main() {",

					"vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
					"vec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );",

					"refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
					"refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
					"refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",
					"refractedColor.a = 1.0;",

					"gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

				"}"

			].join("\n"),

			vertexShader: [

				"uniform float mRefractionRatio;",
				"uniform float mFresnelBias;",
				"uniform float mFresnelScale;",
				"uniform float mFresnelPower;",

				"varying vec3 vReflect;",
				"varying vec3 vRefract[3];",
				"varying float vReflectionFactor;",

				"void main() {",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",

					"vec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );",

					"vec3 I = mPosition.xyz - cameraPosition;",

					"vReflect = reflect( I, nWorld );",
					"vRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );",
					"vRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );",
					"vRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );",
					"vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );",

					"gl_Position = projectionMatrix * mvPosition;",

				"}"

			].join("\n")

		},

		/* -------------------------------------------------------------------------
		//	Normal map shader
		//		- Blinn-Phong
		//		- normal + diffuse + specular + AO + displacement + reflection + shadow maps
		//		- point and directional lights (use with "lights: true" material option)
		 ------------------------------------------------------------------------- */

		'normal' : {

			uniforms: THREE.UniformsUtils.merge( [

				THREE.UniformsLib[ "fog" ],
				THREE.UniformsLib[ "lights" ],
				THREE.UniformsLib[ "shadowmap" ],

				{

				"enableAO"		  : { type: "i", value: 0 },
				"enableDiffuse"	  : { type: "i", value: 0 },
				"enableSpecular"  : { type: "i", value: 0 },
				"enableReflection": { type: "i", value: 0 },

				"tDiffuse"	   : { type: "t", value: 0, texture: null },
				"tCube"		   : { type: "t", value: 1, texture: null },
				"tNormal"	   : { type: "t", value: 2, texture: null },
				"tSpecular"	   : { type: "t", value: 3, texture: null },
				"tAO"		   : { type: "t", value: 4, texture: null },
				"tDisplacement": { type: "t", value: 5, texture: null },

				"uNormalScale": { type: "f", value: 1.0 },

				"uDisplacementBias": { type: "f", value: 0.0 },
				"uDisplacementScale": { type: "f", value: 1.0 },

				"uDiffuseColor": { type: "c", value: new THREE.Color( 0xeeeeee ) },
				"uSpecularColor": { type: "c", value: new THREE.Color( 0x111111 ) },
				"uAmbientColor": { type: "c", value: new THREE.Color( 0x050505 ) },
				"uShininess": { type: "f", value: 30 },
				"uOpacity": { type: "f", value: 1 },

				"uReflectivity": { type: "f", value: 0.5 },

				"uOffset" : { type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"uRepeat" : { type: "v2", value: new THREE.Vector2( 1, 1 ) }

				}

			] ),

			fragmentShader: [

				"uniform vec3 uAmbientColor;",
				"uniform vec3 uDiffuseColor;",
				"uniform vec3 uSpecularColor;",
				"uniform float uShininess;",
				"uniform float uOpacity;",

				"uniform bool enableDiffuse;",
				"uniform bool enableSpecular;",
				"uniform bool enableAO;",
				"uniform bool enableReflection;",

				"uniform sampler2D tDiffuse;",
				"uniform sampler2D tNormal;",
				"uniform sampler2D tSpecular;",
				"uniform sampler2D tAO;",

				"uniform samplerCube tCube;",

				"uniform float uNormalScale;",
				"uniform float uReflectivity;",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"uniform vec3 ambientLightColor;",

				"#if MAX_DIR_LIGHTS > 0",
					"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
					"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
				"#endif",

				"#if MAX_POINT_LIGHTS > 0",
					"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",
				"#endif",

				"varying vec3 vViewPosition;",

				THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
				THREE.ShaderChunk[ "fog_pars_fragment" ],

				"void main() {",

					"gl_FragColor = vec4( vec3( 1.0 ), uOpacity );",

					"vec3 specularTex = vec3( 1.0 );",

					"vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
					"normalTex.xy *= uNormalScale;",
					"normalTex = normalize( normalTex );",

					"if( enableDiffuse )",
						"gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );",

					"if( enableAO )",
						"gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;",

					"if( enableSpecular )",
						"specularTex = texture2D( tSpecular, vUv ).xyz;",

					"mat3 tsb = mat3( vTangent, vBinormal, vNormal );",
					"vec3 finalNormal = tsb * normalTex;",

					"vec3 normal = normalize( finalNormal );",
					"vec3 viewPosition = normalize( vViewPosition );",

					// point lights

					"#if MAX_POINT_LIGHTS > 0",

						"vec3 pointDiffuse = vec3( 0.0 );",
						"vec3 pointSpecular = vec3( 0.0 );",

						"for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

							"vec3 pointVector = normalize( vPointLight[ i ].xyz );",
							"vec3 pointHalfVector = normalize( vPointLight[ i ].xyz + viewPosition );",
							"float pointDistance = vPointLight[ i ].w;",

							"float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
							"float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

							"float pointSpecularWeight = specularTex.r * pow( pointDotNormalHalf, uShininess );",

							"pointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;",
							"pointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;",

						"}",

					"#endif",

					// directional lights

					"#if MAX_DIR_LIGHTS > 0",

						"vec3 dirDiffuse = vec3( 0.0 );",
						"vec3 dirSpecular = vec3( 0.0 );",

						"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

							"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",

							"vec3 dirVector = normalize( lDirection.xyz );",
							"vec3 dirHalfVector = normalize( lDirection.xyz + viewPosition );",

							"float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
							"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

							"float dirSpecularWeight = specularTex.r * pow( dirDotNormalHalf, uShininess );",

							"dirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;",
							"dirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;",

						"}",

					"#endif",

					// all lights contribution summation

					"vec3 totalDiffuse = vec3( 0.0 );",
					"vec3 totalSpecular = vec3( 0.0 );",

					"#if MAX_DIR_LIGHTS > 0",

						"totalDiffuse += dirDiffuse;",
						"totalSpecular += dirSpecular;",

					"#endif",

					"#if MAX_POINT_LIGHTS > 0",

						"totalDiffuse += pointDiffuse;",
						"totalSpecular += pointSpecular;",

					"#endif",

					"gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor) + totalSpecular;",

					"if ( enableReflection ) {",

						"vec3 wPos = cameraPosition - vViewPosition;",
						"vec3 vReflect = reflect( normalize( wPos ), normal );",
						"vec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
						"gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, uReflectivity );",

					"}",

					THREE.ShaderChunk[ "shadowmap_fragment" ],
					THREE.ShaderChunk[ "fog_fragment" ],

				"}"

			].join("\n"),

			vertexShader: [

				"attribute vec4 tangent;",

				"uniform vec2 uOffset;",
				"uniform vec2 uRepeat;",

				"#ifdef VERTEX_TEXTURES",

					"uniform sampler2D tDisplacement;",
					"uniform float uDisplacementScale;",
					"uniform float uDisplacementBias;",

				"#endif",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"#if MAX_POINT_LIGHTS > 0",

					"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
					"uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",

				"#endif",

				"varying vec3 vViewPosition;",

				THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

				"void main() {",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

					"vViewPosition = -mvPosition.xyz;",

					"vNormal = normalize( normalMatrix * normal );",

					// tangent and binormal vectors

					"vTangent = normalize( normalMatrix * tangent.xyz );",

					"vBinormal = cross( vNormal, vTangent ) * tangent.w;",
					"vBinormal = normalize( vBinormal );",

					"vUv = uv * uRepeat + uOffset;",

					// point lights

					"#if MAX_POINT_LIGHTS > 0",

						"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {",

							"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",

							"vec3 lVector = lPosition.xyz - mvPosition.xyz;",

							"float lDistance = 1.0;",

							"if ( pointLightDistance[ i ] > 0.0 )",
								"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",

							"lVector = normalize( lVector );",

							"vPointLight[ i ] = vec4( lVector, lDistance );",

						"}",

					"#endif",

					// displacement mapping

					"#ifdef VERTEX_TEXTURES",

						"vec3 dv = texture2D( tDisplacement, uv ).xyz;",
						"float df = uDisplacementScale * dv.x + uDisplacementBias;",
						"vec4 displacedPosition = vec4( vNormal.xyz * df, 0.0 ) + mvPosition;",
						"gl_Position = projectionMatrix * displacedPosition;",

					"#else",

						"gl_Position = projectionMatrix * mvPosition;",

					"#endif",

					THREE.ShaderChunk[ "shadowmap_vertex" ],

				"}"

			].join("\n")

		},

		/* -------------------------------------------------------------------------
		//	Cube map shader
		 ------------------------------------------------------------------------- */

		'cube': {

			uniforms: { "tCube": { type: "t", value: 1, texture: null },
						"tFlip": { type: "f", value: -1 } },

			vertexShader: [

				"varying vec3 vViewPosition;",

				"void main() {",

					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
					"vViewPosition = cameraPosition - mPosition.xyz;",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform samplerCube tCube;",
				"uniform float tFlip;",

				"varying vec3 vViewPosition;",

				"void main() {",

					"vec3 wPos = cameraPosition - vViewPosition;",
					"gl_FragColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );",

				"}"

			].join("\n")

		}

	}

};

};/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Extensible curve object
 * 
 * Some common of Curve methods
 * .getPoint(t), getTangent(t)
 * .getPointAt(u), getTagentAt(u)
 * .getPoints(), .getSpacedPoints()
 * .getLength()
 *
 * This file contains following classes:
 *
 * -- 2d classes --
 * THREE.Curve
 * THREE.LineCurve
 * THREE.QuadraticBezierCurve
 * THREE.CubicBezierCurve
 * THREE.SplineCurve
 * THREE.ArcCurve
 *
 * -- 3d classes --
 * THREE.LineCurve3
 * THREE.QuadraticBezierCurve3
 * THREE.CubicBezierCurve3
 * THREE.SplineCurve3
 *
 **/

/**************************************************************
 *	Abstract Curve base class
 **************************************************************/

THREE.Curve = function () {

};

// Virtual base class method to overwrite and implement in subclasses
//	- t [0 .. 1]

THREE.Curve.prototype.getPoint = function ( t ) {

	console.log( "Warning, getPoint() not implemented!" );
	return null;

};

// Get point at relative position in curve according to arc length
// - u [0 .. 1]

THREE.Curve.prototype.getPointAt = function ( u ) {

	var t = this.getUtoTmapping( u );
	return this.getPoint( t );

};

// Get sequence of points using getPoint( t )

THREE.Curve.prototype.getPoints = function ( divisions ) {

	if ( !divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {

		pts.push( this.getPoint( d / divisions ) );

	};

	return pts;

};

// Get sequence of points using getPointAt( u )

THREE.Curve.prototype.getSpacedPoints = function ( divisions ) {

	if ( !divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {

		pts.push( this.getPointAt( d / divisions ) );

	};

	return pts;

};

// Get total curve length

THREE.Curve.prototype.getLength = function () {

	var lengths = this.getLengths();
	return lengths[ lengths.length - 1 ];

};

// Get list of cumulative segment lengths

THREE.Curve.prototype.getLengths = function ( divisions ) {

	if ( !divisions ) divisions = 200;

	if ( this.cacheArcLengths && ( this.cacheArcLengths.length == divisions + 1 ) ) {

		//console.log( "cached", this.cacheArcLengths );
		return this.cacheArcLengths;

	}

	var cache = [];
	var current, last = this.getPoint( 0 );
	var p, sum = 0;

	cache.push( 0 );

	for ( p = 1; p <= divisions; p ++ ) {

		current = this.getPoint ( p / divisions );
		sum += current.distanceTo( last );
		cache.push( sum );
		last = current;

	}

	this.cacheArcLengths = cache;

	return cache; // { sums: cache, sum:sum }; Sum is in the last element.

};

// Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance

THREE.Curve.prototype.getUtoTmapping = function ( u, distance ) {

	var arcLengths = this.getLengths();

	var i = 0, il = arcLengths.length;

	var targetArcLength; // The targeted u distance value to get

	if ( distance ) {

		targetArcLength = distance;

	} else {

		targetArcLength = u * arcLengths[ il - 1 ];

	}

	//var time = Date.now();

	// binary search for the index with largest value smaller than target u distance

	var low = 0, high = il - 1, comparison;

	while ( low <= high ) {

		i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

	  	comparison = arcLengths[ i ] - targetArcLength;

	  	if ( comparison < 0 ) {

			low = i + 1;
			continue;

		} else if ( comparison > 0 ) {

			high = i - 1;
			continue;

		} else {

			high = i;
			break;

			// DONE

		}

	}

	i = high;

	//console.log('b' , i, low, high, Date.now()- time);

	if ( arcLengths[ i ] == targetArcLength ) {

		var t = i / ( il - 1 );
		return t;

	}

	// we could get finer grain at lengths, or use simple interpolatation between two points

	var lengthBefore = arcLengths[ i ];
    var lengthAfter = arcLengths[ i + 1 ];

    var segmentLength = lengthAfter - lengthBefore;

    // determine where we are between the 'before' and 'after' points

    var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

    // add that fractional amount to t

    t = ( i + segmentFraction ) / ( il -1 );

	return t;

};

// In case any sub curve does not implement its tangent / normal finding,
// we get 2 points with a small delta and find a gradient of the 2 points
// which seems to make a reasonable approximation

THREE.Curve.prototype.getNormalVector = function( t ) {

	var vec = this.getTangent( t );

	return new THREE.Vector2( -vec.y , vec.x );

};

// Returns a unit vector tangent at t

THREE.Curve.prototype.getTangent = function( t ) {

	var delta = 0.0001;
	var t1 = t - delta;
	var t2 = t + delta;

	// Capping in case of danger

	if ( t1 < 0 ) t1 = 0;
	if ( t2 > 1 ) t2 = 1;

	var pt1 = this.getPoint( t1 );
	var pt2 = this.getPoint( t2 );
	
	var vec = pt1.clone().subSelf(pt2);
	return vec.normalize();

};


THREE.Curve.prototype.getTangentAt = function ( u ) {

	var t = this.getUtoTmapping( u );
	return this.getTangent( t );

};

/**************************************************************
 *	Line
 **************************************************************/

THREE.LineCurve = function ( v1, v2 ) {

	if ( ! ( v1 instanceof THREE.Vector2 ) ) {

		// Fall back for old constuctor signature - should be removed over time

		THREE.LineCurve.oldConstructor.apply( this, arguments );
		return;

	}

	this.v1 = v1;
	this.v2 = v2;

};

THREE.LineCurve.oldConstructor = function ( x1, y1, x2, y2 ) {

	this.constructor( new THREE.Vector2( x1, y1 ), new THREE.Vector2( x2, y2 ) );

};

THREE.LineCurve.prototype = new THREE.Curve();
THREE.LineCurve.prototype.constructor = THREE.LineCurve;

THREE.LineCurve.prototype.getPoint = function ( t ) {

	var point = new THREE.Vector2();

	point.sub( this.v2, this.v1 );
	point.multiplyScalar( t ).addSelf( this.v1 );

	return point;

};

// Line curve is linear, so we can overwrite default getPointAt

THREE.LineCurve.prototype.getPointAt = function ( u ) {

	return this.getPoint( u );

};

THREE.LineCurve.prototype.getTangent = function( t ) {

	var tangent = new THREE.Vector2();

	tangent.sub( this.v2, this.v1 );
	tangent.normalize();

	return tangent;

};

/**************************************************************
 *	Quadratic Bezier curve
 **************************************************************/


THREE.QuadraticBezierCurve = function ( v0, v1, v2 ) {

	if ( !( v1 instanceof THREE.Vector2 ) ) {

		var args = Array.prototype.slice.call( arguments );

		v0 = new THREE.Vector2( args[ 0 ], args[ 1 ] );
		v1 = new THREE.Vector2( args[ 2 ], args[ 3 ] );
		v2 = new THREE.Vector2( args[ 4 ], args[ 5 ] );

	}

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

};

THREE.QuadraticBezierCurve.prototype = new THREE.Curve();
THREE.QuadraticBezierCurve.prototype.constructor = THREE.QuadraticBezierCurve;


THREE.QuadraticBezierCurve.prototype.getPoint = function ( t ) {

	var tx, ty;

	tx = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
	ty = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );

	return new THREE.Vector2( tx, ty );

};


THREE.QuadraticBezierCurve.prototype.getTangent = function( t ) {

	// iterate sub segments
	// 	get lengths for sub segments
	// 	if segment is bezier
	//		perform subdivisions

	var tx, ty;

	tx = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.x, this.v1.x, this.v2.x );
	ty = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.y, this.v1.y, this.v2.y );

	// returns unit vector

	var tangent = new THREE.Vector2( tx, ty );
	tangent.normalize();

	return tangent;

};


/**************************************************************
 *	Cubic Bezier curve
 **************************************************************/

THREE.CubicBezierCurve = function ( v0, v1, v2, v3 ) {

	if ( ! ( v1 instanceof THREE.Vector2 ) ) {

		var args = Array.prototype.slice.call( arguments );

		v0 = new THREE.Vector2( args[ 0 ], args[ 1 ] );
		v1 = new THREE.Vector2( args[ 2 ], args[ 3 ] );
		v2 = new THREE.Vector2( args[ 4 ], args[ 5 ] );
		v3 = new THREE.Vector2( args[ 6 ], args[ 7 ] );

	}

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;

};

THREE.CubicBezierCurve.prototype = new THREE.Curve();
THREE.CubicBezierCurve.prototype.constructor = THREE.CubicBezierCurve;

THREE.CubicBezierCurve.prototype.getPoint = function ( t ) {

	var tx, ty;

	tx = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );

	return new THREE.Vector2( tx, ty );

};

THREE.CubicBezierCurve.prototype.getTangent = function( t ) {

	var tx, ty;

	tx = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );

	// return normal unit vector

	var tangent = new THREE.Vector2( tx, ty );
	tangent.normalize();

	return tangent;

};


/**************************************************************
 *	Spline curve
 **************************************************************/

THREE.SplineCurve = function ( points /* array of Vector2 */ ) {

	this.points = (points == undefined) ? [] : points;

};

THREE.SplineCurve.prototype = new THREE.Curve();
THREE.SplineCurve.prototype.constructor = THREE.SplineCurve;

THREE.SplineCurve.prototype.getPoint = function ( t ) {

	var v = new THREE.Vector2();
	var c = [];
	var points = this.points, point, intPoint, weight;
	point = ( points.length - 1 ) * t;

	intPoint = Math.floor( point );
	weight = point - intPoint;

	c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
	c[ 1 ] = intPoint;
	c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
	c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

	v.x = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
	v.y = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );

	return v;

};

/**************************************************************
 *	Arc curve
 **************************************************************/

THREE.ArcCurve = function ( aX, aY, aRadius,
							aStartAngle, aEndAngle,
							aClockwise ) {

	this.aX = aX;
	this.aY = aY;

	this.aRadius = aRadius;

	this.aStartAngle = aStartAngle;
	this.aEndAngle = aEndAngle;

	this.aClockwise = aClockwise;

};

THREE.ArcCurve.prototype = new THREE.Curve();
THREE.ArcCurve.prototype.constructor = THREE.ArcCurve;

THREE.ArcCurve.prototype.getPoint = function ( t ) {

	var deltaAngle = this.aEndAngle - this.aStartAngle;

	if ( !this.aClockwise ) {

		t = 1 - t;

	}

	var angle = this.aStartAngle + t * deltaAngle;

	var tx = this.aX + this.aRadius * Math.cos( angle );
	var ty = this.aY + this.aRadius * Math.sin( angle );

	return new THREE.Vector2( tx, ty );

};

/**************************************************************
 *	Utils
 **************************************************************/

THREE.Curve.Utils = {

	tangentQuadraticBezier: function ( t, p0, p1, p2 ) {

		return 2 * ( 1 - t ) * ( p1 - p0 ) + 2 * t * ( p2 - p1 );

	},

	// Puay Bing, thanks for helping with this derivative!

	tangentCubicBezier: function (t, p0, p1, p2, p3 ) {

		return -3 * p0 * (1 - t) * (1 - t)  +
			3 * p1 * (1 - t) * (1-t) - 6 *t *p1 * (1-t) +
			6 * t *  p2 * (1-t) - 3 * t * t * p2 +
			3 * t * t * p3;
	},


	tangentSpline: function ( t, p0, p1, p2, p3 ) {

		// To check if my formulas are correct

		var h00 = 6 * t * t - 6 * t; 	// derived from 2t^3 − 3t^2 + 1
		var h10 = 3 * t * t - 4 * t + 1; // t^3 − 2t^2 + t
		var h01 = -6 * t * t + 6 * t; 	// − 2t3 + 3t2
		var h11 = 3 * t * t - 2 * t;	// t3 − t2

		return h00 + h10 + h01 + h11;

	},

	// Catmull-Rom

	interpolate: function( p0, p1, p2, p3, t ) {

		var v0 = ( p2 - p0 ) * 0.5;
		var v1 = ( p3 - p1 ) * 0.5;
		var t2 = t * t;
		var t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

};


/*
getPoint DONE
getLength DONE
getLengths DONE

curve.getPoints(); DONE
curve.getPointAtArcLength(t); DONE
curve.transform(params);
curve.getTangentAt(t); DONE
*/

/**************************************************************
 *	3D Curves
 **************************************************************/

// A Factory method for creating new curve subclasses

THREE.Curve.create = function( constructor, getPointFunc ) {

    var subClass = constructor;

	subClass.prototype = new THREE.Curve();

	subClass.prototype.constructor = constructor;
    subClass.prototype.getPoint = getPointFunc;

	return subClass;

};


/**************************************************************
 *	Line3D
 **************************************************************/

THREE.LineCurve3 = THREE.Curve.create(

	function ( v1, v2 ) {

		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var r = new THREE.Vector3();


		r.sub( this.v2, this.v1 ); // diff
		r.multiplyScalar( t );
		r.addSelf( this.v1 );

		return r;

	}

);


/**************************************************************
 *	Quadratic Bezier 3D curve
 **************************************************************/

THREE.QuadraticBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var tx, ty, tz;

		tx = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
		ty = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );
		tz = THREE.Shape.Utils.b2( t, this.v0.z, this.v1.z, this.v2.z );

		return new THREE.Vector3( tx, ty, tz );

	}

);



/**************************************************************
 *	Cubic Bezier 3D curve
 **************************************************************/

THREE.CubicBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2, v3 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;

	},

	function ( t ) {

		var tx, ty, tz;

		tx = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
		ty = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );
		tz = THREE.Shape.Utils.b3( t, this.v0.z, this.v1.z, this.v2.z, this.v3.z );

		return new THREE.Vector3( tx, ty, tz );

	}

);



/**************************************************************
 *	Spline 3D curve
 **************************************************************/


THREE.SplineCurve3 = THREE.Curve.create(

	function ( points /* array of Vector3 */) {

		this.points = (points == undefined) ? [] : points;

	},

	function ( t ) {

		var v = new THREE.Vector3();
		var c = [];
		var points = this.points, point, intPoint, weight;
		point = ( points.length - 1 ) * t;

		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
		c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

		v.x = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
		v.y = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );
		v.z = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].z, points[ c[ 1 ] ].z, points[ c[ 2 ] ].z, points[ c[ 3 ] ].z, weight );

		return v;

	}

);
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/

/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/

THREE.CurvePath = function () {

	this.curves = [];
	this.bends = [];

};

THREE.CurvePath.prototype = new THREE.Curve();
THREE.CurvePath.prototype.constructor = THREE.CurvePath;

THREE.CurvePath.prototype.add = function ( curve ) {

	this.curves.push( curve );

};

THREE.CurvePath.prototype.checkConnection = function() {

};

// Add a line curve  if start and end of lines are not connected

THREE.CurvePath.prototype.closePath = function() {

};

// To get accurate point with reference to
// entire path distance at time t,
// following has to be done:

// 1. Length of each sub path have to be known
// 2. Locate and identify type of curve
// 3. Get t for the curve
// 4. Return curve.getPointAt(t')

THREE.CurvePath.prototype.getPoint = function( t ) {

	var d = t * this.getLength();
	var curveLengths = this.getCurveLengths();
	var i = 0, diff, curve;

	// To think about boundaries points.

	while ( i < curveLengths.length ) {

		if ( curveLengths[ i ] >= d ) {

			diff = curveLengths[ i ] - d;
			curve = this.curves[ i ];

			var u = 1 - diff / curve.getLength();

			return curve.getPointAt( u );

			break;
		}

		i ++;

	}

	return null;

	// loop where sum != 0, sum > d , sum+1 <d

};

/*
THREE.CurvePath.prototype.getTangent = function( t ) {
};*/


// We cannot use the default THREE.Curve getPoint() with getLength() because in
// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
// getPoint() depends on getLength

THREE.CurvePath.prototype.getLength = function() {

	var lens = this.getCurveLengths();
	return lens[ lens.length - 1 ];

};

// Compute lengths and cache them
// We cannot overwrite getLengths() because UtoT mapping uses it.

THREE.CurvePath.prototype.getCurveLengths = function() {

	// We use cache values if curves and cache array are same length

	if ( this.cacheLengths && this.cacheLengths.length == this.curves.length ) {

		return this.cacheLengths;

	};

	// Get length of subsurve
	// Push sums into cached array

	var lengths = [], sums = 0;
	var i, il = this.curves.length;

	for ( i = 0; i < il; i ++ ) {

		sums += this.curves[ i ].getLength();
		lengths.push( sums );

	}

	this.cacheLengths = lengths;

	return lengths;

};



// Returns min and max coordinates, as well as centroid

THREE.CurvePath.prototype.getBoundingBox = function () {

	var points = this.getPoints();

	var maxX, maxY;
	var minX, minY;

	maxX = maxY = Number.NEGATIVE_INFINITY;
	minX = minY = Number.POSITIVE_INFINITY;

	var p, i, il, sum;

	sum = new THREE.Vector2();

	for ( i = 0, il = points.length; i < il; i ++ ) {

		p = points[ i ];

		if ( p.x > maxX ) maxX = p.x;
		else if ( p.x < minX ) minX = p.x;

		if ( p.y > maxY ) maxY = p.y;
		else if ( p.y < maxY ) minY = p.y;

		sum.addSelf( p.x, p.y );

	}

	return {

		minX: minX,
		minY: minY,
		maxX: maxX,
		maxY: maxY,
		centroid: sum.divideScalar( il )

	};

};

/**************************************************************
 *	Create Geometries Helpers
 **************************************************************/

/// Generate geometry from path points (for Line or ParticleSystem objects)

THREE.CurvePath.prototype.createPointsGeometry = function( divisions ) {

    var pts = this.getPoints( divisions, true );
	return this.createGeometry( pts );

};

// Generate geometry from equidistance sampling along the path

THREE.CurvePath.prototype.createSpacedPointsGeometry = function( divisions ) {

    var pts = this.getSpacedPoints( divisions, true );
	return this.createGeometry( pts );

};

THREE.CurvePath.prototype.createGeometry = function( points ) {

	var geometry = new THREE.Geometry();

    for( var i = 0; i < points.length; i ++ ) {

        geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( points[ i ].x, points[ i ].y, 0 ) ) );

    }

    return geometry;

};


/**************************************************************
 *	Bend / Wrap Helper Methods
 **************************************************************/

// Wrap path / Bend modifiers?

THREE.CurvePath.prototype.addWrapPath = function ( bendpath ) {

	this.bends.push( bendpath );

};

THREE.CurvePath.prototype.getTransformedPoints = function( segments, bends ) {

	var oldPts = this.getPoints( segments ); // getPoints getSpacedPoints
	var i, il;

	if ( !bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );

	}

	return oldPts;

};

THREE.CurvePath.prototype.getTransformedSpacedPoints = function( segments, bends ) {

	var oldPts = this.getSpacedPoints( segments );

	var i, il;

	if ( !bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );

	}

	return oldPts;

};

// This returns getPoints() bend/wrapped around the contour of a path.
// Read http://www.planetclegg.com/projects/WarpingTextToSplines.html

THREE.CurvePath.prototype.getWrapPoints = function ( oldPts, path ) {

	var bounds = this.getBoundingBox();

	var i, il, p, oldX, oldY, xNorm;

	for ( i = 0, il = oldPts.length; i < il; i ++ ) {

		p = oldPts[ i ];

		oldX = p.x;
		oldY = p.y;

		var xNorm = oldX/ bounds.maxX;

		// If using actual distance, for length > path, requires line extrusions
		//xNorm = path.getUtoTmapping(xNorm, oldX); // 3 styles. 1) wrap stretched. 2) wrap stretch by arc length 3) warp by actual distance

		xNorm = path.getUtoTmapping( xNorm, oldX );

		// check for out of bounds?

		var pathPt = path.getPoint( xNorm );
		var normal = path.getNormalVector( xNorm ).multiplyScalar( oldY );

		p.x = pathPt.x + normal.x;
		p.y = pathPt.y + normal.y;

	}

	return oldPts;

};

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 *
 **/

THREE.Path = function ( points ) {

	THREE.CurvePath.call(this);

	this.actions = [];

	if ( points ) {

		this.fromPoints( points );

	}

};

THREE.Path.prototype = new THREE.CurvePath();
THREE.Path.prototype.constructor = THREE.Path;


THREE.PathActions = {

	MOVE_TO: 'moveTo',
	LINE_TO: 'lineTo',
	QUADRATIC_CURVE_TO: 'quadraticCurveTo', // Bezier quadratic curve
	BEZIER_CURVE_TO: 'bezierCurveTo', 		// Bezier cubic curve
	CSPLINE_THRU: 'splineThru',				// Catmull-rom spline
	ARC: 'arc'								// Circle

};

// TODO Clean up PATH API

// Create path using straight lines to connect all points
// - vectors: array of Vector2

THREE.Path.prototype.fromPoints = function ( vectors ) {

	this.moveTo( vectors[ 0 ].x, vectors[ 0 ].y );

	var v, vlen = vectors.length;

	for ( v = 1; v < vlen; v++ ) {

		this.lineTo( vectors[ v ].x, vectors[ v ].y );

	};

};

// startPath() endPath()?

THREE.Path.prototype.moveTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );
	this.actions.push( { action: THREE.PathActions.MOVE_TO, args: args } );

};

THREE.Path.prototype.lineTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.LineCurve( new THREE.Vector2( x0, y0 ), new THREE.Vector2( x, y ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.LINE_TO, args: args } );

};

THREE.Path.prototype.quadraticCurveTo = function( aCPx, aCPy, aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.QuadraticBezierCurve( new THREE.Vector2( x0, y0 ),
												new THREE.Vector2( aCPx, aCPy ),
												new THREE.Vector2( aX, aY ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.QUADRATIC_CURVE_TO, args: args } );

};

THREE.Path.prototype.bezierCurveTo = function( aCP1x, aCP1y,
                                               aCP2x, aCP2y,
                                               aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.CubicBezierCurve( new THREE.Vector2( x0, y0 ),
											new THREE.Vector2( aCP1x, aCP1y ),
											new THREE.Vector2( aCP2x, aCP2y ),
											new THREE.Vector2( aX, aY ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.BEZIER_CURVE_TO, args: args } );

};

THREE.Path.prototype.splineThru = function( pts /*Array of Vector*/ ) {

	var args = Array.prototype.slice.call( arguments );
	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];
//---
	var npts = [ new THREE.Vector2( x0, y0 ) ];
	Array.prototype.push.apply( npts, pts );

	var curve = new THREE.SplineCurve( npts );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.CSPLINE_THRU, args: args } );

};

// FUTURE: Change the API or follow canvas API?
// TODO ARC ( x, y, x - radius, y - radius, startAngle, endAngle )

THREE.Path.prototype.arc = function ( aX, aY, aRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var args = Array.prototype.slice.call( arguments );

	var curve = new THREE.ArcCurve( aX, aY, aRadius,
									aStartAngle, aEndAngle, aClockwise );
	this.curves.push( curve );

	// console.log( 'arc', args );

	this.actions.push( { action: THREE.PathActions.ARC, args: args } );

 };


THREE.Path.prototype.getSpacedPoints = function ( divisions, closedPath ) {

	if ( !divisions ) divisions = 40;

	var points = [];

	for ( var i = 0; i < divisions; i ++ ) {

		points.push( this.getPoint( i / divisions ) );

		//if( !this.getPoint( i / divisions ) ) throw "DIE";

	}

	// if ( closedPath ) {
	//
	// 	points.push( points[ 0 ] );
	//
	// }

	return points;

};

/* Return an array of vectors based on contour of the path */

THREE.Path.prototype.getPoints = function( divisions, closedPath ) {

	divisions = divisions || 12;

	var points = [];

	var i, il, item, action, args;
	var cpx, cpy, cpx2, cpy2, cpx1, cpy1, cpx0, cpy0,
		laste, j,
		t, tx, ty;

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {

		item = this.actions[ i ];

		action = item.action;
		args = item.args;

		switch( action ) {

		case THREE.PathActions.MOVE_TO:

			// points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.LINE_TO:

			points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.QUADRATIC_CURVE_TO:

			cpx  = args[ 2 ];
			cpy  = args[ 3 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}

			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
				ty = THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

		  	}

			break;

		case THREE.PathActions.BEZIER_CURVE_TO:

			cpx  = args[ 4 ];
			cpy  = args[ 5 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			cpx2 = args[ 2 ];
			cpy2 = args[ 3 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}


			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
				ty = THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

			}

			break;

		case THREE.PathActions.CSPLINE_THRU:

			laste = this.actions[ i - 1 ].args;

			var last = new THREE.Vector2( laste[ laste.length - 2 ], laste[ laste.length - 1 ] );
			var spts = [ last ];

			var n = divisions * args[ 0 ].length;

			spts = spts.concat( args[ 0 ] );

			var spline = new THREE.SplineCurve( spts );

			for ( j = 1; j <= n; j ++ ) {

				points.push( spline.getPointAt( j / n ) ) ;

			}

			break;

		case THREE.PathActions.ARC:

			laste = this.actions[ i - 1 ].args;

			var aX = args[ 0 ], aY = args[ 1 ],
				aRadius = args[ 2 ],
				aStartAngle = args[ 3 ], aEndAngle = args[ 4 ],
				aClockwise = !!args[ 5 ];

			var lastx = laste[ laste.length - 2 ],
				lasty = laste[ laste.length - 1 ];

			if ( laste.length == 0 ) {

				lastx = lasty = 0;

			}


			var deltaAngle = aEndAngle - aStartAngle;
			var angle;
			var tdivisions = divisions * 2;
			var t;

			for ( j = 1; j <= tdivisions; j ++ ) {

				t = j / tdivisions;

				if ( !aClockwise ) {

					t = 1 - t;

				}

				angle = aStartAngle + t * deltaAngle;

				tx = lastx + aX + aRadius * Math.cos( angle );
				ty = lasty + aY + aRadius * Math.sin( angle );

				//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

				points.push( new THREE.Vector2( tx, ty ) );

			}

			//console.log(points);

		  break;

		} // end switch

	}

	if ( closedPath ) {

		points.push( points[ 0 ] );

	}

	return points;

};



// This was used for testing purposes. Should be removed soon.

THREE.Path.prototype.transform = function( path, segments ) {

	var bounds = this.getBoundingBox();
	var oldPts = this.getPoints( segments ); // getPoints getSpacedPoints

	//console.log( path.cacheArcLengths() );
	//path.getLengths(400);
	//segments = 40;

	return this.getWrapPoints( oldPts, path );

};

// Read http://www.tinaja.com/glib/nonlingr.pdf
// nonlinear transforms

THREE.Path.prototype.nltransform = function( a, b, c, d, e, f ) {

	// a - horizontal size
	// b - lean
	// c - x offset
	// d - vertical size
	// e - climb
	// f - y offset

	var oldPts = this.getPoints();

	var i, il, p, oldX, oldY;

	for ( i = 0, il = oldPts.length; i < il; i ++ ) {

		p = oldPts[i];

		oldX = p.x;
		oldY = p.y;

		p.x = a * oldX + b * oldY + c;
		p.y = d * oldY + e * oldX + f;

	}

	return oldPts;

};


// FUTURE Export JSON Format

/* Draws this path onto a 2d canvas easily */

THREE.Path.prototype.debug = function( canvas ) {

	var bounds = this.getBoundingBox();

	if ( !canvas ) {

		canvas = document.createElement( "canvas" );

		canvas.setAttribute( 'width',  bounds.maxX + 100 );
		canvas.setAttribute( 'height', bounds.maxY + 100 );

		document.body.appendChild( canvas );

	}

	var ctx = canvas.getContext( "2d" );
	ctx.fillStyle = "white";
	ctx.fillRect( 0, 0, canvas.width, canvas.height );

	ctx.strokeStyle = "black";
	ctx.beginPath();

	var i, il, item, action, args;

	// Debug Path

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {

		item = this.actions[ i ];

		args = item.args;
		action = item.action;

		// Short hand for now

		if ( action != THREE.PathActions.CSPLINE_THRU ) {

			ctx[ action ].apply( ctx, args );

		}

		/*
		switch ( action ) {

			case THREE.PathActions.MOVE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ] );
				break;

			case THREE.PathActions.LINE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ] );
				break;

			case THREE.PathActions.QUADRATIC_CURVE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ] );
				break;

			case THREE.PathActions.CUBIC_CURVE_TO:

				ctx[ action ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ] );
				break;

		}
		*/

	}

	ctx.stroke();
	ctx.closePath();

	// Debug Points

	ctx.strokeStyle = "red";

	/* TO CLEAN UP */

	var p, points = this.getPoints();

	//var theta = -90 /180 * Math.PI;
	//var p, points = this.transform( 0.866, - 0.866,0, 0.500 , 0.50,-50 );

	//0.866, - 0.866,0, 0.500 , 0.50,-50

	// Math.cos(theta),Math.sin(theta),100,
	// Math.cos(theta),-Math.sin(theta),-50

	// translate, scale, rotation


	for ( i = 0, il = points.length; i < il; i ++ ) {

		p = points[ i ];

		ctx.beginPath();
		ctx.arc( p.x, p.y, 1.5, 0, Math.PI * 2, false );
		ctx.stroke();
		ctx.closePath();

	}

};

// Breaks path into shapes

THREE.Path.prototype.toShapes = function() {

	var i, il, item, action, args;

	var subPaths = [], lastPath = new THREE.Path();

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {

		item = this.actions[ i ];

		args = item.args;
		action = item.action;

		if ( action == THREE.PathActions.MOVE_TO ) {

			if ( lastPath.actions.length != 0 ) {

				subPaths.push( lastPath );
				lastPath = new THREE.Path();

			}

		}

		lastPath[ action ].apply( lastPath, args );

	}

	if ( lastPath.actions.length != 0 ) {

		subPaths.push( lastPath );

	}

	//console.log(subPaths);

	if ( subPaths.length == 0 ) return [];

	var holesFirst = !THREE.Shape.Utils.isClockWise( subPaths[ 0 ].getPoints() );

	var tmpPath, tmpShape, shapes = [];

	//console.log("Holes first", holesFirst);

	if ( holesFirst ) {

		tmpShape = new THREE.Shape();

		for ( i = 0, il = subPaths.length; i < il; i ++ ) {

			tmpPath = subPaths[ i ];

			if ( THREE.Shape.Utils.isClockWise( tmpPath.getPoints() ) ) {

				tmpShape.actions = tmpPath.actions;
				tmpShape.curves = tmpPath.curves;

				shapes.push( tmpShape );
				tmpShape = new THREE.Shape();

				//console.log('cw', i);

			} else {

				tmpShape.holes.push( tmpPath );

				//console.log('ccw', i);

			}

		}

	} else {

		// Shapes first

		for ( i = 0, il = subPaths.length; i < il; i ++ ) {

			tmpPath = subPaths[ i ];

			if ( THREE.Shape.Utils.isClockWise( tmpPath.getPoints() ) ) {


				if ( tmpShape ) shapes.push( tmpShape );

				tmpShape = new THREE.Shape();
				tmpShape.actions = tmpPath.actions;
				tmpShape.curves = tmpPath.curves;

			} else {

				tmpShape.holes.push( tmpPath );

			}

		}

		shapes.push( tmpShape );

	}

	//console.log("shape", shapes);

	return shapes;

};
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/

// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.

THREE.Shape = function ( ) {

	THREE.Path.apply( this, arguments );
	this.holes = [];

};

THREE.Shape.prototype = new THREE.Path();
THREE.Shape.prototype.constructor = THREE.Path;

// Convenience method to return ExtrudeGeometry

THREE.Shape.prototype.extrude = function ( options ) {

	var extruded = new THREE.ExtrudeGeometry( this, options );
	return extruded;

};

// Get points of holes

THREE.Shape.prototype.getPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedPoints( divisions, this.bends );

	}

	return holesPts;

};

// Get points of holes (spaced by regular distance)

THREE.Shape.prototype.getSpacedPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedSpacedPoints( divisions, this.bends );

	}

	return holesPts;

};


// Get points of shape and holes (keypoints based on segments parameter)

THREE.Shape.prototype.extractAllPoints = function ( divisions ) {

	return {

		shape: this.getTransformedPoints( divisions ),
		holes: this.getPointsHoles( divisions )

	};

};

//
// THREE.Shape.prototype.extractAllPointsWithBend = function ( divisions, bend ) {
//
// 	return {
//
// 		shape: this.transform( bend, divisions ),
// 		holes: this.getPointsHoles( divisions, bend )
//
// 	};
//
// };

// Get points of shape and holes (spaced by regular distance)

THREE.Shape.prototype.extractAllSpacedPoints = function ( divisions ) {

	return {

		shape: this.getTransformedSpacedPoints( divisions ),
		holes: this.getSpacedPointsHoles( divisions )

	};

};

/**************************************************************
 *	Utils
 **************************************************************/

THREE.Shape.Utils = {

	/*
		contour - array of vector2 for contour
		holes   - array of array of vector2
	*/

	removeHoles: function ( contour, holes ) {

		var shape = contour.concat(); // work on this shape
		var allpoints = shape.concat();

		/* For each isolated shape, find the closest points and break to the hole to allow triangulation */


		var prevShapeVert, nextShapeVert,
			prevHoleVert, nextHoleVert,
			holeIndex, shapeIndex,
			shapeId, shapeGroup,
			h, h2,
			hole, shortest, d,
			p, pts1, pts2,
			tmpShape1, tmpShape2,
			tmpHole1, tmpHole2,
			verts = [];

		for ( h = 0; h < holes.length; h ++ ) {

			hole = holes[ h ];

			/*
			shapeholes[ h ].concat(); // preserves original
			holes.push( hole );
			*/

			Array.prototype.push.apply( allpoints, hole );

			shortest = Number.POSITIVE_INFINITY;


			// Find the shortest pair of pts between shape and hole

			// Note: Actually, I'm not sure now if we could optimize this to be faster than O(m*n)
			// Using distanceToSquared() intead of distanceTo() should speed a little
			// since running square roots operations are reduced.

			for ( h2 = 0; h2 < hole.length; h2 ++ ) {

				pts1 = hole[ h2 ];
				var dist = [];

				for ( p = 0; p < shape.length; p++ ) {

					pts2 = shape[ p ];
					d = pts1.distanceToSquared( pts2 );
					dist.push( d );

					if ( d < shortest ) {

						shortest = d;
						holeIndex = h2;
						shapeIndex = p;

					}

				}

			}

			//console.log("shortest", shortest, dist);

			prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
			prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1;

			var areaapts = [

				hole[ holeIndex ],
				shape[ shapeIndex ],
				shape[ prevShapeVert ]

			];

			var areaa = THREE.FontUtils.Triangulate.area( areaapts );

			var areabpts = [

				hole[ holeIndex ],
				hole[ prevHoleVert ],
				shape[ shapeIndex ]

			];

			var areab = THREE.FontUtils.Triangulate.area( areabpts );

			var shapeOffset = 1;
			var holeOffset = -1;

			var oldShapeIndex = shapeIndex, oldHoleIndex = holeIndex;
			shapeIndex += shapeOffset;
			holeIndex += holeOffset;

			if ( shapeIndex < 0 ) { shapeIndex += shape.length;  }
			shapeIndex %= shape.length;

			if ( holeIndex < 0 ) { holeIndex += hole.length;  }
			holeIndex %= hole.length;

			prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
			prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1;

			areaapts = [

				hole[ holeIndex ],
				shape[ shapeIndex ],
				shape[ prevShapeVert ]

			];

			var areaa2 = THREE.FontUtils.Triangulate.area( areaapts );

			areabpts = [

				hole[ holeIndex ],
				hole[ prevHoleVert ],
				shape[ shapeIndex ]

			];

			var areab2 = THREE.FontUtils.Triangulate.area( areabpts );
			//console.log(areaa,areab ,areaa2,areab2, ( areaa + areab ),  ( areaa2 + areab2 ));

			if ( ( areaa + areab ) > ( areaa2 + areab2 ) ) {

				// In case areas are not correct.
				//console.log("USE THIS");

				shapeIndex = oldShapeIndex;
				holeIndex = oldHoleIndex ;

				if ( shapeIndex < 0 ) { shapeIndex += shape.length;  }
				shapeIndex %= shape.length;

				if ( holeIndex < 0 ) { holeIndex += hole.length;  }
				holeIndex %= hole.length;

				prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
				prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1;

			} else {

				//console.log("USE THAT ")

			}

			tmpShape1 = shape.slice( 0, shapeIndex );
			tmpShape2 = shape.slice( shapeIndex );
			tmpHole1 = hole.slice( holeIndex );
			tmpHole2 = hole.slice( 0, holeIndex );

			// Should check orders here again?

			var trianglea = [

				hole[ holeIndex ],
				shape[ shapeIndex ],
				shape[ prevShapeVert ]

			];

			var triangleb = [

				hole[ holeIndex ] ,
				hole[ prevHoleVert ],
				shape[ shapeIndex ]

			];

			verts.push( trianglea );
			verts.push( triangleb );

			shape = tmpShape1.concat( tmpHole1 ).concat( tmpHole2 ).concat( tmpShape2 );

		}

		return {

			shape:shape, 		/* shape with no holes */
			isolatedPts: verts, /* isolated faces */
			allpoints: allpoints

		}


	},

	triangulateShape: function ( contour, holes ) {

		var shapeWithoutHoles = THREE.Shape.Utils.removeHoles( contour, holes );

		var shape = shapeWithoutHoles.shape,
			allpoints = shapeWithoutHoles.allpoints,
			isolatedPts = shapeWithoutHoles.isolatedPts;

		var triangles = THREE.FontUtils.Triangulate( shape, false ); // True returns indices for points of spooled shape

		// To maintain reference to old shape, one must match coordinates, or offset the indices from original arrays. It's probably easier to do the first.

		//console.log( "triangles",triangles, triangles.length );
		//console.log( "allpoints",allpoints, allpoints.length );

		var i, il, f, face,
			key, index,
			allPointsMap = {},
			isolatedPointsMap = {};

		// prepare all points map

		for ( i = 0, il = allpoints.length; i < il; i ++ ) {

			key = allpoints[ i ].x + ":" + allpoints[ i ].y;

			if ( allPointsMap[ key ] !== undefined ) {

				console.log( "Duplicate point", key );

			}

			allPointsMap[ key ] = i;

		}

		// check all face vertices against all points map

		for ( i = 0, il = triangles.length; i < il; i ++ ) {

			face = triangles[ i ];

			for ( f = 0; f < 3; f ++ ) {

				key = face[ f ].x + ":" + face[ f ].y;

				index = allPointsMap[ key ];

				if ( index !== undefined ) {

					face[ f ] = index;

				}

			}

		}

		// check isolated points vertices against all points map

		for ( i = 0, il = isolatedPts.length; i < il; i ++ ) {

			face = isolatedPts[ i ];

			for ( f = 0; f < 3; f ++ ) {

				key = face[ f ].x + ":" + face[ f ].y;

				index = allPointsMap[ key ];

				if ( index !== undefined ) {

					face[ f ] = index;

				}

			}

		}

		return triangles.concat( isolatedPts );

	}, // end triangulate shapes

	/*
	triangulate2 : function( pts, holes ) {

		// For use with Poly2Tri.js

		var allpts = pts.concat();
		var shape = [];
		for (var p in pts) {
			shape.push(new js.poly2tri.Point(pts[p].x, pts[p].y));
		}

		var swctx = new js.poly2tri.SweepContext(shape);

		for (var h in holes) {
			var aHole = holes[h];
			var newHole = []
			for (i in aHole) {
				newHole.push(new js.poly2tri.Point(aHole[i].x, aHole[i].y));
				allpts.push(aHole[i]);
			}
			swctx.AddHole(newHole);
		}

		var find;
		var findIndexForPt = function (pt) {
			find = new THREE.Vector2(pt.x, pt.y);
			var p;
			for (p=0, pl = allpts.length; p<pl; p++) {
				if (allpts[p].equals(find)) return p;
			}
			return -1;
		};

		// triangulate
		js.poly2tri.sweep.Triangulate(swctx);

		var triangles =  swctx.GetTriangles();
		var tr ;
		var facesPts = [];
		for (var t in triangles) {
			tr =  triangles[t];
			facesPts.push([
				findIndexForPt(tr.GetPoint(0)),
				findIndexForPt(tr.GetPoint(1)),
				findIndexForPt(tr.GetPoint(2))
					]);
		}


	//	console.log(facesPts);
	//	console.log("triangles", triangles.length, triangles);

		// Returns array of faces with 3 element each
	return facesPts;
	},
*/

	isClockWise: function ( pts ) {

		return THREE.FontUtils.Triangulate.area( pts ) < 0;

	},

	// Bezier Curves formulas obtained from
	// http://en.wikipedia.org/wiki/B%C3%A9zier_curve

	// Quad Bezier Functions

	b2p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * p;

	},

	b2p1: function ( t, p ) {

		return 2 * ( 1 - t ) * t * p;

	},

	b2p2: function ( t, p ) {

		return t * t * p;

	},

	b2: function ( t, p0, p1, p2 ) {

		return this.b2p0( t, p0 ) + this.b2p1( t, p1 ) + this.b2p2( t, p2 );

	},

	// Cubic Bezier Functions

	b3p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * k * p;

	},

	b3p1: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * k * t * p;

	},

	b3p2: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * t * t * p;

	},

	b3p3: function ( t, p ) {

		return t * t * t * p;

	},

	b3: function ( t, p0, p1, p2, p3 ) {

		return this.b3p0( t, p0 ) + this.b3p1( t, p1 ) + this.b3p2( t, p2 ) +  this.b3p3( t, p3 );

	}

};

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * TextPath
 *
 **/

THREE.TextPath = function ( text, parameters ) {

	THREE.Path.call( this );

	this.parameters = parameters || {};

	this.set( text );

};

THREE.TextPath.prototype.set = function ( text, parameters ) {

	this.text = text;

	var parameters = parameters || this.parameters;

	var size = parameters.size !== undefined ? parameters.size : 100;
	var curveSegments = parameters.curveSegments !== undefined ? parameters.curveSegments: 4;

	var font = parameters.font !== undefined ? parameters.font : "helvetiker";
	var weight = parameters.weight !== undefined ? parameters.weight : "normal";
	var style = parameters.style !== undefined ? parameters.style : "normal";

	THREE.FontUtils.size = size;
	THREE.FontUtils.divisions = curveSegments;

	THREE.FontUtils.face = font;
	THREE.FontUtils.weight = weight;
	THREE.FontUtils.style = style;

};



THREE.TextPath.prototype.toShapes = function () {

	// Get a Font data json object

	var data = THREE.FontUtils.drawText( this.text );

	var paths = data.paths;
	var shapes = [];

	for ( var p = 0, pl = paths.length; p < pl; p ++ ) {

		Array.prototype.push.apply( shapes, paths[ p ].toShapes() );

	}

	return shapes;

	//console.log(path);
	//console.log(fontShapes);

	// Either find actions or curves.

	//var text3d = new THREE.ExtrudeGeometry( shapes , { amount: 20, bevelEnabled:true, bevelThickness:3	} );

	//return text3d;

};
/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.AnimationHandler = (function() {

	var playing = [];
	var library = {};
	var that    = {};


	//--- update ---

	that.update = function( deltaTimeMS ) {

		for( var i = 0; i < playing.length; i++ )
			playing[ i ].update( deltaTimeMS );

	};


	//--- add ---

	that.addToUpdate = function( animation ) {

		if( playing.indexOf( animation ) === -1 )
			playing.push( animation );

	};


	//--- remove ---

	that.removeFromUpdate = function( animation ) {

		var index = playing.indexOf( animation );

		if( index !== -1 )
			playing.splice( index, 1 );

	};


	//--- add ---

	that.add = function( data ) {

		if( library[ data.name ] !== undefined )
			console.log( "THREE.AnimationHandler.add: Warning! " + data.name + " already exists in library. Overwriting." );

		library[ data.name ] = data;
		initData( data );

	};


	//--- get ---

	that.get = function( name ) {

		if( typeof name === "string" ) {

			if( library[ name ] ) {

				return library[ name ];

			} else {

				console.log( "THREE.AnimationHandler.get: Couldn't find animation " + name );
				return null;

			}

		} else {

			// todo: add simple tween library

		}

	};

	//--- parse ---

	that.parse = function( root ) {

		// setup hierarchy

		var hierarchy = [];

		if ( root instanceof THREE.SkinnedMesh ) {

			for( var b = 0; b < root.bones.length; b++ ) {

				hierarchy.push( root.bones[ b ] );

			}

		} else {

			parseRecurseHierarchy( root, hierarchy );

		}

		return hierarchy;

	};

	var parseRecurseHierarchy = function( root, hierarchy ) {

		hierarchy.push( root );

		for( var c = 0; c < root.children.length; c++ )
			parseRecurseHierarchy( root.children[ c ], hierarchy );

	}


	//--- init data ---

	var initData = function( data ) {

		if( data.initialized === true )
			return;


		// loop through all keys

		for( var h = 0; h < data.hierarchy.length; h ++ ) {

			for( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

				// remove minus times

				if( data.hierarchy[ h ].keys[ k ].time < 0 )
					data.hierarchy[ h ].keys[ k ].time = 0;


				// create quaternions

				if( data.hierarchy[ h ].keys[ k ].rot !== undefined &&
				 !( data.hierarchy[ h ].keys[ k ].rot instanceof THREE.Quaternion ) ) {

					var quat = data.hierarchy[ h ].keys[ k ].rot;
					data.hierarchy[ h ].keys[ k ].rot = new THREE.Quaternion( quat[0], quat[1], quat[2], quat[3] );

				}
			}


			// prepare morph target keys

			if( data.hierarchy[ h ].keys[ 0 ].morphTargets !== undefined ) {

				// get all used

				var usedMorphTargets = {};

				for( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

					for( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m ++ ) {

						var morphTargetName = data.hierarchy[ h ].keys[ k ].morphTargets[ m ];
						usedMorphTargets[ morphTargetName ] = -1;

					}

				}

				data.hierarchy[ h ].usedMorphTargets = usedMorphTargets;


				// set all used on all frames

				for( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

					var influences = {};

					for( var morphTargetName in usedMorphTargets ) {

						for( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m ++ ) {

							if( data.hierarchy[ h ].keys[ k ].morphTargets[ m ] === morphTargetName ) {

								influences[ morphTargetName ] = data.hierarchy[ h ].keys[ k ].morphTargetsInfluences[ m ];
								break;

							}

						}

						if( m === data.hierarchy[ h ].keys[ k ].morphTargets.length ) {

							influences[ morphTargetName ] = 0;

						}

					}

					data.hierarchy[ h ].keys[ k ].morphTargetsInfluences = influences;

				}

			}


			// remove all keys that are on the same time

			for( var k = 1; k < data.hierarchy[ h ].keys.length; k ++ ) {

				if( data.hierarchy[ h ].keys[ k ].time === data.hierarchy[ h ].keys[ k - 1 ].time ) {

					data.hierarchy[ h ].keys.splice( k, 1 );
					k --;

				}

			}


			// set index

			for( var k = 1; k < data.hierarchy[ h ].keys.length; k ++ ) {

				data.hierarchy[ h ].keys[ k ].index = k;

			}

		}


		// JIT

		var lengthInFrames = parseInt( data.length * data.fps, 10 );

		data.JIT = {};
		data.JIT.hierarchy = [];

		for( var h = 0; h < data.hierarchy.length; h ++ )
			data.JIT.hierarchy.push( new Array( lengthInFrames ) );


		// done

		data.initialized = true;

	};


	// interpolation types

	that.LINEAR = 0;
	that.CATMULLROM = 1;
	that.CATMULLROM_FORWARD = 2;

	return that;

}());
/**
 * @author mikael emtinger / http://gomo.se/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Animation = function( root, data, interpolationType, JITCompile ) {

	this.root = root;
	this.data = THREE.AnimationHandler.get( data );
	this.hierarchy = THREE.AnimationHandler.parse( root );
	this.currentTime = 0;
	this.timeScale = 1;
	this.isPlaying = false;
	this.isPaused = true;
	this.loop = true;
	this.interpolationType = interpolationType !== undefined ? interpolationType : THREE.AnimationHandler.LINEAR;
	this.JITCompile = JITCompile !== undefined ? JITCompile : true;

	this.points = [];
	this.target = new THREE.Vector3();

};

// Play

THREE.Animation.prototype.play = function( loop, startTimeMS ) {

	if( !this.isPlaying ) {

		this.isPlaying = true;
		this.loop = loop !== undefined ? loop : true;
		this.currentTime = startTimeMS !== undefined ? startTimeMS : 0;


		// reset key cache

		var h, hl = this.hierarchy.length,
			object;

		for ( h = 0; h < hl; h++ ) {

			object = this.hierarchy[ h ];

			if ( this.interpolationType !== THREE.AnimationHandler.CATMULLROM_FORWARD ) {

				object.useQuaternion = true;

			}

			object.matrixAutoUpdate = true;

			if ( object.animationCache === undefined ) {

				object.animationCache = {};
				object.animationCache.prevKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.nextKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.originalMatrix = object instanceof THREE.Bone ? object.skinMatrix : object.matrix;

			}

			var prevKey = object.animationCache.prevKey;
			var nextKey = object.animationCache.nextKey;

			prevKey.pos = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.rot = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.scl = this.data.hierarchy[ h ].keys[ 0 ];

			nextKey.pos = this.getNextKeyWith( "pos", h, 1 );
			nextKey.rot = this.getNextKeyWith( "rot", h, 1 );
			nextKey.scl = this.getNextKeyWith( "scl", h, 1 );

		}

		this.update( 0 );

	}

	this.isPaused = false;

	THREE.AnimationHandler.addToUpdate( this );

};



// Pause

THREE.Animation.prototype.pause = function() {

	if( this.isPaused ) {

		THREE.AnimationHandler.addToUpdate( this );

	} else {

		THREE.AnimationHandler.removeFromUpdate( this );

	}

	this.isPaused = !this.isPaused;

};


// Stop

THREE.Animation.prototype.stop = function() {

	this.isPlaying = false;
	this.isPaused  = false;
	THREE.AnimationHandler.removeFromUpdate( this );


	// reset JIT matrix and remove cache

	for ( var h = 0; h < this.hierarchy.length; h++ ) {

		if ( this.hierarchy[ h ].animationCache !== undefined ) {

			if( this.hierarchy[ h ] instanceof THREE.Bone ) {

				this.hierarchy[ h ].skinMatrix = this.hierarchy[ h ].animationCache.originalMatrix;

			} else {

				this.hierarchy[ h ].matrix = this.hierarchy[ h ].animationCache.originalMatrix;

			}


			delete this.hierarchy[ h ].animationCache;

		}

	}

};


// Update

THREE.Animation.prototype.update = function( deltaTimeMS ) {

	// early out

	if( !this.isPlaying ) return;


	// vars

	var types = [ "pos", "rot", "scl" ];
	var type;
	var scale;
	var vector;
	var prevXYZ, nextXYZ;
	var prevKey, nextKey;
	var object;
	var animationCache;
	var frame;
	var JIThierarchy = this.data.JIT.hierarchy;
	var currentTime, unloopedCurrentTime;
	var currentPoint, forwardPoint, angle;


	// update

	this.currentTime += deltaTimeMS * this.timeScale;

	unloopedCurrentTime = this.currentTime;
	currentTime         = this.currentTime = this.currentTime % this.data.length;
	frame               = parseInt( Math.min( currentTime * this.data.fps, this.data.length * this.data.fps ), 10 );


	// update

	for ( var h = 0, hl = this.hierarchy.length; h < hl; h++ ) {

		object = this.hierarchy[ h ];
		animationCache = object.animationCache;

		// use JIT?

		if ( this.JITCompile && JIThierarchy[ h ][ frame ] !== undefined ) {

			if( object instanceof THREE.Bone ) {

				object.skinMatrix = JIThierarchy[ h ][ frame ];

				object.matrixAutoUpdate = false;
				object.matrixWorldNeedsUpdate = false;

			} else {

				object.matrix = JIThierarchy[ h ][ frame ];

				object.matrixAutoUpdate = false;
				object.matrixWorldNeedsUpdate = true;

			}

		// use interpolation

		} else {

			// make sure so original matrix and not JIT matrix is set

			if ( this.JITCompile ) {

				if( object instanceof THREE.Bone ) {

					object.skinMatrix = object.animationCache.originalMatrix;

				} else {

					object.matrix = object.animationCache.originalMatrix;

				}

			}


			// loop through pos/rot/scl

			for ( var t = 0; t < 3; t++ ) {

				// get keys

				type    = types[ t ];
				prevKey = animationCache.prevKey[ type ];
				nextKey = animationCache.nextKey[ type ];

				// switch keys?

				if ( nextKey.time <= unloopedCurrentTime ) {

					// did we loop?

					if ( currentTime < unloopedCurrentTime ) {

						if ( this.loop ) {

							prevKey = this.data.hierarchy[ h ].keys[ 0 ];
							nextKey = this.getNextKeyWith( type, h, 1 );

							while( nextKey.time < currentTime ) {

								prevKey = nextKey;
								nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

							}

						} else {

							this.stop();
							return;

						}

					} else {

						do {

							prevKey = nextKey;
							nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

						} while( nextKey.time < currentTime )

					}

					animationCache.prevKey[ type ] = prevKey;
					animationCache.nextKey[ type ] = nextKey;

				}


				object.matrixAutoUpdate = true;
				object.matrixWorldNeedsUpdate = true;

				scale = ( currentTime - prevKey.time ) / ( nextKey.time - prevKey.time );
				prevXYZ = prevKey[ type ];
				nextXYZ = nextKey[ type ];


				// check scale error

				if ( scale < 0 || scale > 1 ) {

					console.log( "THREE.Animation.update: Warning! Scale out of bounds:" + scale + " on bone " + h );
					scale = scale < 0 ? 0 : 1;

				}

				// interpolate

				if ( type === "pos" ) {

					vector = object.position;

					if( this.interpolationType === THREE.AnimationHandler.LINEAR ) {

						vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
						vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
						vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

					} else if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
							    this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

						this.points[ 0 ] = this.getPrevKeyWith( "pos", h, prevKey.index - 1 )[ "pos" ];
						this.points[ 1 ] = prevXYZ;
						this.points[ 2 ] = nextXYZ;
						this.points[ 3 ] = this.getNextKeyWith( "pos", h, nextKey.index + 1 )[ "pos" ];

						scale = scale * 0.33 + 0.33;

						currentPoint = this.interpolateCatmullRom( this.points, scale );

						vector.x = currentPoint[ 0 ];
						vector.y = currentPoint[ 1 ];
						vector.z = currentPoint[ 2 ];

						if( this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

							forwardPoint = this.interpolateCatmullRom( this.points, scale * 1.01 );

							this.target.set( forwardPoint[ 0 ], forwardPoint[ 1 ], forwardPoint[ 2 ] );
							this.target.subSelf( vector );
							this.target.y = 0;
							this.target.normalize();

							angle = Math.atan2( this.target.x, this.target.z );
							object.rotation.set( 0, angle, 0 );

						}

					}

				} else if ( type === "rot" ) {

					THREE.Quaternion.slerp( prevXYZ, nextXYZ, object.quaternion, scale );

				} else if( type === "scl" ) {

					vector = object.scale;

					vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
					vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
					vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

				}

			}

		}

	}

	// update JIT?

	if ( this.JITCompile ) {

		if ( JIThierarchy[ 0 ][ frame ] === undefined ) {

			this.hierarchy[ 0 ].update( null, true );

			for ( var h = 0; h < this.hierarchy.length; h++ ) {

				if( this.hierarchy[ h ] instanceof THREE.Bone ) {

					JIThierarchy[ h ][ frame ] = this.hierarchy[ h ].skinMatrix.clone();

				} else {

					JIThierarchy[ h ][ frame ] = this.hierarchy[ h ].matrix.clone();

				}

			}

		}

	}

};

// Catmull-Rom spline

THREE.Animation.prototype.interpolateCatmullRom = function ( points, scale ) {

	var c = [], v3 = [],
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;

	point = ( points.length - 1 ) * scale;
	intPoint = Math.floor( point );
	weight = point - intPoint;

	c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
	c[ 1 ] = intPoint;
	c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
	c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

	pa = points[ c[ 0 ] ];
	pb = points[ c[ 1 ] ];
	pc = points[ c[ 2 ] ];
	pd = points[ c[ 3 ] ];

	w2 = weight * weight;
	w3 = weight * w2;

	v3[ 0 ] = this.interpolate( pa[ 0 ], pb[ 0 ], pc[ 0 ], pd[ 0 ], weight, w2, w3 );
	v3[ 1 ] = this.interpolate( pa[ 1 ], pb[ 1 ], pc[ 1 ], pd[ 1 ], weight, w2, w3 );
	v3[ 2 ] = this.interpolate( pa[ 2 ], pb[ 2 ], pc[ 2 ], pd[ 2 ], weight, w2, w3 );

	return v3;

};

THREE.Animation.prototype.interpolate = function( p0, p1, p2, p3, t, t2, t3 ) {

	var v0 = ( p2 - p0 ) * 0.5,
		v1 = ( p3 - p1 ) * 0.5;

	return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

};



// Get next key with

THREE.Animation.prototype.getNextKeyWith = function( type, h, key ) {

	var keys = this.data.hierarchy[ h ].keys;

	if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
		 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

		key = key < keys.length - 1 ? key : keys.length - 1;

	} else {

		key = key % keys.length;

	}

	for ( ; key < keys.length; key++ ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ 0 ];

};

// Get previous key with

THREE.Animation.prototype.getPrevKeyWith = function( type, h, key ) {

	var keys = this.data.hierarchy[ h ].keys;

	if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
		 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

		key = key > 0 ? key : 0;

	} else {

		key = key >= 0 ? key : key + keys.length;

	}


	for ( ; key >= 0; key-- ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ keys.length - 1 ];

};
/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CubeCamera = function ( near, far, heightOffset, cubeResolution ) {

	this.heightOffset = heightOffset;
	this.position = new THREE.Vector3( 0, heightOffset, 0 );

	// cameras

	var fov = 90, aspect = 1;

	this.cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );

	this.cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );

	this.cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	this.cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );

	this.cameraPX.position = this.position;
	this.cameraNX.position = this.position;

	this.cameraPY.position = this.position;
	this.cameraNY.position = this.position;

	this.cameraPZ.position = this.position;
	this.cameraNZ.position = this.position;

	this.cameraPX.up.set( 0, -1, 0 );
	this.cameraNX.up.set( 0, -1, 0 );

	this.cameraPY.up.set( 0, 0, 1 );
	this.cameraNY.up.set( 0, 0, -1 );

	this.cameraPZ.up.set( 0, -1, 0 );
	this.cameraNZ.up.set( 0, -1, 0 );

	// targets

	this.targetPX = new THREE.Vector3( 0, 0, 0 );
	this.targetNX = new THREE.Vector3( 0, 0, 0 );

	this.targetPY = new THREE.Vector3( 0, 0, 0 );
	this.targetNY = new THREE.Vector3( 0, 0, 0 );

	this.targetPZ = new THREE.Vector3( 0, 0, 0 );
	this.targetNZ = new THREE.Vector3( 0, 0, 0 );

	// cube render target

	this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } );

	this.updatePosition = function ( position ) {

		this.position.copy( position );

		this.position.y += this.heightOffset;

		this.targetPX.copy( this.position );
		this.targetNX.copy( this.position );

		this.targetPY.copy( this.position );
		this.targetNY.copy( this.position );

		this.targetPZ.copy( this.position );
		this.targetNZ.copy( this.position );

		this.targetPX.x += 1;
		this.targetNX.x -= 1;

		this.targetPY.y += 1;
		this.targetNY.y -= 1;

		this.targetPZ.z += 1;
		this.targetNZ.z -= 1;

		this.cameraPX.lookAt( this.targetPX );
		this.cameraNX.lookAt( this.targetNX );

		this.cameraPY.lookAt( this.targetPY );
		this.cameraNY.lookAt( this.targetNY );

		this.cameraPZ.lookAt( this.targetPZ );
		this.cameraNZ.lookAt( this.targetNZ );

	};

	this.updateCubeMap = function ( renderer, scene ) {

		var cubeTarget = this.renderTarget;

		cubeTarget.activeCubeFace = 0;
		renderer.render( scene, this.cameraPX, cubeTarget );

		cubeTarget.activeCubeFace = 1;
		renderer.render( scene, this.cameraNX, cubeTarget );

		cubeTarget.activeCubeFace = 2;
		renderer.render( scene, this.cameraPY, cubeTarget );

		cubeTarget.activeCubeFace = 3;
		renderer.render( scene, this.cameraNY, cubeTarget );

		cubeTarget.activeCubeFace = 4;
		renderer.render( scene, this.cameraPZ, cubeTarget );

		cubeTarget.activeCubeFace = 5;
		renderer.render( scene, this.cameraNZ, cubeTarget );

	};

};THREE.FirstPersonCamera = function () {

	console.warn( 'DEPRECATED: FirstPersonCamera() is FirstPersonControls().' );

};
THREE.PathCamera = function () {

	console.warn( 'DEPRECATED: PathCamera() is PathControls().' );

};
THREE.FlyCamera = function () {

	console.warn( 'DEPRECATED: FlyCamera() is FlyControls().' );

};
THREE.RollCamera = function () {

	console.warn( 'DEPRECATED: RollCamera() is RollControls().' );

};
THREE.TrackballCamera = function () {

	console.warn( 'DEPRECATED: TrackballCamera() is TrackballControls().' );

};
/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog 
 * 
 *	A handy general perpose camera, for setting FOV, Lens Focal Length,  
 *		and switching between perspective and orthographic views easily.
 *
 */


THREE.CombinedCamera = function ( width, height, fov, near, far, orthonear, orthofar ) {

	THREE.Camera.call( this );

	this.fov = fov;
	
	this.left = -width / 2;
	this.right = width / 2
	this.top = height / 2;
	this.bottom = -height / 2;
	
	// We could also handle the projectionMatrix internally, but just wanted to test nested camera objects
	this.cameraO = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 	orthonear, orthofar );
	this.cameraP = new THREE.PerspectiveCamera( fov, width/height, near, far );

	this.zoom = 1;
	
	this.toPerspective();
	
	
	var aspect = width/height;
	
	


};

THREE.CombinedCamera.prototype = new THREE.Camera();
THREE.CombinedCamera.prototype.constructor = THREE.CoolCamera;

THREE.CombinedCamera.prototype.toPerspective = function () {

	this.near = this.cameraP.near;
	this.far = this.cameraP.far;
	this.cameraP.fov =  this.fov / this.zoom ;
	this.cameraP.updateProjectionMatrix();
	this.projectionMatrix = this.cameraP.projectionMatrix;
	
	this.inPersepectiveMode = true;
	this.inOrthographicMode = false;

};

THREE.CombinedCamera.prototype.toOrthographic = function () {

	// Orthographic from Perspective
	var fov = this.fov;
	var aspect = this.cameraP.aspect;
	var near = this.cameraP.near;
	var far = this.cameraP.far;
	
	
	// Just pretend we want the mid plane of the viewing frustum
	var hyperfocus = ( near + far ) / 2; 
	
	var halfHeight = Math.tan( fov / 2 ) * hyperfocus;
	var planeHeight = 2 * halfHeight;
	var planeWidth = planeHeight * aspect;
	var halfWidth = planeWidth / 2;
	
	halfHeight /= this.zoom;
	halfWidth /= this.zoom;
	
	this.cameraO.left = -halfWidth;
	this.cameraO.right = halfWidth;
	this.cameraO.top = halfHeight;
	this.cameraO.bottom = -halfHeight;
	
	// this.cameraO.left = -farHalfWidth;
	// this.cameraO.right = farHalfWidth;
	// this.cameraO.top = farHalfHeight;
	// this.cameraO.bottom = -farHalfHeight;

	// this.cameraO.left = this.left / this.zoom;
	// this.cameraO.right = this.right / this.zoom;
	// this.cameraO.top = this.top / this.zoom;
	// this.cameraO.bottom = this.bottom / this.zoom;
	
	this.cameraO.updateProjectionMatrix();

	this.near = this.cameraO.near;
	this.far = this.cameraO.far;
	this.projectionMatrix = this.cameraO.projectionMatrix;
	
	this.inPersepectiveMode = false;
	this.inOrthographicMode = true;

};

THREE.CombinedCamera.prototype.setFov = function(fov) {	
	this.fov = fov;
	
	if (this.inPersepectiveMode) {
		this.toPerspective();
	} else {
		this.toOrthographic();
	}

};

/*
* Uses Focal Length (in mm) to estimate and set FOV
* 35mm (fullframe) camera is used if frame size is not specified;
* Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
*/
THREE.CombinedCamera.prototype.setLens = function(focalLength, framesize) {

	if (!framesize) framesize = 43.25; // 36x24mm

	var fov = 2 * Math.atan( framesize / (focalLength * 2));
	fov = 180 / Math.PI * fov;
	this.setFov(fov);

	return fov;
};


THREE.CombinedCamera.prototype.setZoom = function(zoom) {

	this.zoom = zoom;
	
	if (this.inPersepectiveMode) {
		this.toPerspective();
	} else {
		this.toOrthographic();
	}
	

};

THREE.CombinedCamera.prototype.toFrontView = function() {
	this.rotation.x = 0;
	this.rotation.y = 0;
	this.rotation.z = 0;
	
	//TODO: Better way to disable camera.lookAt()?
	this.rotationAutoUpdate = false;
};

THREE.CombinedCamera.prototype.toBackView = function() {
	this.rotation.x = 0;
	this.rotation.y = Math.PI;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;
};
	
THREE.CombinedCamera.prototype.toLeftView = function() {
	this.rotation.x = 0;
	this.rotation.y = - Math.PI / 2;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;
};

THREE.CombinedCamera.prototype.toRightView = function() {
	this.rotation.x = 0;
	this.rotation.y = Math.PI / 2;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;
};

THREE.CombinedCamera.prototype.toTopView = function() {
	this.rotation.x = - Math.PI / 2;
	this.rotation.y = 0;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;
};

THREE.CombinedCamera.prototype.toBottomView = function() {
	this.rotation.x = Math.PI / 2;
	this.rotation.y = 0;
	this.rotation.z = 0;
	this.rotationAutoUpdate = false;
};

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.noFly = false;
	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	if ( this.domElement === document ) {

		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;

	} else {

		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );

	}

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.update = function( delta ) {
		var actualMoveSpeed = 0;
		if ( !this.freeze ) {

			if ( this.heightSpeed ) {

				var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;

				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			actualMoveSpeed = delta * this.movementSpeed;

			if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
			if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

			if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
			if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

			if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
			if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

			var actualLookSpeed = delta * this.lookSpeed;

			if ( !this.activeLook ) {

				actualLookSpeed = 0;

			}

			this.lon += this.mouseX * actualLookSpeed;
			if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed;

			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = ( 90 - this.lat ) * Math.PI / 180;
			this.theta = this.lon * Math.PI / 180;

			var targetPosition = this.target,
				position = this.object.position;

			targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
			targetPosition.y = position.y + 100 * Math.cos( this.phi );
			targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = ( 90 - this.lat ) * Math.PI / 180;

		this.theta = this.lon * Math.PI / 180;

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.PathControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.id = "PathControls" + THREE.PathControlsIdCounter ++;

	// API

	this.duration = 10 * 1000; // milliseconds
	this.waypoints = [];

	this.useConstantSpeed = true;
	this.resamplingCoef = 50;

	this.debugPath = new THREE.Object3D();
	this.debugDummy = new THREE.Object3D();

	this.animationParent = new THREE.Object3D();

	this.lookSpeed = 0.005;
	this.lookVertical = true;
	this.lookHorizontal = true;
	this.verticalAngleMap   = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 0, 2 * Math.PI ] };
	this.horizontalAngleMap = { srcRange: [ 0, 2 * Math.PI ], dstRange: [ 0, 2 * Math.PI ] };

	// internals

	this.target = new THREE.Object3D();

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;

	this.phi = 0;
	this.theta = 0;

	if ( this.domElement === document ) {

		this.viewHalfX = window.innerWidth / 2;
		this.viewHalfY = window.innerHeight / 2;

	} else {

		this.viewHalfX = this.domElement.offsetWidth / 2;
		this.viewHalfY = this.domElement.offsetHeight / 2;
		this.domElement.setAttribute( 'tabindex', -1 );

	}

	var PI2 = Math.PI * 2,
		PI180 = Math.PI / 180;

	// methods

	this.update = function ( delta ) {

		var srcRange, dstRange;

		if( this.lookHorizontal ) this.lon += this.mouseX * this.lookSpeed * delta;
		if( this.lookVertical )   this.lat -= this.mouseY * this.lookSpeed * delta;

		this.lon = Math.max( 0, Math.min( 360, this.lon ) );
		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );

		this.phi = ( 90 - this.lat ) * PI180;
		this.theta = this.lon * PI180;

		this.phi = normalize_angle_rad( this.phi );

		// constrain vertical look angle

		srcRange = this.verticalAngleMap.srcRange;
		dstRange = this.verticalAngleMap.dstRange;

		var tmpPhi = THREE.Math.mapLinear( this.phi, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		var tmpPhiFullRange = dstRange[ 1 ] - dstRange[ 0 ];
		var tmpPhiNormalized = ( tmpPhi - dstRange[ 0 ] ) / tmpPhiFullRange;

		this.phi = QuadraticEaseInOut( tmpPhiNormalized ) * tmpPhiFullRange + dstRange[ 0 ];

		// constrain horizontal look angle

		srcRange = this.horizontalAngleMap.srcRange;
		dstRange = this.horizontalAngleMap.dstRange;

		var tmpTheta = THREE.Math.mapLinear( this.theta, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		var tmpThetaFullRange = dstRange[ 1 ] - dstRange[ 0 ];
		var tmpThetaNormalized = ( tmpTheta - dstRange[ 0 ] ) / tmpThetaFullRange;

		this.theta = QuadraticEaseInOut( tmpThetaNormalized ) * tmpThetaFullRange + dstRange[ 0 ];

		var targetPosition = this.target.position,
			position = this.object.position;

		targetPosition.x = 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = 100 * Math.cos( this.phi );
		targetPosition.z = 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( this.target.position );

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	// utils

	function normalize_angle_rad( a ) {

		var b = a % PI2;
		return b >= 0 ? b : b + PI2;

	};

	function distance( a, b ) {

		var dx = a[ 0 ] - b[ 0 ],
			dy = a[ 1 ] - b[ 1 ],
			dz = a[ 2 ] - b[ 2 ];

		return Math.sqrt( dx * dx + dy * dy + dz * dz );

	};

	function QuadraticEaseInOut ( k ) {

		if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
		return - 0.5 * ( --k * ( k - 2 ) - 1 );

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	function initAnimationPath( parent, spline, name, duration ) {

		var animationData = {

		   name: name,
		   fps: 0.6,
		   length: duration,

		   hierarchy: []

		};

		var i,
			parentAnimation, childAnimation,
			path = spline.getControlPointsArray(),
			sl = spline.getLength(),
			pl = path.length,
			t = 0,
			first = 0,
			last  = pl - 1;

		parentAnimation = { parent: -1, keys: [] };
		parentAnimation.keys[ first ] = { time: 0,        pos: path[ first ], rot: [ 0, 0, 0, 1 ], scl: [ 1, 1, 1 ] };
		parentAnimation.keys[ last  ] = { time: duration, pos: path[ last ],  rot: [ 0, 0, 0, 1 ], scl: [ 1, 1, 1 ] };

		for ( i = 1; i < pl - 1; i++ ) {

			// real distance (approximation via linear segments)

			t = duration * sl.chunks[ i ] / sl.total;

			// equal distance

			//t = duration * ( i / pl );

			// linear distance

			//t += duration * distance( path[ i ], path[ i - 1 ] ) / sl.total;

			parentAnimation.keys[ i ] = { time: t, pos: path[ i ] };

		}

		animationData.hierarchy[ 0 ] = parentAnimation;

		THREE.AnimationHandler.add( animationData );

		return new THREE.Animation( parent, name, THREE.AnimationHandler.CATMULLROM_FORWARD, false );

	};


	function createSplineGeometry( spline, n_sub ) {

		var i, index, position,
			geometry = new THREE.Geometry();

		for ( i = 0; i < spline.points.length * n_sub; i ++ ) {

			index = i / ( spline.points.length * n_sub );
			position = spline.getPoint( index );

			geometry.vertices[ i ] = new THREE.Vertex( new THREE.Vector3( position.x, position.y, position.z ) );

		}

		return geometry;

	};

	function createPath( parent, spline ) {

		var lineGeo = createSplineGeometry( spline, 10 ),
			particleGeo = createSplineGeometry( spline, 10 ),
			lineMat = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 3 } ),
			lineObj = new THREE.Line( lineGeo, lineMat ),
			particleObj = new THREE.ParticleSystem( particleGeo, new THREE.ParticleBasicMaterial( { color: 0xffaa00, size: 3 } ) );

		lineObj.scale.set( 1, 1, 1 );
		parent.add( lineObj );

		particleObj.scale.set( 1, 1, 1 );
		parent.add( particleObj );

		var waypoint,
			geo = new THREE.SphereGeometry( 1, 16, 8 ),
			mat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

		for ( var i = 0; i < spline.points.length; i ++ ) {

			waypoint = new THREE.Mesh( geo, mat );
			waypoint.position.copy( spline.points[ i ] );
			parent.add( waypoint );

		}

	};

	this.init = function ( ) {

		// constructor

		this.spline = new THREE.Spline();
		this.spline.initFromArray( this.waypoints );

		if ( this.useConstantSpeed ) {

			this.spline.reparametrizeByArcLength( this.resamplingCoef );

		}

		if ( this.createDebugDummy ) {

			var dummyParentMaterial = new THREE.MeshLambertMaterial( { color: 0x0077ff } ),
			dummyChildMaterial  = new THREE.MeshLambertMaterial( { color: 0x00ff00 } ),
			dummyParentGeo = new THREE.CubeGeometry( 10, 10, 20 ),
			dummyChildGeo  = new THREE.CubeGeometry( 2, 2, 10 );

			this.animationParent = new THREE.Mesh( dummyParentGeo, dummyParentMaterial );

			var dummyChild = new THREE.Mesh( dummyChildGeo, dummyChildMaterial );
			dummyChild.position.set( 0, 10, 0 );

			this.animation = initAnimationPath( this.animationParent, this.spline, this.id, this.duration );

			this.animationParent.add( this.object );
			this.animationParent.add( this.target );
			this.animationParent.add( dummyChild );

		} else {

			this.animation = initAnimationPath( this.animationParent, this.spline, this.id, this.duration );
			this.animationParent.add( this.target );
			this.animationParent.add( this.object );

		}

		if ( this.createDebugPath ) {

			createPath( this.debugPath, this.spline );

		}

		this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );

	};

};

THREE.PathControlsIdCounter = 0;
/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.FlyControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );

	// API

	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;

	this.dragToLook = false;
	this.autoForward = false;

	// disable default target object behavior

	this.object.useQuaternion = true;

	// internals

	this.tmpQuaternion = new THREE.Quaternion();

	this.mouseStatus = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.keydown = function( event ) {

		if ( event.altKey ) {

			return;

		}

		switch( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

			case 87: /*W*/ this.moveState.forward = 1; break;
			case 83: /*S*/ this.moveState.back = 1; break;

			case 65: /*A*/ this.moveState.left = 1; break;
			case 68: /*D*/ this.moveState.right = 1; break;

			case 82: /*R*/ this.moveState.up = 1; break;
			case 70: /*F*/ this.moveState.down = 1; break;

			case 38: /*up*/ this.moveState.pitchUp = 1; break;
			case 40: /*down*/ this.moveState.pitchDown = 1; break;

			case 37: /*left*/ this.moveState.yawLeft = 1; break;
			case 39: /*right*/ this.moveState.yawRight = 1; break;

			case 81: /*Q*/ this.moveState.rollLeft = 1; break;
			case 69: /*E*/ this.moveState.rollRight = 1; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	this.keyup = function( event ) {

		switch( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

			case 87: /*W*/ this.moveState.forward = 0; break;
			case 83: /*S*/ this.moveState.back = 0; break;

			case 65: /*A*/ this.moveState.left = 0; break;
			case 68: /*D*/ this.moveState.right = 0; break;

			case 82: /*R*/ this.moveState.up = 0; break;
			case 70: /*F*/ this.moveState.down = 0; break;

			case 38: /*up*/ this.moveState.pitchUp = 0; break;
			case 40: /*down*/ this.moveState.pitchDown = 0; break;

			case 37: /*left*/ this.moveState.yawLeft = 0; break;
			case 39: /*right*/ this.moveState.yawRight = 0; break;

			case 81: /*Q*/ this.moveState.rollLeft = 0; break;
			case 69: /*E*/ this.moveState.rollRight = 0; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	this.mousedown = function( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus ++;

		} else {

			switch ( event.button ) {

				case 0: this.object.moveForward = true; break;
				case 2: this.object.moveBackward = true; break;

			}

		}

	};

	this.mousemove = function( event ) {

		if ( !this.dragToLook || this.mouseStatus > 0 ) {

			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();

		}

	};

	this.mouseup = function( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus --;

			this.moveState.yawLeft = this.moveState.pitchDown = 0;

		} else {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.updateRotationVector();

	};

	this.update = function( delta ) {

		var moveMult = delta * this.movementSpeed;
		var rotMult = delta * this.rollSpeed;

		this.object.translateX( this.moveVector.x * moveMult );
		this.object.translateY( this.moveVector.y * moveMult );
		this.object.translateZ( this.moveVector.z * moveMult );

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.object.quaternion.multiplySelf( this.tmpQuaternion );

		this.object.matrix.setPosition( this.object.position );
		this.object.matrix.setRotationFromQuaternion( this.object.quaternion );
		this.object.matrixWorldNeedsUpdate = true;


	};

	this.updateMovementVector = function() {

		var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

		this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
		this.moveVector.z = ( -forward + this.moveState.back );

		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	};

	this.updateRotationVector = function() {

		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	};

	this.getContainerDimensions = function() {

		if ( this.domElement != document ) {

			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
			};

		} else {

			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ]
			};

		}

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
	this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

	this.domElement.addEventListener( 'keydown', bind( this, this.keydown ), false );
	this.domElement.addEventListener( 'keyup',   bind( this, this.keyup ), false );

	this.updateMovementVector();
	this.updateRotationVector();

};
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RollControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.mouseLook = true;
	this.autoForward = false;

	this.lookSpeed = 1;
	this.movementSpeed = 1;
	this.rollSpeed = 1;

	this.constrainVertical = [ -0.9, 0.9 ];

	// disable default target object behavior

	this.object.matrixAutoUpdate = false;

	// internals

	this.forward = new THREE.Vector3( 0, 0, 1 );
	this.roll = 0;

	var xTemp = new THREE.Vector3();
	var yTemp = new THREE.Vector3();
	var zTemp = new THREE.Vector3();
	var rollMatrix = new THREE.Matrix4();

	var doRoll = false, rollDirection = 1, forwardSpeed = 0, sideSpeed = 0, upSpeed = 0;

	var mouseX = 0, mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	// custom update

	this.update = function ( delta ) {

		if ( this.mouseLook ) {

			var actualLookSpeed = delta * this.lookSpeed;

			this.rotateHorizontally( actualLookSpeed * mouseX );
			this.rotateVertically( actualLookSpeed * mouseY );

		}

		var actualSpeed = delta * this.movementSpeed;
		var forwardOrAuto = ( forwardSpeed > 0 || ( this.autoForward && ! ( forwardSpeed < 0 ) ) ) ? 1 : forwardSpeed;

		this.object.translateZ( -actualSpeed * forwardOrAuto );
		this.object.translateX( actualSpeed * sideSpeed );
		this.object.translateY( actualSpeed * upSpeed );

		if( doRoll ) {

			this.roll += this.rollSpeed * delta * rollDirection;

		}

		// cap forward up / down

		if( this.forward.y > this.constrainVertical[ 1 ] ) {

			this.forward.y = this.constrainVertical[ 1 ];
			this.forward.normalize();

		} else if( this.forward.y < this.constrainVertical[ 0 ] ) {

			this.forward.y = this.constrainVertical[ 0 ];
			this.forward.normalize();

		}


		// construct unrolled camera matrix

		zTemp.copy( this.forward );
		yTemp.set( 0, 1, 0 );

		xTemp.cross( yTemp, zTemp ).normalize();
		yTemp.cross( zTemp, xTemp ).normalize();

		this.object.matrix.n11 = xTemp.x; this.object.matrix.n12 = yTemp.x; this.object.matrix.n13 = zTemp.x;
		this.object.matrix.n21 = xTemp.y; this.object.matrix.n22 = yTemp.y; this.object.matrix.n23 = zTemp.y;
		this.object.matrix.n31 = xTemp.z; this.object.matrix.n32 = yTemp.z; this.object.matrix.n33 = zTemp.z;

		// calculate roll matrix

		rollMatrix.identity();
		rollMatrix.n11 = Math.cos( this.roll ); rollMatrix.n12 = -Math.sin( this.roll );
		rollMatrix.n21 = Math.sin( this.roll ); rollMatrix.n22 =  Math.cos( this.roll );

		// multiply camera with roll

		this.object.matrix.multiplySelf( rollMatrix );
		this.object.matrixWorldNeedsUpdate = true;

		// set position

		this.object.matrix.n14 = this.object.position.x;
		this.object.matrix.n24 = this.object.position.y;
		this.object.matrix.n34 = this.object.position.z;


	};

	this.translateX = function ( distance ) {

		this.object.position.x += this.object.matrix.n11 * distance;
		this.object.position.y += this.object.matrix.n21 * distance;
		this.object.position.z += this.object.matrix.n31 * distance;

	};

	this.translateY = function ( distance ) {

		this.object.position.x += this.object.matrix.n12 * distance;
		this.object.position.y += this.object.matrix.n22 * distance;
		this.object.position.z += this.object.matrix.n32 * distance;

	};

	this.translateZ = function ( distance ) {

		this.object.position.x -= this.object.matrix.n13 * distance;
		this.object.position.y -= this.object.matrix.n23 * distance;
		this.object.position.z -= this.object.matrix.n33 * distance;

	};


	this.rotateHorizontally = function ( amount ) {

		// please note that the amount is NOT degrees, but a scale value

		xTemp.set( this.object.matrix.n11, this.object.matrix.n21, this.object.matrix.n31 );
		xTemp.multiplyScalar( amount );

		this.forward.subSelf( xTemp );
		this.forward.normalize();

	};

	this.rotateVertically = function ( amount ) {

		// please note that the amount is NOT degrees, but a scale value

		yTemp.set( this.object.matrix.n12, this.object.matrix.n22, this.object.matrix.n32 );
		yTemp.multiplyScalar( amount );

		this.forward.addSelf( yTemp );
		this.forward.normalize();

	};

	function onKeyDown( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ forwardSpeed = 1; break;

			case 37: /*left*/
			case 65: /*A*/ sideSpeed = -1; break;

			case 40: /*down*/
			case 83: /*S*/ forwardSpeed = -1; break;

			case 39: /*right*/
			case 68: /*D*/ sideSpeed = 1; break;

			case 81: /*Q*/ doRoll = true; rollDirection = 1; break;
			case 69: /*E*/ doRoll = true; rollDirection = -1; break;

			case 82: /*R*/ upSpeed = 1; break;
			case 70: /*F*/ upSpeed = -1; break;

		}

	};

	function onKeyUp( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ forwardSpeed = 0; break;

			case 37: /*left*/
			case 65: /*A*/ sideSpeed = 0; break;

			case 40: /*down*/
			case 83: /*S*/ forwardSpeed = 0; break;

			case 39: /*right*/
			case 68: /*D*/ sideSpeed = 0; break;

			case 81: /*Q*/ doRoll = false; break;
			case 69: /*E*/ doRoll = false; break;

			case 82: /*R*/ upSpeed = 0; break;
			case 70: /*F*/ upSpeed = 0; break;

		}

	};

	function onMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) / window.innerWidth;
		mouseY = ( event.clientY - windowHalfY ) / window.innerHeight;

	};

	function onMouseDown ( event ) {

		event.preventDefault();
		event.stopPropagation();

		switch ( event.button ) {

			case 0: forwardSpeed = 1; break;
			case 2: forwardSpeed = -1; break;

		}

	};

	function onMouseUp ( event ) {

		event.preventDefault();
		event.stopPropagation();

		switch ( event.button ) {

			case 0: forwardSpeed = 0; break;
			case 2: forwardSpeed = 0; break;

		}

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', onMouseUp, false );
	this.domElement.addEventListener( 'keydown', onKeyDown, false );
	this.domElement.addEventListener( 'keyup', onKeyUp, false );

};
/**
 * @author Eberhard Graether / http://egraether.com/
 */

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this,
	STATE = { NONE : -1, ROTATE : 0, ZOOM : 1, PAN : 2 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
	this.radius = ( this.screen.width + this.screen.height ) / 4;

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3( 0, 0, 0 );

	var _keyPressed = false,
	_state = STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();


	// methods

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.getMouseOnScreen = function( clientX, clientY ) {

		return new THREE.Vector2(
			( clientX - _this.screen.offsetLeft ) / _this.radius * 0.5,
			( clientY - _this.screen.offsetTop ) / _this.radius * 0.5
		);

	};

	this.getMouseProjectionOnBall = function( clientX, clientY ) {

		var mouseOnBall = new THREE.Vector3(
			( clientX - _this.screen.width * 0.5 - _this.screen.offsetLeft ) / _this.radius,
			( _this.screen.height * 0.5 + _this.screen.offsetTop - clientY ) / _this.radius,
			0.0
		);

		var length = mouseOnBall.length();

		if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		_eye.copy( _this.object.position ).subSelf( _this.target );

		var projection = _this.object.up.clone().setLength( mouseOnBall.y );
		projection.addSelf( _this.object.up.clone().crossSelf( _eye ).setLength( mouseOnBall.x ) );
		projection.addSelf( _eye.setLength( mouseOnBall.z ) );

		return projection;

	};

	this.rotateCamera = function() {

		var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

		if ( angle ) {

			var axis = ( new THREE.Vector3() ).cross( _rotateStart, _rotateEnd ).normalize(),
				quaternion = new THREE.Quaternion();

			angle *= _this.rotateSpeed;

			quaternion.setFromAxisAngle( axis, -angle );

			quaternion.multiplyVector3( _eye );
			quaternion.multiplyVector3( _this.object.up );

			quaternion.multiplyVector3( _rotateEnd );

			if ( _this.staticMoving ) {

				_rotateStart = _rotateEnd;

			} else {

				quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
				quaternion.multiplyVector3( _rotateStart );

			}

		}

	};

	this.zoomCamera = function() {

		var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

		if ( factor !== 1.0 && factor > 0.0 ) {

			_eye.multiplyScalar( factor );

			if ( _this.staticMoving ) {

				_zoomStart = _zoomEnd;

			} else {

				_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

			}

		}

	};

	this.panCamera = function() {

		var mouseChange = _panEnd.clone().subSelf( _panStart );

		if ( mouseChange.lengthSq() ) {

			mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

			var pan = _eye.clone().crossSelf( _this.object.up ).setLength( mouseChange.x );
			pan.addSelf( _this.object.up.clone().setLength( mouseChange.y ) );

			_this.object.position.addSelf( pan );
			_this.target.addSelf( pan );

			if ( _this.staticMoving ) {

				_panStart = _panEnd;

			} else {

				_panStart.addSelf( mouseChange.sub( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

			}

		}

	};

	this.checkDistances = function() {

		if ( !_this.noZoom || !_this.noPan ) {

			if ( _this.object.position.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.setLength( _this.maxDistance );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.add( _this.target, _eye.setLength( _this.minDistance ) );

			}

		}

	};

	this.update = function() {

		_eye.copy( _this.object.position ).subSelf( this.target );

		if ( !_this.noRotate ) {

			_this.rotateCamera();

		}
		
		if ( !_this.noZoom ) {

			_this.zoomCamera();

		}

		if ( !_this.noPan ) {

			_this.panCamera();

		}

		_this.object.position.add( _this.target, _eye );

		_this.checkDistances();

		_this.object.lookAt( _this.target );

	};


	// listeners

	function keydown( event ) {

		if ( ! _this.enabled ) return;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && !_this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && !_this.noPan ) {

			_state = STATE.PAN;

		}

		if ( _state !== STATE.NONE ) {

			_keyPressed = true;

		}

	};

	function keyup( event ) {

		if ( ! _this.enabled ) return;

		if ( _state !== STATE.NONE ) {

			_state = STATE.NONE;

		}

	};

	function mousedown( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

			if ( _state === STATE.ROTATE && !_this.noRotate ) {

				_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );

			} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

				_zoomStart = _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			} else if ( !this.noPan ) {

				_panStart = _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			}

		}

	};

	function mousemove( event ) {

		if ( ! _this.enabled ) return;

		if ( _keyPressed ) {

			_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );
			_zoomStart = _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );
			_panStart = _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			_keyPressed = false;

		}

		if ( _state === STATE.NONE ) {

			return;

		} else if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

		}

	};

	function mouseup( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', mousemove, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mouseup', mouseup, false );

	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );

};
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

THREE.CubeGeometry = function ( width, height, depth, segmentsWidth, segmentsHeight, segmentsDepth, materials, sides ) {

	THREE.Geometry.call( this );

	var scope = this,
	width_half = width / 2,
	height_half = height / 2,
	depth_half = depth / 2;

	var mpx, mpy, mpz, mnx, mny, mnz;

	if ( materials !== undefined ) {

		if ( materials instanceof Array ) {

			this.materials = materials;

		} else {

			this.materials = [];

			for ( var i = 0; i < 6; i ++ ) {

				this.materials.push( materials );

			}

		}

		mpx = 0; mnx = 1; mpy = 2; mny = 3; mpz = 4; mnz = 5;

	} else {

		this.materials = [];

	}

	this.sides = { px: true, nx: true, py: true, ny: true, pz: true, nz: true };

	if ( sides != undefined ) {

		for ( var s in sides ) {

			if ( this.sides[ s ] != undefined ) {

				this.sides[ s ] = sides[ s ];

			}

		}

	}

	this.sides.px && buildPlane( 'z', 'y', - 1, - 1, depth, height, width_half, mpx ); // px
	this.sides.nx && buildPlane( 'z', 'y',   1, - 1, depth, height, - width_half, mnx ); // nx
	this.sides.py && buildPlane( 'x', 'z',   1,   1, width, depth, height_half, mpy ); // py
	this.sides.ny && buildPlane( 'x', 'z',   1, - 1, width, depth, - height_half, mny ); // ny
	this.sides.pz && buildPlane( 'x', 'y',   1, - 1, width, height, depth_half, mpz ); // pz
	this.sides.nz && buildPlane( 'x', 'y', - 1, - 1, width, height, - depth_half, mnz ); // nz

	function buildPlane( u, v, udir, vdir, width, height, depth, material ) {

		var w, ix, iy,
		gridX = segmentsWidth || 1,
		gridY = segmentsHeight || 1,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

		if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

			w = 'z';

		} else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

			w = 'y';
			gridY = segmentsDepth || 1;

		} else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

			w = 'x';
			gridX = segmentsDepth || 1;

		}

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		normal = new THREE.Vector3();

		normal[ w ] = depth > 0 ? 1 : - 1;

		for ( iy = 0; iy < gridY1; iy ++ ) {

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( new THREE.Vertex( vector ) );

			}

		}

		for ( iy = 0; iy < gridY; iy++ ) {

			for ( ix = 0; ix < gridX; ix++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				var face = new THREE.Face4( a + offset, b + offset, c + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
				face.materialIndex = material;

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [
							new THREE.UV( ix / gridX, iy / gridY ),
							new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
						] );

			}

		}

	}

	this.computeCentroids();
	this.mergeVertices();

};

THREE.CubeGeometry.prototype = new THREE.Geometry();
THREE.CubeGeometry.prototype.constructor = THREE.CubeGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded ) {

	THREE.Geometry.call( this );

	var radiusTop = radiusTop != null ? radiusTop : 20;
	var radiusBottom = radiusBottom != null ? radiusBottom : 20;
	var height = height || 100;
	var heightHalf = height / 2;
	var segmentsX = segmentsRadius || 8;
	var segmentsY = segmentsHeight || 1;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= segmentsY; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		var v = y / segmentsY;
		var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

		for ( x = 0; x <= segmentsX; x ++ ) {

			var u = x / segmentsX;

			var xpos = radius * Math.sin( u * Math.PI * 2 );
			var ypos = - v * height + heightHalf;
			var zpos = radius * Math.cos( u * Math.PI * 2 );

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( xpos, ypos, zpos ) ) );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.UV( u, v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < segmentsY; y ++ ) {

		for ( x = 0; x < segmentsX; x ++ ) {

			var v1 = vertices[ y ][ x ];
			var v2 = vertices[ y + 1 ][ x ];
			var v3 = vertices[ y + 1 ][ x + 1 ];
			var v4 = vertices[ y ][ x + 1 ];

			// FIXME: These normals aren't right for cones.

			var n1 = this.vertices[ v1 ].position.clone().setY( 0 ).normalize();
			var n2 = this.vertices[ v2 ].position.clone().setY( 0 ).normalize();
			var n3 = this.vertices[ v3 ].position.clone().setY( 0 ).normalize();
			var n4 = this.vertices[ v4 ].position.clone().setY( 0 ).normalize();

			var uv1 = uvs[ y ][ x ].clone();
			var uv2 = uvs[ y + 1 ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
			var uv4 = uvs[ y ][ x + 1 ].clone();

			this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

		}

	}

	// top cap

	if ( !openEnded && radiusTop > 0 ) {

		this.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, heightHalf, 0 ) ) );

		for ( x = 0; x < segmentsX; x ++ ) {

			var v1 = vertices[ 0 ][ x ];
			var v2 = vertices[ 0 ][ x + 1 ];
			var v3 = this.vertices.length - 1;

			var n1 = new THREE.Vector3( 0, 1, 0 );
			var n2 = new THREE.Vector3( 0, 1, 0 );
			var n3 = new THREE.Vector3( 0, 1, 0 );

			var uv1 = uvs[ 0 ][ x ].clone();
			var uv2 = uvs[ 0 ][ x + 1 ].clone();
			var uv3 = new THREE.UV( uv2.u, 0 );

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

		}

	}

	// bottom cap

	if ( !openEnded && radiusBottom > 0 ) {

		this.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, - heightHalf, 0 ) ) );

		for ( x = 0; x < segmentsX; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = this.vertices.length - 1;

			var n1 = new THREE.Vector3( 0, - 1, 0 );
			var n2 = new THREE.Vector3( 0, - 1, 0 );
			var n3 = new THREE.Vector3( 0, - 1, 0 );

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = new THREE.UV( uv2.u, 1 );

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

}
THREE.CylinderGeometry.prototype = new THREE.Geometry();
THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry;
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  size: 			<float>, 	// size of the text
 *  height: 		<float>, 	// thickness to extrude text
 *  curveSegments: 	<int>,		// number of points on the curves
 *  steps: 			<int>,		// number of points for z-side extrusions
 *
 *  font: 			<string>,		// font name
 *  weight: 		<string>,		// font weight (normal, bold)
 *  style: 			<string>,		// font style  (normal, italics)
 *
 *  bevelEnabled:	<bool>,			// turn on bevel
 *  bevelThickness: <float>, 		// how deep into text bevel goes
 *  bevelSize:		<float>, 		// how far from text outline is bevel
 *  bevelSegments:	<int>, 			// number of bevel layers
 *
 *  extrudePath:	<THREE.CurvePath>	// path to extrude shape along
 *  bendPath:		<THREE.CurvePath> 	// path to bend the geometry around
 *
 *  material:		 <THREE.Material>	// material for front and back faces
 *  extrudeMaterial: <THREE.Material>	// material for extrusion and beveled faces
 *
 *  }
  **/

THREE.ExtrudeGeometry = function( shapes, options ) {

	if( typeof( shapes ) === "undefined" ) {

		shapes = [];
		return;

	}

	THREE.Geometry.call( this );

	shapes = shapes instanceof Array ? shapes : [ shapes ];

	var s, sl = shapes.length, shape;

	this.shapebb = shapes[ sl - 1 ].getBoundingBox();

	for ( s = 0; s < sl; s ++ ) {

		shape = shapes[ s ];

		this.addShape( shape, options );

	}


	this.computeCentroids();
	this.computeFaceNormals();

	// can't really use automatic vertex normals
	// as then front and back sides get smoothed too
	// should do separate smoothing just for sides

	//this.computeVertexNormals();

	//console.log( "took", ( Date.now() - startTime ) );

};

THREE.ExtrudeGeometry.prototype = new THREE.Geometry();
THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry;


THREE.ExtrudeGeometry.prototype.addShape = function( shape, options ) {

	var amount = options.amount !== undefined ? options.amount : 100;

	var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6; // 10
	var bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2; // 8
	var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;

	var bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true; // false

	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

	var steps = options.steps !== undefined ? options.steps : 1;

	var bendPath = options.bendPath;

	var extrudePath = options.extrudePath;
	var extrudePts, extrudeByPath = false;

	var useSpacedPoints = options.useSpacedPoints !== undefined ? options.useSpacedPoints : false;

	var material = options.material;
	var extrudeMaterial = options.extrudeMaterial;

	var shapebb = this.shapebb;
	//shapebb = shape.getBoundingBox();


	if ( extrudePath ) {

		extrudePts = extrudePath.getPoints( curveSegments );
		steps = extrudePts.length;
		extrudeByPath = true;
		bevelEnabled = false; // bevels not supported for path extrusion

	}

	// Safeguards if bevels are not enabled

	if ( !bevelEnabled ) {

		bevelSegments = 0;
		bevelThickness = 0;
		bevelSize = 0;

	}


	// TODO, extrude by path's tangents? also via 3d path?

	// Variables initalization

	var ahole, h, hl; // looping of holes
	var scope = this;
	var bevelPoints = [];

	var shapesOffset = this.vertices.length;


	if ( bendPath ) {

		shape.addWrapPath( bendPath );

	}

	var shapePoints;

	if ( !useSpacedPoints ) {

	  	shapePoints = shape.extractAllPoints( curveSegments ); //

	} else {

		// QN - Would it be better to pass useSpacePoints parameter to shape, just like bendpath ?

		shapePoints = shape.extractAllSpacedPoints( curveSegments ) // for points with equal divisions

	}

    var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = !THREE.Shape.Utils.isClockWise( vertices ) ;

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe ...

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];

			if ( THREE.Shape.Utils.isClockWise( ahole ) ) {

				holes[ h ] = ahole.reverse();

			}

		}

		reverse = false; // If vertices are in order now, we shouldn't need to worry about them again (hopefully)!

	}


	var faces = THREE.Shape.Utils.triangulateShape ( vertices, holes );
	//var faces = THREE.Shape.Utils.triangulate2( vertices, holes );

	// Would it be better to move points after triangulation?
	// shapePoints = shape.extractAllPointsWithBend( curveSegments, bendPath );
	// 	vertices = shapePoints.shape;
	// 	holes = shapePoints.holes;

	//console.log(faces);

	////
	///   Handle Vertices
	////

	var contour = vertices; // vertices has all points but contour has only points of circumference

	for ( h = 0, hl = holes.length;  h < hl; h ++ ) {

		ahole = holes[ h ];

		vertices = vertices.concat( ahole );

	}


	var i, il;

	function scalePt2 ( pt, vec, size ) {

		if ( !vec ) console.log( "die" );

		return vec.clone().multiplyScalar( size ).addSelf( pt );

	}

	var b, bs, t, z,
		vert, vlen = vertices.length,
		face, flen = faces.length,
		cont, clen = contour.length;


	//------
	// Find directions for point movement
	//

	var RAD_TO_DEGREES = 180 / Math.PI;


	function getBevelVec( pt_i, pt_j, pt_k ) {

		// Algorithm 2

		return getBevelVec2( pt_i, pt_j, pt_k );

	}

	function getBevelVec1( pt_i, pt_j, pt_k ) {

		var anglea = Math.atan2( pt_j.y - pt_i.y, pt_j.x - pt_i.x );
		var angleb = Math.atan2( pt_k.y - pt_i.y, pt_k.x - pt_i.x );

		if ( anglea > angleb ) {

			angleb += Math.PI * 2;

		}

		var anglec = ( anglea + angleb ) / 2;


		//console.log('angle1', anglea * RAD_TO_DEGREES,'angle2', angleb * RAD_TO_DEGREES, 'anglec', anglec *RAD_TO_DEGREES);

		var x = - Math.cos( anglec );
		var y = - Math.sin( anglec );

		var vec = new THREE.Vector2( x, y ); //.normalize();

		return vec;

	}

	function getBevelVec2( pt_i, pt_j, pt_k ) {

		var a = THREE.ExtrudeGeometry.__v1,
			b = THREE.ExtrudeGeometry.__v2,
			v_hat = THREE.ExtrudeGeometry.__v3,
			w_hat = THREE.ExtrudeGeometry.__v4,
			p = THREE.ExtrudeGeometry.__v5,
			q = THREE.ExtrudeGeometry.__v6,
			v, w,
			v_dot_w_hat, q_sub_p_dot_w_hat,
			s, intersection;

		// good reading for line-line intersection
		// http://sputsoft.com/blog/2010/03/line-line-intersection.html

		// define a as vector j->i
		// define b as vectot k->i

		a.set( pt_i.x - pt_j.x, pt_i.y - pt_j.y );
		b.set( pt_i.x - pt_k.x, pt_i.y - pt_k.y );

		// get unit vectors

		v = a.normalize();
		w = b.normalize();

		// normals from pt i

		v_hat.set( -v.y, v.x );
		w_hat.set( w.y, -w.x );

		// pts from i

		p.copy( pt_i ).addSelf( v_hat );
		q.copy( pt_i ).addSelf( w_hat );

		if ( p.equals( q ) ) {

			//console.log("Warning: lines are straight");
			return w_hat.clone();

		}

		// Points from j, k. helps prevents points cross overover most of the time

		p.copy( pt_j ).addSelf( v_hat );
		q.copy( pt_k ).addSelf( w_hat );

		v_dot_w_hat = v.dot( w_hat );
		q_sub_p_dot_w_hat = q.subSelf( p ).dot( w_hat );

		// We should not reach these conditions

		if ( v_dot_w_hat === 0 ) {

			console.log( "Either infinite or no solutions!" );

			if ( q_sub_p_dot_w_hat === 0 ) {

				console.log( "Its finite solutions." );

			} else {

				console.log( "Too bad, no solutions." );

			}

		}

		s = q_sub_p_dot_w_hat / v_dot_w_hat;

		if ( s < 0 ) {

			// in case of emergecy, revert to algorithm 1.

			return getBevelVec1( pt_i, pt_j, pt_k );

		}

		intersection = v.multiplyScalar( s ).addSelf( p );

		return intersection.subSelf( pt_i ).clone(); // Don't normalize!, otherwise sharp corners become ugly

	}

	var contourMovements = [];

	for ( i = 0, il = contour.length, j = il-1, k = i + 1; i < il; i++, j++, k++ ) {

		if ( j === il ) j = 0;
		if ( k === il ) k = 0;

		//  (j)---(i)---(k)
		// console.log('i,j,k', i, j , k)

		var pt_i = contour[ i ];
		var pt_j = contour[ j ];
		var pt_k = contour[ k ];

		contourMovements[ i ]= getBevelVec( contour[ i ], contour[ j ], contour[ k ] );

	}

	var holesMovements = [], oneHoleMovements, verticesMovements = contourMovements.concat();

	for ( h = 0, hl = holes.length; h < hl; h++ ) {

		ahole = holes[ h ];

		oneHoleMovements = [];

		for ( i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i++, j++, k++ ) {

			if ( j === il ) j = 0;
			if ( k === il ) k = 0;

			//  (j)---(i)---(k)
			oneHoleMovements[ i ]= getBevelVec( ahole[ i ], ahole[ j ], ahole[ k ] );

		}

		holesMovements.push( oneHoleMovements );
		verticesMovements = verticesMovements.concat( oneHoleMovements );

	}


	// Loop bevelSegments, 1 for the front, 1 for the back

	for ( b = 0; b < bevelSegments; b ++ ) {
	//for ( b = bevelSegments; b > 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );

		//z = bevelThickness * t;
		bs = bevelSize * ( Math.sin ( t * Math.PI/2 ) ) ; // curved
		//bs = bevelSize * t ; // linear

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
			//vert = scalePt( contour[ i ], contourCentroid, bs, false );
			v( vert.x, vert.y,  - z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );
				//vert = scalePt( ahole[ i ], holesCentroids[ h ], bs, true );

				v( vert.x, vert.y,  -z );

			}

		}

	}

	bs = bevelSize;

	// Back facing vertices

	for ( i = 0; i < vlen; i ++ ) {

		vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

		if ( !extrudeByPath ) {

			v( vert.x, vert.y, 0 );

		} else {

			v( vert.x, vert.y + extrudePts[ 0 ].y, extrudePts[ 0 ].x );

		}

	}

	// Add stepped vertices...
	// Including front facing vertices

	var s;

	for ( s = 1; s <= steps; s ++ ) {

		for ( i = 0; i < vlen; i ++ ) {

			vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

			if ( !extrudeByPath ) {

				v( vert.x, vert.y, amount / steps * s );

			} else {

				v( vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x );

			}

		}

	}


	// Add bevel segments planes

	//for ( b = 1; b <= bevelSegments; b ++ ) {
	for ( b = bevelSegments - 1; b >= 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );
		//bs = bevelSize * ( 1-Math.sin ( ( 1 - t ) * Math.PI/2 ) );
		bs = bevelSize * Math.sin ( t * Math.PI/2 ) ;

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
			v( vert.x, vert.y,  amount + z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				if ( !extrudeByPath ) {

					v( vert.x, vert.y,  amount + z );

				} else {

					v( vert.x, vert.y + extrudePts[ steps - 1 ].y, extrudePts[ steps - 1 ].x + z );

				}

			}

		}

	}


	////
	///   Handle Faces
	////

	// Bottom faces

	if ( bevelEnabled ) {

		var layer = 0 ; // steps + 1
		var offset = vlen * layer;

		for ( i = 0; i < flen; i ++ ) {

			face = faces[ i ];
			f3( face[ 2 ]+ offset, face[ 1 ]+ offset, face[ 0 ] + offset );

		}

		layer = steps + bevelSegments * 2;
		offset = vlen * layer;

		// Top faces

		for ( i = 0; i < flen; i ++ ) {

			face = faces[ i ];
			f3( face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset );

		}

	} else {

		for ( i = 0; i < flen; i++ ) {

			face = faces[ i ];
			f3( face[ 2 ], face[ 1 ], face[ 0 ] );

		}

		// Top faces

		for ( i = 0; i < flen; i ++ ) {

			face = faces[ i ];
			f3( face[ 0 ] + vlen * steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps );

		}

	}

	var tmpPt;
	var j, k, l, m;

	var layeroffset = 0;

	// Sides faces

	sidewalls( contour );
	layeroffset += contour.length;

	for ( h = 0, hl = holes.length;  h < hl; h ++ ) {

		ahole = holes[ h ];
		sidewalls( ahole );

		//, true
		layeroffset += ahole.length;

	}

	// Create faces for the z-sides of the shape

	function sidewalls( contour ) {

		i = contour.length;

		while ( --i >= 0 ) {

			tmpPt = contour[ i ];

			j = i;
			k = i - 1;

			if ( k < 0 ) k = contour.length - 1;

			//console.log('b', i,j, i-1, k,vertices.length);

			var s = 0, sl = steps  + bevelSegments * 2;

			for ( s = 0; s < sl; s ++ ) {

				var slen1 = vlen * s;
				var slen2 = vlen * ( s + 1 );
				var a = layeroffset + j + slen1,
					b = layeroffset + k + slen1,
					c = layeroffset + k + slen2,
					d = layeroffset + j + slen2;

				f4( a, b, c, d );

				if ( extrudeMaterial ) {

					var v1 = s / sl;
					var v2 = ( s + 1 ) / sl;

					var ztol = ( amount + bevelThickness * 2 );

					var u1 = ( scope.vertices[ a ].position.z + bevelThickness ) / ztol;
					var u2 = ( scope.vertices[ d ].position.z + bevelThickness ) / ztol;

					//console.log(vy1, vy2);

					scope.faceVertexUvs[ 0 ].push( [
						new THREE.UV( u1, v1 ),
						new THREE.UV( u2, v1 ),
						new THREE.UV( u2, v2 ),
						new THREE.UV( u1, v2 )
					] );
				}


			}

		}

	}


	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	}

	function f3( a, b, c ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;

		scope.faces.push( new THREE.Face3( a, b, c, null, null, material ) );
		//normal, color, materials

		if ( material ) {

			var mx = shapebb.minX, my = shapebb.minY;

			var uy = shapebb.maxY; // - shapebb.minY;
			var ux = shapebb.maxX; // - shapebb.minX;

			var ax = scope.vertices[ a ].position.x,
				ay = scope.vertices[ a ].position.y,

				bx = scope.vertices[ b ].position.x,
				by = scope.vertices[ b ].position.y,

				cx = scope.vertices[ c ].position.x,
				cy = scope.vertices[ c ].position.y;

			scope.faceVertexUvs[ 0 ].push( [

				new THREE.UV( ax / ux, ay / uy ),
				new THREE.UV( bx / ux, by / uy ),
				new THREE.UV( cx / ux, cy / uy )

			] );
		}

	}

	function f4( a, b, c, d ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;
		d += shapesOffset;

 		scope.faces.push( new THREE.Face4( a, b, c, d, null, null, extrudeMaterial ) );

	}

};


THREE.ExtrudeGeometry.__v1 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v2 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v3 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v4 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v5 = new THREE.Vector2();
THREE.ExtrudeGeometry.__v6 = new THREE.Vector2();
/**
 * @author oosmoxiecode

 * uvs are messed up in this one, and commented away for now. There is an ugly "seam" by the shared vertices
 * when it "wraps" around, that needs to be fixed. It�s because they share the first and the last vertices
 * so it draws the entire texture on the seam-faces, I think...
 */

THREE.IcosahedronGeometry = function ( subdivisions ) {

	var scope = this;
	var tempScope = new THREE.Geometry();
	var tempFaces;
	this.subdivisions = subdivisions || 0;

	//var temp_uv = [];

	THREE.Geometry.call(this);

	// create 12 vertices of a Icosahedron
	var t = (1 + Math.sqrt(5)) / 2;

	v(-1,  t,  0);
	v( 1,  t,  0);
	v(-1, -t,  0);
	v( 1, -t,  0);

	v( 0, -1,  t);
	v( 0,  1,  t);
	v( 0, -1, -t);
	v( 0,  1, -t);

	v( t,  0, -1);
	v( t,  0,  1);
	v(-t,  0, -1);
	v(-t,  0,  1);

	// 5 faces around point 0
	f3(0, 11, 5, tempScope);
	f3(0, 5, 1, tempScope);
	f3(0, 1, 7, tempScope);
	f3(0, 7, 10, tempScope);
	f3(0, 10, 11, tempScope);

	// 5 adjacent faces
	f3(1, 5, 9, tempScope);
	f3(5, 11, 4, tempScope);
	f3(11, 10, 2, tempScope);
	f3(10, 7, 6, tempScope);
	f3(7, 1, 8, tempScope);

	// 5 faces around point 3
	f3(3, 9, 4, tempScope);
	f3(3, 4, 2, tempScope);
	f3(3, 2, 6, tempScope);
	f3(3, 6, 8, tempScope);
	f3(3, 8, 9, tempScope);

	// 5 adjacent faces
	f3(4, 9, 5, tempScope);
	f3(2, 4, 11, tempScope);
	f3(6, 2, 10, tempScope);
	f3(8, 6, 7, tempScope);
	f3(9, 8, 1, tempScope);

	// subdivide faces to refine the triangles
	for (var i=0; i < this.subdivisions; i++) {
		tempFaces = new THREE.Geometry();
		for (var tri in tempScope.faces) {
			// replace each triangle by 4 triangles
			var a = getMiddlePoint(tempScope.faces[tri].a, tempScope.faces[tri].b);
			var b = getMiddlePoint(tempScope.faces[tri].b, tempScope.faces[tri].c);
			var c = getMiddlePoint(tempScope.faces[tri].c, tempScope.faces[tri].a);

			f3(tempScope.faces[tri].a, a, c, tempFaces);
			f3(tempScope.faces[tri].b, b, a, tempFaces);
			f3(tempScope.faces[tri].c, c, b, tempFaces);
			f3(a, b, c, tempFaces);
		}
		tempScope.faces = tempFaces.faces;
		tempScope.faceVertexUvs[ 0 ] = tempFaces.faceVertexUvs[ 0 ];
	}

	scope.faces = tempScope.faces;
	scope.faceVertexUvs[ 0 ] = tempScope.faceVertexUvs[ 0 ];

	this.computeCentroids();
	this.computeFaceNormals( true );

	function v( x, y, z ) {

		var length = Math.sqrt(x * x + y * y + z * z);
		var i = scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x/length, y/length, z/length ) ) );

		return i-1;
	}

	function f3( a, b, c, inscope ) {

		var v1 = scope.vertices[ a ].position;
		var v2 = scope.vertices[ b ].position;
		var v3 = scope.vertices[ c ].position;

		var face = new THREE.Face3( a, b, c );
		face.vertexNormals.push( v1.clone().normalize(), v2.clone().normalize(), v3.clone().normalize() );

		inscope.faces.push( face );

		inscope.faceVertexUvs[ 0 ].push( [
			new THREE.UV( 1 - ( ( ( Math.atan2( v1.z, v1.x ) + Math.PI ) % Math.PI ) / Math.PI * 0.5 ), 0.5 - v1.y / 2 ),
			new THREE.UV( 1 - ( ( ( Math.atan2( v2.z, v2.x ) + Math.PI ) % Math.PI ) / Math.PI * 0.5 ), 0.5 - v2.y / 2 ),
			new THREE.UV( 1 - ( ( ( Math.atan2( v3.z, v3.x ) + Math.PI ) % Math.PI ) / Math.PI * 0.5 ), 0.5 - v3.y / 2 )
		] );

	}

	function getMiddlePoint(p1,p2) {
		var pos1 = scope.vertices[p1].position;
		var pos2 = scope.vertices[p2].position;

		var x = (pos1.x + pos2.x) / 2;
		var y = (pos1.y + pos2.y) / 2;
		var z = (pos1.z + pos2.z) / 2;

		var i = v(x, y, z);
		return i;
	}

}

THREE.IcosahedronGeometry.prototype = new THREE.Geometry();
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;
/**
 * @author astrodud / http://astrodud.isgreat.org/
 */

THREE.LatheGeometry = function ( points, steps, angle ) {

	THREE.Geometry.call( this );

	this.steps = steps || 12;
	this.angle = angle || 2 * Math.PI;

	var stepSize = this.angle / this.steps,
	newV = [], oldInds = [], newInds = [], startInds = [],
	matrix = new THREE.Matrix4().setRotationZ( stepSize );

	for ( var j = 0; j < points.length; j ++ ) {

		this.vertices.push( new THREE.Vertex( points[ j ] ) );

		newV[ j ] = points[ j ].clone();
		oldInds[ j ] = this.vertices.length - 1;

	}

	for ( var r = 0; r <= this.angle + 0.001; r += stepSize ) { // need the +0.001 for it go up to angle

		for ( var j = 0; j < newV.length; j ++ ) {

			if ( r < this.angle ) {

				newV[ j ] = matrix.multiplyVector3( newV[ j ].clone() );
				this.vertices.push( new THREE.Vertex( newV[ j ] ) );
				newInds[ j ] = this.vertices.length - 1;

			} else {

				newInds = startInds; // wrap it up!

			}

		}

		if ( r == 0 ) startInds = oldInds;

		for ( var j = 0; j < oldInds.length - 1; j ++ ) {

			this.faces.push( new THREE.Face4( newInds[ j ], newInds[ j + 1 ], oldInds[ j + 1 ], oldInds[ j ] ) );
			this.faceVertexUvs[ 0 ].push( [

				new THREE.UV( 1 - r / this.angle, j / points.length ),
				new THREE.UV( 1 - r / this.angle, ( j + 1 ) / points.length ),
				new THREE.UV( 1 - ( r - stepSize ) / this.angle, ( j + 1 ) / points.length ),
				new THREE.UV( 1 - ( r - stepSize ) / this.angle, j / points.length )

			] );

		}

		oldInds = newInds;
		newInds = [];

	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.LatheGeometry.prototype = new THREE.Geometry();
THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry;
/**
 * Octahedrons have 8 sides. This octahedron supports subdivision.
 * 
 * Vertices have 'smooth' normals, 
 * to make a sharp edge choose a material that uses face normals instead.
 *
 * @author daniel.deady@knectar.com
 * @param radius
 * @param detail Final number of triangles = 4^detail * 8
 */

THREE.OctahedronGeometry = function ( radius, detail ) {

	THREE.Geometry.call( this );

	detail = detail || 0;

	var that = this; // ugly scope hack

	prepare( new THREE.Vector3( +1, 0, 0 ) ); // right
	prepare( new THREE.Vector3( -1, 0, 0 ) ); // left
	prepare( new THREE.Vector3( 0, +1, 0 ) ); // up
	prepare( new THREE.Vector3( 0, -1, 0 ) ); // down
	prepare( new THREE.Vector3( 0, 0, +1 ) ); // front
	prepare( new THREE.Vector3( 0, 0, -1 ) ); // back
	var midpoints = [], p = this.vertices;

	// careful to output faces counter-clockwise, that is required for meshes
	make( p[0], p[2], p[4], detail );
	make( p[0], p[4], p[3], detail );
	make( p[0], p[3], p[5], detail );
	make( p[0], p[5], p[2], detail );
	make( p[1], p[2], p[5], detail );
	make( p[1], p[5], p[3], detail );
	make( p[1], p[3], p[4], detail );
	make( p[1], p[4], p[2], detail );

	/**
	 * Project vector onto sphere's surface
	 */
	function prepare( vector ) {

		var normal = vector.clone().normalize();
		var vertex = new THREE.Vertex( normal.clone().multiplyScalar( radius ) );
		vertex.index = that.vertices.push( vertex ) - 1;

		// Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.
		var u = azimuth( vector ) / 2 / Math.PI + 0.5;
		var v = inclination( vector ) / Math.PI + 0.5;
		vertex.uv = new THREE.UV( u, v );

		return vertex;

	}

	/**
	 * Approximate a curved face with recursively sub-divided triangles.
	 */
	function make( v1, v2, v3, detail ) {

		if ( detail < 1 ) {

			var face = new THREE.Face3( v1.index, v2.index, v3.index, [ v1.position, v2.position, v3.position ] );
			face.centroid.addSelf( v1.position ).addSelf( v2.position ).addSelf( v3.position ).divideScalar( 3 );
			face.normal = face.centroid.clone().normalize();
			that.faces.push( face );

			var azi = azimuth( face.centroid );
			that.faceVertexUvs[ 0 ].push( [ 
				correctUV( v1.uv, v1.position, azi ),
				correctUV( v2.uv, v2.position, azi ),
				correctUV( v3.uv, v3.position, azi )
			] );

		}
		else {

			detail -= 1;
			// split triangle into 4 smaller triangles
			make( v1, midpoint( v1, v2 ), midpoint( v1, v3 ), detail ); // top quadrant
			make( midpoint( v1, v2 ), v2, midpoint( v2, v3 ), detail ); // left quadrant
			make( midpoint( v1, v3 ), midpoint( v2, v3 ), v3, detail ); // right quadrant
			make( midpoint( v1, v2 ), midpoint( v2, v3 ), midpoint( v1, v3 ), detail ); // center quadrant

		}

	}

	function midpoint( v1, v2 ) {

		if ( !midpoints[ v1.index ] ) midpoints[ v1.index ] = [];
		if ( !midpoints[ v2.index ] ) midpoints[ v2.index ] = [];
		var mid = midpoints[ v1.index ][ v2.index ];
		if ( mid === undefined ) {
			// generate mean point and project to surface with prepare()
			midpoints[ v1.index ][ v2.index ] = midpoints[ v2.index ][ v1.index ] = mid = prepare( 
				new THREE.Vector3().add( v1.position, v2.position ).divideScalar( 2 ) 
			);
		}
		return mid;

	}

	/**
	 * Angle around the Y axis, counter-clockwise when looking from above.
	 */
	function azimuth( vector ) {

		return Math.atan2( vector.z, -vector.x );

	}

	/**
	 * Angle above the XZ plane.
	 */
	function inclination( vector ) {

		return Math.atan2( -vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

	}

	/**
	 * Texture fixing helper. Spheres have some odd behaviours.
	 */
	function correctUV( uv, vector, azimuth ) {

		if ( (azimuth < 0) && (uv.u === 1) ) uv = new THREE.UV( uv.u - 1, uv.v );
		if ( (vector.x === 0) && (vector.z === 0) ) uv = new THREE.UV( azimuth / 2 / Math.PI + 0.5, uv.v );
		return uv;

	}

	this.boundingSphere = { radius: radius };

};

THREE.OctahedronGeometry.prototype = new THREE.Geometry();
THREE.OctahedronGeometry.prototype.constructor = THREE.OctahedronGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

THREE.PlaneGeometry = function ( width, height, segmentsWidth, segmentsHeight ) {

	THREE.Geometry.call( this );

	var ix, iy,
	width_half = width / 2,
	height_half = height / 2,
	gridX = segmentsWidth || 1,
	gridY = segmentsHeight || 1,
	gridX1 = gridX + 1,
	gridY1 = gridY + 1,
	segment_width = width / gridX,
	segment_height = height / gridY,
	normal = new THREE.Vector3( 0, 0, 1 );

	for ( iy = 0; iy < gridY1; iy++ ) {

		for ( ix = 0; ix < gridX1; ix++ ) {

			var x = ix * segment_width - width_half;
			var y = iy * segment_height - height_half;

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, - y, 0 ) ) );

		}

	}

	for ( iy = 0; iy < gridY; iy++ ) {

		for ( ix = 0; ix < gridX; ix++ ) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * ( iy + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
			var d = ( ix + 1 ) + gridX1 * iy;

			var face = new THREE.Face4( a, b, c, d );
			face.normal.copy( normal );
			face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );

			this.faces.push( face );
			this.faceVertexUvs[ 0 ].push( [
						new THREE.UV( ix / gridX, iy / gridY ),
						new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
					] );

		}

	}

	this.computeCentroids();

};

THREE.PlaneGeometry.prototype = new THREE.Geometry();
THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	var radius = radius || 50;
	var segmentsX = Math.max( 3, Math.floor( segmentsWidth ) || 8 );
	var segmentsY = Math.max( 2, Math.floor( segmentsHeight ) || 6 );

	var phiStart = phiStart != undefined ? phiStart : 0;
	var phiLength = phiLength != undefined ? phiLength : Math.PI * 2;

	var thetaStart = thetaStart != undefined ? thetaStart : 0;
	var thetaLength = thetaLength != undefined ? thetaLength : Math.PI;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= segmentsY; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= segmentsX; x ++ ) {

			var u = x / segmentsX;
			var v = y / segmentsY;

			var xpos = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			var ypos = radius * Math.cos( thetaStart + v * thetaLength );
			var zpos = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( xpos, ypos, zpos ) ) );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.UV( u, v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < segmentsY; y ++ ) {

		for ( x = 0; x < segmentsX; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].position.clone().normalize();
			var n2 = this.vertices[ v2 ].position.clone().normalize();
			var n3 = this.vertices[ v3 ].position.clone().normalize();
			var n4 = this.vertices[ v4 ].position.clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

			if ( Math.abs( this.vertices[ v1 ].position.y ) == radius ) {

				this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

			} else if ( Math.abs( this.vertices[ v3 ].position.y ) ==  radius ) {

				this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

			} else {

				this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

			}

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

	this.boundingSphere = { radius: radius };

};

THREE.SphereGeometry.prototype = new THREE.Geometry();
THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry;
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * For creating 3D text geometry in three.js
 *
 * Text = 3D Text
 *
 * parameters = {
 *  size: 			<float>, 	// size of the text
 *  height: 		<float>, 	// thickness to extrude text
 *  curveSegments: 	<int>,		// number of points on the curves
 *
 *  font: 			<string>,		// font name
 *  weight: 		<string>,		// font weight (normal, bold)
 *  style: 			<string>,		// font style  (normal, italics)
 *
 *  bevelEnabled:	<bool>,			// turn on bevel
 *  bevelThickness: <float>, 		// how deep into text bevel goes
 *  bevelSize:		<float>, 		// how far from text outline is bevel
 *
 *  bend:			<bool>			// bend according to hardcoded curve (generates bendPath)
 *  bendPath:       <curve>         // wraps text according to bend Path
 *  }
 *
 * It uses techniques used in:
 *
 * 	typeface.js and canvastext
 * 		For converting fonts and rendering with javascript
 *		http://typeface.neocracy.org
 *
 *	Triangulation ported from AS3
 *		Simple Polygon Triangulation
 *		http://actionsnippet.com/?p=1462
 *
 * 	A Method to triangulate shapes with holes
 *		http://www.sakri.net/blog/2009/06/12/an-approach-to-triangulating-polygons-with-holes/
 *
 */
/*	Usage Examples
	
	// TextGeometry wrapper

	var text3d = new TextGeometry( text, options );

	// Complete manner

	var textPath = new THREE.TextPath( text, options );
	var textShapes = textPath.toShapes();
	var text3d = new ExtrudeGeometry( textShapes, options );
	
*/


THREE.TextGeometry = function ( text, parameters ) {

	var textPath = new THREE.TextPath( text, parameters );
	var textShapes = textPath.toShapes();

	// translate parameters to ExtrudeGeometry API

	parameters.amount = parameters.height !== undefined ? parameters.height : 50;

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;

	if ( parameters.bend ) {

		var b = textShapes[ textShapes.length - 1 ].getBoundingBox();
		var max = b.maxX;

		parameters.bendPath = new THREE.QuadraticBezierCurve( new THREE.Vector2( 0, 0 ),
															  new THREE.Vector2( max / 2, 120 ),
															  new THREE.Vector2( max, 0 ) );

	}

	THREE.ExtrudeGeometry.call( this, textShapes, parameters );

};

THREE.TextGeometry.prototype = new THREE.ExtrudeGeometry();
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;


THREE.FontUtils = {

	faces : {},

	// Just for now. face[weight][style]

	face : "helvetiker",
	weight: "normal",
	style : "normal",
	size : 150,
	divisions : 10,

	getFace : function() {

		return this.faces[ this.face ][ this.weight ][ this.style ];

	},

	loadFace : function( data ) {

		var family = data.familyName.toLowerCase();

		var ThreeFont = this;

		ThreeFont.faces[ family ] = ThreeFont.faces[ family ] || {};

		ThreeFont.faces[ family ][ data.cssFontWeight ] = ThreeFont.faces[ family ][ data.cssFontWeight ] || {};
		ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		var face = ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		return data;

	},

	drawText : function( text ) {

		var characterPts = [], allPts = [];

		// RenderText

		var i, p,
			face = this.getFace(),
			scale = this.size / face.resolution,
			offset = 0,
			chars = String( text ).split( '' ),
			length = chars.length;

		var fontPaths = [];

		for ( i = 0; i < length; i ++ ) {

			var path = new THREE.Path();

			var ret = this.extractGlyphPoints( chars[ i ], face, scale, offset, path );
			offset += ret.offset;
			//characterPts.push( ret.points );
			//allPts = allPts.concat( ret.points );
			fontPaths.push( ret.path );

		}

		// get the width

		var width = offset / 2;
		//
		// for ( p = 0; p < allPts.length; p++ ) {
		//
		// 	allPts[ p ].x -= width;
		//
		// }

		//var extract = this.extractPoints( allPts, characterPts );
		//extract.contour = allPts;

		//extract.paths = fontPaths;
		//extract.offset = width;

		return { paths : fontPaths, offset : width };

	},




	extractGlyphPoints : function( c, face, scale, offset, path ) {

		var pts = [];

		var i, i2, divisions,
			outline, action, length,
			scaleX, scaleY,
			x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2,
			laste,
			glyph = face.glyphs[ c ] || face.glyphs[ '?' ];

		if ( !glyph ) return;

		if ( glyph.o ) {

			outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );
			length = outline.length;

			scaleX = scale;
			scaleY = scale;

			for ( i = 0; i < length; ) {

				action = outline[ i ++ ];

				//console.log( action );

				switch( action ) {

				case 'm':

					// Move To

					x = outline[ i++ ] * scaleX + offset;
					y = outline[ i++ ] * scaleY;

					pts.push( new THREE.Vector2( x, y ) );

					path.moveTo( x, y );
					break;

				case 'l':

					// Line To

					x = outline[ i++ ] * scaleX + offset;
					y = outline[ i++ ] * scaleY;
					pts.push( new THREE.Vector2( x, y ) );
					path.lineTo(x,y);
					break;

				case 'q':

					// QuadraticCurveTo

					cpx  = outline[ i++ ] * scaleX + offset;
					cpy  = outline[ i++ ] * scaleY;
					cpx1 = outline[ i++ ] * scaleX + offset;
					cpy1 = outline[ i++ ] * scaleY;

					path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2 ++ ) {

							var t = i2 / divisions;
							var tx = THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
							var ty = THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );
							pts.push( new THREE.Vector2( tx, ty ) );

					  }

				  }

				  break;

				case 'b':

					// Cubic Bezier Curve

					cpx  = outline[ i++ ] *  scaleX + offset;
					cpy  = outline[ i++ ] *  scaleY;
					cpx1 = outline[ i++ ] *  scaleX + offset;
					cpy1 = outline[ i++ ] * -scaleY;
					cpx2 = outline[ i++ ] *  scaleX + offset;
					cpy2 = outline[ i++ ] * -scaleY;

					path.bezierCurveTo( cpx, cpy, cpx1, cpy1, cpx2, cpy2 );

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2 ++ ) {

							var t = i2 / divisions;
							var tx = THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
							var ty = THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );
							pts.push( new THREE.Vector2( tx, ty ) );

						}

					}

					break;

				}

			}
		}



		return { offset: glyph.ha*scale, points:pts, path:path};
	}

};



/**
 * This code is a quick port of code written in C++ which was submitted to
 * flipcode.com by John W. Ratcliff  // July 22, 2000
 * See original code and more information here:
 * http://www.flipcode.com/archives/Efficient_Polygon_Triangulation.shtml
 *
 * ported to actionscript by Zevan Rosser
 * www.actionsnippet.com
 *
 * ported to javascript by Joshua Koo
 * http://www.lab4games.net/zz85/blog
 *
 */


( function( namespace ) {

	var EPSILON = 0.0000000001;

	// takes in an contour array and returns

	var process = function( contour, indices ) {

		var n = contour.length;

		if ( n < 3 ) return null;

		var result = [],
			verts = [],
			vertIndices = [];

		/* we want a counter-clockwise polygon in verts */

		var u, v, w;

		if ( area( contour ) > 0.0 ) {

			for ( v = 0; v < n; v++ ) verts[ v ] = v;

		} else {

			for ( v = 0; v < n; v++ ) verts[ v ] = ( n - 1 ) - v;

		}

		var nv = n;

		/*  remove nv - 2 vertices, creating 1 triangle every time */

		var count = 2 * nv;   /* error detection */

		for( v = nv - 1; nv > 2; ) {

			/* if we loop, it is probably a non-simple polygon */

			if ( ( count-- ) <= 0 ) {

				//** Triangulate: ERROR - probable bad polygon!

				//throw ( "Warning, unable to triangulate polygon!" );
				//return null;
				// Sometimes warning is fine, especially polygons are triangulated in reverse.
				console.log( "Warning, unable to triangulate polygon!" );

				if ( indices ) return vertIndices;
				return result;

			}

			/* three consecutive vertices in current polygon, <u,v,w> */

			u = v; 	 	if ( nv <= u ) u = 0;     /* previous */
			v = u + 1;  if ( nv <= v ) v = 0;     /* new v    */
			w = v + 1;  if ( nv <= w ) w = 0;     /* next     */

			if ( snip( contour, u, v, w, nv, verts ) ) {

				var a, b, c, s, t;

				/* true names of the vertices */

				a = verts[ u ];
				b = verts[ v ];
				c = verts[ w ];

				/* output Triangle */

				/*
				result.push( contour[ a ] );
				result.push( contour[ b ] );
				result.push( contour[ c ] );
				*/
				result.push( [ contour[ a ],
					contour[ b ],
					contour[ c ] ] );


				vertIndices.push( [ verts[ u ], verts[ v ], verts[ w ] ] );

				/* remove v from the remaining polygon */

				for( s = v, t = v + 1; t < nv; s++, t++ ) {

					verts[ s ] = verts[ t ];

				}

				nv--;

				/* reset error detection counter */

				count = 2 * nv;

			}

		}

		if ( indices ) return vertIndices;
		return result;

	};

	// calculate area of the contour polygon

	var area = function ( contour ) {

		var n = contour.length;
		var a = 0.0;

		for( var p = n - 1, q = 0; q < n; p = q++ ) {

			a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

		}

		return a * 0.5;

	};

	// see if p is inside triangle abc

	var insideTriangle = function( ax, ay,
								   bx, by,
								   cx, cy,
								   px, py ) {

		  var aX, aY, bX, bY;
		  var cX, cY, apx, apy;
		  var bpx, bpy, cpx, cpy;
		  var cCROSSap, bCROSScp, aCROSSbp;

		  aX = cx - bx;  aY = cy - by;
		  bX = ax - cx;  bY = ay - cy;
		  cX = bx - ax;  cY = by - ay;
		  apx= px  -ax;  apy= py - ay;
		  bpx= px - bx;  bpy= py - by;
		  cpx= px - cx;  cpy= py - cy;

		  aCROSSbp = aX*bpy - aY*bpx;
		  cCROSSap = cX*apy - cY*apx;
		  bCROSScp = bX*cpy - bY*cpx;

		  return ( (aCROSSbp >= 0.0) && (bCROSScp >= 0.0) && (cCROSSap >= 0.0) );

	};


	var snip = function ( contour, u, v, w, n, verts ) {

		var p;
		var ax, ay, bx, by;
		var cx, cy, px, py;

		ax = contour[ verts[ u ] ].x;
		ay = contour[ verts[ u ] ].y;

		bx = contour[ verts[ v ] ].x;
		by = contour[ verts[ v ] ].y;

		cx = contour[ verts[ w ] ].x;
		cy = contour[ verts[ w ] ].y;

		if ( EPSILON > (((bx-ax)*(cy-ay)) - ((by-ay)*(cx-ax))) ) return false;

			for ( p = 0; p < n; p++ ) {

				if( (p == u) || (p == v) || (p == w) ) continue;

				px = contour[ verts[ p ] ].x
				py = contour[ verts[ p ] ].y

				if ( insideTriangle( ax, ay, bx, by, cx, cy, px, py ) ) return false;

		  }

		  return true;

	};


	namespace.Triangulate = process;
	namespace.Triangulate.area = area;

	return namespace;

})(THREE.FontUtils);

// To use the typeface.js face files, hook up the API
self._typeface_js = { faces: THREE.FontUtils.faces, loadFace: THREE.FontUtils.loadFace };
/**
 * @author oosmoxiecode
 * @author mr.doob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */

THREE.TorusGeometry = function ( radius, tube, segmentsR, segmentsT, arc ) {

	THREE.Geometry.call( this );

	var scope = this;

	this.radius = radius || 100;
	this.tube = tube || 40;
	this.segmentsR = segmentsR || 8;
	this.segmentsT = segmentsT || 6;
	this.arc = arc || Math.PI * 2;

	var center = new THREE.Vector3(), uvs = [], normals = [];

	for ( var j = 0; j <= this.segmentsR; j ++ ) {

		for ( var i = 0; i <= this.segmentsT; i ++ ) {

			var u = i / this.segmentsT * this.arc;
			var v = j / this.segmentsR * Math.PI * 2;

			center.x = this.radius * Math.cos( u );
			center.y = this.radius * Math.sin( u );

			var vector = new THREE.Vector3();
			vector.x = ( this.radius + this.tube * Math.cos( v ) ) * Math.cos( u );
			vector.y = ( this.radius + this.tube * Math.cos( v ) ) * Math.sin( u );
			vector.z = this.tube * Math.sin( v );

			this.vertices.push( new THREE.Vertex( vector ) );

			uvs.push( new THREE.UV( i / this.segmentsT, 1 - j / this.segmentsR ) );
			normals.push( vector.clone().subSelf( center ).normalize() );

		}
	}


	for ( var j = 1; j <= this.segmentsR; j ++ ) {

		for ( var i = 1; i <= this.segmentsT; i ++ ) {

			var a = ( this.segmentsT + 1 ) * j + i - 1;
			var b = ( this.segmentsT + 1 ) * ( j - 1 ) + i - 1;
			var c = ( this.segmentsT + 1 ) * ( j - 1 ) + i;
			var d = ( this.segmentsT + 1 ) * j + i;

			var face = new THREE.Face4( a, b, c, d, [ normals[ a ], normals[ b ], normals[ c ], normals[ d ] ] );
			face.normal.addSelf( normals[ a ] );
			face.normal.addSelf( normals[ b ] );
			face.normal.addSelf( normals[ c ] );
			face.normal.addSelf( normals[ d ] );
			face.normal.normalize();

			this.faces.push( face );

			this.faceVertexUvs[ 0 ].push( [ uvs[ a ].clone(), uvs[ b ].clone(), uvs[ c ].clone(), uvs[ d ].clone() ] );
		}

	}

	this.computeCentroids();

};

THREE.TorusGeometry.prototype = new THREE.Geometry();
THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry;
/**
 * @author oosmoxiecode
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3D/src/away3d/primitives/TorusKnot.as?spec=svn2473&r=2473
 */

THREE.TorusKnotGeometry = function ( radius, tube, segmentsR, segmentsT, p, q, heightScale ) {

	THREE.Geometry.call( this );

	var scope = this;

	this.radius = radius || 200;
	this.tube = tube || 40;
	this.segmentsR = segmentsR || 64;
	this.segmentsT = segmentsT || 8;
	this.p = p || 2;
	this.q = q || 3;
	this.heightScale = heightScale || 1;
	this.grid = new Array(this.segmentsR);

	var tang = new THREE.Vector3();
	var n = new THREE.Vector3();
	var bitan = new THREE.Vector3();

	for ( var i = 0; i < this.segmentsR; ++ i ) {

		this.grid[ i ] = new Array( this.segmentsT );

		for ( var j = 0; j < this.segmentsT; ++ j ) {

			var u = i / this.segmentsR * 2 * this.p * Math.PI;
			var v = j / this.segmentsT * 2 * Math.PI;
			var p = getPos( u, v, this.q, this.p, this.radius, this.heightScale );
			var p2 = getPos( u + 0.01, v, this.q, this.p, this.radius, this.heightScale );
			var cx, cy;

			tang.x = p2.x - p.x; tang.y = p2.y - p.y; tang.z = p2.z - p.z;
			n.x = p2.x + p.x; n.y = p2.y + p.y; n.z = p2.z + p.z; 
			bitan.cross( tang, n );
			n.cross( bitan, tang );
			bitan.normalize();
			n.normalize();

			cx = - this.tube * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
			cy = this.tube * Math.sin( v );

			p.x += cx * n.x + cy * bitan.x;
			p.y += cx * n.y + cy * bitan.y;
			p.z += cx * n.z + cy * bitan.z;

			this.grid[ i ][ j ] = vert( p.x, p.y, p.z );

		}

	}

	for ( var i = 0; i < this.segmentsR; ++ i ) {

		for ( var j = 0; j < this.segmentsT; ++ j ) {

			var ip = ( i + 1 ) % this.segmentsR;
			var jp = ( j + 1 ) % this.segmentsT;
			var a = this.grid[ i ][ j ]; 
			var b = this.grid[ ip ][ j ];
			var c = this.grid[ ip ][ jp ];
			var d = this.grid[ i ][ jp ]; 

			var uva = new THREE.UV( i / this.segmentsR, j / this.segmentsT );
			var uvb = new THREE.UV( ( i + 1 ) / this.segmentsR, j / this.segmentsT );
			var uvc = new THREE.UV( ( i + 1 ) / this.segmentsR, ( j + 1 ) / this.segmentsT );
			var uvd = new THREE.UV( i / this.segmentsR, ( j + 1 ) / this.segmentsT );

			this.faces.push( new THREE.Face4( a, b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [ uva,uvb,uvc, uvd ] );

		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function vert( x, y, z ) {

		return scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) ) - 1;

	}

	function getPos( u, v, in_q, in_p, radius, heightScale ) {

		var cu = Math.cos( u );
		var cv = Math.cos( v );
		var su = Math.sin( u );
		var quOverP = in_q / in_p * u;
		var cs = Math.cos( quOverP );

		var tx = radius * ( 2 + cs ) * 0.5 * cu;
		var ty = radius * ( 2 + cs ) * su * 0.5;
		var tz = heightScale * radius * Math.sin( quOverP ) * 0.5;

		return new THREE.Vector3( tx, ty, tz );

	}

};

THREE.TorusKnotGeometry.prototype = new THREE.Geometry();
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry;
/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog 
 * 
 *	Subdivision Geometry Modifier 
 *		using Catmull-Clark Subdivision Surfaces
 *		for creating smooth geometry meshes
 *
 *	Note: a modifier modifies vertices and faces of geometry,
 *		so use THREE.GeometryUtils.clone() if orignal geoemtry needs to be retained
 * 
 *	Readings: 
 *		http://en.wikipedia.org/wiki/Catmull%E2%80%93Clark_subdivision_surface
 *		http://www.rorydriscoll.com/2008/08/01/catmull-clark-subdivision-the-basics/
 *		http://xrt.wikidot.com/blog:31
 *		"Subdivision Surfaces in Character Animation"
 *
 *	Supports:
 *		Closed and Open geometries.
 *
 *	TODO: 
 *		crease vertex and "semi-sharp" features
 *		selective subdivision
 */

THREE.SubdivisionModifier = function( subdivisions ) {
	
	this.subdivisions = (subdivisions === undefined ) ? 1 : subdivisions;
	
	// Settings
	this.useOldVertexColors = false;
	this.supportUVs = true;
	
};

//THREE.SubdivisionModifier.prototype = new THREE.Modifier();

THREE.SubdivisionModifier.prototype.constructor = THREE.SubdivisionModifier;

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function ( geometry ) {
	
	var repeats = this.subdivisions;
	
	while ( repeats-- > 0 ) {
		this.smooth( geometry );
	}
	
};

// Performs an iteration of Catmull-Clark Subdivision
THREE.SubdivisionModifier.prototype.smooth = function ( oldGeometry ) {
	
	//console.log( 'running smooth' );
	
	// New set of vertices, faces and uvs
	var newVertices = [], newFaces = [], newUVs = [];
	
	function v( x, y, z ) {
		newVertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
	}
	
	var scope = this;

	function f4( a, b, c, d, oldFace, orders ) {
		
		// TODO move vertex selection over here!
		
		var newFace = new THREE.Face4( a, b, c, d, null, oldFace.color, oldFace.material );
		
		if (scope.useOldVertexColors) {
			
			newFace.vertexColors = []; 
			
			var color, tmpColor, order;
			for (var i=0;i<4;i++) {
				order = orders[i];
				
				color = new THREE.Color(),
				color.setRGB(0,0,0);
				
				for (var j=0, jl=0; j<order.length;j++) {
					tmpColor = oldFace.vertexColors[order[j]-1];
					color.r += tmpColor.r;
					color.g += tmpColor.g;
					color.b += tmpColor.b;
				}
				
				color.r /= order.length;
				color.g /= order.length;
				color.b /= order.length;
				
				newFace.vertexColors[i] = color;
				
			}
			
		}
		
		newFaces.push( newFace );
		
		if (!scope.supportUVs || uvForVertices.length!=0) {
			newUVs.push( [
				uvForVertices[a],
				uvForVertices[b],
				uvForVertices[c],
				uvForVertices[d]
			] );
			
		}
	}
	
	function edge_hash( a, b ) {

		return Math.min( a, b ) + "_" + Math.max( a, b );

	};
	
	function computeEdgeFaces( geometry ) {

		function addToMap( map, hash, i ) {

			if ( map[ hash ] === undefined ) {

				map[ hash ] = [];
				
			} 
			
			map[ hash ].push( i );

		};

		var i, il, v1, v2, j, k,
			face, faceIndices, faceIndex,
			edge,
			hash,
			vfMap = {};

		// construct vertex -> face map

		for( i = 0, il = geometry.faces.length; i < il; i ++ ) {

			face = geometry.faces[ i ];

			if ( face instanceof THREE.Face3 ) {

				hash = edge_hash( face.a, face.b );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.b, face.c );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.c, face.a );
				addToMap( vfMap, hash, i );

			} else if ( face instanceof THREE.Face4 ) {

				hash = edge_hash( face.a, face.b );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.b, face.c );
				addToMap( vfMap, hash, i );

				hash = edge_hash( face.c, face.d );
				addToMap( vfMap, hash, i );
				
				hash = edge_hash( face.d, face.a );
				addToMap( vfMap, hash, i );

			}

		}

		// extract faces
		
		// var edges = [];
		// 
		// var numOfEdges = 0;
		// for (i in vfMap) {
		// 	numOfEdges++;
		// 	
		// 	edge = vfMap[i];
		// 	edges.push(edge);
		// 	
		// }
		
		//console.log('vfMap', vfMap, 'geometry.edges',geometry.edges, 'numOfEdges', numOfEdges);

		return vfMap;

	};
	
	var originalPoints = oldGeometry.vertices;
	var originalFaces = oldGeometry.faces;
	
	var newPoints = originalPoints.concat(); // Vertices
		
	var facePoints = [], edgePoints = {};
	
	var sharpEdges = {}, sharpVertices = [], sharpFaces = [];
	
	var uvForVertices = [];
	
	// Step 1
	//	For each face, add a face point
	//	Set each face point to be the centroid of all original points for the respective face.
	
	var i, il, j, jl, face;
	
	// For Uvs
	var uvs = oldGeometry.faceVertexUvs[0];
	var abcd = 'abcd', vertice;
	
	for (i=0, il = uvs.length; i<il; i++ ) {
		for (j=0,jl=uvs[i].length;j<jl;j++) {
			vertice = originalFaces[i][abcd.charAt(j)];
			
			if (!uvForVertices[vertice]) {
				uvForVertices[vertice] = uvs[i][j];
			} else {
				//console.log('dup', 	uvForVertices[vertice]);
			}
			
			
		}
	}
			
	var avgUv ;
	for (i=0, il = originalFaces.length; i<il ;i++) {
		face = originalFaces[i];
		facePoints.push(face.centroid);
		newPoints.push( new THREE.Vertex(face.centroid) );
		
		
		if (!scope.supportUVs || uvForVertices.length==0) continue;
		
		// Prepare subdivided uv
		
		avgUv = new THREE.UV();
		
		if ( face instanceof THREE.Face3 ) {
			avgUv.u = uvForVertices[face.a].u + uvForVertices[face.b].u + uvForVertices[face.c].u;
			avgUv.v = uvForVertices[face.a].v + uvForVertices[face.b].v + uvForVertices[face.c].v;
			avgUv.u /= 3;
			avgUv.v /= 3;
			
		} else if ( face instanceof THREE.Face4 ) {
			avgUv.u = uvForVertices[face.a].u + uvForVertices[face.b].u + uvForVertices[face.c].u + uvForVertices[face.d].u;
			avgUv.v = uvForVertices[face.a].v + uvForVertices[face.b].v + uvForVertices[face.c].v + uvForVertices[face.d].v;
			avgUv.u /= 4;
			avgUv.v /= 4;
		}
	
		uvForVertices.push(avgUv);
	}

	// Step 2
	//	For each edge, add an edge point.
	//	Set each edge point to be the average of the two neighbouring face points and its two original endpoints.
	
	var vfMap = computeEdgeFaces ( oldGeometry );
	var edge, faceIndexA, faceIndexB, avg;
	
	//console.log('vfMap', vfMap);

	var edgeCount = 0;
	var originalVerticesLength = originalPoints.length;
	var edgeVertex, edgeVertexA, edgeVertexB;
	
	////
	
	var vertexEdgeMap = {};
	var vertexFaceMap = {};
	
	var addVertexEdgeMap = function(vertex, edge) {
		if (vertexEdgeMap[vertex]===undefined) {
			vertexEdgeMap[vertex] = [];
		}
		
		vertexEdgeMap[vertex].push(edge);
	};
	
	var addVertexFaceMap = function(vertex, face, edge) {
		if (vertexFaceMap[vertex]===undefined) {
			vertexFaceMap[vertex] = {};
		}
		
		//vertexFaceMap[vertex][face] = edge;
		vertexFaceMap[vertex][face] = null;
	};
	
	// Prepares vertexEdgeMap and vertexFaceMap
	for (i in vfMap) { // This is for every edge
		edge = vfMap[i];
		
		edgeVertex = i.split('_');
		edgeVertexA = edgeVertex[0];
		edgeVertexB = edgeVertex[1];
		
		// Maps an edgeVertex to connecting edges
		addVertexEdgeMap(edgeVertexA, [edgeVertexA, edgeVertexB] );
		addVertexEdgeMap(edgeVertexB, [edgeVertexA, edgeVertexB] );
		
		
		// faceIndexA = edge[0]; // face index a
		// faceIndexB = edge[1]; // face index b
		// 
		// // Add connecting faces for edge
		// addVertexFaceMap(edgeVertexA, faceIndexA);
		// addVertexFaceMap(edgeVertexB, faceIndexA);
		// 
		// 
		// if (faceIndexB) {
		// 	addVertexFaceMap(edgeVertexA, faceIndexB);
		// 	addVertexFaceMap(edgeVertexB, faceIndexB);
		// } else {
		// 	addVertexFaceMap(edgeVertexA, faceIndexA);
		// 	addVertexFaceMap(edgeVertexB, faceIndexA);
		// }
		
		for (j=0,jl=edge.length;j<jl;j++) {
			face = edge[j];
			
			addVertexFaceMap(edgeVertexA, face, i);
			addVertexFaceMap(edgeVertexB, face, i);
		}
		
		if (edge.length < 2) {
			// edge is "sharp";
			sharpEdges[i] = true;
			sharpVertices[edgeVertexA] = true;
			sharpVertices[edgeVertexB] = true;
			
		}
		
	}
	
	
	
	//console.log('vertexEdgeMap',vertexEdgeMap, 'vertexFaceMap', vertexFaceMap);
	
	
	for (i in vfMap) {
		edge = vfMap[i];
		
		faceIndexA = edge[0]; // face index a
		faceIndexB = edge[1]; // face index b
		
		edgeVertex = i.split('_');
		edgeVertexA = edgeVertex[0];
		edgeVertexB = edgeVertex[1];
		
		
		avg = new THREE.Vector3();
		
		//console.log(i, faceIndexB,facePoints[faceIndexB]);
		
		if (sharpEdges[i]) {
			//console.log('warning, ', i, 'edge has only 1 connecting face', edge);
			
			// For a sharp edge, average the edge end points.
			avg.addSelf(originalPoints[edgeVertexA].position);
			avg.addSelf(originalPoints[edgeVertexB].position);
			
			avg.multiplyScalar(0.5);
			
			sharpVertices[newPoints.length] = true;
			
		} else {
		
			avg.addSelf(facePoints[faceIndexA]);
			avg.addSelf(facePoints[faceIndexB]);
		
			avg.addSelf(originalPoints[edgeVertexA].position);
			avg.addSelf(originalPoints[edgeVertexB].position);
		
			avg.multiplyScalar(0.25);
		
		}
		
		edgePoints[i] = originalVerticesLength + originalFaces.length + edgeCount;
		//console.log(edgePoints[i], newPoints.length);
		
		newPoints.push( new THREE.Vertex(avg) );
	
		edgeCount ++;
		
		if (!scope.supportUVs || uvForVertices.length==0) continue;
		
		// Prepare subdivided uv
		
		avgUv = new THREE.UV();
		
		avgUv.u = uvForVertices[edgeVertexA].u + uvForVertices[edgeVertexB].u;
		avgUv.v = uvForVertices[edgeVertexA].v + uvForVertices[edgeVertexB].v;
		avgUv.u /= 2;
		avgUv.v /= 2;
	
		uvForVertices.push(avgUv);
		
	}
	
	// Step 3
	//	For each face point, add an edge for every edge of the face, 
	//	connecting the face point to each edge point for the face.
	
	
	var facePt, currentVerticeIndex;
	
	var hashAB, hashBC, hashCD, hashDA, hashCA;
	
	var abc123 = ['123', '12', '2', '23'];
	var bca123 = ['123', '23', '3', '31'];
	var cab123 = ['123', '31', '1', '12'];
	var abc1234 = ['1234', '12', '2', '23'];
	var bcd1234 = ['1234', '23', '3', '34'];
	var cda1234 = ['1234', '34', '4', '41'];
	var dab1234 = ['1234', '41', '1', '12'];
	
	
	for (i=0, il = facePoints.length; i<il ;i++) { // for every face
		facePt = facePoints[i];
		face = originalFaces[i];
		currentVerticeIndex = originalVerticesLength+ i;
		
		if ( face instanceof THREE.Face3 ) {
			
			// create 3 face4s
			
			hashAB = edge_hash( face.a, face.b );
			hashBC = edge_hash( face.b, face.c );
			hashCA = edge_hash( face.c, face.a );
			
			f4( currentVerticeIndex, edgePoints[hashAB], face.b, edgePoints[hashBC], face, abc123 );
			f4( currentVerticeIndex, edgePoints[hashBC], face.c, edgePoints[hashCA], face, bca123 );
			f4( currentVerticeIndex, edgePoints[hashCA], face.a, edgePoints[hashAB], face, cab123 );
			
		} else if ( face instanceof THREE.Face4 ) {
			// create 4 face4s
			
			hashAB = edge_hash( face.a, face.b );
			hashBC = edge_hash( face.b, face.c );
			hashCD = edge_hash( face.c, face.d );
			hashDA = edge_hash( face.d, face.a );
			
			f4( currentVerticeIndex, edgePoints[hashAB], face.b, edgePoints[hashBC], face, abc1234 );
			f4( currentVerticeIndex, edgePoints[hashBC], face.c, edgePoints[hashCD], face, bcd1234 );
			f4( currentVerticeIndex, edgePoints[hashCD], face.d, edgePoints[hashDA], face, cda1234 );
			f4( currentVerticeIndex, edgePoints[hashDA], face.a, edgePoints[hashAB], face, dab1234  );

				
		} else {
			console.log('face should be a face!', face);
		}
	}
	
	newVertices = newPoints;
	
	// console.log('original ', oldGeometry.vertices.length, oldGeometry.faces.length );
	// console.log('new points', newPoints.length, 'faces', newFaces.length );
	
	// Step 4
	
	//	For each original point P, 
	//		take the average F of all n face points for faces touching P, 
	//		and take the average R of all n edge midpoints for edges touching P, 
	//		where each edge midpoint is the average of its two endpoint vertices. 
	//	Move each original point to the point

	
	var F = new THREE.Vector3();
	var R = new THREE.Vector3();

	var n;
	for (i=0, il = originalPoints.length; i<il; i++) {
		// (F + 2R + (n-3)P) / n
		
		if (vertexEdgeMap[i]===undefined) continue;
		
		F.set(0,0,0);
		R.set(0,0,0);
		var newPos =  new THREE.Vector3(0,0,0);
		
		var f =0;
		for (j in vertexFaceMap[i]) {
			F.addSelf(facePoints[j]);
			f++;
		}
		
		var sharpEdgeCount = 0;
		
		n = vertexEdgeMap[i].length;
		
		for (j=0;j<n;j++) {
			if (
				sharpEdges[
					edge_hash(vertexEdgeMap[i][j][0],vertexEdgeMap[i][j][1])
				]) {
					sharpEdgeCount++;
				}
		}
		
		if ( sharpEdgeCount==2 ) {
			continue;
			// Do not move vertex if there's 2 connecting sharp edges.
		}

		/*
		if (sharpEdgeCount>2) {
			// TODO
		}
		*/
		
		F.divideScalar(f);
		
		
		
		for (j=0; j<n;j++) {
			edge = vertexEdgeMap[i][j];
			var midPt = originalPoints[edge[0]].position.clone().addSelf(originalPoints[edge[1]].position).divideScalar(2);
			R.addSelf(midPt);
			// R.addSelf(originalPoints[edge[0]].position);
			// R.addSelf(originalPoints[edge[1]].position);
		}
		
		R.divideScalar(n)
		
		newPos.addSelf(originalPoints[i].position);
		newPos.multiplyScalar(n - 3);
		
		newPos.addSelf(F);
		newPos.addSelf(R.multiplyScalar(2));
		newPos.divideScalar(n);
		
		newVertices[i].position = newPos;
		
		
	}
	
	var newGeometry = oldGeometry; // Let's pretend the old geometry is now new :P
	
	newGeometry.vertices = newVertices;
	newGeometry.faces = newFaces;
	newGeometry.faceVertexUvs[ 0 ] = newUVs;
	
	delete newGeometry.__tmpVertices; // makes __tmpVertices undefined :P
	
	newGeometry.computeCentroids();
	newGeometry.computeFaceNormals();
	newGeometry.computeVertexNormals();
	
};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function ( showStatus ) {

	this.showStatus = showStatus;
	this.statusDomElement = showStatus ? THREE.Loader.prototype.addStatusElement() : null;

	this.onLoadStart = function () {};
	this.onLoadProgress = function() {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	constructor: THREE.Loader,

	addStatusElement: function () {

		var e = document.createElement( "div" );

		e.style.position = "absolute";
		e.style.right = "0px";
		e.style.top = "0px";
		e.style.fontSize = "0.8em";
		e.style.textAlign = "left";
		e.style.background = "rgba(0,0,0,0.25)";
		e.style.color = "#fff";
		e.style.width = "120px";
		e.style.padding = "0.5em 0.5em 0.5em 0.5em";
		e.style.zIndex = 1000;

		e.innerHTML = "Loading ...";

		return e;

	},

	updateProgress: function ( progress ) {

		var message = "Loaded ";

		if ( progress.total ) {

			message += ( 100 * progress.loaded / progress.total ).toFixed(0) + "%";


		} else {

			message += ( progress.loaded / 1000 ).toFixed(2) + " KB";

		}

		this.statusDomElement.innerHTML = message;

	},

	extractUrlbase: function ( url ) {

		var parts = url.split( '/' );
		parts.pop();
		return parts.length < 1 ? '' : parts.join( '/' ) + '/';

	},

	initMaterials: function ( scope, materials, texture_path ) {

		scope.materials = [];

		for ( var i = 0; i < materials.length; ++ i ) {

			scope.materials[ i ] = THREE.Loader.prototype.createMaterial( materials[ i ], texture_path );

		}

	},

	hasNormals: function ( scope ) {

		var m, i, il = scope.materials.length;

		for( i = 0; i < il; i ++ ) {

			m = scope.materials[ i ];

			if ( m instanceof THREE.ShaderMaterial ) return true;

		}

		return false;

	},

	createMaterial: function ( m, texture_path ) {

		function is_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.floor( l ) == l;

		}

		function nearest_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.pow( 2, Math.round(  l ) );

		}

		function load_image( where, url ) {

			var image = new Image();

			image.onload = function () {

				if ( !is_pow2( this.width ) || !is_pow2( this.height ) ) {

					var w = nearest_pow2( this.width ),
						h = nearest_pow2( this.height );

					where.image.width = w;
					where.image.height = h;
					where.image.getContext("2d").drawImage( this, 0, 0, w, h );

				} else {

					where.image = this;

				}

				where.needsUpdate = true;

			};

			image.src = url;

		}

		function create_texture( where, name, sourceFile, repeat, offset, wrap ) {

			var texture = document.createElement( 'canvas' );

			where[ name ] = new THREE.Texture( texture );
			where[ name ].sourceFile = sourceFile;

			if( repeat ) {

				where[ name ].repeat.set( repeat[ 0 ], repeat[ 1 ] );

				if ( repeat[ 0 ] != 1 ) where[ name ].wrapS = THREE.RepeatWrapping;
				if ( repeat[ 1 ] != 1 ) where[ name ].wrapT = THREE.RepeatWrapping;

			}

			if( offset ) {

				where[ name ].offset.set( offset[ 0 ], offset[ 1 ] );

			}

			if( wrap ) {

				var wrapMap = {
				"repeat" 	: THREE.RepeatWrapping,
				"mirror"	: THREE.MirroredRepeatWrapping
				}

				if ( wrapMap[ wrap[ 0 ] ] !== undefined ) where[ name ].wrapS = wrapMap[ wrap[ 0 ] ];
				if ( wrapMap[ wrap[ 1 ] ] !== undefined ) where[ name ].wrapT = wrapMap[ wrap[ 1 ] ];

			}

			load_image( where[ name ], texture_path + "/" + sourceFile );

		}

		function rgb2hex( rgb ) {

			return ( rgb[ 0 ] * 255 << 16 ) + ( rgb[ 1 ] * 255 << 8 ) + rgb[ 2 ] * 255;

		}

		var material, mtype, mpars,
			color, specular, ambient,
			vertexColors;

		// defaults

		mtype = "MeshLambertMaterial";

		// vertexColors

		mpars = { color: 0xeeeeee, opacity: 1.0, map: null, lightMap: null, normalMap: null, wireframe: m.wireframe };

		// parameters from model file

		if ( m.shading ) {

			if ( m.shading == "Phong" ) mtype = "MeshPhongMaterial";
			else if ( m.shading == "Basic" ) mtype = "MeshBasicMaterial";

		}

		if ( m.blending ) {

			if ( m.blending == "Additive" ) mpars.blending = THREE.AdditiveBlending;
			else if ( m.blending == "Subtractive" ) mpars.blending = THREE.SubtractiveBlending;
			else if ( m.blending == "Multiply" ) mpars.blending = THREE.MultiplyBlending;

		}

		if ( m.transparent !== undefined || m.opacity < 1.0 ) {

			mpars.transparent = m.transparent;

		}

		if ( m.depthTest !== undefined ) {

			mpars.depthTest = m.depthTest;

		}

		if ( m.vertexColors !== undefined ) {

			if ( m.vertexColors == "face" ) {

				mpars.vertexColors = THREE.FaceColors;

			} else if ( m.vertexColors ) {

				mpars.vertexColors = THREE.VertexColors;

			}

		}

		// colors

		if ( m.colorDiffuse ) {

			mpars.color = rgb2hex( m.colorDiffuse );

		} else if ( m.DbgColor ) {

			mpars.color = m.DbgColor;

		}

		if ( m.colorSpecular ) {

			mpars.specular = rgb2hex( m.colorSpecular );

		}

		if ( m.colorAmbient ) {

			mpars.ambient = rgb2hex( m.colorAmbient );

		}

		// modifiers

		if ( m.transparency ) {

			mpars.opacity = m.transparency;

		}

		if ( m.specularCoef ) {

			mpars.shininess = m.specularCoef;

		}

		// textures

		if ( m.mapDiffuse && texture_path ) {

			create_texture( mpars, "map", m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap );

		}

		if ( m.mapLight && texture_path ) {

			create_texture( mpars, "lightMap", m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap );

		}

		if ( m.mapNormal && texture_path ) {

			create_texture( mpars, "normalMap", m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap );

		}

		if ( m.mapSpecular && texture_path ) {

			create_texture( mpars, "specularMap", m.mapSpecular, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap );

		}

		// special case for normal mapped material

		if ( m.mapNormal ) {

			var shader = THREE.ShaderUtils.lib[ "normal" ];
			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			var diffuse = mpars.color;
			var specular = mpars.specular;
			var ambient = mpars.ambient;
			var shininess = mpars.shininess;

			uniforms[ "tNormal" ].texture = mpars.normalMap;

			if ( m.mapNormalFactor ) {

				uniforms[ "uNormalScale" ].value = m.mapNormalFactor;

			}

			if ( mpars.map ) {

				uniforms[ "tDiffuse" ].texture = mpars.map;
				uniforms[ "enableDiffuse" ].value = true;

			}

			if ( mpars.specularMap ) {

				uniforms[ "tSpecular" ].texture = mpars.specularMap;
				uniforms[ "enableSpecular" ].value = true;

			}

			if ( mpars.lightMap ) {

				uniforms[ "tAO" ].texture = mpars.lightMap;
				uniforms[ "enableAO" ].value = true;

			}

			// for the moment don't handle displacement texture

			uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
			uniforms[ "uSpecularColor" ].value.setHex( specular );
			uniforms[ "uAmbientColor" ].value.setHex( ambient );

			uniforms[ "uShininess" ].value = shininess;

			if ( mpars.opacity ) {

				uniforms[ "uOpacity" ].value = mpars.opacity;

			}

			var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };

			material = new THREE.ShaderMaterial( parameters );

		} else {

			material = new THREE[ mtype ]( mpars );

		}

		return material;

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.BinaryLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.BinaryLoader.prototype = new THREE.Loader();
THREE.BinaryLoader.prototype.constructor = THREE.BinaryLoader;
THREE.BinaryLoader.prototype.supr = THREE.Loader.prototype;


// Load models generated by slim OBJ converter with BINARY option (converter_obj_three_slim.py -t binary)
//  - binary models consist of two files: JS and BIN
//  - parameters
//		- url (required)
//		- callback (required)
//		- texturePath (optional: if not specified, textures will be assumed to be in the same folder as JS model file)
//		- binaryPath (optional: if not specified, binary file will be assumed to be in the same folder as JS model file)

THREE.BinaryLoader.prototype.load = function( url, callback, texturePath, binaryPath ) {

	if ( url instanceof Object ) {

		console.warn( 'DEPRECATED: BinaryLoader( parameters ) is now BinaryLoader( url, callback, texturePath, binaryPath ).' );

		var parameters = url;

		url = parameters.model;
		callback = parameters.callback;
		texturePath = parameters.texture_path;
		binaryPath = parameters.bin_path;

	}

	texturePath = texturePath ? texturePath : this.extractUrlbase( url );
	binaryPath = binaryPath ? binaryPath : this.extractUrlbase( url );

	var callbackProgress = this.showProgress ? THREE.Loader.prototype.updateProgress : null;

	this.onLoadStart();

	// #1 load JS part via web worker

	this.loadAjaxJSON( this, url, callback, texturePath, binaryPath, callbackProgress );

};

THREE.BinaryLoader.prototype.loadAjaxJSON = function( context, url, callback, texturePath, binaryPath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				try {

					var json = JSON.parse( xhr.responseText );

					if ( json.metadata === undefined || json.metadata.formatVersion === undefined || json.metadata.formatVersion !== 3 ) {

						console.error( 'Deprecated file format.' );
						return;

					}

					// #2 load BIN part via Ajax

					context.loadAjaxBuffers( json, callback, binaryPath, texturePath, callbackProgress );

				} catch ( error ) {

					console.error( error );
					console.warn( "DEPRECATED: [" + url + "] seems to be using old model format" );

				}

			} else {

				console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		}

	};

	xhr.open( "GET", url, true );
	xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	xhr.setRequestHeader( "Content-Type", "text/plain" );
	xhr.send( null );

};

THREE.BinaryLoader.prototype.loadAjaxBuffers = function( json, callback, binaryPath, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest(),
		url = binaryPath + "/" + json.buffers;

	var length = 0;

	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				THREE.BinaryLoader.prototype.createBinModel( xhr.response, callback, texturePath, json.materials );

			} else {

				console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState == 3 ) {

			if ( callbackProgress ) {

				if ( length == 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState == 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	};

	xhr.open( "GET", url, true );
	xhr.responseType = "arraybuffer";
	xhr.send( null );

};

// Binary AJAX parser

THREE.BinaryLoader.prototype.createBinModel = function ( data, callback, texturePath, materials ) {

	var Model = function ( texturePath ) {

		var scope = this,
			currentOffset = 0,
			md,
			normals = [],
			uvs = [],
			start_tri_flat, start_tri_smooth, start_tri_flat_uv, start_tri_smooth_uv,
			start_quad_flat, start_quad_smooth, start_quad_flat_uv, start_quad_smooth_uv,
			tri_size, quad_size,
			len_tri_flat, len_tri_smooth, len_tri_flat_uv, len_tri_smooth_uv,
			len_quad_flat, len_quad_smooth, len_quad_flat_uv, len_quad_smooth_uv;


		THREE.Geometry.call( this );

		THREE.Loader.prototype.initMaterials( scope, materials, texturePath );

		md = parseMetaData( data, currentOffset );

		if ( md.signature !== "Three.js 003" ) {

			console.warn( "DEPRECATED: binary model seems to be using old format" );

		}

		currentOffset += md.header_bytes;
/*
		md.vertex_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
		md.material_index_bytes = Uint16Array.BYTES_PER_ELEMENT;
		md.normal_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
		md.uv_index_bytes = Uint32Array.BYTES_PER_ELEMENT;
*/
		// buffers sizes

		tri_size =  md.vertex_index_bytes * 3 + md.material_index_bytes;
		quad_size = md.vertex_index_bytes * 4 + md.material_index_bytes;

		len_tri_flat      = md.ntri_flat      * ( tri_size );
		len_tri_smooth    = md.ntri_smooth    * ( tri_size + md.normal_index_bytes * 3 );
		len_tri_flat_uv   = md.ntri_flat_uv   * ( tri_size + md.uv_index_bytes * 3 );
		len_tri_smooth_uv = md.ntri_smooth_uv * ( tri_size + md.normal_index_bytes * 3 + md.uv_index_bytes * 3 );

		len_quad_flat      = md.nquad_flat      * ( quad_size );
		len_quad_smooth    = md.nquad_smooth    * ( quad_size + md.normal_index_bytes * 4 );
		len_quad_flat_uv   = md.nquad_flat_uv   * ( quad_size + md.uv_index_bytes * 4 );
		len_quad_smooth_uv = md.nquad_smooth_uv * ( quad_size + md.normal_index_bytes * 4 + md.uv_index_bytes * 4 );

		// read buffers

		currentOffset += init_vertices( currentOffset );

		currentOffset += init_normals( currentOffset );
		currentOffset += handlePadding( md.nnormals * 3 );

		currentOffset += init_uvs( currentOffset );

		start_tri_flat 		= currentOffset;
		start_tri_smooth    = start_tri_flat    + len_tri_flat    + handlePadding( md.ntri_flat * 2 );
		start_tri_flat_uv   = start_tri_smooth  + len_tri_smooth  + handlePadding( md.ntri_smooth * 2 );
		start_tri_smooth_uv = start_tri_flat_uv + len_tri_flat_uv + handlePadding( md.ntri_flat_uv * 2 );

		start_quad_flat     = start_tri_smooth_uv + len_tri_smooth_uv  + handlePadding( md.ntri_smooth_uv * 2 );
		start_quad_smooth   = start_quad_flat     + len_quad_flat	   + handlePadding( md.nquad_flat * 2 );
		start_quad_flat_uv  = start_quad_smooth   + len_quad_smooth    + handlePadding( md.nquad_smooth * 2 );
		start_quad_smooth_uv= start_quad_flat_uv  + len_quad_flat_uv   + handlePadding( md.nquad_flat_uv * 2 );

		// have to first process faces with uvs
		// so that face and uv indices match

		init_triangles_flat_uv( start_tri_flat_uv );
		init_triangles_smooth_uv( start_tri_smooth_uv );

		init_quads_flat_uv( start_quad_flat_uv );
		init_quads_smooth_uv( start_quad_smooth_uv );

		// now we can process untextured faces

		init_triangles_flat( start_tri_flat );
		init_triangles_smooth( start_tri_smooth );

		init_quads_flat( start_quad_flat );
		init_quads_smooth( start_quad_smooth );

		this.computeCentroids();
		this.computeFaceNormals();

		if ( THREE.Loader.prototype.hasNormals( this ) ) this.computeTangents();

		function handlePadding( n ) {

			return ( n % 4 ) ? ( 4 - n % 4 ) : 0;

		};

		function parseMetaData( data, offset ) {

			var metaData = {

				'signature'               :parseString( data, offset,  12 ),
				'header_bytes'            :parseUChar8( data, offset + 12 ),

				'vertex_coordinate_bytes' :parseUChar8( data, offset + 13 ),
				'normal_coordinate_bytes' :parseUChar8( data, offset + 14 ),
				'uv_coordinate_bytes'     :parseUChar8( data, offset + 15 ),

				'vertex_index_bytes'      :parseUChar8( data, offset + 16 ),
				'normal_index_bytes'      :parseUChar8( data, offset + 17 ),
				'uv_index_bytes'          :parseUChar8( data, offset + 18 ),
				'material_index_bytes'    :parseUChar8( data, offset + 19 ),

				'nvertices'    :parseUInt32( data, offset + 20 ),
				'nnormals'     :parseUInt32( data, offset + 20 + 4*1 ),
				'nuvs'         :parseUInt32( data, offset + 20 + 4*2 ),

				'ntri_flat'      :parseUInt32( data, offset + 20 + 4*3 ),
				'ntri_smooth'    :parseUInt32( data, offset + 20 + 4*4 ),
				'ntri_flat_uv'   :parseUInt32( data, offset + 20 + 4*5 ),
				'ntri_smooth_uv' :parseUInt32( data, offset + 20 + 4*6 ),

				'nquad_flat'      :parseUInt32( data, offset + 20 + 4*7 ),
				'nquad_smooth'    :parseUInt32( data, offset + 20 + 4*8 ),
				'nquad_flat_uv'   :parseUInt32( data, offset + 20 + 4*9 ),
				'nquad_smooth_uv' :parseUInt32( data, offset + 20 + 4*10 )

			};
/*
			console.log( "signature: " + metaData.signature );

			console.log( "header_bytes: " + metaData.header_bytes );
			console.log( "vertex_coordinate_bytes: " + metaData.vertex_coordinate_bytes );
			console.log( "normal_coordinate_bytes: " + metaData.normal_coordinate_bytes );
			console.log( "uv_coordinate_bytes: " + metaData.uv_coordinate_bytes );

			console.log( "vertex_index_bytes: " + metaData.vertex_index_bytes );
			console.log( "normal_index_bytes: " + metaData.normal_index_bytes );
			console.log( "uv_index_bytes: " + metaData.uv_index_bytes );
			console.log( "material_index_bytes: " + metaData.material_index_bytes );

			console.log( "nvertices: " + metaData.nvertices );
			console.log( "nnormals: " + metaData.nnormals );
			console.log( "nuvs: " + metaData.nuvs );

			console.log( "ntri_flat: " + metaData.ntri_flat );
			console.log( "ntri_smooth: " + metaData.ntri_smooth );
			console.log( "ntri_flat_uv: " + metaData.ntri_flat_uv );
			console.log( "ntri_smooth_uv: " + metaData.ntri_smooth_uv );

			console.log( "nquad_flat: " + metaData.nquad_flat );
			console.log( "nquad_smooth: " + metaData.nquad_smooth );
			console.log( "nquad_flat_uv: " + metaData.nquad_flat_uv );
			console.log( "nquad_smooth_uv: " + metaData.nquad_smooth_uv );

			var total = metaData.header_bytes
					  + metaData.nvertices * metaData.vertex_coordinate_bytes * 3
					  + metaData.nnormals * metaData.normal_coordinate_bytes * 3
					  + metaData.nuvs * metaData.uv_coordinate_bytes * 2
					  + metaData.ntri_flat * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes )
					  + metaData.ntri_smooth * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 )
					  + metaData.ntri_flat_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.uv_index_bytes*3 )
					  + metaData.ntri_smooth_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 + metaData.uv_index_bytes*3 )
					  + metaData.nquad_flat * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes )
					  + metaData.nquad_smooth * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 )
					  + metaData.nquad_flat_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.uv_index_bytes*4 )
					  + metaData.nquad_smooth_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 + metaData.uv_index_bytes*4 );
			console.log( "total bytes: " + total );
*/

			return metaData;

		};

		function parseString( data, offset, length ) {

			var charArray = new Uint8Array( data, offset, length );

			var text = "";

			for ( var i = 0; i < length; i ++ ) {

				text += String.fromCharCode( charArray[ offset + i ] );

			}

			return text;

		};

		function parseUChar8( data, offset ) {

			var charArray = new Uint8Array( data, offset, 1 );

			return charArray[ 0 ];

		};

		function parseUInt32( data, offset ) {

			var intArray = new Uint32Array( data, offset, 1 );

			return intArray[ 0 ];

		};

		function init_vertices( start ) {

			var nElements = md.nvertices;

			var coordArray = new Float32Array( data, start, nElements * 3 );

			var i, x, y, z;

			for( i = 0; i < nElements; i ++ ) {

				x = coordArray[ i * 3 ];
				y = coordArray[ i * 3 + 1 ];
				z = coordArray[ i * 3 + 2 ];

				vertex( scope, x, y, z );

			}

			return nElements * 3 * Float32Array.BYTES_PER_ELEMENT;

		};

		function init_normals( start ) {

			var nElements = md.nnormals;

			if ( nElements ) {

				var normalArray = new Int8Array( data, start, nElements * 3 );

				var i, x, y, z;

				for( i = 0; i < nElements; i ++ ) {

					x = normalArray[ i * 3 ];
					y = normalArray[ i * 3 + 1 ];
					z = normalArray[ i * 3 + 2 ];

					normals.push( x/127, y/127, z/127 );

				}

			}

			return nElements * 3 * Int8Array.BYTES_PER_ELEMENT;

		};

		function init_uvs( start ) {

			var nElements = md.nuvs;

			if ( nElements ) {

				var uvArray = new Float32Array( data, start, nElements * 2 );

				var i, u, v;

				for( i = 0; i < nElements; i ++ ) {

					u = uvArray[ i * 2 ];
					v = uvArray[ i * 2 + 1 ];

					uvs.push( u, v );

				}

			}

			return nElements * 2 * Float32Array.BYTES_PER_ELEMENT;

		};

		function init_uvs3( nElements, offset ) {

			var i, uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

			var uvIndexBuffer = new Uint32Array( data, offset, 3 * nElements );

			for( i = 0; i < nElements; i ++ ) {

				uva = uvIndexBuffer[ i * 3 ];
				uvb = uvIndexBuffer[ i * 3 + 1 ];
				uvc = uvIndexBuffer[ i * 3 + 2 ];

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

			}

		};

		function init_uvs4( nElements, offset ) {

			var i, uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

			var uvIndexBuffer = new Uint32Array( data, offset, 4 * nElements );

			for( i = 0; i < nElements; i ++ ) {

				uva = uvIndexBuffer[ i * 4 ];
				uvb = uvIndexBuffer[ i * 4 + 1 ];
				uvc = uvIndexBuffer[ i * 4 + 2 ];
				uvd = uvIndexBuffer[ i * 4 + 3 ];

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				u4 = uvs[ uvd*2 ];
				v4 = uvs[ uvd*2 + 1 ];

				uv4( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3, u4, v4 );

			}

		};

		function init_faces3_flat( nElements, offsetVertices, offsetMaterials ) {

			var i, a, b, c, m;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 3 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 3 ];
				b = vertexIndexBuffer[ i * 3 + 1 ];
				c = vertexIndexBuffer[ i * 3 + 2 ];

				m = materialIndexBuffer[ i ];

				f3( scope, a, b, c, m );

			}

		};

		function init_faces4_flat( nElements, offsetVertices, offsetMaterials ) {

			var i, a, b, c, d, m;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 4 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 4 ];
				b = vertexIndexBuffer[ i * 4 + 1 ];
				c = vertexIndexBuffer[ i * 4 + 2 ];
				d = vertexIndexBuffer[ i * 4 + 3 ];

				m = materialIndexBuffer[ i ];

				f4( scope, a, b, c, d, m );

			}

		};

		function init_faces3_smooth( nElements, offsetVertices, offsetNormals, offsetMaterials ) {

			var i, a, b, c, m;
			var na, nb, nc;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 3 * nElements );
			var normalIndexBuffer = new Uint32Array( data, offsetNormals, 3 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 3 ];
				b = vertexIndexBuffer[ i * 3 + 1 ];
				c = vertexIndexBuffer[ i * 3 + 2 ];

				na = normalIndexBuffer[ i * 3 ];
				nb = normalIndexBuffer[ i * 3 + 1 ];
				nc = normalIndexBuffer[ i * 3 + 2 ];

				m = materialIndexBuffer[ i ];

				f3n( scope, normals, a, b, c, m, na, nb, nc );

			}

		};

		function init_faces4_smooth( nElements, offsetVertices, offsetNormals, offsetMaterials ) {

			var i, a, b, c, d, m;
			var na, nb, nc, nd;

			var vertexIndexBuffer = new Uint32Array( data, offsetVertices, 4 * nElements );
			var normalIndexBuffer = new Uint32Array( data, offsetNormals, 4 * nElements );
			var materialIndexBuffer = new Uint16Array( data, offsetMaterials, nElements );

			for( i = 0; i < nElements; i ++ ) {

				a = vertexIndexBuffer[ i * 4 ];
				b = vertexIndexBuffer[ i * 4 + 1 ];
				c = vertexIndexBuffer[ i * 4 + 2 ];
				d = vertexIndexBuffer[ i * 4 + 3 ];

				na = normalIndexBuffer[ i * 4 ];
				nb = normalIndexBuffer[ i * 4 + 1 ];
				nc = normalIndexBuffer[ i * 4 + 2 ];
				nd = normalIndexBuffer[ i * 4 + 3 ];

				m = materialIndexBuffer[ i ];

				f4n( scope, normals, a, b, c, d, m, na, nb, nc, nd );

			}

		};

		function init_triangles_flat( start ) {

			var nElements = md.ntri_flat;

			if ( nElements ) {

				var offsetMaterials = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				init_faces3_flat( nElements, start, offsetMaterials );

			}

		};

		function init_triangles_flat_uv( start ) {

			var nElements = md.ntri_flat_uv;

			if ( nElements ) {

				var offsetUvs = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_flat( nElements, start, offsetMaterials );
				init_uvs3( nElements, offsetUvs );

			}

		};

		function init_triangles_smooth( start ) {

			var nElements = md.ntri_smooth;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_smooth( nElements, start, offsetNormals, offsetMaterials );

			}

		};

		function init_triangles_smooth_uv( start ) {

			var nElements = md.ntri_smooth_uv;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetUvs = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 3;

				init_faces3_smooth( nElements, start, offsetNormals, offsetMaterials );
				init_uvs3( nElements, offsetUvs );

			}

		};

		function init_quads_flat( start ) {

			var nElements = md.nquad_flat;

			if ( nElements ) {

				var offsetMaterials = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				init_faces4_flat( nElements, start, offsetMaterials );

			}

		};

		function init_quads_flat_uv( start ) {

			var nElements = md.nquad_flat_uv;

			if ( nElements ) {

				var offsetUvs = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_flat( nElements, start, offsetMaterials );
				init_uvs4( nElements, offsetUvs );

			}

		};

		function init_quads_smooth( start ) {

			var nElements = md.nquad_smooth;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_smooth( nElements, start, offsetNormals, offsetMaterials );

			}

		};

		function init_quads_smooth_uv( start ) {

			var nElements = md.nquad_smooth_uv;

			if ( nElements ) {

				var offsetNormals = start + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetUvs = offsetNormals + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;
				var offsetMaterials = offsetUvs + nElements * Uint32Array.BYTES_PER_ELEMENT * 4;

				init_faces4_smooth( nElements, start, offsetNormals, offsetMaterials );
				init_uvs4( nElements, offsetUvs );

			}

		};

	};

	function vertex ( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	};

	function f3 ( scope, a, b, c, mi ) {

		scope.faces.push( new THREE.Face3( a, b, c, null, null, mi ) );

	};

	function f4 ( scope, a, b, c, d, mi ) {

		scope.faces.push( new THREE.Face4( a, b, c, d, null, null, mi ) );

	};

	function f3n ( scope, normals, a, b, c, mi, na, nb, nc ) {

		var nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, c,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz )],
						  null,
						  mi ) );

	};

	function f4n ( scope, normals, a, b, c, d, mi, na, nb, nc, nd ) {

		var nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ],

			ndx = normals[ nd*3     ],
			ndy = normals[ nd*3 + 1 ],
			ndz = normals[ nd*3 + 2 ];

		scope.faces.push( new THREE.Face4( a, b, c, d,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz ),
						   new THREE.Vector3( ndx, ndy, ndz )],
						  null,
						  mi ) );

	};

	function uv3 ( where, u1, v1, u2, v2, u3, v3 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		where.push( uv );

	};

	function uv4 ( where, u1, v1, u2, v2, u3, v3, u4, v4 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		uv.push( new THREE.UV( u4, v4 ) );
		where.push( uv );

	};

	Model.prototype = new THREE.Geometry();
	Model.prototype.constructor = Model;

	callback( new Model( texturePath ) );

};
/**
 * @author Tim Knip / http://www.floorplanner.com/ / tim at floorplanner.com
 */

THREE.ColladaLoader = function () {

	var COLLADA = null;
	var scene = null;
	var daeScene;

	var readyCallbackFunc = null;

 	var sources = {};
	var images = {};
	var animations = {};
	var controllers = {};
	var geometries = {};
	var materials = {};
	var effects = {};

	var visualScenes;
	var baseUrl;
	var morphs;
	var skins;

	var flip_uv = true;
	var preferredShading = THREE.SmoothShading;

	function load ( url, readyCallback ) {

		if ( document.implementation && document.implementation.createDocument ) {

			var namespaceURL = "http://www.collada.org/2005/11/COLLADASchema";
			var rootTagName = "COLLADA";

			var xmldoc = document.implementation.createDocument( namespaceURL, rootTagName, null );
			var me = this;

			// force reloading
			// (should be configurable? sometimes caching is desirable)

			url += "?rnd=" + Math.random();

			var req = new XMLHttpRequest();

			if( req.overrideMimeType ) {

				// need this? yes... if extension is other then *.xml :-S

				req.overrideMimeType( "text/xml" );

			}

			req.onreadystatechange = function() {

				if( req.readyState == 4 ) {

					if( req.status == 0 || req.status == 200 ) {

						readyCallbackFunc = readyCallback;
						parse( req.responseXML, undefined, url );

					}

				}

			}

			req.open( "GET", url, true );
			req.send( null );

		} else {

			alert( "Don't know how to parse XML!" );

		}

	};

	function parse ( doc, callBack, url ) {

		COLLADA = doc;
		callBack = callBack || readyCallbackFunc;

		if ( url !== undefined ) {

			var parts = url.split( '/' );
			parts.pop();
			baseUrl = parts.length < 1 ? '' : parts.join( '/' ) + '/';

		}

		images = parseLib( "//dae:library_images/dae:image", _Image, "image" );
		materials = parseLib( "//dae:library_materials/dae:material", Material, "material") ;
		effects = parseLib( "//dae:library_effects/dae:effect", Effect, "effect" );
		geometries = parseLib( "//dae:library_geometries/dae:geometry", Geometry, "geometry" );
		controllers = parseLib( "//dae:library_controllers/dae:controller", Controller, "controller" );
		animations = parseLib( "//dae:library_animations/dae:animation", Animation, "animation" );
		visualScenes = parseLib( ".//dae:library_visual_scenes/dae:visual_scene", VisualScene, "visual_scene" );

		morphs = [];
		skins = [];

		daeScene = parseScene();
		scene = new THREE.Object3D();

		for ( var i = 0; i < daeScene.nodes.length; i ++ ) {

			scene.add( createSceneGraph( daeScene.nodes[ i ] ) );

		}

		createAnimations();

		var result = {

			scene: scene,
			morphs: morphs,
			skins: skins,
			dae: {
				images: images,
				materials: materials,
				effects: effects,
				geometries: geometries,
				controllers: controllers,
				animations: animations,
				visualScenes: visualScenes,
				scene: daeScene
			}

		};

		if ( callBack ) {

			callBack( result );

		}

		return result;

	};

	function setPreferredShading ( shading ) {

		preferredShading = shading;

	};

	function parseLib ( q, classSpec, prefix ) {

		var elements = COLLADA.evaluate(q,
										COLLADA,
										_nsResolver,
										XPathResult.ORDERED_NODE_ITERATOR_TYPE,
										null) ;

		var lib = {};
		var element = elements.iterateNext();
		var i = 0;

		while ( element ) {

			var daeElement = ( new classSpec() ).parse( element );
			if ( daeElement.id.length == 0 ) daeElement.id = prefix + ( i++ );
			lib[ daeElement.id ] = daeElement;
			element = elements.iterateNext();

		}

		return lib;

	};

	function parseScene () {

		var sceneElement = COLLADA.evaluate( ".//dae:scene/dae:instance_visual_scene",
			COLLADA,
			_nsResolver,
			XPathResult.ORDERED_NODE_ITERATOR_TYPE,
			null ).iterateNext();

		if ( sceneElement ) {

			var url = sceneElement.getAttribute( 'url' ).replace( /^#/, '' );
			return visualScenes[ url ];

		} else {

			return null;

		}

	};

	function createAnimations () {

		calcAnimationBounds();

		for ( var animation_id in animations ) {

			createAnimation( animations[ animation_id ] );

		}

	};

	function createAnimation ( animation ) {

	};

	function calcAnimationBounds () {

		var start = 1000000;
		var end = -start;
		var frames = 0;

		for ( var id in animations ) {

			var animation = animations[ id ];

			for ( var i = 0; i < animation.sampler.length; i ++ ) {

				var sampler = animation.sampler[ i ];
				sampler.create();

				start = Math.min( start, sampler.startTime );
				end = Math.max( end, sampler.endTime );
				frames = Math.max( frames, sampler.input.length );

			}

		}

		return { start:start, end:end, frames:frames };

	};

	function createMorph ( geometry, ctrl ) {

		var morphCtrl = ctrl instanceof InstanceController ? controllers[ ctrl.url ] : ctrl;

		if ( !morphCtrl || !morphCtrl.morph ) {

			console.log("could not find morph controller!");
			return;

		}

		var morph = morphCtrl.morph;

		for ( var i = 0; i < morph.targets.length; i ++ ) {

			var target_id = morph.targets[ i ];
			var daeGeometry = geometries[ target_id ];

			if ( !daeGeometry.mesh ||
				 !daeGeometry.mesh.primitives ||
				 !daeGeometry.mesh.primitives.length ) {
				 continue;
			}

			var target = daeGeometry.mesh.primitives[ 0 ].geometry;

			if ( target.vertices.length === geometry.vertices.length ) {

				geometry.morphTargets.push( { name: "target_1", vertices: target.vertices } );

			}

		}

		geometry.morphTargets.push( { name: "target_Z", vertices: geometry.vertices } );

	};

	function createSkin ( geometry, ctrl, applyBindShape ) {

		var skinCtrl = controllers[ ctrl.url ];

		if ( !skinCtrl || !skinCtrl.skin ) {

			console.log( "could not find skin controller!" );
			return;

		}

		if ( !ctrl.skeleton || !ctrl.skeleton.length ) {

			console.log( "could not find the skeleton for the skin!" );
			return;

		}

		var skin = skinCtrl.skin;
		var skeleton = daeScene.getChildById( ctrl.skeleton[ 0 ] );
		var hierarchy = [];

		applyBindShape = applyBindShape !== undefined ? applyBindShape : true;

		var bones = [];
		geometry.skinWeights = [];
		geometry.skinIndices = [];

		//createBones( geometry.bones, skin, hierarchy, skeleton, null, -1 );
		//createWeights( skin, geometry.bones, geometry.skinIndices, geometry.skinWeights );

		/*
		geometry.animation = {
			name: 'take_001',
			fps: 30,
			length: 2,
			JIT: true,
			hierarchy: hierarchy
		};
		*/

		if ( applyBindShape ) {

			for ( var i = 0; i < geometry.vertices.length; i ++ ) {

				skin.bindShapeMatrix.multiplyVector3( geometry.vertices[ i ].position );

			}

		}

	};

	function setupSkeleton ( node, bones, frame, parent ) {

		node.world = node.world || new THREE.Matrix4();
		node.world.copy( node.matrix );

		if ( node.channels && node.channels.length ) {

			var channel = node.channels[ 0 ];
			var m = channel.sampler.output[ frame ];

			if ( m instanceof THREE.Matrix4 ) {

				node.world.copy( m );

			}

		}

		if ( parent ) {

			node.world.multiply( parent, node.world );

		}

		bones.push( node );

		for ( var i = 0; i < node.nodes.length; i ++ ) {

			setupSkeleton( node.nodes[ i ], bones, frame, node.world );

		}

	};

	function setupSkinningMatrices ( bones, skin ) {

		// FIXME: this is dumb...

		for ( var i = 0; i < bones.length; i ++ ) {

			var bone = bones[ i ];
			var found = -1;

			if ( bone.type != 'JOINT' ) continue;

			for ( var j = 0; j < skin.joints.length; j ++ ) {

				if ( bone.sid == skin.joints[ j ] ) {

					found = j;
					break;

				}

			}

			if ( found >= 0 ) {

				var inv = skin.invBindMatrices[ found ];

				bone.invBindMatrix = inv;
				bone.skinningMatrix = new THREE.Matrix4();
				bone.skinningMatrix.multiply(bone.world, inv); // (IBMi * JMi)

				bone.weights = [];

				for ( var j = 0; j < skin.weights.length; j ++ ) {

					for (var k = 0; k < skin.weights[ j ].length; k ++) {

						var w = skin.weights[ j ][ k ];

						if ( w.joint == found ) {

							bone.weights.push( w );

						}

					}

				}

			} else {

				throw 'ColladaLoader: Could not find joint \'' + bone.sid + '\'.';

			}

		}

	};

	function applySkin ( geometry, instanceCtrl, frame ) {

		var skinController = controllers[ instanceCtrl.url ];

		frame = frame !== undefined ? frame : 40;

		if ( !skinController || !skinController.skin ) {

			console.log( 'ColladaLoader: Could not find skin controller.' );
			return;

		}

		if ( !instanceCtrl.skeleton || !instanceCtrl.skeleton.length ) {

			console.log( 'ColladaLoader: Could not find the skeleton for the skin. ' );
			return;

		}

		var animationBounds = calcAnimationBounds();
		var skeleton = daeScene.getChildById( instanceCtrl.skeleton[0], true ) ||
					   daeScene.getChildBySid( instanceCtrl.skeleton[0], true );

		var i, j, w, vidx, weight;
		var v = new THREE.Vector3(), o, s;

		// move vertices to bind shape

		for ( i = 0; i < geometry.vertices.length; i ++ ) {

			skinController.skin.bindShapeMatrix.multiplyVector3( geometry.vertices[i].position );

		}

		// process animation, or simply pose the rig if no animation

		for ( frame = 0; frame < animationBounds.frames; frame ++ ) {

			var bones = [];
			var skinned = [];

			// zero skinned vertices

			for ( i = 0; i < geometry.vertices.length; i++ ) {

				skinned.push( new THREE.Vertex( new THREE.Vector3() ) );

			}

			// process the frame and setup the rig with a fresh
			// transform, possibly from the bone's animation channel(s)

			setupSkeleton( skeleton, bones, frame );
			setupSkinningMatrices( bones, skinController.skin );

			// skin 'm

			for ( i = 0; i < bones.length; i ++ ) {

				if ( bones[ i ].type != 'JOINT' ) continue;

				for ( j = 0; j < bones[ i ].weights.length; j ++ ) {

					w = bones[ i ].weights[ j ];
					vidx = w.index;
					weight = w.weight;

					o = geometry.vertices[vidx];
					s = skinned[vidx];

					v.x = o.position.x;
					v.y = o.position.y;
					v.z = o.position.z;

					bones[i].skinningMatrix.multiplyVector3(v);

					s.position.x += (v.x * weight);
					s.position.y += (v.y * weight);
					s.position.z += (v.z * weight);

				}

			}

			geometry.morphTargets.push( { name: "target_" + frame, vertices: skinned } );

		}

	};

	function createSceneGraph ( node, parent ) {

		var obj = new THREE.Object3D();
		var skinned = false;
		var skinController;
		var morphController;
		var i, j;

		// FIXME: controllers

		for ( i = 0; i < node.controllers.length; i ++ ) {

			var controller = controllers[ node.controllers[ i ].url ];

			switch ( controller.type ) {

				case 'skin':

					if ( geometries[ controller.skin.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.skin.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						skinned = true;
						skinController = node.controllers[ i ];

					} else if ( controllers[ controller.skin.source ] ) {

						// urgh: controller can be chained
						// handle the most basic case...

						var second = controllers[ controller.skin.source ];
						morphController = second;
					//	skinController = node.controllers[i];

						if ( second.morph && geometries[ second.morph.source ] ) {

							var inst_geom = new InstanceGeometry();

							inst_geom.url = second.morph.source;
							inst_geom.instance_material = node.controllers[ i ].instance_material;

							node.geometries.push( inst_geom );

						}

					}

					break;

				case 'morph':

					if ( geometries[ controller.morph.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.morph.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						morphController = node.controllers[ i ];

					}

					console.log( 'ColladaLoader: Morph-controller partially supported.' );

				default:
					break;

			}

		}

		// FIXME: multi-material mesh?
		// geometries

		for ( i = 0; i < node.geometries.length; i ++ ) {

			var instance_geometry = node.geometries[i];
			var instance_materials = instance_geometry.instance_material;
			var geometry = geometries[instance_geometry.url];
			var used_materials = {};
			var num_materials = 0;
			var first_material;

			if ( geometry ) {

				if ( !geometry.mesh || !geometry.mesh.primitives )
					continue;

				if ( obj.name.length == 0 ) {

					obj.name = geometry.id;

				}

				// collect used fx for this geometry-instance

				if ( instance_materials ) {

					for ( j = 0; j < instance_materials.length; j ++ ) {

						var inst_material = instance_materials[j];
						var effect_id = materials[inst_material.target].instance_effect.url;
						var shader = effects[effect_id].shader;

						shader.material.opacity = !shader.material.opacity ? 1 : shader.material.opacity;
						used_materials[inst_material.symbol] = shader.material;
						first_material = shader.material;
						num_materials ++;

					}

				}

				var mesh;
				var material = first_material || new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } );
				var geom = geometry.mesh.geometry3js;

				if ( num_materials > 1 ) {

					material = new THREE.MeshFaceMaterial();

					for ( j = 0; j < geom.faces.length; j ++ ) {

						var face = geom.faces[ j ];
						face.materials = [ used_materials[ face.daeMaterial ] ];

					}

				}

				if ( skinController !== undefined) {

					applySkin( geom, skinController );

					material.morphTargets = true;

					mesh = new THREE.SkinnedMesh( geom, material );
					mesh.skeleton = skinController.skeleton;
					mesh.skinController = controllers[ skinController.url ];
					mesh.skinInstanceController = skinController;
					mesh.name = 'skin_' + skins.length;

					skins.push( mesh );

				} else if ( morphController !== undefined ) {

					createMorph( geom, morphController );

					material.morphTargets = true;

					mesh = new THREE.Mesh( geom, material );
					mesh.name = 'morph_' + morphs.length;

					morphs.push( mesh );

				} else {

					mesh = new THREE.Mesh( geom, material );
					// mesh.geom.name = geometry.id;

				}

				node.geometries.length > 1 ? obj.add( mesh ) : obj = mesh;

			}

		}

		obj.name = node.id || "";
		node.matrix.decompose( obj.position, obj.rotation, obj.scale );

		for ( i = 0; i < node.nodes.length; i ++ ) {

			obj.add( createSceneGraph( node.nodes[i], node ) );

		}

		return obj;

	};

	function getJointId( skin, id ) {

		for ( var i = 0; i < skin.joints.length; i ++ ) {

			if ( skin.joints[ i ] == id ) {

				return i;

			}

		}

	};

	function getLibraryNode( id ) {

		return COLLADA.evaluate(".//dae:library_nodes//dae:node[@id='"+id+"']",
								COLLADA,
								_nsResolver,
								XPathResult.ORDERED_NODE_ITERATOR_TYPE,
								null).iterateNext();

	};

	function getChannelsForNode (node ) {

		var channels = [];
		var startTime = 1000000;
		var endTime = -1000000;

		for ( var id in animations ) {

			var animation = animations[id];

			for ( var i = 0; i < animation.channel.length; i ++ ) {

				var channel = animation.channel[i];
				var sampler = animation.sampler[i];
				var id = channel.target.split('/')[0];

				if ( id == node.id ) {

					sampler.create();
					channel.sampler = sampler;
					startTime = Math.min(startTime, sampler.startTime);
					endTime = Math.max(endTime, sampler.endTime);
					channels.push(channel);

				}

			}

		}

		if ( channels.length ) {

			node.startTime = startTime;
			node.endTime = endTime;

		}

		return channels;

	};

	function calcFrameDuration( node ) {

		var minT = 10000000;

		for ( var i = 0; i < node.channels.length; i ++ ) {

			var sampler = node.channels[i].sampler;

			for (var j = 0; j < sampler.input.length - 1; j ++ ) {

				var t0 = sampler.input[ j ];
				var t1 = sampler.input[ j + 1 ];
				minT = Math.min( minT, t1 - t0 );

			}
		}

		return minT;

	};

	function calcMatrixAt( node, t ) {

		var animated = {};

		var i, j;

		for ( i = 0; i < node.channels.length; i ++ ) {

			var channel = node.channels[ i ];
			animated[ channel.sid ] = channel;

		}

		var matrix = new THREE.Matrix4();

		for ( i = 0; i < node.transforms.length; i ++ ) {

			var transform = node.transforms[i];
			var channel = animated[transform.sid];

			if ( channel !== undefined ) {

				var sampler = channel.sampler;
				var value;

				for ( var j = 0; j < sampler.input.length - 1; j ++ ) {

					if ( sampler.input[j+1] > t ) {

						value = sampler.output[j];
						//console.log(value.flatten)
						break;

					}

				}

				if ( value !== undefined ) {

					if ( value instanceof THREE.Matrix4 ) {

						matrix = matrix.multiply( matrix, value );

					} else {

						// FIXME: handle other types

						matrix = matrix.multiply( matrix, transform.matrix );

					}

				} else {

					matrix = matrix.multiply( matrix, transform.matrix );

				}

			} else {

				matrix = matrix.multiply( matrix, transform.matrix );

			}

		}

		return matrix;

	};

	function bakeAnimations ( node ) {

		if ( node.channels && node.channels.length ) {

			var frameDuration = calcFrameDuration( node );
			var t, matrix;
			var keys = [];

			for ( t = node.startTime; t < node.endTime; t += frameDuration ) {

				matrix = calcMatrixAt( node, t );

				//keys.push({time: t, mat: matrix.flatten()})

				keys.push({
					time: t,
					pos: [matrix.n14, matrix.n24, matrix.n34],
					rotq: [0, 0, 0, 1],
					scl: [1,1,1]
				});

			}

			node.keys = keys;

		}

	};

	function _Image() {

		this.id = "";
		this.init_from = "";

	};

	_Image.prototype.parse = function(element) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName == 'init_from' ) {

				this.init_from = child.textContent;

			}

		}

		return this;

	};

	function Controller() {

		this.id = "";
		this.name = "";
		this.type = "";
		this.skin = null;
		this.morph = null;

	};

	Controller.prototype.parse = function( element ) {

		this.id = element.getAttribute('id');
		this.name = element.getAttribute('name');
		this.type = "none";

		for ( var i = 0; i < element.childNodes.length; i++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'skin':

					this.skin = (new Skin()).parse(child);
					this.type = child.nodeName;
					break;

				case 'morph':

					this.morph = (new Morph()).parse(child);
					this.type = child.nodeName;
					break;

				default:
					break;

			}
		}

		return this;

	};

	function Morph() {

		this.method = null;
		this.source = null;
		this.targets = null;
		this.weights = null;

	};

	Morph.prototype.parse = function( element ) {

		var sources = {};
		var inputs = [];
		var i;

		this.method = element.getAttribute( 'method' );
		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );

		for ( i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					var source = ( new Source() ).parse( child );
					sources[ source.id ] = source;
					break;

				case 'targets':

					inputs = this.parseInputs( child );
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		for ( i = 0; i < inputs.length; i ++ ) {

			var input = inputs[ i ];
			var source = sources[ input.source ];

			switch ( input.semantic ) {

				case 'MORPH_TARGET':

					this.targets = source.read();
					break;

				case 'MORPH_WEIGHT':

					this.weights = source.read();
					break;

				default:
					break;

			}
		}

		return this;

	};

	Morph.prototype.parseInputs = function(element) {

		var inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( (new Input()).parse(child) );
					break;

				default:
					break;
			}
		}

		return inputs;

	};

	function Skin() {

		this.source = "";
		this.bindShapeMatrix = null;
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

	};

	Skin.prototype.parse = function( element ) {

		var sources = {};
		var joints, weights;

		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'bind_shape_matrix':

					var f = _floats(child.textContent);
					this.bindShapeMatrix = new THREE.Matrix4();
					this.bindShapeMatrix.set(
						f[0], f[1], f[2], f[3],
						f[4], f[5], f[6], f[7],
						f[8], f[9], f[10], f[11],
						f[12], f[13], f[14], f[15]
						);
					break;

				case 'source':

					var src = new Source().parse(child);
					sources[ src.id ] = src;
					break;

				case 'joints':

					joints = child;
					break;

				case 'vertex_weights':

					weights = child;
					break;

				default:

					console.log( child.nodeName );
					break;

			}
		}

		this.parseJoints( joints, sources );
		this.parseWeights( weights, sources );

		return this;

	};

	Skin.prototype.parseJoints = function ( element, sources ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					var input = ( new Input() ).parse( child );
					var source = sources[ input.source ];

					if ( input.semantic == 'JOINT' ) {

						this.joints = source.read();

					} else if ( input.semantic == 'INV_BIND_MATRIX' ) {

						this.invBindMatrices = source.read();

					}

					break;

				default:
					break;
			}

		}

	};

	Skin.prototype.parseWeights = function ( element, sources ) {

		var v, vcount, inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( ( new Input() ).parse( child ) );
					break;

				case 'v':

					v = _ints( child.textContent );
					break;

				case 'vcount':

					vcount = _ints( child.textContent );
					break;

				default:
					break;

			}

		}

		var index = 0;

		for ( var i = 0; i < vcount.length; i ++ ) {

			var numBones = vcount[i];
			var vertex_weights = [];

			for ( var j = 0; j < numBones; j++ ) {

				var influence = {};

				for ( var k = 0; k < inputs.length; k ++ ) {

					var input = inputs[ k ];
					var value = v[ index + input.offset ];

					switch ( input.semantic ) {

						case 'JOINT':

							influence.joint = value;//this.joints[value];
							break;

						case 'WEIGHT':

							influence.weight = sources[ input.source ].data[ value ];
							break;

						default:
							break;

					}

				}

				vertex_weights.push( influence );
				index += inputs.length;
			}

			for ( var j = 0; j < vertex_weights.length; j ++ ) {

				vertex_weights[ j ].index = i;

			}

			this.weights.push( vertex_weights );

		}

	};

	function VisualScene () {

		this.id = "";
		this.name = "";
		this.nodes = [];
		this.scene = new THREE.Object3D();

	};

	VisualScene.prototype.getChildById = function( id, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildById( id, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.getChildBySid = function( sid, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildBySid( sid, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.parse = function( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.nodes = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Node() {

		this.id = "";
		this.name = "";
		this.sid = "";
		this.nodes = [];
		this.controllers = [];
		this.transforms = [];
		this.geometries = [];
		this.channels = [];
		this.matrix = new THREE.Matrix4();

	};

	Node.prototype.getChannelForTransform = function( transformSid ) {

		for ( var i = 0; i < this.channels.length; i ++ ) {

			var channel = this.channels[i];
			var parts = channel.target.split('/');
			var id = parts.shift();
			var sid = parts.shift();
			var dotSyntax = (sid.indexOf(".") >= 0);
			var arrSyntax = (sid.indexOf("(") >= 0);
			var arrIndices;
			var member;

			if ( dotSyntax ) {

				parts = sid.split(".");
				sid = parts.shift();
				member = parts.shift();

			} else if ( arrSyntax ) {

				arrIndices = sid.split("(");
				sid = arrIndices.shift();

				for ( var j = 0; j < arrIndices.length; j ++ ) {

					arrIndices[ j ] = parseInt( arrIndices[ j ].replace( /\)/, '' ) );

				}

			}

			if ( sid == transformSid ) {

				channel.info = { sid: sid, dotSyntax: dotSyntax, arrSyntax: arrSyntax, arrIndices: arrIndices };
				return channel;

			}

		}

		return null;

	};

	Node.prototype.getChildById = function ( id, recursive ) {

		if ( this.id == id ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildById( id, recursive );

				if ( n ) {

					return n;

				}

			}

		}

		return null;

	};

	Node.prototype.getChildBySid = function ( sid, recursive ) {

		if ( this.sid == sid ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildBySid( sid, recursive );

				if ( n ) {

					return n;

				}

			}
		}

		return null;

	};

	Node.prototype.getTransformBySid = function ( sid ) {

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			if ( this.transforms[ i ].sid == sid ) return this.transforms[ i ];

		}

		return null;

	};

	Node.prototype.parse = function( element ) {

		var url;

		this.id = element.getAttribute('id');
		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.type = element.getAttribute('type');

		this.type = this.type == 'JOINT' ? this.type : 'NODE';

		this.nodes = [];
		this.transforms = [];
		this.geometries = [];
		this.controllers = [];
		this.matrix = new THREE.Matrix4();

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				case 'instance_camera':

					break;

				case 'instance_controller':

					this.controllers.push( ( new InstanceController() ).parse( child ) );
					break;

				case 'instance_geometry':

					this.geometries.push( ( new InstanceGeometry() ).parse( child ) );
					break;

				case 'instance_light':

					break;

				case 'instance_node':

					url = child.getAttribute( 'url' ).replace( /^#/, '' );
					var iNode = getLibraryNode( url );

					if ( iNode ) {

						this.nodes.push( ( new Node() ).parse( iNode )) ;

					}

					break;

				case 'rotate':
				case 'translate':
				case 'scale':
				case 'matrix':
				case 'lookat':
				case 'skew':

					this.transforms.push( ( new Transform() ).parse( child ) );
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		this.channels = getChannelsForNode( this );
		bakeAnimations( this );

		this.updateMatrix();

		return this;

	};

	Node.prototype.updateMatrix = function () {

		this.matrix.identity();

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			this.matrix.multiply( this.matrix, this.transforms[ i ].matrix );

		}

	};

	function Transform () {

		this.sid = "";
		this.type = "";
		this.data = [];
		this.matrix = new THREE.Matrix4();

	};

	Transform.prototype.parse = function ( element ) {

		this.sid = element.getAttribute( 'sid' );
		this.type = element.nodeName;
		this.data = _floats( element.textContent );

		this.updateMatrix();

		return this;

	};

	Transform.prototype.updateMatrix = function () {

		var angle = 0;

		this.matrix.identity();

		switch ( this.type ) {

			case 'matrix':

				this.matrix.set(
					this.data[0], this.data[1], this.data[2], this.data[3],
					this.data[4], this.data[5], this.data[6], this.data[7],
					this.data[8], this.data[9], this.data[10], this.data[11],
					this.data[12], this.data[13], this.data[14], this.data[15]
					);
				break;

			case 'translate':

				this.matrix.setTranslation(this.data[0], this.data[1], this.data[2]);
				break;

			case 'rotate':

				angle = this.data[3] * (Math.PI / 180.0);
				this.matrix.setRotationAxis(new THREE.Vector3(this.data[0], this.data[1], this.data[2]), angle);
				break;

			case 'scale':

				this.matrix.setScale(this.data[0], this.data[1], this.data[2]);
				break;

			default:
				break;

		}

		return this.matrix;

	};

	function InstanceController() {

		this.url = "";
		this.skeleton = [];
		this.instance_material = [];

	};

	InstanceController.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.skeleton = [];
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if (child.nodeType != 1) continue;

			switch ( child.nodeName ) {

				case 'skeleton':

					this.skeleton.push( child.textContent.replace(/^#/, '') );
					break;

				case 'bind_material':

					var instances = COLLADA.evaluate(".//dae:instance_material",
														child,
														_nsResolver,
														XPathResult.ORDERED_NODE_ITERATOR_TYPE,
														null);

					if ( instances ) {

						var instance = instances.iterateNext();

						while ( instance ) {

							this.instance_material.push((new InstanceMaterial()).parse(instance));
							instance = instances.iterateNext();

						}

					}

					break;

				case 'extra':
					break;

				default:
					break;

			}
		}

		return this;

	};

	function InstanceMaterial () {

		this.symbol = "";
		this.target = "";

	};

	InstanceMaterial.prototype.parse = function ( element ) {

		this.symbol = element.getAttribute('symbol');
		this.target = element.getAttribute('target').replace(/^#/, '');
		return this;

	};

	function InstanceGeometry() {

		this.url = "";
		this.instance_material = [];

	};

	InstanceGeometry.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			if ( child.nodeName == 'bind_material' ) {

				var instances = COLLADA.evaluate(".//dae:instance_material",
					child,
					_nsResolver,
					XPathResult.ORDERED_NODE_ITERATOR_TYPE,
					null);

				if ( instances ) {

					var instance = instances.iterateNext();

					while ( instance ) {

						this.instance_material.push( (new InstanceMaterial()).parse(instance) );
						instance = instances.iterateNext();

					}

				}

				break;

			}

		}

		return this;

	};

	function Geometry() {

		this.id = "";
		this.mesh = null;

	};

	Geometry.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'mesh':

					this.mesh = (new Mesh(this)).parse(child);
					break;

				case 'extra':

					// console.log( child );
					break;

				default:
					break;
			}
		}

		return this;

	};

	function Mesh( geometry ) {

		this.geometry = geometry.id;
		this.primitives = [];
		this.vertices = null;
		this.geometry3js = null;

	};

	Mesh.prototype.parse = function( element ) {

		this.primitives = [];

		var i, j;

		for ( i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'source':

					_source( child );
					break;

				case 'vertices':

					this.vertices = ( new Vertices() ).parse( child );
					break;

				case 'triangles':

					this.primitives.push( ( new Triangles().parse( child ) ) );
					break;

				case 'polygons':

					console.warn( 'polygon holes not yet supported!' );

				case 'polylist':

					this.primitives.push( ( new Polylist().parse( child ) ) );
					break;

				default:
					break;

			}

		}

		var vertex_store = {};

		function get_vertex ( v, index )  {

			var hash = _hash_vector3( v.position );

			if ( vertex_store[ hash ] === undefined ) {

				vertex_store[ hash ] = { v: v, index: index };

			}

			return vertex_store[ hash ];

		}

		this.geometry3js = new THREE.Geometry();

		var vertexData = sources[ this.vertices.input['POSITION'].source ].data;

		for ( i = 0, j = 0; i < vertexData.length; i += 3, j ++ ) {

			var v = new THREE.Vertex( new THREE.Vector3( vertexData[ i ], vertexData[ i + 1 ], vertexData[ i + 2 ] ) );
			get_vertex( v, j );
			this.geometry3js.vertices.push( v );

		}

		for ( i = 0; i < this.primitives.length; i ++ ) {

			var primitive = this.primitives[ i ];
			primitive.setVertices( this.vertices );
			this.handlePrimitive( primitive, this.geometry3js, vertex_store );

		}

		this.geometry3js.computeCentroids();
		this.geometry3js.computeFaceNormals();
		this.geometry3js.computeVertexNormals();
		this.geometry3js.computeBoundingBox();

		return this;

	};

	Mesh.prototype.handlePrimitive = function( primitive, geom, vertex_store ) {

		var i = 0, j, k, p = primitive.p, inputs = primitive.inputs;
		var input, index, idx32;
		var source, numParams;
		var vcIndex = 0, vcount = 3;
		var texture_sets = [];

		for ( j = 0; j < inputs.length; j ++ ) {

			input = inputs[ j ];

			switch ( input.semantic ) {

				case 'TEXCOORD':
					texture_sets.push( input.set );
					break;

			}

		}

		while ( i < p.length ) {

			var vs = [];
			var ns = [];
			var ts = {};
			var cs = [];

			if ( primitive.vcount ) {

				vcount = primitive.vcount[ vcIndex ++ ];

			}

			for ( j = 0; j < vcount; j ++ ) {

				for ( k = 0; k < inputs.length; k ++ ) {

					input = inputs[ k ];
					source = sources[ input.source ];

					index = p[ i + ( j * inputs.length ) + input.offset ];
					numParams = source.accessor.params.length;
					idx32 = index * numParams;

					switch ( input.semantic ) {

						case 'VERTEX':

							var hash = _hash_vector3( geom.vertices[ index ].position );
							vs.push( vertex_store[ hash ].index );

							break;

						case 'NORMAL':

							ns.push( new THREE.Vector3( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

							break;

						case 'TEXCOORD':

							if ( ts[ input.set ] === undefined ) ts[ input.set ] = [];
							ts[ input.set ].push( new THREE.UV( source.data[ idx32 ], source.data[ idx32 + 1 ] ) );

							break;

						case 'COLOR':

							cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

							break;

						default:
							break;

					}

				}

			}


			var face, uv;

			if ( vcount == 3 ) {

				face = new THREE.Face3( vs[0], vs[1], vs[2], [ ns[0], ns[1], ns[2] ], cs.length ? cs : new THREE.Color() );

			} else if ( vcount == 4 ) {

				face = new THREE.Face4( vs[0], vs[1], vs[2], vs[3], [ ns[0], ns[1], ns[2], ns[3] ], cs.length ? cs : new THREE.Color() );

			}

			face.daeMaterial = primitive.material;
			geom.faces.push( face );

			for ( k = 0; k < texture_sets.length; k ++ ) {

				uv = ts[ texture_sets[ k ] ];
				geom.faceVertexUvs[ k ].push( [ uv[0], uv[1], uv[2] ] );

			}

			i += inputs.length * vcount;

		}

	};


	function Polylist () {
	};

	Polylist.prototype = new Triangles();
	Polylist.prototype.constructor = Polylist;

	function Triangles( flip_uv ) {

		this.material = "";
		this.count = 0;
		this.inputs = [];
		this.vcount = null;
		this.p = [];
		this.geometry = new THREE.Geometry();

	};

	Triangles.prototype.setVertices = function ( vertices ) {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			if ( this.inputs[ i ].source == vertices.id ) {

				this.inputs[ i ].source = vertices.input[ 'POSITION' ].source;

			}

		}

	};

	Triangles.prototype.parse = function ( element ) {

		this.inputs = [];
		this.material = element.getAttribute( 'material' );
		this.count = _attr_as_int( element, 'count', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( ( new Input() ).parse( element.childNodes[ i ] ) );
					break;

				case 'vcount':

					this.vcount = _ints( child.textContent );
					break;

				case 'p':

					this.p = _ints( child.textContent );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Accessor() {

		this.source = "";
		this.count = 0;
		this.stride = 0;
		this.params = [];

	};

	Accessor.prototype.parse = function ( element ) {

		this.params = [];
		this.source = element.getAttribute( 'source' );
		this.count = _attr_as_int( element, 'count', 0 );
		this.stride = _attr_as_int( element, 'stride', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName == 'param' ) {

				var param = {};
				param[ 'name' ] = child.getAttribute( 'name' );
				param[ 'type' ] = child.getAttribute( 'type' );
				this.params.push( param );

			}

		}

		return this;

	};

	function Vertices() {

		this.input = {};

	};

	Vertices.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[i].nodeName == 'input' ) {

				var input = ( new Input() ).parse( element.childNodes[ i ] );
				this.input[ input.semantic ] = input;

			}

		}

		return this;

	};

	function Input () {

		this.semantic = "";
		this.offset = 0;
		this.source = "";
		this.set = 0;

	};

	Input.prototype.parse = function ( element ) {

		this.semantic = element.getAttribute('semantic');
		this.source = element.getAttribute('source').replace(/^#/, '');
		this.set = _attr_as_int(element, 'set', -1);
		this.offset = _attr_as_int(element, 'offset', 0);

		if ( this.semantic == 'TEXCOORD' && this.set < 0 ) {

			this.set = 0;

		}

		return this;

	};

	function Source ( id ) {

		this.id = id;
		this.type = null;

	};

	Source.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'bool_array':

					this.data = _bools( child.textContent );
					this.type = child.nodeName;
					break;

				case 'float_array':

					this.data = _floats( child.textContent );
					this.type = child.nodeName;
					break;

				case 'int_array':

					this.data = _ints( child.textContent );
					this.type = child.nodeName;
					break;

				case 'IDREF_array':
				case 'Name_array':

					this.data = _strings( child.textContent );
					this.type = child.nodeName;
					break;

				case 'technique_common':

					for ( var j = 0; j < child.childNodes.length; j ++ ) {

						if ( child.childNodes[ j ].nodeName == 'accessor' ) {

							this.accessor = ( new Accessor() ).parse( child.childNodes[ j ] );
							break;

						}
					}
					break;

				default:
					// console.log(child.nodeName);
					break;

			}

		}

		return this;

	};

	Source.prototype.read = function () {

		var result = [];

		//for (var i = 0; i < this.accessor.params.length; i++) {

			var param = this.accessor.params[ 0 ];

			//console.log(param.name + " " + param.type);

			switch ( param.type ) {

				case 'IDREF':
				case 'Name': case 'name':
				case 'float':

					return this.data;

				case 'float4x4':

					for ( var j = 0; j < this.data.length; j += 16 ) {

						var s = this.data.slice( j, j + 16 );
						var m = new THREE.Matrix4();
						m.set(
							s[0], s[1], s[2], s[3],
							s[4], s[5], s[6], s[7],
							s[8], s[9], s[10], s[11],
							s[12], s[13], s[14], s[15]
							);
						result.push( m );
					}

					break;

				default:

					console.log( 'ColladaLoader: Source: Read dont know how to read ' + param.type + '.' );
					break;

			}

		//}

		return result;

	};

	function Material () {

		this.id = "";
		this.name = "";
		this.instance_effect = null;

	};

	Material.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[ i ].nodeName == 'instance_effect' ) {

				this.instance_effect = ( new InstanceEffect() ).parse( element.childNodes[ i ] );
				break;

			}

		}

		return this;

	};

	function ColorOrTexture () {

		this.color = new THREE.Color( 0 );
		this.color.setRGB( Math.random(), Math.random(), Math.random() );
		this.color.a = 1.0;

		this.texture = null;
		this.texcoord = null;

	};

	ColorOrTexture.prototype.isColor = function () {

		return ( this.texture == null );

	};

	ColorOrTexture.prototype.isTexture = function () {

		return ( this.texture != null );

	};

	ColorOrTexture.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'color':

					var rgba = _floats( child.textContent );
					this.color = new THREE.Color(0);
					this.color.setRGB( rgba[0], rgba[1], rgba[2] );
					this.color.a = rgba[3];
					break;

				case 'texture':

					this.texture = child.getAttribute('texture');
					this.texcoord = child.getAttribute('texcoord');
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Shader ( type, effect ) {

		this.type = type;
		this.effect = effect;
		this.material = null;

	};

	Shader.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'ambient':
				case 'emission':
				case 'diffuse':
				case 'specular':
				case 'transparent':

					this[ child.nodeName ] = ( new ColorOrTexture() ).parse( child );
					break;

				case 'shininess':
				case 'reflectivity':
				case 'transparency':

					var f = evaluateXPath( child, ".//dae:float" );

					if ( f.length > 0 )
						this[ child.nodeName ] = parseFloat( f[ 0 ].textContent );

					break;

				default:
					break;

			}

		}

		this.create();
		return this;

	};

	Shader.prototype.create = function() {

		var props = {};
		var transparent = ( this['transparency'] !== undefined && this['transparency'] < 1.0 );

		for ( var prop in this ) {

			switch ( prop ) {

				case 'ambient':
				case 'emission':
				case 'diffuse':
				case 'specular':

					var cot = this[prop];

					if ( cot instanceof ColorOrTexture ) {

						if ( cot.isTexture() ) {

							if ( this.effect.sampler && this.effect.surface ) {

								if ( this.effect.sampler.source == this.effect.surface.sid ) {

									var image = images[this.effect.surface.init_from];

									if ( image ) {

										props['map'] = THREE.ImageUtils.loadTexture(baseUrl + image.init_from);
										props['map'].wrapS = THREE.RepeatWrapping;
										props['map'].wrapT = THREE.RepeatWrapping;
										props['map'].repeat.x = 1;
										props['map'].repeat.y = -1;

									}

								}

							}

						} else {

							if ( prop == 'diffuse' ) {

								props[ 'color' ] = cot.color.getHex();

							} else if ( !transparent ) {

								props[ prop ] = cot.color.getHex();

							}

						}

					}

					break;

				case 'shininess':
				case 'reflectivity':

					props[ prop ] = this[ prop ];
					break;

				case 'transparency':

					if ( transparent ) {

						props[ 'transparent' ] = true;
						props[ 'opacity' ] = this[ prop ];
						transparent = true;

					}

					break;

				default:
					break;

			}

		}

		props[ 'shading' ] = preferredShading;
		this.material = new THREE.MeshLambertMaterial( props );

		switch ( this.type ) {

			case 'constant':
			case 'lambert':
				break;

			case 'phong':
			case 'blinn':

			default:

				/*
				if ( !transparent ) {

				//	this.material = new THREE.MeshPhongMaterial(props);

				}
				*/

				break;

		}

		return this.material;

	};

	function Surface ( effect ) {

		this.effect = effect;
		this.init_from = null;
		this.format = null;

	};

	Surface.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'init_from':

					this.init_from = child.textContent;
					break;

				case 'format':

					this.format = child.textContent;
					break;

				default:

					console.log( "unhandled Surface prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Sampler2D ( effect ) {

		this.effect = effect;
		this.source = null;
		this.wrap_s = null;
		this.wrap_t = null;
		this.minfilter = null;
		this.magfilter = null;
		this.mipfilter = null;

	};

	Sampler2D.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					this.source = child.textContent;
					break;

				case 'minfilter':

					this.minfilter = child.textContent;
					break;

				case 'magfilter':

					this.magfilter = child.textContent;
					break;

				case 'mipfilter':

					this.mipfilter = child.textContent;
					break;

				case 'wrap_s':

					this.wrap_s = child.textContent;
					break;

				case 'wrap_t':

					this.wrap_t = child.textContent;
					break;

				default:

					console.log( "unhandled Sampler2D prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Effect () {

		this.id = "";
		this.name = "";
		this.shader = null;
		this.surface = null;
		this.sampler = null;

	};

	Effect.prototype.create = function () {

		if ( this.shader == null ) {

			return null;

		}

	};

	Effect.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.shader = null;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseTechnique( this.parseProfileCOMMON( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Effect.prototype.parseNewparam = function ( element ) {

		var sid = element.getAttribute( 'sid' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'surface':

					this.surface = ( new Surface( this ) ).parse( child );
					this.surface.sid = sid;
					break;

				case 'sampler2D':

					this.sampler = ( new Sampler2D( this ) ).parse( child );
					this.sampler.sid = sid;
					break;

				case 'extra':

					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

	};

	Effect.prototype.parseProfileCOMMON = function ( element ) {

		var technique;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseProfileCOMMON( child );
					break;

				case 'technique':

					technique = child;
					break;

				case 'newparam':

					this.parseNewparam( child );
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		return technique;

	};

	Effect.prototype.parseTechnique= function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'lambert':
				case 'blinn':
				case 'phong':

					this.shader = ( new Shader( child.nodeName, this ) ).parse( child );
					break;

				default:
					break;

			}

		}

	};

	function InstanceEffect () {

		this.url = "";

	};

	InstanceEffect.prototype.parse = function ( element ) {

		this.url = element.getAttribute( 'url' ).replace( /^#/, '' );
		return this;

	};

	function Animation() {

		this.id = "";
		this.name = "";
		this.source = {};
		this.sampler = [];
		this.channel = [];

	};

	Animation.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.source = {};

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					var src = ( new Source() ).parse( child );
					this.source[ src.id ] = src;
					break;

				case 'sampler':

					this.sampler.push( ( new Sampler( this ) ).parse( child ) );
					break;

				case 'channel':

					this.channel.push( ( new Channel( this ) ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Channel( animation ) {

		this.animation = animation;
		this.source = "";
		this.target = "";
		this.sid = null;
		this.dotSyntax = null;
		this.arrSyntax = null;
		this.arrIndices = null;
		this.member = null;

	};

	Channel.prototype.parse = function ( element ) {

		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.target = element.getAttribute( 'target' );

		var parts = this.target.split( '/' );

		var id = parts.shift();
		var sid = parts.shift();

		var dotSyntax = ( sid.indexOf(".") >= 0 );
		var arrSyntax = ( sid.indexOf("(") >= 0 );

		var arrIndices;
		var member;

		if ( dotSyntax ) {

			parts = sid.split(".");
			sid = parts.shift();
			member = parts.shift();

		} else if ( arrSyntax ) {

			arrIndices = sid.split("(");
			sid = arrIndices.shift();

			for (var j = 0; j < arrIndices.length; j ++ ) {

				arrIndices[j] = parseInt( arrIndices[j].replace(/\)/, '') );

			}

		}

		this.sid = sid;
		this.dotSyntax = dotSyntax;
		this.arrSyntax = arrSyntax;
		this.arrIndices = arrIndices;
		this.member = member;

		return this;

	};

	function Sampler ( animation ) {

		this.id = "";
		this.animation = animation;
		this.inputs = [];
		this.input = null;
		this.output = null;
		this.interpolation = null;
		this.startTime = null;
		this.endTime = null;
		this.duration = 0;

	};

	Sampler.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( (new Input()).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Sampler.prototype.create = function () {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			var input = this.inputs[ i ];
			var source = this.animation.source[ input.source ];

			switch ( input.semantic ) {

				case 'INPUT':

					this.input = source.read();
					break;

				case 'OUTPUT':

					this.output = source.read();
					break;

				case 'INTERPOLATION':

					this.interpolation = source.read();
					break;

				case 'IN_TANGENT':

					break;

				case 'OUT_TANGENT':

					break;

				default:

					console.log(input.semantic);
					break;

			}

		}

		this.startTime = 0;
		this.endTime = 0;
		this.duration = 0;

		if ( this.input.length ) {

			this.startTime = 100000000;
			this.endTime = -100000000;

			for ( var i = 0; i < this.input.length; i ++ ) {

				this.startTime = Math.min( this.startTime, this.input[ i ] );
				this.endTime = Math.max( this.endTime, this.input[ i ] );

			}

			this.duration = this.endTime - this.startTime;

		}

	};

	function _source ( element ) {

		var id = element.getAttribute( 'id' );

		if ( sources[ id ] != undefined ) {

			return sources[ id ];

		}

		sources[ id ] = ( new Source(id )).parse( element );
		return sources[ id ];

	};

	function _nsResolver ( nsPrefix ) {

		if ( nsPrefix == "dae" ) {

			return "http://www.collada.org/2005/11/COLLADASchema";

		}

		return null;

	};

	function _bools ( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0; i < raw.length; i ++ ) {

			data.push( (raw[i] == 'true' || raw[i] == '1') ? true : false );

		}

		return data;

	};

	function _floats ( str ) {

		var raw = _strings(str);
		var data = [];

		for ( var i = 0; i < raw.length; i ++ ) {

			data.push( parseFloat( raw[ i ] ) );

		}

		return data;

	};

	function _ints ( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0; i < raw.length; i ++ ) {

			data.push( parseInt( raw[ i ], 10 ) );

		}

		return data;

	};

	function _strings ( str ) {

		return _trimString( str ).split( /\s+/ );

	};

	function _trimString ( str ) {

		return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );

	};

	function _attr_as_float ( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseFloat( element.getAttribute( name ) );

		} else {

			return defaultValue;

		}

	};

	function _attr_as_int ( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseInt( element.getAttribute( name ), 10) ;

		} else {

			return defaultValue;

		}

	};

	function _attr_as_string ( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return element.getAttribute( name );

		} else {

			return defaultValue;

		}

	};

	function _format_float ( f, num ) {

		if ( f === undefined ) {

			var s = '0.';

			while ( s.length < num + 2 ) {

				s += '0';

			}

			return s;

		}

		num = num || 2;

		var parts = f.toString().split( '.' );
		parts[ 1 ] = parts.length > 1 ? parts[ 1 ].substr( 0, num ) : "0";

		while( parts[ 1 ].length < num ) {

			parts[ 1 ] += '0';

		}

		return parts.join( '.' );

	};

	function _hash_vertex ( v, n, t0, t1, precision ) {

		precision = precision || 2;

		var s = v instanceof THREE.Vertex ? _hash_vector3( v.position, precision ) : _hash_vector3( v, precision );

		if ( n === undefined ) {

			s += '_0.00,0.00,0.00';

		} else {

			s += '_' + _hash_vector3( n, precision );

		}

		if ( t0 === undefined ) {

			s += '_0.00,0.00';

		} else {

			s += '_' + _hash_uv( t0, precision );

		}

		if ( t1 === undefined ) {

			s += '_0.00,0.00';

		} else {

			s += '_' + _hash_uv( t1, precision );

		}

		return s;

	};

	function _hash_uv ( uv, num ) {

		var s = '';

		s += _format_float( uv.u, num ) + ',';
		s += _format_float( uv.v, num );

		return s;

	};

	function _hash_vector3 ( vec, num ) {

		var s = '';

		s += _format_float( vec.x, num ) + ',';
		s += _format_float( vec.y, num ) + ',';
		s += _format_float( vec.z, num );

		return s;

	};

	function evaluateXPath ( node, query ) {

		var instances = COLLADA.evaluate(query,
			node,
			_nsResolver,
			XPathResult.ORDERED_NODE_ITERATOR_TYPE,
			null);

		var inst = instances.iterateNext();
		var result = [];

		while ( inst ) {

			result.push( inst );
			inst = instances.iterateNext();

		}

		return result;

	};

	return {

		load: load,
		parse: parse,
		setPreferredShading: setPreferredShading,
		applySkin: applySkin,
		geometries : geometries

	};

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.JSONLoader.prototype = new THREE.Loader();
THREE.JSONLoader.prototype.constructor = THREE.JSONLoader;
THREE.JSONLoader.prototype.supr = THREE.Loader.prototype;

THREE.JSONLoader.prototype.load = function ( url, callback, texturePath ) {

	var worker, scope = this;

	if ( url instanceof Object ) {

		console.warn( 'DEPRECATED: JSONLoader( parameters ) is now JSONLoader( url, callback, texturePath ).' );

		var parameters = url;

		url = parameters.model;
		callback = parameters.callback;
		texturePath = parameters.texture_path;

	}

	texturePath = texturePath ? texturePath : this.extractUrlbase( url ),

	this.onLoadStart();
	this.loadAjaxJSON( this, url, callback, texturePath );

};

THREE.JSONLoader.prototype.loadAjaxJSON = function( context, url, callback, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	var length = 0;

	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				try {

					var jsonObject = JSON.parse( xhr.responseText );

					context.createModel( jsonObject, callback, texturePath );
					context.onLoadComplete();

				} catch ( error ) {

					console.error( error );
					console.warn( "DEPRECATED: [" + url + "] seems to be using old model format" );

				}

			} else {

				console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState == 3 ) {

			if ( callbackProgress ) {

				if ( length == 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState == 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	};

	xhr.open( "GET", url, true );
	xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	xhr.setRequestHeader( "Content-Type", "text/plain" );
	xhr.send( null );

};

THREE.JSONLoader.prototype.createModel = function ( json, callback, texture_path ) {

	var scope = this,
	geometry = new THREE.Geometry(),
	scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

	this.initMaterials( geometry, json.materials, texture_path );

	parseModel( scale );

	parseSkin();
	parseMorphing( scale );

	geometry.computeCentroids();
	geometry.computeFaceNormals();

	if ( this.hasNormals( geometry ) ) geometry.computeTangents();


	function parseModel( scale ) {

		if ( json.metadata === undefined || json.metadata.formatVersion === undefined || json.metadata.formatVersion !== 3 ) {

			console.error( 'Deprecated file format.' );
			return;

		}

		function isBitSet( value, position ) {

			return value & ( 1 << position );

		};

		var i, j, fi,

		offset, zLength, nVertices,

		colorIndex, normalIndex, uvIndex, materialIndex,

		type,
		isQuad,
		hasMaterial,
		hasFaceUv, hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor,

		vertex, face, color, normal,

		uvLayer, uvs, u, v,

		faces = json.faces,
		vertices = json.vertices,
		normals = json.normals,
		colors = json.colors,

		nUvLayers = 0;

		// disregard empty arrays

		for ( i = 0; i < json.uvs.length; i++ ) {

			if ( json.uvs[ i ].length ) nUvLayers ++;

		}

		for ( i = 0; i < nUvLayers; i++ ) {

			geometry.faceUvs[ i ] = [];
			geometry.faceVertexUvs[ i ] = [];

		}

		offset = 0;
		zLength = vertices.length;

		while ( offset < zLength ) {

			vertex = new THREE.Vertex();

			vertex.position.x = vertices[ offset ++ ] * scale;
			vertex.position.y = vertices[ offset ++ ] * scale;
			vertex.position.z = vertices[ offset ++ ] * scale;

			geometry.vertices.push( vertex );

		}

		offset = 0;
		zLength = faces.length;

		while ( offset < zLength ) {

			type = faces[ offset ++ ];


			isQuad          	= isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceUv           = isBitSet( type, 2 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	    = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );

			//console.log("type", type, "bits", isQuad, hasMaterial, hasFaceUv, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

			if ( isQuad ) {

				face = new THREE.Face4();

				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];
				face.d = faces[ offset ++ ];

				nVertices = 4;

			} else {

				face = new THREE.Face3();

				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];

				nVertices = 3;

			}

			if ( hasMaterial ) {

				materialIndex = faces[ offset ++ ];
				face.materialIndex = materialIndex;

			}

			// to get face <=> uv index correspondence

			fi = geometry.faces.length;

			if ( hasFaceUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvIndex = faces[ offset ++ ];

					u = uvLayer[ uvIndex * 2 ];
					v = uvLayer[ uvIndex * 2 + 1 ];

					geometry.faceUvs[ i ][ fi ] = new THREE.UV( u, v );

				}

			}

			if ( hasFaceVertexUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvs = [];

					for ( j = 0; j < nVertices; j ++ ) {

						uvIndex = faces[ offset ++ ];

						u = uvLayer[ uvIndex * 2 ];
						v = uvLayer[ uvIndex * 2 + 1 ];

						uvs[ j ] = new THREE.UV( u, v );

					}

					geometry.faceVertexUvs[ i ][ fi ] = uvs;

				}

			}

			if ( hasFaceNormal ) {

				normalIndex = faces[ offset ++ ] * 3;

				normal = new THREE.Vector3();

				normal.x = normals[ normalIndex ++ ];
				normal.y = normals[ normalIndex ++ ];
				normal.z = normals[ normalIndex ];

				face.normal = normal;

			}

			if ( hasFaceVertexNormal ) {

				for ( i = 0; i < nVertices; i++ ) {

					normalIndex = faces[ offset ++ ] * 3;

					normal = new THREE.Vector3();

					normal.x = normals[ normalIndex ++ ];
					normal.y = normals[ normalIndex ++ ];
					normal.z = normals[ normalIndex ];

					face.vertexNormals.push( normal );

				}

			}


			if ( hasFaceColor ) {

				colorIndex = faces[ offset ++ ];

				color = new THREE.Color( colors[ colorIndex ] );
				face.color = color;

			}


			if ( hasFaceVertexColor ) {

				for ( i = 0; i < nVertices; i++ ) {

					colorIndex = faces[ offset ++ ];

					color = new THREE.Color( colors[ colorIndex ] );
					face.vertexColors.push( color );

				}

			}

			geometry.faces.push( face );

		}

	};

	function parseSkin() {

		var i, l, x, y, z, w, a, b, c, d;

		if ( json.skinWeights ) {

			for ( i = 0, l = json.skinWeights.length; i < l; i += 2 ) {

				x = json.skinWeights[ i     ];
				y = json.skinWeights[ i + 1 ];
				z = 0;
				w = 0;

				geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

			}

		}

		if ( json.skinIndices ) {

			for ( i = 0, l = json.skinIndices.length; i < l; i += 2 ) {

				a = json.skinIndices[ i     ];
				b = json.skinIndices[ i + 1 ];
				c = 0;
				d = 0;

				geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

			}

		}

		geometry.bones = json.bones;
		geometry.animation = json.animation;

	};

	function parseMorphing( scale ) {

		if ( json.morphTargets !== undefined ) {

			var i, l, v, vl, x, y, z, dstVertices, srcVertices;

			for ( i = 0, l = json.morphTargets.length; i < l; i++ ) {

				geometry.morphTargets[ i ] = {};
				geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
				geometry.morphTargets[ i ].vertices = [];

				dstVertices = geometry.morphTargets[ i ].vertices;
				srcVertices = json.morphTargets [ i ].vertices;

				for( v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

					x = srcVertices[ v ] * scale;
					y = srcVertices[ v + 1 ] * scale;
					z = srcVertices[ v + 2 ] * scale;

					dstVertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

				}

			}

		}

		if ( json.morphColors !== undefined ) {

			var i, l, c, cl, dstColors, srcColors, color;

			for ( i = 0, l = json.morphColors.length; i < l; i++ ) {

				geometry.morphColors[ i ] = {};
				geometry.morphColors[ i ].name = json.morphColors[ i ].name;
				geometry.morphColors[ i ].colors = [];

				dstColors = geometry.morphColors[ i ].colors;
				srcColors = json.morphColors [ i ].colors;

				for ( c = 0, cl = srcColors.length; c < cl; c += 3 ) {

					color = new THREE.Color( 0xffaa00 );
					color.setRGB( srcColors[ c ], srcColors[ c + 1 ], srcColors[ c + 2 ] );
					dstColors.push( color );

				}

			}

		}

	};

	callback( geometry );

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneLoader = function () {

	this.onLoadStart = function () {};
	this.onLoadProgress = function() {};
	this.onLoadComplete = function () {};

	this.callbackSync = function () {};
	this.callbackProgress = function () {};

};

THREE.SceneLoader.prototype.constructor = THREE.SceneLoader;

THREE.SceneLoader.prototype.load = function( url, callbackFinished ) {

	var context = this;

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				try {

					var json = JSON.parse( xhr.responseText );

					if ( json.metadata === undefined || json.metadata.formatVersion === undefined || json.metadata.formatVersion !== 3 ) {

						console.error( 'Deprecated file format.' );
						return;

					}

					context.createScene( json, callbackFinished, url );

				} catch ( error ) {

					console.error( error );
					console.warn( "DEPRECATED: [" + url + "] seems to be using old model format" );

				}

			} else {

				console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		}

	};

	xhr.open( "GET", url, true );
	xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	xhr.setRequestHeader( "Content-Type", "text/plain" );
	xhr.send( null );

};

THREE.SceneLoader.prototype.createScene = function ( json, callbackFinished, url ) {

	var scope = this;

	var urlBase = THREE.Loader.prototype.extractUrlbase( url );

	var dg, dm, dd, dl, dc, df, dt,
		g, o, m, l, d, p, r, q, s, c, t, f, tt, pp,
		geometry, material, camera, fog,
		texture, images,
		materials, light,
		data, binLoader, jsonLoader,
		counter_models, counter_textures,
		total_models, total_textures,
		result;

	data = json;

	binLoader = new THREE.BinaryLoader();
	jsonLoader = new THREE.JSONLoader();

	counter_models = 0;
	counter_textures = 0;

	result = {

		scene: new THREE.Scene(),
		geometries: {},
		materials: {},
		textures: {},
		objects: {},
		cameras: {},
		lights: {},
		fogs: {},
		triggers: {},
		empties: {}

	};

	// find out if there are some colliders

	var hasColliders = false;

	for( dd in data.objects ) {

		o = data.objects[ dd ];

		if ( o.meshCollider )  {

			hasColliders = true;
			break;

		}

	}

	if ( hasColliders ) {

		result.scene.collisions = new THREE.CollisionSystem();

	}

	if ( data.transform ) {

		var position = data.transform.position,
			rotation = data.transform.rotation,
			scale = data.transform.scale;

		if ( position )
			result.scene.position.set( position[ 0 ], position[ 1 ], position [ 2 ] );

		if ( rotation )
			result.scene.rotation.set( rotation[ 0 ], rotation[ 1 ], rotation [ 2 ] );

		if ( scale )
			result.scene.scale.set( scale[ 0 ], scale[ 1 ], scale [ 2 ] );

		if ( position || rotation || scale )
			result.scene.updateMatrix();

	}

	function get_url( source_url, url_type ) {

		if ( url_type == "relativeToHTML" ) {

			return source_url;

		} else {

			return urlBase + "/" + source_url;

		}

	};

	function handle_objects() {

		var object;

		for( dd in data.objects ) {

			if ( !result.objects[ dd ] ) {

				o = data.objects[ dd ];

				if ( o.geometry !== undefined ) {

					geometry = result.geometries[ o.geometry ];

					// geometry already loaded

					if ( geometry ) {

						var hasNormals = false;

						// not anymore support for multiple materials
						// shouldn't really be array

						for( i = 0; i < o.materials.length; i ++ ) {

							materials = result.materials[ o.materials[ i ] ];

							hasNormals = materials instanceof THREE.ShaderMaterial;

						}

						if ( hasNormals ) {

							geometry.computeTangents();

						}

						p = o.position;
						r = o.rotation;
						q = o.quaternion;
						s = o.scale;

						// turn off quaternions, for the moment

						q = 0;

						if ( materials.length == 0 ) {

							materials = new THREE.MeshFaceMaterial();

						}

						// dirty hack to handle meshes with multiple materials
						// just use face materials defined in model

						if ( materials.length > 1 ) {

							materials = new THREE.MeshFaceMaterial();

						}

						object = new THREE.Mesh( geometry, materials );
						object.name = dd;
						object.position.set( p[0], p[1], p[2] );

						if ( q ) {

							object.quaternion.set( q[0], q[1], q[2], q[3] );
							object.useQuaternion = true;

						} else {

							object.rotation.set( r[0], r[1], r[2] );

						}

						object.scale.set( s[0], s[1], s[2] );
						object.visible = o.visible;

						result.scene.add( object );

						result.objects[ dd ] = object;

						if ( o.meshCollider ) {

							var meshCollider = THREE.CollisionUtils.MeshColliderWBox( object );
							result.scene.collisions.colliders.push( meshCollider );

						}

						if ( o.castsShadow ) {

							//object.visible = true;
							//object.materials = [ new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ];

							var shadow = new THREE.ShadowVolume( geometry )
							result.scene.add( shadow );

							shadow.position = object.position;
							shadow.rotation = object.rotation;
							shadow.scale = object.scale;

						}

						if ( o.trigger && o.trigger.toLowerCase() != "none" ) {

							var trigger = {
							"type" 		: o.trigger,
							"object"	: o
							};

							result.triggers[ object.name ] = trigger;

						}

					}

				// pure Object3D

				} else {

					p = o.position;
					r = o.rotation;
					q = o.quaternion;
					s = o.scale;

					// turn off quaternions, for the moment

					q = 0;

					object = new THREE.Object3D();
					object.name = dd;
					object.position.set( p[0], p[1], p[2] );

					if ( q ) {

						object.quaternion.set( q[0], q[1], q[2], q[3] );
						object.useQuaternion = true;

					} else {

						object.rotation.set( r[0], r[1], r[2] );

					}

					object.scale.set( s[0], s[1], s[2] );
					object.visible = ( o.visible !== undefined ) ? o.visible : false;

					result.scene.add( object );

					result.objects[ dd ] = object;
					result.empties[ dd ] = object;

					if ( o.trigger && o.trigger.toLowerCase() != "none" ) {

						var trigger = {
						"type" 		: o.trigger,
						"object"	: o
						};

						result.triggers[ object.name ] = trigger;

					}

				}

			}

		}

	};

	function handle_mesh( geo, id ) {

		result.geometries[ id ] = geo;
		handle_objects();

	};

	function create_callback( id ) {

		return function( geo ) {

			handle_mesh( geo, id );

			counter_models -= 1;

			scope.onLoadComplete();

			async_callback_gate();

		}

	};

	function create_callback_embed( id ) {

		return function( geo ) {

			result.geometries[ id ] = geo;

		}

	};

	function async_callback_gate() {

		var progress = {

			totalModels		: total_models,
			totalTextures	: total_textures,
			loadedModels	: total_models - counter_models,
			loadedTextures	: total_textures - counter_textures

		};

		scope.callbackProgress( progress, result );

		scope.onLoadProgress();

		if( counter_models == 0 && counter_textures == 0 ) {

			callbackFinished( result );

		}

	};

	var callbackTexture = function( images ) {

		counter_textures -= 1;
		async_callback_gate();

		scope.onLoadComplete();

	};

	// first go synchronous elements

	// cameras

	for( dc in data.cameras ) {

		c = data.cameras[ dc ];

		if ( c.type == "perspective" ) {

			camera = new THREE.PerspectiveCamera( c.fov, c.aspect, c.near, c.far );

		} else if ( c.type == "ortho" ) {

			camera = new THREE.OrthographicCamera( c.left, c.right, c.top, c.bottom, c.near, c.far );

		}

		p = c.position;
		t = c.target;
		camera.position.set( p[0], p[1], p[2] );
		camera.target = new THREE.Vector3( t[0], t[1], t[2] );

		result.cameras[ dc ] = camera;

	}

	// lights

	var hex, intensity;

	for ( dl in data.lights ) {

		l = data.lights[ dl ];

		hex = ( l.color !== undefined ) ? l.color : 0xffffff;
		intensity = ( l.intensity !== undefined ) ? l.intensity : 1;

		if ( l.type == "directional" ) {

			p = l.direction;

			light = new THREE.DirectionalLight( hex, intensity );
			light.position.set( p[0], p[1], p[2] );
			light.position.normalize();

		} else if ( l.type == "point" ) {

			p = l.position;
			d = l.distance;

			light = new THREE.PointLight( hex, intensity, d );
			light.position.set( p[0], p[1], p[2] );

		} else if ( l.type == "ambient" ) {

			light = new THREE.AmbientLight( hex );

		}

		result.scene.add( light );

		result.lights[ dl ] = light;

	}

	// fogs

	for( df in data.fogs ) {

		f = data.fogs[ df ];

		if ( f.type == "linear" ) {

			fog = new THREE.Fog( 0x000000, f.near, f.far );

		} else if ( f.type == "exp2" ) {

			fog = new THREE.FogExp2( 0x000000, f.density );

		}

		c = f.color;
		fog.color.setRGB( c[0], c[1], c[2] );

		result.fogs[ df ] = fog;

	}

	// defaults

	if ( result.cameras && data.defaults.camera ) {

		result.currentCamera = result.cameras[ data.defaults.camera ];

	}

	if ( result.fogs && data.defaults.fog ) {

		result.scene.fog = result.fogs[ data.defaults.fog ];

	}

	c = data.defaults.bgcolor;
	result.bgColor = new THREE.Color();
	result.bgColor.setRGB( c[0], c[1], c[2] );

	result.bgColorAlpha = data.defaults.bgalpha;

	// now come potentially asynchronous elements

	// geometries

	// count how many models will be loaded asynchronously

	for( dg in data.geometries ) {

		g = data.geometries[ dg ];

		if ( g.type == "bin_mesh" || g.type == "ascii_mesh" ) {

			counter_models += 1;

			scope.onLoadStart();

		}

	}

	total_models = counter_models;

	for ( dg in data.geometries ) {

		g = data.geometries[ dg ];

		if ( g.type == "cube" ) {

			geometry = new THREE.CubeGeometry( g.width, g.height, g.depth, g.segmentsWidth, g.segmentsHeight, g.segmentsDepth, null, g.flipped, g.sides );
			result.geometries[ dg ] = geometry;

		} else if ( g.type == "plane" ) {

			geometry = new THREE.PlaneGeometry( g.width, g.height, g.segmentsWidth, g.segmentsHeight );
			result.geometries[ dg ] = geometry;

		} else if ( g.type == "sphere" ) {

			geometry = new THREE.SphereGeometry( g.radius, g.segmentsWidth, g.segmentsHeight );
			result.geometries[ dg ] = geometry;

		} else if ( g.type == "cylinder" ) {

			geometry = new THREE.CylinderGeometry( g.topRad, g.botRad, g.height, g.radSegs, g.heightSegs );
			result.geometries[ dg ] = geometry;

		} else if ( g.type == "torus" ) {

			geometry = new THREE.TorusGeometry( g.radius, g.tube, g.segmentsR, g.segmentsT );
			result.geometries[ dg ] = geometry;

		} else if ( g.type == "icosahedron" ) {

			geometry = new THREE.IcosahedronGeometry( g.subdivisions );
			result.geometries[ dg ] = geometry;

		} else if ( g.type == "bin_mesh" ) {

			binLoader.load( get_url( g.url, data.urlBaseType ), create_callback( dg ) );

		} else if ( g.type == "ascii_mesh" ) {

			jsonLoader.load( get_url( g.url, data.urlBaseType ), create_callback( dg ) );

		} else if ( g.type == "embedded_mesh" ) {

			var modelJson = data.embeds[ g.id ],
				texture_path = "";

			if ( modelJson ) {

				jsonLoader.createModel( modelJson, create_callback_embed( dg ), texture_path );

			}

		}

	}

	// textures

	// count how many textures will be loaded asynchronously

	for( dt in data.textures ) {

		tt = data.textures[ dt ];

		if( tt.url instanceof Array ) {

			counter_textures += tt.url.length;

			for( var n = 0; n < tt.url.length; n ++ ) {

				scope.onLoadStart();

			}

		} else {

			counter_textures += 1;

			scope.onLoadStart();

		}

	}

	total_textures = counter_textures;

	for( dt in data.textures ) {

		tt = data.textures[ dt ];

		if ( tt.mapping != undefined && THREE[ tt.mapping ] != undefined  ) {

			tt.mapping = new THREE[ tt.mapping ]();

		}

		if( tt.url instanceof Array ) {

			var url_array = [];

			for( var i = 0; i < tt.url.length; i ++ ) {

				url_array[ i ] = get_url( tt.url[ i ], data.urlBaseType );

			}

			texture = THREE.ImageUtils.loadTextureCube( url_array, tt.mapping, callbackTexture );

		} else {

			texture = THREE.ImageUtils.loadTexture( get_url( tt.url, data.urlBaseType ), tt.mapping, callbackTexture );

			if ( THREE[ tt.minFilter ] != undefined )
				texture.minFilter = THREE[ tt.minFilter ];

			if ( THREE[ tt.magFilter ] != undefined )
				texture.magFilter = THREE[ tt.magFilter ];


			if ( tt.repeat ) {

				texture.repeat.set( tt.repeat[ 0 ], tt.repeat[ 1 ] );

				if ( tt.repeat[ 0 ] != 1 ) texture.wrapS = THREE.RepeatWrapping;
				if ( tt.repeat[ 1 ] != 1 ) texture.wrapT = THREE.RepeatWrapping;

			}

			if ( tt.offset ) {

				texture.offset.set( tt.offset[ 0 ], tt.offset[ 1 ] );

			}

			// handle wrap after repeat so that default repeat can be overriden

			if ( tt.wrap ) {

				var wrapMap = {
				"repeat" 	: THREE.RepeatWrapping,
				"mirror"	: THREE.MirroredRepeatWrapping
				}

				if ( wrapMap[ tt.wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ tt.wrap[ 0 ] ];
				if ( wrapMap[ tt.wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ tt.wrap[ 1 ] ];

			}

		}

		result.textures[ dt ] = texture;

	}

	// materials

	for ( dm in data.materials ) {

		m = data.materials[ dm ];

		for ( pp in m.parameters ) {

			if ( pp == "envMap" || pp == "map" || pp == "lightMap" ) {

				m.parameters[ pp ] = result.textures[ m.parameters[ pp ] ];

			} else if ( pp == "shading" ) {

				m.parameters[ pp ] = ( m.parameters[ pp ] == "flat" ) ? THREE.FlatShading : THREE.SmoothShading;

			} else if ( pp == "blending" ) {

				m.parameters[ pp ] = THREE[ m.parameters[ pp ] ] ? THREE[ m.parameters[ pp ] ] : THREE.NormalBlending;

			} else if ( pp == "combine" ) {

				m.parameters[ pp ] = ( m.parameters[ pp ] == "MixOperation" ) ? THREE.MixOperation : THREE.MultiplyOperation;

			} else if ( pp == "vertexColors" ) {

				if ( m.parameters[ pp ] == "face" ) {

					m.parameters[ pp ] = THREE.FaceColors;

				// default to vertex colors if "vertexColors" is anything else face colors or 0 / null / false

				} else if ( m.parameters[ pp ] )   {

					m.parameters[ pp ] = THREE.VertexColors;

				}

			}

		}

		if ( m.parameters.opacity !== undefined && m.parameters.opacity < 1.0 ) {

			m.parameters.transparent = true;

		}

		if ( m.parameters.normalMap ) {

			var shader = THREE.ShaderUtils.lib[ "normal" ];
			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			var diffuse = m.parameters.color;
			var specular = m.parameters.specular;
			var ambient = m.parameters.ambient;
			var shininess = m.parameters.shininess;

			uniforms[ "tNormal" ].texture = result.textures[ m.parameters.normalMap ];

			if ( m.parameters.normalMapFactor ) {

				uniforms[ "uNormalScale" ].value = m.parameters.normalMapFactor;

			}

			if ( m.parameters.map ) {

				uniforms[ "tDiffuse" ].texture = m.parameters.map;
				uniforms[ "enableDiffuse" ].value = true;

			}

			if ( m.parameters.lightMap ) {

				uniforms[ "tAO" ].texture = m.parameters.lightMap;
				uniforms[ "enableAO" ].value = true;

			}

			if ( m.parameters.specularMap ) {

				uniforms[ "tSpecular" ].texture = result.textures[ m.parameters.specularMap ];
				uniforms[ "enableSpecular" ].value = true;

			}

			uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
			uniforms[ "uSpecularColor" ].value.setHex( specular );
			uniforms[ "uAmbientColor" ].value.setHex( ambient );

			uniforms[ "uShininess" ].value = shininess;

			if ( m.parameters.opacity ) {

				uniforms[ "uOpacity" ].value = m.parameters.opacity;

			}

			var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };

			material = new THREE.ShaderMaterial( parameters );

		} else {

			material = new THREE[ m.type ]( m.parameters );

		}

		result.materials[ dm ] = material;

	}

	// objects ( synchronous init of procedural primitives )

	handle_objects();

	// synchronous callback

	scope.callbackSync( result );

	// just in case there are no async elements:
	async_callback_gate();


};
/**
 * Loader for UTF8 encoded models generated by:
 *	http://code.google.com/p/webgl-loader/
 *
 * Limitations:
 *  - number of vertices < 65536 (this is after optimizations in compressor, input OBJ may have even less)
 *	- models must have normals and texture coordinates
 *  - texture coordinates must be only from <0,1>
 *  - no materials support yet
 *  - models are scaled and offset (copy numbers from compressor and use them as parameters in UTF8Loader.load() )
 *
 * @author alteredq / http://alteredqualia.com/
 * @author won3d / http://twitter.com/won3d
 */

THREE.UTF8Loader = function ( ) {

};

THREE.UTF8Loader.prototype = new THREE.UTF8Loader();
THREE.UTF8Loader.prototype.constructor = THREE.UTF8Loader;


// Load UTF8 compressed models generated by objcompress
//  - parameters
//		- url (required)
//		- callback (required)
//		- metaData (optional)

THREE.UTF8Loader.prototype.load = function( url, callback, metaData ) {

	if ( url instanceof Object ) {

		console.warn( 'DEPRECATED: UTF8Loader( parameters ) is now UTF8Loader( url, callback, metaData ).' );

		var parameters = url;

		url = parameters.model;
		callback = parameters.callback;
		metaData = { scale: parameters.scale, offsetX: parameters.offsetX, offsetY: parameters.offsetY, offsetZ: parameters.offsetZ };

	}

	var xhr = new XMLHttpRequest(),
		callbackProgress = null,

		scale = metaData.scale !== undefined ? metaData.scale : 1,
		offsetX = metaData.offsetX !== undefined ? metaData.offsetX : 0,
		offsetY = metaData.offsetY !== undefined ? metaData.offsetY : 0,
		offsetZ = metaData.offsetZ !== undefined ? metaData.offsetZ : 0;

	var length = 0;

	xhr.onreadystatechange = function() {

		if ( xhr.readyState == 4 ) {

			if ( xhr.status == 200 || xhr.status == 0 ) {

				THREE.UTF8Loader.prototype.createModel( xhr.responseText, callback, scale, offsetX, offsetY, offsetZ );

			} else {

				alert( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState == 3 ) {

			if ( callbackProgress ) {

				if ( length == 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState == 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	}

	xhr.open( "GET", url, true );
	xhr.send( null );

};

// UTF-8 decoder from webgl-loader
// http://code.google.com/p/webgl-loader/

// Copyright 2011 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License. You
// may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.

THREE.UTF8Loader.prototype.decompressMesh = function ( str ) {

	var num_verts = str.charCodeAt( 0 );

	if ( num_verts >= 0xE000 ) {

		num_verts -= 0x0800;

	}

	num_verts ++;

	var attribs_out = new Float32Array( 8 * num_verts );

	var offset = 1;

	for ( var i = 0; i < 8; i ++ ) {

		var prev_attrib = 0;

		for ( var j = 0; j < num_verts; ++ j ) {

			var code = str.charCodeAt( j + offset );

			prev_attrib += ( code >> 1 ) ^ ( - ( code & 1 ) );

			attribs_out[ 8 * j + i ] = prev_attrib;

		}

		offset += num_verts;

	}

	var num_indices = str.length - offset;

	var indices_out = new Uint16Array( num_indices );

	var index_high_water_mark = 0;

	for ( var i = 0; i < num_indices; i ++ ) {

		var code = str.charCodeAt( i + offset );

		indices_out[ i ] = index_high_water_mark - code;

		if ( code == 0 ) {

			index_high_water_mark ++;

		}

	}

	return [ attribs_out, indices_out ];

};

THREE.UTF8Loader.prototype.createModel = function ( data, callback, scale, offsetX, offsetY, offsetZ ) {

	var Model = function ( texture_path ) {

		//var s = (new Date).getTime();

		var scope = this;

		scope.materials = [];

		THREE.Geometry.call( this );

		var buffers = THREE.UTF8Loader.prototype.decompressMesh( data );

		var normals = [],
			uvs = [];

		init_vertices( buffers[ 0 ], 8, 0 );
		init_uvs( buffers[ 0 ], 8, 3 );
		init_normals( buffers[ 0 ], 8, 5 );

		init_faces( buffers[ 1 ] );

		this.computeCentroids();
		this.computeFaceNormals();
		//this.computeTangents();

		//var e = (new Date).getTime();

		//console.log( "utf8 data parse time: " + (e-s) + " ms" );

		function init_vertices( data, stride, offset ) {

			var i, x, y, z,
				end = data.length;

			for( i = offset; i < end; i += stride ) {

				x = data[ i ];
				y = data[ i + 1 ];
				z = data[ i + 2 ];

				// fix scale and offsets

				x = ( x / 16383 ) * scale;
				y = ( y / 16383 ) * scale;
				z = ( z / 16383 ) * scale;

				x += offsetX;
				y += offsetY;
				z += offsetZ;

				vertex( scope, x, y, z );

			}

		};

		function init_normals( data, stride, offset ) {

			var i, x, y, z,
				end = data.length;

			for( i = offset; i < end; i += stride ) {

				x = data[ i ];
				y = data[ i + 1 ];
				z = data[ i + 2 ];

				// normalize to <-1,1>

				x = ( x - 512 ) / 511;
				y = ( y - 512 ) / 511;
				z = ( z - 512 ) / 511;

				normals.push( x, y, z );

			}

		};

		function init_uvs( data, stride, offset ) {

			var i, u, v,
				end = data.length;

			for( i = offset; i < end; i += stride ) {

				u = data[ i ];
				v = data[ i + 1 ];

				// normalize to <0,1>

				u /= 1023;
				v /= 1023;

				uvs.push( u, 1 - v );

			}

		};

		function init_faces( indices ) {

			var i,
				a, b, c,
				u1, v1, u2, v2, u3, v3,
				m,
				end = indices.length;

			m = 0; // all faces defaulting to material 0

			for( i = 0; i < end; i += 3 ) {

				a = indices[ i ];
				b = indices[ i + 1 ];
				c = indices[ i + 2 ];

				f3n( scope, normals, a, b, c, m, a, b, c );

				u1 = uvs[ a * 2 ];
				v1 = uvs[ a * 2 + 1 ];

				u2 = uvs[ b * 2 ];
				v2 = uvs[ b * 2 + 1 ];

				u3 = uvs[ c * 2 ];
				v3 = uvs[ c * 2 + 1 ];

				uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

			}


		}

	};

	function vertex ( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	};

	function f3n ( scope, normals, a, b, c, mi, na, nb, nc ) {

		var material = scope.materials[ mi ],

			nax = normals[ na * 3     ],
			nay = normals[ na * 3 + 1 ],
			naz = normals[ na * 3 + 2 ],

			nbx = normals[ nb * 3     ],
			nby = normals[ nb * 3 + 1 ],
			nbz = normals[ nb * 3 + 2 ],

			ncx = normals[ nc * 3     ],
			ncy = normals[ nc * 3 + 1 ],
			ncz = normals[ nc * 3 + 2 ];

		var na = new THREE.Vector3( nax, nay, naz ),
			nb = new THREE.Vector3( nbx, nby, nbz ),
			nc = new THREE.Vector3( ncx, ncy, ncz );

		scope.faces.push( new THREE.Face3( a, b, c, [ na, nb, nc ], null, material ) );

	};

	function uv3 ( where, u1, v1, u2, v2, u3, v3 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		where.push( uv );

	};


	Model.prototype = new THREE.Geometry();
	Model.prototype.constructor = Model;

	callback( new Model() );

};
/**
 * @author sroucheray / http://sroucheray.org/
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Axes = function () {

	THREE.Object3D.call( this );

	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push( new THREE.Vertex() );
	lineGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 100, 0 ) ) );

	var coneGeometry = new THREE.CylinderGeometry( 0, 5, 25, 5, 1 );

	// x

	var line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color : 0xff0000 } ) );
	line.rotation.z = - Math.PI / 2;
	this.add( line );

	var cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color : 0xff0000 } ) );
	cone.position.x = 100;
	cone.rotation.z = - Math.PI / 2;
	this.add( cone );

	// y

	var line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color : 0x00ff00 } ) );
	this.add( line );

	var cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color : 0x00ff00 } ) );
	cone.position.y = 100;
	this.add( cone );

	// z

	var line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color : 0x0000ff } ) );
	line.rotation.x = Math.PI / 2;
	this.add( line );

	var cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color : 0x0000ff } ) );
	cone.position.z = 100;
	cone.rotation.x = Math.PI / 2;
	this.add( cone );

};

THREE.Axes.prototype = new THREE.Object3D();
THREE.Axes.prototype.constructor = THREE.Axes;
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Port of greggman's ThreeD version of marching cubes to Three.js
 * http://webglsamples.googlecode.com/hg/blob/blob.html
 */

// do not crash if somebody includes the file in oldie browser

THREE.MarchingCubes = function ( resolution, materials ) {

	THREE.Object3D.call( this );

	this.materials = materials instanceof Array ? materials : [ materials ];

	// functions have to be object properties
	// prototype functions kill performance
	// (tested and it was 4x slower !!!)

	this.init = function( resolution ) {

		// parameters

		this.isolation = 80.0;

		// size of field, 32 is pushing it in Javascript :)

		this.size = resolution;
		this.size2 = this.size * this.size;
		this.size3 = this.size2 * this.size;
		this.halfsize = this.size / 2.0;

		// deltas

		this.delta = 2.0 / this.size;
		this.yd = this.size;
		this.zd = this.size2;

		this.field = new Float32Array( this.size3 );
		this.normal_cache = new Float32Array( this.size3 * 3 );

		// temp buffers used in polygonize

		this.vlist = new Float32Array( 12 * 3 );
		this.nlist = new Float32Array( 12 * 3 );

		this.firstDraw = true;

		// immediate render mode simulator

		this.maxCount = 4096; // TODO: find the fastest size for this buffer
		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

		this.positionArray = new Float32Array( this.maxCount * 3 );
		this.normalArray   = new Float32Array( this.maxCount * 3 );

	};

	///////////////////////
	// Polygonization
	///////////////////////

	this.lerp = function( a, b, t ) { return a + ( b - a ) * t; };

	this.VIntX = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x + mu * this.delta;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q + 3 ], mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q + 4 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q + 5 ], mu );

	};

	this.VIntY = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y + mu * this.delta;
		pout[ offset + 2 ] = z;

		var q2 = q + this.yd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.VIntZ = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z + mu * this.delta;

		var q2 = q + this.zd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.compNorm = function( q ) {

		var q3 = q * 3;

		if ( this.normal_cache [ q3 ] === 0.0 ) {

			this.normal_cache[ q3     ] = this.field[ q - 1  ] 	    - this.field[ q + 1 ];
			this.normal_cache[ q3 + 1 ] = this.field[ q - this.yd ] - this.field[ q + this.yd ];
			this.normal_cache[ q3 + 2 ] = this.field[ q - this.zd ] - this.field[ q + this.zd ];

		}

	};

	// Returns total number of triangles. Fills triangles.
	// (this is where most of time is spent - it's inner work of O(n3) loop )

	this.polygonize = function( fx, fy, fz, q, isol, render_callback ) {

		// cache indices
		var q1 = q + 1,
			qy = q + this.yd,
			qz = q + this.zd,
			q1y = q1 + this.yd,
			q1z = q1 + this.zd,
			qyz = q + this.yd + this.zd,
			q1yz = q1 + this.yd + this.zd;

		var cubeindex = 0,
			field0 = this.field[ q ],
			field1 = this.field[ q1 ],
			field2 = this.field[ qy ],
			field3 = this.field[ q1y ],
			field4 = this.field[ qz ],
			field5 = this.field[ q1z ],
			field6 = this.field[ qyz ],
			field7 = this.field[ q1yz ];

		if ( field0 < isol ) cubeindex |= 1;
		if ( field1 < isol ) cubeindex |= 2;
		if ( field2 < isol ) cubeindex |= 8;
		if ( field3 < isol ) cubeindex |= 4;
		if ( field4 < isol ) cubeindex |= 16;
		if ( field5 < isol ) cubeindex |= 32;
		if ( field6 < isol ) cubeindex |= 128;
		if ( field7 < isol ) cubeindex |= 64;

		// if cube is entirely in/out of the surface - bail, nothing to draw

		var bits = THREE.edgeTable[ cubeindex ];
		if ( bits === 0 ) return 0;

		var d = this.delta,
			fx2 = fx + d,
			fy2 = fy + d,
			fz2 = fz + d;

		// top of the cube

		if ( bits & 1 ) {

			this.compNorm( q );
			this.compNorm( q1 );
			this.VIntX( q * 3, this.vlist, this.nlist, 0, isol, fx, fy, fz, field0, field1 );

		};

		if ( bits & 2 ) {

			this.compNorm( q1 );
			this.compNorm( q1y );
			this.VIntY( q1 * 3, this.vlist, this.nlist, 3, isol, fx2, fy, fz, field1, field3 );

		};

		if ( bits & 4 ) {

			this.compNorm( qy );
			this.compNorm( q1y );
			this.VIntX( qy * 3, this.vlist, this.nlist, 6, isol, fx, fy2, fz, field2, field3 );

		};

		if ( bits & 8 ) {

			this.compNorm( q );
			this.compNorm( qy );
			this.VIntY( q * 3, this.vlist, this.nlist, 9, isol, fx, fy, fz, field0, field2 );

		};

		// bottom of the cube

		if ( bits & 16 )  {

			this.compNorm( qz );
			this.compNorm( q1z );
			this.VIntX( qz * 3, this.vlist, this.nlist, 12, isol, fx, fy, fz2, field4, field5 );

		};

		if ( bits & 32 )  {

			this.compNorm( q1z );
			this.compNorm( q1yz );
			this.VIntY( q1z * 3,  this.vlist, this.nlist, 15, isol, fx2, fy, fz2, field5, field7 );

		};

		if ( bits & 64 ) {

			this.compNorm( qyz );
			this.compNorm( q1yz );
			this.VIntX( qyz * 3, this.vlist, this.nlist, 18, isol, fx, fy2, fz2, field6, field7 );

		};

		if ( bits & 128 ) {

			this.compNorm( qz );
			this.compNorm( qyz );
			this.VIntY( qz * 3,  this.vlist, this.nlist, 21, isol, fx, fy, fz2, field4, field6 );

		};

		// vertical lines of the cube

		if ( bits & 256 ) {

			this.compNorm( q );
			this.compNorm( qz );
			this.VIntZ( q * 3, this.vlist, this.nlist, 24, isol, fx, fy, fz, field0, field4 );

		};

		if ( bits & 512 ) {

			this.compNorm( q1 );
			this.compNorm( q1z );
			this.VIntZ( q1 * 3,  this.vlist, this.nlist, 27, isol, fx2, fy,  fz, field1, field5 );

		};

		if ( bits & 1024 ) {

			this.compNorm( q1y );
			this.compNorm( q1yz );
			this.VIntZ( q1y * 3, this.vlist, this.nlist, 30, isol, fx2, fy2, fz, field3, field7 );

		};

		if ( bits & 2048 ) {

			this.compNorm( qy );
			this.compNorm( qyz );
			this.VIntZ( qy * 3, this.vlist, this.nlist, 33, isol, fx,  fy2, fz, field2, field6 );

		};

		cubeindex <<= 4;  // re-purpose cubeindex into an offset into triTable

		var o1, o2, o3, numtris = 0, i = 0;

		// here is where triangles are created

		while ( THREE.triTable[ cubeindex + i ] != -1 ) {

			o1 = cubeindex + i;
			o2 = o1 + 1;
			o3 = o1 + 2;

			this.posnormtriv( this.vlist, this.nlist,
							  3 * THREE.triTable[ o1 ],
							  3 * THREE.triTable[ o2 ],
							  3 * THREE.triTable[ o3 ],
							  render_callback );

			i += 3;
			numtris ++;

		}

		return numtris;

	};

	/////////////////////////////////////
	// Immediate render mode simulator
	/////////////////////////////////////

	this.posnormtriv = function( pos, norm, o1, o2, o3, render_callback ) {

		var c = this.count * 3;

		this.positionArray[ c ] = pos[ o1 ];
		this.positionArray[ c + 1 ] = pos[ o1 + 1 ];
		this.positionArray[ c + 2 ] = pos[ o1 + 2 ];

		this.positionArray[ c + 3 ] = pos[ o2 ];
		this.positionArray[ c + 4 ] = pos[ o2 + 1 ];
		this.positionArray[ c + 5 ] = pos[ o2 + 2 ];

		this.positionArray[ c + 6 ] = pos[ o3 ];
		this.positionArray[ c + 7 ] = pos[ o3 + 1 ];
		this.positionArray[ c + 8 ] = pos[ o3 + 2 ];

		this.normalArray[ c ] = norm[ o1 ];
		this.normalArray[ c + 1 ] = norm[ o1 + 1 ];
		this.normalArray[ c + 2 ] = norm[ o1 + 2 ];

		this.normalArray[ c + 3 ] = norm[ o2 ];
		this.normalArray[ c + 4 ] = norm[ o2 + 1 ];
		this.normalArray[ c + 5 ] = norm[ o2 + 2 ];

		this.normalArray[ c + 6 ] = norm[ o3 ];
		this.normalArray[ c + 7 ] = norm[ o3 + 1 ];
		this.normalArray[ c + 8 ] = norm[ o3 + 2 ];

		this.hasPos = true;
		this.hasNormal = true;

		this.count += 3;

		if ( this.count >= this.maxCount - 3 ) {

			render_callback( this );

		}

	};

	this.begin = function( ) {

		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

	};

	this.end = function( render_callback ) {

		if ( this.count === 0 )
			return;

		for ( var i = this.count * 3; i < this.positionArray.length; i++ )
			this.positionArray[ i ] = 0.0;

		render_callback( this );

	};

	/////////////////////////////////////
	// Metaballs
	/////////////////////////////////////

	// Adds a reciprocal ball (nice and blobby) that, to be fast, fades to zero after
	// a fixed distance, determined by strength and subtract.

	this.addBall = function( ballx, bally, ballz, strength, subtract ) {

		// Let's solve the equation to find the radius:
		// 1.0 / (0.000001 + radius^2) * strength - subtract = 0
		// strength / (radius^2) = subtract
		// strength = subtract * radius^2
		// radius^2 = strength / subtract
		// radius = sqrt(strength / subtract)

		var radius = this.size * Math.sqrt( strength / subtract ),
			zs = ballz * this.size,
			ys = bally * this.size,
			xs = ballx * this.size;

		var min_z = Math.floor( zs - radius ); if ( min_z < 1 ) min_z = 1;
		var max_z = Math.floor( zs + radius ); if ( max_z > this.size - 1 ) max_z = this.size - 1;
		var min_y = Math.floor( ys - radius ); if ( min_y < 1 ) min_y = 1;
		var max_y = Math.floor( ys + radius ); if ( max_y > this.size - 1 ) max_y = this.size - 1;
		var min_x = Math.floor( xs - radius ); if ( min_x < 1  ) min_x = 1;
		var max_x = Math.floor( xs + radius ); if ( max_x > this.size - 1 ) max_x = this.size - 1;


		// Don't polygonize in the outer layer because normals aren't
		// well-defined there.

		var x, y, z, y_offset, z_offset, fx, fy, fz, fz2, fy2, val;

		for ( z = min_z; z < max_z; z++ ) {

			z_offset = this.size2 * z,
			fz = z / this.size - ballz,
			fz2 = fz * fz;

			for ( y = min_y; y < max_y; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = y / this.size - bally;
				fy2 = fy * fy;

				for ( x = min_x; x < max_x; x++ ) {

					fx = x / this.size - ballx;
					val = strength / ( 0.000001 + fx*fx + fy2 + fz2 ) - subtract;
					if ( val > 0.0 ) this.field[ y_offset + x ] += val;

				}

			}

		}

	};

	this.addPlaneX = function( strength, subtract ) {

		var x, y, z, xx, val, xdiv, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( x = 0; x < dist; x++ ) {

			xdiv = x / size;
			xx = xdiv * xdiv;
			val = strength / ( 0.0001 + xx ) - subtract;

			if ( val > 0.0 ) {

				for ( y = 0; y < size; y++ ) {

					cxy = x + y * yd;

					for ( z = 0; z < size; z++ ) {

						field[ zd * z + cxy ] += val;

					}

				}

			}

		}

	};

	this.addPlaneY = function( strength, subtract ) {

		var x, y, z, yy, val, ydiv, cy, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( y = 0; y < dist; y++ ) {

			ydiv = y / size;
			yy = ydiv * ydiv;
			val = strength / ( 0.0001 + yy ) - subtract;

			if ( val > 0.0 ) {

				cy = y * yd;

				for ( x = 0; x < size; x++ ) {

					cxy = cy + x;

					for ( z = 0; z < size; z++ )
						field[ zd * z + cxy ] += val;

				}

			}

		}

	};

	this.addPlaneZ = function( strength, subtract ) {

		var x, y, z, zz, val, zdiv, cz, cyz,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( z = 0; z < dist; z++ ) {

			zdiv = z / size;
			zz = zdiv * zdiv;
			val = strength / ( 0.0001 + zz ) - subtract;
			if ( val > 0.0 ) {

				cz = zd * z;

				for ( y = 0; y < size; y++ ) {

						cyz = cz + y * yd;

						for ( x = 0; x < size; x++ )
							field[ cyz + x ] += val;

				}

			}

		}

	};

	/////////////////////////////////////
	// Updates
	/////////////////////////////////////

	this.reset = function() {

		var i;

		// wipe the normal cache

		for ( i = 0; i < this.size3; i++ ) {

			this.normal_cache[ i * 3 ] = 0.0;
			this.field[ i ] = 0.0;

		}

	};

	this.render = function( render_callback ) {

		this.begin();

		// Triangulate. Yeah, this is slow.

		var q, x, y, z, fx, fy, fz, y_offset, z_offset, smin2 = this.size - 2;

		for ( z = 1; z < smin2; z++ ) {

			z_offset = this.size2 * z;
			fz = ( z - this.halfsize ) / this.halfsize; //+ 1

			for ( y = 1; y < smin2; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = ( y - this.halfsize ) / this.halfsize; //+ 1

				for ( x = 1; x < smin2; x++ ) {

					fx = ( x - this.halfsize ) / this.halfsize; //+ 1
					q = y_offset + x;

					this.polygonize( fx, fy, fz, q, this.isolation, render_callback );

				}

			}

		}

		this.end( render_callback );

	};

	this.generateGeometry = function() {

		var start = 0, geo = new THREE.Geometry();
		var normals = [];

		var geo_callback = function( object ) {

			var i, x, y, z, vertex, position, normal,
				face, a, b, c, na, nb, nc, nfaces;


			for ( i = 0; i < object.count; i++ ) {

				a = i * 3;
				b = a + 1;
				c = a + 2;

				x = object.positionArray[ a ];
				y = object.positionArray[ b ];
				z = object.positionArray[ c ];
				position = new THREE.Vector3( x, y, z );

				x = object.normalArray[ a ];
				y = object.normalArray[ b ];
				z = object.normalArray[ c ];
				normal = new THREE.Vector3( x, y, z );
				normal.normalize();

				vertex = new THREE.Vertex( position );

				geo.vertices.push( vertex );
				normals.push( normal );

			}

			nfaces = object.count / 3;

			for ( i = 0; i < nfaces; i++ ) {

				a = ( start + i ) * 3;
				b = a + 1;
				c = a + 2;

				na = normals[ a ];
				nb = normals[ b ];
				nc = normals[ c ];

				face = new THREE.Face3( a, b, c, [ na, nb, nc ] );

				geo.faces.push( face );

			}

			start += nfaces;
			object.count = 0;

		};

		this.render( geo_callback );

		// console.log( "generated " + geo.faces.length + " triangles" );

		return geo;

	};

	this.init( resolution );

};

THREE.MarchingCubes.prototype = new THREE.Object3D();
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;


/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.

THREE.edgeTable = new Int32Array([
0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0])

THREE.triTable = new Int32Array([
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
/**
 * @author mrdoob / http://mrdoob.com/
 * @author marklundin / http://mark-lundin.com/
 * @author alteredq / http://alteredqualia.com/
 */

if ( THREE.WebGLRenderer ) {

	THREE.AnaglyphWebGLRenderer = function ( parameters ) {

		THREE.WebGLRenderer.call( this, parameters );

		this.autoUpdateScene = false;

		var _this = this, _setSize = this.setSize, _render = this.render;

		var _cameraL = new THREE.PerspectiveCamera(),
			_cameraR = new THREE.PerspectiveCamera();

		var eyeRight = new THREE.Matrix4(),
			eyeLeft = new THREE.Matrix4(),
			focalLength = 125,
			_aspect, _near, _far, _fov;

		_cameraL.matrixAutoUpdate = _cameraR.matrixAutoUpdate = false;

		var _params = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };

		var _renderTargetL = new THREE.WebGLRenderTarget( 512, 512, _params ),
			_renderTargetR = new THREE.WebGLRenderTarget( 512, 512, _params );

		var _camera = new THREE.PerspectiveCamera( 53, 1, 1, 10000 );
		_camera.position.z = 2;

		var _material = new THREE.ShaderMaterial( {

			uniforms: {

				"mapLeft": { type: "t", value: 0, texture: _renderTargetL },
				"mapRight": { type: "t", value: 1, texture: _renderTargetR }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = vec2( uv.x, 1.0 - uv.y );",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform sampler2D mapLeft;",
				"uniform sampler2D mapRight;",
				"varying vec2 vUv;",

				"void main() {",

					"vec4 colorL, colorR;",
					"vec2 uv = vUv;",

					"colorL = texture2D( mapLeft, uv );",
					"colorR = texture2D( mapRight, uv );",

					// http://3dtv.at/Knowhow/AnaglyphComparison_en.aspx

					"gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;",

				"}"

				].join("\n")

		} );

		var _scene = new THREE.Scene();
		_scene.add( new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), _material ) );

		_scene.add( _camera );

		this.setSize = function ( width, height ) {

			_setSize.call( _this, width, height );

			_renderTargetL.width = width;
			_renderTargetL.height = height;

			_renderTargetR.width = width;
			_renderTargetR.height = height;

		};

		/*
		 * Renderer now uses an asymmetric perspective projection (http://paulbourke.net/miscellaneous/stereographics/stereorender/).
		 * Each camera is offset by the eye seperation and its projection matrix is also skewed asymetrically back to converge on the same
		 * projection plane. Added a focal length parameter to, this is where the parallax is equal to 0.
		 */

		this.render = function ( scene, camera, renderTarget, forceClear ) {

			scene.updateMatrixWorld();

			var hasCameraChanged = ( _aspect !== camera.aspect ) || ( _near !== camera.near ) || ( _far !== camera.far ) || ( _fov !== camera.fov );

			if( hasCameraChanged ) {

				_aspect = camera.aspect;
				_near = camera.near;
				_far = camera.far;
				_fov = camera.fov;

				var projectionMatrix = camera.projectionMatrix.clone(),
					eyeSep = focalLength / 30 * 0.5,
					eyeSepOnProjection = eyeSep * _near / focalLength,
					ymax = _near * Math.tan( _fov * Math.PI / 360 ),
					xmin, xmax;

				// translate xOffset

				eyeRight.n14 = eyeSep;
				eyeLeft.n14 = -eyeSep;

				// for left eye

				xmin = -ymax * _aspect + eyeSepOnProjection;
				xmax = ymax * _aspect + eyeSepOnProjection;

				projectionMatrix.n11 = 2 * _near / ( xmax - xmin );
				projectionMatrix.n13 = ( xmax + xmin ) / ( xmax - xmin );

				_cameraL.projectionMatrix.copy( projectionMatrix );

				// for right eye

				xmin = -ymax * _aspect - eyeSepOnProjection;
				xmax = ymax * _aspect - eyeSepOnProjection;

				projectionMatrix.n11 = 2 * _near / ( xmax - xmin );
				projectionMatrix.n13 = ( xmax + xmin ) / ( xmax - xmin );

				_cameraR.projectionMatrix.copy( projectionMatrix );

			}

			_cameraL.matrixWorld.copy( camera.matrixWorld ).multiplySelf( eyeLeft );
			_cameraL.position.copy( camera.position );
			_cameraL.near = camera.near;
			_cameraL.far = camera.far;

			_render.call( _this, scene, _cameraL, _renderTargetL, true );

			_cameraR.matrixWorld.copy( camera.matrixWorld ).multiplySelf( eyeRight );
			_cameraR.position.copy( camera.position );
			_cameraR.near = camera.near;
			_cameraR.far = camera.far;

			_render.call( _this, scene, _cameraR, _renderTargetR, true );

			_scene.updateMatrixWorld();
			_render.call( _this, _scene, _camera );

		};

	};

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

if ( THREE.WebGLRenderer ) {

	THREE.CrosseyedWebGLRenderer = function ( parameters ) {

		THREE.WebGLRenderer.call( this, parameters );

		this.autoClear = false;

		var _this = this, _setSize = this.setSize, _render = this.render;

		var _width, _height;

		var _cameraL = new THREE.PerspectiveCamera();
		_cameraL.target = new THREE.Vector3( 0, 0, 0 );

		var _cameraR = new THREE.PerspectiveCamera();
		_cameraR.target = new THREE.Vector3( 0, 0, 0 );

		_this.separation = 10;
		if ( parameters && parameters.separation !== undefined ) _this.separation = parameters.separation;

		var SCREEN_WIDTH  = window.innerWidth;
		var SCREEN_HEIGHT = window.innerHeight;
		var HALF_WIDTH = SCREEN_WIDTH / 2;

		this.setSize = function ( width, height ) {

			_setSize.call( _this, width, height );

			_width = width/2;
			_height = height;

		};

		this.render = function ( scene, camera, renderTarget, forceClear ) {

			this.clear();

			_cameraL.fov = camera.fov;
			_cameraL.aspect = 0.5 * camera.aspect;
			_cameraL.near = camera.near;
			_cameraL.far = camera.far;
			_cameraL.updateProjectionMatrix();

			_cameraL.position.copy( camera.position );
			_cameraL.target.copy( camera.target );
			_cameraL.translateX( _this.separation );
			_cameraL.lookAt( _cameraL.target );

			_cameraR.projectionMatrix = _cameraL.projectionMatrix;

			_cameraR.position.copy( camera.position );
			_cameraR.target.copy( camera.target );
			_cameraR.translateX( - _this.separation );
			_cameraR.lookAt( _cameraR.target );

			this.setViewport( 0, 0, _width, _height );
			_render.call( _this, scene, _cameraL );

			this.setViewport( _width, 0, _width, _height );
			_render.call( _this, scene, _cameraR, false );

		};

	};

}
(function() {
  var Controls, MouseEvent;

  MouseEvent = {
    isLeftButton: function(event) {
      return event.which === 1;
    },
    isRightButton: function(event) {
      return event.which === 3;
    },
    isLeftButtonDown: function(event) {
      return event.button === 0 && this.isLeftButton(event);
    }
  };

  Controls = (function() {

    function Controls(object, domElement) {
      this.object = object;
      this.target = new THREE.Vector3(0, 0, 0);
      this.domElement = domElement || document;
      this.lookSpeed = 0.20;
      this.mouseX = 0;
      this.mouseY = 0;
      this.lat = -66.59;
      this.lon = -31.8;
      this.mouseDragOn = false;
      this.anchorx = null;
      this.anchory = null;
      this.defineBindings();
    }

    Controls.prototype.defineBindings = function() {
      var _this = this;
      $(this.domElement).mousemove(function(e) {
        return _this.onMouseMove(e);
      });
      $(this.domElement).mousedown(function(e) {
        return _this.onMouseDown(e);
      });
      $(this.domElement).mouseup(function(e) {
        return _this.onMouseUp(e);
      });
      return $(this.domElement).mouseenter(function(e) {
        return _this.onMouserEnter(e);
      });
    };

    Controls.prototype.onMouserEnter = function(event) {
      if (!MouseEvent.isLeftButtonDown(event)) return this.onMouseUp(event);
    };

    Controls.prototype.onMouseDown = function(event) {
      if (!MouseEvent.isLeftButton(event)) return;
      if (this.domElement !== document) this.domElement.focus();
      this.anchorx = event.pageX;
      this.anchory = event.pageY;
      this.setMouse(event);
      this.mouseDragOn = true;
      return false;
    };

    Controls.prototype.onMouseUp = function(event) {
      this.mouseDragOn = false;
      return false;
    };

    Controls.prototype.setMouse = function(event) {
      this.mouseX = event.pageX;
      return this.mouseY = event.pageY;
    };

    Controls.prototype.onMouseMove = function(event) {
      if (!this.mouseDragOn) return;
      this.setMouse(event);
    };

    Controls.prototype.halfCircle = Math.PI / 180;

    Controls.prototype.viewDirection = function() {
      return this.target.clone().subSelf(this.object.position);
    };

    Controls.prototype.move = function(newPosition) {
      this.object.position = newPosition;
      return this.updateLook();
    };

    Controls.prototype.updateLook = function() {
      var cos, p, phi, sin, theta;
      sin = Math.sin, cos = Math.cos;
      phi = (90 - this.lat) * this.halfCircle;
      theta = this.lon * this.halfCircle;
      p = this.object.position;
      assoc(this.target, {
        x: p.x + 100 * sin(phi) * cos(theta),
        y: p.y + 100 * cos(phi),
        z: p.z + 100 * sin(phi) * sin(theta)
      });
      this.object.lookAt(this.target);
    };

    Controls.prototype.update = function() {
      var max, min;
      if (!this.mouseDragOn) return;
      if (this.mouseX === this.anchorx && this.mouseY === this.anchory) return;
      max = Math.max, min = Math.min;
      this.lon += (this.mouseX - this.anchorx) * this.lookSpeed;
      this.lat -= (this.mouseY - this.anchory) * this.lookSpeed;
      this.anchorx = this.mouseX;
      this.anchory = this.mouseY;
      this.lat = max(-85, min(85, this.lat));
      this.updateLook();
    };

    return Controls;

  })();

  window.MouseEvent = MouseEvent;

  window.Controls = Controls;

}).call(this);
(function() {
  var CollisionUtils;

  CollisionUtils = {
    testIntervalCollision: function(s1, f1, s2, f2) {
      if (s1 === s2) return true;
      if (s1 < s2) return f1 >= s2;
      return f2 >= s1;
    },
    testCubeCollision: function(cube1, cube2) {
      var axis, collides, fcol, _i, _len, _ref;
      fcol = this.testIntervalCollision;
      _ref = ['x', 'y', 'z'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        axis = _ref[_i];
        collides = fcol(cube1.vmin[axis], cube1.vmax[axis], cube2.vmin[axis], cube2.vmax[axis]);
        if (!collides) return false;
      }
      return true;
    }
  };

  window.CollisionUtils = CollisionUtils;

}).call(this);
(function() {
  var AmbientLight, BlockSelection, Blocks, ClampToEdgeWrapping, Clock, CollisionHelper, CubeGeometry, CubeSize, DirectionalLight, Floor, Game, Grid, LinearMipMapLinearFilter, Matrix4, Mesh, MeshLambertMaterial, MeshNormalMaterial, NearestFilter, Object3D, PerspectiveCamera, PlaneGeometry, Player, PointLight, Projector, Ray, RepeatWrapping, Scene, Texture, TextureHelper, UVMapping, Vector2, Vector3, WebGLRenderer, vec;
  var __slice = Array.prototype.slice;

  Object3D = THREE.Object3D, Matrix4 = THREE.Matrix4, Scene = THREE.Scene, Mesh = THREE.Mesh, WebGLRenderer = THREE.WebGLRenderer, PerspectiveCamera = THREE.PerspectiveCamera;

  CubeGeometry = THREE.CubeGeometry, PlaneGeometry = THREE.PlaneGeometry, MeshLambertMaterial = THREE.MeshLambertMaterial, MeshNormalMaterial = THREE.MeshNormalMaterial;

  AmbientLight = THREE.AmbientLight, DirectionalLight = THREE.DirectionalLight, PointLight = THREE.PointLight, Ray = THREE.Ray, Vector3 = THREE.Vector3, Vector2 = THREE.Vector2;

  MeshLambertMaterial = THREE.MeshLambertMaterial, MeshNormalMaterial = THREE.MeshNormalMaterial, Projector = THREE.Projector;

  Texture = THREE.Texture, UVMapping = THREE.UVMapping, RepeatWrapping = THREE.RepeatWrapping, RepeatWrapping = THREE.RepeatWrapping, NearestFilter = THREE.NearestFilter;

  LinearMipMapLinearFilter = THREE.LinearMipMapLinearFilter, ClampToEdgeWrapping = THREE.ClampToEdgeWrapping, Clock = THREE.Clock;

  vec = function(x, y, z) {
    return new Vector3(x, y, z);
  };

  CubeSize = 50;

  Blocks = ["cobblestone", "plank", "brick", "diamond", "glowstone", "obsidian", "whitewool", "bluewool", "redwool", "netherrack"];

  Player = (function() {

    Player.prototype.width = CubeSize * 0.3;

    Player.prototype.depth = CubeSize * 0.3;

    Player.prototype.height = CubeSize * 1.63;

    function Player() {
      this.halfHeight = this.height / 2;
      this.halfWidth = this.width / 2;
      this.halfDepth = this.depth / 2;
      this.pos = vec();
      this.eyesDelta = this.halfHeight * 0.9;
    }

    Player.prototype.eyesPosition = function() {
      var ret;
      ret = this.pos.clone();
      ret.y += this.eyesDelta;
      return ret;
    };

    Player.prototype.position = function(axis) {
      if (axis == null) return this.pos;
      return this.pos[axis];
    };

    Player.prototype.incPosition = function(axis, val) {
      this.pos[axis] += val;
    };

    Player.prototype.setPosition = function(axis, val) {
      this.pos[axis] = val;
    };

    Player.prototype.collidesWithGround = function() {
      return this.position('y') < this.halfHeight;
    };

    Player.prototype.vertex = function(vertexX, vertexY, vertexZ) {
      var vertex;
      vertex = this.position().clone();
      vertex.x += vertexX * this.halfWidth;
      vertex.y += vertexY * this.halfHeight;
      vertex.z += vertexZ * this.halfDepth;
      return vertex;
    };

    Player.prototype.boundingBox = function() {
      var vmax, vmin;
      vmin = this.vertex(-1, -1, -1);
      vmax = this.vertex(1, 1, 1);
      return {
        vmin: vmin,
        vmax: vmax
      };
    };

    return Player;

  })();

  Grid = (function() {

    function Grid(size) {
      var _this = this;
      this.size = size != null ? size : 5;
      this.matrix = [];
      this.size.times(function(i) {
        _this.matrix[i] = [];
        return _this.size.times(function(j) {
          return _this.matrix[i][j] = [];
        });
      });
    }

    Grid.prototype.insideGrid = function(x, y, z) {
      return (0 <= x && x < this.size) && (0 <= y && y < this.size) && (0 <= z && z < this.size);
    };

    Grid.prototype.get = function(x, y, z) {
      return this.matrix[x][y][z];
    };

    Grid.prototype.put = function(x, y, z, val) {
      return this.matrix[x][y][z] = val;
    };

    Grid.prototype.gridCoords = function(x, y, z) {
      x = Math.floor(x / CubeSize);
      y = Math.floor(y / CubeSize);
      z = Math.floor(z / CubeSize);
      return [x, y, z];
    };

    return Grid;

  })();

  CollisionHelper = (function() {

    function CollisionHelper(player, grid) {
      this.player = player;
      this.grid = grid;
      return;
    }

    CollisionHelper.prototype.rad = CubeSize;

    CollisionHelper.prototype.halfRad = CubeSize / 2;

    CollisionHelper.prototype.collides = function() {
      var cube, playerBox, _i, _len, _ref;
      if (this.player.collidesWithGround()) return true;
      if (this.beyondBounds()) return true;
      playerBox = this.player.boundingBox();
      _ref = this.possibleCubes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cube = _ref[_i];
        if (this._collideWithCube(playerBox, cube)) return true;
      }
      return false;
    };

    CollisionHelper.prototype.beyondBounds = function() {
      var p, x, y, z, _ref;
      p = this.player.position();
      _ref = this.grid.gridCoords(p.x, p.y, p.z), x = _ref[0], y = _ref[1], z = _ref[2];
      if (!this.grid.insideGrid(x, 0, z)) return true;
    };

    CollisionHelper.prototype._addToPosition = function(position, value) {
      var pos;
      pos = position.clone();
      pos.x += value;
      pos.y += value;
      pos.z += value;
      return pos;
    };

    CollisionHelper.prototype.collideWithCube = function(cube) {
      return this._collideWithCube(this.player.boundingBox(), cube);
    };

    CollisionHelper.prototype._collideWithCube = function(playerBox, cube) {
      var cubeBox, vmax, vmin;
      vmin = this._addToPosition(cube.position, -this.halfRad);
      vmax = this._addToPosition(cube.position, this.halfRad);
      cubeBox = {
        vmin: vmin,
        vmax: vmax
      };
      return CollisionUtils.testCubeCollision(playerBox, cubeBox);
    };

    CollisionHelper.prototype.possibleCubes = function() {
      var cubes, grid;
      cubes = [];
      grid = this.grid;
      this.withRange(function(x, y, z) {
        var cube;
        cube = grid.get(x, y, z);
        if (cube != null) return cubes.push(cube);
      });
      return cubes;
    };

    CollisionHelper.prototype.withRange = function(func) {
      var maxx, maxy, maxz, minx, miny, minz, vmax, vmin, x, y, z, _ref;
      _ref = this.player.boundingBox(), vmin = _ref.vmin, vmax = _ref.vmax;
      minx = this.toGrid(vmin.x);
      miny = this.toGrid(vmin.y);
      minz = this.toGrid(vmin.z);
      maxx = this.toGrid(vmax.x + this.rad);
      maxy = this.toGrid(vmax.y + this.rad);
      maxz = this.toGrid(vmax.z + this.rad);
      x = minx;
      while (x <= maxx) {
        y = miny;
        while (y <= maxy) {
          z = minz;
          while (z <= maxz) {
            func(x, y, z);
            z++;
          }
          y++;
        }
        x++;
      }
    };

    CollisionHelper.prototype.toGrid = function(val) {
      var ret;
      ret = Math.floor(val / this.rad);
      if (ret < 0) return 0;
      if (ret > this.grid.size - 1) return this.grid.size - 1;
      return ret;
    };

    return CollisionHelper;

  })();

  TextureHelper = {
    loadTexture: function(path) {
      var image, texture;
      image = new Image();
      image.src = path;
      texture = new Texture(image, new UVMapping(), ClampToEdgeWrapping, ClampToEdgeWrapping, NearestFilter, LinearMipMapLinearFilter);
      image.onload = function() {
        return texture.needsUpdate = true;
      };
      return new THREE.MeshLambertMaterial({
        map: texture,
        ambient: 0xbbbbbb
      });
    },
    tileTexture: function(path, repeatx, repeaty) {
      var image, texture;
      image = new Image();
      image.src = path;
      texture = new Texture(image, new UVMapping(), RepeatWrapping, RepeatWrapping, NearestFilter, LinearMipMapLinearFilter);
      texture.repeat.x = repeatx;
      texture.repeat.y = repeaty;
      image.onload = function() {
        return texture.needsUpdate = true;
      };
      return new THREE.MeshLambertMaterial({
        map: texture,
        ambient: 0xbbbbbb
      });
    }
  };

  Floor = (function() {

    function Floor(width, height) {
      var material, plane, planeGeo, repeatX, repeatY;
      repeatX = width / CubeSize;
      repeatY = height / CubeSize;
      material = TextureHelper.tileTexture("./textures/bedrock.png", repeatX, repeatY);
      planeGeo = new PlaneGeometry(width, height, 1, 1);
      plane = new Mesh(planeGeo, material);
      plane.position.y = -1;
      plane.rotation.x = -Math.PI / 2;
      plane.name = 'floor';
      this.plane = plane;
    }

    Floor.prototype.addToScene = function(scene) {
      return scene.add(this.plane);
    };

    return Floor;

  })();

  Game = (function() {

    function Game(populateWorldFunction) {
      this.populateWorldFunction = populateWorldFunction;
      this.rad = CubeSize;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.geo = this.createGrassGeometry();
      this.cubeBlocks = this.createBlocksGeometry();
      this.selectCubeBlock('cobblestone');
      this.move = {
        x: 0,
        z: 0,
        y: 0
      };
      this.keysDown = {};
      this.grid = new Grid(100);
      this.onGround = true;
      this.pause = false;
      this.renderer = this.createRenderer();
      this.rendererPosition = $("#minecraft-container canvas").offset();
      this.camera = this.createCamera();
      this.canvas = this.renderer.domElement;
      this.controls = new Controls(this.camera, this.canvas);
      this.player = new Player();
      this.scene = new Scene();
      new Floor(50000, 50000).addToScene(this.scene);
      this.scene.add(this.camera);
      this.addLights(this.scene);
      this.projector = new Projector();
      this.castRay = null;
      this.moved = false;
      this.toDelete = null;
      this.collisionHelper = new CollisionHelper(this.player, this.grid);
      this.clock = new Clock();
      this.populateWorld();
      this.defineControls();
    }

    Game.prototype.createBlocksGeometry = function() {
      var b, cube, cubeBlocks, _i, _len;
      cubeBlocks = {};
      for (_i = 0, _len = Blocks.length; _i < _len; _i++) {
        b = Blocks[_i];
        cube = new THREE.CubeGeometry(this.rad, this.rad, this.rad, 1, 1, 1, this.texture(b));
        cubeBlocks[b] = cube;
      }
      return cubeBlocks;
    };

    Game.prototype.createGrassGeometry = function() {
      var dirt, grass, grass_dirt, materials, _ref;
      _ref = this.textures("grass_dirt", "grass", "dirt"), grass_dirt = _ref[0], grass = _ref[1], dirt = _ref[2];
      materials = [grass_dirt, grass_dirt, grass, dirt, grass_dirt, grass_dirt];
      return new THREE.CubeGeometry(this.rad, this.rad, this.rad, 1, 1, 1, materials);
    };

    Game.prototype.texture = function(name) {
      return TextureHelper.loadTexture("./textures/" + name + ".png");
    };

    Game.prototype.textures = function() {
      var name, names;
      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          _results.push(this.texture(name));
        }
        return _results;
      }).call(this);
    };

    Game.prototype.gridCoords = function(x, y, z) {
      return this.grid.gridCoords(x, y, z);
    };

    Game.prototype.intoGrid = function(x, y, z, val) {
      var args, _ref;
      args = this.gridCoords(x, y, z).concat(val);
      return (_ref = this.grid).put.apply(_ref, args);
    };

    Game.prototype.populateWorld = function() {
      var i, middle, pos, ret, setblockFunc, _ref;
      var _this = this;
      middle = this.grid.size / 2;
      ret = this.populateWorldFunction != null ? (setblockFunc = function(x, y, z, blockName) {
        return _this.cubeAt(x, y, z, _this.cubeBlocks[blockName]);
      }, this.populateWorldFunction(setblockFunc, middle)) : [middle, 3, middle];
      pos = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ret.length; _i < _len; _i++) {
          i = ret[_i];
          _results.push(i * CubeSize);
        }
        return _results;
      })();
      return (_ref = this.player.pos).set.apply(_ref, pos);
    };

    Game.prototype.cubeAt = function(x, y, z, geo, validatingFunction) {
      var halfcube, mesh;
      geo || (geo = this.geo);
      mesh = new Mesh(geo, new THREE.MeshFaceMaterial());
      mesh.geometry.dynamic = false;
      halfcube = CubeSize / 2;
      mesh.position.set(CubeSize * x, y * CubeSize + halfcube, CubeSize * z);
      mesh.name = "block";
      if (validatingFunction != null) if (!validatingFunction(mesh)) return;
      this.grid.put(x, y, z, mesh);
      this.scene.add(mesh);
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
    };

    Game.prototype.createCamera = function() {
      var camera;
      camera = new PerspectiveCamera(45, this.width / this.height, 1, 10000);
      camera.lookAt(vec(0, 0, 0));
      return camera;
    };

    Game.prototype.createRenderer = function() {
      var renderer;
      renderer = new WebGLRenderer({
        antialias: true
      });
      renderer.setSize(this.width, this.height);
      renderer.setClearColorHex(0xBFD1E5, 1.0);
      renderer.clear();
      $('#minecraft-container').append(renderer.domElement);
      return renderer;
    };

    Game.prototype.addLights = function(scene) {
      var ambientLight, directionalLight;
      ambientLight = new AmbientLight(0xaaaaaa);
      scene.add(ambientLight);
      directionalLight = new DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 0.5);
      directionalLight.position.normalize();
      return scene.add(directionalLight);
    };

    Game.prototype.defineControls = function() {
      var bindit, key, _i, _len, _ref;
      var _this = this;
      bindit = function(key) {
        $(document).bind('keydown', key, function() {
          return _this.keysDown[key] = true;
        });
        return $(document).bind('keyup', key, function() {
          return _this.keysDown[key] = false;
        });
      };
      _ref = "wasd".split('').concat('space');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        bindit(key);
      }
      $(document).bind('keydown', 'p', function() {
        return _this.togglePause();
      });
      $(this.canvas).mousedown(function(e) {
        return _this.onMouseDown(e);
      });
      $(this.canvas).mouseup(function(e) {
        return _this.onMouseUp(e);
      });
      return $(this.canvas).mousemove(function(e) {
        return _this.onMouseMove(e);
      });
    };

    Game.prototype.togglePause = function() {
      this.pause = !this.pause;
      if (this.pause === false) this.clock.start();
    };

    Game.prototype.relativePosition = function(e) {
      return [e.pageX - this.rendererPosition.left, e.pageY - this.rendererPosition.top];
    };

    Game.prototype.onMouseUp = function(event) {
      if (!this.moved && MouseEvent.isLeftButton(event)) {
        this.toDelete = this.relativePosition(event);
      }
      return this.moved = false;
    };

    Game.prototype.onMouseMove = function(event) {
      return this.moved = true;
    };

    Game.prototype.onMouseDown = function(event) {
      this.moved = false;
      if (!MouseEvent.isRightButton(event)) return;
      return this.castRay = this.relativePosition(event);
    };

    Game.prototype.deleteBlock = function() {
      var todir, vector, x, y, _ref;
      if (this.toDelete == null) return;
      _ref = this.toDelete, x = _ref[0], y = _ref[1];
      x = (x / this.width) * 2 - 1;
      y = (-y / this.height) * 2 + 1;
      vector = vec(x, y, 1);
      this.projector.unprojectVector(vector, this.camera);
      todir = vector.subSelf(this.camera.position).normalize();
      this.deleteBlockInGrid(new Ray(this.camera.position, todir));
      this.toDelete = null;
    };

    Game.prototype.findBlock = function(ray) {
      var o, _i, _len, _ref;
      _ref = ray.intersectScene(this.scene);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        if (o.object.name !== 'floor') return o;
      }
      return null;
    };

    Game.prototype.deleteBlockInGrid = function(ray) {
      var mesh, target, x, y, z, _ref;
      target = this.findBlock(ray);
      if (target == null) return;
      if (!this.withinHandDistance(target.object.position)) return;
      mesh = target.object;
      this.scene.remove(mesh);
      _ref = mesh.position, x = _ref.x, y = _ref.y, z = _ref.z;
      this.intoGrid(x, y, z, null);
    };

    Game.prototype.placeBlock = function() {
      var todir, vector, x, y, _ref;
      if (this.castRay == null) return;
      _ref = this.castRay, x = _ref[0], y = _ref[1];
      x = (x / this.width) * 2 - 1;
      y = (-y / this.height) * 2 + 1;
      vector = vec(x, y, 1);
      this.projector.unprojectVector(vector, this.camera);
      todir = vector.subSelf(this.camera.position).normalize();
      this.placeBlockInGrid(new Ray(this.camera.position, todir));
      this.castRay = null;
    };

    Game.prototype.getAdjacentCubePosition = function(target) {
      var normal, p;
      normal = target.face.normal.clone();
      p = target.object.position.clone().addSelf(normal.multiplyScalar(CubeSize));
      return p;
    };

    Game.prototype.addHalfCube = function(p) {
      p.y += CubeSize / 2;
      p.z += CubeSize / 2;
      p.x += CubeSize / 2;
      return p;
    };

    Game.prototype.getCubeOnFloorPosition = function(ray) {
      var o, ret, t, v;
      if (ray.direction.y >= 0) return null;
      ret = vec();
      o = ray.origin;
      v = ray.direction;
      t = (-o.y) / v.y;
      ret.y = 0;
      ret.x = o.x + t * v.x;
      ret.z = o.z + t * v.z;
      return this.addHalfCube(ret);
    };

    Game.prototype.selectCubeBlock = function(name) {
      return this.currentCube = this.cubeBlocks[name];
    };

    Game.prototype.getNewCubePosition = function(ray) {
      var target;
      target = this.findBlock(ray);
      if (target == null) return this.getCubeOnFloorPosition(ray);
      return this.getAdjacentCubePosition(target);
    };

    Game.prototype.createCubeAt = function(x, y, z) {
      var _this = this;
      return this.cubeAt(x, y, z, this.currentCube, function(cube) {
        return !_this.collisionHelper.collideWithCube(cube);
      });
    };

    Game.prototype.handLength = 7;

    Game.prototype.withinHandDistance = function(pos) {
      var dist;
      dist = pos.distanceTo(this.player.position());
      return dist <= CubeSize * this.handLength;
    };

    Game.prototype.placeBlockInGrid = function(ray) {
      var gridPos, p, x, y, z;
      p = this.getNewCubePosition(ray);
      if (p == null) return;
      gridPos = this.gridCoords(p.x, p.y, p.z);
      x = gridPos[0], y = gridPos[1], z = gridPos[2];
      if (!this.withinHandDistance(p)) return;
      if (!this.grid.insideGrid(x, y, z)) return;
      if (this.grid.get(x, y, z) != null) return;
      this.createCubeAt(x, y, z);
    };

    Game.prototype.collides = function() {
      return this.collisionHelper.collides();
    };

    Game.prototype.start = function() {
      var animate;
      var _this = this;
      animate = function() {
        if (!_this.pause) _this.tick();
        return requestAnimationFrame(animate, _this.renderer.domElement);
      };
      return animate();
    };

    Game.prototype.axes = ['x', 'y', 'z'];

    Game.prototype.iterationCount = 10;

    Game.prototype.moveCube = function(speedRatio) {
      var axis, iterationCount, originalpos, _i, _len, _ref;
      this.defineMove();
      iterationCount = Math.round(this.iterationCount * speedRatio);
      while (iterationCount-- > 0) {
        this.applyGravity();
        _ref = this.axes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          axis = _ref[_i];
          if (!(this.move[axis] !== 0)) continue;
          originalpos = this.player.position(axis);
          this.player.incPosition(axis, this.move[axis]);
          if (this.collides()) {
            this.player.setPosition(axis, originalpos);
            if (axis === 'y' && this.move.y < 0) this.onGround = true;
          } else if (axis === 'y' && this.move.y <= 0) {
            this.onGround = false;
          }
        }
      }
    };

    Game.prototype.playerKeys = {
      w: 'z+',
      s: 'z-',
      a: 'x+',
      d: 'x-'
    };

    Game.prototype.shouldJump = function() {
      return this.keysDown.space && this.onGround;
    };

    Game.prototype.defineMove = function() {
      var action, axis, baseVel, jumpSpeed, key, operation, vel, _ref;
      baseVel = .4;
      jumpSpeed = .8;
      this.move.x = 0;
      this.move.z = 0;
      _ref = this.playerKeys;
      for (key in _ref) {
        action = _ref[key];
        axis = action[0], operation = action[1];
        vel = operation === '-' ? -baseVel : baseVel;
        if (this.keysDown[key]) this.move[axis] += vel;
      }
      if (this.shouldJump()) {
        this.onGround = false;
        this.move.y = jumpSpeed;
      }
      this.garanteeXYNorm();
      this.projectMoveOnCamera();
    };

    Game.prototype.garanteeXYNorm = function() {
      var ratio;
      if (this.move.x !== 0 && this.move.z !== 0) {
        ratio = Math.cos(Math.PI / 4);
        this.move.x *= ratio;
        this.move.z *= ratio;
      }
    };

    Game.prototype.projectMoveOnCamera = function() {
      var frontDir, rightDir, x, z, _ref;
      _ref = this.controls.viewDirection(), x = _ref.x, z = _ref.z;
      frontDir = new Vector2(x, z).normalize();
      rightDir = new Vector2(frontDir.y, -frontDir.x);
      frontDir.multiplyScalar(this.move.z);
      rightDir.multiplyScalar(this.move.x);
      this.move.x = frontDir.x + rightDir.x;
      return this.move.z = frontDir.y + rightDir.y;
    };

    Game.prototype.applyGravity = function() {
      if (!(this.move.y < -1)) return this.move.y -= .005;
    };

    Game.prototype.setCameraEyes = function() {
      var eyesDelta, pos;
      pos = this.player.eyesPosition();
      this.controls.move(pos);
      eyesDelta = this.controls.viewDirection().normalize().multiplyScalar(20);
      eyesDelta.y = 0;
      pos.subSelf(eyesDelta);
    };

    Game.prototype.idealSpeed = 1 / 60;

    Game.prototype.tick = function() {
      var speedRatio;
      speedRatio = this.clock.getDelta() / this.idealSpeed;
      this.placeBlock();
      this.deleteBlock();
      this.moveCube(speedRatio);
      this.renderer.clear();
      this.controls.update();
      this.setCameraEyes();
      this.renderer.render(this.scene, this.camera);
    };

    return Game;

  })();

  BlockSelection = (function() {

    function BlockSelection(game) {
      this.game = game;
      this.current = "cobblestone";
    }

    BlockSelection.prototype.blockImg = function(name) {
      return "<img width='32' height='32' src='./textures/" + name + "icon.png' id='" + name + "'/>";
    };

    BlockSelection.prototype.mousedown = function(e) {
      if (e.target === this) return false;
      this.select(e.target.id);
      return false;
    };

    BlockSelection.prototype.mousewheel = function(delta) {
      var dif, index;
      dif = (delta >= 0 ? 1 : -1);
      index = (Blocks.indexOf(this.current) - dif).mod(Blocks.length);
      return this.select(Blocks[index]);
    };

    BlockSelection.prototype.ligthUp = function(target) {
      return this._setOpacity(target, 0.8);
    };

    BlockSelection.prototype.lightOff = function(target) {
      return this._setOpacity(target, 1);
    };

    BlockSelection.prototype.select = function(name) {
      if (this.current === name) return;
      this.game.selectCubeBlock(name);
      this.ligthUp(name);
      this.lightOff(this.current);
      return this.current = name;
    };

    BlockSelection.prototype._setOpacity = function(target, val) {
      return $("#" + target).css({
        opacity: val
      });
    };

    BlockSelection.prototype.insert = function() {
      var b, blockList, domElement;
      var _this = this;
      blockList = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = Blocks.length; _i < _len; _i++) {
          b = Blocks[_i];
          _results.push(this.blockImg(b));
        }
        return _results;
      }).call(this);
      domElement = $("#minecraft-blocks");
      domElement.append(blockList.join(''));
      this.ligthUp(this.current);
      domElement.mousedown(function(e) {
        return _this.mousedown(e);
      });
      $(document).mousewheel(function(e, delta) {
        return _this.mousewheel(delta);
      });
      return domElement.show();
    };

    return BlockSelection;

  })();

  window.Minecraft = {
    start: function(populateWorldFunction) {
      var game;
      $(document).bind("contextmenu", function() {
        return false;
      });
      if (!Detector.webgl) return Detector.addGetWebGLMessage();
      game = new Game(populateWorldFunction);
      new BlockSelection(game).insert();
      return game.start();
    }
  };

}).call(this);
