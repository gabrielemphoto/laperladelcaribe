import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ProjectTerrainEco } from './modules/project-terrain.js';
import { ProjectHotelRemodel } from './modules/project-hotel.js';
import { ProjectRoomRemodel } from './modules/project-room.js';

/**
 * Visor 3D Interactivo Ultraligero y Optimizado
 * - 100% Integrado en la landing page (sin ventanas rígidas ni iframes obligatorios)
 * - Fondo 100% transparente para fundirse con la estética luxury
 * - 3 Proyectos animados en bucle continuo (2s por fase)
 * - Navegación intuitiva con 2 flechas laterales (⬅️ / ➡️) y swipe táctil
 * - Giro continuo interactivo (auto-rotación constante + control táctil/ratón)
 */
export class Viewer3DApp {
  constructor(containerOrId = 'canvas-container') {
    if (typeof containerOrId === 'string') {
      this.container = document.getElementById(containerOrId);
    } else {
      this.container = containerOrId;
    }

    if (!this.container) {
      console.warn('Viewer3DApp: Contenedor no encontrado:', containerOrId);
      return;
    }

    this.currentProjectIndex = 0; // 0: Terreno->Eco, 1: Hotel->Resort, 2: ObraGris->Alquiler
    this.projectCycleTime = 0; // Temporizador del bucle

    this.initThree();
    this.initLighting();
    this.initProjects();
    this.initUI();
    this.setupEvents();

    this.animate();
  }

  // ==========================================
  // INICIALIZACIÓN THREE.JS (FONDO TRANSPARENTE & COMPATIBILIDAD MÓVIL)
  // ==========================================
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = null; // 100% Transparente

    // Dimensiones robustas con fallbacks para móviles
    let w = this.container.clientWidth;
    let h = this.container.clientHeight;
    if (!w || !h || w <= 0 || h <= 0) {
      w = this.container.offsetWidth || window.innerWidth || 800;
      h = this.container.offsetHeight || (window.innerWidth < 640 ? 440 : 620);
    }

