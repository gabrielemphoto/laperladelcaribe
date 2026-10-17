import * as THREE from 'three';
import { createStrataTexture, createStrataBumpMap, createGrassTexture } from './textures.js';

/**
 * Módulo de Terreno Geológico Isométrico
 * Representa el bloque de tierra con corte estratigráfico (Humus, raíces, arcilla y roca madre)
 * y excavación dinámica para la piscina en la Fase 3.
 */
export class TerrainBlock {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'terrain-block';

    this.sizeX = 10;
    this.sizeZ = 10;
    this.height = 3.2; // Profundidad del corte geológico

    // Texturas
    this.strataTexture = createStrataTexture();
    this.strataBumpMap = createStrataBumpMap();
    this.grassTexture = createGrassTexture();

    // Materiales
    this.strataMaterial = new THREE.MeshStandardMaterial({
      map: this.strataTexture,
      bumpMap: this.strataBumpMap,
      bumpScale: 0.08,
      roughness: 0.95,
      metalness: 0.05
    });

    this.grassMaterial = new THREE.MeshStandardMaterial({
      map: this.grassTexture,
      roughness: 0.85,
      metalness: 0.05
    });

    this.bottomMaterial = new THREE.MeshStandardMaterial({
      color: 0x24201c,
      roughness: 1.0
    });

