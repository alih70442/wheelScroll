'use strict';

// scss +++

var gulp = require('gulp');
var sass = require('gulp-sass');
// var sassImportOnce = require('gulp-sass-import-once');
// var sass = require('node-sass');
var importOnce = require('node-sass-import-once');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp
        .src('dist/scss/**/*.scss')
        .pipe(sass({ importer: importOnce, outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('sass:watch', function () {
    //   gulp.watch('dist/scss/**/*.scss', ['sass']);
    gulp.watch('dist/scss/*.scss', gulp.series(['sass']));
});

// js +++

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('js', function () {
    return gulp.src('./dist/js/wheelScroll.js')
        // .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/build/'));
});

gulp.task('project:watch', function () {
    //   gulp.watch('dist/scss/**/*.scss', ['sass']);
    gulp.watch('dist/scss/*.scss', gulp.series(['sass']));
    gulp.watch('./dist/js/wheelScroll.js', gulp.series(['js']));
});