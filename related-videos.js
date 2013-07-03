Exercises.RelatedVideos = {
    anchorElement: function(video) {
        var template = Templates.get("video.related-video-link");
        return $(template({
            href: video.relativeUrl,
            video: video
        })).data("video", video);
    },

    render: function(videos) {
        if (videos == null) {
            videos = [];
        }

        var container = $(".related-video-box");
        var jel = container.find(".related-video-list");
        jel.empty();

        var self = this;
        PackageManager.require("video.css", "video.js").then(function() {
            var template = Templates.get("video.thumbnail");
            _.each(videos, function(video, i) {
                var thumbnailDiv = $(template({
                    href: video.relativeUrl,
                    video: video
                }));
                thumbnailDiv.find("a.related-video")
                    .data("video", video)
                    .end();

                var inlineLink = self.anchorElement(video)
                    .addClass("related-video-inline");

                $("<li>")
                    .append(inlineLink)
                    .append(thumbnailDiv)
                    .appendTo(jel);

                // TODO(alpert): Why create both of these elements to then
                // only show one?
                if (i > 0) {
                    thumbnailDiv.hide();
                } else {
                    inlineLink.hide();
                }
            });

            container.toggle(videos.length > 0);
            self._bindEvents();
        });
    },

    /**
     * Called to initialize related video event handlers.
     * Should only be called after video.js package is loaded.
     */
    _bindEvents: _.once(function() {
        // make caption slide up over the thumbnail on hover
        var captionHeight = 45;
        var marginTop = 23;
        // queue:false to make sure these run simultaneously
        var options = {duration: 150, queue: false};
        $(".related-video-box")
            .delegate(".thumbnail", "mouseenter mouseleave", function(e) {
                var isMouseEnter = e.type === "mouseenter";
                $(e.currentTarget).find(".thumbnail_label").animate(
                        {marginTop: marginTop + (isMouseEnter ? 0 : captionHeight)},
                        options)
                    .end()
                    .find(".thumbnail_teaser").animate(
                        {height: (isMouseEnter ? captionHeight : 0)},
                        options);
            });

        ModalVideo.hookup();
    })
};


