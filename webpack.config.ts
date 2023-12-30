//@ts-check

'use strict';

import * as path from 'path';
import { NodeModulesAccessor, NodeModulesKeys } from './src/NodeModuleAccessor';
import { Configuration } from 'webpack';
import CopyPlugin = require('copy-webpack-plugin');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

function copyNodeModulesFiles(): CopyPlugin {
  const files: NodeModulesKeys[] = Object.keys(NodeModulesKeys)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => Number(key));
  const copies: CopyPlugin.ObjectPattern[] = files.map((file) => {
    const value = NodeModulesAccessor.getPathToNodeModulesFile(file);
    let sourcePath;
    let destinationPath;
    if (value.includeFolder) {
      sourcePath = path.join(...value.sourcePath);
      destinationPath = path.join(...value.destinationPath);
    } else {
      sourcePath = path.join(...value.sourcePath, value.fileName);
      destinationPath = path.join(...value.destinationPath, value.fileName);
    }
    return {
      from: sourcePath,
      to: destinationPath,
    };
  });
  return new CopyPlugin({
    patterns: copies,
  });
}


/** @type WebpackConfig */
const extensionConfig: Configuration = {
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vsceignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins:[copyNodeModulesFiles()],
  devtool: 'nosources-source-map'
};
module.exports = [ extensionConfig ];
