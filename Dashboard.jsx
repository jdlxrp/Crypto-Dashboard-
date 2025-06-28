import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B10DC9"];

export default function Dashboard() {
  const [prices, setPrices] = useState({});
  const [history, setHistory] = useState([]);
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

    // Simulated history for chart
    const dummyHistory = [
      { day: 'Mon', XRP: 0.61, BTC: 70000, ETH: 3200 },
      { day: 'Tue', XRP: 0.66, BTC: 71500, ETH: 3300 },
      { day: 'Wed', XRP: 0.70, BTC: 72000, ETH: 3400 },
      { day: 'Thu', XRP: 0.73, BTC: 73500, ETH: 3500 },
      { day: 'Fri', XRP: 0.75, BTC: 74000, ETH: 3600 }
    ];
    setHistory(dummyHistory);
  }, []);

  const pieData = Object.entries(holdings).map(([coin, data]) => {
    const price = prices[coin] || 0;
    return {
      name: coin,
      value: parseFloat((price * data.amount).toFixed(2))
    };
  });

  const barData = Object.entries(holdings).map(([coin, data]) => {
    const price = prices[coin] || 0;
    const value = data.amount * price;
    const cost = data.amount * data.cost;
    const profit = value - cost;
    return {
      coin,
      profit: parseFloat(profit.toFixed(2))
    };
  });

  return (
    <div className="p-4 font-sans max-w-6xl mx-auto space-y-8">
      <h1 className="text-xl font-bold text-center">📊 XRP Multi-Asset Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Portfolio Value Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="font-semibold mb-2">Sample Price Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="XRP" stroke="#0088FE" />
              <Line type="monotone" dataKey="BTC" stroke="#00C49F" />
              <Line type="monotone" dataKey="ETH" stroke="#FFBB28" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Realized Profit (Estimate)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="coin" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {error && (
        <div className="text-red-500 font-semibold text-center">
          Error loading price data. Please check API or refresh.
        </div>
      )}
    </div>
  );
}
