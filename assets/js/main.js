/**
 * MIGUEL ANGEL - LA PERLA DEL CARIBE
 * Personal Shopper Inmobiliario & Constructor • Isla de Margarita
 * Lógica Principal: Mapa de Calor Leaflet, Escenario Cinemático y Navegación
 */

const ZONES_DATA = [
  {
    id: 'pampatar',
    name: 'Pampatar',
    fullName: 'Pampatar (Milla de Oro)',
    coords: [10.9986, -63.7981],
    color: '#10b981',
    badgeClass: 'green',
    badge: 'Zona Premium / ZEE',
    price: '$90 - $180 / m²',
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
    price: '$65 - $130 / m²',
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
    price: '$35 - $80 / m²',
    roi: '24% - 30% Plusvalía',
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
    price: '$55 - $110 / m²',
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
    price: '$30 - $60 / m²',
    roi: '15% - 18% Anual',
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
    price: '$20 - $45 / m²',
    roi: '20% Anual Est.',
    desc: 'Kilómetros de playas vírgenes y reservas naturales. Destino predilecto para eco-resorts solares, glamping de ultra-lujo y bienestar.',
    pinColor: '#2563eb'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCinematicStage();
  initHeatmap();
  initMuniCards();
  initGeneralModals();
  initGoogleFormSection();
});

/* ================= 1. Navbar Mobile ================= */
function initNavbar() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ================= 2. Cinematic Stage ================= */
function initCinematicStage() {
  const tabs = document.querySelectorAll('.stage-tab-btn');
  const slides = document.querySelectorAll('.stage-slide');
  if (tabs.length === 0 || slides.length === 0) return;

  let current = 0;
  let autoplayTimer = null;

  function setSlide(index) {
    current = index % slides.length;
    tabs.forEach(t => t.classList.remove('active'));
    slides.forEach(s => s.classList.remove('active'));

    tabs[current].classList.add('active');
    slides[current].classList.add('active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = parseInt(tab.dataset.target, 10);
      setSlide(target);
      restartAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      setSlide(current + 1);
    }, 7000);
  }

  function restartAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
}

/* ================= 3. Leaflet Investment Heatmap ================= */
let leafletMap = null;
const mapMarkers = {};

function initHeatmap() {
  const mapContainer = document.getElementById('leaflet-heatmap');
  if (!mapContainer || typeof L === 'undefined') return;

  // Inicializar mapa centrado en Isla de Margarita
  leafletMap = L.map('leaflet-heatmap', {
    center: [10.985, -64.000],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: false
  });

  // Capa OpenStreetMap 100% gratuita y sin requerimiento de API Key
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  }).addTo(leafletMap);

  const markersGroup = L.featureGroup();

  // Agregar pines interactivos
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
    });
  });

  markersGroup.addTo(leafletMap);

  // Ajustar encuadre automático a todos los pines para que nunca se corten en móvil
  try {
    leafletMap.fitBounds(markersGroup.getBounds().pad(0.12));
  } catch (err) {
    // Fallback silencioso si no se han cargado las dimensiones
  }

  // Refrescar tamaño tras carga completa
  setTimeout(() => {
    leafletMap.invalidateSize();
  }, 300);
}

function highlightMuniCard(zoneId) {
  document.querySelectorAll('.muni-card').forEach(card => {
    card.classList.toggle('active', card.dataset.zone === zoneId);
  });
}

/* ================= 4. Tarjetas de Municipios Interactivas ================= */
function initMuniCards() {
  const cards = document.querySelectorAll('.muni-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Si hizo clic directamente en el enlace de marketplace, dejar navegar
      if (e.target.closest('.muni-cta-link')) return;

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
}

/* ================= 5. Modales VIP & Agendar ================= */
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

/* ================= 6. Postulación de Propiedades (Directo & Google Forms) ================= */
function initGoogleFormSection() {
  const form = document.getElementById('property-direct-postulation-form');
  const customUrlBtn = document.getElementById('btn-apply-google-url');
  const customUrlInput = document.getElementById('input-google-form-url');
  const iframeHolder = document.getElementById('google-form-iframe-wrap');
  const directFormHolder = document.getElementById('property-direct-form-wrap');
  const iframeEl = document.getElementById('google-forms-live-frame');

  // Si hay una URL de Google Forms guardada previamente en localStorage, cargarla
  try {
    const savedUrl = localStorage.getItem('laperla_google_forms_url');
    if (savedUrl && iframeEl && iframeHolder && directFormHolder) {
      iframeEl.src = savedUrl;
      iframeHolder.style.display = 'block';
      directFormHolder.style.display = 'none';
    }
  } catch (err) {}

  // Permitir pegar una URL de Google Forms para probar en vivo
  if (customUrlBtn && customUrlInput) {
    customUrlBtn.addEventListener('click', () => {
      const url = customUrlInput.value.trim();
      if (url.startsWith('https://docs.google.com/forms/')) {
        let embedUrl = url;
        if (!embedUrl.includes('embedded=true')) {
          embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'embedded=true';
        }
        try {
          localStorage.setItem('laperla_google_forms_url', embedUrl);
        } catch (e) {}
        if (iframeEl) iframeEl.src = embedUrl;
        if (iframeHolder) iframeHolder.style.display = 'block';
        if (directFormHolder) directFormHolder.style.display = 'none';
      } else {
        alert('Por favor ingresa una URL válida de Google Forms (https://docs.google.com/forms/...)');
      }
    });
  }

  // Manejador del formulario directo para postular con envío por WhatsApp
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
