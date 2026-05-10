"use client";

import { useState } from "react";
import { Search, Filter, ChevronDown, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

const stats = [
  { label: "TOTAL CANDIDATES", value: "1,284", change: "+12%" },
  { label: "SHORTLISTED", value: "312", subtitle: "Current Phase" },
  { label: "INTERVIEWS SCHEDULED", value: "45", subtitle: "Next 7 Days" },
  { label: "PENDING ACTIONS", value: "18", subtitle: "Requires Attention", highlight: true },
];

const candidates = [
  {
    initials: "AM",
    name: "Alex Morgan",
    email: "alex.m@domain.com",
    role: "Senior Product Designer",
    score: 94,
    status: "Screening",
  },
  {
    initials: "JS",
    name: "Jordan Smith",
    email: "j.smith@agency.io",
    role: "Lead Frontend Engineer",
    score: 88,
    status: "Interviewing",
  },
  {
    initials: "TK",
    name: "Taylor Kim",
    email: "tkim_dev@gmail.com",
    role: "Backend Developer",
    score: 72,
    status: "On Hold",
  },
  {
    initials: "CL",
    name: "Casey Lane",
    email: "casey@corp.net",
    role: "HR Specialist",
    score: 65,
    status: "Rejected",
  },
  {
    initials: "BW",
    name: "Blake West",
    email: "b.west@startup.co",
    role: "Senior Data Analyst",
    score: 91,
    status: "Offered",
  },
];

const statusStyles: Record<string, string> = {
  Screening: "bg-muted text-foreground",
  Interviewing: "bg-primary text-primary-foreground",
  "On Hold": "bg-muted text-muted-foreground",
  Rejected: "bg-muted text-muted-foreground",
  Offered: "bg-primary text-primary-foreground",
};

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitoring real-time acquisition metrics and candidate flow.
          </p>
        </div>
        <button className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          + NEW REQUISITION
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${stat.highlight ? "text-error" : ""}`}>
                {stat.value}
              </span>
              {stat.change && (
                <span className="text-sm text-muted-foreground">{stat.change}</span>
              )}
              {stat.subtitle && (
                <span className={`text-sm ${stat.highlight ? "text-error" : "text-muted-foreground"}`}>
                  {stat.subtitle}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by name..."
              className="h-10 w-full rounded border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <button className="h-10 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            Job Role: All
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="h-10 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            Experience: All
          </button>
          <button className="h-10 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            Status: All
          </button>
          <button className="h-10 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-card border border-border rounded">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Candidate Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                AI Match Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {candidate.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{candidate.role}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${candidate.score}%` }}
                      />
                    </div>
                    <span className="text-sm">{candidate.score}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                      statusStyles[candidate.status]
                    }`}
                  >
                    {candidate.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-sm font-medium hover:underline">
                    Review Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing 1-5 of 1,284 candidates
          </p>
          <div className="flex items-center gap-1">
            <button className="h-8 px-3 border border-border rounded text-sm hover:bg-accent">
              Previous
            </button>
            <button className="h-8 w-8 bg-primary text-primary-foreground rounded text-sm font-medium">
              1
            </button>
            <button className="h-8 w-8 border border-border rounded text-sm hover:bg-accent">
              2
            </button>
            <button className="h-8 w-8 border border-border rounded text-sm hover:bg-accent">
              3
            </button>
            <button className="h-8 px-3 border border-border rounded text-sm hover:bg-accent">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90">
        <UserPlus className="h-6 w-6" />
      </button>
    </div>
  );
}
