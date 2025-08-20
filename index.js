const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

const KEY_DONE = 'finneo:onboardingDone';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const slides       = $$('.slide');
  const dots         = $$('.dot');
  const btnContinue  = $('#btn-continue');
  const btnSkip      = $('#btn-skip');
  const btnBack      = $('#btn-back'); // texto puro "Voltar", sem fundo
  const slidesRoot   = $('.slides');

  // Estado
  let current   = 0;
  let isSwiping = false;
  let startX    = 0;

  // Navega para um índice específico
  function goTo(index){
    current = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((el, i) => el.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', String(i === current));
    });

    // Texto do botão principal
    if (btnContinue) {
      btnContinue.textContent = (current === slides.length - 1) ? 'COMEÇAR' : 'CONTINUE';
    }

    // "Voltar": esconde no primeiro slide
    if (btnBack) {
      const isFirst = (current === 0);
      btnBack.toggleAttribute('hidden', isFirst);
      btnBack.setAttribute('aria-disabled', String(isFirst));
      btnBack.tabIndex = isFirst ? -1 : 0;
    }
  }

  // Avança ou finaliza
  function next(){
    if (current < slides.length - 1) {
      goTo(current + 1);
    } else {
      done();
    }
  }

  // Concluir onboarding
  function done(){
    try {
      localStorage.setItem(KEY_DONE, '1');
    } catch (_) { /* ignore storage errors */ }
    finishOnboarding();
  }

  function finishOnboarding(){
    $('#onboarding')?.classList.add('hidden');
    const app = $('#app');
    app?.classList.remove('hidden');
    app?.focus();
  }

  // Eventos de clique
  btnContinue?.addEventListener('click', next);
  btnSkip?.addEventListener('click', done);
  btnBack?.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  dots.forEach(d => d.addEventListener('click', () => {
    const idx = parseInt(d.dataset.go, 10);
    if (!Number.isNaN(idx)) goTo(idx);
  }));

  // Teclado ← →
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  goTo(current - 1);
  });

  // Swipe (mobile)
  if (slidesRoot) {
    slidesRoot.addEventListener('touchstart', (e) => {
      isSwiping = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    slidesRoot.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      // Mantemos simples: só detecta direção ao soltar
    }, { passive: true });

    slidesRoot.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX;
      isSwiping = false;
      if (Math.abs(delta) > 40) {
        if (delta < 0) next(); else goTo(current - 1);
      }
    }, { passive: true });
  }

  // Inicial
  goTo(0);
});

document.addEventListener('DOMContentLoaded', () => {
  const splash      = document.querySelector('#splash');
  const onboarding  = document.querySelector('#onboarding');

  // Tempo mínimo do splash (ajuste se quiser)
  const MIN_SPLASH_MS = 3000;

  setTimeout(() => {
    splash?.classList.add('hidden');        // esconde splash
    onboarding?.classList.remove('hidden'); // mostra onboarding
  }, MIN_SPLASH_MS);

  /* ...resto do seu código já existente (slides, dots, voltar etc.)... */
});
