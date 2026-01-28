const targetDate = new Date("2026-06-01T00:00:00+01:00"); // Irlanda (DST se ajusta automáticamente)

const countdownEl = document.getElementById("countdown");
const notifyBtn = document.getElementById("notifyBtn");

// 💕 Render romántico
function renderBox(value, labelEs, labelIt) {
  return `
    <div class="time-box">
      <div class="time-value">${value}</div>
      <div class="time-label">${labelEs} · ${labelIt}</div>
    </div>
  `;
}

// 💖 Cálculo de meses reales + resto exacto
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

// 💕 Actualiza UI
function updateCountdown() {
  const time = calculateTimeRemaining();

  if (!time) {
    countdownEl.innerHTML = `
      <div class="time-box" style="grid-column: span 2;">
        <div class="time-value">💖</div>
        <div class="time-label">Es hoy · È oggi</div>
      </div>
    `;
    return;
  }

  countdownEl.innerHTML = `
    ${renderBox(time.months, "Meses", "Mesi")}
    ${renderBox(time.days, "Días", "Giorni")}
    ${renderBox(time.hours.toString().padStart(2, "0"), "Horas", "Ore")}
    ${renderBox(time.minutes.toString().padStart(2, "0"), "Minutos", "Minuti")}
    ${renderBox(time.seconds.toString().padStart(2, "0"), "Segundos", "Secondi")}
  `;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 💌 Notificaciones románticas diarias
async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("Tu navegador no soporta notificaciones 😢");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  scheduleDailyNotification();
  alert("💖 Recordatorios activados. Cada día te recordará cuánto falta.");
}

function scheduleDailyNotification() {
  const now = new Date();
  const next = new Date();
  next.setHours(9, 0, 0, 0); // 9am local

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

  const bodyEs = `Faltan ${time.months} meses, ${time.days} días y ${time.hours} horas para nuestro día favorito 💖`;
  const bodyIt = `Mancano ${time.months} mesi, ${time.days} giorni e ${time.hours} ore al nostro giorno preferito 💖`;

  new Notification("💌 Nuestro día favorito", {
    body: `${bodyEs}\n${bodyIt}\n\nCada segundo nos acerca más ✨`,
    icon: "icon-192.png"
  });
}

notifyBtn.addEventListener("click", enableNotifications);

// 📱 PWA install
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
