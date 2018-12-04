const { resolve } = require('path')
const webpack = require('webpack')
var env = process.env.NODE_ENV

const config = {
  mode: 'development',
  context: resolve(__dirname, 'src', 'client'),

  entry: [
    '@babel/polyfill',
    './index.js'
  ],
  output: {
    filename: 'tennis-ladder.js',
    path: resolve(__dirname, 'public/js'),
    publicPath: '/js/'
  },

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
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader?modules' ],
        exclude: /node_modules/
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
  config.mode = 'production'

  config.entry = [
    '@babel/polyfill',
    './index.js'
  ]

  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]

  // config.optimization = {
  //   minimizer: [
  //     new UglifyJSPlugin({
  //       uglifyOptions: {
  //         output: {
  //           comments: false
  //         },
  //         compress: {
  //           unsafe_comps: true,
  //           properties: true,
  //           keep_fargs: false,
  //           pure_getters: true,
  //           collapse_vars: true,
  //           unsafe: true,
  //           warnings: false,
  //           screw_ie8: true,
  //           sequences: true,
  //           dead_code: true,
  //           drop_debugger: true,
  //           comparisons: true,
  //           conditionals: true,
  //           evaluate: true,
  //           booleans: true,
  //           loops: true,
  //           unused: true,
  //           hoist_funs: true,
  //           if_return: true,
  //           join_vars: true,
  //           cascade: true,
  //           drop_console: true
  //         }
  //       }
  //     }),
  //   ]
  // },
}

module.exports = config
