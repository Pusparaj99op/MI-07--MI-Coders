"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown, LayoutDashboard, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Recruiter");
  const [roleOpen, setRoleOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const roles = ["Recruiter", "Hiring Manager", "Administrator", "Interviewer"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card border border-border rounded p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-border">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <span className="text-xl font-semibold">TalentIntel</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Recruitment Engine
            </p>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Access your intelligence dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Select Your Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleOpen(!roleOpen)}
                  className="w-full h-11 px-4 text-left bg-accent/50 border border-border rounded flex items-center justify-between text-sm transition-all duration-200 hover:bg-accent active:scale-[0.98]"
                >
                  {role}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {roleOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10">
                    {roles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setRoleOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-accent"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-11 px-4 bg-accent/50 border border-border rounded text-sm placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <button type="button" onClick={() => alert('Password reset coming soon!')} className="text-xs text-muted-foreground hover:text-primary underline transition-colors duration-200">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 bg-accent/50 border border-border rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-90"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Keep me logged in for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground rounded font-medium flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              Continue
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-border" />

          {/* Request Access */}
          <p className="text-center text-sm text-muted-foreground">
            New to the platform?{" "}
            <button type="button" onClick={() => alert('Request Access coming soon!')} className="font-medium text-foreground hover:text-primary hover:underline transition-all duration-200 active:scale-95 inline-block">
              Request Access
            </button>
          </p>
        </div>

        {/* Security Badge */}
        <div className="fixed bottom-6 right-6 bg-card border border-border rounded p-4 max-w-xs shadow-sm">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Security Status
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your session is protected by 256-bit AES encryption and biometric-ready authentication protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
