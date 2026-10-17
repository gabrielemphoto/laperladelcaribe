import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ProjectTerrainEco } from './modules/project-terrain.js';
import { ProjectHotelRemodel } from './modules/project-hotel.js';
import { ProjectRoomRemodel } from './modules/project-room.js';

/**
 * Visor 3D Interactivo Ultraligero y Optimizado
 * - Fondo 100% transparente
 * - 3 Proyectos animados en bucle continuo (2s por fase)
 * - Navegación exclusiva con 2 flechas laterales (⬅️ / ➡️)
 * - Giro continuo interactivo (auto-rotación constante + control táctil/ratón)
 */
class Viewer3DApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.currentProjectIndex = 0; // 0: Terreno->Eco, 1: Hotel->Resort, 2: ObraGris->Alquiler
    this.projectCycleTime = 0; // Temporizador del bucle de 2s

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
    this.scene.background = null; // 100% Transparente, sin cajas ni fondos

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 80);
    this.camera.position.set(13, 10, 13);

    // Renderer ultraligero con canal alfa transparente
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x000000, 0); // Fondo totalmente transparente
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Controles orbitales interactivos con rotación continua
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.5, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 28;
    this.controls.autoRotate = true; // SIEMPRE en movimiento constante
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
    this.sunLight.shadow.bias = -0.0004;

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
  // INTERFAZ DE USUARIO: SOLO 2 FLECHAS
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

    // Navegación táctil con deslizamiento (swipe horizontal)
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

    // Navegación por teclado (Flecha izquierda / derecha)
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
        title: 'PROYECTO 1 • TERRENO A CONSTRUCCIÓN',
        sub: 'Lote Virgen ➔ Cabaña Modular Autosuficiente'
      },
      {
        title: 'PROYECTO 2 • HOTEL ABANDONADO A RESORT',
        sub: 'Estructura en Ruinas ➔ Hotel de Lujo Generando Rentas 💵'
      },
      {
        title: 'PROYECTO 3 • OBRA GRIS A "EN ALQUILER"',
        sub: 'Paredes Peladas ➔ Suite de Diseño Lista para Alquilar 🔑'
      }
    ];

    const current = projectInfo[this.currentProjectIndex];
    if (badgeText && current) badgeText.textContent = current.title;
    if (badgeSub && current) badgeSub.textContent = current.sub;
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Deshabilitar menú contextual de click derecho para no guardar como imagen
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // ==========================================
  // BUCLE DE ANIMACIÓN CONTINUO (2s POR FASE)
  // ==========================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = 0.016; // ~60fps
    this.projectCycleTime += delta;

    // Ciclo total por proyecto:
    // 0.0s a 2.0s: Fase A fija (2 segundos)
    // 2.0s a 2.7s: Transición suave de A hacia B (0.7 segundos)
    // 2.7s a 4.7s: Fase B fija (2 segundos)
    // 4.7s a 5.4s: Transición suave de B hacia A (0.7 segundos)
    // Bucle continuo
    const cycleTotal = 5.4;
    const t = this.projectCycleTime % cycleTotal;

    let transitionValue = 0;
    if (t < 2.0) {
      transitionValue = 0; // Fase A pura (Terreno / Ruinas / Obra Gris)
    } else if (t < 2.7) {
      // Animando hacia Fase B
      const progress = (t - 2.0) / 0.7;
      transitionValue = progress * progress * (3 - 2 * progress); // Easing suave
    } else if (t < 4.7) {
      transitionValue = 1; // Fase B pura (Eco / Resort / En Alquiler)
    } else {
      // Regresando a Fase A
      const progress = (t - 4.7) / 0.7;
      transitionValue = 1 - progress * progress * (3 - 2 * progress);
    }

    // Aplicar al proyecto activo
    const activeProject = this.projects[this.currentProjectIndex];
    if (activeProject && activeProject.setTransition) {
      activeProject.setTransition(transitionValue);
    }

    // Transición suave de cámara al cambiar de proyecto
    if (this.targetCamPos) {
      this.camera.position.lerp(this.targetCamPos, 0.05);
      if (this.targetLookY !== undefined) {
        this.controls.target.y += (this.targetLookY - this.controls.target.y) * 0.05;
      }
      if (this.camera.position.distanceTo(this.targetCamPos) < 0.08) {
        this.targetCamPos = null;
      }
    }

    // Giro orbital interactivo constante
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

// Inicializar la aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  new Viewer3DApp();
});
