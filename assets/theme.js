// KI Boost Studio — globales Theme-JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-mobile-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.hasAttribute('data-open');

      if (isOpen) {
        mobileNav.removeAttribute('data-open');
        mobileNav.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileNav.setAttribute('data-open', '');
        mobileNav.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  }
});
