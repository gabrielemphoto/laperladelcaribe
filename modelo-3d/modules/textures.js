import * as THREE from 'three';

/**
 * Generador procedural de texturas de alta definición para el modelo 3D.
 * Garantiza fidelidad visual idéntica a los renders de referencia sin depender de descargas externas.
 */

// 1. Textura de Estratos Geológicos (Corte transversal del terreno: Humus, Raíces, Arcilla y Roca Madre)
export function createStrataTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Gradiente vertical base de estratos
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0.00, '#2b1a10'); // Humus superficial oscuro
  grad.addColorStop(0.12, '#3d2617'); // Suelo orgánico fértil
  grad.addColorStop(0.25, '#6a4a30'); // Transición a suelo arcilloso
  grad.addColorStop(0.40, '#806145'); // Capa arenosa intermedia
  grad.addColorStop(0.52, '#917963'); // Gravilla y sedimentos
  grad.addColorStop(0.65, '#6e6a64'); // Roca calcárea superior
  grad.addColorStop(0.85, '#54514d'); // Roca madre densa
  grad.addColorStop(1.00, '#3b3835'); // Base rocosa profunda
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Ruido granular y capas geológicas onduladas
  for (let y = 0; y < 1024; y += 2) {
    const layerFactor = y / 1024;
    const wave1 = Math.sin(y * 0.04) * 8 + Math.cos(y * 0.015) * 14;
    const wave2 = Math.sin(y * 0.12) * 3;
    const alpha = (Math.random() * 0.18 + 0.05);

    if (layerFactor < 0.45) {
      // Tonos tierra / arcilla
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(60, 40, 25, ${alpha})` : `rgba(130, 95, 65, ${alpha})`;
    } else {
      // Tonos rocosos / minerales grisáceos y ocres
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(40, 40, 45, ${alpha})` : `rgba(170, 165, 155, ${alpha})`;
    }
    ctx.fillRect(0, y + wave1 + wave2, 1024, 2);
  }

  // Grandes rocas fracturadas en la zona rocosa inferior (y > 450)
  for (let i = 0; i < 350; i++) {
    const rx = Math.random() * 1024;
    const ry = 480 + Math.random() * 520;
    const rw = 25 + Math.random() * 80;
    const rh = 12 + Math.random() * 40;
    const rockTone = Math.floor(80 + Math.random() * 60);

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate((Math.random() - 0.5) * 0.2);
    ctx.fillStyle = `rgb(${rockTone + 15}, ${rockTone + 10}, ${rockTone})`;
    ctx.strokeStyle = `rgba(30, 30, 30, 0.6)`;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(-rw / 2, -rh / 2);
    ctx.lineTo(rw / 2 + Math.random() * 10, -rh / 2 + Math.random() * 6);
    ctx.lineTo(rw / 2, rh / 2);
    ctx.lineTo(-rw / 2 + Math.random() * 6, rh / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Grietas y sombras de rocas
    ctx.fillStyle = 'rgba(20, 20, 20, 0.4)';
    ctx.fillRect(-rw / 2, rh / 2 - 3, rw, 3);
    ctx.restore();
  }

  // Raíces colgantes en la capa superior (y de 0 a 350)
  ctx.lineWidth = 1.8;
  for (let r = 0; r < 85; r++) {
    let currX = Math.random() * 1024;
    let currY = Math.random() * 40;
    const maxDepth = 150 + Math.random() * 180;
    
    ctx.beginPath();
    ctx.moveTo(currX, currY);
    ctx.strokeStyle = Math.random() > 0.3 ? 'rgba(215, 190, 150, 0.85)' : 'rgba(150, 110, 75, 0.7)';
    
    while (currY < maxDepth) {
      currX += (Math.random() - 0.5) * 12;
      currY += 5 + Math.random() * 8;
      ctx.lineTo(currX, currY);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Bump Map para relieve rocoso en los laterales
export function createStrataBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 200; i++) {
    const rx = Math.random() * 512;
    const ry = 220 + Math.random() * 280;
    const rw = 20 + Math.random() * 50;
    const rh = 10 + Math.random() * 25;
    ctx.fillStyle = Math.random() > 0.5 ? '#b0b0b0' : '#454545';
    ctx.fillRect(rx, ry, rw, rh);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 3. Textura de Césped Tropical con microvariaciones
export function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Fondo verde caribeño vibrante
  ctx.fillStyle = '#4f7d2f';
  ctx.fillRect(0, 0, 1024, 1024);

  // Manchas de humedad y tonos de pradera
  for (let i = 0; i < 60; i++) {
    const gx = Math.random() * 1024;
    const gy = Math.random() * 1024;
    const gr = 40 + Math.random() * 100;
    const gGrad = ctx.createRadialGradient(gx, gy, 5, gx, gy, gr);
    const isDark = Math.random() > 0.45;
    gGrad.addColorStop(0, isDark ? 'rgba(40, 68, 22, 0.45)' : 'rgba(105, 148, 48, 0.45)');
    gGrad.addColorStop(1, 'rgba(79, 125, 47, 0)');
    ctx.fillStyle = gGrad;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Microfibras de césped
  for (let j = 0; j < 30000; j++) {
    const bx = Math.random() * 1024;
    const by = Math.random() * 1024;
    const bladeColor = Math.random() > 0.5 ? '#5d9136' : (Math.random() > 0.5 ? '#3f6723' : '#73a83a');
    ctx.fillStyle = bladeColor;
    ctx.fillRect(bx, by, 1 + Math.random() * 2, 3 + Math.random() * 5);
  }

  // Pequeñas flores silvestres amarillas y blancas (como en la Imagen 1)
  for (let f = 0; f < 80; f++) {
    const fx = Math.random() * 1024;
    const fy = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.4 ? '#ffdd44' : '#ffffff';
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 4. Textura de Paneles Solares Fotovoltaicos de Alta Eficiencia
export function createSolarPanelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Marco de aluminio gris grafito
  ctx.fillStyle = '#1c2128';
  ctx.fillRect(0, 0, 512, 512);

  // Celdas monocristalinas azul zafiro oscuro
  const cols = 6;
  const rows = 10;
  const padding = 3;
  const cellW = (512 - (cols + 1) * padding) / cols;
  const cellH = (512 - (rows + 1) * padding) / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const cx = padding + c * (cellW + padding);
      const cy = padding + r * (cellH + padding);

      // Célula azul profundo con degradado especular
      const cGrad = ctx.createLinearGradient(cx, cy, cx + cellW, cy + cellH);
      cGrad.addColorStop(0, '#10223d');
      cGrad.addColorStop(0.5, '#183863');
      cGrad.addColorStop(1, '#0e1d35');
      ctx.fillStyle = cGrad;
      ctx.fillRect(cx, cy, cellW, cellH);

      // Filamentos conductores de plata (busbars)
      ctx.strokeStyle = 'rgba(210, 230, 255, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + cellW * 0.33, cy);
      ctx.lineTo(cx + cellW * 0.33, cy + cellH);
      ctx.moveTo(cx + cellW * 0.66, cy);
      ctx.lineTo(cx + cellW * 0.66, cy + cellH);
      ctx.stroke();

      // Cuadrícula fina de microhilos
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      for (let y = cy + 4; y < cy + cellH; y += 4) {
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(cx + cellW, y);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 5. Textura de Listones de Madera Vertical (Roble / Teca para la fachada)
export function createWoodSlatsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#9d6d45';
  ctx.fillRect(0, 0, 512, 512);

  const slatWidth = 16;
  for (let x = 0; x < 512; x += slatWidth) {
    // Veta de madera con tono cálido
    const tone = Math.random() > 0.5 ? '#a8754b' : '#93643d';
    ctx.fillStyle = tone;
    ctx.fillRect(x + 2, 0, slatWidth - 2, 512);

    // Microvetas
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = 'rgba(60, 30, 10, 0.1)';
      ctx.fillRect(x + 3 + i * 3, 0, 1 + Math.random() * 2, 512);
    }

    // Ranura oscura entre listones (sombra de profundidad)
    ctx.fillStyle = '#26170d';
    ctx.fillRect(x, 0, 2, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 6. Textura de Suelo de Gravilla / Sendero
export function createGravelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b0aba3';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 3000; i++) {
    const px = Math.random() * 256;
    const py = Math.random() * 256;
    const pr = 1 + Math.random() * 2.5;
    const shade = Math.floor(130 + Math.random() * 90);
    ctx.fillStyle = `rgb(${shade}, ${shade - 5}, ${shade - 10})`;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// 7. Textura de Pavimento Coralina / Porcelanato para Terraza del Resort
export function createResortTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e5dec9'; // Tono piedra coralina caribeña clara
  ctx.fillRect(0, 0, 512, 512);

  const tileSize = 64;
  for (let x = 0; x < 512; x += tileSize) {
    for (let y = 0; y < 512; y += tileSize) {
      // Sutil variación de losa
      const v = (Math.random() - 0.5) * 12;
      ctx.fillStyle = `rgba(${Math.floor(235 + v)}, ${Math.floor(226 + v)}, ${Math.floor(210 + v)}, 0.4)`;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Juntas de lechada
      ctx.strokeStyle = '#c4bbae';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// 8. Textura Normal para Ondas de Agua de Piscina
export function createWaterNormalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 40; i++) {
    const wx = Math.random() * 256;
    const wy = Math.random() * 256;
    const wr = 15 + Math.random() * 35;
    const grad = ctx.createRadialGradient(wx, wy, 2, wx, wy, wr);
    grad.addColorStop(0, 'rgba(170, 170, 255, 0.6)');
    grad.addColorStop(0.5, 'rgba(90, 90, 240, 0.3)');
    grad.addColorStop(1, 'rgba(128, 128, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(wx, wy, wr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}
