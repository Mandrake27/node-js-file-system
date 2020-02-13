const {
  writeFilePromisify,
  readFilePromisify,
  accessPromisify
} = require('./actions');

const Ajv = require('ajv');

const validStructure = {
  Family: [],
  Groups: [
    {
      value: 'parents',
      id: 1
    },
    {
      value: 'children',
      id: 2
    },
    {
      value: 'pets',
      id: 3
    }
  ]
};

class Family {
  constructor(fileName = 'family.json') {
    this.fileName = fileName;
    this.validStructure = validStructure;
  }

  async initJSON() {
    await this.checkJsonExistence();
    await this.checkJsonValidation();
    const currentData = await this.readJsonFile();
    this.currentData = currentData;
  }

  async createJsonFile() {
    try {
      const stringified = JSON.stringify(this.validStructure, null, 2);
      await writeFilePromisify(this.fileName, stringified);
    } catch (err) {
      console.log(err);
    }
  }

  async saveDataToJson(data = this.currentData) {
    try {
      const stringified = JSON.stringify(data, null, 2);
      await writeFilePromisify(this.fileName, stringified);
    } catch (err) {
      console.log(err);
    }
  }

  async readJsonFile() {
    try {
      const data = await readFilePromisify(this.fileName);
      const object = JSON.parse(data);
      return object;
    } catch (err) {
      console.log(err);
    }
  }

  checkFamilyValidation(object) {
    let hasErrors = false;
    const correctFamKeys = [
      'id',
      'firstName',
      'lastName',
      'groupId',
      'ownerId',
      'loversIds'
    ];
    const famKeys = Object.keys(object);
    for (let i = 0; i < correctFamKeys.length; i++) {
      if (famKeys[i] !== correctFamKeys[i]) {
        hasErrors = true;
      } else if (object.groupId > 3 && object.groupId < 1) {
        hasErrors = true;
      } else if (isNaN(object.id) && isNaN(object.groupId)) {
        errors += 1;
      }
    }
    return hasErrors;
  }

  async checkJsonExistence() {
    try {
      await accessPromisify(this.fileName);
    } catch (err) {
      await this.createJsonFile();
    }
  }

  async checkJsonValidation() {
    let isValid = false;
    const ajv = new Ajv();
    const currentData = await this.readJsonFile();
    const valid = ajv.validate(currentData);
    if (valid) {
      isValid = true;
      return;
    }
    console.log("File's structure is invalid!");
    return isValid;
  }

  async addNewMember(data) {
    await this.initJSON();
    this.validateNewMember(data);
  }

  async validateNewMember(object) {
    let memberId = 1;
    const loversIds = [];
    let newObject = {};
    await this.checkJsonExistence();
    const data = await this.readJsonFile();
    const { Family } = data;
    const { Groups } = data;
    const { id: groupId } = Groups.find(
      group => group.value === object.groupName
    );

    if (Family.length !== 0) {
      const { id: ownerId } = Family.find(
        owner =>
          owner.firstName === object.owner.firstName &&
          owner.lastName === object.owner.lastName
      );
      object.lovers.map(lover => {
        const { id } = Family.find(
          person =>
            person.firstName === lover.firstName &&
            person.lastName === lover.lastName
        );
        loversIds.push(id);
      });
      for (let i = 0; i < Family.length; i++) {
        memberId = Family[i].id + 1;
      }
      newObject = {
        id: memberId,
        firstName: object.firstName,
        lastName: object.lastName,
        groupId,
        ownerId,
        loversIds
      };
    }
    if (Family.length === 0) {
      object.ownerId = 'none';
      newObject = {
        id: memberId,
        firstName: object.firstName,
        lastName: object.lastName,
        groupId,
        ownerId: 'none',
        loversIds: 'self'
      };
    }

    const hasErrors = await this.checkFamilyValidation(newObject);
    if (!hasErrors) {
      this.currentData.Family.push(newObject);
      await this.saveDataToJson();
      return newObject;
    }
  }

  async editFamilyMembers(id, changes) {
    await this.initJSON();
    const { Family } = this.currentData;
    if (Family.length === 0) {
      return console.log('Nothing to change, you are first here');
    }
    let memberToEdit = Family.find(member => member.id === id);
    if (memberToEdit === undefined) {
      return console.log("Your member has'n been found, try another id");
    }
    memberToEdit = {
      ...memberToEdit,
      ...changes
    };
    let newData = JSON.parse(JSON.stringify(this.currentData));
    const memberIndex = Family.findIndex(member => member.id === id);
    newData.Family.splice(memberIndex, 1);
    newData.Family = [
      ...newData.Family,
      {
        ...memberToEdit
      }
    ].sort((a,b) => a.id - b.id);
    await this.saveDataToJson(newData);
    return console.log('You have successfully changed a member');
  }

  async deleteFamilyMember(id) {
    await this.initJSON();
    const newData = JSON.parse(JSON.stringify(this.currentData));
    const { Family } = newData;
    const memberIndex = Family.findIndex(member => member.id === id);
    Family.splice(memberIndex, 1);
    await this.saveDataToJson(newData);
    // return newData;
  }
}

module.exports = Family;

const fam = new Family();

// fam.addNewMember({
//   firstName: 'Miras',
//   lastName: 'Rambaev',
//   groupName: 'parents',
//   owner: { firstName: 'Miras', lastName: 'Rambaev' },
//   lovers: [{ firstName: 'Miras', lastName: 'Rambaev' }]
// });

// fam.editFamilyMembers(2, { lastName: 'Rm' });
fam.deleteFamilyMember(1);
