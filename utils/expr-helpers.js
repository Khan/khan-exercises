(function() {
    var hasConstants = function(expr) {
        if (typeof expr !== "object") {
            return false;
        } else if (expr.hasConstants !== undefined) {
            return expr.hasConstants;
        }
        expr.hasConstants = (expr.op === "cst");  
        $.each(expr.args, function(iArg, arg) {
            expr.hasConstants |= hasConstants(arg);
        });
        return expr.hasConstants;
    };
    var hasVariables = function(expr) {
        if (typeof expr !== "object") {
            return false;
        } else if (expr.hasVariables !== undefined) {
            return expr.hasVariables;
        }
        expr.hasVariables = (expr.op === "var");
        $.each(expr.args, function(iArg, arg) {
            expr.hasVariables |= hasVariables(arg);
        });
        return expr.hasVariables;
    };
    var addExpIfNone = function(expr) {
        if ((typeof expr === "object") && (expr.op === "^")) {
            return expr;
        }
        return {op:"^", args:[expr, 1]};
    };
    var bigPrime = 2147483647;
    var mediumPrime = 28657;
    var smallPrime = 257;
    var stringHash = function(str) {
        var hash = 0;
        for (pos = 0; pos < str.length; pos++) {
            hash = (smallPrime * hash + str[pos].charCodeAt()) % bigPrime;
        }
        return hash;
    };
    var exprIdentical = function(expr1, expr2) {
        if (typeof expr1 !== typeof expr2) {
            return false;
        }
        if (typeof expr1 !== "object") {
            return (expr1 === expr2)
        }
        if (exprHash(expr1) != exprHash(expr2)) {
            return false;
        }
        if ((expr1.op !== expr2.op) || (expr1.args.length !== expr2.args.length)) {
            return false;
        }
        for (var iArg = 0; iArg < expr1.args.length; iArg++) {
            if (!exprIdentical(expr1.args[iArg], expr2.args[iArg])) {
                return false;
            }
        }
        return true;
    };
    var exprHash = function(expr) {
        if (typeof expr === "number") {
            return expr;
        }
        if (typeof expr === "string") {
            return stringHash(expr);
        }
        if (expr.hash !== undefined) {
            return expr.hash;
        }
        expr.hash = stringHash(expr.op);
        $.each(expr.args, function(iArg, arg) {
            expr.hash = (expr.hash * mediumPrime + exprHash(arg)) % bigPrime;
        });
        return expr.hash;
    };

    var exprContains = function(expr, term) {
        if (typeof expr !== "object") {
            return expr === term;
        }
        var termHash = exprHash(term);
        if (expr.contains === undefined) {
            expr.contains = [];
        }
        var containedSaved = expr.contains["" + termHash];
        if (containedSaved !== undefined) {
            for (var iOther = 0; iOther < containedSaved.length; iOther++) {
                var other = containedSaved[iOther].term;
                if (exprIdentical(term, other)) {
                    return containedSaved[iOther].isContained;
                }
            }
        } else {
            containedSaved = expr.contains["" + termHash] = [];
        }
        var isContained = false;
        if (exprIdentical(expr, term)) {
            isContained = true;
        } else {
            for (var iArg = 0; iArg < expr.args.length; iArg++) {
                if (exprContains(expr.args[iArg], term)) {
                    isContained = true;
                    break;
                }
            }
        }
        containedSaved.push({term:term, isContained:isContained});
        return isContained;
    };
    var exprClone = function(expr) {
       if (typeof expr !== "object") {
          return expr;
       }
       var newArgs = $.map(expr.args, function(arg) {
            return exprClone(arg);
       });
       return copyStyleIfNone(expr, {op:expr.op, args:newArgs});
    };

    var copyStyleIfNone = function(srcExpr, dstExpr) {
       if (typeof expr === "number") {
          expr = {op:"num", args:[expr]};
       }
       if (dstExpr.style === undefined) {
           dstExpr.style = srcExpr.style;
           dstExpr.idStyle = srcExpr.idStyle;
       }
       if (dstExpr.opsStyles === undefined) {
           dstExpr.opsStyles = srcExpr.opsStyles;
           dstExpr.opsIdStyles = srcExpr.opsIdStyles;
       }
       if (dstExpr.align === undefined) {
           dstExpr.align = srcExpr.align;
       }
       return dstExpr;
    };

    var exprToText = function(expr) {
       if (typeof expr !== "object") {
          return expr;
       }
       if (expr.args.length === 1) {
          if (expr.op === "var") {
             return exprToText(expr.args[0]);
          }
          return expr.op + "(" + exprToText(expr.args[0]) + ")";
       }
       var str = "(";
       var op = expr.op;
       if (op === "times") {
           op = "*";
       };
       for (var iArg = 0; iArg < expr.args.length; iArg++) {
          if (iArg !== 0) {
              str += op;
          }
          str += exprToText(expr.args[iArg]);
       }
       str += ")";
       return str;
    }
    var exprToStrExpr = function(expr) {
       if (typeof expr === "string") {
          return "\"" + expr + "\"";
       }
       if (typeof expr !== "object") {
          return expr;
       }
       var str = "{op:\"" + expr.op + "\", args:[";
       for (var iArg = 0; iArg < expr.args.length; iArg++) {
          if (iArg !== 0) {
              str += ", ";
          }
          str += exprToStrExpr(expr.args[iArg]);
       }
       str += "]}";
       return str;
    };

    var exprIsNumber = function(expr) {
        return ((typeof expr === "number") || ((typeof expr === "object") && (expr.op === "num")));
    };

    var exprNumValue = function(expr) {
       if (!exprIsNumber(expr)) {
          return undefined;
       }
       if (typeof expr === "number") {
          return expr;
       }
       return expr.args[0];
    };

    var opIsMultiplication = function(op) {
       return ((op === "times") || (op === "cdot") || (op === "*"));
    }

    var exprSetStyle = function(expr, style) {
          var expr = KhanUtil.exprClone(expr);
          if (typeof expr === "number") {
              expr = {op:"num", args:[expr]};
          }
          expr.style = style;
          return expr;
    };

    var exprInList = function(list, term) {
        for (var iItem = 0; iItem < list.length; iItem++) {
           if (exprIdentical(term, list[iItem])) {
               return true;
           }
        }
        return false;
    };

    var initOccArray = function(length) {
       var arr = [];
       for (var pos = 0; pos < length; pos++) {
          arr.push(0);
       }
       return arr;
    };

    var genExprFromOccFactors = function(factors, occFactors) {
       var args = [];
       var numFactors = 1;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          var factor = factors[iFactor];
          if (occFactors[iFactor] <= 0) {
             continue;
          }
          if (typeof factor === "number") {
             numFactors *= Math.pow(factor, occFactors[iFactor]);
             continue;
          }
          if (occFactors[iFactor] === 1) {
             args.push(factor);
          } else {
             args.push({op:"^", args:[factor, occFactors[iFactor]]});
          }
       }
       if (numFactors !== 1) {
           args.unshift(numFactors);
       }
       var expr;
       if (args.length === 0) {
          expr = 1;
       } else if (args.length === 1) {
          expr = args[0];
       } else {
          expr = {op:"*", args:args};
       }
       return exprClone(expr);
    };

    var exprToString = function(expr) {
        var ast = new KhanUtil.MathModel();
        return ast.format(expr);
    };
    var exprToCode = function(expr, isResult) {
        var strExpr = "<code>" + KhanUtil.exprToString(expr) + "</code>";
        if (isResult) {
            strExpr = "<span class='result'>" + strExpr + "</span>"; 
        } else {
            strExpr = "<span class='mathTest'>" + strExpr + "</span>"; 
        }
        return strExpr;
    };
    var exprToCodeOr = function(expr1, expr2, isResult) {
        var strExpr1 = KhanUtil.exprToString(expr1);
        var strExpr2 = KhanUtil.exprToString(expr2);
        if (strExpr1 !== strExpr2) {
            return KhanUtil.exprToCode(expr1) + " or " + KhanUtil.exprToCode(expr2, isResult);
        }
        return KhanUtil.exprToCode(expr2, isResult);
    };
    var exprType = function( expr ) {
        if ( typeof expr === "object" ) {
            return expr.op;
        } else {
            return typeof(expr);
        }
    };


    $.extend(KhanUtil, {
        hasConstants: hasConstants,
        hasVariables: hasVariables,
        addExpIfNone: addExpIfNone,
        exprIdentical: exprIdentical,
        exprHash: exprHash,
        stringHash: stringHash,
        exprContains: exprContains,
        exprClone: exprClone,
        exprToText: exprToText,
        exprToStrExpr: exprToStrExpr,
        exprIsNumber: exprIsNumber,
        exprNumValue: exprNumValue,
        opIsMultiplication: opIsMultiplication,
        exprSetStyle: exprSetStyle,
        exprInList: exprInList,
        initOccArray: initOccArray,
        genExprFromOccFactors: genExprFromOccFactors,
        exprToCodeOr: exprToCodeOr,
        exprToCode: exprToCode,
        exprToString: exprToString,
        copyStyleIfNone: copyStyleIfNone
    });
})();
