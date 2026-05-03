export const languages = ["en", "ar", "ku"] as const;
export type Language = (typeof languages)[number];