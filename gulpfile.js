var gulp = require('gulp'),
  del = require('del'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  nodemon = require('gulp-nodemon'),
  sourcemaps = require('gulp-sourcemaps'),
  ngAnnotate = require('gulp-ng-annotate');

gulp.task('delete', function() {
  return del(['./_public/*'])
    .then(function() {
      console.log('Files Deleted');
    });
});

gulp.task('js', function() {
  return gulp.src('./public/app/**/*.js')
    .pipe(ngAnnotate())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./_public/app/'));
});

gulp.task('js-production', function() {
  return gulp.src('./public/app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./_public/app/'));
});

gulp.task('jsAssets', function() {
  return gulp.src('./public/assets/js/**/*.js')
    .pipe(gulp.dest('./_public/assets/js/'));
});

gulp.task('style', function() {
  return gulp.src('./public/assets/style/*')
    .pipe(gulp.dest('./_public/assets/style/'));
});

gulp.task('index', function() {
  return gulp.src('./public/index.html')
    .pipe(gulp.dest('./_public/'));
});

gulp.task('views', function() {
  return gulp.src('./public/app/views/**/*.html')
    .pipe(gulp.dest('./_public/app/views/'));
});

gulp.task('develop', function() {
  nodemon({
      env: { 'NODE_ENV': 'dev' },
      script: 'server.js',
      ext: 'js html css'
    }).on('start', function() {
      console.log('Start gulp-nodemon');
      return ['watch'];
    })
    .on('change', function() {
      console.log('Change in gulp-nodemon');
      return ['watch'];
    })
    .on('restart', function() {
      console.log('Restarted');
      return ['watch'];
    });
});

gulp.task('build', ['views', 'js', 'style', 'views', 'jsAssets', 'index']);

gulp.task('watch', ['build'], function() {
  gulp.watch('./app/assets/js/*', ['jsAssets']);
  gulp.watch('./public/assets/styles/*', ['style']);
  gulp.watch('./public/app/views/**/*.html', ['views']);
  gulp.watch('./public/index.html', ['index']);
  gulp.watch('./public/app/**/*.js', ['js']);
});

gulp.task('build-production', ['views', 'js-production', 'style', 'views', 'jsAssets', 'index']);

gulp.task('default', ['watch']);
