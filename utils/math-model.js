(function() {
    var OpStr = {
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
        EMP: "empty"
    };

    var OpToLaTeX = {};
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

    // private implementation

    var graphAST = function(n, color, range) {
        var graph = KhanUtil.currentGraph;

        var g = function(x) {
            // set up the lexical environment for evaluating ast n
            var env = {x: x};
            var val = evalExpr(n, env);
            return val;
        }

        if (!range) {
            range = 10;
        }


        if (graph.last) {
            $(graph).remove();
            graph.last.remove();

            graph.style({
                stroke: color,
                strokeWidth: 3,
                fill: "none",
                clipRect: [[-range, -range], [2 * range, 2 * range]],
                arrows: null
            });

            graph.last = graph.plot(g, [-10, 10]);
        }
        else {
            graph.graphInit({
                range: range + 1,
                scale: 20,
                axisArrows: "&lt;-&gt;",
                tickStep: 1,
                labelStep: 1
            });
            graph.style({
                stroke: color,
                strokeWidth: 3,
                fill: "none",
                clipRect: [[-range, -range], [2 * range, 2 * range]],
                arrows: null
            });

            graph.plot(g, [-range, range]);
            graph.last = graph.plot(g, [-range, range]);
        }
    };

    var isValidAST = function(n) {
        return n.kind() !== void 0;
    }

    var isEqualAST = function(n1, n2) {
        var ast = KhanUtil.ast;

        var nid1 = ast.intern(n1);
        var nid2 = ast.intern(n2);

        if (nid1 === nid2) {
            return true;
        }

        if (n1.op === n2.op && n1.args.length === n2.args.length) {
            if (n1.args.length === 2) {
                var n1arg0 = ast.intern(n1.args[0]);
                var n1arg1 = ast.intern(n1.args[1]);
                var n2arg0 = ast.intern(n2.args[0]);
                var n2arg1 = ast.intern(n2.args[1]);
                if (n1arg0 === n2arg1 && n1arg1 === n2arg0) {
                    return true;
                }
            }
        }
        return false;
    }

    var polynomial = function(coeffs, ident, lhs) {
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
            var rhs = coeffs[0];
        }
        else {
            // construct a term of degree given by the size of coeffs
            var rhs = {op: "*", args: [coeffs[0], {op: "^", args: [{op: "var", args: [ident]}, coeffs.length - 1]}]};
        }

        if (coeffs[0] === 0) {
            // zero coefficient, erase term by not updating lhs
        }
        else if (lhs === void 0) {
            // first term, no lhs to contribute, so rhs is lhs
            var lhs = rhs;
        }
        else {
            lhs = {op: "+", args: [lhs, rhs]};
        }

        // recurse until no more coefficients
        return polynomial(coeffs.slice(1), ident, lhs);
    };

    var isTrigOrLog = function(op) {
        return ((op === OpStr.SIN) || (op === OpStr.COS) || (op === OpStr.TAN) ||
            (op === OpStr.SEC) || (op === OpStr.COT) || (op === OpStr.CSC) ||
            (op === OpStr.LN));
    };

    var getAlignment = function(expr, index, hphantom, addSpacing) {
        var iOp = Math.floor(index / 2);
        if ((expr.opsStyles === undefined) || (expr.opsStyles[iOp] === undefined) ||
            (expr.opsStyles[iOp].align === undefined)) {
            return "";
        }
        var align = expr.opsStyles[iOp].align;
        if (align[index % 2] === undefined) {
            return "";
        }
        var str = "";
        for (var cur = 0; cur < align[index % 2]; cur++) {
            if (hphantom) {
                str += "} & \\hphantom{ ";
            } else {
                str += "& ";
            }
        }
        if ((align[index % 2] > 0) && addSpacing) {
            str += "\\; ";
        }
        return str;
    }

    var getOpSymbol = function(expr, iOp) {
        return getOpStyleAttr(expr, iOp, "symbol", expr.op);
    };

    var getOpStyleAttr = function(expr, iOp, attrName, defaultValue) {
        var attr = defaultValue;
        if ((expr.opsStyles !== undefined) && (expr.opsStyles[iOp] !== undefined) && (expr.opsStyles[iOp][attrName] !== undefined)) {
            attr = expr.opsStyles[iOp][attrName];
        }
        return attr;
    };

    var addOpStyle = function(text, expr, index, spacingBefore, spacingAfter) {
        if ((expr.opsStyles === undefined) || (expr.opsStyles[index] === undefined)) {
            return text + " ";
        }
        var opStyle = expr.opsStyles[index];
        if (opStyle.hidden === true) {
            return "";
        }
        if (opStyle.idStyle === expr.idStyle) {
            return text + " ";
        }
        if (opStyle.color !== undefined) {
            var str = "\\color{" + opStyle.color + "}{";
            if (spacingBefore) {
                str += "\\;";
            }
            str += text + " ";
            if (spacingAfter) {
                str += "\\;";
            }
            str += "}";
            text = str;
        }
        if (opStyle.cancel) {
            text = "\\cancel{" + text + "}";
            if (typeof opStyle.cancel === "string") {
                text = "\\color{" + opStyle.cancel + "}{" + text + "}";
            }
        }
        return text;
    }

    var addStyle = function(text, expr) {
        if ((expr.parent !== undefined) &&
            (expr.parent.style !== undefined) &&
            (expr.style != undefined) &&
            (expr.style.idStyle !== undefined) &&
            (expr.parent.style.idStyle === expr.style.idStyle)) {
            return text;
                    }
        if (expr.style === undefined) {
            return text;
        }
        if (expr.style.color !== undefined) {
            text = "\\color{" + expr.style.color + "}{" + text + "}";
        }
        if (expr.style.cancel) {
            text = "\\cancel{" + text + "}";
            if (typeof expr.style.cancel === "string") {
                text = "\\color{" + expr.style.cancel + "}{" + text + "}";
            }
        }
        return text;
    };

    var parseFormat = function(text, styles, simplifyOptions, hphantom, textSize) {
        var expr = parse(text, styles);
        var str = format(expr, simplifyOptions, textSize, hphantom);
        if (hphantom) {
            str = "\\hphantom{" + str + "}";
        }
        return str;
    };

    var formatGroup = function(group, selection, simplifyOptions) {
        if (selection === undefined) {
            selection = [];
            for (var iExpr = 0; iExpr < group.length; iExpr++) {
                selection.push(iExpr);
            }
        }
        var str = "\\begin{alignat}{5}";
        for (var iExpr = 0; iExpr < group.length; iExpr++) {
            if ($.inArray(iExpr, selection) === -1) {
                var expr = group[iExpr];
                str += "\\hphantom{" + format(expr, simplifyOptions, undefined, true) + "} \\\\";
            }
        }
        for (var iSel = 0; iSel < selection.length; iSel++) {
            str += format(group[selection[iSel]], simplifyOptions) + " \\\\";
            if (iSel != selection.length - 1) {
                str += "\\\\";
            }
        }
        str += "\\end{alignat}";
        return str;
    }

    var exprIsNumber = function(expr) {
        if (expr === undefined) {
            return false;
        }
        return ((typeof expr === "number") || (expr.op === OpStr.NUM));
    }

    // format an AST
    var format = function(expr, simplifyOptions, textSize, hphantom) {
        if (expr === undefined) {
            return "";
        }
        if (KhanUtil.simplify !== undefined) {
            if (simplifyOptions === undefined) {
                simplifyOptions = KhanUtil.simplifyOptions.minimal;
            }
            expr = KhanUtil.simplify(expr, simplifyOptions);
        }
        return formatRec(expr, textSize, hphantom);
    }

    // format an AST
    var formatRec = function(n, textSize, hphantom, parent) {
        if (textSize === void 0) {
            textSize = "normalsize";
        }
        if (n === undefined) {
            return "";
        }
        var text;

        if ($.type(n) === "number") {
            text = "" + n;
        }
        else if ($.type(n) === "object") {
            // format sub-expressions
            if ((n.op !== "var") && (n.op !== "cst")) {
                var args = [];
                for (var i = 0; i < n.args.length; i++) {
                    n.args[i].parent = n;
                    args[i] = formatRec(n.args[i], textSize, hphantom);
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
                if (n.args.length === 1) {
                    text = getAlignment(n, 0, hphantom, true);
                    text += addOpStyle(OpToLaTeX[n.op], n, 0, true, false) + args[0];
                    text += getAlignment(n, 1, hphantom);
                }
                else {
                    text = args[0];
                    text += getAlignment(n, 0, hphantom, true);
                    text += addOpStyle(OpToLaTeX[n.op], n, 0, true, true);
                    text += getAlignment(n, 1, hphantom, true);
                    text += args[1];
                }
                break;
            case OpStr.EMP:
                text = "";
                break;
            case OpStr.DIV:
            case OpStr.PM:
            case OpStr.LT:
            case OpStr.GT:
            case OpStr.LEQ:
            case OpStr.GEQ:
            case OpStr.NEQ:
                text = args[0];
                text += getAlignment(n, 0, hphantom, true);
                text += addOpStyle(OpToLaTeX[n.op], n, 0, true, true) + " ";
                text += getAlignment(n, 1, hphantom, true);
                text += args[1];
                break;
            case OpStr.POW:
                // if subexpr is lower precedence, wrap in parens
                var lhs = n.args[0];
                var rhs = n.args[1];
                if ((typeof lhs === "object") && isTrigOrLog(lhs.op)) {
                    text = OpToLaTeX[lhs.op] + getAlignment(n, 0, hphantom) + "^" + getAlignment(n, 1, hphantom);
                    text += "{" + args[1] + "}";
                    text += formatRec(lhs.args[0], textSize, hphantom);
                    break;
                }
                if ((lhs.args && lhs.args.length === 2) || (rhs.args && rhs.args.length === 2)) {
                    if (lhs.op === OpStr.ADD || lhs.op === OpStr.SUB ||
                        lhs.op === OpStr.MUL || lhs.op === OpStr.DIV ||
                        lhs.op === OpStr.SQRT) {
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
                text = addOpStyle(OpToLaTeX[n.op], n, 0, false, true) + "{" + args[0] + "}";
                break;
            case OpStr.FRAC:
            case OpStr.DFRAC:
                text = addOpStyle(OpToLaTeX[n.op], n, 0, false, false) + "{" + args[0] + "}{" + args[1] + "}";
                break;
            case OpStr.DERIV:
                text = "\\dfrac{d" + args[0] + "}{d" + args[1] + "}";
                break;
            case OpStr.SQRT:
                switch (args.length) {
                case 1:
                    text = addOpStyle(OpToLaTeX[n.op], n, 0) + "{" + args[0] + "}";
                    break;
                case 2:
                    text = addOpStyle(OpToLaTeX[n.op] + "[" + args[0] + "]", n, 0) + "{" + args[0] + "}";
                    break;
                }
                break;
            case OpStr.MUL:
                // if subexpr is lower precedence, wrap in parens
                var prevTerm;
                text = "";
                $.each(n.args, function(index, term) {
                    var opIndex = index - 1;
                    var symbol = getOpSymbol(n, opIndex);
                    if (((term.op === OpStr.ADD) || (term.op === OpStr.SUB)) && (term.args.length > 1)) {
                        args[index] = "(" + args[index] + ")";
                        term = {op: "()", args: [term]};
                    }
                    if ((term.args && (term.args.length >= 2) && (term.op !== OpStr.POW)) ||
                        !((symbol === OpStr.MUL) && (term.op === OpStr.PAREN ||
                             term.op === OpStr.POW ||
                             term.op === OpStr.VAR ||
                             term.op === OpStr.CST ||
                             (exprIsNumber(prevTerm) && !exprIsNumber(term))
                        ))) {
                        if (opIndex >= 0) {
                            text += getAlignment(n, opIndex * 2, hphantom, true);
                            text += addOpStyle(OpToLaTeX[symbol], n, opIndex, true, true);
                            text += getAlignment(n, opIndex * 2 + 1, hphantom, true);
                        }
                        text += args[index];
                    }
                    else {
                        text += getAlignment(n, opIndex * 2, hphantom, true);
                        text += args[index];
                        text += getAlignment(n, opIndex * 2 + 1, hphantom, true);
                    }
                    prevTerm = term;
                });
                break;
            case OpStr.ADD:
            case OpStr.COMMA:
            case OpStr.EQL:
                $.each(args, function(index, value) {
                    var opIndex = index - 1;
                    if (index === 0) {
                        text = value;
                    }
                    else {
                        text += getAlignment(n, opIndex * 2, hphantom, true);
                        text += addOpStyle(OpToLaTeX[n.op], n, opIndex, true, true);
                        text += getAlignment(n, opIndex * 2 + 1, hphantom, true);
                        text += value;
                    }
                });
                break;
            case OpStr.PAREN:
                text = getAlignment(n, 0, hphantom);
                text += addOpStyle("(", n, 0, false, false);
                text += getAlignment(n, 1, hphantom);
                text += args[0];
                text += getAlignment(n, 2, hphantom);
                text += addOpStyle(")", n, 1, false, false);
                text += getAlignment(n, 3, hphantom);
                break;
            case OpStr.ABS:
                text = addOpStyle("|", n, 0, false, false) + args[0] +
                    addOpStyle("|", n, 1, false, false);
                break;
            default:
                KhanUtil.assert(false, "unimplemented eval operator");
                break;
            }
        }
        else {
            KhanUtil.assert(false, "invalid expression type");
        }
        text = addStyle(text, n);
        return text;
    };

    var evalExpr = function(n, env) {

        var ast = KhanUtil.ast;
        var assert = KhanUtil.assert;

        var val;

        if ($.type(n) === "string" ||
            $.type(n) === "number") {
            val = n;
        } else if ($.type(n) === "object") {
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
                assert(args.length === 1, "wrong number of arguments to var or cst");
                val = env[args[0]];
                break;
            case OpStr.SUB:
                assert(args.length === 2, "wrong number of arguments to subtract");
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
                assert(args.length === 2, "wrong number of arguments to div/frac");
                val = args[0] / args[1];
                break;
            case OpStr.POW:
                assert(args.length === 2, "wrong number of arguments to pow");
                val = Math.pow(args[0], args[1]);
                break;
            case OpStr.SIN:
                assert(args.length === 1, "wrong number of arguments to sin");
                val = Math.sin(args[0]);
                break;
            case OpStr.COS:
                assert(args.length === 1, "wrong number of arguments to cos");
                val = Math.cos(args[0]);
                break;
            case OpStr.TAN:
                assert(args.length === 1, "wrong number of arguments to tan");
                val = Math.tan(args[0]);
                break;
            case OpStr.SQRT:
                assert(args.length < 3, "wrong number of arguments to sqrt");
                switch (args.length) {
                case 1:
                    val = Math.sqrt(args[0]);
                    break;
                case 2:
                    val = Math.pow(args[0], 1 / args[1]);
                    break;
                }
                break;
            case OpStr.MUL:
            case OpStr.CDOT:
            case OpStr.TIMES:
                var val = 1;
                $.each(args, function(index, value) {
                    val *= value;
                });
                break;
            case OpStr.ADD:
                var val = 0;
                $.each(args, function(index, value) {
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
        } else {
            KhanUtil.assert(false, "invalid expression type");
        }
        return val;
    };

// TODO : separte into math-parse.js

    var parse = function(src, styles) {
        var start = function() {
            T0 = scan.start();
        }

        var hd = function() {
            //KhanUtil.assert(T0!==0, "hd() T0===0");
            return T0;
        }

        var alignment = function() {
            return scan.alignment();
        }

        var lexeme = function() {
            return scan.lexeme();
        }

        var matchToken = function(t) {
            if (T0 == t) {
                next();
                return true;
            }
            return false;
        }

        var next = function() {
            T0 = T1;
            T1 = TK_NONE;
            if (T0 === TK_NONE) {
                T0 = scan.start();
            }
        }

        var replace = function(t) {
            T0 = t;
        }

        var eat = function(tc) {
            var tk = hd();
            if (tk !== tc) {
                if (typeof console !== "undefined") {
                    console.log("Expecting " + tc + " found " + tk);  // @Nolint
                }
            }
            next();
        }

        var match = function(tc) {
            var tk = hd();
            if (tk !== tc)
                return false;
            next();
            return true;
        }

        var setStyle = function(e, style) {
            if (typeof e === "number") {
                e = {op: "num", args: [e]};
            }
            e.style = style;
            return e;
        }

        var primaryExpr = function() {
            var e;
            var t;
            var op;
            switch ((t = hd())) {
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                e = {op: "var", args: [lexeme()]};
                e = setStyle(e, styles[scan.idStyle()]);
                next();
                break;
            case TK_NUM:
                e = Number(lexeme());
                var idStyle = scan.idStyle();
                if (idStyle !== undefined) {
                    e = setStyle(e, styles[idStyle]);
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
                var idStyleLeft = scan.idStyle();
                var align = alignment();
                next();
                e = {op: tokenToOp[t], args: [braceExpr(), braceExpr()]};
                var idStyleRight = scan.lastIdStyle();
                addStyles(e, idStyleLeft, idStyleRight, idStyleLeft);
                setOpStyle(e, 0, "align", align);
                break;
            case TK_SQRT:
                var align = alignment();
                var idStyleLeft = scan.idStyle();
                next();
                switch (hd()) {
                case TK_LEFTBRACKET:
                    e = {op: tokenToOp[TK_SQRT], args: [bracketExpr(), braceOptionalExpr()]};
                    setOpStyle(e, 0, "align", align);
                    break;
                default:
                    e = {op: tokenToOp[TK_SQRT], args: [braceOptionalExpr()]};
                    setOpStyle(e, 0, "align", align);
                    break;
                }
                var idStyleRight = scan.lastIdStyle();
                addStyles(e, idStyleLeft, idStyleRight, idStyleLeft);
                break;
            case TK_SIN:
            case TK_COS:
            case TK_TAN:
            case TK_SEC:
            case TK_COT:
            case TK_CSC:
            case TK_LN:
                var align = alignment();
                var idStyleLeft = scan.idStyle();
                next();
                if (hd() === TK_CARET) {
                    eat(TK_CARET);
                    var expr2 = braceOptionalExpr();
                    e = {op: tokenToOp[t], args: [unaryExpr()]};
                    e = {op: OpStr.POW, args: [e, expr2]};
                } else {
                    e = {op: tokenToOp[t], args: [unaryExpr()]};
                }
                var idStyleRight = scan.lastIdStyle();
                addStyles(e, idStyleLeft, idStyleRight, idStyleLeft);
                setOpStyle(e, 0, "align", align);
                break;
            default:
                e = void 0;
                break;
            }
            return e;
        }

        var braceExpr = function() {
            eat(TK_LEFTBRACE);
            var e = commaExpr();
            eat(TK_RIGHTBRACE);
            return e;
        }

        var braceOptionalExpr = function() {
            if (hd() === TK_LEFTBRACE) {
                eat(TK_LEFTBRACE);
                var e = commaExpr();
                eat(TK_RIGHTBRACE);
                return e;
            }
            return unaryExpr();
        }

        var bracketExpr = function() {
            eat(TK_LEFTBRACKET);
            var e = commaExpr();
            eat(TK_RIGHTBRACKET);
            return e;
        }

        var parenExpr = function() {
            return surroundedExpr(TK_LEFTPAREN, TK_RIGHTPAREN, OpStr.PAREN);
        }

        var absExpr = function() {
            return surroundedExpr(TK_ABS, TK_ABS, OpStr.ABS);
        }

        var surroundedExpr = function(leftTk, rightTk, op) {
            var leftAlign = alignment();
            eat(leftTk);
            var idStyleLeft = scan.lastIdStyle();
            var e = commaExpr();
            var rightAlign = alignment();
            eat(rightTk);
            var idStyleRight = scan.lastIdStyle();
            var expr = {op: op, args: [e], opsStyles: [{},{}]};
            if (idStyleLeft === idStyleRight) {
                expr = setStyle(expr, styles[idStyleLeft]);
            } else {
                expr.opsStyles[0] = styles[idStyleLeft];
                expr.opsStyles[1] = styles[idStyleRight];
            }
            setOpStyle(expr, 0, "align", leftAlign);
            setOpStyle(expr, 1, "align", rightAlign);
            return expr;
        }

        var unaryExpr = function() {
            var t;
            var expr;
            switch (t = hd()) {
            case TK_COLOR:
                next();
                var color = "";
                while ((c = scan.readChar()) !== "}") {
                    color += c;
                }
                next();
                expr = braceExpr();
                if (typeof expr === "number") {
                    expr = {op: "num", args: [expr]};
                }
                expr.style = {color: color};
                break;
            case TK_ADD:
                next();
                expr = unaryExpr();
                break;
            case TK_SUB:
                var align = alignment();
                var opIdStyle = scan.idStyle();
                next();
                var arg = unaryExpr();
                expr = {op: "-", args: [arg]};
                addStyles(expr, opIdStyle, scan.lastIdStyle(), opIdStyle);
                setOpStyle(expr, 0, "align", align);
                break;
            default:
                expr = primaryExpr();
                break;
            }
            return expr;
        }

        var exponentialExpr = function() {
            var expr = unaryExpr();
            var t;
            while ((t = hd()) === TK_CARET) {
                var startIdStyle = scan.idStyle();
                next();
                var expr2;
                expr2 = braceOptionalExpr();
                var endIdStyle = scan.idStyle();
                expr = {op: tokenToOp[t], args: [expr, expr2]};
                addStyles(expr, startIdStyle, endIdStyle);
            }
            return expr;
        }

        var setOpStyle = function(expr, index, styleName, value) {
            if (expr.opsStyles === undefined) {
                expr.opsStyles = [];
            }
            if (expr.opsStyles[index] === undefined) {
                expr.opsStyles[index] = {};
            }
            expr.opsStyles[index][styleName] = value;
        }

        var addStyles = function(expr, startIdStyle, endIdStyle, opIdStyle) {
            if (expr.opsStyles === undefined) {
                 expr.opsStyles = [{}];
            }
            if ((startIdStyle !== undefined) && (startIdStyle === endIdStyle)) {
                expr.idStyle = startIdStyle;
                expr.style = styles[startIdStyle];
            } else if (opIdStyle !== undefined) {
                expr.opsStyles[0] = styles[opIdStyle];
            }
        }

        var multiplicativeExpr = function() {
            var startIdStyle = scan.idStyle();
            var expr = exponentialExpr();
            var t;
            t = hd();
            while (isMultiplicative(t) || (t === TK_VAR) || (t === TK_LEFTPAREN)) {
                var opIdStyle = scan.idStyle();
                var align = undefined;
                if (isMultiplicative(t)) {
                    align = alignment();
                    next();
                }
                var expr2 = exponentialExpr();
                var endIdStyle = scan.lastIdStyle();
                expr = {op: tokenToOp[t], args: [expr, expr2]};
                addStyles(expr, startIdStyle, endIdStyle, opIdStyle);
                setOpStyle(expr, 0, "align", align);
                if (t !== TK_DIV) {
                   if ((t === TK_TIMES) || (t === TK_CDOT)) {
                      setOpStyle(expr, 0, "symbol", tokenToOp[t]);
                   }
                   expr.op = "*";
                }
                t = hd();
            }
            return expr;

            function isMultiplicative(t) {
                return t === TK_MUL || t === TK_DIV || t === TK_TIMES || t === TK_CDOT;
            }
        }

        var additiveExpr = function() {
            var startIdStyle = scan.idStyle();
            var expr = multiplicativeExpr();
            var t;
            while (isAdditive(t = hd())) {
                var opIdStyle = scan.idStyle();
                var align = alignment();
                next();
                var expr2 = multiplicativeExpr();
                var endIdStyle = scan.lastIdStyle();
                expr = {op: tokenToOp[t], args: [expr, expr2]};
                addStyles(expr, startIdStyle, endIdStyle, opIdStyle);
                setOpStyle(expr, 0, "align", align);
            }
            return expr;

            function isAdditive(t) {
                return t === TK_ADD || t === TK_SUB || t === TK_PM;
            }
        }

        var compareExpr = function() {
            var startIdStyle = scan.idStyle();
            var expr = additiveExpr();
            if (expr === undefined) {
                expr = {op: OpStr.EMP, args: []};
            }
            var t = hd();
            while ((t === TK_EQL) || (t === TK_LT) || (t === TK_GT) || (t === TK_LEQ) || (t === TK_GEQ) || (t === TK_NOT)) {
                var align = alignment();
                opIdStyle = scan.idStyle();
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
                var endIdStyle = scan.idStyle();
                expr = {op: op, args: [expr, expr2]};
                addStyles(expr, startIdStyle, endIdStyle, opIdStyle);
                setOpStyle(expr, 0, "align", align);
                t = hd();
            }
            return expr;

        }

        var commaExpr = function() {
            var n = compareExpr();
            return n;
        }

        var expr = function() {
            start();
            var n = commaExpr();
            return n;
        }

        var scanner = function(src) {
            var idStyle = function() {
                return openedStyles[openedStyles.length - 1];
            }

            var start = function() {
                var c;
                lexeme = "";
                alignment = [0, 0];
                lastIdStyle = idStyle();
                while (popStyles > 0) {
                    openedStyles.pop();
                    popStyles--;
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
                        if ((token === TK_TIMES) || (token === TK_CDOT)) {
                            var nc = src.charCodeAt(curIndex);
                            while ((nc === TK_AMP) || (nc === TK_SPACE)) {
                                curIndex++;
                                if (nc === TK_AMP) {
                                    alignment[1]++;
                                }
                                nc = src.charCodeAt(curIndex);
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
                            nc = src.charCodeAt(curIndex);
                        }
                        return c; // char code is the token id
                    case TK_SHARP:
                        c = src.charCodeAt(curIndex);
                        if (c === TK_LEFTBRACE) {
                            curIndex++;
                            braceIsForStyle.push(true);
                        } else {
                            popStyles++;
                        }
                        openedStyles.push(curIdStyle);
                        curIdStyle++;
                        continue;
                    case TK_LEFTBRACE:
                        braceIsForStyle.push(false);
                        lexeme += String.fromCharCode(c);
                        return c;
                    case TK_RIGHTBRACE:
                        if (braceIsForStyle.pop()) {
                            lastIdStyle = openedStyles.pop();
                            //popStyles++;
                            continue;
                        }
                        lexeme += String.fromCharCode(c);
                        return c;
                    default:
                        if (c >= "A".charCodeAt(0) && c <= "Z".charCodeAt(0)) {
                            lexeme += String.fromCharCode(c);
                            return TK_COEFF;
                        }
                        else if (c >= "a".charCodeAt(0) && c <= "z".charCodeAt(0)) {
                            lexeme += String.fromCharCode(c);
                            return TK_VAR;
                        }
                        else if (c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0)) {
                            //lexeme += String.fromCharCode(c);
                            //c = src.charCodeAt(curIndex++);
                            //return TK_NUM;
                            return number(c);
                        }
                        else {
                            KhanUtil.assert(false, "scan.start(): c=" + c);
                            return 0;
                        }
                    }
                }
                return 0;
            }

            var number = function(c) {
                while (c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0)) {
                    lexeme += String.fromCharCode(c);
                    c = src.charCodeAt(curIndex++);
                }
                curIndex--;

                return TK_NUM;
            }

            var latex = function() {
                var c = src.charCodeAt(curIndex++);
                while (c >= "a".charCodeAt(0) && c <= "z".charCodeAt(0)) {
                    lexeme += String.fromCharCode(c);
                    c = src.charCodeAt(curIndex++);
                }
                curIndex--;

                var tk = lexemeToToken[lexeme];
                if (tk === void 0) {
                    tk = TK_VAR;   // e.g. \\theta
                }
                return tk;
            }

            var readChar = function() {
                return src.charAt(curIndex++);
            }

            var curIndex = 0;
            var curIdStyle = 0;
            var lexeme = "";
            var alignment = [0, 0];
            var popStyles = 0;
            var lastIdStyle = undefined;

            var lexemeToToken = [];
            var braceIsForStyle = [];
            var openedStyles = [];

            lexemeToToken["\\times"] = TK_TIMES;
            lexemeToToken["\\cdot"] = TK_CDOT;
            lexemeToToken["\\div"] = TK_DIV;
            lexemeToToken["\\frac"] = TK_FRAC;
            lexemeToToken["\\dfrac"] = TK_DFRAC;
            lexemeToToken["\\sqrt"] = TK_SQRT;
            lexemeToToken["\\pm"] = TK_PM;
            lexemeToToken["\\sin"] = TK_SIN;
            lexemeToToken["\\cos"] = TK_COS;
            lexemeToToken["\\tan"] = TK_TAN;
            lexemeToToken["\\sec"] = TK_SEC;
            lexemeToToken["\\cot"] = TK_COT;
            lexemeToToken["\\csc"] = TK_CSC;
            lexemeToToken["\\ln"] = TK_LN;
            lexemeToToken["\\leq"] = TK_LEQ;
            lexemeToToken["\\geq"] = TK_GEQ;
            lexemeToToken["\\not"] = TK_NOT;
            lexemeToToken["\\color"] = TK_COLOR;

            return {
                start: start,
                lexeme: function() { return lexeme },
                readChar: readChar,
                alignment: function() { return alignment },
                idStyle: idStyle,
                lastIdStyle: function() { return lastIdStyle }
            };
        }

        src = src.replace(/\u2212/g, "-");
        if (styles === undefined) {
            styles = [];
        } else {
            for (var iStyle = 0; iStyle < styles.length; iStyle++) {
               var style = styles[iStyle];
               if (typeof style === "string") {
                  style = {color: style};
               }
               style.idStyle = iStyle;
               styles[iStyle] = style;
            }
        }
        var TK_NONE = 0;
        var TK_ADD = "+".charCodeAt(0);
        var TK_CARET = "^".charCodeAt(0);
        var TK_DIV = "/".charCodeAt(0);
        var TK_EQL = "=".charCodeAt(0);
        var TK_LT = "<".charCodeAt(0);
        var TK_GT = ">".charCodeAt(0);
        var TK_LEFTBRACE = "{".charCodeAt(0);
        var TK_LEFTBRACKET = "[".charCodeAt(0);
        var TK_LEFTPAREN = "(".charCodeAt(0);
        var TK_MUL = "*".charCodeAt(0);
        var TK_NUM = "0".charCodeAt(0);
        var TK_RIGHTBRACE = "}".charCodeAt(0);
        var TK_RIGHTBRACKET = "]".charCodeAt(0);
        var TK_RIGHTPAREN = ")".charCodeAt(0);
        var TK_SUB = "-".charCodeAt(0);
        var TK_VAR = "a".charCodeAt(0);
        var TK_COEFF = "A".charCodeAt(0);
        var TK_VAR = "a".charCodeAt(0);
        var TK_ABS = "|".charCodeAt(0);
        var TK_COMMA = ",".charCodeAt(0);
        var TK_SPACE = " ".charCodeAt(0);
        var TK_BACKSLASH = "\\".charCodeAt(0);
        var TK_AMP = "&".charCodeAt(0);
        var TK_SHARP = "#".charCodeAt(0);
        var TK_CDOT = 0x100;
        var TK_TIMES = 0x101;
        var TK_PM = 0x102;
        var TK_FRAC = 0x103;
        var TK_DFRAC = 0x104;
        var TK_LN = 0x105;
        var TK_COS = 0x106;
        var TK_SIN = 0x107;
        var TK_TAN = 0x108;
        var TK_SEC = 0x109;
        var TK_COT = 0x110;
        var TK_CSC = 0x111;
        var TK_SQRT = 0x112;
        var TK_LEQ = 0x113;
        var TK_GEQ = 0x114;
        var TK_NOT = 0x115;
        var TK_NEXT = 0x116;
        var TK_COLOR = 0x117;

        var curIdStyle = 0;

        var T0 = TK_NONE, T1 = TK_NONE;

        var tokenToOp = [];
        tokenToOp[TK_FRAC] = OpStr.FRAC;
        tokenToOp[TK_DFRAC] = OpStr.DFRAC;
        tokenToOp[TK_SQRT] = OpStr.SQRT;
        tokenToOp[TK_ADD] = OpStr.ADD;
        tokenToOp[TK_SUB] = OpStr.SUB;
        tokenToOp[TK_PM] = OpStr.PM;
        tokenToOp[TK_CARET] = OpStr.POW;
        tokenToOp[TK_MUL] = OpStr.MUL;
        tokenToOp[TK_TIMES] = OpStr.TIMES;
        tokenToOp[TK_CDOT] = OpStr.CDOT;
        tokenToOp[TK_DIV] = OpStr.FRAC;
        tokenToOp[TK_SIN] = OpStr.SIN;
        tokenToOp[TK_COS] = OpStr.COS;
        tokenToOp[TK_TAN] = OpStr.TAN;
        tokenToOp[TK_SEC] = OpStr.SEC;
        tokenToOp[TK_COT] = OpStr.COT;
        tokenToOp[TK_CSC] = OpStr.CSC;
        tokenToOp[TK_LN] = OpStr.LN;
        tokenToOp[TK_EQL] = OpStr.EQL;
        tokenToOp[TK_LT] = OpStr.LT;
        tokenToOp[TK_GT] = OpStr.GT;
        tokenToOp[TK_GEQ] = OpStr.GEQ;
        tokenToOp[TK_LEQ] = OpStr.LEQ;
        tokenToOp[TK_ABS] = OpStr.ABS;

        var scan = scanner(src);

        return expr();
    };

    $.extend(KhanUtil, {
        parseFormat: parseFormat,
        parse: parse,
        format: format,
        formatGroup: formatGroup,
        polynomial: polynomial
    });
})();
