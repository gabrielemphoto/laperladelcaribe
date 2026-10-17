/**
 * MARKETPLACE INMOBILIARIO • LA PERLA DEL CARIBE
 * Miguel Ángel - Personal Shopper & Constructor • Isla de Margarita
 * Lógica: Filtros Reactivos en Tiempo Real, Ficha Lateral / Bottom Sheet, WhatsApp Dinámico y Mini Mapa
 */

const WHATSAPP_PHONE = '34676597068';

// Catálogo de Propiedades en Isla de Margarita
const PROPERTIES = [
  {
    id: 'prop-1',
    title: 'Villa Sunset Horizon • Bahía de Pampatar',
    zone: 'pampatar',
    zoneName: 'Pampatar (Milla de Oro)',
    type: 'villa',
    typeName: 'Villa de Autor & Lujo',
    price: 285000,
    priceDisplay: '$285,000 USD',
    roi: '19% Anual Est.',
    rating: '4.9/5',
    areaPlot: 850,
    areaBuilt: 420,
    rooms: 4,
    baths: 5,
    garage: 3,
    amenities: ['pozo', 'planta', 'playa', 'notaria', 'zee'],
    tagBadge: 'Villa',
    status: 'Disponible ZEE',
    images: [
      '../assets/images/margarita-sunset-villa.jpg',
      '../assets/images/hero-luxury-villa.jpg',
      '../assets/images/margarita-villa-white.jpg'
    ],
    desc: 'Exclusiva villa de arquitectura tropical moderna en La Caranta, Bahía de Pampatar. Equipada con pozo privado de agua dulce (aforo de 1.8 l/s) y sistema híbrido solar con planta eléctrica insonorizada. Piscina infinity con vista frontal al mar Caribe, 4 suites con vestidor y acabados en piedra coralina.',
    features: ['Piscina Infinity Panorámica', 'Pozo Propio Dulce Activo', 'Generador 100% Autonomía', 'Registro Inmobiliario 100% Solvente', 'Operativa para Rentas Turísticas VIP'],
    coords: [10.9986, -63.7981]
  },
  {
    id: 'prop-2',
    title: 'Parcela Costera Bahía de Pampatar',
    zone: 'pampatar',
    zoneName: 'Pampatar (Milla de Oro)',
    type: 'terreno',
    typeName: 'Terreno Virgen Frente al Mar',
    price: 85000,
    priceDisplay: '$85,000 USD',
    roi: '22% Plusvalía',
    rating: '4.8/5',
    areaPlot: 1450,
    areaBuilt: 0,
    rooms: 0,
    baths: 0,
    garage: 0,
    amenities: ['pozo', 'playa', 'notaria', 'zee'],
    tagBadge: 'Terreno',
    status: 'Suelo ZEE',
    images: [
      '../assets/images/margarita-beachfront-land.jpg',
      '../assets/images/iso-stage-1-terrain.jpg',
      '../assets/images/margarita-sunset-villa.jpg'
    ],
    desc: 'Lote premium frente a playa con zonificación turística-residencial de alta densidad en la Milla de Oro de Pampatar. Estudio hidrológico favorable para perforación de pozo de agua dulce y acometida eléctrica a pie de parcela. Ideal para desarrollar complejo de 6 villas boutique.',
    features: ['Frente de Playa 45m Lineales', 'Zonificación Turística R-5', 'Estudio de Pozo Favorable', 'Tradición Legal 50 Años Verificada', 'Exención Fiscal ZEE'],
    coords: [11.002, -63.795]
  },
  {
    id: 'prop-3',
    title: 'Eco-Resort Boutique & Kitesurf El Yaque',
    zone: 'el-yaque',
    zoneName: 'Playa El Yaque',
    type: 'hotel',
    typeName: 'Posada Hotelera Operativa',
    price: 390000,
    priceDisplay: '$390,000 USD',
    roi: '21% Anual Est.',
    rating: '5.0/5',
    areaPlot: 2100,
    areaBuilt: 880,
    rooms: 14,
    baths: 16,
    garage: 6,
    amenities: ['pozo', 'planta', 'playa', 'notaria', 'zee'],
    tagBadge: 'Hotel / Posada',
    status: 'Ocupación 84%',
    images: [
      '../assets/images/margarita-posada-resort.jpg',
      '../assets/images/margarita-boutique-hotel.jpg',
      '../assets/images/hero-luxury-villa.jpg'
    ],
    desc: 'Complejo hotelero en pleno funcionamiento a 80 metros de la orilla de Playa El Yaque, meca internacional del kitesurf. Cuenta con 14 habitaciones/bungalows equipados, restaurante-bar en patio colonial, piscina central, pozo de agua propio con planta de desalinización de respaldo y clientela europea recurrente.',
    features: ['14 Suites Climatizadas', 'Patio Central con Piscina & Bar', 'Pozo Propio + Desalinizadora', 'Licencia Turística Ministerio al Día', 'Facturación Demostrable en USD'],
    coords: [10.9023, -63.9635]
  },
  {
    id: 'prop-4',
    title: 'Penthouse Miramar Bahía • Costa Azul',
    zone: 'costa-azul',
    zoneName: 'Costa Azul / Porlamar',
    type: 'apartamento',
    typeName: 'Penthouse de Lujo',
    price: 145000,
    priceDisplay: '$145,000 USD',
    roi: '16% Anual Est.',
    rating: '4.7/5',
    areaPlot: 290,
    areaBuilt: 290,
    rooms: 3,
    baths: 4,
    garage: 2,
    amenities: ['pozo', 'planta', 'notaria'],
    tagBadge: 'Penthouse',
    status: 'Llave en Mano',
    images: [
      '../assets/images/margarita-lifestyle-enjoy.jpg',
      '../assets/images/hero-luxury-villa.jpg',
      '../assets/images/margarita-villa-white.jpg'
    ],
    desc: 'Ático duplex con terraza de 110 m² y jacuzzi privado con vista 360° a la bahía de Guaraguao y Porlamar. El edificio cuenta con pozo de agua profundo de gran caudal (agua 24/7 sin interrupción), doble vigilancia y planta eléctrica para áreas y ascensores.',
    features: ['Terraza 360° con Jacuzzi Climatizado', 'Edificio con Pozo Profundo Propio', 'Seguridad 24/7 con Control de Acceso', '2 Puestos Techados + Maletero', 'Listo para Habitar / Rentas'],
    coords: [10.9577, -63.8504]
  },
  {
    id: 'prop-5',
    title: 'Macrolote Turístico Bulevar Playa El Agua',
    zone: 'playa-el-agua',
    zoneName: 'Playa El Agua & Manzanillo',
    type: 'terreno',
    typeName: 'Macrolote Turístico Hotelero',
    price: 175000,
    priceDisplay: '$175,000 USD',
    roi: '25% Plusvalía',
    rating: '4.9/5',
    areaPlot: 5200,
    areaBuilt: 0,
    rooms: 0,
    baths: 0,
    garage: 0,
    amenities: ['pozo', 'playa', 'notaria', 'zee'],
    tagBadge: 'Macrolote',
    status: 'Proyecto ZEE',
    images: [
      '../assets/images/margarita-beachfront-land.jpg',
      '../assets/images/margarita-posada-resort.jpg',
      '../assets/images/iso-stage-1-terrain.jpg'
    ],
    desc: 'Parcela de 5,200 m² completamente plana a 120 metros del nuevo bulevar ecológico de Playa El Agua. Apta para desarrollo hotelero de gran escala, condohotel o club vacacional bajo la ley de incentivos y exenciones fiscales de la Zona Económica Especial de Nueva Esparta.',
    features: ['5,200 m² Terreno Plano', 'Acceso Asfaltado Directo', 'Estudio Hidrológico Aprobado', 'Beneficios Arancelarios ZEE', 'Solvencia Catastral Inmediata'],
    coords: [11.1448, -63.8617]
  },
  {
    id: 'prop-6',
    title: 'Lote Virgen Punta de Arenas • Macanao',
    zone: 'macanao',
    zoneName: 'Península de Macanao',
    type: 'terreno',
    typeName: 'Terreno Ecoturístico Virgen',
    price: 68000,
    priceDisplay: '$68,000 USD',
    roi: '23% Plusvalía',
    rating: '4.9/5',
    areaPlot: 3800,
    areaBuilt: 0,
    rooms: 0,
    baths: 0,
    garage: 0,
    amenities: ['playa', 'notaria', 'zee'],
    tagBadge: 'Eco-Terreno',
    status: 'Playa Virgen',
    images: [
      '../assets/images/margarita-beachfront-land.jpg',
      '../assets/images/hero-luxury-villa.jpg',
      '../assets/images/iso-stage-1-terrain.jpg'
    ],
    desc: '3,800 m² en primera línea de playa en Punta de Arenas, la bahía más serena y con los atardeceres dorados más impresionantes de Venezuela. Destino idóneo para eco-glamping de ultra lujo, posada autosustentable con energía solar o refugio privado.',
    features: ['Playa Virgen de Aguas Cristalinas', 'Atardecer Marino Frontal', 'Topografía 100% Aprovechable', 'Título Privado Registrado', 'Zona de Alta Proyección Turística'],
    coords: [10.9700, -64.2000]
  },
  {
    id: 'prop-7',
    title: 'Posada Colonial Histórica para Reforma',
    zone: 'pampatar',
    zoneName: 'Pampatar Casco Histórico',
    type: 'reforma',
    typeName: 'Inmueble Colonial para Reformar',
    price: 135000,
    priceDisplay: '$135,000 USD',
    roi: '24% Tras Reforma',
    rating: '4.8/5',
    areaPlot: 650,
    areaBuilt: 510,
    rooms: 8,
    baths: 8,
    garage: 2,
    amenities: ['pozo', 'notaria', 'zee'],
    tagBadge: 'Para Reforma',
    status: 'Oportunidad Reforma',
    images: [
      '../assets/images/margarita-posada-resort.jpg',
      '../assets/images/margarita-boutique-hotel.jpg',
      '../assets/images/hero-luxury-villa.jpg'
    ],
    desc: 'Propiedad de estilo colonial a pasos del Castillo San Carlos de Borromeo y la bahía de Pampatar. Estructura sólida con paredes de mampostería antigua, patio interior con aljibe tradicional y 8 habitaciones listas para ser reformadas en un hotel boutique de alta rentabilidad.',
    features: ['Ubicación Gastro-Histórica Única', 'Patio Central Colonial con Aljibe', 'Capacidad para 8-10 Suites de Lujo', 'Proyecto Arquitectónico de Reforma Incluido', 'Título de Propiedad Perfecto'],
    coords: [11.0005, -63.7995]
  },
  {
    id: 'prop-8',
    title: 'Villa Minimalista Bahía Juan Griego',
    zone: 'juan-griego',
    zoneName: 'Juan Griego / La Galera',
    type: 'villa',
    typeName: 'Villa Moderna & Atardecer',
    price: 195000,
    priceDisplay: '$195,000 USD',
    roi: '17% Anual Est.',
    rating: '4.8/5',
    areaPlot: 720,
    areaBuilt: 340,
    rooms: 3,
    baths: 4,
    garage: 2,
    amenities: ['pozo', 'planta', 'playa', 'notaria'],
    tagBadge: 'Villa',
    status: 'Disponible',
    images: [
      '../assets/images/margarita-villa-white.jpg',
      '../assets/images/margarita-sunset-villa.jpg',
      '../assets/images/hero-luxury-villa.jpg'
    ],
    desc: 'Villa contemporánea en la ladera con vista panorámica a la bahía de Juan Griego y la histórica Fortaleza de La Galera. Ventanales de suelo a techo, terraza voladiza con piscina infinity, pozo de agua manantial propio y sistema de cámaras inteligentes.',
    features: ['Vista al Mejor Atardecer del Caribe', 'Piscina Infinity en Terraza Volada', 'Pozo Manantial Dulce Propio', 'Acabados en Cemento Pulido y Teca', 'Totalmente Amoblada y Equipada'],
    coords: [11.0827, -63.9654]
  }
];

