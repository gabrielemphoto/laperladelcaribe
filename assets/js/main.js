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
    title: '🌴 Isla de Margarita',
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
    calloutTitle: 'Ventaja Competitiva de Margarita',
    calloutDesc: 'Por el costo de 1 m² en Ibiza o Miami, en Margarita puedes adquirir hasta 60 m² de terreno frente al mar con un ROI anual 3 a 4 veces más elevado.',
    svg: `
      <svg viewBox="0 0 500 360" class="dest-map-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="margarita-clip">
            <path d="M 80,180 C 60,160 50,130 80,100 C 110,70 160,80 180,110 C 200,135 190,165 170,185 C 150,200 100,200 80,180 Z M 175,150 C 210,145 250,148 285,150 C 275,165 220,165 175,150 Z M 285,145 C 310,100 360,80 400,105 C 440,130 450,180 430,225 C 410,265 350,270 310,240 C 280,215 270,180 285,145 Z" />
          </clipPath>
        </defs>
        <g clip-path="url(#margarita-clip)">
          <rect x="0" y="0" width="500" height="120" fill="#facc15" />
          <rect x="0" y="120" width="500" height="120" fill="#0038a8" />
          <rect x="0" y="240" width="500" height="120" fill="#ce1126" />
          <g fill="#ffffff" transform="translate(340, 175) scale(0.65)">
            <circle cx="-35" cy="15" r="4" /><circle cx="-25" cy="0" r="4" /><circle cx="-10" cy="-10" r="4" /><circle cx="10" cy="-10" r="4" /><circle cx="25" cy="0" r="4" /><circle cx="35" cy="15" r="4" />
          </g>
        </g>
        <path d="M 80,180 C 60,160 50,130 80,100 C 110,70 160,80 180,110 C 200,135 190,165 170,185 C 150,200 100,200 80,180 Z M 175,150 C 210,145 250,148 285,150 C 275,165 220,165 175,150 Z M 285,145 C 310,100 360,80 400,105 C 440,130 450,180 430,225 C 410,265 350,270 310,240 C 280,215 270,180 285,145 Z" fill="none" stroke="rgba(212, 160, 23, 0.6)" stroke-width="2" />
        <circle class="dest-pulse-ring" cx="365" cy="210" r="16" fill="none" stroke="#fbbf24" stroke-width="2.5" />
        <circle class="dest-gold-pin" cx="365" cy="210" r="7.5" fill="#fbbf24" stroke="#ffffff" stroke-width="2.5" />
        <rect x="305" y="235" width="120" height="24" rx="12" fill="rgba(9, 16, 26, 0.94)" stroke="#fbbf24" stroke-width="1.2"/>
        <text x="365" y="251" font-size="9" font-weight="800" fill="#fbbf24" text-anchor="middle" font-family="Montserrat">PAMPATAR (ZEE) 📍</text>
      </svg>
    `
  },
  {
    id: 'espana-ibiza',
    flag: '🇪🇸',
    title: '🇪🇸 España (Ibiza & Costa del Sol)',
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
    calloutDesc: 'En Ibiza pagas hasta €6,000 por cada metro cuadrado con apenas 5% de retorno. En Margarita compras suelo frente al mar por $60 - $100/m² y obtienes más de 20% anual.',
    svg: `
      <svg viewBox="0 0 500 380" class="dest-map-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="spain-clip">
            <path d="M 120,60 C 170,55 240,60 300,70 C 340,75 365,115 375,140 C 370,170 350,195 330,220 C 300,260 270,300 230,310 C 190,320 150,305 130,290 C 110,265 95,230 100,190 C 105,150 90,120 85,95 C 80,75 100,65 120,60 Z M 410,180 C 425,175 435,185 430,195 C 420,205 405,195 410,180 Z M 380,215 C 370,210 365,225 375,230 C 385,235 390,220 380,215 Z M 355,240 C 348,235 342,245 350,250 C 358,255 362,245 355,240 Z" />
          </clipPath>
        </defs>
        <g clip-path="url(#spain-clip)">
          <rect x="0" y="0" width="500" height="95" fill="#c60b1e" />
          <rect x="0" y="95" width="500" height="190" fill="#ffc400" />
          <rect x="0" y="285" width="500" height="95" fill="#c60b1e" />
          <g transform="translate(160, 140) scale(0.48)" opacity="0.85">
            <rect x="10" y="10" width="55" height="70" rx="6" fill="#c60b1e" stroke="#854d0e" stroke-width="2" />
            <rect x="20" y="20" width="35" height="50" rx="3" fill="#ffc400" />
            <circle cx="37" cy="8" r="8" fill="#ffc400" stroke="#854d0e" stroke-width="1.5" />
            <line x1="5" y1="20" x2="5" y2="75" stroke="#ffffff" stroke-width="4" />
            <line x1="70" y1="20" x2="70" y2="75" stroke="#ffffff" stroke-width="4" />
          </g>
        </g>
        <path d="M 120,60 C 170,55 240,60 300,70 C 340,75 365,115 375,140 C 370,170 350,195 330,220 C 300,260 270,300 230,310 C 190,320 150,305 130,290 C 110,265 95,230 100,190 C 105,150 90,120 85,95 C 80,75 100,65 120,60 Z M 410,180 C 425,175 435,185 430,195 C 420,205 405,195 410,180 Z M 380,215 C 370,210 365,225 375,230 C 385,235 390,220 380,215 Z M 355,240 C 348,235 342,245 350,250 C 358,255 362,245 355,240 Z" fill="none" stroke="rgba(212, 160, 23, 0.6)" stroke-width="2" />
        <circle class="dest-pulse-ring" cx="355" cy="245" r="18" fill="none" stroke="#fbbf24" stroke-width="2.5" />
        <circle class="dest-gold-pin" cx="355" cy="245" r="7.5" fill="#fbbf24" stroke="#ffffff" stroke-width="2.5" />
        <rect x="320" y="270" width="70" height="22" rx="11" fill="rgba(9, 16, 26, 0.94)" stroke="#fbbf24" stroke-width="1.2"/>
        <text x="355" y="285" font-size="9" font-weight="800" fill="#fbbf24" text-anchor="middle" font-family="Montserrat">IBIZA 📍</text>
      </svg>
    `
  },
  {
    id: 'mexico-cancun',
    flag: '🇲🇽',
    title: '🇲🇽 Cancún (Riviera Maya)',
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
    calloutDesc: 'Cancún ya alcanzó su pico de madurez inmobiliaria. Margarita está al inicio de su ciclo con precios de suelo hasta 30 veces más baratos y potencial de plusvalía virgen.',
    svg: `
      <svg viewBox="0 0 500 360" class="dest-map-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="mexico-clip">
            <path d="M 60,60 C 70,110 90,160 120,180 C 130,150 110,100 80,70 Z M 110,80 C 160,75 220,95 260,130 C 300,160 320,200 330,240 C 350,250 390,230 420,200 C 445,175 450,150 435,135 C 410,125 380,140 360,170 C 340,160 300,140 270,120 C 240,100 180,90 110,80 Z" />
          </clipPath>
        </defs>
        <g clip-path="url(#mexico-clip)">
          <rect x="0" y="0" width="170" height="360" fill="#006847" />
          <rect x="170" y="0" width="160" height="360" fill="#ffffff" />
          <rect x="330" y="0" width="170" height="360" fill="#ce1126" />
          <circle cx="250" cy="160" r="14" fill="#854d0e" opacity="0.6" />
        </g>
        <path d="M 60,60 C 70,110 90,160 120,180 C 130,150 110,100 80,70 Z M 110,80 C 160,75 220,95 260,130 C 300,160 320,200 330,240 C 350,250 390,230 420,200 C 445,175 450,150 435,135 C 410,125 380,140 360,170 C 340,160 300,140 270,120 C 240,100 180,90 110,80 Z" fill="none" stroke="rgba(212, 160, 23, 0.6)" stroke-width="2" />
        <circle class="dest-pulse-ring" cx="430" cy="140" r="16" fill="none" stroke="#fbbf24" stroke-width="2.5" />
        <circle class="dest-gold-pin" cx="430" cy="140" r="7.5" fill="#fbbf24" stroke="#ffffff" stroke-width="2.5" />
        <rect x="385" y="165" width="90" height="22" rx="11" fill="rgba(9, 16, 26, 0.94)" stroke="#fbbf24" stroke-width="1.2"/>
        <text x="430" y="180" font-size="9" font-weight="800" fill="#fbbf24" text-anchor="middle" font-family="Montserrat">CANCÚN 📍</text>
      </svg>
    `
  },
  {
    id: 'usa-miami',
    flag: '🇺🇸',
    title: '🇺🇸 Miami (Florida, EE. UU.)',
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
    calloutDesc: 'En Miami se requieren cientos de miles de dólares solo para comenzar, y los gastos recurrentes devoran tus dividendos. En Margarita eres dueño de suelo real con retorno neto directo en USD.',
    svg: `
      <svg viewBox="0 0 500 360" class="dest-map-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="usa-florida-clip">
            <path d="M 120,60 C 180,65 260,70 330,80 C 320,110 300,140 280,160 C 275,190 280,240 295,280 C 290,295 265,300 255,270 C 245,230 240,180 230,150 C 200,145 160,150 120,160 C 115,120 110,90 120,60 Z" />
          </clipPath>
        </defs>
        <g clip-path="url(#usa-florida-clip)">
          <rect x="0" y="0" width="500" height="28" fill="#b22234" />
          <rect x="0" y="28" width="500" height="28" fill="#ffffff" />
          <rect x="0" y="56" width="500" height="28" fill="#b22234" />
          <rect x="0" y="84" width="500" height="28" fill="#ffffff" />
          <rect x="0" y="112" width="500" height="28" fill="#b22234" />
          <rect x="0" y="140" width="500" height="28" fill="#ffffff" />
          <rect x="0" y="168" width="500" height="28" fill="#b22234" />
          <rect x="0" y="196" width="500" height="28" fill="#ffffff" />
          <rect x="0" y="224" width="500" height="28" fill="#b22234" />
          <rect x="0" y="252" width="500" height="28" fill="#ffffff" />
          <rect x="0" y="280" width="500" height="28" fill="#b22234" />
          <rect x="110" y="50" width="110" height="90" fill="#3c3b6e" />
          <circle cx="130" cy="70" r="3" fill="#ffffff" /><circle cx="155" cy="70" r="3" fill="#ffffff" /><circle cx="180" cy="70" r="3" fill="#ffffff" />
          <circle cx="142" cy="85" r="3" fill="#ffffff" /><circle cx="167" cy="85" r="3" fill="#ffffff" /><circle cx="192" cy="85" r="3" fill="#ffffff" />
          <circle cx="130" cy="100" r="3" fill="#ffffff" /><circle cx="155" cy="100" r="3" fill="#ffffff" /><circle cx="180" cy="100" r="3" fill="#ffffff" />
        </g>
        <path d="M 120,60 C 180,65 260,70 330,80 C 320,110 300,140 280,160 C 275,190 280,240 295,280 C 290,295 265,300 255,270 C 245,230 240,180 230,150 C 200,145 160,150 120,160 C 115,120 110,90 120,60 Z" fill="none" stroke="rgba(212, 160, 23, 0.6)" stroke-width="2" />
        <circle class="dest-pulse-ring" cx="290" cy="270" r="16" fill="none" stroke="#fbbf24" stroke-width="2.5" />
        <circle class="dest-gold-pin" cx="290" cy="270" r="7.5" fill="#fbbf24" stroke="#ffffff" stroke-width="2.5" />
        <rect x="250" y="295" width="80" height="22" rx="11" fill="rgba(9, 16, 26, 0.94)" stroke="#fbbf24" stroke-width="1.2"/>
        <text x="290" y="310" font-size="9" font-weight="800" fill="#fbbf24" text-anchor="middle" font-family="Montserrat">MIAMI 📍</text>
      </svg>
    `
  }
];

