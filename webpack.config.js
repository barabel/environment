const { argv } = require('yargs');
const Dotenv = require('dotenv-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');
const path = require('path');

const isDev = !!argv.developer;
const isProd = !isDev;

const paths = {
	entry: "./src/assets/entry/**/index.js", // директория js файлов сайта
};

const config = {
	mode: isProd ? "production" : "development",
	entry: glob.sync(paths.entry).reduce((acc, filename) => {
		const entry = path.dirname(filename).split('/').pop();
		acc[entry] = filename;
		return acc
	}, {}),
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	output: {
		publicPath: '/',
		filename: "assets/js/[name].min.js",
		chunkFilename: 'assets/js/[name].chunk.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				// exclude: /^_(\w+)(\.js)$|node_modules/,
				exclude: [/node_modules\/(?!(swiper|ssr-window|dom7)\/).*/, /\.test\.jsx?$/],
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: 'entry',
										corejs: 3,
										targets: 'last 3 version, ie >= 11'
									}
								],
								'@babel/preset-react'
							]
						}
					}
				]
			},
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				use: [
					'raw-loader',
					'glslify-loader',
				],
			},
      {
        test: /\.s[ac]ss$/i,
				exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
		]
	},
	optimization: {
		minimize: isProd,
		minimizer: [
			new UglifyJsPlugin({
				test: /\.min\.js$/,
				parallel: true,
				uglifyOptions: {
					output: {
						comments: false
					}
				}
			}),
		],
	},
	plugins: [
		new Dotenv()
	]
};

module.exports = config;
