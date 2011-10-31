//---------------------------------------------------------------------------
// locale.ja.template.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala.
//---------------------------------------------------------------------------


( function () {

//---------------------------------------------------------------------------
// Module Locale
//---------------------------------------------------------------------------
var Locale = Module.extend( {
	locale: 'ja'
} ).static();


//---------------------------------------------------------------------------
// Static private properties
//---------------------------------------------------------------------------
var $localeResource = {
	'Hello.' : 'こんにちは。'
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
		'日曜日',
		'月曜日',
		'火曜日',
		'水曜日',
		'木曜日',
		'金曜日',
		'土曜日'
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
	
	if ( (new Date()).getFullYear() == y ) {
		return ( m + 1 ) + '月' + d + '日';
	} else {
		return y + '年' + ( m + 1 ) + '月' + d + '日';
	}
} );


$localeResource[ 'Date and Time format' ] = ( function ( timeStamp) {
	return $localeResource[ 'Date format' ]( timeStamp ) + ' ' + $localeResource[ 'Time format' ]( timeStamp );
} );


$localeResource[ 'Ago' ] = ( function ( timeStamp ) {
	if ( !( timeStamp instanceof Date ) ) {
		timeStamp = new Date( timeStamp );
	}
	
	// To seconds
	var timeDiff = Math.ceil( ( Util.now() - timeStamp.getTime() ) / 1000 );
	
	if ( timeDiff < 10 ) {
		return '数秒前';
	} else if ( timeDiff < 60 ) {
		return timeDiff + '秒前';
	} else if ( timeDiff < 60 * 60 ) {
		return Math.floor( timeDiff / 60 ) + '分前 (' + $localeResource[ 'Time format' ]( timeStamp ) + ')';
	} else if ( timeDiff < 60 * 60 * 2 ) {
		return '約1時間前 (' + $localeResource[ 'Time format' ]( timeStamp ) + ')';
	} else if ( timeDiff < 60 * 60 * 24 ) {
		return Math.floor( timeDiff / 60 / 60 ) + '時間前 (' + $localeResource[ 'Time format' ]( timeStamp ) + ')';
	} else if ( timeDiff < 60 * 60 * 24 * 2) {
		return '昨日 (' + $localeResource[ 'Time format' ]( timeStamp ) + ')';
	} else if ( timeDiff < 60 * 60 * 24 * 7) {
		return $localeResource[ 'Day format' ]( timeStamp ) + ' ' + $localeResource[ 'Time format' ]( timeStamp );
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
