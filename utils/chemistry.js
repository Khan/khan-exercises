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
		if ( !this.type ) {
			var type;
			if ( this.leftOffset === 1 && number > 1 ) { // alkali metals: everything in group 1 but hydrogen
				type = "alkali metal";
			} else if ( this.leftOffset == 2 ) { // alkaline earth metals
				type = "alkaline earth metal";
			} else if ( number >= 57 && number <= 71 ) {
				type = "lanthanide";
			} else if ( number >= 89 && number <= 103 ) {
				type = "actinide";
			} else if ( this.block === "d" ) {
				type = "transition metal";
			} else if ( this.leftOffset === 17 ) {
				type = "halogen";
			} else if ( this.leftOffset === 18 ) {
				type = "noble gas";
			}

			if (type) {
				this.type = type;
			}
		}

		if ( !this.oxidationStates ) {
			if ( this.type === "alkali metal" ) {
				this.oxidationStates = [ 1 ];
			} else if ( this.type === "alkaline earth metal" ) {
				this.oxidationStates = [ 2 ];
			} else if ( this.type === "noble gas" ) {
				this.oxidationStates = [];
			} else if ( this.leftOffset === 3 ) { // Sc, Y, La, Ac
				this.oxidationStates = [ 3 ];
			} else if ( this.leftOffset === 14 ) { // Ge, Sn, Pb, Uuq
				this.oxidationStates = [ 4, 2 ];
			} else if ( this.leftOffset === 15 ) { // As, Sb, Uup
				this.oxidationStates = [ 5, 3, -3 ];
			} else if ( this.type === "lanthanide" ) { // other lanthanides
				this.oxidationStates = [ 3 ];
			} else if ( this.protonNumber >= 105 ) { // not yet known (Db and beyond)
				this.oxidationStates = [];
			} else {
				// TODO: This is an error: an element must have some defined oxidation
				// state by now!
			}
		}
	}

	KhanUtil.elements[number] = this;
}

function SimpleCompoundPart( content, oxidationState ) {
	// content:
	//	an array of:
	//		.thing (Element of SimpleCompoundPart)
	//		.count (number)
	//		.oxidationState (if Element)
	
	// If the oxidation state isn't known, try to calculate it from the parts.
	var total = 0;
	var okay = true;
	$.each( content, function ( i, el ) {
		var part = el.thing;
		if ( typeof el.oxidationState === "undefined" ) {
			if ( part instanceof SimpleCompoundPart && part.oxidationState ) {
				el.oxidationState = part.oxidationState;
			} else if ( part instanceof Element && part.oxidationStates.length === 1 ) {
				el.oxidationState = part.oxidationStates[0];
			}
		}

		if ( typeof el.oxidationState !== "undefined" ) {
			total += el.oxidationState * el.count;
		} else {
			okay = false;
			// Don't break, it's useful to know at least some oxidation states even
			// if we don't currently know all of them.
		}
	} );
	if ( okay ) {
		if ( typeof oxidationState === "undefined" ) {
			oxidationState = total;
		}
		// Assume that the user knows what he is doing when he gives something else than
		// what we calculated... (possibly useful in peroxides, for example)
	} else if ( typeof oxidationState !== "undefined" ) {
		// TODO: Calculate the oxidation state of the components by back propagation
	}

	this.oxidationState = oxidationState;
	this.content = content;
}

