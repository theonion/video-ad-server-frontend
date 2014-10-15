'use strict';
angular.module('video-ads', ['ngCookies', 'ngRoute', 'ui.bootstrap', 'autocomplete'])
    .config([
        '$locationProvider',
        '$httpProvider',
        '$routeProvider',
        '$sceDelegateProvider',
        function($locationProvider, $httpProvider, $routeProvider, $sceDelegateProvider){

            $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://assets.onionstatic.com/videoads/*']);

            $locationProvider.html5Mode(true);

            $httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();

            $routeProvider
                .when('/', {templateUrl: 'views/partials/list.html', controller: 'ListCtrl', reloadOnSearch: false})
                .when('/edit/:videoAdId/', {templateUrl: STATIC_URL + 'partials/form.html', controller: 'FormCtrl'})
                .when('/exclusion/:exclusionName/', {templateUrl: STATIC_URL + 'partials/exclusion.html', controller: 'ExclusionCtrl'})
                .otherwise({redirectTo: '/'});
        }
    ]).
    filter('convertToLocal', function() {
        return function(input) {
            if (input) {
                return moment.utc(input).local().format('YYYY-MM-DD hh:mm A');
            }
            return input;
        };
    })
    .controller('ExclusionCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
        $scope.exclusion = {};
        $http({
            method: 'GET',
            url: '/api/v1/exclusions/' + $routeParams.exclusionName + '/'
        }).success(function(data){
            $scope.exclusion = data;
        });

        $scope.save = function() {
            var data = $scope.exclusion;
            $http({
                method: 'PATCH',
                url: '/api/v1/exclusions/' + $routeParams.exclusionName + '/',
                data: data
            }).success(function(data){
                $(".alert-success").fadeIn().delay(1000).fadeOut();
            }).error(function(data){
                $(".alert-danger").fadeIn().delay(1000).fadeOut();
            });
        };
    }])
    .controller('ListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
        $scope.videoads = [];
        $scope.params = {};

        $scope.update_list = function(){
        	$scope.params = _.extend($scope.params, $location.search());
            if ($scope.params.filter === undefined) {
                $scope.params.filter = "active";
            }
	        $http({
	            method: 'GET',
	            url: '/api/v1/videoads/',
	            params: $scope.params
	        }).success(function(data){
	            $scope.videoads = data.results;
	            $scope.totalItems = data.count;
	        }).error(function(data, status){
                console.log(status);
            });
        }

        $scope.newVideoAd = function(){
            $http({
                method: 'POST',
                url: '/new',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param({
                    name: $scope.new_video_ad_name
                })
            }).success(function(data){
                $location.path('/edit/' + data);
            });
        }

        $scope.changePage = function(page){
        	$location.search(_.extend($location.search(), {'page':page}));
			$scope.update_list();
        }
        $scope.changeFilter = function(key, value){
        	var obj = {};
        	obj[key] = value;
        	obj['page'] = 1;
        	$location.search(_.extend($location.search(), obj));
        	$scope.update_list();
        }

        $scope.update_list();

    }])
    .controller('FormCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
        $('.user-help').popover({'content': 'Available keys are: "city", "region", and "country_code"'});

        $scope.videoad = {};
        $http({
            method: 'GET',
            url: '/api/v1/videoads/' + $routeParams.videoAdId + '/'
        }).success(function(data){
            $scope.videoad = data;
            //set some defaults?

            if(!data.targeting){
                $scope.videoad.targeting = {};
            }
            if(!data.targeting.page){
                $scope.videoad.targeting['page'] = [];
            }
            if(!data.targeting.user){
                $scope.videoad.targeting['user'] = [];
            }
            $scope.videoad.video = data.video || {};
            var pickerOptions = {
                timePicker: true,
                timePickerIncrement: 30,
                format: 'YYYY-MM-DD hh:mm A'
            };

            var inputVal = "";
            if($scope.videoad.start){
                pickerOptions.startDate = moment.utc($scope.videoad.start).local().format('YYYY-MM-DD hh:mm A');
                inputVal += pickerOptions.startDate;
            }

            if($scope.videoad.end){
                pickerOptions.endDate = moment.utc($scope.videoad.end).local().format('YYYY-MM-DD hh:mm A');
                inputVal += " - " + pickerOptions.endDate;
            }

            $('#runtime').val(inputVal);

            $('#runtime').daterangepicker(pickerOptions, function(start, end){
                $scope.videoad.start = moment(start, 'YYYY-MM-DD hh:mm A').utc().format();
                $scope.videoad.end = moment(end, 'YYYY-MM-DD hh:mm A').utc().format();
            });
        }).error(function(data, status){
            console.log(data);
        });

        $scope.addTargetingKey = function(key){
            $scope.targetingKey = key;
        };

        $scope.saveVideoAd = function(){
            var data = $scope.videoad;
            $http({
                method: 'PATCH',
                url: '/api/v1/videoads/' + $routeParams.videoAdId + '/',
                data: data
            }).success(function(data){
                $(".alert-success").fadeIn().delay(1000).fadeOut();
            }).error(function(data){
                $(".alert-danger").fadeIn().delay(1000).fadeOut();
            });
        };

    }])
    .directive('targeting', function(){
        return {
            templateUrl: 'views/partials/targeting.html',
            scope: {
                'target': '=',
            },
            link: function($scope, elem, attrs){
                $scope.priorities = ["low", "medium", "high"];
                $scope.addTargetingGroup = function(){
                    $scope.target.push({"priority": "medium", "rules": [['', 'is', '']]});
                };
                $scope.removeTargetingGroup = function(index, confirm){
                	if(confirm){
	                    $scope.target.splice(index, 1);
	                    $("#confirm-remove-group-modal").modal('hide')
	                }else{
	                	$("#confirm-remove-group-modal-button").off('click');
	                	$("#confirm-remove-group-modal-button").click(function(){
	                		$scope.removeTargetingGroup(index, true);
	                		$scope.$apply();
	                	});
	                	$("#confirm-remove-group-modal").modal('show')
	                }
                }
                $scope.addTargetingRow = function(index){
                    $scope.target[index]["rules"].push(['', 'is', '']);
                }
                $scope.removeTargetingRow = function(parentIndex, index){
                    $scope.target[parentIndex]["rules"].splice(index, 1);
                    if($scope.target[parentIndex]["rules"].length == 0){
                        $scope.target.splice(parentIndex, 1);
                    }
                }
            }
        }
    })
    .directive('videoUpload', ['$http', '$window', '$timeout', function($http, $window, $timeout){
        return {
            templateUrl: STATIC_URL + 'views/partials/videoUpload.html',
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
    }])
    .directive('pixels', function(){
        return {
            templateUrl: STATIC_URL + 'views/partials/pixels.html',
            scope: {
                'videoad': '='
            },
            link: function($scope, elem, attrs){
                $("#pixels-wrapper").on('keypress', 'input', function(e){
                    console.log("input keyup!");
                    console.log(e)
                    if(e.keyCode === 13){
                        $(e.target).parent().find('button').click();
                        return false;
                    }

                })
                $scope.addPixel = function(e){
                    console.log("add pixel")
                    var bt = $(e.target);
                    var event = $(bt).parents('[data-event]').data('event');
                    var pixel = $(bt).parent().siblings('input').val()
                    if(pixel.length > 0){
                        console.log(pixel);
                        $scope.videoad.pixels[event].push(pixel)
                        $(bt).parent().siblings('input').val('')
                    }
                }

                $scope.removePixel = function(event, index){
                	console.log(event)
                	console.log(index)
                	$scope.videoad.pixels[event].splice(index, 1);
                }
            }
        }
    })
    .directive('delivery', function(){
        return {
            templateUrl: STATIC_URL + 'partials/delivery-progress.html',
            scope: {
                'videoad': '='
            }
        }
    });
