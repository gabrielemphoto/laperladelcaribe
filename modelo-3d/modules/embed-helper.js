/**
 * Módulo de Asistencia para Incrustación Web y Utilidades
 * Soporta parámetros de URL para iframes, generador de código de inserción,
 * capturas de pantalla HD y pantalla completa.
 */

export class EmbedHelper {
  constructor(app) {
    this.app = app;
    this.parseURLParams();
    this.setupEmbedModal();
  }

  parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Fase inicial (?phase=0, ?phase=1, ?phase=2)
    if (params.has('phase')) {
      const p = parseInt(params.get('phase'), 10);
      if (!isNaN(p) && p >= 0 && p <= 2) {
        this.app.initialPhase = p;
      }
    }

    // Modo Incrustado / Iframe (?embed=true o ?mode=embed)
    if (params.get('embed') === 'true' || params.get('mode') === 'embed') {
      document.body.classList.add('embed-mode');
    }

    // Modo de Iluminación (?time=day|sunset|night)
    if (params.has('time')) {
      this.app.initialTime = params.get('time');
    }

    // Auto-rotación (?autorotate=true)
    if (params.get('autorotate') === 'true') {
      this.app.initialAutoRotate = true;
    }
  }

  setupEmbedModal() {
    const modal = document.getElementById('embed-modal');
    const openBtn = document.getElementById('btn-open-embed');
    const closeBtn = document.getElementById('btn-close-embed');
    const copyBtn = document.getElementById('btn-copy-embed');
    const embedCodeTextarea = document.getElementById('embed-code-textarea');

    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        this.updateEmbedSnippet();
        modal.classList.add('active');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    if (copyBtn && embedCodeTextarea) {
      copyBtn.addEventListener('click', () => {
        embedCodeTextarea.select();
        navigator.clipboard.writeText(embedCodeTextarea.value).then(() => {
          copyBtn.textContent = '¡Copiado con Éxito!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = 'Copiar Código HTML';
            copyBtn.classList.remove('copied');
          }, 2500);
        });
      });
    }

    // Cambio dinámico de opciones de embed (ancho, alto, controles)
    const optRadios = modal.querySelectorAll('input[name="embed-variant"]');
    optRadios.forEach(radio => {
      radio.addEventListener('change', () => this.updateEmbedSnippet());
    });
  }

  updateEmbedSnippet() {
    const textarea = document.getElementById('embed-code-textarea');
    if (!textarea) return;

    const currentOrigin = window.location.origin;
    const currentPath = window.location.pathname.replace(/\/+$/, '');
    const currentPhase = this.app.currentPhase || 0;

    const selectedOption = document.querySelector('input[name="embed-variant"]:checked')?.value || 'responsive';

    let iframeCode = '';
    if (selectedOption === 'responsive') {
      iframeCode = `<!-- Visor 3D Interactivo La Perla del Caribe -->
<div style="position: relative; width: 100%; max-width: 1200px; height: 650px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.18);">
  <iframe 
    src="${currentOrigin}${currentPath}/?phase=${currentPhase}&embed=true" 
    width="100%" 
    height="100%" 
    style="border: none;" 
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    loading="lazy"
    title="Modelo 3D Interactivo - La Perla del Caribe">
  </iframe>
</div>`;
    } else {
      iframeCode = `<iframe 
  src="${currentOrigin}${currentPath}/?phase=${currentPhase}&embed=true" 
  width="100%" 
  height="600" 
  style="border: 1px solid rgba(255,255,255,0.2); border-radius: 16px;" 
  allow="fullscreen">
</iframe>`;
    }

    textarea.value = iframeCode;
  }

  captureScreenshot(renderer, scene, camera) {
    renderer.render(scene, camera);
    const dataURL = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    const phaseNames = ['terreno-virgen', 'cabana-modular', 'resort-boutique'];
    const pName = phaseNames[this.app.currentPhase] || 'modelo-3d';
    link.download = `la-perla-del-caribe-${pName}.png`;
    link.href = dataURL;
    link.click();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }
}
