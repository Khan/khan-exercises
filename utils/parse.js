/*

  @author: jeffdyer@acm.org
*/

jQuery.extend ( KhanUtil, {


	// scan expression
	scan : function (src) {

		var TK_NONE = 0;
		var TK_COEFF = 'A'.charCodeAt(0);
		var TK_VAR = 'a'.charCodeAt();
		var TK_NUM = '0'.charCodeAt();
		var curIndex = 0;
		var lexeme = "";

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
				case 40:  // TK_LEFTPAREN;
				case 41:  // TK_RIGHTPAREN;
				case 42:  // TK_MUL;
				case 43:  // TK_ADD;
				case 44:  // TK_COMMA;
				case 45:  // TK_SUB;
				case 47:  // TK_DIV;
				case 94:  // TK_CARET
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

		return {
			start : start ,

			lexeme : function () { return lexeme } ,
		}

		return this;
	} ,

	// parse expressions
	parse : function (src) {
		var util = KhanUtil;
		var ast = util.ast;
		var scan = util.scan(src);
		var TK_NONE = 0;
		var T0=TK_NONE, T1=TK_NONE;
		var tokenToOperator = [ ];

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

		var TK_NUM = '0'.charCodeAt(0);
		var TK_LEFTPAREN = '('.charCodeAt(0);
		var TK_RIGHTPAREN = ')'.charCodeAt(0);

		function primaryExpr () {
			var e;
			var t;
			switch (hd()) {
			case 'A'.charCodeAt(0):
				e = ast.stringLiteral(lexeme());
				next();
				break;
			case 'a'.charCodeAt(0):
				e = ast.stringLiteral(lexeme());
				next();
				break;
			case TK_NUM:
				e = ast.numberLiteral(lexeme());
				next();
				break;
			case TK_LEFTPAREN:
				next();
				e = commaExpr();
				eat(TK_RIGHTPAREN);
				break;
			default:
				e = void 0;
				break;
			}
			return e;
		}

		var TK_ADD = '+'.charCodeAt(0);
		var TK_SUB = '-'.charCodeAt(0);
		tokenToOperator[TK_ADD] = ast.BinOp.ADD;
		tokenToOperator[TK_SUB] = ast.BinOp.SUB;

		function unaryExpr() {
			var t;
			var expr;
			switch (t = hd()) {
			case TK_ADD:
			case TK_SUB:
				next();
				expr = ast.unaryExpr(tokenToOperator[t], unaryExpr());
				break;
			default:
				expr = primaryExpr();
				break;
			}
			return expr;
		}

		var TK_CARET = '^'.charCodeAt(0);
		tokenToOperator[TK_CARET] = ast.BinOp.POW;

		function exponentialExpr() {
			var expr = unaryExpr();
			var t;
			while ((t=hd())===TK_CARET) {
				next();
				expr = ast.binaryExpr(tokenToOperator[t], expr, unaryExpr());
			}

			return expr;
		}

		var TK_VAR = 'a'.charCodeAt(0);
		var TK_LEFTPAREN = '('.charCodeAt(0);
		var TK_MUL = '*'.charCodeAt(0);
		var TK_DIV = '/'.charCodeAt(0);
		tokenToOperator[TK_MUL] = ast.BinOp.MUL;
		tokenToOperator[TK_DIV] = ast.BinOp.DIV;
		
		function multiplicativeExpr() {
			var e = exponentialExpr();
			var t;

			while((t=hd())===TK_VAR || t===TK_LEFTPAREN) {
				e = ast.binaryExpr(ast.BinOp.MUL, e, exponentialExpr());
			}

			while (isMultiplicative(t = hd())) {
				next();
				e = ast.binaryExpr(tokenToOperator[t], e, exponentialExpr());
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
				expr = ast.binaryExpr(tokenToOperator[t], expr, multiplicativeExpr());
			}
			return expr;

			function isAdditive(t) {
				return t===TK_ADD || t===TK_SUB;
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

		return {
			expr : expr ,
		};

	} ,
});
