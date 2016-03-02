/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, comma-spacing, indent, max-len, no-redeclare, no-trailing-spaces, no-undef, no-var, one-var, space-unary-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

var decimalPointSymbol = icu.getDecimalFormatSymbols().decimal_separator;

function Adder(a, b, decimalA, decimalB) {
    var graph = KhanUtil.currentGraph;
    decimalA = decimalA || 0;
    decimalB = decimalB || 0;
    var decimalPos = Math.max(decimalA, decimalB);

    // Remove trailing zeros from decimals
    if (decimalPos) {
        while (a % 10 === 0 && a !== 0) {
            a /= 10;
            decimalA--;
        }

        while (b % 10 === 0 && b !== 0) {
            b /= 10;
            decimalB--;
        }

        // Add trailing zeros so decimals line up
        if (decimalB > decimalA) {
            a *= Math.pow(10, decimalB - decimalA);
            decimalA = decimalB;
        } else if (decimalA > decimalB) {
            b *= Math.pow(10, decimalA - decimalB);
            decimalB = decimalA;
        }
        
        decimalPos = decimalA;
    }

    var digitsA = KhanUtil.digits(a);
    var digitsB = KhanUtil.digits(b);
    var digitDiff = digitsA.length - digitsB.length;

    // Add leading zeros to decimals
    if (decimalPos) {
        for (var i = 0; i < -digitDiff || digitsA.length < decimalA + 1; i++) {
            digitsA.push(0);
        }

        for (var i = 0; i < digitDiff || digitsB.length < decimalB + 1; i++) {
            digitsB.push(0);
        }
    }

    var pos = { max: Math.max(digitsA.length, digitsB.length, KhanUtil.digits(a + b).length),
        carry: 3,
        first: 2,
        second: 1,
        sum: 0,
        sideX: Math.max(digitsA.length, digitsB.length) + 2,
        sideY: 1.5 };

    var index = 0;
    var carry = 0;
    var highlights = [];
    var numHints = Adder.numHintsFor(a, b);

    this.show = function() {
        graph.init({
            range: [[-1, 11], [pos.sum - 0.5, pos.carry + 0.5]],
            scale: [20, 40]
        });

        drawDigits(digitsA.slice(0).reverse(), pos.max - digitsA.length + 1, pos.first);
        drawDigits(digitsB.slice(0).reverse(), pos.max - digitsB.length + 1, pos.second);

        graph.path([[-0.5, pos.second - 0.5], [pos.max + 0.5, pos.second - 0.5]]);
        graph.label([0, 1] , "\\LARGE{+\\vphantom{0}}");

        if (decimalPos !== 0) {
            for (var i = 0; i < 3; i++) {
                graph.style({ fill: "#000" }, function() {
                    graph.label([pos.max - decimalPos + 0.5, i - 0.1],
                        "\\LARGE{" + decimalPointSymbol + "}", "center", true);
                });
            }
            this.showSideLabel("\\text{Make sure digits are lined up by place value.}");
            this.showSideLabel("\\text{Use the decimal points to help you.}", -0.6);
        }
    };

    this.showHint = function() {
        this.removeHighlights();
        if ((index === numHints - 2) && (numHints - 1 > digitsA.length)) {
            this.showFinalCarry();
            index++;
            return;
        } else if (index === numHints - 1) {
            return;
        }
        var prevCarry = carry;
        var prevCarryStr = "";
        var resultStr = "";
        var addendStr = "";
        var sum;

        var x = pos.max - index;
        var power = Math.pow(10, index - decimalPos);
        var decimalPlaces = Math.max(0, decimalPos - index);

        if (prevCarry !== 0) {
            highlights.push(graph.label([x, pos.carry], "\\blue{" + prevCarry + "}", "below"));
            prevCarryStr = "\\blue{" + KhanUtil.localeToFixed(prevCarry * power,  decimalPlaces) + "} + ";
        }

        sum = digitsA[index] + carry;
        highlights = highlights.concat(drawDigits([digitsA[index]], x, pos.first, KhanUtil.BLUE));

        if (index < digitsB.length) {
            highlights = highlights.concat(drawDigits([digitsB[index]], x, pos.second, KhanUtil.BLUE));
            addendStr = " + \\blue{" + KhanUtil.localeToFixed(digitsB[index] * power, decimalPlaces) + "}";
            sum += digitsB[index];
        }

        drawDigits([sum % 10], x, pos.sum);
        highlights = highlights.concat(drawDigits([sum % 10], x, pos.sum, KhanUtil.GREEN));

        carry = Math.floor(sum / 10);
        var doCarry = Math.min(carry, 1);

        if (decimalPlaces > doCarry) {
            resultStr += "0.";
            resultStr += (new Array(decimalPlaces - doCarry).join("0"));
        }

        if (carry !== 0) {
            highlights.push(graph.label([x - 1, pos.carry], "\\orange{" + carry + "}", "below"));
            resultStr += "\\orange{" + carry + "}";
            if (decimalPlaces === 1) {
                resultStr += ".";
            }
        }

        resultStr += "\\green{" + (sum % 10) + "}";
        if (index + 1 > decimalPos) {
            resultStr += (new Array(index - decimalPos + 1).join("0"));
        }

        this.showSideLabel("\\Large{" +
            prevCarryStr +
            "\\blue{" + KhanUtil.localeToFixed(digitsA[index] * power, decimalPlaces) + "}" +
            addendStr +
            " = " +
            resultStr +
            "}");

        index++;
    };

    this.showFinalCarry = function() {
        highlights.push(graph.label([pos.max - index, pos.carry],
            "\\blue{" + carry + "}", "below"));
        graph.label([pos.max - index, pos.sum], "\\LARGE{" + carry + "}");
        highlights.push(graph.label([pos.max - index, pos.sum],
            "\\LARGE{\\green{" + carry + "}}"));

        this.showSideLabel("\\Large{" +
            "\\blue{" + carry + "}" +
            " = " +
            "\\green{" + carry + "}" +
            "}");
    };

    this.getNumHints = function() {
        return numHints;
    };

    this.removeHighlights = function() {
        while (highlights.length) {
            highlights.pop().remove();
        }
    };

    this.showSideLabel = function(str, dy) {
        var y = pos.sideY + (dy || 0);
        highlights.push(graph.label([pos.sideX, y], str, "right"));
    };
}

