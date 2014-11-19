var gulp       = require('gulp');
var browserify = require('browserify');
var transform  = require('vinyl-transform');
var sass       = require('gulp-sass');

var paths = {
  scripts: "app/scripts/*.js",
  html:    "app/*.html",
  sass:    ["app/sass/*.sass", "app/sass/*.scss"]
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

gulp.task("sass", function() {
  return gulp.src(paths.sass)
              .pipe(sass({
                errLogToConsole: true, 
                // Due to a bug we need this to handle
                // sass syntax instead scss
                sourceComments: 'normal',
                includePaths:   require('node-bourbon').includePaths
              }))
              .pipe(gulp.dest("./public/css"))
})

gulp.task("watch", function() {
  gulp.watch(paths.scripts, ["browserify"]);
  gulp.watch(paths.html, ["html"]);
  gulp.watch(paths.sass, ["sass"]);
})

gulp.task("copy", ["html", "sass"]);
gulp.task("default", ["browserify", "copy", "watch"]);
