var gulp       = require('gulp');
var rename     = require('gulp-rename');
var browserify = require('gulp-browserify');

gulp.task('default', function() {
  gulp.src("index.js")
      .pipe(browserify())
      .pipe(rename("bundle.js"))
      .pipe(gulp.dest('.'));
});
