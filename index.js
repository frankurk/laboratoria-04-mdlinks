/* eslint-disable no-else-return */
/* eslint-disable no-lonely-if */
import * as fs from 'fs';
import { getAllFiles, readFile, validateFile, validateStats } from './mdLinks.js';

export const mdLinks = (path, options) => {
  if (fs.statSync(path).isDirectory()) {
    const filesArr = [];
    const data = getAllFiles(path);
    data.forEach((file) => {
      if (options.validate) {
        const validatedFiles = validateFile(file);
        filesArr.push(validatedFiles);
      } else if (options.stats) {
        const links = validateStats(file);
        filesArr.push(links);
      } if (options.validate === false && options.stats === false) {
        const validatedFiles = readFile(file);
        filesArr.push(validatedFiles);
      }
    });
    return Promise.all(filesArr);
  } else {
    if (options.validate) {
      const validatedFiles = validateFile(path);
      return validatedFiles;
    } else if (options.stats) {
      return new Promise((resolve) => {
        resolve(validateStats(path));
      });
    } else {
      return new Promise((resolve) => {
        resolve(readFile(path));
      });
    }
  }
};
