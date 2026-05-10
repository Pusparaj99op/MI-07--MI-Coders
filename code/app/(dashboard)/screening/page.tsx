"use client";

import { useState } from "react";
import { Upload, Sparkles, CheckCircle, AlertTriangle, Briefcase, Save } from "lucide-react";

export default function ScreeningPage() {
  const [hasAnalysis, setHasAnalysis] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Candidate Screening</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Upload & Job Description */}
        <div className="space-y-6">
          {/* Upload Resume */}
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">
                Drag and drop PDF or DOCX
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Max file size: 10MB
              </p>
              <button className="h-10 px-6 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90">
                BROWSE FILES
              </button>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Job Description</h2>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Sparkles className="h-4 w-4" />
                Use AI Template
              </button>
            </div>
            <textarea
              rows={8}
              placeholder="Paste the job description here to analyze candidate alignment..."
              className="w-full p-4 border border-border rounded bg-background text-sm resize-none outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Right Column - AI Match Analysis */}
        <div className="bg-card border border-border rounded p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">AI Match Analysis</h2>
              <p className="text-sm text-muted-foreground">
                Candidate: Sarah Jenkins — Senior Frontend Engineer
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded border-2 border-border">
                <span className="text-3xl font-bold">92</span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">
                Match Score
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-4 w-4" />
                <h3 className="font-semibold">Skill Match</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["React / Next.js", "TypeScript", "Tailwind CSS", "GraphQL"].map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-muted rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-error" />
                <h3 className="font-semibold">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Docker", "AWS Lambda"].map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-error/10 text-error rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Match */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4" />
              <h3 className="font-semibold">Experience Match</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                6+ years in frontend architecture.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">•</span>
                Led team of 5 at Series B startup.
              </li>
            </ul>
          </div>

          {/* AI Recommendation */}
          <div className="bg-muted/50 border border-border rounded p-4 mb-6">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              AI Recommendation
            </h4>
            <div className="flex gap-2 mb-3">
              <button className="h-9 px-4 bg-primary text-primary-foreground rounded text-sm font-medium">
                Shortlist
              </button>
              <button className="h-9 px-4 border border-border rounded text-sm hover:bg-accent">
                Hold
              </button>
              <button className="h-9 px-4 border border-border rounded text-sm hover:bg-accent">
                Reject
              </button>
            </div>
            <p className="text-sm text-muted-foreground italic">
              &quot;Strong alignment with technical requirements and leadership needs. Lack of cloud
              infrastructure experience is a minor gap.&quot;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button className="h-10 px-4 border border-border rounded text-sm font-medium hover:bg-accent">
              Clear Analysis
            </button>
            <button className="h-10 px-4 bg-primary text-primary-foreground rounded text-sm font-medium flex items-center gap-2 hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Save Screening Result
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Market Benchmark
          </p>
          <p className="text-xl font-bold">Top 5%</p>
          <p className="text-sm text-muted-foreground">
            Candidate&apos;s salary expectation vs market average for this role.
          </p>
        </div>
        <div className="bg-card border border-border rounded p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Culture Fit Score
          </p>
          <p className="text-xl font-bold">High Alignment</p>
          <p className="text-sm text-muted-foreground">
            Based on sentiment analysis of resume and portfolio links.
          </p>
        </div>
        <div className="bg-card border border-border rounded p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Interview Difficulty
          </p>
          <p className="text-xl font-bold">Moderate</p>
          <p className="text-sm text-muted-foreground">
            Suggested technical assessment duration: 45 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
