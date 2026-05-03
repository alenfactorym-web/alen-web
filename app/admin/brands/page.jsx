"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, ListOrdered, Pencil, Tags, Trash2, X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAdminBrand } from "../components/AdminBrandContext";
import { confirmDelete } from "@/lib/adminConfirmDelete";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const EMPTY_FORM = {
  title: {
    en: "",
    ar: "",
    ku: "",
  },
  color: "",
  logoFile: null,
  logoPreview: "",
  removeLogo: false,
};

export default function AdminBrandsPage() {
  const { lang, t } = useLanguage();
  const tt = t || {};
  const { brand } = useAdminBrand();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accentColor, setAccentColor] = useState("#f5c400");

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

  useEffect(() => {
    if (brand !== "alen") {
      const sp = new URLSearchParams(searchParams?.toString() || "");
      sp.set("lang", lang || "en");
      const qs = sp.toString();
      router.replace(`/admin/home${qs ? `?${qs}` : ""}`);
    }
  }, [brand, lang, router, searchParams]);

  function getLocalizedTitle(item) {
    if (!item) return "—";

    if (lang === "ar") {
      return item.title_ar || item.titleAr || item.title || item.title_en || "Untitled";
    }

    if (lang === "ku") {
      return item.title_ku || item.titleKu || item.title || item.title_en || "Untitled";
    }

    return item.title_en || item.titleEn || item.title || "Untitled";
  }

  async function loadBrands() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/brands", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        console.error("LOAD BRANDS ERROR:", data);
        setBrands([]);
        return;
      }

      const list = Array.isArray(data) ? data : [];
      setBrands(list);

      const currentBrand = list.find((item) => item.slugValue === brand);
      setAccentColor(currentBrand?.color || "#f5c400");
    } catch (error) {
      console.error("LOAD BRANDS FETCH ERROR:", error);
      setBrands([]);
      setAccentColor("#f5c400");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrands();
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

  function updateTitle(langKey, value) {
    setForm((prev) => ({
      ...prev,
      title: {
        ...prev.title,
        [langKey]: value,
      },
    }));
  }

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateImage(file) {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      logoFile: file,
      logoPreview: preview,
      removeLogo: false,
    }));
  }

  function removeImage() {
    setForm((prev) => ({
      ...prev,
      logoFile: null,
      logoPreview: "",
      removeLogo: true,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(brandItem) {
    setEditingId(brandItem._id);
    setForm({
      title: {
        en: brandItem.title_en || "",
        ar: brandItem.title_ar || "",
        ku: brandItem.title_ku || "",
      },
      color: brandItem.color || "",
      logoFile: null,
      logoPreview: brandItem.logoUrl || "",
      removeLogo: false,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.en.trim()) return;

    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const fd = new FormData();

      if (editingId) fd.append("id", editingId);

      fd.append("title_en", form.title.en.trim());
      fd.append("title_ar", form.title.ar.trim());
      fd.append("title_ku", form.title.ku.trim());
      fd.append("color", form.color.trim());
      fd.append("removeLogo", String(form.removeLogo));

      if (form.logoFile) {
        fd.append("logo", form.logoFile);
      }

      const res = await fetch("/api/admin/brands", {
        method,
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("BRAND SAVE ERROR:", data);
        alert(data?.details || data?.message || "Failed to save brand");
        return;
      }

      resetForm();
      await loadBrands();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteBrand(id) {
    if (!confirmDelete(tt.adminDeleteConfirm)) return;

    await fetch("/api/admin/brands", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (editingId === id) {
      resetForm();
    }

    await loadBrands();
  }

  const formTitle = useMemo(() => {
    return editingId
      ? tt.adminEditBrand ||
          `${tt.adminEdit || "Edit"} ${tt.adminBrand || "Brand"}`
      : tt.adminAddBrand ||
          `${tt.adminAdd || "Add"} ${tt.adminBrand || "Brand"}`;
  }, [editingId, tt]);

  if (brand !== "alen" || pathname !== "/admin/brands") {
    return null;
  }

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

              <Tags
                size={20}
                strokeWidth={2.2}
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110"
                style={{ color: accentColor }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminTitleEn || "Title EN"}
                </label>
                <input
                  value={form.title.en}
                  onChange={(e) => updateTitle("en", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminBrandEnglishTitle || "English brand title"}
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
                  placeholder={tt.adminBrandArabicTitle || "Arabic brand title"}
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
                  placeholder={tt.adminBrandKurdishTitle || "Kurdish brand title"}
                />
              </div>

              <div>
               <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
  {tt.adminColor || "Color"}
</label>
                <input
                  value={form.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder="#f5c400"
                />
              </div>

              <div>
               <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
  {tt.adminLogo || "Logo"}
</label>
                {form.logoPreview ? (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
                    <img
                      src={form.logoPreview}
                      alt="Logo preview"
                      className="h-40 w-full object-contain bg-white dark:bg-white/5"
                    />
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 px-4 py-3 text-sm font-semibold text-neutral-600 hover:bg-black/[0.03] dark:border-white/20 dark:text-white dark:hover:bg-white/[0.04]">
                  <ImagePlus size={16} />
{tt.adminLogo || "Logo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => updateImage(e.target.files?.[0])}
                    />
                  </label>

                  {form.logoPreview ? (
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

              <div className="space-y-3">
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`w-full rounded-xl border border-black/15 bg-white px-5 py-3 font-semibold text-neutral-700 transition-all duration-300 hover:bg-black/[0.03] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/[0.06] ${adminBodyFont}`}
                  >
                    {tt.adminCancel || "Cancel"}
                  </button>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full rounded-xl px-5 py-3 font-semibold transition-all duration-300 disabled:opacity-60 ${adminBodyFont}`}
                  style={{
                    backgroundColor: accentColor,
                    color: brand === "alen" ? "black" : "white",
                  }}
                >
                  {submitting
                    ? tt.adminSaving || "Saving..."
                    : editingId
                    ? tt.adminUpdateBrand ||
                      `${tt.adminUpdate || "Update"} ${tt.adminBrand || "Brand"}`
                    : tt.adminAddBrand ||
                      `${tt.adminAdd || "Add"} ${tt.adminBrand || "Brand"}`}
                </button>
              </div>
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
                {tt.adminBrandList ||
                  `${tt.adminBrand || "Brand"} ${tt.adminList || "List"}`}
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
                {brands.map((brandItem) => (
                  <div
                    key={brandItem._id}
                    className="flex items-start justify-between rounded-2xl border border-black/10 bg-white px-4 py-4 dark:border-white/15 dark:bg-white/5"
                  >
                    <div className="flex min-w-0 gap-4 pr-4">
                      {brandItem.logoUrl ? (
                        <img
                          src={brandItem.logoUrl}
                          alt="Logo"
                          className="h-14 w-14 rounded-xl object-contain border border-black/10 bg-white p-1 dark:border-white/15 dark:bg-white/10"
                        />
                      ) : null}

                      <div className="min-w-0">
                        <div className={`font-bold ${adminBodyFont}`}>
                          {getLocalizedTitle(brandItem)}
                        </div>

                        <div className="mt-1 text-xs text-neutral-500 dark:text-white/60">
                          AR: {brandItem.title_ar || "—"} | KU: {brandItem.title_ku || "—"}
                        </div>

                        <div className="mt-2 text-xs text-neutral-500 dark:text-white/60">
                          Color: {brandItem.color || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => startEdit(brandItem)}
                        className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-black/5 dark:border-white/15 dark:bg-white/10 dark:text-white"
                      >
                        <Pencil
                          size={14}
                          strokeWidth={2.4}
                          className="text-neutral-700 dark:text-white"
                        />
                        {tt.adminEdit || "Edit"}
                      </button>

                      <button
                        onClick={() => deleteBrand(brandItem._id)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        <Trash2 size={14} strokeWidth={2.4} />
                        {tt.adminDelete || "Delete"}
                      </button>
                    </div>
                  </div>
                ))}

                {!brands.length ? (
                  <div className="rounded-2xl border border-dashed border-black/10 px-4 py-10 text-center text-sm font-semibold text-neutral-500 dark:border-white/15 dark:text-white/60">
                    {tt.adminNoBrandsFound ||
                      tt.adminNoItemsFound ||
                      "No brands found."}
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

