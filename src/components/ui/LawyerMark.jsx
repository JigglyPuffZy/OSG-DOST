export default function LawyerMark({ className = "h-24 w-24" }) {
  return (
    <svg
      viewBox="0 0 160 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lawyer-gold" x1="40" y1="20" x2="120" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7dd4f7" />
          <stop offset="0.45" stopColor="#00adef" />
          <stop offset="1" stopColor="#0099d6" />
        </linearGradient>
        <linearGradient id="lawyer-shine" x1="80" y1="0" x2="80" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="lawyer-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="80" cy="168" rx="46" ry="8" fill="url(#lawyer-gold)" opacity="0.18" />

      <g filter="url(#lawyer-glow)">
        <path
          d="M80 18c-14 0-24 10-24 24v8c0 4 3 7 7 7h34c4 0 7-3 7-7v-8c0-14-10-24-24-24Z"
          fill="url(#lawyer-gold)"
          opacity="0.95"
        />
        <rect x="62" y="50" width="36" height="52" rx="10" fill="url(#lawyer-gold)" />
        <path
          d="M68 58h24v6c0 3-2 5-5 5H73c-3 0-5-2-5-5v-6Z"
          fill="#081018"
          opacity="0.35"
        />
        <path d="M80 66v34" stroke="#081018" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
        <path
          d="M74 102h12l-2 18H76l-2-18Z"
          fill="url(#lawyer-gold)"
        />
        <path
          d="M48 118h64"
          stroke="url(#lawyer-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M80 118v18" stroke="url(#lawyer-gold)" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M44 136c0-8 6-14 14-14h4c8 0 14 6 14 14v4H44v-4Z"
          fill="url(#lawyer-gold)"
          opacity="0.85"
        />
        <path
          d="M84 136c0-8 6-14 14-14h4c8 0 14 6 14 14v4H84v-4Z"
          fill="url(#lawyer-gold)"
          opacity="0.85"
        />
        <ellipse cx="58" cy="148" rx="16" ry="5" fill="#081018" opacity="0.22" />
        <ellipse cx="102" cy="148" rx="16" ry="5" fill="#081018" opacity="0.22" />
      </g>

      <path
        d="M118 34l10-8 8 10-10 8-8-10Z"
        fill="url(#lawyer-gold)"
        opacity="0.55"
      />
      <rect x="118" y="36" width="18" height="22" rx="3" fill="url(#lawyer-gold)" opacity="0.75" />
      <path d="M122 42h10M122 47h10M122 52h7" stroke="#081018" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

      <rect x="80" y="0" width="80" height="180" fill="url(#lawyer-shine)" opacity="0.45" />
    </svg>
  )
}
