// Example usage:
// <var>person(1)</var> traveled 5 mi by <var>vehicle(1)</var>. Let
// <var>his(1)</var> average speed be <var>personVar(1)</var>.
// Let <var>person(2)</var>'s speed be <var>personVar(2)</var>.
//
// Note that initials (-Var) are guaranteed to be unique in each category,
// but not across them.

jQuery.extend( KhanUtil, {
	toSentence: function( array, conjunction ) {
		if ( conjunction == null ) {
			conjunction = "and";
		}

		if ( array.length == 0 ) {
			return "";
		} else if ( array.length == 1 ) {
			return array[0];
		} else if ( array.length == 2 ) {
			return array[0] + " " + conjunction + " " + array[1];
		} else {
			return array.slice(0, -1).join(", ") + ", " + conjunction + " " + array[ array.length - 1 ];
		}
	},

	// pluralization helper.  There are three signatures
	// - plural(NUMBER): return "s" if NUMBER is not 1
	// - plural(NUMBER, singular):
	//		- if necessary, magically pluralize <singular>
	//		- return "NUMBER word"
	// - plural(NUMBER, singular, plural):
	//		- return "NUMBER word"
	plural: (function() {
		var oneOffs = {
			'quiz': 'quizzes',
			'shelf': 'shelves',
			'loaf': 'loaves',
			'potato': 'potatoes'
		};

		var pluralizeWord = function(word) {

			// noone really needs extra spaces at the edges, do they?
			word = jQuery.trim( word );

			// determine if our word is all caps.  If so, we'll need to
			// re-capitalize at the end
			var isUpperCase = (word.toUpperCase() == word);
			var oneOff = oneOffs[word.toLowerCase()];
			var words = word.split(/\s+/);

			// first handle simple one-offs
			if ( oneOff ) {
				return oneOff;
			}

			// multiple words
			else if ( words.length > 1 ) {
				// for 3-word phrases where the middle word is 'in' or 'of',
				// pluralize the first word
				if ( words.length == 3 && /\b(in|of)\b/i.test(words[1]) ) {
					words[0] = KhanUtil.plural( words[0] );
				}

				// otherwise, just pluraize the last word
				else {
					words[ words.length-1 ] =
						KhanUtil.plural( words[ words.length-1 ] );
				}

				return words.join(" ");
			}

			// single words
			else {
				// "-y" => "-ies"
				if ( /[^aeiou]y$/i.test( word ) ) {
					word = word.replace(/y$/i, "ies");
				}

				// add "es"; things like "fish" => "fishes"
				else if ( /[sxz]$/i.test( word ) || /[bcfhjlmnqsvwxyz]h$/.test( word ) ) {
					word += "es";
				}

				// all the rest, just add "s"
				else {
					word += "s";
				}

				if ( isUpperCase ) {
					word = word.toUpperCase();
				}
				return word;
			}
		};

		return function(value, arg1, arg2) {
			if ( typeof value === "number" ) {
				var usePlural = (value !== 1);

				// if no extra args, just add "s" (if plural)
				if ( arguments.length === 1 ) {
					return usePlural ? "s" : "";
				}

				if ( usePlural ) {
					arg1 = arg2 || pluralizeWord(arg1);
				}

				return value + " " + arg1;
			} else if ( typeof value === "string" ) {
				return pluralizeWord(value);
			}
		};
	})()
});

jQuery.fn[ "word-problemsLoad" ] = function() {
	var people = KhanUtil.shuffle([
		["Ashley", "f"],
		["Brandon", "m"],
		["Christopher", "m"],
		["Daniel", "m"],
		["Emily", "f"],
		["Gabriela", "f"],
		["Ishaan", "m"],
		["Jessica", "f"],
		["Kevin", "m"],
		["Luis", "m"],
		["Michael", "m"],
		["Nadia", "f"],
		["Omar", "m"],
		["Stephanie", "f"],
		["Tiffany", "f"],
		["Umaima", "f"],
		["Vanessa", "f"],
		["William", "m"]
	]);

	var vehicles = KhanUtil.shuffle([
		"bike",
		"car",
		"horse",
		"motorcycle",
		"scooter",
		"train"
	]);

	var courses = KhanUtil.shuffle([
		"algebra",
		"chemistry",
		"geometry",
		"history",
		"physics",
		"Spanish"
	]);

	var exams = KhanUtil.shuffle([
		"exam",
		"test",
		"quiz"
	]);

	var binops = KhanUtil.shuffle([
		"\\barwedge",
		"\\veebar",
		"\\odot",
		"\\oplus",
		"\\otimes",
		"\\oslash",
		"\\circledcirc",
		"\\boxdot",
		"\\bigtriangleup",
		"\\bigtriangledown",
		"\\dagger",
		"\\diamond",
		"\\star",
		"\\triangleleft",
		"\\triangleright"
	]);

	var collections = KhanUtil.shuffle([
		["chair", "row", "make"],
		["party favor", "bag", "fill"],
		["jelly bean", "pile", "make"],
		["book", "shelf", "fill"],
		["can of food", "box", "fill"]
	]);

	var stores = KhanUtil.shuffle([
		{
			name: "office supply",
			items: KhanUtil.shuffle( ["pen", "pencil", "notebook"] )
		},
		{
			name: "hardware",
			items: KhanUtil.shuffle( ["hammer", "nail", "saw"] )
		},
		{
			name: "grocery",
			items: KhanUtil.shuffle( ["banana", "loaf of bread", "gallon of milk", "potato"] )
		},
		{
			name: "gift",
			items: KhanUtil.shuffle( ["toy", "game", "souvenir"] )
		},
		{
			name: "toy",
			items: KhanUtil.shuffle( ["stuffed animal", "video game", "race car", "doll"] )
		}
	]);

	var pizzas = KhanUtil.shuffle([
		"pizza",
		"pie",
		"cake"
	]);

	jQuery.extend( KhanUtil, {
		person: function( i ) {
			return people[i - 1][0];
		},

		personVar: function( i ) {
			return people[i - 1][0].charAt(0).toLowerCase();
		},

		he: function( i ) {
			return people[i - 1][1] == "m" ? "he" : "she";
		},

		He: function( i ) {
			return people[i - 1][1] == "m" ? "He" : "She";
		},

		him: function( i ) {
			return people[i - 1][1] == "m" ? "him" : "her";
		},

		his: function( i ) {
			return people[i - 1][1] == "m" ? "his" : "her";
		},

		His: function( i ) {
			return people[i - 1][1] == "m" ? "His" : "Her";
		},

		vehicle: function( i ) {
			return vehicles[i - 1];
		},

		vehicleVar: function( i ) {
			return vehicles[i - 1].charAt(0);
		},

		course: function( i ) {
			return courses[i - 1];
		},

		courseVar: function( i ) {
			return courses[i - 1].charAt(0).toLowerCase();
		},

		exam: function( i ) {
			return exams[i - 1];
		},

		binop: function( i ) {
			return binops[i - 1];
		},

		item: function( i ) {
			return collections[i - 1][0];
		},

		group: function( i ) {
				return collections[i - 1][1];
		},

		groupVerb: function( i ) {
			return collections[i - 1][2];
		},

		store: function( i ) {
			return stores[i].name;
		},

		storeItem: function( i, j ) {
			return stores[i].items[j];
		},

		pizza: function( i ) {
			return pizzas[i];
		}

	});
};
