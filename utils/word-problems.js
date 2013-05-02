// Example usage:
// <var>person(1)</var> traveled 5 mi by <var>vehicle(1)</var>. Let
// <var>his(1)</var> average speed be <var>personVar(1)</var>.
// Let <var>person(2)</var>'s speed be <var>personVar(2)</var>.
//
// Note that initials (-Var) are guaranteed to be unique in each category,
// but not across them.

$.extend(KhanUtil, {
    // TODO(jeresig): i18n: Figure out how this should be converted
    toSentence: function(array, conjunction) {
        if (conjunction == null) {
            conjunction = "and";
        }

        if (array.length === 0) {
            return "";
        } else if (array.length === 1) {
            return array[0];
        } else if (array.length === 2) {
            return array[0] + " " + conjunction + " " + array[1];
        } else {
            return array.slice(0, -1).join(", ") + ", " + conjunction + " " + array[array.length - 1];
        }
    },

    toSentenceTex: function(array, conjunction, highlight, highlightClass) {
        var wrapped = $.map(array, function(elem) {
            if (($.isFunction(highlight) && highlight(elem)) || (highlight !== undefined && elem === highlight)) {
                return "<code class='" + highlightClass + "'>" + elem + "</code>";
            }
            return "<code>" + elem + "</code>";
        });
        return KhanUtil.toSentence(wrapped, conjunction);
    },

    // TODO(jeresig): I18N: Kill this.
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    plural_form: function(word, num) {
        // TODO(jeresig): i18n: Eventually remove this?
        if (typeof console !== "undefined" && console.error) {
            console.error("Word not in plural dictionary: ", word);
        }

        return word;
    },

    isSingular: function(num) {
        return num == 1;
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
            } else if (typeof value === "string") {
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

KhanUtil.Plural.prototype = {
    plural_form: function(num) {
        // There are some cases where plural_form is called with only a word
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
        [$._("Ashley"), "f"],
        // I18N: Male name
        [$._("Brandon"), "m"],
        // I18N: Male name
        [$._("Ben"), "m"],
        // I18N: Male name
        [$._("Christopher"), "m"],
        // I18N: Male name
        [$._("Daniel"), "m"],
        // I18N: Female name
        [$._("Emily"), "f"],
        // I18N: Female name
        [$._("Gabriela"), "f"],
        // I18N: Male name
        [$._("Ishaan"), "m"],
        // I18N: Female name
        [$._("Jessica"), "f"],
        // I18N: Male name
        [$._("Kevin"), "m"],
        // I18N: Male name
        [$._("Luis"), "m"],
        // I18N: Male name
        [$._("Michael"), "m"],
        // I18N: Female name
        [$._("Nadia"), "f"],
        // I18N: Male name
        [$._("Omar"), "m"],
        // I18N: Female name
        [$._("Stephanie"), "f"],
        // I18N: Female name
        [$._("Tiffany"), "f"],
        // I18N: Female name
        [$._("Umaima"), "f"],
        // I18N: Female name
        [$._("Vanessa"), "f"],
        // I18N: Male name
        [$._("William"), "m"]
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
            $.ngettext("bike", "bikes", num);
        }),
        new Plural(function(num) {
            $.ngettext("car", "cars", num);
        }),
        new Plural(function(num) {
            $.ngettext("horse", "horses", num);
        }),
        new Plural(function(num) {
            $.ngettext("motorcycle", "motorcycles", num);
        }),
        new Plural(function(num) {
            $.ngettext("scooter", "scooters", num);
        }),
        new Plural(function(num) {
            $.ngettext("train", "trains", num);
        })
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
    var courses = new IncrementalShuffler([
        "chemistry",
        "geometry",
        "history",
        "mathematics",
        "physics",
        "Spanish"
    ]);

    var exams = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("exam", "exams", num);
        }),
        new Plural(function(num) {
            $.ngettext("test", "tests", num);
        }),
        new Plural(function(num) {
            $.ngettext("quiz", "quizzes", num);
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
            $.ngettext("party favor", "party favors", num);
        }), new Plural(function(num) {
            $.ngettext("bag", "bags", num);
        })],
        [new Plural(function(num) {
            $.ngettext("jelly bean", "jelly beans", num);
        }), new Plural(function(num) {
            $.ngettext("bag", "bags", num);
        })],
        [new Plural(function(num) {
            $.ngettext("book", "books", num);
        }), new Plural(function(num) {
            $.ngettext("shelf", "shelves", num);
        })],
        [new Plural(function(num) {
            $.ngettext("can of food", "cans of food", num);
        }), new Plural(function(num) {
            $.ngettext("box", "boxes", num);
        })]
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
    var stores = new IncrementalShuffler([
        {
            name: new Plural(function(num) {
                $.ngettext("hardware", "hardwares", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    $.ngettext("hammer", "hammers", num);
                }),
                new Plural(function(num) {
                    $.ngettext("nail", "nails", num);
                }),
                new Plural(function(num) {
                    $.ngettext("saw", "saws", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                $.ngettext("grocery", "groceries", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    $.ngettext("banana", "bananas", num);
                }),
                new Plural(function(num) {
                    $.ngettext("loaf of bread", "loaves of breads", num);
                }),
                new Plural(function(num) {
                    $.ngettext("gallon of milk", "gallons of milks", num);
                }),
                new Plural(function(num) {
                    $.ngettext("potato", "potatoes", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                $.ngettext("gift", "gifts", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    $.ngettext("toy", "toys", num);
                }),
                new Plural(function(num) {
                    $.ngettext("game", "games", num);
                }),
                new Plural(function(num) {
                    $.ngettext("souvenir", "souvenirs", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                $.ngettext("school supply", "school supplies", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    $.ngettext("pen", "pens", num);
                }),
                new Plural(function(num) {
                    $.ngettext("pencil", "pencils", num);
                }),
                new Plural(function(num) {
                    $.ngettext("notebook", "notebooks", num);
                })
            ])
        },
        {
            name: new Plural(function(num) {
                $.ngettext("toy", "toys", num);
            }),
            items: new IncrementalShuffler([
                new Plural(function(num) {
                    $.ngettext("stuffed animal", "stuffed animals", num);
                }),
                new Plural(function(num) {
                    $.ngettext("video game", "video games", num);
                }),
                new Plural(function(num) {
                    $.ngettext("race car", "race cars", num);
                }),
                new Plural(function(num) {
                    $.ngettext("doll", "dolls", num);
                })
            ])
        }
    ]);

    var pizzas = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("pizza", "pizzas", num);
        }),
        new Plural(function(num) {
            $.ngettext("pie", "pies", num);
        }),
        new Plural(function(num) {
            $.ngettext("cake", "cakes", num);
        })
    ]);

    var timesofday = new IncrementalShuffler([
        "in the morning",
        "around noon",
        "in the evening",
        "at night"
    ]);

    var exercises = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("push-up", "push-ups", num);
        }),
        new Plural(function(num) {
            $.ngettext("sit-up", "sit-ups", num);
        }),
        new Plural(function(num) {
            $.ngettext("squat", "squats", num);
        }),
        new Plural(function(num) {
            $.ngettext("jumping jack", "jumping jacks", num);
        })
    ]);

    var fruits = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("apple", "apples", num);
        }),
        new Plural(function(num) {
            $.ngettext("banana", "bananas", num);
        }),
        new Plural(function(num) {
            $.ngettext("coconut", "coconuts", num);
        }),
        new Plural(function(num) {
            $.ngettext("eggplant", "eggplants", num);
        }),
        new Plural(function(num) {
            $.ngettext("kiwi", "kiwis", num);
        }),
        new Plural(function(num) {
            $.ngettext("lemon", "lemons", num);
        }),
        new Plural(function(num) {
            $.ngettext("mango", "mangos", num);
        }),
        new Plural(function(num) {
            $.ngettext("nectarine", "nectarines", num);
        }),
        new Plural(function(num) {
            $.ngettext("orange", "oranges", num);
        }),
        new Plural(function(num) {
            $.ngettext("pomegranate", "pomegranates", num);
        }),
        new Plural(function(num) {
            $.ngettext("watermelon", "watermelons", num);
        })
    ]);

    var deskItems = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("binder", "binders", num);
        }),
        new Plural(function(num) {
            $.ngettext("crayon", "crayons", num);
        }),
        new Plural(function(num) {
            $.ngettext("eraser", "erasers", num);
        }),
        new Plural(function(num) {
            $.ngettext("folder", "folders", num);
        }),
        new Plural(function(num) {
            $.ngettext("glue stick", "glue sticks", num);
        }),
        new Plural(function(num) {
            $.ngettext("marker", "markers", num);
        }),
        new Plural(function(num) {
            $.ngettext("notebook", "notebooks", num);
        }),
        new Plural(function(num) {
            $.ngettext("pencil", "pencils", num);
        }),
        new Plural(function(num) {
            $.ngettext("rubber stamp", "rubber stamps", num);
        })
    ]);

    // NOTE(jeresig): I18N: These strings are expected to work prefixed with
    // just the letter "A", as in "A gorilla"
    var colors = new IncrementalShuffler([
        "red",
        // NOTE(jeresig): I18N: Removed because it begins with a vowel and is
        // used with an()
        //"orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "white",
        "black",
        "brown",
        "silver",
        "gold",
        "pink"
    ]);

    var schools = new IncrementalShuffler([
        "Loyola",
        "Gardner Bullis",
        "Almond",
        "Covington",
        "Springer",
        "Santa Rita",
        "Oak"
    ]);

    var furnitureStore = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("chair", "chairs", num);
        }),
        new Plural(function(num) {
            $.ngettext("table", "tables", num);
        }),
        new Plural(function(num) {
            $.ngettext("bed frame", "bed frames", num);
        }),
        new Plural(function(num) {
            $.ngettext("sofa", "sofas", num);
        }),
        new Plural(function(num) {
            $.ngettext("couch", "couchs", num);
        }),
        new Plural(function(num) {
            $.ngettext("desk", "desks", num);
        }),
        new Plural(function(num) {
            $.ngettext("book shelf", "book shelves", num);
        })
    ]);

    var electronicStore = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("television", "televisions", num);
        }),
        new Plural(function(num) {
            $.ngettext("computer", "computers", num);
        }),
        new Plural(function(num) {
            $.ngettext("laptop", "laptops", num);
        }),
        new Plural(function(num) {
            $.ngettext("camera", "cameras", num);
        })
    ]);

    var clothes = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("hat", "hats", num);
        }),
        new Plural(function(num) {
            $.ngettext("pair of pants", "pairs of pants", num);
        }),
        new Plural(function(num) {
            $.ngettext("belt", "belts", num);
        }),
        new Plural(function(num) {
            $.ngettext("necklace", "necklaces", num);
        }),
        new Plural(function(num) {
            $.ngettext("purse", "purses", num);
        }),
        new Plural(function(num) {
            $.ngettext("pair of shoes", "pairs of shoes", num);
        }),
        new Plural(function(num) {
            $.ngettext("blouse", "blouses", num);
        }),
        new Plural(function(num) {
            $.ngettext("skirt", "skirts", num);
        }),
        new Plural(function(num) {
            $.ngettext("watch", "watches", num);
        }),
        new Plural(function(num) {
            $.ngettext("pair of socks", "pairs of socks", num);
        }),
        new Plural(function(num) {
            $.ngettext("sweatshirt", "sweatshirts", num);
        }),
        new Plural(function(num) {
            $.ngettext("sweater", "sweaters", num);
        }),
        new Plural(function(num) {
            $.ngettext("tie", "ties", num);
        }),
        new Plural(function(num) {
            $.ngettext("scarf", "scarves", num);
        }),
        new Plural(function(num) {
            $.ngettext("dress", "dresses", num);
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
            $.ngettext("bear", "bears", num);
        }), 40, 20],
        //["elephant", 60, 10],
        [new Plural(function(num) {
            $.ngettext("gorilla", "gorillas", num);
        }), 20, 5],
        [new Plural(function(num) {
            $.ngettext("lion", "lions", num);
        }), 12, 5],
        [new Plural(function(num) {
            $.ngettext("lizard", "lizards", num);
        }), 3, 1],
        [new Plural(function(num) {
            $.ngettext("meerkat", "meerkats", num);
        }), 13, 5],
        [new Plural(function(num) {
            $.ngettext("porcupine", "porcupines", num);
        }), 20, 5],
        [new Plural(function(num) {
            $.ngettext("seal", "seals", num);
        }), 15, 10],
        [new Plural(function(num) {
            $.ngettext("sloth", "sloths", num);
        }), 16, 5],
        [new Plural(function(num) {
            $.ngettext("snake", "snakes", num);
        }), 25, 10],
        [new Plural(function(num) {
            $.ngettext("tiger", "tigers", num);
        }), 22, 5],
        [new Plural(function(num) {
            $.ngettext("turtle", "turtles", num);
        }), 100, 20],
        [new Plural(function(num) {
            $.ngettext("zebra", "zebras", num);
        }), 25, 10]
    ]);

    var farmers = new IncrementalShuffler([
        {
            farmer: new Plural(function(num) {
                $.ngettext("farmer", "farmers", num);
            }),
            crops: new IncrementalShuffler([
                new Plural(function(num) {
                    $.ngettext("tomato", "tomatoes", num);
                }),
                new Plural(function(num) {
                    $.ngettext("potato", "potatoes", num);
                }),
                new Plural(function(num) {
                    $.ngettext("carrot", "carrots", num);
                }),
                new Plural(function(num) {
                    $.ngettext("bean", "beans", num);
                }),
                new Plural(function(num) {
                    $.ngettext("corn stalk", "corn stalks", num);
                })
            ]),
            field: new Plural(function(num) {
                $.ngettext("field", "fields", num);
            })
        },
        {
            farmer: new Plural(function(num) {
                $.ngettext("gardener", "gardeners", num);
            }),
            crops: new IncrementalShuffler([
                new Plural(function(num) {
                    $.ngettext("rose", "roses", num);
                }),
                new Plural(function(num) {
                    $.ngettext("tulip", "tulips", num);
                }),
                new Plural(function(num) {
                    $.ngettext("daisy", "daisys", num);
                }),
                new Plural(function(num) {
                    $.ngettext("iris", "iriss", num);
                }),
                new Plural(function(num) {
                    $.ngettext("lily", "lilys", num);
                })
            ]),
            field: new Plural(function(num) {
                $.ngettext("garden", "gardens", num);
            })
        }
    ]);

    var distances = new IncrementalShuffler([
        new Plural(function(num) {
            $.ngettext("mile", "miles", num);
        }),
        new Plural(function(num) {
            $.ngettext("kilometer", "kilometers", num);
        })
    ]);

    // TODO(jeresig): I18N: Kill this.
    var distanceActivities = new IncrementalShuffler([
        {present: "ride", past: "rode", noun: "bike", done: "biked", continuous: "biking"},
        {present: "row", past: "rowed", noun: "boat", done: "rowed", continuous: "rowing"},
        {present: "drive", past: "drove", noun: "car", done: "driven", continuous: "driving"},
        {present: "walk", past: "walked", noun: "dog", done: "walked", continuous: "walking"}
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
        He: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "He" : "She";
        },

        // TODO(jeresig): I18N: Kill this.
        him: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "him" : "her";
        },

        // TODO(jeresig): I18N: Kill this.
        his: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "his" : "her";
        },

        // TODO(jeresig): I18N: Kill this.
        His: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "His" : "Her";
        },

        isMale: function(i) {
            return people.get(i - 1).get(0)[1] === "m";
        },

        // TODO(jeresig): I18N: Kill this.
        An: function(word) {
            return indefiniteArticle(word);
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

        // TODO(jeresig): I18N: Kill this.
        rode: function(i) {
            return distanceActivities.get(i - 1).past;
        },

        // TODO(jeresig): I18N: Kill this.
        ride: function(i) {
            return distanceActivities.get(i - 1).present;
        },

        // TODO(jeresig): I18N: Kill this.
        bike: function(i) {
            return distanceActivities.get(i - 1).noun;
        },

        // TODO(jeresig): I18N: Kill this.
        biked: function(i) {
            return distanceActivities.get(i - 1).done;
        },

        // TODO(jeresig): I18N: Kill this.
        biking: function(i) {
            return distanceActivities.get(i - 1).continuous;
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
