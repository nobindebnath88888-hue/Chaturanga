// engines/rules.js

const ChaturajiRules = {
  boardSize: 8,

  setupPieces: function() {
    const pieces = [];

    // RED
    pieces.push({ type: "king", color: "red", x: 3, y: 0 });
    pieces.push({ type: "rook", color: "red", x: 0, y: 0 });
    pieces.push({ type: "knight", color: "red", x: 1, y: 0 });

    // BLUE
    pieces.push({ type: "king", color: "blue", x: 4, y: 0 });
    pieces.push({ type: "rook", color: "blue", x: 7, y: 0 });
    pieces.push({ type: "knight", color: "blue", x: 6, y: 0 });

    // GREEN
    pieces.push({ type: "king", color: "green", x: 4, y: 7 });
    pieces.push({ type: "rook", color: "green", x: 7, y: 7 });
    pieces.push({ type: "knight", color: "green", x: 6, y: 7 });

    // YELLOW
    pieces.push({ type: "king", color: "yellow", x: 3, y: 7 });
    pieces.push({ type: "rook", color: "yellow", x: 0, y: 7 });
    pieces.push({ type: "knight", color: "yellow", x: 1, y: 7 });

    return pieces;
  },

  isLegalMove: function(piece, newX, newY, board) {
    if (newX < 0 || newX >= this.boardSize || newY < 0 || newY >= this.boardSize)
      return false;
    return true;
  },

  checkWinner: function(players, pieces) {
    const alivePlayers = players.filter(player =>
      pieces.some(p => p.type === "king" && p.color === player.color)
    );
    if (alivePlayers.length === 1) return alivePlayers[0];
    return null;
  }
};

export default ChaturajiRules;
