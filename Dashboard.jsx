import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Repeat, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [prices, setPrices] = useState({});
  const [error, setError] = useState(false);

  const holdings = {
    XRP: { amount: 3956.99816, cost: 2.21 },
    BTC: { amount: 0.01609, cost: 83833.14 },
    ETH: { amount: 0.31442, cost: 2367.47 },
    ADA: { amount: 419.873185, cost: 0.7526 },
    SOL: { amount: 1.092, cost: 137.5 }
  };

  const coinIds = {
    XRP: "ripple",
    BTC: "bitcoin",
    ETH: "ethereum",
    ADA: "cardano",
    SOL: "solana"
  };

  useEffect(() => {
    const query = Object.values(coinIds).join(",");
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${query}&vs_currencies=usd`)
      .then(res => res.json())
      .then(data => {
        const updated = {};
        for (let key in coinIds) {
          const id = coinIds[key];
          updated[key] = data[id]?.usd ?? null;
        }
        setPrices(updated);
      })
      .catch(() => setError(true));
  }, []);

  const formatCurrency = (num) =>
    num?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ?? "—";

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        <TrendingUp size={20} color="green" /> Portfolio Overview
      </h2>
      {Object.entries(holdings).map(([coin, data]) => {
        const price = prices[coin];
        const value = data.amount * (price || 0);
        const cost = data.amount * data.cost;
        const gain = value - cost;
        const roi = cost ? (gain / cost) * 100 : 0;

        return (
          <div key={coin} style={{ marginTop: "1rem" }}>
            <h3>{coin}</h3>
            <p>Price: {formatCurrency(price)}</p>
            <p>Holdings: {data.amount}</p>
            <p>Value: {formatCurrency(value)}</p>
            <p>Cost Basis: {formatCurrency(cost)}</p>
            <p>Gain: {formatCurrency(gain)} ({roi.toFixed(2)}%)</p>
          </div>
        );
      })}
      <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#666" }}>
        <AlertCircle size={14} color="orange" /> Alerts to: lambert1905@gmail.com
      </div>
    </div>
  );
}
