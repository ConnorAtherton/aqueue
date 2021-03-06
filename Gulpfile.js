var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var stylish = require('jshint-stylish');

var jsFileGlob = 'src/**/*.js';

gulp.task('js:lint', function() {
  return gulp
    .src(jsFileGlob)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('js:build', function() {
  return gulp
    .src(jsFileGlob)
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.watch(jsFileGlob, ['js:lint', 'js:build']);
});

gulp.task('default', ['js:lint', 'js:build', 'watch']);