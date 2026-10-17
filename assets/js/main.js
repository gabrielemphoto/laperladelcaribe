/**
 * MIGUEL ANGEL - LA PERLA DEL CARIBE
 * Personal Shopper Inmobiliario & Constructor • Isla de Margarita
 * Lógica Interactiva: Mapa de Margarita, Marketplace Dinámico, Hero Transformation, Formularios y Modales
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
    desc: 'Terreno virgen con zonificación turística-residencial de alta densidad. Ideal para desarrollo de hotel boutique o complejo de 6 villas privadas.',
    specs: ['1,450 m² Terreno', 'Frente de Playa', 'Factibilidad Eléctrica & Pozo', 'Papeles 100% en Regla'],
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
    desc: 'Propiedad hotelera operativa de 12 cabanas de lujo con restaurante frente al mar, escuela de kitesurf y clientela internacional recurrente de Europa.',
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
    image: 'assets/images/margarita-sunset-villa.jpg'
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
  initHeroTransformation();
  initMarketplace();
  initMapInteractivity();
  initPropertyPostulationModal();
  initGeneralModals();
  initHeroLeadForm();
  initScrollAnimations();
});

/* ================= 1. Navbar & Scroll Blur ================= */
function initNavbar() {
  const header = document.querySelector('.header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

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

/* ================= 2. Hero Transformation (Terreno -> Construcción -> Rentas) ================= */
function initHeroTransformation() {
  const tabs = document.querySelectorAll('.trans-tab');
  const titleEl = document.getElementById('trans-title');
  const descEl = document.getElementById('trans-desc');
  const badgeEl = document.getElementById('trans-badge');
  const widgetOccupancy = document.getElementById('widget-occupancy-val');
  const widgetRevenue = document.getElementById('widget-revenue-val');

  const stages = {
    terreno: {
      title: 'Paso 1: Adquisición de Terreno Virgen',
      desc: 'Localizamos parcelas estratégicas en Pampatar o El Yaque con papeles 100% en regla y precios de entrada hasta 65% menores que en España.',
      badge: 'Fase: Búsqueda & Filtrado',
      occupancy: 'Fase Inicial',
      revenue: '$0 (Plusvalía Potencial)'
    },
    construccion: {
      title: 'Paso 2: Construcción & Arquitectura Llave en Mano',
      desc: 'Diseñamos y edificamos tu villa, posada u hotel boutique con energía solar, pozo autónomo y supervisión integral sin que tengas que viajar.',
      badge: 'Fase: Obra & Permisología',
      occupancy: 'En Ejecución',
      revenue: '+34% Plusvalía en Obra'
    },
    rentas: {
      title: 'Paso 3: Operación Hotelera & Recogida de Rentas',
      desc: 'Administramos tu propiedad en Airbnb Luxe / Booking y depositamos tus dividendos netos mensuales en tu cuenta bancaria internacional o wallet.',
      badge: 'Fase: Recoge tus Ganancias',
      occupancy: '88% Ocupación Anual',
      revenue: '+$8,450 USD / mes'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const stageKey = tab.dataset.stage;
      const data = stages[stageKey];
      if (data) {
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (badgeEl) badgeEl.textContent = data.badge;
        if (widgetOccupancy) widgetOccupancy.textContent = data.occupancy;
        if (widgetRevenue) widgetRevenue.textContent = data.revenue;
      }
    });
  });
}

/* ================= 3. Marketplace de Propiedades ================= */
let activeZoneFilter = 'all';
let activeTypeFilter = 'all';

function getStoredProperties() {
  const custom = localStorage.getItem('margarita_custom_properties');
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      return [...parsed, ...DEFAULT_PROPERTIES];
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_PROPERTIES;
}

