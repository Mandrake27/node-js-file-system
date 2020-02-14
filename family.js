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
    const isExists = await this.checkJsonExistence();
    if (!isExists) {
      console.log('Json file does not exist, creating a new one...');
      await this.createValidJsonFile();
      return await this.initJSON();
    }
    await this.checkJsonFamilyStructure();
    await this.checkJsonValidation();
    const currentData = await this.readJsonFile();
    this.currentData = currentData;
  }

  async createValidJsonFile() {
    try {
      const stringified = JSON.stringify(this.validStructure, null, 2);
      await writeFilePromisify(this.fileName, stringified);
    } catch (err) {
      console.log(err);
    }
  }

  async checkJsonFamilyStructure() {
    const data = await this.readJsonFile();
    if (!data.Groups) {
      console.log(
        'Current Json - Family structure is invalid, re-writing json...'
      );
      await this.createValidJsonFile();
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

  async checkFamilyValidation(object) {
    let hasErrors = false;
    let famKeys = Object.keys(object);
    const correctFamKeys = [
      'id',
      'firstName',
      'lastName',
      'groupId',
      'ownerId',
      'loversIds'
    ];
    for (let i = 0; i < correctFamKeys.length; i++) {
      if (famKeys[i] !== correctFamKeys[i]) {
        hasErrors = true;
      } else if (object.groupId > 3 && object.groupId < 1) {
        hasErrors = true;
      } else if (isNaN(object.id) && isNaN(object.groupId)) {
        hasErrors = true;
      }
    }
    return hasErrors;
  }

  async checkJsonExistence() {
    try {
      await accessPromisify(this.fileName);
      return 'exists';
    } catch (err) {
      await this.createValidJsonFile();
    }
  }

  async checkJsonValidation() {
    let isValid = false;
    const ajv = new Ajv();
    const currentData = await this.readJsonFile();
    const valid = ajv.validate(currentData);
    if (valid) {
      isValid = true;
      return isValid;
    }
    console.log("File's structure is invalid!");
    return isValid;
  }

  async addNewMember(data) {
    await this.initJSON();
    const freshUserInfo = this.validateNewMember(data);
    return freshUserInfo;
  }

  // findItem(arr, object, queryParam) {
  //   const foundObj = arr.find(item => item[queryParam] === object[queryParam]);
  //   return foundObj;
  // }

  findFamilyMember(arr, objItem, query) {
    const foundObject = arr.find(member => member[query] === objItem);
    return foundObject;
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
      const ownerFirstName = this.findFamilyMember(
        Family,
        object.owner.firstName,
        firstName
      );
      const ownerLastName = this.findFamilyMember(
        Family,
        object.owner.lastName,
        lastName
      );
      if (ownerFirstName === undefined && ownerLastName === undefined) {
        throw new Error('Your owner has not been found, try another one!');
      }
      const loverFirstName = this.findFamilyMember(
        Family,
        lover.firstName,
        firstName
      );
      const loverLastName = this.findFamilyMember(
        Family,
        lover.lastName,
        lastName
      );
      if (loverFirstName === undefined && loverLastName === undefined) {
        throw new Error('Your lover has not been found, try another one!');
      } else {
        loversIds.push(loverMember.id);
      }
      for (let i = 0; i < Family.length; i++) {
        memberId = Family[i].id + 1;
      }
      newObject = {
        id: memberId,
        firstName: object.firstName,
        lastName: object.lastName,
        groupId,
        ownerId: owner.id,
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
    ].sort((a, b) => a.id - b.id);
    await this.saveDataToJson(newData);
    return 'You have successfully changed a member';
  }

  async deleteFamilyMember(id) {
    await this.initJSON();
    const newData = JSON.parse(JSON.stringify(this.currentData));
    const { Family } = newData;
    const memberIndex = Family.findIndex(member => member.id === id);
    Family.splice(memberIndex, 1);
    await this.saveDataToJson(newData);
    return 'You have successfully deleted a member';
  }
}

const fam = new Family();

// fam.addNewMember({
//   firstName: 'Miras',
//   lastName: 'Rambaev',
//   groupName: 'parents',
//   owner: { firstName: 'Angelinka', lastName: 'Zhopka' },
//   lovers: [{ firstName: 'Angelinka', lastName: 'Zhopka' }]
// });

module.exports = Family;
