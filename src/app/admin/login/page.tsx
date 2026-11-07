"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/auth";
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAdmin(formData);
    if (res.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setLoading(false);
      setError(res.error || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#104D38] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#779B7C] text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-md">
            S
          </div>
          <h1 className="text-2xl font-bold text-[#242824] tracking-tight">
            Suzzmed Clinical Console
          </h1>
          <p className="text-xs text-[#6F7770] mt-1">
            Secure administrative and care coordination access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                placeholder="admin@suzzmed.local"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#104D38] hover:bg-[#175840] disabled:bg-gray-400 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