/* ================= INICIALIZACIÓN GLOBAL ================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroWordRotator();
  initInteractiveModel3D();
  initHeatmap();
  initVerticalMuniTicker();
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
      const h = w.offsetHeight || w.scrollHeight;
      if (h > maxH) maxH = h;
    });
    if (maxH > 0) {
      wrapper.style.minHeight = (maxH + 14) + 'px';
    }
  };

  calibrateHeight();
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

/* ================= 6. Ticker Vertical de Municipios (Beige & Dorado) ================= */
function initVerticalMuniTicker() {
  const viewport = document.getElementById('muni-vertical-viewport');
  const track = document.getElementById('muni-vertical-track');
  const prevBtn = document.getElementById('muni-prev-btn');
  const nextBtn = document.getElementById('muni-next-btn');
  const cards = document.querySelectorAll('.muni-card-beige');
  if (!viewport || !track || !cards.length) return;

  let currentOffset = 0;
  let isHovered = false;
  let isDragging = false;
  let startY = 0;
  let startOffset = 0;

  const getCardStep = () => {
    const firstCard = cards[0];
    return firstCard ? firstCard.offsetHeight + 18 : 175;
  };

  const getMaxScroll = () => {
    return Math.max(0, track.scrollHeight - viewport.clientHeight);
  };

  const updateTransform = (smooth = true) => {
    track.style.transition = smooth ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    track.style.transform = `translateY(-${currentOffset}px)`;
  };

  const scrollToZone = (zoneId) => {
    const card = Array.from(cards).find(c => c.dataset.zone === zoneId);
    if (card) {
      const cardTop = card.offsetTop;
      currentOffset = Math.min(Math.max(0, cardTop - 15), getMaxScroll());
      updateTransform(true);
      highlightMuniCard(zoneId);
    }
  };

  // Click en tarjeta para sincronizar con mapa
  cards.forEach(card => {
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
        highlightMuniCard(zoneId);
      }
    });
  });

  // Botones de flecha
  prevBtn?.addEventListener('click', () => {
    const step = getCardStep();
    currentOffset = Math.max(0, currentOffset - step);
    updateTransform(true);
  });

  nextBtn?.addEventListener('click', () => {
    const step = getCardStep();
    const max = getMaxScroll();
    if (currentOffset >= max - 10) {
      currentOffset = 0;
    } else {
      currentOffset = Math.min(max, currentOffset + step);
    }
    updateTransform(true);
  });

  // Pausa en hover
  viewport.addEventListener('mouseenter', () => { isHovered = true; });
  viewport.addEventListener('mouseleave', () => { isHovered = false; isDragging = false; });

  // Desplazamiento táctil y arrastre
  viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    isHovered = true;
    startY = e.touches[0].pageY;
    startOffset = currentOffset;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].pageY - startY;
    currentOffset = Math.min(Math.max(0, startOffset - deltaY), getMaxScroll());
    updateTransform(false);
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    isDragging = false;
    setTimeout(() => { isHovered = false; }, 2000);
  });

  // Movimiento lento continuo y suave
  let lastTime = performance.now();
  const speed = 0.022; // px por ms
  let direction = 1;

  const autoScrollLoop = (time) => {
    const dt = time - lastTime;
    lastTime = time;

    if (!isHovered && !isDragging) {
      const max = getMaxScroll();
      if (max > 10) {
        currentOffset += speed * dt * direction;
        if (currentOffset >= max) {
          currentOffset = max;
          direction = -1;
        } else if (currentOffset <= 0) {
          currentOffset = 0;
          direction = 1;
        }
        updateTransform(false);
      }
    }
    requestAnimationFrame(autoScrollLoop);
  };

  requestAnimationFrame(autoScrollLoop);

  // Exponer para interacción desde pines Leaflet
  window.scrollMuniToZone = scrollToZone;
}