function renderMarketplace() {
  const grid = document.getElementById('marketplace-grid');
  const countEl = document.getElementById('marketplace-count');
  if (!grid) return;

  const properties = getStoredProperties();

  const filtered = properties.filter(item => {
    const matchZone = activeZoneFilter === 'all' || item.zone === activeZoneFilter;
    const matchType = activeTypeFilter === 'all' || item.type === activeTypeFilter;
    return matchZone && matchType;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} Propiedades Encontradas`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--c-card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
        <p style="color: var(--c-text-muted); font-size: 1.1rem;">No hay propiedades con los filtros seleccionados.</p>
        <button class="btn btn-gold" style="margin-top: 1rem;" onclick="resetMarketplaceFilters()">Ver Todas las Propiedades</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="property-card reveal active" data-id="${item.id}">
      <div class="property-img-wrap">
        <img src="${item.image || 'assets/images/margarita-sunset-villa.jpg'}" alt="${item.title}" class="property-img" loading="lazy">
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
          <button class="btn btn-sunset" style="padding: 0.6rem 1.1rem; font-size: 0.8rem;" onclick="openPropertyDetail('${item.id}')">
            <span>Consultar Ficha</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

window.resetMarketplaceFilters = function() {
  activeZoneFilter = 'all';
  activeTypeFilter = 'all';

  document.querySelectorAll('.zone-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.zone === 'all');
  });
  document.querySelectorAll('.type-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === 'all');
  });

  renderMarketplace();
};

function initMarketplace() {
  // Botones de filtro de tipo
  const typePills = document.querySelectorAll('.type-filter-pill');
  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTypeFilter = pill.dataset.type;
      renderMarketplace();
    });
  });

  // Botones de filtro de zona
  const zoneBtns = document.querySelectorAll('.zone-filter-btn');
  zoneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      zoneBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeZoneFilter = btn.dataset.zone;
      renderMarketplace();
    });
  });

  renderMarketplace();
}

/* ================= 4. Mapa Interactivo de Margarita ================= */
function initMapInteractivity() {
  const pins = document.querySelectorAll('.map-pin-group');
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const zone = pin.dataset.zone;
      if (!zone) return;

      activeZoneFilter = zone;

      // Actualizar botón de filtro activo
      document.querySelectorAll('.zone-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.zone === zone);
      });

      renderMarketplace();

      // Desplazamiento suave al marketplace
      const marketplaceSec = document.getElementById('marketplace-sec');
      if (marketplaceSec) {
        marketplaceSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ================= 5. Modal Postular Propiedad (Google Forms & Dinámico) ================= */
function initPropertyPostulationModal() {
  const openBtn = document.getElementById('btn-open-postulate');
  const modal = document.getElementById('modal-postulate');
  const closeBtn = document.getElementById('close-postulate-modal');
  const form = document.getElementById('form-postulate-property');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // Procesar envío de nueva propiedad
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = form.querySelector('[name="prop_title"]').value;
      const zone = form.querySelector('[name="prop_zone"]').value;
      const type = form.querySelector('[name="prop_type"]').value;
      const status = form.querySelector('[name="prop_status"]').value;
      const papers = form.querySelector('[name="prop_papers"]').value;
      const priceVal = form.querySelector('[name="prop_price"]').value;
      const photoLink = form.querySelector('[name="prop_photo_link"]').value || 'assets/images/margarita-beachfront-land.jpg';
      const ownerName = form.querySelector('[name="owner_name"]').value;
      const ownerPhone = form.querySelector('[name="owner_phone"]').value;

      const newProperty = {
        id: 'prop-' + Date.now(),
        zone: zone,
        zoneName: zone.toUpperCase(),
        type: type,
        typeName: type.toUpperCase(),
        title: title,
        desc: `Propiedad postulada por ${ownerName}. Estatus: ${status}. Papeles: ${papers}.`,
        specs: [`Estado: ${status}`, `Legal: ${papers}`, 'Verificación en Curso'],
        price: `$${priceVal} USD`,
        roi: 'Por Calcular',
        status: 'proyecto',
        statusText: 'Postulada',
        image: photoLink
      };

      // Guardar en localStorage
      const existing = JSON.parse(localStorage.getItem('margarita_custom_properties') || '[]');
      existing.unshift(newProperty);
      localStorage.setItem('margarita_custom_properties', JSON.stringify(existing));

      // Actualizar vista
      renderMarketplace();
      modal.classList.remove('open');

      // Notificación al usuario y redirección opcional a WhatsApp de Miguel Ángel
      alert('¡Propiedad postulada con éxito! Se ha añadido de forma inmediata a la vista del marketplace y ha sido enviada al equipo de Miguel Ángel para verificación legal.');

      const waMsg = encodeURIComponent(
        `*Nueva Propiedad Postulada en La Perla del Caribe:*\n` +
        `*Título:* ${title}\n` +
        `*Zona:* ${zone}\n` +
        `*Precio:* $${priceVal} USD\n` +
        `*Papeles:* ${papers}\n` +
        `*Propietario:* ${ownerName} (${ownerPhone})\n` +
        `*Fotos:* ${photoLink}`
      );
      window.open(`https://api.whatsapp.com/send?phone=584120000000&text=${waMsg}`, '_blank');
      form.reset();
    });
  }
}

