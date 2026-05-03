"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PackagePlus,
  ListOrdered,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAdminBrand } from "../components/AdminBrandContext";
import { confirmDelete } from "@/lib/adminConfirmDelete";

const EMPTY_FORM = {
  unitsPerPack: "",
  packsPerCarton: "",
  brandId: "",
  categoryId: "",
  productGroupId: "",
  packagingId: "",
  title: {
    en: "",
    ar: "",
    ku: "",
  },
  coverImage: null,
  coverImagePreview: "",
  removeCoverImage: false,
  imageFiles: [],
  imagePreviews: [],
  replaceImages: false,
};

export default function AdminProductsPage() {
  const { lang, t } = useLanguage();
  const tt = t || {};
  const { brand, accentColor } = useAdminBrand();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [productGroups, setProductGroups] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [openCategoryIds, setOpenCategoryIds] = useState([]);
  const [openProductGroupIds, setOpenProductGroupIds] = useState([]);
  const [openPackagingIds, setOpenPackagingIds] = useState([]);
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

  const filteredProductGroups = useMemo(() => {
    if (!selectedBrand?._id || !form.categoryId) return [];
    return productGroups.filter(
      (item) =>
        item.brandId === selectedBrand._id &&
        item.categoryId === form.categoryId
    );
  }, [productGroups, selectedBrand, form.categoryId]);

  const filteredCategories = useMemo(() => {
    if (!selectedBrand?._id) return [];
    return categories.filter((item) => item.brandId === selectedBrand._id);
  }, [categories, selectedBrand]);

  const filteredPackagingOptions = useMemo(() => {
    if (!selectedBrand?._id || !form.categoryId) return [];
    return packagingOptions.filter(
      (item) =>
        item.brandId === selectedBrand._id &&
        item.categoryId === form.categoryId &&
        (!form.productGroupId || item.productGroupId === form.productGroupId)
    );
  }, [packagingOptions, selectedBrand, form.categoryId, form.productGroupId]);

  const filteredProducts = useMemo(() => {
    if (!selectedBrand?._id) return [];
    return products.filter((item) => item.brandId === selectedBrand._id);
  }, [products, selectedBrand]);

  function getLocalizedTitle(item) {
    if (!item) return "—";

    if (lang === "ar") {
      return (
        item.title_ar ||
        item.titleAr ||
        item.title ||
        item.title_en ||
        "Untitled"
      );
    }

    if (lang === "ku") {
      return (
        item.title_ku ||
        item.titleKu ||
        item.title ||
        item.title_en ||
        "Untitled"
      );
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

  const groupedProducts = useMemo(() => {
    const directPackagingId = "__direct_products__";
    const noProductGroupId = "__no_product_group__";

    const categoryMap = new Map();

    filteredCategories.forEach((category) => {
      categoryMap.set(category._id, {
        categoryId: category._id,
        categoryTitle: getLocalizedTitle(category),
        productGroups: new Map(),
      });
    });

    filteredProducts.forEach((product) => {
      const categoryId = product.categoryId || "__no_category__";

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          categoryId,
          categoryTitle: getLocalizedLinkedTitle(product, "category"),
          productGroups: new Map(),
        });
      }

      const categoryGroup = categoryMap.get(categoryId);

      const productGroupId = product.productGroupId || noProductGroupId;
      const productGroupKey = `${categoryId}::pg::${productGroupId}`;

      if (!categoryGroup.productGroups.has(productGroupKey)) {
        categoryGroup.productGroups.set(productGroupKey, {
          groupId: productGroupKey,
          productGroupTitle: product.productGroupId
            ? getLocalizedLinkedTitle(product, "productGroup")
            : tt.adminDirectProducts || "Direct Products",
          packagingGroups: new Map(),
        });
      }

      const productGroupGroup = categoryGroup.productGroups.get(productGroupKey);

      const packagingId = product.packagingId || directPackagingId;
      const packagingKey = `${productGroupKey}::${packagingId}`;

      if (!productGroupGroup.packagingGroups.has(packagingKey)) {
        productGroupGroup.packagingGroups.set(packagingKey, {
          groupId: packagingKey,
          packagingTitle: product.packagingId
            ? getLocalizedLinkedTitle(product, "packaging")
            : tt.adminDirectProducts || "Direct Products",
          isDirect: !product.packagingId,
          items: [],
        });
      }

      productGroupGroup.packagingGroups.get(packagingKey).items.push(product);
    });

    return Array.from(categoryMap.values())
      .map((categoryGroup) => ({
        ...categoryGroup,
        productGroups: Array.from(categoryGroup.productGroups.values())
          .map((pg) => ({
            ...pg,
            packagingGroups: Array.from(pg.packagingGroups.values())
              .map((g) => ({
                ...g,
                items: [...g.items].sort((a, b) =>
                  getLocalizedTitle(a).localeCompare(getLocalizedTitle(b))
                ),
              }))
              .sort((a, b) => {
                if (a.isDirect && !b.isDirect) return 1;
                if (!a.isDirect && b.isDirect) return -1;
                return a.packagingTitle.localeCompare(b.packagingTitle);
              }),
          }))
          .sort((a, b) => a.productGroupTitle.localeCompare(b.productGroupTitle)),
      }))
      .filter((c) => c.productGroups.length > 0)
      .sort((a, b) => a.categoryTitle.localeCompare(b.categoryTitle));
  }, [filteredProducts, filteredCategories, lang, tt]);

  async function loadData() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();

      setProducts(Array.isArray(data.products) ? data.products : []);
      setBrands(Array.isArray(data.brands) ? data.brands : []);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setPackagingOptions(
        Array.isArray(data.packagingOptions) ? data.packagingOptions : []
      );
      setProductGroups(
        Array.isArray(data.productGroups) ? data.productGroups : []
      );
    } catch (error) {
      console.error("LOAD PRODUCTS ERROR:", error);
      setProducts([]);
      setBrands([]);
      setCategories([]);
      setPackagingOptions([]);
      setProductGroups([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

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
  }, [
    editingId,
    submitting,
    loading,
    lang,
    form,
    openCategoryIds,
    openProductGroupIds,
    openPackagingIds,
  ]);

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

      const nextProductGroupValid =
        prev.productGroupId === "" ||
        filteredProductGroups.some((item) => item._id === prev.productGroupId);

      const nextPackagingValid =
        prev.packagingId === "" ||
        filteredPackagingOptions.some((item) => item._id === prev.packagingId);

      return {
        ...prev,
        brandId: selectedBrand?._id || "",
        categoryId: nextCategoryValid ? prev.categoryId : "",
        productGroupId: nextProductGroupValid ? prev.productGroupId : "",
        packagingId: nextPackagingValid ? prev.packagingId : "",
      };
    });
  }, [
    filteredCategories,
    filteredProductGroups,
    filteredPackagingOptions,
    selectedBrand,
  ]);

  function updateForm(key, value) {
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

  function updateCoverImage(file) {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      coverImage: file,
      coverImagePreview: preview,
      removeCoverImage: false,
    }));
  }

  function removeCoverImage() {
    setForm((prev) => ({
      ...prev,
      coverImage: null,
      coverImagePreview: "",
      removeCoverImage: true,
    }));
  }

  function updateGalleryImages(files) {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;

    const previews = fileList.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({
      ...prev,
      imageFiles: fileList,
      imagePreviews: previews,
      replaceImages: true,
    }));
  }

  function removeAllGalleryImages() {
    setForm((prev) => ({
      ...prev,
      imageFiles: [],
      imagePreviews: [],
      replaceImages: true,
    }));
  }

  function resetForm() {
    setForm({
      ...EMPTY_FORM,
      brandId: selectedBrand?._id || "",
    });
    setEditingId(null);
  }

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      brandId: product.brandId || selectedBrand?._id || "",
      categoryId: product.categoryId || "",
      productGroupId: product.productGroupId || "",
      packagingId: product.packagingId || "",
