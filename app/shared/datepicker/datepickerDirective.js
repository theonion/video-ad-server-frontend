'use strict';
angular.module('video-ads')
  .directive('datepicker', ['$filter', function($filter) {
    return {
      scope: {
        'date': '=',
      },
      replace: true,
      require:'ngModel',
      template: '<input class="form-control" ng-model="date" type="text"/>',
      link: function(scope, element, attrs, ngModel){
        scope.required = attrs.required || false;

        var startDate = new Date();
        if (attrs.time === 'startOfDay') {
          startDate.setMinutes(0);
          startDate.setHours(0);
          startDate.setSeconds(0);
        }
        if (attrs.time === 'endOfDay') {
          startDate.setMinutes(59);
          startDate.setHours(23);
          startDate.setSeconds(59);
        }

        element.datetimepicker({
          format: 'Y-m-d h:i A',
          startDate: startDate,
          step: 30
        });
        var formatter = function(value){
          return $filter('convertToLocal')(value);
        };
        ngModel.$formatters.unshift(formatter);

        ngModel.$parsers.unshift(function(value){
          var momentFormat = 'YYYY-MM-DDTHH:mm:DDZZ';
          if (value){
            return moment(value).format(momentFormat);
          } else {
            return moment().format(momentFormat);
          }
        });
      }
    };
  }]);
