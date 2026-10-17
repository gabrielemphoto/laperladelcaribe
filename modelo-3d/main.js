import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ProjectTerrainEco } from './modules/project-terrain.js';
import { ProjectHotelRemodel } from './modules/project-hotel.js';
import { ProjectRoomRemodel } from './modules/project-room.js';

/**
 * Visor 3D Interactivo Ultraligero y Optimizado
 * - Fondo 100% transparente
 * - Animaciones globales pausadas y elegantes (ciclos de 8s a 11s)
 * - Proyecto 3: Torre alta ➔ Zoom con aislamiento exclusivo del cubículo ➔ Obra Gris ➔ Remodelado "EN ALQUILER"
 * - Giro continuo interactivo majestuoso (autoRotateSpeed calibrado a 0.5)
 * - Navegación exclusiva con 2 flechas laterales (⬅️ / ➡️)
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

    if (this.container.dataset.appInitialized === 'true') {
      return;
    }
    this.container.dataset.appInitialized = 'true';

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
      h = this.container.offsetHeight || (window.innerWidth < 640 ? 440 : 600);
    }

    const aspect = w / h;
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
    this.renderer.setClearColor(0x000000, 0); // Fondo 100% transparente
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    // Controles orbitales con giro suave continuo
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.8, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02;
    this.controls.minDistance = 3.2;
    this.controls.maxDistance = 30;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5; // Giro majestuoso pausado y elegante

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

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x48423a, 1.25);
    hemiLight.position.set(0, 20, 0);
    this.lights.add(hemiLight);

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
      new ProjectRoomRemodel()    // Proyecto 2: Edificio Torre -> Zoom cinemático -> Apartamento Aislado "EN ALQUILER"
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
      // Proyecto 1: Terreno
      this.targetCamPos = new THREE.Vector3(14, 11, 14);
      this.targetLookY = 0.5;
      this.shadowPlane.position.y = -1.52;
    } else if (index === 1) {
      // Proyecto 2: Hotel de 4 plantas
      this.targetCamPos = new THREE.Vector3(15, 12, 15);
      this.targetLookY = 1.6;
      this.shadowPlane.position.y = -1.52;
    } else if (index === 2) {
      // Proyecto 3: Torre y Apartamento
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

    // Swipe táctil
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
        title: 'PROYECTO 1 • TERRENO A CABAÑA ECO',
        sub: 'Lote Virgen ➔ Construcción Sostenible 100% Solar'
      },
      {
        title: 'PROYECTO 2 • HOTEL EN RUINAS A RESORT',
        sub: 'Estructura Abandonada ➔ Hotel Boutique con Piscina y Rentas 💵'
      },
      {
        title: 'PROYECTO 3 • DE OBRA GRIS A ACTIVO EN RENTA',
        sub: 'Torre Residencial ➔ Apartamento de Lujo Remodelado 🔑'
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
      let h = this.container.clientHeight || this.container.offsetHeight || (window.innerWidth < 640 ? 440 : 600);
      if (w > 0 && h > 0) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (typeof ResizeObserver !== 'undefined' && this.container) {
      new ResizeObserver(handleResize).observe(this.container);
    }

    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // ==========================================
  // BUCLE DE ANIMACIÓN PAUSADO Y ELEGANTE
  // ==========================================
  animate() {
    requestAnimationFrame(() => this.animate());

    // Auto-recuperación si el contenedor comenzó con dimensiones 0 (en carga móvil o pestañas en segundo plano)
    if (this.container && this.renderer && this.renderer.domElement) {
      const cw = this.container.clientWidth;
      const ch = this.container.clientHeight;
      if (cw > 0 && ch > 0 && (this.renderer.domElement.width === 0 || this.renderer.domElement.height === 0)) {
        this.camera.aspect = cw / ch;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(cw, ch);
      }
    }

    const delta = 0.016; // ~60fps
    this.projectCycleTime += delta;

    // Duraciones más lentas y apreciables:
    // Proyectos 1 y 2: ciclo de 8.0 segundos
    // Proyecto 3: ciclo de 11.0 segundos (por la secuencia cinemática de zoom y aislamiento)
    const cycleTotal = (this.currentProjectIndex === 2) ? 11.0 : 8.0;
    const t = this.projectCycleTime % cycleTotal;
    const norm = t / cycleTotal;

    const activeProject = this.projects[this.currentProjectIndex];

    if (this.currentProjectIndex === 2) {
      // PROYECTO 3: Secuencia cinemática con aislamiento de cubículo
      if (activeProject && activeProject.setTransition) {
        activeProject.setTransition(norm);
      }

      // Manejo de zoom cinemático
      if (activeProject && activeProject.getCameraTarget) {
        const camTarget = activeProject.getCameraTarget(norm);
        this.targetCamPos = camTarget.pos;
        this.targetLookY = camTarget.lookY;
      }
    } else {
      // PROYECTOS 1 Y 2: Animación más pausada (3.0s fase A, 1.2s transición, 2.8s fase B, 1.0s regreso)
      let transitionValue = 0;
      if (t < 3.0) {
        transitionValue = 0; // Fase A pura (3.0s para apreciar)
      } else if (t < 4.2) {
        const p = (t - 3.0) / 1.2;
        transitionValue = p * p * (3 - 2 * p); // Easing suave
      } else if (t < 7.0) {
        transitionValue = 1; // Fase B pura (2.8s para apreciar)
      } else {
        const p = (t - 7.0) / 1.0;
        transitionValue = 1 - p * p * (3 - 2 * p);
      }

      if (activeProject && activeProject.setTransition) {
        activeProject.setTransition(transitionValue);
      }
    }

    // Transición suave de cámara (tipo toma aérea con dron)
    if (this.targetCamPos) {
      this.camera.position.lerp(this.targetCamPos, 0.035);
      if (this.targetLookY !== undefined) {
        this.controls.target.y += (this.targetLookY - this.controls.target.y) * 0.035;
      }
      if (this.camera.position.distanceTo(this.targetCamPos) < 0.05) {
        this.targetCamPos = null;
      }
    }

    // Giro orbital majestuoso continuo
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

// Auto-inicialización segura si se carga como script directo en modelo-3d/index.html
if (typeof window !== 'undefined') {
  const initViewer = () => {
    const el = document.getElementById('canvas-container') || document.getElementById('interactive-3d-canvas-wrap');
    if (el && el.dataset.appInitialized !== 'true') {
      new Viewer3DApp(el);
    }
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initViewer);
  } else {
    initViewer();
  }
}
