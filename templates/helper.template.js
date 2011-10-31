//---------------------------------------------------------------------------
// helper.template.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala.
//---------------------------------------------------------------------------


( function () {

//---------------------------------------------------------------------------
// Module Helper
//---------------------------------------------------------------------------
/**
 * Helper module is accessible within view templates.
 * You can modify or add your helping functions here.
 */
var Helper = Module.extend( {

	/**
	 * This function simply replaces line breaks to <br> tags.
	 */
	br: ( function ( content ) {
		return content && content.replace( /\n/g, '<br/>' ) || '';
	} ),


	/**
	 * Sometimes you may want a host part of the url,
	 * and this function does so.
	 *
	 * ex.
	 *     Helper.extractHostname( 'http://www.example.com/shopping/cart/?no=3' ) => 'www.example.com'
	 */
	extractHostname: ( function ( url ) {
		var matched = url.match( /https?:\/\/([-_.a-zA-Z0-9]+)(\/|$)/ );
		return ( matched ? matched[1] : '' );
	} ),


	/**
	 * Passing list of string and this function returns class="" attribute.
	 *
	 * ex.
	 *     Helper.getClassAttr( 'lemon' )                              => class="lemon"
	 *     Helper.getClassAttr( [ 'apple', 'grape' ] )                 => class="apple grape"
	 *     Helper.getClassAttr( 'orange', [ 'strawberry', 'banana' ] ) => class="orange strawberry banana"
	 */
	getClassAttr: ( function () {
		var classList = [];
		for ( var i = 0; i < arguments.length; i++ ) {
			var param = arguments[ i ];
			if ( param instanceof Array ) {
				classList = classList.concat( param );
			} else if ( param ) {
				classList.push( param );
			}
		}
		
		if ( classList.length ) {
			return ' class="' + classList.join( ' ' ) + '"';
		} else {
			return '';
		}
	} ),


	/**
	 * Generating data attribute.
	 * The data is encoded with Util.stringify() and you can decode it with Util.parse().
	 * The other way to get data is to call Element.getData()
	 */
	getDataAttr: ( function ( data ) {
		if ( data ) {
			return ' data="' + Util.stringify( data ) + '"';
		}
		return '';
	} ),


	/**
	 * Generate href attribute with target attribute if needed.
	 */
	getHrefAttr: ( function ( url ) {
		if ( !url ) {
			return '';
		} else if ( /^[a-z]+:\/\//i.test( url ) ) {
			var target = ( 0 == url.indexOf( location.protocol + '//' + location.host ) ) ? '_parent' : '_blank';
			return ' href="' + url + '" target="' + target + '"';
		} else {
			return ' href="' + url + '"';
		}
	} )

} ).static();


//---------------------------------------------------------------------------
// Export
//---------------------------------------------------------------------------
return Helper;


//---------------------------------------------------------------------------
// End
//---------------------------------------------------------------------------

} )();
