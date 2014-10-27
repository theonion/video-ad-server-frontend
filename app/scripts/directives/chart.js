'use strict';

angular.module('video-ads')
  .directive('impressionschart', function() {
    return {
      restrict: 'E',
      templateUrl: STATIC_URL + 'partials/chart.html',
      scope: {
        impressions: '@impressions'
      },
      controller: function($scope) {
        $scope.chartOptions = {
          animation: false,
          showTooltips: false,
        },
        $scope.impressionsChart = [
          {
            value: parseInt($scope.impressions),
            color:"#008d52",
            label: "% Complete"
          },
          {
            value: (100 - parseInt($scope.impressions)),
            color: "#ecebeb",
            label: "% Remaining"
          }
        ];
      },
    }
  });