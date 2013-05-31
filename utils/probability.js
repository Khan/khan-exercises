$.extend(KhanUtil, {
    /* coinFlips(2) returns
     * [["HH", 2], ["HT", 1], ["TH", 1], ["TT", 0]] */
    coinFlips: function(n) {
        if (n === 0) {
            return [["", 0]];
        } else {
            var preceding = KhanUtil.coinFlips(n - 1);

            var andAHead = $.map(preceding, function(_arg, i) {
                var seq = _arg[0];
                var h = _arg[1];
                // I18N: Represents "heads" on a coin
                return [[$._("H") + seq, h + 1]];
            });

            var andATail = $.map(preceding, function(_arg, i) {
                var seq = _arg[0];
                var h = _arg[1];
                // I18N: Represents "tails" on a coin
                return [[$._("T") + seq, h]];
            });

            return andAHead.concat(andATail);
        }
    },

    /* returns binomial coefficient (n choose k) or
     * sum of choose(n, i) for i in k:
     * choose(4, [0, 1, 2]) = 1 + 4 + 6 = 11 */
    choose: function(n, k) {
        if (typeof k === "number") {
            if (k * 2 > n) {
                return KhanUtil.choose(n, n - k);
            } else if (k > 0.5) {
                return KhanUtil.choose(n, k - 1) * (n - k + 1) / (k);
            } else if (Math.abs(k) <= 0.5) {
                return 1;
            } else {
                return 0;
            }
        } else {
            var sum = 0;
            $.each(k, function(ind, elem) {
                sum += KhanUtil.choose(n, elem);
            });
            return sum;
        }
    }
});
