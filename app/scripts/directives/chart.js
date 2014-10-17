'use strict';

angular.module('video-ads')
  .directive('impressionschart', function() {
    return {
      restrict: 'E',
      templateUrl: STATIC_URL + 'partials/chart.html',
      scope: {
        foo: '@foo'
      },
      controller: function($scope) {
        $scope.impressionsChart = [
          {
            value: $scope.foo,
            color:"#F7464A",
            highlight: "#FF5A5E",
            //label: "Impressions"
          }
        ];
      },
    }
  });