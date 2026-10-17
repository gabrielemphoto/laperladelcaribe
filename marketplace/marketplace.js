/**
 * MIGUEL ANGEL - LA PERLA DEL CARIBE
 * Marketplace Oficial de Terrenos & Propiedades • Isla de Margarita
 * Lógica de Filtrado por Zona y Tipo, Integración Google Forms y WhatsApp (+34 676 59 70 68)
 */

const WHATSAPP_PHONE = '34676597068';
const DEFAULT_WA_MESSAGE = 'Estoy interesado en invertir en la Isla de Margarita.';

const PROPERTIES = [
  {
    id: 'prop-1',
    zone: 'pampatar',
    zoneName: 'Pampatar',
    type: 'terreno',
    typeName: 'Terreno Frente al Mar',
    title: 'Lote Estratégico Bahía de Pampatar',
    desc: 'Terreno virgen con zonificación turística-residencial de alta densidad en la Milla de Oro. Ideal para desarrollo de hotel boutique o complejo de villas privadas.',
    specs: ['1,450 m² Terreno', 'Frente de Playa', 'Factibilidad de Pozo', 'Papeles 100% en Regla'],
    price: '$85,000 USD',
    roi: '22% Anual Est.',
    status: 'disponible',
    statusText: 'Disponible ZEE',
    image: '../assets/images/margarita-beachfront-land.jpg'
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
    image: '../assets/images/margarita-sunset-villa.jpg'
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
    image: '../assets/images/margarita-boutique-hotel.jpg'
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
    image: '../assets/images/margarita-lifestyle-enjoy.jpg'
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
    image: '../assets/images/margarita-beachfront-land.jpg'
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
    image: '../assets/images/margarita-beachfront-land.jpg'
  }
];

let activeZone = 'all';
let activeType = 'all';

document.addEventListener('DOMContentLoaded', () => {
  readQueryParams();
  initFilters();
  initGoogleFormsModal();
  renderGrid();
});

function readQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const zone = params.get('zone');
  const type = params.get('type');

  if (zone && ['pampatar', 'el-yaque', 'costa-azul', 'playa-el-agua', 'macanao'].includes(zone.toLowerCase())) {
    activeZone = zone.toLowerCase();
  }
  if (type && ['terreno', 'villa', 'hotel'].includes(type.toLowerCase())) {
    activeType = type.toLowerCase();
  }
}

function initFilters() {
  const zoneButtons = document.querySelectorAll('[data-filter-zone]');
  const typeButtons = document.querySelectorAll('[data-filter-type]');

  zoneButtons.forEach(btn => {
    if (btn.dataset.filterZone === activeZone) {
      zoneButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      zoneButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeZone = btn.dataset.filterZone;
      updateUrlState();
      renderGrid();
    });
  });

  typeButtons.forEach(btn => {
    if (btn.dataset.filterType === activeType) {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.dataset.filterType;
      updateUrlState();
      renderGrid();
    });
  });

  const resetBtn = document.getElementById('btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeZone = 'all';
      activeType = 'all';

      zoneButtons.forEach(b => b.classList.toggle('active', b.dataset.filterZone === 'all'));
      typeButtons.forEach(b => b.classList.toggle('active', b.dataset.filterType === 'all'));

      updateUrlState();
      renderGrid();
    });
  }
}

function updateUrlState() {
  const params = new URLSearchParams();
  if (activeZone !== 'all') params.set('zone', activeZone);
  if (activeType !== 'all') params.set('type', activeType);

  const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
  window.history.replaceState({}, '', newUrl);
}

function renderGrid() {
  const grid = document.getElementById('marketplace-grid');
  const countBadge = document.getElementById('marketplace-count');
  if (!grid) return;

  const filtered = PROPERTIES.filter(item => {
    const matchZone = activeZone === 'all' || item.zone === activeZone;
    const matchType = activeType === 'all' || item.type === activeType;
    return matchZone && matchType;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Activo Encontrado' : 'Activos Encontrados'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--c-card-bg); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
        <p style="color: var(--c-text-muted); font-size: 1.1rem; margin-bottom: 1rem;">
          No hay activos que coincidan exactamente con esta combinación de zona y tipo.
        </p>
        <button class="btn btn-gold" id="grid-reset-btn" style="padding: 0.8rem 1.6rem;">
          <span>Ver Todas las Propiedades</span>
        </button>
      </div>
    `;

    document.getElementById('grid-reset-btn')?.addEventListener('click', () => {
      document.getElementById('btn-reset-filters')?.click();
    });
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const itemWaMessage = encodeURIComponent(
      `Estoy interesado en invertir en la Isla de Margarita.\nQuisiera consultar sobre la propiedad: ${item.title} (${item.zoneName}) - ${item.price}`
    );
    const waLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${itemWaMessage}`;

    return `
      <article class="property-card" data-id="${item.id}">
        <div class="property-img-wrap">
          <img src="${item.image}" alt="${item.title}" class="property-img" loading="lazy">
          <span class="property-badge-zone">📍 ${item.zoneName}</span>
          <span class="property-badge-status status-${item.status}">${item.statusText}</span>
        </div>
        <div class="property-body">
          <div class="property-type-tag">${item.typeName}</div>
          <h3 class="property-title">${item.title}</h3>
          <p class="property-desc">${item.desc}</p>
          
          <div class="property-specs">
            ${item.specs.map(spec => `<span class="spec-item">${spec}</span>`).join('')}
          </div>

          <div class="property-footer">
            <div class="price-box">
              <span>Inversión</span>
              <strong>${item.price}</strong>
            </div>
            
            <a href="${waLink}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-whatsapp-prop" 
               title="Consultar por WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function initGoogleFormsModal() {
  const modal = document.getElementById('modal-google-forms');
  const closeBtn = document.getElementById('close-google-forms-modal');
  const openBtns = document.querySelectorAll('.btn-open-google-form');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}
