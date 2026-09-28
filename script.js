const body = document.body;
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const themeButton = document.querySelector('.theme-toggle');
document.getElementById('year').textContent = new Date().getFullYear();
let savedTheme;
try { savedTheme = localStorage.getItem('sheepforge-theme'); } catch {}
body.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && matchMedia('(prefers-color-scheme: dark)').matches));
const updateTheme = () => themeButton.setAttribute('aria-pressed', String(body.classList.contains('dark')));
updateTheme();
themeButton.addEventListener('click', () => {
  body.classList.toggle('dark'); updateTheme();
  try { localStorage.setItem('sheepforge-theme', body.classList.contains('dark') ? 'dark' : 'light'); } catch {}
});
const closeMenu = () => {
  nav.classList.remove('open'); menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Menü megnyitása');
};
menuButton.addEventListener('click', () => {
  const open = menuButton.classList.toggle('open'); nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
document.querySelectorAll('[data-count]').forEach(counter => { counter.textContent = counter.dataset.count; });
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const updateScroll = () => {
  header.classList.toggle('scrolled', scrollY > 30);
  const current = sections.filter(section => scrollY >= section.offsetTop - 180).at(-1);
  navLinks.forEach(link => link.classList.toggle('active', !!current && link.hash === `#${current.id}`));
};
window.addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
document.querySelectorAll('.filters button').forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    document.querySelectorAll('.project').forEach(project => project.classList.toggle('hide', button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter));
  });
});
const modal = document.querySelector('.modal');
if (modal) {
  const trigger = document.querySelector('.showreel-button');
  const closeModal = () => { modal.hidden = true; body.style.overflow = ''; trigger.focus(); };
  trigger.addEventListener('click', () => { modal.hidden = false; body.style.overflow = 'hidden'; modal.querySelector('.modal-close').focus(); });
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.button').addEventListener('click', closeModal);
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') {
      const items = [...modal.querySelectorAll('button, a[href]')];
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    }
  });
}
document.querySelectorAll('.contact-form').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const status = form.querySelector('.form-message');
  for (const field of [form.elements.name, form.elements.message]) {
    field.setCustomValidity(field.value.trim() ? '' : 'Kérjük, töltsd ki ezt a mezőt.');
    field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
  }
  if (!form.checkValidity()) { status.textContent = 'Kérjük, tölts ki minden mezőt érvényesen.'; form.reportValidity(); return; }
  const content = `Név: ${form.elements.name.value.trim()}\nE-mail: ${form.elements.email.value.trim()}\n\n${form.elements.message.value.trim()}`;
  const subject = form.dataset.subject || 'SheepForge ajánlatkérés';
  window.location.href = `mailto:hsk.konrad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
  status.textContent = 'Az üzenet még nincs elküldve. Küldd el a megnyíló levelezőprogramból. Ha nem nyílt meg, írj a hsk.konrad@gmail.com címre. A kitöltött szöveget itt megtartottuk.';
}));
const glow = document.querySelector('.cursor-glow');
if (glow) window.addEventListener('pointermove', event => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }, { passive: true });
