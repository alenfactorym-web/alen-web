
export default function GolyRozhSectionHeading({
  eyebrow = "EXPLORE",
  titleTop = "GOLY ROZH",
  titleBottom = "SECTION",
  desc = "",
  
  lang = "en",
  className = "",
}) {
  const safeLang = ["en", "ar", "ku"].includes(
    String(lang || "").toLowerCase(),
  )
    ? String(lang).toLowerCase()
    : "en";

  const isRTL = safeLang === "ar" || safeLang === "ku";

  const titleFont =
    safeLang === "ar"
      ? "font-ar-title"
      : safeLang === "ku"
        ? "ku-title"
        : "";

  const bodyFont =
    safeLang === "ar"
      ? "font-ar-body"
      : safeLang === "ku"
        ? "ku-title"
        : "";
  return (
    <div
  className={`goly-rozh-section-heading ${className}`}
  dir={isRTL ? "rtl" : "ltr"}
>
  <p className={`goly-rozh-section-eyebrow ${titleFont}`}>
    {eyebrow}
  </p>

  <h2 className="goly-rozh-section-title">
    <span
      className={`goly-rozh-section-top-title ${
        safeLang === "ar" ? "" : titleFont
      }`}
    >
      {titleTop}
    </span>

    <span className={`goly-rozh-section-bottom-title ${titleFont}`}>
      {titleBottom}
    </span>
  </h2>

      <div
        className="goly-rozh-heading-line"
        aria-hidden="true"
      />

      {desc ? (
        <p className={`goly-rozh-section-desc ${bodyFont}`}>
          {desc}
        </p>
      ) : null}
    </div>
  );
}