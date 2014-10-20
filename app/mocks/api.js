angular.module('video-ads.mockApi').run(
   ['$httpBackend', 'mockVideoAdFactory',
    function ($httpBackend, mockVideoAdFactory) {
      //TODO: Refine regex to be more precise, better reflect URL structure
      var videoAdListRegex = /^\/api\/v1\/videoads\/\?*/;
      var videoAdDetailRegex = /^\/api\/v1\/videoads\/[0-9]+\//;
      $httpBackend.whenGET(/partials/).passThrough();
      $httpBackend.whenGET(/exclusion\/global\/partials*/).passThrough();
      $httpBackend.whenGET(/https\:\/\/app.zencoder\.com*/)
      $httpBackend.whenGET(videoAdDetailRegex).respond(mockVideoAdFactory.videoad.detail);
      $httpBackend.whenGET(videoAdListRegex).respond(mockVideoAdFactory.videoad.list);
      $httpBackend.whenPOST(/\/new/).respond(200, 2);
    }
  ]
).factory("mockVideoAdFactory", function (){
	var _getVideoAd = function(id){
		var newVideoAd = _.clone(videoAd);
        newVideoAd.id = _.isUndefined(id) ? _.random(100) : id;
		newVideoAd.name += " " + newVideoAd.id;
		//Create a random number for delivery for graph prettyness
		newVideoAd.delivery = _.random(100);
		return newVideoAd;
	};

	var _getListOfVideoAds = function(idsOfAds) {
		var videoAdArray = [];
		_.each(idsOfAds, function(adId){
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

});