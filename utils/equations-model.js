/*
   Khan equations model.
*/

jQuery.extend ( KhanUtil, {

	EquationsModel : function (expr) {

		// Public model interface
			
		jQuery.extend ( this, {

			// Return the solution
			solution : function () {
				var ast = KhanUtil.ast;
				if (solution === void 0) {
					solution = solve(rootNode).numberValue();
				}
				return solution;
			} ,
			

			// For navigating through the graphics DAG
			graph : function (selector) {
				var color = selector.indexOf("green") > 0 ? KhanUtil.GREEN : KhanUtil.BLUE;
				switch (selector) {
				case "hint":
					return {
						draw : function () {
							drawHint(rootNode, color)
						} ,
					}
				case "equation":
				default:
					return {
						draw : function () {
							drawEquation(rootNode, color)
						} ,
					}
				}
			} ,

		} );

		// Private implementation

		var ast  = KhanUtil.ast;
		var rootNid  = ast.fromExpr (expr);
		var rootNode = ast.node(rootNid);
		var solution;

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
				n = ast.node(ast.numberLiteral(val));
				break;
			case ast.Kind.UNARY:
				var val = solve(n.node("expr")).numberValue();
				switch (n.operator()) {
				case ast.UnOp.PAREN:
					// do nothing. precedence is encoded in ast.
					break;
				}
				n = ast.node(ast.numberLiteral(val));
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
				default:
					text = "\\"+textSize+"{\\color{"+color+"}{"+
						format(n.node("lhs"), textSize, color)+"} \\color{#000}{"+ n.operator() +"}\\color{"+color+"}{"+
						format(n.node("rhs"), textSize, color)+"}}";
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
				text = "\\"+textSize+"{\\color{"+color+"}{"+n.stringValue()+"}}";
				break;
			case ast.Kind.NUM:
				text = "\\"+textSize+"{\\color{"+color+"}{"+n.numberValue()+"}}";
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

			if (mainLabel !== void 0) {
				mainLabel.remove();
			}

			graph.init({
				range: [ [0, 12], [-1, 1] ],
				scale: 25,
			});

			mainLabel = graph.label( [0, 0], format(n, "Large", color), "right" );			
		}

		function drawHint(n, color) {
			var graph = KhanUtil.currentGraph;
			var ast = KhanUtil.ast;

			if (mainLabel !== void 0) {
				mainLabel.remove();
			}

			graph.init({
				range: [ [0, 4], [-1, 1] ],
				scale: 25,
			});

			mainLabel = graph.label( [0, 0], format(n, "normalsize", color), "right" );			
		}

	} ,  // EquationsModel

} );




KhanUtil.EquationsModel.init = function (expr) { 
	return new KhanUtil.EquationsModel(expr); 
};