unitsPerPack: product.unitsPerPack || "",
packsPerCarton: product.packsPerCarton || "",
      title: {
        en: product.title_en || "",
        ar: product.title_ar || "",
        ku: product.title_ku || "",
      },
      coverImage: null,
      coverImagePreview: product.coverImageUrl || "",
      removeCoverImage: false,
      imageFiles: [],
      imagePreviews: Array.isArray(product.imageUrls) ? product.imageUrls : [],
      replaceImages: false,
    });

    const categoryId = product.categoryId || "__no_category__";
    const productGroupId = product.productGroupId || "__no_product_group__";
    const productGroupKey = `${categoryId}::pg::${productGroupId}`;
    const packagingId = product.packagingId || "__direct_products__";
    const packagingGroupId = `${productGroupKey}::${packagingId}`;

    setOpenCategoryIds((prev) =>
      prev.includes(categoryId) ? prev : [...prev, categoryId]
    );
    setOpenProductGroupIds((prev) =>
      prev.includes(productGroupKey) ? prev : [...prev, productGroupKey]
    );
    setOpenPackagingIds((prev) =>
      prev.includes(packagingGroupId) ? prev : [...prev, packagingGroupId]
    );
  }

  function toggleCategory(categoryId) {
    setOpenCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  function togglePackaging(groupId) {
    setOpenPackagingIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
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
      fd.append("productGroupId", form.productGroupId);
      fd.append("packagingId", form.packagingId);
fd.append("unitsPerPack", form.unitsPerPack || "");
fd.append("packsPerCarton", form.packsPerCarton || "");
      fd.append("title_en", form.title.en.trim());
      fd.append("title_ar", form.title.ar.trim());
      fd.append("title_ku", form.title.ku.trim());

      fd.append("desc_en", "");
      fd.append("desc_ar", "");
      fd.append("desc_ku", "");

      fd.append("removeCoverImage", String(form.removeCoverImage));
      fd.append("replaceImages", String(form.replaceImages));

      if (form.coverImage) {
        fd.append("coverImage", form.coverImage);
      }

      form.imageFiles.forEach((file) => {
        fd.append("images", file);
      });

      const res = await fetch("/api/admin/products", {
        method,
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.details || data?.message || "Failed to save product");
        return;
      }

      resetForm();
      await loadData();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirmDelete(tt.adminDeleteConfirm)) return;

    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (editingId === id) {
      resetForm();
    }

    await loadData();
  }

  const formTitle = useMemo(() => {
    return editingId
      ? tt.adminEditProduct ||
          `${tt.adminEdit || "Edit"} ${tt.adminProduct || "Product"}`
      : tt.adminAddProduct ||
          `${tt.adminAdd || "Add"} ${tt.adminProduct || "Product"}`;
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

              <PackagePlus
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
                      packagingId: "",
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
                  value={form.productGroupId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      productGroupId: e.target.value,
                      packagingId: "",
                    }))
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                >
                  <option value="">No Group</option>
                  {filteredProductGroups.map((item) => (
                    <option key={item._id} value={item._id}>
                      {getLocalizedTitle(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminPackagingLabel || "Packaging"}
                </label>
                <select
                  value={form.packagingId}
                  disabled={!form.categoryId}
                  onChange={(e) => updateForm("packagingId", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                >
                  <option value="">
                    {tt.adminDirectProducts || "Direct Products"}
                  </option>
                  {filteredPackagingOptions.map((item) => (
                    <option key={item._id} value={item._id}>
                      {getLocalizedTitle(item)}
                    </option>
                  ))}
                </select>
              </div>
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
      Units Per Pack
    </label>
    <input
      type="number"
      value={form.unitsPerPack || ""}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          unitsPerPack: e.target.value,
        }))
      }
      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
      placeholder="e.g. 10"
    />
  </div>

  <div>
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
      Packs Per Carton
    </label>
    <input
      type="number"
      value={form.packsPerCarton || ""}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          packsPerCarton: e.target.value,
        }))
      }
      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
      placeholder="e.g. 6"
    />
  </div>
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
                  {tt.adminCoverImage || "Cover Image"}
                </label>

                {form.coverImagePreview ? (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
                    <img
                      src={form.coverImagePreview}
                      alt="Cover preview"
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
                      onChange={(e) => updateCoverImage(e.target.files?.[0])}
                    />
                  </label>

                  {form.coverImagePreview ? (
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminImages || "Images"}
                </label>

                {form.imagePreviews.length ? (
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {form.imagePreviews.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="overflow-hidden rounded-xl border border-black/10 dark:border-white/15"
                      >
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover bg-white dark:bg-white/5"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 px-4 py-3 text-sm font-semibold text-neutral-600 hover:bg-black/[0.03] dark:border-white/20 dark:text-white dark:hover:bg-white/[0.04]">
                    <ImagePlus size={16} />
                    {tt.adminImages || "Images"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => updateGalleryImages(e.target.files)}
                    />
                  </label>

                  {form.imagePreviews.length ? (
                    <button
                      type="button"
                      onClick={removeAllGalleryImages}
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
                  ? tt.adminUpdateProduct ||
                    `${tt.adminUpdate || "Update"} ${tt.adminProduct || "Product"}`
                  : tt.adminAddProduct ||
                    `${tt.adminAdd || "Add"} ${tt.adminProduct || "Product"}`}
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
                {tt.adminProductList ||
                  `${tt.adminProduct || "Product"} ${tt.adminList || "List"}`}
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
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
                {groupedProducts.map((categoryGroup) => {
                  const isCategoryOpen = openCategoryIds.includes(
                    categoryGroup.categoryId
                  );

                  return (
                    <div
                      key={categoryGroup.categoryId}
                      className="rounded-2xl border border-black/10 dark:border-white/15"
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(categoryGroup.categoryId)}
                        className="flex w-full items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3 text-left dark:bg-white/[0.06]"
                      >
                        <div className="flex items-center gap-2">
                          {isCategoryOpen ? (
                            <ChevronDown size={18} style={{ color: accentColor }} />
                          ) : (
                            <ChevronRight size={18} style={{ color: accentColor }} />
                          )}

                          <span
                            className={`text-sm font-black uppercase tracking-[0.08em] ${adminTitleFont}`}
                            style={{ color: accentColor }}
                          >
                            {categoryGroup.categoryTitle}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-neutral-500 dark:text-white/60">
                          {categoryGroup.productGroups?.reduce(
                            (sum, pg) =>
                              sum +
                              pg.packagingGroups.reduce(
                                (s, g) => s + g.items.length,
                                0
                              ),
                            0
                          ) || 0}
                        </span>
                      </button>

                      {isCategoryOpen ? (
                        <div className="space-y-3 p-3">
                          {categoryGroup.productGroups.map((productGroup) => {
                            const isProductGroupOpen = openProductGroupIds.includes(
                              productGroup.groupId
                            );

                            return (
                              <div
                                key={productGroup.groupId}
                                className="rounded-2xl border border-black/10 dark:border-white/15"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenProductGroupIds((prev) =>
                                      prev.includes(productGroup.groupId)
                                        ? prev.filter((id) => id !== productGroup.groupId)
                                        : [...prev, productGroup.groupId]
                                    )
                                  }
                                  className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left dark:bg-white/5"
                                >
                                  <div className="flex items-center gap-2">
                                    {isProductGroupOpen ? (
                                      <ChevronDown
                                        size={16}
                                        style={{ color: accentColor }}
                                      />
                                    ) : (
                                      <ChevronRight
                                        size={16}
                                        style={{ color: accentColor }}
                                      />
                                    )}

                                    <span
                                      className="text-xs font-black uppercase tracking-[0.08em]"
                                      style={{ color: accentColor }}
                                    >
                                      {productGroup.productGroupTitle}
                                    </span>
                                  </div>

                                  <span className="text-xs font-semibold text-neutral-500 dark:text-white/60">
                                    {productGroup.packagingGroups.reduce(
                                      (sum, g) => sum + g.items.length,
                                      0
                                    )}
                                  </span>
                                </button>

                                {isProductGroupOpen ? (
                                  <div className="space-y-3 p-3">
                                    {productGroup.packagingGroups.map((packagingGroup) => {
                                      const isPackagingOpen = openPackagingIds.includes(
                                        packagingGroup.groupId
                                      );

                                      return (
                                        <div
                                          key={packagingGroup.groupId}
                                          className="rounded-2xl border border-black/10 dark:border-white/15"
                                        >
                                          <button
                                            type="button"
                                            onClick={() =>
                                              togglePackaging(packagingGroup.groupId)
                                            }
                                            className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left dark:bg-white/5"
                                          >
                                            <div className="flex items-center gap-2">
                                              {isPackagingOpen ? (
                                                <ChevronDown
                                                  size={16}
                                                  style={{ color: accentColor }}
                                                />
                                              ) : (
                                                <ChevronRight
                                                  size={16}
                                                  style={{ color: accentColor }}
                                                />
                                              )}

                                              <span
                                                className="text-xs font-black uppercase tracking-[0.08em]"
                                                style={{ color: accentColor }}
                                              >
                                                {packagingGroup.packagingTitle}
                                              </span>
                                            </div>

                                            <span className="text-xs font-semibold text-neutral-500 dark:text-white/60">
                                              {packagingGroup.items.length}
                                            </span>
                                          </button>

                                          {isPackagingOpen ? (
                                            <div className="space-y-3 p-3">
                                              {packagingGroup.items.map((product) => (
                                                <div
                                                  key={product._id}
                                                  className="flex items-start justify-between rounded-2xl border border-black/10 bg-white px-4 py-4 dark:border-white/15 dark:bg-white/5"
                                                >
                                                  <div className="flex min-w-0 items-start gap-3 pr-4">
                                                    {product.coverImageUrl ? (
                                                      <img
                                                        src={product.coverImageUrl}
                                                        alt={getLocalizedTitle(product)}
                                                        className="h-14 w-14 shrink-0 rounded-xl border border-black/10 object-cover bg-white dark:border-white/15 dark:bg-white/10"
                                                      />
                                                    ) : (
                                                      <div className="h-14 w-14 shrink-0 rounded-xl border border-dashed border-black/10 bg-black/[0.02] dark:border-white/15 dark:bg-white/[0.04]" />
                                                    )}

                                                    <div className="min-w-0">
                                                      <div
                                                        className={`font-bold ${adminBodyFont}`}
                                                      >
                                                        {getLocalizedTitle(product)}
                                                      </div>

                                                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                                                        {getLocalizedLinkedTitle(
                                                          product,
                                                          "category"
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="flex shrink-0 gap-2">
                                                    <button
                                                      onClick={() => startEdit(product)}
                                                      className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-black/5 dark:border-white/15 dark:bg-white/10 dark:text-white"
                                                    >
                                                      <Pencil
                                                        size={14}
                                                        strokeWidth={2.4}
                                                      />
                                                      {tt.adminEdit || "Edit"}
                                                    </button>

                                                    <button
                                                      onClick={() =>
                                                        deleteProduct(product._id)
                                                      }
                                                      className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                                    >
                                                      <Trash2
                                                        size={14}
                                                        strokeWidth={2.4}
                                                      />
                                                      {tt.adminDelete || "Delete"}
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {!groupedProducts.length ? (
                  <div className="rounded-2xl border border-dashed border-black/10 px-4 py-10 text-center text-sm font-semibold text-neutral-500 dark:border-white/15 dark:text-white/60">
                    {tt.adminNoProductsFound ||
                      tt.adminNoItemsFound ||
                      "No products found."}
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

