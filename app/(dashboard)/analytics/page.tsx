"use client";

import { useState } from "react";
import { Download, ChevronDown, TrendingUp, ChevronRight } from "lucide-react";

const applicationsByRole = [
  { role: "Senior Engineer", count: 142 },
  { role: "Product Design...", count: 98 },
  { role: "Marketing Man...", count: 71 },
  { role: "Data Scientist", count: 45 },
  { role: "Sales Lead", count: 31 },
];

const anomalies = [
  {
    type: "warning",
    title: "Drop in Frontend Engineer applicants",
    description: "Pipeline velocity decreased by 18% in the last 72 hours.",
    action: "Investigate",
  },
  {
    type: "info",
    title: "High AI scores in Sales Department",
    description: "New batch of candidates (n=14) showing outlier performance.",
    action: "View Candidates",
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [department, setDepartment] = useState("All Departments");
  const [viewMode, setViewMode] = useState<"Volume" | "Quality">("Volume");

  const maxCount = Math.max(...applicationsByRole.map((r) => r.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Talent Intelligence Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time performance metrics across all hiring pipelines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            {dateRange}
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="h-9 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            {department}
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="h-9 px-4 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Time to Hire */}
        <div className="bg-card border border-border rounded p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Time-to-Hire
            </p>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2.4%
            </span>
          </div>
          <p className="text-4xl font-bold mb-1">
            18.4 <span className="text-lg font-normal text-muted-foreground">days</span>
          </p>
          {/* Mini Bar Chart */}
          <div className="flex items-end gap-1 h-12 mt-4">
            {[40, 50, 45, 60, 55, 70, 80].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-muted rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Average AI Score */}
        <div className="bg-card border border-border rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Average AI Score
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${82 * 2.51} ${100 * 2.51}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">82</span>
                <span className="text-xs text-muted-foreground">OPTIMAL</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground italic mt-4">
            &quot;Top 15% of industry benchmark&quot;
          </p>
        </div>

        {/* Interview Conversion */}
        <div className="bg-card border border-border rounded p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Interview Conversion
            </p>
            <span className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 bg-primary" />
              24% Rate
            </span>
          </div>
          {/* Line Chart */}
          <div className="h-24 mt-4 flex items-end">
            <svg viewBox="0 0 200 60" className="w-full h-full">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                points="0,50 50,45 100,35 150,25 200,20"
              />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>WK 1</span>
            <span>WK 2</span>
            <span>WK 3</span>
            <span>WK 4</span>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Applications by Role */}
        <div className="col-span-2 bg-card border border-border rounded p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Applications by Role</h3>
            <div className="flex rounded border border-border overflow-hidden">
              <button
                onClick={() => setViewMode("Volume")}
                className={`px-3 py-1.5 text-sm ${
                  viewMode === "Volume"
                    ? "bg-accent font-medium"
                    : "hover:bg-accent"
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setViewMode("Quality")}
                className={`px-3 py-1.5 text-sm ${
                  viewMode === "Quality"
                    ? "bg-accent font-medium"
                    : "hover:bg-accent"
                }`}
              >
                Quality
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {applicationsByRole.map((item) => (
              <div key={item.role} className="flex items-center gap-4">
                <span className="text-sm w-32 truncate">{item.role}</span>
                <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shortlist Efficiency */}
        <div className="bg-card border border-border rounded p-6">
          <h3 className="font-semibold mb-6">Shortlist Efficiency</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Applied</span>
              <span className="text-sm font-medium">1,204</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Screened</span>
              <span className="text-sm font-medium">482</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Shortlisted</span>
              <span className="text-sm font-semibold">94</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted/50 rounded flex items-center gap-4">
            <span className="text-2xl font-bold">7.8%</span>
            <div>
              <p className="text-sm font-medium">Final Success Ratio</p>
              <p className="text-xs text-muted-foreground">Ratio of Applied vs Shortlisted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Anomaly Detection */}
      <div className="bg-card border border-border rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pipeline Anomaly Detection
          </h3>
          <span className="text-xs text-muted-foreground italic">AI Insights Engine Enabled</span>
        </div>
        <div className="space-y-3">
          {anomalies.map((anomaly, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-border rounded hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full ${
                    anomaly.type === "warning" ? "bg-error" : "bg-primary"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{anomaly.title}</p>
                  <p className="text-xs text-muted-foreground">{anomaly.description}</p>
                </div>
              </div>
              <button className="text-sm font-medium hover:underline flex items-center gap-1">
                {anomaly.action}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
