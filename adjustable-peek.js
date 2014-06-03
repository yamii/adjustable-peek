/* global jQuery */

/**************************************************************
 *
 * Adjustable Peek for Items in a Container
 *
 **************************************************************/

( function ( $ ) {
	'use strict';


	var AdjustablePeek = function ( element, options ) {

		this.settings        = $.extend( {}, $.fn.adjustablePeek.defaults, options );
		this.element         = $( element );
		this.itemElem        = $( element ).find( '.' + this.settings.itemClass + ':first' );


		var nContainerWidth = this.element.width();
		var nItemWidth      = this.itemElem.outerWidth();
		var nPartialElem    = nContainerWidth % nItemWidth;
		var nActive         = Math.floor( nContainerWidth / nItemWidth );

		this.nPeek          = ( nPartialElem > 0 ) ?
										 (  ( nPartialElem / nItemWidth ) * 100 ) : 0;

		if( ! this.adjustIfBelowMinPeek( nPartialElem, nActive ) ) {
			nPartialElem = nItemWidth - nPartialElem;
			this.adjustIfAboveMaxPeek( nPartialElem, nActive );
		}

	};

	AdjustablePeek.prototype.adjustIfBelowMinPeek = function ( nPartialElem, nActive ) {

		var bPeek = false;

		if( this.nPeek < this.settings.minPeek ) {
			var properties = this.getCSSProps( this.getMargin( nPartialElem, nActive ) );
			this.element.find( '.' + this.settings.itemClass ).css( properties );
			bPeek =  true;
		}
		return bPeek;
	};

	AdjustablePeek.prototype.adjustIfAboveMaxPeek = function ( nPartialElem, nActive ) {

		var bPeek = false;
		if( this.nPeek > this.settings.maxPeek ) {
			var properties = this.getCSSProps( this.getMargin( nPartialElem, nActive ) );
			this.element.find( '.' + this.settings.itemClass ).css( properties );
			bPeek = true;
		}
		return bPeek;
	};

	AdjustablePeek.prototype.getMargin = function ( nPartialElem, nActiveBox ) {
		var nMargin  = Math.ceil( nPartialElem / ( nActiveBox * 2 ) );
		return ( nMargin ) ? nMargin : 0;
	};

	AdjustablePeek.prototype.getCSSProps = function ( nMargin ) {

		var properties = { 'margin' : '0 ' + nMargin + 'px' };
		var maxMargin  = this.settings.maxMargin;

		if( nMargin > maxMargin ) {
			var nExtraWid = nMargin - maxMargin;
			properties    = {	'margin' : '0 ' + maxMargin+ 'px',
												'width' : this.itemElem.outerWidth() + nExtraWid };
		}

		return properties;
	};

	$.fn.adjustablePeek = function ( options ) {

		return this.each( function ( key, value ) {
			var element        = $( this );
			var adjustablePeek = element.data( 'adjustablePeek' );

			if( !adjustablePeek ) {
				adjustablePeek = new AdjustablePeek( this, options );
				element.data( 'adjustablePeek', adjustablePeek );
			}

			return adjustablePeek;
		} );
	};

	$.fn.adjustablePeek.defaults = {
		itemClass : 'item',
		minPeek   : 30,
		maxPeek   : 70,
		maxMargin : 10,
	};

} )( jQuery );