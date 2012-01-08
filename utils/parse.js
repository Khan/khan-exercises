/*

  @author: jeffdyer@acm.org
*/

jQuery.extend ( KhanUtil, {

	parse : function (src) {

		var TK_NONE         = 0;
		var TK_ADD          = '+'.charCodeAt(0);
		var TK_CARET        = '^'.charCodeAt(0);
		var TK_COS          = 0x105;
		var TK_DIV          = '/'.charCodeAt(0);
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
		tokenToOperator[TK_DIV]   = OpStr.DIV;
		tokenToOperator[TK_SIN]   = OpStr.SIN;
		tokenToOperator[TK_COS]   = OpStr.COS;
		tokenToOperator[TK_TAN]   = OpStr.TAN;
		tokenToOperator[TK_SEC]   = OpStr.SEC;
		tokenToOperator[TK_LN]    = OpStr.LN;

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
			case TK_SUB:
				next();
				expr = {op: tokenToOperator[t], args: [unaryExpr()]};
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
				expr = {op: tokenToOperator[t], args: [expr, unaryExpr()]};
			}

			return expr;
		}

		function multiplicativeExpr() {
			var e = exponentialExpr();
			var t;

			while((t=hd())===TK_VAR || t===TK_LEFTPAREN) {
				e = {op: OpStr.MUL, args: [e, exponentialExpr()]};
			}

			while (isMultiplicative(t = hd())) {
				next();
				e = {op: tokenToOperator[t], args: [e, exponentialExpr()]};
			}
			return e;

			function isMultiplicative(t) {
				return t===TK_MUL || t===TK_DIV;
			}
		}

		function additiveExpr() {
			var expr = multiplicativeExpr();
			var t;
			while (isAdditive(t = hd())) {
				next();
			    expr = {op: tokenToOperator[t], args: [expr, multiplicativeExpr()]};
			}
			return expr;

			function isAdditive(t) {
				return t===TK_ADD || t===TK_SUB || t===TK_PM;
			}
		}

		function commaExpr ( ) {
			var n = additiveExpr();
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
