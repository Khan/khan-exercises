requirejs.config({
    paths: {
        "jquery": "../local-only/jquery",
    }
});

requirejs([
    "jquery",
    "../local-only/underscore.js",
    "../local-only/kas.js",
    "../local-only/jed.js",
    "../local-only/localeplanet/icu." + getLang() + ".js",
    "../local-only/katex/katex.js"
], function($, _, KAS, jed, icu, katex) {
    window.katex = katex;

    // These scripts depend on jQuery, so we wait to load them
    requirejs([
        "../local-only/jquery-migrate-1.1.1.js",
        "../local-only/jquery-ui.js",
        "../local-only/jquery.qtip.js",
        "../local-only/i18n.js"
    ], function() {
        requirejs(["../khan-exercise.js"]);
    });
});

function getLang() {
    var match = /[?&]lang=([^&]+)/.exec(window.location.search);
    return match ? match[1] : "en-US";
}
