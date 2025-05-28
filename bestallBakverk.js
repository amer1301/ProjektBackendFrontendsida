function isTimeValid(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (hours < 10 || hours > 17) return false;
  if (hours === 17 && minutes > 0) return false; // max 17:00 exakt
  return true;
}

function formatDateToLocalISO(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function initFormPage() {
  const form = document.getElementById("kontaktForm");
  const messageBox = document.getElementById("formMessage");
  const upphamtningDatum = form ? form.upphamtningDatum : null;
  const upphamtningTid = form ? form.upphamtningTid : null;

  if (!form || !messageBox || !upphamtningDatum || !upphamtningTid) return;

  const idag = new Date();
  idag.setHours(0,0,0,0);
  const minDatum = new Date(idag);
  minDatum.setDate(minDatum.getDate() + 3);
  upphamtningDatum.min = formatDateToLocalISO(minDatum);

  upphamtningTid.min = "10:00";
  upphamtningTid.max = "17:00";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    messageBox.textContent = "";
    messageBox.className = "form-message";

    if (upphamtningDatum.value < upphamtningDatum.min) {
      messageBox.textContent = "❌ Vänligen välj ett datum som är minst 3 dagar framåt i tiden.";
      messageBox.classList.add("error");
      return;
    }

    if (upphamtningTid.value < "10:00" || upphamtningTid.value > "17:00") {
      messageBox.textContent = "❌ Vänligen välj en tid mellan 10:00 och 17:00.";
      messageBox.classList.add("error");
      return;
    }

    const data = {
      namn: form.namn.value,
      telefon: form.telefon.value,
      email: form.email.value,
      bakverk: form.bakverk.value,
      antal: form.antal.value,
      meddelande: form.meddelande.value,
      upphamtning: `${upphamtningDatum.value} ${upphamtningTid.value.slice(0,5)} – ${form.upphamtningCafe.value}`,
    };

    try {
      const res = await fetch("http://localhost:5000/api/bestallningar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        messageBox.textContent = "✅ Beställning mottagen!";
        messageBox.classList.add("success");
        form.reset();
      } else {
        messageBox.textContent = "❌ Något gick fel. Försök igen.";
        messageBox.classList.add("error");
      }
    } catch (err) {
      console.error(err);
      messageBox.textContent = "❌ Kunde inte skicka. Kontrollera internetanslutning.";
      messageBox.classList.add("error");
    }
  });
}

initFormPage();
