/**
 * MIGUEL ANGEL - LA PERLA DEL CARIBE
 * Personal Shopper Inmobiliario & Constructor • Isla de Margarita
 * Lógica Principal: Visor 3D, Mapa Leaflet, Ticker Vertical de Municipios,
 * Carousel Personal Shopper, Comparativa Mundial Animada & Scroll Reveal
 */

import { Viewer3DApp } from '../../modelo-3d/main.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

if (typeof window !== 'undefined') {
  window.L = L;
}

let leafletMap = null;
const mapMarkers = {};

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
    pinColor: '#2563eb',
    radius: 2800
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
    pinColor: '#2563eb',
    radius: 2600
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
    pinColor: '#2563eb',
    radius: 3200
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
    pinColor: '#2563eb',
    radius: 2500
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
    pinColor: '#2563eb',
    radius: 2400
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
    pinColor: '#2563eb',
    radius: 4500
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



/* ================= 1. Global Entrance & Scroll Reveal ================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale, .reveal-stagger');
  if (!revealElements.length) return;

  // En móvil o dispositivos sin soporte, revelar todo inmediatamente sin retardo
  const isMobile = window.innerWidth <= 768;
  if (!('IntersectionObserver' in window) || isMobile) {
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
    threshold: 0.02,
    rootMargin: '100px 0px 50px 0px'
  });

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 60) {
      el.classList.add('is-revealed');
    } else {
      observer.observe(el);
    }
  });
}

/* ================= 2. Floating Glass Navbar & Mobile Drawer ================= */
function initNavbar() {
  const headerWrap = document.querySelector('.header-floating-wrap') || document.getElementById('main-header');
  const mobileBtn = document.getElementById('mobile-menu-btn') || document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer') || document.getElementById('mobile-drawer') || document.querySelector('.mobile-nav-drawer');

  if (mobileBtn && mobileDrawer) {
    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleDrawer = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
    };

    mobileBtn.addEventListener('click', toggleDrawer);

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('click', (e) => {
      if (headerWrap && !headerWrap.contains(e.target)) {
        closeDrawer();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
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

/* ================= 3b. Video Background Hero ================= */
function initHeroVideo() {
  const video = document.querySelector('.hero-video-bg');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const attemptPlay = () => {
    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}
  };

  attemptPlay();
  document.addEventListener('touchstart', attemptPlay, { once: true, passive: true });
  document.addEventListener('click', attemptPlay, { once: true, passive: true });
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
function initHeatmap() {
  const mapContainer = document.getElementById('leaflet-heatmap');
  if (!mapContainer) return;

  // Si Leaflet aún se está inicializando, reintentar progresivamente
  if (typeof L === 'undefined') {
    setTimeout(initHeatmap, 100);
    return;
  }

  // Si ya existía una instancia previa, destruirla limpiamente antes de recrear
  if (leafletMap) {
    try {
      leafletMap.remove();
    } catch (e) {}
    leafletMap = null;
  }
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
  }

  // Centro de Isla de Margarita
  const MARGARITA_CENTER = [10.9972, -63.9113];
  const initialZoom = window.innerWidth <= 768 ? 10 : 11;

  leafletMap = L.map('leaflet-heatmap', {
    center: MARGARITA_CENTER,
    zoom: initialZoom,
    zoomControl: true,
    scrollWheelZoom: false,
    tap: true
  });

  // Capa OpenStreetMap oficial (Limpia, rápida y 100% libre sin marca de agua de Carto)
  const mapTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    maxZoom: 19
  });

  // Fallback transparente a Esri World Street Map en caso de retraso o fallo de un mosaico
  mapTileLayer.on('tileerror', (error) => {
    const tile = error.tile;
    const { x, y, z } = error.coords;
    if (tile && !tile._hasFallback) {
      tile._hasFallback = true;
      tile.src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${y}/${x}`;
    }
  });

  mapTileLayer.addTo(leafletMap);

  const zonesGroup = L.featureGroup();

  ZONES_DATA.forEach(zone => {
    // 1. Círculo de calor concéntrico (Heatmap Zone)
    const heatHalo = L.circle(zone.coords, {
      radius: zone.radius || 2600,
      color: zone.color,
      fillColor: zone.color,
      fillOpacity: 0.22,
      weight: 2,
      className: 'leaflet-heat-circle-glow'
    });

    // 2. Pin interactivo personalizado con pulso y etiqueta (dd6e10b)
    const iconHtml = `
      <div class="custom-map-marker">
        <svg class="marker-pin-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 24 34">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22c0-6.63-5.37-12-12-12z" fill="${zone.pinColor || '#2563eb'}"/>
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
        <span class="popup-tag" style="color: ${zone.color};">${zone.badge}</span>
        <div class="map-popup-metrics">
          <div><strong>${zone.price}</strong><br><small>Promedio m²</small></div>
          <div style="text-align: right;"><strong>${zone.roi}</strong><br><small>ROI Proyectado</small></div>
        </div>
        <p style="font-size: 0.78rem; color: #cbd5e1; margin: 0.4rem 0 0.6rem; line-height: 1.35;">${zone.desc}</p>
        <a href="https://api.whatsapp.com/send?phone=34676597068&text=${encodeURIComponent(`Hola Miguel Ángel, quiero consultar oportunidades de inversión en ${zone.name}.`)}" target="_blank" rel="noopener noreferrer" class="map-popup-btn">
          💬 Consultar Oportunidades por WhatsApp ↗
        </a>
      </div>
    `;

    const marker = L.marker(zone.coords, { icon: customIcon })
      .bindPopup(popupHtml);

    const onSelectZone = () => {
      highlightMuniCard(zone.id);
      if (typeof window.scrollMuniToZone === 'function') {
        window.scrollMuniToZone(zone.id);
      }
    };

    marker.on('click', onSelectZone);
    heatHalo.on('click', () => { marker.openPopup(); onSelectZone(); });

    zonesGroup.addLayer(heatHalo);
    zonesGroup.addLayer(marker);
    mapMarkers[zone.id] = marker;
  });

  zonesGroup.addTo(leafletMap);

  // Revalidar tamaño del mapa para cálculo pixel-perfect
  const refreshMapDisplay = () => {
    if (!leafletMap) return;
    leafletMap.invalidateSize();
  };

  setTimeout(refreshMapDisplay, 150);
  setTimeout(refreshMapDisplay, 500);
  setTimeout(refreshMapDisplay, 1200);

  // Observador de visibilidad
  if ('IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          refreshMapDisplay();
        }
      });
    }, { threshold: 0.1 });
    mapObserver.observe(mapContainer);
  }

  // Redimensionamiento de ventana
  window.addEventListener('resize', () => {
    if (leafletMap) leafletMap.invalidateSize();
  }, { passive: true });
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
  const dotsContainer = document.getElementById('muni-carousel-dots');
  const cards = document.querySelectorAll('.muni-card-beige');
  if (!viewport || !track || !cards.length) return;

  let currentPage = 0;
  const total = cards.length;
  let isHovered = false;
  let isDragging = false;
  let startX = 0;

  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const getTotalPages = () => {
    return Math.ceil(total / getVisibleCount());
  };

  const renderDots = () => {
    if (!dotsContainer) return;
    const totalPages = getTotalPages();
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = `muni-dot${i === currentPage ? ' active' : ''}`;
      dot.dataset.page = i;
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Página ${i + 1} de ${totalPages}`);
      dot.addEventListener('click', () => {
        updateSlider(i, true);
      });
      dotsContainer.appendChild(dot);
    }
  };

  const getMaxScroll = () => {
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  };

  const updateSlider = (pageIndex, smooth = true) => {
    const totalPages = getTotalPages();
    currentPage = Math.min(Math.max(0, pageIndex), totalPages - 1);
    const visible = getVisibleCount();
    const firstCardIndex = Math.min(currentPage * visible, total - 1);
    const targetCard = cards[firstCardIndex];
    if (!targetCard) return;

    const maxScroll = getMaxScroll();
    const cardLeft = targetCard.offsetLeft;
    const targetOffset = Math.min(cardLeft, maxScroll);

    track.style.transition = smooth ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    track.style.transform = `translateX(-${targetOffset}px)`;

    const dots = dotsContainer?.querySelectorAll('.muni-dot');
    dots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });

    const zoneId = targetCard.dataset.zone;
    if (zoneId) {
      highlightMuniCard(zoneId);
    }
  };

  const scrollToZone = (zoneId) => {
    const cardIdx = Array.from(cards).findIndex(c => c.dataset.zone === zoneId);
    if (cardIdx !== -1) {
      const visible = getVisibleCount();
      const targetPage = Math.min(Math.floor(cardIdx / visible), getTotalPages() - 1);
      updateSlider(targetPage, true);
      highlightMuniCard(zoneId);
    }
  };

  // Exponer para sincronización bidireccional mapa <-> carrusel
  window.scrollMuniToZone = scrollToZone;

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
      const visible = getVisibleCount();
      const targetPage = Math.min(Math.floor(idx / visible), getTotalPages() - 1);
      updateSlider(targetPage, true);
    });
  });

  // Flechas inferiores
  prevBtn?.addEventListener('click', () => {
    const totalPages = getTotalPages();
    updateSlider((currentPage - 1 + totalPages) % totalPages, true);
  });

  nextBtn?.addEventListener('click', () => {
    const totalPages = getTotalPages();
    updateSlider((currentPage + 1) % totalPages, true);
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
      const totalPages = getTotalPages();
      if (diff > 0) {
        updateSlider((currentPage + 1) % totalPages, true);
      } else {
        updateSlider((currentPage - 1 + totalPages) % totalPages, true);
      }
    }
    setTimeout(() => { isHovered = false; }, 2500);
  });

  // Auto-avance suave continuo
  setInterval(() => {
    if (!isHovered && !isDragging) {
      const totalPages = getTotalPages();
      updateSlider((currentPage + 1) % totalPages, true);
    }
  }, 4800);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateSlider(currentPage, false);
    }, 100);
  }, { passive: true });

  // Exponer para mapa Leaflet
  window.scrollMuniToZone = scrollToZone;

  // Iniciar render de dots y slider
  renderDots();
  updateSlider(0, false);
}

