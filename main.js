/**
 * Luxmind Luxmind — Company Website
 * Minimal interactive JS
 */

(function () {
  'use strict';

  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function onScroll() {
    const currentScroll = window.scrollY;
    nav.classList.toggle('scrolled', currentScroll > 50);
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Check initial state
  onScroll();

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // --- Intersection Observer for reveal animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });


  // --- Visit Counter (deferred, non-blocking) ---
  const VISIT_API = 'https://luxmind.cn/api';

  function formatNumber(n) {
    return n.toLocaleString('zh-CN');
  }

  function updateVisitCounter() {
    const el = document.getElementById('visitCounter');
    if (!el) return;

    fetch(VISIT_API + '/visits?increment=true', { method: 'GET' })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        if (typeof data.count === 'number') {
          el.textContent = '累计访问: ' + formatNumber(data.count) + ' 次';
        }
      })
      .catch(() => {
        // 静默降级 — 不弹错误，不影响页面其他功能
        el.style.display = 'none';
      });
  }

  // 页面完全渲染后再发起，不阻塞首屏
  if (window.requestIdleCallback) {
    requestIdleCallback(updateVisitCounter, { timeout: 3000 });
  } else {
    setTimeout(updateVisitCounter, 1500);
  }

  // --- Smooth parallax for hero orbs on mouse move ---
  const hero = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.orb');

  if (hero && orbs.length) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 20;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }
})();
