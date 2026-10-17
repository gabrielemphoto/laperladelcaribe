import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ProjectTerrainEco } from './modules/project-terrain.js';
import { ProjectHotelRemodel } from './modules/project-hotel.js';
import { ProjectRoomRemodel } from './modules/project-room.js';

/**
 * Visor 3D Interactivo Ultraligero y Optimizado
 * - Fondo 100% transparente
 * - 3 Proyectos animados en bucle continuo (2s por fase)
 * - Proyecto 3 con zoom cinemático (Edificio completo ➔ Zoom al apartamento en obra gris ➔ Remodelado "EN ALQUILER")
 * - Navegación exclusiva con 2 flechas laterales (⬅️ / ➡️)
 * - Giro continuo interactivo permanente
 */
export class Viewer3DApp {
  constructor(containerOrId = 'canvas-container') {
    if (typeof containerOrId === 'string') {
      this.container = document.getElementById(containerOrId) || document.getElementById('canvas-container') || document.getElementById('interactive-3d-canvas-wrap');
    } else {
      this.container = containerOrId || document.getElementById('canvas-container') || document.getElementById('interactive-3d-canvas-wrap');
    }

    if (!this.container) {
      console.warn('Viewer3DApp: Contenedor 3D no encontrado');
      return;
    }

    this.currentProjectIndex = 0; // 0: Terreno, 1: Hotel, 2: Torre/Apartamento
    this.projectCycleTime = 0;

    this.initThree();
    this.initLighting();
    this.initProjects();
    this.initUI();
    this.setupEvents();

    this.animate();
  }

  // ==========================================
  // INICIALIZACIÓN THREE.JS (FONDO TRANSPARENTE)
  // ==========================================
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = null;

    let w = this.container.clientWidth;
    let h = this.container.clientHeight;
    if (!w || !h || w <= 0 || h <= 0) {
      w = this.container.offsetWidth || window.innerWidth || 800;
      h = this.container.offsetHeight || (window.innerWidth < 640 ? 440 : 620);
    }

    const aspect = w / h;
    // FOV 38 para perspectiva arquitectónica sin distorsión
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    this.camera.position.set(14, 11, 14);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'default',
      failIfMajorPerformanceCaveat: false
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setClearColor(0x000000, 0); // Fondo transparente
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    // Controles orbitales interactivos
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.8, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 30;
    this.controls.autoRotate = true; // SIEMPRE en rotación continua
    this.controls.autoRotateSpeed = 0.75;

