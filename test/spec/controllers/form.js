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
            $controller("FormCtrl", {
                $scope: $scope,
                $location: $location,
                $httpBackend: $httpBackend 
            });
        });

    });

    it('Add targeting key sets $scope.targetingKey', function(){
        var targetingKeyValue = "bacon";
        $scope.addTargetingKey(targetingKeyValue);
        expect($scope.targetingKey).toBe(targetingKeyValue)
    });

});