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

	// If this element is already known as an Element instance, return it.
	if (KhanUtil.elements[number] instanceof Element) {
		return KhanUtil.elements[number];
	}

	if (element) {
		$.extend(this, element);
		this.protonNumber = number;
		if (!this.violatesMadelung) { // ensure violatesMadelung exists
			this.violatesMadelung = false;
		}
		var ec = KhanUtil.getElectronConfiguration(number);

		this.electronConfiguration = ec;
		this.orbitalCount = ec.length;

		// Period = highest layer of electrons.
		this.period = 0;
		for (var i in ec) {
			if (ec[i].level > this.period) {
				this.period = ec[i].level;
			}
		}

		// Block = last filled orbital type.
		this.block = ec[ec.length - 1].type;

		// The following is used to determine the X coordinate of the element in the periodic table.
		// Count elements since last noble gas.
		var l = 0;
		for (var i = ec.length - 1; i >= 0; i--) {
			// If we are a noble gas, we don't want to stop at ourselves.
			if (i != ec.length - 1 &&
				(ec[i].type == "p" || (ec[i].type == "s" && number > 2 && i == 0))) {
				break;
			}
			l += ec[i].count;
		}

		this.lastNobleGas = number - l;

		this.isNobleGas = (this.block === "p" && ec[ec.length - 1].count == 6) || (number == 2);

		// Shift P-group in period 2 and 3
		if (l > 2 && this.period < 4) l += 10;

		// Helium is a special case
		if (number == 2) l = 18;

		// Shift elements after lanthanoids and actinoids as if they weren't there
		if (l > 16 && this.period > 5) l -= 14;

		this.leftOffset = l;
	}

	KhanUtil.elements[number] = this;
}

(function() {
jQuery.extend( KhanUtil, {
	// The periodic table.
	// This is replaced on the fly with Element objects (those also know their electron configuration etc.)
	// to conserve resources.
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

	orbitals: [
		"1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p",
		"6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p" // orbitals beyond Uuo omitted
	],

	orbitalCapacities: {
		s: 2, p: 6, d: 10, f: 14
	},

	// Computes the electron configuration of a well-behaved element
	// by filling it an orbital at a time. If the element violatesMadelung,
	// this doesn't give the exact right result, but what it gives is still
	// used in calculations of the position of the element in the periodic table.
	getElectronConfiguration: function (n) {
		var configuration = [];

		for (var index in KhanUtil.orbitals) {
			var orbital = KhanUtil.orbitals[index];
			var level = parseInt(orbital[0]);
			var type = orbital[1];
			var maximum = KhanUtil.orbitalCapacities[type];
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

	// Returns a random element from a given range of proton numbers.
	randElement: function ( min, max ) {
		if (!min || min < 1) {
			min = 1;
		}
		if (!max || max < min || max >= KhanUtil.elements.length) {
			max = KhanUtil.elements.length - 1;
		}
		return new Element(Math.floor( max * KhanUtil.random() ) + min);
	},

	// Parses an electron configuration string.
	parseElectronConfiguration: function ( str ) {
		var split = str.split( /\s+/ );

		var match = split[0].match( /\[(\w+)\]/ );
		var result = [];

		if (match) {
			var element;
			$( KhanUtil.elements ).each(function (i, e) {
				if (e.symbol === match[1]) {
					element = new Element( i );
					return false;
				}
			});

			if (!element || !element.isNobleGas) { // Accept just noble gases.
				return false;
			}

			result = element.electronConfiguration;
			
			// Handle [Kr]5s2 gracefully: remove the [Kr] and keep the 5s2
			if (split[0].length > match[1].length + 2) {
				split[0] = split[0].slice( match[1].length + 2 );
			} else {
				split.shift();
			}
		}

		if (split.length === 0) { // Do not accept just saying [Symbol] without anything else
			return false;
		}

		for (var i in split) {
			match = split[i].match( /(\d+)(\w)(\d+)/ );
			if (match) {
				result.push({
					level: parseInt( match[1] ),
					type: match[2],
					count: parseInt( match[3] )
				});
			} else {
				return false;
			}
		}

		return result;
	}
});

} )();
