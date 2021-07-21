const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    game: "./src/client/index.js"
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].js",
    publicPath: 'dist/',
    pathinfo: false
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      },
      // {
      //   test: /\.(eot|gif|svg|ttf|woff|woff2|jpg)$/,
      //   use: [
      //     'url-loader'
      //   ]
      // }
    ]
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    // new BrotliPlugin({
    //   test: /\.js$|\.css$/,
    //   threshold: 10240,
    //   minRatio: 0.8,
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.jpg']
  },
  devServer: {
    inline: true,
    port: 10000
  }
}