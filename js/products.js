// products.js - populates products and showcase demo content, uses localStorage for last category

const PRODUCTS = [
  {
    id: 'x7',
    name: 'SkyVision X7',
    type: 'pro',
    desc: '8K stabilized camera, 40 min flight, advanced obstacle avoidance.',
    img: 'assets/images/x7.png',
    highlights: ['8K', '40 min', 'Obstacle Avoidance'],
    price: '$7,999'
  },
  {
    id: 'x5',
    name: 'SkyVision X5',
    type: 'prosumer',
    desc: 'High-quality 4K capture for prosumers and indie filmmakers.',
    img: 'assets/images/x5.png',
    highlights: ['4K', '30 min', 'Compact'],
    price: '$3,499'
  },
  {
    id: 'mini',
    name: 'SkyVision Mini',
    type: 'mini',
    desc: 'Lightweight and portable for quick aerial shots.',
    img: 'assets/images/mini.png',
    highlights: ['HD', '20 min', 'Foldable'],
    price: '$999'
  },
  {
    id: 'enterprise',
    name: 'SkyVision Enterprise',
    type: 'enterprise',
    desc: 'Long-range, heavy-lift platform for mapping and inspections.',
    img: 'assets/images/enterprise.png',
    highlights: ['Mapping', 'Long-range', 'Payload'],
    price: '$14,999'
  },
  {
    id: 'accessory',
    name: 'Pro Gimbal Kit',
    type: 'accessory',
    desc: 'Precision gimbal and lens kit for cinematic stabilization.',
    img: 'assets/images/gimbal.png',
    highlights: ['Gimbal', 'Lens', 'Accessory'],
    price: '$499'
  },
  {
    id: 'case',
    name: 'SkyVision Protective Case',
    type: 'case',
    desc: 'Rugged, weather-resistant carrying case sized for SkyVision drones and accessories.',
    img: 'assets/images/case.png',
    highlights: ['Rugged', 'Weather-resistant', 'Foam Insert'],
    price: '$149'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  renderShowcase();
  attachFilterHandlers();
});

function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const list = PRODUCTS.filter(p => filter === 'all' ? true : p.type === filter);
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" style="width:100%;height:180px;object-fit:cover">
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="specs">${p.highlights.join(' • ')}</div>
        <div style="margin-top:12px">
          <a class="btn primary" href="store.html?product=${p.id}">Buy</a>
          <button class="btn" data-id="${p.id}" aria-label="Quick view ${p.name}">Quick view</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // attach quick view handlers (opens modal)
  grid.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const product = PRODUCTS.find(x => x.id === id);
      if (product) {
        showQuickView(product);
      }
    });
  });
}

// Quick View modal helpers
function ensureQuickViewModal() {
  if (document.getElementById('quickViewModal')) return;
  const modal = document.createElement('div');
  modal.id = 'quickViewModal';
  modal.className = 'quickview-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="quickview-dialog" role="document">
      <button class="quickview-close btn ghost" aria-label="Close quick view">✕</button>
      <div class="quickview-inner">
        <div class="quickview-media"><img src="" alt="" /></div>
        <div class="quickview-body">
          <h3 class="quickview-title"></h3>
          <div class="quickview-price"></div>
          <p class="quickview-desc"></p>
          <ul class="quickview-highlights"></ul>
          <div class="quickview-actions"><a class="btn primary" href="#">Buy</a></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // events
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideQuickView();
  });
  const close = modal.querySelector('.quickview-close');
  close.addEventListener('click', hideQuickView);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) hideQuickView();
  });
}

function showQuickView(product) {
  ensureQuickViewModal();
  const modal = document.getElementById('quickViewModal');
  const img = modal.querySelector('.quickview-media img');
  const title = modal.querySelector('.quickview-title');
  const desc = modal.querySelector('.quickview-desc');
  const highlights = modal.querySelector('.quickview-highlights');
  const price = modal.querySelector('.quickview-price');
  const buy = modal.querySelector('.quickview-actions .btn.primary');

  img.src = product.img || '';
  img.alt = product.name;
  title.textContent = product.name;
  desc.textContent = product.desc;
  price.textContent = product.price ? product.price : '';
  highlights.innerHTML = '';
  (product.highlights || []).forEach(h => {
    const li = document.createElement('li'); li.textContent = h; highlights.appendChild(li);
  });
  buy.setAttribute('href', `store.html?product=${product.id}`);

  modal.classList.add('open');
  // focus close button for accessibility
  const close = modal.querySelector('.quickview-close');
  close.focus();
}

function hideQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  modal.classList.remove('open');
}

function renderShowcase() {
  const showcase = document.getElementById('showcaseGrid');
  if (!showcase) return;
  showcase.innerHTML = '';

  // Single rotating showcase: one large image + caption that cycles through PRODUCTS
  const container = document.createElement('div');
  container.className = 'showcase-single card';

  const img = document.createElement('img');
  img.className = 'showcase-img';
  img.src = PRODUCTS.length ? PRODUCTS[0].img : '';
  img.alt = PRODUCTS.length ? PRODUCTS[0].name : '';
  container.appendChild(img);

  const caption = document.createElement('div');
  caption.className = 'showcase-caption';
  caption.textContent = PRODUCTS.length ? PRODUCTS[0].name : '';
  container.appendChild(caption);

  // controls (Prev / Next)
  const controls = document.createElement('div');
  controls.className = 'showcase-controls';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn ghost showcase-prev';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous showcase item');
  prevBtn.textContent = '◀';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn ghost showcase-next';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next showcase item');
  nextBtn.textContent = '▶';

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  container.appendChild(controls);

  showcase.appendChild(container);

  // preload images
  if (window._jciPreloadedShowcaseImages !== true) {
    PRODUCTS.forEach(p => {
      const im = new Image();
      im.src = p.img;
    });
    window._jciPreloadedShowcaseImages = true;
  }

  // clear existing interval if present
  if (window._jciShowcaseInterval) {
    clearInterval(window._jciShowcaseInterval);
  }

  let idx = 0;

  function showAt(i) {
    if (!PRODUCTS.length) return;
    idx = (i + PRODUCTS.length) % PRODUCTS.length;
    img.src = PRODUCTS[idx].img;
    img.alt = PRODUCTS[idx].name;
    caption.textContent = PRODUCTS[idx].name;
  }

  function next() { showAt(idx + 1); }
  function prev() { showAt(idx - 1); }

  // auto-advance with restart-on-interaction
  function startInterval() {
    if (window._jciShowcaseInterval) clearInterval(window._jciShowcaseInterval);
    window._jciShowcaseInterval = setInterval(next, 4000);
  }

  nextBtn.addEventListener('click', () => { next(); startInterval(); });
  prevBtn.addEventListener('click', () => { prev(); startInterval(); });

  // keyboard support
  prevBtn.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') { prev(); startInterval(); } });
  nextBtn.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') { next(); startInterval(); } });

  startInterval();
}

function attachFilterHandlers() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      localStorage.setItem('jci-last-filter', filter);
      renderProducts(filter);
    });
  });

  // restore last filter
  const last = localStorage.getItem('jci-last-filter') || 'all';
  const activeChip = document.querySelector(`.chip[data-filter="${last}"]`);
  if (activeChip) {
    activeChip.classList.add('active');
    renderProducts(last);
  }
}

