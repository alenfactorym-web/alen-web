"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useAdminBrand } from "../components/AdminBrandContext";

export default function ResetPassword() {
 const [oldPass, setOldPass] = useState("");
const [newPass, setNewPass] = useState("");
const [showOldPass, setShowOldPass] = useState(false);
const [showNewPass, setShowNewPass] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [status, setStatus] = useState({ type: "", message: "" });

  const { lang, t } = useLanguage();
  const { brand, accentColor } = useAdminBrand();
  const router = useRouter();

  useEffect(() => {
    if (brand !== "alen") {
      router.replace("/admin/home");
    }
  }, [brand, router]);

  if (brand !== "alen") return null;

  const adminTitleFont =
    lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const adminBodyFont =
    lang === "ar"
      ? "font-ar-body text-[16px]"
      : lang === "ku"
      ? "ku-body text-[16px]"
      : "text-[18px]";

  async function handleSubmit(e) {
    e.preventDefault();

  if (!oldPass.trim() || !newPass.trim()) {
  setStatus({ type: "error", message: "Please fill all fields" });
  return;
}

setStatus({ type: "", message: "" });
setSubmitting(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: oldPass,
          newPassword: newPass,
        }),
      });

      const data = await res.json().catch(() => null);

     if (!res.ok) {
  setStatus({
    type: "error",
    message: data?.message || "Failed to update password",
  });
  return;
}

setStatus({
  type: "success",
  message: data?.message || "Password updated successfully.",
});
setOldPass("");
setNewPass("");
router.replace("/admin/login");
router.refresh();
    } catch (error) {
     console.error("RESET PASSWORD PAGE ERROR:", error);
setStatus({ type: "error", message: "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[1180px]">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6">
          <form
            onSubmit={handleSubmit}
            className="group flex flex-col rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.18)] dark:border-white/15 dark:bg-white/10"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                className={`text-xl font-black uppercase ${adminTitleFont}`}
                style={{ color: accentColor }}
              >
                {t.adminResetPasswordTitle || "Reset Password"}
              </h2>

              <KeyRound
                size={20}
                strokeWidth={2.2}
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110"
                style={{ color: accentColor }}
              />
            </div>

            <div className="space-y-4">
  {status.message ? (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
        status.type === "success"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
          : "border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
      }`}
    >
      {status.message}
    </div>
  ) : null}
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60 ${adminTitleFont}`}
                >
                  {t.adminResetPasswordCurrent || "Current Password"}
                </label>

                <div className="relative">
  <input
    type={showOldPass ? "text" : "password"}
    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pr-12 outline-none dark:border-white/20 dark:bg-white/10"
    value={oldPass}
    onChange={(e) => setOldPass(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowOldPass((prev) => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-white/70 dark:hover:text-white"
  >
    {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-white/60 ${adminTitleFont}`}
                >
                  {t.adminResetPasswordNew || "New Password"}
                </label>

                <div className="relative">
  <input
    type={showNewPass ? "text" : "password"}
    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pr-12 outline-none dark:border-white/20 dark:bg-white/10"
    value={newPass}
    onChange={(e) => setNewPass(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowNewPass((prev) => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-white/70 dark:hover:text-white"
  >
    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
              </div>

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
                  ? t.adminSaving || "Saving..."
                  : t.adminResetPasswordUpdate || "Update Password"}
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-6">
          <div className="group flex h-full flex-col rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.18)] dark:border-white/15 dark:bg-white/10">
            <div className="mb-5 flex items-center justify-between">
              <h2
                className={`text-xl font-black uppercase ${adminTitleFont}`}
                style={{ color: accentColor }}
              >
                {t.adminSecurityTitle || "Security"}
              </h2>

              <ShieldCheck
                size={20}
                strokeWidth={2.2}
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                style={{ color: accentColor }}
              />
            </div>

            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-black/10 px-6 py-10 text-center dark:border-white/15">
              <div>
                <div
                  className={`mb-3 text-lg font-black uppercase ${adminTitleFont}`}
                  style={{ color: accentColor }}
                >
                  {t.adminResetPasswordTitle || "Reset Password"}
                </div>

                <p className={`text-neutral-500 dark:text-white/60 ${adminBodyFont}`}>
                  {t.adminResetPasswordHint ||
                    "Use this section to securely update the admin password."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

