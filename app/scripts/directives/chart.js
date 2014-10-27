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
      $scope.chartConfig = {
        options: {
          chart: {
            type: 'pie'
          }
        },
        series: [{
          dataLabels: {
            enabled: false,
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          innerSize: '50%',
          name: 'Browser share',
          data: [parseInt($scope.impressions), (100 - parseInt($scope.impressions))]
        }],
        title: {
          text: 'Hello'
        },
        loading: false
      };
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