const targetDate = new Date('2026-06-01T00:00:00+01:00'); // Irlanda

const audio = document.getElementById('heartbeat');
const notifyBtn = document.getElementById('notifyBtn');

const phrases = [
  "Lindo & Linda 🇨🇴 — Nuestro día favorito ❤️ te quiero tanto!",
  "Cada latido nos acerca más, L&L 💓",
  "Nuestro amor no conoce distancia — te quiero tanto!",
  "Un día menos para abrazarnos fuerte 🤍",
  "L&L, unidos por cada segundo que pasa ⏳",
  "Ogni giorno più vicini, Lindo e Linda 💖",
  "Nuestro reloj late por nosotros 💓",
  "Cada segundo cuenta cuando es contigo, Linda 🤍",
  "Lindo & Linda — Dos corazones, un destino ❤️",
  "Nuestro futuro empieza en cada latido 💓",
  "te quiero tanto, hoy, mañana y siempre 💖",
  "L&L — Nuestro amor también sabe contar segundos ⏰",
  "Nuestro tiempo juntos vale infinito ❤️",
  "Ogni secondo con te è casa 🤍",
  "Lindo y Linda — Nuestro reloj late al mismo ritmo 💓"
];

function rotatePhrase() {
  const index = new Date().getDate() % phrases.length;
  const el = document.getElementById('dailyPhrase');
  if (el) el.textContent = phrases[index];
}

function showSpecialMessage() {
  const box = document.querySelector('.countdown');
  if (!box) return;
  box.innerHTML = `
    <div style="grid-column: span 5; font-size:1.2rem;">
      💖 Hoy es nuestro día, Lindo & Linda 💖<br/>
      te quiero tanto!<br/><br/>
      Oggi è il nostro giorno ❤️
    </div>
  `;
}

function updateCountdown() {
  const now = new Date();
  if (now >= targetDate) {
    showSpecialMessage();
    return;
  }

  let years = targetDate.getFullYear() - now.getFullYear();
  let months = targetDate.getMonth() - now.getMonth();
  let days = targetDate.getDate() - now.getDate();
  let hours = targetDate.getHours() - now.getHours();
  let minutes = targetDate.getMinutes() - now.getMinutes();
  let seconds = targetDate.getSeconds() - now.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    days += prevMonth;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const totalMonths = years * 12 + months;

  document.getElementById('months').textContent = totalMonths;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

function playHeartbeatOncePerDay() {
  const today = new Date().toDateString();
  const lastPlayed = localStorage.getItem('heartbeatPlayed');
  if (lastPlayed !== today) {
    audio.volume = 0.25;
    audio.play().catch(() => {});
    localStorage.setItem('heartbeatPlayed', today);
  }
}

async function enableNotifications() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const reg = await navigator.serviceWorker.ready;
  reg.showNotification('L&L 💖', {
    body: 'Un día menos para nuestro día favorito — te quiero tanto!',
    icon: 'images/logo.png',
    badge: 'images/logo.png'
  });

  notifyBtn.textContent = 'Recordatorios activados 💖';
  notifyBtn.disabled = true;
}

notifyBtn?.addEventListener('click', enableNotifications);

rotatePhrase();
updateCountdown();
setInterval(updateCountdown, 1000);
setTimeout(playHeartbeatOncePerDay, 300);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(console.error);
}
