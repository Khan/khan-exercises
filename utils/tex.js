(function() {

$.fn.tex = function() {
    var pendingTypeset = 0;

    this.filter("code").add(this.find("code")).each(function() {
        var $this = $(this);

        if (!$this.data("tmplCodeProcessed")) {
            $this.data("tmplCodeProcessed", true);

            var $script = $this.find("script[type='math/tex']");

            if ($script.length) {
                // Curious, curious. Getting to this point probably means that we
                // cloned some elements and lost the jQuery data as well as the
                // script.MathJax property in the process. Let's just reset the
                // text (and in doing so, remove all the MathJax stuff (both the
                // script and the adjacent span)) so we can start from scratch with
                // the templating process.  Use html(), not text() because IE10 in
                // IE8 mode returns "" for the innerText of a script element.
                $this.text($script.html());
            }

            // Maintain the classes from the original element
            if (this.className) {
                $this.wrap("<span class='" + this.className + "'></span>");
            }

            // Clean up any strange mathematical expressions
            var text = $this.text();
            if (KhanUtil.cleanMath) {
                text = KhanUtil.cleanMath(text);
            }

            // Tell MathJax that this is math to be typset
            $this.empty();
            $this.append("<script type='math/tex'>" +
                    text.replace(/<\//g, "< /") + "</script>");
        }

        pendingTypeset++;
    });

    if (pendingTypeset) {
        // Stick the processing request onto the queue
        if (typeof MathJax !== "undefined") {
            KhanUtil.debugLog("adding elem with " + pendingTypeset +
                    " items to MathJax typeset queue");
            this.each(function() {
                MathJax.Hub.Queue(["Process", MathJax.Hub, this]);
            });
            MathJax.Hub.Queue(function() {
                KhanUtil.debugLog("MathJax done typesetting (" + pendingTypeset +
                        ")");
            });
        } else {
            KhanUtil.debugLog("not adding elem with " + pendingTypeset +
                    " items to queue because MathJax is undefined");
        }
    }
};

$.fn.texCleanup = function() {
    // This gets called before each problem. In some cases, before the first
    // problem, MathJax isn't loaded yet. No worries--there's nothing to clean
    // up anyway
    if (typeof MathJax === "undefined") {
        KhanUtil.debugLog("MathJax undefined in Cleanup");
        return;
    }

    this.find("code").each(function() {
        KhanUtil.debugLog("cleaning up: " + $(this).text());
        var jax = MathJax.Hub.getJaxFor(this);
        KhanUtil.debugLog("got jax of type " + $.type(jax));
        if (jax) {
            var e = jax.SourceElement();
            KhanUtil.debugLog("source element is type " + $.type(e));
            if ("outerHTML" in e) {
                KhanUtil.debugLog("source element " + e.outerHTML);
            } else {
                KhanUtil.debugLog("no source element");
            }

            if (e.previousSibling && e.previousSibling.className) {
                jax.Remove();
            } else {
                // MathJax chokes if e.previousSibling is a text node, which it
                // is if tmplCleanup is called before MathJax's typesetting
                // finishes
                KhanUtil.debugLog("previousSibling isn't an element");
            }

            KhanUtil.debugLog("removed!");
        }
    });
};


})();
