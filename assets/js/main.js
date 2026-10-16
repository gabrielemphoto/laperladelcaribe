/**
 * LA PERLA DEL CARIBE - INVERSIONES
 * Main JavaScript (Interactividad, Calculadora ROI, Formulario, Navegación)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRoiCalculator();
  initFaqAccordion();
  initContactForm();
  initSmoothScroll();
});

/* ================= 1. Navbar Scroll & Mobile Menu ================= */
function initNavbar() {
  const header = document.querySelector('.header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Sticky header blur effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ================= 2. Calculadora de Retorno de Inversión (ROI) ================= */
function initRoiCalculator() {
  const amountSlider = document.getElementById('roi-amount');
  const yearsSlider = document.getElementById('roi-years');
  const typeSelect = document.getElementById('roi-type');

  const amountDisplay = document.getElementById('roi-amount-val');
  const yearsDisplay = document.getElementById('roi-years-val');
  const totalReturnDisplay = document.getElementById('roi-total-return');
  const monthlyEstDisplay = document.getElementById('roi-monthly-income');
  const rateDisplay = document.getElementById('roi-rate-display');

  if (!amountSlider || !yearsSlider) return;

  // Tasas estimadas según tipo de inversión en Margarita
  const rates = {
    vacacional: 0.16,  // 16% anual (Rentas cortas / Airbnb en Pampatar y Playa El Yaque)
    plusvalia: 0.14,   // 14% anual (Preventa y revalorización de m²)
    boutique: 0.20     // 20% anual (Hospitality & Participación hotelera)
  };

  function formatCurrency(val) {
    return '$' + Math.round(val).toLocaleString('en-US');
  }

  function updateCalculation() {
    const principal = parseFloat(amountSlider.value);
    const years = parseInt(yearsSlider.value, 10);
    const type = typeSelect ? typeSelect.value : 'vacacional';
    const rate = rates[type] || 0.16;

    // Actualizar etiquetas
    if (amountDisplay) amountDisplay.textContent = formatCurrency(principal);
    if (yearsDisplay) yearsDisplay.textContent = `${years} ${years === 1 ? 'Año' : 'Años'}`;
    if (rateDisplay) rateDisplay.textContent = `${(rate * 100).toFixed(0)}% anual est.`;

    // Cálculo con interés compuesto anual
    const finalAmount = principal * Math.pow(1 + rate, years);
    const totalProfit = finalAmount - principal;
    const monthlyIncome = (principal * rate) / 12;

    if (totalReturnDisplay) {
      totalReturnDisplay.textContent = formatCurrency(finalAmount);
    }
    if (monthlyEstDisplay) {
      monthlyEstDisplay.textContent = formatCurrency(monthlyIncome) + '/mes';
    }
  }

  amountSlider.addEventListener('input', updateCalculation);
  yearsSlider.addEventListener('input', updateCalculation);
  if (typeSelect) typeSelect.addEventListener('change', updateCalculation);

  // Ejecución inicial
  updateCalculation();
}

/* ================= 3. FAQ Accordion ================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cerrar otros
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Alternar actual
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ================= 4. Contact Form Handling ================= */
function initContactForm() {
  const form = document.getElementById('investor-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const budget = form.querySelector('[name="budget"]')?.value || '';
    const interest = form.querySelector('[name="interest"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    // Armar mensaje directo para WhatsApp comercial
    const whatsappNumber = '584120000000'; // Número a configurar
    const text = encodeURIComponent(
      `*Hola, deseo información sobre Inversiones en Isla de Margarita - La Perla del Caribe*\n\n` +
      `*Nombre:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Teléfono:* ${phone}\n` +
      `*Presupuesto Estimado:* ${budget}\n` +
      `*Área de Interés:* ${interest}\n` +
      `*Mensaje:* ${message}`
    );

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`;

    // Mostrar feedback al usuario
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '✓ ¡Datos listos! Redirigiendo a WhatsApp...';
      submitBtn.style.background = '#22c55e';
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        form.reset();
      }, 1000);
    }
  });
}

/* ================= 5. Smooth Scroll para enlaces internos ================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
