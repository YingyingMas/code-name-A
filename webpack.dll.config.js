var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'vue',
      'vuex',
      'lodash',
      'vue-router',
      'element-ui',
      'echarts',
      'js-md5',
      'jquery',
      'malihu-custom-scrollbar-plugin',
      'sortablejs',
      'raphael'
    ]
  },
  output: {
    path: path.join(__dirname, './'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};