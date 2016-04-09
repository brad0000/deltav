var gulp        = require("gulp"),
    Config      = require('./gulpfile.config'),
    //browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    //buffer      = require("vinyl-buffer"),
    concat      = require('gulp-concat'),
    // rename      = require('gulp-rename'),
    // uglify      = require("gulp-uglify"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    //runSequence = require("run-sequence"),
    //mocha       = require("gulp-mocha"),
    //istanbul    = require("gulp-istanbul"),
    tsProject   = tsc.createProject('tsconfig.json'),
    del         = require('del'),
    //superstatic = require( 'superstatic' )
    browserSync = require('browser-sync')
    .create();

var config = new Config();

gulp.task("lint", function() {
    return gulp.src([
        "./source/**/**.ts"
    ])
    .pipe(tslint({ }))
    .pipe(tslint.report("verbose"));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () { 
    var sourceTsFiles = [
        config.allTypeScript,               // path to typescript files
        config.libraryTypeScriptDefinitions // reference to library .d.ts files
    ];

    var tsResult = gulp.src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
    
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});


/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
  var typeScriptGenFiles = [
    config.dist + '/**/*.js',            // bundled files
    config.tsOutputPath +'/**/*.js',     // path to all JS files auto gen'd by editor
    config.tsOutputPath +'/**/*.js.map', // path to all sourcemap files auto gen'd by editor
    '!' + config.tsOutputPath + '/lib'
  ];

  // delete the files
  del(typeScriptGenFiles, cb);
});

gulp.task("bundle", ['compile-ts'], function() {
    var outputFolder   = "./dist/";
    
    return gulp.src([
            './source/libs/sylvester.js',
            './source/js/thing.js',
            './source/js/app.js',
            './source/js/body.js',
            './source/js/star.js',
            './source/js/smoke.js',
            './source/js/client.js',
            './source/js/input.js',
            './source/js/ship.js',
            './source/js/asteroid.js',
            './source/js/world.js',
        ])
        .pipe(concat('deltav.js'))
        //.pipe(gulp.dest(outputFolder))
        //.pipe(rename('uglify.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(outputFolder));

    // var libraryName = "deltav";
    // var mainTsFilePath = "./source/js/app.js";
    // var outputFileName = libraryName + ".js";

    // var bundler = browserify({
    //     debug: true,
    //     standalone : libraryName
    // });

    // return bundler
    //     .add('./source/js/app.js')
    //     .add('./source/js/client.js')
    //     .add('./source/js/input.js')
    //     .add('./source/js/ship.js')
    //     //.add('./source/sylvester.js')
    //     .bundle()
    //     .pipe(source(outputFileName))
    //     //.pipe(buffer())
    //     //.pipe(sourcemaps.init({ loadMaps: true }))
    //     //.pipe(uglify())
    //     //.pipe(sourcemaps.write('./'))
    //     .pipe(gulp.dest(outputFolder));
});

gulp.task('default', ['lint', 'bundle']);

// var watcher = gulp.watch('source/**/*.ts', ['lint']);
// watcher.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
// });
