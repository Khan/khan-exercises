/*

  This module defines an object model for Khan exercises. The core data structure
  for a model is an abstract syntax tree. An AST is provided when constructing a
  model.

  The basic usage, assuming an "addition" plugin:

      var node = {op: "+", args: [1, 2]};
      var model = Model(node).makeDefaultContext();
	  var latex = model.math("parse", "1+2").math("format", {"color": "blue"});

  Model ASTs have the structure:

      { op: "+", 
        args: [1, 2], 
        style: {"num": blue},
        data: {"key1": "value1", "key2": "value2"},
      }


  @author: jeffdyer@acm.org
*/


jQuery.extend ( KhanUtil, {

	Model : function (node) {

		var Model = KhanUtil.Model;
		init.prototype = Model.prototype;
		return new init(node);

		// make me a model
		function init(node) {

			if (node===void 0) {
				node = {};
			}

			// initialize the state of 'this' object
			switch (jQuery.type(node)) {
			case "string":
				if (!Model.parse) {
					jQuery.error("Model.bind not implemented");
				}
				node = Model.parse(node);
				break;
			case "object":
				// node is already an AST
				break;
			}

			jQuery.extend( this, {
				node: node,
			});
			return this;
		}

	}, // Model end

});

// model core methods
(function ($) {

	var Model = $;

	// Here are the set of model methods. This set will grow to meet
	// the needs of exercise writers. In particular, we expect more
	// jQuery traversing-like methods to be added.

	Model.prototype = {
		bind: bind,
		data: data,
		prop: prop,
		trigger: trigger,
		triggerHandler: triggerHandler,
		unbind: unbind,
		css: css,
		find: find,
		append: append,
	};

	function bind() {
		jQuery.error("Model.bind not implemented");
	};

	// add a property to the style attribute of the current node

	// jQuery like css() method
	function css(prop, val) {
		var n = this.node;
		if (!n.style) {
			n.style = {}
		}

		if (!val) {
			if (jQuery.type(prop) === "object") {
				jQuery.extend(n.style, prop);
				return this;
			}
			else {
				return n.style[prop];
			}
		}
		else {
			KhanUtil.assert(typeof prop === "string", "Model.css: invalid argument");
			n.style[prop] = val;
			return this;
		}
	}

	function select(selector, n) {
		switch (selector) {
		case "num":
			if (typeof n === "number" || n.op === "num") {
				return true;
			}
			break;
		case "+":
			if (n.op === "+") {
				return true;
			}
		}
		return false;
	}

	function find(selector) {
		var n = this.node;
		var a = Model({op: "list", args: []});
		if (n===void 0) {
			return a;
		}
		if (select(selector, n)) {
			a.append(n);
		}
		jQuery.each(n.args, function (index, n) {
			if (select(selector, n)) {
				a.append(n);
			}
			a.append(find.call(n, selector));
		});
		return a;
	}

	function append(data) {
		var n = this.node;
		KhanUtil.assert(jQuery.type(n) === "object", "invalid this to Model.append");
		if (jQuery.type(data)==="object" && data.node!==void 0) {
			switch (data.node.op) {
			case "list":
				n.args.concat(data.node.args);
				break;
			default:
				KhanUtil.assert(false, "invalid input to Model.append");
				break;
			}
		}
		else {
			n.args.concat(data);
		}
	}

	function data() {
		jQuery.error("Model.data not implemented");
	}

	function prop() {
		jQuery.error("Model.prop not implemented");
	}

	function trigger() {
		jQuery.error("Model.trigger not implemented");
	}

	function triggerHandler() {
		jQuery.error("Model.triggerHandler not implemented");
	}

	function unbind() {
		jQuery.error("Model.unbind not implemented");
	}

})(KhanUtil.Model);