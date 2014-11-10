'use strict';

angular.module('video-ads')
    .controller('LoginCtrl', function($scope, authService, $location, $rootScope) {
        $rootScope.$emit('hide_search_bar');
        $scope.username = '';
        $scope.password = '';
        $scope.submitLogin = function() {
            authService.login($scope.username, $scope.password);
        };
    });
