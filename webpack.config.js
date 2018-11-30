const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// process.env.NODE_ENV = 'production'

module.exports = {
    mode: "production", // "production" | "development" | "none"  // Chosen mode tells webpack to use its built-in optimizations accordingly.
    entry: path.join(__dirname, "./src/index.ts"),
    output: {
        
        // options related to how webpack emits results
        path: path.resolve(__dirname, "dist"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: "index.js", // string    // the filename template for entry chunks
        library: "react-form",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            // {
            //     test: /\.m?js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env', '@babel/preset-react'],
            //             plugins: ['@babel/plugin-proposal-class-properties']
            //         }
            //     }
            // },
            { 
                test: /\.tsx?$/,
                 loader: "awesome-typescript-loader" }
            ,
            // {
            //     test: /\.(html)$/,
            //     use: {
            //         loader: 'html-loader',
            //         options: {
            //             attrs: [':data-src']
            //         }
            //     }
            // },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
}