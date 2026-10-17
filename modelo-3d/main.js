import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TerrainBlock } from './modules/terrain.js';
import { VegetationSystem } from './modules/vegetation.js';
import { CabinModel } from './modules/cabin.js';
import { ResortModel } from './modules/resort.js';
import { sounds } from './modules/sound.js';
import { EmbedHelper } from './modules/embed-helper.js';

/**
 * Aplicación Principal del Modelo 3D Interactivo
 * La Perla del Caribe - Terreno y Fases de Construcción
 */
class App3D {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.currentPhase = 0; // 0: Terreno, 1: Cabaña, 2: Resort
    this.targetPhase = 0;
    this.animating = false;
    this.animProgress = 1.0;
    this.timeMode = 'day'; // day, sunset, night
    this.initialAutoRotate = false;
    this.initialPhase = 0;
    this.initialTime = 'day';

    // Inicializar helper de embed y parámetros
    this.embedHelper = new EmbedHelper(this);

    this.initThree();
    this.initLighting();
    this.initSceneObjects();
    this.initUI();
    this.setupEvents();

    // Aplicar estado inicial de URL
    if (this.initialPhase !== 0) {
      this.setPhase(this.initialPhase, false);
    }
    if (this.initialTime !== 'day') {
      this.setTimeMode(this.initialTime);
    }
    if (this.initialAutoRotate) {
      this.controls.autoRotate = true;
      document.getElementById('btn-autorotate')?.classList.add('active');
    }

