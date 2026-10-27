const PRIMARY_PATH = `
  M132 126
  C183 86 250 84 308 72
  C368 60 429 88 454 137
  C477 181 463 227 477 268
  C491 315 461 363 414 388
  C365 414 309 406 257 416
  C205 426 153 406 127 365
  C102 326 112 285 101 246
  C90 202 96 160 132 126
  Z
`;


const SHAPE = {
  d: PRIMARY_PATH,

  solidScale: 1.02,
  solidRotate: -6,

  dottedScale: 1.03,
  dottedRotate: 3,
};

function hashString(value = "") {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}


function ScaleAroundCenter({
  scale,
  rotate,
  children,
}) {
  return (
    <g
      transform={`rotate(${rotate} 380 270)`}
    >
      <g
        transform={`
          translate(380 270)
          scale(${scale})
          translate(-380 -270)
        `}
      >
        {children}
      </g>
    </g>
  );
}


export default function OrganicProductShape({
  index,
  seed = "",
  className = "",
}) {
  const shape = SHAPE;

  const uid =
    `${hashString(seed)}-${index}`;

  const gradientId =
    `goly-shape-gradient-${uid}`;

  const highlightId =
    `goly-shape-highlight-${uid}`;

  return (
    <svg
  className={className}
  viewBox="0 0 760 540"
  preserveAspectRatio="xMidYMid meet"
  aria-hidden="true"
  focusable="false"
>
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#c82c35"
          />

          <stop
            offset="0.48"
            stopColor="#ad1822"
          />

          <stop
            offset="1"
            stopColor="#8e0d17"
          />
        </linearGradient>

        <radialGradient
          id={highlightId}
          cx="0.26"
          cy="0.17"
          r="0.72"
        >
          <stop
            offset="0"
            stopColor="#ffffff"
            stopOpacity="0.16"
          />

          <stop
            offset="0.5"
            stopColor="#ffffff"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>


    <g>
  {/* ==================================================
      ORGANIC RED SHAPE
      ================================================== */}

      <path
        d={shape.d}
        fill={`url(#${gradientId})`}
      />

      <path
        d={shape.d}
        fill={`url(#${highlightId})`}
      />


      {/* ==================================================
          OUTER SOLID CONTOUR

          Same exact path as red shape,
          but larger and independently rotated.
          ================================================== */}

<g data-layer="solid-contour">
  <ScaleAroundCenter
    scale={shape.solidScale}
    rotate={shape.solidRotate}
  >
    <path
      d={shape.d}
      fill="none"
      stroke="#c85a60"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      opacity="0.58"
    />
  </ScaleAroundCenter>
</g>
      {
/* ==================================================
          SECOND DOTTED CONTOUR
          ================================================== */}

   <g data-layer="dotted-contour">
  <ScaleAroundCenter
    scale={shape.dottedScale}
    rotate={shape.dottedRotate}
  >
    <path
      d={shape.d}
      fill="none"
      stroke="#d98387"
      strokeWidth="0.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="3 10"
      vectorEffect="non-scaling-stroke"
      opacity="0.42"
    />
  </ScaleAroundCenter>
</g>

</g>

</svg>  );
}