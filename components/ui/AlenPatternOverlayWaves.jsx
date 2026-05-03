"use client";

export default function AlenPatternOverlayWaves() {
  const wavePath = "M50 0 Q80 50 50 100 Q20 150 50 200 L0 200 L0 0 Z";

  return (
   <div
  aria-hidden="true"
  className="pointer-events-none fixed inset-0 z-[1] hidden lg:flex justify-between overflow-hidden"
>
      {/* LEFT */}
      <div className="relative h-full w-[120px] sm:w-[180px]">
        {/* Layer 1: White base */}
        <div className="ab-layer">
          <svg
            className="ab-svg animate-up"
            style={{ animationDuration: "25s" }}
            preserveAspectRatio="none"
            viewBox="0 0 100 400"
          >
            <path d={wavePath} fill="rgba(120,120,120,0.06)" />
            <path d={wavePath} fill="rgba(120,120,120,0.06)" transform="translate(0, 200)" />
          </svg>
        </div>

        {/* Layer 2: Yellow soft */}
        <div className="ab-layer opacity-70">
          <svg
            className="ab-svg animate-up"
            style={{ animationDuration: "18s" }}
            preserveAspectRatio="none"
            viewBox="0 0 100 400"
          >
            <path d={wavePath} fill="rgba(120,120,120,0.16)" />
            <path d={wavePath} fill="rgba(120,120,120,0.16)" transform="translate(0, 200)" />
          </svg>
        </div>

        {/* Layer 3: Yellow strong */}
        <div className="ab-layer opacity-65">
          <svg
            className="ab-svg animate-up"
            style={{ animationDuration: "12s" }}
            preserveAspectRatio="none"
            viewBox="0 0 100 400"
          >
            <path d={wavePath} fill="#FFFFFF" />
            <path d={wavePath} fill="#FFFFFF" transform="translate(0, 200)" />
          </svg>
        </div>
      </div>

     {/* RIGHT (mirrored) */}
<div className="relative h-full w-[120px] sm:w-[180px] -scale-x-100">
  {/* Layer 1 */}
  <div className="ab-layer">
    <svg
      className="ab-svg animate-down"
      style={{ animationDuration: "20s" }}
      preserveAspectRatio="none"
      viewBox="0 0 100 400"
    >
      <path d={wavePath} fill="rgba(120,120,120,0.06)" />
      <path d={wavePath} fill="rgba(120,120,120,0.06)" transform="translate(0, 200)" />
    </svg>
  </div>

  {/* Layer 2 */}
  <div className="ab-layer opacity-70">
    <svg
      className="ab-svg animate-down"
      style={{ animationDuration: "18s" }}
      preserveAspectRatio="none"
      viewBox="0 0 100 400"
    >
      <path d={wavePath} fill="rgba(120,120,120,0.16)" />
      <path d={wavePath} fill="rgba(120,120,120,0.16)" transform="translate(0, 200)" />
    </svg>
  </div>

  {/* Layer 3 */}
  <div className="ab-layer opacity-65">
    <svg
      className="ab-svg animate-down"
      style={{ animationDuration: "12s" }}
      preserveAspectRatio="none"
      viewBox="0 0 100 400"
    >
      <path d={wavePath} fill="#FFFFFF" />
            <path d={wavePath} fill="#FFFFFF" transform="translate(0, 200)" />

    </svg>
  </div>
</div>

      <style jsx>{`
        .ab-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .ab-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 200%;
          will-change: transform;
        }

        .animate-up {
          animation-name: slideUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .animate-down {
          animation-name: slideDown;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes slideUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(0);
          }
        }

        svg path {
          stroke: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-svg {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

