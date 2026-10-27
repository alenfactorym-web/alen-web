export default function GolyRozhSectionWatermark({
  children,
  className = "",
}) {
  if (!children) {
    return null;
  }

  return (
    <div
      className={`goly-rozh-section-watermark ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}