\# ALEN Factory — PROJECT LOCK (UI Contract)



هدف: از این به بعد ارتقا می‌دیم، ولی خروجی UI/UX نباید خراب بشه.

هر تغییری مجازه، به شرطی که این قوانین نقض نشه.



\## 1) Fonts (قفل)

\- Base site font: \*\*Montserrat\*\* (از `app/layout.jsx`)

\- Arabic:

&nbsp; - کلاس: `.font-ar`

&nbsp; - فونت: `AlQabas`

&nbsp; - فقط برای متن‌های عربی استفاده شود.

\- Kurdish:

&nbsp; - کلاس: `.font-ku`

&nbsp; - فونت: `Sarchia Sulaimani` (فایل: `public/fonts/88\_Sarchia\_Sulaimani.ttf`)

&nbsp; - فقط برای متن‌های کردی استفاده شود.

\- Brand names زیر لوگوها:

&nbsp; - همیشه \*\*English / ثابت\*\*

&nbsp; - نباید `.font-ar` یا `.font-ku` بگیرند.



\## 2) Direction / RTL (قفل)

\- `ar` و `ku` => RTL فعال

\- Language switcher و Header container همیشه `dir="ltr"` برای ثابت ماندن جای منو/زبان.

\- ترتیب لوگوها در BrandSlider نباید عوض شود => wrapper `dir="ltr"` ثابت.



\## 3) Header (قفل)

\- Fixed/Sticky glass style

\- منو: سمت چپ

\- زبان‌ها: سمت راست

\- فونت منو و زبان‌ها همیشه \*\*inherit (Montserrat)\*\* و نباید با کردی/عربی تغییر کند.

\- Active pill: مشکی + halo و dot زرد (مثل نسخه فعلی)



\## 4) Hero (قفل)

\- Background: `/public/hero-desktop.webp`

\- Overlay spice:

&nbsp; - PNG: `/public/overlays/spice.png`

&nbsp; - Hover video: `/public/overlays/spice-black.webm`

&nbsp; - Component: `SpiceOverlayHover.jsx`

\- Button رنگ: `bg-yellow-400`

\- متن‌ها:

&nbsp; - English title: `.alen-title`

&nbsp; - Arabic title/subtitle: `.font-ar`

&nbsp; - Kurdish title/subtitle: `.font-ku`



\## 5) BrandSlider (قفل)

\- Background پشت کارت‌ها: دو رنگ (Top dark / Bottom white) یا طبق آخرین تصمیم پروژه

\- Cards:

&nbsp; - border-bottom رنگ برند باقی بماند

&nbsp; - ring/glow و shimmer روی اسم برندها در hover

&nbsp; - نوار/دایره زیر اسم برند حذف شده و نباید برگردد

\- Brand names زیر لوگوها: ثابت و English، فونت/وزن نباید با زبان تغییر کند.



\## 6) Upgrade Rule (قانون ارتقا)

\- فایل‌های v1 «پایدار» هستند.

\- هر ارتقا با فایل v2 انجام می‌شود (نسخه جدید)، سپس بعد از تایید، v2 جایگزین فعال می‌شود.

\- هیچوقت مستقیم v1 را تغییر نده مگر برای bugfix کوچک که UI Contract را نقض نکند.



