
import * as vscode from 'vscode';
import { AppProps, Commands } from '../../constants';
import { getInterpolateObject, getWebviewOptions, interpolate } from '../../utilities';
import { getAppsList } from '../../utilities/getAppList';
import { Command } from '../Command';
import getWebview from './WebView';

export default class Webview {
  public static currentPanel: Webview | undefined;

  readonly #panel: vscode.WebviewPanel;
  readonly #extensionUri: vscode.Uri;
  #disposables: vscode.Disposable[] = [];

  #appsList: AppProps[] = getAppsList();
  #selectedApp: AppProps = this.#appsList[0];
  #selectedGroup: string = this.#appsList[0].groupNames[0];
  #filterValue: string = '';

  public static createOrShow(extensionUri: vscode.Uri) {

    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (Webview.currentPanel) {
      Webview.currentPanel.#panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      Commands.BOILERPLATER_WEBVIEW,
      'Boilerplater',
      column || vscode.ViewColumn.One,
      getWebviewOptions(extensionUri),
    );


    Webview.currentPanel = new Webview(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.#panel = panel;
    this.#extensionUri = extensionUri;

    this.#panel.iconPath = vscode.Uri.joinPath(extensionUri, "media", "images", "bp-logo-sm.png");

    // Set the webview's initial html content
    this.#update(true);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this.#panel.onDidDispose(() => this.dispose(), null, this.#disposables);

    // Handle messages from the webview
    this.#panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, null, this.#disposables);
  }

  onDidReceiveMessage = (message: any) => {
    switch (message.action) {
      case 'switch-app': {
        if (message.appName !== this.#selectedApp.appName) this.#switchApp(message.appName, message.groupName, message.filterValue);
        return;
      }
      case 'get-location': {
        this.#getFolderLocation(message);
        return;
      }
      case 'get-command-template': {
        this.#setCommandTemplate(message.object, message.commandTemplate);
        return;
      }
      case 'execute-command': {
        const command = new Command(
          message.command,
          message.location,
          this.#selectedApp.appName
        );
        command.executeCommand();
        return;
      }
      case 'copy-command': {
        this.#copyCommand(message.command);
        return;
      }

      case 'execute-create-command': {
        const command = new Command(
          message.command,
          message.location,
          this.#selectedApp.appName
        );
        command.executeCreateCommand();
        return;
      }
    }
  };

  #copyCommand = (command: string) => {
    vscode.env.clipboard.writeText(command);
    vscode.window.showInformationMessage('Command copied  to clipboard 📋');
  };

  #switchApp = (appName: string, groupName: string, filterValue: string) => {
    this.#selectedGroup = groupName;
    this.#filterValue = filterValue;
    this.#selectedApp = this.#appsList.find(app => app.appName === appName) || this.#selectedApp;
    this.#update();
  };

  #getFolderLocation = async (props: any) => {
    const folderLocations = await vscode.window.showOpenDialog({
      defaultUri: vscode.workspace.workspaceFolders?.[0]?.uri,
      canSelectFolders: props.isAppLocation ? true : this.#selectedApp.fields?.[props.name]?.canSelectFolder ?? true,
      canSelectFiles: props.isAppLocation ? false : this.#selectedApp.fields?.[props.name]?.canSelectFolder ?? true,
      canSelectMany: false,
      ...props
    });

    if (folderLocations?.length) {
      this.#panel.webview.postMessage({ action: props.isAppLocation ? 'set-app-location' : 'set-location', value: folderLocations[0].fsPath, name: props.name });
    }
  };

  #setCommandTemplate = (object: any, commandTemplate: string) => {
    try {
      this.#panel.webview.postMessage({
        action: 'set-command-template', value: interpolate(getInterpolateObject(object.fields, object.execPath), commandTemplate)
      });
    } catch (err: any) {
      if (err.message.includes('no defined')) {
        vscode.window.showErrorMessage(err.message + ". Please use ${fields.get('yourFieldName')} in the commandTemplate");
      } else {
        vscode.window.showErrorMessage(err.message + ". Please check the commandTemplate");
      }
    }
  };

  #update(showLoader: boolean = false) {
    // Vary the webview's content based on where it is located in the editor.
    switch (this.#panel.viewColumn) {
      case vscode.ViewColumn.Two:
      case vscode.ViewColumn.Three:
      case vscode.ViewColumn.One:
      default:
        this.#panel.webview.html = getWebview(
          this.#extensionUri,
          this.#panel.webview,
          this.#appsList,
          this.#selectedApp,
          this.#selectedGroup,
          this.#filterValue,
          showLoader
        );
        return;
    }
  }

  public dispose() {
    Webview.currentPanel = undefined;

    // Clean up our resources
    this.#panel.dispose();

    while (this.#disposables.length) {
      const disposable = this.#disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

}
