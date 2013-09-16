// Example usage:
// <var>person(1)</var> traveled 5 mi by <var>vehicle(1)</var>. Let
// <var>his(1)</var> average speed be <var>personVar(1)</var>.
// Let <var>person(2)</var>'s speed be <var>personVar(2)</var>.
//
// Note that initials (-Var) are guaranteed to be unique in each category,
// but not across them.

$.extend(KhanUtil, {
    // TODO(csilvers): I18N: rename serialCommafy and copy from webapp.
    toSentence: function(items) {
        var n = items.length;

        // This seems to be a pretty l10n-aware, actually.  cf.
        //    http://comments.gmane.org/gmane.comp.audio.musicbrainz.i18n/15
        // The only possible problem is chinese, which it looks like
        // prefers a special character to the comma, which we hard-code in
        // items_with_commas.
        if (n === 0) {
            return "";
        } else if (n === 1) {
            return items[0];
        } else if (n === 2) {
            return $._("%(item1)s and %(item2)s",
                       {item1: items[0], item2: items[1]});
        } else {
            return $._("%(items_with_commas)s, and %(last_item)s",
                       {items_with_commas: items.slice(0, n - 1).join(", "),
                        last_item: items[n - 1]});
        }
    },

    toSentenceTex: function(array, highlight, highlightClass) {
        var wrapped = $.map(array, function(elem) {
            if (($.isFunction(highlight) && highlight(elem)) || (highlight !== undefined && elem === highlight)) {
                return "<code class='" + highlightClass + "'>" + elem + "</code>";
            }
            return "<code>" + elem + "</code>";
        });
        return KhanUtil.toSentence(wrapped);
    },

    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    AMBIGUOUS_PLURAL: function(word, num) {
        if (typeof console !== "undefined" && console.error) {
            console.error("Ambiguous plural variable usage: ", String(word));
        }

        KhanUtil.debugLog("ERROR: Ambiguous plural variable usage: " +
            String(word));

        // Check if the word is pluralizable
        var plural_word = word && word.plural ?
            word.plural(num) :
            (num == null ? this.plural(word) : this.plural(word, num));

        return "<span class='error'>" + plural_word + "</span>";
    },

    plural_form: function(word, num) {
        // Check if the word is pluralizable
        if (word && word.plural) {
            return word.plural(num);
        }

        if (typeof console !== "undefined" && console.error) {
            console.error("Word not in plural dictionary: ", String(word));
        }

        KhanUtil.debugLog("ERROR: Word not in plural dictionary: " +
            String(word));

        return "<span class='error'>" +
            (num == null ? this.plural(word) : this.plural(word, num)) +
            "</span>";
    },

    isSingular: function(num) {
        return num === 1;
    },

    // DEPRECATED
    // pluralization helper.  There are two signatures
    // - plural(NUMBER, singular):
    //        - if necessary, magically pluralize <singular>
    //        - return "NUMBER word"
    // - plural(NUMBER, singular, plural):
    //        - return "NUMBER word"
    // - plural(singular, NUMBER):
    //        - if necessary, magically pluralize <singular>
    //        - return "word"
    // - plural(singular, plural, NUMBER):
    //        - return "word"
    plural: (function() {
        var oneOffs = {
            "quiz": "quizzes",
            "shelf": "shelves",
            "loaf": "loaves",
            "potato": "potatoes",
            "person": "people",
            "is": "are",
            "was": "were",
            "foot": "feet",
            "square foot": "square feet",
            "tomato": "tomatoes"
        };

        var pluralizeWord = function(word) {

            // Check if this is a new Plural object, and just use that plural
            if (word && word.plural) {
                return word.plural(2);
            }

            // noone really needs extra spaces at the edges, do they?
            word = $.trim(word);

            // determine if our word is all caps.  If so, we'll need to
            // re-capitalize at the end
            var isUpperCase = (word.toUpperCase() === word);
            var oneOff = oneOffs[word.toLowerCase()];
            var words = word.split(/\s+/);

            // first handle simple one-offs
            // ({}).watch is a function in Firefox, blargh
            if (typeof oneOff === "string") {
                return oneOff;
            }

            // multiple words
            else if (words.length > 1) {
                // for 3-word phrases where the middle word is 'in' or 'of',
                // pluralize the first word
                if (words.length === 3 && /\b(in|of)\b/i.test(words[1])) {
                    words[0] = KhanUtil.plural(words[0]);
                }

                // otherwise, just pluraize the last word
                else {
                    words[words.length - 1] =
                        KhanUtil.plural(words[words.length - 1]);
                }

                return words.join(" ");
            }

            // single words
            else {
                // "-y" => "-ies"
                if (/[^aeiou]y$/i.test(word)) {
                    word = word.replace(/y$/i, "ies");
                }

                // add "es"; things like "fish" => "fishes"
                else if (/[sxz]$/i.test(word) || /[bcfhjlmnqsvwxyz]h$/.test(word)) {
                    word += "es";
                }

                // all the rest, just add "s"
                else {
                    word += "s";
                }

                if (isUpperCase) {
                    word = word.toUpperCase();
                }
                return word;
            }
        };

        return function(value, arg1, arg2) {
            if (typeof value === "number") {
                var usePlural = (value !== 1);

                // if no extra args, just add "s" (if plural)
                if (arguments.length === 1) {
                    return usePlural ? "s" : "";
                }

                if (usePlural) {
                    arg1 = arg2 || pluralizeWord(arg1);
                }

                return value + " " + arg1;
            } else if (typeof value === "string" || typeof value === "object") {
                // We need to accept objects here as well for new Plural objects
                var plural = pluralizeWord(value);
                if (typeof arg1 === "string" && arguments.length === 3) {
                    plural = arg1;
                    arg1 = arg2;
                }
                var usePlural = (arguments.length < 2 || (typeof arg1 === "number" && arg1 !== 1));
                return usePlural ? plural : value;
            }
        };
    })(),

    // OBSOLETE.  TODO(csilvers): remove from here and tests after I confirm.
    // Pluralize with a code tag around the number
    // - pluralTex(NUMBER, singular):
    //        - if necessary, magically pluralize <singular>
    //        - return "<code>NUMBER</code> word"
    // - pluralTex(NUMBER, singular, plural):
    //        - return "<code>NUMBER</code> word"
    pluralTex: function(value, arg1, arg2) {
        if (typeof arg2 === "string") {
            return "<code>" + value + "</code> " + KhanUtil.plural(arg1, arg2, value);
        } else {
            return "<code>" + value + "</code> " + KhanUtil.plural(arg1, value);
        }
    }
});

