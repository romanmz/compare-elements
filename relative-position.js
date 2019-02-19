(function(){
	'use strict';
	
	
	// ==================================================
	// ELEMENT OFFSET
	// ==================================================
	class ElementOffset {
		
		
		// Constructors
		// ------------------------------
		static create( element ) {
			return element.getBoundingClientRect ? new ElementOffset( element ) : new WindowOffset( element );
		}
		constructor( element ) {
			this.element = element;
		}
		
		
		// CSS helpers
		// ------------------------------
		css( property, value ) {
			if( arguments.length > 1 ) {
				this.element.style[ property ] = value;
			} else {
				let styles = window.getComputedStyle( this.element );
				return styles[ property ];
			}
		}
		setOffset( property, newValue ) {
			let difference = newValue - this[ property ];
			if( this.css( 'position' ) == 'static' ) {
				this.css( 'position', 'relative' );
			} else {
				difference += parseInt( this.css( property ) );
			}
			this.css( property, difference+'px' );
		}
		
		
		// Getting the current offset
		// ------------------------------
		get top() {
			return this.element.getBoundingClientRect().top + window.pageYOffset;
		}
		get bottom() {
			return this.element.getBoundingClientRect().bottom + window.pageYOffset;
		}
		get left() {
			return this.element.getBoundingClientRect().left + window.pageXOffset;
		}
		get right() {
			return this.element.getBoundingClientRect().right + window.pageXOffset;
		}
		get height() {
			return this.element.getBoundingClientRect().height;
		}
		get width() {
			return this.element.getBoundingClientRect().width;
		}
		get centerY() {
			return this.offsetY( 0.5 );
		}
		get centerX() {
			return this.offsetX( 0.5 );
		}
		offsetY( ratio=0 ) {
			return this.top + (this.height * ratio);
		}
		offsetX( ratio=0 ) {
			return this.left + (this.width * ratio);
		}
		
		
		// Setting a new offset
		// ------------------------------
		set top( newValue ) {
			this.setOffset( 'top', newValue );
		}
		set bottom( newValue ) {
			this.setOffset( 'top', newValue - this.height );
		}
		set left( newValue ) {
			this.setOffset( 'left', newValue );
		}
		set right( newValue ) {
			this.setOffset( 'left', newValue - this.width );
		}
		set centerY( newValue ) {
			this.setOffset( 'top', newValue - (this.height * 0.5) );
		}
		set centerX( newValue ) {
			this.setOffset( 'left', newValue - (this.width * 0.5) );
		}
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

	
	
})();
