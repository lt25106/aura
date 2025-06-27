mewcanvas = document.getElementById("mew");
jonnycanvas = document.getElementById("johnny");
auracanvas = document.getElementById("aura");
toiletcanvas = document.getElementById("toilet");
pennycanvas = document.getElementById("penny");

let aura = 0, auraPerClick = 1, auraPerSecond = 0;
let cryptoUnlocked = false;
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
{name: "Unlock Crypto Stocks 💎", cost: 10000000000, effect: () => cryptoUnlocked = true, bought: false},
{name: "Xuhui upgrade", cost: 90909090909, effect: () => generators[10].auraGain *= 2.5, bought: false} ,
{name: ":Shreyas Helps", cost: 90909090969, effect: () => auraPerClick *= 5, bought: false},
{name: "Uno Reverse", cost: 694206942069, effect: () => auraPerClick *= 9999, bought: false},
{name: "Mental Stability", cost: 83294783798, effect: () => auraPerClick *=8, bought: false},
{name: "Darsh Helps", cost: 100, effect: ()=> auraPerClick **=2, bought: false}
];

const stocks = [
{name: "Mew Corp", price: 100, high: 100, low: 100, last: 100},
{name: "Johnny stocks", price: 2, high: 2, low: 2, last: 2},
{name: "AuraBank", price: 85, high: 85, low: 85, last: 85},
{name: "Toilet Inc.", price: 120, high: 120, low: 120, last: 120},
{name: "M25106 Penny", price: 15, high: 15, low: 15, last: 15} 
];

const cryptoStocks = [
{name: "MewCoin", price: 500000, high: 500000, low: 500000, last: 500000},
{name: "XynCash", price: 800000, high: 800000, low: 800000, last: 800000},
{name: "CadenETH", price: 1300000, high: 1300000, low: 1300000, last: 1300000}
];

let stockOwned = Array(stocks.length).fill(0);
let cryptoOwned = Array(cryptoStocks.length).fill(0);

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
      <div><strong>${g.name}</strong> (${g.amount})<br>+${Intl.NumberFormat('en-US').format(g.auraGain)}/s — Cost: ${Intl.NumberFormat('en-US').format(cost)}</div>
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
          <div><strong>${u.name}</strong><br>Cost: ${Intl.NumberFormat('en-US').format(u.cost)}</div>
          <button onclick="buyUpgrade(${i})">Buy</button>
        </div>`;
    }
  });
}

function renderStocks() {
  const mode = document.getElementById("stock-mode").value;
  const stockList = document.getElementById("stock-list");
  const list = mode === "normal" ? stocks : cryptoStocks;
  const owned = mode === "normal" ? stockOwned : cryptoOwned;
  
  if (mode === "crypto" && !cryptoUnlocked) {
    stockList.innerHTML = "<p id='buycrypto'>Buy the crypto upgrade first!</p>";
    return;
  }
  
  stockList.innerHTML = "";
  list.forEach((s, i) => {
    const arrow = s.price > s.last ? "⬆️" : s.price < s.last ? "⬇️" : "➡️";
    stockList.innerHTML += `
      <div class="stock">
        <div>
          <strong>${s.name}</strong>: $${s.price} <span class="stock-arrow">${arrow}</span><br>
          High: $${s.high} | Low: $${s.low} | You own: ${owned[i] || 0}
        </div>
        <div>
          <button onclick="${mode === 'normal' ? `buyStock(${i})` : `buyCrypto(${i})`}">Buy</button>
          <button onclick="${mode === 'normal' ? `sellStock(${i})` : `sellCrypto(${i})`}">Sell</button>
        </div>
      </div>`;
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

function buyCrypto(i) {
  const s = cryptoStocks[i];
  if (aura >= s.price) {
    aura -= s.price;
    cryptoOwned[i] = (cryptoOwned[i] || 0) + 1;
    updateUI();
  }
}

function sellCrypto(i) {
  if (cryptoOwned[i] > 0) {
    aura += cryptoStocks[i].price;
    cryptoOwned[i]--;
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

const mewchart = new Chart(mewcanvas, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: 'Mew Corp',
      data: [100],
    }]
  },
  options: {
    tension: 0.5
  }
});

const johnnychart = new Chart(jonnycanvas, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: 'Johnny stocks',
      data: [2],
      borderColor: "#3da033"
    }]
  },
  options: {
    tension: 0.5
  }
});

const aurachart = new Chart(auracanvas, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: 'AuraBank',
      data: [85],
      borderColor: "#894623"
    }]
  },
  options: {
    tension: 0.5
  }
});

const toiletchart = new Chart(toiletcanvas, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: 'Toilet Inc',
      data: [120],
      borderColor: "#9678ff"
    }]
  },
  options: {
    tension: 0.5
  }
});

const pennychart = new Chart(pennycanvas, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: 'M25106 Penny',
      data: [15],
      borderColor: "#dfbb56"
    }]
  },
  options: {
    tension: 0.5
  }
});

// Update chart data in setInterval
setInterval(() => {
  [stocks, cryptoStocks].forEach(list => {
    list.forEach(s => {
      s.last = s.price;
      const change = Math.floor(Math.random() * 11 - 5);
      s.price += change;
      if (s.price < 1) s.price = 1;
      if (s.price > s.high) s.high = s.price;
      if (s.price < s.low) s.low = s.price;
    });
  });

  // Add new data points
  mewchart.data.datasets[0].data.push(stocks[0].price);
  johnnychart.data.datasets[0].data.push(stocks[1].price);
  aurachart.data.datasets[0].data.push(stocks[2].price);
  toiletchart.data.datasets[0].data.push(stocks[3].price);
  pennychart.data.datasets[0].data.push(stocks[4].price);
  labels.push(labels[labels.length - 1] + 2);


  MAX_POINTS = input.value / 2; // Update max points based on input value
  // Keep only the last MAX_POINTS points
  if (labels.length > MAX_POINTS) {
    labels.shift();
    mewchart.data.datasets[0].data.shift();
    johnnychart.data.datasets[0].data.shift();
    aurachart.data.datasets[0].data.shift();
    toiletchart.data.datasets[0].data.shift();
    pennychart.data.datasets[0].data.shift();
  }

  mewchart.data.labels = labels;
  johnnychart.data.labels = labels;
  aurachart.data.labels = labels;
  toiletchart.data.labels = labels;
  pennychart.data.labels = labels;

  mewchart.update();
  johnnychart.update();
  aurachart.update();
  toiletchart.update();
  pennychart.update();

  renderStocks();
}, 2000);

function detectCheat() {
  if (Math.abs(aura - lastAuraCheck) > auraPerSecond * 20 + auraPerClick * MAX_CPS * 5) {
    cheatAttempts++;
    alert("⚠️ Cheating detected! Game reset imminent if continued.");
    if (cheatAttempts > 2) {
      localStorage.clear();
      location.reload();
    }
  }
  lastAuraCheck = aura;
}

setInterval(detectCheat, 5000);
updateAuraPerSecond();
updateUI();

window.addEventListener("keydown", () => {
  localStorage.setItem("aura", aura);
});