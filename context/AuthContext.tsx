"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axiosClient, { initCsrf } from "@/lib/axiosClient";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { getRoleDashboardPath } from "@/lib/roleRoutes";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "employer" | "jobseeker",
    name: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkOnboarding: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session from token
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
        await initCsrf();
        const res = await axiosClient.get("/auth/me");
        setUser(res.data.user || res.data);

      } catch (error) {
        console.error("Session restore failed", error);
        localStorage.removeItem("auth_token");
        delete axiosClient.defaults.headers.Authorization;
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await axiosClient.get("/auth/me");
      // ✅ works whether backend sends { user: {...} } or raw {...}
      setUser(res.data.user || res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("auth_token");
        delete axiosClient.defaults.headers.Authorization;
      }
      setUser(null);
    }
  }, []);


  const login = async (email: string, password: string) => {
    try {
      await initCsrf();
      const res = await axiosClient.post("/auth/login", { email, password });
      const { user, token } = res.data;

      localStorage.setItem("auth_token", token);
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user || res.data);

      toast({ title: "Welcome back!", description: `Logged in as ${user.name}` });
      router.push(getRoleDashboardPath(user.role));
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.response?.data?.message || "Invalid credentials",
      });
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    role: "employer" | "jobseeker",
    name: string,
  ) => {
    try {
      await initCsrf();

      const res = await axiosClient.post("/auth/register", {
        email,
        password,
        password_confirmation: password,
        role,
        name,
      });

      const { user, token } = res.data;
      localStorage.setItem("auth_token", token);
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      toast({ title: "Account created!", description: "Redirecting to onboarding..." });

      if (role === "employer") {
        router.push("/onboarding/employer/company-details");
      } else {
        router.push("/onboarding/jobseeker/personal-details");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.response?.data?.message || "Please try again",
      });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/logout");
    } catch { }
    localStorage.removeItem("auth_token");
    delete axiosClient.defaults.headers.Authorization;
    setUser(null);
    toast({ title: "Logged out" });
    router.push("/auth/login");
  };

  const checkOnboarding = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await axiosClient.get("/auth/onboarding-status");
      const data = res.data;
      return data.completed === true;
    } catch (err) {
      console.error("Failed to check onboarding status", err);
      return false;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkOnboarding,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
