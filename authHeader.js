document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const guestHeader = document.getElementById('header-guest');
  const loggedInHeader = document.getElementById('header-logged-in');
  const welcomeText = document.getElementById('welcomeText');
  const logoutBtn = document.getElementById('logoutBtn2');

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
        location.reload(); // Ladda om sidan för att visa rätt header
      });
    }
  }
});
