// 🚀 XRP Multi-Asset Dashboard - Core Layout with Editable Strategy and Chart Visuals

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B10DC9", "#FF69B4", "#6666FF"];

const TOKENS = [
  { symbol: "XRP", id: "ripple", amount: 3956.99816, cost: 2.21 },
  { symbol: "BTC", id: "bitcoin", amount: 0.01609, cost: 83833.14 },
  { symbol: "ETH", id: "ethereum", amount: 0.31442, cost: 2367.47 },
  { symbol: "ADA", id: "cardano", amount: 419.873185, cost: 0.7526 },
  { symbol: "SOL", id: "solana", amount: 1.092, cost: 137.5 }
];

export default function Dashboard() {
  const [prices, setPrices] = useState({});
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ids = TOKENS.map(t => t.id).join(",");
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      .then(res => res.json())
      .then(data => {
        const live = {};
        TOKENS.forEach(t => live[t.symbol] = data[t.id]?.usd || 0);
        setPrices(live);
      })
      .catch(() => setError(true));

    setHistory([
      { day: "Mon", XRP: 0.61, BTC: 70000, ETH: 3200 },
      { day: "Tue", XRP: 0.66, BTC: 71500, ETH: 3300 },
      { day: "Wed", XRP: 0.70, BTC: 72000, ETH: 3400 },
      { day: "Thu", XRP: 0.73, BTC: 73500, ETH: 3500 },
      { day: "Fri", XRP: 0.75, BTC: 74000, ETH: 3600 }
    ]);
  }, []);

  const pieData = TOKENS.map(t => ({
    name: t.symbol,
    value: +(prices[t.symbol] * t.amount).toFixed(2)
  }));

  const barData = TOKENS.map(t => {
    const value = prices[t.symbol] * t.amount;
    const cost = t.amount * t.cost;
    return { coin: t.symbol, profit: +(value - cost).toFixed(2) };
  });

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📈 Multi-Asset Portfolio</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Allocation by Value</h2>
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

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Realized Profit ($)</h2>
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
      </div>

      {/* Optional line chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Sample Price Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="XRP" stroke="#0088FE" />
            <Line type="monotone" dataKey="BTC" stroke="#00C49F" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {error && (
        <div className="text-red-500 text-center font-semibold">
          Error loading prices. Try refreshing.
        </div>
      )}
    </div>
  );
}
