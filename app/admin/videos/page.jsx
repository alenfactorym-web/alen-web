"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clapperboard, ListOrdered, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAdminBrand } from "../components/AdminBrandContext";
import { confirmDelete } from "@/lib/adminConfirmDelete";

function normalizeBrandKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

const BRAND_ALIASES = {
  alen: ["alen", "alen-factory", "alenfactory"],
  alshafi: ["alshafi", "al-shafi"],
  "goly-rozh": ["goly-rozh", "goly-rozhh", "golyrozh", "goly rozh"],
  "goli-alen": ["goli-alen", "golialen", "goli alen"],
  "alen-plus": ["alen-plus", "alenplus", "alen plus"],
};

const EMPTY_FORM = {
  brandId: "",
  title: {
    en: "",
    ar: "",
    ku: "",
  },
  youtubeUrl: "",
  date: "",
};

function toInputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function getCurrentLocalDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/shorts/")[1] || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export default function AdminVideosPage() {
  const { lang, t } = useLanguage();
  const tt = t || {};
  const { brand, accentColor } = useAdminBrand();

  const [videos, setVideos] = useState([]);
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rightCardHeight, setRightCardHeight] = useState(null);
  const leftFormRef = useRef(null);

  const adminTitleFont =
    lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const adminBodyFont =
    lang === "ar"
      ? "font-ar-body text-[16px]"
      : lang === "ku"
      ? "ku-body text-[16px]"
      : "text-[18px]";

  const selectedBrand = useMemo(() => {
    const currentKey = normalizeBrandKey(brand);
    const aliases = BRAND_ALIASES[currentKey] || [currentKey];

    return (
      brands.find((item) => {
        const slugKey = normalizeBrandKey(item?.slugValue);
        const titleEnKey = normalizeBrandKey(item?.title_en);
        return aliases.includes(slugKey) || aliases.includes(titleEnKey);
      }) || null
    );
  }, [brands, brand]);

  function getLocalizedTitle(item) {
    if (!item) return "—";

    if (lang === "ar") {
      return item.title_ar || item.title_en || "Untitled";
    }

    if (lang === "ku") {
      return item.title_ku || item.title_en || "Untitled";
    }

    return item.title_en || "Untitled";
  }

  async function loadVideos() {
    setLoading(true);

    try {
      const [videosRes, brandsRes] = await Promise.all([
        fetch(`/api/admin/videos?brand=${brand}`, { cache: "no-store" }),
        fetch("/api/admin/brands", { cache: "no-store" }),
      ]);

      const videosData = await videosRes.json();
      const brandsData = await brandsRes.json();

      if (!videosRes.ok) {
        console.error("LOAD VIDEOS API ERROR:", videosData);
        setVideos([]);
      } else {
        setVideos(Array.isArray(videosData) ? videosData : []);
      }

      if (!brandsRes.ok) {
        console.error("LOAD BRANDS API ERROR:", brandsData);
        setBrands([]);
      } else {
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      }
    } catch (error) {
      console.error("LOAD VIDEOS ERROR:", error);
      setVideos([]);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
  }, [brand]);

  useEffect(() => {
    function syncRightCardHeight() {
      if (!leftFormRef.current) return;
      setRightCardHeight(leftFormRef.current.offsetHeight);
    }

    syncRightCardHeight();

    const raf = requestAnimationFrame(syncRightCardHeight);
    window.addEventListener("resize", syncRightCardHeight);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", syncRightCardHeight);
    };
  }, [editingId, submitting, loading, lang, form]);

  useEffect(() => {
    if (!editingId && selectedBrand?._id) {
      setForm((prev) => ({
        ...prev,
        brandId: selectedBrand._id,
      }));
    }
  }, [selectedBrand, editingId]);

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateTitle(langKey, value) {
    setForm((prev) => ({
      ...prev,
      title: {
        ...prev.title,
        [langKey]: value,
      },
    }));
  }

  function resetForm() {
    setForm({
      ...EMPTY_FORM,
      brandId: selectedBrand?._id || "",
    });
    setEditingId(null);
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      brandId: item.brandId || selectedBrand?._id || "",
      title: {
        en: item.title_en || "",
        ar: item.title_ar || "",
        ku: item.title_ku || "",
      },
      youtubeUrl: item.youtubeUrl || "",
      date: toInputDate(item.date),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedBrand?._id || !form.title.en.trim() || !form.youtubeUrl.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const fd = new FormData();

      if (editingId) {
        fd.append("id", editingId);
      }

      fd.append("brandId", selectedBrand._id);
      fd.append("title_en", form.title.en.trim());
      fd.append("title_ar", form.title.ar.trim());
      fd.append("title_ku", form.title.ku.trim());
      fd.append("youtubeUrl", form.youtubeUrl.trim());
      fd.append("date", form.date || "");

      const res = await fetch("/api/admin/videos", {
        method,
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("SAVE VIDEO ERROR:", data);
        alert(data?.details || data?.message || "Failed to save video");
        return;
      }

      resetForm();
      await loadVideos();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteVideo(id) {
    if (!confirmDelete(tt.adminDeleteConfirm)) return;

    await fetch("/api/admin/videos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (editingId === id) {
      resetForm();
    }

    await loadVideos();
  }

  const formTitle = useMemo(() => {
    return editingId
      ? tt.adminEditVideo || `${tt.adminEdit || "Edit"} ${tt.adminVideos || "Video"}`
      : tt.adminAddVideo || `${tt.adminAdd || "Add"} ${tt.adminVideos || "Video"}`;
  }, [editingId, tt]);

  return (
    <div className="max-w-[1180px]">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <form
            ref={leftFormRef}
            onSubmit={handleSubmit}
            className="group flex flex-col rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.18)] dark:border-white/15 dark:bg-white/10"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                className={`text-xl font-black uppercase ${adminTitleFont}`}
                style={{ color: accentColor }}
              >
                {formTitle}
              </h2>

              <Clapperboard
                size={20}
                strokeWidth={2.2}
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110"
                style={{ color: accentColor }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminBrand || "Brand"}
                </label>
                <input
                  value={getLocalizedTitle(selectedBrand)}
                  disabled
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminTitleEn || "Title EN"}
                </label>
                <input
                  value={form.title.en}
                  onChange={(e) => updateTitle("en", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminEnglishTitle || "English title"}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminTitleAr || "Title AR"}
                </label>
                <input
                  value={form.title.ar}
                  onChange={(e) => updateTitle("ar", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminArabicTitle || "Arabic title"}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminTitleKu || "Title KU"}
                </label>
                <input
                  value={form.title.ku}
                  onChange={(e) => updateTitle("ku", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminKurdishTitle || "Kurdish title"}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  YouTube URL
                </label>
                <input
                  value={form.youtubeUrl}
                  onChange={(e) => updateField("youtubeUrl", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminPublishDate || "Publish Date"}
                </label>

                <div className="flex items-center overflow-hidden rounded-xl border border-black/15 bg-white dark:border-white/20 dark:bg-white/10">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => updateField("date", getCurrentLocalDate())}
                    className="shrink-0 border-l border-black/10 px-4 py-3 text-xs font-medium text-neutral-500 transition hover:text-neutral-700 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
                  >
                    Set current date
                  </button>
                </div>
              </div>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-xl border border-black/10 bg-white px-5 py-3 font-semibold text-neutral-700 transition-all duration-300 hover:bg-black/5 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  {tt.adminCancelEdit ||
                    `${tt.adminCancel || "Cancel"} ${tt.adminEdit || "Edit"}`}
                </button>
              ) : null}

              <button
                type="submit"
                disabled={submitting || !selectedBrand?._id}
                className={`w-full rounded-xl px-5 py-3 font-semibold transition-all duration-300 disabled:opacity-60 ${adminBodyFont}`}
                style={{
                  backgroundColor: accentColor,
                  color: brand === "alen" ? "black" : "white",
                }}
              >
                {submitting
                  ? tt.adminSaving || "Saving..."
                  : editingId
                  ? tt.adminUpdateVideo ||
                    `${tt.adminUpdate || "Update"} ${tt.adminVideos || "Video"}`
                  : tt.adminAddVideo ||
                    `${tt.adminAdd || "Add"} ${tt.adminVideos || "Video"}`}
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-7">
          <div
            className="group flex flex-col rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.18)] dark:border-white/15 dark:bg-white/10"
            style={rightCardHeight ? { height: `${rightCardHeight}px` } : undefined}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                className={`text-xl font-black uppercase ${adminTitleFont}`}
                style={{ color: accentColor }}
              >
                {tt.adminVideoList ||
                  `${tt.adminVideos || "Video"} ${tt.adminList || "List"}`}
              </h2>

              <ListOrdered
                size={20}
                strokeWidth={2.2}
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                style={{ color: accentColor }}
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-20 rounded-2xl border border-black/8 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]" />
                <div className="h-20 rounded-2xl border border-black/8 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]" />
                <div className="h-20 rounded-2xl border border-black/8 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]" />
              </div>
            ) : (
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
                {videos.map((item) => {
                  const thumb = item.thumbnailUrl || getYouTubeThumb(item.youtubeUrl);

                  return (
                    <div
                      key={item._id}
                      className="flex items-start justify-between rounded-2xl border border-black/10 bg-white px-4 py-4 dark:border-white/15 dark:bg-white/5"
                    >
                      <div className="flex min-w-0 items-start gap-3 pr-4">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={getLocalizedTitle(item)}
                            className="h-14 w-14 shrink-0 rounded-xl border border-black/10 object-cover bg-white dark:border-white/15 dark:bg-white/10"
                          />
                        ) : (
                          <div className="h-14 w-14 shrink-0 rounded-xl border border-dashed border-black/10 bg-black/[0.02] dark:border-white/15 dark:bg-white/[0.04]" />
                        )}

                        <div className="min-w-0">
                          <div className={`font-bold ${adminBodyFont}`}>
                            {getLocalizedTitle(item)}
                          </div>

                          <div className="mt-1 text-xs text-neutral-500 dark:text-white/60">
                            {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-black/5 dark:border-white/15 dark:bg-white/10 dark:text-white"
                        >
                          <Pencil size={14} strokeWidth={2.4} />
                          {tt.adminEdit || "Edit"}
                        </button>

                        <button
                          onClick={() => deleteVideo(item._id)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          <Trash2 size={14} strokeWidth={2.4} />
                          {tt.adminDelete || "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {!videos.length ? (
                  <div className="rounded-2xl border border-dashed border-black/10 px-4 py-10 text-center text-sm font-semibold text-neutral-500 dark:border-white/15 dark:text-white/60">
                    {tt.adminNoItemsFound || "No items found."}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

