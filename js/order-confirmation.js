const params = new URLSearchParams(window.location.search);
const ref = params.get("ref");

const okState = document.getElementById("confirmationOk");
const missingState = document.getElementById("confirmationMissing");

if (ref) {
  okState.hidden = false;
  missingState.hidden = true;
  document.getElementById("orderRef").textContent = ref;
} else {
  okState.hidden = true;
  missingState.hidden = false;
}
