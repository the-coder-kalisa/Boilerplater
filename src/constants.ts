export enum Commands {
  BOILERPLATER_WEBVIEW = "boilerplater.webview",
  BOILERPLATER_CLI = "boilerplater.cli",
}

export enum FieldType {
  TEXTBOX = "textbox",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  BROWSE = "browse",
  DROPDOWN = "dropdown",
}

export interface Options {
  label: string;
  value?: any;
}

export interface Tags {
  label: string;
  description: string;
  command?: string;
  href?: string;
}

export interface FieldProps {
  label?: string;
  type?:
    | FieldType.TEXTBOX
    | FieldType.CHECKBOX
    | FieldType.RADIO
    | FieldType.DROPDOWN
    | FieldType.BROWSE;
  order?: number;
  prefix?: string;
  suffix?: string;
  checkedValue?: string | boolean;
  unCheckedValue?: string | boolean;
  value?: string | boolean;
  placeholder?: string;
  buttonText?: string;
  description?: string;
  required?: boolean;
  prompt?: boolean;
  canSelectFile?: boolean;
  canSelectFolder?: boolean;
  hide?: boolean;
  pattern?: string;
  errors?: { required?: string; pattern?: string };
  options?: Options[];
}

export interface AppProps {
  appName: string;
  groupNames: string[];
  relatedAppNames?: string[];
  commandTemplate: string | string[];
  hide?: boolean;
  fields?: Record<string, FieldProps>;
  description?: string;
  logoPath?: string;
  prerequisites?: Tags[];
  additionalCommands?: Tags[];
  resources?: Tags[];
  tags?: string[];
  order?: number;
}
