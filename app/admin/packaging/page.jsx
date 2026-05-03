"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, ListOrdered, Pencil, Trash2, ImagePlus, X, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAdminBrand } from "../components/AdminBrandContext";
import { confirmDelete } from "@/lib/adminConfirmDelete";

const EMPTY_FORM = {
  brandId: "",
  categoryId: "",
  productGroupId: "",  
     title: {
    en: "",
    ar: "",
    ku: "",
  },
  image: null,
  imagePreview: "",
  removeImage: false,
};

export default function AdminPackagingPage() {
  const { lang, t } = useLanguage();
  const tt = t || {};
  const { brand, accentColor } = useAdminBrand();
const [openGroups, setOpenGroups] = useState({});
  const [packaging, setPackaging] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
const [productGroups, setProductGroups] = useState([]);

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
    return brands.find((item) => item.slugValue === brand) || null;
  }, [brands, brand]);

  const filteredCategories = useMemo(() => {
    if (!selectedBrand?._id) return [];
    return categories.filter((item) => item.brandId === selectedBrand._id);
  }, [categories, selectedBrand]);

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

  function getLocalizedLinkedTitle(item, baseKey) {
    if (!item) return "—";

    if (lang === "ar") {
      return (
        item[`${baseKey}Title_ar`] ||
        item[`${baseKey}TitleAr`] ||
        item[`${baseKey}Title`] ||
        item[`${baseKey}Title_en`] ||
        "—"
      );
    }

    if (lang === "ku") {
      return (
        item[`${baseKey}Title_ku`] ||
        item[`${baseKey}TitleKu`] ||
        item[`${baseKey}Title`] ||
        item[`${baseKey}Title_en`] ||
        "—"
      );
    }

    return (
      item[`${baseKey}Title_en`] ||
      item[`${baseKey}TitleEn`] ||
      item[`${baseKey}Title`] ||
      "—"
    );
  }

  async function loadPackaging() {
    setLoading(true);

    try {
      const [packagingRes, brandsRes, categoriesRes, productGroupsRes] = await Promise.all([
  fetch(`/api/admin/packaging?brand=${brand}`, { cache: "no-store" }),
  fetch("/api/admin/brands", { cache: "no-store" }),
  fetch(`/api/admin/categories?brand=${brand}`, { cache: "no-store" }),
  fetch(`/api/admin/product-groups?brand=${brand}`, { cache: "no-store" }),
]);

      const packagingData = await packagingRes.json();
      const brandsData = await brandsRes.json();
      const categoriesData = await categoriesRes.json();
const productGroupsData = await productGroupsRes.json();
setPackaging(Array.isArray(packagingData) ? packagingData : []);
setBrands(Array.isArray(brandsData) ? brandsData : []);
setCategories(Array.isArray(categoriesData) ? categoriesData : []);
setProductGroups(
  Array.isArray(productGroupsData?.productGroups)
    ? productGroupsData.productGroups
    : []
);    } catch (error) {
      console.error("LOAD PACKAGING ERROR:", error);
      setPackaging([]);
setBrands([]);
setCategories([]);
setProductGroups([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPackaging();
  }, [brand]);
useEffect(() => {
  const next = {};

  packaging.forEach((item) => {
    const key = item.categoryId || "no-category";
    if (!(key in next)) next[key] = false;
  });

  setOpenGroups((prev) => ({ ...next, ...prev }));
}, [packaging]);
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

  useEffect(() => {
    setForm((prev) => {
      const nextCategoryValid = filteredCategories.some(
        (item) => item._id === prev.categoryId
      );

      return {
        ...prev,
        brandId: selectedBrand?._id || "",
        categoryId: nextCategoryValid ? prev.categoryId : "",
      };
    });
  }, [filteredCategories, selectedBrand]);

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

  function updateImage(file) {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: preview,
      removeImage: false,
    }));
  }

  function removeImage() {
    setForm((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
      removeImage: true,
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
  categoryId: item.categoryId || "",
  productGroupId: item.productGroupId || "",
  title: {
        en: item.title_en || "",
        ar: item.title_ar || "",
        ku: item.title_ku || "",
      },
            image: null,
      imagePreview: item.imageUrl || "",
      removeImage: false,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedBrand?._id || !form.categoryId || !form.title.en.trim()) {
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
      fd.append("categoryId", form.categoryId);
fd.append("productGroupId", form.productGroupId || "");

      fd.append("title_en", form.title.en.trim());
      fd.append("title_ar", form.title.ar.trim());
      fd.append("title_ku", form.title.ku.trim());

      
      fd.append("removeImage", String(form.removeImage));

      if (form.image) {
        fd.append("image", form.image);
      }

      const res = await fetch("/api/admin/packaging", {
        method,
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.details || data?.message || "Failed to save packaging");
        return;
      }

      resetForm();
      await loadPackaging();
    } finally {
      setSubmitting(false);
    }
  }

  async function deletePackaging(id) {
    if (!confirmDelete(tt.adminDeleteConfirm)) return;

    await fetch("/api/admin/packaging", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (editingId === id) {
      resetForm();
    }

    await loadPackaging();
  }

  const formTitle = useMemo(() => {
    return editingId
      ? tt.adminEditPackaging ||
          `${tt.adminEdit || "Edit"} ${tt.adminPackaging || "Packaging"}`
      : tt.adminAddPackaging ||
          `${tt.adminAdd || "Add"} ${tt.adminPackaging || "Packaging"}`;
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

              <Archive
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
                  {tt.adminCategoryLabel || "Category"}
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
  setForm((prev) => ({
    ...prev,
    categoryId: e.target.value,
    productGroupId: "",
  }))
}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                >
                  <option value="">
                    {tt.adminSelectCategory || "Select category"}
                  </option>
                  {filteredCategories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {getLocalizedTitle(item)}
                    </option>
                  ))}
                </select>
              </div>
<div>
  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
    Product Group
  </label>

  <select
    value={form.productGroupId || ""}
    onChange={(e) => updateField("productGroupId", e.target.value)}
    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
  >
    <option value="">No Group</option>

    {productGroups
      .filter(
        (pg) =>
          pg.brandId === selectedBrand?._id &&
          pg.categoryId === form.categoryId
      )
      .map((pg) => (
        <option key={pg._id} value={pg._id}>
          {getLocalizedTitle(pg)}
        </option>
      ))}
  </select>
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
                  {tt.adminPackagingImage || tt.adminImage || "Packaging Image"}
                </label>

                {form.imagePreview ? (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
                    <img
                      src={form.imagePreview}
                      alt="Packaging preview"
                      className="h-40 w-full object-cover bg-white dark:bg-white/5"
                    />
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 px-4 py-3 text-sm font-semibold text-neutral-600 hover:bg-black/[0.03] dark:border-white/20 dark:text-white dark:hover:bg-white/[0.04]">
                    <ImagePlus size={16} />
                    {tt.adminPackagingImage || tt.adminImage || "Packaging Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => updateImage(e.target.files?.[0])}
                    />
                  </label>

                  {form.imagePreview ? (
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
                  ? tt.adminUpdatePackaging ||
                    `${tt.adminUpdate || "Update"} ${tt.adminPackaging || "Packaging"}`
                  : tt.adminAddPackaging ||
                    `${tt.adminAdd || "Add"} ${tt.adminPackaging || "Packaging"}`}
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
                {tt.adminPackagingList ||
                  `${tt.adminPackaging || "Packaging"} ${tt.adminList || "List"}`}
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
{Object.entries(
  packaging.reduce((acc, item) => {
    const key = item.categoryId || "no-category";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {})
).map(([catId, groupItems]) => {
  const category = categories.find((c) => c._id === catId);

  return (
<div key={catId} className="space-y-3">
 <button
  type="button"
  onClick={() =>
    setOpenGroups((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }))
  }
className="flex w-full items-center justify-between rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-4 text-left hover:bg-black/[0.05] dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]">
  <div className="flex items-center gap-3">
    <ChevronRight
      size={16}
      strokeWidth={2.4}
      className={`transition-transform duration-200 ${openGroups[catId] ? "rotate-90" : ""}`}
      style={{ color: accentColor }}
    />
    <span
  className={`text-sm font-black uppercase tracking-[0.08em] ${adminTitleFont}`}
  style={{ color: accentColor }}
>
  {getLocalizedTitle(category)}
</span>
  </div>

  <span className="text-xs font-bold text-neutral-500 dark:text-white/60">
  {groupItems.length}
</span>
</button>

  {openGroups[catId] ? groupItems.map((item) => (        <div
          key={item._id}
          className="flex items-start justify-between rounded-2xl border border-black/10 bg-white px-4 py-4 dark:border-white/15 dark:bg-white/5"
        >
          <div className="flex min-w-0 items-start gap-3 pr-4">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
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

              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                {getLocalizedLinkedTitle(item, "category")}
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
              onClick={() => deletePackaging(item._id)}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              <Trash2 size={14} strokeWidth={2.4} />
              {tt.adminDelete || "Delete"}
            </button>
          </div>
        </div>
            )) : null}
    </div>
  );
})}

{!packaging.length ? (
  <div className="rounded-2xl border border-dashed border-black/10 px-4 py-10 text-center text-sm font-semibold text-neutral-500 dark:border-white/15 dark:text-white/60">
    {tt.adminNoItemsFound || "No items found."}
  </div>
) : null}              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

