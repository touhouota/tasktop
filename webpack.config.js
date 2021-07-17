const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, "dist", "scripts");

const main = {
    mode: "development",
    target: "electron-main",
    entry: path.join(__dirname, "src", "main"),
    output: {
        filename: "main.js",
        path: path.join(__dirname, "dist")
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
        extensions: ['.js', '.ts']
    },
};

const renderer = {
    mode: "development",
    target: "electron-renderer",
    entry: path.join(__dirname, 'src', 'renderer', "renderer"),
    output: {
        filename: 'renderer.js',
        path: path.resolve(__dirname, 'dist', 'scripts')
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css', '.ts', '.tsx']
    },
    module: {
        rules: [{
        test: /\.(tsx|ts)$/,
        use: ["babel-loader"],
        include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
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
        contentBase: outputPath,
        port: 9000,
        compress: true
    }
};

module.exports = [
    main, renderer
];