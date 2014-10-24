'use strict';
angular.module('video-ads')
  .controller('ListCtrl', function($scope, $location, videoAdService) {
    $scope.videoAds = [];
    if (_.isEmpty($location.search())) {
      $scope.params = {};
    } else {
      $scope.params = $location.search();
    }
    $scope.show_search_bar = true;
    $scope.searchTerm = "";
    $scope.currentPage = 1;
    $scope.totalItems = 0;

    $scope.updateList = function() {
      if ($scope.params.filter === undefined) {
        $scope.params.filter = "active";
      }
      $location.search($scope.params);
      videoAdService.getList([$scope.params]).then(function(data) {
        $scope.videoAds = data;
        $scope.totalItems = data.meta.count;
      }, function(error) {
        console.log(error);
      });
    };

    $scope.updateList();

    $scope.newVideoAd = function() {
      $location.path('/new/');
    };

    $scope.changeOrder = function() {
      $scope.params.orderBy = $scope.orderBy;
      if ($scope.reverse) {
        $scope.params.orderBy = "-" + $scope.orderBy;
      }
      //Setting currentPage to 1 will trigger the currentPage watch to fire
      $scope.currentPage = 1;
      $scope.updateList();
    };

    $scope.changeFilter = function() {
      //This will trigger the above watch statement, which will trigger an updateList()
      $scope.currentPage = 1;
      $scope.updateList();
    };

    $scope.changePage = function() {
      $scope.params.page = $scope.currentPage;
      $scope.updateList();
    };

    $scope.search = function() {
      $scope.params.search = $scope.searchTerm;
      $scope.updateList();
    };
  });