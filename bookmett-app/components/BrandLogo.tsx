export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="26" height="24" rx="6" fill="#E8620E" />
      <rect x="3" y="5" width="26" height="7" rx="3" fill="#C9520B" />
      <circle cx="10" cy="4" r="2" fill="#C9520B" />
      <circle cx="22" cy="4" r="2" fill="#C9520B" />
      <path d="M11 20.5l3.2 3.2L22 16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span>
      BookMe<span className="tt">TT</span>
    </span>
  );
}
