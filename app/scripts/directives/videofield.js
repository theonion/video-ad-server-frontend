'use strict';

angular.module('video-ads')
  .directive('videoField', function (Zencoder) {
    return {
      templateUrl: 'views/partials/video-field.html',
      restrict: 'E',
      scope: {
        advertisement: '=advertisement'
      },
      link: function postLink($scope) {
        $scope.removeVideo = function () {
          $scope.article.video = null;
        };

        $scope.uploadVideo = function () {
          var additionalNewVideoParams = {'advertisement': $scope.advertisement.id};
          Zencoder.onVideoFileUpload(additionalNewVideoParams).then(
            function (success) {
              console.log(success);
              $scope.angularrticle.video = success.attrs.id;
            },
            function (error) {
              console.log(error);
            },
            function (progress) {
              console.log(progress);
              $scope.uploadProgress = progress;
            }
          );
        };

        // $scope.thumbnailModal = function () {
        //   Zencoder.openVideoThumbnailModal(article.video).result.then(
        //     function (resolve) {
        //       console.log('thumbnail modal resolve');
        //       console.log(resolve);
        //       //article.poster_url = resolve;
        //     },
        //     function (reject) {
        //       console.log('thumbnail modal rejected');
        //     }
        //   );
        // };
      }
    };
  });
