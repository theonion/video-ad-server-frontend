'use strict';

angular.module('video-ads')
	.filter('convertToLocal', function() {
    return function (input) {
      if (input) {
        return moment.utc(input).local().format('YYYY-MM-DD hh:mm A');
      }
      return input;
    };
  });