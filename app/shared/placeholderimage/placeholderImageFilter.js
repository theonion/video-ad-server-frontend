'use strict';

angular.module('video-ads')
	.filter('placeholder', function(placeholderUrl) {
    return function (input) {
      if (input) {
        return input;
      } else {
        return placeholderUrl;
      }
    };
  });
