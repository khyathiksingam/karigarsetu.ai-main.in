import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, info: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, info: error?.message || 'Unknown runtime error' };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, info: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FEFAF5] px-4">
          <div className="max-w-md w-full rounded-3xl border border-[#E8D9C2] bg-white p-8 text-center shadow-[0_20px_50px_rgba(26,58,92,0.08)]">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="font-serif text-3xl font-black text-[#1A3A5C]">KARIGARSETU AI</h1>
            <p className="mt-4 text-sm text-[#1A3A5C]/75">
              Something went wrong while loading this page.
            </p>
            <p className="mt-2 text-xs text-red-600 break-words">{this.state.info}</p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-6 w-full rounded-2xl bg-[#C8702A] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#A8561D]"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
