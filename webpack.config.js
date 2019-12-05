const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const url = require('url')
const publicPath = ''

const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    index: ["babel-polyfill", "./src/main.js"]
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? 'js/[name].js' : 'js/[name].js?[hash]',
    chunkFilename: 'js/[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'happypack/loader?id=vue'
      },
      {
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: 'happypack/loader?id=styles'
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[hash:8].[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'vue',
      threadPool: happyThreadPool,
      // threads: 4,
      loaders: ['vue-loader']
    }),
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: ['babel-loader']
    }),
    new HappyPack({
      id: 'styles',
      threadPool: happyThreadPool,
      loaders: ['style-loader', 'css-loader', 'postcss-loader']
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new ExtractTextPlugin("css/[name].css"),
    new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery"
    }),
    new webpack.DefinePlugin({
        APP_NAME:JSON.stringify("代号A"),
        BASE_URL: options.dev?JSON.stringify("http://127.0.0.1:8010"):(options.product?JSON.stringify(""):JSON.stringify("")),
        CROSS_DOMAIN:options.dev?JSON.stringify(true):JSON.stringify(false),
    })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
