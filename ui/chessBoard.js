let selectedPiece = null;

export default function renderBoard(gameState, moveCallback) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  const size = gameState.board.length;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");

      const piece = gameState.pieces.find(p => p.x === x && p.y === y);
      if (piece) {
        cellDiv.textContent = piece.type[0].toUpperCase();
        cellDiv.classList.add(piece.color);

        // Only allow current player to select their piece
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
          moveCallback(selectedPiece, x, y);
          selectedPiece = null;
          clearHighlights(boardDiv);
        }
      });

      boardDiv.appendChild(cellDiv);
    }
  }

  // Show current player
  console.log("Current Player:", gameState.currentPlayer.color);
  if (gameState.winner) {
    alert(`Winner: ${gameState.winner.color}`);
  }
}

// Highlight selected cell
function highlightSelectedCell(x, y, boardDiv) {
  clearHighlights(boardDiv);
  const index = y * 8 + x;
  boardDiv.children[index].style.border = "3px solid orange";
}

function clearHighlights(boardDiv) {
  for (let i = 0; i < boardDiv.children.length; i++) {
    boardDiv.children[i].style.border = "1px solid #333";
  }
}
