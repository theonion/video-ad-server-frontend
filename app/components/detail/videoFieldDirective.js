'use strict';

angular.module('video-ads')
  .directive('videoField', function(Zencoder, $q, $http) {
    return {
      templateUrl: 'components/detail/video-field.html',
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
          fileField.unbind('change');
          fileField.bind('change', function(event) {
            var clickDeferred = $q.defer();
            var file = event.target.files[0];
            //TODO: validation messaging.
            $scope.validateVideoFile(file)
              .then(function() {
                $scope.addVideoToAdvertisement(file)
                  .then(function() {
                    var videoObject = $scope.video;
                    Zencoder.uploadToS3AndEncode($scope.file, videoObject);
                  }).then(function() {
                    clickDeferred.resolve();
                  });
              });
          });
          fileField.click();
        };

        $scope.validateVideoFile = function(file) {
          var validateVideoFileDeferred = $q.defer();
          if (file) {
            if (file.size > (1024 * 1024 * 1024)) {
              validateVideoFileDeferred.reject('Upload file cannot be larger than 1024MB.');
            } else if (file.type.indexOf('video/') !== 0) {
              validateVideoFileDeferred.reject('You must upload a video file.');
            } else {
              validateVideoFileDeferred.resolve();
            }

            validateVideoFileDeferred.reject('Please select a file.');
          }
          return validateVideoFileDeferred.promise;
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
