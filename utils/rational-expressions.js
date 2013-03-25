$.extend(KhanUtil, {

	getExpressionRegex: function(coefficient, vari, constant) {
        // Capture Ax + B or B + Ax, either A or B can be 0
        
        if (coefficient === 0) {
            var regex = "^\\s*";
            regex += constant < 0 ? "[-\\u2212]\\s*" + (-constant) + "\\s*$" : constant + "\\s*$";
            return regex;
        }

        var regex = "^\\s*";
        if (coefficient < 0) {
            regex += "[-\\u2212]\\s*";
        }
        if (coefficient !== 1 && coefficient !== -1) {
            regex += Math.abs(coefficient) + "\\s*";
        }
        regex += vari + "\\s*"

        if (constant === 0) {
            regex += "$";
        } else {
            regex = "(" + regex;
            regex += constant < 0 ? "[-\\u2212]" : "\\+";
            regex += "\\s*" + Math.abs(constant) + "\\s*$)|(^\\s*"
            if (constant < 0) {
                regex += "[-\\u2212]\\s*";
            }
            regex += Math.abs(constant) + "\\s*"
            regex += coefficient < 0 ? "[-\\u2212]\\s*" : "\\+\\s*";
            if (coefficient !== 1 && coefficient !== -1) {
                regex += Math.abs(coefficient) + "\\s*";
            }
            regex += vari + "\\s*$)";
        }

        return regex;
	}

});