// Estado Global de Filtros
const state = {
  searchQuery: '',
  quickType: 'all',
  zones: [],
  pricePreset: 'all',
  minPrice: null,
  maxPrice: null,
  minArea: null,
  maxArea: null,
  types: [],
  amenities: [],
  sortBy: 'default',
  activePropertyId: 'prop-1'
};

let miniMapInstance = null;
let miniMapMarker = null;

document.addEventListener('DOMContentLoaded', () => {
  try { initNavbar(); } catch (e) { console.error('Error en initNavbar:', e); }
  try { bindHeaderNavFilters(); } catch (e) { console.error('Error en bindHeaderNavFilters:', e); }
  try { readUrlParams(); } catch (e) { console.error('Error en readUrlParams:', e); }
  try { bindFilterEvents(); } catch (e) { console.error('Error en bindFilterEvents:', e); }
  try { bindMobileDrawers(); } catch (e) { console.error('Error en bindMobileDrawers:', e); }
  try { bindGoogleFormModal(); } catch (e) { console.error('Error en bindGoogleFormModal:', e); }
  try { initPostulationForms(); } catch (e) { console.error('Error en initPostulationForms:', e); }
  try { renderGrid(); } catch (e) { console.error('Error en renderGrid:', e); }
  try { renderDetailPanel(state.activePropertyId); } catch (e) { console.error('Error en renderDetailPanel:', e); }
});

