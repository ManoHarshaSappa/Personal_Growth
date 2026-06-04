const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/virtual-dressing-room.js',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
            chunkFilename: isProduction ? 'js/[name].[contenthash].chunk.js' : 'js/[name].chunk.js',
            assetModuleFilename: 'assets/[name].[contenthash][ext]',
            clean: true,
            publicPath: '/'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: []
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(glb|gltf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'models/[name].[contenthash][ext]'
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|webp)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[contenthash][ext]'
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[contenthash][ext]'
                    }
                },
                {
                    test: /\.hdr$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'environments/[name].[contenthash][ext]'
                    }
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './fashion-index.html',
                filename: 'index.html',
                inject: 'body',
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                } : false
            })
        ],

        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10
                    },
                    three: {
                        test: /[\\/]node_modules[\\/]three[\\/]/,
                        name: 'three',
                        chunks: 'all',
                        priority: 20
                    }
                }
            },
            runtimeChunk: 'single',
            moduleIds: isProduction ? 'deterministic' : 'named',
            chunkIds: isProduction ? 'deterministic' : 'named'
        },

        resolve: {
            extensions: ['.js', '.json'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@assets': path.resolve(__dirname, 'assets'),
                '@models': path.resolve(__dirname, 'assets/models'),
                '@textures': path.resolve(__dirname, 'assets/textures')
            }
        },

        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            port: 8080,
            hot: true,
            open: true,
            compress: true,
            historyApiFallback: true,
            overlay: {
                warnings: false,
                errors: true
            },
            stats: 'minimal'
        },

        devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },

        stats: {
            colors: true,
            modules: false,
            chunks: false,
            chunkModules: false
        }
    };
};