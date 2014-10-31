'use strict';

angular.module('video-ads')
	.directive('pixels', function() {
		return {
			templateUrl: 'views/partials/pixels.html',
			scope: {
				'videoad': '=',
				'pixels': '='
			},
			link: function($scope, elem, attrs){
				$("#pixels-wrapper").on('keypress', 'input', function(e){
					if(e.keyCode === 13){
						$(e.target).parent().find('button').click();
						return false;
					}
				})
				$scope.addPixel = function(e){
					var bt = $(e.target);
					var event = $(bt).parents('[data-event]').data('event');
					var pixel = $(bt).parent().siblings('input').val()
					if(pixel.length > 0){
						$scope.videoad.pixels[event].push(pixel)
						$(bt).parent().siblings('input').val('')
					}
				}

				$scope.removePixel = function(event, index){
					$scope.videoad.pixels[event].splice(index, 1);
				}
			}
		}
	});