// Inicializar Floating Glass Navbar y Drawer Móvil
function initNavbar() {
  const headerWrap = document.querySelector('.header-floating-wrap');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  if (headerWrap) {
    const onScroll = () => {
      if (window.scrollY > 30) {
        headerWrap.classList.add('scrolled');
      } else {
        headerWrap.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileDrawer.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (headerWrap && !headerWrap.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Navegación rápida por Zonas y Ver Todo desde Header & Footer
function bindHeaderNavFilters() {
  document.querySelectorAll('[data-nav-zone]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const zone = link.dataset.navZone;
      if (!zone) return;

      const mobileDrawer = document.getElementById('mobile-nav-drawer');
      const mobileBtn = document.querySelector('.mobile-menu-btn');
      mobileDrawer?.classList.remove('open');
      mobileBtn?.setAttribute('aria-expanded', 'false');

      // Activar exclusivamente esta zona
      state.zones = [zone];
      document.querySelectorAll('input[name="filter-zone"]').forEach(cb => {
        cb.checked = (cb.value === zone);
      });

      renderGrid();

      const target = document.getElementById('properties-grid') || document.querySelector('.mp-layout-container');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('[data-nav-action="all"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const mobileDrawer = document.getElementById('mobile-nav-drawer');
      const mobileBtn = document.querySelector('.mobile-menu-btn');
      mobileDrawer?.classList.remove('open');
      mobileBtn?.setAttribute('aria-expanded', 'false');

      resetAllFilters();

      const target = document.getElementById('properties-grid') || document.querySelector('.mp-layout-container');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Leer parámetros de URL si viene desde la landing page
function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const zone = params.get('zone');
  const type = params.get('type');

  if (zone) {
    state.zones = [zone.toLowerCase()];
    const chk = document.querySelector(`input[name="filter-zone"][value="${zone.toLowerCase()}"]`);
    if (chk) chk.checked = true;
  }
  if (type) {
    state.quickType = type.toLowerCase();
    document.querySelectorAll('.mp-cat-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.catType === state.quickType);
    });
  }
}

// Enlazar Eventos de Filtro
function bindFilterEvents() {
  // Búsqueda en vivo
  const searchInput = document.getElementById('marketplace-search');
  const searchClear = document.getElementById('search-clear-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.classList.toggle('show', state.searchQuery.length > 0);
      }
      renderGrid();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        state.searchQuery = '';
        searchClear.classList.remove('show');
        renderGrid();
      }
    });
  }

  // Píldoras de Categoría Rápidas
  document.querySelectorAll('.mp-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.mp-cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.quickType = pill.dataset.catType;
      renderGrid();
    });
  });

  // Checkboxes de Zonas
  document.querySelectorAll('input[name="filter-zone"]').forEach(chk => {
    chk.addEventListener('change', () => {
      state.zones = Array.from(document.querySelectorAll('input[name="filter-zone"]:checked')).map(c => c.value);
      renderGrid();
    });
  });

  // Radios de Precio
  document.querySelectorAll('input[name="filter-price-preset"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.pricePreset = radio.value;
      const customWrap = document.getElementById('price-custom-wrap');
      if (customWrap) {
        customWrap.style.display = state.pricePreset === 'custom' ? 'flex' : 'none';
      }
      renderGrid();
    });
  });

  // Inputs Min / Max Precio
  const minPriceInput = document.getElementById('price-min-input');
  const maxPriceInput = document.getElementById('price-max-input');
  [minPriceInput, maxPriceInput].forEach(inp => {
    inp?.addEventListener('input', () => {
      state.minPrice = minPriceInput?.value ? parseFloat(minPriceInput.value) : null;
      state.maxPrice = maxPriceInput?.value ? parseFloat(maxPriceInput.value) : null;
      renderGrid();
    });
  });

  // Inputs Min / Max Superficie m²
  const minAreaInput = document.getElementById('area-min-input');
  const maxAreaInput = document.getElementById('area-max-input');
  [minAreaInput, maxAreaInput].forEach(inp => {
    inp?.addEventListener('input', () => {
      state.minArea = minAreaInput?.value ? parseFloat(minAreaInput.value) : null;
      state.maxArea = maxAreaInput?.value ? parseFloat(maxAreaInput.value) : null;
      renderGrid();
    });
  });

  // Checkboxes de Tipo de Inmueble
  document.querySelectorAll('input[name="filter-type"]').forEach(chk => {
    chk.addEventListener('change', () => {
      state.types = Array.from(document.querySelectorAll('input[name="filter-type"]:checked')).map(c => c.value);
      renderGrid();
    });
  });

  // Tags de Amenities
  document.querySelectorAll('.mp-amenity-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      const val = tag.dataset.amenity;
      if (state.amenities.includes(val)) {
        state.amenities = state.amenities.filter(a => a !== val);
      } else {
        state.amenities.push(val);
      }
      renderGrid();
    });
  });

  // Ordenamiento
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderGrid();
    });
  }

  // Botón Limpiar Todo (Clear All)
  const clearAllBtn = document.getElementById('btn-clear-all-filters');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', resetAllFilters);
  }
}

