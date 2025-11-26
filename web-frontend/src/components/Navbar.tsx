import { Button } from "@/components/ui/button";
import { Menu, Salad } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {

    let navigate = useNavigate();

    return (
        <nav className="w-full bg-blue-900 text-white shadow-2xl border-b-3 border-black">
            <div className="mx-auto px-4 flex items-center justify-between h-16">
                {/* Left: Logo */}
                <div className="flex items-center space-x-2">
                    <Salad className="h-6 w-6" />
                    <span className="font-semibold text-lg tracking-wide">SmartServe_admin</span>
                </div>

                {/* Center: Links */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <a href="/" className="hover:text-yellow-400 hover:underline transition-colors">Overview</a>
                    <a href="/menu" className="hover:text-yellow-400 hover:underline transition-colors">Menu</a>
                    <a href="/stock" className="hover:text-yellow-400 hover:underline transition-colors">Stock</a>
                    <a href="/dashboard" className="hover:text-yellow-400 hover:underline transition-colors">Dashboard</a>
                    <a href="/orders" className="hover:text-yellow-400 hover:underline transition-colors">Orders</a>
                    <a href="/suggestions" className="hover:text-yellow-400 hover:underline transition-colors">Suggestions</a>

                </div>

                {/* Right: Buttons */}
                <div className="flex items-center space-x-4">
                    <Button onClick={() => navigate("/login")} variant="outline" className="bg-yellow-300 text-black border-gray-500 hover:bg-yellow-600 hover:text-black hover:cursor-pointer">
                        <a>Log In</a>
                    </Button>
                    <Menu className="md:hidden h-6 w-6 cursor-pointer hover:text-yellow-400" />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
