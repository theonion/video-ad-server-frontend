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
      $scope.vidoeAdListEndpoint = /\/api\/advertisements\/.*/;
      _$controller_("ListCtrl", {
        $scope: $scope,
        $httpBackend: $httpBackend
      });
    });

  });

  describe("updateList:", function () {
    it('updateList should populate $scope.videoads', function () {
      $httpBackend.expectGET($scope.vidoeAdListEndpoint).respond(videoAdFactory.videoad.list);
      $scope.updateList();
      $httpBackend.flush();

      var data = videoAdFactory.videoad.list;
      expect($scope.videoAds.length).toBe(data.results.length);
      expect($scope.totalItems).toBe(data.count);
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });
  });

  describe("Pagination:", function () {
    beforeEach(function () {
      $httpBackend.expectGET($scope.videoAdListEndpoint)
        .respond(videoAdFactory.videoad.paginatedList(_.range(1, 5)));
    });

    it('changePage should populate videoads and totalItems', function () {
      $scope.pageChanged(1);
      $httpBackend.flush();
      expect($scope.videoAds.length).toBe(4);
      expect($scope.totalItems).toBe(20);
    });

    it("updatePage should set currentPage, fire off a request", function () {
      $scope.pageChanged(2);
      expect($scope.currentPage).toBe(2);
      $httpBackend.flush();
    });

    it("changeFilter should set currentPage to 1, get ads", function () {
      $scope.changeFilter("active");
      expect($scope.currentPage).toBe(1);
      $httpBackend.flush();
    });

    afterEach(function () {
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
      $scope.orderBy = "delivery";
      $scope.reverse = false;
      $scope.changeOrder();
      $httpBackend.flush();
      expect($scope.currentPage).toBe(1);
    });

    it("parameter should be populated with the correct value when reverse is false", function () {
      $scope.orderBy = "start";
      $scope.reverse = false;
      $scope.changeOrder();
      $httpBackend.flush();
      expect($scope.params.orderBy).toBe("start");
    });

    it("parameter should be populated with the correct value when reverse is true", function () {
      $scope.orderBy = "start";
      $scope.reverse = true;
      $scope.changeOrder();
      $httpBackend.flush();
      expect($scope.params.orderBy).toBe("-start");
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.verifyNoOutstandingExpectation();
    });
  });
  
  describe("Searching:", function () {
    beforeEach(function () {
      $httpBackend.expectGET($scope.videoAdListEndpoint)
        .respond(videoAdFactory.videoad.paginatedList(_.range(1, 5)));
      });
    it("Searching fires off request, and populates $scope.searchTerm", function () {
      $scope.searchTerm = "bacon";
      $scope.search();
      expect($scope.searchTerm).toBe("bacon");
      expect($scope.params.search).toBe("bacon");
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