    // Subcomponentes
    this.buildMainBlock();
    this.buildBoundaryPegs();
    this.buildExcavationSystem();
  }

  buildMainBlock() {
    // Geometría del bloque principal
    // Para permitir la excavación elegante de la piscina en la Fase 3 (esquina frontal-derecha),
    // dividimos la superficie superior y el bloque en dos secciones:
    // Zona principal (L invertida que aloja el hotel/cabaña/jardín) y Zona de piscina.
    
    // Cuerpo base profundo (roca y tierra de fondo desde Y = -1.2 hasta Y = -3.2)
    const baseGeo = new THREE.BoxGeometry(this.sizeX, 2.0, this.sizeZ);
    const materials = [
      this.strataMaterial, // +X
      this.strataMaterial, // -X
      this.strataMaterial, // +Y
      this.bottomMaterial, // -Y
      this.strataMaterial, // +Z
      this.strataMaterial  // -Z
    ];
    this.deepBase = new THREE.Mesh(baseGeo, materials);
    this.deepBase.position.y = -2.2;
    this.deepBase.receiveShadow = true;
    this.deepBase.castShadow = true;
    this.group.add(this.deepBase);

    // Cuerpo superior fijo (zona que nunca se excava, izquierda y fondo: Lote L)
    // Dimensiones: 10 x 1.2 x 5.5 en la parte trasera + 5.0 x 1.2 x 4.5 en la parte frontal izquierda
    const upperBackGeo = new THREE.BoxGeometry(10, 1.2, 5.5);
    const upperBackMaterials = [
      this.strataMaterial, // +X
      this.strataMaterial, // -X
      this.grassMaterial,  // +Y (césped)
      this.strataMaterial, // -Y
      this.strataMaterial, // +Z
      this.strataMaterial  // -Z
    ];
    this.upperBack = new THREE.Mesh(upperBackGeo, upperBackMaterials);
    this.upperBack.position.set(0, -0.6, -2.25);
    this.upperBack.receiveShadow = true;
    this.upperBack.castShadow = true;
    this.group.add(this.upperBack);

    const upperLeftFrontGeo = new THREE.BoxGeometry(5.0, 1.2, 4.5);
    this.upperLeftFront = new THREE.Mesh(upperLeftFrontGeo, upperBackMaterials);
    this.upperLeftFront.position.set(-2.5, -0.6, 2.75);
    this.upperLeftFront.receiveShadow = true;
    this.upperLeftFront.castShadow = true;
    this.group.add(this.upperLeftFront);
  }

  buildExcavationSystem() {
    // Zona de excavación de la piscina: Esquina frontal derecha (X: 0 a 5, Z: 0.5 a 5)
    // Ancho: 5.0, Profundidad: 4.5, Altura: 1.2 (desde Y = -1.2 a Y = 0)
    
    // 1. "Tapón" de tierra virgen (Visible en Fase 1 y 2, se excava en Fase 3)
    const plugGeo = new THREE.BoxGeometry(5.0, 1.2, 4.5);
    const plugMaterials = [
      this.strataMaterial, // +X
      this.strataMaterial, // -X
      this.grassMaterial,  // +Y
      this.strataMaterial, // -Y
      this.strataMaterial, // +Z
      this.strataMaterial  // -Z
    ];
    this.soilPlug = new THREE.Mesh(plugGeo, plugMaterials);
    this.soilPlug.position.set(2.5, -0.6, 2.75);
    this.soilPlug.receiveShadow = true;
    this.soilPlug.castShadow = true;
    this.group.add(this.soilPlug);

    // 2. Fosa excavada con muros de hormigón estructural (Visible en Fase 3)
    this.poolPit = new THREE.Group();
    this.poolPit.position.set(2.5, 0, 2.75);
    this.poolPit.visible = false;

    // Suelo interior de la fosa
    const pitFloorGeo = new THREE.BoxGeometry(4.8, 0.1, 4.3);
    const pitFloorMat = new THREE.MeshStandardMaterial({ color: 0x9fa4a6, roughness: 0.8 });
    const pitFloor = new THREE.Mesh(pitFloorGeo, pitFloorMat);
    pitFloor.position.y = -1.15;
    this.poolPit.add(pitFloor);

    // Muros perimetrales interiores de hormigón
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xb5bcc0, roughness: 0.6 });
    
    // Muro trasero de la fosa
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.2, 0.15), wallMat);
    backWall.position.set(0, -0.6, -2.15);
    this.poolPit.add(backWall);

    // Muro izquierdo de la fosa
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 4.3), wallMat);
    leftWall.position.set(-2.4, -0.6, 0);
    this.poolPit.add(leftWall);

    // Borde frontal y lateral de hormigón visto (visible en el corte exterior)
    const exteriorRimFront = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.3, 0.25), wallMat);
    exteriorRimFront.position.set(0, -0.15, 2.25);
    this.poolPit.add(exteriorRimFront);

    const exteriorRimRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 4.5), wallMat);
    exteriorRimRight.position.set(2.45, -0.15, 0);
    this.poolPit.add(exteriorRimRight);

    this.group.add(this.poolPit);
  }

  buildBoundaryPegs() {
    // Hitos topográficos en las 4 esquinas del terreno
    this.boundaryPegs = new THREE.Group();
    const pegGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8);
    const pegMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9, // Cyan reflectivo topográfico
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2
    });

    const corners = [
      { x: -4.85, z: -4.85, label: 'V1 (0.0)' },
      { x: 4.85, z: -4.85, label: 'V2 (10m)' },
      { x: 4.85, z: 4.85, label: 'V3 (10m)' },
      { x: -4.85, z: 4.85, label: 'V4 (0.0)' }
    ];

    corners.forEach(c => {
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(c.x, 0.2, c.z);
      peg.castShadow = true;
      this.boundaryPegs.add(peg);

      // Pequeña placa de cimentación del hito
      const basePlate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.04, 8),
        new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.5 })
      );
      basePlate.position.set(c.x, 0.02, c.z);
      this.boundaryPegs.add(basePlate);
    });

    this.group.add(this.boundaryPegs);
  }

  /**
   * Transición de excavación para la Fase 3
   * @param {number} progress 0.0 (tierra intacta) a 1.0 (totalmente excavado)
   */
  setExcavationProgress(progress) {
    progress = Math.max(0, Math.min(1, progress));

    if (progress <= 0.001) {
      this.soilPlug.visible = true;
      this.soilPlug.position.y = -0.6;
      this.soilPlug.scale.set(1, 1, 1);
      this.poolPit.visible = false;
    } else if (progress >= 0.999) {
      this.soilPlug.visible = false;
      this.poolPit.visible = true;
    } else {
      this.soilPlug.visible = true;
      this.poolPit.visible = true;
      // Baja gradualmente hacia abajo simulando la remoción de tierra
      this.soilPlug.position.y = -0.6 - progress * 1.5;
      this.soilPlug.scale.y = 1 - progress * 0.8;
    }
  }

  showBoundaryPegs(visible) {
    this.boundaryPegs.visible = visible;
  }
}
