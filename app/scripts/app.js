'use strict';

// ****** App Config ****** \\

angular.module('video-ads', [
  'ngCookies', 
  'ngRoute', 
  'ui.bootstrap',
  'autocomplete',
  'restangular'
])
.constant("STATIC_URL", "/static/")
.config(function ($locationProvider, $httpProvider, $routeProvider, $sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://assets.onionstatic.com/videoads/*']);
  
  $locationProvider.html5Mode(true);

  $httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();

  $routeProvider
    .when('/', {
      templateUrl: '/views/partials/list.html', 
      controller: 'ListCtrl', 
      reloadOnSearch: false
    })
    .when('/edit/:videoAdId/', {
      templateUrl: '/views/partials/form.html', 
      controller: 'FormCtrl'
    })
    .when('/exclusion/:exclusionName/', {
      templateUrl: '/views/partials/exclusion.html', 
      controller: 'ExclusionCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
