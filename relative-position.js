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
	
	
	// ==================================================
	// WINDOW OFFSET
	// ==================================================
	class WindowOffset extends ElementOffset {
		
		
		// Disable CSS helpers
		// ------------------------------
		css( property, value ) {}
		setOffset( property, newValue ) {}
		
		
		// Update offset getters
		// ------------------------------
		get top() {
			return this.element.pageYOffset;
		}
		get bottom() {
			return this.element.pageYOffset + this.element.innerHeight;
		}
		get left() {
			return this.element.pageXOffset;
		}
		get right() {
			return this.element.pageXOffset + this.element.innerWidth;
		}
		get height() {
			return this.element.innerHeight;
		}
		get width() {
			return this.element.innerWidth;
		}
	}
	
	
	// ==================================================
	// ELEMENTS COMPARISON
	// ==================================================
	class ElementsCompare {
		
		
		// Constructor
		// ------------------------------
		constructor( element, reference ) {
			this.element = ElementOffset.create( element );
			this.reference = ElementOffset.create( reference );
		}
		
		
		// Normalized position (float from 0 to 1)
		// ------------------------------
		normalizedPositionY( element=[0,1], reference=[0,1] ) {
			let pointZero = this.reference.offsetY( reference[0] ) - ( this.element.height * element[0] );
			let pointOne  = this.reference.offsetY( reference[1] ) - ( this.element.height * element[1] );
			let range = pointOne - pointZero;
			let currentPosition = this.element.top - pointZero;
			return range ? currentPosition / range : 0;
		}
		normalizedPositionX( element=[0,1], reference=[0,1] ) {
			let pointZero = this.reference.offsetX( reference[0] ) - ( this.element.width * element[0] );
			let pointOne  = this.reference.offsetX( reference[1] ) - ( this.element.width * element[1] );
			let range = pointOne - pointZero;
			let currentPosition = this.element.top - pointZero;
			return range ? currentPosition / range : 0;
		}
		
		
		// Relative position (integer from -2 to +2)
		// ------------------------------
		get relativePositionY() {
			if( this.element.bottom <= this.reference.top ) {
				return -2;
			} else if( this.element.bottom < this.reference.bottom && this.element.top < this.reference.top ) {
				return -1;
			} else if( this.element.top >= this.reference.bottom ) {
				return +2;
			} else if( this.element.top > this.reference.top && this.element.bottom > this.reference.bottom ) {
				return +1;
			} else {
				return 0;
			}
		}
		get relativePositionX() {
			if( this.element.right <= this.reference.left ) {
				return -2;
			} else if( this.element.right < this.reference.right && this.element.left < this.reference.left ) {
				return -1;
			} else if( this.element.left >= this.reference.right ) {
				return +2;
			} else if( this.element.left > this.reference.top && this.element.right > this.reference.right ) {
				return +1;
			} else {
				return 0;
			}
		}
		
		
		// Relative position shortcuts
		// ------------------------------
		get isAbove() { return this.relativePositionY == -2 }
		get isCrossingAbove() { return this.relativePositionY == -1 }
		get isInsideY() { return this.relativePositionY == 0 }
		get isCrossingBelow() { return this.relativePositionY == +1 }
		get isBelow() { return this.relativePositionY == +2 }
		
		get isBefore() { return this.relativePositionX == -2 }
		get isCrossingBefore() { return this.relativePositionX == -1 }
		get isInsideX() { return this.relativePositionX == 0 }
		get isCrossingAfter() { return this.relativePositionX == +1 }
		get isAfter() { return this.relativePositionX == +2 }
		
		
		// Relative size
		// ------------------------------
		get normalizedHeight() { return this.element.height / this.reference.height }
		get isShorter() { return this.normalizedHeight < 1 }
		get isTaller() { return this.normalizedHeight > 1 }
		get isSameHeight() { return this.normalizedHeight == 1 }
		
		get normalizedWidth() { return this.element.width / this.reference.width }
		get isNarrower() { return this.normalizedWidth < 1 }
		get isWider() { return this.normalizedWidth > 1 }
		get isSameWidth() { return this.normalizedWidth == 1 }
		
		
		// Alignment
		// ------------------------------
		get isAlignedY() {
			return this.element.top == this.reference.top ||
				   this.element.top == this.reference.bottom ||
				   this.element.bottom == this.reference.top ||
				   this.element.bottom == this.reference.bottom;
		}
		get isAlignedX() {
			return this.element.left == this.reference.left ||
				   this.element.left == this.reference.right ||
				   this.element.right == this.reference.left ||
				   this.element.right == this.reference.right;
		}
		
		
		// Overlap
		// ------------------------------
		get isTouchingY() {
			return this.element.bottom >= this.reference.top && this.element.top <= this.reference.bottom;
		}
		get isTouchingX() {
			return this.element.right >= this.reference.left && this.element.left <= this.reference.right;
		}
		get isOverlappingY() {
			return this.element.bottom > this.reference.top && this.element.top < this.reference.bottom;
		}
		get isOverlappingX() {
			return this.element.right > this.reference.left && this.element.left < this.reference.right;
		}
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
