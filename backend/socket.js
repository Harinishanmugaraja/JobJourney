let socketServer;

const getUserRoom = (userId) => `user:${userId}`;

const setSocketServer = (io) => {
  socketServer = io;
};

const getSocketServer = () => socketServer;

const emitToUser = (userId, eventName, payload) => {
  if (!socketServer || !userId) return;
  socketServer.to(getUserRoom(userId)).emit(eventName, payload);
};

module.exports = {
  emitToUser,
  getSocketServer,
  getUserRoom,
  setSocketServer
};
