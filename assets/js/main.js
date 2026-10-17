/**
 * MIGUEL ANGEL - LA PERLA DEL CARIBE
 * Personal Shopper Inmobiliario & Constructor • Isla de Margarita
 * Lógica Principal: Visor 3D, Mapa Leaflet, Ticker Vertical de Municipios,
 * Carousel Personal Shopper, Comparativa Mundial Animada & Scroll Reveal
 */

import { Viewer3DApp } from '../../modelo-3d/main.js';

/* ================= DATOS DE MUNICIPIOS DE MARGARITA ================= */
const ZONES_DATA = [
  {
    id: 'pampatar',
    name: 'Pampatar',
    fullName: 'Pampatar (Milla de Oro)',
    coords: [10.9986, -63.7981],
    color: '#10b981',
    badgeClass: 'green',
    badge: 'Zona Premium / ZEE',
    price: '$60 - $100 / m²',
    roi: '18% - 22% Anual',
    desc: 'Epicentro gastronómico y residencial de lujo. Terrenos y villas de autor con máxima demanda de alquiler internacional.',
    pinColor: '#2563eb'
  },
  {
    id: 'el-yaque',
    name: 'Playa El Yaque',
    fullName: 'Playa El Yaque & Coche',
    coords: [10.9023, -63.9635],
    color: '#10b981',
    badgeClass: 'green',
    badge: 'Kitesurf & Posadas',
    price: '$45 - $85 / m²',
    roi: '20% - 25% Anual',
    desc: 'Famoso meca internacional del windsurf y kitesurf con turismo europeo recurrente y alta tasa de ocupación hotelera.',
    pinColor: '#2563eb'
  },
  {
    id: 'playa-el-agua',
    name: 'Playa El Agua',
    fullName: 'Playa El Agua & Manzanillo',
    coords: [11.1448, -63.8617],
    color: '#10b981',
    badgeClass: 'green',
    badge: 'Macro Parcelas ZEE',
    price: '$25 - $50 / m²',
    roi: '22% - 28% Anual',
    desc: 'Bulevar costero de más de 4 km. Macrolotes idóneos para resorts vacacionales y desarrollos con exenciones fiscales ZEE.',
    pinColor: '#2563eb'
  },
  {
    id: 'costa-azul',
    name: 'Costa Azul',
    fullName: 'Porlamar / Costa Azul',
    coords: [10.9577, -63.8504],
    color: '#f59e0b',
    badgeClass: 'yellow',
    badge: 'Comercial & Condominios',
    price: '$40 - $75 / m²',
    roi: '14% - 17% Anual',
    desc: 'Corredor comercial y financiero con clínicas privadas, centros comerciales y condominios residenciales de alta liquidez.',
    pinColor: '#2563eb'
  },
  {
    id: 'juan-griego',
    name: 'Juan Griego',
    fullName: 'Juan Griego & La Galera',
    coords: [11.0827, -63.9654],
    color: '#ef4444',
    badgeClass: 'red',
    badge: 'Crecimiento Emergente',
    price: '$15 - $35 / m²',
    roi: '15% - 19% Anual',
    desc: 'Bahía histórica famosa por sus atardeceres dorados. Excelente relación costo-beneficio para proyectos náuticos y residenciales.',
    pinColor: '#2563eb'
  },
  {
    id: 'macanao',
    name: 'Macanao',
    fullName: 'Punta de Arenas / Macanao',
    coords: [10.9700, -64.2000],
    color: '#10b981',
    badgeClass: 'green',
    badge: 'Ecoturismo & Playas Vírgenes',
    price: '$1 - $15 / m²',
    roi: '16% - 24% Anual',
    desc: 'Kilómetros de playas vírgenes y reservas naturales. Destino predilecto para eco-resorts solares, glamping de ultra-lujo y bienestar.',
    pinColor: '#2563eb'
  }
];

