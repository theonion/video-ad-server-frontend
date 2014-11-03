Onion Video Ads ![Onion Video Ads] (https://travis-ci.org/theonion/video-ad-server-frontend.svg)
---------------

Development
-----------

Install [node.js](http://nodejs.org/download/)

Install dependencies:

    gem install compass
    npm install
    npm install -g bower
    bower install

Then, run `grunt build` in order to inject the bower dependencies into the proper blocks in `app/index.html`

`grunt serve` to run the dev server



Development on our Django server
--------------------------------

To do development on a local Django server, I prefer to utilize the `bower link` functionaity.

First, navigate to the `dist` folder
Next, do the command `bower link`
After this, go to the root directory of the `video-ad-server` django app, and execute the command `bower link onion-vide-ad-server-frontend onion-video-ad-server-frontend`

And that should do it!
