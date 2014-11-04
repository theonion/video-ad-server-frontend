'use strict';

angular.module('video-ads')
  .directive('navBar', function() {
    return {
        'restrict': 'E',
        'templateUrl': 'views/partials/navbar.html',
        'controller': function($scope, $rootScope) {
            $scope.show_search_bar = false;
            $scope.searchTerm = "";
            $rootScope.$on("hide_search_bar", function(){
                $scope.show_search_bar = false;
            });

            $rootScope.$on("show_search_bar", function(){
                $scope.show_search_bar = true;
            });

            //Emits a search signal, that is picked up by list.js
            $scope.search = function(){
                $rootScope.$emit("search", $scope.searchTerm);
            }
        }
    }
  });