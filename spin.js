const sectors = [
  { color: "#F8D6A9", text: "#333333", label: "Yes" },
  { color: "#D6C1FF", text: "#333333", label: "No" },
  { color: "#F8D6A9", text: "#333333", label: "Yes" },
  { color: "#D6C1FF", text: "#333333", label: "No" },
  { color: "#F8D6A9", text: "#333333", label: "Yes" },
  { color: "#D6C1FF", text: "#333333", label: "No" },
  { color: "#F8D6A9", text: "#333333", label: "Yes" },
  { color: "#D6C1FF", text: "#333333", label: "No" },
];

const events = {
  listeners: {},
  addListener(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire(eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) fn(...args);
    }
  },
};

const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const canvas = document.querySelector("#wheel");
const ctx = canvas.getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / tot;

let ang = 0;
let spinning = false;

// Find YES index
const yesIndex = sectors.findIndex(
  (s) => String(s.label).toLowerCase() === "yes"
);

if (yesIndex === -1) {
  throw new Error("No 'Yes' label found in sectors!");
}

// center of YES slice
const targetAngle = (yesIndex + 0.5) * (TAU / tot);

// pointer is at top
const targetRotation = TAU - targetAngle;

function getIndex() {
  return ((Math.floor(tot - (ang / TAU) * tot) % tot) + tot) % tot;
}

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 30px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  spinEl.textContent = !spinning ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function draw() {
  ctx.clearRect(0, 0, dia, dia);
  sectors.forEach(drawSector);
  rotate();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spin() {
  if (spinning) return;
  spinning = true;

  const spins = 6;          // full spins
  const duration = 5000;    // 5 seconds

  const start = performance.now();
  const startAngle = ang;

  // Make sure the final angle is always ahead of current angle
  // so it can spin multiple times
  const endAngle = startAngle + spins * TAU + (targetRotation - (startAngle % TAU));

  function animate(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);

    ang = startAngle + (endAngle - startAngle) * eased;
    draw();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      events.fire("spinEnd", sectors[yesIndex]);
    }
  }

  requestAnimationFrame(animate);
}

function init() {
  draw();
  spinEl.addEventListener("click", spin);
}

init();

events.addListener("spinEnd", (sector) => {
  console.log(`Woop! You won ${sector.label}`);
});



events.addListener("spinEnd", () => {
  const again = confirm("Yay! It's YES 😍\n\nDo you want to go to the next page?");
  if (again) {
    window.location.href = "yes.html"; 
  } else {
    window.location.reload();   // spin again
    // go to YES page
  }
});