/* ================= DATOS DE COMPARATIVA MUNDIAL ================= */
const DESTINATIONS_DATA = [
  {
    id: 'margarita',
    flag: '🌴',
    title: '🌴 1. Isla de Margarita',
    subtitle: 'Venezuela • Zona Económica Especial (ZEE)',
    statusTag: 'Líder en Rentabilidad',
    locationBadge: 'Isla de Margarita • ZEE',
    priceVal: '$1 - $100',
    priceTarget: 50,
    pricePrefix: '$',
    priceSuffix: ' USD / m²',
    subPrice: 'USD / m² de suelo virgen a premium',
    roiVal: '18.0% - 24.0%',
    roiTarget: 21.0,
    roiPrefix: '',
    roiSuffix: '% Anual',
    subRoi: 'Retorno neto en rentas vacacionales USD',
    buildVal: '$380 - $550',
    buildTarget: 450,
    buildPrefix: '$',
    buildSuffix: ' USD / m²',
    subBuild: 'USD / m² edificado con alta gama',
    ticketVal: '$25,000',
    ticketTarget: 25000,
    ticketPrefix: '$',
    ticketSuffix: ' USD',
    subTicket: 'USD para parcelas registradas',
    fiscal: '0% Aranceles de Importación (Puerto Libre) y exenciones fiscales completas bajo la Ley de Zonas Económicas Especiales (ZEE). Sin impuestos asfixiantes.',
    calloutTitle: 'Invertir Cuando Todo Empieza: La Verdadera Plusvalía',
    calloutDesc: 'Invertir cuando todo empieza es la diferencia entre la inversión de tu vida y otra cualquiera: eso se llama plusvalía. Diversifica tu patrimonio en el Caribe y asegura tu libertad financiera en una isla con el mayor potencial de crecimiento de la región.'
  },
  {
    id: 'espana-ibiza',
    flag: '🇪🇸',
    title: '🇪🇸 2. España (Ibiza & Costa del Sol)',
    subtitle: 'Europa • Mercado Saturado & Alto ITP',
    statusTag: 'Coste Elevado / Margen Reducido',
    locationBadge: 'España • Ibiza & Baleares',
    priceVal: '€4,200 - €7,500',
    priceTarget: 5850,
    pricePrefix: '€',
    priceSuffix: ' EUR / m²',
    subPrice: 'EUR / m² promedio en zona turística',
    roiVal: '4.5% - 6.5%',
    roiTarget: 5.5,
    roiPrefix: '',
    roiSuffix: '% Anual',
    subRoi: 'Retorno neto comprimido por impuestos',
    buildVal: '€1,600 - €2,400',
    buildTarget: 2000,
    buildPrefix: '€',
    buildSuffix: ' EUR / m²',
    subBuild: 'Coste de mano de obra y materiales UE',
    ticketVal: '€250,000',
    ticketTarget: 250000,
    ticketPrefix: '€',
    ticketSuffix: ' EUR',
    subTicket: 'Ticket mínimo para propiedades de entrada',
    fiscal: 'ITP autonómico (7% - 10%), IBI recurrente, Plusvalía municipal, tasa turística e IRPF de no residentes (19% a 24% de los ingresos de alquiler).',
    calloutTitle: 'Comparativa Directa con Margarita',
    calloutDesc: 'En Ibiza pagas hasta €6,000 por cada metro cuadrado con apenas 5% de retorno. En Margarita compras suelo frente al mar por $60 - $100/m² y obtienes más de 20% anual.'
  },
  {
    id: 'mexico-cancun',
    flag: '🇲🇽',
    title: '🇲🇽 3. Cancún (Riviera Maya)',
    subtitle: 'México • Restricción de Zona Costera',
    statusTag: 'Mercado Maduro Consolidado',
    locationBadge: 'México • Cancún & Riviera Maya',
    priceVal: '$2,800 - $4,200',
    priceTarget: 3500,
    pricePrefix: '$',
    priceSuffix: ' USD / m²',
    subPrice: 'USD / m² en desarrollos turísticos',
    roiVal: '7.0% - 9.5%',
    roiTarget: 8.2,
    roiPrefix: '',
    roiSuffix: '% Anual',
    subRoi: 'Ocupación estacional y alta competencia',
    buildVal: '$900 - $1,300',
    buildTarget: 1100,
    buildPrefix: '$',
    buildSuffix: ' USD / m²',
    subBuild: 'Coste medio de obra hotelera en Quintana Roo',
    ticketVal: '$150,000',
    ticketTarget: 150000,
    ticketPrefix: '$',
    ticketSuffix: ' USD',
    subTicket: 'Ticket mínimo en condominios turísticos',
    fiscal: 'ISAI (2% a 5%) + Constitución obligatoria de Fideicomiso Bancario para extranjeros en los 50 km de costa con anualidades bancarias.',
    calloutTitle: 'Comparativa con Cancún',
    calloutDesc: 'Cancún ya alcanzó su pico de madurez inmobiliaria. Margarita está al inicio de su ciclo con precios de suelo hasta 30 veces más baratos y potencial de plusvalía virgen.'
  },
  {
    id: 'usa-miami',
    flag: '🇺🇸',
    title: '🇺🇸 4. Miami (Florida, EE. UU.)',
    subtitle: 'Norteamérica • Altos Impuestos y Cuotas HOA',
    statusTag: 'Capital Intensivo',
    locationBadge: 'EE.UU. • Miami & Costa de Florida',
    priceVal: '$7,500 - $12,000',
    priceTarget: 9750,
    pricePrefix: '$',
    priceSuffix: ' USD / m²',
    subPrice: 'USD / m² en áreas consolidadas',
    roiVal: '4.0% - 5.5%',
    roiTarget: 4.8,
    roiPrefix: '',
    roiSuffix: '% Anual',
    subRoi: 'Rendimiento mermado por HOA y seguros',
    buildVal: '$2,500 - $4,000',
    buildTarget: 3250,
    buildPrefix: '$',
    buildSuffix: ' USD / m²',
    subBuild: 'Coste normativo y constructivo estadounidense',
    ticketVal: '$380,000',
    ticketTarget: 380000,
    ticketPrefix: '$',
    ticketSuffix: ' USD',
    subTicket: 'Ticket de entrada en apartamentos estándar',
    fiscal: 'Property Tax anual (1.8% a 2.2% del valor tasado), cuotas HOA elevadas de condominio y primas de seguro de inundación / huracán de miles de dólares al año.',
    calloutTitle: 'Comparativa con Miami',
    calloutDesc: 'En Miami se requieren cientos de miles de dólares solo para comenzar, y los gastos recurrentes devoran tus dividendos. En Margarita eres dueño de suelo real con retorno neto directo en USD.'
  }
];

