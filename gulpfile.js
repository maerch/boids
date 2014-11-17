var gulp       = require('gulp');
var browserify = require('browserify');
var transform  = require('vinyl-transform');

gulp.task("browserify", function() {
  var browserified = transform(function(filename) {
    return browserify(filename).bundle();
  });

  return gulp.src(["./app/scripts/*.js"])
             .pipe(browserified)
             .pipe(gulp.dest('./public/js'));
})
