'use strict';

angular.module('video-ads')
  .directive('videoField', function(Zencoder, $q, $http) {
    return {
      templateUrl: 'views/partials/video-field.html',
      scope: {
        video: '=video',
        index: '=index',
        s3Config: '=s3Config',
        advertisementId: '=adId'
      },
      link: function postLink($scope) {

        $scope.removeVideo = function() {
          $scope.article.video = null;
        };

        $scope.uploadVideo = function() {
          var fileField = $('#' + $scope.index + '-file-field');
          var clickDeferred = $q.defer();
          fileField.bind('change', function(event) {
            var file = event.target.files[0];
            $scope.validateVideoFile(file, clickDeferred);
            $scope.addVideoToAdvertisement(file)
              .then(function(response){
                console.log(response);
                clickDeferred.resolve();
                // var s3Config = response.data.encoding_payload;
                // Zencoder.uploadVideo($scope.file, s3Config);
              });
          });
          fileField.click();

          return clickDeferred.promise;
        };

        $scope.validateVideoFile = function(file, clickDeferred) {
          if (file) {
            if (file.size > (1024 * 1024 * 1024)) {
              clickDeferred.reject('Upload file cannot be larger than 1024MB.');
            }

            if (file.type.indexOf('video/') !== 0) {
              clickDeferred.reject('You must upload a video file.');
            }
          } else {
            clickDeferred.reject('Please select a file.');
          }
          return clickDeferred.resolve();
        };

        $scope.addVideoToAdvertisement = function(file) {
          console.log(file);
          console.log($scope.advertisementId);
          return $http.post('/api/videos/', {
            'advertisement': $scope.advertisementId,
            'name': file.title
          }).then(function(response) {
            $scope.video = response.data;
          });
        };
      }
    };
  });
