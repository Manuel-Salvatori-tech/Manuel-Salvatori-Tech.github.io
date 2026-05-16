const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let W, H, particles;
// Variabile per tracciare il mouse per lo sfondo
let mouse = { x: null, y: null };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createParticles() {
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2,
  }));
}

function drawGradient() {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a0b2e');
  grad.addColorStop(0.5, '#3d1c54');
  grad.addColorStop(1, '#1e0c2b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawParticles() {
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.fill();
    
    p.x += p.dx;
    p.y += p.dy;
    
    if (p.x < 0 || p.x > W) p.dx *= -1;
    if (p.y < 0 || p.y > H) p.dy *= -1;
  });
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    // NUOVO: Collega le particelle al mouse dell'utente
    if (mouse.x != null) {
      const distMouse = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
      if (distMouse < 160) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(255,255,255,${0.25 * (1 - distMouse / 160)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Collega le particelle tra di loro
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function loop() {
  drawGradient();
  drawParticles();
  drawLines();
  requestAnimationFrame(loop);
}

// Event Listeners per lo sfondo interattivo
window.addEventListener('resize', () => { resize(); createParticles(); });
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

// --- NUOVO: Effetto Inclinazione 3D della Card ---
const card = document.querySelector('.card');
document.addEventListener('mousemove', (e) => {
  // Calcola l'inclinazione in base a quanto il mouse si allontana dal centro (diviso per 40 per renderlo sottile)
  let xAxis = (window.innerWidth / 2 - e.pageX) / 40; 
  let yAxis = (window.innerHeight / 2 - e.pageY) / 40;
  card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// --- NUOVO: Trucco Marketing Tab ---
let originalTitle = document.title;
window.addEventListener("blur", () => {
  document.title = "Ehi, torna qui! 👀";
});
window.addEventListener("focus", () => {
  document.title = originalTitle;
});

// Avvia tutto
resize();
createParticles();
loop();
