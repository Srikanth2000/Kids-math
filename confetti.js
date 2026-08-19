/**
 * Canvas Confetti & Sparkles Engine
 */

class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationId = null;
    this.isVictoryLoop = false;
    this.colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9c88ff', '#ff6b81', '#00d2d3'];

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Quick celebratory burst on correct answers
  burst(originX, originY, count = 45) {
    if (!this.ctx) return;
    const x = originX !== undefined ? originX : window.innerWidth / 2;
    const y = originY !== undefined ? originY : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
        opacity: 1,
        gravity: 0.25,
        decay: Math.random() * 0.015 + 0.012
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  // Grand continuous shower for congratulations screen
  startVictoryShower() {
    this.isVictoryLoop = true;
    if (!this.animationId) {
      this.animate();
    }
  }

  stopVictoryShower() {
    this.isVictoryLoop = false;
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // If in victory loop, continually spawn new confetti at top
    if (this.isVictoryLoop && Math.random() < 0.6) {
      for (let i = 0; i < 4; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: -20,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 4 + 2,
          size: Math.random() * 10 + 6,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          shape: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'star' : 'circle'),
          opacity: 1,
          gravity: 0.1,
          decay: 0.003
        });
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.canvas.height + 40) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'star') {
        this.drawStar(this.ctx, 0, 0, 5, p.size, p.size / 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0 || this.isVictoryLoop) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }
}

const confettiEngine = new ConfettiEngine('confetti-canvas');
