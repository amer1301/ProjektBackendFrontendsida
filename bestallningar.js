document.addEventListener("DOMContentLoaded", () => {
  
  // 🔒 Kontrollera om användaren är inloggad (om JWT-token finns)
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'administration.html';
    return; // stoppa fortsatt körning av sidan
  }

  const container = document.getElementById("bestallningsContainer");
  const filterSelect = document.getElementById("filterCafe");
  const modal = document.getElementById('confirmationModal');
  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');

  let allOrders = [];
  let pendingDeleteId = null;

  async function fetchAndRenderOrders() {
    try {
      const response = await fetch("http://localhost:5000/api/bestallningar");
      const data = await response.json();

      allOrders = sortOrdersByPickupTime(data);
      renderOrders();
    } catch (err) {
      console.error("Fel:", err);
      container.innerHTML = "<p>Det gick inte att hämta beställningar.</p>";
    }
  }

  function sortOrdersByPickupTime(orders) {
    return orders.sort((a, b) => {
      const dateA = extractPickupDateTime(a.upphamtning);
      const dateB = extractPickupDateTime(b.upphamtning);
      return dateA - dateB;
    });
  }

  function extractPickupDateTime(upphamtningStr) {
    const match = upphamtningStr.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/);
    if (!match) return new Date(0);
    return new Date(`${match[1]}T${match[2]}`);
  }

function renderOrders() {
  const selectedCafe = filterSelect.value;
  container.innerHTML = "";

  const storedStatuses = JSON.parse(localStorage.getItem('orderStatuses')) || {};

  const filtered = selectedCafe
    ? allOrders.filter(b => b.upphamtning.includes(selectedCafe))
    : allOrders;

  if (filtered.length === 0) {
    container.innerHTML = "<p>Inga beställningar ännu.</p>";
    return;
  }

  filtered.forEach((b, index) => {
    // Använd status från localStorage om den finns
    const currentStatus = storedStatuses[b._id] || b.status;

    const div = document.createElement("div");
    div.className = "bestallning";
    div.innerHTML = `
      <h3>Beställning ${index + 1}</h3>
      <p><strong>Namn:</strong> ${b.namn}</p>
      <p><strong>Telefon:</strong> ${b.telefon}</p>
      <p><strong>E-post:</strong> ${b.email}</p>
      <p><strong>Bakverk:</strong> ${b.bakverk}</p>
      <p><strong>Antal:</strong> ${b.antal}</p>
      <p><strong>Meddelande:</strong> ${b.meddelande}</p>
      <p><strong>Upphämtning:</strong> ${b.upphamtning}</p>
      <p><strong>Datum:</strong> ${
        new Date(b.skapad).toLocaleDateString('sv-SE') + ' ' +
        new Date(b.skapad).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
      }</p>
      <label for="status-${b._id}">Status:</label>
      <select id="status-${b._id}" data-id="${b._id}">
        <option value="påbörjad" ${currentStatus === 'påbörjad' ? 'selected' : ''}>Påbörjad</option>
        <option value="klar" ${currentStatus === 'klar' ? 'selected' : ''}>Klar och väntar på upphämtning</option>
        <option value="avklarad" ${currentStatus === 'avklarad' ? 'selected' : ''}>Upphämtad och avklarad</option>
      </select>
      <hr>
    `;
    container.appendChild(div);

    const statusSelect = div.querySelector(`#status-${b._id}`);
    statusSelect.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      if (newStatus === 'avklarad') {
        pendingDeleteId = b._id;
        showModal(b._id);
      } else {
        updateOrderStatus(b._id, newStatus);
      }
    });
  });
}


  function showModal(orderId) {
    modal.style.display = 'block';

    confirmYes.onclick = () => {
      deleteOrder(orderId);
      modal.style.display = 'none';
    };

    confirmNo.onclick = () => {
      modal.style.display = 'none';
      fetchAndRenderOrders(); // Återställ statusval om användaren ångrar
    };
  }

function deleteOrder(orderId) {
  fetch(`http://localhost:5000/api/bestallningar/${orderId}`, {
    method: 'DELETE'
  }).then(response => {
    if (response.ok) {
      // Rensa bort sparad status för denna beställning
      const statuses = JSON.parse(localStorage.getItem('orderStatuses')) || {};
      delete statuses[orderId];
      localStorage.setItem('orderStatuses', JSON.stringify(statuses));

      // Ta bort från den lokala listan och rendera om
      allOrders = allOrders.filter(order => order._id !== orderId);
      renderOrders();
    } else {
      alert('Något gick fel vid borttagning av beställningen.');
    }
  });
}


function updateOrderStatus(orderId, newStatus) {
  fetch(`http://localhost:5000/api/bestallningar/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  })
  .then(response => {
    if (!response.ok) {
      console.error("Kunde inte uppdatera status.");
    } else {
      // Uppdatera localStorage
      const storedStatuses = JSON.parse(localStorage.getItem('orderStatuses')) || {};
      storedStatuses[orderId] = newStatus;
      localStorage.setItem('orderStatuses', JSON.stringify(storedStatuses));

      // Uppdatera lokalt i allOrders så det återspeglas i UI direkt
      const orderToUpdate = allOrders.find(o => o._id === orderId);
      if (orderToUpdate) {
        orderToUpdate.status = newStatus;
      }
    }
  });
}

  filterSelect.addEventListener("change", renderOrders);

  fetchAndRenderOrders();
});
