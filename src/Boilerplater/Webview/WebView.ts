import * as vscode from "vscode";
import {
  generateAppListDropdown,
  generateGroupButtons,
  generateGroupList,
  generateInfoContainers,
  getLoaderStyle,
} from "../../generators";
import { generateFormFields } from "../../generators/formFields";
import { AppProps } from "../../constants";
import { getNonce, getUris } from "../../utilities";

export default (
  extensionUri: vscode.Uri,
  webview: vscode.Webview,
  appsList: AppProps[],
  selectedApp: AppProps,
  selectedGroup: string,
  filterValue: string,
  showLoader: boolean
) => {
  const formFields = generateFormFields(selectedApp.fields, selectedApp);
  const groupNamesList = generateGroupList(
    appsList,
    selectedGroup,
    filterValue
  );
  const appGroupButtons = generateGroupButtons(
    appsList,
    selectedApp,
    selectedGroup
  );
  const appsListOptions = generateAppListDropdown(appsList, selectedApp);
  const infoContainers = generateInfoContainers(
    appsList,
    selectedApp,
    selectedGroup
  );

  const nonce = getNonce(); // Use a nonce to only allow specific scripts to be run
  const uri = getUris(extensionUri, webview);
  const loaderStyles = getLoaderStyle(nonce);

  return `
<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
        webview.cspSource
      } 'unsafe-inline'; 
          img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
      <link href="${uri.bootstrapUri}" rel="stylesheet">
      <link href="${uri.stylesResetUri}" rel="stylesheet">
      <link href="${uri.stylesMainUri}" rel="stylesheet">
  
      <script type="module" src="${uri.toolkitUri}" nonce="${nonce}"></script>
      ${loaderStyles}
      <title>Create App</title>
  </head>
  
  <body style="overflow: hidden;">
      <div id="loader" class="loader ${showLoader ? "" : "hide-loader"}">
          <div class="loader-text">🚀Launching...</div>
      </div>
      <div class="container-lg my-0 h-100">
          <div class="row pt-4 h-100">
              <aside class="col-3 col-lg-2 d-none d-md-block app-list-container h-100 pe-0 overflow-y-auto" style="scrollbar-gutter: stable;">
                  <div class="searchbox-wrapper position-sticky top-0">
                      <vscode-text-field id="app-list-filter-input" class="search-box d-block mb-2" placeholder="Search apps here" value="${filterValue}"></vscode-text-field>
                  </div>
                  <ul id="app-list" class="list-group app-list overflow-y-auto mb-3 rounded-0">
                      ${groupNamesList}
                  </ul>
              </aside>
              <section class="col h-100 overflow-y-auto d-flex flex-column" style="scrollbar-gutter: stable;">
                  <section class="position-sticky top-0 z-1" style="background: var(--vscode-editor-background);">
                      <header class="d-flex align-items-center justify-content-between mb-2">
                          <div class="d-none d-md-inline-flex gap-1 flex-wrap">
                              ${appGroupButtons}
                          </div>
                          <vscode-dropdown id="app-list-dropdown" class="d-inline-block d-md-none"
                              style="min-width: 12rem;">
                              ${appsListOptions}
                          </vscode-dropdown>
                          <div class="d-inline-flex gap-1 flex-wrap justify-content-end">
                              <vscode-button appearance="secondary" id="copy-config" title="copy the app config">Copy App Config</vscode-button>
                              <vscode-button appearance="secondary" id="copy-command" title="copy the command">Copy Command</vscode-button>
                              <vscode-button appearance="primary" id="execute" title="execute the command in terminal">Execute Command</vscode-button>
                          </div>
                      </header>
                      <div class="command-container mb-3">
                          <vscode-text-area id="command" class="d-block w-100" rows="5" style="margin-bottom: -5px" resize="vertical"></vscode-text-area>
                      </div>
                  </section>
                  <section class="configuration-container row flex-grow">
                      <div id="boilerplater-form" class="col d-flex flex-column app-config-container overflow-y-auto h-100">
                          ${formFields}
                      </div>
                      <div class="col-4 col-lg-3 additional-details-container h-100 overflow-y-auto d-none d-lg-block ${
                        infoContainers?.length ? "" : "d-lg-none"
                      }">
                          ${infoContainers}
                      </div>
                  </section>
              </section>
          </div>
      </div>
      <script src="${uri.scriptMainUri}" nonce="${nonce}"></script>
      <script nonce="${nonce}">
          setTimeout(() => {
              init(${JSON.stringify(selectedApp)}, "${filterValue}");
          }, 300);
          setTimeout(() => {
              document.getElementById("loader")?.remove();
          }, 1000);
      </script>
  </body>
  
  </html>
  `;
};
