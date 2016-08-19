
var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  jeditor = require("gulp-json-editor");

var root = 'app/';
var output = 'build';


gulp.task('clean', function(cb) {
  del.sync([output], cb);
});

gulp.task('index', function () {
  gulp.src('index.html')
    .pipe(gulp.dest(output)
  );
});

gulp.task('styles', function () {
  gulp.src('styles.css')
    .pipe(gulp.dest(output)
  );
});

gulp.task('systemjsconfig', function () {
  gulp.src('systemjs.config.js.prod')
    .pipe(rename('systemjs.config.js'))
    .pipe(gulp.dest(output)
  );
});

gulp.task('package', function () {
  gulp.src('./package.json')
  	.pipe(jeditor(function(json){
      return {
        "name": json.name,
        "version": json.version,
        "description": json.description,
        "scripts": {
          "start": json.scripts.start
        },
        "author": json.author,
        "license": json.license,
        "dependencies": json.dependencies
      };
    }))
  	.pipe(gulp.dest(output + '/')
  );
});

gulp.task('app', function () {
  gulp.src('app/' + '*.{js,html}')
    .pipe(gulp.dest(output + '/app')
  );
});

gulp.task('appfolders', function () {
  gulp.src('app/' + '**/*.{js,html}')
    .pipe(gulp.dest(output + '/app')
  );
});



gulp.task('default', ['clean', 'app', 'appfolders', 'package', 'systemjsconfig', 'index', 'styles']);