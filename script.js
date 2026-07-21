// ===================== ADMIN DATA =====================
// Загружаем данные из localStorage (если админка сохранила)
function loadAdminData() {
  const saved = localStorage.getItem('orchidAdminData');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {
      console.error('Ошибка загрузки admin данных', e);
    }
  }
  return null;
}

let adminData = loadAdminData();

// ===================== DEFAULT PRODUCT DATA =====================
const defaultProducts = [
  {id: 1, name: 'Букет из 15 роз', category: 'bouquets', price: 85, popular: true, desc: 'Нежный букет из 15 свежих роз'},
  {id: 2, name: 'Орхидея в горшке', category: 'compositions', price: 65, popular: true, desc: 'Живая орхидея фаленопсис'},
  {id: 3, name: 'Композиция в коробке', category: 'compositions', price: 120, popular: true, desc: 'Розы и эустома в коробке'},
  {id: 4, name: 'Букет из лент', category: 'ribbons', price: 45, popular: true, desc: 'Ручная работа из лент'},
  {id: 5, name: 'Мишка с розами', category: 'toys', price: 95, popular: false, desc: 'Плюшевый мишка + 7 роз'},
  {id: 6, name: 'Шары с гелием', category: 'balloons', price: 35, popular: false, desc: '5 гелевых шаров'},
  {id: 7, name: 'Открытка', category: 'cards', price: 12, popular: false, desc: 'Ручная работа'},
  {id: 8, name: '25 тюльпанов', category: 'bouquets', price: 110, popular: false, desc: 'Весенний букет'}
];

// Получаем актуальные продукты (из админки или дефолт)
function getProducts() {
  if (adminData && adminData.products) {
    return adminData.products;
  }
  return defaultProducts;
}

const products = getProducts();

