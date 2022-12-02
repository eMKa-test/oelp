require("dotenv")
    .config();
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const {
    DEVELOPMENT_PORT,
    BACKEND_URL,
} = process.env;

module.exports = merge(common, {
    mode: "development",
    devServer: {
        clientLogLevel: "silent",
        stats: "normal",
        historyApiFallback: {
            rewrites: [
                {
                    from: /^\/agent/,
                    to: "/agent.html",
                },
                {
                    from: /^\/admin/,
                    to: "/admin.html",
                },
                {
                    from: /./,
                    to: "/auth.html",
                },
                {
                    from: /^\/$/,
                    to: "/auth.html",
                },
            ],
        },
        contentBase: path.join(__dirname, "../", "public_html"),
        proxy: {
            context: [
                "/api/login", "/api/logout", "/user/api", "/admin/api", "/agent/api", // api
                "/storage", "/favicon.ico", // static content
            ],
            target: BACKEND_URL,
            changeOrigin: true,
        },
        open: !DEVELOPMENT_PORT,
        compress: true,
        hot: true,
        port: DEVELOPMENT_PORT,
        publicPath: "/",
    },
    target: "web",
    devtool: "eval",
});
