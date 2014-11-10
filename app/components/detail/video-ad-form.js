'use strict';

angular.module('video-ads')
  .controller('FormCtrl', ['$scope', '$routeParams', 'videoAdService', '$location', '$rootScope', function($scope, $routeParams, videoAdService, $location, $rootScope) {
    $rootScope.$emit('hide_search_bar');
    $scope.success = false;
    $scope.errors = false;
    $scope.videoad = {};
    //TODO: Magic strings could be moved into constants?
    $scope.page_targets = [
      'dfp_adchannel',
      'dfp_pagetype',
      'dfp_viewport',
      'dfp_channel',
      'dfp_articletype',
      'dfp_site',
      'dfp_articleid'
    ];
    $scope.user_targets = [
      'city',
      'region',
      'country_code'
    ];

    $scope.initVideoAd = function() {
      if (!$scope.videoad.targeting) {
        $scope.videoad.targeting = {};
      }
      if (!$scope.videoad.targeting.page) {
        $scope.videoad.targeting.page = [];
      }
      if (!$scope.videoad.targeting.user) {
        $scope.videoad.targeting.user = [];
      }
      $scope.videoad.video = $scope.videoad.video || {};
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

      $('#runtime').daterangepicker(pickerOptions, function(start, end) {
        $scope.videoad.start = moment(start, 'YYYY-MM-DD hh:mm A').utc().format();
        $scope.videoad.end = moment(end, 'YYYY-MM-DD hh:mm A').utc().format();
      });
    };

    $scope.getAndInitVideoAd = function() {
      if (_.isUndefined($routeParams.videoAdId)) {
        $scope.videoAdId = {};
        $scope.initVideoAd();
      }
      videoAdService.one($routeParams.videoAdId).get().then(
        function(data) {
          $scope.videoad = data;
          $scope.initVideoAd();
        },
        function(data) {
          console.log(data);
        }
      );
    };

    $scope.addTargetingKey = function(key) {
      $scope.targetingKey = key;
    };

    $scope.saveVideoAd = function() {
      if (!_.isUndefined($routeParams.videoAdId)) {
        $('.alert-success').fadeIn().delay(1000).fadeOut();
        $scope.videoad.save();
      } else {
        $('.alert-danger').fadeIn().delay(1000).fadeOut();
        videoAdService.post($scope.videoad)
          .then(function(data) {
            $location.path('/edit/' + data.id);
          });
      }
    };

    $scope.addVideo = function() {
      $scope.videoad.videos.push({
        adId: $scope.videoad.id
      });
    };
    $scope.getAndInitVideoAd();
  }]);
