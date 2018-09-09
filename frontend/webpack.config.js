const path = require("path");
module.exports = {
	entry: {
		index: "./app/src/index-react.js",
		reports: "./app/src/reports-react.js"
	},
	output: {
		path: __dirname + "/app/public/js",
		filename: "[name]-build.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: "babel-loader",
				query: {
					presets: ["react", "env", "stage-3"],
					plugins: ["transform-class-properties"]
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader"
					}
				]
			}
		]
	}
};
