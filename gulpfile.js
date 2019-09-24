var gulp = require('gulp'),
	glp = require('gulp-load-plugins')(),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync').create();

gulp.task('pug', function() {
	return gulp.src('app/pug/*.pug')
	.pipe(glp.pug({
		pretty: true 
	}))
	.pipe(gulp.dest('dist/'))
	.on('end', browserSync.reload)
});

gulp.task('stylus:conc', function() {
	return gulp.src('app/stylus/*.styl')
	.pipe(glp.stylus({
		'include css': true
	}))
	.pipe(glp.autoprefixer({
		browsers: ['ie >= 8', 'last 4 version']
	}))
	.pipe(glp.concat('main.css'))
	// .pipe(glp.csso())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});
gulp.task('stylus:no-conc', function() {
	return gulp.src('app/stylus/noconcat/*.styl')
	.pipe(glp.stylus({
		'include css': true
	}))
	.pipe(glp.autoprefixer({
		browsers: ['ie >= 8', 'last 4 version']
	}))
	// .pipe(glp.csso())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
	// .pipe(glp.browserify({
	// 	insertGlobals : true
	// }))
	.pipe(glp.babel({
		"presets": ["@babel/preset-env"]
	}))
	// .pipe(glp.uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('scripts:libs', function() {
	return gulp.src('app/js/libs/*.js')
	.pipe(glp.uglify())
	.pipe(gulp.dest('dist/js/libs'))
	.pipe(browserSync.reload({
		stream: true
	}))
});
gulp.task('scripts:scripts', function() {
	return gulp.src('app/js/scripts/*.js')
	.pipe(glp.uglify())
	.pipe(gulp.dest('dist/js/scripts'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('static', function() {
	return gulp.src('app/static/**/*.*')
	.pipe(gulp.dest('dist/'))
	.pipe(browserSync.reload({
		stream: true
	}))
});
gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*.*')
	.pipe(gulp.dest('dist/css/fonts/'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('img:dev', function() {
	return gulp.src('app/img/**/*.*')
	.pipe(gulp.dest('dist/img'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('img:build', function() {
	return gulp.src('app/img/**/*.*')
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('serve', function() {
	browserSync.init({
		server: {
			injectChanges: true,
			baseDir: 'dist/'
		}
	})
});

gulp.task('watch', function() {
	gulp.watch('app/**/**/*.pug', gulp.series('pug'))
	gulp.watch('app/**/**/*.styl', gulp.series('stylus:no-conc'))
	gulp.watch('app/**/**/*.css', gulp.series('stylus:no-conc'))
	gulp.watch('app/**/**/*.styl', gulp.series('stylus:conc'))
	gulp.watch('app/**/**/*.css', gulp.series('stylus:conc'))
	gulp.watch('app/**/**/*.js', gulp.series('scripts'))
	gulp.watch('app/js/libs/*.js', gulp.series('scripts:libs'))
	gulp.watch('app/js/scripts/*.js', gulp.series('scripts:scripts'))
	gulp.watch('app/static/**/*.*', gulp.series('static'))
	gulp.watch('app/img/**/*.png', gulp.series('img:dev'))
});

gulp.task('default', gulp.series(
	gulp.parallel('pug', 'stylus:conc', 'stylus:no-conc', 'scripts:libs', 'scripts:scripts', 'scripts', 'fonts', 'static', 'img:dev'), 
	gulp.parallel('serve', 'watch')
));

gulp.task('build', gulp.series(
	'clean', 'pug', 'stylus:conc', 'stylus:no-conc', 'scripts', 'scripts:libs', 'scripts:scripts','fonts', 'static', 'img:build'
));