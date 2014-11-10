'use strict';

angular.module('video-ads')
  .directive('videoEditForm', function() {
    return {
      templateUrl: 'components/detail/video-edit-form.html',
      scope: {
        'video': '=',
        'adid': '=',
        'index': '='
      }
    };
  });
