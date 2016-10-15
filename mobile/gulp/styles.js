'use strict';

var gulp = require('gulp');

var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var inject = require('gulp-inject');

gulp.task('sass', function() {
	
	var includePaths = [
		'src/lib',
		'node_modules'
	];
	includePaths = includePaths.concat(require('bourbon').includePaths);
	includePaths = includePaths.concat(require('bourbon-neat').includePaths);
	
	var sassOptions = {
		style: 'expanded',
		includePaths: includePaths
	};
	
	var injectFiles = gulp.src([
		'src/app/**/*.scss',
		'!./src/scss/app.scss',
		'!./src/app/**/_*.scss'
	], {read: false});
	
	var injectOptions = {
		transform: function( filePath ) {
			filePath = filePath.replace('src/', '../');
			return '@import \'' + filePath + '\';';
		},
		starttag: '// injector',
		endtag: '// endinjector',
		addRootSlash: false
	};
	
	return gulp.src(['src/scss/app.scss'])
		.pipe(inject(injectFiles, injectOptions))
		.pipe(sass(sassOptions))
		.pipe(minifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename({basename: 'app', extname: '.min.css'}))
		.pipe(gulp.dest('./www/css/'));
});