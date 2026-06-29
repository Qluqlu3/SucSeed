import * as Sentry from '@sentry/react';

const dsn = document.querySelector<HTMLMetaElement>('meta[name="sentry-dsn"]')?.content;
const environment =
  document.querySelector<HTMLMetaElement>('meta[name="rails-env"]')?.content ?? 'production';

if (dsn) {
  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
