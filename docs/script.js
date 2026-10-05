(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const bar = document.getElementById('bar');
  const counter = document.getElementById('counter');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let current = 0;

  const fromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isInteger(n) ? Math.min(Math.max(n - 1, 0), slides.length - 1) : 0;
  };

  const render = () => {
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === current);
      s.classList.toggle('is-past', i < current);
      s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    bar.style.width = `${((current + 1) / slides.length) * 100}%`;
    counter.textContent = `${current + 1} / ${slides.length}`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  };

  const go = (index) => {
    current = Math.min(Math.max(index, 0), slides.length - 1);
    history.replaceState(null, '', `#${current + 1}`);
    render();
  };

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        go(current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        go(current - 1);
        break;
      case 'Home': go(0); break;
      case 'End': go(slides.length - 1); break;
    }
  });

  // 터치 스와이프
  let startX = null;
  document.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  window.addEventListener('hashchange', () => { current = fromHash(); render(); });

  current = fromHash();
  render();
})();