Adder.processDigit = function() {

};

Adder.numHintsFor = function(a, b) {
    return KhanUtil.digits(a + b).length + 1;
};

function Subtractor(a, b, digitsA, digitsB, decimalPlaces) {
    var graph = KhanUtil.currentGraph;
    digitsA = digitsA || KhanUtil.digits(a);
    digitsB = digitsB || KhanUtil.digits(b);
    var workingDigitsA = digitsA.slice(0);
    var workingDigitsB = digitsB.slice(0);
    var highlights = [];
    var pos = { max: digitsA.length,
        carry: 3,
        first: 2,
        second: 1,
        diff: 0,
        sideX: Math.max(digitsA.length, digitsB.length) + 2,
        sideY: 1.5 };

    var index = 0;
    var numHints = Subtractor.numHintsFor(a, b);
    decimalPlaces = decimalPlaces || 0;

    this.show = function() {
        graph.init({
            range: [[-1, 11], [pos.diff - 0.5, pos.carry + 0.5]],
            scale: [20, 40]
        });
        drawDigits(digitsA.slice(0).reverse(), pos.max - digitsA.length + 1, pos.first);
        drawDigits(digitsB.slice(0).reverse(), pos.max - digitsB.length + 1, pos.second);

        graph.path([[-0.5, pos.second - 0.5], [pos.max + 0.5, pos.second - 0.5]]);
        graph.label([0, 1] , "\\LARGE{-\\vphantom{0}}");

        for (var i = 0; i < digitsA.length; i++) {
            highlights.unshift([]);
        }
    };

    this.borrow = function(idx) {
        var borrowedIdx = idx + 1;
        if (workingDigitsA[idx + 1] < 1) {
            borrowedIdx = this.borrow(idx + 1);
        }
        workingDigitsA[idx + 1] -= 1;
        workingDigitsA[idx] += 10;

        var depth = borrowedIdx - idx - 1;

        highlights[idx].push(graph.label([pos.max - idx, pos.carry + (0.5 * depth)],
                                             "\\blue{" + workingDigitsA[idx] + "}", "below"));
        highlights[idx].push(graph.path([[pos.max - 0.3 - idx, pos.first - 0.4], [pos.max + 0.3 - idx, pos.first + 0.4]]));

        highlights[idx + 1].push(graph.label([pos.max - 1 - idx, pos.carry + (0.5 * depth)],
                                                 "\\orange{" + workingDigitsA[idx + 1] + "}", "below"));
        highlights[idx + 1].push(graph.path([[pos.max - 1.3 - idx, pos.first - 0.4], [pos.max - 0.7 - idx, pos.first + 0.4]]));
        if (depth !== 0) {
            highlights[idx + 1].push(graph.path([[pos.max - 1.3 - idx, pos.carry - 1 + (0.5 * depth)], [pos.max - 0.7 - idx, pos.carry - 0.7 + (0.5 * depth)]]));
        }
        return borrowedIdx;
    };

    this.showHint = function() {
        this.removeHighlights(index);

        if (index !== 0) {
            this.removeHighlights(index - 1);
        }
        if (index === numHints - 1) {
            return;
        }

        var value = workingDigitsA[index];
        var withinB = index < workingDigitsB.length;
        var subtrahend = withinB ? workingDigitsB[index] : 0;
        var subStr = "";
        var power = Math.pow(10, index);

        if (value < subtrahend) {
            this.borrow(index);
        } else if (workingDigitsA[index] === digitsA[index]) {
            highlights[index].push(graph.label([pos.max - index, pos.first],
                "\\LARGE{\\blue{" + workingDigitsA[index] + "}}"));
        } else {
            highlights[index].push(graph.label([pos.max - index, pos.carry],
                "\\blue{" + workingDigitsA[index] + "}", "below"));
        }

        if (withinB) {
            highlights[index].push(graph.label([pos.max - index, pos.second],
                "\\LARGE{\\blue{" + workingDigitsB[index] + "}}"));
            subStr = " - \\blue{" + (subtrahend * power) + "}";
        }

        var diff = workingDigitsA[index] - subtrahend;
        if (((a - b) / Math.pow(10, index)) > 1 || index < decimalPlaces) {
            graph.label([pos.max - index, pos.diff], "\\LARGE{" + diff + "}");
        }
        var zeros = diff ? new Array(index + 1).join("0") :  "";

        highlights[index].push(graph.label([pos.max - index, pos.diff], "\\LARGE{\\green{" + diff + "}}"));
        if (subStr === "") {
            subStr = "- \\blue{ 0 }";
        }

        this.showSideLabel("\\Large{" +
            "\\blue{" + (workingDigitsA[index] * power) + "}" +
            subStr +
            " = " +
            "\\green{" + diff + "}" + 
            zeros +
            "}");

        index++;
    };

    this.getNumHints = function() {
        return numHints;
    };

    this.removeHighlights = function(i) {
        if (i >= highlights.length) {
            return;
        }

        var col = highlights[i];
        while (col.length) {
            col.pop().remove();
        }
    };

    this.showSideLabel = function(str) {
        highlights[index].push(graph.label([pos.sideX, pos.sideY], str, "right"));
    };

    this.showDecimals = function(deciA, deciB) {
        for (var i = 0; i < 3; i++) {
            graph.style({ fill: "#000" }, function() {
                graph.label([pos.max - Math.max(deciA, deciB) + 0.5, i - 0.1],
                    "\\LARGE{" + decimalPointSymbol + "}", "center", true);
            });
        }
        this.showSideLabel("\\text{Make sure the decimals are lined up.}");
    };
}

