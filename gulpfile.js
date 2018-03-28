//Gulp Workflow
//gulp required installs
var gulp=require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var sass = require('gulp-sass');


//file sources for all folders and files
var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/css/**/*.css',
  srcJS: 'src/js/**/*.js',
  srcSCSS:'src/sass/**/*.scss',

  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpCSS: 'tmp/css/**/*.css',
  tmpJS: 'tmp/js/**/*.js',

  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/css/**/*.css',
  distJS: 'dist/js/**/*.js'
};

gulp.task('html', function () {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
  return gulp.src(paths.srcCSS).pipe(gulp.dest('tmp/css/'));
});

gulp.task('js', function () {
  return gulp.src(paths.srcJS).pipe(gulp.dest('tmp/js/'));
});


gulp.task('sass', function() {
    gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('tmp/fonts/'))
})

//add image compression later
gulp.task('images', function() {
  return gulp.src('src/images/**/*').pipe(gulp.dest('tmp/images/'))
})


gulp.task('copy', ['sass', 'html', 'css', 'js', 'fonts', 'images']);

gulp.task('inject', ['copy'], function () {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], function () {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      port: 3000,
      livereload: true
    }));
});

gulp.task('watch', ['serve'], function () {
  gulp.watch(paths.src, ['inject']);
});


//Use webserver at http://localhost:3000/
//gulp for basic development tasks
gulp.task('default', ['watch']);



//production build tasks
//gulp build to create dist files
gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'));
});
gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});
gulp.task('fonts:dist', function() {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts/'))
})

gulp.task('images:dist', function() {
  return gulp.src('src/images/**/*').pipe(gulp.dest('dist/images/'))
})


gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist', 'fonts:dist', 'images:dist']);
gulp.task('inject:dist', ['copy:dist'], function () {
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['inject:dist']);


//gulp clean to delete tmp and dist folders for version control
gulp.task('clean', function () {
  del([paths.tmp, paths.dist]);
});
