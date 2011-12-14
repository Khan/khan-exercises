/*
   Khan exercise polynomial model

   This is an exercise models, a kind of object model that reflects the
   semantics that are specific to a class of exercises. This one is designed for
   supporting the writing of exercises involving polynomials. Models have a
   structure that mirrors the structure of Khan exercisesa and its requirement
   to display problems, solutions and hints. Models hide the details of formatting and
   drawing text and graphics, and also of managing the state of the underlying
   equations.

   The general usage is as follows:

	  model = PolynomialModel.init();
	  problem = model.equation(["+", ["+", ["^", "x", 2], ["*", B, "x"]], C]);
	  problem.format(); // returning the latex for the equation
	  problem.draw();   // drawing the equation inside a grphie div
	  solution = model.equation(["*", ["+", a+"x"], ["+", b+"x"]]);
	  solution.format();
	  ... ditto for the incorrect choices
	  choice1 = model.equation([...]);
	  choice1.format();
	  ... hints can be derived from existing ASTs or constructed similarly

   To get html representing all of the AST nodes in the node pool, call:

	  model.dumpAll()

   For a complete example of using this model, see factoring_trinomials_1.html

   @author: Jeff Dyer

*/

jQuery.extend ( KhanUtil, {

	PolynomialModel : function (name) {

		// Model interface
			
		jQuery.extend ( this, {

			dumpAll : function () {
				return ast.dumpAll();
			} ,

			isEqual: function(nid1, nid2) {
				if (nid1===nid2) {
					return true;
				}

				var n1 = ast.node(nid1);
				var n2 = ast.node(nid2);
				if (n1.kind()===ast.Kind.BINARY &&
					n2.kind()===ast.Kind.BINARY &&
					n1.operator()===n2.operator() &&
					n1.nid("lhs")===n2.nid("rhs") &&
					n1.nid("rhs")===n2.nid("lhs")) {
					return true;
				}
				return false;
			},

			// Return the expression associated with the given value.
			node : function (expr) {
				switch (jQuery.type(expr)) {
				case "string":
					return nodes[expr];
				case "number":
					return ast.node(expr, this);
				case "array":
					var nid = ast.fromExpr(expr);
					return ast.node(nid, this);
				default:
					assert(false, "PolynomialModel.node(): invalid expr = " + expr);
				}
				
			} ,

			// Return an AST for the given expression.
			expr : function f (expr) {
				var nid = ast.fromExpr(expr, f);
				return ast.node(nid, this);
			} ,

			// Compute some result based the given node.
			compute : function (options, nid) {
				var node = (nid===void 0) ? rootNode : ast.node(nid, this);
				var ast = KhanUtil.ast;
				var result;
				switch (options) {
				case "coefficients":
					// return an array containing the coefficient of each term by degree
					result = computeCoefficients(node);
				default:
					KhanUtil.assert(false, "PolynomialModel.compute(): invalid options = " + options);
					result = void 0;
					break;
				}

				return result;
			} ,

			// Return the solution
			solution : function (nid) {
				var node = (nid===void 0) ? rootNode : ast.node(nid, this);
				var ast = KhanUtil.ast;
				if (solution === void 0) {
					solution = compute(node).numberValue();
				}
				return solution;
			} ,

			// Graph part for all of a node.
			graph : function (options, nid) {
				var node = (nid===void 0) ? rootNode : ast.node(nid, this);
				var color = options.indexOf("green") >= 0 ? KhanUtil.GREEN :
							options.indexOf("orange") >= 0 ? KhanUtil.ORANGE : KhanUtil.BLUE;
				var mode = options.indexOf("hint") >= 0 ? "hint" : "expr";
				switch (mode) {
				case "hint":
					return {
						draw : function () {
							drawHint(node, color)
						} ,
					}
				case "expr":
				default:
					return {
						draw : function () {
							drawExpr(node, color)
						} ,
					}
				}
			} ,

			// Generate the text for all or part of a node.
			text : function (options, nid) {
				var node = (nid===void 0) ? rootNode : ast.node(nid, this);
				switch (options) {
				case "latex":
				default:
					return {
						format : function () {
							return format(node, "normalsize", KhanUtil.BLUE);
						} ,
					}
				};
			} ,

		} );

		// Private implementation

		function isValidAST(n) {
			return n.kind() !== void 0;
		}

		// This method returns the AST for some computation on the given ast.
		// For example, n.compute("factors") might compute the factors of the
		// polynomial represented by 'n'.

		function compute(options, n) {
			if (!isValidAST(n)) {
				KhanUtil.assert( false, "need valie AST. got " + n.constructor);
				return void 0;
			}

			return n;
		}

		function format(n, textSize, color) {
			var ast = KhanUtil.ast;
			var text;
			switch (n.kind()) {
			case ast.Kind.BINARY:
				switch (n.operator()) {
				case ast.BinOp.POW:
					text = format(n.node("lhs"), textSize, color) + "^{" +
						format(n.node("rhs"), textSize, color)+"}";
					break;
				case ast.BinOp.DIV:
					text = "\\"+textSize+"{\\color{"+"#000"+"}{"+
						"\\dfrac{"+format(n.node("lhs"), textSize, color)+
						"}{" +format(n.node("rhs"), textSize, color)+"}}}";
					break;
				case ast.BinOp.COMMA:
					text = "\\" + textSize + "{\\color{"+color + "}{" +
						format(n.node("lhs"), textSize, color) + "} \\ \\ \\color{" +
						color + "}{" + format(n.node("rhs"), textSize, color) + "}}";
					break;
				case ast.BinOp.MUL:
					var lhs = n.node("lhs");
					var rhs = n.node("rhs");
					if (lhs.kind()==ast.Kind.NUM && lhs.numberValue()===1) {
						// elide coefficient when it is 1.
						text = format(rhs, textSize, color);
					}
					else if (lhs.kind()==ast.Kind.NUM && lhs.numberValue()===-1) {
						// elide coefficient when it is 1.
						text = "\\color{#000}{-}"+format(rhs, textSize, color);
					}
					else if (lhs.kind()===ast.Kind.BINARY || rhs.kind()===ast.Kind.BINARY) {
						var lhsText = format(lhs, textSize, color);
						var rhsText = format(rhs, textSize, color);
						// if subexpr is lower precedence, wrap in parens
						if (lhs.operator()===ast.BinOp.ADD || lhs.operator()===ast.BinOp.SUB) {
							lhsText = "\\"+textSize+"{\\color{#000}{(}}\\color{"+color+"}{"+lhsText+"}\\color{#000}{)}";
						}
						if (rhs.operator()===ast.BinOp.ADD || rhs.operator()===ast.BinOp.SUB) {
							rhsText = "\\"+textSize+"{\\color{#000}{(}}\\color{"+color+"}{"+rhsText+"}\\color{#000}{)}";
						}
						text = lhsText + rhsText;
					}
					else if (rhs.operator()===ast.UnOp.PAREN ||
						lhs.kind()===ast.Kind.NUM) {
						// elide the times symbol if either operand is parenthesized
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{"+color+"}{"+
							format(rhs, textSize, color)+"}}";
					}
					else if (rhs.operator()===ast.UnOp.PAREN || rhs.kind()===ast.Kind.STR) {
						// elide the times symbol if either operand is parenthesized
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(n.node("lhs"), textSize, color)+"} \\color{"+color+"}{"+
							format(n.node("rhs"), textSize, color)+"}}";
					}
					else {
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{#000}{"+ n.operator() +"}\\color{"+color+"}{"+
							format(rhs, textSize, color)+"}}";
					}
					break;
				default:
					if (n.operator()===ast.BinOp.ADD) {
						var plain = formatPlain(n.node("rhs"));
						if (plain.indexOf("-")===0) {
							// elide the plus symbol if the rhs has aleading minus.
							text = "\\"+textSize+"{\\color{"+color+"}{"+
								format(n.node("lhs"), textSize, color)+"} \\color{"+color+"}{"+
								format(n.node("rhs"), textSize, color)+"}}";
						}
						else if (plain.indexOf("0")===0) {
							// elide the operator and rhs.
							text = format(n.node("lhs"), textSize, color);
						}
						else {
							text = "\\"+textSize+"{\\color{"+color+"}{"+
								format(n.node("lhs"), textSize, color)+"} \\color{#000}{"+ n.operator() +"}\\color{"+color+"}{"+
								format(n.node("rhs"), textSize, color)+"}}";
						}
					}
					else {
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(n.node("lhs"), textSize, color)+"} \\color{#000}{"+ n.operator() +"}\\color{"+color+"}{"+
							format(n.node("rhs"), textSize, color)+"}}";
					}
					break;
				}
				break;
			case ast.Kind.UNARY:
				switch (n.operator()) {
				case ast.UnOp.HIGHLIGHT:
					text = format(n.node("expr"), textSize, KhanUtil.ORANGE);
					break;
				case ast.UnOp.PAREN:
					text = "\\"+textSize+"{\\color{#000}{(}}\\color{"+color+"}{"+format(n.node("expr"), textSize)+"}\\color{#000}{)}";
					break;
				case ast.UnOp.BRACKET:
					text = "\\"+textSize+"{\\color{#000}{[}}\\color{"+color+"}{"+format(n.node("expr"), textSize)+"}\\color{#000}{]}";
					break;
				default:
					break;
				}
				break;
			case ast.Kind.STR:
				if (n.stringValue().indexOf("-")===0) {
					// color the minus sign black like all the other operators
					var str = n.stringValue();
					text = "\\"+textSize+"{\\color{#000}{-}\\color{"+color+"}{"+(str.substring(1,str.length))+"}}";
				}
				else {
					text = "\\"+textSize+"{\\color{"+color+"}{"+n.stringValue()+"}}";
				}
				break;
			case ast.Kind.NUM:
				if (n.numberValue() < 0) {
					// color the minus sign black like all the other operators
					text = "\\"+textSize+"{\\color{#000}{-}\\color{"+color+"}{"+(-n.numberValue())+"}}";
				}
				else {
					text = "\\"+textSize+"{\\color{"+color+"}{"+n.numberValue()+"}}";
				}
				break;
			default:
				break;
			}
			return text;
		}
	
		function formatPlain(n) {
			var ast = KhanUtil.ast;
			var text;
			switch (n.kind()) {
			case ast.Kind.BINARY:
				switch (n.operator()) {
				case ast.BinOp.POW:
					text = formatPlain(n.node("lhs")) + "^" + formatPlain(n.node("rhs"));
					break;
				case ast.BinOp.DIV:
					text = formatPlain(n.node("lhs")) + "/" + formatPlain(n.node("rhs"));
					break;
				case ast.BinOp.COMMA:
					text = formatPlain(n.node("lhs")) + "," + formatPlain(n.node("rhs"));
					break;
				case ast.BinOp.MUL:
					text = formatPlain(n.node("lhs")) + "*" + formatPlain(n.node("rhs"));
					break;
				default:
					text = formatPlain(n.node("lhs")) + n.operator() + formatPlain(n.node("rhs"));
					break;
				}
				break;
			case ast.Kind.UNARY:
				switch (n.operator()) {
				case ast.UnOp.HIGHLIGHT:
					text = formatPlain(n.node("expr"));
					break;
				case ast.UnOp.PAREN:
					text = "(" + format(n.node("expr")) + "}";
					break;
				default:
					break;
				}
				break;
			case ast.Kind.STR:
				text = n.stringValue();
				break;
			case ast.Kind.NUM:
				text = n.numberValue();
				break;
			default:
				break;
			}
			return ""+text;
		}
	
		var mainLabel;

		function drawExpr (n, color) {
			var graph = KhanUtil.currentGraph;
			var ast = KhanUtil.ast;

			graph.init({
				range: [ [0, 12], [-1, 1] ],
				scale: 25,
			});

			mainLabel = graph.label( [0, 0], format(n, "Large", color), "right" );			
		}

		function drawHint(n, color) {
			var graph = KhanUtil.currentGraph;
			var ast = KhanUtil.ast;

			graph.init({
				range: [ [0, 4], [-1, 1] ],
				scale: 25,
			});

			graph.label( [0, 0], format(n, "normalsize", color), "right" );			
		}

		// initialize the model here

		var util = KhanUtil;
		var ast  = util.ast;
		var solution;

		return this;

	} ,  // PolynomialModel

} );

KhanUtil.PolynomialModel.init = function (name) {
	return new KhanUtil.PolynomialModel(name);
};

