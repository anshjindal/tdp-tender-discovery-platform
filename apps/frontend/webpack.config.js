const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join } = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development', // Define mode based on environment
  output: {
    path: join(__dirname, '../../dist/apps/frontend'), // Updated output path for clarity
    filename:
      process.env.NODE_ENV === 'production'
        ? '[name].[contenthash].js'
        : '[name].js',
    publicPath: '/', // Ensures assets are served correctly
    clean: true, // Automatically clean the output directory before builds
  },
  devServer: {
    port: 4200, // Use port 4200 for development server
    open: true, // Automatically open the app in the browser
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
    hot: true, // Enable Hot Module Replacement
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel', // Using Babel for compatibility
      main: './src/main.tsx', // Main entry file for the app
      index: './src/index.html', // HTML template
      baseHref: '/', // Base URL for the app
      assets: ['./src/favicon.ico', './src/assets'], // Static assets
      styles: ['./src/styles.css'], // Global styles
      outputHashing: process.env.NODE_ENV === 'production' ? 'all' : 'none', // Hashing for production
      optimization: process.env.NODE_ENV === 'production', // Enable optimization in production
    }),
    new NxReactWebpackPlugin({
      svgr: true, // Enable SVGR (can disable if not needed)
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'], // File extensions for imports
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // Optimize code splitting for shared modules
    },
  },
}