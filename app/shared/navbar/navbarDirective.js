'use strict';

angular.module('video-ads')
  .directive('navBar', function() {
    return {
        'restrict': 'E',
        'templateUrl': 'shared/navbar/navbar.html',
        'controller': function($scope, $rootScope) {
            $scope.searchTerm = "";
            $scope.saveVideoAd = function(){
                $rootScope.$emit('save-video-ad');
            };
            //Emits a search signal, that is picked up by list.js
            $scope.search = function(){
                $rootScope.$emit("search", $scope.searchTerm);
            };
        }
    }
  });
