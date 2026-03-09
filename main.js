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
  appId: "1:2217274643380b2718e7f44",
  measurementId: "G-035NB3F386"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const engine = new ChaturajiEngine();

let playerColor = null;
let roomID = null;

// DOM Elements
const joinBtn = document.getElementById("joinBtn");
const resetBtn = document.getElementById("resetBtn");
const chatDiv = document.getElementById("chat-messages");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const moveList = document.getElementById("move-list");

// Join Room
joinBtn.addEventListener("click", () => {
  roomID = prompt("Enter Room ID:");
  const roomRef = ref(db, `rooms/${roomID}`);

  // Assign player color
  onValue(roomRef, snapshot => {
    const room = snapshot.val() || { players: {}, gameState: engine.getGameState(), chat: {} };
    const colors = ["red","blue","green","yellow"];

    if (!playerColor) {
      for (const c of colors) {
        if (!room.players[c]) { playerColor = c; break; }
      }
      if (!playerColor) return alert("Room full!");
    }

    room.players[playerColor] = { name: `Player-${playerColor}`, color: playerColor };
    set(ref(db, `rooms/${roomID}/players`), room.players);

    if (!room.gameState) set(ref(db, `rooms/${roomID}/gameState`), engine.getGameState());

    renderBoard(room.gameState, handleMove);
    renderChat(room.chat || {});
    renderMoveList(room.gameState);
  });

  // Listen to chat updates
  const chatRef = ref(db, `rooms/${roomID}/chat`);
  onValue(chatRef, snapshot => {
    const chatData = snapshot.val() || {};
    renderChat(chatData);
  });
});

// Reset Game
resetBtn.addEventListener("click", () => {
  if (!roomID) return;
  engine.pieces = engine.constructor().pieces;
  engine.players.forEach(p => p.alive = true);
  set(ref(db, `rooms/${roomID}/gameState`), engine.getGameState());
});

// Send chat
sendChat.addEventListener("click", () => {
  if (!roomID || !playerColor) return;
  const msg = chatInput.value.trim();
  if (!msg) return;
  const chatRef = ref(db, `rooms/${roomID}/chat`);
  push(chatRef, { player: playerColor, message: msg });
  chatInput.value = "";
});

// Handle Moves
function handleMove(piece, newX, newY) {
  if (!playerColor || piece.color !== playerColor) return;
  try {
    engine.movePiece(piece, newX, newY);
    set(ref(db, `rooms/${roomID}/gameState`), engine.getGameState());
    renderMoveList(engine.getGameState());
  } catch (err) { console.log("Move error:", err); }
}

// Render chat messages
function renderChat(chatData) {
  chatDiv.innerHTML = "";
  Object.keys(chatData).forEach(k => {
    const msg = chatData[k];
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg";
    msgDiv.textContent = `${msg.player}: ${msg.message}`;
    chatDiv.appendChild(msgDiv);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Render move history
function renderMoveList(gameState) {
  moveList.innerHTML = "";
  gameState.pieces.forEach(p => {
    const div = document.createElement("div");
    div.textContent = `${p.color} ${p.type} at (${p.x},${p.y})`;
    moveList.appendChild(div);
  });
}
