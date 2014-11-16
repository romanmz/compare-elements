/*!
 * relativePosition v1.0
 * http://github.com/romanmz/relativePosition
 * By Roman Martinez - http://romanmz.com
 */

;(function( $, window, document, undefined ) {
	
	
	$.fn.extend({
		fullOffset : function() {
			
			// Get element
			var isWindow = $.isWindow( this[0] );
			
			// Get data
			var data = {};
			data.top    = ( isWindow ) ? this.scrollTop()  : this.offset().top;
			data.left   = ( isWindow ) ? this.scrollLeft() : this.offset().left;
			data.height = ( isWindow ) ? this.height() : this.outerHeight();
			data.width  = ( isWindow ) ? this.width()  : this.outerWidth();
			data.middle = data.top  + ( data.height / 2 );
			data.center = data.left + ( data.width / 2 );
			data.bottom = data.top  + data.height;
			data.right  = data.left + data.width;
			
			// Return
			return data;
		},
		
		
		relativePosition : function( reference ) {
			
			// Set reference offset
			if( !reference ) {
				reference = $(window).fullOffset();
			} else if( !$.isPlainObject( reference ) ) {
				reference = $(reference).fullOffset();
			}
			
			// Init data
			var element = $(this).fullOffset();
			var data = {};
			
			// Calculate data
			data.top    = ( element.top - reference.top ) / element.height;
			data.middle = ( element.middle - reference.middle ) / element.height;
			data.bottom = ( element.bottom - reference.bottom ) / element.height;
			data.left   = ( element.left - reference.left ) / element.width;
			data.center = ( element.center - reference.center ) / element.width;
			data.right  = ( element.right - reference.right ) / element.width;
			
			// Get data
			if( data.top <= -1 )							data.vertical = -2;
			else if( data.bottom >= 1 )					data.vertical = 2;
			else if( data.top < 0 && data.bottom < 0 )	data.vertical = -1;
			else if( data.top > 0 && data.bottom > 0 )	data.vertical = 1;
			else										data.vertical = 0;
			
			if( data.width <= -1 )						data.horizontal = -2;
			else if( data.right >= 1 )					data.horizontal = 2;
			else if( data.left < 0 && data.right < 0 )	data.horizontal = -1;
			else if( data.left > 0 && data.right > 0 )	data.horizontal = 1;
			else										data.horizontal = 0;
			
			// Return data
			return data;
		},
		
		
		align : function( axisH, axisV, reference ) {
			
			// Set reference offset
			if( !reference ) {
				reference = $(window).fullOffset();
			} else if( !$.isPlainObject( reference ) ) {
				reference = $(reference).fullOffset();
			}
			
			// Loop objects
			return this.each(function(){
				var offset = {};
				
				if( axisH == 'top' ) {
					offset.top = reference.top;
				} else if( axisH == 'bottom' ) {
					offset.top = reference.bottom - $(this).outerHeight();
				} else if( axisH == 'center' ) {
					offset.top = reference.middle - ( $(this).outerHeight() / 2 );
				}
				
				if( axisV == 'left' ) {
					offset.left = reference.left;
				} else if( axisV == 'right' ) {
					offset.left = reference.right - $(this).outerWidth();
				} else if( axisV == 'center' ) {
					offset.left = reference.center - ( $(this).outerWidth() / 2 );
				}
				
				$(this).offset( offset );
			});
		}
	});
	
	
})( jQuery, window , document );
