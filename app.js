const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');

function showView(id) {
  views.forEach(view => view.classList.toggle('active', view.id === id));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.view === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const text = input.value.trim();
  if (!text) return;
  const messages = document.querySelector('#messages');
  messages.insertAdjacentHTML('beforeend', `<div class="message user"><p></p></div>`);
  messages.lastElementChild.querySelector('p').textContent = text;
  const reply = document.createElement('div');
  reply.className = 'message quibly';
  reply.innerHTML = '<b>Q</b><p>Aún soy una IA pequeñita, pero he recibido tu mensaje. ¡Pronto podré entender mucho más!</p>';
  messages.append(reply);
  input.value = '';
  messages.scrollTop = messages.scrollHeight;
});
