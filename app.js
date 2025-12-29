const API_URL = "https://open.er-api.com/v6/latest/";

const currencies = {
    RUB: "🇷🇺 Российский рубль",
    UAH: "🇺🇦 Украинская гривна",
    USD: "🇺🇸 Доллар США",
    EUR: "🇪🇺 Евро",
    BYN: "🇧🇾 Белорусский рубль",
    TRY: "🇹🇷 Турецкая лира"
};

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const resultDiv = document.getElementById("result");
const rateDiv = document.getElementById("rate");
const convertBtn = document.getElementById("convert");

for (const code in currencies) {
    fromSelect.add(new Option(currencies[code], code));
    toSelect.add(new Option(currencies[code], code));
}

fromSelect.value = "USD";
toSelect.value = "RUB";

convertBtn.onclick = async () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return;

    const from = fromSelect.value;
    const to = toSelect.value;

    resultDiv.textContent = "Загрузка…";
    rateDiv.textContent = "";

    try {
        const res = await fetch(API_URL + from);
        const data = await res.json();

        const rate = data.rates[to];
        const converted = (amount * rate).toFixed(2);

        resultDiv.textContent = `${converted} ${to}`;
        rateDiv.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    } catch {
        resultDiv.textContent = "Ошибка загрузки курса";
    }
};
