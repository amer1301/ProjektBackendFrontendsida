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

async function getProtectedData() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/auth/protected', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    console.log(data);
}