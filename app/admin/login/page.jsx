"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

 const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleLogin(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    router.push("/admin/home");
    router.refresh();
  } catch (err) {
    console.error("LOGIN PAGE ERROR:", err);
    setError("Something went wrong");
    setLoading(false);
  }
}

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex min-h-screen flex-col items-center pt-[180px] lg:pt-[140px] xl:pt-[120px]">
        <div className="mb-6 flex justify-center">
          <img
            src="/logos/logo.svg"
            alt="ALEN"
            className="h-32 w-32 lg:h-24 lg:w-24 xl:h-28 xl:w-28 2xl:h-32 2xl:w-32 object-contain"
          />
        </div>

        <div className="mb-10 flex flex-col items-center text-center">
          <h1 className="text-3xl font-black tracking-[-0.03em] text-zinc-600 md:text-4xl">
            ADMIN LOGIN
          </h1>

          <div className="mx-auto mt-2 h-[32px] w-[220px]">
            <svg viewBox="0 0 200 30" className="h-full w-full">
              <path
                d="M10 20 C 60 5, 140 5, 190 20"
                fill="none"
                stroke="#f5c400"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <form
          onSubmit={handleLogin}
className="relative overflow-hidden w-[460px] lg:w-[400px] xl:w-[420px] 2xl:w-[460px] rounded-[28px] border border-black/10 bg-white/90 px-8 lg:px-6 xl:px-7 2xl:px-8 py-10 lg:py-8 xl:py-9 2xl:py-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.35)] backdrop-blur-md"  
      >
          <div className="mb-1 text-sm font-bold text-zinc-600">
            Email Address
          </div>

          <input
            type="email"
            placeholder="Enter your email"
            className="mb-5 w-full rounded-lg border px-4 py-2 outline-none focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="mb-5 w-full rounded-lg border px-4 py-2 outline-none focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-600 py-2 font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Checking..." : "Login"}
          </button>

          <div className="absolute inset-x-0 bottom-0 overflow-hidden">
            <div className="h-2 w-full bg-[#f5c400]" />
          </div>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            className="rounded-lg font-bold text-zinc-500 transition hover:text-black"
            onClick={() => alert("Contact system administrator")}
          >
            Forget Password ?
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[970px] overflow-hidden">
        <img
          src="/hero-login.webp"
          alt="Alen Factory"
          className="h-full w-full object-cover object-[center_85%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-[#f5c400]" />
    </div>
  );
}

