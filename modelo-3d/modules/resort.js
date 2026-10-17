import * as THREE from 'three';
import { createWoodSlatsTexture, createResortTileTexture, createWaterNormalTexture } from './textures.js';

/**
 * Módulo de Resort Boutique & Spa (Fase 2 / Imagen 3)
 * Complejo hotelero caribeño contemporáneo: edificio de 4 plantas con suites de lujo,
 * balcones volados con barandillas de cristal, piscina infinity excavada con corte
 * transversal visible, terraza con tumbonas y sombrillas de colores, palmeras,
 * estacionamiento con vehículos y ambientación de huéspedes.
 */
export class ResortModel {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'resort-phase';

    this.woodTexture = createWoodSlatsTexture();
    this.tileTexture = createResortTileTexture();
    this.waterNormal = createWaterNormalTexture();

    this.nightLights = [];

    this.buildHotelBuilding();
    this.buildRooftop();
    this.buildPoolAndDeck();
    this.buildDrivewayAndCars();
    this.buildOutdoorCafe();
    this.buildPeopleAndLoungers();

    this.group.visible = false;
  }

  // ==========================================
  // 1. EDIFICIO PRINCIPAL DEL HOTEL (4 NIVELES)
  // ==========================================
  buildHotelBuilding() {
    this.buildingGroup = new THREE.Group();
    this.buildingGroup.position.set(-0.8, 0, -1.8);

    // Materiales arquitectónicos
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xefede8, // Hormigón blanco cálido contemporáneo
      roughness: 0.6,
      metalness: 0.05
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x222629,
      roughness: 0.4,
      metalness: 0.6
    });

    const woodLouverMat = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.65,
      metalness: 0.05
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xcbe9f5,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5
    });

    const balconyGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5d8ed,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.7
    });

    const bWidth = 5.6;
    const bDepth = 3.6;
    const floorHeight = 1.05;
    const numFloors = 4;

    // Núcleo central vertical de madera / ascensor panorámico
    const coreGeo = new THREE.BoxGeometry(1.0, floorHeight * numFloors + 0.5, bDepth + 0.1);
    const coreMesh = new THREE.Mesh(coreGeo, woodLouverMat);
    coreMesh.position.set(0.3, (floorHeight * numFloors) / 2, 0);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    this.buildingGroup.add(coreMesh);

    // Muros laterales exteriores
    const sideWallGeo = new THREE.BoxGeometry(0.2, floorHeight * numFloors, bDepth);
    const leftWall = new THREE.Mesh(sideWallGeo, concreteMat);
    leftWall.position.set(-bWidth / 2, (floorHeight * numFloors) / 2, 0);
    leftWall.castShadow = true;
    this.buildingGroup.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, concreteMat);
    rightWall.position.set(bWidth / 2, (floorHeight * numFloors) / 2, 0);
    rightWall.castShadow = true;
    this.buildingGroup.add(rightWall);

    // Muro trasero continuo
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, floorHeight * numFloors, 0.2),
      concreteMat
    );
    backWall.position.set(0, (floorHeight * numFloors) / 2, -bDepth / 2);
    backWall.castShadow = true;
    this.buildingGroup.add(backWall);

    // Construcción de plantas y balcones
    for (let f = 0; f < numFloors; f++) {
      const floorY = f * floorHeight;

      // Losa de forjado volada horizontal
      const slabGeo = new THREE.BoxGeometry(bWidth + 0.6, 0.14, bDepth + 1.1);
      const slab = new THREE.Mesh(slabGeo, concreteMat);
      slab.position.set(0, floorY + 0.07, 0.45);
      slab.castShadow = true;
      slab.receiveShadow = true;
      this.buildingGroup.add(slab);

      if (f > 0) {
        // Balcones voladizos con barandilla de cristal en las plantas 1, 2 y 3
        const railFrontGeo = new THREE.PlaneGeometry(bWidth + 0.5, 0.45);
        const railFront = new THREE.Mesh(railFrontGeo, balconyGlassMat);
        railFront.position.set(0, floorY + 0.35, bDepth / 2 + 0.98);
        railFront.receiveShadow = true;
        this.buildingGroup.add(railFront);

        // Pasamanos de aluminio negro
        const handrail = new THREE.Mesh(
          new THREE.BoxGeometry(bWidth + 0.52, 0.04, 0.04),
          darkTrimMat
        );
        handrail.position.set(0, floorY + 0.575, bDepth / 2 + 0.98);
        this.buildingGroup.add(handrail);

        // Ventanales corredizos a suites en cada piso
        const suiteWindowGeo = new THREE.PlaneGeometry(2.0, 0.85);
        
        // Suite izquierda
        const winL = new THREE.Mesh(suiteWindowGeo, glassMat);
        winL.position.set(-1.4, floorY + 0.55, bDepth / 2 - 0.05);
        this.buildingGroup.add(winL);

        // Suite derecha
        const winR = new THREE.Mesh(suiteWindowGeo, glassMat);
        winR.position.set(1.7, floorY + 0.55, bDepth / 2 - 0.05);
        this.buildingGroup.add(winR);

        // Celosías verticales de madera decorativas entre balcones
        const louver = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.85, 0.55),
          woodLouverMat
        );
        louver.position.set(-0.3, floorY + 0.55, bDepth / 2 + 0.6);
        this.buildingGroup.add(louver);

        // Iluminación cálida en techos de balcones para la noche
        const balconySpot = new THREE.PointLight(0xffbe76, 0.8, 2.5);
        balconySpot.position.set(-1.4, floorY + 0.9, bDepth / 2 + 0.4);
        this.buildingGroup.add(balconySpot);
        this.nightLights.push(balconySpot);

        const balconySpotR = new THREE.PointLight(0xffbe76, 0.8, 2.5);
        balconySpotR.position.set(1.7, floorY + 0.9, bDepth / 2 + 0.4);
        this.buildingGroup.add(balconySpotR);
        this.nightLights.push(balconySpotR);
      } else {
        // Planta Baja: Ventanal panorámico de recepción / lobby
        const lobbyGlass = new THREE.Mesh(
          new THREE.PlaneGeometry(bWidth - 0.4, 0.9),
          glassMat
        );
        lobbyGlass.position.set(0, 0.55, bDepth / 2 - 0.05);
        this.buildingGroup.add(lobbyGlass);
      }
    }

    this.group.add(this.buildingGroup);
  }

  // ==========================================
  // 2. ROOFTOP PENTHOUSE & TERRAZA VERDE
  // ==========================================
  buildRooftop() {
    const roofY = 4.2; // Altura sobre el último piso
    const roofGroup = new THREE.Group();
    roofGroup.position.set(-0.8, roofY, -1.8);

    // Cubierta vegetal artificial en el rooftop
    const turfGeo = new THREE.BoxGeometry(5.8, 0.08, 4.2);
    const turfMat = new THREE.MeshStandardMaterial({
      color: 0x3d7026,
      roughness: 0.9
    });
    const turf = new THREE.Mesh(turfGeo, turfMat);
    turf.position.set(0, 0.04, 0.3);
    turf.castShadow = true;
    turf.receiveShadow = true;
    roofGroup.add(turf);

    // Suite Penthouse en la azotea (caja moderna retranqueada)
    const penthouseGeo = new THREE.BoxGeometry(3.2, 1.0, 2.4);
    const penthouseMat = new THREE.MeshStandardMaterial({ color: 0xded9d2, roughness: 0.5 });
    const penthouse = new THREE.Mesh(penthouseGeo, penthouseMat);
    penthouse.position.set(-0.8, 0.55, 0);
    penthouse.castShadow = true;
    roofGroup.add(penthouse);

    // Pérgola de madera en el rooftop
    const pergolaMat = new THREE.MeshStandardMaterial({ color: 0x5a3e28, roughness: 0.7 });
    for (let p = 0; p < 5; p++) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.08), pergolaMat);
      beam.position.set(1.4, 1.05, -0.6 + p * 0.4);
      roofGroup.add(beam);
    }
    // Postes de la pérgola
    const pPost1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.08), pergolaMat);
    pPost1.position.set(0.5, 0.5, -0.6);
    roofGroup.add(pPost1);
    const pPost2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.08), pergolaMat);
    pPost2.position.set(2.3, 0.5, -0.6);
    roofGroup.add(pPost2);
    const pPost3 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.08), pergolaMat);
    pPost3.position.set(0.5, 0.5, 1.0);
    roofGroup.add(pPost3);
    const pPost4 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.0, 0.08), pergolaMat);
    pPost4.position.set(2.3, 0.5, 1.0);
    roofGroup.add(pPost4);

    // Tumbonas en el rooftop
    const loungerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const rLounger1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.9), loungerMat);
    rLounger1.position.set(1.2, 0.1, 0.2);
    roofGroup.add(rLounger1);

    const rLounger2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.9), loungerMat);
    rLounger2.position.set(1.8, 0.1, 0.2);
    roofGroup.add(rLounger2);

    // Barandilla perimetral de vidrio en la azotea
    const roofGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x98d4eb,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0.1
    });
    const roofRail = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 0.45), roofGlassMat);
    roofRail.position.set(0, 0.3, 2.35);
    roofGroup.add(roofRail);

    this.group.add(roofGroup);
  }

  // ==========================================
  // 3. PISCINA INFINITY EXCAVADA Y SOLARIUM
  // ==========================================
  buildPoolAndDeck() {
    this.poolGroup = new THREE.Group();
    // Ubicada en la esquina frontal derecha (X: ~2.5, Z: ~2.75)
    this.poolGroup.position.set(2.5, 0, 2.75);

    // A. Solarium de Coralina alrededor de la piscina
    const deckMat = new THREE.MeshStandardMaterial({
      map: this.tileTexture,
      roughness: 0.7,
      metalness: 0.05
    });

    // Pasillo solarium posterior
    const backDeck = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.05, 1.0), deckMat);
    backDeck.position.set(0, 0.025, -1.6);
    backDeck.receiveShadow = true;
    this.poolGroup.add(backDeck);

    // Pasillo solarium izquierdo
    const leftDeck = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 3.2), deckMat);
    leftDeck.position.set(-1.9, 0.025, 0.5);
    leftDeck.receiveShadow = true;
    this.poolGroup.add(leftDeck);

    // B. Vaso de la piscina (Interior azul turquesa)
    const poolBasinWidth = 3.6;
    const poolBasinLength = 3.1;
    const poolDepth = 0.95;

    const basinMat = new THREE.MeshStandardMaterial({
      color: 0x1aa0b8, // Mosaico vítreo azul caribeño
      roughness: 0.3,
      metalness: 0.1
    });

    // Fondo de la piscina
    const poolFloor = new THREE.Mesh(
      new THREE.BoxGeometry(poolBasinWidth, 0.05, poolBasinLength),
      basinMat
    );
    poolFloor.position.set(0.4, -poolDepth, 0.55);
    poolFloor.receiveShadow = true;
    this.poolGroup.add(poolFloor);

    // C. Muros interiores del vaso
    // Muro trasero interior
    const pWallB = new THREE.Mesh(new THREE.BoxGeometry(poolBasinWidth, poolDepth, 0.08), basinMat);
    pWallB.position.set(0.4, -poolDepth / 2, -0.98);
    this.poolGroup.add(pWallB);

    // Muro izquierdo interior
    const pWallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, poolDepth, poolBasinLength), basinMat);
    pWallL.position.set(-1.38, -poolDepth / 2, 0.55);
    this.poolGroup.add(pWallL);

    // D. Pared de cristal / Hormigón visto en el corte frontal y lateral exterior
    // (Fiel a la Imagen 3: la piscina muestra el corte transversal visible)
    const glassEdgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x4dd8e6,
      transparent: true,
      opacity: 0.55,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.33
    });

    // Borde de cristal frontal
    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(poolBasinWidth, poolDepth, 0.12), glassEdgeMat);
    glassFront.position.set(0.4, -poolDepth / 2, 2.12);
    this.poolGroup.add(glassFront);

    // Borde de cristal lateral derecho
    const glassRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, poolDepth, poolBasinLength), glassEdgeMat);
    glassRight.position.set(2.18, -poolDepth / 2, 0.55);
    this.poolGroup.add(glassRight);

    // E. Superficie del Agua con caustics y refracción turquesa
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x18c4db,
      transparent: true,
      opacity: 0.78,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.333,
      normalMap: this.waterNormal,
      normalScale: new THREE.Vector2(0.3, 0.3)
    });

    const waterGeo = new THREE.PlaneGeometry(poolBasinWidth, poolBasinLength);
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.set(0.4, -0.1, 0.55);
    this.poolGroup.add(this.waterMesh);

    // Luz subacuática turquesa para iluminación nocturna de lujo
    this.poolLight = new THREE.PointLight(0x00f0ff, 2.5, 6);
    this.poolLight.position.set(0.4, -0.4, 0.55);
    this.poolGroup.add(this.poolLight);
    this.nightLights.push(this.poolLight);

    // Escalera de acceso a la piscina
    const ladderMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
    const ladderRail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), ladderMat);
    ladderRail1.position.set(-1.25, 0.1, -0.8);
    this.poolGroup.add(ladderRail1);
    const ladderRail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), ladderMat);
    ladderRail2.position.set(-1.05, 0.1, -0.8);
    this.poolGroup.add(ladderRail2);

    this.group.add(this.poolGroup);
  }

  // ==========================================
  // 4. TUMBONAS Y SOMBRILLAS MULTICOLOR
  // ==========================================
  buildPeopleAndLoungers() {
    this.loungersGroup = new THREE.Group();
    this.loungersGroup.position.set(2.5, 0, 2.75);

    // Colores caribeños de sombrillas (fiel a la Imagen 3: amarillo, cian, magenta, coral)
    const umbrellaColors = [0xffd13b, 0x17d2e8, 0xe0328b, 0xff6b4a];

    // Fila de tumbonas con sombrillas en el solarium posterior
    for (let i = 0; i < 4; i++) {
      const lx = -1.2 + i * 0.9;
      const lz = -1.6;

      // Tumbona blanca
      const lounger = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.1, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      lounger.position.set(lx, 0.08, lz);
      lounger.castShadow = true;
      this.loungersGroup.add(lounger);

      // Respaldo inclinado
      const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.08, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      backrest.position.set(lx, 0.18, lz - 0.28);
      backrest.rotation.x = -0.5;
      backrest.castShadow = true;
      this.loungersGroup.add(backrest);

      // Sombrilla caribeña
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 1.2, 6),
        new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.6 })
      );
      pole.position.set(lx + 0.28, 0.6, lz);
      pole.castShadow = true;
      this.loungersGroup.add(pole);

      const canopy = new THREE.Mesh(
        new THREE.ConeGeometry(0.48, 0.2, 8),
        new THREE.MeshStandardMaterial({
          color: umbrellaColors[i % umbrellaColors.length],
          roughness: 0.6,
          side: THREE.DoubleSide
        })
      );
      canopy.position.set(lx + 0.28, 1.2, lz);
      canopy.castShadow = true;
      this.loungersGroup.add(canopy);
    }

    // Figuritas humanas estilizadas en escala arquitectónica (escala 1:100)
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd9a27e, roughness: 0.8 });
    const clothesColors = [0x2563eb, 0xd97706, 0x059669, 0xdc2626];

    // Huéspedes en la piscina / borde
    const swimmerPositions = [
      { x: 0.1, y: -0.2, z: 0.4 },
      { x: 1.2, y: -0.25, z: 1.1 },
      { x: -0.8, y: 0.05, z: 0.1 } // sentado en el borde
    ];

    swimmerPositions.forEach((pos, idx) => {
      const person = new THREE.Group();
      // Cabeza
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
      head.position.y = 0.25;
      person.add(head);

      // Torso
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.07, 0.22, 6),
        new THREE.MeshStandardMaterial({ color: clothesColors[idx % clothesColors.length] })
      );
      torso.position.y = 0.11;
      person.add(torso);

      person.position.set(pos.x, pos.y, pos.z);
      this.loungersGroup.add(person);
    });

    this.group.add(this.loungersGroup);
  }

  // ==========================================
  // 5. ESTACIONAMIENTO Y VEHÍCULOS
  // ==========================================
  buildDrivewayAndCars() {
    this.drivewayGroup = new THREE.Group();
    this.drivewayGroup.position.set(-3.6, 0, 2.5);

    // Calzada de adoquines asfaltados
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x3d4349,
      roughness: 0.85
    });

    const roadGeo = new THREE.BoxGeometry(2.4, 0.04, 4.4);
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.position.set(0, 0.02, 0);
    road.receiveShadow = true;
    this.drivewayGroup.add(road);

    // Líneas de aparcamiento blancas
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let l = -1; l <= 1; l++) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.8), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(l * 0.9, 0.042, 0.3);
      this.drivewayGroup.add(line);
    }

    // Coche 1: SUV Moderno Blanco (como en la Imagen 3)
    const suv = this.createCar(0xf4f4f4, 1.5, 0.75, 0.65);
    suv.position.set(-0.45, 0.05, 0.3);
    suv.rotation.y = Math.PI;
    this.drivewayGroup.add(suv);

    // Coche 2: Sedán Gris Grafito Metalizado
    const sedan = this.createCar(0x4a5568, 1.4, 0.7, 0.55);
    sedan.position.set(0.45, 0.05, 0.3);
    sedan.rotation.y = Math.PI;
    this.drivewayGroup.add(sedan);

    this.group.add(this.drivewayGroup);
  }

  createCar(bodyColor, length = 1.4, width = 0.7, height = 0.6) {
    const car = new THREE.Group();

    // Carrocería principal inferior
    const carMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.25,
      metalness: 0.6
    });

    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(width, height * 0.5, length),
      carMat
    );
    lowerBody.position.y = height * 0.35;
    lowerBody.castShadow = true;
    car.add(lowerBody);

    // Habitáculo / Cabina de cristal superior
    const cabinMat = new THREE.MeshPhysicalMaterial({
      color: 0x1f2937,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });

    const upperCabin = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.85, height * 0.45, length * 0.55),
      cabinMat
    );
    upperCabin.position.set(0, height * 0.72, -length * 0.05);
    upperCabin.castShadow = true;
    car.add(upperCabin);

    // Ruedas negras con llantas
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 10);

    const wheelPos = [
      { x: -width / 2, z: length * 0.3 },
      { x: width / 2, z: length * 0.3 },
      { x: -width / 2, z: -length * 0.3 },
      { x: width / 2, z: -length * 0.3 }
    ];

    wheelPos.forEach(p => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(p.x, 0.12, p.z);
      wheel.castShadow = true;
      car.add(wheel);
    });

    return car;
  }

  // ==========================================
  // 6. TERRAZA CAFETERÍA / RESTAURANTE EXTERIOR
  // ==========================================
  buildOutdoorCafe() {
    this.cafeGroup = new THREE.Group();
    this.cafeGroup.position.set(1.4, 0, -0.6);

    // Pérgola exterior de comedor
    const pergolaMat = new THREE.MeshStandardMaterial({ color: 0x8a6344, roughness: 0.7 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.6 });

    // Cubierta de lona tensada beige
    const awning = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 1.8), canopyMat);
    awning.position.set(0, 1.8, 0);
    awning.castShadow = true;
    this.cafeGroup.add(awning);

    // Mesitas de restaurante con sillas
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });

    const tablePositions = [
      { x: -0.6, z: -0.4 },
      { x: 0.6, z: -0.4 },
      { x: 0, z: 0.4 }
    ];

    tablePositions.forEach(tp => {
      const table = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.38, 8), tableMat);
      table.position.set(tp.x, 0.19, tp.z);
      table.castShadow = true;
      this.cafeGroup.add(table);

      // 2 sillas por mesa
      [-0.32, 0.32].forEach(offset => {
        const chair = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.18), chairMat);
        chair.position.set(tp.x + offset, 0.11, tp.z);
        chair.castShadow = true;
        this.cafeGroup.add(chair);
      });
    });

    this.group.add(this.cafeGroup);
  }

  /**
   * Animación de construcción o desmontaje del resort
   * @param {number} progress 0.0 a 1.0
   */
  setConstructionProgress(progress) {
    if (progress <= 0.001) {
      this.group.visible = false;
      return;
    }

    this.group.visible = true;
    const clamped = Math.max(0, Math.min(1, progress));

    // El resort emerge progresivamente desde los cimientos con escala vertical y opacidad
    this.group.position.y = (clamped - 1) * 1.5;
    this.group.scale.set(clamped, clamped, clamped);
  }

  update(time) {
    // Animación sutil de ondas de agua de la piscina
    if (this.waterMesh && this.waterMesh.material.normalMap) {
      this.waterMesh.material.normalMap.offset.x = Math.sin(time * 0.8) * 0.05;
      this.waterMesh.material.normalMap.offset.y = Math.cos(time * 0.6) * 0.05;
    }
  }

  setNightMode(isNight) {
    this.nightLights.forEach(light => {
      light.intensity = isNight ? 2.5 : 0.4;
    });
  }
}
