const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

const KEY_DONE = 'finneo:onboardingDone';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const slides       = $$('.slide');
  const dots         = $$('.dot');
  const btnContinue  = $('#btn-continue');
  const btnSkip      = $('#btn-skip');
  const btnBack      = $('#btn-back'); // "Voltar" (texto puro)
  const slidesRoot   = $('.slides');
  const splash       = $('#splash');
  const onboarding   = $('#onboarding');
  const app          = $('#app');

  // Estado
  let current   = 0;
  let isSwiping = false;
  let startX    = 0;

  // Navega para um índice específico
  function goTo(index){
    current = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((el, i) => {
      const active = i === current;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', String(!active));
    });

    dots.forEach((d, i) => {
      const active = i === current;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', String(active));
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

  // Concluir onboarding → vai para login.html
  function done(){
    try {
      localStorage.setItem(KEY_DONE, '1');
    } catch (_) { /* ignore storage errors */ }

    // Use replace para evitar voltar ao onboarding com o botão "Voltar" do navegador
    const to = new URL('./login.html', window.location.href);
    window.location.replace(to.href);
  }

  // Eventos de clique
  btnContinue?.addEventListener('click', next);
  btnSkip?.addEventListener('click', done);
  btnBack?.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  dots.forEach(d => d.addEventListener('click', () => {
    const idx = parseInt(d.dataset.go, 10);
    if (!Number.isNaN(idx)) goTo(idx);
  }));

  // Teclado ← → (Esc pula)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'Escape')     done();
  });

  // Swipe (mobile)
  if (slidesRoot) {
    slidesRoot.addEventListener('touchstart', (e) => {
      isSwiping = true;
      startX = e.touches[0].clientX;
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

  // Splash -> Onboarding
  const MIN_SPLASH_MS = 3000;
  setTimeout(() => {
    splash?.classList.add('hidden');        // esconde splash
    onboarding?.classList.remove('hidden'); // mostra onboarding
    // app permanece oculto até o login.html (pós-onboarding)
  }, MIN_SPLASH_MS);
});
