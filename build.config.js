/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',
  dist_dir: 'dist',
  grunttasks_dir: 'grunttasks',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `styles` are our stylesheets to compile,
   * and `unit` contains our app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/components/config/**/*' ],
    jsunit: [ 'src/**/*.spec.js' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/components/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    styles: 'assets/styles',
    
    config: 'src/components/config',
    
    i18n: 'assets/texts',
    
    webfonts: 'assets/fonts'
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   */
  vendor_files: {
    js: [
      'vendor/jquery/dist/jquery.js',
      'vendor/angular/angular.js',
      'vendor/angular-i18n/angular-locale_no.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'vendor/angular-placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/ui-utils.js',
      'vendor/angular-placeholders/src/txt/txt.js',
      'vendor/angular-translate/angular-translate.js',
      'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'vendor/elementQuery/external/sizzle.js',  // dependency of elementQuery.js
      'vendor/elementQuery/elementQuery.js',
      'vendor/bootstrap3-datepicker/js/bootstrap-datepicker.js',
      'vendor/bootstrap3-datepicker/js/locales/bootstrap-datepicker.no.js',
      'vendor/respond/dest/respond.matchmedia.addListener.src.js', // needed for @media to work on IE8
      'vendor/PhoneNumber.js/PhoneNumberMetaData.js',
      'vendor/PhoneNumber.js/PhoneNumber.js',
      'vendor/FileSaver/FileSaver.js'
    ],
    css: [
    ],
    webfonts: [
      'vendor/bootstrap-sass-official/vendor/assets/fonts/**/*',
      'vendor/font-awesome/fonts/**/*'
    ]
  },
  
  /**
   * list of possible environments and themes
   */
  build_options: {
	  env: [ 'dev', 'test'],
	  theme: [ 'default', 'modern' ]
  }
};
