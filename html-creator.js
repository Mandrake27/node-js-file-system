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

const createDir = async () => {
  try {
    await mkdirPromisify('src');
    await mkdirPromisify('build');
  } catch (err) {
    throw err;
  }
};

const createHtmlFile = async () => {
  await writeFilePromisify(
    './src/index.html',
    buildHtml(['Milk', 'Bananas', 'Doshirak'], 'Shopping-List'),
    err => {
      if (err) throw err;
    }
  );
};

const moveHtmlFile = async () => {
  await renameFilePromisify('./src/index.html', './build/index.html', err => {
    if (err) throw err;
  });
};

const launchServer = () => {
  http
    .createServer((req, res) => {
      fs.readFile('./build/index.html', (err, data) => {
        if (err) throw err;
        console.log(data);
        res.end(data);
      });
    })
    .listen(3000);
};

const doFollowingActions = async () => {
  await createDir();
  await createHtmlFile();
  await moveHtmlFile();
};

doFollowingActions();
launchServer();
