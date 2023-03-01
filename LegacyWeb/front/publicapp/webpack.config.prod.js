'use strict'
const { VueLoaderPlugin } = require('vue-loader')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'production',
  entry: [
    './src/app.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.pug$/,
        use: ['pug-plain-loader']
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true,
              implementation: require('sass'),
              fiber: require('fibers')
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      videojs: 'video.js',
      WaveSurfer: 'wavesurfer.js',
      RecordRTC: 'recordrtc'
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new Dotenv({
        path: './.env.prod'
    })
    //new webpack.ProvidePlugin({
    //    videojs: 'video.js/dist/video.cjs.js',
    //    RecordRTC: 'recordrtc'
    //})
  ],
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, 'public'),
    compress: true,
  }
}