    // Sombra de contacto suave
    const shadowGeo = new THREE.PlaneGeometry(35, 35);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -1.52;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);
  }

  // ==========================================
  // ILUMINACIÓN REALISTA
  // ==========================================
  initLighting() {
    this.lights = new THREE.Group();

    // Luz ambiental equilibrada
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x48423a, 1.2);
    hemiLight.position.set(0, 20, 0);
    this.lights.add(hemiLight);

    // Sol direccional que genera relieve arquitectónico
    this.sunLight = new THREE.DirectionalLight(0xfffaec, 2.0);
    this.sunLight.position.set(14, 20, 12);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 45;
    this.sunLight.shadow.bias = -0.0004;

    const d = 9;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;

    this.lights.add(this.sunLight);
    this.scene.add(this.lights);
  }

  // ==========================================
  // CARGA DE LOS 3 PROYECTOS
  // ==========================================
  initProjects() {
    this.projects = [
      new ProjectTerrainEco(),    // Proyecto 0: Terreno -> Cabaña Eco
      new ProjectHotelRemodel(),  // Proyecto 1: Hotel Abandonado -> Resort de Lujo + Ganancias
      new ProjectRoomRemodel()    // Proyecto 2: Edificio Torre -> Zoom a Apartamento "EN ALQUILER"
    ];

    this.projects.forEach((proj, idx) => {
      proj.group.visible = (idx === this.currentProjectIndex);
      this.scene.add(proj.group);
    });

    this.updateCameraForProject(this.currentProjectIndex, 0);
  }

  // ==========================================
  // NAVEGACIÓN CON FLECHAS
  // ==========================================
  prevProject() {
    this.switchProject((this.currentProjectIndex - 1 + this.projects.length) % this.projects.length);
  }

  nextProject() {
    this.switchProject((this.currentProjectIndex + 1) % this.projects.length);
  }

  switchProject(newIndex) {
    if (newIndex === this.currentProjectIndex) return;

    this.projects[this.currentProjectIndex].group.visible = false;
    this.currentProjectIndex = newIndex;
    this.projects[this.currentProjectIndex].group.visible = true;

    this.projectCycleTime = 0;
    this.updateCameraForProject(newIndex, 0);
    this.updateUIBadge();
  }

  updateCameraForProject(index, cycleNorm = 0) {
    if (index === 0) {
      // Proyecto 1 (Terreno): Vista isométrica clásica
      this.targetCamPos = new THREE.Vector3(14, 11, 14);
      this.targetLookY = 0.5;
      this.shadowPlane.position.y = -1.52;
    } else if (index === 1) {
      // Proyecto 2 (Hotel de 4 plantas y piscina): Cámara más amplia y centrada verticalmente
      this.targetCamPos = new THREE.Vector3(15, 12, 15);
      this.targetLookY = 1.6;
      this.shadowPlane.position.y = -1.52;
    } else if (index === 2) {
      // Proyecto 3 (Torre y Apartamento): Zoom cinemático dinámico
      const p3 = this.projects[2];
      if (p3 && p3.getCameraTarget) {
        const camTarget = p3.getCameraTarget(cycleNorm);
        this.targetCamPos = camTarget.pos;
        this.targetLookY = camTarget.lookY;
      }
      this.shadowPlane.position.y = -0.22;
    }
  }

  // ==========================================
  // INTERFAZ: SOLO 2 FLECHAS
  // ==========================================
  initUI() {
    const btnPrev = document.getElementById('btn-arrow-prev');
    const btnNext = document.getElementById('btn-arrow-next');

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevProject();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextProject();
      });
    }

    // Navegación por swipe táctil
    let touchStartX = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diffX) > 60) {
        if (diffX > 0) this.prevProject();
        else this.nextProject();
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevProject();
      if (e.key === 'ArrowRight') this.nextProject();
    });

    this.updateUIBadge();
  }

  updateUIBadge() {
    const badgeText = document.getElementById('project-badge-text');
    const badgeSub = document.getElementById('project-badge-sub');

    const projectInfo = [
      {
        title: 'PROYECTO 1 • LOTE A CABAÑA ECO',
        sub: 'Terreno Virgen ➔ Construcción Sostenible 100% Solar'
      },
      {
        title: 'PROYECTO 2 • HOTEL ABANDONADO A RESORT',
        sub: 'Estructura en Ruinas ➔ Hotel Operativo con Piscina y Rentas 💵'
      },
      {
        title: 'PROYECTO 3 • OBRA GRIS A "EN ALQUILER"',
        sub: 'Torre Residencial ➔ Apartamento Remodelado de Lujo 🔑'
      }
    ];

    const current = projectInfo[this.currentProjectIndex];
    if (badgeText && current) badgeText.textContent = current.title;
    if (badgeSub && current) badgeSub.textContent = current.sub;
  }

  setupEvents() {
    const handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      let w = this.container.clientWidth || this.container.offsetWidth || window.innerWidth;
      let h = this.container.clientHeight || this.container.offsetHeight || (window.innerWidth < 640 ? 440 : 620);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (typeof ResizeObserver !== 'undefined' && this.container) {
      new ResizeObserver(handleResize).observe(this.container);
    }

    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // ==========================================
  // BUCLE DE ANIMACIÓN CONTINUO (2s POR FASE)
  // ==========================================
  animate() {
    requestAnimationFrame(() => this.animate());

    // Auto-recuperación si el canvas arrancó en 0 dimensiones
    if (this.renderer && this.renderer.domElement) {
      const dw = this.renderer.domElement.width;
      const dh = this.renderer.domElement.height;
      if (dw <= 2 || dh <= 2) {
        let w = this.container.clientWidth || this.container.offsetWidth || window.innerWidth;
        let h = this.container.clientHeight || this.container.offsetHeight || (window.innerWidth < 640 ? 440 : 620);
        if (w > 10 && h > 10) {
          this.camera.aspect = w / h;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(w, h);
        }
      }
    }

    const delta = 0.016; // ~60fps
    this.projectCycleTime += delta;

    // Ciclo completo por proyecto: 5.4 segundos
    // 0.0s a 2.0s: Fase A (2 segundos)
    // 2.0s a 2.7s: Transición hacia Fase B (0.7s)
    // 2.7s a 4.7s: Fase B (2 segundos)
    // 4.7s a 5.4s: Transición hacia Fase A (0.7s)
    const cycleTotal = 5.4;
    const t = this.projectCycleTime % cycleTotal;
    const cycleNorm = t / cycleTotal;

    let transitionValue = 0;
    if (t < 2.0) {
      transitionValue = 0;
    } else if (t < 2.7) {
      const progress = (t - 2.0) / 0.7;
      transitionValue = progress * progress * (3 - 2 * progress);
    } else if (t < 4.7) {
      transitionValue = 1;
    } else {
      const progress = (t - 4.7) / 0.7;
      transitionValue = 1 - progress * progress * (3 - 2 * progress);
    }

    // Aplicar transición al proyecto activo
    const activeProject = this.projects[this.currentProjectIndex];
    if (activeProject && activeProject.setTransition) {
      activeProject.setTransition(transitionValue);
    }

    // Manejo de zoom cinemático para el Proyecto 3
    if (this.currentProjectIndex === 2 && activeProject.getCameraTarget) {
      const camTarget = activeProject.getCameraTarget(cycleNorm);
      this.targetCamPos = camTarget.pos;
      this.targetLookY = camTarget.lookY;
    }

    // Transición suave de cámara
    if (this.targetCamPos) {
      this.camera.position.lerp(this.targetCamPos, 0.04);
      if (this.targetLookY !== undefined) {
        this.controls.target.y += (this.targetLookY - this.controls.target.y) * 0.04;
      }
      if (this.camera.position.distanceTo(this.targetCamPos) < 0.06) {
        this.targetCamPos = null;
      }
    }

    // Giro orbital suave continuo
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

if (typeof document !== 'undefined') {
  const initApp = () => {
    const el = document.getElementById('canvas-container') || document.getElementById('interactive-3d-canvas-wrap');
    if (el && !el.dataset.initialized) {
      el.dataset.initialized = 'true';
      new Viewer3DApp(el);
    }
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
