'use strict';

angular.module('video-ads')
    .controller('ExclusionCtrl', function ($scope, $http, $routeParams) {
        $scope.exclusion = {};

        $scope.page_targets = [
            'dfp_adchannel',
            'dfp_pagetype',
            'dfp_viewport',
            'dfp_channel',
            'dfp_articletype',
            'dfp_site',
            'dfp_articleid'
        ];
        $scope.user_targets = [
            'city',
            'region',
            'country_code'
        ];

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
                $('.alert-success').fadeIn().delay(1000).fadeOut()
            }).error(function(data){
                $('.alert-danger').fadeIn().delay(1000).fadeOut()
            });
        };
    });