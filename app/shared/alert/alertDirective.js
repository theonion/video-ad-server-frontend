'use strict';

angular.module('video-ads')
  .constant('AlertEvents', {
    INFO: 'alert-info',
    ERROR: 'alert-error',
    SUCCESS: 'alert-success',
    CLEAR: 'alert-clear'
  })
  .directive('alert', function(){
    return {
      templateUrl: 'shared/alert/alert.html',
      restrict:'E',
      controller: function($scope, AlertEvents){

        $scope.$on(AlertEvents.INFO, function(event, message){
          $scope.alertStatus = {info: true};
          $scope.infoMessage = message;
        });

        $scope.$on(AlertEvents.ERROR, function(event, message){
          $scope.alertStatus = {error:true};
          $scope.errorMessage = message;
        });

        $scope.$on(AlertEvents.SUCCESS, function(event, message){
          $scope.alertStatus = { success: true};
          $scope.successMessage = message;
        });

        $scope.$on(AlertEvents.CLEAR, function(){
          $scope.alertStatus = null;
        });
      }
    };
  });
