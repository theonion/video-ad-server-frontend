'use strict';
angular.module('video-ads')
  .controller('ListCtrl', ['$scope', '$location', 'videoAdService', '$routeParams', '$rootScope', function($scope, $location, videoAdService, $routeParams, $rootScope) {
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
    $scope.searchTerm = '';
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
        function(error) {
          $scope.loading = false;
          $scope.errors = true;
          console.log(error);
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
      //Setting currentPage to 1 will trigger the currentPage watch to fire
      $scope.currentPage = 1;
      $scope.updateList();
    };

    $scope.changeFilter = function() {
      //This will trigger the above watch statement, which will trigger an updateList()
      $scope.currentPage = 1;
      $scope.updateList();
    };

    $scope.pageChanged = function() {
      $scope.params.page = $scope.currentPage;
      $scope.updateList();
    };

    $rootScope.$on('search', function(event, searchTerm) {
      event.preventDefault();
      $scope.params.search = searchTerm;
      $scope.updateList();
    });

    $scope.updateList();

  }]);
