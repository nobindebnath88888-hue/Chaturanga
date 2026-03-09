import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import ChaturajiEngine from "./engines/chaturajiEngine.js";
import renderBoard from "./ui/chessBoard.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCOd-enBXsbvSdX3q_j4DVQDk1-7XMZyUM",
  authDomain: "chaturanga-25b8c.firebaseapp.com",
  projectId: "chaturanga-25b8c",
  storageBucket: "chaturanga-25b8c.firebasestorage.app",
  messagingSenderId: "221727464973",
  appId: "1:2217274643380b2718e7f44",
  measurementId: "G-035NB3F386"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const engine = new ChaturajiEngine();

// Create or join room
const roomID = prompt("Enter room ID to create/join:");
const roomRef = ref(db, `rooms/${roomID}`);
set(roomRef, { gameState: engine.getGameState() });

// Function to handle moves
function handleMove(piece, newX, newY) {
  try {
    // Only allow move if piece color matches current player
    if (piece.color !== engine.getCurrentPlayer().color) return;

    engine.movePiece(piece, newX, newY);
    set(roomRef, { gameState: engine.getGameState() });
  } catch (err) {
    console.log("Move error:", err);
  }
}

// Listen for Firebase updates
onValue(roomRef, snapshot => {
  const data = snapshot.val();
  if (data) renderBoard(data.gameState, handleMove);
});