// ===================== APPLY ADMIN SETTINGS =====================
function applyAdminSettings() {
  if (!adminData) return;

  // Hero section
  if (adminData.site) {
    const s = adminData.site;
    const titleEl = document.querySelector('.hero-title');
    if (titleEl && s.heroTitle1 && s.heroTitle2) {
      titleEl.innerHTML = `<span class="title-line">${escapeHtml(s.heroTitle1)}</span><span class="title-line accent">${escapeHtml(s.heroTitle2)}</span>`;
    }

    const subtitleEl = document.querySelector('.hero-subtitle');
    if (subtitleEl && s.heroSubtitle) subtitleEl.textContent = s.heroSubtitle;

    const badgeEl = document.querySelector('.hero-badge');
    if (badgeEl && s.heroBadge) {
      badgeEl.innerHTML = `<span class="badge-dot"></span> ${escapeHtml(s.heroBadge)}`;
    }

    const btnEl = document.querySelector('.hero-buttons .btn-primary');
    if (btnEl && s.heroBtnCatalog) btnEl.textContent = s.heroBtnCatalog;

    // Features
    if (s.heroFeatures) {
      const featuresContainer = document.querySelector('.hero-features');
      if (featuresContainer) {
        const features = s.heroFeatures.split(',').map(f => f.trim()).filter(f => f);
        featuresContainer.innerHTML = features.map(f => `<div class="feature">${escapeHtml(f)}</div>`).join('');
      }
    }

    // Categories
    if (s.categories && s.categories.length) {
      const catGrid = document.querySelector('.categories-grid');
      if (catGrid) {
        catGrid.innerHTML = s.categories.map(cat => `
          <div class="category-card">
            <div class="category-image">${cat.icon || '🌸'}</div>
            <div class="category-info">
              <h3>${escapeHtml(cat.name)}</h3>
              <p>${escapeHtml(cat.desc)}</p>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // Contacts
  if (adminData.contacts) {
    const c = adminData.contacts;

    // Address
    const addrVal = document.querySelector('.contact-item:nth-child(1) .contact-value');
    if (addrVal && c.address) addrVal.textContent = c.address;

    // Phone
    const phoneLink = document.querySelector('a[href^="tel:"]');
    const phoneVal = document.querySelector('.contact-item:nth-child(2) .contact-value');
    if (phoneLink && c.rawPhone) phoneLink.href = 'tel:+' + c.rawPhone;
    if (phoneVal && c.phone) phoneVal.textContent = c.phone;

    // Email
    const emailLink = document.querySelector('a[href^="mailto:"]');
    const emailVal = document.querySelector('.contact-item:nth-child(3) .contact-value');
    if (emailLink && c.email) emailLink.href = 'mailto:' + c.email;
    if (emailVal && c.email) emailVal.textContent = c.email;

    // Hours
    const hoursVal = document.querySelector('.contact-item:nth-child(4) .contact-value');
    if (hoursVal && c.hours) hoursVal.textContent = c.hours;

    // WhatsApp
    const waLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    waLinks.forEach(link => {
      if (c.rawPhone) link.href = 'https://wa.me/' + c.rawPhone;
    });

    // Instagram
    const igLink = document.querySelector('a[href*="instagram.com"]');
    if (igLink && c.instagram) igLink.href = 'https://www.instagram.com/' + c.instagram;

    // Map
    const mapLink = document.querySelector('.map-placeholder a');
    if (mapLink && c.mapUrl) mapLink.href = c.mapUrl;

    // Footer
    const footerAddr = document.querySelector('.footer-contact p:nth-child(2)');
    const footerHours = document.querySelector('.footer-contact p:nth-child(3)');
    const footerPhone = document.querySelector('.footer-contact a[href^="tel:"]');
    if (footerAddr && c.address) footerAddr.textContent = c.address;
    if (footerHours && c.hours) footerHours.textContent = c.hours;
    if (footerPhone && c.phone) {
      footerPhone.textContent = c.phone;
      if (c.rawPhone) footerPhone.href = 'tel:+' + c.rawPhone;
    }
  }

  // About
  if (adminData.about) {
    const a = adminData.about;
    const aboutTitle = document.querySelector('.about-content .section-title');
    if (aboutTitle && a.title) aboutTitle.textContent = a.title;

    const aboutText = document.querySelector('.about-text');
    if (aboutText && a.desc) aboutText.textContent = a.desc;

    if (a.stats && a.stats.length >= 3) {
      const statNums = document.querySelectorAll('.stat-number');
      const statLabels = document.querySelectorAll('.stat-label');
      a.stats.forEach((s, i) => {
        if (statNums[i] && s.num) statNums[i].textContent = s.num;
        if (statLabels[i] && s.label) statLabels[i].textContent = s.label;
      });
    }

    if (a.badge) {
      const badgeNum = document.querySelector('.badge-number');
      const badgeText = document.querySelector('.badge-text');
      if (badgeNum && a.badge.num) badgeNum.textContent = a.badge.num;
      if (badgeText && a.badge.text) badgeText.textContent = a.badge.text;
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

let cart = [];

// DOM Elements
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const scrollTop = document.getElementById('scrollTop');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const totalPrice = document.getElementById('totalPrice');
const productsGrid = document.getElementById('productsGrid');

// ========== BURGER MENU (OPTIMIZED) ==========

// Toggle menu on burger click
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

// Close menu on scroll
window.addEventListener('scroll', () => {
  if (navLinks.classList.contains('open')) {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

// ========== PRODUCTS ==========

function renderProducts() {
  const popular = products.filter(p => p.popular);
  productsGrid.innerHTML = popular.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        ${getProductIcon(p.category)}
        <span class="product-badge">Хит</span>
      </div>
      <div class="product-info">
        <span class="product-category">${getCategoryName(p.category)}</span>
        <h3 class="product-name">${p.name}</h3>
        <span class="product-price">${p.price} BYN</span>
      </div>
    </div>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      addToCart(id);
    });
  });
}

function getProductIcon(cat) {
  const icons = {
    bouquets: '🌹', compositions: '🎁', balloons: '🎈',
    toys: '🧸', cards: '💌', ribbons: '🎀'
  };
  return `<div style="font-size:48px">${icons[cat] || '🌸'}</div>`;
}

function getCategoryName(cat) {
  const names = {
    bouquets: 'Букеты', compositions: 'Композиции', balloons: 'Шары',
    toys: 'Игрушки', cards: 'Открытки', ribbons: 'Букеты из лент'
  };
  return names[cat] || cat;
}

// ========== CART ==========

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({...product, qty: 1});
  }
  updateCart();
  showCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
  totalPrice.textContent = total + ' BYN';

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'flex';
    cartFooter.style.display = 'flex';
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price} BYN x ${item.qty}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');
  }
}

function showCart() {
  cartModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideCart() {
  cartModal.classList.remove('active');
  document.body.style.overflow = '';
}

// ========== EVENT LISTENERS ==========

cartBtn.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) hideCart();
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    scrollTop.classList.add('visible');
  } else {
    scrollTop.classList.remove('visible');
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
});

scrollTop.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  });
});

// Category cards click
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    window.location.href = '#catalog';
  });
});

// ========== AUTO-REFRESH FROM ADMIN ==========
// Проверяем обновления от админки каждые 2 секунды
setInterval(() => {
  const updated = localStorage.getItem('orchidDataUpdated');
  if (updated) {
    const lastCheck = window._lastAdminUpdate || 0;
    if (parseInt(updated) > lastCheck) {
      window._lastAdminUpdate = parseInt(updated);
      location.reload();
    }
  }
}, 2000);

// ========== INIT ==========
applyAdminSettings();
renderProducts();
console.log('Орхидея — Цветочный магазин. Сайт загружен.');
