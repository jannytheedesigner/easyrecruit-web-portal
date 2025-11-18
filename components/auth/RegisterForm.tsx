"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/easycomponents/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { countries, countryCodeToEmoji } from "@/lib/countries";

interface RegisterFormProps {
  role: "employer" | "jobseeker";
}

export default function RegisterForm({ role }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !role) {
      const nextErrors: Record<string, string> = {};
      if (!name) nextErrors.name = "Full name is required.";
      if (!email) nextErrors.email = "Email is required.";
      if (!password) nextErrors.password = "Password is required.";
      setErrors(nextErrors);
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, role, name);
      const redirectPath =
        role === "employer"
          ? "/onboarding/employer/company-details"
          : "/onboarding/jobseeker/personal-details";
      router.push(redirectPath);
    } catch (err: any) {
      const backendErrors = err?.response?.data?.errors as Record<string, string[] | string> | undefined;
      if (backendErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(backendErrors).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : msgs;
          mapped[field] = msg;
        });
        setErrors(mapped);
        const firstMsg = Object.values(mapped)[0];
        setError(typeof firstMsg === "string" ? firstMsg : "Validation error");
      } else {
        setError(err?.response?.data?.message || err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 my-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-2xl font-semibold text-er-dark">
          Create {role === "employer" ? "Employer" : "Job Seeker"} Account
        </h1>
        <p className="text-base text-muted-foreground">
          Enter your details to sign up for a{" "}
          {role === "employer" ? "Employer" : "JobSeeker"} Account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <div className="flex flex-row gap-2">
            <User className="h-4 w-4 my-auto text-gray-400" />
            <Label htmlFor="name" className="text-sm text-gray-600 my-auto">
              Full Name
            </Label>
          </div>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={`${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            required
          />
          {errors.name && (
            <p className="text-sm text-red-500 font-medium mt-1">{errors.name}</p>
          )}
        </div>


        {/* Email */}
        <div className="space-y-1">
          <div className="flex flex-row gap-2">
            <Mail className="h-4 w-4 my-auto text-gray-400" />
            <Label htmlFor="email" className="text-sm text-gray-600 my-auto">
              Email
            </Label>
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500 font-medium mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex flex-row gap-2">
            <Lock className="h-4 w-4 my-auto text-gray-400" />
            <Label htmlFor="password" className="text-sm text-gray-600 my-auto">
              Password
            </Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            required
          />
          {errors.password && (
            <p className="text-sm text-red-500 font-medium mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <div className="flex flex-row gap-2">
            <Lock className="h-4 w-4 my-auto text-gray-400" />
            <Label
              htmlFor="confirmPassword"
              className="text-sm text-gray-600 my-auto"
            >
              Confirm Password
            </Label>
          </div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            required
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 font-medium mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Password Strength */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>Password Strength</span>
            <span>
              {strength <= 1
                ? "Weak!"
                : strength === 2
                  ? "Fair"
                  : strength === 3
                    ? "Good"
                    : "Strong!"}
            </span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-1/4 rounded-full ${i <= strength
                    ? i <= 1
                      ? "bg-red-500"
                      : i === 2
                        ? "bg-yellow-400"
                        : i === 3
                          ? "bg-blue-500"
                          : "bg-green-500"
                    : "bg-gray-200"
                  }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 font-medium mt-2">{error}</p>
        )}
        {errors.role && (
          <p className="text-sm text-red-500 font-medium mt-1">{errors.role}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            size="lg"
            variant="outlinePrimary"
            className="w-32 border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-32 bg-er-dark text-white hover:bg-er-primary"
          >
            {loading ? "Loading..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
