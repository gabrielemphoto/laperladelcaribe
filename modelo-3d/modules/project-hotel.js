import * as THREE from 'three';
import { createStrataTexture, createGrassTexture, createWoodTexture, createRuinedConcreteTexture } from './textures.js';

/**
 * PROYECTO 2: Hotel Abandonado en Ruinas ➔ Remodelado con Huéspedes y Ganancias
 * Muestra el antes y después de una estructura hotelera abandonada que se transforma
 * en un resort boutique de lujo 100% operativo con piscina infinity llena de agua turquesa,
 * huéspedes disfrutando y generación de rentas.
 */
export class ProjectHotelRemodel {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'project-2-hotel-remodel';

    this.strataTex = createStrataTexture();
    this.grassTex = createGrassTexture();
    this.woodTex = createWoodTexture();
    this.ruinedTex = createRuinedConcreteTexture();

    this.buildBaseAndPoolPit();
    this.buildRuinedHotel();
    this.buildLuxuryHotel();

    this.setTransition(0);
  }

  buildBaseAndPoolPit() {
    // Bloque base con corte geológico
    const strataMat = new THREE.MeshStandardMaterial({ map: this.strataTex, roughness: 0.9 });
    const grassMat = new THREE.MeshStandardMaterial({ map: this.grassTex, roughness: 0.8 });
    const bottomMat = new THREE.MeshBasicMaterial({ color: 0x24201c });

    this.baseBlock = new THREE.Mesh(
      new THREE.BoxGeometry(10, 3, 10),
      [strataMat, strataMat, grassMat, bottomMat, strataMat, strataMat]
    );
    this.baseBlock.position.y = -1.5;
    this.baseBlock.receiveShadow = true;
    this.group.add(this.baseBlock);

    // Fosa excavada de la piscina (esquina frontal derecha X: 2.2, Z: 2.2)
    const pitGeo = new THREE.BoxGeometry(4.2, 0.9, 4.0);
    const pitMat = new THREE.MeshStandardMaterial({ color: 0x3a3c3d, roughness: 0.8 });
    this.poolPit = new THREE.Mesh(pitGeo, pitMat);
    this.poolPit.position.set(2.4, -0.45, 2.5);
    this.group.add(this.poolPit);
  }

  // ==========================================
  // ESTADO A: HOTEL EN RUINAS / ABANDONADO
  // ==========================================
  buildRuinedHotel() {
    this.ruinsGroup = new THREE.Group();
    this.ruinsGroup.position.set(-1.0, 0, -1.8);

    const ruinedMat = new THREE.MeshStandardMaterial({
      map: this.ruinedTex,
      roughness: 0.95
    });

    const darkHoleMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

    // Estructura de 3 plantas de hormigón agrietado y manchado
    const bGeo = new THREE.BoxGeometry(5.4, 3.2, 3.4);
    const bMesh = new THREE.Mesh(bGeo, ruinedMat);
    bMesh.position.y = 1.6;
    bMesh.castShadow = true;
    this.ruinsGroup.add(bMesh);

    // Huecos de ventanas vacías / sin cristales / tapiadas
    for (let f = 0; f < 3; f++) {
      const y = 0.6 + f * 1.0;
      // Ventanas tapiadas con tablas de madera podrida
      const plankMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.9 });
      const win1 = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), plankMat);
      win1.position.set(-1.3, y, 1.71);
      this.ruinsGroup.add(win1);

      const win2 = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), darkHoleMat);
      win2.position.set(1.3, y, 1.71);
      this.ruinsGroup.add(win2);
    }

    // Pérgola rota en el tejado
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x3d3023 });
    const brokenBeam = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.1), beamMat);
    brokenBeam.position.set(0.6, 3.35, 0);
    brokenBeam.rotation.z = 0.25; // viga caída torcida
    this.ruinsGroup.add(brokenBeam);

    // Fosa de piscina abandonada y sucia
    const dirtyPoolMat = new THREE.MeshStandardMaterial({ color: 0x3d433b, roughness: 0.95 });
    this.dirtyPoolBottom = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.6), dirtyPoolMat);
    this.dirtyPoolBottom.rotation.x = -Math.PI / 2;
    this.dirtyPoolBottom.position.set(2.4, -0.85, 2.5);
    this.ruinsGroup.add(this.dirtyPoolBottom);

    // Maleza que crece en las grietas
    const weedMat = new THREE.MeshStandardMaterial({ color: 0x555835, roughness: 0.9 });
    for (let i = 0; i < 8; i++) {
      const weed = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 4), weedMat);
      weed.position.set(1.5 + Math.random() * 1.8, -0.8, 1.5 + Math.random() * 1.8);
      this.ruinsGroup.add(weed);
    }

    this.group.add(this.ruinsGroup);
  }

  // ==========================================
  // ESTADO B: HOTEL DE LUJO REMODELADO + GANANCIAS
  // ==========================================
  buildLuxuryHotel() {
    this.luxuryGroup = new THREE.Group();

    // 1. Edificio remodelado con hormigón blanco y madera
    const hotelBuilding = new THREE.Group();
    hotelBuilding.position.set(-1.0, 0, -1.8);

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.woodTex, roughness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xbfecff, transparent: true, opacity: 0.6, roughness: 0.05 });

    // Cuerpo principal blanco impecable
    const bGeo = new THREE.BoxGeometry(5.4, 3.2, 3.4);
    const bMesh = new THREE.Mesh(bGeo, whiteMat);
    bMesh.position.y = 1.6;
    bMesh.castShadow = true;
    hotelBuilding.add(bMesh);

    // Núcleo central vertical de madera de teca
    const core = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.6, 3.5), woodMat);
    core.position.set(0, 1.8, 0.05);
    hotelBuilding.add(core);

    // Balcones volados de cristal con luces
    for (let f = 1; f <= 2; f++) {
      const y = f * 1.05;
      const balcony = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.1, 1.0), whiteMat);
      balcony.position.set(0, y, 2.1);
      hotelBuilding.add(balcony);

      const glassRail = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 0.45), glassMat);
      glassRail.position.set(0, y + 0.28, 2.6);
      hotelBuilding.add(glassRail);

      // Ventanales panorámicos iluminados
      const winL = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), glassMat);
      winL.position.set(-1.5, y + 0.45, 1.72);
      hotelBuilding.add(winL);

      const winR = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), glassMat);
      winR.position.set(1.5, y + 0.45, 1.72);
      hotelBuilding.add(winR);

      // Foco cálido en balcón
      const bLight = new THREE.PointLight(0xffbe76, 1.5, 3);
      bLight.position.set(0, y + 0.8, 2.0);
      hotelBuilding.add(bLight);
    }

    this.luxuryGroup.add(hotelBuilding);

    // 2. Piscina llena de agua turquesa cristalina
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d2eb,
      transparent: true,
      opacity: 0.82,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.33
    });
    this.waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.6), waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.set(2.4, -0.05, 2.5);
    this.luxuryGroup.add(this.waterMesh);

    // Luz subacuática de la piscina
    const poolLight = new THREE.PointLight(0x00f7ff, 2.0, 5);
    poolLight.position.set(2.4, -0.3, 2.5);
    this.luxuryGroup.add(poolLight);

    // Solarium de coralina
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xe5dfcf, roughness: 0.6 });
    const deckWalk = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.05, 0.9), deckMat);
    deckWalk.position.set(2.4, 0.025, 0.1);
    deckWalk.receiveShadow = true;
    this.luxuryGroup.add(deckWalk);

    // 3. Tumbonas y Sombrillas
    const colors = [0xffd13b, 0x17d2e8, 0xe0328b];
    for (let i = 0; i < 3; i++) {
      const lx = 1.2 + i * 1.2;
      const lz = 0.1;

      // Tumbona blanca
      const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.7), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      lounger.position.set(lx, 0.07, lz);
      this.luxuryGroup.add(lounger);

      // Sombrilla
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 6), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
      pole.position.set(lx + 0.25, 0.6, lz);
      this.luxuryGroup.add(pole);

      const umbrella = new THREE.Mesh(
        new THREE.ConeGeometry(0.45, 0.18, 8),
        new THREE.MeshStandardMaterial({ color: colors[i], side: THREE.DoubleSide })
      );
      umbrella.position.set(lx + 0.25, 1.15, lz);
      this.luxuryGroup.add(umbrella);
    }

    // 4. Palmeras tropicales caribeñas
    const palm1 = this.createSimplePalm(3.8);
    palm1.position.set(4.3, 0, -2.5);
    this.luxuryGroup.add(palm1);

    const palm2 = this.createSimplePalm(3.4);
    palm2.position.set(4.0, 0, -4.0);
    this.luxuryGroup.add(palm2);

    // 5. Huéspedes disfrutando
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd9a27e });
    const guestPos = [[2.0, -0.15, 2.2], [2.8, -0.15, 3.0], [1.5, 0.15, 0.1]];
    guestPos.forEach(([x, y, z]) => {
      const p = new THREE.Group();
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), skinMat);
      head.position.y = 0.2;
      p.add(head);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.18, 6), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
      body.position.y = 0.09;
      p.add(body);
      p.position.set(x, y, z);
      this.luxuryGroup.add(p);
    });

    this.group.add(this.luxuryGroup);
  }

  createSimplePalm(height = 3.5) {
    const palm = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e5238, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, height, 7), trunkMat);
    trunk.position.y = height / 2;
    trunk.rotation.z = 0.08;
    trunk.castShadow = true;
    palm.add(trunk);

    const frondMat = new THREE.MeshStandardMaterial({ color: 0x3d7e22, side: THREE.DoubleSide, roughness: 0.7 });
    for (let f = 0; f < 8; f++) {
      const angle = (f / 8) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.4), frondMat);
      frond.position.set(0, height, 0);
      frond.rotation.set(0.6, angle, 0);
      palm.add(frond);
    }
    return palm;
  }

  /**
   * Transición animada entre Estado A (Ruinas, t=0) y Estado B (Remodelado, t=1)
   */
  setTransition(t) {
    t = Math.max(0, Math.min(1, t));

    if (t < 0.01) {
      this.ruinsGroup.visible = true;
      this.luxuryGroup.visible = false;
      this.ruinsGroup.scale.set(1, 1, 1);
    } else if (t > 0.99) {
      this.ruinsGroup.visible = false;
      this.luxuryGroup.visible = true;
      this.luxuryGroup.scale.set(1, 1, 1);
      this.luxuryGroup.position.y = 0;
    } else {
      this.ruinsGroup.visible = true;
      this.luxuryGroup.visible = true;

      // El hotel de lujo emerge y cubre las ruinas
      this.luxuryGroup.position.y = (t - 1) * 1.5;
      this.luxuryGroup.scale.set(t, t, t);
      this.ruinsGroup.scale.set(1 - t * 0.5, 1 - t * 0.5, 1 - t * 0.5);
    }
  }
}
