'use strict';

angular.module('fileCache.factory', [])
	.factory('$fileCache', ( $q, $log, $ionicPlatform, $cordovaDevice, $http, $toast, $localStorage, $cordovaFile, $cordovaFileTransfer, SERVER ) => {
		var cacheDirectory = null;
		var transfering = [];
		
		function getPermission() {
			var defer = $q.defer();
			if(!ionic.Platform.isIOS()){
				if(window.cordova && window.cordova.plugins && window.cordova.plugins.permissions){
					var permissions = window.cordova.plugins.permissions;
					permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, status => {
						checkPermissionExternalStorage(status).then(() => {
							defer.resolve();
						}).catch(() => {
							defer.reject();
						});
					}, null);
				} else{
					defer.reject();
				}
			} else{
				cacheDirectory = cordova.file.cacheDirectory;
				defer.resolve();
			}
			return defer.promise;
		}
		
		function checkPermissionExternalStorage( status ) {
			var defer = $q.defer();
			var permissions = window.cordova.plugins.permissions;
			if(!status.hasPermission){
				var errorCallback = () => {
					$toast.info('Permiso requerido para guardar caché');
					defer.reject();
				};
				
				permissions.requestPermission(
					permissions.WRITE_EXTERNAL_STORAGE,
					status => {
						if(!status.hasPermission){
							errorCallback();
						} else{
							cacheDirectory = window.cordova.file.cacheDirectory;
							defer.resolve(cacheDirectory);
						}
					},
					errorCallback);
			} else{
				cacheDirectory = cordova.file.cacheDirectory;
				defer.resolve(cacheDirectory);
			}
			return defer.promise;
		}
		
		$ionicPlatform.ready(() => {
			if(angular.isDefined(window.cordova)){
				getPermission();
			}
		});
		
		function files( fss ) {
			if(!fss){
				return $localStorage.getItem('files') || [];
			} else{
				$localStorage.setItem('files', fss);
				return fss;
			}
		}
		
		function addFile( file ) {
			var fs = files();
			
			fs.push(file);
			
			$localStorage.setItem('files', fs);
		}
		
		function sourceUrl( resource ) {
			var baseUrl = SERVER.url + '/azureStorages/imagenes/download/';
			return baseUrl + resource;
		}
		
		function download( url, file, defaultImage, promise ) {
			var defer = $q.defer();
			if(promise){
				defer = promise;
			}
			if(_.findIndex(files(), {url: url}) < 0){
				getPermission().then(() => {
					if(cacheDirectory){
						if(_.findIndex(transfering, {
								url: url
							}) < 0){
							var options = {};
							var fileUrl = cacheDirectory + file;
							transfering.push({
								id: _.uniqueId('file_'),
								url: url
							});
							$cordovaFileTransfer.download(url, cacheDirectory + file, options, true)
								.then(() => {
									addFile({
										url: url,
										file: file
									});
									
									defer.resolve(fileUrl, url);
									// Success!
								}, err => {
									defer.reject(defaultImage);
									$log.error(err);
									// $toast.error('Hubo un problema al intentar descargar un archivo');
									// Error
								}, () => {
								}).finally(() => {
								transfering = _.remove(transfering, o => {
									return o.url === url;
								});
							});
						}
					} else{
						defer.reject(defaultImage, url);
						$toast.info('No se logró cargar el motor');
					}
				}).catch(() => {
					defer.reject(url, url);
					// $toast.info('No hay permisos para guardar caché');
				});
			} else{
				var fileIndex = _.find(files(), {url: url});
				$cordovaFile.checkFile(cacheDirectory, file)
					.then(() => {
						$log.debug('Fichero Existe: ' + cacheDirectory + fileIndex.file);
						defer.resolve(cacheDirectory + fileIndex.file, url);
					})
					.catch(() => {
						$log.debug('Fichero no existe');
						var fss = _.remove(files(), n => {
							return n.url == url;
						});
						files(fss);
						download(url, file, defaultImage, defer);
					});
				
				
			}
			return defer.promise;
		}
		
		function upload( uri, fileName ) {
			var defer = $q.defer();
			var target = SERVER.url + '/containers/imagenes/upload';
			
			$cordovaFileTransfer.upload(target, uri, {
					fileName: fileName
				}, true)
				.then(res => {
					var fileResponse = angular.fromJson(res.response);
					defer.resolve(fileResponse);
				}, null, progress => {
					$log.debug(progress);
				})
				.catch(err => {
					$toast.error('Problema subiendo el archivo seleccionado (API_UPLOAD_' + err.responseCode + ')');
					$log.error(err);
					defer.reject(err);
				});
			return defer.promise;
		}
		
		function multiupload( files, d ) {
			var defer = d || $q.defer();
			var _fs = angular.copy(files);
			
			function _upload( _files ) {
				$log.debug('Subiendo Archivos', _files);
				if(_files.length > 0){
					window.resolveLocalFileSystemURI(
						_files[0],
						res => {
							upload(_files[0], res.name)
								.then(fileModel => {
										var f = _files.shift();
										$log.debug('Archivo subido', fileModel);
										defer.notify({
											progress: 100,
											file: f,
											name: res.name,
											lng: _files.length,
											fileModel: fileModel
										});
										_upload(_files);
									},
									err => {
										$log.error(err);
										defer.reject(err);
									});
						},
						function( err ) {
							$log.error(err);
							defer.reject(err);
						});
				} else{
					defer.resolve();
				}
			}
			
			_upload(_fs, defer);
			return defer.promise;
		}
		
		function storageUrl( resource, defaultImage ) {
			var defer = $q.defer();
			var baseUrl = 'https://ucb.blob.core.windows.net/imagenes/';
			var url = '';
			$ionicPlatform.ready(() => {
				// will execute when device is ready, or immediately if the device is already ready.
				if(resource && resource.length > 0){
					url = baseUrl + resource;
					download(url, resource, defaultImage || 'assets/img/default.jpg').then(url => {
						$log.debug(url);
						defer.resolve(url);
					}).catch(url => {
						$log.error(url);
						defer.reject(url);
					});
				} else{
					defer.reject(url);
				}
			});
			return defer.promise;
		}
		
		return {
			download: download,
			upload: upload,
			multiupload: multiupload,
			storageUrl: storageUrl,
			sourceUrl: sourceUrl
		};
	});
