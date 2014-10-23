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
      $scope.$apply();
      $httpBackend.flush();
    });

    it('changePage should populate videoads and totalItems', function () {
      $httpBackend.expectGET($scope.vidoeAdListEndpoint).respond(videoAdFactory.videoad.list);
      $scope.changePage();
      $scope.$apply();
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

  describe("Pagination should", function () {
    beforeEach(function () {
      $httpBackend.expectGET($scope.videoAdListEndpoint)
        .respond(videoAdFactory.videoad.paginatedList(_.range(1, 5)));
    });

    it("page update should fire when currentPage changes", function () {
      $scope.currentPage = 1;
    });

    it("page update should fire when filter changes", function () {
      $scope.params.filter = "active";
      expect($scope.currentPage).toBe(1);
    });

    afterEach(function () {
      $scope.$apply();
      $httpBackend.flush();
      expect(
        _.pluck($scope.videoAds, "id")
      ).toEqual(_.range(1, 5));
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });
  });

  it('newVideoAd should change location to create page', function () {
    $scope.newVideoAd();
    expect($location.path()).toBe('/new/');
  });

});