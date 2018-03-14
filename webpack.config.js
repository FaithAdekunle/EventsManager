const CopyWebpackPlugin = require('copy-webpack-plugin-advanced');
const path = require('path');
const webpack = require('webpack');
// const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: ['./client/src/app/index.js'],
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
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'client/src/images',
        to: '../images',
        force: true,
      },
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
    // new CompressionPlugin({
    //   asset: '[path].gz[query]',
    //   algorithm: 'gzip',
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0,
    // }),
  ],
};
