// core/playerManager.js

class PlayerManager {
  constructor() {
    this.players = [];
  }

  addPlayer(name, color) {
    const player = { name, color, alive: true };
    this.players.push(player);
    return player;
  }

  removePlayer(color) {
    this.players = this.players.filter(p => p.color !== color);
  }

  getAlivePlayers() {
    return this.players.filter(p => p.alive);
  }
}

module.exports = PlayerManager;
