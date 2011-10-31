//---------------------------------------------------------------------------
// blockapp.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala.
//---------------------------------------------------------------------------


( function () {

//---------------------------------------------------------------------------
// Check Application definition
//---------------------------------------------------------------------------
if ( typeof Application == 'undefined' || typeof Application.config != 'object' || typeof Application.requiredModules != 'object' || !Application.appName ) {
	throw new Error( 'Application is not properly defined! BlockAppJS cannot started.' );
}


//---------------------------------------------------------------------------
// Module
//---------------------------------------------------------------------------
var Module = {
	extend: ( function ( parent ) {
		if ( this.parent instanceof Array ) {
			this.parent.push( parent );
			return this;
		}
		var ret = {
			parent: [ parent ]
		};
		for ( var key in Module ) {
			ret[ key ] = Module[ key ];
		}
		return ret;
	} ),

	static: ( function ( initFunc ) {
		var klass = Module.class.call( this, initFunc );
		return new klass;
	} ),

	class: ( function ( initFunc ) {
		if ( typeof initFunc != 'function' ) {
			initFunc = ( function () {} );
		}
		if ( !this.parent) {
			return initFunc;
		}
		
		var parents = this.parent;
		var klass = ( function () {
			var args = Array.prototype.slice.call( arguments );
			for ( var i in parents )  {
				if ( typeof parents[ i ] == 'function' ) {
					parents[ i ].apply( this, args );
				}
			}
			for ( var key in this ) {
				if ( typeof this[ key ] == 'function' ) {
					this.super[ key ] = Util.bind( this[ key ], this );
				}
			}
			initFunc.apply( this, args );
		} );
		
		var _super = {};
		for ( var i in parents ) {
			var props = parents[ i ].prototype || parents[ i ] || {};
			for ( var key in props ) {
				if ( key != 'super' ) {
					klass.prototype[ key ] = props[ key ];
					_super[ key ] = props[ key ];
				}
			}
		}
		klass.prototype.super = _super;
		
		return klass;
	} )
};


//---------------------------------------------------------------------------
// Module Core
//---------------------------------------------------------------------------
var Core = Module.static( ( function () {
	/*
	 * Private properties
	 */
	var _startedTic = ( new Date() ).getTime();
	var _domLoaded = false;
	var _modulesLoaded = false;
	
	
	/*
	 * Public properties
	 */
	this.initialized = false;
	
	
	this.initialize = ( function () {
		if ( this.initialized || !_domLoaded || !_modulesLoaded ) {
			return;
		}
		this.initialized = true;
		
		// Start application
		try {
			Application.start && Application.start();
		} catch ( e ) {
			Util.log( e );
		}
		
		Util.log( 'Initialization done in ' + ( ( new Date() ).getTime() - _startedTic ) + 'ms.' );
	} );
	
	
	this.localizer = ( function ( message ) {
		var s = Modules.locale && Modules.locale.resource && Modules.locale.resource[ message ];
		
		if ( typeof s == 'string' ) {
			return s;
		} else if ( typeof s == 'function' ) {
			return s.apply( null, Util.slice( arguments, 1 ) );
		} else {
			return message;
		}
	} );
	
	
	var ua = navigator.userAgent;
	this.browsers = {
		Firefox: /Firefox/.test( ua ),
		Chrome: /Chrome/.test( ua ),
		Safari: /Safari/.test( ua ) && !( /Chrome/.test( ua ) ),
		Opera: /Opera/.test( ua ),
		MSIE: /MSIE/.test( ua ),
		MSIE9: /MSIE/.test( ua ) && typeof window.addEventListener == 'function',
		
		MobileSafari: /iPad|iPhone|iPod/.test( ua ),
		WebKit: /AppleWebKit/.test( ua ),
		Gecko: /Gecko/.test( ua ) && !( /KHTML/.test( ua ) )
	};
	
	
	/*
	 * Event listeners
	 */
	window.addEventListener( 'DOMContentLoaded', ( function () {
		_domLoaded = true;
		Core.initialize();
	} ), false );
	
	window.addEventListener( 'moduleLoaded', ( function () {
		_modulesLoaded = true;
		Core.initialize();
	} ), false );
	
	window.addEventListener( 'load', ( function () {
		_domLoaded = true;
		Core.initialize();
	} ), false );
} ) );


//---------------------------------------------------------------------------
// Class Ajax
//---------------------------------------------------------------------------
var Ajax = Module.class( ( function ( options ) {
	/*
	 * Private properties
	 */
	var _onSuccessHandler;
	
	var _setRequestHeaders = ( function ( headers ) {
		for ( var key in headers ) {
			request.setRequestHeader( key, headers[ key ] );
		}
	} );
	
	var _onReadyStateChange = ( function ( event ) {
		if ( request.readyState == 4 ) {
			if ( request.status !== 200 ) {
				Util.log( 'XMLHttpRequest: http response not OK - ' + request.status );
				return;
			}
			
			typeof _onSuccessHandler == 'function' && _onSuccessHandler.apply( this );
		}
	} );
	
	
	/*
	 * Constructor
	 */
	var request = new XMLHttpRequest();
	
	request.open(
		options.method == 'post' ? 'POST' : 'GET',
		options.url,
		options.async ? true : false
	);
	options.async && ( request.onreadystatechange = _onReadyStateChange );
	
	_setRequestHeaders( {
		'X-Requested-With': 'XMLHttpRequest',
		'Accept': 'text/javascript, text/html, */*'
	} );
	typeof options.headers == 'object' && _setRequestHeaders( options.headers );
	
	request.send( options.method == 'post' && options.postBody ? options.postBody : null );
	
	
	/*
	 * Public properties
	 */
	this.url = options.url;
	this.request = request;
	
	this.getHeader = ( function ( name ) {
		try {
			return request.getResponseHeader( name ) || null;
		} catch (e) {
			return null;
		}
	} );
	
	this.getResponse = ( function () {
		return request.responseText;
	} );
	
	this.success = ( function ( handler ) {
		_onSuccessHandler = handler;
		
		// For synchronous request
		options.async || _onReadyStateChange();
		
		return this;
	} );
} ) );


//---------------------------------------------------------------------------
// Module Util
//---------------------------------------------------------------------------
var Util = Module.static( ( function () {
	/*
	 * Private properties
	 */
	var _TICTOC = null;
	
	
	/*
	 * Public properties
	 */
	this.now = ( function () {
		return ( new Date ).getTime();
	} );
	
	
	this.tic = ( function () {
		_TICTOC = Util.now();
	} );
	
	
	this.toc = ( function ( message ) {
		this.log( ( message ? message + ' : ' : '' ) + ( Util.now() - _TICTOC ) + 'ms' );
		
		this.tic();
	} );
	
	
	this.log =  ( function ( message, obj ) {
		if ( Application.config.debug ) {
			console && console.log( '[' + ( new Date ) + '] ' + message );
			obj && console && console.log( obj );
		}
	} );
	
	
	this.slice = ( function ( context, start, end ) {
		return Array.prototype.slice.call( context, Array.prototype.slice.call( arguments, 1 ) );
	} );
	
	
	this.bind = ( function ( method, context ) {
		if ( !method || arguments.length == 1 || typeof context == 'undefined' ) {
			return method;
		}
		
		var args = Util.slice( arguments, 2 );
		return ( function () {
			return method.apply( context, args.concat( Util.slice( arguments ) ) );
		} );
	} );
	
	
	this.combine = ( function () {
		var methods = Util.slice( arguments );
		
		return ( function () {
			var This = this;
			var args = Util.slice( arguments );
			
			var ret = [];
			methods.forEach( ( function ( item ) {
				if ( typeof item == 'function' ) {
					ret.push( item.apply( This, args ) );
				} else if ( typeof item == 'object' ) {
					ret.push( item );
				}
			} ) );
			
			var combined = ( ret[0] instanceof Array ? [] : {} );
			ret.forEach( ( function ( item ) {
				if ( typeof item == 'object' ) {
					combined = Util.merge( combined, item );
				}
			} ) );
			
			return combined;
		} );
	} );
	
	
	this.merge = ( function ( target, source ) {
		source = source || {};
		if ( target instanceof Array && source instanceof Array ) {
			return target.concat( source );
		} else {
			for ( var key in source ) {
				target[ key ] = source[ key ];
			}
			return target;
		}
	} );
	
	
	this.clone = ( function ( source ) {
		return source && JSON.parse( JSON.stringify( source ) );
	} );
	
	
	this.dispatchEvent = ( function ( target, eventType, params ) {
		var event = document.createEvent( 'Event' );
		event.initEvent( eventType, true, false );
		
		Util.merge( event, params );
		
		target && target.dispatchEvent && target.dispatchEvent( event );
	} );
	
	
	this.utf8Encode = ( function ( str ) {
		var out = '', c;
		
		for ( var i = 0; i < str.length; i++ ) {
			c = str.charCodeAt( i );
			if ( ( c >= 0x0001 ) && ( c <= 0x007F ) ) {
				out += str.charAt( i );
			} else if ( c > 0x07FF ) {
				out += String.fromCharCode( 0xE0 | ( ( c >> 12 ) & 0x0F ) );
				out += String.fromCharCode( 0x80 | ( ( c >>  6 ) & 0x3F ) );
				out += String.fromCharCode( 0x80 | ( ( c >>  0 ) & 0x3F ) );
			} else {
				out += String.fromCharCode( 0xC0 | ( ( c >>  6 ) & 0x1F ) );
				out += String.fromCharCode( 0x80 | ( ( c >>  0 ) & 0x3F ) );
			}
		}
		
		return out;
	} );
	
	
	this.utf8Decode = ( function ( utf ) {
		var out = '', i = 0, len = utf.length, c;
		
		while ( i < len ) {
			c = utf.charCodeAt( i++ );
			
			switch ( c >> 4 ) {
				case 0 : case 1 : case 2 : case 3 : case 4 : case 5 : case 6 : case 7 :
					// 0xxxxxxx
					out += utf.charAt( i - 1 );
					break;
				
				case 12 : case 13 :
					// 110x xxxx   10xx xxxx
					out += String.fromCharCode(
						( ( c                     & 0x1F ) << 6 ) |
						(   utf.charCodeAt( i++ ) & 0x3F )
					);
					break;
				
				case 14 :
					// 1110 xxxx  10xx xxxx  10xx xxxx
					out += String.fromCharCode(
						( ( c                     & 0x0F ) << 12 ) |
						( ( utf.charCodeAt( i++ ) & 0x3F ) <<  6 ) |
						(   utf.charCodeAt( i++ ) & 0x3F )
					);
					break;
			}
		}
		
		return out;
	} );
	
	
	this.stringify = ( function ( data ) {
		var encoded = data && JSON.stringify( data );
		if ( encoded ) {
			encoded = Util.utf8Encode( encoded );
			encoded = window.btoa( encoded );
		}
		return encoded;
	} );
	
	
	this.parse = ( function ( str ) {
		var b = str;
		if ( b ) {
			b = window.atob( b );
			b = Util.utf8Decode( b );
			b = b && JSON.parse( b );
		}
		return b;
	} );
} ) );


//---------------------------------------------------------------------------
// Class EventDispatcher
//---------------------------------------------------------------------------
var EventDispatcher = Module.class( ( function () {
	/*
	 * Private properties
	 */
	var _eventHandlers = {};
	
	
	/*
	 * Public properties
	 */
	this.observe = ( function ( eventType, callback, useCapture) {
		if ( typeof eventType != 'string' ) {
			throw new Error( 'EventDispatcher::observe - parameter "eventType" must be a string.' );
		}
		if ( typeof callback != 'function' ) {
			throw new Error( 'EventDispatcher::observe - parameter "callback" must be a function.' );
		}
		eventType = eventType.toLowerCase();
		
		var handlers = _eventHandlers[ eventType ] || [];
		_eventHandlers[ eventType ] = handlers;
		if ( handlers.indexOf( callback ) == -1 ) {
			handlers[ useCapture ? 'unshift' : 'push' ]( callback );
		}
	} );
	
	this.stopObserving = ( function ( eventType, callback ) {
		if ( typeof eventType != 'string' ) {
			throw new Error( 'EventDispatcher::observe - parameter "eventType" must be a string.' );
		}
		if ( typeof callback != 'function' ) {
			throw new Error( 'EventDispatcher::observe - parameter "callback" must be a function.' );
		}
		eventType = eventType.toLowerCase();
		
		var handlers = _eventHandlers[ eventType ] || [];
		if ( handlers.indexOf( callback ) >= 0 ) {
			handlers.splice( handlers.indexOf( callback ), 1 );
		}
	} );
	
	this.fire = ( function ( event ) {
		if ( typeof event == 'string' ) {
			var e  = document.createEvent( 'Event' );
			e.initEvent( event, true, false );
			
			Util.merge( e, arguments[ 1 ] );
			event = e;
		}
		
		var eventType = event.type.toLowerCase();
		var handlers = _eventHandlers[ eventType ] || [];
		for ( var i = 0; i < handlers.length; i++ ) {
			handlers[ i ].call( this, event );
		}
	} );
} ) );


//---------------------------------------------------------------------------
// Class ModuleLoader
//---------------------------------------------------------------------------
var ModuleLoader = Module.class( ( function ( name, url, version ) {
	/*
	 * Private properties
	 */
	var _onRequestComplete = ( function () {
		var contentType = request.getHeader( 'Content-type' );
		if ( /^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i.test( contentType ) ) {
			var module = ModuleLoader.evalResponse( name, request.getResponse() );
			
			if ( module ) {
				Modules.set( name, module );
			}
		} else {
			Util.log( 'ModuleLoader: exception occured while loading module ' + name + ' - Content not JavaScript.' );
		}
	} );
	
	
	/*
	 * Constructor
	 */
	version && ( url += ( url.indexOf( '?' ) < 0  ? '?' : '&' ) + version );
	
	var request = ( new Ajax( {
		url: url,
		async: true
	} ) )
		.success( _onRequestComplete );
	
	
	/*
	 * Public properties
	 */
	this.url = url;
	this.request = request;
} ) );
ModuleLoader.evalResponse = ( function ( $moduleName, $response ) {
	try {
		return eval( $response );
	} catch (e) {
		Util.log( 'ModuleLoader: exception occured while loading module ' + $moduleName + ' - ' + e );
	}
} );


//---------------------------------------------------------------------------
// Module Modules
//---------------------------------------------------------------------------
var Modules = Module.extend( EventDispatcher ).static( ( function () {
	/*
	 * Private properties
	 */
	var _loaders = {};
	
	var _checkIfAllLoaded = Util.bind( function () {
		for ( var name in _loaders ) {
			if ( !this[ name ] ) {
				return false;
			}
		}
		return true;
	}, this );
	
	
	/*
	 * Public properties
	 */
	this.set = ( function ( name, module ) {
		_loaders[ name ] = true;
		this[ name ] = module;
		
		this.fire( 'loaded', {
			module: name
		} );
		
		if ( _checkIfAllLoaded() ) {
			this.fire( 'moduleLoaded' );
			
			Util.dispatchEvent( window, 'moduleLoaded' );
		}
	} );
	
	
	this.load = ( function ( name, fileName, coreFlag ) {
		if ( !( _loaders[ name ] instanceof ModuleLoader ) ) {
			var url = ( ( coreFlag && Application.config.blockAppJsPath ) || Application.config.modulePath || '');
			url += ( fileName ? fileName : name ) + '.js';
			
			_loaders[ name ] = new ModuleLoader( name, url, Application.config.moduleRequestWithVersion ? Application.config.version : null );
		}
	} );
	
	
	this.register = ( function ( name ) {
		if ( !( _loaders[ name ] instanceof ModuleLoader ) ) {
			_loaders[ name ] = 'registered';
		}
	} );
} ) );


//---------------------------------------------------------------------------
// Module Element
//---------------------------------------------------------------------------
var Element = Module.extend( {
	base: ( function ( base ) {
		var ret = {};
		[ 'get', 'getAll', 'findElements' ].forEach( ( function ( method ) {
			ret[ method ] = ( function ( element ) {
				return Element[ method ]( element, base );
			} );
		} ) );
		
		return ret;
	} ),


	get: ( function ( element, base ) {
		if ( typeof element == 'string' ) {
			base = base || document;
			element = base.querySelector( element ) || base.getElementById && base.getElementById( element );
		}
		if ( element instanceof Array ) {
			return Element.getAll( element, base );
		}
		if ( !( element instanceof Node ) ) {
			return null;
		}
		return element;
	} ),


	getAll: ( function ( element, base ) {
		if ( typeof element == 'string' ) {
			base = base || document;
			element = Util.slice( base.querySelectorAll( element ) );
			if ( element.length ) {
				return element;
			} else if ( base.getElementById ) {
				element = base.getElementById( element );
			} else {
				return [];
			}
		}
		if ( element instanceof Node || element === window ) {
			return [ element ];
		}
		if ( element instanceof Array ) {
			var ret = [];
			element.forEach( ( function ( item ) {
				ret = ret.concat( Element.getAll( item, base ) );
			} ) );
			return ret;
		}
		return element;
	} ),


	findElements: ( function ( elements, base ) {
		var ret = {};
		
		for ( var key in elements ) {
			ret[ key ] = Element.get( elements[ key ], base );
		}
		
		return ret;
	} ),


	observe: ( function ( elements, eventType, callback ) {
		if ( eventType == 'click' && Core.browsers.MobileSafari ) {
			eventType = 'touchend';
		}
		
		elements = Element.getAll( elements );
		if ( elements instanceof Array ) {
			elements.forEach( ( function ( element ) {
				element.addEventListener( eventType, callback, false );
			} ) );
		}
	} ),


	stopObserving: ( function ( elements, eventType, callback ) {
		if ( eventType == 'click' && Core.browsers.MobileSafari ) {
			eventType = 'touchend';
		}
		
		elements = Element.getAll( elements );
		if ( elements instanceof Array ) {
			elements.forEach( ( function ( element ) {
				element.removeEventListener( eventType, callback, false );
			} ) );
		}
	} ),


	getData: ( function ( element ) {
		element = Element.get( element );
		return element && Util.parse( element.getAttribute( 'data' ) ) || null;
	} ),


	setData: ( function ( element, data ) {
		element = Element.get( element );
		element && data && element.setAttribute( 'data', Util.stringify( data ) );
	} ),


	dom: ( function ( html ) {
		var div = document.createElement( 'div' );
		div.innerHTML = html;
		
		var fragment = document.createDocumentFragment();
		while ( div.childNodes.length > 0 ) {
			fragment.appendChild( div.childNodes[ 0 ] );
		}
		
		return fragment;
	} ),


	update: ( function ( target, html ) {
		target = Element.get( target );
		if ( target ) {
			target.innerHTML = html;
		}
		return target;
	} ),


	replace: ( function ( target, newNode ) {
		target = Element.get( target );
		if ( target && target.parentNode ) {
			var children = Util.slice( newNode.childNodes );
			target.parentNode.replaceChild( newNode, target );
			return children;
		}
	} ),


	insertTop: ( function ( target, newNode ) {
		target = Element.get( target );
		if ( target ) {
			var children = Util.slice( newNode.childNodes );
			if ( target.childNodes.length == 0 ) {
				target.appendChild( newNode );
			} else {
				target.insertBefore( newNode, target.childNodes[0] );
			}
			return children;
		}
	} ),


	insertLast: ( function ( target, newNode ) {
		target = Element.get( target );
		if ( target ) {
			var children = Util.slice( newNode.childNodes );
			target.appendChild( newNode );
			return children;
		}
	} ),


	insertAfter: ( function ( target, newNode ) {
		target = Element.get( target );
		if ( target && target.parentNode ) {
			var siblings = target.parentNode.childNodes;
			for ( var i = 0; i < siblings.length; i++ ) {
				if ( siblings[ i ].isEqualNode( target ) ) {
					var children = Util.slice( newNode.childNodes );
					if ( i + 1 == siblings.length ) {
						target.parentNode.appendChild( newNode );
					} else {
						target.parentNode.insertBefore( newNode, siblings[ i + 1 ] );
					}
					return children;
				}
			}
		}
	} ),


	insertBefore: ( function ( target, newNode ) {
		target = Element.get( target );
		if ( target && target.parentNode ) {
			var children = Util.slice( newNode.childNodes );
			target.parentNode.insertBefore( newNode, target );
			return children;
		}
	} ),


	remove: ( function ( target ) {
		if ( target instanceof Array && target.length > 0 ) {
			var ret = [];
			for ( var i = 0; i < target.length; i++ ) {
				ret.push( Element.remove( target[ i ] ) );
			}
			return ret;
		}
		
		target = Element.get( target );
		if ( target && target.parentNode ) {
			target.parentNode.removeChild( target );
		}
		return target;
	} ),


	show: ( function ( target, display ) {
		if ( typeof target == 'object' && target.length > 0 ) {
			var ret = [];
			for ( var i = 0; i < target.length; i++ ) {
				ret.push( Element.show( target[ i ] ) );
			}
			return ret;
		}
		
		target = Element.get( target );
		if ( target ) {
			target.style.display = /inherit|none|inline|block|inline-block|box/.test( display ) ? display : 'block';
		}
		return target;
	} ),


	hide: ( function ( target ) {
		return Element.show( target, 'none' );
	} ),


	visible: ( function ( target ) {
		target = Element.get( target );
		if ( !target || target.style.display == 'none' || target.clientHeight == 0 || target.clientWidth == 0 ) {
			return false;
		} else {
			return true;
		}
	} ),


	offsetPosition: ( function ( target, relative ) {
		target = Element.get( target );
		relative = Element.get( relative );
		
		var ret = {
			left: 0,
			top: 0
		};
		if ( target ) {
			var e = target;
			while ( e ) {
				ret.left += e.offsetLeft;
				ret.top += e.offsetTop;
				e = e.offsetParent;
			}
		}
		if ( relative ) {
			var diff = Element.offsetPosition( relative );
			ret.left -= diff.left;
			ret.top -= diff.top;
		}
		
		return ret;
	} )
} ).static();


//---------------------------------------------------------------------------
// Class View
//---------------------------------------------------------------------------
var View = ( function () {
	/*
	 * Class definition
	 */
	var View = Module.class( ( function ( url ) {
		/*
		 * Private properties
		 */
		var _ejs = new EJS( {
			url: url
		} );
		
		
		/*
		 * Public properties
		 */
		this.render = ( function ( data ) {
			this.dom = Element.dom( _ejs.render( {
				data: data,
				Helper: Modules.helper
			} ) );
			
			var This = this;
			[ 'replace', 'insertTop', 'insertLast', 'insertAfter', 'insertBefore' ]
				.forEach( ( function ( method ) {
					This[ method ] = ( function ( target ) {
						return Element[ method ]( target, This.dom );
					} );
				} ) );
			
			this.trim = ( function () {
				var children = Util.slice( this.dom.childNodes );
				for ( var i = 0; i < children.length; i++ ) {
					if ( !( children[ i ] instanceof HTMLElement ) ) {
						this.dom.removeChild( children[ i ] );
					}
				}
				
				return this;
			} );
			
			return this;
		} );
	} ) );


	/*
	 * Public static properties
	 */
	Util.merge( View, {
		prepare: ( function ( url ) {
			return new View( url );
		} ),


		render: ( function ( url, data ) {
			return View
				.prepare( url )
				.render( data );
		} ),


		update: ( function ( target, url, data ) {
			return Element.update( target, View.render( url, data ) );
		} )
	} );

	[ 'replace', 'insertTop', 'insertLast', 'insertAfter', 'insertBefore' ]
		.forEach( ( function ( method ) {
			View[ method ] = ( function ( target, url, data ) {
				return Element[ method ]( target, Element.dom( View.render( url, data ) ) );
			} );
		} ) );


	/*
	 * Export
	 */
	return View;
} )();


//---------------------------------------------------------------------------
// Class Blocks
//---------------------------------------------------------------------------
var Blocks = ( function () {
	/*
	 * Class definition
	 */
	var Blocks = Module.extend( EventDispatcher ).class( ( function () {
		/*
		 * Private properties
		 */
		var _childNodes = [];
		var _data = {};
		var _renderedData = {};
		
		
		/*
		 * Public properties
		 */
		this.setData = ( function ( data ) {
			Util.merge( _data, data);
		} );
		
		
		this.getData = ( function ( key ) {
			if ( typeof key == 'string' ) {
				return _renderedData[ key ];
			} else {
				return _renderedData;
			}
		} );
		
		
		this.render = ( function ( replaceNode ) {
			if ( $viewObjs[ this.module ] ) {
				_renderedData = {};
				Util.merge( _renderedData, this.data );
				Util.merge( _renderedData, _data );
				Util.merge( _renderedData, this.prepareData && this.prepareData() );
				
				this.fire( 'beforeRender' );
				
				var rendered = $viewObjs[ this.module ].render( _renderedData );
				if ( this.trim ) {
					rendered.trim();
				}
				
				this.getElementsList
					&& Util.merge( this, Element.base( rendered.dom ).findElements( this.getElementsList() || {} ) );
				
				this.manipulateDom
					&& this.manipulateDom( rendered.dom );
				
				if ( replaceNode ) {
					_childNodes = rendered.replace( replaceNode );
				} else {
					var method = /replace|insertTop|insertLast|insertAfter|insertBefore/.test( this.method ) ? this.method : 'insertLast';
					_childNodes = rendered[ method ]( this.position );
				}
				
				this.fire( 'afterRender' );
			}
			
			return this;
		} );
		
		
		this.clear = ( function ( remainFlag ) {
			if ( remainFlag ) {
				var replaceTarget;
				_childNodes.some( ( function ( node ) {
					if ( node instanceof HTMLElement ) {
						replaceTarget = node;
						return true;
					}
				} ) );
				_childNodes.forEach( ( function ( node ) {
					if ( node !== replaceTarget) {
						Element.remove( node );
					}
				} ) );
				
				return replaceTarget;
			} else {
				return Element.remove( _childNodes );
			}
		} );
		
		
		this.update = ( function () {
			var replaceTarget = this.clear( true );
			return this.render( replaceTarget );
		} );
		
		
		this.destroy = ( function () {
			this.fire( 'beforeDestroy' );
			
			this.clear();
			Organizer.removeInstance( this );
			
			this.fire( 'afterDestroy' );
		} );
	} ) );


	/*
	 * Public static properties
	 */
	Util.merge( Blocks, {
		createInstance: ( function ( blockOptions ) {
			var blockName = blockOptions.module;
			
			if ( typeof Modules[ blockName ] == 'function' ) {
				var instance = new Modules[ blockName ];
				Util.merge( instance, Util.clone( blockOptions ) );
				return instance;
			} else {
				throw new Error( 'Blocks: the module is not available - ' + blockName );
			}
		} ),


		prepare: ( function ( blockName, viewFile ) {
			viewFile = viewFile || blockName;
			if ( !$viewObjs[ blockName ] ) {
				$viewObjs[ blockName ] = View.prepare( Application.viewPath( viewFile ) );
			}
		} )
	} );


	/*
	 * Private static properties
	 */
	var $viewObjs = {};


	/*
	 * Export
	 */
	return Blocks;
} )();


//---------------------------------------------------------------------------
// Module Organizer
//---------------------------------------------------------------------------
var Organizer = ( function () {
	/*
	 * Module definition
	 */
	var Organizer = Module.extend( {
		group: ( function ( groupName ) {
			return {
				register: ( function ( options ) {
					options.group = groupName;
					Organizer.register( options );
					return this;
				} )
			};
		} ),


		register: ( function ( options ) {
			options.id = ( options.group ? options.group + '.' : '' ) + options.name;
			options.module = 'block.' + ( options.file || options.name );
			
			$registeredBlocks[ options.id ] = options;
			
			Modules.load( options.module, options.module );
			
			return this;
		} ),


		getInstance: ( function ( blockId ) {
			return ( $blockInstances[ blockId ] || [] )[ 0 ];
		} ),


		newInstance: ( function ( blockId ) {
			var options = $registeredBlocks[ blockId ];
			if ( !options ) {
				throw new Error( 'Organizer: the block is not registered - ' + blockId );
			}
			
			var instance = Blocks.createInstance( options );
			
			!$blockInstances[ blockId ] && ( $blockInstances[ blockId ] = [] );
			$blockInstances[ blockId ].push( instance );
			
			return instance;
		} ),


		removeInstance: ( function ( instance ) {
			for ( var id in $blockInstances ) {
				var found = $blockInstances[ id ].indexOf( instance );
				if ( found >= 0 ) {
					$blockInstances[ id ].splice( found, 1);
					return;
				}
			}
		} ),


		layoutBlocks: ( function ( group ) {
			for ( var id in $registeredBlocks ) {
				var options = $registeredBlocks[ id ];
				
				var flag = ( typeof group != 'string' || group == options.group );
				if ( !flag && /common|default/i.test( group ) ) {
					flag = ( !options.group || /common|default/i.test( options.group ) );
				}
				if ( flag && options.autoRender !== false ) {
					Organizer.newInstance( id ).render();
				}
			}
		} )
	} ).static();


	/*
	 * Private static properties
	 */
	var $registeredBlocks = {};
	var $blockInstances = {};


	/*
	 * Export
	 */
	return Organizer;
} )();


//---------------------------------------------------------------------------
// Load modules
//---------------------------------------------------------------------------
( function () {
	/*
	 * Core modules
	 */
	var requiredModules = {};
	if ( !window.btoa || !window.atob ) {
		requiredModules.base64 = Application.config.debug ? 'base64' : 'base64.min';
	}
	for ( var name in requiredModules ) {
		Modules.load( name, requiredModules[ name ], true );
	}


	/*
	 * Application modules
	 */
	for ( var name in Application.requiredModules || {} ) {
		Modules.load( name, Application.requiredModules[ name ] );
	}
} )();


//---------------------------------------------------------------------------
// Export
//---------------------------------------------------------------------------
window._ = Core.localizer;
window[ Application.appName ] = Core;

Util.merge( window[ Application.appName ], {
	Element: Element,
	Modules: Modules,
	Organizer: Organizer,
	Util: Util,
	View: View
} );

if ( !Function.prototype.bind ) {
	Function.prototype.bind = ( function ( context ) {
		var args = Util.slice( arguments );
		args.unshift( this );
		return Util.bind.apply( null, args );
	} );
}


//---------------------------------------------------------------------------
// End
//---------------------------------------------------------------------------

} )();
