// --- Funktioner för att hämta och rendera meny ---

// Hämta menyobjekt för alla kaféer (administration)
async function loadMenuItems() {
  try {
    const response = await fetch('http://localhost:5000/api/menu/menu-items');
    if (response.ok) {
      const menuItems = await response.json();
      renderMenuItems(menuItems);
    } else {
      console.error('Fel vid hämtning av menyobjekt:', response.status);
    }
  } catch (error) {
    console.error('Fel vid hämtning av menyobjekt:', error);
  }
}

// Hämta menyobjekt för ett specifikt kafé (kafésida)
async function loadMenuForCafe(cafeName) {
  try {
    const response = await fetch(`http://localhost:5000/api/menu/menu-items/${cafeName}`);
    if (response.ok) {
      const menuItems = await response.json();
      renderMenuItems(menuItems);
    } else {
      console.error('Fel vid hämtning av meny:', response.status);
    }
  } catch (error) {
    console.error('Fel vid hämtning av meny:', error);
  }
}

// Visa menyobjekt i HTML
function renderMenuItems(menuItems) {
  const menuContainer = document.getElementById('menuList');
  if (!menuContainer) return;

   const isAdminPage = document.body.id === 'admin-page'; 

  menuContainer.innerHTML = '';
  menuItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} - ${item.price} SEK (${item.category})`;

 if (isAdminPage) {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Ta bort';
      deleteButton.style.marginLeft = '1em';
      deleteButton.addEventListener('click', () => {
        deleteMenuItem(item._id);
      });
      listItem.appendChild(deleteButton);
    }

    menuContainer.appendChild(listItem);
  });
}

// Ta bort menyobjekt via API
async function deleteMenuItem(itemId) {
  try {
    const response = await fetch(`http://localhost:5000/api/menu/menu-items/${itemId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('Bakverk borttaget');
      loadMenuItems(); // Ladda om listan efter radering
    } else {
      console.error('Fel vid borttagning:', response.status);
    }
  } catch (error) {
    console.error('Nätverksfel vid borttagning:', error);
  }
}

// Gör funktionerna globala (om de ska användas i andra filer)
window.loadMenuItems = loadMenuItems;
window.loadMenuForCafe = loadMenuForCafe;

// --- Eventlistener för kaféval i dropdown ---
const cafeSelect = document.getElementById('cafe');
if (cafeSelect) {
  cafeSelect.addEventListener('change', (e) => {
    const selectedCafe = e.target.value;
    if (selectedCafe) {
      loadMenuForCafe(selectedCafe.toLowerCase());  // Ladda menyn för valt kafé
    }
  });
}

// --- Eventlistener för formulär - lägg till nytt bakverk ---
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

        // Uppdatera menylistan beroende på valt kafé
        if (cafe) {
          loadMenuForCafe(cafe.toLowerCase());
        } else {
          loadMenuItems();
        }

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
