'use strict';

angular.module('video-ads')
	.filter('placeholder', function() {
    return function (input) {
      if (input) {
        return input;
      } else {
        return 'static/images/placeholder.jpg';
      }
    };
  });
