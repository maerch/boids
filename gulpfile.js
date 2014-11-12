var gulp       = require('gulp');
var rename     = require('gulp-rename');
var browserify = require('gulp-browserify');
var watch      = require('gulp-watch');

gulp.task('default', function() {
  watch("index.js")
      .pipe(browserify())
      .pipe(rename("bundle.js"))
      .pipe(gulp.dest('.'));
});
