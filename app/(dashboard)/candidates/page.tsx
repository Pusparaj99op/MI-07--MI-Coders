"use client";

import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const candidates = [
  {
    id: 1,
    name: "Sarah Koenig",
    email: "s.koenig@email.com",
    role: "Senior Product Designer",
    location: "San Francisco, CA",
    score: 98,
    status: "Shortlisted",
    appliedDate: "Oct 24, 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    email: "m.thorne@email.com",
    role: "Senior Java Developer",
    location: "London, UK",
    score: 94,
    status: "Interviewing",
    appliedDate: "Oct 22, 2023",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "e.rodriguez@email.com",
    role: "Full Stack Lead",
    location: "Austin, TX",
    score: 92,
    status: "Screening",
    appliedDate: "Oct 20, 2023",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "David Chen",
    email: "d.chen@email.com",
    role: "Backend Architect",
    location: "Seattle, WA",
    score: 91,
    status: "Applied",
    appliedDate: "Oct 19, 2023",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Jordan Lee",
    email: "j.lee@email.com",
    role: "UX Designer",
    location: "New York, NY",
    score: 88,
    status: "On Hold",
    appliedDate: "Oct 18, 2023",
  },
  {
    id: 6,
    name: "Alex Rivers",
    email: "a.rivers@email.com",
    role: "Backend Developer",
    location: "Chicago, IL",
    score: 85,
    status: "Rejected",
    appliedDate: "Oct 15, 2023",
  },
];

const statusStyles: Record<string, string> = {
  Applied: "bg-muted text-foreground",
  Screening: "bg-muted text-foreground",
  Interviewing: "bg-primary text-primary-foreground",
  Shortlisted: "bg-primary text-primary-foreground",
  "On Hold": "bg-muted text-muted-foreground",
  Rejected: "bg-muted text-muted-foreground",
  Offered: "bg-primary text-primary-foreground",
};

export default function CandidatesPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-sm text-muted-foreground">
            Manage and review all candidate profiles.
          </p>
        </div>
        <button onClick={() => alert('Add Candidate feature coming soon!')} className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates..."
            className="h-10 w-full rounded border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <button onClick={() => alert('Filters coming soon!')} className="h-10 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Candidates List */}
        <div className="col-span-2 space-y-3">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`bg-card border rounded p-4 cursor-pointer transition-colors ${
                selectedCandidate?.id === candidate.id
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                    {candidate.avatar ? (
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-sm font-medium">
                        {candidate.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {candidate.appliedDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">{candidate.score}</p>
                    <p className="text-xs text-muted-foreground">AI Score</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      statusStyles[candidate.status]
                    }`}
                  >
                    {candidate.status}
                  </span>
                  <button className="p-1 hover:bg-accent rounded">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Candidate Detail Panel */}
        <div className="bg-card border border-border rounded p-6">
          {selectedCandidate ? (
            <div className="space-y-6">
              {/* Avatar & Name */}
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-3 overflow-hidden">
                  {selectedCandidate.avatar ? (
                    <img
                      src={selectedCandidate.avatar}
                      alt={selectedCandidate.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xl font-medium">
                      {selectedCandidate.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedCandidate.role}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded text-xs font-medium ${
                    statusStyles[selectedCandidate.status]
                  }`}
                >
                  {selectedCandidate.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {selectedCandidate.email}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedCandidate.location}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Applied {selectedCandidate.appliedDate}
                </div>
              </div>

              {/* AI Score */}
              <div className="p-4 bg-muted/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI Match Score</span>
                  <span className="text-2xl font-bold">{selectedCandidate.score}/100</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${selectedCandidate.score}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button onClick={() => alert('View Full Profile coming soon!')} className="w-full h-10 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90">
                  View Full Profile
                </button>
                <button onClick={() => alert('Schedule Interview coming soon!')} className="w-full h-10 border border-border rounded font-medium hover:bg-accent">
                  Schedule Interview
                </button>
                <button onClick={() => alert('Send Message coming soon!')} className="w-full h-10 border border-border rounded font-medium hover:bg-accent">
                  Send Message
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Select a candidate to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
