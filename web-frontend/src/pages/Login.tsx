import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, Eye, EyeOff } from "lucide-react";
import { CardAction, CardDescription } from "../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";

/**
 * StaffLogin.jsx
 * - Uses Tailwind for styling and shadcn/ui components.
 * - Theme: dark blue background, bright red accents.
 *
 * Adjust:
 * - API endpoint in handleSubmit()
 * - shadcn imports paths if needed
 */

export default function Login() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [open, setOpen] = React.useState(false)
  const [birthdate, setBirthdate] = React.useState<Date | undefined>(undefined)

  const validate = () => {
    if (!staffId.trim()) return "Staff ID is required.";
    if (!birthdate) return "Birthdate is required.";
    // birthdate format check (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) return "Birthdate must be YYYY-MM-DD.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      console.log(error);
      return;
    }

  };

  return (
    <div className="min-h-[90.5vh] bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="w-full max-w-sm shadow-2xl">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your assigned staffId, Birthdate, password
            </CardDescription>
            <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">StaffId</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="XXXXXX"
                    required
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="px-1">
                      Date of birth
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-48 justify-between font-normal"
                        >
                          {birthdate ? birthdate.toLocaleDateString() : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={birthdate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setBirthdate(date)
                            setOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" required value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-5 bg-red-700">
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="mt-4 text-center text-sm">
              <p>Forgot credentials? Contact admin at <span className="text-red-400">canteen@tsec.edu</span></p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
