const mewcanvas = document.getElementById("mew");
const jonnycanvas = document.getElementById("johnny");
const auracanvas = document.getElementById("aura");
const toiletcanvas = document.getElementById("toilet");
const pennycanvas = document.getElementById("penny");
const snp5canvas = document.getElementById("snp5");

let aura = +localStorage.getItem("aura") || 0, auraPerClick = 1, auraPerSecond = 0;
let lastClickTimes = [];
const MAX_CPS = 25;// clicks per second
const MAX_LEGAL_CLICK_POWER = 30000;
let cheatAttempts = 0;

const generators = [
{name: "Person", amount: 0, baseCost: 100, auraGain: 1, scale: 1.07},
{name: "Skibidi Toilet", amount: 0, baseCost: 600, auraGain: 5, scale: 1.05},
{name: "Mewer", amount: 0, baseCost: 1100, auraGain: 10, scale: 1.045},
{name: "Auto Mewer", amount: 0, baseCost: 6900, auraGain: 69, scale: 1.05},
{name: "Sigma Mewer", amount: 0, baseCost: 12000, auraGain: 100, scale: 1.04},
{name: "Skibidi Sigma", amount: 0, baseCost: 18690, auraGain: 169, scale: 1.035},
{name: "Zhengxian Mewer", amount: 0, baseCost: 69690, auraGain: 500, scale: 1.035},
{name: "Caden Mewer", amount: 0, baseCost: 900000, auraGain: 6969, scale: 1.03},
{name: "Sigma Caden", amount: 0, baseCost: 1069690, auraGain: 10000, scale: 1.025},
{name: "Sigma Zhengxian", amount: 0, baseCost: 2000000, auraGain: 16969, scale: 1.02},
{name: "Xuhui Mewer", amount: 0, baseCost: 100000000, auraGain: 69690, scale: 1.03},
{name: "Mutated Xuhui", amount: 0, baseCost: 5000000000, auraGain: 3000000, scale: 1.025},
{name: "Geometry Darsh", amount: 0, baseCost: 999999999, auraGain: 10000000, scale: 1.025}
];

const upgrades = [
{name: "Grind SLS (x2 click)", cost: 1000, effect: () => auraPerClick *= 2, bought: false},
{name: "Persons x2", cost: 1500, effect: () => generators[0].auraGain *= 2, bought: false},
{name: "Xinyuan helps (x5 click)", cost: 4000, effect: () => auraPerClick *= 5, bought: false},
{name: "Skibidi Toilets x2", cost: 30000, effect: () => generators[1].auraGain *= 2, bought: false},
{name: "Click +15", cost: 50000, effect: () => auraPerClick += 15, bought: false},
{name: "Mewers x1.5", cost: 60000, effect: () => generators[2].auraGain *= 1.5, bought: false},
{name: "Ziheng helps (x1.5 click)", cost: 500000, effect: () => auraPerClick *= 1.5, bought: false},
{name: "Johnny helps (x4 click)", cost: 10000000, effect: () => auraPerClick *= 4, bought: false},
{name: "Sigma skibidi x2", cost: 10000000, effect: () => generators[5].auraGain *= 2, bought: false},
{name: "Sigma Caden x2", cost: 500000000, effect: () => generators[8].auraGain *= 2, bought: false},
{name: "YUSU helps (x10 click)", cost: 2000000000, effect: () => auraPerClick *= 10, bought: false},
{name: "Yuansan helps (x10 click)", cost: 9000000000, effect: () => auraPerClick *= 10, bought: false},
{name: "Xuhui upgrade", cost: 90909090909, effect: () => generators[10].auraGain *= 2.5, bought: false} ,
{name: ":Shreyas Helps", cost: 90909090969, effect: () => auraPerClick *= 5, bought: false},
{name: "Uno Reverse", cost: 694206942069, effect: () => auraPerClick *= 9999, bought: false},
{name: "Mental Stability", cost: 83294783798, effect: () => auraPerClick *=8, bought: false},
{name: "Darsh Helps", cost: 100, effect: ()=> auraPerClick **=2, bought: false}
];

const stocks = [
{name: "Mew Corp", price: 100, high: 100, low: 100, last: 100}, // = (s,i)
{name: "Johnny stocks", price: 2, high: 2, low: 2, last: 2},
{name: "AuraBank", price: 85, high: 85, low: 85, last: 85},
{name: "Toilet Inc.", price: 120, high: 120, low: 120, last: 120},
{name: "M25106 Penny", price: 15, high: 15, low: 15, last: 15},
{name: "S&P 5", price: 64, high: 64, low: 64, last: 64}
];

