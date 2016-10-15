'use strict';

var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');

gulp.task('templates', function () {
	return gulp.src([
			'./src/app/pages/**/*.html', './src/app/**/*.html', '!./src/lib/**/*.html'
		])
		.pipe(htmlmin({
			collapseWhitespace: true,
			maxLineLength: 120,
			removeComments: true
		}))
		.pipe(templateCache('templateCacheHtml.js', {
			module: 'app'
		}))
		.pipe(minify({
			ext: {
				src: '.js',
				min: '.min.js'
			},
			noSource: true,
			mangle: false,
			ignoreFiles: ['-min.js']
		}))
		.pipe(gulp.dest('./www/templates/'));
});
