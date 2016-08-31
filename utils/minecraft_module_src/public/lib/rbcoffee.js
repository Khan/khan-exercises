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
