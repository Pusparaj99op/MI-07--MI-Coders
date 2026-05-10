"use client";

import { Bell, User, Calendar, MessageSquare, FileText, ExternalLink, Download, Check } from "lucide-react";

const progressSteps = [
  { label: "Applied", completed: true },
  { label: "Screened", completed: true },
  { label: "Interviewing", current: true },
  { label: "Offer", completed: false },
];

const messages = [
  {
    from: "Recruitment Team",
    subject: "Interview Confirmation",
    preview:
      "Hi Alex, we've confirmed your slot for the Technical Design review. Please make sure to review the attached guidelines...",
    time: "2h ago",
    unread: true,
  },
  {
    from: "James Chen",
    subject: "Portfolio Feedback",
    preview:
      "Thanks for sharing the updated case studies. The team was very impressed with the scalability section...",
    time: "Yesterday",
  },
  {
    from: "System Notification",
    subject: "Application Received",
    preview:
      "Your application for Senior Product Designer has been successfully submitted to the TalentIntel engine...",
    time: "Oct 24",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Design Culture at TalentIntel.pdf",
    size: "2.4 MB",
    note: "Read before interview",
  },
  {
    icon: ExternalLink,
    title: "Technical Assessment FAQ",
    note: "Video guide - 4 mins",
  },
];

export default function CandidatePortalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">TalentIntel</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Candidate Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="h-9 w-9 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Application Status Card */}
        <div className="bg-card border border-border rounded p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Senior Product Designer</h1>
              <p className="text-sm text-muted-foreground">
                Application ID: #TI-88293 - Applied Oct 24, 2023
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {progressSteps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                      step.completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : step.current
                        ? "border-primary bg-card"
                        : "border-border bg-card"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="h-4 w-4" />
                    ) : step.current ? (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">{step.label}</span>
                </div>
                {i < progressSteps.length - 1 && (
                  <div
                    className={`w-32 h-0.5 mx-4 ${
                      step.completed ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Interview */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h2 className="font-semibold">Upcoming Interview</h2>
              </div>
              <span className="px-3 py-1 bg-muted rounded text-xs">Confirmed</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Date & Time
                </p>
                <p className="font-medium">Oct 31, 2023 - 10:30 AM EST</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Interviewers
                </p>
                <p className="font-medium">Sarah Miller, Lead Architect</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Meeting Link
                </p>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  https://meet.talentintel.ai/j/992-120-442
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 h-11 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90">
                CONFIRM AVAILABILITY
              </button>
              <button className="flex-1 h-11 border border-border rounded font-medium hover:bg-accent">
                RESCHEDULE
              </button>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h2 className="font-semibold">Recent Messages</h2>
              </div>
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>

            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`p-3 rounded border ${
                    message.unread
                      ? "border-border bg-accent/30"
                      : "border-transparent hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{message.from}</p>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{message.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{message.preview}</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-sm font-medium hover:underline">
              View All Messages
            </button>
          </div>
        </div>

        {/* Preparation Guide */}
        <div className="bg-card border border-border rounded p-6">
          <h2 className="font-semibold mb-4">Preparation Guide</h2>
          <div className="space-y-3">
            {resources.map((resource, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted/50 rounded"
              >
                <div className="flex items-center gap-3">
                  <resource.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.size && `${resource.size} - `}
                      {resource.note}
                    </p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  {resource.size ? (
                    <Download className="h-5 w-5" />
                  ) : (
                    <ExternalLink className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Banner */}
        <div className="relative overflow-hidden rounded-lg bg-muted p-8 text-center">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
              }}
            />
          </div>
          <div className="relative">
            <h3 className="text-lg font-semibold mb-2">Designed for Objectivity.</h3>
            <p className="text-sm text-muted-foreground">
              Our recruitment engine ensures every candidate is evaluated purely on skill and merit.
              Good luck with your interview!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
