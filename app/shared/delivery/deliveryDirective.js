'use strict';

angular.module('video-ads')
  .directive('delivery', function() {
    return {
      templateUrl: 'shared/delivery/delivery-progress.html',
      scope: {
          'videoad': '='
      }
    }
  });
