'use strict';
angular.module('video-ads')
  .directive('datepicker', ['$filter', function($filter) {
    return {
      scope: {
        'date': '='
      },
      replace: true,
      require:'ngModel',
      template: '<input class="form-control" ng-model="date" type="text"/>',
      link: function(scope, element, attrs, ngModel){
        element.datetimepicker({
          format: 'Y-m-d h:i A',
          startDate: new Date(),
          step: 15
          });
        var formatter = function(value){
          return $filter('convertToLocal')(value);
        };
        ngModel.$formatters.unshift(formatter);

        ngModel.$parsers.unshift(function(value){
          return moment(value).format('YYYY-MM-DDTHH:mm:DDZZ');
        });
      }
    };
  }]);
