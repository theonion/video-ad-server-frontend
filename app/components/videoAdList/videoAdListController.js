'use strict';
angular.module('video-ads')
  .controller('VideoAdListController', ['$scope', '$location', 'videoAdService', '$routeParams', '$rootScope', function($scope, $location, videoAdService, $routeParams, $rootScope) {
    $scope.videoAds = [];
    $rootScope.showSearchBar = true;
    $rootScope.showSaveButton = false;
    if (_.isEmpty($location.search())) {
      $scope.params = {
        'page_size': 8,
        'filter': 'active'
      };
    } else {
      $scope.params = $location.search();
    }
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.loading = true;
    $scope.errors = false;

    $scope.updateList = function() {
      if ($scope.params.filter === undefined) {
        $scope.params.filter = 'active';
      }
      $location.search($scope.params);
      videoAdService.getList($scope.params).then(function(data) {
          $scope.videoAds = data;
          $scope.totalItems = data.meta.count;
          $scope.loading = false;
        },
        function() {
          $scope.loading = false;
          $scope.errors = true;
        },
        function() {
          $scope.loading = true;
        });
    };

    $scope.newVideoAd = function() {
      $location.path('/new/');
    };

    $scope.changeOrder = function() {
      $scope.params.orderBy = $scope.orderBy;
      if ($scope.reverse) {
        $scope.params.orderBy = '-' + $scope.orderBy;
      }
      $scope.currentPage = 1;
      $scope.params.page = 1;
      $scope.updateList();
    };

    $scope.changeFilter = function() {
      $scope.currentPage = 1;
      $scope.params.page = 1;
      $scope.updateList();
    };

    $scope.pageChanged = function(newPage) {
      $scope.currentPage = newPage;
      $scope.params.page = $scope.currentPage;
      $scope.updateList();
    };

    $rootScope.$on('search', function(event, searchTerm) {
      $scope.params.search  = searchTerm;
      event.preventDefault();
      $scope.updateList();
    });

    $rootScope.$on('clearSearch', function(){
      $scope.params = _.omit($scope.params, 'search');
      $scope.currentPage = 1;
      $scope.params.page = 1;
      $scope.updateList();
    });

    $scope.updateList();

  }]);
