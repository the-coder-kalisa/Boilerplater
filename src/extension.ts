// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Commands } from "./constants";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.BOILERPLATER_WEBVIEW, () => {
      Interactive.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.BOILERPLATER_CLI, async () => {
      Quick.createApp();
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
