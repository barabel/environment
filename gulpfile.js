const { argv } = require('yargs');
const fs = require('fs');
const path = require('path');
const url = require('url');
const proxy = require('proxy-middleware');

/* подключаем gulp и плагины */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-dart-sass');
const cleanCSS = require('gulp-clean-css');
const cssnano = require('cssnano');
const gcmq = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const rimraf = require('gulp-rimraf');
const rename = require('gulp-rename');
const twig = require('gulp-twig');
const htmlBeautify = require('gulp-html-beautify');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const webpack = require('webpack-stream');
const strip = require('gulp-strip-comments');
const version = require('gulp-version-number');
const notifier = require('node-notifier');
const rsync = require('gulp-rsync');
const confirm = require('gulp-confirm');
const data = require('gulp-data');
const svgStore = require('gulp-svgstore'); // Combine SVG files into one
const svgMin = require('gulp-svgmin'); // Compress SVG files

const isDev = !!argv.developer;
const isProd = !isDev;

const webpackConfig = require('./webpack.config.js');
const versionConfig = {
	'value': '%DT%',
	'append': {
		'key': 'v',
		'to': ['css', 'js'],
	},
};

/* пути */
const dirRoot = __dirname;
const dirDist = 'dist';
const dirAssets = 'assets';
const dirSrc = 'src';
const dirStatic = 'static';

const paths = {
	root: path.join(dirRoot, dirDist),
	clean: path.join(dirRoot, dirDist, '*'),
	dist: {
		static: path.join(dirRoot, dirDist),
		html: path.join(dirRoot, dirDist),
		js: path.join(dirRoot, dirDist),
		css: path.join(dirRoot, dirDist, dirAssets, 'css'),
		img: path.join(dirRoot, dirDist, dirAssets, 'img'),
		svg: path.join(dirRoot, dirDist, dirAssets, 'svg'),
		fonts: path.join(dirRoot, dirDist, dirAssets, 'fonts'),
		data: path.join(dirRoot, dirDist, dirAssets, 'data')
	},
	src: {
		static: path.join(dirRoot, dirStatic, '**/*.*'),
		twig: path.join(dirRoot, dirSrc, 'views', '*.twig'),
		script: path.join(dirRoot, dirSrc, dirAssets, 'entry', '**/*.js'),
		style: path.join(dirRoot, dirSrc, dirAssets, 'entry', '**/*.scss'),
		img: path.join(dirRoot, dirSrc, dirAssets, 'img', '**/*.*'),
		svg: path.join(dirRoot, dirSrc, dirAssets, 'svg', '**/*.*'),
		fonts: path.join(dirRoot, dirSrc, dirAssets, 'fonts', '**/*.*'),
		data: path.join(dirRoot, dirSrc, dirAssets, 'data', '**/*.*')
	},
	watch: {
		static: `./${dirStatic}/**/*.*`,
		twig: `./${dirSrc}/views/**/*.twig`,
		js: `./${dirSrc}/${dirAssets}/**/**/*.js`,
		scss: `./${dirSrc}/**/**/*.scss`,
		img: `./${dirSrc}/${dirAssets}/img/**/*.*`,
		svg: `./${dirSrc}/${dirAssets}/svg/**/*.*`,
		fonts: `./${dirSrc}/${dirAssets}/fonts/**/*.*`,
		data: `./${dirSrc}/${dirAssets}/data/**/*.*`
	}
};

/* задачи */

// слежка
function watch() {
	gulp.watch(paths.watch.static, moveStatic);
	gulp.watch(paths.watch.scss, styles);
	gulp.watch([paths.watch.twig, `./${dirSrc}/data/*.json`], templates);
	gulp.watch([paths.watch.js, `./${dirSrc}/views/**/**/*.js`], scripts);
	gulp.watch(paths.watch.fonts, fonts);
	gulp.watch(paths.watch.img, images);
	gulp.watch(paths.watch.svg, svg);
	gulp.watch(paths.watch.data, datas);
}

// следим за dist и релоадим браузер
function server() {
	const proxyOptions = url.parse('http://localhost:8890/api');
	proxyOptions.route = '/api';
	browserSync.init({
		open: false,
		notify: false,
		server: {
			baseDir: dirDist,
			directory: true,
			index: "index.html",
			middleware: [proxy(proxyOptions)]
		}
	});
}

// очистка
function clean() {
	return gulp.src(paths.clean, { read: false })
	.pipe(rimraf());
}

