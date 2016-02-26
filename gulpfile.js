/**
 * Gulp Packages
 */

// General
var gulp        = require('gulp'),
    fs          = require('fs'),
    del         = require('del'),
    lazypipe    = require('lazypipe'),
    plumber     = require('gulp-plumber'),
    flatten     = require('gulp-flatten'),
    tap         = require('gulp-tap'),
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


/**
 * Paths to project folders
 */
var relPath = "public/"

var paths = {
    input: relPath + 'src/**/*',
    output: relPath + 'dist/',
    scripts: {
        //No Concat & No reaching through folders
        //input: relPath + 'src/js/*.js',
        input: relPath + 'src/js/*',
        output: relPath + 'dist/js/'
    },
    styles: {
        input: relPath + 'src/sass/**/*.{scss,sass}',
        output: relPath + 'dist/css/'
    },
    svgs: {
        input: relPath + 'src/svg/*',
        output: relPath + 'dist/svg/'
    },
    images: {
        input: relPath + 'src/img/*',
        output: relPath + 'dist/img/'
    },
    test: {
        input: relPath + 'src/js/**/*.js',
        karma: relPath + 'test/karma.conf.js',
        spec: relPath + 'test/spec/**/*.js',
        coverage: relPath + 'test/coverage/',
        results: relPath + 'test/results/'
    },
    docs: {
        input: relPath + 'src/docs/*.{html,md,markdown}',
        output: relPath + 'docs/',
        templates: relPath + 'src/docs/_templates/',
        assets: relPath + 'src/docs/assets/**'
    }
};


/**
 * Template for banner to add to file headers
 */

var banner = {
    full :
        //'/*!\n' +
        //' * <%= package.name %> v<%= package.version %>: <%= package.description %>\n' +
        //' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
        //' * MIT License\n' +
        //' * <%= package.repository.url %>\n' +
        //' */\n\n'
        '',
    min :
        '/*!' +
        ' <%= package.name %> v<%= package.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
        ' | MIT License' +
        ' | <%= package.repository.url %>' +
        ' */\n'
};


/**
 * Gulp Taks
 */

// Lint, minify, and concatenate scripts
gulp.task('build:scripts', ['clean:dist'], function() {
    var jsTasks = lazypipe()
        .pipe(include)
        .pipe(header, banner.full, { package : package })
        .pipe(gulp.dest, paths.scripts.output)
        .pipe(rename, { suffix: '.min' })
        .pipe(uglify)
        .pipe(header, banner.min, { package : package })
        .pipe(gulp.dest, paths.scripts.output);

    return gulp.src(paths.scripts.input)
        .pipe(plumber())
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
        .pipe(notify("Built JS"));
});

// Process, lint, and minify Sass files
gulp.task('build:styles', ['clean:dist'], function() {
    return gulp.src(paths.styles.input)
        .pipe(plumber())
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
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify())
        .pipe(header(banner.min, { package : package }))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(notify("Built styles"));
});

// Generate SVG sprites
gulp.task('build:svgs', ['clean:dist'], function () {
    return gulp.src(paths.svgs.input)
        .pipe(plumber())
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
        .pipe(notify("Built svgs"));
});

// Copy image files into output folder
gulp.task('build:images', ['clean:dist'], function() {
    return gulp.src(paths.images.input)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.output))
        .pipe(notify("Built imgs"));
});

// Lint scripts
gulp.task('lint:scripts', function () {
    return gulp.src(paths.scripts.input)
        .pipe(plumber())
        .pipe(jshint({
            multistr:   true, 
            camelcase:  false,
            newcap:     false,
            unused:     false,
            undef:      false 
        }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(notify("Linted JS"));
});

// Remove pre-existing content from output and test folders
gulp.task('clean:dist', function () {
    del.sync([
        paths.output
    ]);
});

// Remove pre-existing content from text folders
gulp.task('clean:test', function () {
    del.sync([
        paths.test.coverage,
        paths.test.results
    ]);
});

// Run unit tests
gulp.task('test:scripts', function() {
    return gulp.src([paths.test.input].concat([paths.test.spec]))
        .pipe(plumber())
        .pipe(karma({ configFile: paths.test.karma }))
        .on('error', function(err) { throw err; });
});

// Generate documentation
gulp.task('build:docs', ['compile', 'clean:docs'], function() {
    return gulp.src(paths.docs.input)
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(tap(function (file, t) {
            if ( /\.md|\.markdown/.test(file.path) ) {
                return t.through(markdown);
            }
        }))
        .pipe(header(fs.readFileSync(paths.docs.templates + '/_header.html', 'utf8')))
        .pipe(footer(fs.readFileSync(paths.docs.templates + '/_footer.html', 'utf8')))
        .pipe(gulp.dest(paths.docs.output));
});

// Copy distribution files to docs
gulp.task('copy:dist', ['compile', 'clean:docs'], function() {
    return gulp.src(paths.output + '/**')
        .pipe(plumber())
        .pipe(gulp.dest(paths.docs.output + '/dist'));
});

// Copy documentation assets to docs
gulp.task('copy:assets', ['clean:docs'], function() {
    return gulp.src(paths.docs.assets)
        .pipe(plumber())
        .pipe(gulp.dest(paths.docs.output + '/assets'));
});

// Remove prexisting content from docs folder
gulp.task('clean:docs', function () {
    return del.sync(paths.docs.output);
});

// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
    livereload.listen();
    gulp.watch(paths.input).on('change', function(file) {
        gulp.start('default');
        gulp.start('refresh');
    });
});

// Run livereload after file change
gulp.task('refresh', ['compile', 'docs'], function () {
    livereload.changed();
});


/**
 * Task Runners
 */

// Compile files
gulp.task('compile', [
    'lint:scripts',
    'clean:dist',
    'build:scripts',
    'build:styles',
    'build:images',
    'build:svgs'
]);

// Generate documentation
gulp.task('docs', [
    'clean:docs',
    'build:docs',
    'copy:dist',
    'copy:assets'
]);

// Compile files and generate docs (default)
gulp.task('default', [
    'compile',
    'docs'
]);

// Compile files and generate docs when something changes
gulp.task('watch', [
    'listen',
    'default'
]);

// Run unit tests
gulp.task('test', [
    'default',
    'test:scripts'
]);