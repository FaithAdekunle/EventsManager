const CopyWebpackPlugin = require('copy-webpack-plugin-advanced');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './client/src/app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client/dist/app'),
    publicPath: '/',
  },
  devServer: {
    inline: true,
    contentBase: 'client/dist/',
    historyApiFallback: true,
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
  ],
};
