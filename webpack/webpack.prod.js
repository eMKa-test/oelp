const { merge } = require("webpack-merge");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = (env, argv) => merge(
    common,
    {
        mode: "production",
        devtool: "source-map",
        optimization: {
            ...argv.optimization,
            minimize: true,
            minimizer: [
                new TerserWebpackPlugin({
                    extractComments: false,
                }),
            ],
        },
    },
);
