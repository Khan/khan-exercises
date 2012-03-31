jQuery.extend( KhanUtil, {

        _find_highest_descending_k: function(elements) {
                var k = elements.length - 2;
                while (k >= 0) {
                        if (elements[k] < elements[k+1]) {
                                return k;
                        }
			k -= 1;
                }
                return -1;
        },

	_find_highest_descending_l: function(elements, k) {
                var l = elements.length - 1;
                while (l > k) {
                        if (elements[k] < elements[l]) {
                                return l;
                        }
                        l -= 1;
                }
		// Should never happen, k+1 is always a valid l
		// if k was found via _find_highest_descending_k
                return -1; 
        },


	permute: function(elements) {
		elements.sort();
		var permutations = new Array();
		var curperm = elements.slice();
		var k = 0, l, tmp, rev;

		while(k > -1) {
			permutations.push(curperm.slice());
			k = KhanUtil._find_highest_descending_k(curperm);
			l = KhanUtil._find_highest_descending_l(curperm, k);
			tmp = curperm[k];
			curperm[k] = curperm[l];
			curperm[l] = tmp;
			rev = curperm.slice(k + 1, curperm.length).reverse();
			curperm = curperm.slice(0, k + 1);
			curperm = curperm.concat(rev);
		}
		return permutations;
	},

});
