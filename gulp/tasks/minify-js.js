var gulp    = require('gulp');
var options = require('../options').js;
var uglify  = require('gulp-uglify');

gulp.task( 'minify-js', function() {
	return gulp.src( options.src )
		.pipe( uglify() )
		.pipe( gulp.dest( options.dest ) );
});