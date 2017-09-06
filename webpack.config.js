const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin')
const BabiliPlugin = require('babel-minify-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const chunkFile = isProd ? '[name].[chunkhash]' : '[name]'
const hashFile = isProd ? '[name].[hash:5]' : '[name]'

const htmlConfig = {
  title: 'pollarity',
  // favicon: 'src/img/favicon.png',
  template: 'src/index.ejs',
}

const htmlConfig404 = Object.assign({}, htmlConfig, {
  filename: '404.html',
})

const routes = [
  '/',
]

module.exports = {
  devtool: isProd ? 'cheap-module-source-map' : 'eval-source-map',

  devServer: {
    contentBase: './',
    stats: 'errors-only',
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  entry: {
    app: ['./src/js/index.js'],
    vendor: [
      'lost',
      'react-dom',
      'react-motion',
      'react-ga',
      'react-router-dom',
      'react-svg-inline',
      'react',
    ],
  },

  output: {
    filename: `js/${chunkFile}.js`,
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options:
        {
          failOnWarning: false,
          failOnError: false,
          fix: false,
          quiet: false,
          emitWarning: true,
        },
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { minimize: true },
            },
            'postcss-loader',
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `[path]${hashFile}.[ext]`,
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: `[path]${chunkFile}.[ext]`,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: ['node_modules'],
    alias: {
      components: path.join(__dirname, 'src/js/components'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new BabiliPlugin({}),
    new ExtractTextPlugin(`styles/${chunkFile}.css`),
    new HtmlWebpackPlugin(htmlConfig),
    new HtmlWebpackPlugin(htmlConfig404),
    new SitemapPlugin('http://pollarity.cool', routes),
  ],
}