// Resetear todos los filtros
function resetAllFilters() {
  state.searchQuery = '';
  state.quickType = 'all';
  state.zones = [];
  state.pricePreset = 'all';
  state.minPrice = null;
  state.maxPrice = null;
  state.minArea = null;
  state.maxArea = null;
  state.types = [];
  state.amenities = [];
  state.sortBy = 'default';

  // UI Resets
  const searchInput = document.getElementById('marketplace-search');
  if (searchInput) searchInput.value = '';
  document.getElementById('search-clear-btn')?.classList.remove('show');

  document.querySelectorAll('.mp-cat-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.catType === 'all');
  });

  document.querySelectorAll('input[name="filter-zone"]').forEach(c => c.checked = false);
  document.querySelectorAll('input[name="filter-type"]').forEach(c => c.checked = false);
  
  const allPriceRadio = document.querySelector('input[name="filter-price-preset"][value="all"]');
  if (allPriceRadio) allPriceRadio.checked = true;
  const customWrap = document.getElementById('price-custom-wrap');
  if (customWrap) customWrap.style.display = 'none';

  const minP = document.getElementById('price-min-input');
  const maxP = document.getElementById('price-max-input');
  if (minP) minP.value = '';
  if (maxP) maxP.value = '';

  const minA = document.getElementById('area-min-input');
  const maxA = document.getElementById('area-max-input');
  if (minA) minA.value = '';
  if (maxA) maxA.value = '';

  document.querySelectorAll('.mp-amenity-tag').forEach(t => t.classList.remove('active'));

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'default';

  renderGrid();
}

