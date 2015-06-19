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
		smallSize,
		originalSize,
		lense,
		lenseWidth,
		lenseHeight,
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

			originalSource = image.data('original');

			var originalHTML = [
				'<div class="zoom-image-original">',
					'<img src="' + originalSource + '" class="image-original" />',
				'</div>'
			].join('');

			var lenseHTMl = [ '<div class="zoom-lense">', 
				'</div>',
			].join('');

			image.addClass('zoom-image-small').wrap(function() {
				return '<div class="zoom-image-wrapper">' + $( this ).html(); + '</div>';
			});

			image.after( originalHTML );
			image.after( lenseHTMl );

			lense = $( '.zoom-lense' );
			
			zoominWindow = $( '.zoom-image-original' );
			originalImage = $( '.zoom-image-original' ).find('img');

			originalImage.load(function( e ) {
				oiriginalLoaded = true;
				zoom.calculations();
			});
			

			$('.zoom-image-wrapper').on( 'mousemove', function( e ) {
				zoom.mousemove(e);
			} );
			$('.zoom-image-wrapper').on( 'mouseleave', function( e ) {
				zoom.mouseleave(e);
			} );
		},

		load: function( param ) {
			console.log( param  );
		},

		calculations: function() {
			if( ! imageLoaded || ! oiriginalLoaded) return;

			smallSize = [ image.width(), image.height() ];
			originalSize = [ originalImage.width(), originalImage.height() ];

			xRatio = parseInt( originalImage.width() / image.width() );
			yRatio = parseInt( originalImage.height() / image.height() );

			lenseWidth  = smallSize[0] / xRatio;
			lenseHeight = smallSize[1] / yRatio;

			zoominWindow.css({
				width:  smallSize[0],
				height: smallSize[1],
			});

			console.log( smallSize, originalSize );
			console.log('calculations');
		},

		mousemove: function( e ) {
			zoominWindow.addClass('visible');
			var top 	= 'auto', 
				left 	= 'auto', 
				bottom 	= 'auto', 
				right 	= 'auto';

			top  = - e.offsetY * xRatio + smallSize[1] / 2;
			left = - e.offsetX * yRatio + smallSize[0] / 2;

			if( e.offsetY < smallSize[1] / ( 2 * yRatio ) ) {
				top = 0;
				bottom = 'auto';
			}
			if( e.offsetX < smallSize[0] / ( 2 * xRatio ) ) {
				left = 0;
				right = 'auto';
			}
			if( (smallSize[0] - e.offsetX) < smallSize[0] / ( 2 * xRatio ) ) {
				right = 0;
				left = 'auto';
			}
			if( (smallSize[1] - e.offsetY) < smallSize[1] / ( 2 * yRatio ) ) {
				bottom = 0;
				top = 'auto';
			}

			originalImage.stop().animate({
				top: top,
				left: left,
				right: right,
				bottom: bottom
			}, 200, 'linear');

			/*lense.css({
				width: lenseWidth,
				height: lenseHeight,
				top: e.offsetY - lenseHeight/2,
				left: e.offsetX - lenseWidth/2
			})*/
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