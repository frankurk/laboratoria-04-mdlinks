#!/usr/bin/env node
import process from 'process';
import { mdLinks } from './index.js';

export const cli = () => {
  const path = process.argv[2];
  const options = {
    validate: false,
    stats: false,
  };
  if (process.argv[3] === '--validate') {
    options.validate = true;
  } if (process.argv[3] === '--stats') {
    options.stats = true;
  }
  mdLinks(path, options).then((result) => {
    console.log(result);
  });
};

cli();
