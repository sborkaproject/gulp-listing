'use strict';

var gulp = require('gulp');
var listing = require('../');

gulp.task('html:build', function () {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./build/'));
});

gulp.task('html:listing', function () {
    return gulp.src('./src/*.html')
        .pipe(listing('index.html'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('browserSync', function () {
    var browserSync = require('browser-sync');
    browserSync({
        server: {
            baseDir: 'build'
        },
        host: 'localhost',
        port: 9000,
        logPrefix: 'SP.Starter',
        open: false,
        files: [
            'build/media/css/*.css',
            'build/media/js/*.js',
            'build/*.html'
        ]
    });
});

gulp.task('default', [
    'html:listing',
    'html:build',
    'browserSync'
]);