Subtractor.numHintsFor = function(a, b) {
    return KhanUtil.digits(a).length + 1;
};

// convert Adder -> DecimalAdder and Subtractor -> DecimalSubtractor
(function() {
    var decimate = function(drawer) {
        var news = function(a, aDecimal, b, bDecimal) {
            var newA = a * (bDecimal > aDecimal ? Math.pow(10, bDecimal - aDecimal) : 1);
            var newB = b * (aDecimal > bDecimal ? Math.pow(10, aDecimal - bDecimal) : 1);
            return [newA, newB];
        };

        var decimated = function(a, aDecimal, b, bDecimal) {
            var newAB = news(a, aDecimal, b, bDecimal);
            var newA = newAB[0], newB = newAB[1];

            var aDigits = KhanUtil.digits(newA);
            for (var i = 0; i < (aDecimal - bDecimal) || aDigits.length < aDecimal + 1; i++) {
                aDigits.push(0);
            }

            var bDigits = KhanUtil.digits(newB);
            for (var i = 0; i < (bDecimal - aDecimal) || bDigits.length < bDecimal + 1; i++) {
                bDigits.push(0);
            }
            var drawn = new drawer(newA, newB, aDigits, bDigits, Math.max(aDecimal, bDecimal));

            drawn.showDecimals = (function(old) {
                return function() {
                    old.call(drawn, aDecimal, bDecimal);
                };
            })(drawn.showDecimals);

            return drawn;
        };

        decimated.numHintsFor = function(a, aDecimal, b, bDecimal) {
            var newAB = news(a, aDecimal, b, bDecimal);
            var newA = newAB[0], newB = newAB[1];

            return drawer.numHintsFor(newA, newB);
        };

        return decimated;
    };

    // I hate global variables
    KhanUtil.DecimalAdder = decimate(Adder);
    KhanUtil.DecimalSubtractor = decimate(Subtractor);
})();

