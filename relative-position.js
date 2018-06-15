// (function(){
// 	'use strict';
	
	
	function isWindow( element ) {
		return typeof element == 'object' && element.constructor.name == 'Window';
	}
	function DOMAbsoluteRect( element ) {
		this.element = element;
		this.updateData();
	}
	DOMAbsoluteRect.prototype.updateData = function() {
		var element = this.element;
		if( isWindow( element ) ) {
			this.top    = element.pageYOffset;
			this.left   = element.pageXOffset;
			this.height = element.innerHeight;
			this.width  = element.innerWidth;
			this.bottom = this.top + this.height;
			this.right  = this.left + this.width;
		} else {
			box = element.getBoundingClientRect();
			this.top    = box.top + window.pageYOffset;
			this.left   = box.left + window.pageXOffset;
			this.height = box.height;
			this.width  = box.width;
			this.bottom = box.bottom + window.pageYOffset;
			this.right  = box.right + window.pageXOffset;
		}
	}
	DOMAbsoluteRect.prototype.getRelativeX = function( ratio ) {
		return {
			x: this.left + (this.width * ratio),
			y: this.top + (this.height * ratio),
		};
	}
	DOMAbsoluteRect.prototype.on = function( eventName, callback ) {
		this.element.addEventListener( eventName, callback );
		return this;
	}
	DOMAbsoluteRect.prototype.trigger = function( eventName ) {
		var event = new Event( eventName );
		this.element.dispatchEvent( event );
		return this;
	}
	DOMAbsoluteRect.prototype.relativeTo = function( anotherElement, offsetY ) {
		
		// Set reference offset
		var another = new DOMAbsoluteRect( anotherElement );
		var data = {};
		
		// apply offset
		if( typeof offsetY === 'undefined' ) {
			offsetY = 0;
		}
		
		// Calculate data
		data.top    = ( this.top    - offsetY - another.top ) / another.height;
		data.bottom = ( this.bottom - offsetY - another.bottom ) / another.height;
		data.left   = ( this.left   - another.left ) / another.width;
		data.right  = ( this.right  - another.right ) / another.width;
		
		// Get data
		if( data.bottom <= -1 )						data.vertical = -2;
		else if( data.top >= 1 )					data.vertical = 2;
		else if( data.top < 0 && data.bottom < 0 )	data.vertical = -1;
		else if( data.top > 0 && data.bottom > 0 )	data.vertical = 1;
		else										data.vertical = 0;
		
		if( data.right <= -1 )						data.horizontal = -2;
		else if( data.left >= 1 )					data.horizontal = 2;
		else if( data.left < 0 && data.right < 0 )	data.horizontal = -1;
		else if( data.left > 0 && data.right > 0 )	data.horizontal = 1;
		else										data.horizontal = 0;
		
		// Return data
		return data;
	}
	DOMAbsoluteRect.prototype.css = function( property, value ) {
		if( arguments.length > 1 ) {
			this.element.style[ property ] = value;
		} else {
			var styles = window.getComputedStyle( this.element );
			return styles[ property ];
		}
	}
	DOMAbsoluteRect.prototype.setTop = function( newValue ) {
		var difference = newValue - this.top;
		if( this.css('position') == 'static' ) {
			this.css('position', 'relative');
		} else {
			difference += parseInt( this.css( 'top' ) );
		}
		this.css( 'top', difference+'px' );
	}
	DOMAbsoluteRect.prototype.setLeft = function( newValue ) {
		var difference = newValue - this.left;
		if( this.css('position') == 'static' ) {
			this.css('position', 'relative');
		} else {
			difference += parseInt( this.css( 'left' ) );
		}
		this.css( 'left', difference+'px' );
	}
	DOMAbsoluteRect.prototype.alignTo = function( axisH, axisV, anotherElement ) {
		
		// Set reference offset
		var another = new DOMAbsoluteRect( anotherElement );
		
		// Loop objects
		var offset = {};
		
		if( axisH == 'top' ) {
			offset.top = another.top;
		} else if( axisH == 'bottom' ) {
			offset.top = another.bottom - this.height;
		} else if( axisH == 'center' ) {
			offset.top = another.getRelativeX( 0.5 ).y - ( this.height / 2 );
		}
		
		if( axisV == 'left' ) {
			offset.left = another.left;
		} else if( axisV == 'right' ) {
			offset.left = another.right - this.width;
		} else if( axisV == 'center' ) {
			offset.left = another.getRelativeX( 0.5 ).x - ( this.width / 2 );
		}
		
		//
		if( offset.top !== undefined ) {
			this.setTop( offset.top );
		}
		if( offset.left !== undefined ) {
			this.setLeft( offset.left );
		}
		
		//
		return this;
	}
	DOMAbsoluteRect.prototype.onscreen = function( offset ) {
		if( isWindow( this.element ) ) {
			return this;
		}
		if( typeof offset === 'undefined' ) {
			offset = 0;
		}
		var _this = this;
		function onWindowResize( e ) {
			_this.updateData();
			var relPos = _this.relativeTo( window, offset );
			if( relPos.vertical < 2 ) {
				_this.trigger( 'onscreen' );
			} else {
				_this.trigger( 'offscreen' );
			}
		}
		window.addEventListener('scroll', onWindowResize);
		window.addEventListener('resize', onWindowResize);
		onWindowResize();
		
		//
		return this;
	}

// })();
