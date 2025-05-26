document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('.menu-nav');

  toggleBtn.addEventListener('click', () => {
    menuNav.classList.toggle('open');
  });
});