/* ================= 7. Carousel Horizontal de Personal Shopper (Metodología 360°) ================= */
function initPersonalShopperCarousel() {
  const viewport = document.getElementById('workflow-viewport');
  const track = document.getElementById('workflow-track');
  const prevBtn = document.getElementById('workflow-prev-btn');
  const nextBtn = document.getElementById('workflow-next-btn');
  const stepTabs = document.querySelectorAll('.workflow-step-tab');
  const dots = document.querySelectorAll('.workflow-dot');
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

    stepTabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === currentStep);
    });
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

  stepTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.dataset.step, 10);
      updateCarousel(step);
    });
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
}

/* ================= 8. Showcase Animado de Comparativa Mundial con Bandera & Contadores ================= */
function initWorldComparisonShowcase() {
  const container = document.getElementById('world-comparison-showcase');
  if (!container) return;

  const tabs = container.querySelectorAll('.dest-tab-btn');
  const prevBtn = document.getElementById('dest-prev-btn');
  const nextBtn = document.getElementById('dest-next-btn');
  const mapContainer = document.getElementById('dest-map-container');
  const badgeFlag = document.getElementById('dest-badge-flag');
  const badgeText = document.getElementById('dest-badge-text');

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
  const indicatorText = document.getElementById('dest-indicator-text');

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

    // Actualizar tabs
    tabs.forEach((tab, i) => {
      const isActive = i === currentDestIndex;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Inyectar SVG con bandera y punto dorado
    if (mapContainer) {
      mapContainer.innerHTML = dest.svg;
    }

    if (badgeFlag) badgeFlag.textContent = dest.flag;
    if (badgeText) badgeText.textContent = dest.locationBadge;

    if (titleEl) titleEl.textContent = dest.title;
    if (subtitleEl) subtitleEl.textContent = dest.subtitle;
    if (statusTagEl) statusTagEl.textContent = dest.statusTag;

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

    if (indicatorText) {
      indicatorText.textContent = `Destino ${currentDestIndex + 1} de ${total} • Toca cualquier pestaña o flecha para comparar`;
    }
  };

  // Event Listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.dest, 10);
      renderDestination(idx);
    });
  });

  prevBtn?.addEventListener('click', () => {
    renderDestination(currentDestIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    renderDestination(currentDestIndex + 1);
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
