// Exempel på att hämta menyobjekt från servern
async function loadMenuItems() {
  try {
    const response = await fetch('http://localhost:5000/api/menu/menu-items');
    if (response.ok) {
      const menuItems = await response.json();
      console.log(menuItems); // Här får du alla menyobjekt
      // Visa menyn på sidan, t.ex. med en funktion som renderar dem i HTML
      renderMenuItems(menuItems);
    } else {
      console.error('Fel vid hämtning av menyobjekt:', response.status);
    }
  } catch (error) {
    console.error('Fel vid hämtning av menyobjekt:', error);
  }
}

// Funktion för att rendera menyobjekten i HTML
function renderMenuItems(menuItems) {
  const menuContainer = document.getElementById('menuList');
  menuContainer.innerHTML = ''; // Töm befintlig lista
  menuItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} - ${item.price} SEK (${item.category})`;
    menuContainer.appendChild(listItem);
  });
}

loadMenuItems(); // Hämta och rendera menyobjekt på sidan
