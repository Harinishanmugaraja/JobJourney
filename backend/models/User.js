const { users, generateId } = require("../data/mockDb");

class User {
  static async create(payload) {
    const user = {
      id: generateId("u"),
      ...payload,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    return user;
  }

  static async findOne(filter) {
    return users.find((user) => Object.keys(filter).every((key) => user[key] === filter[key]));
  }

  static async find(filter = {}) {
    return users.filter((user) => Object.keys(filter).every((key) => user[key] === filter[key]));
  }

  static async findById(id) {
    return users.find((user) => user.id === id);
  }

  static sanitize(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = User;
