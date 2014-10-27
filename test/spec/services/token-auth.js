describe('Service: video-ads.token-auth', function() {

    var $httpBackend,
        $rootScope,
        $location,
        $window,
        testEndpoinds,
        videoAdFactory;

    beforeEach(function() {
        module('video-ads');
        module('video-ads.mockApi');
        inject(function(_$httpBackend_, _$rootScope_, _$location_, _$window_, testEndpoinds) {
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            testEndpoinds = testEndpoints
            $rootScope = $rootScope;
            _$controller_("ListCtrl", {
                $scope: $scope,
                $httpBackend: $httpBackend
            });
        });

    });

    describe("login", function() {
        it("Succeeds, token session variable is set", function() {
            var tokenValue = "bacon";
            $httpBackend.expect(testEndpoints.tokenAuthPath).respond(200, {
                "token", tokenValue
            });
            expect($window.sessionStorage.token).toBe(tokenValue);
        });
    });

    describe("refreshToken", function() {

    });
});