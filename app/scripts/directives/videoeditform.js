'use strict';

angular.module('video-ads')
  .directive('videoEditForm', function() {
    return {
      templateUrl: 'views/partials/video-edit-form.html',
      scope: {
        'video': '=',
        'adid': '=',
        'index': '='
      }
    };
  });
