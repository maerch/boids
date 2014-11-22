var gulp       = require('gulp');
var browserify = require('browserify');
var transform  = require('vinyl-transform');
var sass       = require('gulp-sass');

var paths = {
  scripts: "app/scripts/*.js",
  html:    ["app/*.html", "app/favicon.ico"],
  sass:    ["app/sass/*.sass"]
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
  return gulp.src(paths.html)
              .pipe(gulp.dest("./public"))
})

gulp.task("sass", function() {
  var sassIncludePaths = require('node-bourbon').includePaths;
  sassIncludePaths.unshift("./app/vendor/bitters");

  return gulp.src(paths.sass)
              .pipe(sass({
                errLogToConsole: true, 
                // Due to a bug we need this to handle
                // sass syntax instead scss
                sourceComments: 'normal',
                includePaths:   sassIncludePaths
              }))
              .pipe(gulp.dest("./public/css"))
})

gulp.task("watch", function() {
  gulp.watch(paths.scripts, ["browserify"]);
  gulp.watch(paths.html, ["html"]);
  var sassPaths = paths.sass.slice();
  sassPaths.push("app/sass/*.scss");
  gulp.watch(sassPaths, ["sass"]);

})

gulp.task("copy", ["html", "sass"]);
gulp.task("default", ["browserify", "copy", "watch"]);
