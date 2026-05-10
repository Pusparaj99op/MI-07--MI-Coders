"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Sliders, Paperclip, Clock, Send } from "lucide-react";

const templates = [
  { id: 1, name: "Invite to Interview", active: true },
  { id: 2, name: "Shortlist Update", active: false },
  { id: 3, name: "Rejection Notice", active: false },
  { id: 4, name: "Follow-up Inquiry", active: false },
];

const recentContacts = [
  { initials: "AS", name: "Alex Smith", role: "Senior Engineer" },
  { initials: "JD", name: "Jane Doe", role: "Product Lead" },
];

export default function CommunicationPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [emailBody, setEmailBody] = useState(`Dear Alex Smith,

Thank you for your interest in the Senior Software Engineering position. Our team has reviewed your background and the AI screening process was impressed by your expertise in high-concurrency systems and functional programming.

We would like to invite you for a virtual technical interview. During this session, we will discuss your past projects and how your objective-driven approach aligns with our minimalist engineering philosophy.

Could you please let us know your availability for a 45-minute call during the following windows?
- Tuesday, Nov 14th: 10:00 AM - 3:00 PM EST`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Communication</h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Left Sidebar - Templates & Contacts */}
        <div className="space-y-6">
          {/* AI Templates */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              AI Templates
            </h3>
            <div className="space-y-1">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-left px-3 py-2.5 rounded text-sm flex items-center justify-between ${
                    selectedTemplate === template.id
                      ? "bg-accent font-medium"
                      : "hover:bg-accent"
                  }`}
                >
                  {template.name}
                  {selectedTemplate === template.id && (
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Contacts */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Recent Contacts
            </h3>
            <div className="space-y-2">
              {recentContacts.map((contact) => (
                <div
                  key={contact.initials}
                  className="flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {contact.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Email Composer */}
        <div className="col-span-2 bg-card border border-border rounded">
          {/* Email Header */}
          <div className="border-b border-border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">From:</span>
              <span className="text-sm">recruitment@talentintel.ai (Platform Default)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">To:</span>
              <span className="text-sm">alex.smith@example.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">Subject:</span>
              <span className="text-sm font-medium">Interview Invitation: Senior Software Engineer</span>
            </div>
          </div>

          {/* AI Preview Banner */}
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">AI Assisted Preview</span>
          </div>

          {/* Email Body */}
          <div className="p-4">
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={14}
              className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed"
            />
          </div>

          {/* Regenerate & Tone */}
          <div className="flex items-center justify-end gap-2 px-4 pb-4">
            <button className="h-9 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
            <button className="h-9 px-4 border border-border rounded text-sm flex items-center gap-2 hover:bg-accent">
              <Sliders className="h-4 w-4" />
              Tone: Professional
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Paperclip className="h-4 w-4" />
                Add Attachment
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Clock className="h-4 w-4" />
                Schedule for Later
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-10 px-4 border border-border rounded text-sm font-medium hover:bg-accent">
                SAVE AS DRAFT
              </button>
              <button className="h-10 px-5 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
                SEND MESSAGE
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right - Candidate Insights */}
        <div className="bg-card border border-border rounded p-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Candidate Insights
          </h3>

          {/* Candidate Card */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                alt="Alex Smith"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">Alex Smith</p>
              <p className="text-xs text-muted-foreground">Match Score: 98%</p>
            </div>
          </div>

          {/* Key Strengths */}
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Key Strengths
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Distributed Systems", "Go/Rust", "Leadership"].map((strength) => (
                <span key={strength} className="px-2 py-1 bg-muted rounded text-xs">
                  {strength}
                </span>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="p-3 bg-muted/50 border border-border rounded">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              AI Recommendation
            </p>
            <p className="text-sm text-muted-foreground">
              Proceed with priority. Engagement probability is high (84%). Mention the system scale as
              a hook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
