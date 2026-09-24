export function RollingBall({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`animate-roll-ball pointer-events-none absolute h-8 w-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${className}`}
      style={style}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" fill="#F1F5EF" stroke="#0A0E0B" strokeWidth="0.6" />
      <g fill="#0A0E0B">
        <polygon points="12,6.2 14.6,8.1 13.6,11.1 10.4,11.1 9.4,8.1" />
        <polygon points="12,6.2 9.4,8.1 7.3,6.4 8.6,3.6 12,3.2" />
        <polygon points="12,6.2 14.6,8.1 16.7,6.4 15.4,3.6 12,3.2" />
        <polygon points="9.4,8.1 10.4,11.1 7.2,13 4.9,10.6 6.1,7.3" />
        <polygon points="14.6,8.1 13.6,11.1 16.8,13 19.1,10.6 17.9,7.3" />
        <polygon points="10.4,11.1 13.6,11.1 14.4,14 12,15.8 9.6,14" />
      </g>
    </svg>
  );
}
