/**
 * MIGUEL ANGEL - LA PERLA DEL CARIBE
 * Personal Shopper Inmobiliario & Constructor • Isla de Margarita
 * Lógica Interactiva: Google Maps, Google Forms Modal, Escenario Cinemático y Marketplace
 */

// Catálogo base de propiedades en Isla de Margarita
const DEFAULT_PROPERTIES = [
  {
    id: 'prop-1',
    zone: 'pampatar',
    zoneName: 'Pampatar',
    type: 'terreno',
    typeName: 'Terreno Frente al Mar',
    title: 'Lote Estratégico Bahía de Pampatar',
    desc: 'Terreno virgen con zonificación turística-residencial de alta densidad. Ideal para desarrollo de hotel boutique o complejo de villas privadas.',
    specs: ['1,450 m² Terreno', 'Frente de Playa', 'Factibilidad de Pozo', 'Papeles 100% en Regla'],
    price: '$85,000 USD',
    roi: '22% Anual Est.',
    status: 'disponible',
    statusText: 'Disponible ZEE',
    image: 'assets/images/margarita-beachfront-land.jpg'
  },
  {
    id: 'prop-2',
    zone: 'pampatar',
    zoneName: 'Pampatar (La Caranta)',
    type: 'villa',
    typeName: 'Villa de Lujo Llave en Mano',
    title: 'Villa Sunset Horizon Pampatar',
    desc: 'Arquitectura moderna de autor con piscina infinity, 4 suites, acabados en madera de teca y sistema solar autónomo 100%. Generando rentas en Airbnb Luxe.',
    specs: ['420 m² Const.', '4 Suites', 'Piscina Infinity', 'Planta Eléctrica 100%'],
    price: '$260,000 USD',
    roi: '18% Anual Est.',
    status: 'disponible',
    statusText: 'Rentando $3,800/mes',
    image: 'assets/images/margarita-sunset-villa.jpg'
  },
  {
    id: 'prop-3',
    zone: 'el-yaque',
    zoneName: 'Playa El Yaque',
    type: 'hotel',
    typeName: 'Posada Boutique & Eco-Resort',
    title: 'Eco-Resort Boutique El Yaque',
    desc: 'Propiedad hotelera operativa de 12 cabañas de lujo con restaurante frente al mar, escuela de kitesurf y clientela internacional recurrente de Europa.',
    specs: ['12 Suites', '1,800 m² Parcela', 'Licencia Turística ZEE', 'Ocupación 82%'],
    price: '$390,000 USD',
    roi: '21% Anual Est.',
    status: 'negociacion',
    statusText: 'En Negociación',
    image: 'assets/images/margarita-boutique-hotel.jpg'
  },
  {
    id: 'prop-4',
    zone: 'costa-azul',
    zoneName: 'Costa Azul',
    type: 'villa',
    typeName: 'Penthouse & Condominio',
    title: 'Penthouse Miramar Costa Azul',
    desc: 'Exclusivo ático con terraza panorámica de 360° a la bahía, acabados en mármol, pozo de agua propio y doble puesto techado en la zona comercial más segura.',
    specs: ['280 m² Const.', '3 Habitaciones', 'Doble Balcón', 'Pozo Propio'],
    price: '$135,000 USD',
    roi: '15% Anual Est.',
    status: 'disponible',
    statusText: 'Disponible',
    image: 'assets/images/margarita-lifestyle-enjoy.jpg'
  },
  {
    id: 'prop-5',
    zone: 'playa-el-agua',
    zoneName: 'Playa El Agua',
    type: 'terreno',
    typeName: 'Macrolote Turístico',
    title: 'Parcela de Gran Extensión El Agua',
    desc: 'Terreno plano de 5,000 m² a 150 metros del bulevar de Playa El Agua. Apto para resort hotelero o desarrollo habitacional bajo beneficios tributarios ZEE.',
    specs: ['5,000 m² Terreno', 'Uso Turístico', 'Acceso Asfaltado', 'Solvencia Notarial'],
    price: '$175,000 USD',
    roi: '24% Plusvalía',
    status: 'proyecto',
    statusText: 'Proyecto ZEE',
    image: 'assets/images/margarita-beachfront-land.jpg'
  },
  {
    id: 'prop-6',
    zone: 'macanao',
    zoneName: 'Península de Macanao',
    type: 'terreno',
    typeName: 'Terreno Ecoturístico Virgen',
    title: 'Lote Costero Punta Arenas',
    desc: 'Paraíso de arenas doradas y aguas cristalinas, ideal para glamping de ultra-lujo, wellness retreat o villa autosustentable con energía fotovoltaica.',
    specs: ['3,200 m² Terreno', 'Playa Virgen', 'Atardecer Panorámico', 'Título Privado'],
    price: '$65,000 USD',
    roi: '20% Anual Est.',
    status: 'disponible',
    statusText: 'Disponible',
    image: 'assets/images/margarita-beachfront-land.jpg'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCinematicStage();
  initGoogleMapsIntegration();
  initMarketplace();
  initGoogleFormsModal();
  initGeneralModals();
  initHeroLeadForm();
});

