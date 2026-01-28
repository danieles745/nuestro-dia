const targetDate = new Date("2026-06-01T00:00:00+01:00"); // Irlanda

const countdownEl = document.getElementById("countdown");
const quoteEl = document.getElementById("dailyQuote");
const notifyBtn = document.getElementById("notifyBtn");
const themeBtn = document.getElementById("themeBtn");
const heartbeatSound = document.getElementById("heartbeatSound");
const container = document.querySelector(".container");

// 💖 FRASES ROMÁNTICAS ROTATIVAS — L&L
const romanticQuotes = [
  {
    co: "Nuestro día favorito, con amor — Lindo & Linda ❤️",
    it: "Il nostro giorno preferito, con amore — Lindo & Linda ❤️"
  },
  {
    co: "Cada segundo que pasa acerca a Lindo un poco más a Linda.",
    it: "Ogni secondo che passa avvicina Lindo un po’ di più a Linda."
  },
  {
    co: "La distancia no separa corazones que laten juntos — L&L.",
    it: "La distanza non separa cuori che battono insieme — L&L."
  },
  {
    co: "Amarte, Linda, es la forma favorita de existir de Lindo.",
    it: "Amarti, Linda, è il modo preferito di esistere di Lindo."
  },
  {
    co: "Nuestro amor sabe esperar, porque sabe llegar — L&L.",
    it: "Il nostro amore sa aspettare, perché sa arrivare — L&L."
  },
  {
    co: "Dos almas, un destino, un día inevitable — Lindo & Linda.",
    it: "Due anime, un destino, un giorno inevitabile — Lindo & Linda."
  },
  {
    co: "Incluso lejos, Linda siempre está en el corazón de Lindo ❤️",
    it: "Anche lontani, Linda è sempre nel cuore di Lindo ❤️"
  },
  {
    co: "Cada latido de Lindo es un paso más hacia Linda.",
    it: "Ogni battito di Lindo è un passo in più verso Linda."
  },
  {
    co: "Nuestro tiempo juntos ya estaba escrito para L&L.",
    it: "Il nostro tempo insieme era già scritto per L&L."
  },
  {
    co: "No contamos días… contamos latidos — Lindo & Linda ❤️",
    it: "Non contiamo i giorni… contiamo i battiti — Lindo & Linda ❤️"
  }
];

// 💕 Utilidades
function renderBox(value, labelEs, labelIt) {
  return `
    <div class="time-box">
      <div class="time-value">${value}</div>
      <div class="time-label">${labelEs} · ${labelIt}</div>
    </div>
  `;
}

// 💖 Tiempo restante con meses reales
function calculateTimeRemaining() {
  const now = new Date();
  if (now >= targetDate) return null;

  let years = targetDate.getFullYear() - now.getFullYear();
  let months = targetDate.getMonth() - now.getMonth();
  let days = targetDate.getDate() - now.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const future = new Date(now);
  future.setFullYear(now.getFullYear() + years);
  future.setMonth(now.getMonth() + months);
  future.setDate(now.getDate() + days);

  const diffMs = targetDate - future;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return {
    months: years * 12 + months,
    days,
    hours,
    minutes,
    seconds
  };
}

// 💕 Mostrar contador
function updateCountdown() {
  const now = new Date();
  const target = targetDate;

  if (now >= target) {
    showSpecialMessage();
    return;
  }

  let years = target.getFullYear() - now.getFullYear();
  let months = target.getMonth() - now.getMonth();
  let days = target.getDate() - now.getDate();
  let hours = target.getHours() - now.getHours();
  let minutes = target.getMinutes() - now.getMinutes();
  let seconds = target.getSeconds() - now.getSeconds();

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


setInterval(updateCountdown, 1000);
updateCountdown();

// 💌 FRASE ROMÁNTICA DIARIA ROTATIVA
function updateDailyQuote() {
  const today = new Date().toDateString();
  const saved = localStorage.getItem("dailyQuoteDate");

  if (saved !== today) {
    const random = Math.floor(Math.random() * romanticQuotes.length);
    localStorage.setItem("dailyQuoteIndex", random);
    localStorage.setItem("dailyQuoteDate", today);
  }

  const index = parseInt(localStorage.getItem("dailyQuoteIndex"), 10) || 0;
  const q = romanticQuotes[index];

  quoteEl.style.opacity = 0;
  setTimeout(() => {
    quoteEl.innerHTML = `
      🇨🇴 ${q.co}<br>
      🇮🇹 ${q.it}
    `;
    quoteEl.style.opacity = 1;
  }, 300);
}

updateDailyQuote();

// 🔊 Sonido suave al abrir
window.addEventListener("load", () => {
  heartbeatSound.volume = 0.25;
  heartbeatSound.play().catch(() => {});
});

// 🌙 Modo oscuro persistente
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

themeBtn.addEventListener("click", () => {
  const current = localStorage.getItem("theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
});

applyTheme(localStorage.getItem("theme") || "light");

// 💌 NOTIFICACIONES DIARIAS L&L
async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("Tu navegador no soporta notificaciones 😢");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  scheduleDailyNotification();
  alert("💖 Recordatorios activados para L&L. Cada día sabrás cuánto falta.");
}

function scheduleDailyNotification() {
  const now = new Date();
  const next = new Date();
  next.setHours(9, 0, 0, 0);

  if (next <= now) next.setDate(next.getDate() + 1);
  const timeout = next - now;

  setTimeout(() => {
    sendNotification();
    setInterval(sendNotification, 24 * 60 * 60 * 1000);
  }, timeout);
}

function sendNotification() {
  const time = calculateTimeRemaining();
  if (!time) return;

  const bodyEs = `Lindo ❤️ Linda\nFaltan ${time.months} meses, ${time.days} días y ${time.hours} horas para su día favorito`;
  const bodyIt = `Lindo ❤️ Linda\nMancano ${time.months} mesi, ${time.days} giorni e ${time.hours} ore al loro giorno preferito`;

  new Notification("💌 L&L — Nuestro día favorito", {
    body: `${bodyEs}\n${bodyIt}\n\nCada segundo nos acerca más ✨`,
    icon: "images/icon-192.png",
    vibrate: [120, 60, 120]
  });
}

notifyBtn.addEventListener("click", enableNotifications);

// 📱 Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
