// Modern frontend script with graceful error handling and lazy loading
const hero = document.getElementById('hero');
const menuDiv = document.getElementById('menu');
const siteTitle = document.getElementById('siteTitle');
const aboutText = document.getElementById('aboutText');
const statusBar = document.getElementById('statusBar');
const refreshBtn = document.getElementById('refreshBtn');
const prevHero = document.getElementById('prevHero');
const nextHero = document.getElementById('nextHero');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

let heroImages = [];
let heroIndex = 0;
let heroTimer = null;

const TIMEOUT = 10000; // ms

function setStatus(text, isError = false) {
  statusBar.textContent = text || '';
  statusBar.style.color = isError ? '#ff9b9b' : '';
}

function formatPrice(n) {
  try {
    return new Intl.NumberFormat('fa-IR').format(n) + ' تومان';
  } catch {
    return n + ' تومان';
  }
}

function safeHTML(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function startHeroRotation() {
  if (heroTimer) clearInterval(heroTimer);
  if (!heroImages || !heroImages.length) return;
  hero.style.backgroundImage = `url(${heroImages[heroIndex]})`;
  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroImages.length;
    hero.style.backgroundImage = `url(${heroImages[heroIndex]})`;
  }, 3500);
}

function showHeroImage(index) {
  if (!heroImages.length) return;
  heroIndex = (index + heroImages.length) % heroImages.length;
  hero.style.backgroundImage = `url(${heroImages[heroIndex]})`;
}

prevHero?.addEventListener('click', () => { showHeroImage(heroIndex - 1); });
nextHero?.addEventListener('click', () => { showHeroImage(heroIndex + 1); });

refreshBtn?.addEventListener('click', () => {
  load(true);
});

// fetch with timeout
async function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function createSkeletonCards(count = 6) {
  menuDiv.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'card';
    s.innerHTML = `<div class="thumb skeleton"></div><div style="height:12px;margin-top:12px" class="skeleton"></div><div style="height:10px;margin-top:8px;width:60%" class="skeleton"></div>`;
    menuDiv.appendChild(s);
  }
}

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  const imgUrl = item.image || '';
  card.innerHTML = `
    <div class="thumb">
      <img loading="lazy" src="${safeHTML(imgUrl)}" alt="${safeHTML(item.name || 'تصویر')}" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22120%22><rect width=%22200%22 height=%22120%22 fill=%22%23111%22/></svg>'" />
    </div>
    <h3>${safeHTML(item.name || 'بدون نام')}</h3>
    <p>${safeHTML(item.description || '')}</p>
    <span class="price">${formatPrice(item.price || 0)}</span>
  `;
  return card;
}

async function load(force = false) {
  setStatus('');
  createSkeletonCards(6);
  try {
    // parallel fetch
    const [settings, items] = await Promise.all([
      fetchWithTimeout('/api/settings'),
      fetchWithTimeout('/api/items')
    ]);

    // settings
    heroImages = Array.isArray(settings.heroImages) ? settings.heroImages.filter(Boolean) : [];
    siteTitle.textContent = settings.siteTitle || 'منوی حرفه‌ای';
    aboutText.textContent = settings.aboutText || 'بهترین غذاها در یک نگاه';

    if (heroImages.length) {
      startHeroRotation();
    } else {
      // fallback hero
      hero.style.backgroundImage = 'linear-gradient(120deg,#1b1b1f,#0f0f12)';
    }

    // items
    menuDiv.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
      menuDiv.innerHTML = `<div class="empty"><strong>منو خالی است</strong><p style="margin-top:8px;color:var(--muted)">فعلاً آیتمی ثبت نشده است. برای افزودن آیتم از پنل مدیریت استفاده کنید یا دکمه بارگذاری مجدد را بزنید.</p></div>`;
      setStatus('هیچ آیتمی برای نمایش وجود ندارد');
      return;
    }

    // render items with lazy image observer
    const fragment = document.createDocumentFragment();
    items.forEach(it => fragment.appendChild(createCard(it)));
    menuDiv.appendChild(fragment);

    setStatus(`نمایش ${items.length} آیتم`);
  } catch (err) {
    console.error(err);
    menuDiv.innerHTML = `<div class="empty"><strong>خطا در بارگذاری</strong><p style="margin-top:8px;color:var(--muted)">اتصال به سرور برقرار نشد یا داده‌ای موجود نیست. لطفاً بعداً تلاش کنید.</p></div>`;
    setStatus('خطا در بارگذاری داده‌ها', true);
  }
}

// initial load
document.addEventListener('DOMContentLoaded', () => load());
