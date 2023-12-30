import * as fs from "fs";
import * as path from "path";

export const getFilesList = (
  directoryPath: string,
  foldersToExclude: string[] = [],
  recursive: boolean = true
): PathDetails[] => {
  const stats = getStats(directoryPath);
  if (!stats) return [];
  if (stats.isFile) {
    return [stats];
  } else if (stats.isDirectory && foldersToExclude.indexOf(directoryPath) < 0) {
    const files = fs.readdirSync(directoryPath);
    const filteredFiles = files.filter(
      (file) => foldersToExclude.indexOf(file) < 0
    );
    const filesList = filteredFiles.reduce(
      (res: PathDetails[], file: string) => {
        if (recursive) {
          return res.concat(
            getFilesList(`${directoryPath}/${file}`, foldersToExclude, true)
          );
        }
        return res.concat(getStats(`${directoryPath}/${file}`) || []);
      },
      []
    );

    return filesList;
  }
  return [];
};

export const getStats = (directoryPath: string): PathDetails | undefined => {
  if (!fs.existsSync(directoryPath)) return;
  const stats = fs.statSync(directoryPath);
  const extension = path.extname(directoryPath);
  const fileName = path.basename(directoryPath, extension);
  return {
    fileName,
    extension,
    filePath: directoryPath,
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
  };
};

type PathDetails = {
  fileName: string;
  extension: string;
  filePath: string;
  isFile: boolean;
  isDirectory: boolean;
};
