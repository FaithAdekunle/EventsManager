const CopyWebpackPlugin = require('copy-webpack-plugin-advanced');
const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: ['babel-polyfill', './client/src/app/index.jsx'],
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client/dist/app'),
    publicPath: '/',
  },
  devServer: {
    inline: true,
    contentBase: 'client/dist/',
    historyApiFallback: true,
    compress: true,
  },
  externals: {
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'client/src/app'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['url-loader'],
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: ['file-loader'],
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'client/src/index.html',
        to: '../index.html',
        force: true,
      },
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
  ],
};
