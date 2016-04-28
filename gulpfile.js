var gulp = require('gulp'),
  config,
  del = require('del'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  nodemon = require('gulp-nodemon'),
  replace = require('gulp-replace'),
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
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
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
    .pipe(replace('BASEURL', config.site.site_base))
    .pipe(gulp.dest('./_public/app/views/'));
});

gulp.task('develop', ['set-dev-node-env', 'watch'], function() {
  nodemon({
      //env: { 'NODE_ENV': 'dev' },
      script: 'server.js',
      ext: 'js html css',
      ignore: ['_public/*']
    }).on('start', function() {
      console.log('Start gulp-nodemon');
      return ['watch'];
    })
    .on('change', function(event) {
      console.log('Change in gulp-nodemon: ' + event);
      return ['watch'];
    })
    .on('restart', function(event) {
      console.log('Restarted: ' + event);
      return ['watch'];
    });
});

gulp.task('build', ['views', 'js', 'style', 'jsAssets', 'index']);

gulp.task('watch', ['build'], function() {
  gulp.watch('./app/assets/js/*', ['jsAssets']);
  gulp.watch('./public/assets/styles/*', ['style']);
  gulp.watch('./public/app/views/**/*.html', ['views']);
  gulp.watch('./public/index.html', ['index']);
  gulp.watch('./public/app/**/*.js', ['js']);
});

gulp.task('set-dev-node-env', function() {
  process.env.NODE_ENV = 'dev';
  config = require('config');
});

gulp.task('build-production', ['views', 'js-production', 'style', 'views', 'jsAssets', 'index']);

gulp.task('default', ['watch']);
