import * as fs from 'fs';
import { marked } from 'marked';
import { load } from 'cheerio';
import path from 'node:path';
import axios from 'axios';
import * as url from 'url';

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
  const linkPromises = [];

  for (let i = 0; i < content.length; i++) {
    const link = content[i].href;

    const linkPromise = axios.get(link).then((response) => {
      const dataLinks = {
        text: content[i].text,
        href: link,
        file: route,
        status: response.status,
        ok: response.statusText,
      };
      return dataLinks;
    }).catch((error) => {
      const dataLinks = {
        text: content[i].text,
        href: link,
        file: route,
        status: error.response.status,
        ok: error.response.statusText,
      };
      return dataLinks;
    });

    linkPromises.push(linkPromise);
  }
  return new Promise((resolve) => {
    Promise.all(linkPromises).then((resolvedPromises) => {
      resolve(resolvedPromises);
    });
  });
};

export const getAllFiles = (route, arr) => {
  const files = fs.readdirSync(route);
  const dirname = url.fileURLToPath(new URL('.', import.meta.url));
  arr = arr || [];

  files.forEach((file) => {
    if (fs.statSync(`${route}/${file}`).isDirectory()) {
      arr = getAllFiles(`${route}/${file}`, arr);
    } else {
      arr.push(path.join(dirname, route, '/', file));
    }
  });

  return arr;
};
