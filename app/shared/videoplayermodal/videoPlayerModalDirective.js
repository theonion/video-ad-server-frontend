'use strict';

angular.module('video-ads')
  .directive('videoPlayerModal', [ function() {
    return {
      replace: false,
      restrict: 'E',
      transclude: true,
      templateUrl: 'shared/videoplayermodal/videoplayermodal.html',
      link: function(scope, element) {
        var currentVideo = element.find('video')[0];
        scope.player = videojs(currentVideo, {
          'controls': true,
          'autoplay': false,
          'width': 'auto',
          'height': 'auto'
        });

        element.find('.modal').on('hidden.bs.modal', function(){
          scope.player.pause();
        });

        scope.$on('$destroy', function(){
          scope.player.dispose();
        });
      }
    };
  }]);
