;(function($) {
	'use strict'

	var $el,
		options,
		imageSource,
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

			imageSource = image.data('src');

			image.attr('src', imageSource);
			
			image.load(function( e ) { 
				imageLoaded = true;
				zoom.calculations();
			});

			originalSource = image.data('original');

			zoom.prepareMarkup();

			lense = $el.find( '.zoom-lense' );
			
			zoominWindow = $el.find( '.zoom-image-original' );
			originalImage = $el.find( '.zoom-image-original' ).find('img');

			originalImage.load(function( e ) {
				oiriginalLoaded = true;
				zoom.calculations();
			});

			zoom.events();
		},

		events: function() {
			image.on( 'mousemove', function( e ) {
				zoom.mousemove(e);
			} );

			image.on( 'mouseleave', function( e ) {
				zoom.mouseleave(e);
			} );
		},

		prepareMarkup: function() {

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
			}
			if( e.offsetX < smallSize[0] / ( 2 * xRatio ) ) {
				left = 0;
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
		},

		load: function( small, original) {

			imageSource = small;
			image.attr('src', imageSource);
			
			image.load(function( e ) { 
				imageLoaded = true;
				zoom.calculations();
			});

			originalSource = original;

			originalImage.attr('src', originalSource);

			originalImage.load(function( e ) {
				oiriginalLoaded = true;
				zoom.calculations();
			});
		}
	};	

	$.fn.zoomImage = function( params ) {

		$el = jQuery( this );

		// We call some API method of first param is a string
		if (typeof params === "string" ) {
			zoom[params].apply(zoom, Array.prototype.slice.call(arguments, 1), Array.prototype.slice.call(arguments, 2) );
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

	$('.zoom-thumbnail').on('click', function() {
		$('.zoom-image').zoomImage( 'load', $(this).data('small'), $(this).data('original') );
	});
});