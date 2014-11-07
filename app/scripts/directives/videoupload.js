'use strict';

angular.module('video-ads')
  .directive('videoUpload', function() {
    return {
      templateUrl: 'views/partials/videoUpload.html',
      scope: {
        'video': '=',
        'adid': '=',
        'index': '='
      }
    };
  });
