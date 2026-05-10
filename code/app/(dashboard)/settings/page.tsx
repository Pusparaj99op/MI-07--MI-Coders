"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette, Building, Users, Key, Save } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "team", label: "Team", icon: Users },
  { id: "api", label: "API Keys", icon: Key },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-accent font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="col-span-3 bg-card border border-border rounded p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Profile Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal information and preferences.
                </p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-muted overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <button className="h-9 px-4 border border-border rounded text-sm hover:bg-accent">
                    Change Avatar
                  </button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Alex"
                    className="w-full h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Rivera"
                    className="w-full h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="alex.rivera@company.com"
                    className="w-full h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select className="w-full h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary">
                    <option>Senior Recruiter</option>
                    <option>Hiring Manager</option>
                    <option>Administrator</option>
                    <option>Interviewer</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Senior recruiter with 8+ years of experience in tech hiring."
                    className="w-full px-3 py-2 border border-border rounded bg-background text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground">
                  Choose how you want to receive notifications.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "New candidate applications", description: "Get notified when new candidates apply" },
                  { label: "Interview reminders", description: "Receive reminders before scheduled interviews" },
                  { label: "AI recommendations", description: "Get AI-powered hiring suggestions" },
                  { label: "Team updates", description: "Notifications about team activity" },
                  { label: "Weekly digest", description: "Summary of weekly recruitment activity" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Security Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your password and security preferences.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full max-w-md h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full max-w-md h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full max-w-md h-10 px-3 border border-border rounded bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <button className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90">
                  Update Password
                </button>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-medium mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded">
                  <div>
                    <p className="text-sm font-medium">2FA is currently disabled</p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="h-9 px-4 border border-border rounded text-sm hover:bg-accent">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how TalentIntel looks for you.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Theme</h3>
                <div className="flex gap-3">
                  {["Light", "Dark", "System"].map((theme, i) => (
                    <button
                      key={theme}
                      className={`flex-1 p-4 border rounded text-center ${
                        i === 0 ? "border-primary bg-accent" : "border-border hover:bg-accent"
                      }`}
                    >
                      <div className={`h-8 w-full rounded mb-2 ${
                        theme === "Light" ? "bg-white border border-border" :
                        theme === "Dark" ? "bg-gray-900" : "bg-gradient-to-r from-white to-gray-900"
                      }`} />
                      <span className="text-sm">{theme}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Density</h3>
                <div className="flex gap-3">
                  {["Comfortable", "Compact"].map((density, i) => (
                    <button
                      key={density}
                      className={`px-4 py-2 border rounded text-sm ${
                        i === 0 ? "border-primary bg-accent" : "border-border hover:bg-accent"
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Team Management</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your team members and their permissions.
                </p>
              </div>

              <button className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90">
                Invite Team Member
              </button>

              <div className="space-y-3">
                {[
                  { name: "Alex Rivera", email: "alex.rivera@company.com", role: "Admin" },
                  { name: "Sarah Chen", email: "sarah.chen@company.com", role: "Recruiter" },
                  { name: "James Miller", email: "james.miller@company.com", role: "Interviewer" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border rounded">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-muted rounded text-xs">{member.role}</span>
                      <button className="text-sm text-muted-foreground hover:text-foreground">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">API Keys</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your API keys for integrations.
                </p>
              </div>

              <button className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90">
                Generate New Key
              </button>

              <div className="p-4 border border-border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Production API Key</span>
                  <span className="text-xs text-muted-foreground">Created Oct 15, 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded text-xs font-mono">
                    sk_live_••••••••••••••••••••••••1234
                  </code>
                  <button className="h-8 px-3 border border-border rounded text-xs hover:bg-accent">
                    Copy
                  </button>
                  <button className="h-8 px-3 border border-border rounded text-xs text-error hover:bg-error/10">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
