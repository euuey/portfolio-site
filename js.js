document.addEventListener('DOMContentLoaded', () => {
  // Hero title fly-in animation
  const line1 = document.querySelector('.hero-title .line1');
  const line2Wrap = document.querySelector('.hero-title .line2-wrap');

  line1.style.opacity = '0';
  line1.style.transform = 'translateX(-100px)';
  line1.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

  line2Wrap.style.opacity = '0';
  line2Wrap.style.transform = 'translateX(100px)';
  line2Wrap.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

  setTimeout(() => {
    line1.style.opacity = '1';
    line1.style.transform = 'translateX(0)';
  }, 200);

  setTimeout(() => {
    line2Wrap.style.opacity = '1';
    line2Wrap.style.transform = 'translateX(0)';
  }, 400);

  // Scroll reveal (character by character) - shared logic
  function splitChars(el) {
    const html = el.innerHTML;
    let result = '';
    for (let i = 0; i < html.length; i++) {
      if (html.slice(i).startsWith('<br')) {
        const brEnd = html.indexOf('>', i);
        result += html.slice(i, brEnd + 1);
        i = brEnd;
      } else if (html[i] === '<') {
        const tagEnd = html.indexOf('>', i);
        result += html.slice(i, tagEnd + 1);
        i = tagEnd;
      } else if (html[i] === ' ') {
        result += ' ';
      } else {
        result += `<span class="char">${html[i]}</span>`;
      }
    }
    el.innerHTML = result;
    return el.querySelectorAll('.char');
  }

  function setupScrollReveal(textEl, sectionEl, speed) {
    const startRatio = speed === 'fast' ? 0.5 : 0.35;
    const endRatio = speed === 'fast' ? 0.05 : 0.4;
    const chars = splitChars(textEl);
    function reveal() {
      const sectionTop = sectionEl.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const scrollStart = windowHeight * startRatio;
      const scrollEnd = -windowHeight * endRatio;
      const progress = Math.min(
        Math.max((scrollStart - sectionTop) / (scrollStart - scrollEnd), 0),
        1
      );
      const revealed = Math.floor(progress * chars.length);
      chars.forEach((ch, i) => {
        ch.style.color = i < revealed ? '#fff' : '#333';
      });
    }
    window.addEventListener('scroll', reveal);
    reveal();
  }

  // Intro text
  setupScrollReveal(
    document.querySelector('.intro-text'),
    document.querySelector('.intro')
  );

  // Contact text (faster reveal for shorter text)
  setupScrollReveal(
    document.querySelector('.contact-text'),
    document.querySelector('.contact-intro'),
    'fast'
  );

  // Video playback speed + fade-in from below
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) heroVideo.playbackRate = 0.7;

  const heroVideoWrap = document.querySelector('.hero-video');
  heroVideoWrap.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';

  setTimeout(() => {
    heroVideoWrap.style.opacity = '1';
    heroVideoWrap.style.transform = 'translate(-50%, -50%) translateY(0)';
  }, 1000);

  const heroDesc = document.querySelector('.hero-description');
  heroDesc.style.transition = 'opacity 1s ease-out, transform 1s ease-out';

  const descObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroDesc.style.opacity = '1';
        heroDesc.style.transform = 'translateY(0)';
        descObserver.unobserve(heroDesc);
      }
    });
  }, { threshold: 0.3 });

  descObserver.observe(heroDesc);

  // Fullscreen menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const fullscreenNav = document.querySelector('.fullscreen-nav');

  const header = document.querySelector('.header');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    fullscreenNav.classList.toggle('open');
    header.classList.toggle('nav-open');
  });

  fullscreenNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      fullscreenNav.classList.remove('open');
      header.classList.remove('nav-open');
    });
  });

  // Section reveal on scroll (resets when out of view)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Header hide on scroll down, show on scroll up
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  });
});
