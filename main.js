/* Nav scroll shadow */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });

/* Hamburger */
const ham = document.getElementById('ham');
const mob = document.getElementById('nav-mobile');
ham.addEventListener('click', () => {
  const open = mob.classList.toggle('open');
  ham.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', open);
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mob.classList.remove('open');
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded', false);
}));

/* Nav dropdown — click/touch toggle + close on outside click */
const navDd = document.querySelector('.nav-dd');
const navDdToggle = document.querySelector('.nav-dd-toggle');
if (navDd && navDdToggle) {
  navDdToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navDd.classList.toggle('open');
    navDdToggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!navDd.contains(e.target)) {
      navDd.classList.remove('open');
      navDdToggle.setAttribute('aria-expanded', false);
    }
  });
}

/* Scroll reveal */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* Counter animation */
function runCounter(el, target, suffix, duration) {
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const credStat = document.getElementById('cred-stat');
if (credStat) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { runCounter(credStat, 10000, '+', 1400); counterObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counterObs.observe(credStat);
}

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id], div[id="trust"]');
const navAs = document.querySelectorAll('.nav-links a');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => activeObs.observe(s));

/* Form validation */
const form = document.getElementById('est-form');
const submitBtn = document.getElementById('fsubmit');
if (form && submitBtn) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('f-name');
    const phone = document.getElementById('f-phone');
    let ok = true;
    [name, phone].forEach(f => {
      if (!f.value.trim()) {
        f.style.borderColor = 'var(--court-red)';
        f.style.boxShadow = '0 0 0 3px rgba(198,40,40,0.20)';
        ok = false;
      } else {
        f.style.borderColor = '';
        f.style.boxShadow = '';
      }
    });
    if (!ok) {
      (name.value.trim() ? phone : name).focus();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Request Sent ✓';
    form.reset();
  });
}

/* Sticky call bar — appears once user scrolls past the hero */
const stickyCall = document.getElementById('sticky-call');
const stickyCallClose = document.getElementById('sticky-call-close');
const heroSection = document.getElementById('hero');
if (stickyCall && stickyCallClose && heroSection) {
  let stickyCallDismissed = false;
  function updateStickyCall() {
    if (stickyCallDismissed) return;
    const show = window.scrollY > heroSection.offsetHeight - 120;
    stickyCall.classList.toggle('visible', show);
    stickyCall.setAttribute('aria-hidden', show ? 'false' : 'true');
  }
  window.addEventListener('scroll', updateStickyCall, { passive: true });
  window.addEventListener('resize', updateStickyCall);
  updateStickyCall();
  stickyCallClose.addEventListener('click', () => {
    stickyCallDismissed = true;
    stickyCall.classList.remove('visible');
    stickyCall.setAttribute('aria-hidden', 'true');
  });
}

/* Full gallery carousel — in-page, full-bleed */
const fgImages = [
  '20190621_164907.jpg', '20190621_170810.jpg', '20190718_115223.jpg',
  '20190724_134515.jpg', '20210514_131631.jpg', '20210827_151029.jpg',
  '20220527_144932.jpg', '20230607_135944.jpg', '20240808_142325.jpg',
  '20250531_104003.jpg'
];
const fgSection = document.getElementById('fullgallery');
const fgImg = document.getElementById('fg-img');
const fgCounter = document.getElementById('fg-counter');
const fgPrev = document.getElementById('fg-prev');
const fgNext = document.getElementById('fg-next');
if (fgSection && fgImg && fgCounter && fgPrev && fgNext) {
  let fgIndex = 0;
  let fgInView = false;

  function fgShow(i) {
    fgIndex = (i + fgImages.length) % fgImages.length;
    fgImg.classList.remove('loaded');
    const next = new Image();
    next.onload = () => {
      fgImg.src = next.src;
      fgImg.alt = `SafePlay Pro court installation — image ${fgIndex + 1} of ${fgImages.length}`;
      fgImg.classList.add('loaded');
    };
    next.src = `images/optimized/${fgImages[fgIndex]}`;
    fgCounter.textContent = `${fgIndex + 1} / ${fgImages.length}`;
  }
  fgPrev.addEventListener('click', () => fgShow(fgIndex - 1));
  fgNext.addEventListener('click', () => fgShow(fgIndex + 1));

  const fgViewObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { fgInView = e.isIntersecting; });
  }, { threshold: 0.35 });
  fgViewObs.observe(fgSection);

  document.addEventListener('keydown', e => {
    if (!fgInView) return;
    if (e.key === 'ArrowLeft') fgShow(fgIndex - 1);
    else if (e.key === 'ArrowRight') fgShow(fgIndex + 1);
  });

  fgShow(0);
}

/* Inline photo carousels — any <section class="lp-photo-carousel" data-pc-images="a.jpg,b.jpg,..."> */
document.querySelectorAll('.lp-photo-carousel').forEach(section => {
  const raw = section.getAttribute('data-pc-images') || '';
  const images = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (!images.length) return;
  const label = section.getAttribute('aria-label') || 'Sport court by SafePlay Pro';
  const img = section.querySelector('.pc-img');
  const counter = section.querySelector('.pc-counter');
  const prev = section.querySelector('.pc-prev');
  const next = section.querySelector('.pc-next');
  if (!img || !prev || !next) return;
  let idx = 0;
  const show = i => {
    idx = (i + images.length) % images.length;
    img.classList.remove('loaded');
    const n = new Image();
    n.onload = () => {
      img.src = n.src;
      img.alt = `${label} — image ${idx + 1} of ${images.length}`;
      img.classList.add('loaded');
    };
    n.src = `images/optimized/${images[idx]}`;
    if (counter) counter.textContent = `${idx + 1} / ${images.length}`;
  };
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
  let inView = false;
  new IntersectionObserver(entries => {
    entries.forEach(e => { inView = e.isIntersecting; });
  }, { threshold: 0.35 }).observe(section);
  document.addEventListener('keydown', e => {
    if (!inView) return;
    if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  // Mark first image loaded (already in src)
  img.classList.add('loaded');
});
