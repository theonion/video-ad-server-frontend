'use strict';

angular.module('video-ads')
    .controller('LoginCtrl', function($scope, authService, $location) {
        $scope.username = "";
        $scope.password = "";
        $scope.submitLogin = function() {
            authService.login($scope.username, $scope.password)
            .success(function(){
                $location.path('/');
            });
        }
    });