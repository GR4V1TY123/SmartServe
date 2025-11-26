import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, ArcElement
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    profit: 0,
    revenue: 0,
  });
  const [menuPerformance, setMenuPerformance] = useState([]);
  const [itemUsage, setItemUsage] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    // 🧾 Fetch Orders
    const { data: ordersData } = await supabase
      .from("Orders")
      .select("amount, quantity, menu_id, created_at")
      .gte("created_at", `${today}T00:00:00Z`)
      .lte("created_at", `${today}T23:59:59Z`);

    const totalOrders = ordersData?.length || 0;
    const totalRevenue =
      ordersData?.reduce((s, o) => s + (o.amount || 0), 0) || 0;

    // 🍛 Menu performance (sales by item)
    const { data: menuPerf } = await supabase
      .from("Menu")
      .select("item, sold_today, price");

    // 💰 Calculate profit (for simplicity assume profit = 30% of revenue)
    const profit = totalRevenue * 0.3;

    // Update stats
    setStats({
      orders: totalOrders,
      profit: profit,
      revenue: totalRevenue,
    });

    // 🍽️ Top Selling Items
    const topSell =
      menuPerf
        ?.map((m) => ({
          item: m.item,
          totalSales: (m.sold_today || 0) * (m.price || 0),
        }))
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 5) || [];

    setTopSelling(topSell);
    setMenuPerformance(menuPerf || []);

    // 🍶 Ingredient usage (mock if needed)
    const { data: ingredients } = await supabase
      .from("Ingredients")
      .select("name, remaining_ingredient");

    setItemUsage(
      ingredients
        ?.map((ing) => ({
          name: ing.name,
          quantity: ing.remaining_ingredient,
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5) || []
    );

    // 📊 Revenue chart
    setRevenueData([
      { label: "Revenue", value: totalRevenue },
      { label: "Profit", value: profit },
    ]);

    setLoading(false);
  };

  // ⚙️ Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#475569" } } },
    scales: {
      x: { ticks: { color: "#64748b" }, grid: { display: false } },
      y: { ticks: { color: "#64748b" }, grid: { color: "#f1f5f9" } },
    },
  };

  // 💰 Revenue Chart
  const revenueChart = {
    labels: revenueData.map((d) => d.label),
    datasets: [
      {
        label: "Amount (₹)",
        data: revenueData.map((d) => d.value),
        backgroundColor: ["#10b981", "#3b82f6"],
        borderRadius: 6,
        barThickness: 60,
      },
    ],
  };

  // 🍛 Menu Performance Chart
  const menuPerformanceData = {
    labels: menuPerformance.map((m) => m.item),
    datasets: [
      {
        data: menuPerformance.map(
          (m) => (m.sold_today || 0) * (m.price || 0)
        ),
        backgroundColor: [
          "#3b82f6",
          "#2563eb",
          "#1e40af",
          "#10b981",
          "#f97316",
        ],
        borderWidth: 0,
      },
    ],
  };

  // ⭐ Top Selling Items Chart
  const topSellingChart = {
    labels: topSelling.map((t) => t.item),
    datasets: [
      {
        label: "Sales (₹)",
        data: topSelling.map((t) => t.totalSales),
        backgroundColor: "#60a5fa",
        borderRadius: 6,
      },
    ],
  };

  // 🧂 Ingredient Usage Chart
  const itemUsageChart = {
    labels: itemUsage.map((i) => i.name),
    datasets: [
      {
        label: "Remaining Qty",
        data: itemUsage.map((i) => i.quantity),
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Today’s Canteen Dashboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading today's data...</p>
        ) : (
          <>
            {/* ✅ Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.orders}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{stats.revenue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{stats.profit.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 📊 Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar data={revenueChart} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Menu Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut data={menuPerformanceData} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar data={topSellingChart} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingredient Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar data={itemUsageChart} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
