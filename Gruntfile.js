module.exports = function ( grunt ) {
  
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-connect-rewrite');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-bless');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-maven-tasks');
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-git-describe');
  grunt.loadNpmTasks('grunt-selenium-webdriver');

  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
  var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
  
  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),
    bwr: grunt.file.readJSON("bower.json"),

    'git-describe': {
      options: {
      },
      target: {}
    },

    /**
     * Connects appropriate configuration, usage:
     * grunt sometarget --env=someenv --theme=modern
     * Env defaults to "dev", and orgid defaults to "default".
     */
    env: grunt.option('env') || 'dev',
    theme: grunt.option('theme') || 'default',

    /**
     * The banner is the comment that is placed at the top of our compiled 
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      proxies: [
        {
          context: '/secesb',
          host: 'localhost',
          port: 9099,
          https: false,
          changeOrigin: false
        }
      ],
      development: {
        options: {
          middleware: function (connect) {
            return [
              require('connect-livereload')(),
              rewriteRulesSnippet,
              proxySnippet,
              mountFolder(connect, 'build'),
              mountFolder(connect, 'src'),
              mountFolder(connect, 'mocks')
            ];
          }
        }
      },
      compile: {
        options: {
          middleware: function (connect) {
            return [
              require('connect-livereload')(),
              rewriteRulesSnippet,
              proxySnippet,
              mountFolder(connect, 'bin'),
              mountFolder(connect, 'mocks')
            ];
          }
        }
      }

    },

    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>/#/overview?lang=en_NO'
      }
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          "package.json", 
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json", 
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },    

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      build : [
        '<%= build_dir %>',
        '<%= compile_dir %>',
        '.sass-cache/'
      ],
      dist : [
        '<%= dist_dir %>'
      ]
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_default_images: {
        files: [
          { 
            src: [ '**' ],
            cwd: 'assets/images/default/',
            dest: '<%= build_dir %>/assets/images',
            expand: true
          }
       ]   
      },
      build_theme_images: {
          files: [
            { 
              src: [ '**' ],
              cwd: 'assets/images/<%= theme %>/',
              dest: '<%= build_dir %>/assets/images',
              expand: true
            }
         ]   
        },
      build_appjs: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '.',
            dest: '<%= build_dir %>/',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            cwd: '.',
            dest: '<%= build_dir %>/',
            expand: true
          }
        ]
      },
      build_webfonts: {
          files: [
            {
              src: [ '<%= vendor_files.webfonts %>',
                '<%= app_files.webfonts %>/default/**/*',
                '<%= app_files.webfonts %>/<%= theme %>/**/*' ],
              cwd: '.',
              dest: '<%= build_dir %>/assets/fonts',
              filter: 'isFile',
              flatten: true,
              expand: true
            }
          ]
        },
      compile_assets: {
        files: [
          {
            // Exclude css files as they are processed separately, by minifier
            src: [ '**', '!**/*.css' ],
            cwd: '<%= build_dir %>/assets',
            dest: '<%= compile_dir %>/assets',
            expand: true
          }
        ]
      },
      dist_assets: {
        files: [
          {
            // Exclude css files as they are processed separately, by minifier
            src: [ '**' ],
            cwd: '<%= build_dir %>/assets',
            dest: '<%= dist_dir %>/assets',
            expand: true
          }
        ]
      },
      dist_styles: {
        files: [
          {
            // Exclude css files as they are processed separately, by minifier
            src: [ '**'],
            cwd: '<%= app_files.styles %>' ,
            dest: '<%= dist_dir %>/assets/styles',
            expand: true
          }
        ]
      },
      dist_bootstrap_styles: {
        files: [
          {
            // Exclude css files as they are processed separately, by minifier
            src: [ '**'],
            cwd: '<%= app_files.styles %>' ,
            dest: '<%= dist_dir %>/assets/styles',
            expand: true
          }
        ]
      },
    },
    

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `compile_js` target is the concatenation of our application javascript
       * code and all specified vendor javascript code into a single file.
       * In addition, the source is surrounded in the blocks specified in the
       * `module.prefix` and `module.suffix` files, which are just run blocks
       * to ensure nothing pollutes the global scope.
       *       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>',
          separator: ';'
        },
        src: [ 
          '<%= vendor_files.js %>', 
          'module.prefix', 
          '<%= build_dir %>/src/**/*.js', 
          '<%= html2js.app.dest %>', 
          '<%= html2js.common.dest %>', 
          '<%= vendor_files.js %>', 
          'module.suffix' 
        ],
        dest: '<%= compile_dir %>/assets/iguana-<%= bwr.version %>.min.js'
      },
      /**
       * The `dist_js` target is the concatenation of our application javascript
       * code into a single file.
       */
      dist_js: {
        options: {
          banner: '<%= meta.banner %>',
          separator: ';'
        },
        src: [ 
          '<%= build_dir %>/src/**/*.js', 
          '<%= html2js.app.dest %>', 
          '<%= html2js.common.dest %>'
        ],
        dest: '<%= dist_dir %>/assets/iguana-<%= bwr.version %>.js'
      },
      /**
       * The `compile_css` target is the concatenation of our application css
       * code and all specified vendor css code into a single file.
       */
      compile_css: {
        options: {
          banner: '<%= meta.banner %>',
        },
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/css/icons.css',
          '<%= compass.options.cssDir %>/main.css'              
        ],
        dest: '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.min.css'
      }
    },

    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the javascript sources!
     */
    uglify: {
      compile: {
        options: {
          // Uncomment following two lines to get source maps after minification
          // sourceMap: true,
          // sourceMapIncludeSources: true,
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },
    
    /**
     * Minify the css sources!
     */
    cssmin: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_css.dest %>': '<%= concat.compile_css.dest %>'
        }
      }
    },

    /**
     * Compass gem running in ruby handles *.scss compilation automatically.
     * Only our `main.scss` file is included in compilation; all other files
     * must be imported from this file (because rest are underscored).
     */
    compass: {
      options: {
        sassDir: '<%= app_files.styles %>/<%= theme %>',
        cssDir: '<%= build_dir %>/assets/css/',
        importPath: 'vendor',
        // When debugInfo is true compass generates "@media -sass-debug-info...",
        // which is interpreted wrongly by Bless resuling in broken css.
        // When set to false - a nice /*...*/ comment with line number is still generated.
        debugInfo: false
      },
      dist: {},
      server: {}
    },
    
    /**
     * Generated CSS can grow too big, blesscss splits it to several files than.
     * IE6-9 cannot handle more than 4095 CSS selectors per a CSS file.  
     */
    bless: {
      css: {
        options: {
          cleanup: false
        },
        files: {
          '<%= build_dir %>/assets/css/main.css': '<%= build_dir %>/assets/css/main.css'
        }
      }
    },


    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [ 
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/components'
        },
        src: [ '<%= app_files.ctpl %>' ],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        runnerPort: 9101,
        background: true
      },
      continuous: {
        singleRun: true
      },
      e2e: {
          singleRun: true,
          options: {
              configFile: '<%= build_dir %>/karma-e2e.js'
          }
      },
      server: {
        runnerPort: 9200,
        singleRun: false,
        autoWatch: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/css/icons.css',
          '<%= compass.options.cssDir %>/main.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= concat.compile_css.dest %>'
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'vendor/angular-mocks/angular-mocks.js'
        ],
        options: {
          templateFileSrc:"karma/karma-unit.tpl.js",
          templateFileDest:"karma-unit.js"
        }
      }
    },

    compress: {
      dist: {
        options: {
          archive: './<%= dist_archive_name %>-v<%= pkg.version %>.tar.gz',
          mode: 'tgz'
        },
        files: [
          {
            src: '**/*',
            cwd: '<%= dist_root_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed 
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files. 
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [ 
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'karma:unit:run', 'copy:build_appjs' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [ 
          'assets/images/**/*'
        ],
        tasks: [
          'copy:build_default_images',
          'copy:build_bank_images',
          'grunticon:svg_icons'
        ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'index:build' ]
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [ 
          '<%= app_files.atpl %>', 
          '<%= app_files.ctpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      /**
       * When SASS files change, we need to compile and minify them.
       */
      compass: {
        files: [ '**/*.{scss,sass}' ],
        tasks: [ 'compass:server', 'bless' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  // load tasks from dir
  grunt.loadTasks(grunt.config('grunttasks_dir'));

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'karma:unit', 'delta' ] );

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean:build',
    'html2js',
    'jshint',
    'compass:server',
    'bless',
    'copy:build_default_images',
    'copy:build_theme_images',
    'copy:build_appjs',
    'copy:build_vendorjs',
    'copy:build_webfonts',
    'index:build',
    'karmaconfig',
    'karma:continuous'
  ]);

  grunt.registerTask( 'test', [
    'karmaconfig',
    'karma:continuous'
  ]);

  grunt.registerTask('e2e', [
  ]);

  /**
   * The `server` task runs application locally in development mode.
   * On change to sources the application is automatically restarted.
   */
  grunt.registerTask('server', [
    'connect:development',
    'configureProxies',
    'build',
    'open',
    'delta'
  ]);
  
  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'build',
    'copy:compile_assets',
    'ngmin',
    'concat:compile_js',
    'cssmin',
    'uglify',
    'index:compile'
  ]);

  /**
   * The `dist` task gets your component ready for distribution
   */
  grunt.registerTask( 'dist', [
    'clean:dist',
    'build',
    'copy:dist_assets',
    'copy:dist_styles',
    'concat:dist_js'
  ]);


  /**
   * The `compile-server` task is simmilar to `server` task but runs
   * production-ready (concated+minified and so on) sources.
   * Besides, hot redeployment of changes in sources is not performed.
   */
  grunt.registerTask( 'compile-server', [
    'connect:compile',
    'configureProxies',
    'compile',
    'open',
    'delta'
  ]);


  /**
   * This task runs karma server in order to have ability to debug test cases
  */
  grunt.registerTask( 'karma_server', [ 'karmaconfig', 'karma:server'] );

  
  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /** 
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+'|'+grunt.config('gruntasks_dir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var buildInfo = {
      time: grunt.template.today(),
      env: grunt.config('env'),
      orgid: grunt.config('theme')
    };
    grunt.file.copy('src/index.html', this.data.dir + '/index.html', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' ),
            buildInfo: buildInfo
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );
    var options = this.options();
    // generate path to the root directory that depends on nesting of build directories
    var buildFoldersArray = grunt.config('build_dir').split('/');
    var pathToRootDirectory = "";
    for (var i = 0; i < buildFoldersArray.length; i++) {
      pathToRootDirectory += "../";
    }
    grunt.file.copy( options.templateFileSrc, grunt.config( 'build_dir' ) + "/" + options.templateFileDest, {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            build_dir: grunt.config('build_dir'),
            root_dir: pathToRootDirectory
          }
        });
      }
    });
  });


  grunt.registerTask('readGitRevision', function() {
    grunt.event.once('git-describe', function (rev) {
      grunt.option('gitRevision', rev);
    });
    grunt.task.run('git-describe');
  });


};