function drawCircles(num, color) {
    var graph = KhanUtil.currentGraph;
    var numCols = Math.floor(Math.sqrt(num));
    var numRows = Math.floor(num / numCols);
    var extra = num % numRows;

    graph.init({
        range: [[0, numCols + 1], [-1, numRows + 2]],
        scale: [30, 30]
    });

    graph.style({
        stroke: color,
        fill: color
    });

    for (var i = numRows; i > 0; i--) {
        for (var j = numCols; j > 0; j--) {
            graph.circle([j, i], 0.25);
        }
    }

    for (var j = extra; j > 0; j--) {
        graph.circle([j, 0], 0.25);
    }
}

function crossOutCircles(numCircles, numCrossed, color) {
    var graph = KhanUtil.currentGraph;
    var numCols = Math.floor(Math.sqrt(numCircles));
    var numRows = Math.floor(numCircles / numCols);
    var extra = numCircles % numRows;
    var count = 0;

    graph.style({
        stroke: color,
        fill: color
    });

    for (var i = numRows; i > 0; i--) {
        for (var j = numCols; j > 0; j--) {
            graph.path([[j - 0.3, i - 0.3], [j + 0.3, i + 0.3]]);
            graph.path([[j - 0.3, i + 0.3], [j + 0.3, i - 0.3]]);
            count += 1;
            if (count === numCrossed) {
                return;
            }
        }
    }

    for (var j = extra; j > 0; j--) {
        graph.path([[j - 0.3, i - 0.3], [j + 0.3, i + 0.3]]);
        graph.path([[j - 0.3, i + 0.3], [j + 0.3, i - 0.3]]);
        count += 1;
        if (count === numCrossed) {
            return;
        }
    }
}

function drawDigits(digits, startX, startY, color) {
    var graph = KhanUtil.currentGraph;
    var set = [];
    $.each(digits, function(index, digit) {
        var str = "\\LARGE{" + digit + "}";
        set.push(graph.label([startX + index, startY], str, { color: color }));
    });
    return set;
}

// for multiplication 0.5, 1
function drawRow(num, y, color, startCount) {
    var graph = KhanUtil.currentGraph;

    graph.style({
        stroke: color
    });

    var set = graph.raphael.set();
    for (var x = 0; x < num; x++) {
        set.push(graph.label([x, y], "\\small{\\color{" + color + "}{" + (startCount + x) + "}}"));
        set.push(graph.circle([x, y], 0.35));
    }

    return set;
}

