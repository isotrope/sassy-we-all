/*
 * Most of this file is based on http://gielberkers.com/watching-and-building-your-project-with-gulp/
 */

// These are the dependacies that our project needs to do its Gulp'ing
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	minifycss = require('gulp-minify-css'),
	combineMq = require('gulp-combine-mq'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	runSequence = require('run-sequence'),
	livereload = require('gulp-livereload')
notify = require('gulp-notify');


//   __          ___     _ _
//   \ \        / / |   (_) |
//    \ \  /\  / /| |__  _| | ___
//     \ \/  \/ / | '_ \| | |/ _ \
//      \  /\  /  | | | | | |  __/
//   __  \/ _\/   |_| |_|_|_|\___|
//   \ \   / /          |  __ \
//    \ \_/ /__  _   _  | |  | | _____   __
//     \   / _ \| | | | | |  | |/ _ \ \ / /
//      | | (_) | |_| | | |__| |  __/\ V /
//      |_|\___/ \__,_| |_____/ \___| \_/
//
//

// SASS the heck out of this project:
gulp.task('dev-css', function () {
	return gulp.src('src/sass/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			precision: 10,
			//onError: console.error.bind(console, 'Sass error:')
		})
			.on('error', notify.onError(function (error) {
				console.log(error);
				return error.message;
			})
		)
	)
		.pipe(autoprefixer())
		.pipe(sourcemaps.write({includeContent: true}))
		.pipe(gulp.dest('./'))
		.pipe(notify('Dev-CSS task complete!'));
});

// Concatenate all JS into one script:
gulp.task('dev-js', function () {
	return gulp.src(
		['src/js/jquery.scripts.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('jquery.scripts.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('js'))
		.pipe(notify('Dev-JS task complete!'));
});


// Watcher:
gulp.task('watch', function () {
	// Create LiveReload server
	livereload.listen();
	// Watch .scss files
	gulp.watch('src/sass/*.scss', ['dev-css'])
		.on('change', livereload.changed)
	;
	gulp.watch('src/js/**/*.js', ['dev-js']);
});


//   __          ___                                    _
//   \ \        / / |                                  ( )
//    \ \  /\  / /| |__   ___ _ __    _   _  ___  _   _|/ _ __ ___
//     \ \/  \/ / | '_ \ / _ \ '_ \  | | | |/ _ \| | | | | '__/ _ \
//      \  /\  /  | | | |  __/ | | | | |_| | (_) | |_| | | | |  __/
//       \/  \/   |_| |_|\___|_| |_|  \__, |\___/ \__,_| |_|  \___|
//                                     __/ |
//    _____                _          |___/
//   |  __ \              | |        / _|
//   | |__) |___  __ _  __| |_   _  | |_ ___  _ __
//   |  _  // _ \/ _` |/ _` | | | | |  _/ _ \| '__|
//   | | \ \  __/ (_| | (_| | |_| | | || (_) | |
//   |_|  \_\___|\__,_|\__,_|\__, | |_| \___/|_|
//    _____               _   __/ |    _   _
//   |  __ \             | | |___/    | | (_)
//   | |__) | __ ___   __| |_   _  ___| |_ _  ___  _ __
//   |  ___/ '__/ _ \ / _` | | | |/ __| __| |/ _ \| '_ \
//   | |   | | | (_) | (_| | |_| | (__| |_| | (_) | | | |
//   |_|   |_|  \___/ \__,_|\__,_|\___|\__|_|\___/|_| |_|
//
//

// Make the CSS as small and optimized as possible:
gulp.task('build-css', function () {
	return gulp.src('src/sass/style.scss')
		.pipe(sass({
			precision: 10,
			//onError: console.error.bind(console, 'Sass error:')
		})
			.on('error', notify.onError(function (error) {
				return error.message;
			})
		)
	)
		.pipe(autoprefixer())
		.pipe(combineMq())
		.pipe(minifycss())
		.pipe(gulp.dest('./'))
		.pipe(notify('Production CSS task complete!'));
});

// Concatenate and uglify JS:
gulp.task('build-js', function () {
	return gulp.src(
		['src/js/jquery.scripts.js'])
		.pipe(concat('jquery.scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js'))
		.pipe(notify('Production JS task complete!'));
});

// Setup the build:
gulp.task('build', function (cb) {
	// CSS and JavaScript:
	runSequence('build-css', 'build-js', cb);
});


gulp.task('default', ['dev-css', 'dev-js', 'watch']);