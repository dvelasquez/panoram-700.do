#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var ncp = require('ncp').ncp;

var rootdir = process.argv[2];

if (rootdir) {
	var filestocopy = [
		{
			'resources/android/drawable/':
			'platforms/android/res/drawable/'
		},
		{
			'resources/android/values/':
			'platforms/android/res/values/'
		}];
	var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
	for(var x=0; x<platforms.length; x++) {
		// open up the index.html file at the www root
		try {
			var platform = platforms[x].trim().toLowerCase();
			if( platform === 'android' ) {
				process.stdout.write('Platform: ' + platform + '\n');
				filestocopy.forEach(function(obj) {
					Object.keys(obj).forEach(function (key) {
						var val = obj[key];
						var srcfile = path.join(rootdir, key);
						var destfile = path.join(rootdir, val);
						console.log(srcfile, destfile);
						ncp(srcfile, destfile, function(err){
							if(err){
								console.log(err);
							}
						});
					})
				});
			}
		}catch(e){
			process.stdout.write(e);
		}
	}
}