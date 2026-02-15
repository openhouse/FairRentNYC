'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-fetch': {
      preferNative: true,
    },
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapFont: false,
      importBootstrapCSS: false,
    },
    fingerprint: {
      exclude: [
        'images/layers-2x.png',
        'images/layers.png',
        'images/marker-icon-2x.png',
        'images/marker-icon.png',
        'images/marker-shadow.png',
        's/slideshow/tiles',
        's/img/fairrentnyc-og-image-10.jpg',
        'public/s/img/fairrentnyc-og-image-10.jpg',
        's/logos/',

        //'public/s/graphics/talks-not-raids-preview.jpg'
      ],
    },
    autoprefixer: {
      browsers: [
        'defaults',
        'last 1 ie version',
      ],
    },

  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('node_modules/council-districts/district_data/cm_master_file_no_geo.json');
  const councilImages = new Funnel('node_modules/council-districts/thumbnails', {
    srcDir: '/',
    // include: ['*/*.*'],
    // include: ['moment-timezone-with-data.min.js'],
    destDir: 's/city-council',
  });

  return app.toTree([councilImages]);
};
