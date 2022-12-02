const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const fs = require("fs");

process.env.BUILD_NUMBER = "1.14.0";

const DEV_MODE = (process.env.NODE_ENV !== "production");
const SRC_DIR = path.resolve(__dirname, "../", "src");

const entries = [
    {
        name: "admin",
        filename: "./Admin/index.js",
        bodyClass: "app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden",
    },
    {
        name: "agent",
        filename: "./Agent/index.js",
        bodyClass: "app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden",
    },
];

if (DEV_MODE) {
    const dotenv = require("dotenv");
    let envFile = `.env.${process.env.CROSS_ENV}`;
    try {
        fs.accessSync(envFile, fs.constants.R_OK);
    } catch {
        envFile = ".env.default";
    }
    // eslint-disable-next-line global-require
    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    Object.entries(envConfig)
        .forEach(([k, val]) => {
            process.env[k] = val;
        });
    entries.push({
        name: "auth",
        filename: "./Auth/index.js",
        bodyClass: "app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden",
    });
}

const plugins = [
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({ debug: false }),
    new MiniCssExtractPlugin({
        filename: DEV_MODE ? "css/[name].css" : "css/[name].[hash:8].css",
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
    new webpack.DefinePlugin({
        __DEV__: DEV_MODE,
        __APP_VERSION__: JSON.stringify(process.env.BUILD_NUMBER),
    }),
    new webpack.ProvidePlugin({
        moment: "moment",
    }),
    ...entries.map(
        (entry) => new HtmlWebpackPlugin({
            title: "Сфера - система контроля процесса строительства",
            bodyClass: entry.bodyClass,
            favicon: "assets/favicons/favicon.ico",
            logo: "assets/sphere_logo_2.png",
            template: "template.html",
            filename: `${entry.name}.html`,
            chunks: ["runtime", "init", entry.name],
            minify: false,
        }),
    ),
];

const config = {
    context: SRC_DIR,
    entry: {
        init: "./init.js",
    },
    output: {
        filename: DEV_MODE ? "js/[name].js" : "js/[name].[hash:8].js",
        path: path.resolve(__dirname, "../", "public_html"),
        publicPath: DEV_MODE ? "/" : "/staff/",
    },
    cache: {
        type: "filesystem",
        cacheDirectory: path.resolve(__dirname, "../", ".temp_cache"),
    },
    optimization: {
        runtimeChunk: "single",
        mergeDuplicateChunks: true,
        splitChunks: {
            chunks: "async",
            maxInitialRequests: Infinity,
            maxSize: 249000,
            cacheGroups: {
                automaticNameDelimiter: "_",
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    performance: {
        hints: false,
        maxAssetSize: 249000,
        maxEntrypointSize: 249000,
        assetFilter(assetFilename) {
            return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
        },
    },
    stats: "normal",
    plugins,
    resolve: {
        extensions: [".js", ".json", ".jsx"],
        alias: {
            "react-router-dom": path.resolve(__dirname, "../", "node_modules/react-router-dom"),
            hammerjs: path.resolve(__dirname, "../", "node_modules/hammerjs"),
            warning: path.resolve(__dirname, "../", "node_modules/warning"),
            reactstrap: path.resolve(__dirname, "../", "node_modules/reactstrap"),
            "create-react-context": path.resolve(__dirname, "../", "node_modules/create-react-context"),
            "hoist-non-react-statics": path.resolve(__dirname, "../", "node_modules/hoist-non-react-statics"),
            "performance-now": path.resolve(__dirname, "../", "node_modules/performance-now"),
            "react-is": path.resolve(__dirname, "../", "node_modules/react-is"),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /(node_modules)/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve("css-loader"),
                        options: { importLoaders: 1 },
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                    },
                ],
            },
            {
                test: /\.(bmp|gif|jpe?g|png|svg|obj|mtl|gltf|bin|glb|hdr|3ds|fbx)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/images/[name].[contenthash:8].[ext]",
                },
            },
            {
                test: /\.(woff|woff2|otf|ttf|eot)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/fonts/[name].[hash:8].[ext]",
                },
            },
            {
                test: /\.mp4$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/videos/[name].[hash:8].[ext]",
                },
            },
        ],
    },
};

const { ENTRY } = process.env;
if (ENTRY) {
    const { filename } = entries.find(({ name }) => name === ENTRY);
    config.entry = {
        ...config.entry,
        [ENTRY]: filename,
    };
} else {
    config.entry = {
        ...config.entry,
        ...entries.reduce((acc, entry) => {
            acc[entry.name] = entry.filename;
            return acc;
        }, {}),
    };
}

if (DEV_MODE) {
    config.plugins.push(new DuplicatePackageCheckerPlugin());
    if (process.env.ANALYZE) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }
}

module.exports = config;
