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

		Node.prototype = new NodeClass();


		// maps for fast lookup of nodes
		var numberMap = { };
		var stringMap = { };
		var nodeMap = { };

		var OpStr = {
			ADD: "+",
			SUB: "-",
			MUL: "times",
			DIV: "div",
			FRAC: "frac",
			EQL: "=",
			ATAN2: "atan2",
			SQRT: "sqrt",
			PM: "pm",
			SIN: "sin",
			COS: "cos",
			TAN: "tan",
			SEC: "sec",
			LN: "ln",
			VAR: "var",
			COMMA: ",",
			POW: "^",
			ABS: "abs",
			PAREN: "()",
			HIGHLIGHT: "hi",
		};
		
		function fromLaTeX(str) {
			return KhanUtil.parse(str).expr();
		}

		function toLaTeX(n) {
			return format(n, "Large", KhanUtil.BLUE);
		}

		var OpToLaTeX = { }
		OpToLaTeX[OpStr.ADD] = "+";
		OpToLaTeX[OpStr.SUB] = "-";
		OpToLaTeX[OpStr.MUL] = "\\times";
		OpToLaTeX[OpStr.DIV] = "\\div";
		OpToLaTeX[OpStr.FRAC] = "\\frac";
		OpToLaTeX[OpStr.EQL] = "=";
		OpToLaTeX[OpStr.ATAN2] = "\\atan2";
		OpToLaTeX[OpStr.POW] = "^";
		OpToLaTeX[OpStr.PM] = "\\pm";
		OpToLaTeX[OpStr.SIN] = "\\sin";
		OpToLaTeX[OpStr.COS] = "\\cos";
		OpToLaTeX[OpStr.TAN] = "\\tan";
		OpToLaTeX[OpStr.SEC] = "\\sec";
		OpToLaTeX[OpStr.LN] = "\\ln";

		function format(n, textSize, color) {
			var ast = KhanUtil.ast;
			var text;
			if (jQuery.type(n)==="object") {
			    switch (n.op) {
				case OpStr.VAR:
					text = "\\color{"+color+"}{"+n.args[0]+"}";
					break;
			    case OpStr.SUB:
			    case OpStr.DIV:
				case OpStr.PM:
				    text = "\\"+textSize+"{\\color{"+color+"}{"+
					    format(n.args[0], textSize, color)+"} \\color{#000}{"+ OpToLaTeX[n.op] +"}\\color{"+color+"}{"+
					    format(n.args[1], textSize, color)+"}}";
				    break;
				case OpStr.POW:
					var lhs = n.args[0];
					var rhs = n.args[1];
					var lhsText = format(lhs, textSize, color);
					var rhsText = format(rhs, textSize, color);
					// if subexpr is lower precedence, wrap in parens
					if (lhs.op===OpStr.ADD || lhs.op===OpStr.SUB || 
						lhs.op===OpStr.MUL || lhs.op===OpStr.DIV || 
						lhs.op===OpStr.SQRT) {
						lhsText = "\\"+textSize+"{\\color{#000}{(}}\\color{"+color+"}{"+lhsText+"}\\color{#000}{)}";
					}
					text = lhsText + "^{" +	rhsText + "}";
					break;
				case OpStr.SIN:
				case OpStr.COS:
				case OpStr.TAN:
				case OpStr.SEC:
				case OpStr.LN:
					text = "\\"+textSize+"{\\color{"+"#000"+"}{"+
						OpToLaTeX[n.op]+"{"+format(n.args[0], textSize, color)+"}}}";
					break;
				case OpStr.FRAC:
					text = "\\"+textSize+"{\\color{"+"#000"+"}{"+
						"\\dfrac{"+format(n.args[0], textSize, color)+
						"}{" +format(n.args[1], textSize, color)+"}}}";
					break;
				case OpStr.SQRT:
					switch (n.args.length) {
					case 1:
						text = "\\"+textSize+"{\\color{"+"#000"+"}{"+
							"\\sqrt{"+format(n.args[0], textSize, color)+"}}}";
						break;
					case 2:
						text = "\\"+textSize+"{\\color{"+"#000"+"}{"+
							"\\sqrt["+format(n.args[0], textSize, color)+
							"]{" +format(n.args[1], textSize, color)+"}}}";
						break;
					}
					break;
				case OpStr.COMMA:
					text = "\\" + textSize + "{\\color{"+color + "}{" +
						format(n.args[0], textSize, color) + "} \\ \\ \\color{" +
						color + "}{" + format(n.args[1], textSize, color) + "}}";
					break;
				case OpStr.MUL:
					var lhs = n.args[0];
					var rhs = n.args[1];
					if (jQuery.type(lhs)==="number" && lhs===1) {
						// elide coefficient when it is 1.
						text = format(rhs, textSize, color);
					}
					else if (jQuery.type(lhs)==="number" && lhs===-1) {
						// elide coefficient when it is 1.
						text = "\\color{#000}{-}"+format(rhs, textSize, color);
					}
					else if ((lhs.args && lhs.args.length===2) || (rhs.args && rhs.args.length===2)) {
						var lhsText = format(lhs, textSize, color);
						var rhsText = format(rhs, textSize, color);
						// if subexpr is lower precedence, wrap in parens
						if (lhs.op===OpStr.ADD || lhs.op===OpStr.SUB) {
							lhsText = "\\"+textSize+"{\\color{#000}{(}}\\color{"+color+"}{"+lhsText+"}\\color{#000}{)}";
						}
						if (rhs.op===ast.OpStr.ADD || rhs.op===ast.OpStr.SUB) {
							rhsText = "\\"+textSize+"{\\color{#000}{(}}\\color{"+color+"}{"+rhsText+"}\\color{#000}{)}";
						}
						text = lhsText + rhsText;
					}
					else if (rhs.op===OpStr.PAREN || jQuery.type(lhs==="number")) {
						// elide the times symbol if rhs is parenthesized or lhs is a coef
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{"+color+"}{"+
							format(rhs, textSize, color)+"}}";
					}
					else if (rhs.op===OpStr.PAREN || jQuery.type(rhs)==="string") {
						// elide the times symbol if rhs is parenthesized or a var
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{"+color+"}{"+
							format(rhs, textSize, color)+"}}";
					}
					else {
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{#000}{"+ OpToLaTeX[n.op] +"}\\color{"+color+"}{"+
							format(rhs, textSize, color)+"}}";
					}
					break;
				case OpStr.ADD:
					var lhs = n.args[0];
					var rhs = n.args[1];
					if (isNeg(rhs)) {
						// elide the plus symbol if the rhs has alreading minus.
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{"+color+"}{"+
							format(rhs, textSize, color)+"}}";
					}
					else if (isZero(rhs)) {
						// elide the operator and rhs.
						text = format(lhs, textSize, color);
					}
					else {
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{#000}{"+ OpToLaTeX[n.op] +"}\\color{"+color+"}{"+
							format(rhs, textSize, color)+"}}";
					}
					break;
				default:
					text = "\\"+textSize+"{\\color{"+color+"}{"+
						format(n.args[0], textSize, color)+"} \\color{#000}{"+ OpToLaTeX[n.op] +"}\\color{"+color+"}{"+
						format(n.args[1], textSize, color)+"}}";
					break;
				}
			}
			else {
				text = "\\color{"+color+"}{"+n+"}";
			}
			return text;
		}


		function isNeg(n) {
			if (jQuery.type(n)==="number") {
				return n < 0;
			}
			else {
				return n.args.length===1 &&	n.op===OpStr.SUB && n.args[0] > 0;  // is unary minus
			}
		}

		function isZero(n) {
			if (jQuery.type(n)==="number") {
				return n === 0;
			}
			else {
				return n.args.length===1 &&	n.op===OpStr.SUB && n.args[0] === 0;  // is unary minus
			}
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

		// KhanUtil.ast public interface

		jQuery.extend ( this, {
			OpStr: OpStr,
			fromLaTeX: fromLaTeX,			
			toLaTeX: toLaTeX,
			eval: eval,
			intern: intern,
			node: node,
			dump: dump,
			dumpAll: dumpAll,
		} );

		return this;

	} (),
});
