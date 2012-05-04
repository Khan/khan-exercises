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
