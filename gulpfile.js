'use strict';

const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const htmlify = require('gulp-angular-htmlify')
const uglify = require('gulp-uglify')
const html2js = require("gulp-html2js")
const gutil = require('gulp-util')
const merge = require('merge-stream')
const source = require('vinyl-source-stream') // Used to bypass need for gulp-browserify
const del = require('del')

const browserSync = require('browser-sync').create()

const jsGlob = 'src/**/*.js'
const htmlGlob = 'src/**/*.html'

const demoGlob = ['app/demo/**/*.html', 'app/demo/**/*.js', 'app/demo/**/*.css']

// the newline is needed in case the file ends with a line comment, the semi-colon is needed if the last statement wasn't terminated
const jsConcatOptions = { newLine : '\n;' }

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: '',
      startPath: "/demo/index.html"
    }
  })
})

gulp.task('cleanTranspileFolder', () => {
  return del(['dist/transpiled'])
})

gulp.task('transpile', ['cleanTranspileFolder'], () => {
	return gulp.src(jsGlob)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist/transpiled'))
})

gulp.task('compile', ['transpile'], () => {

  let jsFileStream = gulp.src('./dist/transpiled/angular/*.js')
    //.pipe(gulpif(doMinification, ngmin().on('error', gutil.log))) // Corrects shorthand DI to array syntax
    //.pipe(concat('app.js'))
    //.pipe(gulp.dest('./dist/app/js'))
    
  let tmplFileStream = gulp.src('./src/angular/templates/*.html')
		.pipe(htmlify()) // Add data- prefixes to non-html5-valid attributes
		.pipe(html2js({
			  outputModuleName: "stamp"
			}))

  let appStream = merge(tmplFileStream, jsFileStream)
    .pipe(concat('bundle.js', jsConcatOptions))

    .pipe(gulp.dest("dist/angular/"))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest("dist/angular/"))
  
  return appStream
})

gulp.task('watch', ['browserSync', 'compile'], () => {

  gulp.watch([jsGlob, htmlGlob], ['compile'])

  // Reloads the browser whenever HTML or JS files change within the DEMO
  gulp.watch(demoGlob, browserSync.reload)

})