function Multiplier(a, b, digitsA, digitsB, deciA, deciB) {
    var graph = KhanUtil.currentGraph;
    deciA = deciA || 0;
    deciB = deciB || 0;
    digitsA = digitsA || KhanUtil.digits(a);
    digitsB = digitsB || KhanUtil.digits(b);

    var digitsProduct = KhanUtil.integerToDigits(a * b);
    var highlights = [];
    var carry = 0;
    var indexA = 0;
    var indexB = 0;
    var maxNumDigits = Math.max(deciA + deciB, digitsProduct.length);

    var leadingZero = 0;
    for (var i = digitsB.length - 1; i > 0; i--) {
        if (digitsB[i] === 0) {
            leadingZero++;
        } else {
            break;
        }
    }

    var numHints = digitsA.length * (digitsB.length - leadingZero) + 1;

    this.show = function() {
        var height = Math.max(numHints - 4, 3);
        if (deciA || deciB) {
            height += 3;
        }

        graph.init({
            range: [[-2 - maxNumDigits, 18], [-height, 3]],
            scale: [20, 40]
        });

        drawDigits(digitsA.slice(0).reverse(), 1 - digitsA.length, 2);
        drawDigits(digitsB.slice(0).reverse(), 1 - digitsB.length, 1);

        graph.path([[-1 - digitsProduct.length, 0.5], [1, 0.5]]);
        graph.label([- (Math.max(digitsA.length, digitsB.length)), 1] , "\\LARGE{\\times\\vphantom{0}}");
    };

    this.removeHighlights = function() {
        while (highlights.length) {
            highlights.pop().remove();
        }
    };

    this.getTrueValue = function(n, power) {
        n *= Math.pow(10, power);
        if (n !== 0) {
            return KhanUtil.localeToFixed(n, Math.max(0, -power));
        } else {
            return n;
        }
    };

    this.showHint = function() {
        this.removeHighlights();

        if (indexB === digitsB.length - leadingZero) {
            this.showFinalAddition();
            return;
        }

        var bigDigit = digitsA[indexA];
        var smallDigit = digitsB[indexB];

        var product = smallDigit * bigDigit + carry;
        var ones = product % 10;
        var currCarry = Math.floor(product / 10);

        // Highlight the digits we're using
        highlights = highlights.concat(drawDigits([bigDigit], -indexA, 2, KhanUtil.BLUE));
        highlights = highlights.concat(drawDigits([smallDigit], -indexB, 1, KhanUtil.PINK));
        if (carry) {
            highlights = highlights.concat(graph.label([-indexA, 3], "\\purple{" + carry + "}", "below"));
        }

        var hint = "\\blue{" + this.getTrueValue(bigDigit, indexA - deciA) + "}";
        hint += "\\times \\pink{" + this.getTrueValue(smallDigit, indexB - deciB) + "}";
        hint += (carry ? "+\\purple{" + this.getTrueValue(carry, indexA + indexB - deciA - deciB) + "}" : "");
        hint += "= \\green{" + this.getTrueValue(product, indexA + indexB - deciA - deciB) + "}";

        graph.label([2, 2 - indexB * digitsA.length - indexA], hint, "right");

        var result = [ones];
        if (indexA === 0) {
            for (var i = 0; i < indexB; i++) {
                result.push(0);
            }
        }

        drawDigits(result, -indexB - indexA, -indexB);
        highlights = highlights.concat(drawDigits([ones], -indexB - indexA, -indexB, KhanUtil.GREEN));

        if (currCarry) {
            highlights = highlights.concat(graph.label([-1 - indexA, 3], "\\green{" + currCarry + "}", "below"));
            if (indexA === digitsA.length - 1) {
                drawDigits([currCarry], -indexB - indexA - 1, -indexB);
                highlights = highlights.concat(drawDigits([currCarry], -indexB - indexA - 1, -indexB, KhanUtil.GREEN));
            }
        }
        carry = currCarry;

        if (indexA === digitsA.length - 1) {
            indexB++;
            indexA = 0;
            carry = 0;
        } else {
            indexA++;
        }
    };

    this.showFinalAddition = function() {
        if (digitsB.length - leadingZero > 1) {
            while (digitsProduct.length < deciA + deciB + 1) {
                digitsProduct.unshift(0);
            }
            var y = leadingZero - digitsB.length;

            graph.path([[-1 - digitsProduct.length, y + 0.5], [1, y + 0.5]]);
            graph.label([-1 - digitsProduct.length, y + 1] , "\\LARGE{+\\vphantom{0}}");
            drawDigits(digitsProduct, 1 - digitsProduct.length, y);
        }
    };

    this.getNumHints = function() {
        return numHints;
    };

    this.showDecimals = function() {
        graph.style({
            fill: "#000"
        }, function() {
            if (deciA > 0) {
                graph.label([-deciA + 0.5, 1.9],
                    "\\LARGE{" + decimalPointSymbol + "}", "center", true);
            }
            if (deciB > 0) {
                graph.label([-deciB + 0.5, 0.9],
                    "\\LARGE{" + decimalPointSymbol + "}", "center", true);
            }
        });
    };

    this.showDecimalsInProduct = function() {
        var x = -maxNumDigits;
        var y = -Math.max((digitsB.length - leadingZero) * digitsA.length, 3 + digitsB.length - leadingZero);

        graph.label([x, y + 2],
            i18n.ngettext("\\text{The top number has 1 digit to the right of the decimal.}", "\\text{The top number has %(num)s digits to the right of the decimal.}", deciA), "right");
        graph.label([x, y + 1],
            i18n.ngettext("\\text{The bottom number has 1 digit to the right of the decimal.}", "\\text{The bottom number has %(num)s digits to the right of the decimal.}", deciB), "right");
        // TODO(jeresig): i18n: Should this be pluralized?
        graph.label([x, y],
                    i18n._("\\text{The product has %(numA)s + %(numB)s = %(numSum)s digits to the right of the decimal.}",
                        {numA: deciA, numB: deciB, numSum: deciA + deciB}),
                    "right");
        graph.style({
            fill: "#000"
        }, function() {
            var y = -digitsB.length + leadingZero;
            if (y === -1) {
                // y gets mistakenly calculated -1 only in the case where there's
                // no addition step. In that case, the decimal really goes at y = 0
                y = 0;
            }
            graph.label([-deciB - deciA + 0.5, y - 0.1],
                "\\LARGE{" + decimalPointSymbol + "}", "center", true);
        });
    };
}

