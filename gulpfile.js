var gulp        = require("gulp"),
    Config      = require('./gulpfile.config'),
    source      = require("vinyl-source-stream"),
    concat      = require('gulp-concat'),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    tsProject   = tsc.createProject('tsconfig.json'),
    del         = require('del'),
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
            './source/js/rtree.js',
            './source/js/thing.js',
            './source/js/app.js',
            './source/js/body.js',
            './source/js/star.js',
            './source/js/smoke.js',
            './source/js/client.js',
            './source/js/input.js',
            './source/js/weapon.js',
            './source/js/ship.js',
            './source/js/drone.js',
            './source/js/asteroid.js',
            './source/js/world.js',
        ])
        .pipe(concat('deltav.js'))
        .pipe(gulp.dest(outputFolder));
});

gulp.task('default', ['lint', 'bundle']);

// var watcher = gulp.watch('source/**/*.ts', ['lint']);
// watcher.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
// });