// Renderizado del Grid Central con Filtrado Real
function renderGrid() {
  const grid = document.getElementById('properties-grid');
  const countBadge = document.getElementById('results-count-text');
  if (!grid) return;

  const filtered = PROPERTIES.filter(item => {
    // 1. Búsqueda de texto
    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchText = 
        item.title.toLowerCase().includes(q) ||
        item.zoneName.toLowerCase().includes(q) ||
        item.typeName.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.features.some(f => f.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    // 2. Categoría rápida (Top Pills)
    if (state.quickType !== 'all') {
      if (state.quickType === 'reforma' && item.type !== 'reforma') return false;
      if (state.quickType !== 'reforma' && item.type !== state.quickType) return false;
    }

    // 3. Zonas (Sidebar Checkboxes)
    if (state.zones.length > 0) {
      if (!state.zones.includes(item.zone)) return false;
    }

    // 4. Tipo de Inmueble (Sidebar Checkboxes)
    if (state.types.length > 0) {
      if (!state.types.includes(item.type)) return false;
    }

    // 5. Rango de Precio
    if (state.pricePreset !== 'all') {
      if (state.pricePreset === 'under-50k' && item.price >= 50000) return false;
      if (state.pricePreset === '50k-150k' && (item.price < 50000 || item.price > 150000)) return false;
      if (state.pricePreset === '150k-300k' && (item.price < 150000 || item.price > 300000)) return false;
      if (state.pricePreset === 'over-300k' && item.price <= 300000) return false;
      if (state.pricePreset === 'custom') {
        if (state.minPrice !== null && item.price < state.minPrice) return false;
        if (state.maxPrice !== null && item.price > state.maxPrice) return false;
      }
    }

    // 6. Superficie / Área
    const effectiveArea = item.areaPlot || item.areaBuilt || 0;
    if (state.minArea !== null && effectiveArea < state.minArea) return false;
    if (state.maxArea !== null && effectiveArea > state.maxArea) return false;

    // 7. Amenities
    if (state.amenities.length > 0) {
      const hasAllAmenities = state.amenities.every(amenity => item.amenities.includes(amenity));
      if (!hasAllAmenities) return false;
    }

    return true;
  });

  // Ordenamiento
  if (state.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'roi-desc') {
    filtered.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
  } else if (state.sortBy === 'area-desc') {
    filtered.sort((a, b) => (b.areaPlot || b.areaBuilt) - (a.areaPlot || a.areaBuilt));
  }

  // Actualizar Contador
  if (countBadge) {
    countBadge.innerHTML = `<span>${filtered.length}</span> ${filtered.length === 1 ? 'Propiedad Encontrada' : 'Propiedades Encontradas'}`;
  }

  // Render vacío
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="mp-empty-state">
        <div class="mp-empty-icon">🔍</div>
        <h3 class="mp-empty-title">No encontramos propiedades con estos filtros</h3>
        <p class="mp-empty-desc">Prueba ampliando el rango de precio, deseleccionando alguna zona o limpiando los filtros para ver todo el catálogo disponible en Margarita.</p>
        <button class="mp-btn-order-now" id="btn-empty-reset" style="margin: 0 auto; padding: 0.65rem 1.6rem; font-size: 0.85rem;">
          <span>Restablecer Filtros</span>
        </button>
      </div>
    `;
    document.getElementById('btn-empty-reset')?.addEventListener('click', resetAllFilters);
    return;
  }

  // Render cards
  grid.innerHTML = filtered.map(item => {
    const isSelected = item.id === state.activePropertyId;
    return `
      <article class="mp-card ${isSelected ? 'active-selected' : ''}" data-prop-id="${item.id}" tabindex="0" role="button" aria-label="Ver ficha de ${item.title}">
        <div class="mp-card-img-wrap">
          <img src="${item.images[0]}" alt="${item.title}" class="mp-card-img" loading="lazy">
          <span class="mp-card-badge-type">${item.tagBadge}</span>
          <span class="mp-card-badge-status">${item.status}</span>
        </div>
        <div class="mp-card-body">
          <h3 class="mp-card-title">${item.title}</h3>
          <div class="mp-card-location">
            <span>📍</span>
            <span>${item.zoneName}</span>
          </div>

          <div class="mp-card-specs">
            ${item.areaPlot > 0 ? `<span class="mp-card-spec-tag">🌱 ${item.areaPlot.toLocaleString()} m²</span>` : ''}
            ${item.areaBuilt > 0 ? `<span class="mp-card-spec-tag">📐 ${item.areaBuilt.toLocaleString()} m²</span>` : ''}
            ${item.rooms > 0 ? `<span class="mp-card-spec-tag">🛏️ ${item.rooms} Habs</span>` : ''}
            ${item.amenities.includes('pozo') ? `<span class="mp-card-spec-tag" style="color: #0284c7;">💧 Pozo</span>` : ''}
          </div>

          <div class="mp-card-footer">
            <div class="mp-card-price-box">
              <span class="mp-card-price">${item.priceDisplay}</span>
              <span class="mp-card-price-sub">USD</span>
            </div>
            <div class="mp-card-rating" style="white-space: nowrap;">
              <span>★</span>
              <span style="white-space: nowrap;">${item.roi}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Enlazar click a cada card para desplegar ficha
  grid.querySelectorAll('.mp-card').forEach(card => {
    const selectHandler = () => {
      const propId = card.dataset.propId;
      selectProperty(propId);
    };

    card.addEventListener('click', selectHandler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectHandler();
      }
    });
  });
}

