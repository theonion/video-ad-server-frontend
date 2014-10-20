'use strict';

describe('Controller: video-ads.ListCtrl', function (){

	var $httpBackend,
		$scope,
		$location,
		videoAdFactory,
		httpMock;

	beforeEach(function() {
		module('video-ads');
		module('video-ads.mockApi');
		inject(function ($httpBackend, $rootScope, $controller, $injector, _mockVideoAdFactory_, _$location_){
			httpMock = $httpBackend;
			$location = _$location_;
			videoAdFactory = _mockVideoAdFactory_;
			$scope = $rootScope.$new();
			$controller("ListCtrl", {
				$scope: $scope,
				$location: $location,
				$httpBackend: httpMock
			});
		});
	});

	afterEach( function(){
		httpMock.verifyNoOutstandingExpectation();
		httpMock.verifyNoOutstandingRequest();
	})


	describe("Functions that call updateList", function(){
		beforeEach(function(){
			httpMock.expectGET('/api/v1/videoads/?filter=active').respond(videoAdFactory.videoad.list); 
		});

		afterEach(function(){
			httpMock.flush();
			var data = videoAdFactory.videoad.list;
			expect($scope.videoads.length).toBe(data.results.length);
			expect($scope.totalItems).toBe(data.count);
		});
		
		it('updateList should populate $scope.videoads', function () {
			$scope.updateList();
		});

		it('changePage should populate videoads and totalItems', function(){
			$location.path("/?page=2")
			$scope.changePage();
		});

		it('changeFilter should update current URL, set current page to 1, call updateList', function(){
			httpMock.resetExpectations();
			httpMock.expectGET('/api/v1/videoads/?filter=all&page=1').respond(videoAdFactory.videoad.list); 
			$scope.changeFilter("filter", "all");
			expect($location.search().page).toBe(1);
			expect($location.search().filter).toBe("all");
		});
	});

	it('newVideoAd should change location to edit page of newly created ad', function(){
		var videoAdId = _.random(1000);
		$scope.new_video_ad_name = "bacon";
		httpMock.expectPOST('/new').respond(200, videoAdId);
		$scope.newVideoAd();
		httpMock.flush();
		expect($location.path()).toBe('/edit/' + videoAdId);
	});

});