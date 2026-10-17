import * as THREE from 'three';
import { createCinderBlockTexture, createParquetTexture, createWoodTexture } from './textures.js';

/**
 * PROYECTO 3: Edificio Residencial Alto ➔ Zoom Cinemático con Aislamiento de Apartamento ➔ Obra Gris ➔ Remodelado "EN ALQUILER"
 * 1. Muestra la torre residencial de 5 pisos con marco de enfoque en la unidad protagonista.
 * 2. Al hacer zoom, la torre se desvanece y SE AISLA EXCLUSIVAMENTE EL CUBÍCULO DEL APARTAMENTO en el centro.
 * 3. Se aprecia en obra gris: suelo rústico de cemento, paredes de cemento crudo, cables colgados y cubeta.
 * 4. Se remodela por completo: pisos de madera pulida, paredes de diseño, cama queen amoblada, lámparas cálidas y planta.
 * 5. Aparece centrado y destacado en primer plano el cartel: "🔑 EN ALQUILER".
 */
export class ProjectRoomRemodel {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'project-3-tower-room-remodel';

    this.cinderTex = createCinderBlockTexture();
    this.parquetTex = createParquetTexture();
    this.woodTex = createWoodTexture();

    this.buildBaseTerrain();
    this.buildResidentialTower();
    this.buildIsolatedCubicle();
    this.buildForRentSign();

