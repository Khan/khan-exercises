(function() {

    // to be used later
    var decimalPointSymbol = icu.getDecimalFormatSymbols().decimal_separator;

    /**
     * Similar to KhanUtil.Adder, this is for adding nonnegative numbers in any base.  Currently it
     * only works for bases that are <= ten.
     *
     * @param a     First number, in decimal
     * @param b     Second number, in decimal
     * @param digitsA   Array of the digits of a expressed as a number in the given base
     * @param digitsB   Array of the digits of b expressed as a number in the given base
     * @param base      Number base to be used
     * @constructor
     */
function BaseAdder(a, b, base, digitsA, digitsB) {
    var graph = KhanUtil.currentGraph;
    digitsA = digitsA || digitsInBase(a, base);
    digitsB = digitsB || digitsInBase(b, base);
    var highlights = [];
    var carry = 0;
    var pos = { max: Math.max(digitsA.length, digitsB.length, digitsInBase(a + b, base).length),
        carry: 3,
        first: 2,
        second: 1,
        sum: 0,
        sideX: Math.max(digitsA.length, digitsB.length) + 2,
        sideY: 1.5 };

    var index = 0;
    var numHints = BaseAdder.numHintsFor(a, b, base);

    this.show = function() {
        graph.init({
            range: [[-1, 11], [pos.sum - 0.5, pos.carry + 0.5]],
            scale: [20, 40]
        });

        KhanUtil.drawDigits(digitsA.slice(0).reverse(), pos.max - digitsA.length + 1, pos.first);
        KhanUtil.drawDigits(digitsB.slice(0).reverse(), pos.max - digitsB.length + 1, pos.second);

        graph.path([[-0.5, pos.second - 0.5], [pos.max + 0.5, pos.second - 0.5]]);
        graph.label([0, 1] , "\\LARGE{+\\vphantom{0}}");
    };

    this.showHint = function() {
        this.removeHighlights();
        if ((index === numHints - 2) && (numHints - 1 > digitsA.length)) {
            this.showFinalCarry();
            index++;
            return;
        } else if (index === numHints - 1) {
            return;
        } else if (index === 0) {
            this.showSideLabel("\\text{Only use digits that are less than the base.}");
            index++;
            return;
        }
        var prevCarry = carry;
        var prevCarryStr = "";
        var carryStr = "";
        var addendStr = "";
        var sum;
        var digitIndex = index - 1;

        var x = pos.max - digitIndex;

        if (prevCarry !== 0) {
            highlights.push(graph.label([x, pos.carry], "\\color{#6495ED}{" + prevCarry + "}", "below"));
            prevCarryStr = "\\color{#6495ED}{" + prevCarry + "} + ";
        }

        sum = digitsA[digitIndex] + carry;
        highlights = highlights.concat(KhanUtil.drawDigits([digitsA[digitIndex]], x, pos.first, KhanUtil.BLUE));

        if (digitIndex < digitsB.length) {
            highlights = highlights.concat(KhanUtil.drawDigits([digitsB[digitIndex]], x, pos.second, KhanUtil.BLUE));
            addendStr = " + \\color{#6495ED}{" + digitsB[digitIndex] + "}";
            sum += digitsB[digitIndex];
        }

        KhanUtil.drawDigits([sum % base], x, pos.sum);
        highlights = highlights.concat(KhanUtil.drawDigits([sum % base], x, pos.sum, KhanUtil.GREEN));

        carry = Math.floor(sum / base);
        if (carry !== 0) {
            highlights.push(graph.label([x - 1, pos.carry],
                "\\color{#FFA500}{" + carry + "}", "below"));
            carryStr = "\\color{#FFA500}{" + carry + "}";
        }

        this.showSideLabel("\\Large{"
            + prevCarryStr
            + "\\color{#6495ED}{" + digitsA[digitIndex] + "}"
            + addendStr
            + " = "
            + carryStr
            + "\\color{#28AE7B}{" + sum % base + "}"
            + "}");

        index++;
    };

    this.showFinalCarry = function() {
        var digitIndex = index - 1;
        highlights.push(graph.label([pos.max - digitIndex, pos.carry],
            "\\color{#6495ED}{" + carry + "}", "below"));
        graph.label([pos.max - digitIndex, pos.sum], "\\LARGE{" + carry + "}");
        highlights.push(graph.label([pos.max - digitIndex, pos.sum],
            "\\LARGE{\\color{#28AE7B}{" + carry + "}}"));

        this.showSideLabel("\\Large{"
            + "\\color{#6495ED}{" + carry + "}"
            + " = "
            + "\\color{#28AE7B}{" + carry + "}"
            + "}");
    };

    this.getNumHints = function() {
        return numHints;
    };

    this.removeHighlights = function() {
        while (highlights.length) {
            highlights.pop().remove();
        }
    };

    this.showSideLabel = function(str) {
        highlights.push(graph.label([pos.sideX, pos.sideY], str, "right"));
    };

    this.showDecimals = function(deciA, deciB) {
        for (var i = 0; i < 3; i++) {
            graph.style({ fill: "#000" }, function() {
                graph.label([pos.max - Math.max(deciA, deciB) + 0.5, i - 0.1],
                    "\\LARGE{" + decimalPointSymbol + "}", "center", true);
            });
        }
        this.showSideLabel("\\text{Make sure the decimals are lined up.}");
    }
}

BaseAdder.numHintsFor = function(a, b, base) {
    return digitsInBase(a + b, base).length + 2;
};

    /**
     * Returns an array of the digits of a nonnegative decimal integer in
     * reverse order, converted to the given base.
     * @param n     Nonnegative integer in base 10
     * @param numberBase    Number base to use.  Integer, greater than 1.
     * @returns {Array}
     */
    function digitsInBase(n, numberBase) {
        if (n === 0) {
            return [0];
        }

        var list = [];

        while (n > 0) {
            list.push(n % numberBase);
            n = Math.floor(n / numberBase);
        }

        return list;
    }

    /**
     * Converts a given nonnegative integer in base 10 to a string that is the
     * equivalent in the specified base.
     *
     * @param nInDecimal    Nonnegative integer in base 10
     * @param base    Number base to use.  Integer, greater than 1, less than 10.
     */
    function convertToBase(nInDecimal, base) {
        return KhanUtil.digitsToInteger(digitsInBase(nInDecimal, base).reverse());
    }

    KhanUtil.BaseAdder = BaseAdder;
    KhanUtil.digitsInBase = digitsInBase;
    KhanUtil.convertToBase = convertToBase;


})();