/* ================= 7. Carousel Horizontal de Personal Shopper (Metodología 360°) ================= */
function initPersonalShopperCarousel() {
  const viewport = document.getElementById('workflow-viewport');
  const track = document.getElementById('workflow-track');
  const prevBtn = document.getElementById('workflow-prev-btn');
  const nextBtn = document.getElementById('workflow-next-btn');
  const dotsContainer = document.getElementById('workflow-dots');
  const slides = document.querySelectorAll('.workflow-slide');
  if (!viewport || !track || !slides.length) return;

  let currentPage = 0;
  const total = slides.length;

  const getVisibleCount = () => {
    return window.innerWidth >= 768 ? 2 : 1;
  };

  const getTotalPages = () => {
    return Math.ceil(total / getVisibleCount());
  };

  const renderDots = () => {
    if (!dotsContainer) return;
    const totalPages = getTotalPages();
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = `workflow-dot${i === currentPage ? ' active' : ''}`;
      dot.dataset.page = i;
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Página ${i + 1} de ${totalPages}`);
      dot.addEventListener('click', () => {
        updateCarousel(i);
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateCarousel = (pageIndex) => {
    const totalPages = getTotalPages();
    currentPage = Math.min(Math.max(0, pageIndex), totalPages - 1);

    // En escritorio (>=768px): cada slide es 50%, 2 slides = 100% ancho total -> desplazamiento por página de 100%
    // En móvil (<768px): cada slide es 100% -> desplazamiento por página de 100%
    track.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    track.style.transform = `translateX(-${currentPage * 100}%)`;

    const dots = dotsContainer?.querySelectorAll('.workflow-dot');
    dots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });
  };

  prevBtn?.addEventListener('click', () => {
    const totalPages = getTotalPages();
    updateCarousel((currentPage - 1 + totalPages) % totalPages);
  });

  nextBtn?.addEventListener('click', () => {
    const totalPages = getTotalPages();
    updateCarousel((currentPage + 1) % totalPages);
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
      const totalPages = getTotalPages();
      if (diff > 0) {
        updateCarousel((currentPage + 1) % totalPages);
      } else {
        updateCarousel((currentPage - 1 + totalPages) % totalPages);
      }
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateCarousel(currentPage);
    }, 100);
  }, { passive: true });

  // Iniciar render de dots y carrusel
  renderDots();
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

/* ================= 11. Acordeón Interactivo de Pilares Glassmorphism ================= */
function initManifestoAccordion() {
  const cards = document.querySelectorAll('.manifesto-pillar-box.glass-pillar');
  if (!cards.length) return;

  cards.forEach(card => {
    const togglePillar = () => {
      const isOpen = card.classList.contains('is-open');
      cards.forEach(c => {
        if (c !== card) {
          c.classList.remove('is-open');
          c.setAttribute('aria-expanded', 'false');
        }
      });
      card.classList.toggle('is-open', !isOpen);
      card.setAttribute('aria-expanded', String(!isOpen));
    };

    card.addEventListener('click', () => {
      togglePillar();
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePillar();
      }
    });
  });
}

/* ================= 12. Hero Live Announcement & Countdown ================= */
function initHeroCountdown() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const liveStatus = document.getElementById('hero-live-status');

  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  // Fecha y hora objetivo: Domingo 25 de Octubre 2026, 12:00 PM (12:00) Hora Venezuela (UTC-4) / 6:00 PM Hora España
  const targetTime = new Date('2026-10-25T12:00:00-04:00').getTime();

  function updateCountdown() {
    const now = Date.now();
    const remaining = targetTime - now;

    if (remaining <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      if (liveStatus) {
        liveStatus.textContent = '¡EN DIRECTO AHORA!';
      }
      return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ================= INICIALIZACIÓN GLOBAL ROBUSTA ================= */
function bootstrapApp() {
  const safeInit = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.warn(`[Init] Error en ${name}:`, err);
    }
  };

  safeInit('ScrollReveal', initScrollReveal);
  safeInit('Navbar', initNavbar);
  safeInit('HeroVideo', initHeroVideo);
  safeInit('HeroWordRotator', initHeroWordRotator);
  safeInit('InteractiveModel3D', initInteractiveModel3D);
  safeInit('Heatmap', initHeatmap);
  safeInit('HorizontalMuniSlider', initHorizontalMuniSlider);
  safeInit('PersonalShopperCarousel', initPersonalShopperCarousel);
  safeInit('WorldComparisonShowcase', initWorldComparisonShowcase);
  safeInit('GeneralModals', initGeneralModals);
  safeInit('GoogleFormSection', initGoogleFormSection);
  safeInit('ManifestoAccordion', initManifestoAccordion);
  safeInit('HeroCountdown', initHeroCountdown);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  // Garantizar que la evaluación del módulo termine antes de ejecutar
  setTimeout(bootstrapApp, 0);
}


