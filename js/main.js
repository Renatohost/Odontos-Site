const WHATSAPP_NUMBER = '5581994711673';

document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initCounters();
  initTabs();
  initForms();
});

function initHeader() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', function () {
    mobileNav.classList.toggle('active');
    const spans = toggle.querySelectorAll('span');
    if (mobileNav.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('active');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

function animateCounter(el, target, suffix) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(function () {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-tab');

      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabContents.forEach(function (c) { c.classList.remove('active'); });

      this.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
}

function initForms() {
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const type = this.getAttribute('data-form');
      sendToWhatsApp(type, this);
    });
  });
}

function sendToWhatsApp(type, form) {
  const data = getFormData(form);
  const message = buildMessage(type, data);
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank');
}

function getFormData(form) {
  const data = {};
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    if (field.name) {
      data[field.name] = field.value;
    }
  });
  return data;
}

function buildMessage(type, data) {
  const lines = [];
  const header = {
    'chamado': '🔧 CHAMADO TÉCNICO',
    'preco': '💰 SOLICITAÇÃO DE PREÇO',
    'assistencia': '🛠️ ASSISTÊNCIA TÉCNICA',
    'contato': '📩 MENSAGEM'
  };

  lines.push(header[type] || '📩 NOVA MENSAGEM');
  lines.push('');

  if (data.nome) lines.push('Nome: ' + data.nome);
  if (data.empresa) lines.push('Empresa: ' + data.empresa);
  if (data.telefone) lines.push('Telefone: ' + data.telefone);
  if (data.email) lines.push('E-mail: ' + data.email);

  if (type === 'chamado') {
    lines.push('');
    lines.push('Tipo: ' + (data.tipo || 'Não informado'));
    lines.push('Equipamento: ' + (data.equipamento || 'Não informado'));
    lines.push('Marca: ' + (data.marca || 'Não informado'));
    lines.push('Prioridade: ' + (data.prioridade || 'Não informado'));
    lines.push('');
    lines.push('Descrição do problema:');
    lines.push(data.descricao || 'Não informado');
  }

  if (type === 'preco') {
    lines.push('');
    lines.push('Serviço: ' + (data.servico || 'Não informado'));
    lines.push('Equipamento: ' + (data.equipamento || 'Não informado'));
    lines.push('');
    lines.push('Detalhes:');
    lines.push(data.descricao || 'Não informado');
  }

  if (type === 'assistencia') {
    lines.push('');
    lines.push('Tipo de assistência: ' + (data.tipo || 'Não informado'));
    lines.push('Marca: ' + (data.marca || 'Não informado'));
    lines.push('Modelo: ' + (data.modelo || 'Não informado'));
    lines.push('');
    lines.push('Descrição:');
    lines.push(data.descricao || 'Não informado');
  }

  if (type === 'contato') {
    lines.push('');
    lines.push('Assunto: ' + (data.assunto || 'Não informado'));
    lines.push('');
    lines.push('Mensagem:');
    lines.push(data.mensagem || 'Não informado');
  }

  return lines.join('\n');
}
