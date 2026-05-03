import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";
import {
  clearFailedLoginAttempts,
  getLoginRateLimitState,
  recordFailedLoginAttempt,
} from "@/lib/adminLoginRateLimit";
export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim();
    const password = body?.password?.trim();

   if (!email || !password) {
  return NextResponse.json(
    { ok: false, message: "Email and password are required." },
    { status: 400 }
  );
}

const rateLimit = getLoginRateLimitState(request, email);

if (rateLimit.isBlocked) {
  const retryAfterSeconds = Math.ceil(rateLimit.retryAfterMs / 1000);

  return NextResponse.json(
    {
      ok: false,
      message: `Too many failed attempts. Try again in ${retryAfterSeconds} seconds.`,
    },
    { status: 429 }
  );
}

    const admin = await client.fetch(
      `*[_type == "adminCredential" && isActive == true][0]{
        email,
        passwordHash
      }`
    );

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Admin credential not configured." },
        { status: 500 }
      );
    }

    const emailMatch = email.toLowerCase() === admin.email.toLowerCase();
    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

  if (!emailMatch || !passwordMatch) {
  const failed = recordFailedLoginAttempt(request, email);

  if (failed.isBlocked) {
    const retryAfterSeconds = Math.ceil(failed.retryAfterMs / 1000);

    return NextResponse.json(
      {
        ok: false,
        message: `Too many failed attempts. Try again in ${retryAfterSeconds} seconds.`,
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { ok: false, message: "Wrong email or password" },
    { status: 401 }
  );
}

    clearFailedLoginAttempts(request, email);

const response = NextResponse.json({ ok: true });

    response.cookies.set("admin-session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("ADMIN LOGIN API ERROR:", error);

    return NextResponse.json(
      { ok: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}

