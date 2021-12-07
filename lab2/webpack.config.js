const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, 'src', 'main.ts'),
  resolve: { extensions: ['.ts', '.js'] },
  output: { path: path.resolve(__dirname, 'dist') },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'assets', 'html', 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/i,
        use: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.png$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },

  devtool: 'source-map',
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        chunks: 'all',
      },
    };
  }

  return config;
};
