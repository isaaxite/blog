'use strict';

const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('compile', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});

gulp.task('default', function() {
  return gulp.watch('./src/**/*.scss', 'compile');
});