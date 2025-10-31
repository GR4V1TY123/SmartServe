import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { TrendingUp, TrendingDown, DollarSign, Package, PieChart, Clock } from "lucide-react";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  // Example Data
  const stats = {
    orders: 1520,
    surplus: "8%",
    profit: "₹12,450",
    loss: "₹1,230",
    revenue: "₹45,680",
    revenueGrowth: "+12.5%",
  };

  // Trend of Orders (Line)
  const orderTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [180, 210, 250, 230, 260, 300, 280],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Revenue Trend
  const revenueTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [5200, 6100, 7200, 6800, 7500, 8600, 8200],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Common Items Consumed vs Leftover (Bar)
  const itemsData = {
    labels: ["Rice", "Dal", "Roti", "Sabzi", "Egg", "Pav"],
    datasets: [
      {
        label: "Consumed",
        data: [300, 280, 250, 260, 200, 150],
        backgroundColor: "#2563eb",
        borderRadius: 8,
        barThickness: 24,
      },
      {
        label: "Leftover",
        data: [40, 25, 20, 30, 15, 10],
        backgroundColor: "#93c5fd",
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  // Most Orders by Time
  const timeData = {
    labels: ["8AM", "10AM", "12PM", "2PM", "4PM"],
    datasets: [
      {
        label: "Orders",
        data: [80, 150, 300, 240, 180, 100],
        backgroundColor: "#2563eb",
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };

  // Revenue Distribution
  const revenueDistribution = {
    labels: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    datasets: [
      {
        data: [8500, 18200, 15300, 3680],
        backgroundColor: ["#3b82f6", "#2563eb", "#1e40af", "#93c5fd"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { 
          color: "#475569",
          font: { size: 12, weight: 500 },
          padding: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "#64748b", font: { size: 11 } },
        grid: { color: "#f1f5f9" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Canteen Dashboard</h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.revenue}</p>
              <p className="text-xs text-green-600 mt-1 font-medium">{stats.revenueGrowth}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Surplus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.surplus}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Profit</p>
              <p className="text-2xl font-bold text-green-600">{stats.profit}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Loss</p>
              <p className="text-2xl font-bold text-red-600">{stats.loss}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                Orders Trend
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Last 7 days performance</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={orderTrendData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-green-600 rounded-full"></div>
                Revenue Trend
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Weekly revenue overview</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line 
                  data={revenueTrendData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        ticks: {
                          ...chartOptions.scales.y.ticks,
                          callback: function(value) {
                            return '₹' + value;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                Items: Consumed vs Leftover
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Inventory utilization</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={itemsData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                Revenue by Meal
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Distribution breakdown</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={revenueDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: "#475569",
                          font: { size: 11, weight: 500 },
                          padding: 12,
                          usePointStyle: true,
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              Orders by Time of Day
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">Peak hours analysis</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar 
                data={timeData} 
                options={{
                  ...chartOptions,
                  plugins: { legend: { display: false } },
                }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}