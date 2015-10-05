var _ = require( 'lodash' );
var path = require( 'path' );
var fs = require( 'fs' );
var when = require( 'when' );
var lift = require( 'when/node' ).lift;
var minimatch = require( 'minimatch' );
var readdir = lift( fs.readdir );
var stat = lift( fs.stat );

function readDir( dir, ignored ) {
	dir = path.resolve( dir );
	return readdir( dir )
		.then( function( files ) {
			var promises = _.map( files, function( file ) {
				return readFile( dir, file, ignored );
			} );
			return when.all( promises );
		} );
}

function readFile( dir, file, ignored ) { // jshint ignore:line
	if( _.contains( ignored, file ) ) {
		return when( [] );
	} else {
		return stat( path.join( dir, file ) )
			.then( function( stat ) {
				if( stat.isDirectory() ) {
					return readDir( path.join( dir, file ), ignored );
				} else {
					return [ path.join( dir, file ) ];
				}
			} )
			.then( null, function( err ) {
				return when( [] );
			} );
	}
}

function scan( dir, patterns, ignored, opts ) {
	if( !ignored ) {
		ignored = [ '.git', 'node_modules' ];
	}
	if( _.isString( patterns ) ) {
		patterns = [ patterns ];
	} else if( _.isArray( patterns ) && !_.isEmpty( patterns ) ) {
		patterns = patterns;
	} else {
		patterns = [ '**/*.*' ];
	}
	patterns = _.map( patterns, function( pattern ) {
		return pattern.replace( /^[.][\/\\]/, '' );
	} );
	var settings = opts || { dot: true, nocase: true, matchBase: false };
	var filters = _.map( patterns, function( pattern ) {
		return minimatch.filter( pattern, settings );
	} );

	return readDir( dir, ignored )
		.then( function( files ) {
			if( files && files.length ) {
				return when.reduce( files, function( x, y ) {
					return _.isArray( x ) ? x.concat( y ) : [ x, y ];
				} );
			} else {
				return [];
			}
		} )
		.then( function( collections ) {
			return _.flatten( collections );
		} )
		.then( function( list ) {
			return _.filter( list, function( file ) {
				var localized = path.relative( dir, file );
				return _.any( filters, function( f ) {
					return f( localized );
				} );
			} );
		} );
}

module.exports = scan;
