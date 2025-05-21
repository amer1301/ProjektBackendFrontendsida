const API_URL = 'http://localhost:5000/api/auth';

// Funktion för att logga in och spara JWT
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token); // Spara token i localStorage
            console.log('Inloggad och token sparad!');
        } else {
            console.error('Fel: Inget token returnerades');
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
}

// Funktion för att hämta token från localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Funktion för att logga ut och ta bort JWT från localStorage
function logout() {
    localStorage.removeItem('token');
    console.log('Utloggad!');
}

// Exportera funktionerna så de kan användas i andra filer
export { login, getToken, logout };