var Plural = KhanUtil.Plural = function(plural_fn) {
    this.plural_fn = plural_fn;
};



// ########################################
// ### Beginn der deutschen Übersetzung ###
// ########################################

// deutsche Anmerkungen starten mit einem *d* und sind nicht eingerückt

KhanUtil.Plural.prototype = {
    plural: function(num) {
        // There are some cases where plural is called with only a word
        // (and no number). In this case we just want to return the plural
        // form of that word, as best as we can. This might have some slight
        // incongruities across platforms
// *d* Nicht relevant im Deutschen, da es nur eine Pluralform gibt.
        num = num === undefined ? 2 : num;

        return this.plural_fn(num);
    },

    toString: function() {
        return this.plural_fn(1);
    }
};

$.fn["word-problemsLoad"] = function() {

    var IncrementalShuffler = function(array) {
        // Shuffle an array incrementally so we only use as many random calls
        // as we need, so names can be added/removed without breaking all
        // random seeds for all word problems
        // - get(0); get(0); will use only one call
        // - get(0); get(1); will have each use one random call
        // - get(1); get(0); will use two random calls then none and each call
        //   will give the same result as running 0 then 1
// *d* nicht verstanden, wofür diese function gut ist
// *d* random seeds?
        array = [].slice.call(array, 0);
        var shuffled = 0;

        this.get = function(i) {
            if (i < 0 || i >= array.length) {
                return undefined;
            }

            while (shuffled <= i) {
                var top = array.length - shuffled,
                    newEnd = Math.floor(KhanUtil.random() * top),
                    tmp = array[newEnd];

                array[newEnd] = array[top - 1];
                array[top - 1] = tmp;
                shuffled++;
            }

            // Since we shuffle items from the end to the front, return the
            // items in reverse order
            return array[array.length - i - 1];
        };
    };
	
// *d* muss/ darf "f" mit "w" getauscht werden?
// *d* habe Code sortiert, so dass erst alle weiblichen,
// *d* dann alle männlichen Vornamen kommen
// *d* Vornamen unterscheiden sich in DACH nicht sonderlich
// *d* wurde aber berücksichtigt
// *d* unsicher, in wie weit die Kommentarzeile über
// *d* jedem Namen stehen bleiben muss, daher unberührt
// *d* gelassen
// *d* je 20 weibliche und männliche Vornamen
// *d* Inspiration durch www.beliebte-vornamen.de
    var names = [
        // I18N: Female name
        [$._("Anna"), "f"],
		// I18N: Female name
        [$._("Leonie"), "f"],
		// I18N: Female name
        [$._("Hannah"), "f"],
		// I18N: Female name
        [$._("Lena"), "f"],
		// I18N: Female name
        [$._("Mia"), "f"],
		// I18N: Female name
        [$._("Laura"), "f"],
		// I18N: Female name
        [$._("Sarah"), "f"],
		// I18N: Female name
        [$._("Sophie"), "f"],
		// I18N: Female name
        [$._("Julia"), "f"],
		// I18N: Female name
        [$._("Alina"), "f"],
		// I18N: Female name
        [$._("Lara"), "f"],
		// I18N: Female name
        [$._("Emily"), "f"],
		// I18N: Female name
        [$._("Nele"), "f"],
		// I18N: Female name
        [$._("Valentina"), "f"],
		// I18N: Female name
        [$._("Marie"), "f"],
		// I18N: Female name
        [$._("Leonie"), "f"],
		// I18N: Female name
        [$._("Emma"), "f"],
		// I18N: Female name
        [$._("Katharina"), "f"],
		// I18N: Female name
        [$._("Lea"), "f"],
		// I18N: Female name
        [$._("Nina"), "f"],
		
		// I18N: Male name
        [$._("Leon"), "m"],
		// I18N: Male name
        [$._("Noah"), "m"],
		// I18N: Male name
        [$._("Luca"), "m"],
		// I18N: Male name
        [$._("David"), "m"],
		// I18N: Male name
        [$._("Leandro"), "m"],
		// I18N: Male name
        [$._("Levin"), "m"],
		// I18N: Male name
        [$._("Nico"), "m"],
		// I18N: Male name
        [$._("Lukas"), "m"],
		// I18N: Male name
        [$._("Tobias"), "m"],
		// I18N: Male name
        [$._("Maximillian"), "m"],
		// I18N: Male name
        [$._("Jakob"), "m"],
		// I18N: Male name
        [$._("Felix"), "m"],
		// I18N: Male name
        [$._("Elias"), "m"],
		// I18N: Male name
        [$._("Jonas"), "m"],
		// I18N: Male name
        [$._("Tim"), "m"],
		// I18N: Male name
        [$._("Paul"), "m"],
		// I18N: Male name
        [$._("Finn"), "m"],
		// I18N: Male name
        [$._("Max"), "m"],
		// I18N: Male name
        [$._("Niklas"), "m"],
		// I18N: Male name
        [$._("Philipp"), "m"],
    ];

// *d* unsicher, ob diese Funktion beibehalten bleiben soll
// *d* ist vorraussichtlich für die Namen in einer Übung gemeint
    // We only want one name per letter of the alphabet, so group people with
    // the same initial before shuffling the names up
    var people = _.map(_.groupBy(names, function(name) {
        return name[0].charAt(0);
    }), function(group) {
        return new IncrementalShuffler(group);
    });
    people = new IncrementalShuffler(people);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
// *d* Artikel im Deutschen in dieser HInsicht nicht betroffen,
// *d* da Substantive, die auf einen Vokal starten, keine Änderung
// *d* des Artikels bewirken (alle funktionieren mit "ein")
    var vehicles = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Fahrrad", "Fahrräder", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Auto", "Autos", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Pferd", "Pferde", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Motorrad", "Motorräder", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Motorroller", "Motorroller", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Zug", "Züge", num);
        })
