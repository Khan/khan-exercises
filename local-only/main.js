requirejs.config({
    paths: {
        "jquery": "../local-only/jquery",
    }
});

requirejs([
    "jquery",
    "../local-only/katex/katex.js",
    "../local-only/underscore.js",
    "../local-only/localeplanet/icu." + getLang() + ".js",
    "../local-only/moment.js"
], function($, katex) {
    // Only 'jquery' and 'katex' have amd wrappers (and jQuery sets the global
    // regardless); the other files export globally directly and we don't use
    // their return values
    window.katex = katex;

    // These scripts depend on jQuery or underscore, so we wait to load them
    requirejs([
        "../exercises-stub.js",
        "../local-only/jquery-migrate-1.1.1.js",
        "../local-only/jquery-ui.js",
        "../local-only/jquery.qtip.js",
        "../local-only/kas.js",
        "../local-only/i18n.js"
    ], function() {
        requirejs([
            "../history.js",
            "../interface.js",
        ], function() {
            requirejs(["../khan-exercise.js"], function() {
                Khan.loadLocalModeSiteWhenReady();
            });
        });
    });
});

function getLang() {
    var match = /[?&]lang=([^&]+)/.exec(window.location.search);
    return match ? match[1] : "en-US";
}
