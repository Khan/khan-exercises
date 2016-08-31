(function () {
    var set = function (memberTest, toString, type, obj) {
        var s = {
            contains: memberTest,
            toString: function () { return toString; },
            type: type
        };
        $.extend(s, obj);
        return s;
    };

    var commonSets = [
        set(function () { return false; }, "\\emptyset", "empty"),
        set(function (x) { return x >= 1 && Math.floor(x) === x }, "\\mathbb{N}", "naturals"),
        set(function (x) { return Math.floor(x) === x; }, "\\mathbb{Z}", "integers"),
        set(function (x, isRational) { return isRational; }, "\\mathbb{Q}", "rationals"),
        set(function () { return true; }, "\\mathbb{R}", "reals"),
    ];

    var setFromInterval = function (min, max, minInclusive, maxInclusive) {
        var start = minInclusive ? "[" : "(";
        var end = maxInclusive ? "]" : ")";
        var first = min === -Infinity ? "-\\infty" : min;
        var second = max === Infinity ? "\\infty" : max;
        var interval = start + first + ", " + second + end;
        return set(function (x) {
            if (minInclusive) {
                if (x < min) return false;
            } else {
                if (x <= min) return false;
            }
            if (maxInclusive) {
                if (x > max) return false;
            } else {
                if (x >= max) return false;
            }
            return true;
        }, interval, "interval", {
            min: first,
            max: second,
            minInclusive: minInclusive,
            maxInclustive: maxInclusive
        });
    };

    var randBool = function (weight) {
        return Math.random() < (weight || 0.5);
    }

    var randomSet = function () {
        if (randBool(0.7)) {
            return KhanUtil.randFromArray(commonSets);
        } else {
            var minInclusive = randBool(), maxInclusive = randBool();
            var min = KhanUtil.randRange(-20, 0);
            var max = min + KhanUtil.randRange(1, 40);
            if(randBool(0.3)) {
                max = Infinity;
                maxInclusive = false;
            }
            if (randBool(0.3)) {
                min = -Infinity;
                minInclusive = false;
            }
            return setFromInterval(min, max, minInclusive, maxInclusive);
        }
    };

    $.extend(KhanUtil, {
        set: set,
        commonSets: commonSets,
        setFromInterval: setFromInterval,
        randomSet: randomSet
    });
})();