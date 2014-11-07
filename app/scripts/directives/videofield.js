'use strict';

angular.module('video-ads')
  .directive('videoField', function(Zencoder, $q, $http) {
    return {
      templateUrl: 'views/partials/video-field.html',
      controller: 'FormCtrl',
      scope: {
        video: '=',
        index: '=',
        adid: '='
      },
      link: function postLink($scope) {

        $scope.removeVideo = function() {
          $scope.video = null;
        };

        $scope.uploadVideo = function() {
          var fileField = $('#' + $scope.index + '-file-field');
          var clickDeferred = $q.defer();
          fileField.bind('change', function(event) {
            var file = event.target.files[0];
            //TODO: validation messaging.
            $scope.validateVideoFile(file)
              .then(function(){
                  $scope.addVideoToAdvertisement(file)
                .then(function(){
                  var s3Config = $scope.video.encoding_payload;
                  Zencoder.uploadVideo($scope.file, s3Config);
                }).then(function(){
                  clickDeferred.resolve();
                });
              });
          });
          fileField.click();

          return clickDeferred.promise;
        };

        $scope.validateVideoFile = function(file) {
          var validateVideoFileDeferred = $q.defer();
          if (file) {
            if (file.size > (1024 * 1024 * 1024)) {
              validateVideoFileDeferred.reject('Upload file cannot be larger than 1024MB.');
            }

            if (file.type.indexOf('video/') !== 0) {
              validateVideoFileDeferred.reject('You must upload a video file.');
            }
          } else {
            validateVideoFileDeferred.reject('Please select a file.');
          }
          return validateVideoFileDeferred.resolve();
        };

        $scope.addVideoToAdvertisement = function(file) {
          return $http.post('/api/videos/', {
            'advertisement': $scope.adid,
            'name': file.name
          }).then(function(response) {
            $scope.video = response.data;
          });
        };
      }
    };
  });