// Seleccionar propiedad y actualizar ficha lateral / bottom sheet
function selectProperty(propId) {
  state.activePropertyId = propId;

  // Actualizar clase activa en cards
  document.querySelectorAll('.mp-card').forEach(c => {
    c.classList.toggle('active-selected', c.dataset.propId === propId);
  });

  renderDetailPanel(propId);

  // En móvil / tablet (< 1200px), abrir Bottom Sheet automáticamente
  if (window.innerWidth <= 1200) {
    const detailPanel = document.getElementById('detail-panel');
    const dimmer = document.getElementById('mp-backdrop-dimmer');
    detailPanel?.classList.add('sheet-open');
    dimmer?.classList.add('active');

    // Recalcular dimensiones del mapa tras abrir la ficha en móvil
    setTimeout(() => {
      if (miniMapInstance) miniMapInstance.invalidateSize();
    }, 360);
  }
}

// Renderizado de la Ficha Detallada (Columna 3 o Bottom Sheet)
function renderDetailPanel(propId) {
  const prop = PROPERTIES.find(p => p.id === propId) || PROPERTIES[0];
  if (!prop) return;

  const panel = document.getElementById('detail-panel');
  if (!panel) return;

  // Enlace dinámico de WhatsApp con la variable exacta de la propiedad
  const waMessage = `Hola Miguel Ángel, estoy interesado en reservar y consultar sobre la propiedad: "${prop.title}" (${prop.zoneName}) por ${prop.priceDisplay} en Isla de Margarita.`;
  const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(waMessage)}`;

  // Galería de 3 fotos (1 principal + 2 miniaturas)
  const imgMain = prop.images[0] || prop.images[0];
  const imgThumb1 = prop.images[1] || prop.images[0];
  const imgThumb2 = prop.images[2] || prop.images[0];

  panel.innerHTML = `
    <!-- Barra de arrastre y botón cerrar para móvil -->
    <div class="mp-sheet-drag-handle"></div>
    <button class="mp-sheet-close-btn" id="btn-close-sheet" aria-label="Cerrar ficha">&times;</button>

    <!-- Galería de Fotos -->
    <div class="mp-detail-gallery">
      <div class="mp-gallery-main">
        <img src="${imgMain}" alt="${prop.title}" id="detail-main-img">
      </div>
      <div class="mp-gallery-thumb" data-thumb-src="${imgThumb1}">
        <img src="${imgThumb1}" alt="Detalle 1" loading="lazy">
      </div>
      <div class="mp-gallery-thumb" data-thumb-src="${imgThumb2}">
        <img src="${imgThumb2}" alt="Detalle 2" loading="lazy">
      </div>
    </div>

    <!-- Título, Zona y Precio -->
    <div class="mp-detail-header-row">
      <div class="mp-detail-title-col">
        <h2>${prop.title}</h2>
        <div class="mp-detail-location-pin">
          <span>📍</span>
          <span>${prop.zoneName} &bull; ZEE Nueva Esparta</span>
        </div>
      </div>
      <div class="mp-detail-price-col">
        <div class="mp-detail-price-val">${prop.priceDisplay}</div>
        <div class="mp-detail-price-roi">${prop.roi}</div>
      </div>
    </div>

    <!-- Tabs Superiores de la Ficha -->
    <div class="mp-detail-tabs-bar">
      <button class="mp-detail-tab-btn active" data-tab-target="tab-overview">Visión General</button>
      <button class="mp-detail-tab-btn" data-tab-target="tab-financials">Rendimiento ROI</button>
      <button class="mp-detail-tab-btn" data-tab-target="tab-legal">Servicios &amp; Legal</button>
    </div>

    <!-- Contenido Dinámico de Pestañas -->
    <div class="mp-detail-tab-content" id="tab-overview">
      <div class="mp-detail-desc-box">
        <h4>Descripción de la Oportunidad :</h4>
        <p>${prop.desc}</p>
      </div>

      <!-- Grid de Especificaciones Técnicas con Iconos -->
      <div class="mp-detail-specs-grid" style="margin-top: 0.9rem;">
        ${prop.areaPlot > 0 ? `
          <div class="mp-spec-chip">
            <span class="mp-spec-chip-icon">🌱</span>
            <div class="mp-spec-chip-info">
              <span class="mp-spec-chip-val">${prop.areaPlot.toLocaleString()} m²</span>
              <span class="mp-spec-chip-lbl">Parcela Total</span>
            </div>
          </div>
        ` : ''}

        ${prop.areaBuilt > 0 ? `
          <div class="mp-spec-chip">
            <span class="mp-spec-chip-icon">📐</span>
            <div class="mp-spec-chip-info">
              <span class="mp-spec-chip-val">${prop.areaBuilt.toLocaleString()} m²</span>
              <span class="mp-spec-chip-lbl">Construcción</span>
            </div>
          </div>
        ` : ''}

        ${prop.rooms > 0 ? `
          <div class="mp-spec-chip">
            <span class="mp-spec-chip-icon">🛏️</span>
            <div class="mp-spec-chip-info">
              <span class="mp-spec-chip-val">${prop.rooms} Suites</span>
              <span class="mp-spec-chip-lbl">Habitaciones</span>
            </div>
          </div>
        ` : ''}

        ${prop.baths > 0 ? `
          <div class="mp-spec-chip">
            <span class="mp-spec-chip-icon">🚿</span>
            <div class="mp-spec-chip-info">
              <span class="mp-spec-chip-val">${prop.baths} Baños</span>
              <span class="mp-spec-chip-lbl">Sanitarios</span>
            </div>
          </div>
        ` : ''}

        ${prop.amenities.includes('pozo') ? `
          <div class="mp-spec-chip" style="border-color: #bae6fd; background: #f0f9ff;">
            <span class="mp-spec-chip-icon">💧</span>
            <div class="mp-spec-chip-info">
              <span class="mp-spec-chip-val" style="color: #0369a1;">Pozo Dulce</span>
              <span class="mp-spec-chip-lbl">Autonomía 100%</span>
            </div>
          </div>
        ` : ''}

        ${prop.amenities.includes('planta') ? `
          <div class="mp-spec-chip" style="border-color: #fef08a; background: #fefce8;">
            <span class="mp-spec-chip-icon">⚡</span>
            <div class="mp-spec-chip-info">
              <span class="mp-spec-chip-val" style="color: #a16207;">Generador</span>
              <span class="mp-spec-chip-lbl">Luz Ininterrumpida</span>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="mp-detail-tab-content" id="tab-financials" style="display: none;">
      <div class="mp-detail-desc-box">
        <h4>Proyección de Rentabilidad en Dólares :</h4>
        <p>Rendimiento estimado de <strong>${prop.roi}</strong> operando bajo alquiler turístico de alto estándar. Liquidación mensual en USD o USDT transferida directamente al inversor en el extranjero.</p>
        <ul style="margin: 0.8rem 0 0 1.2rem; font-size: 0.84rem; color: #475569; line-height: 1.6;">
          ${prop.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="mp-detail-tab-content" id="tab-legal" style="display: none;">
      <div class="mp-detail-desc-box">
        <h4>Seguridad Jurídica &amp; Notarial :</h4>
        <p>Auditoría notarial exhaustiva ante el Registro Inmobiliario de Nueva Esparta. Títulos privados con tradición legal intachable, solvencias municipales al día y acogido a los beneficios tributarios de la Zona Económica Especial (ZEE).</p>
      </div>
    </div>

    <!-- Botones de Acción (Reservar por WhatsApp con Nombre de Propiedad) -->
    <div class="mp-detail-actions">
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="mp-btn-order-now" id="btn-reserve-wa">
        <span>🌟 Reservar / Agendar Visita por WhatsApp</span>
        <span>↗</span>
      </a>
      <a href="https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(`Hola Miguel Ángel, deseo consultar dudas técnicas sobre la propiedad: "${prop.title}".`)}" target="_blank" rel="noopener noreferrer" class="mp-btn-contact-agent">
        <span>💬 Contactar Asesor Inmobiliario</span>
      </a>
    </div>

    <!-- Mini Mapa de la Ubicación -->
    <div class="mp-detail-map-box">
      <div id="detail-mini-map"></div>
      <div class="mp-map-pin-overlay">
        <span>📍 ${prop.zoneName}</span>
        <a href="https://www.google.com/maps/search/?api=1&query=${prop.coords[0]},${prop.coords[1]}" target="_blank" rel="noopener noreferrer" class="mp-map-external-link" title="Abrir en Google Maps">
          <span>Google Maps</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  `;

  // Intercambio de miniaturas en la galería
  panel.querySelectorAll('.mp-gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const newSrc = thumb.dataset.thumbSrc;
      const mainImg = document.getElementById('detail-main-img');
      if (mainImg && newSrc) {
        const oldSrc = mainImg.src;
        mainImg.src = newSrc;
        thumb.dataset.thumbSrc = oldSrc;
        thumb.querySelector('img').src = oldSrc;
      }
    });
  });

  // Pestañas de la Ficha
  panel.querySelectorAll('.mp-detail-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.mp-detail-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.dataset.tabTarget;
      panel.querySelectorAll('.mp-detail-tab-content').forEach(c => {
        c.style.display = c.id === targetId ? 'block' : 'none';
      });
      if (miniMapInstance) {
        setTimeout(() => miniMapInstance.invalidateSize(), 60);
      }
    });
  });

  // Revalidar tamaño del mapa cuando la transición CSS del panel termine
  if (!panel.dataset.transitionBound) {
    panel.dataset.transitionBound = 'true';
    panel.addEventListener('transitionend', () => {
      if (miniMapInstance) miniMapInstance.invalidateSize();
    }, { passive: true });
  }

  // Botón cerrar sheet en móvil
  document.getElementById('btn-close-sheet')?.addEventListener('click', closeBottomSheet);

  // Inicializar o actualizar el mini mapa
  renderMiniMap(prop.coords, prop.title);
}

