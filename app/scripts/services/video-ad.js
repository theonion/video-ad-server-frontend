'use strict';
//Service to get / create / delete video ads.
angular.module('video-ads')
  .factory('videoAdService',
    function(Restangular) {
      Restangular.setBaseUrl('/api/');
      Restangular.setRequestSuffix('/');

      return Restangular.service('advertisements');
    })
  .config(function(RestangularProvider) {
    // Restangular likes lists to be returned as lists. DRF returns lists as a JSON object, with the list of objects inside of the response.results object.
    // So, we write this response interceptor in order to return data.results in teh case the current operation is getList
    RestangularProvider.addResponseInterceptor(function(data, operation) {
      if (operation === 'getList') {
        var results = data.results;
        results.meta = {
          count: data.count,
          prev: data.prev,
          next: data.next
        };

        return results;
      }
      return data;
    });
  });
