var gulp  = require('gulp'),
	sass  = require('gulp-ruby-sass'),
	jade  = require('gulp-jade'),
    watch = require('gulp-watch'),
    data = require('gulp-data'),
    path = require('path'),
    livereload = require('gulp-livereload'),
	connect = require('gulp-connect');

var statics = {
	test: "static test STRING",
	title: "static title"
};

var config = {
	bowerDir: './bower_components/'
};

gulp.task('js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
    	.pipe(livereload());
});

gulp.task('watch-js', function () {
	livereload.listen();

    gulp.watch('src/js/**/*.js', ['js']);
});

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
		.pipe(data(function(file) {
			//var json = require('./src/data/' + path.basename(file.path) + '.json');
			//var data = _.assign({}, json, statics);
			//return data;
			return statics;
		}))
		.pipe(jade({
			pretty: true,
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
});

gulp.task('watch-html', function () {
	livereload.listen();

    gulp.watch('src/jade/**/*.jade', ['jade']);
});


gulp.task('connect', function() {
	connect.server({
		root: 'dist'
	});
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

gulp.task('default', ['build', 'connect', 'watch-css', 'watch-html', 'watch-js'], function() {

	console.log('gulp run');

});