// Dependencies
// ============

var gulp                 = require('gulp');
var less                 = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var options              = require('../options').less;
var handleErrors         = require('../utils/handleErrors');

// Get an autoprefixer instance
var autoprefixer = new lessPluginAutoprefix({browsers: options.autoprefix});

// Tasks
// =====
gulp.task('less', function (){

	// Handle option errors
	if (!options.src) return console.log('Gulp less task: no src specified');
	if (!options.dest) return console.log('Gulp less task: no dest specified');

	// Start piping with main file
	return gulp.src(options.src)

		// Compile and autoprefix less
		.pipe( less({
			plugins: [autoprefixer]
		}) )

		.on('error', handleErrors)

		// Save compiled css
		.pipe( gulp.dest(options.dest) );
});