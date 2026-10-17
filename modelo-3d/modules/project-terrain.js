import * as THREE from 'three';
import { createStrataTexture, createGrassTexture, createWoodTexture, createSolarTexture } from './textures.js';

/**
 * PROYECTO 1: Terreno Virgen ➔ Construcción Eco-Sostenible
 * Bloque geológico que transiciona entre naturaleza virgen y cabaña modular ecológica 100% solar.
 */
export class ProjectTerrainEco {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'project-1-terrain-eco';

    this.strataTex = createStrataTexture();
    this.grassTex = createGrassTexture();
    this.woodTex = createWoodTexture();
    this.solarTex = createSolarTexture();

    this.buildTerrainBase();
    this.buildWildNature();
    this.buildEcoCabin();
    this.buildStatusBadge();

    this.setTransition(0);
  }

  buildTerrainBase() {
    // Bloque isométrico 10x10x3
    const strataMat = new THREE.MeshStandardMaterial({
      map: this.strataTex,
      roughness: 0.9,
      metalness: 0.05
    });

    const grassMat = new THREE.MeshStandardMaterial({
      map: this.grassTex,
      roughness: 0.8
    });

    const bottomMat = new THREE.MeshBasicMaterial({ color: 0x24201c });

    const materials = [
      strataMat, strataMat, grassMat, bottomMat, strataMat, strataMat
    ];

    this.terrainMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 3, 10), materials);
    this.terrainMesh.position.y = -1.5;
    this.terrainMesh.receiveShadow = true;
    this.terrainMesh.castShadow = true;
    this.group.add(this.terrainMesh);

    // Hitos perimetrales topográficos
    this.surveyPegs = new THREE.Group();
    const pegGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6);
    const pegMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2, metalness: 0.8 });
    const corners = [[-4.7, -4.7], [4.7, -4.7], [4.7, 4.7], [-4.7, 4.7]];
    corners.forEach(([x, z]) => {
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(x, 0.25, z);
      this.surveyPegs.add(peg);
    });
    this.group.add(this.surveyPegs);
  }

  buildWildNature() {
    this.wildGroup = new THREE.Group();

    // Matorrales y piedras silvestres
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x3d6820, roughness: 0.9, flatShading: true });
    const bushPos = [
      [-2.5, -2.0, 0.5], [1.8, -2.2, 0.4], [-1.0, 1.2, 0.6], [2.5, 2.0, 0.45], [-3.2, 2.2, 0.5]
    ];

    bushPos.forEach(([x, z, s]) => {
      const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 1), bushMat);
      bush.position.set(x, s * 0.7, z);
      bush.castShadow = true;
      this.wildGroup.add(bush);
    });

    // Pequeñas piedras
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x88847e, roughness: 0.9 });
    for (let i = 0; i < 15; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09 + Math.random() * 0.08, 0), rockMat);
      rock.position.set((Math.random() - 0.5) * 8.5, 0.06, (Math.random() - 0.5) * 8.5);
      this.wildGroup.add(rock);
    }

    this.group.add(this.wildGroup);
  }

  buildEcoCabin() {
    this.cabinGroup = new THREE.Group();
    this.cabinGroup.position.set(0, 0, -0.5);

    const woodMat = new THREE.MeshStandardMaterial({ map: this.woodTex, roughness: 0.6 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x24282e, roughness: 0.4, metalness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xdbeef5, transparent: true, opacity: 0.6, roughness: 0.1 });

    // 1. Módulos de la cabaña
    const woodBlock = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.5, 2.5), woodMat);
    woodBlock.position.set(-0.8, 1.25, 0);
    woodBlock.castShadow = true;
    this.cabinGroup.add(woodBlock);

    const darkBlock = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.5, 2.5), darkMat);
    darkBlock.position.set(1.5, 1.25, 0);
    darkBlock.castShadow = true;
    this.cabinGroup.add(darkBlock);

    // 2. Puerta corrediza de vidrio y ventanales
    const glassDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.0), glassMat);
    glassDoor.position.set(0.2, 1.15, 1.26);
    this.cabinGroup.add(glassDoor);

    const winL = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.8), glassMat);
    winL.position.set(-1.4, 1.2, 1.26);
    this.cabinGroup.add(winL);

    // 3. Techo con paneles solares
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 2.9), darkMat);
    roofSlab.position.set(0, 2.56, 0);
    roofSlab.rotation.x = -0.04;
    roofSlab.castShadow = true;
    this.cabinGroup.add(roofSlab);

    const solarPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 2.6),
      new THREE.MeshStandardMaterial({ map: this.solarTex, roughness: 0.2, metalness: 0.8 })
    );
    solarPanel.position.set(0, 2.63, 0);
    solarPanel.rotation.x = -Math.PI / 2 - 0.04;
    this.cabinGroup.add(solarPanel);

    // 4. Deck de madera frontal y escalón
    const deck = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.15, 1.3), woodMat);
    deck.position.set(0.3, 0.075, 1.9);
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.cabinGroup.add(deck);

    // 5. Planta tropical en maceta sobre el deck
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.25, 8), new THREE.MeshStandardMaterial({ color: 0xd97736 }));
    pot.position.set(-0.6, 0.28, 1.9);
    this.cabinGroup.add(pot);

    const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), new THREE.MeshStandardMaterial({ color: 0x2e6e22 }));
    plant.position.set(-0.6, 0.46, 1.9);
    this.cabinGroup.add(plant);

    // 6. Luz interior cálida
    const light = new THREE.PointLight(0xffb050, 2.0, 4);
    light.position.set(0, 1.5, 0.3);
    this.cabinGroup.add(light);

    this.group.add(this.cabinGroup);
  }

  buildStatusBadge() {
    this.badgeGroup = new THREE.Group();
    this.badgeGroup.position.set(0, 3.8, 0);
    this.group.add(this.badgeGroup);
  }

  /**
   * Transición animada entre Estado A (Terreno, t=0) y Estado B (Cabaña, t=1)
   * @param {number} t Valor entre 0.0 y 1.0
   */
  setTransition(t) {
    t = Math.max(0, Math.min(1, t));

    if (t < 0.01) {
      this.cabinGroup.visible = false;
      this.wildGroup.visible = true;
      this.surveyPegs.visible = true;
      this.wildGroup.scale.set(1, 1, 1);
    } else if (t > 0.99) {
      this.cabinGroup.visible = true;
      this.wildGroup.visible = false;
      this.surveyPegs.visible = false;
      this.cabinGroup.position.y = 0;
      this.cabinGroup.scale.set(1, 1, 1);
    } else {
      this.cabinGroup.visible = true;
      this.wildGroup.visible = true;
      this.surveyPegs.visible = t < 0.3;

      // Descenso de la cabaña con rebote suave
      const dropY = (1 - t) * 3.5;
      this.cabinGroup.position.y = dropY;
      const s = Math.min(1, t * 1.05);
      this.cabinGroup.scale.set(s, s, s);

      // Reducción suave de la maleza
      const wildScale = Math.max(0, 1 - t * 1.5);
      this.wildGroup.scale.set(wildScale, wildScale, wildScale);
    }
  }
}
