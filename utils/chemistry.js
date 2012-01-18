function Element(identifier) {
	var elements = KhanUtil.elements;
	var element, number;

	switch ( typeof identifier ) {
		case "number":
			// Assume proton number.
			element = elements[identifier];
			number = identifier;
			break;
		case "string":
			// Assume symbol or name.
			$( KhanUtil.elements ).each(function (i, e) {
				if ( e.symbol === identifier || e.name === identifier ) {
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
	if ( KhanUtil.elements[number] instanceof Element ) {
		return KhanUtil.elements[number];
	}

	if ( element ) {
		$.extend( this, element );
		this.protonNumber = number;
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

		// Now calculate the number of valence electrons.
		this.valenceElectrons = 0;
		for (var i in ec) {
			if (ec[i].level === this.period) {
				this.valenceElectrons += ec[i].count;
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

		// Shift P-group in period 2 and 3
		if (l > 2 && this.period < 4) l += 10;

		// Helium is a special case
		if (number == 2) l = 18;

		// Shift elements after lanthanides and actinides as if they weren't there
		if (l > 17 && this.period > 5) l -= 14;

		this.leftOffset = l;

		// The following element types have their type listed in the KhanUtil.elements array.
		//	- post-transition metals (Al, Ga, In, Sn, Tl, Pb, Bi)
		//	- metalloids (B, Si, Ge, As, Sb, Te, Po)
		//	- general nonmetals (H, C, N, O, P, S, Se)
		if (!this.type) {
			var type;
			if (this.leftOffset == 1 && number > 1) { // alkali metals: everything in group 1 but hydrogen
				type = "alkali metal";
			} else if (this.leftOffset == 2) { // alkaline earth metals
				type = "alkaline earth metal";
			} else if (number >= 57 && number <= 71) {
				type = "lanthanide";
			} else if (number >= 89 && number <= 103) {
				type = "actinide";
			} else if (this.block == "d") {
				type = "transition metal";
			} else if (this.leftOffset == 17) {
				type = "halogen";
			} else if (this.leftOffset == 18) {
				type = "noble gas";
			}

			if (type) {
				this.type = type;
			}
		}
	}

	KhanUtil.elements[number] = this;
}

// TODO: jak se v JavaScriptu dela dedicnost?!

function SimpleCompoundPart(value) {
	// content:
	//	an array of:
	//		.thing (Element of SimpleCompoundPart)
	//		.count (number)
	this.content = value;
}

// Specification can be:
//	- a "compound skeleton" (from the compounds array in KhanUtil)
//	- a compound formula (which means that the compound will not have a name)
function SimpleCompound(specification) {
	var content;
	if (typeof specification === "string") {
		this.content = new SimpleCompoundPart(specification);
		this.formula = specification;
	} else {
		// TODO: can this also be cached?
		$.extend(this, specification);
		if (!this.content) {
			this.content = KhanUtil.parseCompoundPart(this.formula);
		}
	}
}

(function() {
jQuery.extend( KhanUtil, {
	// The periodic table.
	// This is replaced on the fly with Element objects (those also know their electron configuration etc.)
	// to conserve resources.
	elements: [
		{}, // fodder to map element index to the proton number
		// violatesMadelung is truthy if the element's electron configuration doesn't follow common rules.
		{ name: "hydrogen", symbol: "H", type: "general nonmetal" },
		{ name: "helium", symbol: "He" },
		{ name: "lithium", symbol: "Li" },
		{ name: "beryllium", symbol: "Be" },
		{ name: "boron", symbol: "B", type: "metalloid" },
		{ name: "carbon", symbol: "C", type: "general nonmetal" },
		{ name: "nitrogen", symbol: "N", type: "general nonmetal" },
		{ name: "oxygen", symbol: "O", type: "general nonmetal" },
		{ name: "fluorine", symbol: "F" },
		{ name: "neon", symbol: "Ne" },
		{ name: "sodium", symbol: "Na" },
		{ name: "magnesium", symbol: "Mg" },
		{ name: "aluminium", symbol: "Al", type: "post-transition metal" },
		{ name: "silicon", symbol: "Si", type: "metalloid" },
		{ name: "phosphorus", symbol: "P", type: "general nonmetal" },
		{ name: "sulfur", symbol: "S", type: "general nonmetal" },
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
		{ name: "gallium", symbol: "Ga", type: "post-transition metal" },
		{ name: "germanium", symbol: "Ge", type: "metalloid" },
		{ name: "arsenic", symbol: "As", type: "metalloid" },
		{ name: "selenium", symbol: "Se", type: "general nonmetal" },
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
		{ name: "indium", symbol: "In", type: "post-transition metal" },
		{ name: "tin", symbol: "Sn", type: "post-transition metal" },
		{ name: "antimony", symbol: "Sb", type: "metalloid" },
		{ name: "tellurium", symbol: "Te", type: "metalloid" },
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
		{ name: "thallium", symbol: "Tl", type: "post-transition metal" },
		{ name: "lead", symbol: "Pb", type: "post-transition metal" },
		{ name: "bismuth", symbol: "Bi", type: "post-transition metal" },
		{ name: "polonium", symbol: "Po", type: "metalloid" },
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

	compounds: [
		{ name: "carbon monoxide", formula: "CO" },
		{ name: "carbon oxide", formula: "CO2" },
		{ name: "water", formula: "H2O" },
		{ name: "hydrochloric acid", formula: "HCl" }
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

			if (!element || element.type !== "noble gas") { // Accept just noble gases.
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
	},

	formatElectronConfiguration: function (el) {
		var lastNobleGas = ( el.lastNobleGas > 0 ) ? ( new Element( el.lastNobleGas) ) : false;
		var text = "";

		if ( lastNobleGas ) {
			text = "[" + lastNobleGas.symbol + "]";
		}

		for ( var i in el.electronConfiguration ) {
			if ( lastNobleGas && lastNobleGas.electronConfiguration.length > i ) {
				continue;
			}
			var o = el.electronConfiguration[i];
			if ( text != "" ) text += " ";
			text += o.level + o.type + "^{" + o.count + "}";
		}

		return text;
	},

	// Parses a simple compound part from a string in a format like
	// H2O or H3 (P O4)2.
	parseCompoundPart: function (formula) {
		// Big letter starts the name of an element.

		var element = null;
		var count = 0;
		var parts = [];
		var SENTINEL = '#';

		var str = formula + SENTINEL; // Sentinel character

		// TODO: check contained characters with some regex

		for (var i = 0; i < str.length; i++) {
			var c = str[i];
			if ( ( c >= 'A' && c <= 'Z' ) || c === '(' || c === SENTINEL ) {
				// End the current element.
				if ( element ) {
					if ( typeof element === "string" ) {
						element = new Element(element);
					}
					parts.push({
						thing: element,
						count: count || 1
					});
				}
				count = 0;
			}

			if ( c >= 'A' && c <= 'Z' ) { // The start of a new element.
				element = c;
			} else if ( c >= 'a' && c <= 'z' ) {
				if ( !element ) {
					console.log( "Stray lowercase letter '" + c + "' in compound part '" + formula + "'" );
					return null;
				}
				element += c;
			} else if ( parseInt(c).toString() === c ) {
				count *= 10;
				count += parseInt(c);
				if (count === 0) {
					console.log( "Stray zero in compound part '" + formula + "'" );
					return null;
				}
			} else if ( c === '(' ) {
				// Skip through to the matching parens.
				// Recursively call self.
				var j, level;
				for ( j = i + 1, level = 1; j < str.length; j++ ) {
					if ( str[j] === ')' ) {
						level--;
						if ( level === 0 ) {
							break;
						}
					} else if ( str[j] === '(' ) {
						level++;
					}
				}
				if ( j === str.length && str[j] !== ')' ) {
					console.log( "Unmatched parenthesis in '" + formula + "'" );
					return null;
				}
				var slice = str.slice( i + 1, j );
				element = KhanUtil.parseCompoundPart( slice );
				if ( !element ) {
					console.log( "Failed to parse compound part '" + slice + "'" );
					return null;
				}
				i = j;
			}
		}

		return new SimpleCompoundPart( parts );
	},

	formatCompoundPart: function ( part ) {
		var result = "";
		var parts;
		if ( part instanceof SimpleCompoundPart ) {
			parts = part.content;
		} else { // assume array of parts
			parts = part;
		}
		$( parts ).each(function (i, el) {
			var item = el.thing;
			var count = el.count;

			if ( result !== "" ) {
				result += " ";
			}

			if ( item instanceof Element ) {
				console.log("element");
				result += item.symbol;
			} else if ( item instanceof SimpleCompoundPart ) {
				console.log("scp");
				console.log(item);
				result += "(" + KhanUtil.formatCompoundFormula(item) + ")";
			}

			if ( count > 1 ) {
				result += "_{" + count + "}";
			}
			console.log(result);
		});
		return result;
	},

	// Returns the formatted formula of a compound.
	formatCompoundFormula: function ( compound ) {
		return KhanUtil.formatCompoundPart( compound.content );
	}
});

} )();
