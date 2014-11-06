'use strict';
angular.module('video-ads')
    .factory('authInterceptor', ['$rootScope', '$q','$window', '$location', '$injector','httpRequestBuffer', function($rootScope, $q, $window, $location, $injector, httpRequestBuffer) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'JWT ' + $window.sessionStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if (!response.config.headers.ignoreAuthModule) {
                    if (response.status === 403) {
                        var deferred = $q.defer();
                        httpRequestBuffer.append(response.config, deferred);
                        var authService = $injector.get('authService');
                        authService.refreshToken();
                    }
                }
                return $q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }])
    .service('authService', ['$window', '$http', '$rootScope', '$location', 'httpRequestBuffer', function($window, $http, $rootScope, $location, httpRequestBuffer) {
        var _login = function(username, password) {
            return $http.post('/api-token-auth/', {'username': username, 'password': password})
                .then(function(response) {
                    $window.sessionStorage.token = response.data.token;
                    $location.path('/');
                });
        };
        var _refreshToken = function() {
            return $http.post('/api-token-refresh/', {
                    'token': $window.sessionStorage.token
                }, {
                    'ignoreAuthModule': true
                }).success(function(response) {
                    $window.sessionStorage.token = response.token;
                    httpRequestBuffer.retryAll();
                })
                .error(function() {
                    httpRequestBuffer.rejectAll();
                    $location.path('/login');
                });
        };

        return {
            login: _login,
            refreshToken: _refreshToken
        };
    }])
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
            $http = $http || $injector.get('$http');
            config.headers.ignoreAuthModule = true;
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
                buffer = [];
            }
        };
    }
]);
