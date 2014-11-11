'use strict';
angular.module('video-ads')
  .directive('datepicker', function() {
    return {
      link: function(scope, element){
        element.datetimepicker();
      }
    };
  });
