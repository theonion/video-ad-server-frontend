angular.module('video-ads.mockApi', ['ngMockE2E']).run(
  ['$httpBackend', 'mockApiData',
    function ($httpBackend, mockApiData) {
      var videoAddListRegex = /^\/api\/v1\/videoads\/\?*/;
      $httpBackend.whenGET(/partials/).passThrough();
      $httpBackend.whenGET(/exclusion\/global\/partials*/).passThrough();
      $httpBackend.whenGET(videoAddListRegex).respond(mockApiData.videoadd.list);
      $httpBackend.whenPOST(/\/new/).respond(200, 2);
    }
  ]
).value('mockApiData', {
    "videoadd": {
      "list": {
        "count": 1,
        "next": null,
        "previous": null,
        "results": [
          {
            "start": "2014-10-15T05:00:00Z",
            "end": "2014-10-17T05:00:00Z",
            "targeting": {
              "page": [
                {
                  "priority": "medium",
                  "rules": [
                    [
                      "Page Targeting 1",
                      "is",
                      "bacon"
                    ],
                    [
                      "Page Targeting 2",
                      "is not",
                      "bacon"
                    ]
                  ]
                }
              ],
              "user": [
                {
                  "priority": "medium",
                  "rules": [
                    [
                      "User Targeting group 1",
                      "is",
                      "bacon"
                    ]
                  ]
                },
                {
                  "priority": "medium",
                  "rules": [
                    [
                      "User Targeting group 2",
                      "is",
                      "bacon"
                    ]
                  ]
                }
              ]
            },
            "pixels": {
              "impression": [
                "asf"
              ],
              "complete": [
                "zxcv"
              ],
              "thirdQuartile": [
                "zzzz"
              ],
              "clickThrough": [
                "asdf"
              ],
              "midpoint": [
                "eeee"
              ],
              "start": [

              ],
              "firstQuartile": [

              ]
            },
            "video": {
              "id": 3,
              "name": "spacetestSMALL_512kb.mp4",
              "status": 2,
              "job_id": 120463745
            },
            "is_running": true,
            "impressions": 0,
            "delivery": "0.00",
            "url": "http://videoads.theonion.com/vast/3.xml",
            "id": 3,
            "name": "Name of Video Add",
            "impression_target": 9000,
            "click_through": "http://www.google.com",
            "gam_attribute": "gamattr",
            "vast_url": "http://www.example.com"
          }
        ]
      }
    }}
);
