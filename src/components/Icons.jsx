export function Arrow({ className = "" }) {
  return (
    <svg className={`arrow ${className}`.trim()} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3 8.5 3.2 3.2L13 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className = "" }) {
  return (
    <svg className={className} width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M3 23V13a10 10 0 0 1 20 0v10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 23V14a5 5 0 0 1 10 0v9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M1 23h24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
