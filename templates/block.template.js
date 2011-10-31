//---------------------------------------------------------------------------
// block.template.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala.
//---------------------------------------------------------------------------


( function () {

//---------------------------------------------------------------------------
// Class Block
//---------------------------------------------------------------------------
/**
 * The Block module is the core part of BlockAppJS.
 * A block is set of this file and a view template file.
 * The file name should be:
 *     block.TheBlockName.js
 *     block.TheBlockName.ejs
 */
var Block = Module.extend( Blocks ).class( ( function () {
	/*
	 * Public properties
	 */
	
	/**
	 * Giving this function, this instance gets instances of elements
	 * you want to work around with.
	 */
	this.getElementsList = ( function () {
		return {
			/*
			 * Key: the key to element(s)
			 * Value: CSS selector string for querySelector
			 *     You can get a list of elements if you use Array
			 *     ex.
			 *         someElements: [ 'ul li.someElements' ]
			 *     then, this.someElements is instance of Array
			 */
		};
	} );
	
	/**
	 * Giving this function, you can pass data to the view.
	 */
	this.prepareData = ( function () {
		// Returning value should be an Object
		return {};
	} );
	
	/**
	 * Giving this function, you can modify elements rendered by View
	 * before appending to DOM tree.
	 */
	this.manipulateDom = ( function ( dom ) {
		/*
		 * Do something, like addEventListeners or something
		 * ex.
		 *     Element.observe( this.someElements, 'click', _onSomeElements_click );
		 */
	} );
	
	
	/*
	 * Event listeners
	 */
	// This is an example,
	var _onSomeElements_click = ( function ( event ) {
		// Do something
	} ).bind( this );
	
} ) );


//---------------------------------------------------------------------------
// Initializer
//---------------------------------------------------------------------------
( function () {
	/*
	 * Tell the BlockAppJS core the view template file.
	 * By default, the module name is used (registered when Organizer.register called).
	 * You can specify other view template file like this:
	 *     Blocks.prepare( $moduleName, 'theNameOfViewTemplateFile' );
	 */
	Blocks.prepare( $moduleName );
} )();


//---------------------------------------------------------------------------
// Export
//---------------------------------------------------------------------------
return Block;


//---------------------------------------------------------------------------
// End
//---------------------------------------------------------------------------

} )();
