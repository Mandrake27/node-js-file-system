const Family = require('./family');

const fam = new Family();

const createJsonFileText = async () => {
  await fam.createJsonFile();
  const existenceCheck = await fam.checkJsonExistence();
  if (existenceCheck) return console.log('Create Json test - passed!');
};

// createJsonFileText();

const saveDataToJsonTest = async () => {
  const testObject = { name: 'test' };
  await fam.saveDataToJson(testObject);
  const data = await fam.readJsonFile();
  if (data) return console.log('Save data test - passed!');
};

// saveDataToJsonTest();

const readJsonFileTest = async () => {
  const data = await fam.readJsonFile();
  if (data) return console.log('Read json file test - passed!');
};

// readJsonFileTest();

const checkJsonExistenceTest = async () => {
  const existenceCheck = await fam.checkJsonExistence();
  if (existenceCheck) return console.log('Json existence test - passed!');
};

// checkJsonExistenceTest();

const checkJsonValidationTest = async () => {
  const isValid = await fam.checkJsonValidation();
  if (isValid) return console.log('Json validation test - passed!');
};

// checkJsonValidationTest();

const addNewMemberTest = async object => {
  const newAddedObject = await fam.addNewMember(object);
  if (newAddedObject) return console.log('Add new member test - passed!');
};

// addNewMemberTest({
//   firstName: 'Angelinka',
//   lastName: 'Bondarchuk',
//   groupName: 'parents',
//   owner: { firstName: 'Miras', lastName: 'Rambaev' },
//   lovers: [{ firstName: 'Miras', lastName: 'Rambaev' }]
// });

const checkFamilyValidationTest = async object => {
  const newAddedObject = await fam.addNewMember(object);
  const hasErrors = await fam.checkFamilyValidation(newAddedObject);
  if (!hasErrors) return console.log('New member check test - passed');
};

// checkFamilyValidationTest({
//   firstName: 'Miras',
//   lastName: 'Rambaev',
//   groupName: 'parents',
//   owner: { firstName: 'Miras', lastName: 'Rambaev' },
//   lovers: [{ firstName: 'Miras', lastName: 'Rambaev' }]
// });


const editFamilyMembersTest = async (id, changes) => {
  const isChanged = await fam.editFamilyMembers(id, changes);
  if (isChanged) return console.log('Family member change test - passed');
}

// editFamilyMembersTest(1, { firstName: 'Miras' });

const deleteFamilyMemberTest = async (id) => {
  const isDeleted = await fam.deleteFamilyMember(id);
  console.log(isDeleted);
  if (isDeleted) return console.log('Family member remove test - passed');
}

// deleteFamilyMemberTest(4);