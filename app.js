Telegram.WebApp.ready();
Telegram.WebApp.expand();

const API_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_TIME = 60 * 60 * 1000;

let rates = {};

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const result = document.getElementById("result");
const rate = document.getElementById("rate");

async function loadRates() {
    const cache = JSON.parse(localStorage.getItem("ratesCache") || "{}");

    if (cache.time && Date.now() - cache.time < CACHE_TIME) {
        rates = cache.rates;
        initSelects();
        convert();
        return;
    }

    const res = await fetch(API_URL);
    const data = await res.json();

    rates = data.rates;

    localStorage.setItem("ratesCache", JSON.stringify({
        time: Date.now(),
        rates
    }));

    initSelects();
    convert();
}

function initSelects() {
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    Object.keys(rates).forEach(code => {
        fromSelect.add(new Option(code, code));
        toSelect.add(new Option(code, code));
    });

    fromSelect.value = "USD";
    toSelect.value = "EUR";

    amountInput.oninput = convert;
    fromSelect.onchange = convert;
    toSelect.onchange = convert;
}

function convert() {
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!amount) {
        result.textContent = "Введите сумму";
        rate.textContent = "";
        return;
    }

    const value = amount * (rates[to] / rates[from]);

    result.textContent = `${amount.toFixed(2)} ${from} = ${value.toFixed(2)} ${to}`;
    rate.textContent = `1 ${from} = ${(rates[to] / rates[from]).toFixed(4)} ${to}`;
}

function swap() {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    convert();
    Telegram.WebApp.HapticFeedback.impactOccurred("light");
}

loadRates();
