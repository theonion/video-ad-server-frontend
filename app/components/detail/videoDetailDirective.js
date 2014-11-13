'use strict';

angular.module('video-ads')
  .directive('videoEditForm', function() {
    return {
      templateUrl: 'components/detail/videoDetail.html',
      scope: {
        'video': '=',
        'adid': '=',
        'index': '='
      }
    };
  });
