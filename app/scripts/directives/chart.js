'use strict';

angular.module('video-ads')
  .directive('delivery', function() {
    return {
      restrict: 'E',
      templateUrl: STATIC_URL + 'partials/chart.html',
      scope: {
        impressions: '@impressions'
      },
      //Setting up Highcharts options
      controller: function($scope) {
        $scope.semiCircleConfig = {
          options: {
            chart: {
              type: 'pie',
              backgroundColor: 'transparent',
              height: 75,
              margin: 0,
              width: 75,
            },
            credits: { enabled: false },
            tooltip: { enabled: false },
            colors: ['#008d52', '#e2e2e2'],
          },
          series: [{
            dataLabels: { enabled: false },
            states: {
              hover: {
                 enabled: false
              }
            },
            animation: false,
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            innerSize: '50%',
            name: 'Delivery',
            data: [
              parseInt($scope.impressions), 
              (100 - parseInt($scope.impressions))
            ]
          }],
          title: {
            text: ''
          },
          subtitle: {
            text: ''
          },
          loading: false
        };
      }
    }
  });