// *d* für Variation noch weitere Beispiele eingefügt
		new Plural(function(num) {
            return $.ngettext("Esel", "Esel", num);
        })
		new Plural(function(num) {
            return $.ngettext("Seifenkiste", "Seifenkisten", num);
        })
		new Plural(function(num) {
            return $.ngettext("Segway", "Segways", num);
        })
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
// *d* Artikel im Deutschen in dieser HInsicht nicht betroffen,
// *d* da Substantive, die auf einen Vokal starten, keine Änderung
// *d* des Artikels bewirken (alle funktionieren mit "ein")
    var courses = new IncrementalShuffler([
        $._("Chemie"),
        $._("Geometrie"),
        $._("Geschichte"),
        $._("Mathe"),
        $._("Physik"),
        $._("Kunst")
// *d* für Variation noch weitere Beispiele eingefügt
		$._("Musik")
		$._("Englisch")
		$._("Ethik")
		$._("Philosophie")
		$._("Psychologie")
    ]);

    var exams = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Prüfung", "Prüfungen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Test", "Tests", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Klausur", "Klausuren", num);
        })
// *d* für Variation noch weitere Beispiele eingefügt
		new Plural(function(num) {
            return $.ngettext("Klassenarbeit", "Klassenarbeiten", num);
        })
    ]);

