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

  async createValidJsonFile() {
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

  async checkFamilyValidation(object) {
    const correctFamKeys = [
      'firstName',
      'lastName',
      'groupName',
      'owner',
      'lovers'
    ];
    const groupMatch = this.findGroupByName(object.groupName);
    const inputKeys = Object.keys(object);
    for (let i = 0; i < correctFamKeys.length; i++) {
      if (inputKeys[i] !== correctFamKeys[i]) {
        throw new Error('Found invalid keys in your object, check them again');
      }
    }
    if (!groupMatch) {
      throw new Error('Invalid group name, change it!');
    }
    return 'test passed';
  }

  async checkJsonExistence() {
    try {
      await accessPromisify(this.fileName);
      return 'exists';
    } catch (err) {
      console.log(err);
    }
  }

  async checkJsonValidation() {
    const ajv = new Ajv();
    const currentData = await this.readJsonFile();
    if (!currentData.Groups) {
      throw new Error('Json structure is invalid, check the name of json file');
    }
    const valid = ajv.validate(currentData);
    if (!valid) {
      throw new Error("File's structure is invalid!");
    }
  }

  async addNewMember(data) {
    await this.initJSON();
    await this.checkFamilyValidation(data);
    const freshUserInfo = this.validateNewMember(data);
    return freshUserInfo;
  }


  findFamilyMember(obj) {
    const { Family } = this.currentData;
    return Family.find(member => member.firstName === obj.firstName && member.lastName === obj.lastName);
  }

  findGroupByName(name) {
    const { Groups } = this.currentData;
    return Groups.find(groupName => groupName.value === name);
  }



  async validateNewMember(object) {
    let memberId = 1;
    const loversIds = [];
    let newObject = {};
    const data = await this.readJsonFile();
    const { Family } = data;
    const { id: groupId } = this.findGroupByName(object.groupName);
    if (Family.length !== 0) {
      const owner = this.findFamilyMember(object.owner);
      if (owner.firstName === undefined && owner.lastName === undefined) {
        throw new Error('Your owner has not been found, try another one!');
      }
      const { lovers } = object;
      for (let i = 0; i < lovers.length; i++) {
        const lover = this.findFamilyMember(lovers[i]);
        console.log(lover);
        if (lover.firstName === undefined && lover.lastName === undefined) {
          throw new Error('Your lover has not been found, try another one!');
        }
        loversIds.push(lover.id);
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
    this.currentData.Family.push(newObject);
    await this.saveDataToJson();
    return newObject;
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
    if (memberIndex === -1) throw new Error('Could not find member with your id, try again!');
    Family.splice(memberIndex, 1);
    await this.saveDataToJson(newData);
    return 'You have successfully deleted a member';
  }
}

module.exports = Family;
