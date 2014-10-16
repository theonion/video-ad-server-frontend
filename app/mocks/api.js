angular.module('video-ads.mockApi', ['ngMockE2E']).run(
   ['$httpBackend', 'mockVideoAdFactory',
    function ($httpBackend, mockVideoAdFactory) {
      //TODO: Refine regex to be more precise, better reflect URL structure
      var videoAdListRegex = /^\/api\/v1\/videoads\/\?*/;
      var videoAdDetailRegex = /^\/api\/v1\/videoads\/[0-9]\//;
      $httpBackend.whenGET(/partials/).passThrough();
      $httpBackend.whenGET(/exclusion\/global\/partials*/).passThrough();
      $httpBackend.whenGET(/https\:\/\/app.zencoder\.com*/)
      $httpBackend.whenGET(videoAdDetailRegex).respond(mockVideoAdFactory.videoad.detail);
      $httpBackend.whenGET(videoAdListRegex).respond(mockVideoAdFactory.videoad.list);
      $httpBackend.whenPOST(/\/new/).respond(200, 2);
    }
  ]
).factory("mockVideoAdFactory", function (){
	var _numberOfVideoAds = 0;
	var _getNewVideoAd = function(){
		var newVideoAd = _.clone(videoAd);
		_numberOfVideoAds++;
		newVideoAd.id = _numberOfVideoAds;
		return newVideoAd;
	};

	var _getListOfNewVideoAds = function(numberOfAds) {
		var videoAdArray = [];
		_.times(numberOfAds, function(){
			videoAdArray.push(_getNewVideoAd());
		});
		return videoAdArray;
	};

	return {
		"videoad": {
			"list": {
					"count": 10,
					"next": null,
					"previous": null,
					"results": _getListOfNewVideoAds(10)
			},
			"detail": _getNewVideoAd()
		}
	};

});