// core/roomManager.js

class RoomManager {
  constructor() {
    this.rooms = {}; // {roomID: {engine: ChaturajiEngine, players: []}}
  }

  createRoom(roomID) {
    this.rooms[roomID] = { engine: null, players: [] };
  }

  joinRoom(roomID, player) {
    if (!this.rooms[roomID]) throw "Room does not exist";
    this.rooms[roomID].players.push(player);
  }

  setEngine(roomID, engine) {
    if (!this.rooms[roomID]) throw "Room does not exist";
    this.rooms[roomID].engine = engine;
  }

  getRoomState(roomID) {
    if (!this.rooms[roomID]) throw "Room does not exist";
    return this.rooms[roomID].engine.getGameState();
  }
}

module.exports = RoomManager;
