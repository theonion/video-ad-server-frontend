angular.module('video-ads')
    .factory('authInterceptor', function($rootScope, $q, $window, $location, httpRequestBuffer) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = "JWT " + $window.sessionStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if (response.status == 403) {
                    var deferred = $q.defer();
                    httpRequestBuffer.append(response.config, deferred)
                    $rootScope.$broadcast('auth-forbidden', response);
                }

                return response || $q.when(response);
            }
        }
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
    .service("authService", function($window, $http, $rootScope, $location, httpRequestBuffer) {
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
            }).success(function(data, status, error) {
                $window.sessionStorage.token = response.data.token;
                httpRequestBuffer.retryAll()
            }).error(function(response, status, error) {
                httpRequestBuffer.rejectAll(error);
                //todo: change to a constant
                $location.path("/login");
            });
        }

        $rootScope.$watch("auth-forbidden", function() {
            _refreshToken();
        });
        return {
            login: _login,
            refreshToken: _refreshToken
        }
    })
// Thanks to witoldsz/angular-http-auth
.factory('httpRequestBuffer', ['$injector',
    function($injector) {
        var buffer = [];

        var $http;

        function _retryHttpRequest(config, deferred) {
            function successCallback(response) {
                deferred.resolve(response);
            }

            function errorCallback(response) {
                deferred.reject(response);
            }
            $http = $http || $injector.get("$http");
            $http(config).then(successCallback, errorCallback);
        }

        return {
            append: function(config, deferred) {
                buffer.push({
                    config: config,
                    deferred: deferred
                });
            },
            rejectAll: function(reason) {
                if (reason) {
                    _.each(buffer, function(request) {
                        request.deferred.reject(reason);
                    });
                }
                buffer = [];
            },
            retryAll: function() {
                _.each(buffer, function(request) {
                    _retryHttpRequest(request.config, request.deferred);
                });
            }
        }

    }
]);