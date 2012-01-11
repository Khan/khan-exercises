/*
   Math model for Khan exercises

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

	parse : function (src) {

		var TK_NONE         = 0;
		var TK_ADD          = '+'.charCodeAt(0);
		var TK_CARET        = '^'.charCodeAt(0);
		var TK_COS          = 0x105;
		var TK_DIV          = '/'.charCodeAt(0);
		var TK_EQL          = '='.charCodeAt(0);
		var TK_FRAC         = 0x100;
		var TK_LN           = 0x107;
		var TK_LEFTBRACE    = '{'.charCodeAt(0);
		var TK_LEFTBRACKET  = '['.charCodeAt(0);
		var TK_LEFTPAREN    = '('.charCodeAt(0);
		var TK_MUL          = '*'.charCodeAt(0);
		var TK_NUM          = '0'.charCodeAt(0);
		var TK_PM           = 0x102;
		var TK_RIGHTBRACE   = '}'.charCodeAt(0);
		var TK_RIGHTBRACKET = ']'.charCodeAt(0);
		var TK_RIGHTPAREN   = ')'.charCodeAt(0);
		var TK_SEC          = 0x106;
		var TK_SIN          = 0x103;
		var TK_SQRT         = 0x101;
		var TK_SUB          = '-'.charCodeAt(0);
		var TK_TAN          = 0x104;
		var TK_VAR          = 'a'.charCodeAt(0);
		var TK_COEFF        = 'A'.charCodeAt(0);
		var TK_VAR          = 'a'.charCodeAt(0);
		var TK_NEXT         = 0x108;

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
			EQL: "=",
		};
		


		var util = KhanUtil;
		var ast = util.ast;
		var tokenToOperator = [ ];

		var T0=TK_NONE, T1=TK_NONE;

		tokenToOperator[TK_FRAC]  = OpStr.FRAC;
		tokenToOperator[TK_SQRT]  = OpStr.SQRT;
		tokenToOperator[TK_ADD]   = OpStr.ADD;
		tokenToOperator[TK_SUB]   = OpStr.SUB;
		tokenToOperator[TK_PM]    = OpStr.PM;
		tokenToOperator[TK_CARET] = OpStr.POW;
		tokenToOperator[TK_MUL]   = OpStr.MUL;
		tokenToOperator[TK_DIV]   = OpStr.FRAC;
		tokenToOperator[TK_SIN]   = OpStr.SIN;
		tokenToOperator[TK_COS]   = OpStr.COS;
		tokenToOperator[TK_TAN]   = OpStr.TAN;
		tokenToOperator[TK_SEC]   = OpStr.SEC;
		tokenToOperator[TK_LN]    = OpStr.LN;
		tokenToOperator[TK_EQL]   = OpStr.EQL;

		var scan = scanner(src);

		return {
			expr : expr ,
		};

		// begin private functions

		function start() {
			T0 = scan.start();
		}

		function hd () {
			//KhanUtil.assert(T0!==0, "hd() T0===0");
			return T0;
		}

		function lexeme () {
			return scan.lexeme();
		}

		function matchToken (t) {
			if (T0 == t) {
				next();
				return true;
			}
			return false;
		}

		function next () {
			T0 = T1;
			T1 = TK_NONE;
			if (T0 === TK_NONE) {
				T0 = scan.start();
			}
		}
		
		function replace (t) {
			T0 = t;
		}

		function eat (tc) {
			var tk = hd();
			if (tk !== tc) {
				alert("Expecting " + tc + " found " + tk);
			}
			next();
		}
		
		function match (tc) {
			var tk = hd();
			if (tk !== tc)
				return false;
			next();
			return true;
		}

		function primaryExpr () {
			var e;
			var t;
			var op;
			switch ((t=hd())) {
			case 'A'.charCodeAt(0):
				e = {op: "var", args: [lexeme()]};
				next();
				break;
			case 'a'.charCodeAt(0):
				e = {op: "var", args: [lexeme()]};
				next();
				break;
			case TK_NUM:
				e = Number(lexeme());
				next();
				break;
			case TK_LEFTPAREN:
				e = parenExpr();
				break;
			case TK_FRAC:
				next();
				e = {op: tokenToOperator[TK_FRAC], args: [braceExpr(), braceExpr()]};
				break;
			case TK_SQRT:
				next();
				switch(hd()) {
				case TK_LEFTBRACKET:
					e = {op: tokenToOperator[TK_SQRT], args: [bracketExpr(), braceExpr()]};
					break;
				case TK_LEFTBRACE:
					e = {op: tokenToOperator[TK_SQRT], args: [braceExpr()]};
					break;
				default:
					assert(false);
					break;
				}
				break;
			case TK_SIN:
			case TK_COS:
			case TK_TAN:
			case TK_SEC:
			case TK_LN:
				next();
				e = {op: tokenToOperator[t], args: [braceExpr()]};
				break;
			default:
				e = void 0;
				break;
			}
			return e;
		}

		function braceExpr() {
			eat(TK_LEFTBRACE);
			var e = commaExpr();
			eat(TK_RIGHTBRACE);
			return e;
		}

		function bracketExpr() {
			eat(TK_LEFTBRACKET);
			var e = commaExpr();
			eat(TK_RIGHTBRACKET);
			return e;
		}

		function parenExpr() {
			eat(TK_LEFTPAREN);
			var e = commaExpr();
			eat(TK_RIGHTPAREN);
			return e;
		}

		function unaryExpr() {
			var t;
			var expr;
			switch (t = hd()) {
			case TK_ADD:
				next();
				expr = unaryExpr();
				break;
			case TK_SUB:
				next();
				expr = negate(unaryExpr());
				break;
			default:
				expr = primaryExpr();
				break;
			}
			return expr;
		}

		function exponentialExpr() {
			var expr = unaryExpr();
			var t;
			while ((t=hd())===TK_CARET) {
				next();
				var expr2 = unaryExpr();
				if (expr2===1) {
					expr = expr;
				}
				else if (expr2===0) {
					expr = 1;
				}
				else {
					expr = {op: tokenToOperator[t], args: [expr, expr2]};
				}
			}

			return expr;
		}

		function multiplicativeExpr() {
			var expr = exponentialExpr();
			var t;

			while((t=hd())===TK_VAR || t===TK_LEFTPAREN) {
				var expr2 = exponentialExpr();
				if (expr2 === 1) {
					expr = expr;
				}
				else if (expr === 1) {
					expr = expr2;
				}
				else {
					expr = {op: OpStr.MUL, args: [expr, expr2]};
				}
			}

			while (isMultiplicative(t = hd())) {
				next();
				var expr2 = exponentialExpr();
				if (expr2===1) {
					expr = expr;
				}
				else if (t===TK_MUL && expr===1) {
					expr = expr2;
				}
				else {
					expr = {op: tokenToOperator[t], args: [expr, expr2]};
				}
			}
			return expr;

			function isMultiplicative(t) {
				return t===TK_MUL || t===TK_DIV;
			}
		}

		function isNeg(n) {
			if (jQuery.type(n)==="number") {
				return n < 0;
			}
			else {
				return n.args.length===1 &&	n.op===OpStr.SUB && n.args[0] > 0;  // is unary minus
			}
		}

		function negate(n) {
			if (jQuery.type(n)==="number") {
				return -n;
			}
			else if (n.args.length===1 && n.op===OpStr.SUB) {
				return n.args[0];  // strip the unary minus
			}
			// can't simplify, so multiply by -1
			return {op: "times", args: [-1, n]};
		
		}

		function additiveExpr() {
			var expr = multiplicativeExpr();
			var t;
			while (isAdditive(t = hd())) {
				next();
				var expr2 = multiplicativeExpr();
				if (t===TK_ADD && isNeg(expr2)) {
					t = TK_SUB;
					expr2 = negate(expr2);
				}
			    expr = {op: tokenToOperator[t], args: [expr, expr2]};
			}
			return expr;

			function isAdditive(t) {
				return t===TK_ADD || t===TK_SUB || t===TK_PM;
			}
		}

		function equalExpr() {
			var expr = additiveExpr();
			var t;
			while ((t = hd())===TK_EQL) {
				next();
				var expr2 = additiveExpr();
			    expr = {op: tokenToOperator[t], args: [expr, expr2]};
			}
			return expr;

		}

		function commaExpr ( ) {
			var n = equalExpr();
			return n;
		}

		function expr ( ) {
			start();
			var n = commaExpr();
			return n;
		}

		function scanner(src) {

			var curIndex = 0;
			var lexeme = "";

			var lexemeToToken = [ ];

			lexemeToToken["\\times"] = TK_MUL;
			lexemeToToken["\\div"]   = TK_DIV;
			lexemeToToken["\\frac"]  = TK_FRAC;
			lexemeToToken["\\sqrt"]  = TK_SQRT;
			lexemeToToken["\\pm"]    = TK_PM;
			lexemeToToken["\\sin"]   = TK_SIN;
			lexemeToToken["\\cos"]   = TK_COS;
			lexemeToToken["\\tan"]   = TK_TAN;
			lexemeToToken["\\sec"]   = TK_SEC;
			lexemeToToken["\\ln"]    = TK_LN;

			return {
				start : start ,
				lexeme : function () { return lexeme } ,
			}

			// begin private functions

			function start () {
				var c;
				lexeme = "";
				while (curIndex < src.length) {
					switch ((c = src.charCodeAt(curIndex++))) {
					case 32:  // space
					case 9:   // tab
					case 10:  // new line
					case 13:  // carriage return
						continue;
					case 92:  // backslash
						lexeme += String.fromCharCode(c);
						return latex();
					case 40:  // left paren
					case 41:  // right paren
					case 42:  // asterisk
					case 43:  // plus
					case 44:  // comma
					case 45:  // dash
					case 47:  // slash
					case 61:  // equal
					case 91:  // left bracket
					case 93:  // right bracket
					case 94:  // caret
					case 123: // left brace
					case 125: // right brace
						lexeme += String.fromCharCode(c);
						return c; // char code is the token id
					default:
						if (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0)) {
							lexeme += String.fromCharCode(c);
							return TK_COEFF;
						}
						else if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
							lexeme += String.fromCharCode(c);
							return TK_VAR;
						}
						else if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) {
							//lexeme += String.fromCharCode(c);
							//c = src.charCodeAt(curIndex++);
							//return TK_NUM;
							return number(c);
						}
						else {
							KhanUtil.assert( false, "scan.start(): c="+c);
							return 0;
						}
					}
				}
				return 0;
			}

			function number(c) {
				while (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) {
					lexeme += String.fromCharCode(c);
					c = src.charCodeAt(curIndex++);
				}
				curIndex--;
				
				return TK_NUM;
			}

			function latex() {
				var c = src.charCodeAt(curIndex++);
				while (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
					lexeme += String.fromCharCode(c);
					c = src.charCodeAt(curIndex++);
				}
				curIndex--;

				var tk = lexemeToToken[lexeme];
				if (tk===void 0) {
					tk = TK_VAR;   // e.g. \\theta
				}
				return tk;
			}

		}
	},
});

jQuery.extend ( KhanUtil, {

	MathModel : function (name) {

		// Model interface
			
		jQuery.extend ( this, {

			parse : parse,
			format : format,

			dumpAll : function () {
				return ast.dumpAll();
			} ,

			isEqual: function(n1, n2) {
				var ast = KhanUtil.ast;

				var nid1 = ast.intern(n1);
				var nid2 = ast.intern(n2);

				if (nid1===nid2) {
					return true;
				}

				if (n1.op===n2.op && n1.args.length===n2.args.length) {
					if (n1.args.length===2) {
						var n1arg0 = ast.intern(n1.args[0]);
						var n1arg1 = ast.intern(n1.args[1]);
						var n2arg0 = ast.intern(n2.args[0]);
						var n2arg1 = ast.intern(n2.args[1]);
						if (n1arg0===n2arg1 && n1arg1===n2arg0) {
							return true;
						}
					}
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
					assert(false, "MathModel.node(): invalid expr = " + expr);
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
					KhanUtil.assert(false, "MathModel.compute(): invalid options = " + options);
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

		// initialize the model here

		var util = KhanUtil;
		var ast  = util.ast;
		var solution;
		var mainLabel;

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

		return this;

		// private implementation

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

		function expand(n) {
		}

		function parse(str) {
			return KhanUtil.parse(str).expr();
		}

		function format(n, textSize, color) {

			if (textSize===void 0) {
				textSize = "normalsize";
			}

			if (color===void 0) {
				color = void 0;  // just use black for now
			}

			if (jQuery.type(n)==="string") {
				n = parse(n);
			}

			var ast = KhanUtil.ast;
			var text;
			if (jQuery.type(n)==="object") {
			    switch (n.op) {
				case OpStr.VAR:
					text = "\\color{"+color+"}{"+n.args[0]+"}";
					break;
			    case OpStr.SUB:
					if (n.args.length===1) {
						text = "\\"+textSize+"{\\color{#000}{"+ OpToLaTeX[n.op] +"}\\color{"+color+"}{"+
							format(n.args[0], textSize, color)+"}}";
					}
					else {
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(n.args[0], textSize, color)+"} \\color{#000}{"+ OpToLaTeX[n.op] +"}\\color{"+color+"}{"+
							format(n.args[1], textSize, color)+"}}";
					}
				    break;
			    case OpStr.DIV:
				case OpStr.PM:
				case OpStr.EQL:
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
					if (rhs===1) {
						text = lhsText;
					}
					else {
						text = lhsText + "^{" +	rhsText + "}";
					}
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

					if ((lhs.args && lhs.args.length===2) || (rhs.args && rhs.args.length===2)) {
						var lhsText = format(lhs, textSize, color);
						var rhsText = format(rhs, textSize, color);
						// if subexpr is lower precedence, wrap in parens
						if (lhs.op===OpStr.ADD || lhs.op===OpStr.SUB) {
							lhsText = "\\"+textSize+"{\\color{#000}{(}}\\color{"+color+"}{"+lhsText+"}\\color{#000}{)}";
						}
						if (rhs.op===OpStr.ADD || rhs.op===OpStr.SUB) {
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
						// replace plus with minus and negate operand.
						text = "\\"+textSize+"{\\color{"+color+"}{"+
							format(lhs, textSize, color)+"} \\color{#000}{-}\\color{"+color+"}{"+
							format(negate(rhs), textSize, color)+"}}";
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
			else if (n.args.length===1) {
				return n.op===OpStr.SUB && n.args[0] > 0;  // is unary minus
			}
			else if (n.args.length===2) {
				return n.op===OpStr.MUL && isNeg(n.args[0]);  // leading term is neg
			}
		}

		function negate(n) {
			if (jQuery.type(n)==="number") {
				return -n;
			}
			else if (n.args.length===1 && n.op===OpStr.SUB) {
				return n.args[0];  // strip the unary minus
			}
			else if (n.args.length===2 && n.op===OpStr.MUL && isNeg(n.args[0])) {
				n.args[0] = negate(n.args[0]);
				return n;
			}
			assert(false);
			return n;
		
		}

		function isZero(n) {
			if (jQuery.type(n)==="number") {
				return n === 0;
			}
			else {
				return n.args.length===1 &&	n.op===OpStr.SUB && n.args[0] === 0;  // is unary minus
			}
		}
	
	} ,  // MathModel

} );

KhanUtil.MathModel.init = function() {
	return new KhanUtil.MathModel();
};
