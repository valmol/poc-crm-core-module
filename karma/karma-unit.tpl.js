module.exports = function ( karma ) {
  karma.set({

    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: '<%= root_dir %>',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [
      <% scripts.forEach( function ( file ) { %>'<%= file %>',
      <% }); %>
      'src/**/*.js',
      // take config file from build directory since it is generated from template
      //'<%= build_dir %>/src/components/config/app.config.js'
    ],

    // remove all templates
    exclude: [
      'src/**/*.tpl.js'
    ],

    frameworks: [ 'jasmine' ],
    
    plugins: [
      'karma-jasmine',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-html-reporter',
      'karma-junit-reporter',
      'karma-coverage'
    ],
    
    preprocessors: {
      'src/**/*.js': [ 'coverage' ]
    },

    /**
     * How to report, by default.
     */
    reporters: [
      'dots',
      'html',
      'coverage',
      'junit'],

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /** 
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      //'PhantomJS'
      'Chrome'
    ],

    /**
     * Configure karma-html-reporter
     */
    htmlReporter: {
      outputDir: 'reports/karma-html-reporter',
      templatePath: 'node_modules/karma-html-reporter/jasmine_template.html'
    },

    /**
     * Configure karma-coverage-reporter
     */
    coverageReporter: {
      type : 'html',
      dir : 'reports/karma-coverage/'
    },


    junitReporter:{
      outputFile: 'reports/unit.xml',
      suite: 'unit'
    }

  });
};

