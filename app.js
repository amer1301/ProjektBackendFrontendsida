import { login, getToken, logout } from './auth.js';

// Använd login-funktionen
document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login(username, password);
});

// Kontrollera om användaren är inloggad (finns det en token?)
const token = getToken();
if (token) {
    console.log('Användaren är inloggad!');
} else {
    console.log('Användaren är inte inloggad');
}

// Exempel på logout
document.getElementById('logoutBtn').addEventListener('click', logout);
