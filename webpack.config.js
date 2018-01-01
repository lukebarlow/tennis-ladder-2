const { resolve } = require('path')
const webpack = require('webpack')
var env = process.env.NODE_ENV

const config = {
  context: resolve(__dirname, 'src', 'client'),

  entry: [
    'babel-polyfill',
    './index.js'
  ],
  output: {
    filename: 'tennis-ladder.js',
    path: resolve(__dirname, 'public/js'),
    publicPath: '/js/'
  },

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: resolve(__dirname),
    // match the output path

    publicPath: '/js/'
    // match the output `publicPath`
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      },
      {
        test: /\.jsx?$/,
        use: [ 'babel-loader' ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader?modules' ]
      }
    ]
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    // new webpack.NamedModulesPlugin()
    // prints more readable module names in the browser console on HMR updates
  ]
}

// in production we remove the hot module plugins and insert
// uglify instead

if (env == 'production') {
  config.entry = [
    'babel-polyfill',
    './index.js'
  ]

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })//,
    // new webpack.optimize.UglifyJsPlugin()
  ]
}

module.exports = config
