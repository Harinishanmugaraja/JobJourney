const { applications, generateId } = require("../data/mockDb");

class Application {
  static async create(payload) {
    const application = {
      id: generateId("a"),
      ...payload,
      createdAt: new Date().toISOString()
    };
    applications.push(application);
    return application;
  }

  static async find(filter = {}) {
    return applications.filter((application) => Object.keys(filter).every((key) => application[key] === filter[key]));
  }

  static async findById(id) {
    return applications.find((application) => application.id === id);
  }

  static async updateById(id, updates) {
    const index = applications.findIndex((application) => application.id === id);
    if (index < 0) return null;
    applications[index] = { ...applications[index], ...updates };
    return applications[index];
  }

  static async deleteById(id) {
    const index = applications.findIndex((application) => application.id === id);
    if (index < 0) return null;
    const [removed] = applications.splice(index, 1);
    return removed;
  }
}

module.exports = Application;
