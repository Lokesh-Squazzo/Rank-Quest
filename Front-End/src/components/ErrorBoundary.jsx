import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              An unexpected error occurred while rendering this page. You can reload or return to the dashboard.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-red-300 font-mono text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="flex-1 border-white/10 hover:bg-white/5 rounded-xl h-11 text-white gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reload
              </Button>
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-xl h-11 text-white gap-2 shadow-lg shadow-purple-500/20"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
