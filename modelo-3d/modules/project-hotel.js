import * as THREE from 'three';
import {
  createStrataTexture,
  createStrataBumpMap,
  createGrassTexture,
  createWoodTexture,
  createRuinedConcreteTexture,
  createPoolMosaicTexture,
  createWaterNormalTexture
} from './textures.js';

/**
 * PROYECTO 2: Hotel Abandonado en Ruinas ➔ Resort Boutique de Lujo (+Ganancias)
 * - Fosa de piscina con relieve 3D físico real excavado en la roca.
 * - Edificio de 4 plantas con arquitectura realista de forjados volados, celosías y detalles.
 * - Fase Ruinas: hormigón envejecido, varillas de construcción oxidadas en el techo, piscina seca con escombros.
 * - Fase Lujo: fachada blanca impecable, madera de teca, piscina llena de agua turquesa con luz subacuática,
 *   huéspedes, palmeras y cartel de ganancias activas.
 */
export class ProjectHotelRemodel {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'project-2-hotel-remodel';

    this.strataTex = createStrataTexture();
    this.strataBump = createStrataBumpMap();
    this.grassTex = createGrassTexture();
    this.woodTex = createWoodTexture();
    this.ruinedTex = createRuinedConcreteTexture();
    this.mosaicTex = createPoolMosaicTexture();
    this.waterNormal = createWaterNormalTexture();

    this.buildExcavatedTerrainBlock();
    this.buildSunkenPoolBasin();
    this.buildTallRuinedHotel();
    this.buildTallLuxuryHotel();

