'use strict';

angular.module('video-ads')
  .controller('VideoAdDetailController', ['$scope', '$routeParams', 'videoAdService', '$location', '$rootScope', function($scope, $routeParams, videoAdService, $location, $rootScope) {
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
    };

    $scope.addTargetingKey = function(key) {
      $scope.targetingKey = key;
    };

    $scope.saveVideoAd = function() {
      if ($scope.videoAdDetailForm.$valid){
        if (!_.isUndefined($routeParams.videoAdId)) {
          $scope.videoad.save().then(function(){
            $('.alert-success').fadeIn().delay(1000).fadeOut();
          }, function(){
            $('.alert-danger').fadeIn().delay(1000).fadeOut();
          });
        } else {
          videoAdService.post($scope.videoad)
            .then(function(data) {
                $('.alert-success').fadeIn().delay(1000).fadeOut(500,
                  function(){
                    $location.path('/edit/' + data.id);
                    $scope.$apply();
                  });
            },
            function(){
              $('.alert-danger').fadeIn().delay(1000).fadeOut();
            });
        }
      } else {
        $('.alert-danger').fadeIn().delay(1000).fadeOut();
      }
    };

    $scope.$on('save-video-ad', function(){
      $scope.saveVideoAd();
    });

    $scope.addVideo = function() {
      $scope.videoad.videos.push({
        adId: $scope.videoad.id
      });
    };
    $scope.getAndInitVideoAd();
  }]);
