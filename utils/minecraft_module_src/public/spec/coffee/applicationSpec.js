(function() {
  var cube, importAll, isFalse, isTrue, same, vec;
  var __hasProp = Object.prototype.hasOwnProperty;
  importAll = function(from) {
    var _i, _ref, _result, i;
    _result = []; _ref = from;
    for (i in _ref) {
      if (!__hasProp.call(_ref, i)) continue;
      _i = _ref[i];
      _result.push(global[i] = from[i]);
    }
    return _result;
  };
  same = function(thi, that) {
    return expect(thi).toEqual(that);
  };
  isTrue = function(val) {
    return same(val, true);
  };
  isFalse = function(val) {
    return same(val, false);
  };
  require('specBrowserAdapter');
  require('lib/rbcoffee');
  require('collision');
  cube = function(vmin, vmax) {
    return {
      vmin: vmin,
      vmax: vmax
    };
  };
  vec = function(x, y, z) {
    return {
      x: x,
      y: y,
      z: z
    };
  };
  describe("Intersection utils", function() {
    it("can decide interval collision", function() {
      var collides;
      collides = CollisionUtils.testIntervalCollision;
      isTrue(collides(0, 9, 6, 12));
      isTrue(collides(1, 5, 2, 3));
      isTrue(collides(1, 5, 1, 10));
      isFalse(collides(1, 5, 6, 10));
      return isFalse(collides(6, 10, 1, 5));
    });
    it("can decide when unrotated cubes don't collide ", function() {
      var collides, cube1, cube2;
      collides = CollisionUtils.testCubeCollision;
      cube1 = cube(vec(0, 0, 0), vec(50, 50, 50));
      cube2 = cube(vec(60, 60, 60), vec(150, 150, 150));
      return isFalse(collides(cube1, cube2));
    });
    return it("can decide when unrotated cubes do collide ", function() {
      var collides, cube1, cube2;
      collides = CollisionUtils.testCubeCollision;
      cube1 = cube(vec(822.5, 43, 22.5), vec(847.5, 123, 47.5));
      cube2 = cube(vec(775, 50, 25), vec(825, 100, 75));
      return isTrue(collides(cube1, cube2));
    });
  });
window.cube = cube
window.importAll = importAll
window.isFalse = isFalse
window.isTrue = isTrue
window.same = same
window.vec = vec
}).call(this);