/* ================= INICIALIZACIÓN GLOBAL ================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroWordRotator();
  initInteractiveModel3D();
  initHeatmap();
  initHorizontalMuniSlider();
  initPersonalShopperCarousel();
  initWorldComparisonShowcase();
  initScrollReveal();
  initGeneralModals();
  initGoogleFormSection();
});

/* ================= 1. Global Entrance & Scroll Reveal ================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale, .reveal-stagger');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ================= 2. Floating Glass Navbar & Mobile Drawer ================= */
function initNavbar() {
  const headerWrap = document.querySelector('.header-floating-wrap');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
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

/* ================= 3. Hero Vertical Looping Words (2s loop) ================= */
function initHeroWordRotator() {
  const wrapper = document.querySelector('.hero-rotator-wrapper');
  const words = document.querySelectorAll('.hero-rotator-word');
  if (!words.length) return;

  const calibrateHeight = () => {
    if (!wrapper) return;
    let maxH = 0;
    words.forEach(w => {
      const h = Math.max(w.offsetHeight || 0, w.scrollHeight || 0, w.getBoundingClientRect ? w.getBoundingClientRect().height : 0);
      if (h > maxH) maxH = h;
    });
    const minFloor = window.innerWidth <= 768 ? 112 : 75;
    wrapper.style.minHeight = Math.max(maxH + 16, minFloor) + 'px';
  };

  calibrateHeight();
  if (document.fonts) {
    document.fonts.ready.then(calibrateHeight);
  }
  window.addEventListener('resize', calibrateHeight, { passive: true });

  let currentIndex = 0;
  const total = words.length;

  setInterval(() => {
    const currentWord = words[currentIndex];
    currentWord.classList.remove('active');
    currentWord.classList.add('exit-up');

    setTimeout(() => {
      currentWord.classList.remove('exit-up');
    }, 650);

    currentIndex = (currentIndex + 1) % total;
    const nextWord = words[currentIndex];
    nextWord.classList.add('active');
  }, 2000);
}

/* ================= 4. Visor 3D Interactivo Integrado ================= */
function initInteractiveModel3D() {
  const container = document.getElementById('canvas-container') || document.getElementById('interactive-3d-canvas-wrap');
  if (!container || container.dataset.initialized) return;
  container.dataset.initialized = 'true';

  try {
    new Viewer3DApp(container);
  } catch (err) {
    console.error('Error al inicializar el visor 3D integrado:', err);
  }
}

/* ================= 5. Leaflet Investment Heatmap ================= */
let leafletMap = null;
const mapMarkers = {};

function initHeatmap() {
  const mapContainer = document.getElementById('leaflet-heatmap');
  if (!mapContainer || typeof L === 'undefined') return;

  leafletMap = L.map('leaflet-heatmap', {
    center: [10.985, -64.000],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  }).addTo(leafletMap);

  const markersGroup = L.featureGroup();

  ZONES_DATA.forEach(zone => {
    const iconHtml = `
      <div class="custom-map-marker">
        <svg class="marker-pin-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 24 34">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22c0-6.63-5.37-12-12-12z" fill="${zone.pinColor}"/>
          <circle cx="12" cy="11" r="5" fill="#ffffff"/>
        </svg>
        <div class="marker-pulse-base" style="border: 3px solid ${zone.color}; background: ${zone.color}44;"></div>
        <div class="marker-label-tag">${zone.name}</div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'leaflet-custom-div-icon',
      iconSize: [60, 52],
      iconAnchor: [30, 36],
      popupAnchor: [0, -32]
    });

    const popupHtml = `
      <div class="map-popup-box">
        <h4>${zone.fullName}</h4>
        <span class="popup-tag">${zone.badge}</span>
        <div class="map-popup-metrics">
          <div><strong>${zone.price}</strong><br><small>Promedio m²</small></div>
          <div style="text-align: right;"><strong>${zone.roi}</strong><br><small>ROI Proyectado</small></div>
        </div>
        <a href="marketplace/?zone=${zone.id}" class="map-popup-btn">
          🏬 Ver Oportunidades en Marketplace ↗
        </a>
      </div>
    `;

    const marker = L.marker(zone.coords, { icon: customIcon })
      .bindPopup(popupHtml);

    markersGroup.addLayer(marker);
    mapMarkers[zone.id] = marker;

    marker.on('click', () => {
      highlightMuniCard(zone.id);
      if (typeof window.scrollMuniToZone === 'function') {
        window.scrollMuniToZone(zone.id);
      }
    });
  });

  markersGroup.addTo(leafletMap);

  try {
    leafletMap.fitBounds(markersGroup.getBounds().pad(0.12));
  } catch (err) {
    // Fallback silencioso
  }

  setTimeout(() => {
    leafletMap.invalidateSize();
  }, 350);
}

function highlightMuniCard(zoneId) {
  document.querySelectorAll('.muni-card-beige, .muni-card').forEach(card => {
    card.classList.toggle('active', card.dataset.zone === zoneId);
  });
}

/* ================= 6. Slider Horizontal de Municipios (Beige & Dorado con Controles Debajo) ================= */
function initHorizontalMuniSlider() {
  const viewport = document.getElementById('muni-horizontal-viewport');
  const track = document.getElementById('muni-horizontal-track');
  const prevBtn = document.getElementById('muni-prev-btn');
  const nextBtn = document.getElementById('muni-next-btn');
  const dots = document.querySelectorAll('#muni-carousel-dots .muni-dot');
  const cards = document.querySelectorAll('.muni-card-beige');
  if (!viewport || !track || !cards.length) return;

  let currentIndex = 0;
  const total = cards.length;
  let isHovered = false;
  let isDragging = false;
  let startX = 0;

  const getMaxScroll = () => {
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  };

  const updateSlider = (index, smooth = true) => {
    currentIndex = Math.min(Math.max(0, index), total - 1);
    const targetCard = cards[currentIndex];
    if (!targetCard) return;

    const maxScroll = getMaxScroll();
    const cardLeft = targetCard.offsetLeft;
    const targetOffset = Math.min(cardLeft, maxScroll);

    track.style.transition = smooth ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    track.style.transform = `translateX(-${targetOffset}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    const zoneId = targetCard.dataset.zone;
    if (zoneId) {
      highlightMuniCard(zoneId);
    }
  };

  const scrollToZone = (zoneId) => {
    const cardIdx = Array.from(cards).findIndex(c => c.dataset.zone === zoneId);
    if (cardIdx !== -1) {
      updateSlider(cardIdx, true);
    }
  };

  // Click en tarjeta para sincronizar con mapa
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.muni-cta-beige')) return;

      const zoneId = card.dataset.zone;
      const zone = ZONES_DATA.find(z => z.id === zoneId);
      if (zone && leafletMap) {
        leafletMap.flyTo(zone.coords, 13, { duration: 1.2 });
        if (mapMarkers[zoneId]) {
          setTimeout(() => {
            mapMarkers[zoneId].openPopup();
          }, 600);
        }
      }
      updateSlider(idx, true);
    });
  });

  // Flechas inferiores
  prevBtn?.addEventListener('click', () => {
    updateSlider(currentIndex > 0 ? currentIndex - 1 : total - 1, true);
  });

  nextBtn?.addEventListener('click', () => {
    updateSlider(currentIndex < total - 1 ? currentIndex + 1 : 0, true);
  });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      updateSlider(idx, true);
    });
  });

  // Pausa en hover
  viewport.addEventListener('mouseenter', () => { isHovered = true; });
  viewport.addEventListener('mouseleave', () => { isHovered = false; isDragging = false; });

  // Swipe táctil en móvil
  viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    isHovered = true;
    startX = e.touches[0].pageX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].pageX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        updateSlider(currentIndex < total - 1 ? currentIndex + 1 : 0, true);
      } else {
        updateSlider(currentIndex > 0 ? currentIndex - 1 : total - 1, true);
      }
    }
    setTimeout(() => { isHovered = false; }, 2500);
  });

  // Auto-avance suave continuo
  setInterval(() => {
    if (!isHovered && !isDragging) {
      updateSlider(currentIndex < total - 1 ? currentIndex + 1 : 0, true);
    }
  }, 4800);

  window.addEventListener('resize', () => {
    updateSlider(currentIndex, false);
  }, { passive: true });

  // Exponer para mapa Leaflet
  window.scrollMuniToZone = scrollToZone;

  // Iniciar en primer municipio
  updateSlider(0, false);
}

