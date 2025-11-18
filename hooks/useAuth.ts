// hooks/useAuth.ts
"use client";

import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

/**
 * Custom hook to access authentication state and methods.
 * Must be used inside AuthProvider.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};