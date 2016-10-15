'use strict';

var gulp = require('gulp');

gulp.task('i18n', function(){
	return gulp.src('./src/**/i18n/**/*.json')
		.pipe(gulp.dest('./www/i18n/'));
});