    this.animate();
  }

  // ==========================================
  // CONFIGURACIÓN DE THREE.JS
  // ==========================================
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6f8fa);

    // Cámara en perspectiva isométrica con campo de visión cinematográfico
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 150);
    this.camera.position.set(15, 12, 15);

    // Renderer de alta definición con sombras y mapeo de tonos
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Controles orbitales interactivos
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // Evitar pasar por debajo del suelo
    this.controls.minDistance = 6;
    this.controls.maxDistance = 35;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 1.2;

    // Plano receptor de sombras de contacto suave
    const shadowPlaneGeo = new THREE.PlaneGeometry(60, 60);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    this.shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -3.22;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);
  }

  // ==========================================
  // ILUMINACIÓN REALISTA Y AMBIENTE
  // ==========================================
  initLighting() {
    this.lightsGroup = new THREE.Group();

    // Luz hemisférica (cielo caribeño + rebote de tierra)
    this.hemiLight = new THREE.HemisphereLight(0xe8f4ff, 0x483d31, 0.95);
    this.hemiLight.position.set(0, 20, 0);
    this.lightsGroup.add(this.hemiLight);

    // Sol direccional principal con sombras nítidas
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    this.sunLight.position.set(14, 20, 12);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 50;
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.shadow.radius = 2.0;

    const d = 11;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;

    this.lightsGroup.add(this.sunLight);

    // Luz de relleno cálida secundaria
    this.fillLight = new THREE.DirectionalLight(0xffecd1, 0.6);
    this.fillLight.position.set(-12, 10, -10);
    this.lightsGroup.add(this.fillLight);

    this.scene.add(this.lightsGroup);
  }

  // ==========================================
  // ELEMENTOS DE LA ESCENA 3D
  // ==========================================
  initSceneObjects() {
    // 1. Bloque de Terreno con estratos geológicos
    this.terrain = new TerrainBlock();
    this.scene.add(this.terrain.group);

    // 2. Vegetación (Silvestre y Resort)
    this.vegetation = new VegetationSystem();
    this.scene.add(this.vegetation.wildGroup);
    this.scene.add(this.vegetation.resortGroup);

    // 3. Cabaña Modular (Fase 1)
    this.cabin = new CabinModel();
    this.scene.add(this.cabin.group);

    // 4. Resort Boutique y Piscina (Fase 2)
    this.resort = new ResortModel();
    this.scene.add(this.resort.group);

    // Partículas de construcción
    this.initConstructionParticles();
  }

  initConstructionParticles() {
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const colors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      colors[i * 3] = 0.95;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0.45;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0
    });

    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  triggerParticles() {
    if (!this.particles) return;
    this.particles.material.opacity = 0.9;
    this.particleLife = 1.0;
  }

  // ==========================================
  // GESTIÓN DE FASES Y ANIMACIÓN DE CONSTRUCCIÓN
  // ==========================================
  nextPhase() {
    const next = (this.currentPhase + 1) % 3;
    this.setPhase(next, true);
  }

  setPhase(targetPhase, animate = true) {
    if (this.currentPhase === targetPhase && !this.animating) return;

    sounds.playBuildTransition(targetPhase);
    this.fromPhase = this.currentPhase;
    this.targetPhase = targetPhase;

    if (!animate) {
      this.currentPhase = targetPhase;
      this.applyPhaseState(targetPhase, 1.0);
      this.updateUI();
      return;
    }

    this.animating = true;
    this.animStartTime = performance.now();
    this.animDuration = 1000; // 1 segundo
    this.triggerParticles();
  }

  updatePhaseAnimation(currentTime) {
    if (!this.animating) return;

    const elapsed = currentTime - this.animStartTime;
    let t = Math.min(1.0, elapsed / this.animDuration);

    // Easing suave cuadrático / elástico
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    // Transición entre fases
    if (this.targetPhase === 1) {
      // De Fase 0 a 1 (Construcción de la cabaña)
      this.cabin.setConstructionProgress(ease);
      this.terrain.setExcavationProgress(0);
      this.resort.setConstructionProgress(0);
      this.vegetation.setPhase(1);
    } else if (this.targetPhase === 2) {
      // De Fase 1 a 2 (Construcción del resort y excavación de piscina)
      if (this.fromPhase === 1) {
        this.cabin.setConstructionProgress(Math.max(0, 1 - ease * 1.5));
      }
      this.terrain.setExcavationProgress(ease);
      this.resort.setConstructionProgress(ease);
      this.vegetation.setPhase(2);
    } else if (this.targetPhase === 0) {
      // Regreso a Terreno Virgen
      if (this.fromPhase === 1) {
        this.cabin.setConstructionProgress(1 - ease);
      } else if (this.fromPhase === 2) {
        this.resort.setConstructionProgress(1 - ease);
        this.terrain.setExcavationProgress(1 - ease);
      }
      this.vegetation.setPhase(0);
    }

    if (t >= 1.0) {
      this.animating = false;
      this.currentPhase = this.targetPhase;
      this.applyPhaseState(this.currentPhase, 1.0);
      this.updateUI();
    }
  }

  applyPhaseState(phase, progress = 1.0) {
    if (phase === 0) {
      this.terrain.setExcavationProgress(0);
      this.terrain.showBoundaryPegs(true);
      this.vegetation.setPhase(0);
      this.cabin.setConstructionProgress(0);
      this.resort.setConstructionProgress(0);
    } else if (phase === 1) {
      this.terrain.setExcavationProgress(0);
      this.terrain.showBoundaryPegs(false);
      this.vegetation.setPhase(1);
      this.cabin.setConstructionProgress(progress);
      this.resort.setConstructionProgress(0);
    } else if (phase === 2) {
      this.terrain.setExcavationProgress(progress);
      this.terrain.showBoundaryPegs(false);
      this.vegetation.setPhase(2);
      this.cabin.setConstructionProgress(0);
      this.resort.setConstructionProgress(progress);
    }
    this.updateCameraForPhase(phase);
  }

  updateCameraForPhase(phase) {
    // Sutil ajuste cinemático de cámara para encuadre óptimo
    const targets = [
      { x: 14, y: 11, z: 14, lookY: 0 },
      { x: 12, y: 9, z: 13, lookY: 0.8 },
      { x: 15, y: 12, z: 15, lookY: 1.2 }
    ];

    const t = targets[phase];
    if (t && !this.userInteracting) {
      this.targetCamPos = new THREE.Vector3(t.x, t.y, t.z);
      this.targetControlsY = t.lookY;
    }
  }

  // ==========================================
  // ILUMINACIÓN HORARIA (DÍA, ATARDECER, NOCHE)
  // ==========================================
  setTimeMode(mode) {
    this.timeMode = mode;
    const isNight = mode === 'night';
    const isSunset = mode === 'sunset';

    if (mode === 'day') {
      this.scene.background = new THREE.Color(0xf6f8fa);
      this.sunLight.color.setHex(0xfffaed);
      this.sunLight.intensity = 2.4;
      this.sunLight.position.set(14, 20, 12);
      this.hemiLight.color.setHex(0xe8f4ff);
      this.hemiLight.groundColor.setHex(0x483d31);
      this.hemiLight.intensity = 0.95;
      this.renderer.toneMappingExposure = 1.15;
    } else if (mode === 'sunset') {
      this.scene.background = new THREE.Color(0x2d1a2f);
      this.sunLight.color.setHex(0xff8c42);
      this.sunLight.intensity = 3.0;
      this.sunLight.position.set(18, 6, 10);
      this.hemiLight.color.setHex(0xffa177);
      this.hemiLight.groundColor.setHex(0x3a1928);
      this.hemiLight.intensity = 0.8;
      this.renderer.toneMappingExposure = 1.1;
    } else if (mode === 'night') {
      this.scene.background = new THREE.Color(0x0a0e17);
      this.sunLight.color.setHex(0x5078a8);
      this.sunLight.intensity = 0.35;
      this.sunLight.position.set(-10, 15, -10);
      this.hemiLight.color.setHex(0x19273c);
      this.hemiLight.groundColor.setHex(0x06090e);
      this.hemiLight.intensity = 0.4;
      this.renderer.toneMappingExposure = 1.25;
    }

    this.cabin.setNightMode(isNight);
    this.resort.setNightMode(isNight);

    // Actualizar botones de UI
    document.querySelectorAll('.btn-time').forEach(b => {
      b.classList.toggle('active', b.dataset.time === mode);
    });
  }

  // ==========================================
  // INTERFAZ DE USUARIO Y HUD
  // ==========================================
  initUI() {
    this.btnMainAction = document.getElementById('btn-main-action');
    this.phaseButtons = document.querySelectorAll('.phase-tab-btn');
    this.infoTitle = document.getElementById('hud-phase-title');
    this.infoBadge = document.getElementById('hud-phase-badge');
    this.infoDesc = document.getElementById('hud-phase-desc');
    this.infoMetrics = document.getElementById('hud-phase-metrics');
    this.thumbImg = document.getElementById('hud-thumb-img');

    // Botón principal interactivo de construcción
    if (this.btnMainAction) {
      this.btnMainAction.addEventListener('click', () => {
        sounds.playClick();
        this.nextPhase();
      });
    }

    // Pestañas directas de fases
    this.phaseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.phase, 10);
        sounds.playClick();
        this.setPhase(p, true);
      });
    });

    // Control de hora / iluminación
    document.querySelectorAll('.btn-time').forEach(b => {
      b.addEventListener('click', () => {
        sounds.playClick();
        this.setTimeMode(b.dataset.time);
      });
    });

    // Auto-rotación
    const btnAutoRotate = document.getElementById('btn-autorotate');
    if (btnAutoRotate) {
      btnAutoRotate.addEventListener('click', () => {
        sounds.playClick();
        this.controls.autoRotate = !this.controls.autoRotate;
        btnAutoRotate.classList.toggle('active', this.controls.autoRotate);
      });
    }

    // Presets de cámara
    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        this.setCameraPreset(btn.dataset.view);
      });
    });

    // Sonido toggle
    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const enabled = sounds.toggle();
        btnSound.classList.toggle('active', enabled);
        btnSound.setAttribute('title', enabled ? 'Sonido Activado' : 'Sonido Silenciado');
      });
    }

    // Captura de pantalla HD
    const btnScreenshot = document.getElementById('btn-screenshot');
    if (btnScreenshot) {
      btnScreenshot.addEventListener('click', () => {
        sounds.playClick();
        this.embedHelper.captureScreenshot(this.renderer, this.scene, this.camera);
      });
    }

    // Pantalla completa
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        sounds.playClick();
        this.embedHelper.toggleFullscreen();
      });
    }

    this.updateUI();
  }

  setCameraPreset(viewName) {
    const presets = {
      isometric: { x: 15, y: 12, z: 15, lookY: 0.5 },
      top: { x: 0.01, y: 22, z: 0.01, lookY: 0 },
      front: { x: 0, y: 3.5, z: 16, lookY: 1.2 },
      pool: { x: 8, y: 4.5, z: 8, lookY: 0.5 }
    };

    const p = presets[viewName];
    if (p) {
      this.targetCamPos = new THREE.Vector3(p.x, p.y, p.z);
      this.targetControlsY = p.lookY;
    }
  }

  updateUI() {
    const phaseData = [
      {
        badge: 'FASE 0 • OPORTUNIDAD INICIAL',
        title: 'Terreno Virgen (Lote en Bruto)',
        desc: 'Parcela de 500 m² con topografía óptima en Isla de Margarita. Corte geológico de alta fertilidad, suelo compactado y roca madre. Ideal para desarrollo personalizado.',
        thumb: 'assets/fase-0-terreno.jpg',
        btnText: '🏗️ Construir Cabaña Modular (Fase 1)',
        metrics: [
          { label: 'Superficie Lote', val: '500 m²' },
          { label: 'Zonificación', val: 'ZEE Turística' },
          { label: 'Factibilidad', val: '100% Agua y Luz' },
          { label: 'Plusvalía Proyectada', val: '+24% Anual' }
        ]
      },
      {
        badge: 'FASE 1 • CONSTRUCCIÓN MODULAR',
        title: 'Cabaña Modular Sustentable',
        desc: 'Arquitectura prefab escandinava-caribeña. Paneles de teca, cubierta 100% autosuficiente con energía solar fotovoltaica, terraza exterior y climatización eficiente.',
        thumb: 'assets/fase-1-cabana.jpg',
        btnText: '🏨 Construir Resort & Piscina (Fase 2)',
        metrics: [
          { label: 'Tiempo de Montaje', val: '45 - 60 Días' },
          { label: 'Autonomía Solar', val: '100% Off-Grid' },
          { label: 'Capacidad', val: '2 a 4 Personas' },
          { label: 'ROI Estimado (Airbnb)', val: '18% Anual' }
        ]
      },
      {
        badge: 'FASE 2 • DESARROLLO INTEGRAL',
        title: 'Resort Boutique & Spa Caribeño',
        desc: 'Edificio de 4 plantas con suites de lujo, balcones voladizos con barandillas de cristal, piscina infinity panorámica excavada en la roca, solarium y terraza gastronómica.',
        thumb: 'assets/fase-2-resort.jpg',
        btnText: '🌱 Reiniciar al Terreno Virgen',
        metrics: [
          { label: 'Unidades Suites', val: '24 Suites Lujo' },
          { label: 'Piscina Infinity', val: 'Excavada en Roca' },
          { label: 'Ocupación Media', val: '78% Anual' },
          { label: 'Rentabilidad Neta', val: '28% ROI' }
        ]
      }
    ];

    const current = phaseData[this.currentPhase];
    if (!current) return;

    if (this.infoBadge) this.infoBadge.textContent = current.badge;
    if (this.infoTitle) this.infoTitle.textContent = current.title;
    if (this.infoDesc) this.infoDesc.textContent = current.desc;
    if (this.btnMainAction) {
      this.btnMainAction.innerHTML = `<span>${current.btnText}</span><span class="btn-icon">⚡</span>`;
    }
    if (this.thumbImg) {
      this.thumbImg.src = current.thumb;
      this.thumbImg.alt = current.title;
    }

    if (this.infoMetrics) {
      this.infoMetrics.innerHTML = current.metrics.map(m => `
        <div class="metric-card">
          <span class="metric-val">${m.val}</span>
          <span class="metric-label">${m.label}</span>
        </div>
      `).join('');
    }

    // Actualizar estados visuales de las pestañas
    this.phaseButtons.forEach(btn => {
      const p = parseInt(btn.dataset.phase, 10);
      btn.classList.toggle('active', p === this.currentPhase);
    });

    // Actualizar snippet de incrustación si el modal está abierto
    this.embedHelper.updateEmbedSnippet();
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Detectar cuando el usuario interactúa manualmente con los controles
    this.controls.addEventListener('start', () => {
      this.userInteracting = true;
    });

    // Reanudar cámara automática después de unos segundos de inactividad
    this.controls.addEventListener('end', () => {
      clearTimeout(this.interactionTimer);
      this.interactionTimer = setTimeout(() => {
        this.userInteracting = false;
      }, 5000);
    });
  }

  // ==========================================
  // BUCLE DE RENDERIZADO PRINCIPAL
  // ==========================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Actualización de animaciones de construcción
    this.updatePhaseAnimation(performance.now());

    // Actualización del resort (ondas del agua de la piscina)
    if (this.resort && this.resort.group.visible) {
      this.resort.update(time);
    }

    // Desvanecimiento suave de partículas
    if (this.particles && this.particleLife > 0) {
      this.particleLife -= 0.02;
      this.particles.material.opacity = Math.max(0, this.particleLife);
      this.particles.rotation.y += 0.01;
    }

    // Transición suave de posición de cámara guiada
    if (this.targetCamPos && !this.userInteracting) {
      this.camera.position.lerp(this.targetCamPos, 0.04);
      if (this.targetControlsY !== undefined) {
        this.controls.target.y += (this.targetControlsY - this.controls.target.y) * 0.04;
      }
      if (this.camera.position.distanceTo(this.targetCamPos) < 0.1) {
        this.targetCamPos = null;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Inicializar la aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  new App3D();
});
