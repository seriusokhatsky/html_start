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
			$('.zoom-image-wrapper').on( 'mousemove', function( e ) {
				zoom.mousemove(e);
			} );

			$('.zoom-image-wrapper').on( 'mouseleave', function( e ) {
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


			$el.find('.zoom-image-wrapper').after( originalHTML );
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
			//console.log( e.pageX - $('.zoom-image-wrapper').offset().left );

			var mouseLeft = e.pageX - $('.zoom-image-wrapper').offset().left,
				mouseTop = e.pageY - $('.zoom-image-wrapper').offset().top;

			zoominWindow.addClass('visible');
			var top 			= 'auto', 
				left 			= 'auto', 
				bottom 			= 'auto', 
				right 			= 'auto',
				lensetop 		= 'auto', 
				lenseleft 		= 'auto', 
				lensebottom 	= 'auto', 
				lenseright 		= 'auto';

			top  = - mouseTop * xRatio + smallSize[1] / 2;
			left = - mouseLeft * yRatio + smallSize[0] / 2;

			lensetop = mouseTop - lenseHeight/2;
			lenseleft = mouseLeft - lenseWidth/2;

			if( mouseTop < smallSize[1] / ( 2 * yRatio ) ) {
				top = 0;
				lensetop = 0;
			}
			if( mouseLeft < smallSize[0] / ( 2 * xRatio ) ) {
				left = 0;
				lenseleft = 0;
			}
			if( (smallSize[0] - mouseLeft) < smallSize[0] / ( 2 * xRatio ) ) {
				right = 0;
				left = 'auto';
				lenseright = 0;
				lenseleft = 'auto';
			}
			if( (smallSize[1] - mouseTop) < smallSize[1] / ( 2 * yRatio ) ) {
				bottom = 0;
				top = 'auto';
				lensebottom = 0;
				lensetop = 'auto';
			}

			originalImage.stop().animate({
				top: top,
				left: left,
				right: right,
				bottom: bottom
			}, 200, 'linear');

			lense.css({
				width: lenseWidth,
				height: lenseHeight,
				top: lensetop,
				left: lenseleft,
				right: lenseright,
				bottom: lensebottom,
			});
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