// *d* unsicher, was hier geschieht
// *d* 'binops' steht sicher für 'binary operators'
// *d* aber der Anwendungsbereich ist mir unklar
    var binops = new IncrementalShuffler([
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

    var collections = new IncrementalShuffler([
        [new Plural(function(num) {
            return $.ngettext("Partygeschenk", "Partygeschenke", num);
        }), new Plural(function(num) {
            return $.ngettext("Tasche", "Taschen", num);
        })],
        [new Plural(function(num) {
            return $.ngettext("Bonbon", "Bonbon", num);
        }), new Plural(function(num) {
            return $.ngettext("Beutel", "Beutel", num);
        })],
        [new Plural(function(num) {
            return $.ngettext("Buch", "Bücher", num);
        }), new Plural(function(num) {
            return $.ngettext("Regal", "Regale", num);
        })],
        [new Plural(function(num) {
            return $.ngettext("Konservendose", "Konservendosen", num);
        }), new Plural(function(num) {
            return $.ngettext("Box", "Boxen", num);
        })]
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
// *d* Artikel im Deutschen in dieser HInsicht nicht betroffen,
// *d* da Substantive, die auf einen Vokal starten, keine Änderung
// *d* des Artikels bewirken (alle funktionieren mit "ein")
    var stores = new IncrementalShuffler([
        {
            name: new Plural(function(num) {
                return $.ngettext("hardware", "hardware", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return $.ngettext("Hammer", "Hämmer", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Nagel", "Nägel", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Säge", "Sägen", num);
                })
// *d* für Variation noch weitere Beispiele eingefügt
				new Plural(function(num) {
                    return $.ngettext("Schraubendreher", "Schraubendreher", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Zange", "Zangen", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Axt", "Äxte", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Feile", "Feilen", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                return $.ngettext("grocery store", "grocery store", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return $.ngettext("Banane", "Bananen", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Laib Brot", "Laibe Brote", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Packung Milch", "Packungen Milch", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Kartoffel", "Kartoffeln", num);
                })
// *d* für Variation noch weitere Beispiele eingefügt
				new Plural(function(num) {
                    return $.ngettext("Flasche Saft", "Flaschen Saft", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Schale Weintrauben", "Schalen Weintrauben", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                return $.ngettext("gift", "gifts", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return $.ngettext("Spielzeug", "Spielzeuge", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Spiel", "Spiele", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Souvenir", "Souvenirs", num);
                })
// *d* für Variation noch weitere Beispiele eingefügt
				new Plural(function(num) {
                    return $.ngettext("Buch", "Bücher", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Gutschein", "Gutscheine", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Musik-CD", "Musik-CD's", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Ausflug", "Ausflüge", num);
                })
            ])
        },
        {
// *d* unsicher, ob es Sinn macht, auch die Bezeichnungnen unter 'name' zu übersetzen
// *d* wie wird das Ganze denn im Code eingesetzt?
            name: new Plural(function(num) {
                return $.ngettext("school supply", "shool supplies", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return $.ngettext("Stift", "Stifte", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Füllfederhalter", "Füllfederhalter", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Schreibblock", "Schreibbläcke", num);
                })
// *d* für Variation noch weitere Beispiele eingefügt
				new Plural(function(num) {
                    return $.ngettext("Radiergummi", "Radiergummis", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Anspitzer", "Anspitzer", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Federtasche", "Federtaschen", num);
                })
				new Plural(function(num) {
                    return $.ngettext("Pinsel", "Pinsel", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                return $.ngettext("toy", "toys", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return $.ngettext("Stofftier", "Stofftiere", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Computerspiel", "Computerspiele", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Spielzeugauto", "Spielzeugautos", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Puppe", "Puppen", num);
                })
            ])
        }
    ]);

    var pizzas = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Pizza", "Pizzas", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Kuchen", "Kuchen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Torte", "Torten", num);
        })
    ]);

    var timesofday = new IncrementalShuffler([
        $._("morgens"),
        $._("um die Mittagszeit"),
        $._("abends"),
        $._("nachts")
    ]);

    var exercises = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Push-up", "Push-ups", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Sit-up", "Sit-ups", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Kniebeuge", "Kniebeugen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Hampelmann", "Hampelmänner", num);
        })
    ]);

    var fruits = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Apfel", "Äpfel", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Banane", "Bananen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Kokosnuss", "Kokosnüsse", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Aubergine", "Auberginen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Kiwi", "Kiwis", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Zitrone", "Zitronen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Mango", "Mangos", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Nektarine", "Nektarinen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Orange", "Orangen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Granatapfel", "Granatäpfel", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Wassermelone", "Wassermelonen", num);
        })
    ]);

    var deskItems = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Bleistift", "Bleistifte", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Buntstift", "Buntstifte", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Radiergummi", "Radiergummis", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Ordner", "Ordner", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Klebstift", "Klebstifte", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Textmarker", "Textmarker", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Schreibblock", "Schreibblöcke", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Füllfederhalter", "Füllfederhalter", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Kugelschreiber", "Kugelschreiber", num);
        })
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
// *d* an jede Farbe ein 'e' gehängt, da im englische keine Anpassung aufgrund
// *d* des Geschlechts vorgenommen werden würde und nur 'e' als Endung die meisten
// *d* Fälle abdekcen sollte
// *d* ##################################WICHTIG###########################################
// *d* Bei Übersetzung der Übungen sollte auf diesen Umstand geachtet werden
    var colors = new IncrementalShuffler([
        $._("rote"),
        // NOTE(jeresig): I18N: Removed because it begins with a vowel and is
        // used with an()
// *d* reaktiviert für die deutsche Sprache, da keine Probleme mit Artikel
        $._("orange"),
        $._("gelbe"),
        $._("grüne"),
        $._("blaue"),
        $._("violette"),
        $._("weiße"),
        $._("schwarze"),
        $._("braune"),
        $._("silberne"),
        $._("goldene"),
        $._("rosa-farbene")
    ]);

