var gulp       = require('gulp');
var rename     = require('gulp-rename');
var browserify = require('gulp-browserify');
var watch      = require('gulp-watch');
var coffee     = require('gulp-coffee');

gulp.task('default', function() {
  watch("index.js")
      .pipe(browserify())
      .pipe(rename("bundle.js"))
      .pipe(gulp.dest('public/'));
});

gulp.task('coffee', function() {
  console.log("Ehmt ")
  gulp.src('./src/*.coffee')
      .pipe(coffee({bare: true}).on('error', console.log))
      .pipe(browserify())
      .pipe(rename("bundle.js"))
      .pipe(gulp.dest('./public/'));
})
