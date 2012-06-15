// Example usage:
// <var>person(1)</var> traveled 5 mi by <var>vehicle(1)</var>. Let
// <var>his(1)</var> average speed be <var>personVar(1)</var>.
// Let <var>person(2)</var>'s speed be <var>personVar(2)</var>.
//
// Note that initials (-Var) are guaranteed to be unique in each category,
// but not across them.

$.extend(KhanUtil, {
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

    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // pluralization helper.  There are five signatures
    // - plural(NUMBER): return "s" if NUMBER is not 1
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
    })()
});

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
        ["Ashley", "f"],
        ["Brandon", "m"],
        ["Ben", "m"],
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
    ];

    // We only want one name per letter of the alphabet, so group people with
    // the same initial before shuffling the names up
    var people = _.map(_.groupBy(names, function(name) {
        return name[0].charAt(0);
    }), function(group) {
        return new IncrementalShuffler(group);
    });
    people = new IncrementalShuffler(people);

    var vehicles = new IncrementalShuffler([
        "bike",
        "car",
        "horse",
        "motorcycle",
        "scooter",
        "train"
    ]);

    var courses = new IncrementalShuffler([
        "algebra",
        "chemistry",
        "geometry",
        "history",
        "physics",
        "Spanish"
    ]);

    var exams = new IncrementalShuffler([
        "exam",
        "test",
        "quiz"
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
        ["chair", "row", "make"],
        ["party favor", "bag", "fill"],
        ["jelly bean", "pile", "make"],
        ["book", "shelf", "fill"],
        ["can of food", "box", "fill"]
    ]);

    var stores = new IncrementalShuffler([
        {
            name: "office supply",
            items: new IncrementalShuffler(["pen", "pencil", "notebook"])
        },
        {
            name: "hardware",
            items: new IncrementalShuffler(["hammer", "nail", "saw"])
        },
        {
            name: "grocery",
            items: new IncrementalShuffler(["banana", "loaf of bread", "gallon of milk", "potato"])
        },
        {
            name: "gift",
            items: new IncrementalShuffler(["toy", "game", "souvenir"])
        },
        {
            name: "toy",
            items: new IncrementalShuffler(["stuffed animal", "video game", "race car", "doll"])
        }
    ]);

    var pizzas = new IncrementalShuffler([
        "pizza",
        "pie",
        "cake"
    ]);

    var timesofday = new IncrementalShuffler([
        "in the morning",
        "around noon",
        "in the evening",
        "at night"
    ]);

    var exercises = new IncrementalShuffler([
        "push-up",
        "sit-up",
        "squat",
        "jumping jack"
    ]);

    var fruits = new IncrementalShuffler([
        "apple",
        "banana",
        "coconut",
        "eggplant",
        "kiwi",
        "lemon",
        "mango",
        "nectarine",
        "orange",
        "pomegranate",
        "watermelon"
    ]);

    var deskItems = new IncrementalShuffler([
        "binder",
        "crayon",
        "eraser",
        "folder",
        "glue stick",
        "marker",
        "notebook",
        "pencil",
        "rubber stamp"
    ]);

    var colors = new IncrementalShuffler([
        "red",
        "orange",
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
        "chair",
        "table",
        "bed frame",
        "sofa",
        "couch",
        "desk",
        "book shelf"
    ]);

    var electronicStore = new IncrementalShuffler([
        "television",
        "computer",
        "laptop",
        "camera"
    ]);

    var clothes = new IncrementalShuffler([
        "hat",
        "pair of pants",
        "belt",
        "necklace",
        "purse",
        "pair of shoes",
        "blouse",
        "skirt",
        "watch",
        "pair of socks",
        "sweatshirt",
        "sweater",
        "tie",
        "scarf",
        "dress"
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
    var animals = new IncrementalShuffler([
        ["alligator", 68, 20],
        ["anteater", 15, 10],
        ["bear", 40, 20],
        ["elephant", 60, 10],
        ["gorilla", 20, 5],
        ["lion", 12, 5],
        ["lizard", 3, 1],
        ["meerkat", 13, 5],
        ["porcupine", 20, 5],
        ["seal", 15, 10],
        ["sloth", 16, 5],
        ["snake", 25, 10],
        ["tiger", 22, 5],
        ["turtle", 100, 20],
        ["zebra", 25, 10]
    ]);

    var farmers = new IncrementalShuffler([
        {farmer: "farmer", crops: new IncrementalShuffler(["tomato", "potato", "carrot", "bean", "corn stalk"]), field: "field"},
        {farmer: "gardener", crops: new IncrementalShuffler(["rose", "tulip", "daisy", "iris", "lily"]), field: "garden"}
    ]);

    var distances = new IncrementalShuffler([
        "mile",
        "kilometer"
    ]);

    var distanceActivities = new IncrementalShuffler([
        {present: "ride", past: "rode", noun: "bike", done: "biked", continuous: "biking"},
        {present: "row", past: "rowed", noun: "boat", done: "rowed", continuous: "rowing"},
        {present: "drive", past: "drove", noun: "car", done: "driven", continuous: "driving"},
        {present: "walk", past: "walked", noun: "dog", done: "walked", continuous: "walking"}
    ]);

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

        he: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "he" : "she";
        },

        He: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "He" : "She";
        },

        him: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "him" : "her";
        },

        his: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "his" : "her";
        },

        His: function(i) {
            return people.get(i - 1).get(0)[1] === "m" ? "His" : "Her";
        },

        An: function(word) {
            return indefiniteArticle(word);
        },

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

        groupVerb: function(i) {
            return collections.get(i - 1)[2];
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

        rode: function(i) {
            return distanceActivities.get(i - 1).past;
        },

        ride: function(i) {
            return distanceActivities.get(i - 1).present;
        },

        bike: function(i) {
            return distanceActivities.get(i - 1).noun;
        },

        biked: function(i) {
            return distanceActivities.get(i - 1).done;
        },

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
