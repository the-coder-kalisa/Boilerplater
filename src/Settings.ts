import * as vscode from "vscode";
import { AppProps } from "./constants";

export class Settings {
  static get iconsConfiguration() {
    return vscode.workspace.getConfiguration("boilerplater.settings");
  }
  static getSettings(key: string) {
    return Settings.iconsConfiguration.get(key);
  }
  static setSettings(key: string, val: any, isUser = true) {
    return Settings.iconsConfiguration.update(key, val, isUser);
  }
  static get customAppPath() {
    return Settings.getSettings("customAppPath") as string;
  }
  static get customApps() {
    return (Settings.getSettings("customApps") as Array<AppProps>) || [];
  }
  static get promptType() {
    return Settings.getSettings("cli.promptType") as
      | "Default"
      | "Required"
      | "None";
  }
  static get shouldPromptCommandString() {
    return Settings.getSettings("cli.promptCommandString") as boolean;
  }
  static get shouldPromptLocation() {
    return Settings.getSettings("cli.promptExecutionPath") as boolean;
  }
  static get shouldShowAppIcons() {
    return Settings.getSettings("webview.showAppIcons") as boolean;
  }
}
