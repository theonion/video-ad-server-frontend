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
        scope.required = attrs.required || false;
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
