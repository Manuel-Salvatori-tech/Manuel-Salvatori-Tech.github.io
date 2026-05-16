const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let W, H, particles;

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
  // Nuovo tema: Viola scuro / Dark Violet
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

window.addEventListener('resize', () => { resize(); createParticles(); });
resize();
createParticles();
loop();
