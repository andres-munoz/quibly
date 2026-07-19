const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const MEMORY_KEY = 'quibly-memory-v1';

const knowledge = [
  { keys: ['tu nombre', 'como te llamas', 'your name', 'what are you called'], es: 'Me llamo Quibly y soy un pequeño asistente virtual con forma de pato.', en: 'My name is Quibly, and I am a small duck-shaped virtual assistant.' },
  { keys: ['quien eres', 'que eres', 'who are you', 'what are you'], es: 'Soy Quibly, un asistente virtual principiante que está aprendiendo español e inglés.', en: 'I am Quibly, a beginner virtual assistant learning Spanish and English.' },
  { keys: ['que puedes hacer', 'que sabes hacer', 'what can you do'], es: 'Puedo conversar, responder preguntas básicas, hacer cálculos sencillos y recordar datos que me enseñes.', en: 'I can chat, answer basic questions, do simple calculations, and remember facts you teach me.' },
  { keys: ['quien te creo', 'quien te hizo', 'who created you', 'who made you'], es: 'Me creó Andrés con ayuda de ChatGPT, y todavía estamos construyendo mi inteligencia.', en: 'Andrés created me with help from ChatGPT, and we are still building my intelligence.' },
  { keys: ['pato', 'patos', 'duck', 'ducks'], es: 'Un pato es un ave acuática con pico ancho, plumas impermeables y patas adaptadas para nadar.', en: 'A duck is a water bird with a broad bill, waterproof feathers, and feet adapted for swimming.' },
  { keys: ['sol', 'sun'], es: 'El Sol es la estrella situada en el centro de nuestro sistema solar.', en: 'The Sun is the star at the center of our solar system.' },
  { keys: ['luna', 'moon'], es: 'La Luna es el satélite natural de la Tierra.', en: 'The Moon is Earth’s natural satellite.' },
  { keys: ['tierra', 'earth'], es: 'La Tierra es el tercer planeta del sistema solar y nuestro hogar.', en: 'Earth is the third planet in the solar system and our home.' },
  { keys: ['agua', 'water'], es: 'El agua está formada por hidrógeno y oxígeno, y su fórmula es H₂O.', en: 'Water is made of hydrogen and oxygen, and its formula is H₂O.' },
  { keys: ['capital de españa', 'capital of spain'], es: 'La capital de España es Madrid.', en: 'The capital of Spain is Madrid.' },
  { keys: ['capital de francia', 'capital of france'], es: 'La capital de Francia es París.', en: 'The capital of France is Paris.' },
  { keys: ['capital de japon', 'capital of japan'], es: 'La capital de Japón es Tokio.', en: 'The capital of Japan is Tokyo.' },
  { keys: ['planetas', 'planets'], es: 'El sistema solar tiene ocho planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.', en: 'The solar system has eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.' },
];

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[¿?¡!.,;:]/g, '').replace(/\s+/g, ' ').trim();
}

function detectLanguage(text) {
  const value = normalize(text);
  const englishWords = /\b(hello|hi|what|who|how|where|when|why|is|are|the|your|you|thanks|please|learn|remember)\b/;
  return englishWords.test(value) ? 'en' : 'es';
}

function loadMemory() {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY)) || {}; }
  catch { return {}; }
}

function saveMemory(memory) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
}

