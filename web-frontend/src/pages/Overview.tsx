import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    ClipboardList,
    UtensilsCrossed,
    TrendingUp,
    Users,
    Clock,
    Leaf,
    Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MiniCalendar from "../components/miniCalendar";

export default function Overview() {
    const [time, setTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const navigate = useNavigate();

    const stats = {
        predictedDemand: 120,
        totalOrders: 95,
        completedOrders: 78,
        pendingOrders: 17,
        surplus: 10, // extra meals left
        shortage: 5, // missed due to demand spike
    };

    return (
        <div className="p-8 bg-blue-50 min-h-screen">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-blue-800">Canteen Overview</h1>
                <p className="text-gray-600 text-sm mt-1">
                    A detailed snapshot of today’s operations, menu insights, and order performance.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 items-start">
                <div className="flex flex-col justify-start bg-white shadow-md rounded-xl p-4 border border-gray-100">
                    {/* Header */}

                    <div className="p-2 m-2 rounded-xl bg-white flex flex-col items-center justify-center space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-5xl font-semibold tracking-wide">
                                {time.toLocaleTimeString("en-IN")}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                            Current Time
                        </p>
                    </div>


                    {/* Date & Time */}
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                        <span>
                            <strong>{time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong>
                        </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-2 text-center">
                        <div className="bg-blue-50 rounded-lg p-2">
                            <p className="text-m text-gray-700 font-bold">Predicted Demand</p>
                            <p className="font-semibold text-blue-700">{stats.predictedDemand}</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-m text-gray-700 font-bold">Total Orders</p>
                            <p className="font-semibold text-green-700">{stats.totalOrders}</p>
                        </div>

                        <div className="bg-emerald-50 rounded-lg p-2 font-bold">
                            <p className="text-m text-gray-700">Completed</p>
                            <p className="font-semibold text-emerald-700">{stats.completedOrders}</p>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-2 font-bold">
                            <p className="text-m text-gray-700">Pending</p>
                            <p className="font-semibold text-yellow-700">{stats.pendingOrders}</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-2 font-bold">
                            <p className="text-m text-gray-700">Surplus</p>
                            <p className="font-semibold text-purple-700">{stats.surplus}</p>
                        </div>

                        <div className="bg-red-50 rounded-lg p-2 font-bold">
                            <p className="text-m text-gray-700">Shortage</p>
                            <p className="font-semibold text-red-700">{stats.shortage}</p>
                        </div>
                        <div className="col-span-full rounded-lg p-2 font-bold">
                            <p className="text-m text-gray-700">Normal Day</p>
                        </div>
                    </div>
                    
                </div>
                <div>
                    <MiniCalendar />
                </div>
            </div>




            {/* Key Stats Section */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">
                <Card className="border-blue-100 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-blue-700 text-lg">Orders Today</CardTitle>
                        <CardDescription>Number of total placed orders</CardDescription>
                    </CardHeader>
                    <CardContent className="text-4xl font-semibold text-blue-800">128</CardContent>
                </Card>

                <Card className="border-blue-100 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-blue-700 text-lg">Active Menu Items</CardTitle>
                        <CardDescription>Currently available vegetarian items</CardDescription>
                    </CardHeader>
                    <CardContent className="text-4xl font-semibold text-blue-800">10</CardContent>
                </Card>

                <Card className="border-blue-100 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-blue-700 text-lg">Surplus / Leftovers</CardTitle>
                        <CardDescription>Remaining cooked food for today</CardDescription>
                    </CardHeader>
                    <CardContent className="text-4xl font-semibold text-blue-800">5 kg</CardContent>
                </Card>

                <Card className="border-blue-100 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-blue-700 text-lg">Profit / Loss</CardTitle>
                        <CardDescription>Calculated after today’s sales</CardDescription>
                    </CardHeader>
                    <CardContent className="text-4xl font-semibold text-green-700">₹2,150</CardContent>
                </Card>
            </div>

            {/* Quick Navigation Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Dashboard */}
                <Card className="shadow-md border border-blue-100 bg-white hover:shadow-lg transition">
                    <CardHeader className="flex items-center space-x-3">
                        <BarChart3 className="text-blue-600" />
                        <CardTitle className="text-blue-700">Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            View analytics like total orders, peak order timings, popular food items, daily trends,
                            and income vs. expenditure visualizations. Perfect for identifying demand patterns.
                        </p>
                        <Button
                            onClick={() => navigate("/dashboard")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        >
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>

                {/* Orders */}
                <Card className="shadow-md border border-blue-100 bg-white hover:shadow-lg transition">
                    <CardHeader className="flex items-center space-x-3">
                        <ClipboardList className="text-blue-600" />
                        <CardTitle className="text-blue-700">Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Manage and track every order in real time — update preparation stages, notify users
                            once food is ready, and mark orders as completed or delayed.
                        </p>
                        <Button
                            onClick={() => navigate("/orders")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        >
                            Go to Orders
                        </Button>
                    </CardContent>
                </Card>

                {/* Menu */}
                <Card className="shadow-md border border-blue-100 bg-white hover:shadow-lg transition">
                    <CardHeader className="flex items-center space-x-3">
                        <UtensilsCrossed className="text-blue-600" />
                        <CardTitle className="text-blue-700">Menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Add, edit, or remove daily vegetarian menu items. Adjust prices, check nutritional
                            details, and mark dishes as available or sold out instantly.
                        </p>
                        <Button
                            onClick={() => navigate("/menu")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        >
                            Go to Menu
                        </Button>
                    </CardContent>
                </Card>

                {/* Suggestions Overview */}
                <Card className="shadow-md border border-blue-100 bg-white hover:shadow-lg transition">
                    <CardHeader className="flex items-center space-x-3">
                        <Lightbulb className="text-blue-700" />
                        <CardTitle className="text-blue-700">Smart Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Get AI-powered insights on reducing food waste, optimizing next-day menus, and improving
                            canteen efficiency. View daily, weekly, or monthly suggestions with live data and visual
                            analytics.
                        </p>
                        <Button
                            onClick={() => navigate("/suggestions")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        >
                            View Suggestions
                        </Button>
                    </CardContent>
                </Card>

            </div>

            {/* Insights Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <TrendingUp className="text-blue-600" />
                        <CardTitle className="text-blue-700">Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
                            <li>Peak order time: <strong>12:30 PM - 1:30 PM</strong></li>
                            <li>Most ordered dish: <strong>Masala Dosa</strong></li>
                            <li>Average order value: <strong>₹85</strong></li>
                            <li>Repeat customers: <strong>62%</strong></li>
                            <li>Best-performing day this week: <strong>Tuesday</strong></li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Leaf className="text-green-600" />
                        <CardTitle className="text-blue-700">Sustainability Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
                            <li>Plastic usage reduced by <strong>30%</strong> this month</li>
                            <li>Composted leftovers: <strong>3.5 kg</strong></li>
                            <li>Switched to eco-friendly packaging in <strong>80%</strong> of meals</li>
                            <li>Energy-efficient cooking appliances adopted</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Staff & Time Info */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Users className="text-blue-600" />
                        <CardTitle className="text-blue-700">Team Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700 mb-2">
                            The canteen team ensures smooth service and fast preparation during peak hours.
                        </p>
                        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                            <li>2 cooks, 1 assistant, 2 servers</li>
                            <li>Serving capacity: 150+ students per meal</li>
                            <li>Average prep time per order: 8 minutes</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Clock className="text-blue-600" />
                        <CardTitle className="text-blue-700">Canteen Timings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
                            <li><strong>Breakfast:</strong> 8:00 AM – 12:00 AM</li>
                            <li><strong>Lunch:</strong> 12:00 PM – 3:00 PM</li>
                            <li><strong>Snacks:</strong> 3:00 PM – 5:30 PM</li>
                            <li><strong>Closed:</strong> Sundays & Public Holidays</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
