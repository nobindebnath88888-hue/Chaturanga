let selectedPiece = null;
let lastMove = null;

export default function renderBoard(gameState, moveCallback) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  // Display current player turn
  let turnIndicator = document.getElementById("turn-indicator");
  if (!turnIndicator) {
    turnIndicator = document.createElement("div");
    turnIndicator.id = "turn-indicator";
    turnIndicator.style.marginBottom = "10px";
    turnIndicator.style.fontWeight = "bold";
    turnIndicator.style.fontSize = "18px";
    boardDiv.parentNode.insertBefore(turnIndicator, boardDiv);
  }
  turnIndicator.textContent = `Current Turn: ${gameState.currentPlayer.color.toUpperCase()}`;

  const size = gameState.board.length;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");

      // Dark/Light square
      if ((x + y) % 2 === 0) cellDiv.classList.add("white-1e1d7");
      else cellDiv.classList.add("black-3c85d");

      // Highlight last move
      if (lastMove && lastMove.from && lastMove.to) {
        if ((x === lastMove.from.x && y === lastMove.from.y) ||
            (x === lastMove.to.x && y === lastMove.to.y)) {
          cellDiv.classList.add("highlight-last-move");
        }
      }

      // Place piece
      const piece = gameState.pieces.find(p => p.x === x && p.y === y);
      if (piece) {
        cellDiv.textContent = piece.type[0].toUpperCase();
        cellDiv.style.color = getColorHex(piece.color);
        cellDiv.style.fontWeight = "bold";
        cellDiv.style.fontSize = "22px";

        // Only current player pieces are clickable
        if (piece.color === gameState.currentPlayer.color) {
          cellDiv.style.cursor = "pointer";
          cellDiv.addEventListener("click", () => {
            selectedPiece = piece;
            highlightSelectedCell(x, y, boardDiv);
          });
        }
      }

      // Click empty cell to move selected piece
      cellDiv.addEventListener("click", () => {
        if (selectedPiece) {
          const moveData = { from: { x: selectedPiece.x, y: selectedPiece.y }, to: { x, y } };
          lastMove = moveData;
          moveCallback(selectedPiece, x, y);
          selectedPiece = null;
          clearHighlights(boardDiv);
        }
      });

      boardDiv.appendChild(cellDiv);
    }
  }
}

// Highlight selected cell
function highlightSelectedCell(x, y, boardDiv) {
  clearHighlights(boardDiv);
  const index = y * 8 + x;
  boardDiv.children[index].classList.add("highlight-selected");
}

// Clear highlights
function clearHighlights(boardDiv) {
  for (let i = 0; i < boardDiv.children.length; i++) {
    boardDiv.children[i].classList.remove("highlight-selected");
    boardDiv.children[i].classList.remove("highlight-last-move");
  }
}

// Map color names to hex (for better visibility)
function getColorHex(color) {
  switch(color) {
    case "red": return "#f85149";
    case "blue": return "#388bfd";
    case "green": return "#4ade80";
    case "yellow": return "#facc15";
    default: return "#fff";
  }
}
