'use strict';

// ****** App Config ****** \\

angular.module('video-ads', [
  'ngCookies',
  'ngRoute',
  'ngAnimate',
  'restangular',
  'highcharts-ng'
])
  .config(function($locationProvider, $httpProvider, $routeProvider, $sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://assets.onionstatic.com/videoads/*', 'http://onionwebtech.s3.amazonaws.com/videoads/**']);

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'components/videoAdList/videoAdList.html',
        controller: 'VideoAdListController',
        reloadOnSearch: false
      })
      .when('/login', {
        templateUrl: 'components/login/login.html',
        controller: 'LoginCtrl'
      })
      .when('/edit/:videoAdId/', {
        templateUrl: 'components/detail/videoAdDetail.html',
        controller: 'FormCtrl'
      })
      .when('/new/', {
        templateUrl: 'components/detail/videoAdDetail.html',
        controller: 'FormCtrl'
      })
      .when('/exclusion/:exclusionName/', {
        templateUrl: 'components/exclusion/exclusion.html',
        controller: 'ExclusionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