// *d* keine Idee, was wir hiermit anstellen wollen...
    var schools = new IncrementalShuffler([
        // I18N: This is a generic school name
        $._("Loyola"),
        // I18N: This is a generic school name
        $._("Gardner Bullis"),
        // I18N: This is a generic school name
        $._("Almond"),
        // I18N: This is a generic school name
        $._("Covington"),
        // I18N: This is a generic school name
        $._("Springer"),
        // I18N: This is a generic school name
        $._("Santa Rita"),
        // I18N: This is a generic school name
        $._("Oak")
    ]);

    var furnitureStore = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Stuhl", "Stühle", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Tisch", "Tische", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Bettgestell", "Bettgestelle", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Sofa", "Sofas", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Couch", "Couches", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Schreibtisch", "Schreibtische", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Büherregal", "Bücherregale", num);
        })
    ]);

    var electronicStore = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Fernseher", "Fernseher", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Computer", "Computer", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Laptop", "Laptops", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Kamera", "Kameras", num);
        })
    ]);

    var clothes = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Hut", "Hüte", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Gürtel", "Gürtel", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Halskette", "Halsketten", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Paar Schuhe", "Paare Schuhe", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Armbanduhr", "Armbanduhren", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Paar Socken", "Paare Socken", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Sweatshirt", "Sweatshirts", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Pullover", "Pullover", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Krawatte", "Krawatten", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Schal", "Schals", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Unterhose", "Unterhosen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Jeans", "Jeans", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Paar Hanschuhe", "Paare Hanschuhe", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Shirt", "Shirts", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Hosenträger", "Hosenträger", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Jacke", "Jacken", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Brille", "Brillen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Paar Stiefel", "Paare Stiefel", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Rucksack", "Rucksäcke", num);
        })
    ]);

