const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const isSpeechSupported = 'webkitSpeechRecognition' in window;

if (!isSpeechSupported) {
  alert("⚠️ Voice recognition is not supported on this browser. Please use Google Chrome on a desktop or Android.");
}

let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

function loadChatHistory() {
  chatHistory.forEach(({ text, isUser }) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");

    const img = document.createElement("img");
    img.classList.add("profile-image");
    img.src = isUser ? "user.jpg" : "bot.jpg";
    img.alt = isUser ? "User" : "Bot";

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = text;

    messageDiv.appendChild(img);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}
loadChatHistory();

async function generateResponse(message) {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDzloRWOZYs-0Hor2gDoTec5K8tS5zFPk0", {
    method: "POST",
    headers: { 'Content-Type': "application/json" },
    body: JSON.stringify({
    contents: [{ parts: [{ text: message }] }]
    })
  });

  if (!response.ok) throw new Error("Failed to generate response");
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
return text.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, "\n\n").trim();
}

  function addMessage(text, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");

  const img = document.createElement('img');
  img.classList.add("profile-image");
  img.src = isUser ? 'user.jpg' : "bot.jpg";
  img.alt = isUser ? "User" : 'Bot';

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = text;

  messageDiv.appendChild(img);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  chatHistory.push({ text, isUser });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

async function handleUserInput() {
  const text = userInput.value.trim();
  if (text) {
    addMessage(text, true);
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;
    try {
      const reply = await generateResponse(text);
      addMessage(cleanMarkdown(reply), false);
    } catch (error) {
      console.error("Error:", error);
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      sendButton.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }
}

sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleUserInput();
  }
});


let isListening = false;
let recognition;
let audioContext, analyser, dataArray, animationId;
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

function resizeCanvasToDisplaySize(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function drawWaveform() {
  animationId = requestAnimationFrame(drawWaveform);
  resizeCanvasToDisplaySize(canvas);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barCount = 5;
  const gap = 1;
  const groupSize = Math.floor(dataArray.length / barCount);
  const totalGap = gap * (barCount - 1);
  const barWidth = Math.floor((canvas.width - totalGap) / barCount);
  const usedWidth = (barWidth + gap) * barCount - gap;
  const offsetX = Math.floor((canvas.width - usedWidth) / 2);

  for (let i = 0; i < barCount; i++) {
    const start = i * groupSize;
    const group = dataArray.slice(start, start + groupSize);
    const avg = group.reduce((a, b) => a + b, 0) / group.length;
    const barHeight = Math.min(avg * 1.8, canvas.height);
    const x = offsetX + i * (barWidth + gap);
    ctx.fillStyle = "lightblue";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
  }
}

async function startWaveform() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    canvas.classList.remove("hidden");
    drawWaveform();
  } catch (e) {
    console.error("Microphone access error:", e);
  }
}

function stopWaveform() {
  cancelAnimationFrame(animationId);
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  canvas.classList.add("hidden");
}

function voice() {
  const userInput = document.getElementById("user-input");
  const wave = canvas;
  const defaultPlaceholder = "Type your message...";
  const listeningPlaceholders = ["Listening", "Listening.", "Listening..", "Listening..."];
  let placeholderInterval = null;
  let placeholderIndex = 0;

  const startPlaceholderAnimation = () => {
    userInput.setAttribute("placeholder", listeningPlaceholders[0]);
    userInput.classList.add("listening-placeholder");
    placeholderInterval = setInterval(() => {
      placeholderIndex = (placeholderIndex + 1) % listeningPlaceholders.length;
      userInput.setAttribute("placeholder", listeningPlaceholders[placeholderIndex]);
    }, 500);
  };

  const stopPlaceholderAnimation = () => {
    clearInterval(placeholderInterval);
    placeholderInterval = null;
    placeholderIndex = 0;
    userInput.classList.remove("listening-placeholder");
    userInput.setAttribute("placeholder", defaultPlaceholder);
  };

  if (isListening) {
    if (recognition) recognition.stop();
    stopPlaceholderAnimation();
    stopWaveform();
    wave.classList.add("hidden");
    isListening = false;
    return;
  }

  // Start listening
  isListening = true;
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  startPlaceholderAnimation();
  startWaveform();

  recognition.start();

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.trim();
    console.log("Recognized:", transcript);
    if (transcript.length > 0) {
      userInput.value = transcript;
      setTimeout(() => {
        handleUserInput();
        stopPlaceholderAnimation();
        stopWaveform();
        wave.classList.add("hidden");
        isListening = false;
      }, 100);
    } else {
      stopPlaceholderAnimation();
      stopWaveform();
      wave.classList.add("hidden");
      isListening = false;
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech error:", event.error);
    stopPlaceholderAnimation();
    stopWaveform();
    wave.classList.add("hidden");
    isListening = false;
  };

  recognition.onend = function () {
    if (isListening) {
      stopPlaceholderAnimation();
      stopWaveform();
      wave.classList.add("hidden");
      isListening = false;
    }
  };
};
  recognition.onend = () => { stopAll(); handleUserInput(); };
  recognition.onerror = () => stopAll();

const themeToggle = document.getElementById("theme-toggle");
if (localStorage.getItem("theme") === "light") {
  document.documentElement.classList.add("light-mode");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  const isLight = themeToggle.checked;
  document.documentElement.classList.toggle("light-mode", isLight);
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

document.getElementById("clear-history").addEventListener("click", () => {
  if (confirm("Clear all chat history?")) {
    localStorage.removeItem("chatHistory");
    chatMessages.innerHTML = '';
    chatHistory = [];
  }
});

window.addEventListener("DOMContentLoaded", () => {
  if (!isSpeechSupported) {
    const micIcon = document.querySelector(".fa-microphone");
    if (micIcon) micIcon.style.display = "none";
  }
});


// Copyright © 2025 all rights reserved by Aman Raj & Mrinal Thakur.
// Developed by "Aman Raj & Mrinal Thakur".
// API used for this ChatBOT is Google's "Gemini 1.5 Flash".
// The credits of designing and web development goes to Aman Raj.
// The credits of API intigration & JavaScript goes to Mrinal Thakur.