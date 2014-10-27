angular.module('video-ads')
    .factory('authInterceptor', function($rootScope, $q, $window) {
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
                    //TODO: redirect to login path
                }
                return resposne || $q.when(response);
            }
        }
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });