const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    inline: true,
    contentBase: 'client/dist/',
    historyApiFallback: true,
    compress: true,
  },
});
