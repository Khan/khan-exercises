/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable brace-style, camelcase, comma-dangle, indent, max-len, no-console, no-redeclare, no-undef, no-var, one-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

require("./math.js");

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
            return i18n._("%(item1)s and %(item2)s",
                       {item1: items[0], item2: items[1]});
        } else {
            return i18n._("%(items_with_commas)s, and %(last_item)s",
                       {items_with_commas: items.slice(0, n - 1).join(", "),
                        last_item: items[n - 1]});
        }
    },

    toSentenceTex: function(array, highlight, highlightClass) {
        var wrapped = $.map(array, function(elem) {
            if ((_.isFunction(highlight) && highlight(elem)) || (highlight !== undefined && elem === highlight)) {
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
    })()
});

var Plural = KhanUtil.Plural = function(plural_fn) {
    this.plural_fn = plural_fn;
};

KhanUtil.Plural.prototype = {
    plural: function(num) {
        // There are some cases where plural is called with only a word
        // (and no number). In this case we just want to return the plural
        // form of that word, as best as we can. This might have some slight
        // incongruities across platforms
        num = num === undefined ? 2 : num;

        return this.plural_fn(num);
    },

    toString: function() {
        return this.plural_fn(1);
    }
};

KhanUtil.numberPlaceNames = [
    new Plural(function(num) {
        return i18n.ngettext("one", "ones", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("ten", "tens", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("hundred", "hundreds", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("thousand", "thousands", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("ten thousand", "ten thousands", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("hundred thousand", "hundred thousands", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("million", "millions", num);
    })
];

KhanUtil.decimalPlaceNames = [
    new Plural(function(num) {
        return i18n.ngettext("one", "ones", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("tenth", "tenths", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("hundredth", "hundredths", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("thousandth", "thousandths", num);
    }),
    new Plural(function(num) {
        return i18n.ngettext("ten thousandth", "ten thousandths", num);
    })
];

KhanUtil.metricUnits = [
    [i18n._("m"), new Plural(function(num) {
        return i18n.ngettext("meter", "meters", num);
    })],
    [i18n._("cm"), new Plural(function(num) {
        return i18n.ngettext("centimeter", "centimeters", num);
    })]
];

KhanUtil.imperialUnits = [
    ["in", new Plural(function(num) {
        return i18n.ngettext("inch", "inches", num);
    })],
    ["ft", new Plural(function(num) {
        return i18n.ngettext("foot", "feet", num);
    })]
];

KhanUtil.genericUnit = ["", new Plural(function(num) {
    return i18n.ngettext("unit", "units", num);
})];

$.fn["word-problemsLoad"] = function() {

    var IncrementalShuffler = function(array) {
        // Shuffle an array incrementally so we only use as many random calls
        // as we need, so names can be added/removed without breaking all
        // random seeds for all word problems
        // - get(0); get(0); will use only one call
        // - get(0); get(1); will have each use one random call
        // - get(1); get(0); will use two random calls then none and each call
        //   will give the same result as running 0 then 1
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

    var names = [
        // I18N: Female name
        [i18n._("Ashley"), "f"],
        // I18N: Male name
        [i18n._("Brandon"), "m"],
        // I18N: Male name
        [i18n._("Ben"), "m"],
        // I18N: Male name
        [i18n._("Christopher"), "m"],
        // I18N: Male name
        [i18n._("Daniel"), "m"],
        // I18N: Female name
        [i18n._("Emily"), "f"],
        // I18N: Female name
        [i18n._("Gabriela"), "f"],
        // I18N: Male name
        [i18n._("Ishaan"), "m"],
        // I18N: Female name
        [i18n._("Jessica"), "f"],
        // I18N: Male name
        [i18n._("Kevin"), "m"],
        // I18N: Male name
        [i18n._("Luis"), "m"],
        // I18N: Male name
        [i18n._("Michael"), "m"],
        // I18N: Female name
        [i18n._("Nadia"), "f"],
        // I18N: Male name
        [i18n._("Omar"), "m"],
        // I18N: Female name
        [i18n._("Stephanie"), "f"],
        // I18N: Female name
        [i18n._("Tiffany"), "f"],
        // I18N: Female name
        [i18n._("Umaima"), "f"],
        // I18N: Female name
        [i18n._("Vanessa"), "f"],
        // I18N: Male name
        [i18n._("William"), "m"]
    ];

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
    var vehicles = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("bike", "bikes", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("car", "cars", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("horse", "horses", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("motorcycle", "motorcycles", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("scooter", "scooters", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("train", "trains", num);
        })
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
    var courses = new IncrementalShuffler([
        i18n._("chemistry"),
        i18n._("geometry"),
        i18n._("history"),
        i18n._("math"),
        i18n._("physics"),
        i18n._("language")
    ]);

    var exams = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("exam", "exams", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("test", "tests", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("quiz", "quizzes", num);
        })
    ]);

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
            return i18n.ngettext("party favor", "party favors", num);
        }), new Plural(function(num) {
            return i18n.ngettext("bag", "bags", num);
        })],
        [new Plural(function(num) {
            return i18n.ngettext("jelly bean", "jelly beans", num);
        }), new Plural(function(num) {
            return i18n.ngettext("bag", "bags", num);
        })],
        [new Plural(function(num) {
            return i18n.ngettext("book", "books", num);
        }), new Plural(function(num) {
            return i18n.ngettext("shelf", "shelves", num);
        })],
        [new Plural(function(num) {
            return i18n.ngettext("can of food", "cans of food", num);
        }), new Plural(function(num) {
            return i18n.ngettext("box", "boxes", num);
        })]
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
    var stores = new IncrementalShuffler([
        {
            name: new Plural(function(num) {
                return i18n.ngettext("hardware", "hardwares", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return i18n.ngettext("hammer", "hammers", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("nail", "nails", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("saw", "saws", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                return i18n.ngettext("grocery", "groceries", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return i18n.ngettext("banana", "bananas", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("loaf of bread", "loaves of bread", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("liter of milk", "liters of milk", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("potato", "potatoes", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                return i18n.ngettext("gift", "gifts", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return i18n.ngettext("toy", "toys", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("game", "games", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("souvenir", "souvenirs", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                return i18n.ngettext("school supply", "school supplies", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return i18n.ngettext("pen", "pens", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("pencil", "pencils", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("notebook", "notebooks", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                return i18n.ngettext("toy", "toys", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    return i18n.ngettext("stuffed animal", "stuffed animals", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("video game", "video games", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("race car", "race cars", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("doll", "dolls", num);
                })
            ])
        }
    ]);

    var pizzas = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("pizza", "pizzas", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pie", "pies", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("cake", "cakes", num);
        })
    ]);

    var timesofday = new IncrementalShuffler([
        i18n._("in the morning"),
        i18n._("around noon"),
        i18n._("in the evening"),
        i18n._("at night")
    ]);

    var exercises = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("push-up", "push-ups", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("sit-up", "sit-ups", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("squat", "squats", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("jumping jack", "jumping jacks", num);
        })
    ]);

    var fruits = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("apple", "apples", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("banana", "bananas", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("coconut", "coconuts", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("eggplant", "eggplants", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("kiwi fruit", "kiwi fruit", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("lemon", "lemons", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("mango", "mangos", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("nectarine", "nectarines", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("orange", "oranges", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pomegranate", "pomegranates", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("watermelon", "watermelons", num);
        })
    ]);

    var deskItems = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("binder", "binders", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("crayon", "crayons", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("eraser", "erasers", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("folder", "folders", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("glue stick", "glue sticks", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("marker", "markers", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("notebook", "notebooks", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pencil", "pencils", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("rubber stamp", "rubber stamps", num);
        })
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
    var colors = new IncrementalShuffler([
        i18n._("red"),
        // NOTE(jeresig): I18N: Removed because it begins with a vowel and is
        // used with an()
        //"orange",
        i18n._("yellow"),
        i18n._("green"),
        i18n._("blue"),
        i18n._("purple"),
        i18n._("white"),
        i18n._("black"),
        i18n._("brown"),
        i18n._("silver"),
        i18n._("gold"),
        i18n._("pink")
    ]);

    var schools = new IncrementalShuffler([
        // I18N: This is a generic school name
        i18n._("Loyola"),
        // I18N: This is a generic school name
        i18n._("Gardner Bullis"),
        // I18N: This is a generic school name
        i18n._("Almond"),
        // I18N: This is a generic school name
        i18n._("Covington"),
        // I18N: This is a generic school name
        i18n._("Springer"),
        // I18N: This is a generic school name
        i18n._("Santa Rita"),
        // I18N: This is a generic school name
        i18n._("Oak")
    ]);

    var furnitureStore = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("chair", "chairs", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("table", "tables", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("bed frame", "bed frames", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("sofa", "sofas", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("couch", "couches", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("desk", "desks", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("book shelf", "book shelves", num);
        })
    ]);

    var electronicStore = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("television", "televisions", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("computer", "computers", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("laptop", "laptops", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("camera", "cameras", num);
        })
    ]);

    var clothes = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("hat", "hats", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("belt", "belts", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("necklace", "necklaces", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of shoes", "pairs of shoes", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("watch", "watches", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of socks", "pairs of socks", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("sweatshirt", "sweatshirts", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("sweater", "sweaters", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("tie", "ties", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("scarf", "scarves", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of shorts", "pairs of shorts", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of jeans", "pairs of jeans", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of gloves", "pairs of gloves", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("shirt", "shirts", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of suspenders", "pairs of suspenders", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("jacket", "jackets", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of glasses", "pairs of glasses", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("pair of boots", "pairs of boots", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("backpack", "backpacks", num);
        })
    ]);

    var sides = new IncrementalShuffler([
        "left",
        "right"
    ]);

    var shirtStyles = new IncrementalShuffler([
        "long-sleeved",
        "short-sleeved"
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
            return i18n.ngettext("bear", "bears", num);
        }), 40, 20],
        //["elephant", 60, 10],
        [new Plural(function(num) {
            return i18n.ngettext("gorilla", "gorillas", num);
        }), 20, 5],
        [new Plural(function(num) {
            return i18n.ngettext("lion", "lions", num);
        }), 12, 5],
        [new Plural(function(num) {
            return i18n.ngettext("lizard", "lizards", num);
        }), 3, 1],
        [new Plural(function(num) {
            return i18n.ngettext("meerkat", "meerkats", num);
        }), 13, 5],
        [new Plural(function(num) {
            return i18n.ngettext("porcupine", "porcupines", num);
        }), 20, 5],
        [new Plural(function(num) {
            return i18n.ngettext("seal", "seals", num);
        }), 15, 10],
        [new Plural(function(num) {
            return i18n.ngettext("sloth", "sloths", num);
        }), 16, 5],
        [new Plural(function(num) {
            return i18n.ngettext("snake", "snakes", num);
        }), 25, 10],
        [new Plural(function(num) {
            return i18n.ngettext("tiger", "tigers", num);
        }), 22, 5],
        [new Plural(function(num) {
            return i18n.ngettext("turtle", "turtles", num);
        }), 100, 20],
        [new Plural(function(num) {
            return i18n.ngettext("zebra", "zebras", num);
        }), 25, 10]
    ]);

    // TODO(emily): I18N: add both "row of CROP" as well as just "CROP" for
    // pluralization. For example, in Polish, adding "row of" to "tomatoes"
    // changes the pluralization of "tomatoes".
    var farmers = new IncrementalShuffler([
        {
            farmer: new Plural(function(num) {
                return i18n.ngettext("farmer", "farmers", num);
            }),
            crops: new IncrementalShuffler([
                new Plural(function(num) {
                    return i18n.ngettext("tomato", "tomatoes", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("potato", "potatoes", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("carrot", "carrots", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("bean", "beans", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("corn stalk", "corn stalks", num);
                })
            ]),
            field: new Plural(function(num) {
                return i18n.ngettext("field", "fields", num);
            })
        },
        {
            farmer: new Plural(function(num) {
                return i18n.ngettext("gardener", "gardeners", num);
            }),
            crops: new IncrementalShuffler([
                new Plural(function(num) {
                    return i18n.ngettext("rose", "roses", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("tulip", "tulips", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("daisy", "daisies", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("iris", "irises", num);
                }),
                new Plural(function(num) {
                    return i18n.ngettext("lily", "lilies", num);
                })
            ]),
            field: new Plural(function(num) {
                return i18n.ngettext("garden", "gardens", num);
            })
        }
    ]);

    var distances = new IncrementalShuffler([
        new Plural(function(num) {
            return i18n.ngettext("mile", "miles", num);
        }),
        new Plural(function(num) {
            return i18n.ngettext("kilometer", "kilometers", num);
        })
    ]);

    // TODO(jeresig): I18N: Kill this.
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

});
