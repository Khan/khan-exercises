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
