"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Newspaper, ListOrdered, Pencil, Trash2, ImagePlus, X } from "lucide-react";
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
  excerpt: {
    en: "",
    ar: "",
    ku: "",
  },
  publishDate: "",
  coverImage: null,
  coverImagePreview: "",
  removeCoverImage: false,
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

export default function AdminNewsPage() {
  const { lang, t } = useLanguage();
  const tt = t || {};
  const { brand, accentColor } = useAdminBrand();

  const [newsList, setNewsList] = useState([]);
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

  async function loadNews() {
    setLoading(true);

    try {
      const [newsRes, brandsRes] = await Promise.all([
        fetch(`/api/admin/news?brand=${brand}`, { cache: "no-store" }),
        fetch("/api/admin/brands", { cache: "no-store" }),
      ]);

      const newsData = await newsRes.json();
      const brandsData = await brandsRes.json();

      if (!newsRes.ok) {
        console.error("LOAD NEWS API ERROR:", newsData);
        setNewsList([]);
      } else {
        setNewsList(Array.isArray(newsData) ? newsData : []);
      }

      if (!brandsRes.ok) {
        console.error("LOAD BRANDS API ERROR:", brandsData);
        setBrands([]);
      } else {
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      }
    } catch (error) {
      console.error("LOAD NEWS ERROR:", error);
      setNewsList([]);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
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

  function updateExcerpt(langKey, value) {
    setForm((prev) => ({
      ...prev,
      excerpt: {
        ...prev.excerpt,
        [langKey]: value,
      },
    }));
  }

  function updateImage(file) {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      coverImage: file,
      coverImagePreview: preview,
      removeCoverImage: false,
    }));
  }

  function removeImage() {
    setForm((prev) => ({
      ...prev,
      coverImage: null,
      coverImagePreview: "",
      removeCoverImage: true,
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
      excerpt: {
        en: item.excerpt_en || "",
        ar: item.excerpt_ar || "",
        ku: item.excerpt_ku || "",
      },
      publishDate: toInputDate(item.publishDate),
      coverImage: null,
      coverImagePreview: item.coverImageUrl || "",
      removeCoverImage: false,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedBrand?._id || !form.title.en.trim()) {
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

      fd.append("excerpt_en", form.excerpt.en.trim());
      fd.append("excerpt_ar", form.excerpt.ar.trim());
      fd.append("excerpt_ku", form.excerpt.ku.trim());

      fd.append("publishDate", form.publishDate || "");
      fd.append("removeCoverImage", String(form.removeCoverImage));

      if (form.coverImage) {
        fd.append("coverImage", form.coverImage);
      }

      const res = await fetch("/api/admin/news", {
        method,
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("SAVE NEWS ERROR:", data);
        alert(data?.details || data?.message || "Failed to save news");
        return;
      }

      resetForm();
      await loadNews();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteNews(id) {
    if (!confirmDelete(tt.adminDeleteConfirm)) return;

    await fetch("/api/admin/news", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (editingId === id) {
      resetForm();
    }

    await loadNews();
  }

  const formTitle = useMemo(() => {
    return editingId
      ? tt.adminEditNews || `${tt.adminEdit || "Edit"} ${tt.adminNews || "News"}`
      : tt.adminAddNews || `${tt.adminAdd || "Add"} ${tt.adminNews || "News"}`;
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

              <Newspaper
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
                  {tt.adminExcerptEn || "Excerpt EN"}
                </label>
                <textarea
                  value={form.excerpt.en}
                  onChange={(e) => updateExcerpt("en", e.target.value)}
                  className="min-h-[90px] w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminEnglishExcerpt || "English excerpt"}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminExcerptAr || "Excerpt AR"}
                </label>
                <textarea
                  value={form.excerpt.ar}
                  onChange={(e) => updateExcerpt("ar", e.target.value)}
                  className="min-h-[90px] w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminArabicExcerpt || "Arabic excerpt"}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminExcerptKu || "Excerpt KU"}
                </label>
                <textarea
                  value={form.excerpt.ku}
                  onChange={(e) => updateExcerpt("ku", e.target.value)}
                  className="min-h-[90px] w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminKurdishExcerpt || "Kurdish excerpt"}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminPublishDate || "Publish Date"}
                </label>

                <div className="flex items-center overflow-hidden rounded-xl border border-black/15 bg-white dark:border-white/20 dark:bg-white/10">
                  <input
                    type="date"
                    value={form.publishDate}
                    onChange={(e) => updateField("publishDate", e.target.value)}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => updateField("publishDate", getCurrentLocalDate())}
                    className="shrink-0 border-l border-black/10 px-4 py-3 text-xs font-medium text-neutral-500 transition hover:text-neutral-700 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
                  >
                    Set current date
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminCoverImage || "Cover Image"}
                </label>

                {form.coverImagePreview ? (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
                    <img
                      src={form.coverImagePreview}
                      alt="News preview"
                      className="h-40 w-full object-cover bg-white dark:bg-white/5"
                    />
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 px-4 py-3 text-sm font-semibold text-neutral-600 hover:bg-black/[0.03] dark:border-white/20 dark:text-white dark:hover:bg-white/[0.04]">
                    <ImagePlus size={16} />
                    {tt.adminCoverImage || "Cover Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => updateImage(e.target.files?.[0])}
                    />
                  </label>

                  {form.coverImagePreview ? (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      <X size={16} />
                    </button>
                  ) : null}
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
                  ? tt.adminUpdateNews ||
                    `${tt.adminUpdate || "Update"} ${tt.adminNews || "News"}`
                  : tt.adminAddNews ||
                    `${tt.adminAdd || "Add"} ${tt.adminNews || "News"}`}
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
                {tt.adminNewsList ||
                  `${tt.adminNews || "News"} ${tt.adminList || "List"}`}
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
                {newsList.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between rounded-2xl border border-black/10 bg-white px-4 py-4 dark:border-white/15 dark:bg-white/5"
                  >
                    <div className="flex min-w-0 items-start gap-3 pr-4">
                      {item.coverImageUrl ? (
                        <img
                          src={item.coverImageUrl}
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
                          {item.publishDate
                            ? new Date(item.publishDate).toLocaleDateString()
                            : "—"}
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
                        onClick={() => deleteNews(item._id)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        <Trash2 size={14} strokeWidth={2.4} />
                        {tt.adminDelete || "Delete"}
                      </button>
                    </div>
                  </div>
                ))}

                {!newsList.length ? (
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