/* ================= 7. Carousel Horizontal de Personal Shopper (Metodología 360°) ================= */
function initPersonalShopperCarousel() {
  const viewport = document.getElementById('workflow-viewport');
  const track = document.getElementById('workflow-track');
  const prevBtn = document.getElementById('workflow-prev-btn');
  const nextBtn = document.getElementById('workflow-next-btn');
  const dots = document.querySelectorAll('#workflow-dots .workflow-dot');
  const slides = document.querySelectorAll('.workflow-slide');
  if (!viewport || !track || !slides.length) return;

  let currentStep = 0;
  const total = slides.length;

  const getVisibleCount = () => {
    return window.innerWidth >= 768 ? 2 : 1;
  };

  const getMaxStep = () => {
    const visible = getVisibleCount();
    return Math.max(0, total - visible);
  };

  const updateCarousel = (index) => {
    const max = getMaxStep();
    currentStep = Math.min(Math.max(0, index), max);

    const slideWidth = 100 / getVisibleCount();
    track.style.transform = `translateX(-${currentStep * slideWidth}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentStep);
    });
  };

  prevBtn?.addEventListener('click', () => {
    updateCarousel(currentStep > 0 ? currentStep - 1 : getMaxStep());
  });

  nextBtn?.addEventListener('click', () => {
    updateCarousel(currentStep < getMaxStep() ? currentStep + 1 : 0);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.dataset.step, 10);
      updateCarousel(step);
    });
  });

  // Swipe táctil en móvil
  let startX = 0;
  let isSwiping = false;

  viewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    isSwiping = true;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const diff = startX - e.changedTouches[0].pageX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        updateCarousel(currentStep < getMaxStep() ? currentStep + 1 : 0);
      } else {
        updateCarousel(currentStep > 0 ? currentStep - 1 : getMaxStep());
      }
    }
  });

  window.addEventListener('resize', () => {
    updateCarousel(currentStep);
  }, { passive: true });

  // Iniciar en primer slide
  updateCarousel(0);
}

/* ================= 8. Showcase Animado de Comparativa Mundial (Limpia y Sin Mapas) ================= */
function initWorldComparisonShowcase() {
  const container = document.getElementById('world-comparison-showcase');
  if (!container) return;

  const prevBtn = document.getElementById('dest-prev-btn');
  const nextBtn = document.getElementById('dest-next-btn');
  const dots = document.querySelectorAll('#dest-dots .dest-dot');

  const titleEl = document.getElementById('dest-title');
  const subtitleEl = document.getElementById('dest-subtitle');
  const statusTagEl = document.getElementById('dest-status-tag');

  const counterPrice = document.getElementById('counter-price');
  const counterRoi = document.getElementById('counter-roi');
  const counterBuild = document.getElementById('counter-build');
  const counterTicket = document.getElementById('counter-ticket');

  const subPrice = document.getElementById('sub-price');
  const subRoi = document.getElementById('sub-roi');
  const subBuild = document.getElementById('sub-build');
  const subTicket = document.getElementById('sub-ticket');

  const fiscalText = document.getElementById('dest-fiscal-text');
  const calloutTitle = document.getElementById('dest-callout-title');
  const calloutDesc = document.getElementById('dest-callout-desc');

  let currentDestIndex = 0;
  const total = DESTINATIONS_DATA.length;

  const animateNumber = (el, start, end, duration, prefix = '', suffix = '', decimals = 0) => {
    if (!el) return;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = start + (end - start) * ease;
      const formatted = decimals > 0 
        ? val.toFixed(decimals) 
        : Math.round(val).toLocaleString('es-ES');
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const renderDestination = (index) => {
    currentDestIndex = (index + total) % total;
    const dest = DESTINATIONS_DATA[currentDestIndex];

    if (titleEl) titleEl.textContent = dest.title;
    if (subtitleEl) subtitleEl.textContent = dest.subtitle;
    if (statusTagEl) statusTagEl.textContent = dest.statusTag;

    // Actualizar dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentDestIndex);
    });

    // Animación de contadores
    animateNumber(counterPrice, 0, dest.priceTarget, 850, dest.pricePrefix, dest.priceSuffix, 0);
    animateNumber(counterRoi, 0, dest.roiTarget, 900, dest.roiPrefix, dest.roiSuffix, 1);
    animateNumber(counterBuild, 0, dest.buildTarget, 850, dest.buildPrefix, dest.buildSuffix, 0);
    animateNumber(counterTicket, 0, dest.ticketTarget, 950, dest.ticketPrefix, dest.ticketSuffix, 0);

    // Tras animación mostrar rango completo
    setTimeout(() => {
      if (counterPrice) counterPrice.textContent = dest.priceVal;
      if (counterRoi) counterRoi.textContent = dest.roiVal;
      if (counterBuild) counterBuild.textContent = dest.buildVal;
      if (counterTicket) counterTicket.textContent = dest.ticketVal;
    }, 950);

    if (subPrice) subPrice.textContent = dest.subPrice;
    if (subRoi) subRoi.textContent = dest.subRoi;
    if (subBuild) subBuild.textContent = dest.subBuild;
    if (subTicket) subTicket.textContent = dest.subTicket;

    if (fiscalText) fiscalText.textContent = dest.fiscal;
    if (calloutTitle) calloutTitle.textContent = dest.calloutTitle;
    if (calloutDesc) calloutDesc.textContent = dest.calloutDesc;
  };

  // Event listeners flechas
  prevBtn?.addEventListener('click', () => {
    renderDestination(currentDestIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    renderDestination(currentDestIndex + 1);
  });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.dest, 10);
      renderDestination(idx);
    });
  });

  // Swipe táctil en showcase
  let startX = 0;
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].pageX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        renderDestination(currentDestIndex + 1);
      } else {
        renderDestination(currentDestIndex - 1);
      }
    }
  });

  // Renderizar estado inicial
  renderDestination(0);
}

/* ================= 9. Modales VIP & Agendar ================= */
function initGeneralModals() {
  const vipBtn = document.getElementById('btn-open-vip');
  const vipModal = document.getElementById('modal-vip');
  const closeVip = document.getElementById('close-vip-modal');

  vipBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    vipModal?.classList.add('open');
  });

  closeVip?.addEventListener('click', () => {
    vipModal?.classList.remove('open');
  });

  const callBtns = document.querySelectorAll('.btn-open-call');
  const callModal = document.getElementById('modal-call');
  const closeCall = document.getElementById('close-call-modal');

  callBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      callModal?.classList.add('open');
    });
  });

  closeCall?.addEventListener('click', () => {
    callModal?.classList.remove('open');
  });

  [vipModal, callModal].forEach(m => {
    m?.addEventListener('click', (e) => {
      if (e.target === m) m.classList.remove('open');
    });
  });
}

/* ================= 10. Postulación de Propiedades (Directo & WhatsApp) ================= */
function initGoogleFormSection() {
  const form = document.getElementById('property-direct-postulation-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const zone = form.querySelector('[name="prop_zone"]').value;
      const type = form.querySelector('[name="prop_type"]').value;
      const status = form.querySelector('[name="prop_status"]').value;
      const legal = form.querySelector('[name="prop_legal"]').value;
      const price = form.querySelector('[name="prop_price"]').value;
      const details = form.querySelector('[name="prop_details"]').value;
      const owner = form.querySelector('[name="prop_owner"]').value;
      const contact = form.querySelector('[name="prop_contact"]').value;

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

      window.open(`https://api.whatsapp.com/send?phone=34676597068&text=${waMsg}`, '_blank');
    });
  }
}
