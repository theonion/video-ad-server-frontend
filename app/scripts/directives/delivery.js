'use strict';

angular.module('video-ads')
  .directive('delivery', function() {
    return {
      templateUrl: 'views/partials/delivery-progress.html',
      scope: {
          'videoad': '='
      }
    }
  });