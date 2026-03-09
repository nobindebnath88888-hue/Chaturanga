// engines/chaturajiEngine.js

import Rules from "./rules.js";

export default class ChaturajiEngine {
  constructor() {
    this.players = [
      { name: "Red", color: "red", alive: true },
      { name: "Blue", color: "blue", alive: true },
      { name: "Green", color: "green", alive: true },
      { name: "Yellow", color: "yellow", alive: true },
    ];
    this.currentPlayerIndex = 0;
    this.boardSize = Rules.boardSize;
    this.board = this.createEmptyBoard(this.boardSize);
    this.pieces = Rules.setupPieces();
    this.winner = null;
  }

  createEmptyBoard(size) {
    return Array(size).fill(null).map(() => Array(size).fill(null));
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  movePiece(piece, newX, newY) {
    if (!Rules.isLegalMove(piece, newX, newY, this.board)) {
      throw "Illegal move";
    }

    const target = this.pieces.find(p => p.x === newX && p.y === newY);
    if (target) this.pieces = this.pieces.filter(p => p !== target);

    piece.x = newX;
    piece.y = newY;

    this.checkEliminations();
    this.nextTurn();
  }

  nextTurn() {
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    } while (!this.players[this.currentPlayerIndex].alive);
  }

  checkEliminations() {
    this.players.forEach(player => {
      const kingExists = this.pieces.some(p => p.type === "king" && p.color === player.color);
      if (!kingExists) player.alive = false;
    });

    const winner = Rules.checkWinner(this.players, this.pieces);
    if (winner) this.winner = winner;
  }

  getGameState() {
    return {
      board: this.board,
      pieces: this.pieces,
      players: this.players,
      currentPlayer: this.getCurrentPlayer(),
      winner: this.winner
    };
  }
}
