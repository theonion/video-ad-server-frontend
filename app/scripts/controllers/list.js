'use strict';

angular.module('video-ads')
  .controller('ListCtrl', function ($scope, $location, videoAdService) {
    $scope.videoads = [];
    $scope.params = {};
    $scope.showSearchBar = true;
    $scope.params.filter = 'active';

    $scope.updateList = function () {
      $scope.params = _.extend($scope.params, $location.search());
      if ($scope.params.filter === undefined) {
        $scope.params.filter = "active";
      }
      videoAdService.getList([$scope.params]).then(function (data) {
        $scope.videoads = data;
        $scope.totalItems = data.meta.count;
      }, function (error) {
        console.log(error);
      });
    };
    
    $scope.newVideoAd = function () {
      $location.path('/add/');
    };

    $scope.changePage = function (page) {
      $scope.params.page = page;
      $scope.updateList();
    };

    $scope.$watch('params.filter', function (oldValue, newValue) {
      $scope.params.page = 1;
      $scope.updateList();
    });

    $scope.updateList();
  });
