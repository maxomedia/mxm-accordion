var dest = 'dist'; // Relative to gulpfile.js
var src = 'src';

module.exports = {

	// Project name
	name: 'Accordion',

	// Less settings
	less: {
		build: true,
		minify: true,
		src: src + '/accordion.less',
		dest: dest,
		autoprefix: [
			'Android >= 2.3',
			'Chrome >= 5',
			'Firefox >= 5',
			'Explorer >= 8',
			'iOS >= 5',
			'Opera >= 5',
			'Safari >= 6'
		]
	},

	// Browserify settings
	js: {
		build: true,
		minify: true,
		src: src + '/accordion.js',
		dest: dest
	}
}