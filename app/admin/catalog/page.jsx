"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenText, ListOrdered, Pencil, Trash2, ImagePlus, FileText, X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAdminBrand } from "../components/AdminBrandContext";
import { confirmDelete } from "@/lib/adminConfirmDelete";

const EMPTY_FORM = {
  title: "",
  publishDate: "",
  file: null,
  fileName: "",
  fileUrl: "",
  removeFile: false,
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

export default function AdminCatalogPage() {
  const { lang, t } = useLanguage();
  const tt = t || {};
  const { brand, accentColor } = useAdminBrand();
const router = useRouter();

useEffect(() => {
  if (brand !== "alen") {
    router.replace("/admin/home");
  }
}, [brand, router]);

  const [catalogs, setCatalogs] = useState([]);
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

  async function loadCatalogs() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/catalog", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        console.error("LOAD CATALOG API ERROR:", data);
        setCatalogs([]);
        return;
      }

      setCatalogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD CATALOG ERROR:", error);
      setCatalogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalogs();
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
  }, [editingId, submitting, loading, lang, form]);

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
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

  function updatePdf(file) {
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      file,
      fileName: file.name || "",
      fileUrl: "",
      removeFile: false,
    }));
  }

  function removePdf() {
    setForm((prev) => ({
      ...prev,
      file: null,
      fileName: "",
      fileUrl: "",
      removeFile: true,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      publishDate: toInputDate(item.publishDate),
      file: null,
      fileName: item.fileUrl ? item.fileUrl.split("/").pop() || "catalog.pdf" : "",
      fileUrl: item.fileUrl || "",
      removeFile: false,
      coverImage: null,
      coverImagePreview: item.coverImageUrl || "",
      removeCoverImage: false,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) return;
    if (!editingId && !form.file) return;

    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const fd = new FormData();

      if (editingId) {
        fd.append("id", editingId);
      }

      fd.append("title", form.title.trim());
      fd.append("publishDate", form.publishDate || "");
      fd.append("removeFile", String(form.removeFile));
      fd.append("removeCoverImage", String(form.removeCoverImage));

      if (form.file) {
        fd.append("file", form.file);
      }

      if (form.coverImage) {
        fd.append("coverImage", form.coverImage);
      }

      const res = await fetch("/api/admin/catalog", {
        method,
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("SAVE CATALOG ERROR:", data);
        alert(data?.details || data?.message || "Failed to save catalog");
        return;
      }

      resetForm();
      await loadCatalogs();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteCatalog(id) {
    if (!confirmDelete(tt.adminDeleteConfirm)) return;

    await fetch("/api/admin/catalog", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (editingId === id) {
      resetForm();
    }

    await loadCatalogs();
  }

  const formTitle = useMemo(() => {
    return editingId
      ? tt.adminEditCatalog || `${tt.adminEdit || "Edit"} ${tt.adminCatalog || "Catalog"}`
      : tt.adminAddCatalog || `${tt.adminAdd || "Add"} ${tt.adminCatalog || "Catalog"}`;
  }, [editingId, tt]);

 if (brand !== "alen") {
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

              <BookOpenText
                size={20}
                strokeWidth={2.2}
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110"
                style={{ color: accentColor }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminTitle || "Title"}
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none dark:border-white/20 dark:bg-white/10"
                  placeholder={tt.adminCatalog || "Catalog"}
                />
              </div>

              

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  PDF File
                </label>

                {form.fileName || form.fileUrl ? (
                  <div className="mb-3 flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 dark:border-white/15 dark:bg-white/[0.04]">
                    <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-white">
                      <FileText size={16} />
                      <span className="truncate">
                        {form.fileName || "catalog.pdf"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={removePdf}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : null}

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 px-4 py-3 text-sm font-semibold text-neutral-600 hover:bg-black/[0.03] dark:border-white/20 dark:text-white dark:hover:bg-white/[0.04]">
                  <FileText size={16} />
                  PDF File
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => updatePdf(e.target.files?.[0])}
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60">
                  {tt.adminCoverImage || "Cover Image"}
                </label>

                {form.coverImagePreview ? (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
                    <img
                      src={form.coverImagePreview}
                      alt="Catalog cover preview"
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
                  ? tt.adminUpdateCatalog ||
                    `${tt.adminUpdate || "Update"} ${tt.adminCatalog || "Catalog"}`
                  : tt.adminAddCatalog ||
                    `${tt.adminAdd || "Add"} ${tt.adminCatalog || "Catalog"}`}
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
                {tt.adminCatalogList ||
                  `${tt.adminCatalog || "Catalog"} ${tt.adminList || "List"}`}
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
                {catalogs.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start justify-between rounded-2xl border border-black/10 bg-white px-4 py-4 dark:border-white/15 dark:bg-white/5"
                  >
                    <div className="flex min-w-0 items-start gap-3 pr-4">
                      {item.coverImageUrl ? (
                        <img
                          src={item.coverImageUrl}
                          alt={item.title || "Catalog"}
                          className="h-14 w-14 shrink-0 rounded-xl border border-black/10 object-cover bg-white dark:border-white/15 dark:bg-white/10"
                        />
                      ) : (
                        <div className="h-14 w-14 shrink-0 rounded-xl border border-dashed border-black/10 bg-black/[0.02] dark:border-white/15 dark:bg-white/[0.04]" />
                      )}

                      <div className="min-w-0">
                        <div className={`font-bold ${adminBodyFont}`}>
                          {item.title || "Untitled"}
                        </div>

                        <div className="mt-1 text-xs text-neutral-500 dark:text-white/60">
                          {item.publishDate
                            ? new Date(item.publishDate).toLocaleDateString()
                            : "—"}
                        </div>

                        <div className="mt-2 text-xs text-neutral-500 dark:text-white/60">
                          {item.fileUrl ? "PDF attached" : "No PDF"}
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
                        onClick={() => deleteCatalog(item._id)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        <Trash2 size={14} strokeWidth={2.4} />
                        {tt.adminDelete || "Delete"}
                      </button>
                    </div>
                  </div>
                ))}

                {!catalogs.length ? (
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

