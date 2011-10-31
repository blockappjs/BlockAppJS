//---------------------------------------------------------------------------
// layouter.template.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala.
//---------------------------------------------------------------------------


( function () {

//---------------------------------------------------------------------------
// Module Layouter
//---------------------------------------------------------------------------
var Layouter = Module.static( ( function () {
	/*
	 * Creating a Layouter module is a rational solution
	 * to load your blocks.
	 */
	
	/*
	 * Register your blocks to Organizer.
	 * Set the block name, block file name, DOM position to place your block,
	 * method to insert, additional data.
	 */
	Organizer
		/*
		 * Call register() method and Organizer automatically start loading the block.
		 */
		.register( {
			/**
			 * The name of the block.
			 * You can get the block instance with this name:
			 * ex.
			 *     Organizer.getInstance( 'header' )
			 */
			name: 'header',
			
			/**
			 * DOM position to place your block in CSS selector style.
			 * The position will be evaluated with document.querySelector().
			 */
			position: '#Header',
			
			/**
			 * Methods are:
			 *     'replace', 'insertTop', 'insertLast', 'insertAfter', 'insertBefore'
			 * If no method specified, 'insertLast' is used.
			 */
			method: 'insertLast',
			
			/**
			 * With trim option set to true,
			 * CommentNode or TextNode before & after HTMLNode will be removed.
			 */
			trim: true,
			
			/**
			 * You can set constant data here.
			 */
			data: {
				appName: Application.appName
			}
		} )
		
		/*
		 * Organizer.register() returns the instance of Organizer itself.
		 * You can repeatedly register blocks like this.
		 */
		.register( {
			name: 'footer',
			position: '#Footer',
			data: {
				appName: Application.appName
			}
		} );
	
	
	/*
	 * Block grouping.
	 * You can render grouped blocks or remove them at once.
	 */
	Organizer.group( 'main' )
		.register( {
			/**
			 * You can set other name to the block.
			 * If grouped, this block name is prefixed with group name:
			 *     Organizer.newInstance( 'main.message.first' )
			 */
			name: 'message.first',
			
			/**
			 * If the name is not same with the file name, set the file name.
			 */
			file: 'message',
			
			position: '#Main .Column.first > div.wrapper',
			method: 'insertTop',
			
			/**
			 * Set autoRender option false, and this block will not rendered automatically.
			 * To render this block, codes like this:
			 *     var block = Organizer.newInstance( 'main.message.first' );
			 *     block.render();
			 */
			autoRender: false
		} )
		.register( {
			name: 'message.second',
			file: 'message',
			position: '#Main .Column.second > div.wrapper',
			method: 'insertTop',
			autoRender: false
		} );
	
	
	
	/*
	 * If some blocks use other blocks as super class,
	 * Modules 'loaded' event can help you out.
	 */
	Modules.observe( 'loaded', ( function ( event ) {
		/*
		 * event.module property is the name of the loaded module.
		 */
		if ( event.module == 'block.message' ) {
			/*
			 * Late binding of the block
			 */
			Organizer.group( 'main' )
				.register( {
					name: 'message.extended',
					position: '#Main .Column.third > div.wrapper',
					method: 'insertTop'
				} );
		}
	} ) );
	
} ) );


//---------------------------------------------------------------------------
// Export
//---------------------------------------------------------------------------
return Layouter;


//---------------------------------------------------------------------------
// End
//---------------------------------------------------------------------------

} )();