// templates
function templates() {
	const projectPath = path.resolve(__dirname);

	return gulp.src(paths.src.twig)
		.pipe(data(file => {
				const page = path.basename(file.path).replace('.twig', '.json');

				return {
					...JSON.parse(fs.readFileSync(`./src/data/common.json`)),
					...JSON.parse(fs.readFileSync(`./src/data/${page}`))
				}
			})
		)
		.pipe(twig({
				namespaces: {
					'view-root': path.join(projectPath, 'src/views/partials'),
					'root': path.join(projectPath, 'src/views'),
				},
			}))
		.pipe(gulpIf(isProd, htmlBeautify()))
		.pipe(gulpIf(isProd, version(versionConfig)))
		.pipe(gulp.dest(paths.dist.html))
		.pipe(browserSync.stream());
}

// scss
function styles() {
	const plugins = [];

	if (isProd) {
		plugins.push(
			cssnano({
				preset: [
					'default',
					{
						zindex: false
					}
				]
			})
		);
	}

	return gulp
		.src(paths.src.style)
		.pipe(gulpIf(isDev, sourcemaps.init()))
		.pipe(plumber())
		.pipe(
			sass({
				includePaths: ['node_modules']
			}).on('error', err => {
				notifier.notify({ title: 'Ошибка в SCSS файле!', message: err.message });
				this.emit('end');
			})
		)
		.pipe(plumber.stop())
		.pipe(gcmq())
		.pipe(postcss(plugins))
		.pipe(gulpIf(isDev, sourcemaps.write()))
		.pipe(rename(p => {
				p.basename = `${p.dirname}.min`;
				p.dirname = '.';
			})
		)
		.pipe(gulpIf(isProd, cleanCSS()))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream());
}

// js
function scripts() {
	return webpack(webpackConfig)
	.pipe(gulpIf(isProd, strip()))
	.pipe(gulp.dest(paths.dist.js))
	.pipe(browserSync.stream());
}

// fonts
function fonts() {
	return gulp.src(paths.src.fonts)
	.pipe(gulp.dest(paths.dist.fonts))
	.pipe(browserSync.stream());
};

// data
function datas() {
	return gulp.src(paths.src.data)
		.pipe(gulp.dest(paths.dist.data))
		.pipe(browserSync.stream());
};

// static
function moveStatic() {
	return gulp.src(paths.src.static)
	.pipe(gulp.dest(paths.dist.static))
	.pipe(browserSync.stream());
};

// обработка картинок
function images() {
	return gulp.src(paths.src.img)
		.pipe(imagemin([
				imagemin.gifsicle({ interlaced: true }),
				// jpegrecompress({
				// 	progressive: true,
				// 	max: 90,
				// 	min: 80
				// }),
				//pngquant(),
				imagemin.svgo({ plugins: [{ removeViewBox: false }] })
			]))
		.pipe(gulp.dest(paths.dist.img))
		.pipe(browserSync.stream());
};

// обработка картинок
function svg() {
	return gulp
		.src(paths.src.svg)
		.pipe(svgMin())
		.pipe(svgStore())
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest(paths.dist.svg))
		.pipe(browserSync.stream());
};

// функция для деплоя на сервер
function deployRsync(done) {
	if(!fs.existsSync('./deploy.json')) {
		console.log("Не существует файл deploy.json");
		return done();
	}
	const deployJson = require('./deploy.json');

	if(deployJson.hostname === "xxx@xxx") {
		console.log("Не настроен файл deploy.json")
		return done();
	}

	return gulp.src(deployJson.path)
		.pipe(confirm({
				question: `Вы уверены, что хотите загрузить файлы в ${deployJson.hostname}:${deployJson.destination}? (y/Y)`,
				input: '_key:y,Y'
			}))
		.pipe(rsync({
			root: deployJson.root,
			hostname: deployJson.hostname,
			destination: deployJson.destination,
			exclude: deployJson.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
		.on('end', () => {
			console.log(`Загружено в ${deployJson.hostname}:${deployJson.destination}`);
		});
}

// инициализируем задачи
exports.moveStatic = moveStatic;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.svg = svg;
exports.deployRsync = deployRsync;
exports.clean = clean;

gulp.task('default', gulp.series(
	gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, svg, styles, scripts, templates, datas)
));


gulp.task('build:bx', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, svg, styles, scripts)
));
