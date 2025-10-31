import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("Orders")
      .select(`
        id,
        created_at,
        quantity,
        amount,
        status,
        expected_time,
        student_id,
        menu_id,
        Student(id, name),
        Menu(id, item)
      `)
      .order("created_at", { ascending: true });

    if (error) console.error("Error fetching orders:", error);
    else setOrders(data || []);
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription (optional)
    const subscription = supabase
      .channel("public:Orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "Orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Update order status
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("Orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) console.error("Error updating status:", error);
    else fetchOrders(); // Refresh
  };

  return (
    <div>
      <Card className="shadow-md border border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700 text-xl font-semibold">Orders Management</CardTitle>
          <p className="text-sm text-gray-500">Today's orders</p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Student Name</th>
                  <th className="p-2 text-left">Order Items</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-center">Selected</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-blue-50 transition">
                      <td className="p-2 text-gray-700">{new Date(order.created_at).toLocaleTimeString()}</td>
                      <td className="p-2 text-gray-700">{`ORD${order.id.toString().padStart(3, "0")}`}</td>
                      <td className="p-2 text-gray-700">{order.Student?.name}</td>
                      <td className="p-2 text-gray-700">{order.Menu?.item}</td>
                      <td className="p-2 text-center">{order.quantity}</td>
                      <td className="p-2 text-center">
                        <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                      </td>
                      <td className="p-2 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="border border-blue-300 rounded px-2 py-1 text-center text-sm text-blue-700"
                        >
                          <option>pending</option>
                          <option>preparing</option>
                          <option>ready</option>
                          <option>completed</option>
                        </select>
                      </td>
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
