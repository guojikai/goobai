var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var webpack = require('webpack');

/* 处理任务 ********************************************************/
// 打包
gulp.task('build_app', function () {
    gulp.src(['./node_modules/jquery/dist/jquery.min.js'])
        .pipe(concat('lib.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./test/resources/'))
        .pipe(livereload());
    gulp.src(['./src/app.js'])
        .pipe(concat('app.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./test/resources/'))
        .pipe(livereload());
    gulp.src(['./src/options.js'])
        .pipe(concat('options.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./test/resources/'))
        .pipe(livereload());
});
// 监视文件改动 打包 app 文件，并刷新浏览器
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['./src/**/*.*'], ['build_app']);
});


//dev
gulp.task('dev', ['build_app', 'watch']);
/**
 * default task
 */
gulp.task('default', ['dev']);


//Handle the error
function errorHandler(error) {
  console.log(error.toString());
  this.emit('end');
}



