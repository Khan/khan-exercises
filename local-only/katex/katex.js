(function(e){if("function"==typeof bootstrap)bootstrap("katex",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeKatex=e}else"undefined"!=typeof window?window.katex=e():global.katex=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ParseError = require("./ParseError");

// The main lexer class
function Lexer(input) {
    this._input = input;
};

// The result of a single lex
function LexResult(type, text, position) {
    this.type = type;
    this.text = text;
    this.position = position;
}

// "normal" types of tokens
var normals = [
    [/^[/|@."`0-9]/, "textord"],
    [/^[a-zA-Z]/, "mathord"],
    [/^[*+-]/, "bin"],
    [/^[=<>:]/, "rel"],
    [/^[,;]/, "punct"],
    [/^'/, "'"],
    [/^\^/, "^"],
    [/^_/, "_"],
    [/^{/, "{"],
    [/^}/, "}"],
    [/^[(\[]/, "open"],
    [/^[)\]?!]/, "close"]
];

// Build a regex to easily parse the functions
var anyFunc = /^\\(?:[a-zA-Z]+|.)/;

// Lex a single token
Lexer.prototype.lex = function(pos) {
    var input = this._input.slice(pos);

    // Get rid of whitespace
    var whitespace = input.match(/^\s*/)[0];
    pos += whitespace.length;
    input = input.slice(whitespace.length);

    // If there's no more input to parse, return an EOF token
    if (input.length === 0) {
        return new LexResult("EOF", null, pos);
    }

    var match;
    if ((match = input.match(anyFunc))) {
        // If we match one of the tokens, extract the type
        return new LexResult(match[0], match[0], pos + match[0].length);
    } else {
        // Otherwise, we look through the normal token regexes and see if it's
        // one of them.
        for (var i = 0; i < normals.length; i++) {
            var normal = normals[i];

            if ((match = input.match(normal[0]))) {
                // If it is, return it
                return new LexResult(
                    normal[1], match[0], pos + match[0].length);
            }
        }
    }

    // We didn't match any of the tokens, so throw an error.
    throw new ParseError("Unexpected character: '" + input[0] +
        "' at position " + pos);
};

module.exports = Lexer;

},{"./ParseError":3}],2:[function(require,module,exports){
function Options(style, size, color, depth, parentStyle, parentSize) {
    this.style = style;
    this.color = color;
    this.size = size;

    // TODO(emily): Get rid of depth when we can actually use sizing everywhere
    if (!depth) {
        depth = 0;
    }
    this.depth = depth;

    if (!parentStyle) {
        parentStyle = style;
    }
    this.parentStyle = parentStyle;

    if (!parentSize) {
        parentSize = size;
    }
    this.parentSize = parentSize;
}

Options.prototype.withStyle = function(style) {
    return new Options(style, this.size, this.color, this.depth + 1,
        this.style, this.size);
};

Options.prototype.withSize = function(size) {
    return new Options(this.style, size, this.color, this.depth + 1,
        this.style, this.size);
};

Options.prototype.withColor = function(color) {
    return new Options(this.style, this.size, color, this.depth + 1,
        this.style, this.size);
};

Options.prototype.reset = function() {
    return new Options(this.style, this.size, this.color, this.depth + 1,
        this.style, this.size);
};

module.exports = Options;

},{}],3:[function(require,module,exports){
function ParseError(message) {
    var self = new Error("TeX parse error: " + message);
    self.name = "ParseError";
    self.__proto__ = ParseError.prototype;
    return self;
}

ParseError.prototype.__proto__ = Error.prototype;

module.exports = ParseError;

},{}],4:[function(require,module,exports){
var Lexer = require("./Lexer");
var utils = require("./utils");

var ParseError = require("./ParseError");

// Main Parser class
function Parser() {
};

// Returned by the Parser.parse... functions. Stores the current results and
// the new lexer position.
function ParseResult(result, newPosition) {
    this.result = result;
    this.position = newPosition;
}

// The resulting parse tree nodes of the parse tree.
function ParseNode(type, value) {
    this.type = type;
    this.value = value;
}

// Checks a result to make sure it has the right type, and throws an
// appropriate error otherwise.
var expect = function(result, type) {
    if (result.type !== type) {
        throw new ParseError(
            "Expected '" + type + "', got '" + result.type + "'");
    }
};

// Main parsing function, which parses an entire input. Returns either a list
// of parseNodes or null if the parse fails.
Parser.prototype.parse = function(input) {
    // Make a new lexer
    this.lexer = new Lexer(input);

    // Try to parse the input
    var parse = this.parseInput(0);
    return parse.result;
};

// Parses an entire input tree
Parser.prototype.parseInput = function(pos) {
    // Parse an expression
    var expression = this.parseExpression(pos);
    // If we succeeded, make sure there's an EOF at the end
    var EOF = this.lexer.lex(expression.position);
    expect(EOF, "EOF");
    return expression;
};

// Parses an "expression", which is a list of atoms
Parser.prototype.parseExpression = function(pos) {
    // Start with a list of nodes
    var expression = [];
    while (true) {
        // Try to parse atoms
        var parse = this.parseAtom(pos);
        if (parse) {
            // Copy them into the list
            expression.push(parse.result);
            pos = parse.position;
        } else {
            break;
        }
    }
    return new ParseResult(expression, pos);
};

// Parses a superscript expression, like "^3"
Parser.prototype.parseSuperscript = function(pos) {
    // Try to parse a "^" character
    var sup = this.lexer.lex(pos);
    if (sup.type === "^") {
        // If we got one, parse the corresponding group
        var group = this.parseGroup(sup.position);
        if (group) {
            return group;
        } else {
            // Throw an error if we didn't find a group
            throw new ParseError("Couldn't find group after '^'");
        }
    } else if (sup.type === "'") {
        var pos = sup.position;
        return new ParseResult(
            new ParseNode("textord", "\\prime"), sup.position);
    } else {
        return null;
    }
};

// Parses a subscript expression, like "_3"
Parser.prototype.parseSubscript = function(pos) {
    // Try to parse a "_" character
    var sub = this.lexer.lex(pos);
    if (sub.type === "_") {
        // If we got one, parse the corresponding group
        var group = this.parseGroup(sub.position);
        if (group) {
            return group;
        } else {
            // Throw an error if we didn't find a group
            throw new ParseError("Couldn't find group after '_'");
        }
    } else {
        return null;
    }
};

// Parses an atom, which consists of a nucleus, and an optional superscript and
// subscript
Parser.prototype.parseAtom = function(pos) {
    // Parse the nucleus
    var nucleus = this.parseGroup(pos);
    var nextPos = pos;
    var nucleusNode;

    if (nucleus) {
        nextPos = nucleus.position;
        nucleusNode = nucleus.result;
    }

    var sup;
    var sub;

    // Now, we try to parse a subscript or a superscript (or both!), and
    // depending on whether those succeed, we return the correct type.
    while (true) {
        var node;
        if ((node = this.parseSuperscript(nextPos))) {
            if (sup) {
                throw new ParseError("Parse error: Double superscript");
            }
            nextPos = node.position;
            sup = node.result;
            continue;
        }
        if ((node = this.parseSubscript(nextPos))) {
            if (sub) {
                throw new ParseError("Parse error: Double subscript");
            }
            nextPos = node.position;
            sub = node.result;
            continue;
        }
        break;
    }

    if (sup || sub) {
        return new ParseResult(
            new ParseNode("supsub", {base: nucleusNode, sup: sup,
                    sub: sub}),
            nextPos);
    } else {
        return nucleus;
    }
}

// Parses a group, which is either a single nucleus (like "x") or an expression
// in braces (like "{x+y}")
Parser.prototype.parseGroup = function(pos) {
    var start = this.lexer.lex(pos);
    // Try to parse an open brace
    if (start.type === "{") {
        // If we get a brace, parse an expression
        var expression = this.parseExpression(start.position);
        // Make sure we get a close brace
        var closeBrace = this.lexer.lex(expression.position);
        expect(closeBrace, "}");
        return new ParseResult(
            new ParseNode("ordgroup", expression.result),
            closeBrace.position);
    } else {
        // Otherwise, just return a nucleus
        return this.parseNucleus(pos);
    }
};


// A list of 1-argument color functions
var colorFuncs = [
    "\\blue", "\\orange", "\\pink", "\\red", "\\green", "\\gray", "\\purple"
];

// A list of 1-argument sizing functions
var sizeFuncs = [
    "\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize",
    "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"
];

// A map of elements that don't have arguments, and should simply be placed
// into a group depending on their type. The keys are the groups that items can
// be placed in, and the values are lists of element types that should be
// placed in those groups.
//
// For example, if the lexer returns something of type "colon", we should
// return a node of type "punct"
var copyFuncs = {
    "textord": [
        "textord",
        "\\$",
        "\\%",
        "\\angle",
        "\\infty",
        "\\prime",
        "\\triangle",
        "\\Gamma",
        "\\Delta",
        "\\Theta",
        "\\Lambda",
        "\\Xi",
        "\\Pi",
        "\\Sigma",
        "\\Upsilon",
        "\\Phi",
        "\\Psi",
        "\\Omega"
    ],
    "mathord": [
        "mathord",
        "\\alpha",
        "\\beta",
        "\\gamma",
        "\\delta",
        "\\epsilon",
        "\\zeta",
        "\\eta",
        "\\theta",
        "\\iota",
        "\\kappa",
        "\\lambda",
        "\\mu",
        "\\nu",
        "\\xi",
        "\\omicron",
        "\\pi",
        "\\rho",
        "\\sigma",
        "\\tau",
        "\\upsilon",
        "\\phi",
        "\\chi",
        "\\psi",
        "\\omega",
        "\\varepsilon",
        "\\vartheta",
        "\\varpi",
        "\\varrho",
        "\\varsigma",
        "\\varphi"
    ],
    "bin": [
        "bin",
        "\\cdot",
        "\\circ",
        "\\div",
        "\\pm",
        "\\times"
    ],
    "open": [
        "open",
        "\\lvert"
    ],
    "close": [
        "close",
        "\\rvert"
    ],
    "rel": [
        "rel",
        "\\approx",
        "\\ge",
        "\\geq",
        "\\gets",
        "\\in",
        "\\leftarrow",
        "\\le",
        "\\leq",
        "\\ne",
        "\\neq",
        "\\rightarrow",
        "\\to"
    ],
    "amsrel": [
        "\\ngeq",
        "\\nleq"
    ],
    "spacing": [
        "\\ ",
        "\\,",
        "\\:",
        "\\;",
        "\\qquad",
        "\\quad",
        "\\space"
    ],
    "punct": [
        "punct",
        "\\colon"
    ],
    "namedfn": [
        "\\arcsin",
        "\\arccos",
        "\\arctan",
        "\\arg",
        "\\cos",
        "\\cosh",
        "\\cot",
        "\\coth",
        "\\csc",
        "\\deg",
        "\\dim",
        "\\exp",
        "\\hom",
        "\\ker",
        "\\lg",
        "\\ln",
        "\\log",
        "\\sec",
        "\\sin",
        "\\sinh",
        "\\tan",
        "\\tanh"
    ]
};

// Build a list of all of the different functions in the copyFuncs list, to
// quickly check if the function should be interpreted by the map.
var funcToType = {};
for (var type in copyFuncs) {
    for (var i = 0; i < copyFuncs[type].length; i++) {
        var func = copyFuncs[type][i];
        funcToType[func] = type;
    }
}

// Parses a "nucleus", which is either a single token from the tokenizer or a
// function and its arguments
Parser.prototype.parseNucleus = function(pos) {
    var nucleus = this.lexer.lex(pos);

    if (utils.contains(colorFuncs, nucleus.type)) {
        // If this is a color function, parse its argument and return
        var group = this.parseGroup(nucleus.position);
        if (group) {
            var atoms;
            if (group.result.type === "ordgroup") {
                atoms = group.result.value;
            } else {
                atoms = [group.result];
            }
            return new ParseResult(
                new ParseNode("color",
                    {color: nucleus.type.slice(1), value: atoms}),
                group.position);
        } else {
            throw new ParseError(
                "Expected group after '" + nucleus.text + "'");
        }
    } else if (utils.contains(sizeFuncs, nucleus.type)) {
        // If this is a color function, parse its argument and return
        var group = this.parseGroup(nucleus.position);
        if (group) {
            return new ParseResult(
                new ParseNode("sizing", {
                    size: "size" + (sizeFuncs.indexOf(nucleus.type) + 1),
                    value: group.result
                }),
                group.position);
        } else {
            throw new ParseError(
                "Expected group after '" + nucleus.text + "'");
        }
    } else if (nucleus.type === "\\llap" || nucleus.type === "\\rlap") {
        // If this is an llap or rlap, parse its argument and return
        var group = this.parseGroup(nucleus.position);
        if (group) {
            return new ParseResult(
                new ParseNode(nucleus.type.slice(1), group.result),
                group.position);
        } else {
            throw new ParseError(
                "Expected group after '" + nucleus.text + "'");
        }
    } else if (nucleus.type === "\\dfrac" || nucleus.type === "\\frac" ||
            nucleus.type === "\\tfrac") {
        // If this is a frac, parse its two arguments and return
        var numer = this.parseGroup(nucleus.position);
        if (numer) {
            var denom = this.parseGroup(numer.position);
            if (denom) {
                return new ParseResult(
                    new ParseNode("frac", {
                        numer: numer.result,
                        denom: denom.result,
                        size: nucleus.type.slice(1)
                    }),
                    denom.position);
            } else {
                throw new ParseError("Expected denominator after '" +
                    nucleus.type + "'");
            }
        } else {
            throw new ParseError("Parse error: Expected numerator after '" +
                nucleus.type + "'");
        }
    } else if (nucleus.type === "\\KaTeX") {
        return new ParseResult(
            new ParseNode("katex", null),
            nucleus.position
        );
    } else if (funcToType[nucleus.type]) {
        // Otherwise if this is a no-argument function, find the type it
        // corresponds to in the map and return
        return new ParseResult(
            new ParseNode(funcToType[nucleus.type], nucleus.text),
            nucleus.position);
    } else {
        // Otherwise, we couldn't parse it
        return null;
    }
};

module.exports = Parser;

},{"./Lexer":1,"./ParseError":3,"./utils":11}],5:[function(require,module,exports){
function Style(id, size, multiplier, cramped) {
    this.id = id;
    this.size = size;
    this.cramped = cramped;
    this.sizeMultiplier = multiplier;
}

Style.prototype.sup = function() {
    return styles[sup[this.id]];
};

Style.prototype.sub = function() {
    return styles[sub[this.id]];
};

Style.prototype.fracNum = function() {
    return styles[fracNum[this.id]];
};

Style.prototype.fracDen = function() {
    return styles[fracDen[this.id]];
};

// HTML class name, like "displaystyle cramped"
Style.prototype.cls = function() {
    return sizeNames[this.size] + (this.cramped ? " cramped" : " uncramped");
};

// HTML Reset class name, like "reset-textstyle"
Style.prototype.reset = function() {
    return resetNames[this.size];
};

var D = 0;
var Dc = 1;
var T = 2;
var Tc = 3;
var S = 4;
var Sc = 5;
var SS = 6;
var SSc = 7;

var sizeNames = [
    "displaystyle textstyle",
    "textstyle",
    "scriptstyle",
    "scriptscriptstyle"
];

var resetNames = [
    "reset-textstyle",
    "reset-textstyle",
    "reset-scriptstyle",
    "reset-scriptscriptstyle",
];

var styles = [
    new Style(D, 0, 1.0, false),
    new Style(Dc, 0, 1.0, true),
    new Style(T, 1, 1.0, false),
    new Style(Tc, 1, 1.0, true),
    new Style(S, 2, 0.66667, false),
    new Style(Sc, 2, 0.66667, true),
    new Style(SS, 3, 0.5, false),
    new Style(SSc, 3, 0.5, true)
];

var sup = [S, Sc, S, Sc, SS, SSc, SS, SSc];
var sub = [Sc, Sc, Sc, Sc, SSc, SSc, SSc, SSc];
var fracNum = [T, Tc, S, Sc, SS, SSc, SS, SSc];
var fracDen = [Tc, Tc, Sc, Sc, SSc, SSc, SSc, SSc];

module.exports = {
    DISPLAY: styles[D],
    TEXT: styles[T]
};

},{}],6:[function(require,module,exports){
var Options = require("./Options");
var ParseError = require("./ParseError");
var Style = require("./Style");

var domTree = require("./domTree");
var fontMetrics = require("./fontMetrics");
var parseTree = require("./parseTree");
var utils = require("./utils");

var buildExpression = function(expression, options, prev) {
    var groups = [];
    for (var i = 0; i < expression.length; i++) {
        var group = expression[i];
        groups.push(buildGroup(group, options, prev));
        prev = group;
    }
    return groups;
};

var makeSpan = function(classes, children) {
    var height = 0;
    var depth = 0;

    if (children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].height > height) {
                height = children[i].height;
            }
            if (children[i].depth > depth) {
                depth = children[i].depth;
            }
        }
    }

    return new domTree.span(classes, children, height, depth);
};

var groupToType = {
    mathord: "mord",
    textord: "mord",
    bin: "mbin",
    rel: "mrel",
    amsrel: "mrel",
    open: "mopen",
    close: "mclose",
    frac: "minner",
    spacing: "mord",
    punct: "mpunct",
    ordgroup: "mord",
    namedfn: "mop",
    katex: "mord",
};

var getTypeOfGroup = function(group) {
    if (group == null) {
        // Like when typesetting $^3$
        return groupToType.ord;
    } else if (group.type === "supsub") {
        return getTypeOfGroup(group.value.base);
    } else if (group.type === "llap" || group.type === "rlap") {
        return getTypeOfGroup(group.value);
    } else if (group.type === "color") {
        return getTypeOfGroup(group.value.value);
    } else {
        return groupToType[group.type];
    }
};

var groupTypes = {
    mathord: function(group, options, prev) {
        return makeSpan(["mord", options.color], [mathit(group.value)]);
    },

    textord: function(group, options, prev) {
        return makeSpan(["mord", options.color], [mathrm(group.value)]);
    },

    bin: function(group, options, prev) {
        var className = "mbin";
        var prevAtom = prev;
        while (prevAtom && prevAtom.type == "color") {
            var atoms = prevAtom.value.value;
            prevAtom = atoms[atoms.length - 1];
        }
        if (!prev || utils.contains(["bin", "open", "rel", "op", "punct"],
                prevAtom.type)) {
            group.type = "ord";
            className = "mord";
        }
        return makeSpan([className, options.color], [mathrm(group.value)]);
    },

    rel: function(group, options, prev) {
        return makeSpan(["mrel", options.color], [mathrm(group.value)]);
    },

    amsrel: function(group, options, prev) {
        return makeSpan(["mrel", options.color], [amsrm(group.value)]);
    },

    supsub: function(group, options, prev) {
        var base = buildGroup(group.value.base, options.reset());

        if (group.value.sup) {
            var sup = buildGroup(group.value.sup,
                    options.withStyle(options.style.sup()));
            var supmid = makeSpan(
                    [options.style.reset(), options.style.sup().cls()], [sup]);
            var supwrap = makeSpan(["msup", options.style.reset()], [supmid]);
        }

        if (group.value.sub) {
            var sub = buildGroup(group.value.sub,
                    options.withStyle(options.style.sub()));
            var submid = makeSpan(
                    [options.style.reset(), options.style.sub().cls()], [sub]);
            var subwrap = makeSpan(["msub"], [submid]);
        }

        var u = base.height - fontMetrics.metrics.supDrop;
        var v = base.depth + fontMetrics.metrics.subDrop;

        var p;
        if (options.style === Style.DISPLAY) {
            p = fontMetrics.metrics.sup1;
        } else if (options.style.cramped) {
            p = fontMetrics.metrics.sup3;
        } else {
            p = fontMetrics.metrics.sup2;
        }

        var supsub;

        if (!group.value.sup) {
            v = Math.max(v, fontMetrics.metrics.sub1,
                sub.height - 0.8 * fontMetrics.metrics.xHeight);

            subwrap.style.top = v + "em";

            subwrap.depth = subwrap.depth + v;
            subwrap.height = 0;

            supsub = makeSpan(["msupsub"], [subwrap]);
        } else if (!group.value.sub) {
            u = Math.max(u, p,
                sup.depth + 0.25 * fontMetrics.metrics.xHeight);

            supwrap.style.top = -u + "em";

            supwrap.height = supwrap.height + u;
            supwrap.depth = 0;

            supsub = makeSpan(["msupsub"], [supwrap]);
        } else {
            u = Math.max(u, p,
                sup.depth + 0.25 * fontMetrics.metrics.xHeight);
            v = Math.max(v, fontMetrics.metrics.sub2);

            var theta = fontMetrics.metrics.defaultRuleThickness;

            if ((u - sup.depth) - (sub.height - v) < 4 * theta) {
                v = 4 * theta - (u - sup.depth) + sub.height;
                var psi = 0.8 * fontMetrics.metrics.xHeight - (u - sup.depth);
                if (psi > 0) {
                    u += psi;
                    v -= psi;
                }
            }

            supwrap.style.top = -u + "em";
            subwrap.style.top = v + "em";

            supwrap.height = supwrap.height + u;
            supwrap.depth = 0;

            subwrap.height = 0;
            subwrap.depth = subwrap.depth + v;

            supsub = makeSpan(["msupsub"], [supwrap, subwrap]);
        }

        return makeSpan([getTypeOfGroup(group.value.base)], [base, supsub]);
    },

    open: function(group, options, prev) {
        return makeSpan(["mopen", options.color], [mathrm(group.value)]);
    },

    close: function(group, options, prev) {
        return makeSpan(["mclose", options.color], [mathrm(group.value)]);
    },

    frac: function(group, options, prev) {
        var fstyle = options.style;
        if (group.value.size === "dfrac") {
            fstyle = Style.DISPLAY;
        } else if (group.value.size === "tfrac") {
            fstyle = Style.TEXT;
        }

        var nstyle = fstyle.fracNum();
        var dstyle = fstyle.fracDen();

        var numer = buildGroup(group.value.numer, options.withStyle(nstyle));
        var numernumer = makeSpan([fstyle.reset(), nstyle.cls()], [numer]);
        var numerrow = makeSpan(["mfracnum"], [numernumer]);

        var mid = makeSpan(["mfracmid"], [makeSpan()]);

        var denom = buildGroup(group.value.denom, options.withStyle(dstyle));
        var denomdenom = makeSpan([fstyle.reset(), dstyle.cls()], [denom])
        var denomrow = makeSpan(["mfracden"], [denomdenom]);

        var theta = fontMetrics.metrics.defaultRuleThickness;

        var u, v, phi;
        if (fstyle.size === Style.DISPLAY.size) {
            u = fontMetrics.metrics.num1;
            v = fontMetrics.metrics.denom1;
            phi = 3 * theta;
        } else {
            u = fontMetrics.metrics.num2;
            v = fontMetrics.metrics.denom2;
            phi = theta;
        }

        var a = fontMetrics.metrics.axisHeight;

        if ((u - numer.depth) - (a + 0.5 * theta) < phi) {
            u += phi - ((u - numer.depth) - (a + 0.5 * theta));
        }

        if ((a - 0.5 * theta) - (denom.height - v) < phi) {
            v += phi - ((a - 0.5 * theta) - (denom.height - v));
        }

        numerrow.style.top = -u + "em";
        mid.style.top = -(a - 0.5 * theta) + "em";
        denomrow.style.top = v + "em";

        numerrow.height = numerrow.height + u;
        numerrow.depth = 0;

        denomrow.height = 0;
        denomrow.depth = denomrow.depth + v;

        var frac = makeSpan([], [numerrow, mid, denomrow]);

        frac.height *= fstyle.sizeMultiplier / options.style.sizeMultiplier;
        frac.depth *= fstyle.sizeMultiplier / options.style.sizeMultiplier;

        var wrap = makeSpan([options.style.reset(), fstyle.cls()], [frac]);

        return makeSpan(["minner", options.color], [
            makeSpan(["mfrac"], [wrap])
        ]);
    },

    color: function(group, options, prev) {
        var els = buildExpression(
            group.value.value,
            options.withColor(group.value.color),
            prev
        );

        var height = 0;
        var depth = 0;

        for (var i = 0; i < els.length; i++) {
            if (els[i].height > height) {
                var height = els[i].height;
            }
            if (els[i].depth > depth) {
                var depth = els[i].depth;
            }
        }

        return new domTree.documentFragment(els, height, depth);
    },

    spacing: function(group, options, prev) {
        if (group.value === "\\ " || group.value === "\\space") {
            return makeSpan(["mord", "mspace"], [mathrm(group.value)]);
        } else {
            var spacingClassMap = {
                "\\qquad": "qquad",
                "\\quad": "quad",
                "\\;": "thickspace",
                "\\:": "mediumspace",
                "\\,": "thinspace"
            };

            return makeSpan(["mord", "mspace", spacingClassMap[group.value]]);
        }
    },

    llap: function(group, options, prev) {
        var inner = makeSpan([], [buildGroup(group.value, options.reset())]);
        return makeSpan(["llap", options.style.cls()], [inner]);
    },

    rlap: function(group, options, prev) {
        var inner = makeSpan([], [buildGroup(group.value, options.reset())]);
        return makeSpan(["rlap", options.style.cls()], [inner]);
    },

    punct: function(group, options, prev) {
        return makeSpan(["mpunct", options.color], [mathrm(group.value)]);
    },

    ordgroup: function(group, options, prev) {
        return makeSpan(["mord", options.style.cls()],
            buildExpression(group.value, options.reset())
        );
    },

    namedfn: function(group, options, prev) {
        var chars = [];
        for (var i = 1; i < group.value.length; i++) {
            chars.push(mathrm(group.value[i]));
        }

        return makeSpan(["mop", options.color], chars);
    },

    katex: function(group, options, prev) {
        var k = makeSpan(["k"], [mathrm("K")]);
        var a = makeSpan(["a"], [mathrm("A")]);

        a.height = (a.height + 0.2) * 0.75;
        a.depth = (a.height - 0.2) * 0.75;

        var t = makeSpan(["t"], [mathrm("T")]);
        var e = makeSpan(["e"], [mathrm("E")]);

        e.height = (e.height - 0.2155);
        e.depth = (e.depth + 0.2155);

        var x = makeSpan(["x"], [mathrm("X")]);

        return makeSpan(["katex-logo", options.color], [k, a, t, e, x]);
    },

    sizing: function(group, options, prev) {
        var inner = buildGroup(group.value.value,
                options.withSize(group.value.size), prev);

        return makeSpan(
            ["sizing", "reset-" + options.size, group.value.size,
                getTypeOfGroup(group.value.value)],
            [inner]);
    }
};

var sizingMultiplier = {
    size1: 0.5,
    size2: 0.7,
    size3: 0.8,
    size4: 0.9,
    size5: 1.0,
    size6: 1.2,
    size7: 1.44,
    size8: 1.73,
    size9: 2.07,
    size10: 2.49
};

var buildGroup = function(group, options, prev) {
    if (!group) {
        return makeSpan();
    }

    if (groupTypes[group.type]) {
        var groupNode = groupTypes[group.type](group, options, prev);

        if (options.style !== options.parentStyle) {
            var multiplier = options.style.sizeMultiplier /
                    options.parentStyle.sizeMultiplier;

            if (multiplier > 1) {
                throw new ParseError(
                    "Error: Can't go from small to large style");
            }

            groupNode.height *= multiplier;
            groupNode.depth *= multiplier;
        }

        if (options.size !== options.parentSize) {
            var multiplier = sizingMultiplier[options.size] /
                    sizingMultiplier[options.parentSize];

            if (multiplier > 1) {
                throw new ParseError(
                    "Error: Can't go from small to large size");
            }

            if (options.depth > 1) {
                throw new ParseError(
                    "Error: Can't use sizing outside of the root node");
            }

            groupNode.height *= multiplier;
            groupNode.depth *= multiplier;
        }

        return groupNode;
    } else {
        throw new ParseError(
            "Lex error: Got group of unknown type: '" + group.type + "'");
    }
};

var charLookup = {
    "*": "\u2217",
    "-": "\u2212",
    "`": "\u2018",
    "\\ ": "\u00a0",
    "\\$": "$",
    "\\%": "%",
    "\\angle": "\u2220",
    "\\approx": "\u2248",
    "\\cdot": "\u22c5",
    "\\circ": "\u2218",
    "\\colon": ":",
    "\\div": "\u00f7",
    "\\ge": "\u2265",
    "\\geq": "\u2265",
    "\\gets": "\u2190",
    "\\in": "\u2208",
    "\\infty": "\u221e",
    "\\leftarrow": "\u2190",
    "\\le": "\u2264",
    "\\leq": "\u2264",
    "\\lvert": "|",
    "\\ne": "\u2260",
    "\\neq": "\u2260",
    "\\ngeq": "\u2271",
    "\\nleq": "\u2270",
    "\\pm": "\u00b1",
    "\\prime": "\u2032",
    "\\rightarrow": "\u2192",
    "\\rvert": "|",
    "\\space": "\u00a0",
    "\\times": "\u00d7",
    "\\to": "\u2192",
    "\\triangle": "\u25b3",

    "\\alpha": "\u03b1",
    "\\beta": "\u03b2",
    "\\gamma": "\u03b3",
    "\\delta": "\u03b4",
    "\\epsilon": "\u03f5",
    "\\zeta": "\u03b6",
    "\\eta": "\u03b7",
    "\\theta": "\u03b8",
    "\\iota": "\u03b9",
    "\\kappa": "\u03ba",
    "\\lambda": "\u03bb",
    "\\mu": "\u03bc",
    "\\nu": "\u03bd",
    "\\xi": "\u03be",
    "\\omicron": "o",
    "\\pi": "\u03c0",
    "\\rho": "\u03c1",
    "\\sigma": "\u03c3",
    "\\tau": "\u03c4",
    "\\upsilon": "\u03c5",
    "\\phi": "\u03d5",
    "\\chi": "\u03c7",
    "\\psi": "\u03c8",
    "\\omega": "\u03c9",
    "\\varepsilon": "\u03b5",
    "\\vartheta": "\u03d1",
    "\\varpi": "\u03d6",
    "\\varrho": "\u03f1",
    "\\varsigma": "\u03c2",
    "\\varphi": "\u03c6",

    "\\Gamma": "\u0393",
    "\\Delta": "\u0394",
    "\\Theta": "\u0398",
    "\\Lambda": "\u039b",
    "\\Xi": "\u039e",
    "\\Pi": "\u03a0",
    "\\Sigma": "\u03a3",
    "\\Upsilon": "\u03a5",
    "\\Phi": "\u03a6",
    "\\Psi": "\u03a8",
    "\\Omega": "\u03a9"
};

var makeText = function(value, style) {
    if (value in charLookup) {
        value = charLookup[value];
    }

    var metrics = fontMetrics.getCharacterMetrics(value, style);

    if (metrics) {
        var textNode = new domTree.textNode(value, metrics.height,
            metrics.depth);
        if (metrics.italic > 0) {
            var span = makeSpan([], [textNode]);
            span.style["margin-right"] = metrics.italic + "em";

            return span;
        } else {
            return textNode;
        }
    } else {
        console && console.warn("No character metrics for '" + value +
            "' in style '" + style + "'");
        return new domTree.textNode(value, 0, 0);
    }
};

var mathit = function(value) {
    return makeSpan(["mathit"], [makeText(value, "math-italic")]);
};

var mathrm = function(value) {
    return makeText(value, "main-regular");
};

var amsrm = function(value) {
    return makeSpan(["amsrm"], [makeText(value, "ams-regular")]);
};

var buildTree = function(tree) {
    // Setup the default options
    var options = new Options(Style.TEXT, "size5", "");

    var expression = buildExpression(tree, options);
    var span = makeSpan(["base", options.style.cls()], expression);
    var topStrut = makeSpan(["strut"]);
    var bottomStrut = makeSpan(["strut", "bottom"]);

    topStrut.style.height = span.height + "em";
    bottomStrut.style.height = (span.height + span.depth) + "em";

    var katexNode = makeSpan(["katex"], [
        makeSpan(["katex-inner"], [topStrut, bottomStrut, span])
    ]);

    return katexNode.toDOM();
};

module.exports = buildTree;

},{"./Options":2,"./ParseError":3,"./Style":5,"./domTree":7,"./fontMetrics":8,"./parseTree":10,"./utils":11}],7:[function(require,module,exports){
// These objects store the data about the DOM nodes we create, as well as some
// extra data. They can then be transformed into real DOM nodes with the toDOM
// function. They are useful for both storing extra properties on the nodes, as
// well as providing a way to easily work with the DOM.

function span(classes, children, height, depth, style) {
    this.classes = classes || [];
    this.children = children || [];
    this.height = height || 0;
    this.depth = depth || 0;
    this.style = style || {};
}

span.prototype.toDOM = function() {
    var span = document.createElement("span");

    var classes = this.classes.slice();
    for (var i = classes.length - 1; i >= 0; i--) {
        if (!classes[i]) {
            classes.splice(i, 1);
        }
    }

    span.className = classes.join(" ");

    for (var style in this.style) {
        if (this.style.hasOwnProperty(style)) {
            span.style[style] = this.style[style];
        }
    }

    for (var i = 0; i < this.children.length; i++) {
        span.appendChild(this.children[i].toDOM());
    }

    return span;
};

function documentFragment(children, height, depth) {
    this.children = children || [];
    this.height = height || 0;
    this.depth = depth || 0;
}

documentFragment.prototype.toDOM = function() {
    var frag = document.createDocumentFragment();

    for (var i = 0; i < this.children.length; i++) {
        frag.appendChild(this.children[i].toDOM());
    }

    return frag;
};

function textNode(value, height, depth) {
    this.value = value || "";
    this.height = height || 0;
    this.depth = depth || 0;
}

textNode.prototype.toDOM = function() {
    return document.createTextNode(this.value);
};

module.exports = {
    span: span,
    documentFragment: documentFragment,
    textNode: textNode
};

},{}],8:[function(require,module,exports){
// These font metrics are extracted from TeX
var sigma1 = 0.025;
var sigma2 = 0;
var sigma3 = 0;
var sigma4 = 0;
var sigma5 = 0.431;
var sigma6 = 1;
var sigma7 = 0;
var sigma8 = 0.677;
var sigma9 = 0.394;
var sigma10 = 0.444;
var sigma11 = 0.686;
var sigma12 = 0.345;
var sigma13 = 0.413;
var sigma14 = 0.363;
var sigma15 = 0.289;
var sigma16 = 0.150;
var sigma17 = 0.247;
var sigma18 = 0.386;
var sigma19 = 0.050;
var sigma20 = 2.390;
var sigma21 = 0.101;
var sigma22 = 0.250;

var xi1 = 0;
var xi2 = 0;
var xi3 = 0;
var xi4 = 0;
var xi5 = .431;
var xi6 = 1;
var xi7 = 0;
var xi8 = .04;
var xi9 = .111;
var xi10 = .166;
var xi11 = .2;
var xi12 = .6;
var xi13 = .1;

// This is just a mapping from common names to real metrics
var metrics = {
    xHeight: sigma5,
    quad: sigma6,
    num1: sigma8,
    num2: sigma9,
    num3: sigma10,
    denom1: sigma11,
    denom2: sigma12,
    sup1: sigma13,
    sup2: sigma14,
    sup3: sigma15,
    sub1: sigma16,
    sub2: sigma17,
    supDrop: sigma18,
    subDrop: sigma19,
    delim1: sigma20,
    delim2: sigma21,
    axisHeight: sigma22,
    defaultRuleThickness: xi8,
    bigOpSpacing1: xi9,
    bigOpSpacing2: xi10,
    bigOpSpacing3: xi11,
    bigOpSpacing4: xi12,
    bigOpSpacing5: xi13
};

// This map is generated by metric_parse.rb
var metricMap = {"main-regular":{"13":{"height":0,"depth":0,"italic":0},"32":{"height":0,"depth":0,"italic":0},"33":{"height":0.716,"depth":-0.001,"italic":0.0},"34":{"height":0.694,"depth":-0.379,"italic":0.0},"35":{"height":0.694,"depth":0.194,"italic":0.0},"36":{"height":0.75,"depth":0.056,"italic":0.0},"37":{"height":0.75,"depth":0.056,"italic":0.0},"38":{"height":0.716,"depth":0.022,"italic":0.0},"39":{"height":0.694,"depth":-0.379,"italic":0.0},"40":{"height":0.75,"depth":0.25,"italic":0.0},"41":{"height":0.75,"depth":0.25,"italic":0.0},"42":{"height":0.75,"depth":-0.32,"italic":0.0},"43":{"height":0.583,"depth":0.082,"italic":0.0},"44":{"height":0.121,"depth":0.194,"italic":0.0},"45":{"height":0.252,"depth":-0.179,"italic":0.0},"46":{"height":0.12,"depth":0.0,"italic":0.0},"47":{"height":0.75,"depth":0.25,"italic":0.0},"48":{"height":0.666,"depth":0.022,"italic":0.0},"49":{"height":0.666,"depth":0.0,"italic":0.0},"50":{"height":0.666,"depth":0.0,"italic":0.0},"51":{"height":0.665,"depth":0.022,"italic":0.0},"52":{"height":0.677,"depth":0.0,"italic":0.0},"53":{"height":0.666,"depth":0.022,"italic":0.0},"54":{"height":0.666,"depth":0.022,"italic":0.0},"55":{"height":0.676,"depth":0.022,"italic":0.0},"56":{"height":0.666,"depth":0.022,"italic":0.0},"57":{"height":0.666,"depth":0.022,"italic":0.0},"58":{"height":0.43,"depth":0.0,"italic":0.0},"59":{"height":0.43,"depth":0.194,"italic":0.0},"60":{"height":0.54,"depth":0.04,"italic":0.0},"61":{"height":0.367,"depth":-0.133,"italic":0.0},"62":{"height":0.54,"depth":0.04,"italic":0.0},"63":{"height":0.705,"depth":-0.001,"italic":0.0},"64":{"height":0.705,"depth":0.011,"italic":0.0},"65":{"height":0.716,"depth":0.0,"italic":0.0},"66":{"height":0.683,"depth":0.0,"italic":0.0},"67":{"height":0.705,"depth":0.021,"italic":0.0},"68":{"height":0.683,"depth":0.0,"italic":0.0},"69":{"height":0.68,"depth":0.0,"italic":0.0},"70":{"height":0.68,"depth":0.0,"italic":0.0},"71":{"height":0.705,"depth":0.022,"italic":0.0},"72":{"height":0.683,"depth":0.0,"italic":0.0},"73":{"height":0.683,"depth":0.0,"italic":0.0},"74":{"height":0.683,"depth":0.022,"italic":0.0},"75":{"height":0.683,"depth":0.0,"italic":0.0},"76":{"height":0.683,"depth":0.0,"italic":0.0},"77":{"height":0.683,"depth":0.0,"italic":0.0},"78":{"height":0.683,"depth":0.0,"italic":0.0},"79":{"height":0.705,"depth":0.022,"italic":0.0},"80":{"height":0.683,"depth":0.0,"italic":0.0},"81":{"height":0.705,"depth":0.193,"italic":0.0},"82":{"height":0.683,"depth":0.022,"italic":0.0},"83":{"height":0.705,"depth":0.022,"italic":0.0},"84":{"height":0.677,"depth":0.0,"italic":0.0},"85":{"height":0.683,"depth":0.022,"italic":0.0},"86":{"height":0.683,"depth":0.022,"italic":0.0},"87":{"height":0.683,"depth":0.022,"italic":0.0},"88":{"height":0.683,"depth":0.0,"italic":0.0},"89":{"height":0.683,"depth":0.0,"italic":0.0},"90":{"height":0.683,"depth":0.0,"italic":0.0},"91":{"height":0.75,"depth":0.25,"italic":0.0},"92":{"height":0.75,"depth":0.25,"italic":0.0},"93":{"height":0.75,"depth":0.25,"italic":0.0},"94":{"height":0.694,"depth":-0.531,"italic":0.0},"95":{"height":-0.025,"depth":0.062,"italic":0.0},"96":{"height":0.699,"depth":-0.505,"italic":0.0},"97":{"height":0.448,"depth":0.011,"italic":0.0},"98":{"height":0.694,"depth":0.011,"italic":0.0},"99":{"height":0.448,"depth":0.011,"italic":0.0},"100":{"height":0.694,"depth":0.011,"italic":0.0},"101":{"height":0.448,"depth":0.011,"italic":0.0},"102":{"height":0.705,"depth":0.0,"italic":0.066},"103":{"height":0.453,"depth":0.206,"italic":0.0},"104":{"height":0.694,"depth":0.0,"italic":0.0},"105":{"height":0.669,"depth":0.0,"italic":0.0},"106":{"height":0.669,"depth":0.205,"italic":0.0},"107":{"height":0.694,"depth":0.0,"italic":0.0},"108":{"height":0.694,"depth":0.0,"italic":0.0},"109":{"height":0.442,"depth":0.0,"italic":0.0},"110":{"height":0.442,"depth":0.0,"italic":0.0},"111":{"height":0.448,"depth":0.01,"italic":0.0},"112":{"height":0.442,"depth":0.194,"italic":0.0},"113":{"height":0.442,"depth":0.194,"italic":0.007},"114":{"height":0.442,"depth":0.0,"italic":0.0},"115":{"height":0.448,"depth":0.011,"italic":0.0},"116":{"height":0.615,"depth":0.01,"italic":0.0},"117":{"height":0.442,"depth":0.011,"italic":0.0},"118":{"height":0.431,"depth":0.011,"italic":0.0},"119":{"height":0.431,"depth":0.011,"italic":0.0},"120":{"height":0.431,"depth":0.0,"italic":0.0},"121":{"height":0.431,"depth":0.204,"italic":0.0},"122":{"height":0.431,"depth":0.0,"italic":0.0},"123":{"height":0.75,"depth":0.25,"italic":0.0},"124":{"height":0.75,"depth":0.249,"italic":0.0},"125":{"height":0.75,"depth":0.25,"italic":0.0},"126":{"height":0.318,"depth":-0.215,"italic":0.0},"160":{"height":0,"depth":0,"italic":0},"168":{"height":0.669,"depth":-0.554,"italic":0.0},"172":{"height":0.356,"depth":-0.089,"italic":0.0},"173":{"height":0.252,"depth":-0.179,"italic":0.0},"175":{"height":0.59,"depth":-0.544,"italic":0.0},"176":{"height":0.715,"depth":-0.542,"italic":0.0},"177":{"height":0.666,"depth":0.0,"italic":0.0},"180":{"height":0.699,"depth":-0.505,"italic":0.0},"215":{"height":0.491,"depth":-0.009,"italic":0.0},"247":{"height":0.537,"depth":0.036,"italic":0.0},"305":{"height":0.442,"depth":0.0,"italic":0.0},"567":{"height":0.442,"depth":0.205,"italic":0.0},"710":{"height":0.694,"depth":-0.531,"italic":0.0},"711":{"height":0.644,"depth":-0.513,"italic":0.0},"713":{"height":0.59,"depth":-0.544,"italic":0.0},"714":{"height":0.699,"depth":-0.505,"italic":0.0},"715":{"height":0.699,"depth":-0.505,"italic":0.0},"728":{"height":0.694,"depth":-0.515,"italic":0.0},"729":{"height":0.669,"depth":-0.549,"italic":0.0},"730":{"height":0.715,"depth":-0.542,"italic":0.0},"732":{"height":0.668,"depth":-0.565,"italic":0.0},"768":{"height":0.699,"depth":-0.505,"italic":0.0},"769":{"height":0.699,"depth":-0.505,"italic":0.0},"770":{"height":0.694,"depth":-0.531,"italic":0.0},"771":{"height":0.668,"depth":-0.565,"italic":0.0},"772":{"height":0.59,"depth":-0.544,"italic":0.0},"774":{"height":0.694,"depth":-0.515,"italic":0.0},"775":{"height":0.669,"depth":-0.549,"italic":0.0},"776":{"height":0.669,"depth":-0.554,"italic":0.0},"778":{"height":0.715,"depth":-0.542,"italic":0.0},"779":{"height":0.701,"depth":-0.51,"italic":0.0},"780":{"height":0.644,"depth":-0.513,"italic":0.0},"824":{"height":0.716,"depth":0.215,"italic":0.0},"915":{"height":0.68,"depth":0.0,"italic":0.0},"916":{"height":0.716,"depth":0.0,"italic":0.0},"920":{"height":0.705,"depth":0.022,"italic":0.0},"923":{"height":0.716,"depth":0.0,"italic":0.0},"926":{"height":0.677,"depth":0.0,"italic":0.0},"928":{"height":0.68,"depth":0.0,"italic":0.0},"931":{"height":0.683,"depth":0.0,"italic":0.0},"933":{"height":0.705,"depth":0.0,"italic":0.0},"934":{"height":0.683,"depth":0.0,"italic":0.0},"936":{"height":0.683,"depth":0.0,"italic":0.0},"937":{"height":0.704,"depth":0.0,"italic":0.0},"8192":{"height":0,"depth":0,"italic":0},"8193":{"height":0,"depth":0,"italic":0},"8194":{"height":0,"depth":0,"italic":0},"8195":{"height":0,"depth":0,"italic":0},"8196":{"height":0,"depth":0,"italic":0},"8197":{"height":0,"depth":0,"italic":0},"8198":{"height":0,"depth":0,"italic":0},"8199":{"height":0,"depth":0,"italic":0},"8200":{"height":0,"depth":0,"italic":0},"8201":{"height":0,"depth":0,"italic":0},"8202":{"height":0,"depth":0,"italic":0},"8208":{"height":0.252,"depth":-0.179,"italic":0.0},"8209":{"height":0.252,"depth":-0.179,"italic":0.0},"8210":{"height":0.252,"depth":-0.179,"italic":0.0},"8211":{"height":0.285,"depth":-0.248,"italic":0.0},"8212":{"height":0.285,"depth":-0.248,"italic":0.0},"8216":{"height":0.694,"depth":-0.379,"italic":0.0},"8217":{"height":0.694,"depth":-0.379,"italic":0.0},"8220":{"height":0.694,"depth":-0.379,"italic":0.0},"8221":{"height":0.694,"depth":-0.379,"italic":0.0},"8224":{"height":0.705,"depth":0.216,"italic":0.0},"8225":{"height":0.705,"depth":0.205,"italic":0.0},"8230":{"height":0.12,"depth":0.0,"italic":0.0},"8239":{"height":0,"depth":0,"italic":0},"8242":{"height":0.56,"depth":-0.043,"italic":0.0},"8287":{"height":0,"depth":0,"italic":0},"8407":{"height":0.714,"depth":-0.516,"italic":0.0},"8463":{"height":0.695,"depth":0.013,"italic":0.022},"8465":{"height":0.705,"depth":0.01,"italic":0.0},"8467":{"height":0.705,"depth":0.02,"italic":0.0},"8472":{"height":0.453,"depth":0.216,"italic":0.0},"8476":{"height":0.716,"depth":0.022,"italic":0.0},"8501":{"height":0.694,"depth":0.0,"italic":0.0},"8592":{"height":0.511,"depth":0.011,"italic":0.0},"8593":{"height":0.694,"depth":0.193,"italic":0.0},"8594":{"height":0.511,"depth":0.011,"italic":0.0},"8595":{"height":0.694,"depth":0.194,"italic":0.0},"8596":{"height":0.511,"depth":0.011,"italic":0.0},"8597":{"height":0.772,"depth":0.272,"italic":0.0},"8598":{"height":0.72,"depth":0.195,"italic":0.0},"8599":{"height":0.72,"depth":0.195,"italic":0.0},"8600":{"height":0.695,"depth":0.22,"italic":0.0},"8601":{"height":0.695,"depth":0.22,"italic":0.0},"8614":{"height":0.511,"depth":0.011,"italic":0.0},"8617":{"height":0.511,"depth":0.011,"italic":0.0},"8618":{"height":0.511,"depth":0.011,"italic":0.0},"8636":{"height":0.511,"depth":-0.23,"italic":0.0},"8637":{"height":0.27,"depth":0.011,"italic":0.0},"8640":{"height":0.511,"depth":-0.23,"italic":0.0},"8641":{"height":0.27,"depth":0.011,"italic":0.0},"8652":{"height":0.671,"depth":0.011,"italic":0.0},"8656":{"height":0.525,"depth":0.024,"italic":0.0},"8657":{"height":0.694,"depth":0.194,"italic":0.0},"8658":{"height":0.525,"depth":0.024,"italic":0.0},"8659":{"height":0.694,"depth":0.194,"italic":0.0},"8660":{"height":0.526,"depth":0.025,"italic":0.0},"8661":{"height":0.772,"depth":0.272,"italic":0.0},"8704":{"height":0.694,"depth":0.022,"italic":0.0},"8706":{"height":0.715,"depth":0.022,"italic":0.035},"8707":{"height":0.694,"depth":0.0,"italic":0.0},"8709":{"height":0.772,"depth":0.078,"italic":0.0},"8711":{"height":0.683,"depth":0.033,"italic":0.0},"8712":{"height":0.54,"depth":0.04,"italic":0.0},"8713":{"height":0.716,"depth":0.215,"italic":0.0},"8715":{"height":0.54,"depth":0.04,"italic":0.0},"8722":{"height":0.27,"depth":-0.23,"italic":0.0},"8723":{"height":0.5,"depth":0.166,"italic":0.0},"8725":{"height":0.75,"depth":0.25,"italic":0.0},"8726":{"height":0.75,"depth":0.25,"italic":0.0},"8727":{"height":0.465,"depth":-0.035,"italic":0.0},"8728":{"height":0.444,"depth":-0.055,"italic":0.0},"8729":{"height":0.444,"depth":-0.055,"italic":0.0},"8730":{"height":0.8,"depth":0.2,"italic":0.021},"8733":{"height":0.442,"depth":0.011,"italic":0.0},"8734":{"height":0.442,"depth":0.011,"italic":0.0},"8736":{"height":0.694,"depth":0.0,"italic":0.0},"8739":{"height":0.75,"depth":0.249,"italic":0.0},"8741":{"height":0.75,"depth":0.25,"italic":0.0},"8743":{"height":0.598,"depth":0.022,"italic":0.0},"8744":{"height":0.598,"depth":0.022,"italic":0.0},"8745":{"height":0.598,"depth":0.022,"italic":0.0},"8746":{"height":0.598,"depth":0.022,"italic":0.0},"8747":{"height":0.716,"depth":0.216,"italic":0.055},"8764":{"height":0.367,"depth":-0.133,"italic":0.0},"8768":{"height":0.583,"depth":0.083,"italic":0.0},"8771":{"height":0.464,"depth":-0.036,"italic":0.0},"8773":{"height":0.589,"depth":-0.022,"italic":0.0},"8776":{"height":0.483,"depth":-0.055,"italic":0.0},"8781":{"height":0.484,"depth":-0.016,"italic":0.0},"8784":{"height":0.67,"depth":-0.133,"italic":0.0},"8800":{"height":0.716,"depth":0.215,"italic":0.0},"8801":{"height":0.464,"depth":-0.036,"italic":0.0},"8804":{"height":0.636,"depth":0.138,"italic":0.0},"8805":{"height":0.636,"depth":0.138,"italic":0.0},"8810":{"height":0.568,"depth":0.067,"italic":0.0},"8811":{"height":0.567,"depth":0.067,"italic":0.0},"8826":{"height":0.539,"depth":0.041,"italic":0.0},"8827":{"height":0.539,"depth":0.041,"italic":0.0},"8834":{"height":0.54,"depth":0.04,"italic":0.0},"8835":{"height":0.54,"depth":0.04,"italic":0.0},"8838":{"height":0.636,"depth":0.138,"italic":0.0},"8839":{"height":0.636,"depth":0.138,"italic":0.0},"8846":{"height":0.598,"depth":0.022,"italic":0.0},"8849":{"height":0.636,"depth":0.138,"italic":0.0},"8850":{"height":0.636,"depth":0.138,"italic":0.0},"8851":{"height":0.598,"depth":0.0,"italic":0.0},"8852":{"height":0.598,"depth":0.0,"italic":0.0},"8853":{"height":0.583,"depth":0.083,"italic":0.0},"8854":{"height":0.583,"depth":0.083,"italic":0.0},"8855":{"height":0.583,"depth":0.083,"italic":0.0},"8856":{"height":0.583,"depth":0.083,"italic":0.0},"8857":{"height":0.583,"depth":0.083,"italic":0.0},"8866":{"height":0.694,"depth":0.0,"italic":0.0},"8867":{"height":0.694,"depth":0.0,"italic":0.0},"8868":{"height":0.668,"depth":0.0,"italic":0.0},"8869":{"height":0.668,"depth":0.0,"italic":0.0},"8872":{"height":0.75,"depth":0.249,"italic":0.0},"8900":{"height":0.488,"depth":-0.012,"italic":0.0},"8901":{"height":0.31,"depth":-0.19,"italic":0.0},"8902":{"height":0.486,"depth":-0.016,"italic":0.0},"8904":{"height":0.505,"depth":0.005,"italic":0.0},"8942":{"height":0.9,"depth":0.03,"italic":0.0},"8943":{"height":0.31,"depth":-0.19,"italic":0.0},"8945":{"height":0.82,"depth":-0.1,"italic":0.0},"8968":{"height":0.75,"depth":0.25,"italic":0.0},"8969":{"height":0.75,"depth":0.25,"italic":0.0},"8970":{"height":0.75,"depth":0.25,"italic":0.0},"8971":{"height":0.75,"depth":0.25,"italic":0.0},"8994":{"height":0.388,"depth":-0.122,"italic":0.0},"8995":{"height":0.378,"depth":-0.134,"italic":0.0},"9136":{"height":0.744,"depth":0.244,"italic":0.0},"9137":{"height":0.744,"depth":0.244,"italic":0.0},"9651":{"height":0.716,"depth":0.0,"italic":0.0},"9657":{"height":0.505,"depth":0.005,"italic":0.0},"9661":{"height":0.5,"depth":0.215,"italic":0.0},"9667":{"height":0.505,"depth":0.005,"italic":0.0},"9711":{"height":0.715,"depth":0.215,"italic":0.0},"9824":{"height":0.727,"depth":0.13,"italic":0.0},"9825":{"height":0.716,"depth":0.033,"italic":0.0},"9826":{"height":0.727,"depth":0.162,"italic":0.0},"9827":{"height":0.726,"depth":0.13,"italic":0.0},"9837":{"height":0.75,"depth":0.022,"italic":0.0},"9838":{"height":0.734,"depth":0.223,"italic":0.0},"9839":{"height":0.723,"depth":0.223,"italic":0.0},"10216":{"height":0.75,"depth":0.25,"italic":0.0},"10217":{"height":0.75,"depth":0.25,"italic":0.0},"10222":{"height":0.744,"depth":0.244,"italic":0.0},"10223":{"height":0.744,"depth":0.244,"italic":0.0},"10229":{"height":0.511,"depth":0.011,"italic":0.0},"10230":{"height":0.511,"depth":0.011,"italic":0.0},"10231":{"height":0.511,"depth":0.011,"italic":0.0},"10232":{"height":0.525,"depth":0.024,"italic":0.0},"10233":{"height":0.525,"depth":0.024,"italic":0.0},"10234":{"height":0.525,"depth":0.024,"italic":0.0},"10236":{"height":0.511,"depth":0.011,"italic":0.0},"10815":{"height":0.683,"depth":0.0,"italic":0.0},"10927":{"height":0.636,"depth":0.138,"italic":0.0},"10928":{"height":0.636,"depth":0.138,"italic":0.0},"57344":{"height":0.43,"depth":0.0,"italic":0.0},"61437":{"height":0.1,"depth":0.0,"italic":0.0},"61438":{"height":0.1,"depth":0.0,"italic":0.0},"61439":{"height":0.1,"depth":0.0,"italic":0.0},"65535":{"height":0.533,"depth":0.0,"italic":0.0}},"math-italic":{"13":{"height":0,"depth":0,"italic":0},"32":{"height":0,"depth":0,"italic":0},"47":{"height":0.716,"depth":0.215,"italic":0.0},"65":{"height":0.716,"depth":0.0,"italic":0.0},"66":{"height":0.683,"depth":0.0,"italic":0.0},"67":{"height":0.705,"depth":0.022,"italic":0.045},"68":{"height":0.683,"depth":0.0,"italic":0.0},"69":{"height":0.68,"depth":0.0,"italic":0.026},"70":{"height":0.68,"depth":0.0,"italic":0.106},"71":{"height":0.705,"depth":0.022,"italic":0.0},"72":{"height":0.683,"depth":0.0,"italic":0.058},"73":{"height":0.683,"depth":0.0,"italic":0.064},"74":{"height":0.683,"depth":0.022,"italic":0.078},"75":{"height":0.683,"depth":0.0,"italic":0.041},"76":{"height":0.683,"depth":0.0,"italic":0.0},"77":{"height":0.683,"depth":0.0,"italic":0.081},"78":{"height":0.683,"depth":0.0,"italic":0.085},"79":{"height":0.704,"depth":0.022,"italic":0.0},"80":{"height":0.683,"depth":0.0,"italic":0.109},"81":{"height":0.704,"depth":0.194,"italic":0.0},"82":{"height":0.683,"depth":0.021,"italic":0.0},"83":{"height":0.705,"depth":0.022,"italic":0.032},"84":{"height":0.677,"depth":0.0,"italic":0.12},"85":{"height":0.683,"depth":0.022,"italic":0.084},"86":{"height":0.683,"depth":0.022,"italic":0.187},"87":{"height":0.683,"depth":0.022,"italic":0.104},"88":{"height":0.683,"depth":0.0,"italic":0.024},"89":{"height":0.683,"depth":-0.001,"italic":0.183},"90":{"height":0.683,"depth":0.0,"italic":0.041},"97":{"height":0.441,"depth":0.01,"italic":0.0},"98":{"height":0.694,"depth":0.011,"italic":0.0},"99":{"height":0.442,"depth":0.011,"italic":0.0},"100":{"height":0.694,"depth":0.01,"italic":0.003},"101":{"height":0.442,"depth":0.011,"italic":0.0},"102":{"height":0.705,"depth":0.205,"italic":0.06},"103":{"height":0.442,"depth":0.205,"italic":0.003},"104":{"height":0.694,"depth":0.011,"italic":0.0},"105":{"height":0.661,"depth":0.011,"italic":0.0},"106":{"height":0.661,"depth":0.204,"italic":0.0},"107":{"height":0.694,"depth":0.011,"italic":0.0},"108":{"height":0.694,"depth":0.011,"italic":0.0},"109":{"height":0.442,"depth":0.011,"italic":0.0},"110":{"height":0.442,"depth":0.011,"italic":0.0},"111":{"height":0.441,"depth":0.011,"italic":0.0},"112":{"height":0.442,"depth":0.194,"italic":0.0},"113":{"height":0.442,"depth":0.194,"italic":0.014},"114":{"height":0.442,"depth":0.011,"italic":0.0},"115":{"height":0.442,"depth":0.01,"italic":0.0},"116":{"height":0.626,"depth":0.011,"italic":0.0},"117":{"height":0.442,"depth":0.011,"italic":0.0},"118":{"height":0.443,"depth":0.011,"italic":0.0},"119":{"height":0.443,"depth":0.011,"italic":0.0},"120":{"height":0.442,"depth":0.011,"italic":0.0},"121":{"height":0.442,"depth":0.205,"italic":0.006},"122":{"height":0.442,"depth":0.011,"italic":0.003},"160":{"height":0,"depth":0,"italic":0},"915":{"height":0.68,"depth":-0.001,"italic":0.106},"916":{"height":0.716,"depth":0.0,"italic":0.0},"920":{"height":0.704,"depth":0.022,"italic":0.0},"923":{"height":0.716,"depth":0.0,"italic":0.0},"926":{"height":0.677,"depth":0.0,"italic":0.035},"928":{"height":0.68,"depth":0.0,"italic":0.057},"931":{"height":0.683,"depth":0.0,"italic":0.026},"933":{"height":0.705,"depth":0.0,"italic":0.118},"934":{"height":0.683,"depth":0.0,"italic":0.0},"936":{"height":0.683,"depth":0.0,"italic":0.08},"937":{"height":0.704,"depth":0.0,"italic":0.014},"945":{"height":0.442,"depth":0.011,"italic":0.0},"946":{"height":0.705,"depth":0.194,"italic":0.007},"947":{"height":0.441,"depth":0.216,"italic":0.025},"948":{"height":0.717,"depth":0.01,"italic":0.007},"949":{"height":0.452,"depth":0.022,"italic":0.0},"950":{"height":0.704,"depth":0.204,"italic":0.033},"951":{"height":0.442,"depth":0.216,"italic":0.006},"952":{"height":0.705,"depth":0.01,"italic":0.0},"953":{"height":0.442,"depth":0.01,"italic":0.0},"954":{"height":0.442,"depth":0.011,"italic":0.0},"955":{"height":0.694,"depth":0.012,"italic":0.0},"956":{"height":0.442,"depth":0.216,"italic":0.0},"957":{"height":0.442,"depth":0.002,"italic":0.036},"958":{"height":0.704,"depth":0.205,"italic":0.005},"959":{"height":0.441,"depth":0.011,"italic":0.0},"960":{"height":0.431,"depth":0.011,"italic":0.003},"961":{"height":0.442,"depth":0.216,"italic":0.0},"962":{"height":0.442,"depth":0.107,"italic":0.042},"963":{"height":0.431,"depth":0.011,"italic":0.001},"964":{"height":0.431,"depth":0.013,"italic":0.081},"965":{"height":0.443,"depth":0.01,"italic":0.0},"966":{"height":0.442,"depth":0.218,"italic":0.0},"967":{"height":0.442,"depth":0.204,"italic":0.0},"968":{"height":0.694,"depth":0.205,"italic":0.0},"969":{"height":0.443,"depth":0.011,"italic":0.0},"977":{"height":0.705,"depth":0.011,"italic":0.0},"981":{"height":0.694,"depth":0.205,"italic":0.0},"982":{"height":0.431,"depth":0.01,"italic":0.0},"1009":{"height":0.442,"depth":0.194,"italic":0.0},"1013":{"height":0.431,"depth":0.011,"italic":0.0},"8192":{"height":0,"depth":0,"italic":0},"8193":{"height":0,"depth":0,"italic":0},"8194":{"height":0,"depth":0,"italic":0},"8195":{"height":0,"depth":0,"italic":0},"8196":{"height":0,"depth":0,"italic":0},"8197":{"height":0,"depth":0,"italic":0},"8198":{"height":0,"depth":0,"italic":0},"8199":{"height":0,"depth":0,"italic":0},"8200":{"height":0,"depth":0,"italic":0},"8201":{"height":0,"depth":0,"italic":0},"8202":{"height":0,"depth":0,"italic":0},"8239":{"height":0,"depth":0,"italic":0},"8287":{"height":0,"depth":0,"italic":0},"57344":{"height":0.44,"depth":0.0,"italic":0.0},"61437":{"height":0.1,"depth":0.0,"italic":0.0},"61438":{"height":0.1,"depth":0.0,"italic":0.0},"61439":{"height":0.1,"depth":0.0,"italic":0.0},"65535":{"height":0.533,"depth":0.0,"italic":0.0}},"ams-regular":{"13":{"height":0,"depth":0,"italic":0},"32":{"height":0,"depth":0,"italic":0},"65":{"height":0.701,"depth":0.001,"italic":0.0},"66":{"height":0.683,"depth":0.001,"italic":0.0},"67":{"height":0.702,"depth":0.019,"italic":0.0},"68":{"height":0.683,"depth":0.001,"italic":0.0},"69":{"height":0.683,"depth":0.001,"italic":0.0},"70":{"height":0.683,"depth":0.001,"italic":0.0},"71":{"height":0.702,"depth":0.019,"italic":0.0},"72":{"height":0.683,"depth":0.001,"italic":0.0},"73":{"height":0.683,"depth":0.001,"italic":0.0},"74":{"height":0.683,"depth":0.077,"italic":0.0},"75":{"height":0.683,"depth":0.001,"italic":0.0},"76":{"height":0.683,"depth":0.001,"italic":0.0},"77":{"height":0.683,"depth":0.001,"italic":0.0},"78":{"height":0.683,"depth":0.02,"italic":0.0},"79":{"height":0.701,"depth":0.019,"italic":0.0},"80":{"height":0.683,"depth":0.001,"italic":0.0},"81":{"height":0.701,"depth":0.181,"italic":0.0},"82":{"height":0.683,"depth":0.001,"italic":0.0},"83":{"height":0.702,"depth":0.012,"italic":0.0},"84":{"height":0.683,"depth":0.001,"italic":0.0},"85":{"height":0.683,"depth":0.019,"italic":0.0},"86":{"height":0.683,"depth":0.02,"italic":0.0},"87":{"height":0.683,"depth":0.019,"italic":0.0},"88":{"height":0.683,"depth":0.001,"italic":0.0},"89":{"height":0.683,"depth":0.001,"italic":0.0},"90":{"height":0.683,"depth":0.001,"italic":0.0},"107":{"height":0.683,"depth":0.001,"italic":0.0},"160":{"height":0,"depth":0,"italic":0},"165":{"height":0.683,"depth":0.0,"italic":0.0},"174":{"height":0.709,"depth":0.175,"italic":0.0},"240":{"height":0.749,"depth":0.021,"italic":0.0},"295":{"height":0.695,"depth":0.013,"italic":0.022},"710":{"height":0.845,"depth":-0.561,"italic":0.014},"732":{"height":0.899,"depth":-0.628,"italic":0.0},"770":{"height":0.845,"depth":-0.561,"italic":0.013},"771":{"height":0.899,"depth":-0.628,"italic":0.0},"989":{"height":0.605,"depth":0.085,"italic":0.0},"1008":{"height":0.434,"depth":0.006,"italic":0.067},"8192":{"height":0,"depth":0,"italic":0},"8193":{"height":0,"depth":0,"italic":0},"8194":{"height":0,"depth":0,"italic":0},"8195":{"height":0,"depth":0,"italic":0},"8196":{"height":0,"depth":0,"italic":0},"8197":{"height":0,"depth":0,"italic":0},"8198":{"height":0,"depth":0,"italic":0},"8199":{"height":0,"depth":0,"italic":0},"8200":{"height":0,"depth":0,"italic":0},"8201":{"height":0,"depth":0,"italic":0},"8202":{"height":0,"depth":0,"italic":0},"8239":{"height":0,"depth":0,"italic":0},"8245":{"height":0.56,"depth":-0.043,"italic":0.0},"8287":{"height":0,"depth":0,"italic":0},"8463":{"height":0.695,"depth":0.013,"italic":0.022},"8487":{"height":0.684,"depth":0.022,"italic":0.0},"8498":{"height":0.695,"depth":0.001,"italic":0.0},"8502":{"height":0.763,"depth":0.021,"italic":0.02},"8503":{"height":0.764,"depth":0.043,"italic":0.0},"8504":{"height":0.764,"depth":0.043,"italic":0.0},"8513":{"height":0.705,"depth":0.023,"italic":0.0},"8592":{"height":0.437,"depth":-0.064,"italic":0.0},"8594":{"height":0.437,"depth":-0.064,"italic":0.0},"8602":{"height":0.437,"depth":-0.06,"italic":0.0},"8603":{"height":0.437,"depth":-0.06,"italic":0.0},"8606":{"height":0.417,"depth":-0.083,"italic":0.0},"8608":{"height":0.417,"depth":-0.083,"italic":0.0},"8610":{"height":0.417,"depth":-0.083,"italic":0.0},"8611":{"height":0.417,"depth":-0.083,"italic":0.0},"8619":{"height":0.575,"depth":0.041,"italic":0.0},"8620":{"height":0.575,"depth":0.041,"italic":0.0},"8621":{"height":0.417,"depth":-0.083,"italic":0.0},"8622":{"height":0.437,"depth":-0.06,"italic":0.0},"8624":{"height":0.722,"depth":0.0,"italic":0.0},"8625":{"height":0.722,"depth":0.0,"italic":0.0},"8630":{"height":0.461,"depth":0.001,"italic":0.0},"8631":{"height":0.46,"depth":0.001,"italic":0.0},"8634":{"height":0.65,"depth":0.083,"italic":0.0},"8635":{"height":0.65,"depth":0.083,"italic":0.0},"8638":{"height":0.694,"depth":0.194,"italic":0.0},"8639":{"height":0.694,"depth":0.194,"italic":0.0},"8642":{"height":0.694,"depth":0.194,"italic":0.0},"8643":{"height":0.694,"depth":0.194,"italic":0.0},"8644":{"height":0.667,"depth":0.0,"italic":0.0},"8646":{"height":0.667,"depth":0.0,"italic":0.0},"8647":{"height":0.583,"depth":0.083,"italic":0.0},"8648":{"height":0.694,"depth":0.193,"italic":0.0},"8649":{"height":0.583,"depth":0.083,"italic":0.0},"8650":{"height":0.694,"depth":0.194,"italic":0.0},"8651":{"height":0.514,"depth":0.014,"italic":0.0},"8652":{"height":0.514,"depth":0.014,"italic":0.0},"8653":{"height":0.534,"depth":0.035,"italic":0.0},"8654":{"height":0.534,"depth":0.037,"italic":0.0},"8655":{"height":0.534,"depth":0.035,"italic":0.0},"8666":{"height":0.611,"depth":0.111,"italic":0.0},"8667":{"height":0.611,"depth":0.111,"italic":0.0},"8669":{"height":0.417,"depth":-0.083,"italic":0.0},"8672":{"height":0.437,"depth":-0.064,"italic":0.0},"8674":{"height":0.437,"depth":-0.064,"italic":0.0},"8705":{"height":0.846,"depth":0.021,"italic":0.0},"8708":{"height":0.86,"depth":0.166,"italic":0.0},"8709":{"height":0.587,"depth":0.003,"italic":0.0},"8717":{"height":0.44,"depth":0.001,"italic":0.027},"8722":{"height":0.27,"depth":-0.23,"italic":0.0},"8724":{"height":0.766,"depth":0.093,"italic":0.0},"8726":{"height":0.43,"depth":0.023,"italic":0.0},"8733":{"height":0.472,"depth":-0.028,"italic":0.0},"8736":{"height":0.694,"depth":0.0,"italic":0.0},"8737":{"height":0.714,"depth":0.02,"italic":0.0},"8738":{"height":0.551,"depth":0.051,"italic":0.0},"8739":{"height":0.43,"depth":0.023,"italic":0.0},"8740":{"height":0.75,"depth":0.252,"italic":0.018},"8741":{"height":0.431,"depth":0.023,"italic":0.0},"8742":{"height":0.75,"depth":0.25,"italic":0.018},"8756":{"height":0.471,"depth":0.082,"italic":0.0},"8757":{"height":0.471,"depth":0.082,"italic":0.0},"8764":{"height":0.365,"depth":-0.132,"italic":0.0},"8765":{"height":0.367,"depth":-0.133,"italic":0.0},"8769":{"height":0.467,"depth":-0.032,"italic":0.0},"8770":{"height":0.463,"depth":-0.034,"italic":0.0},"8774":{"height":0.652,"depth":0.155,"italic":0.0},"8776":{"height":0.481,"depth":-0.05,"italic":0.0},"8778":{"height":0.579,"depth":0.039,"italic":0.0},"8782":{"height":0.492,"depth":-0.008,"italic":0.0},"8783":{"height":0.492,"depth":-0.133,"italic":0.0},"8785":{"height":0.609,"depth":0.108,"italic":0.0},"8786":{"height":0.601,"depth":0.101,"italic":0.0},"8787":{"height":0.601,"depth":0.102,"italic":0.0},"8790":{"height":0.367,"depth":-0.133,"italic":0.0},"8791":{"height":0.721,"depth":-0.133,"italic":0.0},"8796":{"height":0.859,"depth":-0.133,"italic":0.0},"8806":{"height":0.753,"depth":0.175,"italic":0.0},"8807":{"height":0.753,"depth":0.175,"italic":0.0},"8808":{"height":0.752,"depth":0.286,"italic":0.0},"8809":{"height":0.752,"depth":0.286,"italic":0.0},"8812":{"height":0.75,"depth":0.25,"italic":0.0},"8814":{"height":0.708,"depth":0.209,"italic":0.0},"8815":{"height":0.708,"depth":0.209,"italic":0.0},"8816":{"height":0.801,"depth":0.303,"italic":0.0},"8817":{"height":0.801,"depth":0.303,"italic":0.0},"8818":{"height":0.732,"depth":0.228,"italic":0.0},"8819":{"height":0.732,"depth":0.228,"italic":0.0},"8822":{"height":0.681,"depth":0.253,"italic":0.0},"8823":{"height":0.681,"depth":0.253,"italic":0.0},"8828":{"height":0.58,"depth":0.153,"italic":0.0},"8829":{"height":0.58,"depth":0.154,"italic":0.0},"8830":{"height":0.732,"depth":0.228,"italic":0.0},"8831":{"height":0.732,"depth":0.228,"italic":0.0},"8832":{"height":0.705,"depth":0.208,"italic":0.0},"8833":{"height":0.705,"depth":0.208,"italic":0.0},"8840":{"height":0.801,"depth":0.303,"italic":0.0},"8841":{"height":0.801,"depth":0.303,"italic":0.0},"8842":{"height":0.635,"depth":0.241,"italic":0.0},"8843":{"height":0.635,"depth":0.241,"italic":0.0},"8847":{"height":0.539,"depth":0.041,"italic":0.0},"8848":{"height":0.539,"depth":0.041,"italic":0.0},"8858":{"height":0.582,"depth":0.082,"italic":0.0},"8859":{"height":0.582,"depth":0.082,"italic":0.0},"8861":{"height":0.582,"depth":0.082,"italic":0.0},"8862":{"height":0.689,"depth":0.0,"italic":0.0},"8863":{"height":0.689,"depth":0.0,"italic":0.0},"8864":{"height":0.689,"depth":0.0,"italic":0.0},"8865":{"height":0.689,"depth":0.0,"italic":0.0},"8872":{"height":0.694,"depth":0.0,"italic":0.0},"8873":{"height":0.694,"depth":0.0,"italic":0.0},"8874":{"height":0.694,"depth":0.0,"italic":0.0},"8876":{"height":0.695,"depth":0.001,"italic":0.0},"8877":{"height":0.695,"depth":0.001,"italic":0.0},"8878":{"height":0.695,"depth":0.001,"italic":0.0},"8879":{"height":0.695,"depth":0.001,"italic":0.0},"8882":{"height":0.539,"depth":0.041,"italic":0.0},"8883":{"height":0.539,"depth":0.041,"italic":0.0},"8884":{"height":0.636,"depth":0.138,"italic":0.0},"8885":{"height":0.636,"depth":0.138,"italic":0.0},"8888":{"height":0.408,"depth":-0.092,"italic":0.0},"8890":{"height":0.431,"depth":0.212,"italic":0.0},"8891":{"height":0.716,"depth":0.0,"italic":0.0},"8892":{"height":0.716,"depth":0.0,"italic":0.0},"8901":{"height":0.189,"depth":0.0,"italic":0.0},"8903":{"height":0.545,"depth":0.044,"italic":0.0},"8905":{"height":0.492,"depth":-0.008,"italic":0.0},"8906":{"height":0.492,"depth":-0.008,"italic":0.0},"8907":{"height":0.694,"depth":0.022,"italic":0.0},"8908":{"height":0.694,"depth":0.022,"italic":0.0},"8909":{"height":0.464,"depth":-0.036,"italic":0.0},"8910":{"height":0.578,"depth":0.021,"italic":0.0},"8911":{"height":0.578,"depth":0.022,"italic":0.0},"8912":{"height":0.54,"depth":0.04,"italic":0.0},"8913":{"height":0.54,"depth":0.04,"italic":0.0},"8914":{"height":0.598,"depth":0.022,"italic":0.0},"8915":{"height":0.598,"depth":0.022,"italic":0.0},"8916":{"height":0.736,"depth":0.022,"italic":0.0},"8918":{"height":0.541,"depth":0.041,"italic":0.0},"8919":{"height":0.541,"depth":0.041,"italic":0.0},"8920":{"height":0.568,"depth":0.067,"italic":0.0},"8921":{"height":0.568,"depth":0.067,"italic":0.0},"8922":{"height":0.886,"depth":0.386,"italic":0.0},"8923":{"height":0.886,"depth":0.386,"italic":0.0},"8926":{"height":0.734,"depth":0.0,"italic":0.0},"8927":{"height":0.734,"depth":0.0,"italic":0.0},"8928":{"height":0.801,"depth":0.303,"italic":0.0},"8929":{"height":0.801,"depth":0.303,"italic":0.0},"8934":{"height":0.73,"depth":0.359,"italic":0.0},"8935":{"height":0.73,"depth":0.359,"italic":0.0},"8936":{"height":0.73,"depth":0.359,"italic":0.0},"8937":{"height":0.73,"depth":0.359,"italic":0.0},"8938":{"height":0.706,"depth":0.208,"italic":0.0},"8939":{"height":0.706,"depth":0.208,"italic":0.0},"8940":{"height":0.802,"depth":0.303,"italic":0.0},"8941":{"height":0.801,"depth":0.303,"italic":0.0},"8994":{"height":0.378,"depth":-0.122,"italic":0.0},"8995":{"height":0.378,"depth":-0.143,"italic":0.0},"9416":{"height":0.709,"depth":0.175,"italic":0.0},"9484":{"height":0.694,"depth":-0.306,"italic":0.0},"9488":{"height":0.694,"depth":-0.306,"italic":0.0},"9492":{"height":0.366,"depth":0.022,"italic":0.0},"9496":{"height":0.366,"depth":0.022,"italic":0.0},"9585":{"height":0.694,"depth":0.195,"italic":0.0},"9586":{"height":0.694,"depth":0.195,"italic":0.0},"9632":{"height":0.689,"depth":0.0,"italic":0.0},"9633":{"height":0.689,"depth":0.0,"italic":0.0},"9650":{"height":0.575,"depth":0.02,"italic":0.0},"9651":{"height":0.575,"depth":0.02,"italic":0.0},"9654":{"height":0.539,"depth":0.041,"italic":0.0},"9660":{"height":0.576,"depth":0.019,"italic":0.0},"9661":{"height":0.576,"depth":0.019,"italic":0.0},"9664":{"height":0.539,"depth":0.041,"italic":0.0},"9674":{"height":0.716,"depth":0.132,"italic":0.0},"9733":{"height":0.694,"depth":0.111,"italic":0.0},"10003":{"height":0.706,"depth":0.034,"italic":0.0},"10016":{"height":0.716,"depth":0.022,"italic":0.0},"10731":{"height":0.716,"depth":0.132,"italic":0.0},"10846":{"height":0.813,"depth":0.097,"italic":0.0},"10877":{"height":0.636,"depth":0.138,"italic":0.0},"10878":{"height":0.636,"depth":0.138,"italic":0.0},"10885":{"height":0.762,"depth":0.29,"italic":0.0},"10886":{"height":0.762,"depth":0.29,"italic":0.0},"10887":{"height":0.635,"depth":0.241,"italic":0.0},"10888":{"height":0.635,"depth":0.241,"italic":0.0},"10889":{"height":0.761,"depth":0.387,"italic":0.0},"10890":{"height":0.761,"depth":0.387,"italic":0.0},"10891":{"height":1.003,"depth":0.463,"italic":0.0},"10892":{"height":1.003,"depth":0.463,"italic":0.0},"10901":{"height":0.636,"depth":0.138,"italic":0.0},"10902":{"height":0.636,"depth":0.138,"italic":0.0},"10933":{"height":0.752,"depth":0.286,"italic":0.0},"10934":{"height":0.752,"depth":0.286,"italic":0.0},"10935":{"height":0.761,"depth":0.294,"italic":0.0},"10936":{"height":0.761,"depth":0.294,"italic":0.0},"10937":{"height":0.761,"depth":0.337,"italic":0.0},"10938":{"height":0.761,"depth":0.337,"italic":0.0},"10949":{"height":0.753,"depth":0.215,"italic":0.0},"10950":{"height":0.753,"depth":0.215,"italic":0.0},"10955":{"height":0.783,"depth":0.385,"italic":0.0},"10956":{"height":0.783,"depth":0.385,"italic":0.0},"57344":{"height":0.0,"depth":0.0,"italic":0.0},"57350":{"height":0.43,"depth":0.023,"italic":0.019},"57351":{"height":0.431,"depth":0.024,"italic":0.019},"57352":{"height":0.605,"depth":0.085,"italic":0.0},"57353":{"height":0.434,"depth":0.006,"italic":0.067},"57356":{"height":0.752,"depth":0.284,"italic":0.0},"57357":{"height":0.752,"depth":0.284,"italic":0.0},"57358":{"height":0.919,"depth":0.421,"italic":0.0},"57359":{"height":0.801,"depth":0.303,"italic":0.0},"57360":{"height":0.801,"depth":0.303,"italic":0.0},"57361":{"height":0.919,"depth":0.421,"italic":0.0},"57366":{"height":0.828,"depth":0.33,"italic":0.0},"57367":{"height":0.752,"depth":0.332,"italic":0.0},"57368":{"height":0.828,"depth":0.33,"italic":0.0},"57369":{"height":0.752,"depth":0.333,"italic":0.0},"57370":{"height":0.634,"depth":0.255,"italic":0.0},"57371":{"height":0.634,"depth":0.254,"italic":0.0},"61437":{"height":0.1,"depth":0.0,"italic":0.0},"61438":{"height":0.1,"depth":0.0,"italic":0.0},"61439":{"height":0.1,"depth":0.0,"italic":0.0},"65535":{"height":0.533,"depth":0.0,"italic":0.0}}};

var getCharacterMetrics = function(character, style) {
    return metricMap[style][character.charCodeAt(0)];
};

module.exports = {
    metrics: metrics,
    getCharacterMetrics: getCharacterMetrics
};

},{}],9:[function(require,module,exports){
var ParseError = require("./ParseError");

var buildTree = require("./buildTree");
var parseTree = require("./parseTree");
var utils = require("./utils");

var process = function(toParse, baseNode) {
    utils.clearNode(baseNode);

    var tree = parseTree(toParse);
    var node = buildTree(tree);

    baseNode.appendChild(node);
};

module.exports = {
    process: process,
    ParseError: ParseError
};

},{"./ParseError":3,"./buildTree":6,"./parseTree":10,"./utils":11}],10:[function(require,module,exports){
var Parser = require("./Parser");
var parser = new Parser();

var parseTree = function(toParse) {
    return parser.parse(toParse);
}

module.exports = parseTree;

},{"./Parser":4}],11:[function(require,module,exports){
function fastContains(list, elem) {
    return list.indexOf(elem) !== -1;
}

function slowContains(list, elem) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === elem) {
            return true;
        }
    }
    return false;
}

var contains = Array.prototype.indexOf ? fastContains : slowContains;

var setTextContent;

var testNode = document.createElement("span");
if ("textContent" in testNode) {
    setTextContent = function(node, text) {
        node.textContent = text;
    };
} else {
    setTextContent = function(node, text) {
        node.innerText = text;
    };
}

function clearNode(node) {
    setTextContent(node, "");
}

module.exports = {
    contains: contains,
    setTextContent: setTextContent,
    clearNode: clearNode
};

},{}]},{},[9])
(9)
});
;