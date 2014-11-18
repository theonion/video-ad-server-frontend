'use strict';

angular.module('video-ads')
  .service('Zencoder', function Zencoder($http, $q) {

    this.uploadToS3AndEncode = function(file, videoObject) {
      uploadToS3(file, videoObject.encoding_payload)
        .then(function() {
          encode(videoObject);
        });
    };

    function uploadToS3(file, s3Config) {
      var s3deferred = $q.defer();

      var formData = new FormData();
      formData.append('key', s3Config.key);
      formData.append('AWSAccessKeyId', s3Config.AWSAccessKeyId);
      formData.append('acl', s3Config.acl);
      formData.append('success_action_status', s3Config.success_action_status);
      formData.append('policy', s3Config.policy);
      formData.append('signature', s3Config.signature);
      formData.append('file', file);

      $http.post(s3Config.upload_endpoint, formData, {
        'ignoreAuthorizationHeader': true,
        transformRequest: angular.identity,
        'headers': {
          'Content-Type': undefined
        }
      }).then(
        //Success
        function() {
          s3deferred.resolve(file);
        },
        //Error
        function(response) {
          s3deferred.reject(response);
        }, function(progress){
          console.log(progress);
        });

      return s3deferred.promise;

    }

    function encode(videoObject) {
      var encodeDeferred = $q.defer();

      $http({
        method: 'POST',
        url: 'api/videos/' + videoObject.id + '/encode/'
      }).success(function() {
        encodeDeferred.resolve(videoObject);
      }).error(function(data) {
        encodeDeferred.reject(data);
      });

      return encodeDeferred.promise;
    }
    this.encode = function(videoId) {
      encode({
        attrs: {
          id: videoId
        }
      });
    };
  });
