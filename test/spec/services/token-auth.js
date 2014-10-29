describe('Service: video-ads.token-auth', function() {

    var $httpBackend,
        $rootScope,
        $location,
        $http,
        $window,
        testEndpoints,
        authService,
        videoAdFactory;

    beforeEach(function() {
        module('video-ads');
        module('video-ads.mockApi');
        inject(function(_$httpBackend_, _$rootScope_, _$location_, _$window_, _testEndpoints_, _$http_, _mockVideoAdFactory_, _authService_) {
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            testEndpoints = _testEndpoints_;
            authService = _authService_;
            $rootScope = _$rootScope_;
            $window = _$window_;
            $http = _$http_;
            videoAdFactory = _mockVideoAdFactory_;
        });
    });

    describe("login", function() {
        it("Succeeds, token session variable is set", function() {
            var tokenValue = "bacon";
            $httpBackend.expectPOST(testEndpoints.tokenAuthPath).respond(200, {
                "token": tokenValue
            });
            authService.login("user", "pass");
            $httpBackend.flush();
            expect($window.sessionStorage.token).toBe(tokenValue);
        });
    });

    describe("A request is made, but the token is expired", function() {
        it("refreshes the token, resends the request, fires the callback", function() {
            //we send the initial request, and it is denied 
            var returnedData;
            $httpBackend.expectGET(testEndpoints.videoadlist).respond(403, {});
            $http.get("/api/v1/videoads").then(
                function(data) {
                    returnedData = returnedData;
                }
            );
            //we expect the token to automatically be refreshed.. 
            var newTokenValue = "newtoken";
            $httpBackend.expectPOST(testEndpoints.tokenRefreshPath).respond(200, {
                "token": newTokenValue
            });
            $httpBackend.expectGET(testEndpoints.videoAdList).respond(200, videoAdFactory.list);
            //And to attempt the old request once again, this time successfully
            $httpBackend.flush();
            expect($window.sessionStorage.token).toBe(newTokenValue);
            expect(returnedData).toBe(videoAdFactory.list);
        });

        it("tries to refresh token, but it is too late", function() {
            //we send the initial request, and it is denied 
            $httpBackend.expectGET(testEndpoints.videoadlist).respond(403, '');
            $httpBackend.expectPOST(testEndpoints.tokenRefreshPath).respond(403, '');
            $http.get("/api/v1/videoads/");
            //We try and refresh the token, but it fails
            $httpBackend.flush();
            //So we are redirected to the login page
            expect($location.path()).toBe("/login");
        });
    });
    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});