// *d* unsicher, ob hier eine andere Endung gewählt werden sollte,
// *d* entsprechend des Geschlechts des Folgewortes
    var sides = new IncrementalShuffler([
        "links",
        "rechts"
    ]);

// *d* unsicher, ob hier eine andere Endung gewählt werden sollte,
// *d* entsprechend des Geschlechts des Folgewortes
    var shirtStyles = new IncrementalShuffler([
        "längärmlig",
        "kurzärmlig"
    ]);

    // animal, avg-lifespan, stddev-lifespan
    // (data is from cursory google searches and wild guessing)
    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
    var animals = new IncrementalShuffler([
        // NOTE(jeresig): I18N: Removed because it begins with a vowel and is
        // used with an()
        //["alligator", 68, 20],
        //["anteater", 15, 10],
        [new Plural(function(num) {
            return $.ngettext("Bär", "Bären", num);
        }), 40, 20],
        //["elephant", 60, 10],
        [new Plural(function(num) {
            return $.ngettext("Gorilla", "Gorillas", num);
        }), 20, 5],
        [new Plural(function(num) {
            return $.ngettext("Löwe", "Löwen", num);
        }), 12, 5],
        [new Plural(function(num) {
            return $.ngettext("Eidechse", "Eidechsen", num);
        }), 3, 1],
        [new Plural(function(num) {
            return $.ngettext("Erdmännchen", "Erdmännchen", num);
        }), 13, 5],
        [new Plural(function(num) {
            return $.ngettext("Stachelschwein", "Stachelschweine", num);
        }), 20, 5],
        [new Plural(function(num) {
            return $.ngettext("Seehund", "Seehunde", num);
        }), 15, 10],
        [new Plural(function(num) {
            return $.ngettext("Faultier", "Faultiere", num);
        }), 16, 5],
        [new Plural(function(num) {
            return $.ngettext("Schlange", "Schlangen", num);
        }), 25, 10],
        [new Plural(function(num) {
            return $.ngettext("Tiger", "Tiger", num);
        }), 22, 5],
        [new Plural(function(num) {
            return $.ngettext("Schildkröte", "Schildkröten", num);
        }), 100, 20],
        [new Plural(function(num) {
            return $.ngettext("Zebra", "Zebras", num);
        }), 25, 10]
    ]);

    // TODO(emily): I18N: add both "row of CROP" as well as just "CROP" for
    // pluralization. For example, in Polish, adding "row of" to "tomatoes"
    // changes the pluralization of "tomatoes".
    var farmers = new IncrementalShuffler([
        {
            farmer: new Plural(function(num) {
                return $.ngettext("Bauer", "Bauern", num);
            }),
            crops: new IncrementalShuffler([
                new Plural(function(num) {
                    return $.ngettext("Tomate", "Tomaten", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Kartoffel", "Kartoffeln", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Karotte", "Karotten", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Bohne", "Bohnen", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Maisstengel", "Maisstengel", num);
                })
            ]),
            field: new Plural(function(num) {
                return $.ngettext("Feld", "Felder", num);
            })
        },
        {
            farmer: new Plural(function(num) {
                return $.ngettext("Gärtner", "Gärtner", num);
            }),
            crops: new IncrementalShuffler([
                new Plural(function(num) {
                    return $.ngettext("Rose", "Rosen", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Tulpe", "Tulpen", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Gänseblümchen", "Gänseblümchen", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Schwertlilie", "Schwertlilien", num);
                }),
                new Plural(function(num) {
                    return $.ngettext("Lilie", "Lilien", num);
                })
            ]),
            field: new Plural(function(num) {
                return $.ngettext("Garten", "Gärten", num);
            })
        }
    ]);

    var distances = new IncrementalShuffler([
        new Plural(function(num) {
            return $.ngettext("Meile", "Meilen", num);
        }),
        new Plural(function(num) {
            return $.ngettext("Kilometer", "Kilometer", num);
        })
    ]);

    // TODO(jeresig): I18N: Kill this.
// *d* soll scheinbar gelöscht werden
// *d* ##################################WICHTIG###########################################
// *d* muss für deutsche Version vermutlich angepasst werden,
// *d* sonst immer 'A ...' oder eben 'AN ...' zurückgegeben wird
// *d* hier müsste UNterscheidung zwischen 'ein' und 'eine' vorgenommen
// *d* werden
    var indefiniteArticle = function(word) {
        var vowels = ["a", "e", "i", "o", "u"];
        if (_(vowels).indexOf(word[0].toLowerCase()) > -1) {
            return "An " + word;
        }
        return "A " + word;
    };

    $.extend(KhanUtil, {
        person: function(i) {
            return people.get(i - 1).get(0)[0];
        },

        personVar: function(i) {
            return people.get(i - 1).get(0)[0].charAt(0).toLowerCase();
        },

        // TODO(jeresig): I18N: Kill this.
        he: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "he" : "she";
        },

        // TODO(jeresig): I18N: Kill this.
        him: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "him" : "her";
        },

        isMale: function(i) {
            return people.get(i - 1).get(0)[1] === "m";
        },

        // TODO(jeresig): I18N: Kill this.
        an: function(word) {
            return indefiniteArticle(word).toLowerCase();
        },

        vehicle: function(i) {
            return vehicles.get(i - 1);
        },

        vehicleVar: function(i) {
            return vehicles.get(i - 1).charAt(0);
        },

        course: function(i) {
            return courses.get(i - 1);
        },

        courseVar: function(i) {
            return courses.get(i - 1).charAt(0).toLowerCase();
        },

        exam: function(i) {
            return exams.get(i - 1);
        },

        binop: function(i) {
            return binops.get(i - 1);
        },

        item: function(i) {
            return collections.get(i - 1)[0];
        },

        group: function(i) {
            return collections.get(i - 1)[1];
        },

        store: function(i) {
            return stores.get(i).name;
        },

        storeItem: function(i, j) {
            return stores.get(i).items.get(j);
        },

        pizza: function(i) {
            return pizzas.get(i);
        },

        exercise: function(i) {
            return exercises.get(i - 1);
        },

        timeofday: function(i) {
            return timesofday.get(i - 1);
        },

        school: function(i) {
            return schools.get(i - 1);
        },

        clothing: function(i) {
            return clothes.get(i - 1);
        },

        color: function(i) {
            return colors.get(i - 1);
        },

        fruit: function(i) {
            return fruits.get(i);
        },

        deskItem: function(i) {
            return deskItems.get(i);
        },

        distance: function(i) {
            return distances.get(i - 1);
        },

        farmer: function(i) {
            return farmers.get(i - 1).farmer;
        },

        crop: function(i) {
            return farmers.get(i - 1).crops.get(0);
        },

        field: function(i) {
            return farmers.get(i - 1).field;
        },

        side: function(i) {
            return sides.get(i - 1);
        },

        shirtStyle: function(i) {
            return shirtStyles.get(i - 1);
        },

        furniture: function(i) {
            return furnitureStore.get(i - 1);
        },

        electronic: function(i) {
            return electronicStore.get(i - 1);
        },

        animal: function(i) {
            return animals.get(i - 1)[0];
        },

        animalAvgLifespan: function(i) {
            return animals.get(i - 1)[1];
        },

        animalStddevLifespan: function(i) {
            return animals.get(i - 1)[2];
        }
    });
};