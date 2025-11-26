import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "../supabase/supabaseClient";
import { Badge } from "@/components/ui/badge";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [open, setOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    item: "",
    price: "",
    availability: true,
    nutritional_info: { calories: "", protein: "", carbs: "", fat: "" },
    category: "",
    daily_demand: "",
    image_url: "",
  });

  // Fetch data
  useEffect(() => {
    fetchMenu();
    fetchIngredients();
  }, []);

  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from("Menu")
      .select("*, Menu_ingredients(quantity, ingredient_id, Ingredients(name))")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching menu:", error);
    else setMenu(data || []);
  };

  const fetchIngredients = async () => {
    const { data, error } = await supabase
      .from("Ingredients")
      .select("id, name, quantity");
    if (error) console.error("Error fetching ingredients:", error);
    else setIngredients(data || []);
  };

  // Add menu item + ingredients mapping
  const addMenuItem = async () => {
    const {
      item,
      price,
      availability,
      nutritional_info,
      category,
      daily_demand,
      image_url,
    } = newItem;

    // Step 1: Insert menu item
    const { data: menuData, error: menuError } = await supabase
      .from("Menu")
      .insert([
        {
          item,
          price: parseFloat(price),
          availability,
          nutritional_info,
          category,
          daily_demand: parseInt(daily_demand) || null,
          image_url,
        },
      ])
      .select("id")
      .single();

    if (menuError) {
      console.error("Error adding menu item:", menuError);
      return;
    }

    // Step 2: Link selected ingredients
    const relations = selectedIngredients.map((ing) => ({
      menu_id: menuData.id,
      ingredient_id: ing.id,
      quantity: parseFloat(ing.qty) || 1,
    }));

    if (relations.length > 0) {
      const { error: linkError } = await supabase
        .from("Menu_ingredients")
        .insert(relations);
      if (linkError) console.error("Error linking ingredients:", linkError);
    }

    // Reset form
    setOpen(false);
    setSelectedIngredients([]);
    setNewItem({
      item: "",
      price: "",
      availability: true,
      nutritional_info: { calories: "", protein: "", carbs: "", fat: "" },
      category: "",
      daily_demand: "",
      image_url: "",
    });

    fetchMenu();
  };

  // Handle ingredient select
  const toggleIngredient = (ingredient) => {
    const exists = selectedIngredients.find((i) => i.id === ingredient.id);
    if (exists) {
      setSelectedIngredients(selectedIngredients.filter((i) => i.id !== ingredient.id));
    } else {
      setSelectedIngredients([...selectedIngredients, { ...ingredient, qty: 1 }]);
    }
  };

  // Handle quantity change
  const updateIngredientQty = (id, qty) => {
    setSelectedIngredients(
      selectedIngredients.map((i) =>
        i.id === id ? { ...i, qty: qty } : i
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 p-8 space-y-8">
      <Card className="shadow-md border border-blue-100 bg-white">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-blue-700 text-xl font-semibold">
              Canteen Menu Management
            </CardTitle>
            <p className="text-sm text-gray-500">
              Manage vegetarian dishes, ingredients, and nutritional details.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                + Add Item
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 py-2">
                {/* Item Details */}
                <div>
                  <Label>Item Name</Label>
                  <Input
                    value={newItem.item}
                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                    placeholder="e.g. Veg Pulao"
                  />
                </div>

                <div>
                  <Label>Image Link</Label>
                  <Input
                    value={newItem.image_url}
                    onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                    placeholder="image link"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Input
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    placeholder="e.g. Lunch / Snacks / Breakfast"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Available</Label>
                    <Switch
                      checked={newItem.availability}
                      onCheckedChange={(val) =>
                        setNewItem({ ...newItem, availability: val })
                      }
                    />
                  </div>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-3">
                  {["calories", "protein", "carbs", "fat"].map((field) => (
                    <div key={field}>
                      <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        type="number"
                        value={newItem.nutritional_info[field]}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            nutritional_info: {
                              ...newItem.nutritional_info,
                              [field]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Ingredient Selector */}
                <div>
                  <Label>Ingredients Used</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ingredients.map((ing) => {
                      const isSelected = selectedIngredients.some((i) => i.id === ing.id);
                      return (
                        <Button
                          key={ing.id}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`${isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700"
                            }`}
                          onClick={() => toggleIngredient(ing)}
                        >
                          {ing.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity for selected ingredients */}
                {selectedIngredients.length > 0 && (
                  <div className="mt-3">
                    <Label>Quantities</Label>
                    <div className="grid grid-cols-5 gap-4 mt-2">
                      {selectedIngredients.map((ing) => (
                        <div
                          key={ing.id}
                          className="flex flex-col"
                        >
                          <span className="text-sm font-medium mb-1">{ing.name}</span>
                          <Input
                            type="number"
                            value={ing.qty}
                            onChange={(e) => updateIngredientQty(ing.id, e.target.value)}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <DialogFooter>
                <Button
                  onClick={addMenuItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        {/* Menu Table */}
        <CardContent>
          {menu.length === 0 ? (
            <p className="text-gray-500 text-sm">No items found in the menu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-center">Category</th>
                    <th className="p-2 text-center">Price (₹)</th>
                    <th className="p-2 text-center">Available</th>
                    <th className="p-2 text-center">Sold Today</th>
                    <th className="p-2 text-center">Ingredients</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-blue-50 transition">
                      <td className="p-2">{item.item}</td>
                      <td className="p-2 text-center">{item.category || "-"}</td>
                      <td className="p-2 text-center">{item.price || "-"}</td>
                      <td className="p-2 text-center">
                        {item.availability ? "✅" : "❌"}
                      </td>
                      <td className="p-2 text-center font-semibold text-blue-700">
                        {item.sold_today ?? 0} {/* ✅ new cell */}
                      </td>
                      <td className="p-2 text-center">
                        {item.Menu_ingredients?.length > 0 ? (
                          item.Menu_ingredients.map((mi) => (
                            <Badge
                              key={mi.ingredient_id}
                              variant="outline"
                              className="m-1 text-xs"
                            >
                              {mi.Ingredients?.name} ({mi.quantity})
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
