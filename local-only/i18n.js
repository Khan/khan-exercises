(function() {
// Perseus running in local mode depends on $_, which is defined here
if (typeof React !== 'undefined') {
    var createFragment = React.__internalAddons.createFragment;
}


// The plural language strings for all the languages we have
// listed in crowdin.  The values here need to match what crowdin
// uses (sometimes different platforms use different plural forms,
// for ambiguous languages like Turkish).  I got it by running
//    deploy/download_i18n.py -s
// and looking a the .po files in all.zip.  Each .po file has a
// header line that say something like:
//    "Plural-Forms: nplurals=2; plural=(n != 1);\n"
// which I copied in here with the following changes:
//    1) I only take the 'plural=' section, which I wrapped in a function
//    2) Changed 'or' to '||'
// These functions return either true or false or a number.  We map
// true to 1 and false to 0 below, to always get a number out of this.

/* eslint-disable space-infix-ops, eqeqeq, max-len */
var likeEnglish = function (n) {return n != 1;};

// TODO(csilvers): auto-generate this list from the foo.po files (in dropbox)
var allPluralForms = { 
    "accents": likeEnglish, // a 'fake' langauge
    "af": likeEnglish, 
    "ar": function (n) {return n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 && n % 100 <= 99 ? 4 : 5;}, 
    "az": likeEnglish, 
    "bg": likeEnglish, 
    "bn": likeEnglish, 
    "boxes": likeEnglish, // a 'fake' langauge
    "ca": likeEnglish, 
    "cs": function (n) {return n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2;}, 
    "da": likeEnglish, 
    "de": likeEnglish, 
    "el": likeEnglish, 
    "empty": likeEnglish, // a 'fake' langauge
    "en": likeEnglish, 
    "en-pt": likeEnglish, // a 'fake' language, used by crowdin for JIPT
    "es": likeEnglish, 
    "fa": function (n) {return 0;}, 
    "fa-af": function (n) {return 0;}, 
    "fi": likeEnglish, 
    "fr": function (n) {return n > 1;}, 
    "he": likeEnglish, 
    "hi": likeEnglish, 
    "hu": likeEnglish, 
    "hy": likeEnglish, 
    "id": function (n) {return 0;}, 
    "it": likeEnglish, 
    "ja": function (n) {return 0;}, 
    "ko": function (n) {return 0;}, 
    "lol": likeEnglish, // a 'fake' langauge
    "mn": likeEnglish, 
    "ms": function (n) {return 0;}, 
    "nb": likeEnglish, 
    "nl": likeEnglish, 
    "pl": function (n) {return n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;}, 
    "pt": likeEnglish, 
    "pt-pt": likeEnglish, 
    "ro": function (n) {return n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2;}, 
    "ru": function (n) {return n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;}, 
    "si-LK": likeEnglish, 
    "sk": function (n) {return n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2;}, 
    "sr": function (n) {return n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;}, 
    "sv-SE": likeEnglish, 
    "sw": likeEnglish, 
    "te": likeEnglish, 
    "th": function (n) {return 0;}, 
    "tr": function (n) {return 0;}, 
    "uk": function (n) {return n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;}, 
    "ur": likeEnglish, 
    "vi": function (n) {return 0;}, 
    "xh": likeEnglish, 
    "zh-hans": function (n) {return 0;}, 
    "zh-hant": function (n) {return 0;}, 
    "zu": likeEnglish };

/* eslint-enable */

var interpolationMarker = /%\(([\w_]+)\)s/g;
/**
 * Performs sprintf-like %(name)s replacement on str, and returns a React
 * fragment of the string interleaved with those replacements. The replacements
 * can be any valid React node including strings and numbers.
 *
 * For example:
 *  interpolateStringToFragment("test", {}) ->
 *      test
 *  interpolateStringToFragment("test %(num)s", {num: 5}) ->
 *      test 5
 *  interpolateStringToFragment("test %(num)s", {num: <Count />}) ->
 *      test <Count />
 */
var interpolateStringToFragment = function (str, options) {
    options = options || {};

    // Split the string into its language fragments and substitutions
    var split = str.split(interpolationMarker);

    var result = { "text_0": split[0] };

    // Replace the substitutions with the appropriate option
    for (var i = 1; i < split.length; i += 2) {
        var key = split[i];
        var replaceWith = options[key];
        if (replaceWith === undefined) {
            replaceWith = "%(" + key + ")s";}


        // We prefix each substitution key with a number that increments each
        // time it's used, so "test %(num)s %(fruit)s and %(num)s again" turns
        // into an object with keys:
        // [text_0, 0_num, text_2, 0_fruit, text_4, 1_num, text_6]
        // This is better than just using the array index in the case that we
        // switch between two translated strings with the same variables.
        // Admittedly, an edge case.
        var j = 0;
        while ("" + j + "_" + key in result) {
            j++;}

        result["" + j + "_" + key] = replaceWith;
        // Because the regex has one capturing group, the `split` array always
        // has an odd number of elements, so this always stays in bounds.
        result["text_" + (i + 1)] = split[i + 1];}


    return createFragment(result);};


/**
    * Simple i18n method with sprintf-like %(name)s replacement
    * To be used like so:
    *   i18n._("Some string")
    *   i18n._("Hello %(name)s", {name: "John"})
    */
var _ = function (str, options) {
    // Sometimes we're given an argument that's meant for ngettext().  This
    // happens if the same string is used in both i18n._() and i18n.ngettext()
    // (.g. a = i18n._(foo); b = i18n.ngettext("foo", "bar", count);
    // In such cases, only the plural form ends up in the .po file, and
    // then it gets sent to us for the i18n._() case too.  No problem, though:
    // we'll just take the singular arg.
    if (typeof str === "object" && str.messages) {
        str = str.messages[0];}


    options = options || {};

    return str.replace(interpolationMarker, function (match, key) {
        var replaceWith = options[key];
        return replaceWith === undefined ? match : replaceWith;});};



/**
    * A simple i18n react component-like function to allow for string
    * interpolation destined for the output of a react render() function
    *
    * This function understands react components, or other things
    * renderable by react, passed in as props.
    *
    * Examples:
    *   <$_ first="Motoko" last="Kusanagi">
    *       Hello, %(first)s %(last)s!
    *   </$_>
    *
    * which react/jsx compiles to:
    *   $_({first: "Motoko", last: "Kusanagi"}, "Hello, %(first)s %(last)s!")
    *
    *
    *   <$_ textbox={<input type="text" />}>
    *       Please enter a number: %(textbox)s
    *   </$_>
    *
    * which react/jsx compiles to:
    *   $_({textbox: React.DOM.input({type: "text"}),
    *       "Please enter a number: %(textbox)s")
    *
    * Note: this is not a full react component to avoid complex handling of
    * other things added to props, such as this.props.ref and
    * this.props.children
    */
var $_ = function (options, str) {
    if (arguments.length !== 2 || typeof str !== "string") {
        return "<$_> must have exactly one child, which must be a string";}

    return interpolateStringToFragment(str, options);};


/**
    * A simple i18n react component-like function to allow for marking a
    * string as not needing to be translated.
    *
    * Example:
    *
    *    <$i18nDoNotTranslate>English only text.</$i18nDoNotTranslate>
    *
    * which react/jsx compiles to:
    *    $i18nDoNotTranslate(null, "English only text.")
    */
var $i18nDoNotTranslate = function (options, str) {
    return str;};


/**
    * Simple ngettext method with sprintf-like %(name)s replacement
    * To be used like so:
    *   i18n.ngettext("Singular", "Plural", 3)
    *   i18n.ngettext("1 Cat", "%(num)s Cats", 3)
    *   i18n.ngettext("1 %(type)s", "%(num)s %(type)s", 3, {type: "Cat"})
    * This method is also meant to be used when injecting for other
    * non-English languages, like so (taking an array of plural messages,
    * which varies based upon the language):
    *   i18n.ngettext({
    *     lang: "ja",
    *     messages: ["%(num)s 猫 %(username)s"]
    *   }, 3, {username: "John"});
    */
var ngettext = function (singular, plural, num, options) {
    // Fall back to the default lang
    var lang;
    var messages;

    // If the first argument is an object then we're receiving a plural
    // configuration object
    if (typeof singular === "object") {
        lang = singular.lang;
        messages = singular.messages;
        // We only have a messages object no plural string
        // thus we need to shift all the arguments over by one.
        options = num;
        num = plural;} else 
    {
        lang = "en"; // We're using text written into the source code
        messages = [singular, plural];}


    // Get the translated string
    var idx = ngetpos(num, lang);
    var translation = "";
    if (idx < messages.length) {// the common (non-error) case
        translation = messages[idx];}


    // Get the options to substitute into the string.
    // We automatically add in the 'magic' option-variable 'num'.
    options = options || {};
    options.num = options.num || num;

    // Then pass into i18n._ for the actual substitution
    return _(translation, options);};


/*
    * Return the ngettext position that matches the given number and locale.
    *
    * Arguments:
    *  - num: The number upon which to toggle the plural forms.
    *  - lang: The language to use as the basis for the pluralization.
    */
var ngetpos = function (num, lang) {
    var pluralForm = allPluralForms[lang] || allPluralForms["en"];
    var pos = pluralForm(num);
    // Map true to 1 and false to 0, keep any numeric return value the same.
    return pos === true ? 1 : pos ? pos : 0;};


/*
    * A dummy identity function.  It's used as a signal to automatic
    * translation-identification tools that they shouldn't mark this
    * text up to be translated, even though it looks like
    * natural-language text.  (And likewise, a signal to linters that
    * they shouldn't complain that this text isn't translated.)
    * Use it like so: 'tag.author = i18n.i18nDoNotTranslate("Jim");'
    */
var i18nDoNotTranslate = _;

/**
    * Dummy Handlebars _ function. Is a noop.
    * Should be used as: {{#_}}...{{/_}}
    * The text is extracted, at compile-time, by server-side scripts.
    * This is just used for marking up those fragments that need translation.
    * The translated text is injected at deploy-time.
    */
var handlebarsUnderscore = function (options) {
    return options.fn(this);};


/**
    *  Mark text as not needing translation.
    *
    * This function is used to let i18nize_templates.py know that
    * everything within it does not need to be translate.
    * Should be used as: {{#i18nDoNotTranslate}}...{{/i18nDoNotTranslate}}
    * It does not need to actually do anything and hence returns the contents
    * as is.
    */
var handlebarsDoNotTranslate = function (options) {
    return options.fn(this);};


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
var handlebarsNgettext = function (num, lang, pos, options) {
    // This method has two signatures:
    // (num) (the default for when the code is run in dev mode)
    // (num, lang, pos) (for when the code is run in prod mode)
    if (typeof lang !== "string") {
        options = lang;
        lang = "en";
        pos = 0;}


    // Add in 'num' as a magic variable.
    this.num = this.num || num;

    // If the result of the plural form function given the specified
    // number matches the expected position then we give the first
    // result, otherwise we give the inverse result.
    return ngetpos(num) === pos ? 
    options.fn(this) : 
    options.inverse(this);};


/**
 * Rounds num to X places, and uses the proper decimal seperator.
 * But does *not* insert thousands separators.
 */
var localeToFixed = function (num, places) {
    var decimalSeperator = icu.getDecimalFormatSymbols().decimal_separator;
    var localeFixed = num.toFixed(places).replace(".", decimalSeperator);
    if (localeFixed === "-0") {
        localeFixed = "0";}

    return localeFixed;};


// This is necessary for khan-exercises, perseus, and
// bootstrap-daterangepicker (live-editor also uses the global i18n
// var, but defines its own version of it.)  We export the symbols
// that they need.
window.i18n = { 
    _: _, 
    ngettext: ngettext, 
    i18nDoNotTranslate: i18nDoNotTranslate, 
    // khan-exercises is the only client of ngetpos (which is emitted
    // into khan-exercises by kake/translate-exercises.py).
    ngetpos: ngetpos };


// TODO(csilvers): is it still necessary to make these globals?
window.$_ = $_;
window.$i18nDoNotTranslate = $i18nDoNotTranslate;

})();