/* ================= 1. Navbar Mobile ================= */
function initNavbar() {
  const header = document.querySelector('.header');
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

/* ================= 2. Cinematic Stage (Carousel Seguro) ================= */
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

/* ================= 3. Google Maps Integration & Zone Filtering ================= */
function initGoogleMapsIntegration() {
  const chips = document.querySelectorAll('.map-chip-btn');
  const mapFrame = document.getElementById('google-maps-frame');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const query = chip.dataset.mapQ;
      const zone = chip.dataset.zone;

      // Actualizar el mapa de Google Maps dinámicamente
      if (mapFrame && query) {
        mapFrame.src = `https://www.google.com/maps?q=${query}&t=m&z=12&output=embed`;
      }

      // Filtrar el marketplace
      activeZoneFilter = zone || 'all';
      renderMarketplace();
    });
  });
}

/* ================= 4. Marketplace de Propiedades ================= */
let activeZoneFilter = 'all';
let activeTypeFilter = 'all';

function renderMarketplace() {
  const grid = document.getElementById('marketplace-grid');
  const countEl = document.getElementById('marketplace-count');
  if (!grid) return;

  const filtered = DEFAULT_PROPERTIES.filter(item => {
    const matchZone = activeZoneFilter === 'all' || item.zone === activeZoneFilter;
    const matchType = activeTypeFilter === 'all' || item.type === activeTypeFilter;
    return matchZone && matchType;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} Activos Encontrados`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; background: var(--c-card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
        <p style="color: var(--c-text-muted); font-size: 1rem;">No hay propiedades con este filtro de zona o tipo.</p>
        <button class="btn btn-gold" style="margin-top: 0.8rem;" onclick="resetFilters()">Ver Todas las Propiedades</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="property-card" data-id="${item.id}">
      <div class="property-img-wrap">
        <img src="${item.image}" alt="${item.title}" class="property-img" loading="lazy">
        <span class="property-badge-zone">${item.zoneName}</span>
        <span class="property-badge-status status-${item.status}">${item.statusText}</span>
      </div>
      <div class="property-body">
        <div class="property-type-tag">${item.typeName}</div>
        <h4 class="property-title">${item.title}</h4>
        <p class="property-desc">${item.desc}</p>
        
        <div class="property-specs">
          ${item.specs.map(spec => `<span class="spec-item">${spec}</span>`).join('')}
        </div>

        <div class="property-footer">
          <div class="price-box">
            <span>Inversión</span>
            <strong>${item.price}</strong>
          </div>
          <button class="btn btn-sunset" style="padding: 0.5rem 0.9rem; font-size: 0.78rem;" onclick="openPropertyDetail('${item.id}')">
            <span>Consultar Ficha</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

window.resetFilters = function() {
  activeZoneFilter = 'all';
  activeTypeFilter = 'all';

  document.querySelectorAll('.map-chip-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.zone === 'all');
  });
  document.querySelectorAll('.type-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === 'all');
  });

  const mapFrame = document.getElementById('google-maps-frame');
  if (mapFrame) {
    mapFrame.src = 'https://www.google.com/maps?q=Isla+de+Margarita,+Nueva+Esparta,+Venezuela&t=m&z=11&output=embed';
  }

  renderMarketplace();
};

function initMarketplace() {
  const typePills = document.querySelectorAll('.type-filter-pill');
  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTypeFilter = pill.dataset.type;
      renderMarketplace();
    });
  });

  renderMarketplace();
}

/* ================= 5. Google Forms Modal ================= */
function initGoogleFormsModal() {
  const openBtns = [
    document.getElementById('btn-open-google-form'),
    document.getElementById('footer-google-form-btn')
  ];
  const modal = document.getElementById('modal-google-forms');
  const closeBtn = document.getElementById('close-google-forms-modal');

  openBtns.forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.add('open');
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

/* ================= 6. Modales Generales (VIP & Agendar) ================= */
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

/* ================= 7. Formulario de Captación de Leads ================= */
function initHeroLeadForm() {
  const form = document.getElementById('hero-lead-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Enviar';

    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const budget = form.querySelector('[name="budget"]').value;
    const projectType = form.querySelector('[name="project_type"]').value;

    if (submitBtn) {
      submitBtn.innerHTML = 'Enviando y Notificando...';
      submitBtn.disabled = true;
    }

    try {
      await fetch('https://formsubmit.co/ajax/miguelangel.laperladelcaribe@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nuevo Lead Inversionista VIP: ${name} (${budget})`,
          Nombre: name,
          Email: email,
          WhatsApp: phone,
          Presupuesto: budget,
          Interes: projectType,
          Origen: 'Hero Landing Page - Miguel Ángel La Perla del Caribe'
        })
      });

      if (submitBtn) {
        submitBtn.innerHTML = '✓ ¡Recibido! Conectando vía WhatsApp...';
        submitBtn.style.background = '#22c55e';
      }

      setTimeout(() => {
        const waMsg = encodeURIComponent(
          `*Hola Miguel Ángel, solicito información como inversionista en Margarita:*\n` +
          `*Nombre:* ${name}\n` +
          `*Email:* ${email}\n` +
          `*WhatsApp:* ${phone}\n` +
          `*Presupuesto:* ${budget}\n` +
          `*Interés:* ${projectType}`
        );
        window.open(`https://api.whatsapp.com/send?phone=34676597068&text=${waMsg}`, '_blank');
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }
      }, 1000);

    } catch (err) {
      const waMsg = encodeURIComponent(
        `*Hola Miguel Ángel, deseo información de inversión en Margarita:*\n` +
        `*Nombre:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*WhatsApp:* ${phone}\n` +
        `*Presupuesto:* ${budget}\n` +
        `*Interés:* ${projectType}`
      );
      window.open(`https://api.whatsapp.com/send?phone=34676597068&text=${waMsg}`, '_blank');
      form.reset();
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

// Detalle por WhatsApp de propiedad individual
window.openPropertyDetail = function(id) {
  const prop = DEFAULT_PROPERTIES.find(p => p.id === id);
  if (!prop) return;

  const waMsg = encodeURIComponent(
    `*Hola Miguel Ángel, deseo consultar detalles sobre:*\n` +
    `*Propiedad:* ${prop.title} (${prop.zoneName})\n` +
    `*Precio:* ${prop.price}\n` +
    `*Tipo:* ${prop.typeName}`
  );
  window.open(`https://api.whatsapp.com/send?phone=34676597068&text=${waMsg}`, '_blank');
};
