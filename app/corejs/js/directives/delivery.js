'use strict';

angular.module('video-ads')
  .directive('delivery', function() {
    return {
      templateUrl: STATIC_URL + 'partials/delivery-progress.html',
      scope: {
          'videoad': '='
      }
    }
  });