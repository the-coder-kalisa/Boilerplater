export enum NodeModulesKeys {
  bootstrap,
  uiToolkit,
}

export interface NodeModulesValue {
  sourcePath: string[];
  destinationPath: string[];
  fileName: string;
  includeFolder?: boolean;
}

export class NodeModulesAccessor {
  static readonly outputPath = 'dist';

  private static readonly pathMapping = new Map<NodeModulesKeys, NodeModulesValue>([
    [
      NodeModulesKeys.bootstrap,
      {
        sourcePath: ['node_modules', 'bootstrap', 'dist', 'css'],
        destinationPath: ['libs', 'bootstrap', 'dist', 'css'],
        fileName: 'bootstrap.min.css',
      },
    ],
    [
      NodeModulesKeys.uiToolkit,
      {
        sourcePath: ['node_modules', '@vscode', 'webview-ui-toolkit', 'dist'],
        destinationPath: ['libs', '@vscode', 'webview-ui-toolkit', 'dist'],
        fileName: 'toolkit.js',
        includeFolder: true,
      },
    ]
  ]);

  static getPathToOutputFile(key: NodeModulesKeys): string[] {
    const path = this.getMappedValue(key);
    return [this.outputPath, ...path.destinationPath, path.fileName];
  }

  static getPathToNodeModulesFile(key: NodeModulesKeys): NodeModulesValue {
    return this.getMappedValue(key);
  }

  private static getMappedValue(key: NodeModulesKeys): NodeModulesValue {
    const value = this.pathMapping.get(key);
    if (!value) {
      throw Error(`Path to "${key}" is not mapped.`);
    }
    return value;
  }
}
