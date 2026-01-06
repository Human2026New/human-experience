// =========================
// TOKEN HUM — TONKEEPER
// =========================
const HUM_CONTRACT_ADDRESS =
  "EQCC2LH8-sEap7cfMZZIJOSVQ2aTWNUYIUEEKD8GeRYpB7oU";

const addHumBtn = document.getElementById("addHumTonkeeper");
if (addHumBtn) {
  addHumBtn.onclick = () => {
    const url =
      "https://app.tonkeeper.com/add-token?address=" +
      HUM_CONTRACT_ADDRESS;
    window.open(url, "_blank");
  };
}
