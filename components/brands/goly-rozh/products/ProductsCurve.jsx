import styles from "./ProductsCurve.module.css";

export default function ProductsCurve() {
  return (
    <div className={styles.curve} aria-hidden="true">
      <svg
        className={`${styles.curveSvg} ${styles.curveSvgLandscape}`}
        viewBox="0 0 1600 180"
        preserveAspectRatio="none"
      >
        <path
          className={styles.redCurve}
          fill="currentColor"
          d="
            M0 0
            C240 0, 430 0, 560 6
            C670 11, 745 40, 800 150
            C855 40, 930 11, 1040 6
            C1170 0, 1360 0, 1600 0
            L1600 0
            L0 0
            Z
          "
        />

        <path
          className={styles.curveStroke}
          fill="none"
          stroke="#c7c7c7"
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          d="
            M0 0
            C240 0, 430 0, 560 6
            C670 11, 745 40, 800 150
            C855 40, 930 11, 1040 6
            C1170 0, 1360 0, 1600 0
          "
        />
      </svg>

      <svg
        className={`${styles.curveSvg} ${styles.curveSvgPortrait}`}
        viewBox="0 0 1000 180"
        preserveAspectRatio="none"
      >
        <path
          className={styles.redCurve}
          fill="currentColor"
          d="
            M0 0
            C90 0, 140 0, 190 2
            C340 4, 420 30, 500 138
            C580 30, 660 4, 810 2
            C860 0, 910 0, 1000 0
            L1000 0
            L0 0
            Z
          "
        />

        <path
          className={styles.curveStroke}
          fill="none"
          stroke="#c7c7c7"
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          d="
            M0 0
            C90 0, 140 0, 190 2
            C340 4, 420 30, 500 138
            C580 30, 660 4, 810 2
            C860 0, 910 0, 1000 0
          "
        />
      </svg>
    </div>
  );
}