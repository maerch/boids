var gulp       = require('gulp');
var browserify = require('browserify');
var transform  = require('vinyl-transform');

var paths = {
  scripts: "app/scripts/*.js"
}

gulp.task("browserify", function() {
  var browserified = transform(function(filename) {
    return browserify(filename).bundle();
  });

  return gulp.src([paths.scripts])
             .pipe(browserified)
             .pipe(gulp.dest('./public/js'));
});

gulp.task("watch", function() {
  gulp.watch(paths.scripts, ["browserify"]);
})

gulp.task("default", ["browserify", "watch"]);
