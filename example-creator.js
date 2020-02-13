const {
  writeFilePromisify,
  readFilePromisify,
  renameFilePromisify,
  unlinkFilePromisify,
} = require('./actions');

const createExampleFile = () => {
  writeFilePromisify('example.txt', 'Hello World!', err => {
    if (err) throw err;
  });
  console.log('1)File was successfully created!');
};

const readExampleFile = async () => {
  const data = await readFilePromisify('example.txt', err => {
    if (err) throw err;
  });
  console.log(`2)File data: ${data.toString('utf-8')}`);
};

const renameExampleFile = () => {
  renameFilePromisify('example.txt', 'new-example.txt', err => {
    if (err) throw err;
    console.log('3)File was successfully renamed!');
  });
};

const unlinkNewExampleFile = () => {
  unlinkFilePromisify('new-example.txt', err => {
    if (err) throw err;
    console.log('4)File was successfully removed!');
  });
};

const doFollowingActions = async () => {
  await createExampleFile();
  await readExampleFile();
  await renameExampleFile();
  await unlinkNewExampleFile();
};

doFollowingActions();