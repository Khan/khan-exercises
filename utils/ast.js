/*
   ASTs for Khan Exercises

   @see http://artcompiler.org/articles/asts-for-khan-exercises.pdf

   var nid = ast.fromExpr(["=", ["+", 1, 1], 2]));
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

		var defaultModel = KhanUtil.MathModel.init();   // default model

		// maps for fast lookup of nodes
		var numberMap = { };
		var stringMap = { };
		var nodeMap = { };

		Node.prototype = new NodeClass();

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
				model = defaultModel;
			}
			return model.parse(str);
		}

		function toLaTeX(n, model) {
			if (model===void 0) {
				model = defaultModel;
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

		// Wrapper for navigating ASTs
		function NodeClass (model) {

			jQuery.extend ( this, {

				// n.node("lhs").numberValue()
				node: function (selector, m) {
					var nid = this.nid();
					var newNid = nodePool[nid][selector];
					KhanUtil.assert(selector in nodePool[nid], "invalid selector");
					return new Node(newNid, (m===void 0) ? model: m);
				},

				graph: function (selector) {
					KhanUtil.assert(model!==void 0, "ast.Node.graph(): model undefined");
					return model.graph(selector, nid);
				},

				draw: function () {
					KhanUtil.assert(model!==void 0, "ast.Node.draw(): model undefined");
					return model.graph("", nid).draw();
				},

				text: function (selector) {
					KhanUtil.assert(model!==void 0, "ast.Node.text(): model undefined");
					return model.text(selector, nid);
				},

				format: function (options) {
					KhanUtil.assert(model!==void 0, "ast.Node.format(): model undefined");
					return model.text("", nid).format();
				},

				numberValue: function () {
					return Number(nodePool[nid].val);
				},

				intValue: function () {
					return Number(nodePool[nid].val) << 0;
				},

				stringValue: function () {
					var ast = KhanUtil.ast;
					var n = nodePool[nid];
					if (n.kind === ast.Kind.STR || n.kind === ast.Kind.NUM) {
						return String(n.val);
					}
					else {
						return "";
					}
				},

				operator: function (selector) {
					var node = nodePool[nid];
					//KhanUtil.assert( node.op !== void 0, "ast.Node.operator(): node has no operator." );
					return node.op;
				},

				kind: function () {
					var node = nodePool[nid];
					KhanUtil.assert( node.kind !== void 0, "ast.Node.operator(): node has no kind." );
					return node.kind;
				},

				model: function () {
					KhanUtil.assert(model!==void 0, "ast.Node.model(): model undefined");
					return model;
				},

				nid: function (selector, m) {
					if (selector===void 0) {
						return nid;
					}
					else {
						KhanUtil.assert(selector in nodePool[nid], "invalid selector");
						return nodePool[nid][selector];
					}
				},

			} ) ;
		}

		function Node(n) {
			this.op = n.op;
			this.args = n.args;
			this.nid  = n.nid;
		}

	} (),
});
