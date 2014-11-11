'use strict';
angular.module('video-ads')
  .directive('datepicker', ['$filter', function($filter) {
    return {
      scope: {
        'date': '='
      },
      replace: true,
      template: '<input ng-model="date" type="text"/>',
      link: function(scope, element){
        element.datetimepicker({format: 'Y-m-d h:m'});
        scope.$watch('date', function(){
          scope.date = $filter('convertToLocal')(scope.date);
        });
      }
    };
  }]);
