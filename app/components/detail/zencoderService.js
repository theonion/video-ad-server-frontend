'use strict';

angular.module('video-ads')
  .service('Zencoder', function Zencoder($http, $q, $interval) {

    this.uploadToS3AndEncode = function(config) {
      var uploadToS3AndEncodeDeferred = $q.defer();
      var file = config.file;
      var videoObject = config.videoObject;
      uploadToS3(file, videoObject)
        .then(encode,
          function(error){
            uploadToS3AndEncodeDeferred.reject(error);
          },
          function(message){
            uploadToS3AndEncodeDeferred.notify(message);
          })
        .then(
          function(success){
            uploadToS3AndEncodeDeferred.resolve(success);
          }, function(error){
            uploadToS3AndEncodeDeferred.reject(error);
          }, function(notify){
            uploadToS3AndEncodeDeferred.notify(notify);
          });
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
      $http.post(s3Config.upload_endpoint, formData, {
        'ignoreAuthorizationHeader': true,
        transformRequest: angular.identity,
        'headers': {
          'Content-Type': undefined
        }
      }).then(
        //Success
        function() {
          s3deferred.resolve(videoObject);
        },
        //Error
        function(response) {
          s3deferred.reject(response);
        }, function(){
          s3deferred.notify('Upload beginning...');
        });

      return s3deferred.promise;

    }

    function encode(videoObject) {
      var encodeDeferred = $q.defer();
      encodeDeferred.notify('Encoding beginning...');
      //TODO: kill off this magic string
      $http({
        method: 'POST',
        url: 'api/videos/' + videoObject.id + '/encode/'
      }).success(function(response) {
        var zencoderProgressEndpoint = response.json;
        var progressInterval = $interval(function(){
          $http({ url: zencoderProgressEndpoint, method:'GET', 'ignoreAuthorizationHeader': true}).then(function(response){
            if (response.data.state === 'finished'){
              encodeDeferred.resolve(videoObject);
              $interval.cancel(progressInterval);
            } else if (response.data.state === 'failed'){
              encodeDeferred.reject('Encoding has failed.');
              $interval.cancel(progressInterval);
            } else {
              if (!_.isUndefined(response.data.progress)){
                encodeDeferred.notify('Encoding: ' + response.data.progress);
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
