import React from 'react';
import { C, FONTS } from '../tokens';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    // In production: send to Sentry / Firebase Crashlytics
    console.error('HireAHotelier Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: FONTS.body }}>
          <div style={{ background: C.white, borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
              Something went wrong
            </div>
            <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.7, marginBottom: 24 }}>
              An unexpected error occurred. Our team has been notified. Please try refreshing the page or going back to the homepage.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details style={{ textAlign: 'left', marginBottom: 20, background: C.redBg, borderRadius: 8, padding: '10px 14px' }}>
                <summary style={{ cursor: 'pointer', fontSize: 12, color: C.redText, fontWeight: 600 }}>Error Details (dev only)</summary>
                <pre style={{ fontSize: 10, color: C.redText, marginTop: 8, overflow: 'auto', maxHeight: 200 }}>
                  {this.state.error.toString()}{'\n'}{this.state.info?.componentStack}
                </pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.navy, border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >🔄 Refresh Page</button>
              <button
                onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                style={{ background: 'transparent', color: C.navy, border: `1.5px solid ${C.navy}`, borderRadius: 8, padding: '9px 21px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >🏠 Go to Homepage</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
