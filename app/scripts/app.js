'use strict';

// ****** App Config ****** \\

angular.module('video-ads', [
  'ngCookies', 
  'ngRoute', 
  'ui.bootstrap',
  'autocomplete',
  'angles'
])
.config(function ($locationProvider, $httpProvider, $routeProvider, $sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://assets.onionstatic.com/videoads/*']);
  
  $locationProvider.html5Mode(true);

  $httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();

  $routeProvider
    .when('/', {
      templateUrl: STATIC_URL + 'partials/list.html', 
      controller: 'ListCtrl', 
      reloadOnSearch: false
    })
    .when('/edit/:videoAdId/', {
      templateUrl: STATIC_URL + 'partials/form.html', 
      controller: 'FormCtrl'
    })
    .when('/exclusion/:exclusionName/', {
      templateUrl: STATIC_URL + 'partials/exclusion.html', 
      controller: 'ExclusionCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
