'use strict';

var gulp = require('gulp');
var copy = require('gulp-copy');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var series = require('stream-series');
var clean = require('gulp-clean');

gulp.task('clean-vendor', function () {
	return gulp.src('./www/lib/', {read: false})
		.pipe(clean());
});

gulp.task('vendor', ['clean-vendor'], function (done) {
	gulp.src(mainBowerFiles())
		.pipe(copy('./www/lib/', {prefix: 2}))
		.on('end', function () {
			var target = gulp.src('./src/index.html');
			var ionic = gulp.src(['./www/lib/ionic/**/*.js'], {read: false});
			var react = gulp.src(['./www/lib/react/**/react.**'], {read: false});
			var notIonicReact = gulp.src(['!./www/lib/react/**/react.**', '!./www/lib/ionic/**/*.js', '!./www/lib/ionic/**/*.css', './www/lib/**/*.js', './www/lib/*/**/*.css'], {read: false});
			target.pipe(
				inject(series(ionic, react, notIonicReact), {
					addRootSlash: false,
					ignorePath: 'www/'
				}))
				.pipe(gulp.dest('.', {cwd: './www'}))
				.on('end', done);
			
		});
});

