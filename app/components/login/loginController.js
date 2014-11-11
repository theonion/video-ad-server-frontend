'use strict';

angular.module('video-ads')
    .controller('LoginCtrl', function($scope, authService, $location, $rootScope) {
        $rootScope.showSearchBar = false;
        $rootScope.showSaveButton = false;
        $scope.username = '';
        $scope.password = '';
        $scope.submitLogin = function() {
            authService.login($scope.username, $scope.password);
        };
    });
