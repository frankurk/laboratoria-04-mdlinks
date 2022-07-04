// import { mdLinks } from './mdLinks.js';
import * as fs from 'fs';
import { marked } from 'marked';
import { load } from 'cheerio';
import path from 'node:path';
import axios from 'axios';

export const readFile = (route) => {
  if (path.extname(route) !== '.md') throw new Error();
  const content = fs.readFileSync(route, 'utf8');
  const data = marked.parse(content);
  const $ = load(data);
  const linkTag = $('a');

  const links = [];
  linkTag.each((index, link) => {
    links.push({
      text: $(link).text(),
      href: $(link).attr('href'),
      file: route,
    });
  });
  return links;
};

export const validateFile = (route) => {
  const content = readFile(route);
  const links = [];
  for (let i = 0; i < content.length; i++) {
    const link = content[i].href;
    axios.get(link).then((response) => {
      const dataLinks = {
        text: content[i].text,
        href: link,
        file: route,
        status: response.status,
        ok: response.statusText,
      };
      links.push(dataLinks);
      console.log(links);
    });
  }
};

console.log(validateFile('./demo.md'));

// const fileRead = readFile('./demo.md');
// console.log(fileRead);

export const readDir = (route) => {
  const content = fs.readdirSync(route, 'utf8');
  const dirEl = [];
  content.forEach((file) => {
    dirEl.push(file);
  });
  return dirEl;
};

// const dir = readDir('/Users/fran/Desktop/Dev/Proyectos/laboratoria-04-mdlinks');
// console.log(dir);
