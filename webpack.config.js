const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "production",
	entry: "./src/scripts/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "main_bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
};
