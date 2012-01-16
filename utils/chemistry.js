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
		var ec = KhanUtil.getElectronConfiguration(number);
		this.electronConfiguration = ec;

		// Period = highest layer of electrons
		this.period = 0;
		for (var i in ec) {
			if (ec[i].level > this.period) {
				this.period = ec[i].level;
			}
		}

		// Block = last filled orbital type 
		this.block = ec[ec.length - 1].type;

		// Count elements since last inert gas
		var l = 0;
		for (var i = ec.length - 1; i >= 0; i--) {
			if (i != ec.length - 1 && (ec[i].type == "p" || (ec[i].type == "s" && number > 2 && i == 0))) {
				break;
			}
			l += ec[i].count;
		}

		// Shift P-group in period 2 and 3
		if (l > 2 && this.period < 4) l += 10;

		// Helium is a special case
		if (number == 2) l = 18;

		// Shift lanthanoids and actinoids out
		if (l > 16 && this.period > 5) l -= 14;

		this.leftOffset = l;
	}
}

(function() {
jQuery.extend( KhanUtil, {
	elements: [
		{}, // fodder to map element index to the proton number
		// violatesMadelung is truthy if the element's electron configuration doesn't follow common rules.
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
		{ name: "molybdenum", symbol: "Mo", violatesMadelung: true },
		{ name: "technetium", symbol: "Tc" },
		{ name: "ruthenium", symbol: "Ru", violatesMadelung: true },
		{ name: "rhodium", symbol: "Rh", violatesMadelung: true },
		{ name: "palladium", symbol: "Pd", violatesMadelung: true },
		{ name: "silver", symbol: "Ag", violatesMadelung: true },
		{ name: "cadmium", symbol: "Cd" },
		{ name: "indium", symbol: "In" },
		{ name: "tin", symbol: "Sn" },
		{ name: "antimony", symbol: "Sb" },
		{ name: "tellurium", symbol: "Te" },
		{ name: "iodine", symbol: "I" },
		{ name: "xenon", symbol: "Xe" },
		{ name: "caesium", symbol: "Ce" },
		{ name: "barium", symbol: "Ba" },
		{ name: "lanthanum", symbol: "La", violatesMadelung: true },
		{ name: "cerium", symbol: "Ce", violatesMadelung: true },
		{ name: "praseodymium", symbol: "Pr" },
		{ name: "neodymium", symbol: "Nd" },
		{ name: "promethium", symbol: "Pm" },
		{ name: "samarium", symbol: "Sm" },
		{ name: "europium", symbol: "Eu" },
		{ name: "gadolinium", symbol: "Gd", violatesMadelung: true },
		{ name: "terbium", symbol: "Tb" },
		{ name: "dysprosium", symbol: "Dy" },
		{ name: "holmium", symbol: "Ho" },
		{ name: "erbium", symbol: "Er" },
		{ name: "thulium", symbol: "Tm" },
		{ name: "ytterbium", symbol: "Yb" },
		{ name: "lutetium", symbol: "Lu" },
		{ name: "hafnium", symbol: "Hf" },
		{ name: "tantalum", symbol: "Ta" },
		{ name: "tungsten", symbol: "W" },
		{ name: "rhenium", symbol: "Re" },
		{ name: "osmium", symbol: "Os" },
		{ name: "iridium", symbol: "Ir" },
		{ name: "platinum", symbol: "Pt", violatesMadelung: true },
		{ name: "gold", symbol: "Au", violatesMadelung: true },
		{ name: "mercury", symbol: "Hg" },
		{ name: "thallium", symbol: "Tl" },
		{ name: "lead", symbol: "Pb" },
		{ name: "bismuth", symbol: "Bi" },
		{ name: "polonium", symbol: "Po" },
		{ name: "astatine", symbol: "At" },
		{ name: "radon", symbol: "Rn" },
		{ name: "francium", symbol: "Fr" },
		{ name: "radium", symbol: "Ra" },
		{ name: "actinium", symbol: "Ac", violatesMadelung: true },
		{ name: "thorium", symbol: "Th", violatesMadelung: true },
		{ name: "protactinium", symbol: "Pa", violatesMadelung: true },
		{ name: "uranium", symbol: "U", violatesMadelung: true },
		{ name: "neptunium", symbol: "Np", violatesMadelung: true },
		{ name: "plutonium", symbol: "Pu" },
		{ name: "americium", symbol: "Am" },
		{ name: "curium", symbol: "Cm", violatesMadelung: true },
		{ name: "berkelium", symbol: "Bk" },
		{ name: "californium", symbol: "Cf" },
		{ name: "einsteinium", symbol: "Es" },
		{ name: "fermium", symbol: "Fm" },
		{ name: "mendelevium", symbol: "Md" },
		{ name: "nobelium", symbol: "No" },
		{ name: "lawrencium", symbol: "Lr", violatesMadelung: true },
		{ name: "rutherfordium", symbol: "Rf" },
		{ name: "dubnium", symbol: "Db" },
		{ name: "seaborgium", symbol: "Sg" },
		{ name: "bohrium", symbol: "Bh" },
		{ name: "hassium", symbol: "Hs" },
		{ name: "meitnerium", symbol: "Mt" },
		{ name: "darmstadtium", symbol: "Ds" },
		{ name: "roentgenium", symbol: "Rg" },
		{ name: "copernicium", symbol: "Cn" },
		{ name: "ununtritium", symbol: "Uut" },
		{ name: "ununquadium", symbol: "Uuq" },
		{ name: "ununpentium", symbol: "Uup" },
		{ name: "ununhexium", symbol: "Uuh" },
		{ name: "ununseptium", symbol: "Uus" },
		{ name: "ununoctium", symbol: "Uuo" }
	],

	// Computes the electron configuration of a well-behaved element
	// by filling it an orbital at a time.
	getElectronConfiguration: function (n) {
		//if (KhanUtil.elements[n].violatesMadelung) {
		//	return [];
		//}
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
