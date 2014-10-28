angular.module('video-ads')
    .factory('authInterceptor', function($rootScope, $q, $window, $location) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = "JWT " + $window.sessionStorage.token;
                }
                return config;
            },
            'response': function(response) {
                if (response.status == 403) {
                    $rootScope.$broadcast("auth:permission-denied");
                }

                return response || $q.when(response);
            }
        }
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
//TODO: change name?
.service("authService", function($window, $http, $rootScope, $location) {
    _login = function(username, password) {
        //TODO: Move this into a constant
        return $http.post("/api-token-auth")
            .then(function(response) {
                $window.sessionStorage.token = response.data.token;
            });
    }
    _refreshToken = function() {
        //TODO: Move this into a constant
        return $http.post("/api-token-refresh", {
            "token": $window.sessionStorage.token
        }).then(function(response) {
            $window.sessionStorage.token = response.data.token;
        });
    }
    return {
        login: _login,
        refreshToken: _refreshToken
    }
});