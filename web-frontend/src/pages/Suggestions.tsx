import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Leaf, Recycle, Utensils, Lightbulb, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Suggestions() {
    const [duration, setDuration] = useState("day");
    const [suggestions, setSuggestions] = useState({
        wasteReduction: [],
        nextDayMenu: [],
        operations: [],
    });

    const [chartData, setChartData] = useState({
        labels: ["Rice & Grains", "Vegetables", "Snacks", "Beverages"],
        datasets: [
            {
                label: "Food Waste (kg)",
                data: [2, 1.5, 0.8, 0.5],
                backgroundColor: ["#60A5FA", "#34D399", "#FBBF24", "#F87171"],
                borderWidth: 1,
            },
        ],
    });

    const priorities = {
        day: [
            {
                icon: <Recycle className="text-green-600 w-5 h-5" />,
                text: "Reuse leftover dal and rice for breakfast items tomorrow.",
                color: "text-green-700",
            },
            {
                icon: <Clock className="text-blue-600 w-5 h-5" />,
                text: "Prepare extra dosa batter before the 12–2 PM lunch rush.",
                color: "text-blue-700",
            },
            {
                icon: <AlertTriangle className="text-yellow-600 w-5 h-5" />,
                text: "Monitor chutney wastage — current rate 1.2 kg/day.",
                color: "text-yellow-700",
            },
        ],
        week: [
            {
                icon: <TrendingUp className="text-blue-600 w-5 h-5" />,
                text: "Retain top dishes: Masala Dosa, Paneer Roll, Veg Sandwich.",
                color: "text-blue-700",
            },
            {
                icon: <Recycle className="text-green-600 w-5 h-5" />,
                text: "Repurpose extra vegetables for soups and curries.",
                color: "text-green-700",
            },
            {
                icon: <AlertTriangle className="text-orange-600 w-5 h-5" />,
                text: "Reduce paratha dough prep by 20% based on weekly data.",
                color: "text-orange-700",
            },
        ],
        month: [
            {
                icon: <TrendingUp className="text-green-700 w-5 h-5" />,
                text: "Optimize vendor orders to cut 15% monthly food waste.",
                color: "text-green-800",
            },
            {
                icon: <Recycle className="text-blue-600 w-5 h-5" />,
                text: "Introduce ‘Zero Waste Friday’ combo using surplus items.",
                color: "text-blue-700",
            },
            {
                icon: <AlertTriangle className="text-red-600 w-5 h-5" />,
                text: "Review 3 low-demand items for potential replacement.",
                color: "text-red-700",
            },
        ],
    };

    useEffect(() => {
        // Simulate fetching data (replace with API later)


        const dummyData = {
            day: {
                wasteReduction: [
                    "Use leftover dal for khichdi or dal paratha during breakfast hours.",
                    "Track idli, dosa, and poha demand daily to avoid extra batter preparation.",
                    "Encourage reusable containers for takeaways to minimize disposable waste.",
                    "Use excess chopped vegetables to make mixed-veg curry for evening meals.",
                    "Sell leftover samosas or sandwiches at discounted rates near closing time.",
                ],
                nextDayMenu: [
                    "Keep Paneer Roll, Veg Sandwich, and Masala Dosa — they had highest sales today.",
                    "Reduce preparation of Poha and Lemon Rice; both had low demand today.",
                    "Add a light breakfast option like Upma or Veg Cutlet tomorrow for variety.",
                    "Include fresh juice of the day (e.g., Watermelon or Orange) based on fruit availability.",
                ],
                operations: [
                    "Peak hours: 12–2 PM. Ensure 2 extra staff during rush for billing and serving.",
                    "Reuse leftover chutneys and curries as base for soups or gravies the next day.",
                    "Ensure rice is soaked in correct proportion to avoid morning wastage.",
                    "Maintain temperature logs of food storage to ensure freshness for reuse.",
                ],
                chart: [2.3, 1.8, 1.1, 0.6], // Rice & grains, Vegetables, Snacks, Beverages
            },

            week: {
                wasteReduction: [
                    "Combine surplus items mid-week into new combo meals like ‘Mini Thali’ or ‘Canteen Special Plate’.",
                    "Reduce paratha dough preparation by 20% based on last week’s demand patterns.",
                    "Track perishable inventory like curd and paneer daily to avoid spoilage.",
                    "Encourage pre-ordering system during lunch breaks using digital tokens.",
                    "Offer discounts on items nearing expiry such as bread-based dishes.",
                ],
                nextDayMenu: [
                    "Masala Dosa, Veg Roll, and Paneer Butter Masala were top sellers this week — retain them.",
                    "Avoid repetitive items like Lemon Rice and Plain Idli which saw low uptake.",
                    "Add seasonal items like Corn Bhel or Veg Frankie to attract more customers.",
                    "Introduce a healthy combo option with salad or fresh juice for students preferring light meals.",
                ],
                operations: [
                    "Plan ingredient procurement every Wednesday to minimize weekend surplus.",
                    "Record daily food waste weight in each category for trend analysis.",
                    "Rotate staff roles weekly for better operational understanding.",
                    "Ensure oil used in frying is replaced twice a week for quality and safety.",
                ],
                chart: [10, 7, 4, 3],
            },

            month: {
                wasteReduction: [
                    "Optimize monthly vendor orders to match observed consumption trends.",
                    "Store dry items like rice, flour, and pulses in airtight containers to reduce spoilage.",
                    "Analyze item popularity using sales data and eliminate low-selling dishes.",
                    "Encourage students to pre-book monthly meal plans to reduce uncertainty.",
                    "Repurpose unsold ingredients for social causes or animal feed partnerships.",
                ],
                nextDayMenu: [
                    "Paneer dishes, Sandwiches, and South Indian breakfasts made up 40% of monthly sales — keep them consistent.",
                    "Replace low-demand items (like Lemon Rice and Poori Bhaji) with rotating specials such as Hakka Noodles or Veg Fried Rice.",
                    "Add a monthly ‘Canteen Special’ meal day with combos using surplus stock.",
                    "Introduce variety by offering one regional special per week (e.g., Gujarati Thali, South Indian Platter).",
                ],
                operations: [
                    "Track electricity usage during off-hours — turn off idle machines to save power.",
                    "Encourage staff to log food waste daily using a simple Google Form or dashboard.",
                    "Review supplier performance monthly to ensure consistent quality and freshness.",
                    "Analyze profit and loss by comparing food cost vs sales per category.",
                    "Display monthly sustainability stats for awareness (e.g., '20 kg less food waste this month!').",
                ],
                chart: [38, 30, 15, 12],
            },
        };


        const selected = dummyData[duration];
        setSuggestions({
            wasteReduction: selected.wasteReduction,
            nextDayMenu: selected.nextDayMenu,
            operations: selected.operations,
        });
        setChartData((prev) => ({
            ...prev,
            datasets: [
                {
                    ...prev.datasets[0],
                    data: selected.chart,
                },
            ],
        }));
    }, [duration]);

    return (
        <div className="p-6 bg-blue-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-blue-800">
                        Smart Suggestions
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Insights on waste, menu planning & efficiency — auto-updated by duration.
                    </p>
                </div>

                {/* Duration Selector */}
                <div className="mt-3 sm:mt-0">
                    <select
                        className="border border-blue-200 bg-white rounded-md px-3 py-1.5 text-sm text-blue-700 focus:ring-2 focus:ring-blue-400"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    >
                        <option value="day">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>



            {/* Suggestions Sections */}
            <div className="grid md:grid-cols-2 gap-6">

                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <AlertTriangle className="text-blue-600" />
                        <CardTitle className="text-blue-800 text-base">
                            Key Actions to Focus On
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {priorities[duration].map((item, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                    {item.icon}
                                    <span className={`text-sm ${item.color}`}>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Waste Reduction */}
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Recycle className="text-green-600" />
                        <CardTitle className="text-blue-700 text-base">
                            Waste Reduction
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                            {suggestions.wasteReduction.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Next Day Menu */}
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Utensils className="text-blue-600" />
                        <CardTitle className="text-blue-700 text-base">
                            Next Day Menu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                            {suggestions.nextDayMenu.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Operations */}
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Lightbulb className="text-yellow-500" />
                        <CardTitle className="text-blue-700 text-base">
                            Operational Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                            {suggestions.operations.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Card */}
            <Card className="mt-6 border border-green-200 bg-green-50 shadow-sm">
                <CardHeader className="flex items-center space-x-3">
                    <Leaf className="text-green-700" />
                    <CardTitle className="text-green-800 text-base">
                        Sustainability Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-700">
                        Estimated food waste:{" "}
                        <strong>
                            {duration === "day"
                                ? "4.8 kg"
                                : duration === "week"
                                    ? "22 kg"
                                    : "95 kg"}
                        </strong>
                        . Continuous monitoring and menu optimization can reduce this by up
                        to <strong>25%</strong> monthly, saving around{" "}
                        <strong>₹1,200–₹1,500</strong>.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
