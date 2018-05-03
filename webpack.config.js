const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const extractCss = new ExtractTextWebpackPlugin('css/[name].[hash].css');
const extractScss = new ExtractTextWebpackPlugin('css/[name].[hash].css');

module.exports = {
    mode: 'development',    
    entry: {
        index: './src/index.js', 
        login: './src/login.js'
    },
    output: {
        // 多入口文件打包成多个文件
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devServer: {
        contentBase: './dist',
        port: 8000,
        // open: true,
        hot: true
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: 'babel-loader',
            include: /src/,
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: extractCss.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader' 
                }]
            })
        }, {
            test: /.scss$/,
            use: extractScss.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader'
                }, {
                    loader: 'sass-loader'
                }]
            })
        }, {
            test: /\.(jpe?g|png|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    outputPath: 'images/'
                }
            }]
        }, {
            test: /\.(eot|ttf|woff|svg)$/,
            use: 'file-loader'
        }, {
            // 页面中经常会用到img标签，img引用的图片地址也需要一个loader来帮我们处理好
            // test: /\.(htm|html)$/,
            // use: 'html-withimg-loader'
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', 'scss']
    },
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modlues/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10
                }
            }
        }
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './public/index.html',
            title: 'webpack-finance',            
            filename: 'index.html',
            chunks: ['index', 'vendor'], // html中引入的js文件的名称
            // minify: true
        }),
        new htmlWebpackPlugin({
            template: './public/index.html',
            title: 'login-finance',            
            filename: 'login.html',
            chunks: ['login'],
            // minify: true
        }),
        extractCss,
        extractScss,
        // 热更新，热替换不是刷新
        new webpack.HotModuleReplacementPlugin(),
        // new CleanWebpackPlugin('dist')
    ]
}