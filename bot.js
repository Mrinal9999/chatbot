const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
function loadChatHistory() {
  chatHistory.forEach(({
    text: _0x47f0e7,
    isUser: _0x27f8f4
  }) => {
    const _0x1d89b1 = document.createElement("div");
    _0x1d89b1.classList.add("message", _0x27f8f4 ? "user-message" : "bot-message");
    const _0x6b6c99 = document.createElement('img');
    _0x6b6c99.classList.add('profile-image');
    _0x6b6c99.src = _0x27f8f4 ? "user.jpg" : "bot.jpg";
    _0x6b6c99.alt = _0x27f8f4 ? "User" : "Bot";
    const _0xdc1b19 = document.createElement('div');
    _0xdc1b19.classList.add("message-content");
    _0xdc1b19.textContent = _0x47f0e7;
    _0x1d89b1.appendChild(_0x6b6c99);
    _0x1d89b1.appendChild(_0xdc1b19);
    chatMessages.appendChild(_0x1d89b1);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
loadChatHistory();
async function generateResponse(_0x3277dc) {
  const _0x26aad4 = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDzloRWOZYs-0Hor2gDoTec5K8tS5zFPk0", {
    'method': "POST",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': JSON.stringify({
      'contents': [{
        'parts': [{
          'text': _0x3277dc
        }]
      }]
    })
  });
  if (!_0x26aad4.ok) {
    throw new Error("Failed to generate response");
  }
  const _0x3bdf06 = await _0x26aad4.json();
  return _0x3bdf06.candidates[0x0].content.parts[0x0].text;
}
function cleanMarkdown(_0x12f90d) {
  return _0x12f90d.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, "\n\n").trim();
}
function addMessage(_0x80f561, _0x49dafb) {
  const _0x24d5d4 = document.createElement("div");
  _0x24d5d4.classList.add("message", _0x49dafb ? "user-message" : "bot-message");
  const _0x352aad = document.createElement("img");
  _0x352aad.classList.add('profile-image');
  _0x352aad.src = _0x49dafb ? 'user.jpg' : "bot.jpg";
  _0x352aad.alt = _0x49dafb ? "User" : "Bot";
  const _0x38b21e = document.createElement("div");
  _0x38b21e.classList.add("message-content");
  _0x38b21e.textContent = _0x80f561;
  _0x24d5d4.appendChild(_0x352aad);
  _0x24d5d4.appendChild(_0x38b21e);
  chatMessages.appendChild(_0x24d5d4);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatHistory.push({
    'text': _0x80f561,
    'isUser': _0x49dafb
  });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}
async function handleUserInput() {
  const _0x497ad5 = userInput.value.trim();
  if (_0x497ad5) {
    addMessage(_0x497ad5, true);
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;
    try {
      const _0x17c526 = await generateResponse(_0x497ad5);
      addMessage(_0x17c526.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, "\n\n").trim(), false);
    } catch (_0x248ef3) {
      console.error("Error:", _0x248ef3);
      addMessage("Sorry, I encountered an error. Please try again.", false);
    } finally {
      sendButton.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }
}
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", _0x46c078 => {
  if (_0x46c078.key === "Enter" && !_0x46c078.shiftKey) {
    _0x46c078.preventDefault();
    handleUserInput();
  }
});
function voice() {
  const _0x47a7b2 = document.getElementById("audio-wave");
  const _0x4ab1db = document.getElementById("user-input");
  const _0x504917 = ["Listening", "Listening.", "Listening..", 'Listening...'];
  let _0x5ab6ea = null;
  let _0x1448bc = 0x0;
  const _0x2195f9 = () => {
    _0x4ab1db.setAttribute('placeholder', _0x504917[0x0]);
    _0x4ab1db.classList.add('listening-placeholder');
    _0x5ab6ea = setInterval(() => {
      _0x1448bc = (_0x1448bc + 0x1) % _0x504917.length;
      _0x4ab1db.setAttribute("placeholder", _0x504917[_0x1448bc]);
    }, 0x1f4);
  };
  const _0x35029f = () => {
    clearInterval(_0x5ab6ea);
    _0x5ab6ea = null;
    _0x1448bc = 0x0;
    _0x4ab1db.classList.remove('listening-placeholder');
    _0x4ab1db.setAttribute("placeholder", '');
    setTimeout(() => {
      _0x4ab1db.setAttribute('placeholder', "Type your message...");
    }, 0x14);
  };
  const _0x189376 = new webkitSpeechRecognition();
  _0x189376.lang = "en-GB";
  _0x189376.interimResults = false;
  _0x189376.continuous = false;
  _0x189376.onstart = function () {
    _0x2195f9();
    _0x47a7b2.classList.remove('hidden');
  };
  _0x189376.onresult = function (_0x46400f) {
    const _0x376528 = _0x46400f.results[0x0][0x0].transcript;
    _0x4ab1db.value = _0x376528;
  };
  _0x189376.onend = function () {
    _0x35029f();
    _0x47a7b2.classList.add("hidden");
    handleUserInput();
  };
  _0x189376.onerror = function () {
    _0x35029f();
    _0x47a7b2.classList.add("hidden");
  };
  _0x189376.start();
}
const themeToggle = document.getElementById("theme-toggle");
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.add("light-mode");
  themeToggle.checked = true;
}
themeToggle.addEventListener('change', () => {
  const _0xb0975d = themeToggle.checked;
  document.documentElement.classList.toggle("light-mode", _0xb0975d);
  localStorage.setItem("theme", _0xb0975d ? "light" : "dark");
});
document.getElementById("clear-history").addEventListener("click", () => {
  if (confirm("Clear all chat history?")) {
    localStorage.removeItem('chatHistory');
    chatMessages.innerHTML = '';
    chatHistory = [];
  }
});