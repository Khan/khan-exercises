/**
 * @author Brian Tomlinson <darthlukan@gmail.com>
**/

$.extend(KhanUtil, {

    // Convert intInput to desired base, in this case, 2 (binary) 
    binary: function(intInput) {
    	var base = 2; // We want to stick to binary only.
        return parseInt(intInput, base);
    },
});
