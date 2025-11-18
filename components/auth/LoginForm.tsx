"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/easycomponents/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            // handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-w-md mx-auto my-auto">
            <h1 className="text-3xl font-semibold text-er-dark pb-4 border-b-1 border-gray-200 text-left">
                Welcome back!
            </h1>

            <div className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email field */}
                    <div className="space-y-2">
                        <div className="flex flex-row gap-2">
                            <Mail className="h-4 w-4 my-auto text-gray-400" />
                            <Label htmlFor="email" className="text-sm text-gray-600 my-auto">
                                Email
                            </Label>
                        </div>

                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className=""
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                        <div className="flex flex-row gap-2">
                            <Lock className="h-4 w-4 my-auto text-gray-400" />
                            <Label htmlFor="password" className="text-sm text-gray-600 my-auto">
                                Password
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className=""
                            />
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-er-primary focus:ring-er-primary"
                            />
                            <span>Remember me?</span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-3 mt-6">
                        <Button
                            type="button"
                            size={"lg"}
                            variant="outlinePrimary"
                            onClick={() => router.push("/")}
                            className="w-fit"
                        >
                            Sign up instead
                        </Button>
                        <Button
                            type="submit"
                            size={"lg"}
                            className="w-fit bg-er-dark hover:bg-er-primary text-white"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Footer links */}
            <div className="flex justify-between mt-6 text-sm text-gray-600">
                <p className="text-sm">Having trouble logging in?</p>
                <button
                    onClick={() => router.push("/forgot-password")}
                    className="text-er-primary hover:underline"
                >
                    Forgot password?
                </button>
            </div>
        </div>
    );
}
