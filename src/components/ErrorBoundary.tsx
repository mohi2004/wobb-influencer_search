import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Error caught by boundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
          <div className="max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] text-center animate-scale-in">
            <svg className="mx-auto h-16 w-16 text-[var(--danger)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4v2m0 4v2M6.172 6.172a4 4 0 015.656 0L12 7.07m0 0l.172.172a4 4 0 005.656 0M12 7.07l.172.172" />
            </svg>
            <h1 className="text-2xl font-bold text-[var(--text-h)] mb-2">Oops! Something went wrong</h1>
            <p className="text-[var(--subtle)] mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer font-semibold text-[var(--subtle)]">Error details</summary>
                <pre className="mt-2 overflow-auto rounded bg-[var(--surface-alt)] p-3 text-xs text-[var(--text)]">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-2xl bg-[var(--accent)] px-4 py-3 font-semibold text-white transition-all hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="flex-1 rounded-2xl border border-[var(--border)] px-4 py-3 font-semibold text-[var(--text)] transition-all hover:bg-[var(--surface-alt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
