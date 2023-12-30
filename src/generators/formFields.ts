import { AppProps, FieldProps, FieldType } from "../constants";

const getTextbox = (fieldName: string, props: FieldProps) => {
  return `<vscode-text-field 
    placeholder="${props.placeholder ?? ""}" 
    class="d-block control" 
    value="${props.value ?? ""}" 
    name="${fieldName}" 
    ${props.required ? "required" : ""}
  ></<vscode-text-field>`;
};

const getRadioGroup = (fieldName: string, props: FieldProps) => {
  const radioGroup = `
  <vscode-radio-group 
    class="control" 
    name="${fieldName}" 
  >
    ${
      props.options
        ?.map(
          (opt) =>
            `<vscode-radio ${
              (opt.value ?? "") === (props.value ?? "") && "checked"
            } value="${opt.value ?? ""}">${opt.label ?? ""}</vscode-radio>`
        )
        .join("") || ""
    }
  </vscode-radio-group>
  `;
  return radioGroup;
};

const getDropDown = (fieldName: string, props: FieldProps) => {
  return `
  <vscode-dropdown 
    class="d-block w-100 control"
    name="${fieldName}" 
    ${props.required ? "required" : ""}
  >
    ${
      props.options
        ?.map(
          (opt) =>
            `<vscode-option ${
              (opt.value ?? "") === (props.value ?? "") && "selected"
            } value="${opt.value ?? " "}">${opt.label ?? ""}</vscode-option>`
        )
        .join("") || ""
    }
  </vscode-dropdown>
  `;
};

const getCheckbox = (fieldName: string, props: FieldProps) => {
  return `<vscode-checkbox 
    class="control-checkbox" 
    data-checked-value="${props.checkedValue ?? "true"}" 
    data-un-checked-value="${props.unCheckedValue ?? ""}" 
    name="${fieldName}" 
    ${
      `${props.value ?? ""}`.trim() !== `${props.unCheckedValue ?? ""}`.trim()
        ? "checked"
        : ""
    }
    ></<vscode-checkbox>`;
};

const getBrowse = (fieldName: string, props: FieldProps) => {
  return `
  <div class="d-flex">
    <vscode-text-field 
      name="${fieldName}" 
      value="${props.value ?? ""}"
      class="d-block w-100 flex-1 control" 
      placeholder="${props.placeholder || "Please select any folder"}" 
      ${props.required ? "required" : ""}
    ></vscode-text-field>
    <vscode-button data-name="${fieldName}" class="browse-btn" style="white-space: nowrap;">
        ${props.buttonText || "Browse Folder"}
    </vscode-button>
  </div>
  `;
};

const fieldSwitch = (fieldName: string, fieldProps: FieldProps) => {
  switch (fieldProps.type) {
    case FieldType.TEXTBOX:
      return getTextbox(fieldName, fieldProps);
    case FieldType.RADIO:
      return getRadioGroup(fieldName, fieldProps);
    case FieldType.CHECKBOX:
      return getCheckbox(fieldName, fieldProps);
    case FieldType.DROPDOWN:
      return getDropDown(fieldName, fieldProps);
    case FieldType.BROWSE:
      return getBrowse(fieldName, fieldProps);
    default:
      return getTextbox(fieldName, fieldProps);
  }
};

export const generateFormFields = (
  fieldProps: Record<string, FieldProps> = {},
  selectedApp: AppProps
): string => {
  const browseAppLocation = `
  <div class="row mb-3 align-items-center" style="order: ${
    Object.keys(selectedApp.fields || {}).length + 1
  }">
    <div class="col-12 val">
      <div class="d-flex mb-1">
        <vscode-text-field id="app-folder-location" class="d-block flex-1 w-100" placeholder="Please provide the folder path to boilerplate"></vscode-text-field>
        <vscode-button id="app-folder-location-btn" title="Browse location to boilerplate" style="white-space: nowrap;">Browse Folder</vscode-button>
      </div>
      <div>Leave it empty to boilerplate in active workspace folder.</div>
    </div>
  </div>`;

  if (!Object.entries(fieldProps).length) return browseAppLocation;

  const formFields = Object.entries(fieldProps)
    .map(([fieldName, fieldProps]) => {
      return `
      <div class="field-row row mb-3 align-items-center" style="order: ${
        fieldProps.order
      }">
        <div class="col-12 col-lg-4 key mb-1 ${
          fieldProps.label?.trim().length ? "" : "d-none"
        }">${fieldProps.label} ${
        fieldProps.required ? `<span class="text-primary">*</span>` : ""
      }</div>
        <div class="col val">
          <div class="mb-1">${fieldSwitch(fieldName, fieldProps)}</div>
          <div class="error ${fieldName}-error text-danger"></div>
          <div class="description">${fieldProps.description || ""}</div>
        </div>
      </div>
    `;
    })
    .join("");

  return formFields + browseAppLocation;
};
