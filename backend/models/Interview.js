const { interviews, generateId } = require("../data/mockDb");

class Interview {
  static async create(payload) {
    const interview = {
      id: generateId("i"),
      ...payload,
      createdAt: new Date().toISOString()
    };
    interviews.push(interview);
    return interview;
  }

  static async find(filter = {}) {
    return interviews.filter((interview) => Object.keys(filter).every((key) => interview[key] === filter[key]));
  }

  static async findById(id) {
    return interviews.find((interview) => interview.id === id);
  }

  static async updateById(id, updates) {
    const index = interviews.findIndex((interview) => interview.id === id);
    if (index < 0) return null;
    interviews[index] = { ...interviews[index], ...updates };
    return interviews[index];
  }
}

module.exports = Interview;