function Divider(divisor, dividend, deciDivisor, deciDividend, decimalRemainder) {
    var graph = KhanUtil.currentGraph;
    var digitsDivisor = KhanUtil.integerToDigits(divisor);
    var digitsDividend = KhanUtil.integerToDigits(dividend);
    deciDivisor = deciDivisor || 0;
    deciDividend = deciDividend || 0;

    deciDividend = Divider.processDividend(digitsDividend, deciDividend);
    var deciDiff = deciDivisor - deciDividend;
    var hints = Divider.getHints(divisor, digitsDividend, deciDivisor, deciDividend, decimalRemainder);
    var numHints = hints.length;

    var highlights = [];
    var leadingZeros = [];
    var decimals = [];
    var temporaryLabel = false;
    var index = 0;
    var dx = 0;
    var dy = 0;
    var currentValue = 0;
    var fOnlyZeros = true;

    this.show = function() {
        // Count number of subdivisions shown and find how many decimals have been added
        var steps = 0;
        var decimalsAdded = 0;
        for (var i = 0; i < hints.length; i++) {
            if (hints[i][0] === 'result' && hints[i][1] !== 0) {
                steps++;
            } else if (hints[i][0] === 'decimal-remainder') {
                decimalsAdded = hints[i][1];
            }
        }

        // Calculate the x-coordinate for the hints
        dx = digitsDividend.length + decimalsAdded + Math.max(0, deciDiff) + 0.5;

        var paddedDivisor = digitsDivisor;
        if (deciDivisor !== 0) {
            paddedDivisor = (KhanUtil.padDigitsToNum(digitsDivisor.reverse(), deciDivisor + 1)).reverse();
        }

        graph.init({
            range: [[-1 - paddedDivisor.length, 17], [-2 * steps - 1, 2]],
            scale: [20, 40]
        });

        graph.style({
            fill: "#000"
        }, function() {
            if (deciDivisor !== 0) {
                decimals = decimals.concat(
                    graph.label([-1 - deciDivisor, -0.1],
                        "\\LARGE{" + decimalPointSymbol + "}", "center", true));
            }
            if (deciDividend !== 0) {
                decimals = decimals.concat(
                    graph.label(
                        [digitsDividend.length - deciDividend - 0.5, -0.1],
                        "\\LARGE{" + decimalPointSymbol + "}", "center", true));
            }
        });

        drawDigits(paddedDivisor, -0.5 - paddedDivisor.length, 0);
        drawDigits(digitsDividend, 0, 0);
        graph.path([[-0.75, -0.5], [-0.75, 0.5], [dx - 0.8, 0.5]]);
    };

    this.showHint = function() {
        this.clearArray(highlights);
        var hint = hints.shift();

        // For the last hint, remove leading zero in the answer
        if (hints.length === 0) {
            this.clearArray(leadingZeros);
        }

        switch (hint[0]) {
            case 'shift':
                this.shiftDecimals();
                break;
            case 'bring-up-decimal':
                this.bringUpDecimal();
                break;
            case 'division':
                currentValue = hint[1];
                this.showDivisionStep();
                break;
            case 'result':
                this.showDivisionStepResult(hint[1], hint[2], hint[3]);
                break;
            case 'decimal-remainder':
                this.addDecimalRemainder();
                break;
            case 'remainder':
                this.showRemainder(hint[1]);
                break;
        }
    };

    this.shiftDecimals = function() {
        this.clearArray(decimals);

        temporaryLabel = graph.label([dx, 1],
            i18n.ngettext("\\text{Shift the decimal 1 to the right.}",
                       "\\text{Shift the decimal %(num)s to the right.}",
                       deciDivisor),
            "right");

        this.addDecimals([[-1, -0.1], [digitsDividend.length + deciDiff - 0.5, -0.1]]);

        // Draw extra zeros in the dividend
        if (deciDiff > 0) {
            digitsDividend = KhanUtil.padDigitsToNum(digitsDividend, digitsDividend.length + deciDiff);
            var x = digitsDividend.length - deciDiff;
            var zeros = digitsDividend.slice(x);
            drawDigits(zeros, x, 0);
            highlights = highlights.concat(drawDigits(zeros, x, 0, KhanUtil.PINK));
        }
    };

    this.bringUpDecimal = function() {
        if (temporaryLabel) {
            temporaryLabel.remove();
            temporaryLabel = false;
        }

        // TODO(jeresig): i18n: This probably won't work in multiple langs
        graph.label([dx, 1.2], i18n._("\\text{Bring the decimal up into the}"), "right");
        graph.label([dx, 0.8], i18n._("\\text{answer (the quotient).}"), "right");
        this.addDecimals([[digitsDividend.length + deciDiff - 0.5, 0.9]]);
    };

    this.showDivisionStep = function(division) {
        // Write question
        var question = i18n._("\\text{How many times does }%(divisor)s" +
                           "\\text{ go into }\\color{#6495ED}{%(value)s}\\text{?}",
                            {divisor: divisor, value: currentValue});

        if (currentValue >= divisor) {
            graph.label([dx, dy], question, "right");
        } else {
            highlights = highlights.concat(graph.label([dx, dy], question, "right"));
        }

        // Bring down another number
        if (!fOnlyZeros) {
            graph.style({
                arrows: "->"
            }, function() {
                highlights.push(graph.path([[index, -0.5], [index, dy + 0.5]]));
            });

            if (digitsDividend[index]) {
                drawDigits([digitsDividend[index]], index, dy);
            } else {
                // Add a zero in the dividend and bring that down
                drawDigits([0], index, 0);
                drawDigits([0], index, dy);
            }
        }

        // Highlight current dividend
        var digits = KhanUtil.integerToDigits(currentValue);
        highlights = highlights.concat(drawDigits(digits, index - digits.length + 1, dy, KhanUtil.BLUE));
    };

    this.showDivisionStepResult = function(result, remainder) {
        if (result !== 0) {
            fOnlyZeros = false;
        }

        // Leading zeros except one before a decimal point and those after
        // are stored separately so they can be removed later.
        if (fOnlyZeros && index < digitsDividend.length + deciDiff - 1) {
            leadingZeros = leadingZeros.concat(drawDigits([0], index, 1));
        } else { 
            drawDigits([result], index, 1);
        }

        // Highlight result
        highlights = highlights.concat(drawDigits([result], index, 1, KhanUtil.GREEN));

        if (result !== 0) {
            dy -= 2;
            var productDigits = KhanUtil.integerToDigits(result * divisor);
            var productLength = productDigits.length;
            drawDigits(productDigits, index - productLength + 1, dy + 1);

            graph.path([[index - productLength - 0.25, dy + 0.5], [index + 0.5, dy + 0.5]]);
            graph.label([index - productLength, dy + 1] , "-");

            var remainderDigits = KhanUtil.integerToDigits(remainder);
            var remainderX = index - remainderDigits.length + 1;
            drawDigits(remainderDigits, remainderX, dy);
            highlights = highlights.concat(drawDigits(remainderDigits, remainderX, dy, KhanUtil.PINK));

            graph.label([dx, dy + 1],
                "\\blue{" + currentValue + "}" +
                "\\div" + divisor + "=" +
                "\\green{" + result + "}" +
                "\\text{" + i18n._(" with a remainder of ") + " }" +
                "\\pink{" + remainder + "}",
                "right");
        }

        index++;
    };

    this.addDecimalRemainder = function() {
        digitsDividend = KhanUtil.integerToDigits(dividend * 10);
        deciDividend = 1;
        deciDiff = deciDivisor - deciDividend;

        drawDigits([0], index, 0);
        this.addDecimals([[index - 0.5, 0.9], [index - 0.5, -0.1]]);

        graph.label([dx, 1], i18n._("\\text{Write in a decimal and a zero.}"), "right");
    };

    this.showRemainder = function(remainder) {
        var txt;
        if (remainder === 0) {
            txt = "\\text{" + i18n._("The remainder is 0, so we have our answer.") + "}";
        } else {
            txt = i18n._("\\text{Since } %(remainder)s \\text{ is less than } %(divisor)s \\text{, it is left as our remainder.}",
                    { remainder: remainder, divisor: divisor });

            drawDigits(["\\text{R}"].concat(KhanUtil.integerToDigits(remainder)), digitsDividend.length, 1);
        }

        graph.label([dx, dy], txt, "right");
    };

    this.getNumHints = function() {
        return numHints;
    };

    this.clearArray = function(arr) {
        while (arr.length) {
            arr.pop().remove();
        }
    };

    this.addDecimals = function(coords) {
        graph.style({
                fill: "#000"
            }, function() {
                for (var i = 0; i < coords.length; i++) {
                    graph.label(coords[i], "\\LARGE{" + decimalPointSymbol + "}", "center", true);
                }
            });
    };

}

