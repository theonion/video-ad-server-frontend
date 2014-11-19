'use strict';

angular.module('video-ads')
  .controller('VideoAdDetailController', ['$scope', '$routeParams', 'videoAdService', '$location', '$rootScope', 'AlertEvents', '$timeout', function($scope, $routeParams, videoAdService, $location, $rootScope, AlertEvents, $timeout) {
    $rootScope.showSaveButton = true;
    $rootScope.showSearchBar = false;
    $scope.success = false;
    $scope.errors = false;
    $scope.videoad = {};
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

    var defaultPixelsObject = {
      'impression': [],
      'clickThrough': [],
      'complete': [],
      'firstQuartile': [],
      'midpoint': [],
      'start': [],
      'thirdQuartile': []
    };

    $scope.getAndInitVideoAd = function() {
      if (_.isUndefined($routeParams.videoAdId)) {
        $scope.videoad = {};
        $scope.videoad.id = null;
        $scope.initVideoAd();
      } else {
        videoAdService.one($routeParams.videoAdId).get().then(
          function(data) {
            $scope.videoad = data;
            $scope.initVideoAd();
          },
          function(data) {
            console.log(data);
          }
        );
      }
    };


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
      $scope.videoad.videos = $scope.videoad.videos || [];
      $scope.videoad.pixels = $scope.videoad.pixels || defaultPixelsObject;
    };

    $scope.addTargetingKey = function(key) {
      $scope.targetingKey = key;
    };

    $scope.saveVideoAd = function() {
      if ($scope.videoAdDetailForm.$valid) {
        if (!_.isUndefined($routeParams.videoAdId)) {
          $scope.videoad.save().then(function() {
            $rootScope.$broadcast(AlertEvents.SUCCESS, 'Saved');
            $timeout(function() {
              $rootScope.$broadcast(AlertEvents.CLEAR);
            }, 2000);
          }, function() {
            $rootScope.$broadcast(AlertEvents.ERROR, 'Something went wrong with saving the video. Please call your friendly sysadmin.');
            $timeout(function() {
              $rootScope.$broadcast(AlertEvents.CLEAR);
            }, 2000);
          });
        } else {
          videoAdService.post($scope.videoad)
            .then(
              function(data) {
                $rootScope.$broadcast(AlertEvents.SUCCESS, 'Saved');
                $timeout(function() {
                  $location.path('/edit/' + data.id + '/');
                  $scope.$apply();
                }, 2000);
              },
              function() {
                $rootScope.$broadcast(AlertEvents.ERROR, 'Something went wrong with saving the video. Please call your friendly sysadmin.');
                $timeout(function() {
                  $rootScope.$broadcast(AlertEvents.CLEAR);
                }, 2000);
              });
        }
      } else {
        $rootScope.$broadcast(AlertEvents.ERROR, 'Please fill in all required fields.');
        $timeout(function() {
          $rootScope.$broadcast(AlertEvents.CLEAR);
        }, 2000);
      }
    };

    $scope.$on('save-video-ad', function() {
      $scope.saveVideoAd();
    });

    $scope.addVideo = function() {
      $scope.videoad.videos.push({
        adId: $scope.videoad.id
      });
    };
    $scope.getAndInitVideoAd();
  }]);
