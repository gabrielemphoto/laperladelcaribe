# 🌐 Modelo 3D Interactivo • La Perla del Caribe

Visor 3D WebGL interactivo en tiempo real que modela la evolución arquitectónica de un lote de terreno en Isla de Margarita a través de 3 fases continuas:

1. **🌱 Fase 0: Terreno Virgen (Lote en Bruto)**: Bloque de tierra con corte geológico estratigráfico (humus fértil, raíces colgantes, arcilla y roca madre) y delimitación topográfica con hitos perimetrales.
2. **🏡 Fase 1: Cabaña Modular Sustentable**: Casa prefabricada moderna con listones de madera de teca, revestimiento antracita, cubierta solar fotovoltaica 100% autosuficiente, terraza de madera, sendero de gravilla con balizas LED y climatización.
3. **🏨 Fase 2: Resort Boutique & Spa Caribeño**: Complejo hotelero de 4 plantas con suites de lujo, balcones voladizos de cristal, **piscina infinity excavada en la roca con corte transversal visible**, solarium con tumbonas y sombrillas multicolores, palmeras caribeñas y zona de estacionamiento.

---

## 🚀 Inicio Rápido Local

Para visualizar el modelo en desarrollo local:

```bash
npm run dev
```

Abre en tu navegador:
👉 **`http://localhost:5173/modelo-3d/`**

Para compilar la versión optimizada de producción:

```bash
npm run build
```

Los archivos generados se ubicarán en `dist/modelo-3d/`.

---

## 📦 Cómo Incrustar en Cualquier Página Web

El visor está diseñado para ser **100% incrustable** en cualquier gestor de contenidos o web personalizada mediante una etiqueta `<iframe>`:

### 1. Inserción Responsiva (Recomendada)
```html
<div style="position: relative; width: 100%; max-width: 1200px; height: 650px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.18);">
  <iframe 
    src="https://tudominio.com/modelo-3d/?embed=true" 
    width="100%" 
    height="100%" 
    style="border: none;" 
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    loading="lazy"
    title="Modelo 3D Interactivo - La Perla del Caribe">
  </iframe>
</div>
```

### 2. Inserción Directa con Tamaño Fijo
```html
<iframe 
  src="https://tudominio.com/modelo-3d/?embed=true" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 16px;" 
  allow="fullscreen">
</iframe>
```

---

## 🎛️ Parámetros de URL Disponibles

Puedes controlar el comportamiento del visor al incrustarlo añadiendo parámetros en la URL:

| Parámetro | Valores | Descripción |
|---|---|---|
| `phase` | `0`, `1`, `2` | Define la fase con la que inicia el modelo (`0` = Terreno, `1` = Cabaña, `2` = Resort). |
| `embed` | `true` | Activa el modo embebido limpio (oculta la cabecera superior de la marca para no duplicar menús). |
| `time` | `day`, `sunset`, `night` | Controla la iluminación horaria (`day` = Sol Caribeño, `sunset` = Atardecer Dorado, `night` = Luces nocturnas). |
| `autorotate` | `true` | Activa el giro orbital automático continuo de 360° ideal para vitrinas inmobiliarias. |

**Ejemplo:**
```text
https://tudominio.com/modelo-3d/?phase=1&time=sunset&autorotate=true&embed=true
```

---

## 📁 Estructura de Archivos

```
b:\LAPERLADELCARIBE\modelo-3d\
├── index.html           # Página del visor, UI glassmorphic y modal de incrustación
├── style.css            # Estilos modernos, dock inferior responsivo y temas
├── main.js              # Controlador principal Three.js, cámara, luces y animación
├── modules/
│   ├── terrain.js       # Bloque de tierra geológico con fosa de excavación dinámica
│   ├── vegetation.js    # Maleza silvestre y palmeras tropicales / setos
│   ├── cabin.js         # Cabaña modular con cubierta solar fotovoltaica
│   ├── resort.js        # Hotel de 4 plantas y piscina infinity excavada
│   ├── textures.js      # Texturas procedurales de alta definición (estratos, madera, agua, celdas solares)
│   ├── sound.js         # Motor de audio con Web Audio API (efectos de clic y construcción)
│   └── embed-helper.js  # Gestor de iframe, capturas HD y pantalla completa
└── assets/
    ├── fase-0-terreno.jpg
    ├── fase-1-cabana.jpg
    └── fase-2-resort.jpg
```
