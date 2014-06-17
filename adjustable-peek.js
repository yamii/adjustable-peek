/* global jQuery */

/**************************************************************
 *
 * Adjustable Peek for Items in a Container
 *
 **************************************************************/

( function ( $ ) {
	'use strict';

	var MAX_PEEK = 50;
	var MIN_PEEK = 40;
	var MAX_RANGE = 100;
	var MIN_RANGE = 1;

	var AdjustablePeek = function ( element, options ) {

		this.settings      = $.extend( {}, $.fn.adjustablePeek.defaults, options );
		this.element       = element;
		this.itemElem      = $( this.element ).find( '.' + this.settings.itemClass + ':first' );
		this.itemElemWidth = this.itemElem.outerWidth();

		this.initPeekSettings();
		this.start();

		this.handleResize();
	};

	AdjustablePeek.prototype.start = function () {

		this.clearInlineStyles();

		var eContainer       = $( this.element ).closest( '#' + this.settings.containerId );

		if( this.settings.containerId === '' ) {
			eContainer = $( this.element );
		}

		var nContainerWidth = eContainer.outerWidth();

		//get reference again
		this.itemElem       = $( this.element ).find( '.' + this.settings.itemClass + ':first' );
		var nItemWidth      = this.itemElem.outerWidth();

		var nPartialElem    = ( ( nContainerWidth  / nItemWidth ) % 1 )  +
													( nContainerWidth % nItemWidth );

		var nActive         = Math.floor( nContainerWidth / nItemWidth );

		this.nPeek          = ( nPartialElem > 0 ) ?
													(  ( nPartialElem / nItemWidth ) * 100 ) : 0;

		if( ! this.adjustIfBelowMinPeek( nPartialElem, nActive ) ) {

			var nPartialPeek = this.nPeek - this.settings.maxPeek;
			nPartialElem = nItemWidth * ( nPartialPeek / 100 );
			this.adjustIfAboveMaxPeek( nPartialElem, nActive );

		}
		this.settings.afterAdjust();
	};

	AdjustablePeek.prototype.clearInlineStyles = function() {

		var defaultProperty = {
			'width' : '',
			'margin' : ''
		};

		$( this.element ).find( '.' + this.settings.itemClass ).css( defaultProperty );
	};

	AdjustablePeek.prototype.handleResize = function () {

		if( this.settings.handleResize ) {
			$( window ).resize( function () {
				this.start();
			}.bind( this ) );
		}
	};

	AdjustablePeek.prototype.initPeekSettings = function ( ) {
		var minPeek = this.settings.minPeek;
		var maxPeek = this.settings.maxPeek;

		if( ( minPeek > MAX_RANGE ) && ( minPeek < MIN_RANGE ) ) {
			this.settings.minPeek = MIN_PEEK;
		}

		if( ( maxPeek > MAX_RANGE ) && ( maxPeek < MAX_RANGE ) ) {
			this.settings.maxPeek = MAX_PEEK;
		}

		if( ( minPeek === maxPeek) ||
				( minPeek > maxPeek ) ||
				( maxPeek < minPeek ) ) {

			this.settings.minPeek = MIN_PEEK;
			this.settings.maxPeek = MAX_PEEK;

		}
	};

	AdjustablePeek.prototype.adjustIfBelowMinPeek = function ( nPartialElem, nActive ) {

		var bPeek = false;

		if( ( this.nPeek > 0 ) && this.nPeek < this.settings.minPeek ) {
			var properties = this.getCSSProps( this.getMargin( nPartialElem, nActive ) );
			$( this.element ).find( '.' + this.settings.itemClass ).css( properties );
			bPeek =  true;
		}
		return bPeek;
	};

	AdjustablePeek.prototype.adjustIfAboveMaxPeek = function ( nPartialElem, nActive ) {

		var bPeek = false;
		if( (this.nPeek > 0 ) && this.nPeek > this.settings.maxPeek ) {
			var properties = this.getCSSProps( this.getMargin( nPartialElem, nActive ) );
			$( this.element ).find( '.' + this.settings.itemClass ).css( properties );
			bPeek = true;
		}
		return bPeek;
	};

	AdjustablePeek.prototype.getMargin = function ( nPartialElem, nActiveBox ) {
		var nMargin  = nPartialElem / ( nActiveBox * 2 );
		return ( nMargin ) ? nMargin : 0;
	};

	AdjustablePeek.prototype.getCSSProps = function ( nMargin ) {

		var properties = { 'margin' : '0 ' + nMargin + 'px' };
		var maxMargin  = this.settings.maxMargin;

		if( nMargin > maxMargin ) {
			var nExtraWid = nMargin - maxMargin;
			properties    = {	'margin' : '0 ' + maxMargin+ 'px',
												'width' : this.itemElem.outerWidth() + ( nExtraWid * 2 ) + 'px' };
		}
		return properties;
	};

	$.fn.adjustablePeek = function ( options ) {

		return this.each( function ( key, value ) {
			var element = $( this );
			//return early
			if( element.data( 'adjustablePeek' ) ) {
				return element.data( 'adjustablePeek' );
			}

			var adjustablePeek = new AdjustablePeek( this, options );
			element.data( 'adjustablePeek', adjustablePeek );
		} );
	};

	$.fn.adjustablePeek.defaults = {
		//must be an ancestor or this element itself
		containerId  : '',
		itemClass    : 'item',
		minPeek      : MIN_PEEK,
		maxPeek      : MAX_PEEK,
		maxMargin    : 10,
		handleResize : true,
		afterAdjust  : function() {}
	};

} )( jQuery );