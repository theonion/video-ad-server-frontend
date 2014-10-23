'use strict';

angular.module('video-ads')
  .controller('ListCtrl', function ($scope, $location, videoAdService) {
    $scope.videoAds = [];
    $scope.params = {};
    $scope.showSearchBar = true;
    $scope.params.filter = 'active';

    $scope.updateList = function () {
      $scope.params = _.extend($scope.params, $location.search());
      if ($scope.params.filter === undefined) {
        $scope.params.filter = "active";
      }
      videoAdService.getList([$scope.params]).then(function (data) {
        $scope.videoAds = data;
        $scope.totalItems = data.meta.count;
      }, function (error) {
        console.log(error);
      });
    };
    $scope.newVideoAd = function () {
      $location.path('/new/');
    };

    $scope.changePage = function (page) {
      $scope.params.page = page;
      $scope.updateList();
    };

    $scope.$watch('params.filter', function () {
      $scope.params.page = 1;
      $scope.updateList();
    });

    $scope.updateList();
  });