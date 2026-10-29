export function Arrow({ direction = 'diagonal' }: { direction?: 'diagonal' | 'down' }) {
  return <svg className={`arrow arrow--${direction}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" />
  </svg>;
}

export function LemonBranch({ className = '' }: { className?: string }) {
  return <svg className={`lemon-branch ${className}`} viewBox="0 0 140 150" fill="none" aria-hidden="true">
    <path d="M27 141c20-33 40-57 49-83 5-13 5-26 4-42M59 90c-6-22-19-26-29-29M72 65c16-13 28-16 41-13" stroke="currentColor" strokeWidth="1.2" />
    <path d="M78 47C58 39 51 18 56 7c18 5 29 18 22 40ZM73 70c12-22 36-35 55-23-10 17-29 28-55 23ZM55 90C34 92 16 79 13 61c20-4 37 7 42 29Z" fill="currentColor" opacity=".9" />
    <path d="M77 81c20-9 43 4 41 25-1 17-16 26-28 27-4 0-7 7-11 6-5-2-4-7-8-10-20-16-15-37 6-48Z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M88 88c-16 7-22 20-10 35M96 87c11 5 15 13 12 23" stroke="currentColor" strokeWidth=".8" />
  </svg>;
}

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return <span className={footer ? 'wordmark wordmark--footer' : 'wordmark'} translate="no">CITRUS<span className="wordmark-number">01</span></span>;
}
