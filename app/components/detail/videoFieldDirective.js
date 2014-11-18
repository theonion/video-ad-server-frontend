'use strict';

angular.module('video-ads')
  .directive('videoField', function(Zencoder, $q, $http) {
    return {
      templateUrl: 'components/detail/videoField.html',
      transclude: true,
      controller: function($scope, $rootScope, AlertEvents) {
        $scope.removeVideo = function() {
          $scope.video = null;
        };

        $scope.uploadVideo = function() {
          var fileField = $('#' + $scope.index + '-file-field');
          fileField.unbind('change');
          fileField.bind('change', function(event) {
            var file = event.target.files[0];
            $('.alert-info').fadeIn();
            $scope.validateVideoFile(file)
              .then(function() {
                $scope.addVideoToAdvertisement(file)
                  .then(function() {
                    Zencoder.uploadToS3AndEncode(file, $scope.video);
                  }).then(function() {
                    $rootScope.$broadcast(AlertEvents.SUCCESS, 'Video Uploaded');
                  });
              }, function(error){
                $rootScope.$broadcast(AlertEvents.ERROR, error);
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
            //TODO: kill off this magic string
            'advertisement': $scope.adid,
            'name': file.name
          }).then(function(response) {
            $scope.video = response.data;
          });
        };
      }
    };
  });
