class Currency {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}

class CurrencyConverter {
  constructor(apiUrl) {
    this.apiUrl = "api.frankfurter.app";
    this.currencies = [];
  }

  async getCurrencies(apiUrl) {
    const response = await fetch(`https://${this.apiUrl}/currencies`);
    const data = await response.json();

    const codes = Object.keys(data);
    this.currencies = codes.map((code) => new Currency(code, data[code]));
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    console.log(amount, fromCurrency.code, toCurrency.code);
    try {
      const response = await fetch(
        `https://${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`
      );
      const data = await response.json();
      return data.rates[toCurrency.code];
    } catch (error) {
      console.error("Error al realizar la conversión: ", error);
      return null;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("conversion-form");
  const resultDiv = document.getElementById("result");
  const fromCurrencySelect = document.getElementById("from-currency");
  const toCurrencySelect = document.getElementById("to-currency");

  const converter = new CurrencyConverter("https://api.frankfurter.app");

  await converter.getCurrencies();
  populateCurrencies(fromCurrencySelect, converter.currencies);
  populateCurrencies(toCurrencySelect, converter.currencies);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const fromCurrency = converter.currencies.find(
      (currency) => currency.code === fromCurrencySelect.value
    );
    const toCurrency = converter.currencies.find(
      (currency) => currency.code === toCurrencySelect.value
    );

    const convertedAmount = await converter.convertCurrency(
      amount,
      fromCurrency,
      toCurrency
    );

    console.log("El convertedAmount es: ", convertedAmount);

    if (convertedAmount !== null && !isNaN(convertedAmount)) {
      resultDiv.textContent = `${amount} ${
        fromCurrency.code
      } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
    } else {
      resultDiv.textContent = "Error al realizar la conversión.";
    }
  });

  function populateCurrencies(selectElement, currencies) {
    if (currencies) {
      currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = `${currency.code} - ${currency.name}`;
        selectElement.appendChild(option);
      });
    }
  }
});
