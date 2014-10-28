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

        it("user makes a request, but is denied, so is sent to the login page", function() {
            $httpBackend.expectGET(testEndpoints.videoAdList).respond(403);
            $http.get("/api/v1/videoads/");
            $httpBackend.flush();
            expect($location.path()).toBe("/login");
        });
    });

    describe("A request is made, but the token is expired", function() {
        it("refreshes the token, resends the request", function() {
            //we send the initial request, and it is denied 
            $httpBackend.expectGET(testEndpoints.videoadlist).respond(403);
            $http.get("/api/v1/videoads");
            $httpBackend.flush();
            //we expect the token to automatically be refreshed.. 
            var newtokenvalue = "newtoken";
            $httpBackend.expectPOST(testEndpoints.tokenrefreshpath).respond(200, {
                "token": newtokenvalue
            });
            $httpBackend.flush();
            //And to attempt the old request once again, this time successfully
            $httpBackend.expectGET(testEndpoints.videoAdList).respond(200, videoAdFactory.list);
            $httpBackend.flush();
            expect($window.sessionStorage.token).toBe(newTokenValue);
        });

        it("tries to refresh token, but it is too late", function() {
            //we send the initial request, and it is denied 
            $httpBackend.expectGET(testEndpoints.videoadlist).respond(403);
            $http.get("/api/v1/videoads/");
            $httpBackend.flush();
            //We try and refresh the token, but it fails
            $httpBackend.expectPOST(testEndpoints.tokenrefreshpath).respond(403);
            $httpBackend.flush();
            //So we are redirected to the login page
            expect($location.path).toBe("/login");
        });
    });
    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});