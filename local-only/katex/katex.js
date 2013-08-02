(function(e){if("function"==typeof bootstrap)bootstrap("katex",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeKatex=e}else"undefined"!=typeof window?window.katex=e():global.katex=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(){var Style = require("./Style");
var ParseError = require("./ParseError");

var parseTree = require("./parseTree");
var utils = require("./utils");

var buildExpression = function(style, color, expression, prev) {
    var groups = [];
    for (var i = 0; i < expression.length; i++) {
        var group = expression[i];
        groups.push(buildGroup(style, color, group, prev));
        prev = group;
    };
    return groups;
};

var makeSpan = function(className, children) {
    var span = document.createElement("span");
    span.className = className || "";

    if (children) {
        for (var i = 0; i < children.length; i++) {
            span.appendChild(children[i]);
        }
    }

    return span;
};

var buildGroup = function(style, color, group, prev) {
    if (!group) {
        return makeSpan();
    }

    if (group.type === "mathord") {
        return makeSpan("mord" + color, [mathit(group.value)]);
    } else if (group.type === "textord") {
        return makeSpan("mord" + color, [textit(group.value)]);
    } else if (group.type === "bin") {
        var className = "mbin";
        var prevAtom = prev;
        while (prevAtom && prevAtom.type == "color") {
            var atoms = prevAtom.value.value;
            prevAtom = atoms[atoms.length - 1];
        }
        if (!prev || utils.contains(["bin", "open", "rel"], prevAtom.type)) {
            group.type = "ord";
            className = "mord";
        }
        return makeSpan(className + color, [textit(group.value)]);
    } else if (group.type === "rel") {
        return makeSpan("mrel" + color, [textit(group.value)]);
    } else if (group.type === "sup") {
        var sup = makeSpan("msup " + style.cls(), [
            makeSpan(style.sup().cls(), [
                buildGroup(style.sup(), color, group.value.sup)
            ])
        ]);
        return makeSpan("mord", [
            buildGroup(style, color, group.value.base), sup
        ]);
    } else if (group.type === "sub") {
        var sub = makeSpan("msub " + style.cls(), [
            makeSpan(style.sub().cls(), [
                buildGroup(style.sub(), color, group.value.sub)
            ])
        ]);
        return makeSpan("mord", [
            buildGroup(style, color, group.value.base), sub
        ]);
    } else if (group.type === "supsub") {
        var sup = makeSpan("msup " + style.sup().cls(), [
            buildGroup(style.sup(), color, group.value.sup)
        ]);
        var sub = makeSpan("msub " + style.sub().cls(), [
            buildGroup(style.sub(), color, group.value.sub)
        ]);

        var supsub = makeSpan("msupsub " + style.cls(), [sup, sub]);

        return makeSpan("mord", [
            buildGroup(style, color, group.value.base), supsub
        ]);
    } else if (group.type === "open") {
        return makeSpan("mopen" + color, [textit(group.value)]);
    } else if (group.type === "close") {
        return makeSpan("mclose" + color, [textit(group.value)]);
    } else if (group.type === "frac") {
        var fstyle = style;
        if (group.value.size === "dfrac") {
            fstyle = Style.DISPLAY;
        } else if (group.value.size === "tfrac") {
            fstyle = Style.TEXT;
        }

        var nstyle = fstyle.fracNum();
        var dstyle = fstyle.fracDen();

        var numer = makeSpan("mfracnum " + nstyle.cls(), [
            makeSpan("", [buildGroup(nstyle, color, group.value.numer)])
        ]);
        var mid = makeSpan("mfracmid");
        var denom = makeSpan("mfracden " + dstyle.cls(), [
            makeSpan("", [buildGroup(dstyle, color, group.value.denom)])
        ]);

        return makeSpan("minner mfrac " + fstyle.cls() + color, [
            numer, mid, denom
        ]);
    } else if (group.type === "color") {
        var frag = document.createDocumentFragment();
        var els = buildExpression(
            style,
            " " + group.value.color,
            group.value.value,
            prev
        );
        for (var i = 0; i < els.length; i++) {
            frag.appendChild(els[i]);
        }
        return frag;
    } else if (group.type === "spacing") {
        if (group.value === "\\ " || group.value === "\\space") {
            return makeSpan("mord mspace", [textit(group.value)]);
        } else {
            var spacingClassMap = {
                "\\qquad": "qquad",
                "\\quad": "quad",
                "\\;": "thickspace",
                "\\:": "mediumspace",
                "\\,": "thinspace"
            };

            return makeSpan("mord mspace " + spacingClassMap[group.value]);
        }
    } else if (group.type === "llap") {
        var inner = makeSpan("", [buildGroup(style, color, group.value)]);
        return makeSpan("llap " + style.cls(), [inner]);
    } else if (group.type === "rlap") {
        var inner = makeSpan("", [buildGroup(style, color, group.value)]);
        return makeSpan("rlap " + style.cls(), [inner]);
    } else if (group.type === "punct") {
        return makeSpan("mpunct" + color, [textit(group.value)]);
    } else if (group.type === "ordgroup") {
        return makeSpan("mord " + style.cls(),
            buildExpression(style, color, group.value)
        );
    } else if (group.type === "namedfn") {
        return makeSpan("mop" + color, [textit(group.value.slice(1))]);
    } else {
        throw "Lex error: Got group of unknown type: '" + group.type + "'";
    }
};

var charLookup = {
    "*": "\u2217",
    "-": "\u2212",
    "`": "\u2018",
    "\\ ": "\u00a0",
    "\\$": "$",
    "\\angle": "\u2220",
    "\\cdot": "\u22c5",
    "\\circ": "\u2218",
    "\\colon": ":",
    "\\div": "\u00f7",
    "\\geq": "\u2265",
    "\\gets": "\u2190",
    "\\infty": "\u221e",
    "\\leftarrow": "\u2190",
    "\\leq": "\u2264",
    "\\lvert": "|",
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
    "\\omicron": "\u03bf",
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

var textit = function(value) {
    if (value in charLookup) {
        value = charLookup[value];
    }
    return document.createTextNode(value);
};

var mathit = function(value) {
    return makeSpan("mathit", [textit(value)]);
};

var clearNode = function(node) {
    if ("textContent" in node) {
        node.textContent = "";
    } else {
        node.innerText = "";
    }
};

var process = function(toParse, baseNode) {
    clearNode(baseNode);
    var tree = parseTree(toParse);

    var style = Style.TEXT;
    var expression = buildExpression(style, /* color: */ "", tree);
    var span = makeSpan(style.cls(), expression);
    var katexNode = makeSpan("katex", [span]);

    baseNode.appendChild(katexNode);
};

module.exports = {
    process: process,
    ParseError: ParseError
};

})()
},{"./Style":2,"./ParseError":3,"./utils":4,"./parseTree":5}],2:[function(require,module,exports){
function Style(id, size, cramped) {
    this.id = id;
    this.size = size;
    this.cramped = cramped;
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

/**
 * HTML class name, like "display cramped"
 */
Style.prototype.cls = function() {
    return sizeNames[this.size] + (this.cramped ? " cramped" : " uncramped");
};

var D   = 0;
var Dc  = 1;
var T   = 2;
var Tc  = 3;
var S   = 4;
var Sc  = 5;
var SS  = 6;
var SSc = 7;

var sizeNames = [
    "displaystyle textstyle",
    "textstyle",
    "scriptstyle",
    "scriptscriptstyle"
];

var styles = [
    new Style(D, 0, false),
    new Style(Dc, 0, true),
    new Style(T, 1, false),
    new Style(Tc, 1, true),
    new Style(S, 2, false),
    new Style(Sc, 2, true),
    new Style(SS, 3, false),
    new Style(SSc, 3, true)
];

var sup = [S, Sc, S, Sc, SS, SSc, SS, SSc];
var sub = [Sc, Sc, Sc, Sc, SSc, SSc, SSc, SSc];
var fracNum = [T, Tc, S, Sc, SS, SSc, SS, SSc];
var fracDen = [Tc, Tc, Sc, Sc, SSc, SSc, SSc, SSc];

module.exports = {
    DISPLAY: styles[D],
    TEXT: styles[T],
};

},{}],4:[function(require,module,exports){
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

module.exports = {
    contains: contains
}

},{}],3:[function(require,module,exports){
function ParseError(message) {
    var self = new Error("TeX parse error: " + message);
    self.name = "ParseError";
    self.__proto__ = ParseError.prototype;
    return self;
}

ParseError.prototype.__proto__ = Error.prototype;

module.exports = ParseError;

},{}],5:[function(require,module,exports){
var Parser = require("./Parser");
var parser = new Parser();

var parseTree = function(toParse) {
    return parser.parse(toParse);
}

module.exports = parseTree;

},{"./Parser":6}],6:[function(require,module,exports){
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
    expect(EOF, 'EOF');
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
                throw "Parse error: Double superscript";
            }
            nextPos = node.position;
            sup = node.result;
            continue;
        }
        if ((node = this.parseSubscript(nextPos))) {
            if (sub) {
                throw "Parse error: Double subscript";
            }
            nextPos = node.position;
            sub = node.result;
            continue;
        }
        break;
    }

    if (sup && sub) {
        return new ParseResult(
            new ParseNode("supsub", {base: nucleusNode, sup: sup,
                    sub: sub}),
            nextPos);
    } else if (sup) {
        return new ParseResult(
            new ParseNode("sup", {base: nucleusNode, sup: sup}),
            nextPos);
    } else if (sub) {
        return new ParseResult(
            new ParseNode("sub", {base: nucleusNode, sub: sub}),
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
        "\\angle",
        "\\infty",
        "\\prime",
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
        "\\geq",
        "\\gets",
        "\\leftarrow",
        "\\leq",
        "\\neq",
        "\\ngeq",
        "\\nleq",
        "\\rightarrow",
        "\\to"
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

},{"./Lexer":7,"./utils":4,"./ParseError":3}],7:[function(require,module,exports){
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
    [/^[/|@."`0-9]/, 'textord'],
    [/^[a-zA-Z]/, 'mathord'],
    [/^[*+-]/, 'bin'],
    [/^[=<>]/, 'rel'],
    [/^[,;]/, 'punct'],
    [/^'/, "'"],
    [/^\^/, '^'],
    [/^_/, '_'],
    [/^{/, '{'],
    [/^}/, '}'],
    [/^[(\[]/, 'open'],
    [/^[)\]?!]/, 'close']
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
        return new LexResult('EOF', null, pos);
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

},{"./ParseError":3}]},{},[1])(1)
});
;