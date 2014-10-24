'use strict';
//TODO: Change the active keyword to something more descriptive
angular.module('video-ads')
  .controller('ListCtrl', function ($scope, $location, videoAdService) {
    $scope.videoAds = [];
    $scope.params = {};
    $scope.showSearchBar = true;
    $scope.params.filter = 'active';

    $scope.updateList = function () {
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

    $scope.updateList();

    $scope.newVideoAd = function () {
      $location.path('/new/');
    };

    $scope.changeOrder = function (newOrder, reverse) {
      $scope.params.orderBy = newOrder;
      if (reverse) {
        $scope.params.orderBy = "-" + newOrder;
      }
      //Setting currentPage to 1 will trigger the currentPage watch to fire
      $scope.currentPage = 1;
      $scope.updateList();
    };

    $scope.changeFilter = function (newFilter) {
      //This will trigger the above watch statement, which will trigger an updateList()
      $scope.params.filter = newFilter;
      $scope.currentPage = 1;
      $scope.updateList();
    };

    $scope.changePage = function () {
      $scope.params.page = $scope.currentPage;
      $scope.updateList();
    };

    $scope.search = function () {
      $scope.params.search = $scope.searchTerm;
      $scope.updateList();
    };
  });