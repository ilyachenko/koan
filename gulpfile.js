var fs              = require('fs'),
    del             = require('del'),
    gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    gutil           = require('gulp-util'),
    concat          = require('gulp-concat'),
    nodemon         = require('gulp-nodemon'),
    sourcemaps      = require('gulp-sourcemaps'),
    livereload      = require('gulp-livereload');

var config          = require('./config').config;

var outputDir       = 'client/build/',
    src             = 'client/src/',
    sassSources     = [src + '**/*.scss'],
    htmlSources     = [src + '**/*.html'],
    imagesSources   = [src + '**/*.png'],
    jsSources       = [src + '**/*.module.js', src + '**/*.js', '!' + src + '**/*.spec.js'],
    jsSpecs         = [src + '**/*.spec.js'];

gulp.task('sass', function() {
  gulp.src(sassSources)
    .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
    .pipe(concat('app.css'))
    .pipe(gulp.dest(outputDir))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputDir))
});

gulp.task('js:libs', function() {
  gulp.src(config.client.js)
    .pipe(sourcemaps.init())
      .pipe(concat('libs.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputDir))
});

gulp.task('css:libs', function() {
  gulp.src(config.client.css)
      .pipe(sourcemaps.init())
        .pipe(concat('libs.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(outputDir))
});

gulp.task('js:spec', function() {
  gulp.src(jsSpecs)
    .pipe(gulp.dest(outputDir))
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(htmlSources, ['html']);
  livereload.listen();
  gulp.watch(['.nodemon', src + '/**']).on('change', livereload.changed);
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: ['client/*'],
    args: ['--debug', '--harmony'],
    env: {'NODE_ENV': 'development'},
  }).on('restart', function () {
    fs.writeFileSync('.nodemon', 'restarted');
  })
});

gulp.task('html', function() {
  gulp.src(htmlSources)
    .pipe(gulp.dest(outputDir))
});

gulp.task('images', function() {
  gulp.src(imagesSources)
    .pipe(gulp.dest(outputDir))
});

gulp.task('fonts', function() {
  gulp.src(config.client.fonts)
    .pipe(gulp.dest(outputDir + 'fonts'))
});

gulp.task('clean', function() {
  del.sync([outputDir + '**', '!client/build', '!client/build/bower_components/**']);
});

gulp.task('default', ['build', 'nodemon', 'watch'], function () {
  livereload.listen()
});

gulp.task('build:js', ['js:libs', 'js', 'js:spec']);

gulp.task('build:css', ['sass', 'css:libs']);

gulp.task('build', [
  'clean',
  'html',
  'build:js', 'build:css', 'js:spec',
  'images', 'fonts'
]);
