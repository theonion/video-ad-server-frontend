'use strict';

angular.module('video-ads')
  .controller('FormCtrl', function ($scope, $routeParams, $location, videoAdService) {
    $('.user-help').popover({
      'content': 'Available keys are: "city", "region", and "country_code"'
    });
    $scope.success = false;
    $scope.errors = false;
    $scope.videoad = {};
    $scope.getAndInitVideoAd = function (videoAdId) {
      videoAdService.one(videoAdId).get().then(
        function (data) {
          $scope.videoad = data;
          //set some defaults?
          if (!data.targeting) {
            $scope.videoad.targeting = {};
          }
          if (!data.targeting.page) {
            $scope.videoad.targeting.page = [];
          }
          if (!data.targeting.user) {
            $scope.videoad.targeting.user = [];
          }
          $scope.videoad.video = data.video || {};
          var pickerOptions = {
            timePicker: true,
            timePickerIncrement: 30,
            format: 'YYYY-MM-DD hh:mm A'
          };

          var inputVal = "";
          if ($scope.videoad.start) {
            pickerOptions.startDate = moment.utc($scope.videoad.start).local().format('YYYY-MM-DD hh:mm A');
            inputVal += pickerOptions.startDate;
          }

          if ($scope.videoad.end) {
            pickerOptions.endDate = moment.utc($scope.videoad.end).local().format('YYYY-MM-DD hh:mm A');
            inputVal += " - " + pickerOptions.endDate;
          }

          $('#runtime').val(inputVal);

          $('#runtime').daterangepicker(pickerOptions, function (start, end) {
            $scope.videoad.start = moment(start, 'YYYY-MM-DD hh:mm A').utc().format();
            $scope.videoad.end = moment(end, 'YYYY-MM-DD hh:mm A').utc().format();
          });
        },
        function (data) {
          console.log(data);
        }
      );
    };

    $scope.addTargetingKey = function (key) {
      $scope.targetingKey = key;
    };

    $scope.saveVideoAd = function () {
    	if (!_.isUndefined($scope.videoad.save)){
	    	$scope.videoad.save();
    	} else {
	    	videoAdService.post($scope.videoad)
	    	.then(function (data) {
	    		$location.path('/edit/' + data.id);
	    	});
    	}
    };
    if (!_.isUndefined($routeParams.videoAdId)) {
      $scope.getAndInitVideoAd($routeParams.videoAdId);
    }
  });