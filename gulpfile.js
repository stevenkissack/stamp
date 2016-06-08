const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const browserify = require('browserify')
const source = require('vinyl-source-stream') // Used to bypass need for gulp-browserify
const del = require('del')

const browserSync = require('browser-sync').create()

const jsGlob = 'src/**/*.js'
const htmlGlob = 'src/**/*.html'

const demoGlob = ['app/demo/**/*.html', 'app/demo/**/*.js', 'app/demo/**/*.css']

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
	return browserify(['dist/transpiled/stamp.js'])
	.bundle()
    .pipe(source('stamp-bundle.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', ['browserSync', 'compile'], () => {

  gulp.watch([jsGlob, htmlGlob], ['compile'])

  // Reloads the browser whenever HTML or JS files change
  gulp.watch(demoGlob, browserSync.reload)

})