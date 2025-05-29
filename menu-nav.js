document.addEventListener("DOMContentLoaded", () => {
  // För besökare
  const toggleBtn = document.querySelector('.menu-toggle');
  const menuNav = document.querySelector('.menu-nav:not(.admin-menu)'); // Välj bara besökarmenyn

  if (toggleBtn && menuNav) {
    toggleBtn.addEventListener('click', () => {
      menuNav.classList.toggle('open');
    });
  }

  // För admin
  const adminToggle = document.querySelector('.menu-toggle-admin');
  const adminMenu = document.querySelector('.admin-menu');

  if (adminToggle && adminMenu) {
    adminToggle.addEventListener('click', () => {
      adminMenu.classList.toggle('open-admin');
    });
  }
});
