const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
async function generateResponse(_0x5b17bf) {
  const _0x1b0bee = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDzloRWOZYs-0Hor2gDoTec5K8tS5zFPk0", {
    'method': "POST",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': JSON.stringify({
      'contents': [{
        'parts': [{
          'text': _0x5b17bf
        }]
      }]
    })
  });
  if (!_0x1b0bee.ok) {
    throw new Error("Failed to generate response");
  }
  const _0x5af0dc = await _0x1b0bee.json();
  return _0x5af0dc.candidates[0x0].content.parts[0x0].text;
}
function cleanMarkdown(_0x380c3a) {
  return _0x380c3a.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, "\n\n").trim();
}
function addMessage(_0x501bb0, _0x144ff7) {
  const _0x455bce = document.createElement("div");
  _0x455bce.classList.add("message");
  _0x455bce.classList.add(_0x144ff7 ? "user-message" : "bot-message");
  const _0x3dc086 = document.createElement('img');
  _0x3dc086.classList.add("profile-image");
  _0x3dc086.src = _0x144ff7 ? 'user.jpg' : "bot.jpg";
  _0x3dc086.alt = _0x144ff7 ? "User" : 'Bot';
  const _0x385c55 = document.createElement("div");
  _0x385c55.classList.add("message-content");
  _0x385c55.textContent = _0x501bb0;
  _0x455bce.appendChild(_0x3dc086);
  _0x455bce.appendChild(_0x385c55);
  chatMessages.appendChild(_0x455bce);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
async function handleUserInput() {
  const _0x3ec46d = userInput.value.trim();
  if (_0x3ec46d) {
    addMessage(_0x3ec46d, true);
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;
    try {
      const _0x30965c = await generateResponse(_0x3ec46d);
      addMessage(_0x30965c.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, "\n\n").trim(), false);
    } catch (_0x289c2c) {
      console.error("Error:", _0x289c2c);
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      sendButton.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }
}

sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", _0x394236 => {
  if (_0x394236.key === "Enter" && !_0x394236.shiftKey) {
    _0x394236.preventDefault();
    handleUserInput();
  }
});

  function voice() {
  const userInput = document.getElementById("user-input");
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "en-GB";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = function () {
    userInput.placeholder = "Listening...";
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
  };

  recognition.onend = function () {
    userInput.placeholder = "Type your message...";
    handleUserInput();
  };

  recognition.onerror = function () {
    userInput.placeholder = "Type your message...";
  };

  recognition.start();
}


// API used for this ChatBOT is Google's "Gemini 2.0 Flash".
// Developed by "Aman Raj & Mrinal Thakur".
// The credits of designing and web development of the ChatBOT goes to Aman Raj.
// The credits of AI interface of the ChatBOT & JavaScript development goes to Mrinal Thakur.
// Copyright © 2025 all rights reserved by Aman Raj & Mrinal Thakur.