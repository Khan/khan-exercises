(function() {
// Perseus running in local mode depends on $_, which is defined here
if (typeof React !== 'undefined') {
    var createFragment = React.__internalAddons.createFragment;
}

/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable camelcase, comma-dangle, max-len, no-undef, prefer-template */
/* To fix, remove an entry above, run "make linc", and fix errors. */


// If no language is specified, or if an unknown language is specified,
// then fall back to using "en" as the base language
var defaultLang = "en";

// The plural language strings for all the languages we have
// listed in crowdin.  The values here need to match what crowdin
// uses (sometimes different platforms use different plural forms,
// for ambiguous languages like Turkish).  I got it by running
//    deploy/download_i18n.py -s
// and looking a the .po files in all.zip.  Each .po file has a
// header line that say something like:
//    "Plural-Forms: nplurals=2; plural=(n != 1);\n"
// which I copied in here verbatim, except I replaced occurrences
// of "or" with "||".
var plural_forms = { 
    "af": "nplurals=2; plural=(n != 1)", 
    "ar": "nplurals=6; plural= n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5", 
    "az": "nplurals=2; plural=(n != 1)", 
    "bg": "nplurals=2; plural=(n != 1)", 
    "ca": "nplurals=2; plural=(n != 1)", 
    "cs": "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2", 
    "da": "nplurals=2; plural=(n != 1)", 
    "de": "nplurals=2; plural=(n != 1)", 
    "el": "nplurals=2; plural=(n != 1)", 
    "en": "nplurals=2; plural=(n != 1)", 
    "es-ES": "nplurals=2; plural=(n != 1)", 
    "fi": "nplurals=2; plural=(n != 1)", 
    "fr": "nplurals=2; plural=(n > 1)", 
    "he": "nplurals=2; plural=(n != 1)", 
    "hi": "nplurals=2; plural=(n!=1)", 
    "hu": "nplurals=2; plural=(n != 1)", 
    "it": "nplurals=2; plural=(n != 1)", 
    "ja": "nplurals=1; plural=0", 
    "ko": "nplurals=1; plural=0", 
    "nl": "nplurals=2; plural=(n != 1)", 
    "no": "nplurals=2; plural=(n != 1)", 
    "pl": "nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)", 
    "pt-BR": "nplurals=2; plural=(n != 1)", 
    "pt-PT": "nplurals=2; plural=(n != 1)", 
    "ro": "nplurals=3; plural=(n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2)", 
    "ru": "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2", 
    "si-LK": "nplurals=2; plural=(n != 1)", 
    "sk": "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2", 
    "sr": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)", 
    "sv-SE": "nplurals=2; plural=(n != 1) ", 
    "tr": "nplurals=1; plural=0", 
    "uk": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)", 
    "ur-PK": "nplurals=2; plural=(n != 1)", 
    "vi": "nplurals=1; plural=0", 
    "xh": "nplurals=2; plural=(n != 1)", 
    "zh-CN": "nplurals=1; plural=0", 
    "zh-TW": "nplurals=1; plural=0" };


var getPluralForm = function (lang) {
    return plural_forms[lang] || plural_forms[defaultLang];};


// Create a global Jed instance named 'i18n'
var i18n = new Jed({});

// We will set the locale-data lazily, as we need it
i18n.options.locale_data = {};

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
window.$_ = function (options, str) {
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
window.$i18nDoNotTranslate = function (options, str) {
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
                plural_forms: getPluralForm(lang) } };}




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
        [null].concat(message_info.messages);}


    // Get the options to substitute into the string
    options = options || {};
    options.num = options.num || num;

    // Then pass into i18n._ for the actual substitution
    return _(i18n.dngettext(lang, singular, plural, num), options);};


/*
    * Return the ngettext position that matches the given number and locale.
    *
    * Arguments:
    *  - num: The number upon which to toggle the plural forms.
    *  - lang: The language to use as the basis for the pluralization.
    */
var ngetpos = function (num, lang) {
    lang = lang || "en";

    // Generate a function which will give the position of the message
    // which matches the correct plural form of the string
    // TODO(csilvers): maybe roll this ourselves to save some bytes?
    return Jed.PF.compile(getPluralForm(lang))(num);};


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
var handlebars_underscore = function (options) {
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
var handlebars_do_not_translate = function (options) {
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
var handlebars_ngettext = function (num, lang, pos, options) {
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


})();
