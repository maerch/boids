var gulp       = require('gulp');
var browserify = require('browserify');
var transform  = require('vinyl-transform');

var paths = {
  scripts: "app/scripts/*.js",
  html:    "app/*.html",
  styles:  "app/styles/*.css"
}

gulp.task("browserify", function() {
  var browserified = transform(function(filename) {
    return browserify(filename).bundle();
  });

  return gulp.src([paths.scripts])
             .pipe(browserified)
             .pipe(gulp.dest('./public/js'));
});

gulp.task("html", function() {
  return gulp.src([paths.html])
              .pipe(gulp.dest("./public"))
})

gulp.task("styles", function() {
  return gulp.src([paths.styles])
              .pipe(gulp.dest("./public/css"))
})

gulp.task("watch", function() {
  gulp.watch(paths.scripts, ["browserify"]);
  gulp.watch(paths.html, ["html"]);
  gulp.watch(paths.styles, ["styles"]);
})

gulp.task("copy", ["html", "styles"]);
gulp.task("default", ["browserify", "copy", "watch"]);
