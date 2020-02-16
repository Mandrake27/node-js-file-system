const http = require('http');
const fs = require('fs');

const {
  writeFilePromisify,
  renameFilePromisify,
  mkdirPromisify
} = require('./actions');

const buildHtml = (data, title) =>
  `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <ul class="shopping-list">
                ${data.map(elem => `<li>${elem}</li><br />`).join('')}
            </ul>
            <style>
            ul {
              margin-left: 15px;
              
              font-size: 15px;
              list-style: none;
            }
            </style>
        </body>
    </html>`;

const createDir = async (dirName) => {
  try {
    await mkdirPromisify(dirName);
  } catch (err) {
    throw err;
  }
};

const createHtmlFile = async () => {
  try {
    await writeFilePromisify(
      './src/html/index.html',
      buildHtml(['Milk', 'Bananas', 'Doshirak'], 'Shopping-List'))
  } catch (err) {
    console.log(err);
  }
};

const moveHtmlFile = async (oldPath, newPath) => {
  try {
    await renameFilePromisify(oldPath, newPath);
  } catch (err) {
    console.log(err);
  }
};

const doFollowingActions = async () => {
  await createDir('src');
  await createDir('src/html');
  await createHtmlFile();
  await createDir('src/build');
  await moveHtmlFile('./src/html/index.html', './src/build/index.html');
};

doFollowingActions();