// Go through the division step-by-step
// Return steps as an array of arrays,
// where the first item is the type of hint and following items are parameters.
// The hint types are:
// ['shift']                        The divisor is a decimal, so shift the decimal to make it an integer.
// ['bring-up-decimal']             The dividend is a decimal, so bring up decimal point into the quotient.
// ['decimal-remainder', param1]    decimalRemainder is true and we need to add decimals to the dividend to continue.
//                                  Param1 is the number of zeros added (to a maximum of 4).
//                                  e.g. for 1 / 8, we add a decimal and 3 zeros so 1 becomes 1.000.
// ['division', param1]             Show a sub-division step, dividing param1 by the divisor.
//                                  e.g. For 58 / 2, the first step is to divide 5 (param1) by 2.
// ['result', param1, param2]       Show the result of a sub-division step. The result is param1 remainder param2.
//                                  e.g. For 5 / 2, param1 is 2 and param2 is 1.
// ['remainder', param1]            Show the remainder of param1 (Usually 0 showing we have finished).
// Appended to the end of the hints is the number of decimals added as part of the decimal-remainder step

Divider.getHints = function(divisor, digitsDividend, deciDivisor, deciDividend, decimalRemainder) {
    var hints = [];
    //var digitsDividend = KhanUtil.integerToDigits(dividend);
    var dividend = 0;

    if (deciDivisor > 0) {
        hints.push(['shift']);
        if (deciDivisor > deciDividend) {
            digitsDividend = KhanUtil.padDigitsToNum(digitsDividend, digitsDividend.length + deciDivisor - deciDividend);
        }
    }

    if (deciDividend > deciDivisor) {
        hints.push(['bring-up-decimal']);
    }

    // If we want a decimal remainder, add up to 5 extra places
    var numPlaces = digitsDividend.length + (decimalRemainder ? 5 : 0);
    var digits = KhanUtil.padDigitsToNum(digitsDividend, numPlaces);
    var decimalsAdded = 0;
    var decimalsRemainder = ['decimal-remainder', 0];

    for (var i = 0; i < digits.length; i++) {
        if (i >= digitsDividend.length) {
            if (dividend === 0) {
                // No need to add more decimals
                break;
            } else {
                decimalsAdded++;
            }

            if (i === digitsDividend.length) {
                hints.push(decimalsRemainder);
            }
        }

        if (decimalsAdded > 0) {
            decimalsRemainder[1] = decimalsAdded;
        }

        dividend = dividend * 10 + digits[i];
        hints.push(['division', dividend]);

        var quotient = Math.floor(dividend / divisor);
        var product = divisor * quotient;
        dividend -= product;
        hints.push(['result', quotient, dividend]);
    }

    if (dividend === 0 || decimalsAdded !== 5) {
        hints.push(['remainder', dividend]);
    }

    return hints;
};

