import fs from "fs";
import path from "path";
import { Settings } from "../Settings";
import { AppProps, FieldType } from "../constants";
import { getFilesList } from "./getFiles";

const getAppsListFromPath = (appPath: string) => {
  const files = getFilesList(appPath);
  return files
    .filter((file) => file.extension === ".json")
    .reduce((result: Array<AppProps>, file) => {
      try {
        const json = JSON.parse(fs.readFileSync(file.filePath, "utf-8"));
        if (Array.isArray(json)) return [...result, ...json];
        if (json && typeof json === "object" && !Array.isArray(json))
          return [...result, json];
        return result;
      } catch (error) {
        console.log(error);
        return result;
      }
    }, []);
};

export const getAppsList = () => {
  const defaultAppsList = getAppsListFromPath(
    path.resolve(__dirname, "../apps")
  );
  const customAppsList = getAppsListFromPath(Settings.customAppPath);
  const appsList = [
    ...Settings.customApps,
    ...customAppsList,
    ...defaultAppsList,
  ];

  const appNames: string[] = [];
  const distinctApps = appsList
    .map((app, index) => {
      if (appNames.includes(app.appName)) return;
      appNames.push(app.appName);

      app.tags = app.tags || [];
      app.order = app.order ?? index + 1;

      app.groupNames = [
        ...new Set(([] as string[]).concat(app.groupNames || app.appName)),
      ].filter(Boolean);
      app.relatedAppNames = [
        ...new Set(([] as string[]).concat(app.relatedAppNames || [])),
      ].filter(Boolean);

      app.fields = Object.fromEntries(
        Object.entries(app.fields || {})
          .filter(([, fieldProps]) => !fieldProps.hide)
          .map(([key, fieldProps], index) => [
            key,
            {
              ...fieldProps,
              order: fieldProps.order ?? index + 1,
              type: fieldProps.type || FieldType.TEXTBOX,
            },
          ])
      );

      return app;
    })
    .filter(Boolean)
    .sort((a, b) => (a!.order! > b!.order! ? 1 : -1)) as AppProps[];

  return distinctApps.filter((app) => !app.hide);
};
