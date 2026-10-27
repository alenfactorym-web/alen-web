import styles from "./HeroCurve.module.css";
export default function HeroCurve({ color }) {
  return (
    <div
  className={styles.heroCurve}
  aria-hidden="true"
  style={color ? { color } : undefined}
>
      <svg
        className={`${styles.heroCurveSvg} ${styles.heroCurveLandscape}`}
        viewBox="0 0 1600 180"
        preserveAspectRatio="none"
      >
        <path
          className={styles.heroCurveRed}
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
          className={styles.heroCurveStroke}
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
        className={`${styles.heroCurveSvg} ${styles.heroCurvePortrait}`}
        viewBox="0 0 1000 180"
        preserveAspectRatio="none"
      >
        <path
          className={styles.heroCurveRed}
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
          className={styles.heroCurveStroke}
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