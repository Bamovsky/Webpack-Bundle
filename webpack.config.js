const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


isDev = process.env.NODE_ENV === 'development' ? true : false;
isProd = !isDev;

module.exports = {
    entry: './src/js/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devtool: isDev ? 'source-map' : '',
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      inline: true,
      overlay: true,
      port: 3000
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,   
          exclude: /node_modules/,
          use: [
              (isProd ? {
                loader: MiniCssExtractPlugin.loader
              } : 'style-loader'),
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                }
              },
              (isProd ? {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        autoprefixer(),
                        cssNano({
                          preset: 'default'
                        })

                    ]
                }
            } : false), 
            (isProd ? {
              loader: 'group-css-media-queries-loader'
            } : false),
            'sass-loader' 
          ].filter(Boolean)
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader', 
            options: {
              minimize: isProd ? true : false
            }
          }
        },
        { 
          test: /\.(gif|png|jpe?g|svg)$/i, 
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[ext]',
              },
            },
            (isProd ? {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75
                }
              }
            } : false)
          ].filter(Boolean)
        },
      ]
    },
    plugins: [
     (isProd ? new MiniCssExtractPlugin({
        filename: 'style.css'
      }) : false),
        new HtmlWebpackPlugin(
        {
          template: 'src/index.html'
        } 
      ),
      new CleanWebpackPlugin()
    ].filter(Boolean)
};