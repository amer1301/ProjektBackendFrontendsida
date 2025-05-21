// Hämta DOM-element
const loginForm = document.getElementById('loginFormCustom');
const adminSection = document.getElementById('admin-section');
const logoutBtn = document.getElementById('logoutBtn');

// Kolla om användaren är inloggad (om JWT-token finns)
if (localStorage.getItem('token')) {
  // Om användaren är inloggad, visa adminsektionen och dölja loginformuläret
  loginForm.style.display = 'none';
  adminSection.style.display = 'block';
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
  }
});

// Hantera utloggning
logoutBtn.addEventListener('click', () => {
  // Ta bort token från localStorage
  localStorage.removeItem('token');

  // Uppdatera visningen
  loginForm.style.display = 'block';
  adminSection.style.display = 'none';
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
        localStorage.setItem('token', data.token); // Spara token
        alert('Inloggning lyckades!');
    } else {
        alert('Inloggning misslyckades: ' + data.error);
    }
}

// Funktion för att hämta skyddad data (om användaren är inloggad)
async function getProtectedData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('För att komma åt denna sida måste du vara inloggad');
        return;
    }

    const response = await fetch('http://localhost:5000/api/auth/protected', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    console.log(data);  // Här kan du visa användarinformation eller annan data
}
