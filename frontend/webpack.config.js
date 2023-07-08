// eslint-disable-next-line
const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-next-line
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // eslint-disable-next-line
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin'); // eslint-disable-next-line
const path = require('path');

// eslint-disable-next-line
module.exports = (env) => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'index.[contenthash].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            // eslint-disable-next-line
            env.prod ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader',],
        },
        // {
        //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
        //   type: 'asset/resource',
        // },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
      ],
    },
    optimization: {
      minimizer: [
        '...',
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ['gifsicle', { interlaced: true }],
                ['jpegtran', { progressive: true }],
                ['optipng', { optimizationLevel: 5 }],
                [
                  'svgo',
                  {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                            addAttributesToSVGElement: {
                              params: {
                                attributes: [
                                  { xmlns: 'http://www.w3.org/2000/svg' },
                                ],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          },
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        title: 'mvp',
      }),
      new MiniCssExtractPlugin({
        filename: 'style.[contenthash].css',
      }),
    ],
    devServer: {
      // eslint-disable-next-line
      static: path.join(__dirname, 'dist'),
      historyApiFallback: true,
      hot: true,
    },
    externalsType: 'script',
    externals: {
      ymaps: [
        'https://api-maps.yandex.ru/2.1/?apikey=ваш API-ключ&lang=ru_RU',
        'ymaps',
      ],
    },
  };
};
