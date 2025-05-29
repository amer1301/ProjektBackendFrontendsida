// Hämta DOM-element
const loginForm = document.getElementById('loginFormCustom');
const adminSection = document.getElementById('admin-section');

// Kolla om användaren är inloggad (om JWT-token finns)
if (localStorage.getItem('token')) {
  loginForm.style.display = 'none';
  adminSection.style.display = 'block';
} else {
  loginForm.style.display = 'block';
  adminSection.style.display = 'none';
}

// Hantera inloggning
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('usernameCustom').value;
  const password = document.getElementById('passwordCustom').value;

  await login(username, password);

  if (localStorage.getItem('token')) {
    loginForm.style.display = 'none';
    adminSection.style.display = 'block';
  }
});

// Inloggningsfunktion
async function login(username, password) {
  const response = await fetch('https://projektbackendapi.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', username);
    location.reload(); // Ladda om sidan så authHeader.js också uppdateras
  } else {
    showMessage('Inloggning misslyckades: ' + data.error);
  }
}

// Skyddad data
async function getProtectedData() {
  const token = localStorage.getItem('token');
  if (!token) {
    showMessage('För att komma åt denna sida måste du vara inloggad');
    return;
  }

  try {
    const response = await fetch('https://projektbackendapi.onrender.com/api/auth/protected', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    showMessage('Fel vid hämtning av data: ' + error.message, 'error');
  }
}

// Meddelanden
function showMessage(text, type = 'error') {
  const messageDiv = document.getElementById('message');
  if (!messageDiv) return;

  messageDiv.textContent = text;
  messageDiv.className = type === 'success' ? 'success' : 'error';
  messageDiv.classList.remove('hidden');

  setTimeout(() => {
    messageDiv.classList.add('hidden');
  }, 4000);
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.body.id === 'admin-page') {
    loadMenuItems();
  }
});
