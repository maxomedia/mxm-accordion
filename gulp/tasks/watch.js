// Many thanks to:
// https://github.com/greypants/gulp-starter

var gulp    = require('gulp');
var options = require('../options');

gulp.task('watch', function() {
	gulp.watch('src/**/*.js', ['minify-js']);
	gulp.watch('src/**/*.less', ['less']);
});