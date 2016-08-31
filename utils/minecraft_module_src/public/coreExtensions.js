
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
