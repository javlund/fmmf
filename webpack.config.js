const path = require('path');
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const localPath = 'http://localhost:2500/build/';
const remotePath = 'http://www.fmmf.dk/build/';
const herokuPath = 'https://fmmf.herokuapp.com/build/';

const chosenPath = TARGET === 'postinstall' ? remotePath : localPath;

const PATHS = {
  app: path.join(__dirname, 'app'),
  node_modules: path.join(__dirname, 'node_modules')
};

const common = {
  entry: {
    app: PATHS.app
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: chosenPath
  },
  module: {
    loaders: [
      { 
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: PATHS.app,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: PATHS.app
      },
      { 
        test: /\.png$/, 
        loader: 'url-loader?limit=100000',
        include: PATHS.app
      },
      { 
        test: /\.(jpg|gif)$/, 
        loader: 'file-loader'
      },
      {
        test: /\.docx?$/,
        loader: 'file-loader?mimetype=application/msword'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  }
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map'
  });
} else {
  module.exports = merge(common, {});
}
