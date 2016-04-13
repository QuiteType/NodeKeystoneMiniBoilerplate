
// -------------------------------------
//   Packages
// -------------------------------------

// General
var gulp        = require('gulp'),
    fs          = require('fs'),
    del         = require('del'),
    lazypipe    = require('lazypipe'),
    plumber     = require('gulp-plumber'),
    flatten     = require('gulp-flatten'),
    tap         = require('gulp-tap'),
    //tap         = require('through'),
    rename      = require('gulp-rename'),
    header      = require('gulp-header'),
    footer      = require('gulp-footer'),
    watch       = require('gulp-watch'),
    livereload  = require('gulp-livereload'),
    package     = require('./package.json');

// Scripts and tests
var jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    karma       = require('gulp-karma'),
    include     = require("gulp-include");

// Styles
var sass        = require('gulp-sass'),
    prefix      = require('gulp-autoprefixer'),
    minify      = require('gulp-minify-css'),
    cssGlobbing = require('gulp-css-globbing');

// SVGs
var svgmin      = require('gulp-svgmin'),
    svgstore    = require('gulp-svgstore');

// Docs
var markdown    = require('gulp-markdown'),
    fileinclude = require('gulp-file-include');

// Notify
var notify      = require("gulp-notify");



// -------------------------------------
//   Paths
// -------------------------------------

var relPath = "public/"

var paths = {
    input: relPath + 'src/**/*',
    output: relPath + 'dist/',
    scripts: {
        //No Concat & No reaching through folders
        //input: relPath + 'src/js/*.js',
        input: relPath + 'src/js/**/*',
        output: relPath + 'dist/js/'
    },
    styles: {
        input: relPath + 'src/sass/**/*.{scss,sass}',
        output: relPath + 'dist/css/'
    },
    svgs: {
        input: relPath + 'src/svg/**/*',
        output: relPath + 'dist/svg/'
    },
    images: {
        input: relPath + 'src/img/**/*',
        output: relPath + 'dist/img/'
    }
};



// -------------------------------------
//   Banner
// -------------------------------------

var banner = {
    full : 
        '',

    min :
        '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | Quite Type' +
        ' | <%= package.repository.url %>' +
        ' */\n'
};



// -------------------------------------
//   Build: Scripts
// -------------------------------------

// Lint, minify, and concatenate scripts
gulp.task('build:scripts', ['clean:scripts'], function() {
    var jsTasks = lazypipe()
        .pipe(include)
        .pipe(header, banner.full, { package : package })
        .pipe(gulp.dest, paths.scripts.output)
        .pipe(rename, { suffix: '.min' })
        .pipe(uglify)
        .pipe(header, banner.min, { package : package })
        .pipe(gulp.dest, paths.scripts.output);
                
    return gulp.src(paths.scripts.input)
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(tap(function (file, t) {
            if ( file.isDirectory() ) {
                var name = file.relative + '.js';
                return gulp.src(file.path + '*.js')
                    // No Concat for now
                    //.pipe(concat(name))
                    .pipe(jsTasks());
            }
        }))
        .pipe(jsTasks())
        .pipe(livereload());
});



// -------------------------------------
//   Build: Styles
// -------------------------------------

gulp.task('build:styles', ['clean:styles'], function() {
    return gulp.src(paths.styles.input)
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
        }))
        .pipe(flatten())
        .pipe(prefix({
            browsers: ['last 2 version', '> 1%'],
            cascade: true,
            remove: true
        }))
        .pipe(header(banner.full, { package : package }))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(livereload());
});



// -------------------------------------
//   Build: SVG
// -------------------------------------

// Generate SVG sprites
gulp.task('build:svgs', ['clean:svgs'], function () {
    return gulp.src(paths.svgs.input)
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(tap(function (file, t) {
            if ( file.isDirectory() ) {
                var name = file.relative + '.svg';
                return gulp.src(file.path + '/*.svg')
                    .pipe(svgmin())
                    .pipe(svgstore({
                        fileName: name,
                        prefix: 'icon-',
                        inlineSvg: true
                    }))
                    .pipe(gulp.dest(paths.svgs.output));
            }
        }))
        .pipe(svgmin())
        .pipe(gulp.dest(paths.svgs.output))
        .pipe(livereload());
});



// -------------------------------------
//   Build: Images
// -------------------------------------

// Copy image files into output folder
gulp.task('build:images', ['clean:images'], function() {
    return gulp.src(paths.images.input)
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(gulp.dest(paths.images.output))
        .pipe(livereload());
});



