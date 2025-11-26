import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Salad } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-blue-900 text-white shadow-2xl border-b-3 border-black">
      <div className="mx-auto px-4 flex items-center justify-between h-16">

        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Salad className="h-6 w-6" />
          <span className="font-semibold text-lg tracking-wide">SmartServe_admin</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className="hover:text-yellow-400 hover:underline">Overview</Link>
          <Link to="/menu" className="hover:text-yellow-400 hover:underline">Menu</Link>
          <Link to="/stock" className="hover:text-yellow-400 hover:underline">Stock</Link>
          <Link to="/dashboard" className="hover:text-yellow-400 hover:underline">Dashboard</Link>
          <Link to="/orders" className="hover:text-yellow-400 hover:underline">Orders</Link>
          <Link to="/suggestions" className="hover:text-yellow-400 hover:underline">Suggestions</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/login")}
            className="bg-yellow-300 text-black border hover:bg-yellow-600 hover:cursor-pointer"
          >
            Log In
          </Button>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col px-6 pb-4 space-y-4 bg-blue-900 text-sm font-medium border-t border-blue-700">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Overview</Link>
          <Link to="/menu" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Menu</Link>
          <Link to="/stock" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Stock</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Dashboard</Link>
          <Link to="/orders" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Orders</Link>
          <Link to="/suggestions" onClick={() => setIsOpen(false)} className="hover:text-yellow-400">Suggestions</Link>

          <Button
            onClick={() => {
              navigate("/login");
              setIsOpen(false);
            }}
            className="bg-yellow-300 text-black border-gray-500 hover:bg-yellow-600"
          >
            Log In
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
