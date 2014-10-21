'use strict';

angular.module('video-ads')
    .controller('ExclusionCtrl', function ($scope, $http, $routeParams) {
        $scope.exclusion = {};
        $scope.successful = true;
        $scope.errors = false;

        $http({
            method: 'GET',
            url: '/api/v1/exclusions/' + $routeParams.exclusionName + '/'
        }).success(function(data){
            $scope.exclusion = data;
        });

        $scope.save = function() {
            var data = $scope.exclusion;
            $http({
                method: 'PATCH',
                url: '/api/v1/exclusions/' + $routeParams.exclusionName + '/',
                data: data
            }).success(function(data){
                $scope.successful = true;
            }).error(function(data){
                $scope.errors = true;
            });
        };
    });