Divider.getNumberOfHints = function(divisor, dividend, deciDivisor, deciDividend, decimalRemainder) {
    var digitsDividend = KhanUtil.integerToDigits(dividend);
    deciDividend = Divider.processDividend(digitsDividend, deciDividend);
    var hints = Divider.getHints(divisor, digitsDividend, deciDivisor, deciDividend, decimalRemainder);
    return hints.length;
};

Divider.processDividend = function(dividendDigits, deciDividend) {
    // Trim unnecessary zeros after the decimal point
    var end = dividendDigits.length - 1;
    for (var i = 0; i < deciDividend; i++) {
        if (dividendDigits[end - i] === 0) {
            dividendDigits.splice(end - i);
            deciDividend--;
        } else {
            break;
        }
    }

    // Add zeros before the decimal point
    var extraZeros = deciDividend - dividendDigits.length + 1;
    for (var i = 0; i < extraZeros; i++) {
        dividendDigits.splice(0, 0, 0);
    }

    return deciDividend;
};

KhanUtil.Adder = Adder;
KhanUtil.Subtractor = Subtractor;
KhanUtil.Multiplier = Multiplier;
KhanUtil.Divider = Divider;
KhanUtil.drawCircles = drawCircles;
KhanUtil.drawDigits = drawDigits;
KhanUtil.drawRow = drawRow;
KhanUtil.crossOutCircles = crossOutCircles;

});
