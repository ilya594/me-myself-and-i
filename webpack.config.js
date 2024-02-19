const path = require('path');
const fs = require('fs');

module.exports = {
  entry: './src/Entry.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: false,
      crypto: false,
    }
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'development',
  target: ['web'],

  devServer: {
    historyApiFallback: true,
    port: 8008,
    https: {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem'),
      ca: fs.readFileSync('./cert/csr.pem')
    }
  }
}