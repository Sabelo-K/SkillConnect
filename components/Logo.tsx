import Link from "next/link";

export function LogoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sc-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        {/* Clip to show left ring only on its left half (for interlocking effect) */}
        <clipPath id="sc-left">
          <rect x="0" y="0" width="20.5" height="40" />
        </clipPath>
        <clipPath id="sc-right">
          <rect x="19.5" y="0" width="20.5" height="40" />
        </clipPath>
      </defs>

      {/* Hexagonal badge (pointy-top) */}
      <polygon
        points="20,2 35.6,11 35.6,29 20,38 4.4,29 4.4,11"
        fill="url(#sc-grad)"
      />

      {/* SA flag accent — 4 colour micro-stripe along top edge */}
      <clipPath id="sc-hex">
        <polygon points="20,2 35.6,11 35.6,29 20,38 4.4,29 4.4,11" />
      </clipPath>
      <g clipPath="url(#sc-hex)">
        <rect x="0" y="2" width="10" height="2.8" fill="#007A4D" />
        <rect x="10" y="2" width="10" height="2.8" fill="#FFB612" />
        <rect x="20" y="2" width="10" height="2.8" fill="#DE3831" />
        <rect x="30" y="2" width="10" height="2.8" fill="#002395" />
      </g>

      {/*
        Interlocking chain link — represents "connecting" skilled workers to clients.
        Right ring drawn first (behind), then left ring drawn in two passes
        to create the interlocking over/under effect.
      */}

      {/* Right ring — full (sits behind left ring) */}
      <circle cx="23" cy="20" r="7.5" stroke="white" strokeWidth="2.6" clipPath="url(#sc-right)" />

      {/* Left ring — full */}
      <circle cx="17" cy="20" r="7.5" stroke="white" strokeWidth="2.6" />

      {/* Right ring — left half redrawn on top so it visually interleaves */}
      <circle cx="23" cy="20" r="7.5" stroke="white" strokeWidth="2.6" clipPath="url(#sc-left)" />
    </svg>
  );
}

interface LogoProps {
  dark?: boolean;        // true = white wordmark (for dark backgrounds)
  href?: string;
  className?: string;
}

export default function Logo({ dark = false, href = "/", className = "" }: LogoProps) {
  const wordmark = (
    <span className={`font-extrabold text-xl leading-none tracking-tight select-none ${className}`}>
      <span className="text-orange-500">Skill</span>
      <span className={dark ? "text-white" : "text-gray-900"}>Connect</span>
    </span>
  );

  return (
    <Link href={href} className="flex items-center gap-2.5 group">
      <LogoMark className="w-9 h-9 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
      {wordmark}
    </Link>
  );
}
