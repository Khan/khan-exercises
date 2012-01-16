(function() {

function Element(identifier) {
	var elements = KhanUtil.elements;
	var element, number;
	switch (typeof identifier) {
		case "number":
			// Assume proton number.
			element = elements[identifier];
			number = identifier;
			break;
		case "string":
			// Assume symbol or name.
			$( KhanUtil.elements ).each(function (i, e) {
				if (e.symbol === identifier || e.name === identifier) {
					element = e;
					number = i;
					return false;
				}
			});
			break;
		default:
			return null;
	}

	if (element) {
		$.extend(this, element);
		this.protonNumber = number;
		if (!this.violatesMadelung) { // ensure violatesMadelung exists
			this.violatesMadelung = false;
		}
		this.electronConfiguration = KhanUtil.getElectronConfiguration(number);
	}
}

jQuery.extend( KhanUtil, {
	elements: [
		{}, // fodder to map element index to the proton number
		{ name: "hydrogen", symbol: "H" },
		{ name: "helium", symbol: "He" },
		{ name: "lithium", symbol: "Li" },
		{ name: "beryllium", symbol: "Be" },
		{ name: "boron", symbol: "B" },
		{ name: "carbon", symbol: "C" },
		{ name: "nitrogen", symbol: "N" },
		{ name: "oxygen", symbol: "O" },
		{ name: "fluorine", symbol: "F" },
		{ name: "neon", symbol: "Ne" },
		{ name: "sodium", symbol: "Na" },
		{ name: "magnesium", symbol: "Mg" },
		{ name: "aluminium", symbol: "Al" },
		{ name: "silicon", symbol: "Si" },
		{ name: "phosphorus", symbol: "P" },
		{ name: "sulfur", symbol: "S" },
		{ name: "chlorine", symbol: "Cl" },
		{ name: "argon", symbol: "Ar" },
		{ name: "potassium", symbol: "K" },
		{ name: "calcium", symbol: "Ca" },
		{ name: "scandium", symbol: "Sc" },
		{ name: "titanium", symbol: "T" },
		{ name: "vanadium", symbol: "V" },
		{ name: "chromium", symbol: "Cr", violatesMadelung: true },
		{ name: "manganese", symbol: "Mn" },
		{ name: "iron", symbol: "Fe" },
		{ name: "cobalt", symbol: "Co" },
		{ name: "nickel", symbol: "Ni", violatesMadelung: true },
		{ name: "copper", symbol: "Cu", violatesMadelung: true },
		{ name: "zinc", symbol: "Zn" },
		{ name: "gallium", symbol: "Ga" },
		{ name: "germanium", symbol: "Ge" },
		{ name: "arsenic", symbol: "As" },
		{ name: "selenium", symbol: "Se" },
		{ name: "bromine", symbol: "Br" },
		{ name: "krypton", symbol: "Kr" },
		{ name: "rubidium", symbol: "Rb" },
		{ name: "strontium", symbol: "Sr" },
		{ name: "yttrium", symbol: "Y" },
		{ name: "zirconium", symbol: "Zr" },
		{ name: "niobium", symbol: "Nb", violatesMadelung: true },
		{ name: "molybdenum", symbol: "Mo", violatesMadelung: true }

		// TODO: more (Tc)
	],

	getElectronConfiguration: function (n) {
		if (KhanUtil.elements[n].violatesMadelung) {
			return [];
		}
		var configuration = [];
		var orbitals = [
			"1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p",
			"6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p" // orbitals beyond Uuo omitted
		];
		var capacities = [];
		capacities["s"] = 2;
		capacities["p"] = 6;
		capacities["d"] = 10;
		capacities["f"] = 14;

		for (var index in orbitals) {
			var orbital = orbitals[index];
			var level = parseInt(orbital[0]);
			var type = orbital[1];
			var maximum = capacities[type];
			if (n > maximum) {
				configuration.push({ level: level, type: type, count: maximum });
				n -= maximum;
			} else {
				configuration.push({ level: level, type: type, count: n });
				break;
			}
		}

		return configuration;
	},

	// Returns a random element from a given range of proton numbers
	randElement: function ( min, max ) {
		if (!min || min < 1) {
			min = 1;
		}
		if (!max || max < min || max >= KhanUtil.elements.length) {
			max = KhanUtil.elements.length - 1;
		}
		return new Element(Math.floor( max * KhanUtil.random() ) + min);
	}
});

} )();
