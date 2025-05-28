import init, { Spinner } from "../pkg/spinner.js";

document.addEventListener("DOMContentLoaded", async () => {

  await init();

  const overlay = document.getElementById("modal-overlay");
  const modalMsg = document.getElementById("modal-message");
  const modalClose = document.getElementById("modal-close");

  function showModal(text) {
    modalMsg.textContent = text;
    overlay.classList.remove("hidden");
  }
  function hideModal() {
    overlay.classList.add("hidden");
  }

  modalClose.addEventListener("click", hideModal);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) hideModal();
  });

  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const R = canvas.width / 2;
  const twoPi = Math.PI * 2;
  const pointerAngle = Math.PI;

  const namesInput = document.getElementById("names-input");
  const winnersList = document.getElementById("winners-list");
  const spinButton = document.getElementById("spin");

  const baseColors = [
    '#FF5733', '#FF8C00', '#FFA500', '#FFD700',
    '#00BFFF', '#1E90FF', '#32CD32', '#00FA9A',
    '#FF1493', '#FF69B4', '#BA55D3', '#9400D3',
    '#00CED1', '#20B2AA'
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getNames() {
    return namesInput.value
      .split(/[,\n]+/)
      .map(n => n.trim())
      .filter(Boolean);
  }

  function drawWheel(spinner, names, colors) {
    const slice = twoPi / names.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rot = spinner.rotation();
    for (let i = 0; i < names.length; i++) {
      const start = rot + i * slice;
      const end = start + slice;
      ctx.beginPath();
      ctx.moveTo(R, R);
      ctx.arc(R, R, R - 5, start, end);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      ctx.save();
      ctx.translate(R, R);
      ctx.rotate(start + slice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(names[i], R - 10, 5);
      ctx.restore();
    }
  }

  function computeWinner(spinner, names) {
    const rot = ((spinner.rotation() % twoPi) + twoPi) % twoPi;
    const angleOnWheel = ((pointerAngle - rot) + twoPi) % twoPi;
    const idx = Math.floor(angleOnWheel / (twoPi / names.length));
    return names[idx];
  }

  const previewSpinner = { rotation: () => 0 };
  let previewColors = [];

  function refreshPreview() {
    const names = getNames();
    if (names.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    previewColors = shuffle(baseColors).slice(0, names.length);
    drawWheel(previewSpinner, names, previewColors);
  }

  namesInput.addEventListener("input", refreshPreview);
  refreshPreview();

  spinButton.addEventListener("click", () => {
    const names = getNames();
    if (names.length === 0) {
      alert("Please enter at least one name (comma- or newline-separated).");
      return;
    }

    const colors = shuffle(baseColors).slice(0, names.length);
    const spinner = new Spinner(names);

    function animate() {
      spinner.update();
      drawWheel(spinner, names, colors);
      if (spinner.velocity() > 0.001) {
        requestAnimationFrame(animate);
      } else {
        const winner = computeWinner(spinner, names);
        showModal(`${winner}`)

        const remaining = names.filter(n => n !== winner);
        namesInput.value = remaining.join("\n");
        winnersList.value += winner + "\n";

        refreshPreview();
      }
    }

    spinner.start();
    requestAnimationFrame(animate);
  });
})();