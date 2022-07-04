// import { mdLinks } from './mdLinks.js';
import fs from 'fs';
import { marked } from 'marked';
import { load } from 'cheerio';
import path from 'node:path';

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
    });
  });
  return links;
};

const fileRead = readFile('./demo.md');
console.log(fileRead);

const readDir = (route) => {
  const content = fs.readdirSync(route, 'utf8');
  const dirEl = [];
  content.forEach((file) => {
    dirEl.push(file);
  });
  return dirEl;
};

const dir = readDir('/Users/fran/Desktop/Dev/Proyectos/laboratoria-04-mdlinks');
console.log(dir);
