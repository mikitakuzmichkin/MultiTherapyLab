const canvas = document.querySelector("#sky");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let stars = [];
let meteors = [];
let nextMeteor = 600;
let nextShower = 7000;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(420, Math.round((width * height) / 4800));
  stars = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() < 0.07 ? 1.5 + Math.random() * 1.3 : 0.3 + Math.random() * 1,
    a: 0.25 + Math.random() * 0.75,
    phase: Math.random() * Math.PI * 2,
    speed: 0.004 + Math.random() * 0.018,
    warm: Math.random() < 0.18,
  }));
}

function spawnMeteor() {
  const fromEdge = Math.random();
  meteors.push({
    x: fromEdge < 0.75 ? Math.random() * width * 0.85 : width * Math.random(),
    y: fromEdge < 0.75 ? -30 - Math.random() * 80 : Math.random() * height * 0.25,
    vx: 2.2 + Math.random() * 3.4,
    vy: 3.4 + Math.random() * 4.6,
    life: 1,
    decay: 0.006 + Math.random() * 0.01,
    len: 14 + Math.random() * 18,
  });
}

function drawSky(time) {
  ctx.clearRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.72, height * 0.12, 0, width * 0.72, height * 0.18, width * 0.55);
  glow.addColorStop(0, "rgba(86, 104, 168, 0.18)");
  glow.addColorStop(1, "rgba(7, 11, 22, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    const twinkle = reduceMotion ? 1 : 0.55 + Math.sin(time * star.speed + star.phase) * 0.45;
    const alpha = star.a * twinkle;
    ctx.beginPath();
    ctx.fillStyle = star.warm ? `rgba(232, 214, 176, ${alpha})` : `rgba(244, 247, 255, ${alpha})`;
    ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
    ctx.fill();
    if (star.r > 1.6) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.25})`;
      ctx.arc(star.x * width, star.y * height, star.r * 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  meteors = meteors.filter((meteor) => meteor.life > 0);
  for (const meteor of meteors) {
    meteor.x += meteor.vx;
    meteor.y += meteor.vy;
    meteor.life -= meteor.decay;
    const tailX = meteor.x - meteor.vx * meteor.len;
    const tailY = meteor.y - meteor.vy * meteor.len;
    const trail = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
    trail.addColorStop(0, `rgba(255, 255, 255, ${meteor.life})`);
    trail.addColorStop(0.35, `rgba(210, 220, 255, ${meteor.life * 0.45})`);
    trail.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.strokeStyle = trail;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
  }
}

function frame(time) {
  if (document.hidden) {
    requestAnimationFrame(frame);
    return;
  }
  if (time > nextMeteor) {
    spawnMeteor();
    nextMeteor = time + 900 + Math.random() * 1600;
  }
  if (time > nextShower) {
    const count = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(spawnMeteor, i * 90);
    }
    nextShower = time + 11000 + Math.random() * 9000;
  }
  drawSky(time);
  requestAnimationFrame(frame);
}

resize();
window.addEventListener("resize", resize);

for (let i = 0; i < 5; i += 1) {
  window.setTimeout(spawnMeteor, 350 + i * 130);
}

if (reduceMotion) {
  drawSky(0);
} else {
  requestAnimationFrame(frame);
}