let stockOwned = Array(stocks.length).fill(0);

document.getElementById("click-btn").onclick = () => {
  const now = Date.now();
  lastClickTimes.push(now);
  lastClickTimes = lastClickTimes.filter(t => now - t < 1000);// last 1 sec
  
  // Check CPS
  if (lastClickTimes.length > MAX_CPS) {
    cheatAttempts++;
    alert("⚠️ Too many clicks per second! Slow down otherwise the game will be disabled!");
    if (cheatAttempts >= 2) {
      document.getElementById("click-btn").disabled = true;
      document.getElementById("click-btn").style.backgroundColor = "rgba(255, 234, 167,0.5)";
      alert("🚫 Clicker disabled due to suspicious activity.");
      aura = 0;
    }
    return;
  }
  
  // Check for click power cheat
  if (auraPerClick > MAX_LEGAL_CLICK_POWER) {
    cheatAttempts++;
    alert("⚠️ Invalid click power! Are you trying to cheat?");
    if (cheatAttempts >= 3) {
      document.getElementById("click-btn").disabled = true;
      alert("🚫 Clicker disabled due to suspicious activity.");
    }
    return;
  }
  
  // All good
  aura += auraPerClick;
  updateUI();
};

function buyGen(i) {
  const g = generators[i];
  const cost = Math.round(g.baseCost * Math.pow(g.scale, g.amount));
  if (aura >= cost) {
    aura -= cost;
    g.amount++;
    updateAuraPerSecond();
    updateUI();
  }
}

function buyUpgrade(i) {
  const u = upgrades[i];
  if (!u.bought && aura >= u.cost) {
    aura -= u.cost;
    u.bought = true;
    u.effect();
    updateAuraPerSecond();
    updateUI();
  }
}

function updateAuraPerSecond() {
  auraPerSecond = generators.reduce((sum, g) => sum + g.amount * g.auraGain, 0);
}

function updateUI() {
  document.getElementById("aura-display").textContent =
  `Aura: ${Math.floor(aura)} (APS: ${Math.round(auraPerSecond)})`;
  
  document.getElementById("click-btn").textContent = `+${auraPerClick} Aura`;
  
  renderShop();
  renderUpgrades();
  renderStocks();
}

function renderShop() {
  const shop = document.getElementById("shop-list");
  shop.innerHTML = "";
  generators.forEach((g, i) => {
    const cost = Math.round(g.baseCost * Math.pow(g.scale, g.amount));
    shop.innerHTML += `
    <div class="item">
      <div><strong>${g.name}</strong> (${g.amount})<br>+${g.auraGain.toLocaleString()}/s — Cost: ${cost.toLocaleString()}</div>
      <button onclick="buyGen(${i})">Buy</button>
    </div>`;
  });
}

function renderUpgrades() {
  const list = document.getElementById("upgrade-list");
  list.innerHTML = "";
  upgrades.forEach((u, i) => {
    if (!u.bought) {
      list.innerHTML += `
        <div class="upgrade">
          <div><strong>${u.name}</strong><br>Cost: ${u.cost.toLocaleString()}</div>
          <button onclick="buyUpgrade(${i})">Buy</button>
        </div>`;
    }
  });
}

function renderStocks() {
  const youowns = document.querySelectorAll(".Stocks span");
  youowns.forEach((span, i) => {
    span.textContent = `You own: ${stockOwned[i] || 0}`;
  });
}

function buyStock(i) {
  const s = stocks[i];
  if (aura >= s.price) {
    aura -= s.price;
    stockOwned[i] = (stockOwned[i] || 0) + 1;
    updateUI();
  }
}

function sellStock(i) {
  if (stockOwned[i] > 0) {
    aura += stocks[i].price;
    stockOwned[i]--;
    updateUI();
  }
}

setInterval(() => {
  aura += auraPerSecond / 10;
  document.getElementById("aura-display").textContent =
  `Aura: ${Math.floor(aura)} (APS: ${Math.round(auraPerSecond)})`;
  
  document.getElementById("click-btn").textContent = `+${auraPerClick} Aura`;
  renderStocks();
}, 100);

const input = document.querySelector("input")

let MAX_POINTS = input.value / 2; // 2 minutes at 2s interval (60 * 2s = 120s = 2min)
let labels = [0];

