// ==== Fixa altura do fundo pelo tamanho inicial da tela (iOS-safe) ====
(function fixStaticBG() {
  // mede a altura inicial da viewport (antes do teclado)
  const initialVh = (window.innerHeight || document.documentElement.clientHeight) * 0.01;
  document.documentElement.style.setProperty('--vh-fixed', `${initialVh}px`);

  // se mudar a orientação da tela, recalcula
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const vh = (window.innerHeight || document.documentElement.clientHeight) * 0.01;
      document.documentElement.style.setProperty('--vh-fixed', `${vh}px`);
    }, 350);
  });
})();

// Mostrar/Ocultar senha
const passInput = document.getElementById('password');
const toggleBtn  = document.querySelector('.toggle-pass');

toggleBtn.addEventListener('click', () => {
  const isHidden = passInput.type === 'password';
  passInput.type = isHidden ? 'text' : 'password';
  toggleBtn.textContent = isHidden ? 'Ocultar' : 'Mostrar';
  toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
  passInput.focus();
});

// Exemplos de handlers (substitua pela sua lógica)
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  // Coloque aqui sua validação/autenticação
  // Exemplo simples:
  const email = document.getElementById('email').value.trim();
  const pass  = passInput.value.trim();

  if(!email || !pass){
    alert('Preencha e-mail e senha.');
    return;
  }
  console.log('Login:', { email, pass });
});

document.getElementById('googleBtn').addEventListener('click', () => {
  console.log('Login com Google');
  // redirecione para o fluxo OAuth do Google
});
document.getElementById('facebookBtn').addEventListener('click', () => {
  console.log('Login com Facebook');
  // redirecione para o fluxo OAuth do Facebook
});

document.getElementById('registerLink').addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Ir para registrar');
  // window.location.href = 'register.html';
});