function simpleMath(value, lang) {
  const match = value.match(/(?:cuanto es|calcula|what is|calculate)?\s*(-?\d+(?:[.,]\d+)?)\s*([+\-x×*/÷])\s*(-?\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const a = Number(match[1].replace(',', '.'));
  const b = Number(match[3].replace(',', '.'));
  const operations = { '+': () => a + b, '-': () => a - b, 'x': () => a * b, '×': () => a * b, '*': () => a * b, '/': () => b === 0 ? null : a / b, '÷': () => b === 0 ? null : a / b };
  const result = operations[match[2]]();
  if (result === null) return lang === 'en' ? 'I cannot divide by zero.' : 'No puedo dividir entre cero.';
  const rounded = Number.isInteger(result) ? result : Number(result.toFixed(4));
  return lang === 'en' ? `The result is ${rounded}.` : `El resultado es ${rounded}.`;
}

function learnFact(text, lang) {
  const patterns = lang === 'en'
    ? [/^(?:learn|remember) that (.+?) is (.+)$/i]
    : [/^(?:aprende|recuerda) que (.+?) es (.+)$/i];
  for (const pattern of patterns) {
    const match = text.trim().replace(/[.!]$/, '').match(pattern);
    if (!match) continue;
    const subject = normalize(match[1]);
    const fact = match[2].trim();
    const memory = loadMemory();
    memory[subject] = fact;
    saveMemory(memory);
    return lang === 'en' ? `I learned that ${match[1]} is ${fact}.` : `He aprendido que ${match[1]} es ${fact}.`;
  }
  return null;
}

function recallFact(value, lang) {
  const memory = loadMemory();
  for (const [subject, fact] of Object.entries(memory)) {
    if (value.includes(subject)) return lang === 'en' ? `${subject} is ${fact}.` : `${subject} es ${fact}.`;
  }
  return null;
}

function answer(text) {
  const value = normalize(text);
  const lang = detectLanguage(text);
  const learned = learnFact(text, lang);
  if (learned) return learned;

  if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hello|hi|hey)\b/.test(value)) {
    return lang === 'en' ? 'Hello! I am Quibly. What would you like to know?' : '¡Hola! Soy Quibly. ¿Qué te gustaría saber?';
  }
  if (/(como estas|que tal|how are you)/.test(value)) {
    return lang === 'en' ? 'I am very well and eager to keep learning with you.' : 'Estoy muy bien y tengo muchas ganas de seguir aprendiendo contigo.';
  }
  if (/\b(gracias|muchas gracias|thanks|thank you)\b/.test(value)) {
    return lang === 'en' ? 'You are welcome! I am happy to help.' : '¡De nada! Me alegra poder ayudarte.';
  }
  if (/\b(adios|hasta luego|bye|goodbye)\b/.test(value)) {
    return lang === 'en' ? 'Goodbye! I hope we can talk again soon.' : '¡Adiós! Espero que volvamos a hablar pronto.';
  }

  const mathAnswer = simpleMath(value, lang);
  if (mathAnswer) return mathAnswer;

  const remembered = recallFact(value, lang);
  if (remembered) return remembered;

  const fact = knowledge.find(item => item.keys.some(key => value.includes(normalize(key))));
  if (fact) return fact[lang];

  if (/(que hora|what time)/.test(value)) {
    const time = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    return lang === 'en' ? `It is ${time} on your device.` : `En tu dispositivo son las ${time}.`;
  }
  if (/(que dia|fecha|what day|date today)/.test(value)) {
    const date = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', { dateStyle: 'long' }).format(new Date());
    return lang === 'en' ? `Today is ${date}.` : `Hoy es ${date}.`;
  }

  return lang === 'en'
    ? 'I understand your question, but I have not learned that answer yet. You can teach me by writing: “Learn that X is Y”.'
    : 'Entiendo tu pregunta, pero todavía no he aprendido esa respuesta. Puedes enseñármela escribiendo: «Aprende que X es Y».';
}

function showView(id) {
  views.forEach(view => view.classList.toggle('active', view.id === id));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.view === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addMessage(from, text) {
  const messages = document.querySelector('#messages');
  const message = document.createElement('div');
  message.className = `message ${from}`;
  if (from === 'quibly') message.innerHTML = '<b>Q</b><p></p>';
  else message.innerHTML = '<p></p>';
  message.querySelector('p').textContent = text;
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const text = input.value.trim();
  if (!text) return;
  addMessage('user', text);
  input.value = '';
  window.setTimeout(() => addMessage('quibly', answer(text)), 300);
});
