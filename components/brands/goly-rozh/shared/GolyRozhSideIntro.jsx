import GolyRozhSectionHeading from "./GolyRozhSectionHeading";
import styles from "./GolyRozhSideIntro.module.css";

export default function GolyRozhSideIntro({
  lang = "en",
  variant = "default",

  eyebrow = "EXPLORE",
  titleTop = "GOLY ROZH",
  titleBottom = "SECTION",
  desc = "",

  features = [],

  iconSrc = "",
  iconAlt = "",
}) {
  const safeLang = ["en", "ar", "ku"].includes(
    String(lang || "").toLowerCase(),
  )
    ? String(lang).toLowerCase()
    : "en";

  const isRTL = safeLang === "ar" || safeLang === "ku";

  return (
    <aside
      className={`${styles.root} ${styles[variant] || ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={styles.headingWrap}>
        <GolyRozhSectionHeading
          eyebrow={eyebrow}
          titleTop={titleTop}
          titleBottom={titleBottom}
          desc={desc}
          lang={safeLang}
          
        />
      </div>

      {iconSrc ? (
        <img
          src={iconSrc}
          alt={iconAlt}
          className={styles.icon}
          draggable="false"
        />
      ) : null}

      {features.length > 0 ? (
        <div className={styles.features}>
          {features.map((item, index) => (
            <div
              key={`${item?.title || "feature"}-${index}`}
              className={styles.featureItem}
            >
              {item?.title ? <h3>{item.title}</h3> : null}

              {item?.desc ? <p>{item.desc}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}