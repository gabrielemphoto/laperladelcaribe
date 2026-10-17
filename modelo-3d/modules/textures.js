import * as THREE from 'three';

/**
 * Texturas procedurales ultraligeras y optimizadas (256x256).
 * Generación instantánea en milisegundos sin sobrecargar CPU ni memoria.
 */

// 1. Estratos de tierra y roca para el corte transversal
export function createStrataTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.0, '#352115'); // Humus
  grad.addColorStop(0.2, '#5e3f26'); // Tierra fértil
  grad.addColorStop(0.45, '#7a5e42'); // Arcilla
  grad.addColorStop(0.65, '#5c5852'); // Roca superior
  grad.addColorStop(1.0, '#3d3a36'); // Roca madre densa
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Vetas geológicas
  for (let y = 0; y < 256; y += 4) {
    const alpha = Math.random() * 0.15 + 0.05;
    ctx.fillStyle = y < 110 ? `rgba(40, 20, 10, ${alpha})` : `rgba(200, 195, 185, ${alpha})`;
    ctx.fillRect(0, y + (Math.sin(y * 0.1) * 3), 256, 3);
  }

  // Raíces superficiales
  ctx.strokeStyle = 'rgba(210, 180, 140, 0.7)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 20; i++) {
    let x = Math.random() * 256;
    let y = 0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    while (y < 45 + Math.random() * 35) {
      x += (Math.random() - 0.5) * 8;
      y += 6;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 1b. Mapa de relieve (Bump Map) para estratos geológicos
export function createStrataBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Relieve de vetas rocosas
  for (let y = 0; y < 256; y += 4) {
    const val = Math.floor(Math.random() * 80 + 100);
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
    ctx.fillRect(0, y + (Math.sin(y * 0.1) * 3), 256, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Césped caribeño vibrante
export function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#528532';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? '#67a03f' : '#436d26';
    ctx.fillRect(x, y, 2, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 3. Paneles solares fotovoltaicos
export function createSolarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#171e28';
  ctx.fillRect(0, 0, 256, 256);

  const cols = 4;
  const rows = 6;
  const cellW = (256 - 15) / cols;
  const cellH = (256 - 21) / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const cx = 3 + c * (cellW + 3);
      const cy = 3 + r * (cellH + 3);
      ctx.fillStyle = '#1a365d';
      ctx.fillRect(cx, cy, cellW, cellH);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx + 2, cy + 2, cellW - 4, cellH - 4);
    }
  }

  return new THREE.CanvasTexture(canvas);
}

// 4. Listones de madera cálida
export function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#9e6d42';
  ctx.fillRect(0, 0, 256, 256);

  for (let x = 0; x < 256; x += 16) {
    ctx.fillStyle = Math.random() > 0.5 ? '#aa774a' : '#8e5f38';
    ctx.fillRect(x + 1, 0, 14, 256);
    ctx.fillStyle = '#3a2012';
    ctx.fillRect(x, 0, 1.5, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 5. Hormigón deteriorado / envejecido para hotel en ruinas
export function createRuinedConcreteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#616361'; // Hormigón grisáceo apagado
  ctx.fillRect(0, 0, 256, 256);

  // Manchas de humedad y moho
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const rad = 15 + Math.random() * 40;
    const g = ctx.createRadialGradient(x, y, 2, x, y, rad);
    g.addColorStop(0, 'rgba(45, 55, 40, 0.5)'); // Moho verdoso
    g.addColorStop(1, 'rgba(97, 99, 97, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grietas oscuras
  ctx.strokeStyle = 'rgba(25, 25, 25, 0.8)';
  ctx.lineWidth = 1.2;
  for (let c = 0; c < 8; c++) {
    let cx = Math.random() * 256;
    let cy = Math.random() * 256;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 5; s++) {
      cx += (Math.random() - 0.5) * 30;
      cy += (Math.random() - 0.5) * 30;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// 6. Paredes de bloques de concreto / obra gris para habitación
export function createCinderBlockTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#7a7d80'; // Gris cemento
  ctx.fillRect(0, 0, 256, 256);

  // Bloques de hormigón rústico con juntas de mortero
  const bh = 32;
  const bw = 64;
  ctx.strokeStyle = '#4b4d50';
  ctx.lineWidth = 2.5;

  for (let y = 0; y < 256; y += bh) {
    const shift = (y / bh) % 2 === 0 ? 0 : bw / 2;
    for (let x = -shift; x < 256; x += bw) {
      ctx.strokeRect(x, y, bw, bh);
      // Ruido de textura áspera
      if (Math.random() > 0.5) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 7. Parquet / piso de madera noble para habitación remodelada
export function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#b38255';
  ctx.fillRect(0, 0, 256, 256);

  const pw = 12;
  for (let x = 0; x < 256; x += pw) {
    ctx.fillStyle = Math.random() > 0.5 ? '#bf8e60' : '#a77649';
    ctx.fillRect(x + 1, 0, pw - 2, 256);
    ctx.fillStyle = '#59381c';
    ctx.fillRect(x, 0, 1, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 8. Alias y texturas complementarias para módulos de Cabaña y Resort
export function createSolarPanelTexture() {
  return createSolarTexture();
}

export function createWoodSlatsTexture() {
  return createWoodTexture();
}

export function createGravelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b8aba0';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const s = 1 + Math.random() * 3;
    const shade = Math.floor(130 + Math.random() * 80);
    ctx.fillStyle = `rgb(${shade}, ${shade - 10}, ${shade - 20})`;
    ctx.fillRect(x, y, s, s);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createResortTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e5dfd5';
  ctx.fillRect(0, 0, 256, 256);
  const ts = 64;
  ctx.strokeStyle = '#c4bcb0';
  ctx.lineWidth = 2;
  for (let x = 0; x < 256; x += ts) {
    for (let y = 0; y < 256; y += ts) {
      ctx.strokeRect(x, y, ts, ts);
      if (Math.random() > 0.4) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(x + 2, y + 2, ts - 4, ts - 4);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createWaterNormalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 8) {
    for (let x = 0; x < 256; x += 8) {
      const dx = Math.floor(Math.sin(x * 0.1) * 25 + 128);
      const dy = Math.floor(Math.cos(y * 0.1) * 25 + 128);
      ctx.fillStyle = `rgb(${dx}, ${dy}, 245)`;
      ctx.fillRect(x, y, 8, 8);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 9. Azulejos de mosaico vítreo para la piscina
export function createPoolMosaicTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 128, 128);

  const size = 16;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;

  for (let x = 0; x < 128; x += size) {
    for (let y = 0; y < 128; y += size) {
      const v = (Math.random() - 0.5) * 30;
      ctx.fillStyle = `rgb(${Math.floor(14 + v)}, ${Math.floor(165 + v)}, ${Math.floor(233 + v)})`;
      ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      ctx.strokeRect(x, y, size, size);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

