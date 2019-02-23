var gulp = require('gulp'),
glp = require('gulp-load-plugins'),
browserSync = require('browser-sync').create();
plugins = glp();

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: 'dist/'
		}
	})
});

gulp.task('stylus', function(done) {
	return gulp.src('app/css/*.{css,styl}')
	.pipe(plugins.stylus({
		'include css': true
	}))
	.pipe(plugins.autoprefixer({
		browsers: ['last 4 versions'],
            cascade: false
	}))
	.pipe(plugins.concat('main.css'))
	.pipe(plugins.csso({ 
		restructure: false,
		sourceMap: true,
		debug: true
	}))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
	done()
});

gulp.task('scripts', function(done) {
	return gulp.src(['app/js/**/*.js', 'app/js/main.js'])
	.pipe(plugins.concat('main.js'))
	.pipe(plugins.uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({
		stream: true
	}))
	done()
});

gulp.task('img', function(done) {
	return gulp.src('app/img/**/*.*')
	.pipe(plugins.image())
	.pipe(gulp.dest('dist/img'))
	done()
});

gulp.task('indexmin', function(done) {
	return gulp.src('app/*.html')
	.pipe(plugins.htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('dist'))
	done()
});


gulp.task('fonts', function(done) {
	return gulp.src('app/font/*.*')
	.pipe(gulp.dest('dist/font'))
	done()
});

gulp.task('watch', function() {
	gulp.watch('app/**/*.styl', gulp.series('stylus'))
	gulp.watch('app/**/*.css', gulp.series('stylus'))
	gulp.watch('app/js/**/*.js', gulp.series('scripts'))		
	gulp.watch('app/font/**/*.*', gulp.series('fonts'))		
	gulp.watch('app/index.html', gulp.series('indexmin')).on('change', browserSync.reload)										  	 
});

gulp.task('default', gulp.series(
	gulp.parallel('stylus', 'scripts','indexmin','fonts'), 
	gulp.parallel('serve', 'watch')
));

gulp.task('build', gulp.parallel('scripts','fonts','stylus','indexmin'));