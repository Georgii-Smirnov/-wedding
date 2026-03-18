const weddingDate = new Date("2026-08-22T15:00:00+04:00");

const units = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes")
};

const countdownNote = document.getElementById("countdownNote");
const musicToggle = document.getElementById("musicToggle");
const musicText = musicToggle.querySelector(".music-toggle__text");
const weddingAudio = document.getElementById("weddingAudio");
const petalsLayer = document.querySelector(".petals");
const revealBlocks = document.querySelectorAll(".reveal");

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  if (difference <= 0) {
    units.days.textContent = "00";
    units.hours.textContent = "00";
    units.minutes.textContent = "00";
    countdownNote.textContent = "Этот день уже наступил. Ждём вас на празднике!";
    return;
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  units.days.textContent = pad(days);
  units.hours.textContent = pad(hours);
  units.minutes.textContent = pad(minutes);
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.22
    }
  );

  revealBlocks.forEach((block, index) => {
    block.style.transitionDelay = `${Math.min(index * 90, 420)}ms`;
    observer.observe(block);
  });
}

function setMusicState(playing) {
  musicToggle.classList.toggle("is-playing", playing);
  musicToggle.setAttribute("aria-pressed", String(playing));
  musicToggle.setAttribute("aria-label", playing ? "Остановить музыку" : "Включить музыку");
  musicText.textContent = playing ? "Пауза" : "Музыка";
}

async function toggleMusic() {
  if (!weddingAudio) {
    return;
  }

  if (weddingAudio.paused) {
    try {
      await weddingAudio.play();
      setMusicState(true);
    } catch (error) {
      setMusicState(false);
      musicText.textContent = "Файл не найден";
    }
  } else {
    weddingAudio.pause();
    setMusicState(false);
  }
}

function createPetals() {
  if (!petalsLayer) {
    return;
  }

  const amount = 18;
  const fragments = document.createDocumentFragment();

  for (let index = 0; index < amount; index += 1) {
    const petal = document.createElement("span");
    const startX = Math.random() * 100;
    const drift = (Math.random() * 20 - 10).toFixed(2);
    const duration = (10 + Math.random() * 7).toFixed(2);
    const delay = (Math.random() * -14).toFixed(2);

    petal.className = "petal";
    petal.style.setProperty("--x", `${startX}vw`);
    petal.style.setProperty("--drift", `${drift}vw`);
    petal.style.setProperty("--fall", `${duration}s`);
    petal.style.setProperty("--delay", `${delay}s`);
    fragments.appendChild(petal);
  }

  petalsLayer.appendChild(fragments);
}

function init() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setupReveal();
  createPetals();
  setMusicState(false);
}

musicToggle.addEventListener("click", toggleMusic);
weddingAudio.addEventListener("pause", () => setMusicState(false));
weddingAudio.addEventListener("play", () => setMusicState(true));
window.addEventListener("DOMContentLoaded", init);
