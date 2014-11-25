var should = require( 'should' ); // jshint ignore:line
var scan = require( '../src/index.js' );
var _ = require( 'lodash' );
var path = require( 'path' );

describe( 'when getting all files', function() {
	var result;
	before( function( done ) {
		scan( './', [ '**/*.*' ] )
			.then( function( files ) {
				result = files;
				done();
			} );
	} );

	it( 'should return all files outside excluded folders', function() {
		var prefix = process.cwd();
		result.should.eql( [
			prefix + '/.gitignore',
			prefix + '/.jshintrc',
			prefix + '/.npmignore',
			prefix + '/README.md',
			prefix + '/gulpfile.js',
			prefix + '/package.json',
			prefix + '/spec/simple.spec.js',
			prefix + '/src/index.js'
		] );
	} );
} );

describe( 'when getting all js files', function() {
	var result;
	before( function( done ) {
		scan( './', [ '**/*.js' ] )
			.then( function( files ) {
				result = files;
				done();
			} );
	} );

	it( 'should return all files outside excluded folders', function() {
		var prefix = process.cwd();
		result.should.eql( [
			prefix + '/gulpfile.js',
			prefix + '/spec/simple.spec.js',
			prefix + '/src/index.js'
		] );
	} );
} );

describe( 'when getting all js files with multiple ignore paths', function() {
	var result;
	before( function( done ) {
		scan( './', [ '**/*.js' ], [ '.git', 'node_modules', 'spec' ] )
			.then( function( files ) {
				result = files;
				done();
			} );
	} );

	it( 'should return all files outside excluded folders', function() {
		var prefix = process.cwd();
		result.should.eql( [
			prefix + '/gulpfile.js',
			prefix + '/src/index.js'
		] );
	} );
} );

describe( 'when getting all markdown files with custom ignore paths', function() {
	var result;
	before( function( done ) {
		scan( './', [ '**/*.md', '**/*.markdown' ], [ '.git', 'spec', 'src' ] )
			.then( function( files ) {
				result = files;
				done();
			} );
	} );

	it( 'should only return files with matching extenions', function() {
		_.all( result, function( file ) {
			var ext = path.extname( file );
			return ext === '.markdown' || ext === '.md';
		} ).should.be.true; // jshint ignore:line
	} );
} );