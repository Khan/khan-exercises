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
	  problem = model.equation(["+", ["+", "x^2", "Bx"], C]);
	  problem.format(); // returning the latex for the equation
	  problem.draw();   // drawing the equation inside a grphie div
	  solution = model.equation(["*", ["PAREN", ["+", a+"x"]], ["PAREN, ["+", b+"x"]]]);
	  solution.format();
	  ... ditto for the incorrect choices
	  choice1 = model.equation([...]);
	  choice1.format();
	  ... hints can be derived from existing ASTs or constructed similarly

   To get html representing all of the AST nodes in the node pool, call:

	  model.dumpAll()

   Pre-defined initializers can be developed for existing exercises. For example,

	  model = PolynomialModel.init("Factoring Trinomials 1");

   returns a model that is initialized with the core equations of an appropriate
   problem and its solution. Thus, instead of constructing the equations from
   the exercise HTML, the exercise writer can simply refer to them by name.

	  problem = model.node("problem");
	  solution = model.node("solution");
	  choice1 = model.node("choice 1");
	  ... etc

   For a complete example of using this model, see factoring_trinomials_1.html
*/

jQuery.extend ( KhanUtil, {

	PolynomialModel : function (name) {

		// Public model interface
			
		jQuery.extend ( this, {

			dumpAll : function () {
				return ast.dumpAll();
			} ,

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

			equation : function (expr) {
				var nid = ast.fromExpr(expr);
				return ast.node(nid, this);
			} ,

			// source to AST translation
			parse : function (src) {
				assert (false);
			} ,

			// Return the solution
			solution : function (nid) {
				var node = (nid===void 0) ? rootNode : ast.node(nid, this);
				var ast = KhanUtil.ast;
				if (solution === void 0) {
					solution = solve(node).numberValue();
				}
				return solution;
			} ,

			graph : function (selector, nid) {
				var node = (nid===void 0) ? rootNode : ast.node(nid, this);
				var color = selector.indexOf("green") >= 0 ? KhanUtil.GREEN : 
							selector.indexOf("orange") >= 0 ? KhanUtil.ORANGE : KhanUtil.BLUE;
				var mode = selector.indexOf("hint") >= 0 ? "hint" : "equation";
				switch (mode) {
				case "hint":
					return {
						draw : function () {
							drawHint(node, color)
						} ,
					}
				case "equation":
				default:
					return {
						draw : function () {
							drawEquation(node, color)
						} ,
					}
				}
			} ,

			text : function (selector, nid) {
				var node = (nid===void 0) ? rootNode : ast.node(nid, this);
				switch (selector) {
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
		
		// This method returns the AST of the solution.
		function solve (n) {
			if (!isValidAST(n)) {
				KhanUtil.assert ( false, "need valie AST. got " + n.constructor);
				return void 0;
			}

			var val;
			switch (n.kind()) {
			case ast.Kind.BINARY:
				var lhs = solve(n.node("lhs")).numberValue();
				var rhs = solve(n.node("rhs")).numberValue();
				switch (n.operator()) {
				case ast.BinOp.ADD:
					val = lhs + rhs;
					break;
				case ast.BinOp.SUB:
					val = lhs - rhs;
					break;
				case ast.BinOp.MUL:
					val = lhs * rhs;
					break;
				case ast.BinOp.DIV:
					val = lhs / rhs;
					break;
				}
				n = ast.node(ast.numberLiteral(val), this);
				break;
			case ast.Kind.UNARY:
				var val = solve(n.node("expr")).numberValue();
				switch (n.operator()) {
				case ast.UnOp.PAREN:
					// do nothing. precedence is encoded in ast.
					break;
				}
				n = ast.node(ast.numberLiteral(val), this);
				break;
			case ast.Kind.STR:
			case ast.Kind.NUM:
				// do nothing
				break;
			default:
				KhanUtil.assert (false, "math-operations-model.solve(): missing case or invalid input");
				n = void 0;
				break;
			}

			return n;

		}

		function format(n, textSize, color) {
			var ast = KhanUtil.ast;
			var text;
			switch (n.kind()) {
			case ast.Kind.BINARY:
				switch (n.operator()) {
				case ast.BinOp.DIV:
					text = "\\"+textSize+"{\\color{"+"#000"+"}{"+
						"\\dfrac{"+format(n.node("lhs"), textSize, color)+"}{"+format(n.node("rhs"), textSize, color)+"}}}";
					break;
				case ast.BinOp.COMMA:
					text = "\\"+textSize+"{\\color{"+color+"}{"+
						format(n.node("lhs"), textSize, color)+"} \\ \\ \\color{"+color+"}{"+
						format(n.node("rhs"), textSize, color)+"}}";
					break;
				default:
					if (n.operator()===ast.BinOp.ADD && (n.node("rhs").numberValue() < 0 || n.node("rhs").stringValue().indexOf("-")===0)) {
						// elide the plus symbol if the rhs has aleading minus.
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(n.node("lhs"), textSize, color)+"} \\color{"+color+"}{"+
							format(n.node("rhs"), textSize, color)+"}}";
					}
					else 
					if (n.operator()===ast.BinOp.MUL && n.node("lhs").operator()===ast.UnOp.PAREN || n.node("rhs").operator()===ast.UnOp.PAREN) {
						// elide the times symbol if either operand is parenthesized
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(n.node("lhs"), textSize, color)+"} \\color{"+color+"}{"+
							format(n.node("rhs"), textSize, color)+"}}";
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
	
		var mainLabel;

		function drawEquation (n, color) {
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

		// initialize the model

		var util = KhanUtil;
		var ast  = KhanUtil.ast;
		var nodes = { };

		switch (name) {
		case "Factoring Trinomials 1":
			var a_val = util.randRangeNonZero(-4, 4);
			var b_val = util.randRange(6, 19);
			var c_val = util.randRange(20, 29);
			var a_nid = ast.numberLiteral(a_val);
			var b_nid = ast.numberLiteral(b_val);
			var A_nid = ast.numberLiteral(1);
			var B_nid = ast.numberLiteral(a_val+b_val);
			var C_nid = ast.numberLiteral(a_val*b_val);
			var p_nid = ast.fromExpr(["+", ["+", "x^2", (a_val+b_val)+"x"], a_val*b_val]);
			var s_nid = ast.fromExpr(["*",  ["PAREN", ["+", "x", a_val]], ["PAREN", ["+", "x", b_val]]]);
			var c1_nid = ast.fromExpr(["*", ["PAREN", ["+", "x", b_val]], ["PAREN", ["+", "x", b_val]]]);
			var c2_nid = ast.fromExpr(["*", ["PAREN", ["+", "x", a_val]], ["PAREN", ["+", "x", a_val]]]);
			var c3_nid = ast.fromExpr(["*", ["PAREN", ["+", "x", c_val]], ["PAREN", ["+", "x", b_val]]]);
			nodes["a"] = ast.node(a_nid, this);
			nodes["b"] = ast.node(b_nid, this);
			nodes["A"] = ast.node(A_nid, this);
			nodes["B"] = ast.node(B_nid, this);
			nodes["C"] = ast.node(C_nid, this);
			nodes["problem"] = ast.node(p_nid, this);
			nodes["solution"] = ast.node(s_nid, this);
			nodes["choice 1"] = ast.node(c1_nid, this);
			nodes["choice 2"] = ast.node(c2_nid, this);
			nodes["choice 3"] = ast.node(c3_nid, this);
			var rootNode = nodes["problem"];
			break;
		case "Factoring Trinomials 2":
			var A_val = util.getPrimeFactorization(util.randRange(10, 30))[0];
			var a_val = A_val;
			var b_val = util.randRange(1, 9);
			var c_val = 1;
			var d_val = util.randRangeNonZero(-4, 4);
			var B_val = b_val*c_val+a_val*d_val;
			var C_val = b_val*d_val;
			var a_nid = ast.numberLiteral(a_val);
			var b_nid = ast.numberLiteral(b_val);
			var A_nid = ast.numberLiteral(A_val);
			var B_nid = ast.numberLiteral(B_val);
			var C_nid = ast.numberLiteral(C_val);
			var p_nid = ast.fromExpr(["+", ["+", A_val+"x^2", B_val+"x"], C_val]);
			var s_nid = ast.fromExpr(["*",  ["PAREN", ["+", a_val+"x", b_val]], ["PAREN", ["+", c_val+"x", d_val]]]);
			var c1_nid = ast.fromExpr(["*", ["PAREN", ["+", "x", b_val]], ["PAREN", ["+", "x", b_val]]]);
			var c2_nid = ast.fromExpr(["*", ["PAREN", ["+", "x", a_val]], ["PAREN", ["+", "x", a_val]]]);
			var c3_nid = ast.fromExpr(["*", ["PAREN", ["+", "x", c_val]], ["PAREN", ["+", "x", b_val]]]);
			nodes["a"] = ast.node(a_nid, this);
			nodes["b"] = ast.node(b_nid, this);
			nodes["A"] = ast.node(A_nid, this);
			nodes["B"] = ast.node(B_nid, this);
			nodes["C"] = ast.node(C_nid, this);
			nodes["problem"] = ast.node(p_nid, this);
			nodes["solution"] = ast.node(s_nid, this);
			nodes["choice 1"] = ast.node(c1_nid, this);
			nodes["choice 2"] = ast.node(c2_nid, this);
			nodes["choice 3"] = ast.node(c3_nid, this);
			var rootNode = nodes["problem"];
			break;
		default:
			break;

		}

		var solution;

		return this;

	} ,  // PolynomialModel

} );

KhanUtil.PolynomialModel.init = function (name) { 
	return new KhanUtil.PolynomialModel(name); 
};

