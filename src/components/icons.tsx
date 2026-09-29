import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function BalanceIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3v18M6 6h12M4 9l-2 5h4L4 9Zm16 0-2 5h4l-2-5ZM7.5 21h9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.75 14c.45 1.45 1.2 2.2 2.25 2.2s1.8-.75 2.25-2.2M17.75 14c.45 1.45 1.2 2.2 2.25 2.2s1.8-.75 2.25-2.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 15.5v-11m0 0L5.75 8.75M10 4.5l4.25 4.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StopIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <rect x="5.25" y="5.25" width="9.5" height="9.5" rx="1.4" fill="currentColor" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M11.5 4H16v4.5M9 11l7-7M15 11.5V15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.72 3.2 2.38 14.1a1.48 1.48 0 0 0 1.28 2.22h12.68a1.48 1.48 0 0 0 1.28-2.22L11.28 3.2a1.48 1.48 0 0 0-2.56 0Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M10 7v4.2M10 14v.05" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5.5 2.75h6L15 6.2v10.05a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V3.75a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M11.5 2.9v3.4H15M7 9h5.5M7 12h5.5M7 15h3.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

