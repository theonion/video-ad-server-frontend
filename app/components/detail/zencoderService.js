'use strict';

angular.module('video-ads')
  .service('Zencoder', function Zencoder($http, $q, $interval) {

    this.uploadToS3AndEncode = function(config) {
      var uploadToS3AndEncodeDeferred = $q.defer();
      var file = config.file;
      var videoObject = config.videoObject;
      var successCallback = function(success) {
        uploadToS3AndEncodeDeferred.resolve(success);
      };
      var errorCallback = function(error) {
        uploadToS3AndEncodeDeferred.reject(error);
      };
      var notifyCallback = function(notify) {
        uploadToS3AndEncodeDeferred.notify(notify);
      };

      uploadToS3(file, videoObject)
        .then(encode, errorCallback, notifyCallback)
        .then(successCallback, errorCallback, notifyCallback);

      return uploadToS3AndEncodeDeferred.promise;
    };

    function uploadToS3(file, videoObject) {
      var s3Config = videoObject.encoding_payload;
      var s3deferred = $q.defer();

      var formData = new FormData();
      formData.append('key', s3Config.key);
      formData.append('AWSAccessKeyId', s3Config.AWSAccessKeyId);
      formData.append('acl', s3Config.acl);
      formData.append('success_action_status', s3Config.success_action_status);
      formData.append('policy', s3Config.policy);
      formData.append('signature', s3Config.signature);
      formData.append('file', file);
      //We use XMLHttpRequest here becuase angular's http methods don't support progress updates.
      var xhr = new XMLHttpRequest();
      xhr.open('POST', s3Config.upload_endpoint);

      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          s3deferred.notify('Upload ' + Math.round(e.loaded / e.total * 100) + '% complete');
        } else {
          s3deferred.notify('Uploading...');
        }
      };

      xhr.onload = function() {
        s3deferred.notify('Upload Complete. Begin Encoding.');
        s3deferred.resolve(videoObject);
      };

      xhr.addEventListener('error', function() {
        s3deferred.reject('Upload failed.');
      });

      xhr.send(formData);
      return s3deferred.promise;

    }

    function encode(videoObject) {
      var encodeDeferred = $q.defer();
      //TODO: kill off this magic string
      $http({
        method: 'POST',
        url: 'api/videos/' + videoObject.id + '/encode/'
      }).success(function(response) {
        var zencoderProgressEndpoint = response.json;
        var progressInterval = $interval(function() {
          $http({
            url: zencoderProgressEndpoint,
            method: 'GET',
            'ignoreAuthorizationHeader': true
          }).then(function(response) {
            if (response.data.state === 'finished') {
              encodeDeferred.resolve(videoObject);
              $interval.cancel(progressInterval);
            } else if (response.data.state === 'failed') {
              encodeDeferred.reject('Encoding has failed.');
              $interval.cancel(progressInterval);
            } else {
              if (!_.isUndefined(response.data.progress)) {
                encodeDeferred.notify('Encoding: ' + Math.round(response.data.progress) + '%');
              }
            }
          });
        }, 1000);
      }).error(function(data) {
        encodeDeferred.reject(data);
      });
      return encodeDeferred.promise;
    }
  });