// Specification can be:
//	- a "compound skeleton" (from the compounds array in KhanUtil)
//	- a compound formula (which means that the compound will not have a name)
function SimpleCompound(specification) {
	var content;
	if (typeof specification === "string") {
		this.content = new SimpleCompoundPart( specification );
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
		{ name: "hydrogen", symbol: "H", type: "general nonmetal", oxidationStates: [ 1, -1 ] },
		{ name: "helium", symbol: "He" },
		{ name: "lithium", symbol: "Li" },
		{ name: "beryllium", symbol: "Be" },
		{ name: "boron", symbol: "B", type: "metalloid", oxidationStates: [ 3 ] },
		{ name: "carbon", symbol: "C", type: "general nonmetal", oxidationStates: [ 4, 2, -4 ] },
		{ name: "nitrogen", symbol: "N", type: "general nonmetal", oxidationStates: [ 5, 4, 3, 2, 1, -1, -2, -3 ] },
		{ name: "oxygen", symbol: "O", type: "general nonmetal", oxidationStates: [ -2 ] },
		{ name: "fluorine", symbol: "F", oxidationStates: [ -1 ] },
		{ name: "neon", symbol: "Ne" },
		{ name: "sodium", symbol: "Na" },
		{ name: "magnesium", symbol: "Mg" },
		{ name: "aluminium", symbol: "Al", type: "post-transition metal", oxidationStates: [ 3 ] },
		{ name: "silicon", symbol: "Si", type: "metalloid", oxidationStates: [ 4, 2, -4 ] },
		{ name: "phosphorus", symbol: "P", type: "general nonmetal", oxidationStates: [ 5, 3, -3 ] },
		{ name: "sulfur", symbol: "S", type: "general nonmetal", oxidationStates: [ 6, 4, -2 ] },
		{ name: "chlorine", symbol: "Cl", oxidationStates: [ 7, 5, 1, -1 ] },
		{ name: "argon", symbol: "Ar" },
		{ name: "potassium", symbol: "K" },
		{ name: "calcium", symbol: "Ca" },
		{ name: "scandium", symbol: "Sc" },
		{ name: "titanium", symbol: "T", oxidationStates: [ 4, 3, 2 ] },
		{ name: "vanadium", symbol: "V", oxidationStates: [ 5, 4, 3, 2 ] },
		{ name: "chromium", symbol: "Cr", violatesMadelung: true, oxidationStates: [ 6, 3, 2 ] },
		{ name: "manganese", symbol: "Mn", oxidationStates: [ 7, 4, 3, 2 ] },
		{ name: "iron", symbol: "Fe", oxidationStates: [ 3, 2 ] },
		{ name: "cobalt", symbol: "Co", oxidationStates: [ 3, 2 ] },
		{ name: "nickel", symbol: "Ni", violatesMadelung: true, oxidationStates: [ 3, 2 ] },
		{ name: "copper", symbol: "Cu", violatesMadelung: true, oxidationStates: [ 2, 1 ] },
		{ name: "zinc", symbol: "Zn", oxidationStates: [ 2 ] },
		{ name: "gallium", symbol: "Ga", type: "post-transition metal", oxidationStates: [ 3 ] },
		{ name: "germanium", symbol: "Ge", type: "metalloid" },
		{ name: "arsenic", symbol: "As", type: "metalloid" },
		{ name: "selenium", symbol: "Se", type: "general nonmetal", oxidationStates: [ 6, 4, -2 ] },
		{ name: "bromine", symbol: "Br", oxidationStates: [ 5, 1, -1 ] },
		{ name: "krypton", symbol: "Kr" },
		{ name: "rubidium", symbol: "Rb" },
		{ name: "strontium", symbol: "Sr" },
		{ name: "yttrium", symbol: "Y" },
		{ name: "zirconium", symbol: "Zr", oxidationStates: [ 4 ] },
		{ name: "niobium", symbol: "Nb", violatesMadelung: true, oxidationStates: [ 5, 3 ] },
		{ name: "molybdenum", symbol: "Mo", violatesMadelung: true, oxidationStates: [ 6 ] },
		{ name: "technetium", symbol: "Tc", oxidationStates: [ 7, 6, 4 ] },
		{ name: "ruthenium", symbol: "Ru", violatesMadelung: true, oxidationStates: [ 3 ] },
		{ name: "rhodium", symbol: "Rh", violatesMadelung: true, oxidationStates: [ 3 ] },
		{ name: "palladium", symbol: "Pd", violatesMadelung: true, oxidationStates: [ 3, 2 ] },
		{ name: "silver", symbol: "Ag", violatesMadelung: true, oxidationStates: [ 1 ] },
		{ name: "cadmium", symbol: "Cd", oxidationStates: [ 2 ] },
		{ name: "indium", symbol: "In", type: "post-transition metal", oxidationStates: [ 3 ] },
		{ name: "tin", symbol: "Sn", type: "post-transition metal" },
		{ name: "antimony", symbol: "Sb", type: "metalloid" },
		{ name: "tellurium", symbol: "Te", type: "metalloid", oxidationStates: [ 6, 4, 2 ] },
		{ name: "iodine", symbol: "I", oxidationStates: [ 7, 5, 1, -1 ] },
		{ name: "xenon", symbol: "Xe" },
		{ name: "caesium", symbol: "Ce" },
		{ name: "barium", symbol: "Ba" },
		{ name: "lanthanum", symbol: "La", violatesMadelung: true },
		{ name: "cerium", symbol: "Ce", violatesMadelung: true, oxidationStates: [ 4, 3 ] },
		{ name: "praseodymium", symbol: "Pr" },
		{ name: "neodymium", symbol: "Nd" },
		{ name: "promethium", symbol: "Pm" },
		{ name: "samarium", symbol: "Sm", oxidationStates: [ 3, 2 ] },
		{ name: "europium", symbol: "Eu", oxidationStates: [ 3, 2 ] },
		{ name: "gadolinium", symbol: "Gd", violatesMadelung: true },
		{ name: "terbium", symbol: "Tb" },
		{ name: "dysprosium", symbol: "Dy" },
		{ name: "holmium", symbol: "Ho" },
		{ name: "erbium", symbol: "Er" },
		{ name: "thulium", symbol: "Tm" },
		{ name: "ytterbium", symbol: "Yb", oxidationStates: [ 3, 2 ] },
		{ name: "lutetium", symbol: "Lu" },
		{ name: "hafnium", symbol: "Hf", oxidationStates: [ 4 ] },
		{ name: "tantalum", symbol: "Ta", oxidationStates: [ 5 ] },
		{ name: "tungsten", symbol: "W", oxidationStates: [ 6 ] },
		{ name: "rhenium", symbol: "Re", oxidationStates: [ 7, 6, 4 ] },
		{ name: "osmium", symbol: "Os", oxidationStates: [ 4, 3 ] },
		{ name: "iridium", symbol: "Ir", oxidationStates: [ 4, 3 ] },
		{ name: "platinum", symbol: "Pt", violatesMadelung: true, oxidationStates: [ 4, 2 ] },
		{ name: "gold", symbol: "Au", violatesMadelung: true, oxidationStates: [ 3, 1 ] },
		{ name: "mercury", symbol: "Hg", oxidationStates: [ 2, 1 ] },
		{ name: "thallium", symbol: "Tl", type: "post-transition metal", oxidationStates: [ 3, 1 ] },
		{ name: "lead", symbol: "Pb", type: "post-transition metal" },
		{ name: "bismuth", symbol: "Bi", type: "post-transition metal", oxidationStates: [ 5, 3 ] },
		{ name: "polonium", symbol: "Po", type: "metalloid", oxidationStates: [ 4, 2 ] },
		{ name: "astatine", symbol: "At", oxidationStates: [] },
		{ name: "radon", symbol: "Rn", oxidationStates: [] },
		{ name: "francium", symbol: "Fr", oxidationStates: [ 1 ] },
		{ name: "radium", symbol: "Ra", oxidationStates: [ 2 ] },
		{ name: "actinium", symbol: "Ac", violatesMadelung: true, oxidationStates: [ 3 ] },
		{ name: "thorium", symbol: "Th", violatesMadelung: true, oxidationStates: [ 4 ] },
		{ name: "protactinium", symbol: "Pa", violatesMadelung: true, oxidationStates: [ 5, 4 ] },
		{ name: "uranium", symbol: "U", violatesMadelung: true, oxidationStates: [ 6, 5, 4, 3 ] },
		{ name: "neptunium", symbol: "Np", violatesMadelung: true, oxidationStates: [ 6, 5, 4, 3 ] },
		{ name: "plutonium", symbol: "Pu", oxidationStates: [ 6, 5, 4, 3 ] },
		{ name: "americium", symbol: "Am", oxidationStates: [ 6, 5, 4, 3 ] },
		{ name: "curium", symbol: "Cm", violatesMadelung: true, oxidationStates: [ 3 ] },
		{ name: "berkelium", symbol: "Bk", oxidationStates: [ 4, 3 ] },
		{ name: "californium", symbol: "Cf", oxidationStates: [ 3 ] },
		{ name: "einsteinium", symbol: "Es", oxidationStates: [ 3 ] },
		{ name: "fermium", symbol: "Fm", oxidationStates: [ 3 ] },
		{ name: "mendelevium", symbol: "Md", oxidationStates: [ 3, 2 ] },
		{ name: "nobelium", symbol: "No", oxidationStates: [ 3, 2 ] },
		{ name: "lawrencium", symbol: "Lr", violatesMadelung: true, oxidationStates: [ 3 ] },
		{ name: "rutherfordium", symbol: "Rf", oxidationStates: [ 4 ] },
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
		{ name: "water", formula: "H2O" },
		{ name: "hydrochloric acid", formula: "HCl" },
		{ name: "nitrogen dioxide", formula: "NO2" },
		{ name: "carbon dioxide", formula: "CO2" },
		{ name: "nitrous oxide", formula: "NO" },
		{ name: "sulfur trioxide", formula: "SO3" },
		{ name: "sulfur dioxide", formula: "SO2" },
		{ name: "iron(III) oxide", formula: "Fe2O3" },
		{ name: "aluminium oxide", formula: "Al2O3" },
		{ name: "copper(II) oxide", formula: "CuO" },
		{ name: "dichlorine heptoxide", formula: "Cl2O7" },

		{ name: "sodium hydroxide", formula: "NaOH" }
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

	// Returns a random relatively common element
	randCommonElement: function () {
		// hydrogen through astatine
		return KhanUtil.randElement( 1, 85 );
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
				result += item.symbol;
			} else if ( item instanceof SimpleCompoundPart ) {
				result += "(" + KhanUtil.formatCompoundFormula(item) + ")";
			}

			if ( count > 1 ) {
				result += "_{" + count + "}";
			}
		});
		return result;
	},

	// Returns the formatted formula of a compound.
	formatCompoundFormula: function ( compound ) {
		return KhanUtil.formatCompoundPart( compound.content );
	},

	randomSimpleOxide: function () {
		var element;
		do {
			element = KhanUtil.randCommonElement();
			// Check that the element has a suitable oxidation state.
			var i;
			for (i = 0; i < element.oxidationStates.length; i++) {
				if ( element.oxidationStates[i] > 0 ) {
					break;
				}
			}

			if (i < element.oxidationStates.length) {
				break; // Found one.
			}
		} while (true);

		var state;
		do {
			state = KhanUtil.randFromArray( element.oxidationStates );
			
			if ( state > 0 ) {
				break; // TODO: won't this create nonexistant oxides? (P2O7?)
			}
		} while (true);

		if ( state % 2 === 0 ) {
			elementCount = 1;
			oxyCount = state / 2;
		} else {
			elementCount = 2;
			oxyCount = state;
		}

		var content = new SimpleCompoundPart( [
			{ thing: element, count: elementCount, oxidationState: state },
			{ thing: new Element("O"), count: oxyCount, oxidationState: -2 }
		] );
		
		var compound = new SimpleCompound( {
			content: content
		} );

		return compound;
	}
});

} )();
