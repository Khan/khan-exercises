jQuery.extend( Khan, { relatedVideos: {
	videos: [],

	setVideos: function(videos) {
		this.videos = videos || [];
		this.render();
	},

	showThumbnail: function( index ) {
		jQuery( "#related-video-list .related-video-list li" ).each(function(i, el) {
			if ( i === index ) {
				jQuery( el )
					.find( 'a.related-video-inline' ).hide().end()
					.find( '.thumbnail' ).show();
			}
			else {
				jQuery( el )
					.find( 'a.related-video-inline' ).show().end()
					.find( '.thumbnail' ).hide();
			}
		});
	},

	// make a link to a related video, appending exercise ID.
	makeHref: function(video, data) {
		var exid = '';
		data = data || userExercise;
		if ( data ) {
			exid = "?exid=" + data.exercise_model.name;
		}
		return video.relative_url + exid;
	},

	anchorElement: function( video, needComma ) {
		var template = Templates.get("video.related-video-link");
		return jQuery(template({
			href: this.makeHref(video),
			video: video,
			separator: needComma
		})).data('video', video);
	},

	renderInHeader: function() {
		var container = jQuery(".related-content");
		var jel = container.find(".related-video-list");
		jel.empty();

		_.each(this.videos, function(video, i) {
			this.anchorElement(video, i < this.videos.length - 1)
				.wrap("<li>").parent().appendTo(jel);
		}, this);

		container.toggle(this.videos.length > 0);
	},

	renderInSidebar: function() {
		var container = jQuery(".related-video-box");
		var jel = container.find(".related-video-list");
		jel.empty();

		var template = Templates.get('video.thumbnail');
		_.each(this.videos, function(video, i) {
			var thumbnailDiv = jQuery(template({
				href: this.makeHref(video),
				video: video
			})).find('a.related-video').data('video', video).end();

			var inlineLink = this.anchorElement(video)
				.addClass("related-video-inline");

			var sideBarLi = jQuery( "<li>" )
				.append( inlineLink )
				.append( thumbnailDiv );

			if ( i > 0 ) {
				thumbnailDiv.hide();
			} else {
				inlineLink.hide();
			}
			jel.append( sideBarLi );
		}, this);

		container.toggle(this.videos.length > 0);
	},

	hookup: function() {
		// make caption slide up over the thumbnail on hover
		var captionHeight = 45;
		var marginTop = 23;
		// queue:false to make sure these run simultaneously
		var options = {duration: 150, queue: false};
		jQuery(".related-video-box")
			.delegate(".thumbnail", "mouseenter mouseleave", function(e) {
				var el = $(e.currentTarget);
				if (e.type == "mouseenter") {
					el.	find( ".thumbnail_label" ).animate(
							{ marginTop: marginTop },
							options)
						.end()
						.find( ".thumbnail_teaser" ).animate(
							{ height: captionHeight },
							options)
						.end();
				} else {
					el .find( ".thumbnail_label" ).animate(
							{ marginTop: marginTop + captionHeight },
							options)
						.end()
						.find( ".thumbnail_teaser" ).animate(
							{ height: 0 },
							options)
						.end();
				}
			});
	},

	render: function() {
		// don't try to render if templates aren't present (dev mode)
		if (!window.Templates) return;

		this.renderInSidebar();
		// Review queue overlaps with the content here
		if ( !Khan.reviewMode ) {
			this.renderInHeader();
		}
	}
}})