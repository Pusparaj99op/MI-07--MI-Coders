"use client";

import { useState } from "react";
import { Bot, Paperclip, Mic, Send, Calendar } from "lucide-react";

const suggestedActions = [
  "Summarize interviews",
  "Compare top candidates",
  "Check availability for next week",
  "Draft offer letter",
];

const messages = [
  {
    type: "user",
    content: "Show top 5 Java candidates for the Senior Engineering role at the London office.",
    time: "10:42 AM",
  },
  {
    type: "assistant",
    content:
      "I've analyzed our talent pool of 248 applicants for the Senior Engineer position. Based on technical proficiency, Java certification, and proximity to the London office, here are the top 5 matches.",
    time: "10:43 AM",
    candidates: [
      {
        name: "Marcus Thorne",
        role: "Senior Java Developer",
        experience: "8 yrs exp.",
        skills: ["Spring Boot", "Microservices"],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      {
        name: "Elena Rodriguez",
        role: "Full Stack Lead",
        experience: "10 yrs exp.",
        skills: ["AWS", "Hibernate"],
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      },
      {
        name: "David Chen",
        role: "Backend Architect",
        experience: "12 yrs exp.",
        skills: ["Cloud Native", "JVM Tuning"],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
    ],
    accuracy: "94-98%",
  },
  {
    type: "user",
    content: "Schedule a technical screening with Marcus Thorne for tomorrow afternoon.",
    time: "10:44 AM",
  },
];

export default function CopilotPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5" />
        <h1 className="text-2xl font-bold">AI Copilot</h1>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-auto space-y-6 pb-4">
        {/* Today Divider */}
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
            Today
          </span>
        </div>

        {messages.map((message, i) => (
          <div key={i} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            {message.type === "assistant" && (
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground mr-3 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-2xl ${message.type === "user" ? "text-right" : ""}`}>
              {message.type === "user" ? (
                <div className="inline-block px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm">
                  {message.content}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-card border border-border rounded-lg">
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.candidates && (
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-medium uppercase tracking-wider">
                          Recommended Talent ({message.candidates.length})
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          Match Accuracy: {message.accuracy}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {message.candidates.map((candidate, j) => (
                          <div
                            key={j}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
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
                                <p className="text-sm font-medium">{candidate.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {candidate.role} - {candidate.experience}
                                </p>
                                <div className="flex gap-1 mt-1">
                                  {candidate.skills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="px-2 py-0.5 bg-muted rounded text-[10px]"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="h-8 px-3 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90">
                                View
                              </button>
                              <button className="h-8 px-3 border border-border rounded text-xs font-medium hover:bg-accent">
                                Shortlist
                              </button>
                              <button className="h-8 w-8 border border-border rounded flex items-center justify-center hover:bg-accent">
                                <Calendar className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground underline">
                        Show 2 more candidates
                      </button>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
          <button className="text-muted-foreground hover:text-foreground">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask the Copilot..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button className="text-muted-foreground hover:text-foreground">
            <Mic className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 bg-primary text-primary-foreground rounded flex items-center justify-center hover:bg-primary/90">
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Suggested Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {suggestedActions.map((action) => (
            <button
              key={action}
              className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-accent"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
