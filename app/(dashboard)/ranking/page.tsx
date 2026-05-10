"use client";

import { useState } from "react";
import { Filter, Download, Mail, Phone, MapPin, Bot, ArrowRight } from "lucide-react";

const candidates = [
  {
    rank: 1,
    initials: "SK",
    name: "Sarah Koenig",
    role: "Senior Product Designer",
    score: 98,
    skills: ["Figma", "System Design"],
    experience: "8 Years",
    recommendation: "Strong Culture Match",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    rank: 2,
    initials: "MA",
    name: "Marcus Aurelius",
    role: "Lead UX Architect",
    score: 94,
    skills: ["Leadership", "Research"],
    experience: "12 Years",
    recommendation: "High Technical Accuracy",
  },
  {
    rank: 3,
    initials: "JL",
    name: "Jordan Lee",
    role: "Senior Interface Specialist",
    score: 91,
    skills: ["Prototyping", "Motion"],
    experience: "6 Years",
    recommendation: "Rapid Growth Potential",
  },
  {
    rank: 4,
    initials: "EL",
    name: "Elena Rodriguez",
    role: "UX/UI Designer",
    score: 88,
    skills: ["Visual Design", "React"],
    experience: "5 Years",
    recommendation: "Strong Portfolio",
  },
];

export default function RankingPage() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Talent Intelligence Platform</h1>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">Talent Ranking</h2>
          <p className="text-sm text-muted-foreground">
            Objective evaluation based on algorithmic match scoring and skill verification.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="h-9 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Ranking Table */}
        <div className="col-span-2 bg-card border border-border rounded">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Skills
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Exp.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-40">
                  AI Recommendation
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr
                  key={candidate.rank}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                    selectedCandidate.rank === candidate.rank
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <td className="px-4 py-4 text-sm font-medium">#{candidate.rank}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium shrink-0">
                        {candidate.avatar ? (
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          candidate.initials
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 border border-border rounded text-sm font-medium">
                      {candidate.score}/100
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-block px-2 py-0.5 bg-muted rounded text-xs w-fit"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{candidate.experience}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-muted-foreground">
                      {candidate.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right - Candidate Detail */}
        <div className="bg-card border border-border rounded p-6">
          {/* Badge */}
          <div className="flex justify-end mb-2">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
              Ranked #{selectedCandidate.rank}
            </span>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-muted overflow-hidden">
              {selectedCandidate.avatar ? (
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-medium">
                  {selectedCandidate.initials}
                </div>
              )}
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">{selectedCandidate.name}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedCandidate.role} @ TechFlow
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Contact
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              s.koenig@email.com
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              +1 (555) 092-1283
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              San Francisco, CA
            </div>
          </div>

          {/* Core Competencies */}
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Core Competencies
            </p>
            <div className="flex flex-wrap gap-2">
              {["Atomic Design", "User Research", "Prototyping", "B2B SaaS", "Leadership"].map(
                (comp) => (
                  <span key={comp} className="px-3 py-1.5 border border-border rounded text-xs">
                    {comp}
                  </span>
                )
              )}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-muted/50 border border-border rounded p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">AI Recommendation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sarah shows a 94% alignment with the role&apos;s technical requirements and an 82%
              team-match score. Her recent work on enterprise design systems directly maps to
              our Q3 roadmap needs.
            </p>
          </div>

          {/* Actions */}
          <button className="w-full h-12 bg-primary text-primary-foreground rounded font-medium flex items-center justify-center gap-2 mb-3 hover:bg-primary/90">
            Move to Interview
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="w-full h-10 border border-border rounded text-sm font-medium hover:bg-accent">
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
