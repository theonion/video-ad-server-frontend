'use strict';

angular.module('video-ads')
	.directive('videoUpload', function ($http, $window, $timeout) {
		return {
			templateUrl: STATIC_URL + 'partials/videoUpload.html',
			scope: {
				'videoad': '='
			},
			link: function($scope, elem, attrs){
				$scope.statuses = {
					0: "Not Started",
					1: "Complete",
					2: "In Progress",
					3: "Failed"
				};

				var fileInput = elem.find('input[type="file"]');
				var button = elem.find('label.btn');
				var progressEl = elem.find('div.progress');
				var progressBar = elem.find('div.progress-bar');
				var progressText = elem.find('div.progress span');
				var fakeInput = elem.find('input.fake-input');
				$scope.lastProgress = 0;

				fileInput.bind('change', function(e) {
					var file;
					console.log("HELLO")
					console.log(e);

					if(e.target.files.length !== 0) {
						file = e.target.files[0];

						// We have a file upload limit of 300MB
						if (file.size > (1024 * 1024 * 1024)) {
							alert("Upload file cannot be larger than 300MB.");
							return;
						}

						if (file.type.indexOf('video/') !== 0) {
							alert("You must upload a video file.");
							return;
						}

					} else {
						return;
					}

					$scope.videoad.video.name = file.name;

					if($scope.videoad.video.id === undefined) {
						console.log("posting");
						$http({
							method: "POST",
							url: "/videos/new",
							headers: {'Content-Type': 'application/x-www-form-urlencoded'},
							data: $.param({'filename': file.name})
						}).success(function(data){
							console.log(data);
							$scope.videoad.video.id = data.id;
							//TODO
							//self.options.callback(data.id);
							upload();
						});
					} else {
						upload();
					}
				});

				function upload(){
					$scope.videoad.video.status = 2;
					$scope.uploading = true;
					var file = $(fileInput)[0].files[0];
					var url = "https://" + $window.videoAttrs.bucket + ".s3.amazonaws.com";

					var formData = new FormData();
					var path = $window.videoAttrs.directory + "/" + $scope.videoad.video.id + "/original";
					var filename = "s3://" + $window.videoAttrs.bucket + "/" + path;

					formData.append('key', path);
					formData.append('AWSAccessKeyId', $window.videoAttrs.AWSAccessKeyId);
					formData.append('acl', $window.videoAttrs.acl);
					formData.append('success_action_status', $window.videoAttrs.success_action_status);
					formData.append('policy', $window.videoAttrs.policy);
					formData.append('signature', $window.videoAttrs.signature);
					formData.append('file', file);

					setProgress(0);
					setProgressText("Uploading...");
					progressBar.removeClass('progress-bar-success');
					// Todo: handle failure

					jQuery.ajax(url, {
						processData: false,
						contentType: false,
						data: formData,
						type: "POST",
						xhr: function() {
							var req = $.ajaxSettings.xhr();
							if (req) {
								req.upload.addEventListener('progress', function(e) {
								var percent = (e.loaded / e.total ) * 100;
								setProgress(percent);
								}, false);
							}
							$scope.req = req;
							return req;
						},
						success: function(data) {
							setProgress(100);
							fakeInput.val(file.name);
							$http({
								url: '/videos/' + $scope.videoad.video.id ,
								method: 'POST',
								data: $.param({
									'filename': file.name
								}),
								headers: {'Content-Type': 'application/x-www-form-urlencoded'}
							});
							$http({
								url: '/videoads/' + $scope.videoad.id + "/save",
								method: 'POST',
								data: $.param({
									'videoId': $scope.videoad.video.id
								}),
								headers: {'Content-Type': 'application/x-www-form-urlencoded'}
							});
							encode();
						}
					});
				}

				function encode(){
					$scope.encoding = true;
					progressBar.addClass('progress-bar-success');
					setProgressText("Encoding...");
					setProgress(5);
					// Kick off the zencoder job
					$http({
						url: '/videos/' + $scope.videoad.video.id + "/encode",
						method: 'POST',
						data: {
							'name': $scope.videoad.video.name,
						}
					}).success(function(data){
						$scope.videoad.video.job_id = data.id;
						updateEncodeProgress();
					}).error(function(){
						$(".alert-danger").fadeIn().delay(1000).fadeOut()
					});
				}

				$scope.chooseFile = function(){
					console.log("chooseFile");
					$(fileInput).click();
				}

				$scope.clearFile = function(){
					$scope.videoad.video = {}
				}

				function abortUpload(){
					setProgress(0);
					$scope.req && $scope.req.abort();
					$scope.videoad.video = {}
					setProgress(0);
				}

				function abortEncode(){
					$.ajax("https://app.zencoder.com/api/v2/jobs/" + $scope.videoad.video.job_id + "/cancel.json?api_key=" + $window.videoAttrs.zencoderApiKey, {
						type: "PUT",
						success: function(data) {
							$scope.videoad.video.status = 3;
							fakeInput.val("Encoding failed! Please try again.");
						}
					});
				}

				$scope.abort = function(){
					if($scope.encoding){
						abortEncode();
						return;
					}else{
						abortUpload();
						return;
					}
				}

				function setProgress(progress){
					if (progress === 0 || progress === 100) {
						progressEl.hide();
						return;
					}
					if($scope.lastProgress === 0 || Math.abs(progress - $scope.lastProgress) > 2) {
						progressBar.css('width', Math.floor(progress) + '%');
						$scope.lastProgress = progress;
						progressEl.show();
					}
				}

				function setProgressText(text){
					progressText.html(text);
				}

				function updateEncodeProgress(){
					progressBar.addClass('progress-bar-success');

					delete $http.defaults.headers.common['X-Requested-With'];
					$http({
						url: "https://app.zencoder.com/api/v2/jobs/" + $scope.videoad.video.job_id + "/progress.json",
						method: 'GET',
						params: {
							api_key: $window.videoAttrs.zencoderApiKey
						},
						useXDomain: true
					}).success(function(data){
						if(data.state === "waiting" || data.state === "pending" || data.state === "processing") {
							$scope.videoad.video.status = 2;
							if(data.progress > 5) {
								setProgress(data.progress);
								$timeout(updateEncodeProgress, 500);
							} else {
								$timeout(updateEncodeProgress, 2000);
							}
						} else {
							setProgress(0);
							if(data.state == "finished") {
								$scope.videoad.video.status = 1;
							}
							if(data.state == "failed" || data.state == "cancelled") {
								$scope.videoad.video.status = 3;
								fakeInput.val("Encoding failed! Please try again.");
							}
						}
					}).error(function(data){
						$(".alert-danger").fadeIn().delay(1000).fadeOut()
					});
				}

				var initialCheckRan = false;
				$scope.$watch('videoad.video', function(){
					if($scope.videoad.video && $scope.videoad.video.job_id && !initialCheckRan){
						updateEncodeProgress();
						initialCheckRan = true;
					}
				})


			}
		}
	});