const scales = {
  x: {
    ticks: { color: "#fff" }, // Change to your desired color
    title: { color: "#fff" }
  },
  y: {
    ticks: { color: "#fff" },
    title: { color: "#fff" }
  }
}

function charts(canvasname, canvaslabel, initialprice, stocknumber, color) {
  return new Chart(canvasname, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: canvaslabel,
        data: [initialprice],
        borderColor: color
      }]
    },
    options: {
      tension: 0.5,
      scales: scales,
      plugins: {
        annotation: {
          annotations: {
            high: {
              type: "line",
              yMin: stocks[stocknumber].high,
              yMax: stocks[stocknumber].high,
              borderColor: color,
              borderWidth: 2,
              label: {
                content: 'High',
                enabled: true,
                position: 'start'
              }
            },
            low: {
              type: "line",
              yMin: stocks[stocknumber].low,
              yMax: stocks[stocknumber].low,
              borderColor: color,
              borderWidth: 2,
              label: {
                content: 'Low',
                enabled: true,
                position: 'start'
              }
            }
          }
        }
      }
    }
  })
}

const mewchart = charts(mewcanvas, 'Mew Corp', 100, 0, "#36a2eb");
const johnnychart = charts(jonnycanvas, 'Johnny stocks', 2, 1, "#3da033");
const aurachart = charts(auracanvas, 'AuraBank', 85, 2, "#894623");
const toiletchart = charts(toiletcanvas, 'Toilet Inc', 120, 3, "#9678ff");
const pennychart = charts(pennycanvas, 'M25106 Penny', 15, 4, "#dfbb56");
const snp5chart = charts(snp5canvas, 'S&P 5', 64, 5, "#3b48d8");


const chartnums = [
  [mewchart, 0],
  [johnnychart, 1],
  [aurachart, 2],
  [toiletchart, 3],
  [pennychart, 4],
  [snp5chart, 5]
]
// Update chart data in setInterval
setInterval(() => {
  [stocks].forEach(list => {
    list.forEach((s, i) => {
      s.last = s.price;
      if (i < 5) { // Only randomize the first 5 stocks
        const change = Math.floor(Math.random() * 11 - 5);
        s.price += change;
        if (s.price < 1) s.price = 1;
        if (s.price > s.high) s.high = s.price;
        if (s.price < s.low) s.low = s.price;
      }
      // S&P 5 (i == 5) is handled separately below
    });
  });

  // Calculate S&P 5 as the rounded average of the other stocks
  stocks[5].price = Math.round(
    stocks.slice(0, 5).reduce((sum, s) => sum + s.price, 0) / 5
  );
  if (stocks[5].price > stocks[5].high) stocks[5].high = stocks[5].price;
  if (stocks[5].price < stocks[5].low) stocks[5].low = stocks[5].price;

  // Add new data points
  labels.push(labels[labels.length - 1] + 2);

  MAX_POINTS = input.value / 2; // Update max points based on input value
  // Keep only the last MAX_POINTS points
  if (labels.length > MAX_POINTS) {
    labels.shift();
    chartnums.forEach(([chart]) => {
      chart.data.datasets[0].data.shift();
    })
  }

  // DRY: Update chart annotation lines for all charts/stocks in a loop
  chartnums.forEach(([chart, idx]) => {
    chart.data.datasets[0].data.push(stocks[idx].price);
    chart.options.plugins.annotation.annotations.high.yMin = stocks[idx].high;
    chart.options.plugins.annotation.annotations.high.yMax = stocks[idx].high;
    chart.options.plugins.annotation.annotations.low.yMin = stocks[idx].low;
    chart.options.plugins.annotation.annotations.low.yMax = stocks[idx].low;
  });
  
  chartnums.forEach(([chart]) => {
    chart.data.labels = labels;
    chart.update();
  })

  renderStocks();

  console.log()

  localStorage.setItem("aura", aura);
}, 2000);

// function detectCheat() {
//   if (Math.abs(aura - lastAuraCheck) > auraPerSecond * 20 + auraPerClick * MAX_CPS * 5) {
//     cheatAttempts++;
//     alert("⚠️ Cheating detected! Game reset imminent if continued.");
//     if (cheatAttempts > 2) {
//       localStorage.clear();
//       location.reload();
//     }
//   }
//   lastAuraCheck = aura;
// }

// setInterval(detectCheat, 5000);
updateAuraPerSecond();
updateUI();