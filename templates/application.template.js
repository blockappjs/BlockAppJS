//---------------------------------------------------------------------------
// application.template.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala.
//---------------------------------------------------------------------------


( function ( window ) {

//---------------------------------------------------------------------------
// Application
//---------------------------------------------------------------------------
var Application = {
	/**
	 * The name of your application.
	 * BlockAppJS namespace will be exported to:
	 *     window[ Application.appName ]
	 *
	 * TODO: name your application
	 */
	appName: 'yourAppName',

	/**
	 * Return path to the view file specified.
	 */
	viewPath: ( function ( fileName ) {
		// View template engine is currently EJS.
		//
		// TODO: modifiy the path to fit your environment.
		//
		// for example,
		return 'ejs/' + fileName + '.ejs';
	} ),

	/**
	 * This function will be called when all modules are loaded.
	 */
	start: ( function () {
		/*
		 * Do something you want to do.
		 */
		
		/*
		 * Organizer doesn't render blocks you registered
		 * until you call Organizer.layoutBlocks().
		 *
		 *     window[ Application.appName ].Organizer.layoutBlocks()
		 *                                          => render all blocks registered.
		 *     window[ Application.appName ].Organizer.layoutBlocks( 'default' )
		 *                                          => render blocks not grouped.
		 *     window[ Application.appName ].Organizer.layoutBlocks( 'main' )
		 *                                          => render blocks grouped as 'main'.
		 */
		window[ Application.appName ].Organizer.layoutBlocks();
	} )
};


//---------------------------------------------------------------------------
// Config
//---------------------------------------------------------------------------
Application.config = {
	/**
	 * Version string of your application.
	 * URI encoded string is preferred.
	 *
	 * TODO: modifiy the version string when cache-refreshing required.
	 */
	version: '20111031',

	/**
	 * Set this flag <true> to enable Util.log
	 */
	debug: true,

	/**
	 * Specify path prefix to your modules/blocks.
	 * for example,
	 *
	 * TODO: modifiy the path to fit your environment.
	 */
	modulePath: 'js/',

	/**
	 * Specify path prefix to BlockAppJS modules.
	 * for example,
	 *
	 * TODO: modifiy the path to fit your environment.
	 */
	blockAppJsPath: 'js/blockappjs/',

	/**
	 * Set this flag <true> and version string is appended after module path.
	 *     ${ modulePath }${ moduleFileName }?${ moduleRequestWithVersion }
	 * ex.
	 *     js/block.example.js?20111005
	 */
	moduleRequestWithVersion: true
};


/*
 * Locale detection.
 * Required if uses Locale module for internationalization.
 */
var availableLocale = [ 'en', 'ja' ];
var locale = ( navigator.language || navigator.browserLanguage || '' ).toLowerCase().replace( /-.*/, '' );
Application.config.locale = availableLocale.indexOf( locale ) >= 0 ? locale : availableLocale[ 0 ];


//---------------------------------------------------------------------------
// Required modules
//---------------------------------------------------------------------------
Application.requiredModules = {
	/*
	 * Specify list of modules required.
	 * Set module name to key and module file name without extension
	 * to value.
	 *
	 * TODO: add or remove module name and file name pairs.
	 */

	/**
	 * Locale module enables localization.
	 * If you use this module, you can get translation like this:
	 *     _( 'Hello.' )
	 *              => 'Hello.' for en, 'こんにちは。' for ja.
	 *     _( 'Date format', new Date( '2011-10-28' ) )
	 *              => 'October 28, 2011' for en, '2011年10月28日' for ja.
	 */
	locale: 'locale.' + Application.config.locale,

	/**
	 * Helper module is a set of methods that helps you
	 * accessible within view templates,
	 */
	helper: 'helper',
	
	/**
	 * Layouter module is rational solution to load blocks for your application.
	 */
	layouter: 'layouter'
};


//---------------------------------------------------------------------------
// Export
//---------------------------------------------------------------------------
/*
 * Required.
 */
window.Application = Application;


//---------------------------------------------------------------------------
// End
//---------------------------------------------------------------------------

} )( window );
