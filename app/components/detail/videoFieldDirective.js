'use strict';

angular.module('video-ads')
  .directive('videoField', function(Zencoder, $q, $http) {
    return {
      templateUrl: 'components/detail/videoField.html',
      transclude: true,
      controller: function($scope) {
        $scope.removeVideo = function() {
          $scope.video = null;
        };

        $scope.uploadVideo = function() {
          var fileField = $('#' + $scope.index + '-file-field');
          fileField.unbind('change');
          fileField.bind('change', function(event) {
            var clickDeferred = $q.defer();
            clickDeferred.promise.then(
              function(){
                $('.alert-info').fadeOut();
                $('.alert-success').fadeIn().delay(1000).fadeOut();
              },
              function(){
                $('.alert-info').fadeOut();
                $('.alert-danger').fadeIn().delay(1000).fadeOut();
              });
            var file = event.target.files[0];
            $('.alert-info').fadeIn();
            $scope.validateVideoFile(file)
              .then(function() {
                $scope.addVideoToAdvertisement(file)
                  .then(function() {
                    var videoObject = $scope.video;
                    Zencoder.uploadToS3AndEncode(file, videoObject);
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