    this.setTransition(0);
  }

  buildBaseTerrain() {
    this.groundGroup = new THREE.Group();
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x487a2d, roughness: 0.85 });
    const ground = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 10), grassMat);
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    this.groundGroup.add(ground);

    const paveMat = new THREE.MeshStandardMaterial({ color: 0xded8cc, roughness: 0.6 });
    const walkway = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.04, 3.5), paveMat);
    walkway.position.set(0, 0.02, 3.2);
    walkway.receiveShadow = true;
    this.groundGroup.add(walkway);

    this.group.add(this.groundGroup);
  }

  // ==========================================
  // 1. TORRE RESIDENCIAL ALTA (5 PISOS)
  // ==========================================
  buildResidentialTower() {
    this.towerGroup = new THREE.Group();
    this.towerGroup.position.set(-0.5, 0, -0.5);

    const floors = 5;
    const floorH = 1.25;
    const tWidth = 6.0;
    const tDepth = 5.2;

    const facadeMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.45 });
    const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x1f2328, roughness: 0.3, metalness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x98d4eb,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.8
    });

    // Forjados horizontales de cada planta
    for (let f = 0; f <= floors; f++) {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(tWidth + 0.4, 0.12, tDepth + 0.4),
        facadeMat
      );
      slab.position.set(0, f * floorH + 0.06, 0);
      slab.castShadow = true;
      slab.receiveShadow = true;
      this.towerGroup.add(slab);
    }

    // Pared trasera y lateral izquierda
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(tWidth, floors * floorH, 0.2),
      facadeMat
    );
    backWall.position.set(0, (floors * floorH) / 2, -tDepth / 2 + 0.1);
    this.towerGroup.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, floors * floorH, tDepth),
      facadeMat
    );
    leftWall.position.set(-tWidth / 2 + 0.1, (floors * floorH) / 2, 0);
    this.towerGroup.add(leftWall);

    // Ventanas y balcones de las otras unidades
    for (let f = 0; f < floors; f++) {
      const y = f * floorH;

      const divider = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, floorH, tDepth),
        facadeMat
      );
      divider.position.set(0, y + floorH / 2, 0);
      this.towerGroup.add(divider);

      // Balcón y ventanal izquierdo
      const winL = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.85), glassMat);
      winL.position.set(-1.4, y + 0.65, tDepth / 2 + 0.02);
      this.towerGroup.add(winL);

      const balcL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.05), darkFrameMat);
      balcL.position.set(-1.4, y + 0.35, tDepth / 2 + 0.2);
      this.towerGroup.add(balcL);

      // Balcones derechos (pisos 0, 2, 3, 4)
      if (f !== 1) {
        const winR = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.85), glassMat);
        winR.position.set(1.4, y + 0.65, tDepth / 2 + 0.02);
        this.towerGroup.add(winR);

        const balcR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.05), darkFrameMat);
        balcR.position.set(1.4, y + 0.35, tDepth / 2 + 0.2);
        this.towerGroup.add(balcR);
      }
    }

    // Marco de enfoque luminoso que resalta el apartamento en la torre
    const highlightGeo = new THREE.BoxGeometry(3.0, 1.3, 2.7);
    const highlightEdges = new THREE.EdgesGeometry(highlightGeo);
    this.focusBox = new THREE.LineSegments(
      highlightEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
    );
    this.focusBox.position.set(1.4, 1.25 + 0.65, 1.25);
    this.towerGroup.add(this.focusBox);

    this.group.add(this.towerGroup);
  }

  // ==========================================
  // 2. CUBÍCULO DEL APARTAMENTO AISLADO
  // Centrado en el origen (0,0,0) para encuadre cinematográfico
  // ==========================================
  buildIsolatedCubicle() {
    this.cubicleGroup = new THREE.Group();
    // Posición inicial aislada en el centro
    this.cubicleGroup.position.set(0, 0, 0);

    const w = 3.6;
    const d = 3.2;
    const h = 2.0;

    // --- ESTADO A: OBRA GRIS (Paredes de cemento, piso de cemento) ---
    this.obraGris = new THREE.Group();

    // Suelo de hormigón crudo rústico
    const rawFloorMat = new THREE.MeshStandardMaterial({
      color: 0x5a5d61,
      roughness: 0.95
    });
    const floorRaw = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), rawFloorMat);
    floorRaw.position.set(0, -0.05, 0);
    floorRaw.receiveShadow = true;
    this.obraGris.add(floorRaw);

    // Pared trasera y lateral de bloques de cemento
    const cinderMat = new THREE.MeshStandardMaterial({
      map: this.cinderTex,
      roughness: 0.95
    });

    const backWallRaw = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), cinderMat);
    backWallRaw.position.set(0, h / 2, -d / 2);
    backWallRaw.receiveShadow = true;
    this.obraGris.add(backWallRaw);

    const leftWallRaw = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), cinderMat);
    leftWallRaw.position.set(-w / 2, h / 2, 0);
    leftWallRaw.receiveShadow = true;
    this.obraGris.add(leftWallRaw);

    // Pilar estructural de hormigón
    const pillarRaw = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, h, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x4f5255, roughness: 0.95 })
    );
    pillarRaw.position.set(w / 2 - 0.175, h / 2, d / 2 - 0.175);
    this.obraGris.add(pillarRaw);

    // Tubería eléctrica y cable colgando con bombilla de obra
    const conduit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, w * 0.8, 6),
      new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    conduit.rotation.z = Math.PI / 2;
    conduit.position.set(0, h - 0.08, -0.6);
    this.obraGris.add(conduit);

    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.45, 4),
      new THREE.MeshBasicMaterial({ color: 0xf97316 })
    );
    wire.position.set(0.3, h - 0.28, -0.6);
    this.obraGris.add(wire);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffeedd })
    );
    bulb.position.set(0.3, h - 0.52, -0.6);
    this.obraGris.add(bulb);

    // Cubeta y espátula de obra en el suelo
    const bucket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.11, 0.28, 8),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d4, roughness: 0.8 })
    );
    bucket.position.set(0.7, 0.14, 0.4);
    this.obraGris.add(bucket);

    this.cubicleGroup.add(this.obraGris);

    // --- ESTADO B: REMODELADO DE LUJO ---
    this.luxury = new THREE.Group();

    // Suelo de parquet pulido
    const parquetMat = new THREE.MeshStandardMaterial({
      map: this.parquetTex,
      roughness: 0.35
    });
    const floorLux = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), parquetMat);
    floorLux.position.set(0, -0.04, 0);
    floorLux.receiveShadow = true;
    this.luxury.add(floorLux);

    // Paredes de blanco cálido con panel acústico de listones de madera
    const wallLuxMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.4 });
    const backWallLux = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), wallLuxMat);
    backWallLux.position.set(0, h / 2, -d / 2);
    this.luxury.add(backWallLux);

    const leftWallLux = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), wallLuxMat);
    leftWallLux.position.set(-w / 2, h / 2, 0);
    this.luxury.add(leftWallLux);

    // Panel decorativo de madera en cabecero
    const woodPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, h * 0.85, 0.05),
      new THREE.MeshStandardMaterial({ map: this.woodTex, roughness: 0.6 })
    );
    woodPanel.position.set(-0.2, h / 2, -d / 2 + 0.08);
    this.luxury.add(woodPanel);

    // Cama de matrimonio moderna de diseño
    const bedBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.24, 1.7),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    bedBase.position.set(-0.2, 0.18, -0.4);
    bedBase.castShadow = true;
    this.luxury.add(bedBase);

    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.22, 1.6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    mattress.position.set(-0.2, 0.38, -0.4);
    this.luxury.add(mattress);

    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(1.42, 0.12, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xbfdbfe, roughness: 0.6 })
    );
    duvet.position.set(-0.2, 0.48, -0.15);
    this.luxury.add(duvet);

    // Almohadas blancas
    [-0.55, 0.15].forEach(px => {
      const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.14, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      pillow.position.set(px, 0.55, -1.05);
      pillow.rotation.x = 0.25;
      this.luxury.add(pillow);
    });

    // Mesitas de noche flotantes con lámparas de luz cálida
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
    [-1.2, 0.8].forEach(x => {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.3), standMat);
      stand.position.set(x, 0.2, -1.0);
      this.luxury.add(stand);

      const lamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xfff3d1 })
      );
      lamp.position.set(x, 0.41, -1.0);
      this.luxury.add(lamp);

      // Luz cálida acogedora
      const lampLight = new THREE.PointLight(0xffbe76, 1.5, 3.5);
      lampLight.position.set(x, 0.55, -1.0);
      this.luxury.add(lampLight);
    });

    // Planta tropical en maceta blanca
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.12, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    pot.position.set(1.2, 0.2, 0.8);
    this.luxury.add(pot);

    const plant = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.26, 1),
      new THREE.MeshStandardMaterial({ color: 0x22771d, roughness: 0.7 })
    );
    plant.position.set(1.2, 0.5, 0.8);
    this.luxury.add(plant);

    this.cubicleGroup.add(this.luxury);
    this.group.add(this.cubicleGroup);
  }

  // ==========================================
  // 3. CARTEL DESTACADO: "EN ALQUILER"
  // Centrado y en primer plano
  // ==========================================
  buildForRentSign() {
    this.signGroup = new THREE.Group();
    // Posicionado flotando al frente del cubículo, a la altura perfecta sin cortes
    this.signGroup.position.set(0.1, 2.05, 0.85);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');

    // Fondo azul marino oscuro con degradado premium
    const grad = ctx.createLinearGradient(0, 0, 512, 150);
    grad.addColorStop(0, '#0b1329');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 150);

    // Doble marco dorado
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 138);

    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, 488, 126);

    // Texto destacado
    ctx.fillStyle = '#fbbf24'; // Oro brillante
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔑 EN ALQUILER', 256, 65);

    ctx.fillStyle = '#38bdf8'; // Cian
    ctx.font = '700 24px sans-serif';
    ctx.fillText('100% AMOBLADO • ROI +24%', 256, 105);

    ctx.fillStyle = '#34d399'; // Esmeralda
    ctx.font = '600 18px sans-serif';
    ctx.fillText('LISTO PARA GENERAR RENTAS EN DÓLARES', 256, 132);

    const signTex = new THREE.CanvasTexture(canvas);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.8),
      new THREE.MeshBasicMaterial({ map: signTex, transparent: true, side: THREE.DoubleSide })
    );
    this.signGroup.add(signMesh);

    this.luxury.add(this.signGroup);
  }

  /**
   * Control de animación por fases (t de 0.0 a 1.0 a lo largo del ciclo)
   * @param {number} tProgreso del ciclo completo
   */
  setTransition(t) {
    // Si la cámara está en zoom (t > 0.25), se aisla el cubículo
    const isZoomed = (t >= 0.25 && t <= 0.85);

    if (isZoomed) {
      // AISLAR EL CUBÍCULO: Ocultar torre completa y suelo exterior
      this.towerGroup.visible = false;
      this.groundGroup.visible = false;
      this.cubicleGroup.visible = true;
      this.cubicleGroup.position.set(0, 0, 0);

      // Progreso de remodelación del cubículo:
      // Entre 0.25 y 0.45: Obra gris
      // Entre 0.45 y 0.60: Ola de remodelación
      // Entre 0.60 y 0.85: Remodelado con cartel "EN ALQUILER"
      if (t < 0.45) {
        this.obraGris.visible = true;
        this.luxury.visible = false;
        this.obraGris.scale.set(1, 1, 1);
      } else if (t >= 0.60) {
        this.obraGris.visible = false;
        this.luxury.visible = true;
        this.luxury.scale.set(1, 1, 1);
      } else {
        // Transición de remodelación suave
        const remProg = (t - 0.45) / 0.15;
        this.obraGris.visible = true;
        this.luxury.visible = true;
        this.luxury.scale.set(remProg, remProg, remProg);
        this.obraGris.scale.set(1 - remProg * 0.4, 1 - remProg * 0.4, 1 - remProg * 0.4);
      }

      // Leve flotación del cartel "EN ALQUILER"
      if (this.signGroup) {
        this.signGroup.position.y = 2.05 + Math.sin(performance.now() * 0.003) * 0.04;
      }
    } else {
      // VISTA DE LA TORRE RESIDENCIAL COMPLETA
      this.towerGroup.visible = true;
      this.groundGroup.visible = true;
      this.cubicleGroup.visible = false; // El cubículo se integra dentro de la torre

      if (this.focusBox) {
        this.focusBox.visible = true;
        this.focusBox.material.opacity = 0.5 + Math.sin(performance.now() * 0.005) * 0.4;
      }
    }
  }

  /**
   * Retorna las coordenadas de cámara según la fase del ciclo
   */
  getCameraTarget(normTime) {
    // normTime de 0.0 a 1.0
    // 0.0 a 0.25: Vista de la torre residencial completa
    // 0.25 a 0.85: Zoom cinemático dentro del cubículo aislado
    // 0.85 a 1.0: Regreso a la vista de la torre
    if (normTime < 0.22) {
      return {
        pos: new THREE.Vector3(14, 11, 14),
        lookY: 2.8
      };
    } else if (normTime >= 0.25 && normTime <= 0.85) {
      // Encuadre óptimo del cubículo aislado
      return {
        pos: new THREE.Vector3(4.2, 2.8, 4.2),
        lookY: 0.9
      };
    } else {
      // Transición de regreso a la torre
      return {
        pos: new THREE.Vector3(14, 11, 14),
        lookY: 2.8
      };
    }
  }
}
