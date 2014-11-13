'use strict';
angular.module('video-ads.mockApi')
//TODO: change to a better name, in constants syntax
.constant('testEndpoints', {
  'videoAdList': /^\/api\/advertisements\/*\?*.*/,
  'videoAdDetail': /^\/api\/advertisements\/[0-9]+\//,
  'exclusions': /\/api\/v1\/exclusions\//,
  'zencoder': /app.zencoder.com\/.*/,
  'partials': /\.html/,
  'exclusionPartials': /exclusion\/global\/partials.*/,
  'tokenAuthPath': '/api-token-auth/',
  'tokenRefreshPath': '/api-token-refresh/',
  'videoList': '/api/videos/'
})
  .run(
    ['$httpBackend', 'mockVideoAdFactory', 'zenCoderProgress', 'exclusions', 'testEndpoints', 'video',
      function($httpBackend, mockVideoAdFactory, zenCoderProgress, exclusions, testEndpoints, video) {
        $httpBackend.whenGET(testEndpoints.partials).passThrough();
        $httpBackend.whenGET(testEndpoints.exclusionPartials).passThrough();
        $httpBackend.whenPOST(testEndpoints.tokenAuthPath).respond({
          'token': 'baconisdelicious'
        });
        $httpBackend.whenPOST(testEndpoints.tokenRefreshPath).respond({
          'token': 'baconisdelicious'
        });
        $httpBackend.whenGET(testEndpoints.videoAdDetail).respond(mockVideoAdFactory.videoad.detail);
        $httpBackend.whenGET(testEndpoints.videoAdList).respond(mockVideoAdFactory.videoad.list);
        $httpBackend.whenPOST(testEndpoints.videoAdList).respond(200, mockVideoAdFactory.videoad.detail);
        $httpBackend.whenPOST(testEndpoints.videoList).respond(200, video);
        $httpBackend.whenGET(testEndpoints.zencoder).respond(zenCoderProgress);
        $httpBackend.whenGET(testEndpoints.exclusions).respond(exclusions);
      }
    ]
    //TODO: Not really a factory. think about renaming this.
).factory('mockVideoAdFactory', ['videoAd',
  function(videoAd) {
    var _getVideoAd = function(id) {
      var newVideoAd = _.clone(videoAd);
      newVideoAd.id = _.isUndefined(id) ? _.random(100) : id;
      newVideoAd.name += ' ' + newVideoAd.id;
      //Create a random number for delivery for graph prettyness
      newVideoAd.delivery = _.random(100);
      return newVideoAd;
    };

    var _getListOfVideoAds = function(idsOfAds) {
      var videoAdArray = [];
      _.each(idsOfAds, function(adId) {
        videoAdArray.push(_getVideoAd(adId));
      });
      return videoAdArray;
    };

    var _getListObject = function(arrayOfIds, pageNumber) {
      if (_.isUndefined(arrayOfIds)) {
        arrayOfIds = _.range(12);
      }
      if (_.isUndefined(pageNumber)) {
        pageNumber = 1;
      }

      return {
        'count': 20,
        'next': '/api/v1/videoads/?page=' + pageNumber,
        'previous': null,
        'results': _getListOfVideoAds(arrayOfIds)
      };
    };

    return {
      'videoad': {
        'list': _getListObject(),
        'paginatedList': function(arrayOfIds, pageNumber) {
          return _getListObject(arrayOfIds, pageNumber);
        },
        'detail': _getVideoAd()
      }
    };
  }
]);
