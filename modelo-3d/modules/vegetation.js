import * as THREE from 'three';

/**
 * Módulo de Vegetación y Paisajismo
 * Crea vegetación silvestre para la Fase 1 (terreno natural)
 * y palmeras caribeñas, setos podados y jardinería para la Fase 3.
 */
export class VegetationSystem {
  constructor() {
    this.wildGroup = new THREE.Group();
    this.wildGroup.name = 'wild-vegetation';

    this.resortGroup = new THREE.Group();
    this.resortGroup.name = 'resort-vegetation';

    this.buildWildNature();
    this.buildResortLandscape();
  }

  // ==========================================
  // FASE 1: VEGETACIÓN SILVESTRE NATURAL
  // ==========================================
  buildWildNature() {
    // 1. Matas y briznas de hierba silvestre alta
    const weedMat = new THREE.MeshStandardMaterial({
      color: 0x4d8029,
      roughness: 0.8,
      side: THREE.DoubleSide
    });

    const weedGeo = new THREE.ConeGeometry(0.12, 0.45, 4);

    for (let i = 0; i < 45; i++) {
      const weedCluster = new THREE.Group();
      const numBlades = 4 + Math.floor(Math.random() * 5);

      for (let b = 0; b < numBlades; b++) {
        const blade = new THREE.Mesh(weedGeo, weedMat);
        blade.position.set(
          (Math.random() - 0.5) * 0.25,
          0.22,
          (Math.random() - 0.5) * 0.25
        );
        blade.rotation.set(
          (Math.random() - 0.5) * 0.5,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.5
        );
        blade.castShadow = true;
        weedCluster.add(blade);
      }

      // Posicionamiento sobre el terreno de 9x9 (dejando margen)
      weedCluster.position.set(
        (Math.random() - 0.5) * 8.8,
        0,
        (Math.random() - 0.5) * 8.8
      );
      this.wildGroup.add(weedCluster);
    }

    // 2. Matorrales bajos redondeados (como en la Imagen 1)
    const bushMat = new THREE.MeshStandardMaterial({
      color: 0x3f6b21,
      roughness: 0.9,
      flatShading: true
    });

    const bushPositions = [
      { x: -2.8, z: -1.8, s: 0.45 },
      { x: 1.5, z: -2.2, s: 0.35 },
      { x: -1.0, z: 0.5, s: 0.55 },
      { x: 2.2, z: 1.4, s: 0.4 },
      { x: -3.2, z: 2.6, s: 0.5 },
      { x: 0.8, z: -3.6, s: 0.4 }
    ];

    bushPositions.forEach(pos => {
      const bushGroup = new THREE.Group();
      const pieces = 3 + Math.floor(Math.random() * 3);
      for (let p = 0; p < pieces; p++) {
        const rad = pos.s * (0.6 + Math.random() * 0.5);
        const sphere = new THREE.Mesh(new THREE.DodecahedronGeometry(rad, 1), bushMat);
        sphere.position.set(
          (Math.random() - 0.5) * pos.s * 0.7,
          rad * 0.7,
          (Math.random() - 0.5) * pos.s * 0.7
        );
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        bushGroup.add(sphere);
      }
      bushGroup.position.set(pos.x, 0, pos.z);
      this.wildGroup.add(bushGroup);
    });

    // 3. Pequeñas rocas sueltas en la superficie
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x8a857e,
      roughness: 0.9,
      flatShading: true
    });

    for (let r = 0; r < 20; r++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.08 + Math.random() * 0.1, 0),
        rockMat
      );
      rock.position.set(
        (Math.random() - 0.5) * 8.5,
        0.05,
        (Math.random() - 0.5) * 8.5
      );
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      this.wildGroup.add(rock);
    }
  }

  // ==========================================
  // FASE 3: PAISAJISMO TROPICAL DE RESORT
  // ==========================================
  buildResortLandscape() {
    // 1. Palmeras caribeñas icónicas (como en la Imagen 3)
    const palmLocations = [
      { x: 4.1, z: -3.8, h: 4.2, rot: 0.2 },
      { x: 3.5, z: -4.3, h: 3.7, rot: -0.3 },
      { x: 4.5, z: -2.2, h: 4.5, rot: 0.1 },
      { x: 4.3, z: 0.2, h: 3.9, rot: 0.4 }
    ];

    palmLocations.forEach(loc => {
      const palm = this.createPalmTree(loc.h, loc.rot);
      palm.position.set(loc.x, 0, loc.z);
      this.resortGroup.add(palm);
    });

    // 2. Árboles frondosos de sombra (lateral izquierdo junto al estacionamiento)
    const shadeTreeLocations = [
      { x: -4.2, z: -1.2, r: 1.1, h: 2.8 },
      { x: -4.3, z: -3.2, r: 1.3, h: 3.2 }
    ];

    shadeTreeLocations.forEach(loc => {
      const tree = this.createShadeTree(loc.r, loc.h);
      tree.position.set(loc.x, 0, loc.z);
      this.resortGroup.add(tree);
    });

    // 3. Setos verdes perimetrales podados (Setos rectangulares densos)
    const hedgeMat = new THREE.MeshStandardMaterial({
      color: 0x2e5c1e,
      roughness: 0.85,
      metalness: 0.05
    });

    // Seto separador del estacionamiento
    const parkingHedge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 3.8), hedgeMat);
    parkingHedge.position.set(-2.0, 0.325, 2.7);
    parkingHedge.castShadow = true;
    parkingHedge.receiveShadow = true;
    this.resortGroup.add(parkingHedge);

    // Seto perimetral de la piscina (borde trasero y lateral)
    const poolBackHedge = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.65, 0.4), hedgeMat);
    poolBackHedge.position.set(2.4, 0.325, 0.4);
    poolBackHedge.castShadow = true;
    this.resortGroup.add(poolBackHedge);

    const poolSideHedge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 3.8), hedgeMat);
    poolSideHedge.position.set(0.1, 0.325, 2.5);
    poolSideHedge.castShadow = true;
    this.resortGroup.add(poolSideHedge);

    this.resortGroup.visible = false;
  }

  createPalmTree(height = 4.0, curve = 0.2) {
    const palm = new THREE.Group();

    // Tronco segmentado con sutil curvatura natural
    const segments = 10;
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x735a41,
      roughness: 0.9,
      flatShading: true
    });

    let currY = 0;
    let currX = 0;
    let prevPoint = new THREE.Vector3(0, 0, 0);

    for (let s = 0; s < segments; s++) {
      const segH = height / segments;
      const t = s / segments;
      const radiusBottom = 0.16 * (1 - t * 0.4);
      const radiusTop = 0.14 * (1 - t * 0.4);

      const trunkSeg = new THREE.Mesh(
        new THREE.CylinderGeometry(radiusTop, radiusBottom, segH, 7),
        trunkMat
      );
      
      const nextX = Math.sin(t * 1.5) * curve;
      trunkSeg.position.set((currX + nextX) / 2, currY + segH / 2, 0);
      trunkSeg.rotation.z = -curve * 0.4;
      trunkSeg.castShadow = true;
      palm.add(trunkSeg);

      currY += segH;
      currX = nextX;
    }

    // Racimo de cocos en la corona
    const coconutMat = new THREE.MeshStandardMaterial({ color: 0x54412c, roughness: 0.8 });
    for (let c = 0; c < 5; c++) {
      const coconut = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1, 1), coconutMat);
      coconut.position.set(
        currX + Math.cos(c * 1.2) * 0.15,
        currY - 0.1,
        Math.sin(c * 1.2) * 0.15
      );
      palm.add(coconut);
    }

    // Hojas / Palmeras arqueadas (Fronds)
    const frondMat = new THREE.MeshStandardMaterial({
      color: 0x3d7e22,
      roughness: 0.7,
      side: THREE.DoubleSide
    });

    const frondCount = 14;
    for (let f = 0; f < frondCount; f++) {
      const angle = (f / frondCount) * Math.PI * 2;
      const frond = new THREE.Group();

      // Curva de la hoja con segmentos
      const frondLength = 1.6 + Math.random() * 0.4;
      const leafGeo = new THREE.PlaneGeometry(0.4, frondLength, 1, 4);
      const leafMesh = new THREE.Mesh(leafGeo, frondMat);
      leafMesh.position.set(0, frondLength / 2, 0);
      leafMesh.rotation.x = 0.6 + Math.random() * 0.3; // Inclinación hacia abajo
      leafMesh.castShadow = true;

      frond.add(leafMesh);
      frond.position.set(currX, currY, 0);
      frond.rotation.y = angle;
      frond.rotation.z = (Math.random() - 0.5) * 0.2;
      palm.add(frond);
    }

    return palm;
  }

  createShadeTree(radius = 1.2, height = 3.0) {
    const tree = new THREE.Group();

    // Tronco
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a4332, roughness: 0.9 });
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.25, height * 0.5, 7),
      trunkMat
    );
    trunk.position.y = (height * 0.5) / 2;
    trunk.castShadow = true;
    tree.add(trunk);

    // Copa esférica densa en capas orgánicas
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x3b6623,
      roughness: 0.85,
      flatShading: true
    });

    const clusters = 5;
    for (let i = 0; i < clusters; i++) {
      const ball = new THREE.Mesh(
        new THREE.DodecahedronGeometry(radius * (0.6 + Math.random() * 0.4), 1),
        foliageMat
      );
      ball.position.set(
        (Math.random() - 0.5) * 0.6,
        height * 0.5 + 0.4 + i * 0.35,
        (Math.random() - 0.5) * 0.6
      );
      ball.castShadow = true;
      ball.receiveShadow = true;
      tree.add(ball);
    }

    return tree;
  }

  setPhase(phaseIndex) {
    if (phaseIndex === 0) {
      this.wildGroup.visible = true;
      this.resortGroup.visible = false;
    } else if (phaseIndex === 1) {
      // En la fase de cabaña se reduce la maleza virgen
      this.wildGroup.visible = true;
      this.resortGroup.visible = false;
    } else if (phaseIndex === 2) {
      this.wildGroup.visible = false;
      this.resortGroup.visible = true;
    }
  }
}
