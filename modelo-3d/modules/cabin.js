import * as THREE from 'three';
import { createWoodSlatsTexture, createSolarPanelTexture, createGravelTexture } from './textures.js';

/**
 * Módulo de Cabaña Modular Sustentable (Fase 1 / Imagen 2)
 * Arquitectura modular nórdico-caribeña con paneles de madera de teca,
 * revestimiento de acero antracita, cubierta solar fotovoltaica,
 * terraza de madera, sendero de gravilla, climatización e iluminación cálida.
 */
export class CabinModel {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'cabin-phase';

    this.woodTexture = createWoodSlatsTexture();
    this.solarTexture = createSolarPanelTexture();
    this.gravelTexture = createGravelTexture();

    this.buildCabin();
    this.buildSolarRoof();
    this.buildDeckAndPath();
    this.buildEquipment();

    // Estado inicial
    this.group.visible = false;
  }

  buildCabin() {
    this.cabinBody = new THREE.Group();

    // Materiales
    const woodMat = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.7,
      metalness: 0.05
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x2b3036, // Antracita oscuro
      roughness: 0.4,
      metalness: 0.6
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x111315,
      roughness: 0.3,
      metalness: 0.8
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdff0f8,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.5
    });

    // 1. Módulo de madera (mitad izquierda y centro)
    const woodModuleGeo = new THREE.BoxGeometry(2.8, 2.4, 2.4);
    const woodModule = new THREE.Mesh(woodModuleGeo, woodMat);
    woodModule.position.set(-0.8, 1.2, 0);
    woodModule.castShadow = true;
    woodModule.receiveShadow = true;
    this.cabinBody.add(woodModule);

    // 2. Módulo de metal antracita (tercio derecho)
    const metalModuleGeo = new THREE.BoxGeometry(1.6, 2.4, 2.4);
    const metalModule = new THREE.Mesh(metalModuleGeo, darkMetalMat);
    metalModule.position.set(1.4, 1.2, 0);
    metalModule.castShadow = true;
    metalModule.receiveShadow = true;
    this.cabinBody.add(metalModule);

    // 3. Ventanales de vidrio corredizos (Frontal)
    // Gran puerta corredera de cristal con marco negro
    const glassDoorGeo = new THREE.PlaneGeometry(1.6, 1.9);
    const glassDoor = new THREE.Mesh(glassDoorGeo, glassMat);
    glassDoor.position.set(0.2, 1.15, 1.21);
    this.cabinBody.add(glassDoor);

    // Marco exterior de la corredera
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 2.0, 0.04),
      frameMat
    );
    doorFrame.position.set(0.2, 1.15, 1.205);
    this.cabinBody.add(doorFrame);

    // Ventana panorámica vertical en zona de madera
    const winLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.8), glassMat);
    winLeft.position.set(-1.4, 1.2, 1.21);
    this.cabinBody.add(winLeft);

    const winLeftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 1.86, 0.04),
      frameMat
    );
    winLeftFrame.position.set(-1.4, 1.2, 1.205);
    this.cabinBody.add(winLeftFrame);

    // Ventana estrecha en zona de metal
    const winRight = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 1.6), glassMat);
    winRight.position.set(1.5, 1.25, 1.21);
    this.cabinBody.add(winRight);

    // 4. Luz cálida interior acogedora
    this.interiorLight = new THREE.PointLight(0xffb76b, 2.5, 5);
    this.interiorLight.position.set(-0.2, 1.5, 0.2);
    this.cabinBody.add(this.interiorLight);

    // Techo interior reflectante
    const innerLightHelper = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.05, 0.6),
      new THREE.MeshBasicMaterial({ color: 0xffe2a3 })
    );
    innerLightHelper.position.set(-0.2, 2.3, 0.2);
    this.cabinBody.add(innerLightHelper);

    this.group.add(this.cabinBody);
  }

  buildSolarRoof() {
    this.roofGroup = new THREE.Group();

    // Losa de cubierta ligeramente inclinada hacia atrás para escorrentía solar
    const roofSlabGeo = new THREE.BoxGeometry(4.7, 0.12, 2.8);
    const roofSlabMat = new THREE.MeshStandardMaterial({
      color: 0x1f2328,
      roughness: 0.4,
      metalness: 0.8
    });
    const roofSlab = new THREE.Mesh(roofSlabGeo, roofSlabMat);
    roofSlab.position.set(0, 2.46, 0);
    roofSlab.rotation.x = -0.04; // Ligera inclinación hacia atrás
    roofSlab.castShadow = true;
    roofSlab.receiveShadow = true;
    this.roofGroup.add(roofSlab);

    // Arreglo de Paneles Solares Fotovoltaicos sobre la cubierta
    const solarMat = new THREE.MeshStandardMaterial({
      map: this.solarTexture,
      roughness: 0.2,
      metalness: 0.7
    });

    const panelGeo = new THREE.PlaneGeometry(4.4, 2.5);
    const solarArray = new THREE.Mesh(panelGeo, solarMat);
    solarArray.position.set(0, 2.53, 0);
    solarArray.rotation.x = -Math.PI / 2 - 0.04;
    solarArray.castShadow = true;
    this.roofGroup.add(solarArray);

    this.group.add(this.roofGroup);
  }

  buildDeckAndPath() {
    // 1. Terraza de madera frontal (Deck elevado)
    const deckMat = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.7,
      metalness: 0.05
    });

    const deckGeo = new THREE.BoxGeometry(2.4, 0.15, 1.2);
    this.deck = new THREE.Mesh(deckGeo, deckMat);
    this.deck.position.set(0.3, 0.075, 1.8);
    this.deck.castShadow = true;
    this.deck.receiveShadow = true;
    this.group.add(this.deck);

    // Escalones de acceso
    const stepGeo = new THREE.BoxGeometry(1.2, 0.08, 0.35);
    const step = new THREE.Mesh(stepGeo, deckMat);
    step.position.set(0.7, 0.04, 2.55);
    step.castShadow = true;
    step.receiveShadow = true;
    this.group.add(step);

    // 2. Sendero de gravilla compactada
    const pathMat = new THREE.MeshStandardMaterial({
      map: this.gravelTexture,
      roughness: 0.95,
      metalness: 0.05
    });

    const pathGeo = new THREE.PlaneGeometry(1.1, 2.2);
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(1.1, 0.005, 3.4);
    path.receiveShadow = true;
    this.group.add(path);

    // 3. Mini balizas solares LED junto al sendero
    this.bollards = new THREE.Group();
    const bollardMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2 });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffd175 });

    const bollardCoords = [
      { x: 0.45, z: 2.7 },
      { x: 1.75, z: 3.2 },
      { x: 0.45, z: 3.8 }
    ];

    bollardCoords.forEach(c => {
      const bPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.25, 6), bollardMat);
      bPost.position.set(c.x, 0.125, c.z);
      bPost.castShadow = true;
      this.bollards.add(bPost);

      const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), ledMat);
      bHead.position.set(c.x, 0.25, c.z);
      this.bollards.add(bHead);
    });

    this.group.add(this.bollards);

    // Maceta con planta sobre el deck
    const potMat = new THREE.MeshStandardMaterial({ color: 0xd97736, roughness: 0.8 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.22, 8), potMat);
    pot.position.set(-0.6, 0.25, 1.8);
    pot.castShadow = true;
    this.group.add(pot);

    const plantTop = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.16, 1),
      new THREE.MeshStandardMaterial({ color: 0x3e7529, roughness: 0.9 })
    );
    plantTop.position.set(-0.6, 0.42, 1.8);
    plantTop.castShadow = true;
    this.group.add(plantTop);
  }

  buildEquipment() {
    // 1. Compresor de Aire Acondicionado Mini-Split (Lateral izquierdo)
    const acGroup = new THREE.Group();
    const acBodyMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4 });
    const acBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.48, 0.3), acBodyMat);
    acBody.position.set(-2.55, 0.35, 0.6);
    acBody.castShadow = true;
    acGroup.add(acBody);

    // Rejilla del ventilador
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
    const fanCircle = new THREE.Mesh(new THREE.CircleGeometry(0.16, 12), fanMat);
    fanCircle.position.set(-2.55, 0.35, 0.755);
    fanCircle.rotation.y = Math.PI / 2;
    acGroup.add(fanCircle);

    // Soportes del compresor
    const baseFeet = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.1, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    baseFeet.position.set(-2.55, 0.05, 0.6);
    acGroup.add(baseFeet);

    this.group.add(acGroup);

    // 2. Tanque de recolección de agua de lluvia (Barril verde en lateral derecho)
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x274a38, // Verde militar oscuro
      roughness: 0.6,
      metalness: 0.2
    });
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.95, 12), tankMat);
    tank.position.set(2.45, 0.5, 0.8);
    tank.castShadow = true;
    this.group.add(tank);

    // Tubo bajante de canalón de lluvia
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x1f2328, metalness: 0.7, roughness: 0.3 });
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6), pipeMat);
    pipe.position.set(2.28, 1.7, 1.0);
    this.group.add(pipe);
  }

  /**
   * Animación de construcción o desmontaje
   * @param {number} progress 0.0 a 1.0
   */
  setConstructionProgress(progress) {
    if (progress <= 0.001) {
      this.group.visible = false;
      return;
    }

    this.group.visible = true;

    // Efecto de colocación modular: desciende suavemente desde arriba con escala
    const clamped = Math.max(0, Math.min(1, progress));
    
    // Elevación suave de descenso
    const startY = 4.0;
    this.group.position.y = (1 - clamped) * startY;
    
    // Escala con ligero 'pop'
    const scale = clamped;
    this.group.scale.set(scale, scale, scale);
  }

  setNightMode(isNight) {
    if (this.interiorLight) {
      this.interiorLight.intensity = isNight ? 4.5 : 1.2;
    }
  }
}
