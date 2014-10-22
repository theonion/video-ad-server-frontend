angular.module('video-ads.mockApi')
.constant("testEndpoints", {
  "videoAdList": /^\/api\/v1\/videoads\/\?*.*/,
  "videoAdDetail": /^\/api\/v1\/videoads\/[0-9]+\//,
  "exclusions": /\/api\/v1\/exclusions\//,
  "zencoder": /app.zencoder.com\/.*/,
  "partials": /partials/,
  "exclusionPartials": /exclusion\/global\/partials.*/
})
.run(
  ['$httpBackend', 'mockVideoAdFactory', 'zenCoderProgress', 'exclusions', 'testEndpoints',
    function ($httpBackend, mockVideoAdFactory, zenCoderProgress, exclusions, testEndpoints) {
      $httpBackend.whenGET(testEndpoints.partials).passThrough();
      $httpBackend.whenGET(testEndpoints.exclusionPartials).passThrough();
      $httpBackend.whenGET(testEndpoints.videoAdDetail).respond(mockVideoAdFactory.videoad.detail);
      $httpBackend.whenGET(testEndpoints.videoAdList).respond(mockVideoAdFactory.videoad.list);
      $httpBackend.whenPOST(testEndpoints.videoAdList).respond(200, mockVideoAdFactory.videoad.detail);
      $httpBackend.whenGET(testEndpoints.zencoder).respond(zenCoderProgress);
      $httpBackend.whenGET(testEndpoints.exclusions).respond(exclusions);
    }]
    //TODO: Not really a factory. think about renaming this.
).factory("mockVideoAdFactory", ['videoAd', function (videoAd) {
  var _getVideoAd = function (id) {
    var newVideoAd = _.clone(videoAd);
    newVideoAd.id = _.isUndefined(id) ? _.random(100) : id;
    newVideoAd.name += " " + newVideoAd.id;
    //Create a random number for delivery for graph prettyness
    newVideoAd.delivery = _.random(100);
    return newVideoAd;
  };

  var _getListOfVideoAds = function (idsOfAds) {
    var videoAdArray = [];
    _.each(idsOfAds, function (adId) {
      videoAdArray.push(_getVideoAd(adId));
    });
    return videoAdArray;
  };

  return {
    "videoad": {
      "list": {
        "count": 20,
        "next": "/api/v1/videoads/?page=2",
        "previous": null,
        "results": _getListOfVideoAds(_.range(5))
      },
      "detail": _getVideoAd()
    }
  };

}]);
