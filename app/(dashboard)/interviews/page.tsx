"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, MessageSquare, X, ChevronLeft, ChevronRight, Link2, Sparkles, RefreshCw, Calendar, Check } from "lucide-react";

interface Card {
  id: number;
  role: string;
  name: string;
  match?: string;
  time?: string;
  tags?: string[];
  action?: string;
  progress?: number;
  assessments?: number;
  priority?: boolean;
  scheduled?: boolean;
  meeting?: string;
}

interface Column {
  title: string;
  count: number;
  cards: Card[];
}

const columns: Column[] = [
  {
    title: "Applied",
    count: 12,
    cards: [
      {
        id: 1,
        role: "Backend Dev",
        match: "88% Match",
        name: "Alex Rivers",
        time: "Applied 2d ago",
        tags: ["JE", "KL"],
        action: "Review Resume",
      },
      {
        id: 2,
        role: "UX Designer",
        match: "92% Match",
        name: "Sarah Chen",
        time: "Applied 4h ago",
        action: "Start Screen",
      },
    ],
  },
  {
    title: "Screened",
    count: 8,
    cards: [
      {
        id: 3,
        role: "Backend Dev",
        match: "85% Match",
        name: "Marcus Thorne",
        time: "Phone Screen Done",
        progress: 80,
        action: "Move Next",
      },
    ],
  },
  {
    title: "Shortlisted",
    count: 4,
    cards: [
      {
        id: 4,
        role: "Backend Dev",
        match: "94% Match",
        name: "Elena Vance",
        time: "Vetted by AI Copilot",
        assessments: 2,
        action: "Schedule Int.",
        priority: true,
      },
    ],
  },
  {
    title: "Interviewing",
    count: 3,
    cards: [
      {
        id: 5,
        role: "Data Analyst",
        name: "David",
        scheduled: true,
        meeting: "Tomorrow",
      },
    ],
  },
];

export default function InterviewsPage() {
  const [showScheduler, setShowScheduler] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Interview Workflow</h1>
        <button
          onClick={() => setShowScheduler(true)}
          className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          NEW CANDIDATE
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <button className="h-9 px-4 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2">
          All Departments
        </button>
        <span className="h-9 px-4 bg-muted rounded text-sm flex items-center gap-2">
          Priority: High
          <X className="h-3 w-3" />
        </span>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.title} className="flex-shrink-0 w-72">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{column.title}</h3>
                <span className="px-2 py-0.5 bg-muted rounded text-xs">{column.count}</span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  className={`bg-card border rounded p-4 ${
                    card.priority ? "border-primary" : "border-border"
                  }`}
                >
                  {/* Priority Badge */}
                  {card.priority && (
                    <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded mb-2">
                      PRIORITY
                    </span>
                  )}

                  {/* Role & Match */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{card.role}</span>
                    {card.match && (
                      <span className="text-xs font-medium">{card.match}</span>
                    )}
                  </div>

                  {/* Name */}
                  <p className="font-semibold mb-1">{card.name}</p>

                  {/* Time / Status */}
                  <p className="text-xs text-muted-foreground mb-3">{card.time}</p>

                  {/* Progress Bar */}
                  {card.progress && (
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Assessments */}
                  {card.assessments && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {card.assessments} Assessments
                    </p>
                  )}

                  {/* Scheduled */}
                  {card.scheduled && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      {card.meeting}
                    </div>
                  )}

                  {/* Tags */}
                  {card.tags && (
                    <div className="flex items-center gap-1 mb-3">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action */}
                  {card.action && (
                    <div className="flex justify-end">
                      <button className="text-xs font-medium hover:underline">
                        {card.action}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90">
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Scheduler Modal */}
      {showScheduler && (
        <SchedulerModal onClose={() => setShowScheduler(false)} />
      )}
    </div>
  );
}

