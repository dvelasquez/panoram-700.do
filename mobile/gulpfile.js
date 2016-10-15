/* Very Utils */
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sh = require('shelljs');

gulp.paths = {
	sass: ['./src/**/*.scss', '!./src/lib/**/*.scss'],
	html: ['./src/**/*.html', '!./src/lib/**/*.html'],
	script: ['./src/app/**/*.js'],
	react: ['./src/app/**/*.jsx'],
	vendor: ['./src/lib/**', './src/index.html'],
	i18n: ['./src/app/**/i18n/**/*.json']
};

require('require-dir')('./gulp');

gulp.task('default', ['sass', 'script', 'templates']);

gulp.task('serve:before', ['watch']);

gulp.task('install', ['git-check'], function () {
	return bower.commands.install()
		.on('log', function (data) {
			gutil.log('bower', gutil.colors.cyan(data.id), data.message);
		});
});

gulp.task('git-check', function (done) {
	if (!sh.which('git')) {
		console.log(
			'  ' + gutil.colors.red('Git is not installed.'),
			'\n  Git, the version control system, is required to download Ionic.',
			'\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
			'\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
		);
		// process.exit(1);
	}
	done();
});
