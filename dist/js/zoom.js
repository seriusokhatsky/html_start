;(function($) {
	'use strict'

	var $el,
		options,
		image,
		originalSource,
		originalImage,
		zoominWindow,
		imageLoaded = false,
		oiriginalLoaded = false,
		xRatio,
		yRatio;

	var zoom = {
		init: function(  ) {
			image = $el.find('img');

			image.attr('src', image.data('src'));
			
			image.load(function( e ) { 
				imageLoaded = true;
				zoom.calculations();
			});

			image.on( 'mousemove', function( e ) {
				zoom.mousemove(e);
			} );
			image.on( 'mouseleave', function( e ) {
				zoom.mouseleave(e);
			} );

			originalSource = image.data('original');

			var originalHTML = [
				'<div class="zoom-image-original">',
					'<img src="' + originalSource + '" class="image-original" />',
				'</div>'
			].join('');

			image.addClass('zoom-image-small').wrap(function() {
				return '<div class="zoom-image-wrapper">' + $( this ).html(); + '</div>';
			});

			image.after( originalHTML );
			
			zoominWindow = $( '.zoom-image-original' );
			originalImage = $( '.zoom-image-original' ).find('img');

			originalImage.load(function( e ) {
				oiriginalLoaded = true;
				zoom.calculations();
			});
			
		},

		load: function( param ) {
			console.log( param  );
		},

		calculations: function() {
			if( ! imageLoaded || ! oiriginalLoaded) return;

			var smallSize = [ image.width(), image.height() ],
				originalSize = [ originalImage.width(), originalImage.height() ];

			xRatio = parseInt( originalImage.width() / image.width() );
			yRatio = parseInt( originalImage.height() / image.height() );
			console.log(xRatio, yRatio);

			zoominWindow.css({
				width:  smallSize[0],
				height: smallSize[1],
			});

			console.log( smallSize, originalSize );
			console.log('calculations');
		},

		mousemove: function( e ) {
			zoominWindow.addClass('visible');


			originalImage.css({
				top: - e.offsetY * xRatio,
				left: - e.offsetX * yRatio
			});
		},

		mouseleave: function( e ) {
			zoominWindow.removeClass('visible');
		}
	};	

	$.fn.zoomImage = function( params ) {

		$el = jQuery( this );

		// We call some API method of first param is a string
		if (typeof params === "string" ) {
			zoom[params].apply(zoom, Array.prototype.slice.call(arguments, 1) );
		} else {
			// clone options obj
			options = $.extend(true, {}, params);
			zoom.init();
		}

		return $el;
	};
}(jQuery));

jQuery( document ).ready(function() {
	$('.zoom-image').zoomImage();
});