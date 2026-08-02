export default function AlshafiSectionWatermark({ type = "play", className = "" }) {
  return (
    <div
      className={`alshafi-section-watermark alshafi-section-watermark-${type} ${className}`}
      aria-hidden="true"
    >
   {type === "youtube" && (
  <svg viewBox="0 0 120 84" fill="none">
    <defs>
      <mask id="alshafi-youtube-cutout">
        <rect width="120" height="84" fill="white" />
        <path d="M48 60V24L79 42L48 60Z" fill="black" />
      </mask>
    </defs>

    <path
      d="M116.2 13.1C114.8 7.9 110.5 3.8 105.2 2.4C95.5 0 60 0 60 0C60 0 24.5 0 14.8 2.4C9.5 3.8 5.2 7.9 3.8 13.1C1.2 22.6 1.2 42 1.2 42C1.2 42 1.2 61.4 3.8 70.9C5.2 76.1 9.5 80.2 14.8 81.6C24.5 84 60 84 60 84C60 84 95.5 84 105.2 81.6C110.5 80.2 114.8 76.1 116.2 70.9C118.8 61.4 118.8 42 118.8 42C118.8 42 118.8 22.6 116.2 13.1Z"
      fill="currentColor"
      mask="url(#alshafi-youtube-cutout)"
    />
  </svg>
)}

      {type === "factory" && (
        <svg viewBox="0 0 120 120" fill="none">
          <path
            d="M12 102V48L42 64V48L72 64V34H102V102H12Z"
            fill="currentColor"
          />
          <path
            d="M80 26H98L94 10H84L80 26Z"
            fill="currentColor"
            opacity="0.55"
          />
          <path
            d="M24 78H38V102H24V78Z"
            fill="currentColor"
            opacity="0.38"
          />
          <path
            d="M48 78H62V102H48V78Z"
            fill="currentColor"
            opacity="0.38"
          />
          <path
            d="M72 78H86V102H72V78Z"
            fill="currentColor"
            opacity="0.38"
          />
        </svg>
      )}

      {type === "contact" && (
  <svg viewBox="0 0 120 120" fill="none">
    <defs>
      <mask id="alshafi-contact-cutout">
        <rect width="120" height="120" fill="white" />

        {/* دایره داخلی شفاف / سوراخ */}
        <circle cx="60" cy="47" r="16" fill="black" />
      </mask>
    </defs>

    <path
      d="M60 6C37.4 6 19 24.4 19 47C19 79 60 114 60 114C60 114 101 79 101 47C101 24.4 82.6 6 60 6Z"
      fill="currentColor"
      mask="url(#alshafi-contact-cutout)"
    />
  </svg>
)}
    </div>
  );
}