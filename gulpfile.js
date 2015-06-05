var gulp  = require('gulp'),
	sass  = require('gulp-ruby-sass'),
	jade  = require('gulp-jade'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
	connect = require('gulp-connect');

var config = {
	bowerDir: './bower_components/'
};

gulp.task('sass', function() {
    return sass('src/sass', { style: 'expanded' })
        .pipe(gulp.dest('dist/css'))
    	.pipe(livereload());
});

gulp.task('watch-css', function () {
	livereload.listen();

    gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('jade', function () {
  return gulp.src('src/jade/**/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
});

gulp.task('watch-html', function () {
	livereload.listen();

    gulp.watch('src/jade/**/*.jade', ['jade']);
});


gulp.task('connect', function() {
	connect.server();
});

gulp.task('bootstrap', function() { 
    return gulp.src(config.bowerDir + 'bootstrap/dist/css/bootstrap.min.css') 
        .pipe(gulp.dest('./dist/css')); 
});

gulp.task('jquery', function() { 
    return gulp.src(config.bowerDir + 'jquery/dist/jquery.min.js') 
        .pipe(gulp.dest('./dist/js')); 
});

gulp.task('build', ['sass', 'jade', 'bootstrap', 'jquery'], function() {

	console.log('gulp build');

});

gulp.task('default', ['build', 'connect', 'watch-css', 'watch-html'], function() {

	console.log('gulp run');

});