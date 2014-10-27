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
                if (response.status == 401) {
                    //TODO: Change to constant
                    $location.path('/login');
                }
                if (response.status == 403) {
                    $rootScope.$broadcast("tokenExpired");
                }

                return response || $q.when(response);
            }
        }
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
//TODO: change name?
.service("loginService", function($window, $http, $rootScope, $location) {
    _login = function(username, password) {
        //TODO: Move this into a constant
        return $http.post("/api-token-auth")
            .then(function(response) {
                $window.sessionStorage.token = response.token;
            });
    }
    _refreshToken = function() {
        return $http.post("/api-token-refresh", {
            "token": $window.sessionStorage.token
        }).then(function(response) {
            $window.sessionStorage.token = response.token;
        });
    }

    _checkToSeeIfTokenIsExpiredAndRefreshIfNeeded = function() {
        var tokenCreationTime = moment($window.sessionStorage.tokenCreationTime);
        if (!_.isUndefined(tokenCreationTime)) {
            if (tokenCreationTime.add(10, "hours").isAfter(moment())) {
                _refreshToken();
                return true;
            }
        } else {
            return false;
        }
    }

    return {
        login: _login,
        refreshToken: _refreshToken,
        checkToSeeIfTokenIsExpiredAndRefreshIfNeeded: _checkToSeeIfTokenIsExpiredAndRefreshIfNeeded
    }
});