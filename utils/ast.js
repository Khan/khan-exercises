/*
   AST library for khan-exercises

   ASTs (abstract syntax trees) are used to store structured information about
   exercises. The typical example is of an expression 1 + 1 = 2, which is stored 
   as ["=", ["+", 1, 1], 2]. Once constructed, accessor methods can be used to
   get at the various sub trees.

   var nid = ast.fromExpr(["=", ["+", 1, 1], 2]));
   var node = ast.node(nid);  // returns a node object corresponding to nid
   var equation = ast.node(node.lhs);
   var answer = ast.node(node.rhs);
   var kind	= node.kind();
   var op = node.operator();

   NOTE: this file is a work in progress and will be expanded as needed to support
   new exercise models.

*/

jQuery.extend ( KhanUtil, {


	ASSERT : true ,

	assert : function (val, str) {
		if ( !this.ASSERT ) {
			return;
		}
		if ( str === void 0 ) {
			str = "failed!";
		}
		if ( !val ) {
			alert("assert: " + str);
		}
	} ,

	ast : function () {

		var nodePool = [ "unused" ];	// nodePool[0] is reserved

		// Wrapper for navigating ASTs
		function Node (nid, model) {
			
			jQuery.extend ( this, {

				// n.node("lhs").numberValue()
				node : function (selector, m) {
					var newNid = nodePool[nid][selector];
					KhanUtil.assert (selector in nodePool[nid], "invalid selector");
					return new Node(newNid, (m===void 0) ? model : m);
				} ,

				graph : function (selector) {
					KhanUtil.assert (model!==void 0, "ast.Node.graph(): model undefined");
					return model.graph(selector, nid);
				} ,

				draw : function () {
					KhanUtil.assert (model!==void 0, "ast.Node.draw(): model undefined");
					return model.graph("", nid).draw();
				} ,

				text : function (selector) {
					KhanUtil.assert (model!==void 0, "ast.Node.text(): model undefined");
					return model.text(selector, nid);
				} ,

				format : function (options) {
					KhanUtil.assert (model!==void 0, "ast.Node.format(): model undefined");
					return model.text("", nid).format();
				} ,

				numberValue : function () {
					return Number(nodePool[nid].val);
				} ,

				intValue : function () {
					return Number(nodePool[nid].val) << 0;
				} ,

				stringValue : function () {
					var ast = KhanUtil.ast;
					var n = nodePool[nid];
					if (n.kind === ast.Kind.STR || n.kind === ast.Kind.NUM) {
						return String(n.val);
					}
					else {
						return "";
					}
				} ,

				operator : function (selector) {
					var node = nodePool[nid];
					//KhanUtil.assert ( node.op !== void 0, "ast.Node.operator(): node has no operator." );
					return node.op;
				} ,

				kind : function () {
					var node = nodePool[nid];
					KhanUtil.assert ( node.kind !== void 0, "ast.Node.operator(): node has no kind." );
					return node.kind;
				} ,

				model : function () {
					KhanUtil.assert (model!==void 0, "ast.Node.model(): model undefined");
					return model;
				} ,

			} ) ;
		}

		// maps for fast lookup of nodes
		var numberMap = { };
		var stringMap = { };
		var unaryExprMap = { };
		var binaryExprMap = { };

		// public ast interface

		jQuery.extend ( this, {


			// AST node kinds	
			Kind : {
				  UNARY  : 1
				, BINARY : 2
				, VAR	 : 3
				, INT	 : 4
				, NUM	: 5
				, STR	: 6
			} ,
			
			// Expression pool for mapping index to expressions
			nodePool : nodePool ,

			node : function (nid, model) {
				return new Node(nid, model);
			} ,

			dumpAll : function () {
				var s = "";
				for (var i=1; i < nodePool.length; i++) {
					s = s + "<p>" + i+": "+this.dump(i) + "</p>";
				}
				return s;
			} ,

			dump : function (nid) {
				var node = this.nodePool[nid];
				var s;
				switch (node.kind) {
				case this.Kind.UNARY:
					s = "UNARY [ " + node.op + ", " + node.expr + " ]";
					break;
				case this.Kind.BINARY:
					s = "BINARY [ " + node.op + ", " + node.lhs + ", " + node.rhs + " ]";
					break;
				case this.Kind.INT:
					s = "INT [ " + node.val + " ]";
					break;
				case this.Kind.NUM:
					s = "NUM [ " + node.val + " ]";
					break;
				case this.Kind.STR:
					s = "STR [ " + node.val + " ]";
					break;
				default:
					s = "UNKNOWN KIND " + node;
				}
				return s;
			} ,
			
			fromExpr : function (expr) {
				if (typeof expr === "number") {
					return this.numberLiteral(expr);
				}
				else if (typeof expr == "string") {
					return this.stringLiteral(expr);
				}
				else if (typeof expr == "object") {
					KhanUtil.assert ( expr.constructor === Array, "ast.fromExpr(): invalid input" );
					switch (expr.length) {
					case 1:
						return fromExpr(expr[0]);
					case 2:
						return this.unaryExpr ( this.strToOp(expr[0]), this.fromExpr (expr[1]) );
					case 3:
						return this.binaryExpr ( this.strToOp(expr[0]), this.fromExpr(expr[1]), this.fromExpr(expr[2]) );
					default:
						KhanUtil.assert ( false, "ast.fromExpr(): Invalid case." );
						return void 0;
					}
				}
			} ,

			// Variable node
			varExpr : function ( text, expr ) {
				this.nodePool.push( { kind: this.Kind.VAR, text: text, expr: expr } );
				return this.nodePool.length - 1 ;
			} ,
			
			intExpr : function ( val ) {
				this.nodePool.push ( { kind: this.Kind.INT, name : name, val : val } );
				return this.nodePool.length - 1 ;
			} ,
			
			numberLiteral : function ( val ) {
				var nid = numberMap[val];
				if (nid === void 0) {
					this.nodePool.push ( { kind: this.Kind.NUM, val : val } );
					nid = this.nodePool.length - 1 ;
					numberMap[val] = nid;
				}
				return nid;
			} ,
			
			stringLiteral : function ( val ) {
				var nid = stringMap[val];
				if (nid === void 0) {
					this.nodePool.push ( { kind: this.Kind.STR, val : val } );
					nid = this.nodePool.length - 1 ;
					stringMap[val] = nid;
				}
				return nid;
			} ,
			
			// Binary ops
			BinOp : {
				ADD : "+"
				, SUB : "-"
				, MUL : "\\times"
				, DIV : "\\div"
				, EQL : "="
				, ATAN2 : "ATAN2"
				, CAH : "CAH"
				, SOH : "SOH"
				, TOA : "TOA"
				, COMMA : ","
			} ,
			
			// Binary ops
			UnOp : {
				ADD : "+"
				, SUB : "-"
				, ABS : "ABS"
				, VAR : "VAR"
				, COS : "\\cos"
				, SIN : "\\sin"
				, TAN : "\\tan"
				, PAREN : "PAREN"
				, BRACKET : "BRACKET"
				, BRACE : "BRACE"
				, HIGHLIGHT : "HI"
			} ,
			
			strToOp : function (str) {
				switch (str) {
				case "+":
					return this.BinOp.ADD;
				case "-":
					return this.BinOp.SUB;
				case "*":
					return this.BinOp.MUL;
				case "/":
					return this.BinOp.DIV;
				case "COS":
					return this.UnOp.COS;
				case "SIN":
					return this.UnOp.SIN;
				case "TAN":
					return this.UnOp.TAN;
				default:
					return str;  // probably doesn't need translation
				}
	 		} ,

			defaultFormatter : {
				formatValue : function (node) {
					return ""+node.val;
				} ,
				
				formatUnary : function (node, formatter) {
					var ast = KhanUtil.ast;
					var text = ast.format(node.expr, formatter);
					switch (node.op) {
					case ast.UnOp.ABS:
						return "<code>\\lvert " + text + " \\rvert</code>";
					case ast.UnOp.VAR:
						return "<code>" + text + "</code>";
					}
					KhanUtil.assert (false, "unhandled case in formatUnary");
				} ,
				
				formatBinary : function (node, formatter) {
					var ast = KhanUtil.ast;
					var lhsText = ast.format(node.lhs, formatter);
					var rhsText = ast.format(node.rhs, formatter);
					var text;
					switch (node.op) {
					case ast.BinOp.MUL:
						text = "<code>"+lhsText+node.op+rhsText+"</code>"
						break;
					default:
						text = "<code>"+lhsText+node.op+rhsText+"</code>";
						break;
					}
					return text;
				} ,
			} ,
	 		
			format : function (nid, formatter) {
				if (formatter === void 0) {
					formatter = this.defaultFormatter;
				}
				var node = this.nodePool[nid];
				var text;
				switch (node.kind) {
				case this.Kind.UNARY:
					text = formatter.formatUnary(node, formatter);
					break;
				case this.Kind.BINARY:
					text = formatter.formatBinary(node, formatter);
					break;
				default:
					text = formatter.formatValue(node);
					break;
				}
				KhanUtil.assert (text != void 0, "assert: ast.format(), unhandled case");
				return text;
			} ,
			
			// Unary expression node
			unaryExpr : function ( opstr, expr ) {
				var key = opstr+expr;
				var nid = unaryExprMap[key];
				if (nid === void 0) {
					this.nodePool.push(
						{ kind: this.Kind.UNARY
						  , op: this.strToOp(opstr)
						  , expr: expr
						  , val: void 0
						});
					nid = this.nodePool.length - 1 ;
					unaryExprMap[key] = nid;
				}
				return nid;
			} ,
			
			// Binary expression node
			binaryExpr : function ( opstr, lhs, rhs ) {
				var key = opstr+lhs+","+rhs;
				var nid = binaryExprMap[key];
				if (nid === void 0) {
					this.nodePool.push({ 
						kind: this.Kind.BINARY
						, op: this.strToOp(opstr)
						, lhs: lhs
						, rhs: rhs
						, val: void 0 
					});
					nid = this.nodePool.length - 1 ;
					binaryExprMap[key] = nid;
				}
				return nid;
			} ,
			
			// get the value of an expression
			
			val : function (nid) {
				var solve = KhanUtil.solve;
				var node = this.nodePool[nid];
				if ( node.val != void 0 ) {
					return node.val;
				}
				
				if ( node.kind === this.Kind.BINARY ) {
					return ( node.val = solve.simpleArithmetic( nid ) );
				}
				else {
					KhanUtil.assert ( false, "unhandled case in ast/val()" );
				}
			} ,
			
			defaultValue : function (nid) {
				var node = this.nodePool[nid];
				if ( node.val != void 0 ) {
					return node.val;
				}
				KahnUtil.assert(false, "ast.defaultValue(): ast has no default value");
			} ,
			
			// Return the number value of a node.
			numberValue : function (nid) {
				var ast = KhanUtil.ast;
				var node = ast.nodePool[nid];
				switch (node.kind) {
				case ast.Kind.NUM:
					return node.val;
				default:
					return Number.NaN;
				}
			} ,
			
			// Return the string value of a node.
			stringValue : function (nid) {
				var ast = KhanUtil.ast;
				var node = ast.nodePool[nid];
				switch (node.kind) {
				case ast.Kind.NUM:
					return ""+node.val;
				case ast.Kind.STR:
					return ""+node.val;
				default:
					return String(node);
				}
			} ,
			
		} );

		return this;

	} () ,  // 
});
