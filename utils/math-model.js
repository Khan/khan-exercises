jQuery.extend ( KhanUtil, {

	OpStr : {
		ADD: "+",
		SUB: "-",
		MUL: "*",
		TIMES: "times",
		CDOT: "cdot",
		DIV: "div",
		FRAC: "frac",
		DFRAC: "dfrac",
		EQL: "=",
		GT: ">",
		LT: "<",
		GEQ: ">=",
		LEQ: "<=",
		ATAN2: "atan2",
		SQRT: "sqrt",
		PM: "pm",
		SIN: "sin",
		COS: "cos",
		TAN: "tan",
		SEC: "sec",
		COT: "cot",
		CSC: "csc",
		LN: "ln",
		VAR: "var",
		CST: "cst",
		COMMA: ",",
		POW: "^",
		ABS: "abs",
		PAREN: "()",
		HIGHLIGHT: "hi",
		DERIV: "deriv",
		NEQ: "!=",
		NUM: "num",
	},

	MathModel : function (name) {

		// Model interface
		
		jQuery.extend ( this, {
			parseFormat: parseFormat,
			parse: parse,
			format: format,
			formatGroup: formatGroup,
			polynomial: polynomial,
			graph: graph,
			evalExpr: evalExpr,
			isEqual: isEqual,
		} );

		// initialize the model here
		var OpStr = KhanUtil.OpStr;
		
		var OpToLaTeX = { }
		OpToLaTeX[OpStr.ADD] = "+";
		OpToLaTeX[OpStr.SUB] = "-";
		OpToLaTeX[OpStr.MUL] = "\\times";
		OpToLaTeX[OpStr.TIMES] = "\\times";
		OpToLaTeX[OpStr.CDOT] = "\\cdot";
		OpToLaTeX[OpStr.DIV] = "\\div";
		OpToLaTeX[OpStr.FRAC] = "\\frac";
		OpToLaTeX[OpStr.DFRAC] = "\\dfrac";
		OpToLaTeX[OpStr.EQL] = "=";
		OpToLaTeX[OpStr.LT] = "<";
		OpToLaTeX[OpStr.GT] = ">";
		OpToLaTeX[OpStr.LEQ] = "\\leq";
		OpToLaTeX[OpStr.GEQ] = "\\geq";
		OpToLaTeX[OpStr.ATAN2] = "\\atan2";
		OpToLaTeX[OpStr.POW] = "^";
		OpToLaTeX[OpStr.PM] = "\\pm";
		OpToLaTeX[OpStr.SIN] = "\\sin";
		OpToLaTeX[OpStr.COS] = "\\cos";
		OpToLaTeX[OpStr.TAN] = "\\tan";
		OpToLaTeX[OpStr.SEC] = "\\sec";
		OpToLaTeX[OpStr.COT] = "\\cot";
		OpToLaTeX[OpStr.CSC] = "\\csc";
		OpToLaTeX[OpStr.LN] = "\\ln";
		OpToLaTeX[OpStr.COMMA] = ",";
		OpToLaTeX[OpStr.NEQ] = "\\not=";
		OpToLaTeX[OpStr.SQRT] = "\\sqrt";

		return this;  // end initialization

		// private implementation

		function graph(n, color, range) {
			var graph = KhanUtil.currentGraph;

			function g(x) {
				// set up the lexical environment for evaluating ast n
				var env = {x: x};
				var val = evalExpr(n, env);
				return val;
			}

			if (!range) {
				range = 10;
			}


			if (graph.last) {
				jQuery(graph).remove();
				graph.last.remove();

				graph.style({
					stroke: color,
					strokeWidth: 3,
					fill: "none",
					clipRect:[ [-range, -range], [2*range, 2*range] ],
					arrows: null
				});
				
				graph.last = graph.plot( g, [-10, 10] );
			}
			else {
				graph.graphInit({
					range: range+1,
					scale: 20,
					axisArrows: "&lt;-&gt;",
					tickStep: 1,
					labelStep: 1
				});
				graph.style({
					stroke: color,
					strokeWidth: 3,
					fill: "none",
					clipRect:[ [-range, -range], [2*range, 2*range] ],
					arrows: null
				});
				
				graph.plot( g, [-range, range] );
				graph.last = graph.plot( g, [-range, range] );
			}
			
		}

		function isValidAST(n) {
			return n.kind() !== void 0;
		}

		function isEqual(n1, n2) {
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
		}

		function polynomial(coeffs, ident, lhs) {
			// construct a polynomial expression
			// build left recursive ast

			if (coeffs.length === 0) {
				// we're done
				return lhs;
			}

			if (ident === void 0) {
				// default identifier
				ident = "x";
			}

			if (coeffs.length === 1) {
				// degree zero
				var rhs = coeffs[0]
			}
			else {
				// construct a term of degree given by the size of coeffs
				var rhs = {op: "times", args: [coeffs[0], {op: "^", args: [{op: "var", args: [ident]}, coeffs.length-1]}]};
			}

			if (coeffs[0] === 0) {
				// zero coefficient, erase term by not updating lhs
			}
			else if (lhs === void 0) {
				// first term, no lhs to contribute, so rhs is lhs
				var lhs = rhs;
			}
			else {
				// normal case
				if (lhs.op===rhs.op && jQuery.type(lhs.args)==="array") {
					lhs.args.push(rhs);
				}
				else {
					lhs = {op: "+", args: [lhs, rhs]}
				}
			}

			// recurse until no more coefficients
			return polynomial(coeffs.slice(1), ident, lhs);
		}

		function parse(str, colors) {
			// call the parser defined below
			return KhanUtil.parse(str, colors).expr();
		}

                function getAlignment(expr, index, hphantom, addSpacing) {
                        if ((expr.align === undefined) || (expr.align[index] === undefined)) {
				return "";
                        }
			var str = "";
			for (var cur = 0; cur < expr.align[index]; cur++) {
				if (hphantom) {
					str += "} & \\hphantom{ ";
				} else {
					str += "& ";
				}
			}
			if ((expr.align[index] > 0) && addSpacing) {
				str += "\\; ";
			}
			return str;
                }

		function isTrigOrLog(op) {
			return ((op === OpStr.SIN) || (op === OpStr.COS) || (op === OpStr.TAN) || 
				(op === OpStr.SEC) || (op === OpStr.COT) || (op === OpStr.CSC) || 
				(op === OpStr.LN));
		}

		function getChildColors(colors, iChild) {
			var childColors;
			if (colors instanceof Array) {
				childColors = colors[iChild];
			} else if (colors.children !== undefined) {
				childColors = colors.children[iChild];
			}
			return childColors;
		}

		function addOpColor(text, colors, index, spacingBefore, spacingAfter) {
			if ((colors === undefined) || (colors[index] === undefined)) {
				return text + " ";
			}
			var str = "\\color{"+colors[index]+"}{";
			if (spacingBefore) {
				str += "\\;";
			}
			str += text + " ";
			if (spacingAfter) {
				str += "\\;";
			}
			str += "}";
			return str;
		}

		function addColor(text, color) {
			if (color === undefined) {
				return text;
			}
			return "\\color{"+color+"}{"+text+"}";
		}

		function parseFormat(text, colors, hphantom, textSize) {
			var expr = parse(text, colors);
			var str = format(expr, textSize, hphantom);
			if (hphantom) {
				str = "\\hphantom{" + str + "}";
			}
			return str;
		}

		function formatGroup(group, selection) {
			var str = "\\begin{alignat}{5}";
			for (var iExpr = 0; iExpr < group.length; iExpr++) {
				if ($.inArray(iExpr, selection) === -1) {
					var expr = group[iExpr];
					str += "\\hphantom{" + format(expr, undefined, true) + "} \\\\";
				}
			}
			for (var iSel = 0; iSel < selection.length; iSel++) {
				str += format(group[selection[iSel]]) + " \\\\";
				if (iSel != selection.length - 1) {
					str += "\\\\";
				}
			}
			str += "\\end{alignat}";
			return str;
		}

		function exprIsNumber(expr) {
			if (expr === undefined) {
				return false;
			}
			return ((typeof expr === "number") || (expr.op === OpStr.NUM));
		}

		// format an AST
		function format(n, textSize, hphantom) {

			if (textSize===void 0) {
				textSize = "normalsize";
			}
			if (n === undefined) {
				return "";
			}
			var text;

			if (jQuery.type(n)==="number") {
				text = "" + n;
			}
			else if (jQuery.type(n)==="object") {

				// format sub-expressions
				if ((n.op !== "var") && (n.op !== "cst")) {
					var args = [];
					for (var i = 0; i < n.args.length; i++) {
						args[i] = format(n.args[i], textSize, hphantom);
					}
				}

				// format operator
				switch (n.op) {
				case OpStr.NUM:
					text = n.args[0];
					break;
				case OpStr.VAR:
				case OpStr.CST:
					text = getAlignment(n, 0, hphantom);
					text += n.args[0];
					text += getAlignment(n, 1, hphantom);
					break;
				case OpStr.SUB:
					if (n.args.length===1) {
						text = getAlignment(n, 0, hphantom, true);
						text += addOpColor(OpToLaTeX[n.op], n.opsColors, 0, true, false) + args[0];
						text += getAlignment(n, 1, hphantom);
					}
					else {
						text = args[0];
						text += getAlignment(n, 0, hphantom, true);
						text += addOpColor(OpToLaTeX[n.op], n.opsColors, 0, true, true);
						text += getAlignment(n, 1, hphantom, true);
						text += args[1];
					}
					break;
				case OpStr.DIV:
				case OpStr.PM:
				case OpStr.EQL:
				case OpStr.LT:
				case OpStr.GT:
				case OpStr.LEQ:
				case OpStr.GEQ:
				case OpStr.NEQ:
					text = args[0];
					text += getAlignment(n, 0, hphantom, true);
					text += addOpColor(OpToLaTeX[n.op], n.opsColors, 0, true, true) + " ";
					text += getAlignment(n, 1, hphantom, true);
					text += args[1];
					break;
				case OpStr.POW:
					// if subexpr is lower precedence, wrap in parens
					var lhs = n.args[0];
					var rhs = n.args[1];
					if ((typeof lhs === "object") && isTrigOrLog(lhs.op)) {
						text = OpToLaTeX[lhs.op] + getAlignment(n, 0, hphantom) + "^" + getAlignment(n,1, hphantom);
						text += "{" + args[1] + "}";
						text += format(lhs.args[0], textSize, hphantom);
						break;
					}
					if ((lhs.args && lhs.args.length===2) || (rhs.args && rhs.args.length===2)) {
						if (lhs.op===OpStr.ADD || lhs.op===OpStr.SUB ||
							lhs.op===OpStr.MUL || lhs.op===OpStr.DIV ||
							lhs.op===OpStr.SQRT) {
							args[0] = "(" + args[0] + ")";
						}
					}
					text = args[0] + getAlignment(n, 0, hphantom) + "^" + getAlignment(n, 1, hphantom) + "{" + args[1] + "}";
					break;
				case OpStr.SIN:
				case OpStr.COS:
				case OpStr.TAN:
				case OpStr.SEC:
				case OpStr.COT:
				case OpStr.CSC:
				case OpStr.LN:
					text = addOpColor(OpToLaTeX[n.op], n.opsColors, 0, false, true) + "{" + args[0] + "}";
					break;
				case OpStr.FRAC:
				case OpStr.DFRAC:
					text = addOpColor(OpToLaTeX[n.op], n.opsColors, 0, false, false) + "{" + args[0] + "}{" + args[1] + "}";
					break;
                                case OpStr.DERIV:
                                        text = "\\dfrac{d" + args[0] + "}{d" + args[1] + "}";
                                        break; 
				case OpStr.SQRT:
					switch (args.length) {
					case 1:
						text = addOpColor(OpToLaTeX[n.op], n.opsColors, 0) + "{" + args[0] + "}";
						break;
					case 2:
						text = addOpColor(OpToLaTeX[n.op] + "[" + args[0] + "]", n.opsColors, 0) + "{" + args[0] + "}";
						break;
					}
					break;
				case OpStr.MUL:
				case OpStr.CDOT:
				case OpStr.TIMES:
					// if subexpr is lower precedence, wrap in parens
					var prevTerm;
					text = "";
					jQuery.each(n.args, function (index, term) {
						var opIndex = index - 1;
						if ((term.args && (term.args.length >= 2) && (term.op !== OpStr.POW)) ||
							!((n.op === OpStr.MUL) && (term.op === OpStr.PAREN ||
								 term.op===OpStr.POW ||
								 term.op===OpStr.VAR ||
								 term.op===OpStr.CST ||
								 (exprIsNumber(prevTerm) && !exprIsNumber(term))
							))) {
							if (((term.op===OpStr.ADD) || (term.op===OpStr.SUB)) && (term.args.length > 1)) {
								args[index] = "(" + args[index] + ")";
							}
							if (opIndex >= 0) {
								text += getAlignment(n, opIndex * 2, hphantom, true);
								text += addOpColor(OpToLaTeX[n.op], n.opsColors, opIndex, true, true);
								text += getAlignment(n, opIndex * 2 + 1, hphantom, true);
							}
							text += args[index];
						}
						// elide the times symbol if rhs is parenthesized or a var, or lhs is a number
						// and rhs is not a number
						else {
							text += args[index];
						}
						prevTerm = term;
					});
					break;
				case OpStr.ADD:
				case OpStr.COMMA:
					jQuery.each(args, function (index, value) {
						var opIndex = index - 1;
						if (index === 0) {
							text = value;
						}
						else {
							text += getAlignment(n, opIndex * 2, hphantom, true);
							text += addOpColor(OpToLaTeX[n.op], n.opsColors, opIndex, true, true);
							text += getAlignment(n, opIndex * 2 + 1, hphantom, true);
							text += value;
						}
					});
					break;
				case OpStr.PAREN:
					text = getAlignment(n, 0, hphantom);
					text += addOpColor("(", n.opsColors, 0, false, false);
					text += getAlignment(n, 1, hphantom);
					text += args[0];
					text += getAlignment(n, 2, hphantom);
					text += addOpColor(")", n.opsColors, 1, false, false);
					text += getAlignment(n, 3, hphantom);
					break;
				case OpStr.ABS:
					text = addOpColor("|", n.opsColors, 0, false, false) + args[0] +
						addOpColor("|", n.OpsColors, 1, false, false);
					break;
				default:
					KhanUtil.assert(false, "unimplemented eval operator");
					break;
				}
			}
			else {
				KhanUtil.assert(false, "invalid expression type");
			}
			text = addColor(text, n.color);
			return text;
		}
		
		function evalExpr(n, env) {

			var ast = KhanUtil.ast;
			var assert = KhanUtil.assert;

			var val;

			if (jQuery.type(n)==="string" ||
				jQuery.type(n)==="number") {
				val = n;
			}
			else
				if (jQuery.type(n)==="object") {
					var args = [];
					for (var i = 0; i < n.args.length; i++) {
						args[i] = eval(n.args[i], env);
					}
					
					switch (n.op) {
					case OpStr.NUM:
						val = args[0];
						break;
					case OpStr.VAR:
					case OpStr.CST:
						assert(args.length===1, "wrong number of arguments to var or cst");
						val = env[args[0]];
						break;
					case OpStr.SUB:
						assert(args.length===2, "wrong number of arguments to subtract");
						switch (args.length) {
						case 1:
							val = -args[0];
							break;
						case 2:
							val = args[0] - args[1];
							break;
						}
						break;
					case OpStr.DIV:
					case OpStr.FRAC:
					case OpStr.DFRAC:
						assert(args.length===2, "wrong number of arguments to div/frac");
						val = args[0] / args[1];
						break;
					case OpStr.POW:
						assert(args.length===2, "wrong number of arguments to pow");
						val = Math.pow(args[0], args[1]);
						break;
					case OpStr.SIN:
						assert(args.length===1, "wrong number of arguments to sin");
						val = Math.sin(args[0]);
						break;
					case OpStr.COS:
						assert(args.length===1, "wrong number of arguments to cos");
						val = Math.cos(args[0]);
						break;
					case OpStr.TAN:
						assert(args.length===1, "wrong number of arguments to tan");
						val = Math.tan(args[0]);
						break;
					case OpStr.SQRT:
						assert(args.length < 3, "wrong number of arguments to sqrt");
						switch (args.length) {
						case 1:
							val = Math.sqrt(args[0]);
							break;
						case 2:
							val = Math.pow(args[0], 1/args[1]);
							break;
						}
						break;
					case OpStr.MUL:
					case OpStr.CDOT:
					case OpStr.TIMES:
						var val = 1;
						jQuery.each(args, function (index, value) {
							val *= value;
						});
						break;
					case OpStr.ADD:
						var val = 0;
						jQuery.each(args, function (index, value) {
							val += value;
						});
						break;
					case OpStr.PAREN:
						var val = args[0];
						break;
					case OpStr.SEC:
					case OpStr.COT:
					case OpStr.CSC:
					case OpStr.LN:
					case OpStr.PM:
					case OpStr.EQL:
					case OpStr.NEQ:
					case OpStr.LT:
					case OpStr.GT:
					case OpStr.LEQ:
					case OpStr.GEQ:
					case OpStr.COMMA:
					default:
						KhanUtil.assert(false, "unimplemented eval operator");
						break;
					}
				}
			else {
				KhanUtil.assert(false, "invalid expression type");
			}
			
			return val;
		}
		
		function isNeg(n) {
			if (jQuery.type(n)==="number") {
				return n < 0;
			}
			else if (n.op === OpSTR.NUM) {
				return n.args[0] < 0
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
				return {op: n.op, args: [negate(n.args[0]), n.args[1]]};
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
		
	} , // MathModel

} );

KhanUtil.MathModel.init = function() {
	// this is the entry point for the model
	return new KhanUtil.MathModel();
};

jQuery.extend ( KhanUtil, {

	parse: function (src, colors) {
		if (colors === undefined) {
			colors = [];
		}
		var TK_NONE		= 0;
		var TK_ADD		= '+'.charCodeAt(0);
		var TK_CARET		= '^'.charCodeAt(0);
		var TK_DIV		= '/'.charCodeAt(0);
		var TK_EQL		= '='.charCodeAt(0);
		var TK_LT		= '<'.charCodeAt(0);
		var TK_GT		= '>'.charCodeAt(0);
		var TK_LEFTBRACE	= '{'.charCodeAt(0);
		var TK_LEFTBRACKET	= '['.charCodeAt(0);
		var TK_LEFTPAREN	= '('.charCodeAt(0);
		var TK_MUL		= '*'.charCodeAt(0);
		var TK_NUM		= '0'.charCodeAt(0);
		var TK_RIGHTBRACE 	= '}'.charCodeAt(0);
		var TK_RIGHTBRACKET	= ']'.charCodeAt(0);
		var TK_RIGHTPAREN	= ')'.charCodeAt(0);
		var TK_SUB		= '-'.charCodeAt(0);
		var TK_VAR		= 'a'.charCodeAt(0);
		var TK_COEFF		= 'A'.charCodeAt(0);
		var TK_VAR		= 'a'.charCodeAt(0);
		var TK_ABS		= '|'.charCodeAt(0);
		var TK_COMMA		= ','.charCodeAt(0);
		var TK_SPACE		= ' '.charCodeAt(0);
		var TK_BACKSLASH	= '\\'.charCodeAt(0);
		var TK_AMP		= '&'.charCodeAt(0);
		var TK_SHARP		= '#'.charCodeAt(0);
		var TK_CDOT		= 0x100;
		var TK_TIMES		= 0x101;
		var TK_PM		= 0x102;
		var TK_FRAC		= 0x103;
		var TK_DFRAC		= 0x104;
		var TK_LN		= 0x105;
		var TK_COS		= 0x106;
		var TK_SIN		= 0x107;
		var TK_TAN		= 0x108;
		var TK_SEC		= 0x109;
		var TK_COT		= 0x110;
		var TK_CSC		= 0x111;
		var TK_SQRT		= 0x112;
		var TK_LEQ		= 0x113;
		var TK_GEQ		= 0x114;
		var TK_NOT		= 0x115;
		var TK_NEXT		= 0x116;
		var TK_COLOR		= 0x117;

		var OpStr = KhanUtil.OpStr;
		var curColor = 0;

		var T0=TK_NONE, T1=TK_NONE;

		var tokenToOp = [ ];
		tokenToOp[TK_FRAC]  = OpStr.FRAC;
		tokenToOp[TK_DFRAC] = OpStr.DFRAC;
		tokenToOp[TK_SQRT]  = OpStr.SQRT;
		tokenToOp[TK_ADD]   = OpStr.ADD;
		tokenToOp[TK_SUB]   = OpStr.SUB;
		tokenToOp[TK_PM]    = OpStr.PM;
		tokenToOp[TK_CARET] = OpStr.POW;
		tokenToOp[TK_MUL]   = OpStr.MUL;
		tokenToOp[TK_TIMES] = OpStr.TIMES;
		tokenToOp[TK_CDOT]  = OpStr.CDOT;
		tokenToOp[TK_DIV]   = OpStr.FRAC;
		tokenToOp[TK_SIN]   = OpStr.SIN;
		tokenToOp[TK_COS]   = OpStr.COS;
		tokenToOp[TK_TAN]   = OpStr.TAN;
		tokenToOp[TK_SEC]   = OpStr.SEC;
		tokenToOp[TK_COT]   = OpStr.COT;
		tokenToOp[TK_CSC]   = OpStr.CSC;
		tokenToOp[TK_LN]    = OpStr.LN;
		tokenToOp[TK_EQL]   = OpStr.EQL;
		tokenToOp[TK_LT]   = OpStr.LT;
		tokenToOp[TK_GT]   = OpStr.GT;
		tokenToOp[TK_GEQ]   = OpStr.GEQ;
		tokenToOp[TK_LEQ]   = OpStr.LEQ;
		tokenToOp[TK_ABS]   = OpStr.ABS;

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

                function alignment() {
			return scan.alignment();
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
			case 'a'.charCodeAt(0):
				e = {op: "var", args: [lexeme()], color:colors[scan.color()]};
				next();
				break;
			case TK_NUM:
				e = Number(lexeme());
				var idColor = scan.color();
				if (idColor !== undefined) {
					e = {op:"num", args:[e], color:colors[idColor]};
				}
				next();
				break;
			case TK_LEFTPAREN:
				e = parenExpr();
				break;
			case TK_ABS:
				e = absExpr();
				break;
			case TK_FRAC:
			case TK_DFRAC:
                                var align = alignment();
				var idColorLeft = scan.color();
                                var align = alignment();
				next();
				e = {op: tokenToOp[t], args: [braceExpr(), braceExpr()], align:align};
				var idColorRight = scan.lastColor();
				addColors(e, idColorLeft, idColorRight, idColorLeft);
				break;
			case TK_SQRT:
                                var align = alignment();
				var idColorLeft = scan.color();
				next();
				switch(hd()) {
				case TK_LEFTBRACKET:
					e = {op: tokenToOp[TK_SQRT], args: [bracketExpr(), braceOptionalExpr()], align:alignment};
					break;
				default:
					e = {op: tokenToOp[TK_SQRT], args: [braceOptionalExpr()], align:align};
					break;
				}
				var idColorRight = scan.lastColor();
				addColors(e, idColorLeft, idColorRight, idColorLeft);
				break;
			case TK_SIN:
			case TK_COS:
			case TK_TAN:
			case TK_SEC:
			case TK_COT:
			case TK_CSC:
			case TK_LN:
                                var align = alignment();
				var idColorLeft = scan.color();
				next();
				if ( hd() === TK_CARET) {
					eat(TK_CARET);
					var expr2 = braceOptionalExpr();
					e = {op: tokenToOp[t], args: [unaryExpr()], align:align};
					e = {op: OpStr.POW, args: [e, expr2]};					
				} else {
					e = {op: tokenToOp[t], args: [unaryExpr()], align:align};
				}
				var idColorRight = scan.lastColor();
				addColors(e, idColorLeft, idColorRight, idColorLeft);
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

		function braceOptionalExpr() {
			if (hd() === TK_LEFTBRACE) {
				eat(TK_LEFTBRACE);
				var e = commaExpr();
				eat(TK_RIGHTBRACE);
				return e;
			}
			return unaryExpr();
		}

		function bracketExpr() {
			eat(TK_LEFTBRACKET);
			var e = commaExpr();
			eat(TK_RIGHTBRACKET);
			return e;
		}

		function parenExpr() {
			return surroundedExpr(TK_LEFTPAREN, TK_RIGHTPAREN, OpStr.PAREN);
		}

		function absExpr() {
			return surroundedExpr(TK_ABS, TK_ABS, OpStr.ABS);
		}

		function surroundedExpr(leftTk, rightTk, op) {
			var leftAlign = alignment();
			eat(leftTk);
			var idColorLeft = scan.lastColor();
			var e = commaExpr();
			var rightAlign = alignment();
			eat(rightTk);
			var idColorRight = scan.lastColor();
			var expr = {op:op, args:[e]};
			if (idColorLeft === idColorRight) {
				expr.color = colors[idColorLeft];
			} else {
				expr.opsColors = [colors[idColorLeft], colors[idColorRight]];
			}
			expr.align = leftAlign.concat(rightAlign);
			return expr;
		}

		function unaryExpr() {
			var t;
			var expr;
			switch (t = hd()) {
			case TK_COLOR:
				next();
				var color = "";
				while ((c = scan.readChar()) !== '}') {
					color += c;
				}
				next();
				expr = braceExpr();
				if (typeof expr === "number") {
					expr = {op:"num", args:[expr]};
				}
				expr.color = color;
				break;
			case TK_ADD:
				next();
				expr = unaryExpr();
				break;
			case TK_SUB:
				var align = alignment();
				var opIdColor = scan.color();
				next();
				var arg = unaryExpr();
				expr = {op:"-", args:[arg]};
				addColors(expr, opIdColor, scan.lastColor(), opIdColor);
	                        expr.align = align;
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
				var startIdColor = scan.color();
				next();
				var expr2;
				expr2 = braceOptionalExpr();
				var endIdColor = scan.color();
				expr = {op: tokenToOp[t], args: [expr, expr2]};
				addColors(expr, startIdColor, endIdColor);
			}
			return expr;
		}

		function addColors(expr, startIdColor, endIdColor, opIdColor) {
			if ((startIdColor !== undefined) && (startIdColor === endIdColor)) {
				expr.color = colors[startIdColor];
			} else if (opIdColor !== undefined) {
				expr.opsColors = [colors[opIdColor]];
			}
		}

		function multiplicativeExpr() {
			var startIdColor = scan.color();
			var expr = exponentialExpr();
			var t;
			t = hd();
			while (isMultiplicative(t) || (t === TK_VAR) || (t === TK_LEFTPAREN)) {
				var opIdColor = scan.color();
				var align = undefined;
				if (isMultiplicative(t)) {
					align = alignment();
					next();
				}
				var expr2 = exponentialExpr();
				var endIdColor = scan.lastColor();
				if ((t === TK_VAR) || (t === TK_LEFTPAREN)) {
					expr = {op: OpStr.MUL, args: [expr, expr2]};
				} else {
					expr = {op: tokenToOp[t], args: [expr, expr2]};
				}
				addColors(expr, startIdColor, endIdColor, opIdColor);
	                        expr.align = align;
				t = hd();
			}
			return expr;

			function isMultiplicative(t) {
				return t===TK_MUL || t===TK_DIV || t===TK_TIMES || t===TK_CDOT;
			}
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
				return {op: n.op, args: [negate(n.args[0]), n.args[1]]};
			}
			assert(false);
			return n;
			
		}

		function additiveExpr() {
			var startIdColor = scan.color();
			var expr = multiplicativeExpr();
			var t;
			while (isAdditive(t = hd())) {
				var opIdColor = scan.color();
                                var align = alignment();
				next();
				var expr2 = multiplicativeExpr();
				var endIdColor = scan.lastColor();
				expr = {op: tokenToOp[t], args: [expr, expr2]};
				addColors(expr, startIdColor, endIdColor, opIdColor);
	                        expr.align = align;
			}
			return expr;

			function isAdditive(t) {
				return t===TK_ADD || t===TK_SUB || t===TK_PM;
			}
		}

		function compareExpr() {
			var startIdColor = scan.color();
			var expr = additiveExpr();
			var t = hd();
			while ((t ===TK_EQL) || (t === TK_LT) || (t === TK_GT) || (t === TK_LEQ) || (t === TK_GEQ) || (t === TK_NOT)) {
	                        var align = alignment();
				opIdColor = scan.color();
				next();
				var op = tokenToOp[t];
				if (t === TK_NOT) {
					t = hd();
					if (t !== TK_EQL) {
						alert("\\not can only be followed by = in this version");
					}
					next();
					op = OpStr.NEQ;
				}
				var expr2 = additiveExpr();
				var endIdColor = scan.color();
				expr = {op: op, args: [expr, expr2]};
	                        expr.align = align;
				addColors(expr, startIdColor, endIdColor, opIdColor);
				t = hd();
			}
			return expr;

		}

		function commaExpr ( ) {
			var n = compareExpr();
			return n;
		}

		function expr ( ) {
			start();
			var n = commaExpr();
			return n;
		}

		function scanner(src) {

			var curIndex = 0;
			var curColor = 0;
			var lexeme = "";
                        var alignment = [0, 0];
			var popColors = 0;
			var lastColor = undefined;

			var lexemeToToken = [];
			var braceIsForColor = [];
			var openedColors = [];

			lexemeToToken["\\times"] = TK_TIMES;
			lexemeToToken["\\cdot"] = TK_CDOT;
			lexemeToToken["\\div"]   = TK_DIV;
			lexemeToToken["\\frac"]  = TK_FRAC;
			lexemeToToken["\\dfrac"]  = TK_DFRAC;
			lexemeToToken["\\sqrt"]  = TK_SQRT;
			lexemeToToken["\\pm"]	 = TK_PM;
			lexemeToToken["\\sin"]   = TK_SIN;
			lexemeToToken["\\cos"]   = TK_COS;
			lexemeToToken["\\tan"]   = TK_TAN;
			lexemeToToken["\\sec"]   = TK_SEC;
			lexemeToToken["\\cot"]   = TK_COT;
			lexemeToToken["\\csc"]   = TK_CSC;
			lexemeToToken["\\ln"]	 = TK_LN;
			lexemeToToken["\\leq"]	 = TK_LEQ;
			lexemeToToken["\\geq"]	 = TK_GEQ;
			lexemeToToken["\\not"]	 = TK_NOT;
			lexemeToToken["\\color"] = TK_COLOR;

			return {
				start : start ,
				lexeme : function () { return lexeme } ,
				readChar: readChar ,
                                alignment : function () { return alignment } ,
				color: color,
				lastColor: function() { return lastColor },
			}

			// begin private functions

			function color() {
				return openedColors[openedColors.length - 1];
			}

			function start () {
				var c;
				lexeme = "";
				alignment = [0, 0];
				lastColor = color();
				while (popColors > 0) {
					openedColors.pop();
					popColors--;
				}
				while (curIndex < src.length) {
					switch ((c = src.charCodeAt(curIndex++))) {
					case TK_SPACE:  // space
					case 9:   // tab
					case 10:  // new line
					case 13:  // carriage return
						continue;
					case TK_BACKSLASH:  // backslash
						lexeme += String.fromCharCode(c);
						var token = latex();
						if (token === TK_TIMES) {
							var nc = src.charCodeAt(curIndex)
							while ((nc === TK_AMP) || (nc === TK_SPACE)) {
								curIndex++;
								if (nc === TK_AMP) {
									alignment[1]++;
								}
								nc = src.charCodeAt(curIndex)
							}
						}
						return token;
                                        case TK_AMP:  // &
						alignment[0]++;
						continue;                                                
					case TK_LEFTPAREN:
					case TK_RIGHTPAREN:
					case TK_MUL:
					case TK_ADD:
					case TK_COMMA:  // comma
					case TK_SUB:
					case TK_DIV:
					case TK_EQL:
					case TK_LT:
					case TK_GT:
					case TK_LEFTBRACKET:
					case TK_RIGHTBRACKET:
					case TK_CARET:
					case TK_ABS:
						lexeme += String.fromCharCode(c);
						var nc = src.charCodeAt(curIndex);
						while ((nc === TK_AMP) || (nc === TK_SPACE)) {
							curIndex++;
							if (nc === TK_AMP) {
								alignment[1]++;
							}
							nc = src.charCodeAt(curIndex)
						}
						return c; // char code is the token id
					case TK_SHARP:
						c = src.charCodeAt(curIndex);
						if (c === TK_LEFTBRACE) {
							curIndex++;
							braceIsForColor.push(true);
						} else {
							popColors++;
						}
						openedColors.push(curColor);
						curColor++;
						continue;
					case TK_LEFTBRACE:
						braceIsForColor.push(false);
						lexeme += String.fromCharCode(c);
						return c;						
					case TK_RIGHTBRACE:
						if (braceIsForColor.pop()) {
							lastColor = openedColors.pop();
							//popColors++;
							continue;
						}
						lexeme += String.fromCharCode(c);
						return c;						
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

			function readChar() {
				return src.charAt(curIndex++);
			}

		}
	},
});
