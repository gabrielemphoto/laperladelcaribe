import * as THREE from 'three';
import { createCinderBlockTexture, createParquetTexture, createWoodTexture } from './textures.js';

/**
 * PROYECTO 3: Habitación en Obra Gris ➔ Suite Remodelada "EN ALQUILER"
 * Habitación isométrica abierta (corte transversal arquitectónico)
 * que evoluciona de paredes peladas de cemento a un apartamento de diseño
 * completamente amoblado con el aviso destacado "EN ALQUILER".
 */
export class ProjectRoomRemodel {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'project-3-room-remodel';

    this.cinderTex = createCinderBlockTexture();
    this.parquetTex = createParquetTexture();
    this.woodTex = createWoodTexture();

    this.buildRoomShell();
    this.buildObraGrisContent();
    this.buildLuxuryRemodelContent();
    this.buildForRentSign();

    this.setTransition(0);
  }

  buildRoomShell() {
    this.shellGroup = new THREE.Group();
    this.group.add(this.shellGroup);
  }

  // ==========================================
  // ESTADO A: OBRA GRIS / PAREDES PELADAS
  // ==========================================
  buildObraGrisContent() {
    this.obraGrisGroup = new THREE.Group();

    const cinderMat = new THREE.MeshStandardMaterial({
      map: this.cinderTex,
      roughness: 0.95
    });

    const roughFloorMat = new THREE.MeshStandardMaterial({
      color: 0x5e6063, // Suelo de hormigón rústico
      roughness: 0.95
    });

    // 1. Suelo de hormigón crudo (5.0 x 5.0)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.2, 5.0), roughFloorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    this.obraGrisGroup.add(floor);

    // 2. Pared trasera de bloques de cemento
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.4, 0.2), cinderMat);
    backWall.position.set(0, 1.6, -2.4);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    this.obraGrisGroup.add(backWall);

    // 3. Pared izquierda de bloques con hueco de ventana en bruto
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.4, 5.0), cinderMat);
    leftWall.position.set(-2.4, 1.6, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    this.obraGrisGroup.add(leftWall);

    // 4. Cables eléctricos colgando del techo y tubos vistos
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
    const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4.6, 6), pipeMat);
    conduit.rotation.z = Math.PI / 2;
    conduit.position.set(0, 3.1, -2.25);
    this.obraGrisGroup.add(conduit);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0xe67e22 });
    for (let w = 0; w < 3; w++) {
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 4), wireMat);
      wire.position.set(-1.0 + w * 1.0, 2.8, -2.25);
      this.obraGrisGroup.add(wire);
    }

    // 5. Cubeta de pintura / escombros en el suelo
    const bucket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0xdddddd })
    );
    bucket.position.set(1.2, 0.18, 1.0);
    this.obraGrisGroup.add(bucket);

    this.group.add(this.obraGrisGroup);
  }

  // ==========================================
  // ESTADO B: REMODELADO DE LUJO
  // ==========================================
  buildLuxuryRemodelContent() {
    this.luxuryRoomGroup = new THREE.Group();

    const luxuryWallMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee, // Blanco roto / lino cálido
      roughness: 0.5
    });

    const woodAccentMat = new THREE.MeshStandardMaterial({
      map: this.woodTex,
      roughness: 0.6
    });

    const parquetMat = new THREE.MeshStandardMaterial({
      map: this.parquetTex,
      roughness: 0.4
    });

    // 1. Suelo de parquet pulido brillante
    const floor = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.22, 5.0), parquetMat);
    floor.position.set(0, -0.09, 0);
    floor.receiveShadow = true;
    this.luxuryRoomGroup.add(floor);

    // 2. Pared trasera con panel acústico decorativo de listones de madera
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.4, 0.22), luxuryWallMat);
    backWall.position.set(0, 1.6, -2.39);
    this.luxuryRoomGroup.add(backWall);

    const woodPanel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 0.06), woodAccentMat);
    woodPanel.position.set(-0.6, 1.6, -2.25);
    this.luxuryRoomGroup.add(woodPanel);

    // Cuadro de arte moderno contemporáneo
    const artFrame = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 })
    );
    artFrame.position.set(1.4, 2.0, -2.27);
    this.luxuryRoomGroup.add(artFrame);

    // 3. Pared lateral con gran ventanal panorámico
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.4, 5.0), luxuryWallMat);
    leftWall.position.set(-2.39, 1.6, 0);
    this.luxuryRoomGroup.add(leftWall);

    // Ventana panorámica con cristales y vistas caribeñas
    const winGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 2.2),
      new THREE.MeshPhysicalMaterial({ color: 0x88d4f0, transparent: true, opacity: 0.45, roughness: 0.05 })
    );
    winGlass.rotation.y = Math.PI / 2;
    winGlass.position.set(-2.25, 1.6, 0);
    this.luxuryRoomGroup.add(winGlass);

    // Marco negro minimalista de la ventana
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8 });
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.24, 3.04), frameMat);
    winFrame.position.set(-2.25, 1.6, 0);
    this.luxuryRoomGroup.add(winFrame);

    // 4. Cama Queen Size de Diseño
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x2b3748, roughness: 0.6 });
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 2.2), bedMat);
    bedBase.position.set(-0.6, 0.2, -0.9);
    bedBase.castShadow = true;
    this.luxuryRoomGroup.add(bedBase);

    // Colchón y edredón blanco con doblado
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.25, 2.05), mattressMat);
    mattress.position.set(-0.6, 0.48, -0.9);
    this.luxuryRoomGroup.add(mattress);

    const duvetMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.12, 1.4), duvetMat);
    duvet.position.set(-0.6, 0.58, -0.6);
    this.luxuryRoomGroup.add(duvet);

    // Almohadas
    for (let p = -1; p <= 1; p += 2) {
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.15, 0.4), mattressMat);
      pillow.position.set(-0.6 + p * 0.5, 0.65, -1.65);
      pillow.rotation.x = 0.2;
      this.luxuryRoomGroup.add(pillow);
    }

    // 5. Mesitas de noche flotantes con lámparas de luz cálida
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });
    [-1.9, 0.7].forEach(x => {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.4), tableMat);
      stand.position.set(x, 0.35, -1.65);
      this.luxuryRoomGroup.add(stand);

      // Lámpara moderna
      const lamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.25, 8),
        new THREE.MeshStandardMaterial({ color: 0xfff0c9, roughness: 0.2 })
      );
      lamp.position.set(x, 0.65, -1.65);
      this.luxuryRoomGroup.add(lamp);

      // Luz cálida de la mesita
      const lampLight = new THREE.PointLight(0xffb74d, 1.6, 3.5);
      lampLight.position.set(x, 0.8, -1.65);
      this.luxuryRoomGroup.add(lampLight);
    });

    // 6. Planta de interior tropical en maceta blanca
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.15, 0.45, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    pot.position.set(1.7, 0.25, 1.4);
    this.luxuryRoomGroup.add(pot);

    const plantTop = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.35, 1),
      new THREE.MeshStandardMaterial({ color: 0x22661f, roughness: 0.7 })
    );
    plantTop.position.set(1.7, 0.65, 1.4);
    this.luxuryRoomGroup.add(plantTop);

    // 7. Alfombra nórdica circular en el centro
    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8d4cb, roughness: 0.9 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0.4, 0.02, 0.7);
    this.luxuryRoomGroup.add(rug);

    this.group.add(this.luxuryRoomGroup);
  }

  // ==========================================
  // CARTEL DESTACADO: "EN ALQUILER"
  // ==========================================
  buildForRentSign() {
    this.signGroup = new THREE.Group();
    this.signGroup.position.set(0.6, 2.6, 1.2);

    // Marco / Placa dorada flotante
    const plateGeo = new THREE.BoxGeometry(2.4, 0.7, 0.08);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Azul oscuro profundo
      roughness: 0.2,
      metalness: 0.8
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    this.signGroup.add(plate);

    // Borde dorado reflectante
    const borderGeo = new THREE.BoxGeometry(2.46, 0.76, 0.06);
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Oro caribeño
      roughness: 0.1,
      metalness: 0.9
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.02;
    this.signGroup.add(border);

    // Canvas de texto "EN ALQUILER • RENTAS ACTIVAS"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 160;
    const sCtx = signCanvas.getContext('2d');

    // Fondo azul marino con degradado
    const g = sCtx.createLinearGradient(0, 0, 512, 160);
    g.addColorStop(0, '#0f172a');
    g.addColorStop(1, '#1e293b');
    sCtx.fillStyle = g;
    sCtx.fillRect(0, 0, 512, 160);

    // Texto principal
    sCtx.fillStyle = '#fbbf24'; // Dorado brillante
    sCtx.font = 'bold 54px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('🔑 EN ALQUILER', 256, 68);

    // Subtítulo
    sCtx.fillStyle = '#38bdf8'; // Azul cian
    sCtx.font = '600 26px sans-serif';
    sCtx.fillText('100% AMOBLADO • ROI +24%', 256, 120);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const textMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 0.65),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    textMesh.position.z = 0.045;
    this.signGroup.add(textMesh);

    this.luxuryRoomGroup.add(this.signGroup);
  }

  /**
   * Transición animada entre Estado A (Obra Gris, t=0) y Estado B (Remodelado "EN ALQUILER", t=1)
   */
  setTransition(t) {
    t = Math.max(0, Math.min(1, t));

    if (t < 0.01) {
      this.obraGrisGroup.visible = true;
      this.luxuryRoomGroup.visible = false;
      this.obraGrisGroup.scale.set(1, 1, 1);
    } else if (t > 0.99) {
      this.obraGrisGroup.visible = false;
      this.luxuryRoomGroup.visible = true;
      this.luxuryRoomGroup.scale.set(1, 1, 1);
    } else {
      this.obraGrisGroup.visible = true;
      this.luxuryRoomGroup.visible = true;

      // Efecto ola de remodelación: emerge con escala y opacidad
      this.luxuryRoomGroup.scale.set(t, t, t);
      this.obraGrisGroup.scale.set(1 - t * 0.4, 1 - t * 0.4, 1 - t * 0.4);
    }

    // Leve flotación del cartel "EN ALQUILER"
    if (this.signGroup) {
      this.signGroup.position.y = 2.6 + Math.sin(performance.now() * 0.003) * 0.04;
    }
  }
}
