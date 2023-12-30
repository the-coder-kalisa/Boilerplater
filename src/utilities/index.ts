import path from "path";
import * as vscode from "vscode";
import { NodeModulesAccessor, NodeModulesKeys } from "../NodeModuleAccessor";

export const getWebviewOptions = (
  extensionUri: vscode.Uri
): vscode.WebviewOptions => {
  return {
    // Enable javascript in the webview
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.joinPath(extensionUri, NodeModulesAccessor.outputPath, "libs"), // <--- Important
      vscode.Uri.joinPath(extensionUri, "media"),
    ],
  };
};

export const getInterpolateObject = (
  fieldProps: object = {},
  execPath: string = ""
) => {
  const fields = {
    ...fieldProps,
    "*": Object.values(fieldProps).join(" ").trim(),
    get(...args: string[]) {
      return args.map((arg) => (this as any)[arg]).join(" ");
    },
    getExcept(...args: string[]) {
      return Object.entries(fieldProps)
        .filter(([key]) => !args.includes(key))
        .map(([, value]) => value)
        .join(" ");
    },
  };

  const workspaceFolder =
    vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";

  const interpolateObject = {
    fields,
    cwd: workspaceFolder,
    workspaceFolder,
    workspaceFolderBasename: workspaceFolder
      ? path.basename(workspaceFolder)
      : "",
    execPath,
    execPathBaseName: execPath ? path.basename(execPath) : "",
    env: process.env || {},
  };

  return interpolateObject;
};

export const interpolate = (object: object, format: string) => {
  const keys = Object.keys(object);
  const values = Object.values(object);
  return new Function(...keys, `return \`${format}\`;`)(...values);
};

export const getCommand = (prefix = "", value: any = "", suffix = "") =>
  `${value}`.trim().length > 0 ? `${prefix}${value}${suffix}` : value;

export const toSanitizedCommand = (str: string) =>
  str
    .replace(/ +(?= )/g, "")
    .replace(/;/g, ";\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\s*;\s*/g, ";\n")
    .replace(/\n+/g, "\n")
    .trim();

export const getNonce = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const getUriFromPath = (
  extensionUri: vscode.Uri,
  webview: vscode.Webview,
  ...paths: string[]
): vscode.Uri => {
  const localDiskPath = vscode.Uri.joinPath(extensionUri, ...paths);
  return webview.asWebviewUri(localDiskPath);
};

// Webview Uri for script and style to run in the webview
export const getUris = (extensionUri: vscode.Uri, webview: vscode.Webview) => {
  const stylesResetUri = getUriFromPath(
    extensionUri,
    webview,
    "media",
    "styles",
    "reset.css"
  );
  const stylesMainUri = getUriFromPath(
    extensionUri,
    webview,
    "media",
    "styles",
    "vscode.css"
  );
  const scriptMainUri = getUriFromPath(
    extensionUri,
    webview,
    "media",
    "scripts",
    "main.js"
  );

  const toolkitUri = getUriFromPath(
    extensionUri,
    webview,
    ...NodeModulesAccessor.getPathToOutputFile(NodeModulesKeys.uiToolkit)
  );
  const bootstrapUri = getUriFromPath(
    extensionUri,
    webview,
    ...NodeModulesAccessor.getPathToOutputFile(NodeModulesKeys.bootstrap)
  );

  return {
    stylesResetUri,
    stylesMainUri,
    scriptMainUri,
    toolkitUri,
    bootstrapUri,
  };
};