function SchedulerModal({ onClose }: { onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState("09:00 AM");
  const [interviewMode, setInterviewMode] = useState<"online" | "offline">("online");
  const [selectedInterviewer, setSelectedInterviewer] = useState("Sarah Adams");

  const interviewers = [
    { name: "Sarah Adams", role: "Lead Engineer", initials: "SA" },
    { name: "James Miller", role: "Design Director", initials: "JM" },
    { name: "Lara Rodriguez", role: "HR Manager", initials: "LR" },
  ];

  const slots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const questions = [
    {
      question: "Describe a project where you had to manage conflicting feedback from three different stakeholders.",
      goal: "Assess conflict resolution.",
    },
    {
      question: "How do you prioritize design debt versus new feature development in a fast-paced environment?",
      goal: "Strategic prioritization.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50 p-6">
      <div className="bg-card border border-border rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold">Schedule Interview</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left - Candidate & Calendar */}
          <div className="col-span-2 space-y-6">
            {/* Candidate Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded">
              <div className="h-16 w-16 rounded bg-muted overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Marcus Holloway"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Marcus Holloway</h3>
                  <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                    View Profile
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Senior Product Designer - 8 years exp.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">Score: 94/100</span>
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">Verified Portfolio</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="border border-border rounded p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Select Interview Schedule
                </h4>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-accent rounded">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium">October 2023</span>
                  <button className="p-1 hover:bg-accent rounded">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                  <div key={day} className="py-2 text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}
                {[25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8].map((day, i) => (
                  <div
                    key={i}
                    className={`py-3 rounded cursor-pointer ${
                      day === 4
                        ? "bg-muted font-medium"
                        : "hover:bg-accent"
                    }`}
                  >
                    {day}
                    {day === 4 && (
                      <p className="text-[10px] text-muted-foreground">Selection Window</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Available Slots:
                </p>
                <div className="flex gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`h-9 px-4 rounded text-sm font-medium ${
                        selectedSlot === slot
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-accent"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interviewer Selection */}
            <div className="border border-border rounded p-4">
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Interviewer Selection
              </h4>
              <div className="space-y-2">
                {interviewers.map((interviewer) => (
                  <div
                    key={interviewer.name}
                    onClick={() => setSelectedInterviewer(interviewer.name)}
                    className={`flex items-center justify-between p-3 rounded cursor-pointer border ${
                      selectedInterviewer === interviewer.name
                        ? "border-primary bg-accent"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {interviewer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{interviewer.name}</p>
                        <p className="text-xs text-muted-foreground">({interviewer.role})</p>
                      </div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedInterviewer === interviewer.name
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {selectedInterviewer === interviewer.name && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Additional Reviewers
              </button>
            </div>
          </div>

          {/* Right - Interview Settings & Questions */}
          <div className="space-y-6">
            {/* Interview Mode */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Interview Mode
              </p>
              <div className="flex rounded border border-border overflow-hidden">
                <button
                  onClick={() => setInterviewMode("online")}
                  className={`flex-1 h-10 text-sm font-medium ${
                    interviewMode === "online"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-accent"
                  }`}
                >
                  ONLINE
                </button>
                <button
                  onClick={() => setInterviewMode("offline")}
                  className={`flex-1 h-10 text-sm font-medium ${
                    interviewMode === "offline"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-accent"
                  }`}
                >
                  OFFLINE
                </button>
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Meeting Link / Location
              </p>
              <div className="flex items-center gap-2 p-3 border border-border rounded bg-background">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  defaultValue="meet.google.com/talentintel-abc-"
                  className="flex-1 text-sm bg-transparent outline-none"
                />
              </div>
            </div>

            {/* AI Question Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  AI Question Suggestions
                </span>
              </div>
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="p-3 border-l-2 border-border bg-muted/50 rounded-r">
                    <p className="text-sm italic mb-1">&quot;{q.question}&quot;</p>
                    <p className="text-xs text-muted-foreground">Goal: {q.goal}</p>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full h-9 border border-border rounded text-sm flex items-center justify-center gap-2 hover:bg-accent">
                <RefreshCw className="h-4 w-4" />
                Regenerate Set
              </button>
            </div>

            {/* Schedule Button */}
            <button
              onClick={onClose}
              className="w-full h-12 bg-primary text-primary-foreground rounded font-medium flex items-center justify-center gap-2 hover:bg-primary/90"
            >
              <Calendar className="h-4 w-4" />
              Schedule Interview
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Confirming will notify both Marcus and Sarah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
