import posthog from 'posthog-js';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    session_recording: {
      maskAllInputs: true,
    },
    debug: process.env.NODE_ENV === 'development',
  });
  posthog.register({ app: 'zenmora-blog' });
}
