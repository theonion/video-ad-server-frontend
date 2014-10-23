'use strict';

describe('Controller: video-ads.FormCtrl', function (){

    var $httpBackend,
        $scope,
        $location,
        $routeParams,
        videoAdFactory;

    beforeEach( function () {
        module('video-ads');
        module('video-ads.mockApi');
        inject( function (_$httpBackend_, _$rootScope_, _$controller_, _$injector_, _mockVideoAdFactory_, _$location_) {
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            videoAdFactory = _mockVideoAdFactory_;
            $scope = _$rootScope_.$new();
            $routeParams = {};
            //TODO: get rid of these horrid regexs attached to the scope
            $scope.vidoeAdListEndpoint = /\/api\/v1\/videoads\//
            $scope.videoAdDetailRegex = /^\/api\/v1\/videoads\/[0-9]+\//;
            _$controller_("FormCtrl", {
                $scope: $scope,
                $location: _$location_,
                $httpBackend: $httpBackend,
                $routeParams: $routeParams
            });
        });
    });

    it('Add targeting key sets $scope.targetingKey', function(){
        var targetingKeyValue = "bacon";
        $scope.addTargetingKey(targetingKeyValue);
        expect($scope.targetingKey).toBe(targetingKeyValue);
    });

    describe("when $scope.videoAdId is undefined", function(){
        
        it('getAndInitVideoAd does not call out and properly popultes $scope.videoad', function() {
            $scope.getAndInitVideoAd(undefined);
            expect($scope.videoad.fromServer).toBe(undefined);
        });

        it('saveVideoAd POSTS to proper path', function(){
            $location.path("/new");
            $routeParams.videoAdId = undefined;
            $httpBackend.expectPOST($scope.vidoeAdListEndpoint).respond(200, videoAdFactory.videoad.detail);
            $scope.saveVideoAd();
            $httpBackend.flush();
            expect($location.path()).toBe('/edit/' + videoAdFactory.videoad.detail.id);
        });
    });

    describe("when $scope.videoAdId is defined", function(){
        beforeEach(function(){
            $routeParams.videoAdId = videoAdFactory.videoad.detail.id;
        });

        it("getAndInitVideoAd calls out to the server, fetches correct data", function(){
            $httpBackend.expectGET($scope.videoAdDetailRegex).respond(200, videoAdFactory.videoad.detail);
            $scope.getAndInitVideoAd($routeParams.videoAdId);
            $httpBackend.flush();
            expect($scope.videoad.id).toBe($routeParams.videoAdId);
            expect($scope.videoad.fromServer).toBe(true);
        });

        it("saveVideoAd PUTS to proper path", function(){
            //Prepare the variables for the test
            $httpBackend.expectGET($scope.videoAdDetailRegex).respond(200, videoAdFactory.videoad.detail);
            $scope.getAndInitVideoAd($routeParams.videoAdId);
            $httpBackend.flush();
            
            //Do the actual test
            $httpBackend.expectPUT($scope.videoAdDetailRegex).respond(200, videoAdFactory.videoad.detail);
            $scope.saveVideoAd();
            $httpBackend.flush();
            expect($scope.videoad.id).toBe($routeParams.videoAdId);
        });

        afterEach(function(){
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        });
    });
});