    this.setTransition(0);
  }

  // ==========================================
  // 1. TERRENO CON CORTE Y FOSA FÍSICA REAL
  // ==========================================
  buildExcavatedTerrainBlock() {
    this.terrainGroup = new THREE.Group();

    const strataMat = new THREE.MeshStandardMaterial({
      map: this.strataTex,
      bumpMap: this.strataBump,
      bumpScale: 0.06,
      roughness: 0.9,
      metalness: 0.05
    });

    const grassMat = new THREE.MeshStandardMaterial({
      map: this.grassTex,
      roughness: 0.85
    });

    const bottomMat = new THREE.MeshBasicMaterial({ color: 0x1f1b17 });

    const strataBoxMats = [strataMat, strataMat, strataMat, bottomMat, strataMat, strataMat];
    const upperBoxMats = [strataMat, strataMat, grassMat, strataMat, strataMat, strataMat];

    // 1. Base rocosa profunda (10 x 1.8 x 10) de Y = -3.0 a Y = -1.2
    const deepBase = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 10), strataBoxMats);
    deepBase.position.y = -2.1;
    deepBase.receiveShadow = true;
    deepBase.castShadow = true;
    this.terrainGroup.add(deepBase);

    // 2. Terreno superior trasero (10 x 1.2 x 5.5) de Z: -5.0 a Z: +0.5
    const upperBack = new THREE.Mesh(new THREE.BoxGeometry(10, 1.2, 5.5), upperBoxMats);
    upperBack.position.set(0, -0.6, -2.25);
    upperBack.receiveShadow = true;
    upperBack.castShadow = true;
    this.terrainGroup.add(upperBack);

    // 3. Terreno superior lateral izquierdo (5.2 x 1.2 x 4.5) de X: -5.0 a X: +0.2
    const upperLeft = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 4.5), upperBoxMats);
    upperLeft.position.set(-2.4, -0.6, 2.75);
    upperLeft.receiveShadow = true;
    upperLeft.castShadow = true;
    this.terrainGroup.add(upperLeft);

    // *Nota: La esquina frontal derecha (X: 0.2 a 5.0, Z: 0.5 a 5.0) queda 100% HUECA de Y: -1.2 a 0*
    // Es ahí donde se ubica la piscina física con relieve real.

    this.group.add(this.terrainGroup);
  }

  // ==========================================
  // 2. VASO DE LA PISCINA FÍSICA SUNKEN (RELIEVE REAL)
  // ==========================================
  buildSunkenPoolBasin() {
    this.poolBasinGroup = new THREE.Group();
    // Centro del hueco: X = 2.6, Z = 2.75
    this.poolBasinGroup.position.set(2.6, 0, 2.75);

    const poolWidth = 4.4;
    const poolLength = 4.1;
    const poolDepth = 1.15;

    // --- ELEMENTOS DE PISCINA EN RUINAS ---
    this.poolRuins = new THREE.Group();

    // Fondo sucio y agrietado
    const dirtyConcreteMat = new THREE.MeshStandardMaterial({
      map: this.ruinedTex,
      roughness: 0.95
    });

    const poolFloorRuins = new THREE.Mesh(
      new THREE.BoxGeometry(poolWidth - 0.2, 0.08, poolLength - 0.2),
      dirtyConcreteMat
    );
    poolFloorRuins.position.y = -poolDepth;
    poolFloorRuins.receiveShadow = true;
    this.poolRuins.add(poolFloorRuins);

    // Muros interiores deteriorados
    const wallRuinsBack = new THREE.Mesh(new THREE.BoxGeometry(poolWidth, poolDepth, 0.15), dirtyConcreteMat);
    wallRuinsBack.position.set(0, -poolDepth / 2, -poolLength / 2);
    this.poolRuins.add(wallRuinsBack);

    const wallRuinsLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, poolDepth, poolLength), dirtyConcreteMat);
    wallRuinsLeft.position.set(-poolWidth / 2, -poolDepth / 2, 0);
    this.poolRuins.add(wallRuinsLeft);

    // Sumidero oxidado en el fondo
    const drain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.04, 8),
      new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.9 })
    );
    drain.position.set(0.6, -poolDepth + 0.04, 0.6);
    this.poolRuins.add(drain);

    // Escombros y maleza dentro de la piscina vacía
    const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x66625d, roughness: 0.9 });
    for (let r = 0; r < 6; r++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.1, 0), rubbleMat);
      rock.position.set((Math.random() - 0.5) * 2.8, -poolDepth + 0.1, (Math.random() - 0.5) * 2.8);
      this.poolRuins.add(rock);
    }

    const weedMat = new THREE.MeshStandardMaterial({ color: 0x5a5f32, roughness: 0.9 });
    for (let w = 0; w < 4; w++) {
      const weed = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 4), weedMat);
      weed.position.set((Math.random() - 0.5) * 3, -poolDepth + 0.22, (Math.random() - 0.5) * 3);
      this.poolRuins.add(weed);
    }

    this.poolBasinGroup.add(this.poolRuins);

    // --- ELEMENTOS DE PISCINA DE LUJO ---
    this.poolLuxury = new THREE.Group();

    // Revestimiento de mosaico vítreo turquesa
    const mosaicMat = new THREE.MeshStandardMaterial({
      map: this.mosaicTex,
      roughness: 0.25,
      metalness: 0.1
    });

    const poolFloorLuxury = new THREE.Mesh(
      new THREE.BoxGeometry(poolWidth - 0.2, 0.08, poolLength - 0.2),
      mosaicMat
    );
    poolFloorLuxury.position.y = -poolDepth;
    poolFloorLuxury.receiveShadow = true;
    this.poolLuxury.add(poolFloorLuxury);

    // Muros interiores con mosaicos
    const wallLuxBack = new THREE.Mesh(new THREE.BoxGeometry(poolWidth, poolDepth, 0.15), mosaicMat);
    wallLuxBack.position.set(0, -poolDepth / 2, -poolLength / 2);
    this.poolLuxury.add(wallLuxBack);

    const wallLuxLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, poolDepth, poolLength), mosaicMat);
    wallLuxLeft.position.set(-poolWidth / 2, -poolDepth / 2, 0);
    this.poolLuxury.add(wallLuxLeft);

    // Muro frontal y lateral con corte de vidrio estructural infinity (fiel a la imagen)
    const glassRimMat = new THREE.MeshPhysicalMaterial({
      color: 0x4dd8e6,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.33
    });

    const glassWallFront = new THREE.Mesh(new THREE.BoxGeometry(poolWidth, poolDepth, 0.12), glassRimMat);
    glassWallFront.position.set(0, -poolDepth / 2, poolLength / 2);
    this.poolLuxury.add(glassWallFront);

    const glassWallRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, poolDepth, poolLength), glassRimMat);
    glassWallRight.position.set(poolWidth / 2, -poolDepth / 2, 0);
    this.poolLuxury.add(glassWallRight);

    // Coronación de piedra coralina blanca alrededor
    const copingMat = new THREE.MeshStandardMaterial({ color: 0xede8dc, roughness: 0.5 });
    const copingBack = new THREE.Mesh(new THREE.BoxGeometry(poolWidth + 0.4, 0.08, 0.4), copingMat);
    copingBack.position.set(0, 0.04, -poolLength / 2 - 0.1);
    this.poolLuxury.add(copingBack);

    const copingLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, poolLength + 0.4), copingMat);
    copingLeft.position.set(-poolWidth / 2 - 0.1, 0.04, 0);
    this.poolLuxury.add(copingLeft);

    // Superficie de agua cristalina turquesa con ondas
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d9f5,
      transparent: true,
      opacity: 0.82,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.333,
      normalMap: this.waterNormal,
      normalScale: new THREE.Vector2(0.3, 0.3)
    });

    this.waterSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(poolWidth - 0.25, poolLength - 0.25),
      waterMat
    );
    this.waterSurface.rotation.x = -Math.PI / 2;
    this.waterSurface.position.set(0, -0.15, 0);
    this.poolLuxury.add(this.waterSurface);

    // Luz subacuática turquesa radiante
    const underwaterLight = new THREE.PointLight(0x00f7ff, 2.5, 6);
    underwaterLight.position.set(0, -0.6, 0);
    this.poolLuxury.add(underwaterLight);

    // Tumbonas y sombrillas junto a la piscina
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d5, roughness: 0.6 });
    const solarium = new THREE.Mesh(new THREE.BoxGeometry(poolWidth, 0.05, 1.2), deckMat);
    solarium.position.set(0, 0.025, -poolLength / 2 - 0.7);
    this.poolLuxury.add(solarium);

    const umbrellaColors = [0xffd13b, 0x17d2e8, 0xe0328b];
    for (let i = 0; i < 3; i++) {
      const lx = -1.4 + i * 1.4;
      const lz = -poolLength / 2 - 0.7;

      const lounger = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.1, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      lounger.position.set(lx, 0.08, lz);
      this.poolLuxury.add(lounger);

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 1.3, 6),
        new THREE.MeshStandardMaterial({ color: 0xcccccc })
      );
      pole.position.set(lx + 0.3, 0.65, lz);
      this.poolLuxury.add(pole);

      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(0.48, 0.2, 8),
        new THREE.MeshStandardMaterial({ color: umbrellaColors[i], side: THREE.DoubleSide })
      );
      canopy.position.set(lx + 0.3, 1.25, lz);
      this.poolLuxury.add(canopy);
    }

    // Huésped nadando en la piscina
    const swimmer = new THREE.Group();
    const sHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xd9a27e })
    );
    swimmer.add(sHead);
    swimmer.position.set(0.5, -0.15, 0.8);
    this.poolLuxury.add(swimmer);

    this.poolBasinGroup.add(this.poolLuxury);
    this.group.add(this.poolBasinGroup);
  }

  // ==========================================
  // 3. EDIFICIO ALTO EN RUINAS (4 PISOS + REBARS)
  // ==========================================
  buildTallRuinedHotel() {
    this.ruinsHotelGroup = new THREE.Group();
    this.ruinsHotelGroup.position.set(-1.0, 0, -2.0);

    const ruinedMat = new THREE.MeshStandardMaterial({
      map: this.ruinedTex,
      roughness: 0.95,
      metalness: 0.05
    });

    const darkHoleMat = new THREE.MeshBasicMaterial({ color: 0x141414 });
    const woodBoardMat = new THREE.MeshStandardMaterial({ color: 0x4a3a28, roughness: 0.9 });
    const rebarMat = new THREE.MeshStandardMaterial({ color: 0x5c3318, roughness: 0.8, metalness: 0.7 });

    const floors = 4;
    const floorH = 1.1;
    const bWidth = 5.6;
    const bDepth = 3.6;

    // Núcleo del edificio
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, floors * floorH, bDepth),
      ruinedMat
    );
    mainBody.position.y = (floors * floorH) / 2;
    mainBody.castShadow = true;
    this.ruinsHotelGroup.add(mainBody);

    // Forjados salientes con grietas
    for (let f = 0; f <= floors; f++) {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(bWidth + 0.5, 0.12, bDepth + 0.8),
        ruinedMat
      );
      slab.position.set(0, f * floorH + 0.06, 0.3);
      slab.castShadow = true;
      this.ruinsHotelGroup.add(slab);
    }

    // Ventanas huecas, sucias y algunas tapiadas
    for (let f = 0; f < floors; f++) {
      const y = f * floorH + 0.6;

      // Hueco izquierdo
      const winL = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.75), darkHoleMat);
      winL.position.set(-1.4, y, bDepth / 2 + 0.02);
      this.ruinsHotelGroup.add(winL);

      // Hueco derecho con tablas de madera podrida (tapiado)
      if (f % 2 === 0) {
        const board = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.75), woodBoardMat);
        board.position.set(1.4, y, bDepth / 2 + 0.03);
        this.ruinsHotelGroup.add(board);
      } else {
        const winR = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.75), darkHoleMat);
        winR.position.set(1.4, y, bDepth / 2 + 0.02);
        this.ruinsHotelGroup.add(winR);
      }
    }

    // Varillas de hierro oxidadas (Rebars) saliendo de los pilares del techo
    const roofY = floors * floorH + 0.12;
    const pillarPositions = [
      [-bWidth / 2 + 0.3, -bDepth / 2 + 0.3],
      [bWidth / 2 - 0.3, -bDepth / 2 + 0.3],
      [-bWidth / 2 + 0.3, bDepth / 2 + 0.3],
      [bWidth / 2 - 0.3, bDepth / 2 + 0.3],
      [0, bDepth / 2 + 0.3]
    ];

    pillarPositions.forEach(([px, pz]) => {
      // Pilar de hormigón inacabado
      const stump = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), ruinedMat);
      stump.position.set(px, roofY + 0.2, pz);
      this.ruinsHotelGroup.add(stump);

      // 3 varillas de hierro oxidadas curvadas que sobresalen
      for (let r = 0; r < 3; r++) {
        const rebar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.7 + Math.random() * 0.4, 4),
          rebarMat
        );
        rebar.position.set(
          px + (Math.random() - 0.5) * 0.15,
          roofY + 0.6,
          pz + (Math.random() - 0.5) * 0.15
        );
        rebar.rotation.z = (Math.random() - 0.5) * 0.3;
        rebar.castShadow = true;
        this.ruinsHotelGroup.add(rebar);
      }
    });

    this.group.add(this.ruinsHotelGroup);
  }

  // ==========================================
  // 4. EDIFICIO ALTO DE LUJO REMODELADO (4 PISOS + ROOFTOP + RENTAS)
  // ==========================================
  buildTallLuxuryHotel() {
    this.luxuryHotelGroup = new THREE.Group();
    this.luxuryHotelGroup.position.set(-1.0, 0, -2.0);

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.35 });
    const woodMat = new THREE.MeshStandardMaterial({ map: this.woodTex, roughness: 0.6 });
    const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x1a1c1e, roughness: 0.4, metalness: 0.7 });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xcdeeff,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85
    });

    const railGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9edbfa,
      transparent: true,
      opacity: 0.45,
      roughness: 0.08
    });

    const floors = 4;
    const floorH = 1.1;
    const bWidth = 5.6;
    const bDepth = 3.6;

    // Cuerpo principal blanco contemporáneo
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, floors * floorH, bDepth),
      whiteMat
    );
    mainBody.position.y = (floors * floorH) / 2;
    mainBody.castShadow = true;
    this.luxuryHotelGroup.add(mainBody);

    // Núcleo central vertical de madera de teca (ascensor y celosías)
    const core = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, floors * floorH + 0.6, bDepth + 0.2),
      woodMat
    );
    core.position.set(0, (floors * floorH) / 2 + 0.3, 0.05);
    core.castShadow = true;
    this.luxuryHotelGroup.add(core);

    // Balcones voladizos con barandillas de cristal y luces cálidas
    for (let f = 0; f < floors; f++) {
      const y = f * floorH;

      // Losa volada
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(bWidth + 0.6, 0.14, bDepth + 1.1),
        whiteMat
      );
      slab.position.set(0, y + 0.07, 0.45);
      slab.castShadow = true;
      this.luxuryHotelGroup.add(slab);

      if (f > 0) {
        // Barandilla de cristal
        const rail = new THREE.Mesh(new THREE.PlaneGeometry(bWidth + 0.5, 0.46), railGlassMat);
        rail.position.set(0, y + 0.37, bDepth / 2 + 0.98);
        this.luxuryHotelGroup.add(rail);

        // Pasamanos negro
        const handrail = new THREE.Mesh(new THREE.BoxGeometry(bWidth + 0.52, 0.04, 0.04), darkTrimMat);
        handrail.position.set(0, y + 0.6, bDepth / 2 + 0.98);
        this.luxuryHotelGroup.add(handrail);

        // Ventanales a suites con luz cálida
        const winL = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.85), glassMat);
        winL.position.set(-1.4, y + 0.55, bDepth / 2 + 0.02);
        this.luxuryHotelGroup.add(winL);

        const winR = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.85), glassMat);
        winR.position.set(1.4, y + 0.55, bDepth / 2 + 0.02);
        this.luxuryHotelGroup.add(winR);

        // Luz cálida interior acogedora
        const warmLight = new THREE.PointLight(0xffbe76, 1.2, 3);
        warmLight.position.set(0, y + 0.8, bDepth / 2 - 0.2);
        this.luxuryHotelGroup.add(warmLight);
      }
    }

    // Rooftop Penthouse & Pérgola de madera
    const roofY = floors * floorH + 0.14;
    const pergolaMat = new THREE.MeshStandardMaterial({ color: 0x5a3e28, roughness: 0.7 });
    for (let p = 0; p < 5; p++) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.08), pergolaMat);
      beam.position.set(1.2, roofY + 1.1, -0.8 + p * 0.4);
      this.luxuryHotelGroup.add(beam);
    }

    // Palmeras caribeñas de resort
    const palm = this.createPalm(4.2);
    palm.position.set(4.5, 0, -2.5);
    this.luxuryHotelGroup.add(palm);

    const palm2 = this.createPalm(3.6);
    palm2.position.set(4.2, 0, -4.2);
    this.luxuryHotelGroup.add(palm2);

    // Cartel flotante de Rentas Activas / Ganancias
    this.buildProfitBanner(roofY);

    this.group.add(this.luxuryHotelGroup);
  }

  createPalm(height = 4.0) {
    const palm = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e5238, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, height, 8), trunkMat);
    trunk.position.y = height / 2;
    trunk.rotation.z = 0.08;
    trunk.castShadow = true;
    palm.add(trunk);

    const frondMat = new THREE.MeshStandardMaterial({ color: 0x3d7e22, side: THREE.DoubleSide, roughness: 0.7 });
    for (let f = 0; f < 9; f++) {
      const angle = (f / 9) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 1.6), frondMat);
      frond.position.set(0, height, 0);
      frond.rotation.set(0.65, angle, 0);
      frond.castShadow = true;
      palm.add(frond);
    }
    return palm;
  }

  buildProfitBanner(roofY) {
    this.profitBanner = new THREE.Group();
    this.profitBanner.position.set(0, roofY + 1.6, 0);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 140);
    grad.addColorStop(0, '#064e3b'); // Verde esmeralda profundo
    grad.addColorStop(1, '#047857');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 140);

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 132);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💵 100% OPERATIVO', 256, 58);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '600 28px sans-serif';
    ctx.fillText('GENERANDO GANANCIAS • +28% ROI', 256, 108);

    const tex = new THREE.CanvasTexture(canvas);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 0.8),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
    );
    this.profitBanner.add(plane);
    this.luxuryHotelGroup.add(this.profitBanner);
  }

  /**
   * Transición animada entre Estado A (Ruinas, t=0) y Estado B (Remodelado, t=1)
   */
  setTransition(t) {
    t = Math.max(0, Math.min(1, t));

    if (t < 0.01) {
      this.ruinsHotelGroup.visible = true;
      this.poolRuins.visible = true;
      this.luxuryHotelGroup.visible = false;
      this.poolLuxury.visible = false;
      this.ruinsHotelGroup.scale.set(1, 1, 1);
    } else if (t > 0.99) {
      this.ruinsHotelGroup.visible = false;
      this.poolRuins.visible = false;
      this.luxuryHotelGroup.visible = true;
      this.poolLuxury.visible = true;
      this.luxuryHotelGroup.scale.set(1, 1, 1);
      this.luxuryHotelGroup.position.y = 0;
    } else {
      this.ruinsHotelGroup.visible = true;
      this.poolRuins.visible = true;
      this.luxuryHotelGroup.visible = true;
      this.poolLuxury.visible = true;

      // El hotel remodelado emerge y cubre las ruinas
      this.luxuryHotelGroup.position.y = (t - 1) * 1.5;
      this.luxuryHotelGroup.scale.set(t, t, t);
      this.poolLuxury.scale.set(t, t, t);

      const shrink = Math.max(0.001, 1 - t * 0.5);
      this.ruinsHotelGroup.scale.set(shrink, shrink, shrink);
      this.poolRuins.scale.set(shrink, shrink, shrink);
    }

    // Ondas en la superficie del agua
    if (this.waterSurface && this.waterSurface.material.normalMap) {
      this.waterSurface.material.normalMap.offset.x = Math.sin(performance.now() * 0.001) * 0.05;
      this.waterSurface.material.normalMap.offset.y = Math.cos(performance.now() * 0.0008) * 0.05;
    }

    // Flotación sutil del cartel de ganancias
    if (this.profitBanner) {
      this.profitBanner.position.y = 4.8 + Math.sin(performance.now() * 0.003) * 0.06;
    }
  }
}
