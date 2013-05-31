(function() {
    // If no language is specified, or if an unknown language is specified,
    // then fall back to using "en" as the base language
    var defaultLang = "en";

    // The plural language strings for the 30 most popular web languages.
    // Plural forms from:
    // http://translate.sourceforge.net/wiki/l10n/pluralforms
    // All these languages are the same as 'en'
    // (and are thus left out, as 'en' is the default)
    // af, ca, da, de, el, es, fi, he, hu, it, nl, nb/nn/no, pt, sv

    // Used for many of the Asian languages: ja, kr, vi, zh
    var asianPlural = "nplurals=1; plural=0";

    // Used for many Russian or near-Russian languages: ru, sr, uk
    var russianPlural = "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)";

    // Some romantic languages only pluralize numbers greater than one
    var gtOnePlural = "nplurals=2; plural=(n > 1)";

    var plural_forms = {
        "ar": "nplurals=6; plural= n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5;",
        "cs": "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2",
        "en": "nplurals=2; plural=(n != 1)",
        "fr": gtOnePlural,
        "ja": asianPlural,
        "kr": asianPlural,
        "pl": "nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)",
        "pt": gtOnePlural,
        "ro": "nplurals=3; plural=(n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2);",
        "ru": russianPlural,
        "sr": russianPlural,
        "tr": gtOnePlural,
        "uk": russianPlural,
        "vi": asianPlural,
        "zh": asianPlural
    };

    var getPluralForm = function(lang) {
        return plural_forms[lang] || plural_forms[defaultLang];
    };

    // Create a global Jed instance named 'i18n'
    window.i18n = new Jed({});

    // We will set the locale-data lazily, as we need it
    i18n.options.locale_data = {};

    /**
     * Simple i18n method with sprintf-like %(name)s replacement
     * To be used like so:
     *   $._("Some string")
     *   $._("Hello %(name)", {name: "John"})
     */
    jQuery._ = function(str, options) {
        options = options || {};

        // Sometimes we're given an argument that's meant for ngettext().  This
        // happens if the same string is used in both $._() and $.ngettext()
        // (.g. a = $._(foo); b = $.ngettext("foo", "bar", count);
        // In such cases, only the plural form ends up in the .po file, and
        // then it gets sent to us for the $._() case too.  No problem, though:
        // we'll just take the singular arg.
        if (typeof str === "object" && str.messages) {
            str = str.messages[0];
        }

        return str.replace(/%\(([\w_]+)\)s/g, function(all, name) {
            var retVal = options[name];
            return retVal === undefined ? all : retVal;
        });
    };

    /**
     * Simple ngettext method with sprintf-like %(name)s replacement
     * To be used like so:
     *   $.ngettext("Singular", "Plural", 3)
     *   $.ngettext("1 Cat", "%(num) Cats", 3)
     *   $.ngettext("1 %(type)", "%(num) %(type)s", 3, {type: "Cat"})
     * This method is also meant to be used when injecting for other
     * non-English languages, like so (taking an array of plural messages,
     * which varies based upon the language):
     *   $.ngettext({
     *     lang: "ja",
     *     messages: ["%(num)s 猫 %(username)s"]
     *   }, 3, {username: "John"});
     */
    jQuery.ngettext = function(singular, plural, num, options) {
        var message_info = singular;

        // Fall back to the default lang
        var lang = message_info.lang || defaultLang;

        // Make sure we have locale_data set for our language
        if (!i18n.options.locale_data[lang]) {
            i18n.options.locale_data[lang] = {
                "": {
                    domain: lang,
                    // Set the language
                    lang: lang,
                    // Initialize the plural forms to be used with
                    // any pluralization that occurs
                    plural_forms: getPluralForm(lang)
                }
            };
        }

        // If the first argument is an object then we're receiving a plural
        // configuration object
        if (typeof message_info === "object") {
            // We only have a messages object no plural string
            // thus we need to shift all the arguments over by one.
            options = num;
            num = plural;

            // Get the actual singular form of the string for lookups
            // We just ignore the plural form as it's generated automatically.
            singular = message_info.messages[0];

            // Add the messages into the Jed.js i18n object.
            // By default the first item in the array is ignored
            i18n.options.locale_data[lang][singular] =
                [null].concat(message_info.messages);
        }

        // Get the options to substitute into the string
        options = options || {};
        options.num = options.num || num;

        // Then pass into $._ for the actual substitution
        return jQuery._(i18n.dngettext(lang, singular, plural, num), options);
    };

    /*
     * Return the ngettext position that matches the given number and locale.
     *
     * Arguments:
     *  - num: The number upon which to toggle the plural forms.
     *  - lang: The language to use as the basis for the pluralization.
     */
    jQuery.ngetpos = function(num, lang) {
        lang = lang || "en";

        // Generate a function which will give the position of the message
        // which matches the correct plural form of the string
        return Jed.PF.compile(getPluralForm(lang))(num);
    };

    /*
     * Returns true if the given number matches the singular form, false
     * if it's some other form.
     *
     * Arguments:
     *  - num: The number upon which to toggle the plural forms.
     *  - lang: The language to use as the basis for the pluralization.
     */
    jQuery.isSingular = function(num, lang) {
        return jQuery.ngetpos(num, lang) === 0;
    };

    /**
     * Dummy Handlebars _ function. Is a noop.
     * Should be used as: {{#_}}...{{/_}}
     * The text is extracted, at compile-time, by server-side scripts.
     * This is just used for marking up those fragments that need translation.
     * The translated text is injected at deploy-time.
     */
    i18n.handlebars_underscore = function(options) {
        return options.fn(this);
    };

    /**
     * Handlebars ngettext function.
     * Doesn't do any translation, is used for showing the correct string
     * based upon the specified number and language.
     * All strings are extracted (at compile-time) and injected (at
     * deploy-time). By default this should be used as:
     *   {{#ngettext NUM}}singular{{else}}plural{{/ngettext}}
     * After injecting the translated strings into the page it'll read as:
     *   {{#ngettext NUM "lang" 0}}singular{{else}}plural{{/ngettext}}
     * (May depend upon the language used and how many different plural
     * forms the language has.)
     *
     * Arguments:
     *  - num: The number upon which to toggle the plural forms.
     *  - lang: The language to use as the basis for the pluralization.
     *  - pos: The expected plural form (depends upon the language)
     */
    i18n.handlebars_ngettext = function(num, lang, pos, options) {
        // This method has two signatures:
        // (num) (the default for when the code is run in dev mode)
        // (num, lang, pos) (for when the code is run in prod mode)
        if (typeof lang !== "string") {
            options = lang;
            lang = "en";
            pos = 0;
        }

        // Add in 'num' as a magic variable.
        this.num = this.num || num;

        // If the result of the plural form function given the specified
        // number matches the expected position then we give the first
        // result, otherwise we give the inverse result.
        return jQuery.ngetpos(num) === pos ?
            options.fn(this) :
            options.inverse(this);
    };
})();

