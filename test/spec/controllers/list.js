'use strict';

describe('Controller: video-ads.ListCtrl', function (){

	var $httpBackend,
		$scope,
		$location,
		videoAdFactory;

	beforeEach(function() {
		module('video-ads');
		module('video-ads.mockApi');
		//TODO: Fix zany injection stuff
		inject(function (_$httpBackend_, $rootScope, $controller, $injector, _mockVideoAdFactory_, _$location_){
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			videoAdFactory = _mockVideoAdFactory_;
			$scope = $rootScope.$new();
			$scope.vidoeAdListEndpoint = /\/api\/v1\/videoads\/.*/
			$controller("ListCtrl", {
				$scope: $scope,
				$location: $location,
				$httpBackend: $httpBackend 
			});
		});

	});

	describe("Functions that call updateList", function(){
		
		it('updateList should populate $scope.videoads', function () {
			$httpBackend.expectGET($scope.vidoeAdListEndpoint).respond(videoAdFactory.videoad.list); 
			$scope.updateList();
			$scope.$apply();
			$httpBackend.flush();
		});

		it('changePage should populate videoads and totalItems', function(){
			$httpBackend.expectGET($scope.vidoeAdListEndpoint).respond(videoAdFactory.videoad.list); 
			$scope.changePage();
			$scope.$apply();
			$httpBackend.flush();
		});

		afterEach(function(){
			var data = videoAdFactory.videoad.list;
			expect($scope.videoads.length).toBe(data.results.length);
			expect($scope.totalItems).toBe(data.count);
			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();
		});
		
	});

	it('newVideoAd should change location to create page', function(){
		$scope.newVideoAd();
		expect($location.path()).toBe('/new/');
	});

});