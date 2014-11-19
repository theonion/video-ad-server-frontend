'use strict';

angular.module('video-ads')
  .directive('videoField', function(Zencoder, $q, $http, $timeout) {
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
            $scope.validateVideoFile(file)
              .then($scope.addVideoToAdvertisement)
              .then(Zencoder.uploadToS3AndEncode)
              .then(
                function() {
                  $rootScope.$broadcast(AlertEvents.SUCCESS, 'Video Uploaded');
                  $timeout(function(){
                    $rootScope.$broadcast(AlertEvents.CLEAR);
                  }, 2000);
                }, function(error){
                  $rootScope.$broadcast(AlertEvents.ERROR, error);
                  $timeout(function(){
                    $rootScope.$broadcast(AlertEvents.CLEAR);
                  }, 2000);
                }, function(message){
                  $rootScope.$broadcast(AlertEvents.INFO, message);
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
              validateVideoFileDeferred.resolve(file);
            }
            validateVideoFileDeferred.reject('Please select a file.');
          }
          return validateVideoFileDeferred.promise;
        };

        $scope.addVideoToAdvertisement = function(file) {
          var addVideoToAdvertisementDeferred = $q.defer();
          $http.post('/api/videos/', {
            'advertisement': $scope.adid,
            'name': file.name
          }).then(function(response) {
            $scope.video = response.data;
            var uploadToS3Arguments = {
              'file': file,
              'videoObject': $scope.video
            };
            addVideoToAdvertisementDeferred.resolve(uploadToS3Arguments);
           });
          return addVideoToAdvertisementDeferred.promise;
        };
      }
    };
  });
