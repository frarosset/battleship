const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge( common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
      static: './dist',
      watchFiles: ['src/**/*.html'],
      //watchFiles: {
      //   paths: ['src/**/*.html'],
      //   options: {
      //      usePolling: false,
      //   },
      //},
   },
   optimization: {
      runtimeChunk: 'single' // if multiple entry points in HTML
   },
});