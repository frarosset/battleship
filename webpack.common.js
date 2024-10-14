const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: {
      main: './src/index.js',
   },
// [OR, if only 1 entry] entry: './src/index.js',
   plugins: [
      new HtmlWebpackPlugin({
         title: 'Webpack template',
         template: './src/index.html',
      }),
   ],
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: [
                     ['@babel/preset-env', { targets: "defaults" }]
                  ],
               }
            }
         },
         {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
         },
         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',                  
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
         },
         {
           test: /\.(csv|tsv)$/i,
           use: ['csv-loader'],
         },
         {
           test: /\.xml$/i,
           use: ['xml-loader'],
         },
      ],
   },
   output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
   },
};