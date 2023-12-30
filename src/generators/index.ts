import { Settings } from "../Settings";
import { AppProps } from "../constants";

export const generateGroupList = (
  appsList: AppProps[],
  selectedGroup?: string,
  filterValue: string = ""
): string => {
  const groupNames: string[] = [
    ...new Set(appsList.map((app) => app.groupNames).flat()),
  ];

  return groupNames
    .map((groupName) => {
      const app = appsList.find((app) =>
        app.groupNames.includes(groupName)
      ) as AppProps;
      const isSelected = groupName === selectedGroup;
      const groupTags = appsList
        .filter((app) => app.groupNames.includes(groupName))
        .map((app) => app.tags || [])
        .flat();
      const isHidden =
        filterValue && !groupTags?.some((tag) => tag.includes(filterValue));

      const icon = Settings.shouldShowAppIcons
        ? `
    <div class="col-3 text-center thumbnail p-2">
      <img src="${
        app.logoPath ||
        "https://raw.githubusercontent.com/R35007/create-app-support/version_5.1.0/images/ca-logo.png"
      }" />
    </div>`
        : "";

      return `
      <li 
        data-switch-group="${groupName}" 
        data-switch-app="${app.appName}" 
        title="${app.description}" 
        role="button" 
        class="row g-0 app-card ${isSelected ? "selected" : ""}"
        style="order: ${app.order}; display: ${isHidden ? "none" : "flex"};" 
      >
        ${icon}
        <div class="tags d-none">${groupTags?.join(",")}</div>
        <div class="col app-title p-2">${groupName}</div>
      </li>
    `;
    })
    .join("");
};

export const generateGroupButtons = (
  appsList: AppProps[],
  selectedApp: AppProps,
  selectedGroup: string
) =>
  appsList
    .filter((app) => app.groupNames.includes(selectedGroup))
    .map(
      (app) => `
<vscode-button 
  style="order: ${app.order}" 
  data-switch-app="${app.appName}"
  data-switch-group="${selectedGroup}"
  appearance=${selectedApp.appName === app.appName ? "primary" : "secondary"}
>
    ${app.appName}
</vscode-button>`
    )
    .join("");

export const generateAppListDropdown = (
  appsList: AppProps[],
  selectedApp: AppProps
) =>
  appsList
    .map(
      (app) => `
    <vscode-option 
      data-switch-group=${selectedApp.groupNames[0]} 
      ${app.appName === selectedApp.appName && "selected"} 
      value="${app.appName || ""}">${app.appName}</vscode-option>`
    )
    .join("") || "";

export const generateInfoContainers = (
  appsList: AppProps[],
  selectedApp: AppProps,
  selectedGroup: string
) => {
  const prerequisites =
    selectedApp.prerequisites
      ?.map((p) => {
        if (p.href)
          return `<a title="${p.description}" href="${p.href}" class="tag anchor-tag">${p.label}</a>`;
        return `<span title="${p.description}" data-command="${p.command}" class="tag command-tag">${p.label}</span>`;
      })
      .join("") || "";

  const additionalCommands =
    selectedApp.additionalCommands
      ?.map(
        (ac) =>
          `<span title="${ac.description}" data-command="${ac.command}" class="tag command-tag">${ac.label}</span>`
      )
      .join("") || "";

  const relatedApps =
    selectedApp.relatedAppNames
      ?.filter((relativeAppName: string) =>
        appsList.some((app) => app.appName === relativeAppName)
      )
      .map(
        (relativeApp: string) => `
    <span 
        data-switch-app="${relativeApp}"
        data-switch-group="${
          appsList.find((app) => app.appName === relativeApp)?.groupNames[0]
        }"
        title="${relativeApp}" 
        class="tag"
    >${relativeApp}</span>`
      )
      .join("") || "";

  const resources =
    selectedApp.resources
      ?.map(
        (resource) =>
          `<div><a href='${resource.href}' title='${
            resource.description || resource.href
          }'>${resource.label}</a></div>`
      )
      .join("") || "";

  const aboutSection = selectedApp.description?.length
    ? `
    <div class="about-container">
        <h5 class="my-3">About</h5>
        <div class="about-content my-3">
        ${selectedApp.description}
        </div>
    </div>`
    : "";

  const prerequisitesSection = selectedApp.prerequisites?.length
    ? `
    <div class="prerequisites-container">
        <h5 class="my-3">Prerequisites</h5>
        <div class="prerequisites-content my-3">
        ${prerequisites}
        </div>
    </div>`
    : "";

  const additionCommandsSection = selectedApp.additionalCommands?.length
    ? `
    <div class="additional-commands-container">
        <h5 class="my-3">Additional Commands</h5>
        <div class="additional-commands-content my-3">
        ${additionalCommands}
        </div>
    </div>`
    : "";

  const relatedAppsSection = relatedApps?.length
    ? `
    <div class="additional-commands-container">
        <h5 class="my-3">Related Apps</h5>
        <div class="additional-commands-content my-3">
        ${relatedApps}
        </div>
    </div>`
    : "";

  const resourcesSection = selectedApp.resources?.length
    ? `
    <div class="resources-container">
        <h5 class="my-3">Resources</h5>
        <div class="resources-content my-3">
        ${resources}
        </div>
    </div>`
    : "";

  const infoContainers = [
    aboutSection,
    prerequisitesSection,
    additionCommandsSection,
    relatedAppsSection,
    resourcesSection,
  ]
    .filter(Boolean)
    .join("<vscode-divider></vscode-divider>");

  return infoContainers;
};

export const getLoaderStyle = (nonce: string) => `<style nonce="${nonce}">
.hide-loader{
  display: none !important;
}

.loader{
  background: var(--vscode-editor-background);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 3;
}

.loader-text{
  font-size: 26px;
  opacity: 0.8;
  animation: blink 0.5s linear infinite alternate;
  position: absolute;
  top: 35%;
  text-align: center;
  width: 100%;
}

@keyframes blink {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.5;
  }
}

</style>
`;
