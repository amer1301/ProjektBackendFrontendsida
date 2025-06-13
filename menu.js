let currentCafe = null;

const cafeNameTitle = document.getElementById('cafeNameTitle');
const addedMenuSection = document.querySelector('.added-menu');
const form = document.getElementById('addForm');

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

// Hämta menyobjekt för ett specifikt kafé
async function loadMenuForCafe(cafeName) {
  try {
    const response = await fetch(`https://projektbackendapi.onrender.com/api/menu/menu-items/by-cafe/${cafeName}`);
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

  if (menuItems.length > 0 && isAdminPage && cafeNameTitle) {
    cafeNameTitle.textContent = `Ammis bakverk i: ${menuItems[0].cafe}`;
  } else if (isAdminPage && cafeNameTitle) {
    cafeNameTitle.textContent = 'Inga bakverk tillagda ännu för valt kafé.';
  }

  menuItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('menu-item');

    const textSpan = document.createElement('span');
    textSpan.textContent = `${item.name} - ${item.price} SEK (${item.category})`;
    listItem.appendChild(textSpan);

    if (isAdminPage && !item.fixed) {
      // Redigera-knapp
      const editButton = document.createElement('button');
      editButton.textContent = 'Redigera';
      editButton.classList.add('edit-button');
      editButton.style.marginLeft = '0.5em';
      editButton.addEventListener('click', () => populateEditForm(item));
      listItem.appendChild(editButton);

      // Ta bort-knapp
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Ta bort';
      deleteButton.classList.add('delete-button');
      deleteButton.style.marginLeft = '0.5em';
      deleteButton.addEventListener('click', () => deleteMenuItem(item._id));
      listItem.appendChild(deleteButton);
    } else if (!isAdminPage) {
      // Användarsida – ikon
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

// Fyll i formuläret vid redigering
function populateEditForm(item) {
  document.getElementById('name').value = item.name;
  document.getElementById('price').value = item.price;
  document.getElementById('category').value = item.category;
  document.getElementById('cafe').value = item.cafe;
  document.getElementById('editId').value = item._id;
  console.log('Redigerar ID:', item._id);
  form.querySelector('button[type="submit"]').textContent = 'Spara ändringar';
}

// Ta bort menyobjekt
async function deleteMenuItem(itemId) {
  try {
    const response = await fetch(`https://projektbackendapi.onrender.com/api/menu/menu-items/${itemId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('Bakverk borttaget');
      const selectedCafe = document.getElementById('cafe').value;
      if (selectedCafe) {
        loadMenuForCafe(selectedCafe.toLowerCase());
      } else {
        loadMenuItems();
      }
    } else {
      console.error('Fel vid borttagning:', response.status);
    }
  } catch (error) {
    console.error('Nätverksfel vid borttagning:', error);
  }
}

// Formulärsubmit – lägg till eller uppdatera
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const price = parseInt(document.getElementById('price').value, 10);
  const category = document.getElementById('category').value;
  const cafe = document.getElementById('cafe').value;
  const editId = document.getElementById('editId').value;

  const itemData = { name, price, category, cafe };

  try {
let response;

 if (editId) {
      // REDIGERA
       response = await fetch(`https://projektbackendapi.onrender.com/api/menu/menu-items/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
      });
    } else {
      // LÄGG TILL
      response = await fetch('https://projektbackendapi.onrender.com/api/menu/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });
    }

    if (response.ok) {
      console.log(editId ? 'Bakverk uppdaterat' : 'Bakverk tillagt');
      form.reset();
      document.getElementById('editId').value = '';
      form.querySelector('button[type="submit"]').textContent = 'Lägg till bakverk';

      if (cafe) {
        loadMenuForCafe(cafe.toLowerCase());
      } else {
        loadMenuItems();
      }
    } else {
      console.error('Fel vid sparande:', response.status);
    }

  } catch (error) {
    console.error('Nätverksfel:', error);
  }
});

// Hantera kaféval i dropdown
const cafeSelect = document.getElementById('cafe');
cafeSelect.addEventListener('change', (e) => {
  const selectedCafe = e.target.value;
  if (selectedCafe) {
    addedMenuSection.style.display = 'flex';
    loadMenuForCafe(selectedCafe.toLowerCase());
  } else {
    addedMenuSection.style.display = 'none';
    cafeNameTitle.textContent = '';
  }
});

// Gör globala (för ev. extern användning)
window.loadMenuItems = loadMenuItems;
window.loadMenuForCafe = loadMenuForCafe;