/* ================= 6. Modales Generales (VIP & Agendar Llamada) ================= */
function initGeneralModals() {
  // Modal VIP
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

  // Modal Agendar
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

  // Cerrar al click afuera
  [vipModal, callModal].forEach(m => {
    m?.addEventListener('click', (e) => {
      if (e.target === m) m.classList.remove('open');
    });
  });
}

/* ================= 7. Formulario de Captación de Leads en el Hero ================= */
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
      // Envío real a servicio de correo FormSubmit o Formspree
      const response = await fetch('https://formsubmit.co/ajax/miguelangel.laperladelcaribe@gmail.com', {
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
          Origen: 'Hero Landing Page - La Perla del Caribe'
        })
      });

      if (submitBtn) {
        submitBtn.innerHTML = '✓ ¡Recibido! Conectando con Miguel Ángel...';
        submitBtn.style.background = '#22c55e';
      }

      // Conexión adicional a WhatsApp comercial
      setTimeout(() => {
        const waMsg = encodeURIComponent(
          `*Hola Miguel Ángel, solicito información como inversionista en Margarita:*\n` +
          `*Nombre:* ${name}\n` +
          `*Email:* ${email}\n` +
          `*Teléfono:* ${phone}\n` +
          `*Presupuesto:* ${budget}\n` +
          `*Interés:* ${projectType}`
        );
        window.open(`https://api.whatsapp.com/send?phone=584120000000&text=${waMsg}`, '_blank');
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }
      }, 1200);

    } catch (err) {
      console.warn('Fallback WhatsApp directo:', err);
      if (submitBtn) {
        submitBtn.innerHTML = 'Conectando vía WhatsApp...';
      }
      const waMsg = encodeURIComponent(
        `*Hola Miguel Ángel, deseo información de inversión en Margarita:*\n` +
        `*Nombre:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Teléfono:* ${phone}\n` +
        `*Presupuesto:* ${budget}\n` +
        `*Interés:* ${projectType}`
      );
      window.open(`https://api.whatsapp.com/send?phone=584120000000&text=${waMsg}`, '_blank');
      form.reset();
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

/* ================= 8. Scroll Reveal Animations ================= */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Global modal trigger for individual property
window.openPropertyDetail = function(id) {
  const properties = getStoredProperties();
  const prop = properties.find(p => p.id === id);
  if (!prop) return;

  const waMsg = encodeURIComponent(
    `*Hola Miguel Ángel, deseo consultar detalles y coordinar visita para:*\n` +
    `*Propiedad:* ${prop.title} (${prop.zoneName})\n` +
    `*Precio:* ${prop.price}\n` +
    `*Tipo:* ${prop.typeName}`
  );
  window.open(`https://api.whatsapp.com/send?phone=584120000000&text=${waMsg}`, '_blank');
};
