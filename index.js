import * as fs from 'fs';
import { getAllFiles, readFile, validateFile } from './mdLinks.js';

export const mdLinks = (path, options) => {
  if (fs.statSync(path).isDirectory()) {
    const filesArr = [];
    const data = getAllFiles(path);
    data.forEach((file) => {
      if (options.validate) {
        const validatedFiles = validateFile(file);
        filesArr.push(validatedFiles);
      } else {
        const validatedFiles = readFile(file);
        filesArr.push(validatedFiles);
      }
    });
    return Promise.all(filesArr);
  }
  if (options.validate) {
    const validatedFiles = validateFile(path);
    return validatedFiles;
  }
  return new Promise((resolve) => {
    resolve(readFile(path));
  });
};
