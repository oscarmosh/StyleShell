
var gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		nib = require('nib'),
		jeet = require('jeet'),
		rupture = require('rupture'),
		browserSync = require('browser-sync'),
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		jshint = require('gulp-jshint'),
		header  = require('gulp-header'),
		rename = require('gulp-rename'),
		minifyCSS = require('gulp-minify-css'),
		package = require('./package.json');


var paths = {
	styles: ['src/style/normalize.styl',
			'src/style/style.styl'],
	scripts: 'src/js/scripts.js'
};

var banner = [
	'/*!\n' +
	' * <%= package.name %>\n' +
	' * <%= package.title %>\n' +
	' * <%= package.url %>\n' +
	' * @author <%= package.author %>\n' +
	' * @version <%= package.version %>\n' +
	' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
	' */',
	'\n'
].join('');



gulp.task('css', function () {
		return gulp.src(paths.styles)
		.pipe(stylus({
        use:[nib(), jeet(), rupture()],
      	}))
		.pipe(concat('all.css'))
		.pipe(minifyCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(header(banner, { package : package }))
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
	gulp.src(paths.scripts)
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(header(banner, { package : package }))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(browserSync.reload({stream:true, once: true}));
});

// Set your local server here
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "http://local.jeet.dev"
    });
});


// You also can use a Static Server (swicht to this task)
// gulp.task('browser-sync', function() {
// 		browserSync.init(null, {
// 				server: {
// 						baseDir: "app"
// 				}
// 		});
// });


gulp.task('bs-reload', function () {
		browserSync.reload();
});


gulp.task('default', ['css', 'js', 'browser-sync'], function () {
		gulp.watch("src/style/*.styl", ['css']);
		gulp.watch("src/js/*.js", ['js']);
		gulp.watch("app/*.html", ['bs-reload']);
});