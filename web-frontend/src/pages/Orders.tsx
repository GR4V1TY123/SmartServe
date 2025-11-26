import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("Orders")
      .select(`
        id,
        student_name,
        created_at,
        quantity,
        amount,
        status,
        expected_time,
        payment_method,
        menu_id,
        Menu:menu_id (id, item, price)
      `)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching orders:", error);
    else setOrders(data || []);
  };

  // Update order status
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from("Orders").update({ status: newStatus }).eq("id", id);
    if (error) console.error("Error updating status:", error);
    else fetchOrders();
  };

  // Payment emoji helper
  const getPaymentEmoji = (method) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return "💵 Cash";
      case "upi":
        return "📱 UPI";
      case "card":
        return "💳 Card";
      default:
        return "❔";
    }
  };

  useEffect(() => {
    fetchOrders();
    const subscription = supabase
      .channel("public:Orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "Orders" }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 📋 Orders Table */}
      <Card className="shadow-md border border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700 text-xl font-semibold flex items-center gap-2">
            📦 Orders Management
          </CardTitle>
          <p className="text-sm text-gray-500">Today's orders</p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Student</th>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-center">Amount (₹)</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Payment</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-blue-50 transition">
                      <td className="p-2 text-gray-700">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </td>
                      <td className="p-2 text-gray-700">
                        {`ORD${order.id.toString().padStart(3, "0")}`}
                      </td>
                      <td className="p-2 text-gray-700">{order.student_name || "—"}</td>
                      <td className="p-2 text-gray-700">{order.Menu?.item || "—"}</td>
                      <td className="p-2 text-center">{order.quantity}</td>
                      <td className="p-2 text-center font-medium text-green-700">
                        {order.amount || order.Menu?.price * order.quantity || "—"}
                      </td>
                      <td className="p-2 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="border border-blue-300 rounded px-2 py-1 text-sm text-blue-700"
                        >
                          <option>pending</option>
                          <option>preparing</option>
                          <option>ready</option>
                          <option>completed</option>
                        </select>
                      </td>
                      <td className="p-2 text-center">{getPaymentEmoji(order.payment_method)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
