'use strict';

// ****** App Config ****** \\

angular.module('video-ads', [
  'ngCookies',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'restangular',
  'highcharts-ng'
])
  .config(function($locationProvider, $httpProvider, $routeProvider, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://assets.onionstatic.com/videoads/*']);

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/views/partials/list.html',
        controller: 'ListCtrl',
        reloadOnSearch: false
      })
      .when('/login', {
        templateUrl: '/views/partials/login.html',
        controller: 'LoginCtrl'
      })
      .when('/edit/:videoAdId/', {
        templateUrl: '/views/partials/form.html',
        controller: 'FormCtrl'
      })
      .when('/new/', {
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