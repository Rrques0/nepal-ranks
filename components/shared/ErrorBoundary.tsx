"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-[#DC143C] mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-sm text-[#A0A0A0] mb-6">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
