var gulp = require("gulp");
var del = require('del');
var plugins = require('gulp-load-plugins')();
var templateCache = require('gulp-angular-templatecache');

var dirs = {src: 'app', dist: 'dist', tmp: 'tmp'};
var path = require('path');
var fs = require('fs');

gulp.task('default', ['clean', 'assets', 'compile', 'vendor']);

gulp.task('clean', function() {
  return del.sync(['tmp', 'dist']);
});

gulp.task('compile', ['compile:templates', 'compile:app', 'compile:style']);

// 构建模板为 angular 独立模块
gulp.task('compile:templates', function () {
  return gulp.src('src/templates/**/*.html')
    .pipe(templateCache({
      // root: 'templates/',
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(path.join(dirs.dist, 'assets')));
});

// 打包 ng 文件为独立文件
gulp.task('compile:app', () => {
  var nowTime = new Date().toString()
  return gulp
    .src('src/app/*.js')
    .pipe(plugins.wrap(
      '// File: <%=file.path.substring(file.cwd.length + 1)%> Time: <%=time%>\n<%=contents%>\n',
      {time: nowTime},
      {parse: false}
    ))
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest(path.join(dirs.dist, 'assets')))
});

gulp.task('compile:style', () => {
  return gulp.src('src/style/main.scss')
    // .pipe(newer({dest: 'dist/css/tuku.css', extra: ['style/**/*.scss']}))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
    .pipe(plugins.rename('app.css'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(dirs.dist, 'assets')));
});

gulp.task('assets', function() {
  return gulp
    .src(['src/static/**'], {base: 'src/static/'})
    .pipe(gulp.dest(path.join(dirs.dist)))
});

gulp.task('vendor', ['vendor:js', 'vendor:css', 'vendor:fonts']);

gulp.task('vendor:js', () => {
  return gulp.src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jquery.cookie/jquery.cookie.js',
      'node_modules/noty/js/noty/packaged/jquery.noty.packaged.js',
      'node_modules/moment/moment.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'node_modules/dropzone/dist/dropzone.js',
      'node_modules/underscore/underscore.js',
      'node_modules/bluebird/js/browser/bluebird.js'
    ])
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest(path.join(dirs.dist, 'assets', 'js')))
    .pipe(plugins.rename('vendor.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(path.join(dirs.dist, 'assets', 'js')));
});

gulp.task('vendor:css', () => {
  return gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.css',
      // 'node_modules/bootstrap/dist/css/bootstrap-theme.css',
      'node_modules/font-awesome/css/font-awesome.css',
      'node_modules/dropzone/dist/dropzone.css'
    ])
    .pipe(plugins.concat('vendor.css'))
    .pipe(gulp.dest(path.join(dirs.dist, 'assets', 'css')))
    .pipe(plugins.rename('vendor.min.css'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(dirs.dist, 'assets', 'css')));
});

gulp.task('vendor:fonts', () => {
  return gulp.src([
      'node_modules/bootstrap/fonts/*',
      'node_modules/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest(path.join(dirs.dist, 'assets', 'fonts')))
});

gulp.task('watch', ['default'], () => {
  gulp.watch('src/app/**', ['compile:app']);
  gulp.watch('src/static/**', ['assets']);
  gulp.watch('src/style/**', ['compile:style']);
  gulp.watch('src/templates/**', ['compile:templates']);
});
