'use strict';

angular.module('video-ads')
	.controller('FormCtrl', function ($scope, $http, $routeParams) {
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

	});