// Hämta DOM-element
const loginForm = document.getElementById('loginFormCustom');
const adminSection = document.getElementById('admin-section');
const logoutBtn = document.getElementById('logoutBtn');
const loginLink = document.getElementById('loginLink');

// Kolla om användaren är inloggad (om JWT-token finns)
if (localStorage.getItem('token')) {
  // Om användaren är inloggad, visa adminsektionen och dölja loginformuläret
  loginForm.style.display = 'none';
  adminSection.style.display = 'block';
    updateLoginDisplay();
} else {
  // Om användaren inte är inloggad, visa loginformuläret och dölj adminsektionen
  loginForm.style.display = 'block';
  adminSection.style.display = 'none';
}

// Hantera inloggning
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();  // Förhindra att sidan laddas om

  const username = document.getElementById('usernameCustom').value;
  const password = document.getElementById('passwordCustom').value;

  // Använd den redan existerande login-funktionen
  await login(username, password);

  // Kolla om token är sparad i localStorage och uppdatera visningen
  if (localStorage.getItem('token')) {
    loginForm.style.display = 'none';
    adminSection.style.display = 'block';
    updateLoginDisplay();
  }
});

// Hantera utloggning
logoutBtn.addEventListener('click', () => {
  // Ta bort token från localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('username');

  // Uppdatera visningen
  loginForm.style.display = 'block';
  adminSection.style.display = 'none';

   if (loginLink) {
    loginLink.textContent = 'Inloggning';
    loginLink.href = 'administration.html';
  }
});


// Funktionen för login
async function login(username, password) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
 localStorage.setItem('token', data.token);
    localStorage.setItem('username', username);
    updateLoginDisplay();
    } else {
        showMessage('Inloggning misslyckades: ' + data.error);
    }
}

function updateLoginDisplay() {
  const username = localStorage.getItem('username');
  if (username && loginLink) {
    loginLink.textContent = `Välkommen ${username}!`;
    loginLink.href = '#'; // Eller behåll administration.html om du vill
  }
}

// Funktion för att hämta skyddad data (om användaren är inloggad)
async function getProtectedData() {
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('För att komma åt denna sida måste du vara inloggad');
        return;
    }

  try {
    const response = await fetch('http://localhost:5000/api/auth/protected', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    showMessage('Fel vid hämtning av data: ' + error.message, 'error');
  }
}

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

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token')) {
    updateLoginDisplay();
  }
});
