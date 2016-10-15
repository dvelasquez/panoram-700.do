'use strict';

var gulp = require('gulp');
var paths = gulp.paths;

gulp.task('watch', ['sass', 'script', 'templates', 'vendor', 'i18n'], function () {
	gulp.watch(paths.sass, ['sass']);
	gulp.watch(paths.html, ['templates']);
	gulp.watch([paths.script, paths.react], ['script']);
	gulp.watch(paths.vendor, ['vendor']);
	gulp.watch(paths.i18n, ['i18n']);
});
