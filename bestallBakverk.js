function isTimeValid(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (hours < 10 || hours > 17) return false;
  if (hours === 17 && minutes > 0) return false;
  return true;
}

function formatDateToLocalISO(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function showError(input, message) {
  let errorElem = input.nextElementSibling;
  if (!errorElem || !errorElem.classList.contains('error-message')) {
    errorElem = document.createElement('div');
    errorElem.className = 'error-message';
    input.parentNode.insertBefore(errorElem, input.nextSibling);
  }
  errorElem.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  let errorElem = input.nextElementSibling;
  if (errorElem && errorElem.classList.contains('error-message')) {
    errorElem.textContent = '';
  }
  input.removeAttribute('aria-invalid');
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

  upphamtningDatum.addEventListener('input', () => {
    if (upphamtningDatum.value < upphamtningDatum.min) {
      showError(upphamtningDatum, 'Datum måste vara minst 3 dagar fram i tiden.');
    } else {
      clearError(upphamtningDatum);
    }
  });

  upphamtningTid.addEventListener('input', () => {
    if (!isTimeValid(upphamtningTid.value)) {
      showError(upphamtningTid, 'Tid måste vara mellan 10:00 och 17:00.');
    } else {
      clearError(upphamtningTid);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    messageBox.textContent = "";
    messageBox.className = "form-message";

    if (!form.namn.value.trim()) {
      showError(form.namn, 'Ange ditt namn.');
      messageBox.textContent = "❌ Namn är obligatoriskt.";
      messageBox.classList.add("error");
      return;
    } else {
      clearError(form.namn);
    }

    const telefonVal = form.telefon.value.trim();
    if (!/^\d{10}$/.test(telefonVal)) {
      showError(form.telefon, 'Telefonnummer måste innehålla exakt 10 siffror.');
      messageBox.textContent = "❌ Vänligen ange ett giltigt telefonnummer med 10 siffror.";
      messageBox.classList.add("error");
      return;
    } else {
      clearError(form.telefon);
    }

    if (!form.email.checkValidity()) {
      showError(form.email, 'Ange en giltig e-postadress.');
      messageBox.textContent = "❌ Vänligen ange en giltig e-postadress.";
      messageBox.classList.add("error");
      return;
    } else {
      clearError(form.email);
    }

    if (upphamtningDatum.value < upphamtningDatum.min) {
      showError(upphamtningDatum, 'Datum måste vara minst 3 dagar fram i tiden.');
      messageBox.textContent = "❌ Vänligen välj ett datum som är minst 3 dagar framåt i tiden.";
      messageBox.classList.add("error");
      return;
    } else {
      clearError(upphamtningDatum);
    }

    if (!isTimeValid(upphamtningTid.value)) {
      showError(upphamtningTid, 'Tid måste vara mellan 10:00 och 17:00.');
      messageBox.textContent = "❌ Vänligen välj en tid mellan 10:00 och 17:00.";
      messageBox.classList.add("error");
      return;
    } else {
      clearError(upphamtningTid);
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
      const res = await fetch("https://projektbackendapi.onrender.com/api/bestallningar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        messageBox.textContent = "✅ Tack för din beställning! Vi kommer kontakta dig vid frågor kring eventuella önskemål";
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
