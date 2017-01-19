# gulp-listing

```javascript
    var listing = require('gulp-listing');
    
    gulp.task('listing', function() {
      return gulp.src('./src/*.html')
        .pipe(listing('listing.html'))
        .pipe(gulp.dest('./src/'));
    });
```