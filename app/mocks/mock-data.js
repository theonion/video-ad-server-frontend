angular.module('video-ads.mockApi')
  .constant('videoAd', {  
  'id':1,
  'name':'Ad 1',
  'client':null,
  'campaign':null,
  'start':'2000-01-01T00:00:00Z',
  'end':'2020-12-31T23:59:59Z',
  'impression_target':0,
  'impression_count':0,
  'vast_url':'/vast/1',
  'click_through':'https://www.google.com/?q=clubelpaso',
  'gam_attribute':'',
  'targeting':{  
    'page':[  
      {  
        'priority':'low',
        'rules':[  
          [  
            'dfp_adchannel',
            'is',
            'delicious'
          ],
          [  
            'dfp_pagetype',
            'is not',
            'cool'
          ]
        ]
      }
    ],
    'user':[  

    ]
  },
  'pixels':{  
    'impression':[  
      'http://vastrack.theonion.com/tracking.gif?video=1&event=impression'
    ],
    'complete':[  
      'http://vastrack.theonion.com/tracking.gif?video=1&event=complete'

    ],
    'thirdQuartile':[  
      'http://vastrack.theonion.com/tracking.gif?video=1&event=thirdQuartile'
    ],
    'clickThrough':[  
      'http://vastrack.theonion.com/tracking.gif?video=1&event=clickThrough'
    ],
    'midpoint':[  
      'http://vastrack.theonion.com/tracking.gif?video=1&event=midpoint'
    ],
    'start':[  
      'http://vastrack.theonion.com/tracking.gif?video=1&event=start'
    ],
    'firstQuartile':[  
      'http://vastrack.theonion.com/tracking.gif?video=1&event=firstQuartile'
    ]
  },
  'videos':[  
    {  
      'id':1,
      'name':'Video 1',
      'poster':'',
      'input':'',
      'start':null,
      'end':null,
      'impression_target':null,
      'impression_count':0,
      'start_count':0,
      'first_quartile_count':0,
      'midpoint_count':0,
      'third_quartile_count':0,
      'complete_count':0,
      'sources':[  

      ]
    },
    {  
      'id':10,
      'name':'sample_mpeg4.mp4',
      'poster':null,
      'input':null,
      'start':null,
      'end':null,
      'impression_target':null,
      'impression_count':null,
      'start_count':0,
      'first_quartile_count':0,
      'midpoint_count':0,
      'third_quartile_count':0,
      'complete_count':0,
      'sources':[  

      ]
    }
  ]
})
  .constant('zenCoderProgress', {
    'state': 'finished',
    'input': {
      'state': 'finished',
      'id': 110049279
    },
    'outputs': [{
      'state': 'finished',
      'id': 308074856
    }, {
      'state': 'finished',
      'id': 308074849
    }, {
      'state': 'finished',
      'id': 308074854
    }, {
      'state': 'finished',
      'id': 308074855
    }, {
      'state': 'finished',
      'id': 308074853
    }, {
      'state': 'finished',
      'id': 308074852
    }, {
      'state': 'finished',
      'id': 308074851
    }, {
      'state': 'finished',
      'id': 308074847
    }, {
      'state': 'finished',
      'id': 308074850
    }, {
      'state': 'finished',
      'id': 308074848
    }]
  }).constant('exclusions', {
  'targeting':{
    'page':[
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_site',
            'is',
            'avclub'
          ],
          [
            'dfp_pagetype',
            'is',
            'article'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_site',
            'is',
            'theonion'
          ],
          [
            'dfp_articleid',
            'is',
            '34811'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_site',
            'is',
            'theonion'
          ],
          [
            'dfp_articleid',
            'is',
            '31526'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_site',
            'is',
            'theonion'
          ],
          [
            'dfp_articleid',
            'is',
            '34969'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_site',
            'is',
            'theonion'
          ],
          [
            'dfp_articleid',
            'is',
            '34968'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_site',
            'is',
            'theonion'
          ],
          [
            'dfp_articleid',
            'is',
            '35347'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            'this-is-my'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '204145'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            'pioneering'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '36291'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '318'
          ],
          [
            'dfp_site',
            'is',
            'clickhole'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_site',
            'is',
            'clickhole'
          ],
          [
            'dfp_articleid',
            'is',
            'embed-player'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '36306'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '36307'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '36305'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '519'
          ],
          [
            'dfp_site',
            'is',
            'clickhole'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '36528'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '36687'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_adchannel',
            'is',
            'tough-season-2'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_adchannel',
            'is',
            'partying'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '78'
          ]
        ]
      },
      {
        'priority':'medium',
        'rules':[
          [
            'dfp_articleid',
            'is',
            '166'
          ]
        ]
      }
    ],
    'user':[

    ]
  },
  'id':1,
  'name':'global'
});