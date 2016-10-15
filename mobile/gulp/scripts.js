'use strict';

var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

var babelOptions = {
	presets: ['react', 'es2015']
};
/* Angular */
var angularFilesort = require('gulp-angular-filesort');

gulp.task('script', function (done) {
	gulp.src(['./src/app/**/*.js', './src/app/**/*.jsx'])
		.pipe(babel(babelOptions))
		.pipe(angularFilesort())
		.pipe(concat('app.js'))
		.pipe(minify({
			ext: {
				src: '.js',
				min: '.min.js'
			},
			mangle: false,
			noSource: true,
			ignoreFiles: ['-min.js']
		}))
		.pipe(gulp.dest('./www/js/'))
		.on('end', done);
});