import gulp from "gulp";
import { path } from "../config/path.js";

export const staticFiles = () => {
  return gulp.src(path.src.static)
    .pipe(gulp.dest(path.build.html)); // ← В КОРЕНЬ dist
};