import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import mozjpeg from "imagemin-mozjpeg";
import optipng from "imagemin-optipng";
import svgo from "imagemin-svgo";

export const images = () => {
  return app.gulp
    .src("src/img/**/*.{jpg,jpeg,png,svg}", {
      base: "src",
      encoding: false
    })
    .pipe(app.plugins.plumber())

    // WEBP (build only)
    .pipe(app.plugins.if(app.isBuild, webp({ quality: 85 })))
    .pipe(app.plugins.if(app.isBuild, app.gulp.dest("dist")))

    // ORIGINALS + OPTIMIZATION
    .pipe(app.plugins.if(
      app.isBuild,
      imagemin([
        mozjpeg({ quality: 80, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({ plugins: [{ removeViewBox: false }] })
      ])
    ))

    .pipe(app.gulp.dest("dist"))
    .pipe(app.plugins.browsersync.stream());
};


// export const images = () => {
//   return app.gulp.src('src/img/**/*.{jpg,jpeg,png,svg}', { base: 'src', allowEmpty: true,encoding: false })
//     .pipe(app.plugins.plumber(
//       app.plugins.notify.onError({
//         title: 'IMAGES',
//         message: 'Error: <%= error.message %>'
//       })
//     ))
//     .pipe(app.gulp.dest('dist'))
//     .pipe(app.plugins.browsersync.stream());
// };
