$.extend(KhanUtil, {

    /* fraction math-format function called with defraction enabled, which is always
     * what is used in the exponent exercises. */

    frac: function(n, d) {
        return KhanUtil.fraction(n, d, true, true, false, false);
    },

    fracSmall: function(n, d) {
        return KhanUtil.fraction(n, d, true, true, true, false);
    },

    fracParens: function(n, d) {
        return KhanUtil.fraction(n, d, true, true, false, true);
    },

    /* Used to show the contracting of something like (-2)^4 into 16, by showing
     * (-2)^4 = (-2)(-2)(-2)(-2) = 4(-2)(-2) = -8(-2) = 16. Returns an array of
     * each of these steps. */
    expandExponent: function(base, exp) {
        var base_str = KhanUtil.negParens(base),
            expansion = "\\cdot" + base_str, steps = [], multiplier;

        steps.unshift(Math.round(Math.pow(base, exp)));

        for (var i = 1; i < exp; i++) {
            multiplier = Math.round(Math.pow(base, exp - i));

            // we wanth the first hint to say (-2)(-2)(-2)(-2), but the next one to
            // say 4(-2)(-2), -8(-2), etc.
            if (i === exp - 1) {
                multiplier = KhanUtil.negParens(multiplier);
            }

            steps.unshift(multiplier + expansion);

            expansion += "\\cdot " + base_str;
        }

        return steps;
    },

    /* expandExponent for rational bases, taking into account negative
     * exponents. Assumes abs(exp)>=1. */
    expandFractionExponent: function(base_n, base_d, exp) {
        if (Math.abs(exp) < 1) {
            return "";
        }

        exp = Math.abs(exp);
        var flip_n = exp > 0 ? base_n : base_d,
            flip_d = exp > 0 ? base_d : base_n,
            parens = function(n, d) {
                return KhanUtil.fraction(n, d, true, true, false, true);
            }, noParens = function(n, d) {
                return KhanUtil.fraction(n, d, true, true, false, false);
            }, base_str = parens(flip_n, flip_d),
            expansion = "\\cdot" + base_str, steps = [], mult_n, mult_d;

        steps.unshift(noParens(
            Math.round(Math.pow(flip_n, exp)),
            Math.round(Math.pow(flip_d, exp))));

        for (var i = 1; i < exp; i++) {
            mult_n = Math.round(Math.pow(flip_n, exp - i));
            mult_d = Math.round(Math.pow(flip_d, exp - i));

            steps.unshift(
                (i === exp - 1 ? parens : noParens)
                    .call(this, mult_n, mult_d) +
                    expansion);

            expansion += "\\cdot " + base_str;
        }

        return steps;
    },

    /* Given a base, returns the highest positive integer it is reasonable to
     * raise that base to. */
    maxReasonableExp: function(n) {
        // The values are shown in comments to show that they're reasonable.
        return {
            0: 1000,
            1: 1000,
            2: 8,    // 2*2*2*2*2*2*2*2 = 256
            3: 5,    // 3*3*3*3*3 = 243
            4: 4,    // 4*4*4*4 = 256
            5: 4,    // 5*5*5*5 = 625
            6: 3,    // 6*6*6 = 216
            7: 3,    // 7*7*7 = 343
            8: 3,    // 8*8*8 = 512
            9: 3,    // 9*9*9 = 729
            10: 10  // 10^10 = 100000000000
        }[Math.abs(n)];
    },

    /* Picks two bases and one root such that both bases can reasonably be taken
     * to that root. The first base is chosen evenly from all the reasonable
     * bases, and then the root is chosen from all the roots which it is
     * reasonable to take that base to, and then the second base is chosen from
     * all other bases which it is reasonable to take that base to. */
    twoBasesOneRoot: function() {
        var bases_by_root = {
            //   1   2   3    4    5   6   7   8   9   10
            2: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100],
            3: [1, 8, 27, 64, 125],
            4: [1, 16, 81, 256]
        };

        // these are all the bases that can be rooted.
        var bases = bases_by_root[2]
            .concat(bases_by_root[3])
            .concat(bases_by_root[4]);

        var roots_by_base = {};
        for (var i = 0; i < bases.length; i++) {
            var base = bases[i];
            for (var j = 2; j <= 4; j++) {
                if (_(bases_by_root[j]).indexOf(base) !== -1) {
                    if (roots_by_base[base] === undefined) {
                        roots_by_base[base] = [j];
                    } else if (_(roots_by_base[base]).indexOf(j) === -1) {
                        roots_by_base[base].push(j);
                    }
                }
            }
        }

        var base_1 = KhanUtil.randFromArray(bases);

        var root;
        while (root === undefined || root === 1) {
            root = KhanUtil.randFromArray(roots_by_base[base_1]);
        }

        var base_2;
        while (base_2 === undefined || base_2 === base_1) {
            base_2 = KhanUtil.randFromArray(bases_by_root[root]);
        }

        return {
            base_1: base_1,
            base_2: base_2,
            root: root
        };
    }
});
