"use client";
import { useEffect, useState } from "react";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [amount, setAmount] = useState(1);
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "d4d90b6f9c2856350cb61d439fefa3f2";

  // Fetch supported currencies
  useEffect(() => {
    fetch(`https://data.fixer.io/api/symbols?access_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrencies(Object.keys(data.symbols));
        }
      });
  }, []);

  const convertCurrency = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://data.fixer.io/api/latest?access_key=${API_KEY}&symbols=NGN,${targetCurrency}`,
      );
      const data = await res.json();

      if (!data.success) {
        alert("Conversion failed.");
        return;
      }

      const eurToNgn = data.rates["NGN"];
      const eurToTarget = data.rates[targetCurrency];

      const nairaToTarget = (amount / eurToNgn) * eurToTarget;
      setConvertedAmount(nairaToTarget.toFixed(2));
    } catch (err) {
      console.error(err);
      alert("Error converting currency.");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border p-6 shadow">
      <h1 className="mb-4 text-xl font-bold">Naira Currency Converter</h1>

      <div className="mb-3">
        <label className="mb-1 block font-medium">Amount (₦)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block font-medium">Convert to:</label>
        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          {currencies.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={convertCurrency}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white"
        disabled={loading}
      >
        {loading ? "Converting..." : "Convert"}
      </button>

      {convertedAmount && (
        <div className="mt-4 text-lg">
          ₦{amount} = {targetCurrency} {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
