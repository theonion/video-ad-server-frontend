'use strict';

angular.module('video-ads')
    .controller('ExclusionCtrl', function ($scope, $http) {
        $scope.exclusion = {};
        $scope.exclusion.targeting = {};
        $scope.exclusion.targeting.page = [];
        $scope.exclusion.targeting.user = [];


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
            url: '/api/exclusion-rules/' + '1'  + '/'
        }).then(function(response){
            $scope.exclusion = response.data;
        }, function (error){
          console.log(error);
        });

        $scope.save = function() {
            var data = $scope.exclusion;
            $http({
                method: 'PUT',
                url: '/api/exclusion-rules/' + $scope.exclusion.id + '/',
                data: data
            }).success(function(){
                $('.alert-success').fadeIn().delay(1000).fadeOut();
            }).error(function(){
                $('.alert-danger').fadeIn().delay(1000).fadeOut();
            });
        };
    });
