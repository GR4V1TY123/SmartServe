import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Recycle, Utensils, Lightbulb, AlertTriangle, BarChart3 } from "lucide-react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { supabase } from "../supabase/supabaseClient";
import { GoogleGenAI } from "@google/genai";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Suggestions() {


    const [duration, setDuration] = useState("day");
    const [suggestions, setSuggestions] = useState({
        keyActions: [],
        wasteReduction: [],
        nextDayMenu: [],
        operationalTips: [],
    });

    const [forecast, setForecast] = useState<any[]>([]); // predicted demand data
    const [loadingForecast, setLoadingForecast] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [uniqueDates, setUniqueDates] = useState([]);
    const [filteredForecast, setFilteredForecast] = useState([]);
    const [menu, setMenu] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: menuData } = await supabase.from("Menu").select("*");
            const { data: ingredientData } = await supabase.from("Ingredients").select("*");
            const { data: orderData } = await supabase.from("Orders").select("*");

            setMenu(menuData || []);
            setIngredients(ingredientData || []);
            setOrders(orderData || []);
        };
        fetchData();
    }, []);


    const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_KEY,
    });


    useEffect(() => {
        if (menu.length && ingredients.length && orders.length) {
            const prompt = `
You are an AI assistant helping a canteen improve daily operations using Supabase data.
Based on the provided information, generate practical, short suggestions for the following four categories:

1️⃣ Key Actions to Focus On  
2️⃣ Waste Reduction  
3️⃣ Next Day Menu  
4️⃣ Operational Tips  

Each category should have exactly 3 suggestions in 1–2 sentences.
Use the data below for context:

Menu Data: ${JSON.stringify(menu)}
Ingredients Data: ${JSON.stringify(ingredients)}
Orders Data: ${JSON.stringify(orders)}

Output strictly in this JSON format:
{
  "key_actions": ["...", "...", "..."],
  "waste_reduction": ["...", "...", "..."],
  "next_day_menu": ["...", "...", "..."],
  "operational_tips": ["...", "...", "..."]
}
`;

            async function main() {
                try {
                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: prompt,
                    });

                    // ✅ Gemini returns output_text OR response.text()

                    let text = "";

                    if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
                        text = response.candidates[0].content.parts[0].text;
                    } else {
                        throw new Error("No valid text found in Gemini response");
                    }

                    console.log("Raw Gemini output:", text);

                    // ✅ Extract JSON safely using regex
                    let cleaned = text.replace(/```json|```/g, "").trim();

                    // 2️⃣ Remove trailing commas before ] or }
                    cleaned = cleaned
                        .replace(/,\s*([\]}])/g, "$1") // removes extra commas
                        .replace(/\r?\n|\r/g, " "); // remove line breaks (optional)

                    // 3️⃣ Optionally extract the first JSON object if Gemini adds explanations
                    const match = cleaned.match(/\{[\s\S]*\}/);
                    const jsonString = match ? match[0] : "{}";

                    // 4️⃣ Parse
                    const parsed = JSON.parse(jsonString);
                    setSuggestions({
                        keyActions: parsed.key_actions || [],
                        wasteReduction: parsed.waste_reduction || [],
                        nextDayMenu: parsed.next_day_menu || [],
                        operationalTips: parsed.operational_tips || [],
                    });
                } catch (err) {
                    console.error("Gemini API error or JSON parse error:", err);
                    setSuggestions({
                        keyActions: ["Error generating AI suggestions."],
                        wasteReduction: [],
                        nextDayMenu: [],
                        operationalTips: [],
                    });
                }
            }
            main();
        }
    }, [menu, ingredients, orders]);

    // ✅ Forecast data from FastAPI
    useEffect(() => {
        if (duration === "day") {
            const fetchForecast = async () => {
                try {
                    setLoadingForecast(true);
                    const response = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/predict`);
                    const data = await response.json();
                    setForecast(data.forecast || []);
                } catch (error) {
                    console.error("Error fetching forecast:", error);
                } finally {
                    setLoadingForecast(false);
                }
            };
            fetchForecast();
        }
    }, [duration]);

    useEffect(() => {
        if (forecast.length > 0) {
            const dates = [...new Set(forecast.map((f) => f.date))];
            setUniqueDates(dates);
            setSelectedDate(dates[0]);
        }
    }, []);


    useEffect(() => {
        if (forecast.length > 0) {
            // Extract unique dates
            const dates = [...new Set(forecast.map((f) => f.date))];
            setUniqueDates(dates);
            setSelectedDate(dates[0]); // default to first date
        }
    }, [forecast]);

    useEffect(() => {
        if (selectedDate) {
            const filtered = forecast.filter((f) => f.date === selectedDate);
            // remove duplicate dishes (keep first entry per dish)
            const uniqueByDish = Object.values(
                filtered.reduce((acc, cur) => {
                    acc[cur.dish] = cur;
                    return acc;
                }, {})
            );
            setFilteredForecast(uniqueByDish);
        }
    }, [selectedDate, forecast]);

    // Fetch forecast from FastAPI
    useEffect(() => {
        if (duration === "day") {
            const fetchForecast = async () => {
                try {
                    setLoadingForecast(true);
                    const response = await fetch("http://127.0.0.1:8000/predict");
                    const data = await response.json();
                    setForecast(data.forecast || []);
                } catch (error) {
                    console.error("Error fetching forecast:", error);
                } finally {
                    setLoadingForecast(false);
                }
            };
            fetchForecast();
        }
    }, [duration]);

    return (
        <div className="p-6 bg-blue-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-blue-800">Smart Suggestions</h1>
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

            {/* Grid of suggestion cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* 🔹 Key Actions */}
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <AlertTriangle className="text-blue-600" />
                        <CardTitle className="text-blue-800 text-base">Key Actions to Focus On</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                            {(suggestions?.keyActions || []).map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* 🔹 Waste Reduction */}
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Recycle className="text-green-600" />
                        <CardTitle className="text-blue-700 text-base">Waste Reduction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                            {(suggestions?.wasteReduction || []).map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* 🔹 Next Day Menu */}
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Utensils className="text-blue-600" />
                        <CardTitle className="text-blue-700 text-base">Next Day Menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                            {(suggestions?.nextDayMenu || []).map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* 🔹 Operational Tips */}
                <Card className="border border-blue-100 bg-white shadow-sm">
                    <CardHeader className="flex items-center space-x-3">
                        <Lightbulb className="text-yellow-500" />
                        <CardTitle className="text-blue-700 text-base">Operational Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                            {(suggestions?.operationalTips || []).map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* 📊 Predicted Demand Section */}
            <Card className="mt-6 border border-blue-200 bg-white shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <BarChart3 className="text-blue-700" />
                        <CardTitle className="text-blue-800 text-base">
                            Predicted Demand (Next 7 Days)
                        </CardTitle>
                    </div>

                    {/* 📅 Date Selector */}
                    <select
                        className="border border-blue-200 bg-white rounded-md px-3 py-1.5 text-sm text-blue-700 focus:ring-2 focus:ring-blue-400"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        {uniqueDates.map((date, i) => (
                            <option key={i} value={date}>
                                {new Date(date).toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                })}
                            </option>
                        ))}
                    </select>
                </CardHeader>

                <CardContent>
                    {loadingForecast ? (
                        <p className="text-gray-500 text-sm">Loading predictions...</p>
                    ) : forecast.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border border-gray-200 rounded-md">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Dish</th>
                                        <th className="px-3 py-2 text-left">Predicted Servings</th>
                                        <th className="px-3 py-2 text-left">Recommended Servings</th>
                                        <th className="px-3 py-2 text-left">Confidence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredForecast.map((f, i) => (
                                        <tr key={i} className="border-t border-gray-200">
                                            <td className="px-3 py-2 font-medium">{f.dish}</td>
                                            <td className="px-3 py-2">{f.predicted}</td>
                                            <td className="px-3 py-2">{f.recommended_servings}</td>
                                            <td
                                                className={`px-3 py-2 capitalize ${f.confidence === "high"
                                                    ? "text-green-600"
                                                    : f.confidence === "medium"
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                    }`}
                                            >
                                                {f.confidence}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No forecast data available.</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
