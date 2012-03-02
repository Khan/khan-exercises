/*
   ASTs for Khan Exercises

   @see http://artcompiler.org/articles/asts-for-khan-exercises.pdf

   var node = ast.node(nid);  // returns a node object corresponding to nid
   var expr = ast.node("lhs");
   var answer = ast.node("rhs");
   var kind	= node.kind();
   var op = node.operator();

   NOTE: this file is a work in progress and will be expanded as needed to support
   syntax for new exercises.

   @author: Jeff Dyer

*/

jQuery.extend ( KhanUtil, {


	ASSERT: false,

	assert: function (val, str) {
		if ( !this.ASSERT ) {
			return;
		}
		if ( str === void 0 ) {
			str = "failed!";
		}
		if ( !val ) {
			alert("assert: " + str);
		}
	},

	ast: new function () {

		var nodePool = [ "unused" ];	// nodePool[0] is reserved

		// maps for fast lookup of nodes
		var numberMap = { };
		var stringMap = { };
		var nodeMap = { };

		// KhanUtil.ast public interface

		jQuery.extend ( this, {
			fromLaTeX: fromLaTeX,			
			toLaTeX: toLaTeX,
			eval: eval,
			intern: intern,
			node: node,
			dump: dump,
			dumpAll: dumpAll,
		} );

		return this;  // end control flow

		// private implementation

		function fromLaTeX(str, model) {
			if (model===void 0) {
				model = KhanUtil.MathModel.init();   // default model
			}
			return model.parse(str);
		}

		function toLaTeX(n, model) {
			if (model===void 0) {
				model = KhanUtil.MathModel.init();   // default model
			}
			return model.format(n, "large", KhanUtil.BLUE);
		}

		function eval(n) {
			KhanUtil.assert(false);
			return void 0;
		}

		function intern(n) {
			// nodify number and string literals
			if (jQuery.type(n) === "number") {
				var nid = numberMap[n];
				if (nid === void 0) {
					nodePool.push({op:"num", args: [n]});
					nid = nodePool.length - 1;
					numberMap[n] = nid;
				}
			}
			else if (jQuery.type(n) === "string") {
				var nid = stringMap[n];
				if (nid === void 0) {
					nodePool.push({op:"str", args: [n]});
					nid = nodePool.length - 1;
					stringMap[n] = nid;
				}
			}
			else {
				var op = n.op;
				var count = n.args.length;
				var args = "";
				var args_nids = [ ];
				for (var i=0; i < count; i++) {
					args += args_nids[i] = intern(n.args[i]);
				}
				var key = op+count+args;
				var nid = nodeMap[key];
				if (nid === void 0) {
					nodePool.push({
						op: op,
						args: args_nids,
					});
					nid = nodePool.length - 1 ;
					nodeMap[key] = nid;
				}
			}
			return nid;
		}

		function node(nid) {
			var n = jQuery.extend(true, {}, nodePool[nid]);
			// if literal, then unwrap.
			switch (n.op) {
			case "NUM":
			case "STR":
				n = n.args[0];
				break;
			default:
				for (var i=0; i < n.args.length; i++) {
					n.args[i] = node(n.args[i]);
				}
				break;
			}
			return n;
		}

		function dumpAll() {
			var s = "";
			for (var i=1; i < nodePool.length; i++) {
				var n = nodePool[i];
				s = s + "<p>" + i+": "+dump(n) + "</p>";
			}
			return s;
		}

		function dump(n) {
			
			if (jQuery.type(n) === "object") {
				switch (n.op) {
				case "num":
					var s = n.args[0];
					break;
				case "str":
					var s = "\""+n.args[0]+"\"";
					break;
				default:
					var s = "{ op: \"" + n.op + "\", args: [ ";
					for (var i=0; i < n.args.length; i++) {
						if (i > 0) {
							s += " , ";
						}
						s += dump(n.args[i]);
					}
					s += " ] }";
					break;
				}
			}
			else if (jQuery.type(n)==="string") {
				var s = "\""+n+"\"";
			}
			else {
				var s = n;
			}
			return s;
		}

	} (),
});
