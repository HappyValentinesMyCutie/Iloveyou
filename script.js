document.getElementById("yesBtn").addEventListener("click", () => {
    document.getElementById("message").style.display = "block";
});

// NO repel logic
const noBtn = document.getElementById("noBtn");
let offsetX = 0, offsetY = 0;

document.addEventListener("mousemove", (e) => {
  const rect = noBtn.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const dist = Math.hypot(dx, dy);

  if (dist < 120) {
    offsetX -= dx * 0.4;
    offsetY -= dy * 0.4;

    // --- LIMITS (keep inside screen) ---
    const maxX = window.innerWidth - rect.width ;
    const maxY = window.innerHeight - rect.height; // 90% height limit

    offsetX = Math.max(-rect.left + 10, offsetX);
    offsetY = Math.max(-rect.top + 10, offsetY);

    offsetX = Math.min(maxX - rect.left, offsetX);
    offsetY = Math.min(maxY - rect.top, offsetY);

    noBtn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
});



const yesBtn = document.getElementById("yesBtn");

// YES button redirect to YES page
yesBtn.addEventListener("click", () => {
  window.location.href = "yes.html";
});

// NO button chase effect

