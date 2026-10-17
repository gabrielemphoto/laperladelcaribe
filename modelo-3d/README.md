# 🌐 Visor 3D Interactivo Ultraligero • La Perla del Caribe

Visor 3D WebGL con **fondo 100% transparente**, rotación continua interactiva y navegación limpia mediante **únicamente dos flechas laterales** (⬅️ y ➡️).

---

## 🏗️ Los 3 Proyectos / Modelos Incluidos

El visor cicla automáticamente cada proyecto en un bucle continuo de **2 segundos por fase** (con transición fluida de 0.7s):

1. **🌱 Proyecto 1: Terreno Virgen ➔ Construcción Eco-Sostenible**
   * **Fase A (2s):** Lote de terreno virgen con corte estratigráfico (humus, raíces, arcilla y roca madre) y delimitación topográfica.
   * **Animación (0.7s):** La cabaña desciende suavemente sobre el terreno mientras la maleza se adapta.
   * **Fase B (2s):** Cabaña modular terminada con cubierta solar fotovoltaica 100% autosuficiente, listones de madera de teca, terraza y acabados modernos.

2. **🏨 Proyecto 2: Hotel Abandonado ➔ Resort de Lujo (+Ganancias)**
   * **Fase A (2s):** Estructura hotelera en ruinas con hormigón envejecido y manchado, ventanas tapiadas y fosa de piscina seca y abandonada.
   * **Animación (0.7s):** Ola de remodelación integral.
   * **Fase B (2s):** Hotel boutique remodelado de hormigón blanco y madera, piscina llena de agua turquesa cristalina con iluminación, palmeras, tumbonas con sombrillas caribeñas y huéspedes disfrutando mientras genera rentas activas.

3. **🔑 Proyecto 3: Habitación en Obra Gris ➔ Suite "EN ALQUILER"**
   * **Fase A (2s):** Habitación abierta con paredes peladas de bloques de cemento, cables eléctricos colgados y suelo rústico de concreto.
   * **Animación (0.7s):** Transformación y amoblado en tiempo real.
   * **Fase B (2s):** Apartamento de diseño contemporáneo con paredes lisas, panel acústico de madera, cama queen size de lujo, lámparas de noche cálidas, ventanal panorámico y cartel destacado flotante: **"🔑 EN ALQUILER • 100% Amoblado • ROI +24%"**.

---

## 🎮 Controles y Experiencia

* **Flechas Laterales (⬅️ / ➡️):** Cambian inmediatamente entre los 3 proyectos. También admite teclas de flecha del teclado y deslizamiento táctil (*swipe* en móviles).
* **Giro Continuo:** El modelo siempre está en movimiento suave y elegante (`autoRotate`). El usuario puede además agarrar y arrastrar para orbitar en 360°, hacer zoom o inspeccionar desde cualquier ángulo.
* **Fondo Transparente:** No tiene marcos, cajas ni fondos opacos. Se integra naturalmente sobre cualquier sección de tu web.
* **Sin menús pesados:** Sin selectores de hora, sin botones de captura, sin pestañas sobrecargadas.

---

## 📦 Cómo Incrustarlo en Tu Web

Al tener fondo transparente y diseño responsivo, simplemente añade una etiqueta `<iframe>`:

```html
<iframe 
  src="./modelo-3d/" 
  width="100%" 
  height="600" 
  style="border: none; background: transparent;" 
  allow="accelerometer; autoplay; encrypted-media; gyroscope"
  loading="lazy">
</iframe>
```
