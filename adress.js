const cafeLocations = [
  { name: "Ammis bakverk", address: "Storgatan 5, Stockholm", city: "Stockholm", county: "Stockholms län" },
  { name: "Ammis bakverk", address: "Södra Vägen 10, Göteborg", city: "Göteborg", county: "Västra Götalands län" },
  { name: "Ammis bakverk", address: "Lilla Torg 3, Malmö", city: "Malmö", county: "Skåne län" },
  { name: "Ammis bakverk", address: "Hamngatan 12, Umeå", city: "Umeå", county: "Västerbottens län" },
  { name: "Ammis bakverk", address: "Storgatan 8, Luleå", city: "Luleå", county: "Norrbottens län" },
  { name: "Ammis bakverk", address: "Kyrkogatan 1, Uppsala", city: "Uppsala", county: "Uppsala län" },
  { name: "Ammis bakverk", address: "Östra Promenaden 4, Norrköping", city: "Norrköping", county: "Östergötlands län" },
  { name: "Ammis bakverk", address: "Stora Torget 2, Växjö", city: "Växjö", county: "Kronobergs län" },
  { name: "Ammis bakverk", address: "Drottninggatan 20, Karlstad", city: "Karlstad", county: "Värmlands län" },
  { name: "Ammis bakverk", address: "Kungsgatan 18, Örebro", city: "Örebro", county: "Örebro län" },
  { name: "Ammis bakverk", address: "Storgatan 15, Sundsvall", city: "Sundsvall", county: "Västernorrlands län" }
];


    let map;

   async function findCafe() {
  const input = document.getElementById("locationInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");

  const cleanedInput = input.replace("län", "").trim();

  const matchedCafe = cafeLocations.find(cafe => {
    const county = cafe.county.toLowerCase().replace("län", "").trim();
    const city = cafe.city.toLowerCase().trim();
    return county.includes(cleanedInput) || city.includes(cleanedInput) || cleanedInput.includes(city);
  });

  if (!matchedCafe) {
    resultDiv.innerHTML = "Inget kafé hittades i detta område.";
    if (map) map.remove();
    return;
  }

  const location = matchedCafe.address;
  resultDiv.innerHTML = `<strong>${matchedCafe.name}</strong><br>${location}`;

  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&addressdetails=1`);
  const data = await response.json();

  if (data.length === 0) {
    resultDiv.innerHTML += "<br>Ingen karta kunde visas för denna adress.";
    return;
  }

  const { lat, lon } = data[0];

  if (map) {
    map.setView([lat, lon], 14);
  } else {
    map = L.map('map').setView([lat, lon], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  if (window.lastMarker) {
    map.removeLayer(window.lastMarker);
  }

  window.lastMarker = L.marker([lat, lon]).addTo(map)
    .bindPopup(`${matchedCafe.name}<br>${location}`)
    .openPopup();
}
