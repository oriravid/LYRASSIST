const path = require("path");

module.exports = {
    entry: "/src/entry.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js", "*"],
    },
};
