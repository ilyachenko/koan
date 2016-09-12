'use strict';

module.exports = function (config) {
  config.set({
    basePath: '../../',

    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'client/build/**/!(libs)*.js': 'coverage'
    },

    files: [
      'client/build/libs.js',
      'client/build/app.js',
      'client/build/modules/**/*.module.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/build/modules/**/!(.module|.spec).js',
      'client/build/modules/**/*.spec.js'
    ],

    autoWatch: false,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    reporters: ['dots', 'coverage'],

    coverageReporter: {
      type: 'text-summary'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/build/'
    }
  });
};
