// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import ChaturajiEngine from "./engines/chaturajiEngine.js";
import renderBoard from "./ui/chessBoard.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCOd-enBXsbvSdX3q_j4DVQDk1-7XMZyUM",
  authDomain: "chaturanga-25b8c.firebaseapp.com",
  projectId: "chaturanga-25b8c",
  storageBucket: "chaturanga-25b8c.firebasestorage.app",
  messagingSenderId: "221727464973",
  appId: "1:221727464973:web:f27ad5643380b2718e7f44",
  measurementId: "G-035NB3F386"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const engine = new ChaturajiEngine();

// Create a room
const roomID = prompt("Enter room ID to create/join:");
const roomRef = ref(db, `rooms/${roomID}`);

// Initialize room if first
set(roomRef, { gameState: engine.getGameState() });

// Listen for updates
onValue(roomRef, snapshot => {
  const data = snapshot.val();
  if (data) renderBoard(data.gameState);
});

// Move piece example: click simulation
window.movePiece = function(pieceIndex, newX, newY) {
  try {
    const piece = engine.pieces[pieceIndex];
    engine.movePiece(piece, newX, newY);
    set(roomRef, { gameState: engine.getGameState() });
  } catch (err) {
    console.log("Move error:", err);
  }
};