    const aspect = w / h;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 80);
    this.camera.position.set(13, 10, 13);

    // Renderer con canal alfa y máxima estabilidad en GPUs móviles
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'default',
      failIfMajorPerformanceCaveat: false
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setClearColor(0x000000, 0); // Transparencia total
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Limpiar cualquier canvas previo
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    // Controles orbitales interactivos con auto-rotación
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.5, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 28;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.85;

    // Sombra de contacto suave sobre fondo transparente
    const shadowGeo = new THREE.PlaneGeometry(30, 30);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -1.52;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);
  }

  // ==========================================
  // ILUMINACIÓN REALISTA OPTIMIZADA
  // ==========================================
  initLighting() {
    this.lights = new THREE.Group();

    // Luz ambiental suave caribeña
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
    hemiLight.position.set(0, 20, 0);
    this.lights.add(hemiLight);

    // Sol direccional principal con sombras optimizadas
    this.sunLight = new THREE.DirectionalLight(0xfff7e6, 1.8);
    this.sunLight.position.set(12, 16, 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 40;
    this.sunLight.shadow.bias = -0.0001;

    const d = 8;
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
      new ProjectRoomRemodel()    // Proyecto 2: Habitación Obra Gris -> Remodelada "EN ALQUILER"
    ];

    this.projects.forEach((proj, idx) => {
      proj.group.visible = (idx === this.currentProjectIndex);
      this.scene.add(proj.group);
    });

    this.updateCameraForProject(this.currentProjectIndex);
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

    // Reiniciar ciclo de tiempo para empezar desde la fase A
    this.projectCycleTime = 0;
    this.updateCameraForProject(newIndex);
    this.updateUIBadge();
  }

  updateCameraForProject(index) {
    if (index === 2) {
      // Proyecto 3 (Habitación): Cámara más cercana con ángulo interior
      this.targetCamPos = new THREE.Vector3(6.5, 4.8, 7.2);
      this.targetLookY = 1.3;
      this.shadowPlane.position.y = -0.12;
    } else {
      // Proyectos 1 y 2 (Terreno / Hotel): Vista general isométrica
      this.targetCamPos = new THREE.Vector3(13, 10, 13);
      this.targetLookY = 0.5;
      this.shadowPlane.position.y = -1.52;
    }
  }

  // ==========================================
  // INTERFAZ DE USUARIO: FLECHAS Y GESTOS
  // ==========================================
  initUI() {
    const btnPrev = document.getElementById('btn-arrow-prev');
    const btnNext = document.getElementById('btn-arrow-next');

    if (btnPrev) {
      btnPrev.onclick = (e) => {
        e.stopPropagation();
        this.prevProject();
      };
    }

    if (btnNext) {
      btnNext.onclick = (e) => {
        e.stopPropagation();
        this.nextProject();
      };
    }

    // Deslizamiento táctil horizontal sobre el contenedor
    let touchStartX = 0;
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diffX) > 60) {
        if (diffX > 0) this.prevProject();
        else this.nextProject();
      }
    }, { passive: true });

    // Navegación con teclado
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
        title: 'PROYECTO 1 • TERRENO VIRGEN A CABAÑA MODULAR',
        sub: 'Lote Virgen de 500 m² ➔ Cabaña Bioclimática 100% Autosuficiente'
      },
      {
        title: 'PROYECTO 2 • HOTEL ABANDONADO A RESORT BOUTIQUE',
        sub: 'Estructura en Ruinas ➔ Hotel Operativo con Piscina Infinity y Rentas'
      },
      {
        title: 'PROYECTO 3 • OBRA GRIS A SUITE DE DISEÑO',
        sub: 'Paredes en Cemento Pelado ➔ Apartamento de Diseño Listo para Alquilar'
      }
    ];

    const current = projectInfo[this.currentProjectIndex];
    if (badgeText && current) badgeText.textContent = current.title;
    if (badgeSub && current) badgeSub.textContent = current.sub;
  }

  setupEvents() {
    const handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      let w = this.container.clientWidth;
      let h = this.container.clientHeight;
      if (!w || !h || w <= 0 || h <= 0) {
        w = this.container.offsetWidth || window.innerWidth || 800;
        h = this.container.offsetHeight || (window.innerWidth < 640 ? 440 : 620);
      }
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    if (typeof ResizeObserver !== 'undefined' && this.container) {
      this.resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      this.resizeObserver.observe(this.container);
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

    const cycleTotal = 5.4;
    const t = this.projectCycleTime % cycleTotal;

    let transitionValue = 0;
    if (t < 2.0) {
      transitionValue = 0; // Fase A pura (Terreno / Ruinas / Obra Gris)
    } else if (t < 2.7) {
      const progress = (t - 2.0) / 0.7;
      transitionValue = progress * progress * (3 - 2 * progress); // Easing suave
    } else if (t < 4.7) {
      transitionValue = 1; // Fase B pura (Eco / Resort / En Alquiler)
    } else {
      const progress = (t - 4.7) / 0.7;
      transitionValue = 1 - progress * progress * (3 - 2 * progress);
    }

    if (this.projects && this.projects[this.currentProjectIndex]) {
      const activeProject = this.projects[this.currentProjectIndex];
      if (activeProject.setTransition) {
        activeProject.setTransition(transitionValue);
      }
    }

    if (this.targetCamPos) {
      this.camera.position.lerp(this.targetCamPos, 0.05);
      if (this.targetLookY !== undefined) {
        this.controls.target.y += (this.targetLookY - this.controls.target.y) * 0.05;
      }
      if (this.camera.position.distanceTo(this.targetCamPos) < 0.08) {
        this.targetCamPos = null;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Inicialización automática si se carga directamente en modelo-3d/index.html
if (typeof document !== 'undefined') {
  const initSelf = () => {
    const standaloneEl = document.getElementById('canvas-container');
    if (standaloneEl) {
      new Viewer3DApp(standaloneEl);
    }
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initSelf);
  } else {
    initSelf();
  }
}
