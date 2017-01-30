var path = require("path");
var webpack = require("webpack");
var _ = require("lodash");
var ExtractTextPlugin = require("extract-text-webpack-plugin");


const vendor = [
    "lodash",
    "react",
    "react-dom"
];

function createConfig(isDebug){
    const devtool = isDebug ? "eval-source-map" : null;
    const plugins = [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
        new webpack.DefinePlugin({ // tells webpack and compiler which vars are available on the global
            "process.env": {
                NODE_ENV: `"${ process.env.NODE_ENV || "development" }"`
            },
            IS_DEBUG: isDebug,
            IS_PRODUCTION: !isDebug
        })
    ];

    const loaders = {
        js: { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
        eslint: { test: /\.jsx?$/, loader: "eslint", exclude: /node_modules/ },
        json: { test: /\.json$/, loader: "json" },
        css: { test: /\.css$/, loader: "style!css?sourceMap" },
        sass: { test: /\.scss$/, loader: "style!css?sourceMap!sass?sourceMap" },
        files: { test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=5000" }
    };

    const clientEntry = ["./src/client/client.js"];
    let publicPath = "/build/";

    if(isDebug){
        // webpack live reload configurations
        plugins.push(new webpack.HotModuleReplacementPlugin());
        clientEntry.unshift(
            // "webpack-hot-loader/patch",
            'react-hot-loader/patch',
            "webpack-dev-server/client?http://localhost:8080/",
            "webpack/hot/only-dev-server"
        );
        publicPath = "http://localhost:8080/build/";
    }else{
        plugins.push(
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new ExtractTextPlugin("[name].css")
        );

        loaders.css.loader = ExtractTextPlugin.extract("style", "css");
        loaders.sass.loader = ExtractTextPlugin.extract("style", "css!sass");
    }

    return {
        name: "client",
        devtool,
        entry: {
            app: clientEntry,
            vendor
        },
        output: {
            path: path.join(__dirname, "public", "build"),
            filename: "[name].js",
            publicPath
        },
        resolve: {
            extensions: ["", ".js", ".jsx"],
            alias: {
                shared: path.join(__dirname, "src", "server", "shared")
            },
        },
        module: {
            loaders: _.values(loaders)
        },
        
        plugins
    };
}

module.exports = createConfig(process.env.NODE_ENV !== "production");
module.exports.create = createConfig;  


/*
const vendor = ["lodash"];
const clientEntry = ["./src/client/client.js"];
const isDebug = "cheap-module-source-map" || null;
module.exports = {
    entry: {
        app: clientEntry,
        vendor
    },
    output: {
        path: path.join(__dirname, "public", "build"),
        filename: "[name].js",
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: `"${ process.env.NODE_ENV || "development" }"`
            },
            IS_DEBUG: isDebug,
            IS_PRODUCTION: !isDebug
        })
    ]
};
*/