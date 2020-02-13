const fs = require('fs');
const { promisify } = require('util');

const writeFilePromisify = promisify(fs.writeFile);
const readFilePromisify = promisify(fs.readFile);
const renameFilePromisify = promisify(fs.rename);
const unlinkFilePromisify = promisify(fs.unlink);
const accessPromisify = promisify(fs.access);

const mkdirPromisify = promisify(fs.mkdir);

module.exports = {
  writeFilePromisify,
  readFilePromisify,
  renameFilePromisify,
  unlinkFilePromisify,
  mkdirPromisify,
  accessPromisify,
}