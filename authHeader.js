document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const guestHeader = document.getElementById('header-guest');
  const loggedInHeader = document.getElementById('header-logged-in');
  const welcomeText = document.getElementById('welcomeText');
  const logoutBtn = document.getElementById('logoutBtn2');

  const adminNav = document.getElementById('adminNav'); // NY RAD

  if (token && username) {
    if (guestHeader) guestHeader.style.display = 'none';
    if (loggedInHeader) loggedInHeader.style.display = 'block';

    if (welcomeText) {
      welcomeText.textContent = `Välkommen ${username}!`;
    }

    if (logoutBtn) {
      logoutBtn.style.display = 'inline';
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        location.reload(); // Ladda om sidan
      });
    }

    if (adminNav) adminNav.style.display = 'flex'; // VISA NAV-MENY
  } else {
    if (adminNav) adminNav.style.display = 'none'; // DÖLJ NAV-MENY
  }
});
