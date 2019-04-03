var gulp = require('gulp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')


gulp.task('js', function(){
    gulp.src([ 
        'controllers/directives/*.js', 
        'controllers/services/*.js', 
        'root-controller.js', 
        'controllers/pages/*.js', 
        'controllers/modals/*.js', 
        'controllers/routes.js' 
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('snikuws.js'))        
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets'))
})

gulp.task('watch:js', ['js'], function () {
    gulp.watch(['root-controller.js', 'controllers/**/*.js'], ['js'])
})
