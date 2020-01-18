'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'fairrentnyc',
    environment,
    rootURL: '/',
    locationType: 'auto',
    podModulePrefix: 'fairrentnyc/pods',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    fastboot: {
      hostWhitelist: [
        'fairrentnyc.com',
        'fairrentnyc.nycartc.com',
        '192.168.0.7:4200',
        '172.20.10.10:4200',
        '172.20.10.2:4200',
        '192.168.1.137:4200',
        'dev51.nycartc.com',
        /^localhost:\d+$/,
      ],
    },

  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  ENV['ember-toastr'] = {
    toastrOptions: {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: false,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '4000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
    },
  };

  ENV.viewportConfig = {
    /*
    viewportEnabled: true,
    viewportUseRAF: true,
    viewportSpy: false,
    viewportScrollSensitivity: 1,
    viewportRefreshRate: 100,
    viewportListeners: [],
    intersectionThreshold: 0,
    scrollableArea: null,
    */
    viewportTolerance: {
      top: 0,
      left: 0,
      bottom: 320,
      right: 0,
    },
  };
  return ENV;
};
