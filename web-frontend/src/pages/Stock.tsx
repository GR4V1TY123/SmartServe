import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Pencil } from "lucide-react";

export default function Stock() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    reorder_level: "",
    expiry_date: "",
    cost_per_unit: "",
  });
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch all ingredients
  const fetchIngredients = async () => {
    const { data, error } = await supabase
      .from("Ingredients")
      .select("*")
      .order("id", { ascending: true });
    if (error) console.error("Error fetching ingredients:", error);
    else setIngredients(data || []);
  };

  // Add new ingredient
  const addIngredient = async () => {
    const { error } = await supabase.from("Ingredients").insert([newIngredient]);
    if (error) console.error("Error adding ingredient:", error);
    else {
      setOpen(false);
      setNewIngredient({
        name: "",
        quantity: "",
        reorder_level: "",
        expiry_date: "",
        cost_per_unit: "",
      });
      fetchIngredients();
    }
  };

  // Update ingredient
  const updateIngredient = async () => {
    const { error } = await supabase
      .from("Ingredients")
      .update({
        name: editingIngredient.name,
        quantity: editingIngredient.quantity,
        reorder_level: editingIngredient.reorder_level,
        expiry_date: editingIngredient.expiry_date,
        cost_per_unit: editingIngredient.cost_per_unit,
      })
      .eq("id", editingIngredient.id);

    if (error) console.error("Error updating ingredient:", error);
    else {
      setEditingIngredient(null);
      fetchIngredients();
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div className="min-h-screen text-gray-800 space-y-8">
      {/* Header */}
      <Card className="shadow-md border border-green-200 bg-white">
        <CardHeader>
          <CardTitle className="text-green-700 text-xl font-semibold">
            Ingredient Stock Management
          </CardTitle>
          <p className="text-sm">
            Track ingredient levels, expiry, and reorder requirements.
          </p>
          <p className="text-sm">
            🚨Paneer Expired
          </p>
          <p className="text-sm">
            ⚠️Poha low
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  + Add Ingredient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Ingredient</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newIngredient.name}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, name: e.target.value })
                      }
                      placeholder="e.g., Paneer"
                    />
                  </div>
                  <div>
                    <Label>Quantity (kg/L/pcs)</Label>
                    <Input
                      type="number"
                      value={newIngredient.quantity}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, quantity: e.target.value })
                      }
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <Label>Reorder Level</Label>
                    <Input
                      type="number"
                      value={newIngredient.reorder_level}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, reorder_level: e.target.value })
                      }
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={newIngredient.expiry_date}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, expiry_date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Cost per Unit (₹)</Label>
                    <Input
                      type="number"
                      value={newIngredient.cost_per_unit}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          cost_per_unit: e.target.value,
                        })
                      }
                      placeholder="e.g., 120"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={addIngredient}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-green-100 text-green-800">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-center">Quantity</th>
                  <th className="p-2 text-center">Remaining</th>
                  <th className="p-2 text-center">Reorder Level</th>
                  <th className="p-2 text-center">Expiry Date</th>
                  <th className="p-2 text-center">Cost/Unit (₹)</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {ingredients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 p-4">
                      No ingredients found
                    </td>
                  </tr>
                ) : (
                  ingredients.map((item) => {
                    const isLowStock =
                      item.remaining_ingredient <= item.reorder_level || item.quantity <= item.reorder_level;
                    const isExpired =
                      item.expiry_date && new Date(item.expiry_date) < new Date();

                    return (
                      <tr
                        key={item.id}
                        className={`border-b hover:bg-green-50 transition ${isLowStock || isExpired ? "bg-red-50" : ""
                          }`}
                      >
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-center">{item.quantity ?? "-"}</td>
                        <td className="p-2 text-center text-blue-700 font-semibold">
                          {item.remaining_ingredient !== null && item.remaining_ingredient !== undefined
                            ? item.remaining_ingredient.toFixed(2)
                            : item.quantity?.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">{item.reorder_level ?? "-"}</td>
                        <td className="p-2 text-center">
                          {item.expiry_date
                            ? new Date(item.expiry_date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-2 text-center">{item.cost_per_unit ?? "-"}</td>
                        <td className="p-2 text-center">
                          {isExpired ? (
                            <span className="flex items-center justify-center text-red-600 text-sm font-medium">
                              <AlertTriangle className="h-4 w-4 mr-1" /> Expired
                            </span>
                          ) : isLowStock ? (
                            <span className="text-yellow-600 font-medium text-sm">
                              Low Stock
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium text-sm">OK</span>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingIngredient(item)}
                          >
                            <Pencil className="h-4 w-4 text-green-700" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingIngredient && (
        <Dialog open={!!editingIngredient} onOpenChange={() => setEditingIngredient(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Ingredient</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editingIngredient.name}
                  onChange={(e) =>
                    setEditingIngredient({ ...editingIngredient, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={editingIngredient.quantity}
                  onChange={(e) =>
                    setEditingIngredient({
                      ...editingIngredient,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Reorder Level</Label>
                <Input
                  type="number"
                  value={editingIngredient.reorder_level}
                  onChange={(e) =>
                    setEditingIngredient({
                      ...editingIngredient,
                      reorder_level: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={editingIngredient.expiry_date || ""}
                  onChange={(e) =>
                    setEditingIngredient({
                      ...editingIngredient,
                      expiry_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Cost per Unit (₹)</Label>
                <Input
                  type="number"
                  value={editingIngredient.cost_per_unit}
                  onChange={(e) =>
                    setEditingIngredient({
                      ...editingIngredient,
                      cost_per_unit: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={updateIngredient} className="bg-green-600 hover:bg-green-700 text-white">
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
