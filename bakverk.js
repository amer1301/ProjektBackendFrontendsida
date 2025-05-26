const cafeSelect = document.getElementById('cafe');
if (cafeSelect) {
  cafeSelect.addEventListener('change', (e) => {
    const selectedCafe = e.target.value;
    if (selectedCafe) {
      loadMenuForCafe(selectedCafe.toLowerCase());  // Ladda menyn för valt kafé
    }
  });
}

const form = document.getElementById('addForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const cafe = document.getElementById('cafe')?.value || "okänt";

    const newItem = { name, price, category, cafe };

    try {
      const response = await fetch('http://localhost:5000/api/menu/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        const createdItem = await response.json();
        console.log('Bakverk tillagt:', createdItem);

        // Uppdatera menylistan
        loadMenuItems();

        // Rensa formuläret
        e.target.reset();
      } else {
        console.error('Fel vid tillägg av bakverk:', response.status);
      }
    } catch (error) {
      console.error('Nätverksfel vid tillägg av bakverk:', error);
    }
  });
}
