const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let W, H, particles;
let mouse = { x: null, y: null };
let time = 0; // Serve per calcolare l'orbita del nodo fantasma

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
  let targetX = mouse.x;
  let targetY = mouse.y;

  // Nodo fantasma per Mobile
  if (targetX === null && window.innerWidth <= 768) {
     targetX = W / 2 + Math.cos(time) * 100;
     targetY = H / 2 + Math.sin(time) * 100;
  }

  for (let i = 0; i < particles.length; i++) {
    if (targetX != null) {
      const distTarget = Math.hypot(particles[i].x - targetX, particles[i].y - targetY);
      if (distTarget < 160) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = `rgba(255,255,255,${0.25 * (1 - distTarget / 160)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

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
  time += 0.015;
  requestAnimationFrame(loop);
}

// Eventi Mouse Desktop
window.addEventListener('resize', () => { resize(); createParticles(); });
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

// Eventi Touch Mobile
window.addEventListener('touchstart', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('touchmove', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });


const card = document.querySelector('.card');

// --- Effetto Inclinazione 3D Desktop (Mouse) ---
document.addEventListener('mousemove', (e) => {
  if (window.innerWidth > 768) {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 90; 
    let yAxis = (window.innerHeight / 2 - e.pageY) / 90;
    card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  }
});

document.addEventListener('mouseout', () => {
  card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
});

// --- NUOVO: Effetto Giroscopio 3D Mobile ---
window.addEventListener('deviceorientation', (e) => {
  // Esegue solo su schermi piccoli e se i dati del giroscopio sono disponibili
  if (window.innerWidth <= 768 && e.gamma !== null && e.beta !== null) {
    let gamma = e.gamma; // Inclinazione Destra/Sinistra
    let beta = e.beta;   // Inclinazione Avanti/Indietro

    // Limitiamo i valori per evitare che la carta si capovolga completamente
    if (gamma > 30) gamma = 30;
    if (gamma < -30) gamma = -30;
    
    // Calcoliamo la rotazione rendendola fluida (diviso 3). 
    // Sottraggo 45 a beta perché di solito si tiene il telefono inclinato in mano.
    let rotateY = gamma / 3; 
    let rotateX = (beta - 45) / 3;

    // Limitiamo l'asse X
    if (rotateX > 15) rotateX = 15;
    if (rotateX < -15) rotateX = -15;

    // Applichiamo la trasformazione
    card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${-rotateX}deg)`;
  }
});

// Trucco Marketing Tab
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