// -------------------------------------
//   Lint: Scripts
// -------------------------------------

// Lint scripts
gulp.task('lint:scripts', function () {
    return gulp.src(paths.scripts.input)
        .pipe(plumber({
            errorHandler: handleError
        }))
        .pipe(jshint({
            multistr:   true, 
            camelcase:  false,
            newcap:     false,
            unused:     false,
            undef:      false 
        }))
        .pipe(jshint.reporter('jshint-stylish'));
});



// -------------------------------------
//   Clean Files
// -------------------------------------

// Remove pre-existing content from output folders
gulp.task('clean:dist', function () {
    del.sync([
        paths.output
    ]);
});

gulp.task('clean:scripts', function () {
    del.sync([
        paths.scripts.output
    ]);
});

gulp.task('clean:styles', function () {
    del.sync([
        paths.styles.output
    ]);
});

gulp.task('clean:svgs', function () {
    del.sync([
        paths.svgs.output
    ]);
});


gulp.task('clean:images', function () {
    del.sync([
        paths.images.output
    ]);
});



// -------------------------------------
//   Notifications
// -------------------------------------

gulp.task('notify:dist', ['compile'], function() {
    return gulp.src('').pipe(notify("Built all"));
});

gulp.task('notify:scripts', ['compile:scripts'], function() {
    return gulp.src('').pipe(notify("Built scripts"));
});

gulp.task('notify:styles', ['compile:styles'], function() {
    return gulp.src('').pipe(notify("Built styles"));
});

gulp.task('notify:svgs', ['compile:svgs'], function() {
    return gulp.src('').pipe(notify("Built svgs"));
});

gulp.task('notify:images', ['compile:images'], function() {
    return gulp.src('').pipe(notify("Built images"));
});



// -------------------------------------
//   Gulp Watch
// -------------------------------------

// Spin up livereload server and listen for file changes
gulp.task('listen', function() {
    livereload.listen();
    // gulp.watch(paths.input).on('change', function(file) {
    //     gulp
    //         .pipe(notify("Building all"));
    //         .start('default');
    //     gulp.start('refresh');
    // });
    gulp.watch(paths.scripts.input).on('change', function(file) {
        console.log('');
        console.log('// // // // // // //');
        console.log('// Script Change');
        console.log('// // // // // // //');
                
        gulp.start('compile:scripts');
        gulp.start('notify:scripts');
        // gulp.start('refresh');
    });
    gulp.watch(paths.styles.input).on('change', function(file) {
        console.log('');
        console.log('// // // // // // //');
        console.log('// Style Change');
        console.log('// // // // // // //');

        gulp.start('compile:styles');
        gulp.start('notify:styles')
        // gulp.start('refresh');
    });
    gulp.watch(paths.svgs.input).on('change', function(file) {
        console.log('');
        console.log('// // // // // // //');
        console.log('// SVG Change');
        console.log('// // // // // // //');

        gulp.start('compile:svgs');
        gulp.start('notify:svgs');
        // gulp.start('refresh');
    });
    gulp.watch(paths.images.input).on('change', function(file) {
        console.log('');
        console.log('// // // // // // //');
        console.log('// Images Change');
        console.log('// // // // // // //');

        gulp.start('compile:images');
        gulp.start('notify:images');
        // gulp.start('refresh');
    });
});



// -------------------------------------
//   Errors
// -------------------------------------

function handleError(err) { 
    console.log(err.toString());
    this.emit('end');
}



// -------------------------------------
//   Live Reload
// -------------------------------------

// Run livereload after file change
gulp.task('refresh', ['compile'], function () {
    livereload.changed();
});



// -------------------------------------
//   Task Runners
// -------------------------------------

// Compile files
gulp.task('compile', [
    'lint:scripts',
    'clean:scripts',
    'clean:styles',
    'clean:images',
    'clean:svgs',
    'build:scripts',
    'build:styles',
    'build:images',
    'build:svgs'
]);

gulp.task('compile:scripts', [
    'lint:scripts',
    'clean:scripts',
    'build:scripts'
]);

gulp.task('compile:styles', [
    'clean:styles',
    'build:styles'
]);

gulp.task('compile:images', [
    'clean:images',
    'build:images'
]);

gulp.task('compile:svgs', [
    'clean:svgs',
    'build:svgs'
]);

// Compile files (default)
gulp.task('default', [
    'compile',
]);

// Compile files when something changes
gulp.task('watch', [
    'listen',
    'default'
]);
