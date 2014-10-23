'use strict';

describe('Controller: video-ads.ListCtrl', function () {

  var $httpBackend,
    $scope,
    $location,
    videoAdFactory;

  beforeEach(function () {
    module('video-ads');
    module('video-ads.mockApi');
    inject(function (_$httpBackend_, _$rootScope_, _$controller_, _mockVideoAdFactory_, _$location_) {
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      videoAdFactory = _mockVideoAdFactory_;
      $scope = _$rootScope_.$new();
      $scope.vidoeAdListEndpoint = /\/api\/v1\/videoads\/.*/;
      _$controller_("ListCtrl", {
        $scope: $scope,
        $httpBackend: $httpBackend
      });
    });

  });

  describe("Functions that call updateList", function () {

    it('updateList should populate $scope.videoads', function () {
      $httpBackend.expectGET($scope.vidoeAdListEndpoint).respond(videoAdFactory.videoad.list);
      $scope.updateList();
      $httpBackend.flush();
    });

    it('changePage should populate videoads and totalItems', function () {
      $httpBackend.expectGET($scope.vidoeAdListEndpoint).respond(videoAdFactory.videoad.list);
      $scope.changePage();
      $httpBackend.flush();
    });

    afterEach(function () {
      var data = videoAdFactory.videoad.list;
      expect($scope.videoAds.length).toBe(data.results.length);
      expect($scope.totalItems).toBe(data.count);
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });
  });

  describe("Pagination", function () {
    beforeEach(function () {
      $httpBackend.expectGET($scope.videoAdListEndpoint)
        .respond(videoAdFactory.videoad.paginatedList(_.range(1, 5)));
    });

    it("updatePage should set currentPage, fire off a request", function () {
      $scope.currentPage = 2;
      $scope.changePage();
      expect($scope.currentPage).toBe(2);
    });

    it("changeFilter should set currentPage to 1, get ads", function () {
      $scope.changeFilter("active");
      expect($scope.currentPage).toBe(1);
    });

    afterEach(function () {
      $httpBackend.flush();
      expect(
        _.pluck($scope.videoAds, "id")
      ).toEqual(_.range(1, 5));
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });
  });

  describe("Ordering:", function () {
    beforeEach(function () {
      $httpBackend.expectGET($scope.videoAdListEndpoint)
        .respond(videoAdFactory.videoad.paginatedList(_.range(1, 5)));
    });

    it("updateList should be called when the active ordering changes, page should be set to 1", function () {
      $scope.changeOrder("delivery", false);
      $httpBackend.flush();
      expect($scope.currentPage).toBe(1);
    });

    it("parameter should be populated with the correct value when reverse is false", function () {
      $scope.changeOrder("start", false);
      $httpBackend.flush();
      expect($scope.params.orderBy).toBe("start");
    });

    it("parameter should be populated with the correct value when reverse is true", function () {
      $scope.changeOrder("start", true);
      $httpBackend.flush();
      expect($scope.params.orderBy).toBe("-start");
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });
  });

  it('newVideoAd should change location to create page', function () {
    $scope.newVideoAd();
    expect($location.path()).toBe('/new/');
  });
});