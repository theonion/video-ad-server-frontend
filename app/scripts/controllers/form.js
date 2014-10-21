'use strict';

angular.module('video-ads')
	.controller('FormCtrl', function ($scope, $http, $routeParams, videoAdService) {
		$('.user-help').popover({'content': 'Available keys are: "city", "region", and "country_code"'});

		$scope.videoad = {};
		$scope.getAndInitVideoAd = function(videoAdId){
			videoAdService.one(videoAdId).get().then(
				function(data){
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
			}, function(data, status){
				console.log(data);
			});
		}

		$scope.addTargetingKey = function(key){
			$scope.targetingKey = key;
		};

		$scope.saveVideoAd = function(){
			var data = $scope.videoad;

			videoAdService.one($routeParams.videoAdId).PUT(data).then(
				function(data){
					$(".alert-success").fadeIn().delay(1000).fadeOut();
				}, function(data){
					$(".alert-danger").fadeIn().delay(1000).fadeOut();
				}
			);
		}
		if (_.isUndefined($routeParams.videoAdId)){
			$scope.getAndInitVideoAd($routeParams.videoAdId);
		}
	});