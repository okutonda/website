/**
 * OKENDA.EDU — Main JavaScript
 * Funcionalidades: Navbar sticky, scroll suave, animações, contadores, formulário, modal, back to top
 */

'use strict';

/* =============================================
   DOM READY
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initFormValidation();
  initBackToTop();
  initDashboardTabs();
  initDashboardModal();
  initSmoothScroll();
});

/* =============================================
   NAVBAR STICKY COM EFEITO DE SCROLL
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // checar estado inicial

  // Fechar navbar mobile ao clicar em link
  const navLinks = navbar.querySelectorAll('.nav-link');
  const navbarCollapse = navbar.querySelector('.navbar-collapse');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const toggler = navbar.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }
    });
  });
}

/* =============================================
   SCROLL SUAVE PARA ÂNCORAS
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura da navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* =============================================
   ANIMAÇÕES AO SCROLL (Intersection Observer)
   ============================================= */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up, .fade-in, .scale-in');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Não observar mais após animar
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   CONTADORES ANIMADOS
   ============================================= */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-counter'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 1800; // ms
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

/* =============================================
   TABS DO DASHBOARD
   ============================================= */
function initDashboardTabs() {
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  const screens = document.querySelectorAll('.dash-screen-item');
  const preview = document.querySelector('.dashboard-preview[data-modal-trigger]');

  if (!tabBtns.length) return;

  const titles = {
    overview: 'Dashboard — Visão Geral',
    academico: 'Gestão Académica',
    financeiro: 'Gestão Financeira',
    aluno: 'Portal do Aluno',
    professor: 'Portal do Professor',
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      screens.forEach(s => {
        s.style.display = s.getAttribute('data-screen') === target ? 'block' : 'none';
      });

      // Actualiza o título do modal conforme o tab activo
      if (preview) {
        preview.setAttribute('data-title', titles[target] || 'Dashboard');
      }
    });
  });
}

/* =============================================
   MODAL DE IMAGENS DO DASHBOARD
   ============================================= */
function initDashboardModal() {
  const preview = document.querySelector('[data-modal-trigger]');
  const modal = document.getElementById('dashboardModal');
  const modalImg = document.getElementById('modalDashImg');
  const modalLabel = document.getElementById('dashboardModalLabel');

  if (!preview || !modal) return;

  preview.addEventListener('click', () => {
    // Pega o screen visível
    const activeScreen = preview.querySelector('.dash-screen-item:not([style*="display: none"]):not([style*="display:none"])');
    const img = activeScreen ? activeScreen.querySelector('img') : null;

    if (modalImg) {
      modalImg.src = img ? img.src : '';
      modalImg.alt = img ? img.alt : 'Preview';
    }

    if (modalLabel) {
      modalLabel.textContent = preview.getAttribute('data-title') || 'Dashboard';
    }

    new bootstrap.Modal(modal).show();
  });
}

/* =============================================
   VALIDAÇÃO DO FORMULÁRIO
   ============================================= */
function initFormValidation() {
  const form = document.getElementById('demoForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Limpar alertas anteriores
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    let isValid = true;

    // Validar campos obrigatórios
    const required = form.querySelectorAll('[required]');
    required.forEach(field => {
      const val = field.value.trim();

      if (!val) {
        setInvalid(field, 'Este campo é obrigatório.');
        isValid = false;
        return;
      }

      // Validação específica por tipo
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          setInvalid(field, 'Insira um e-mail válido.');
          isValid = false;
        }
      }

      if (field.type === 'tel') {
        const telRegex = /^\+?[\d\s\-()]{9,15}$/;
        if (!telRegex.test(val)) {
          setInvalid(field, 'Insira um telefone válido.');
          isValid = false;
        }
      }
    });

    if (isValid) {
      showSuccessMessage(form);
    }
  });

  // Limpar erro ao digitar
  form.querySelectorAll('.form-control, .form-select').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      const fb = field.nextElementSibling;
      if (fb && fb.classList.contains('invalid-feedback')) fb.textContent = '';
    });
  });
}

function setInvalid(field, msg) {
  field.classList.add('is-invalid');
  let fb = field.nextElementSibling;
  if (!fb || !fb.classList.contains('invalid-feedback')) {
    fb = document.createElement('div');
    fb.className = 'invalid-feedback';
    field.parentNode.insertBefore(fb, field.nextSibling);
  }
  fb.textContent = msg;
}

function showSuccessMessage(form) {
  const existing = form.querySelector('.form-success');
  if (existing) existing.remove();

  const success = document.createElement('div');
  success.className = 'form-success alert alert-success border-0 rounded-3 d-flex align-items-center gap-3 mt-4';
  success.innerHTML = `
    <i class="bi bi-check-circle-fill fs-4"></i>
    <div>
      <strong>Pedido enviado com sucesso!</strong><br>
      <small>A nossa equipa entrará em contacto em até 24 horas.</small>
    </div>
  `;

  form.appendChild(success);
  form.reset();

  // Fazer scroll suave para a mensagem
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Remover após 8 segundos
  setTimeout(() => {
    success.style.opacity = '0';
    success.style.transition = '.4s';
    setTimeout(() => success.remove(), 400);
  }, 8000);
}

/* =============================================
   BOTÃO VOLTAR AO TOPO
   ============================================= */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
