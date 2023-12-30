import * as vscode from 'vscode';

export class Command {

  commands: string[];
  location: string;
  appType: string;

  constructor(
    command: string,
    location: string,
    appType: string,
  ) {
    this.commands = command?.trim().split(';').map(item => item.trim()).filter(Boolean);
    this.location = location || "";
    this.appType = appType;
  }

  executeCreateCommand() {
    const terminal = vscode.window.createTerminal({
      name: `Creating your ${this.appType} App`,
      cwd: this.location
    });
    this.commands.forEach(command => {
      terminal.sendText(command);
    });
    terminal.show();
  };

  executeCommand() {
    const terminal = vscode.window.createTerminal({
      name: `${this.appType} App`,
      cwd: this.location
    });
    this.commands.forEach(command => {
      terminal.sendText(command);
    });
    terminal.show();
  };
}
