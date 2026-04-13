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
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const credStat = document.getElementById('cred-stat');
if (credStat) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { runCounter(credStat, 1000, '+', 1400); counterObs.unobserve(e.target); }
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
  '20180711_151241.jpg', '20190718_113900.jpg', '20190812_072930.jpg',
  '20191009_102607.jpg', '20200603_162658.jpg', '20200603_163147.jpg',
  '20200702_143051.jpg', '20200806_144010.jpg', '20200923_155957.jpg',
  '20210505_112822.jpg', '20210604_113553.jpg', '20210721_150436.jpg',
  '20210811_150815.jpg', '20210903_130902.jpg', '20210903_130934.jpg',
  '20210910_134022.jpg', '20210910_135256.jpg', '20210910_152236.jpg',
  '20220527_144938.jpg', '20230530_154946.jpg', '20230607_140013.jpg',
  '20230621_142445.jpg', '20230714_113111.jpg', '20230714_153403.jpg',
  '20240531_082412_04.jpg', '20240611_150045.jpg', '20240729_141042.jpg',
  '20250701_145334.jpg'
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
