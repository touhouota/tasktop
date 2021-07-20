const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        rules: [{
        test: /\.(tsx|ts)$/,
        use: ["babel-loader"],
        include: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".yarn")
        ],
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/renderer/index.html",
            filename: "index.html"
        })
    ],
    devServer: {
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