// Mini Mapa con Leaflet en la Ficha (OSM Sin Watermarks + Auto-Recuperación Geométrica)
let miniMapResizeObserver = null;

function renderMiniMap(coords, title) {
  if (typeof L === 'undefined') return;

  const mapContainer = document.getElementById('detail-mini-map');
  if (!mapContainer) return;

  if (miniMapResizeObserver) {
    miniMapResizeObserver.disconnect();
    miniMapResizeObserver = null;
  }

  if (miniMapInstance) {
    try {
      miniMapInstance.remove();
    } catch (e) {
      console.warn('Error al limpiar mapa previo:', e);
    }
    miniMapInstance = null;
  }

  try {
    miniMapInstance = L.map('detail-mini-map', {
      center: coords,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      tap: false
    });

    // Usar OpenStreetMap oficial (100% limpio, sin marca de agua "RED" de Carto)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(miniMapInstance);

    const goldPin = L.divIcon({
      className: 'mp-custom-leaflet-pin',
      html: `
        <div class="mp-map-pulse-marker">
          <div class="mp-pulse-halo"></div>
          <div class="mp-pulse-core"></div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    miniMapMarker = L.marker(coords, { icon: goldPin }).addTo(miniMapInstance);

    // Múltiples invalidaciones para garantizar renderizado geométrico correcto en móvil y desktop
    const invalidate = () => {
      if (miniMapInstance) {
        miniMapInstance.invalidateSize();
      }
    };

    requestAnimationFrame(invalidate);
    setTimeout(invalidate, 100);
    setTimeout(invalidate, 250);
    setTimeout(invalidate, 450);

    if (typeof ResizeObserver !== 'undefined') {
      miniMapResizeObserver = new ResizeObserver(() => {
        invalidate();
      });
      miniMapResizeObserver.observe(mapContainer);
    }
  } catch (err) {
    console.warn('Mini mapa Leaflet no disponible temporalmente:', err);
  }
}

// Control del Bottom Sheet y Drawers Móviles
function bindMobileDrawers() {
  const detailPanel = document.getElementById('detail-panel');
  const sidebarFilters = document.getElementById('sidebar-filters');
  const dimmer = document.getElementById('mp-backdrop-dimmer');
  const filterTriggerBtn = document.getElementById('btn-mobile-filters-trigger');

  // Abrir Drawer de Filtros en móvil
  filterTriggerBtn?.addEventListener('click', () => {
    sidebarFilters?.classList.add('drawer-open');
    dimmer?.classList.add('active');
  });

  // Cerrar todo al hacer clic en el dimmer de fondo
  dimmer?.addEventListener('click', () => {
    closeBottomSheet();
    sidebarFilters?.classList.remove('drawer-open');
    dimmer?.classList.remove('active');
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBottomSheet();
      sidebarFilters?.classList.remove('drawer-open');
      dimmer?.classList.remove('active');
    }
  });
}

function closeBottomSheet() {
  const detailPanel = document.getElementById('detail-panel');
  const dimmer = document.getElementById('mp-backdrop-dimmer');
  detailPanel?.classList.remove('sheet-open');
  dimmer?.classList.remove('active');
}

// Modal Google Forms para Postulación
function bindGoogleFormModal() {
  const modal = document.getElementById('modal-google-forms');
  const closeBtn = document.getElementById('close-google-forms-modal');
  const openBtns = document.querySelectorAll('.btn-open-google-form, .mp-btn-postular');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  });
}

// Manejo del Formulario Directo de Postulación y Envío Estructurado a WhatsApp
function initPostulationForms() {
  const forms = document.querySelectorAll('#property-direct-postulation-form, #marketplace-postulation-form, #marketplace-modal-postulation-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const zone = form.querySelector('[name="prop_zone"]')?.value || 'No especificada';
      const type = form.querySelector('[name="prop_type"]')?.value || 'No especificado';
      const status = form.querySelector('[name="prop_status"]')?.value || 'No especificado';
      const legal = form.querySelector('[name="prop_legal"]')?.value || 'No especificado';
      const price = form.querySelector('[name="prop_price"]')?.value || 'No especificado';
      const details = form.querySelector('[name="prop_details"]')?.value || 'Se enviarán por WhatsApp';
      const owner = form.querySelector('[name="prop_owner"]')?.value || 'Propietario';
      const contact = form.querySelector('[name="prop_contact"]')?.value || 'Contacto';

      const waMsg = encodeURIComponent(
        `*¡Hola Miguel Ángel! Deseo postular una propiedad para venta en Margarita:*\n\n` +
        `📍 *Ubicación/Zona:* ${zone}\n` +
        `🏷️ *Tipo de Inmueble:* ${type}\n` +
        `🏗️ *Estado de Construcción:* ${status}\n` +
        `⚖️ *Títulos y Papeles:* ${legal}\n` +
        `💰 *Precio Pretendido:* ${price}\n` +
        `📝 *Detalles/Fotos:* ${details}\n\n` +
        `👤 *Propietario:* ${owner}\n` +
        `📞 *Contacto:* ${contact}`
      );

      window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${waMsg}`, '_blank');
    });
  });
}

