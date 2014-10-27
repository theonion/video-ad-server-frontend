'use strict';

angular.module('video-ads')
    .controller('LoginCtrl', function($scope, loginService) {
        $scope.username = "";
        $scope.password = "";
        $scope.submitLogin = function() {
            loginService.login($scope.username, $scope.password);
        }
    });