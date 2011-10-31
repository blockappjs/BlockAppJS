//---------------------------------------------------------------------------
// locale.en.template.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala.
//---------------------------------------------------------------------------


( function () {

//---------------------------------------------------------------------------
// Module Locale
//---------------------------------------------------------------------------
var Locale = Module.extend( {
	locale: 'en'
} ).static();


//---------------------------------------------------------------------------
// Static private properties
//---------------------------------------------------------------------------
var $localeResource = {
	'Hello.' : null
};


//---------------------------------------------------------------------------
// Message generating functions
//---------------------------------------------------------------------------
$localeResource[ 'Time format' ] = ( function ( timeStamp ) {
	if ( !( timeStamp instanceof Date ) ) {
		timeStamp = new Date( timeStamp );
	}
	var m = timeStamp.getMinutes();
	return timeStamp.getHours() + ':' + ( m < 10 ? '0' : '') + m;
} );


$localeResource[ 'Day format' ] = ( function ( timeStamp ) {
	if ( !( timeStamp instanceof Date ) ) {
		timeStamp = new Date( timeStamp );
	}
	var days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	return days[ timeStamp.getDay() ];
} );


$localeResource[ 'Date format' ] = ( function ( timeStamp ) {
	if ( !( timeStamp instanceof Date ) ) {
		timeStamp = new Date( timeStamp );
	}
	var y = timeStamp.getFullYear();
	var m = timeStamp.getMonth();
	var d = timeStamp.getDate();
	
	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	
	if ( (new Date()).getFullYear() == y ) {
		return months[ m ] + ' ' + d;
	} else {
		return months[ m ] + ' ' + d + ', ' + y;
	}
} );


$localeResource[ 'Date and Time format' ] = ( function ( timeStamp) {
	return $localeResource[ 'Date format' ]( timeStamp ) + ' at ' + $localeResource[ 'Time format' ]( timeStamp );
} );


$localeResource[ 'Ago' ] = ( function ( timeStamp ) {
	if ( !( timeStamp instanceof Date ) ) {
		timeStamp = new Date( timeStamp );
	}
	
	// To seconds
	var timeDiff = Math.ceil( ( Util.now() - timeStamp.getTime() ) / 1000 );
	
	if ( timeDiff < 10 ) {
		return 'a few seconds ago';
	} else if ( timeDiff < 60 ) {
		return timeDiff + ' seconds ago';
	} else if ( timeDiff < 60 * 60 ) {
		return Math.floor( timeDiff / 60 ) + ' minutes ago at ' + $localeResource[ 'Time format' ]( timeStamp );
	} else if ( timeDiff < 60 * 60 * 2 ) {
		return 'about an hour ago at ' + $localeResource[ 'Time format' ]( timeStamp );
	} else if ( timeDiff < 60 * 60 * 24 ) {
		return Math.floor( timeDiff / 60 / 60 ) + ' hours ago at ' + $localeResource[ 'Time format' ]( timeStamp );
	} else if ( timeDiff < 60 * 60 * 24 * 2) {
		return 'Yesterday at ' + $localeResource[ 'Time format' ]( timeStamp );
	} else if ( timeDiff < 60 * 60 * 24 * 7) {
		return $localeResource[ 'Day format' ]( timeStamp ) + ' at ' + $localeResource[ 'Time format' ]( timeStamp );
	} else {
		return $localeResource[ 'Date and Time format' ]( timeStamp ); 
	}
} );


//---------------------------------------------------------------------------
// Export
//---------------------------------------------------------------------------
Locale.resource = $localeResource;
return Locale;


//---------------------------------------------------------------------------
// End
//---------------------------------------------------------------------------

} )();
