const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const main = {
    mode: "development",
    target: "electron-main",
    entry: path.join(__dirname, "src", "main"),
    output: {
        filename: "main.js",
        path: path.join(__dirname, "dist"),
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [{
            test: /.ts?$/,
            include: [
                path.resolve(__dirname, "src")
            ],
            exclude: [
                path.resolve(__dirname, "node_modules"),
                path.resolve(__dirname, ".yarn")
            ],
            use: ["babel-loader"]
        }],
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
};

const renderer = {
    mode: "development",
    target: "web",
    entry: path.join(__dirname, "src", "renderer", "renderer"),
    output: {
        filename: "renderer.js",
        path: path.resolve(__dirname, "dist", "scripts"),
        publicPath: path.resolve(__dirname, "dist", "scripts"),
    },
    resolve: {
        extensions: [".json", ".js", ".jsx", ".css", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                use: ["babel-loader"],
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, ".yarn")
                ],
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: path.resolve(__dirname, "dist", "scripts", "css")
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                          },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                outputStyle: 'expanded',
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/renderer/index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimizer: [
            "...",
            new CssMinimizerPlugin(),
        ]
    },
    devServer: {
        clientLogLevel: "trace",
        compress: true,
        contentBase: path.resolve(__dirname, "dist", "scripts"),
        publicPath: path.resolve(__dirname, "dist", "scripts"),
        liveReload: true,
        port: 9000,
        watchContentBase: true,
        writeToDisk: true
    }
};

module.exports = [
    main, renderer
];
