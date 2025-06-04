let currentCafe = null;

const cafeNameTitle = document.getElementById('cafeNameTitle');
const addedMenuSection = document.querySelector('.added-menu'); 

// Hämta menyobjekt för alla kaféer (administration)
async function loadMenuItems() {
  try {
    const response = await fetch('https://projektbackendapi.onrender.com/api/menu/menu-items');
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
  currentCafe = cafeName;
  try {
    const response = await fetch(`https://projektbackendapi.onrender.com/api/menu/menu-items/${cafeName}`);
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

  if (menuItems.length > 0) {
    if (isAdminPage && cafeNameTitle) {
      cafeNameTitle.textContent = `Ammis bakverk i: ${menuItems[0].cafe}`;
    }
  } else {
    if (isAdminPage && cafeNameTitle) {
      cafeNameTitle.textContent = 'Inga bakverk tillagda ännu för valt kafé.';
    }
  }

  menuItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('menu-item');

    // Texten
    const textSpan = document.createElement('span');
    textSpan.textContent = `${item.name} - ${item.price} SEK (${item.category})`;
    listItem.appendChild(textSpan);

    if (isAdminPage) {
      // Visa "Ta bort"-knapp ENDAST om item.fixed är falskt/undefined
      if (!item.fixed) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Ta bort';
        deleteButton.classList.add('delete-button');
        deleteButton.style.marginLeft = '1em';

        deleteButton.addEventListener('click', () => {
          deleteMenuItem(item._id);
        });

        listItem.appendChild(deleteButton);
      }
      // Inget annat ska visas om item.fixed är true
    } else {
      // Vanlig användarsida: visa ikon för kategori
      const icon = document.createElement('img');
      icon.alt = `ikon för ${item.category}`;
      icon.classList.add('category-icon');

      switch (item.category.toLowerCase()) {
        case 'tårta':
          icon.src = 'icons/cake-small.png';
          break;
        case 'kaka':
          icon.src = 'icons/cookies-small.png';
          break;
        case 'bakelse':
          icon.src = 'icons/pastry-small.png';
          break;
        case 'bröd':
          icon.src = 'icons/bread-small.png';
          break;
      }

      listItem.appendChild(icon);
    }

    menuContainer.appendChild(listItem);
  });
}


// Ta bort menyobjekt via API
async function deleteMenuItem(itemId) {
  try {
    const response = await fetch(`/api/menu/delete/${itemId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      if (currentCafe) {
        loadMenuForCafe(currentCafe);
      } else {
        loadMenuItems();
      }
    }
  } catch (error) {
    console.error('Fel vid borttagning:', error);
  }
}


// Gör funktionerna globala (om de ska användas i andra filer)
window.loadMenuItems = loadMenuItems;
window.loadMenuForCafe = loadMenuForCafe;

// --- Eventlistener för kaféval i dropdown ---
const cafeSelect = document.getElementById('cafe');
  cafeSelect.addEventListener('change', (e) => {
    const selectedCafe = e.target.value;
    if (selectedCafe) {
      addedMenuSection.style.display = 'flex';  // Visa sektionen när kafé väljs
      loadMenuForCafe(selectedCafe.toLowerCase());
    } else {
      addedMenuSection.style.display = 'none';  // Dölj om inget är valt
      cafeNameTitle.textContent = '';
    }
  });


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
      const response = await fetch('https://projektbackendapi.onrender.com/api/menu/menu-items', {
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
