import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import {
  clearFailedLoginAttempts,
  getLoginRateLimitState,
  recordFailedLoginAttempt,
} from "@/lib/adminLoginRateLimit";

export async function POST(request) {
  try {
    const session = request.cookies.get("admin-session")?.value;

    if (session !== "true") {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const currentPassword = body?.currentPassword?.trim();
    const newPassword = body?.newPassword?.trim();

if (!currentPassword || !newPassword) {
  return NextResponse.json(
    { ok: false, message: "Current password and new password are required." },
    { status: 400 }
  );
}

const rateLimit = getLoginRateLimitState(request, "reset-password");

if (rateLimit.isBlocked) {
  const retryAfterSeconds = Math.ceil(rateLimit.retryAfterMs / 1000);

  return NextResponse.json(
    {
      ok: false,
      message: `Too many failed attempts. Try again in ${retryAfterSeconds} seconds.`,
    },
    { status: 429 }
  );
}    if (newPassword.length < 6) {
      return NextResponse.json(
        { ok: false, message: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const admin = await client.fetch(
      `*[_type == "adminCredential" && isActive == true][0]{
        _id,
        passwordHash
      }`
    );

    if (!admin?._id || !admin?.passwordHash) {
      return NextResponse.json(
        { ok: false, message: "Admin credential not configured." },
        { status: 500 }
      );
    }

    const currentPasswordMatch = await bcrypt.compare(
      currentPassword,
      admin.passwordHash
    );

   if (!currentPasswordMatch) {
  const failed = recordFailedLoginAttempt(request, "reset-password");

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
    { ok: false, message: "Current password is incorrect." },
    { status: 401 }
  );
}

    const sameAsOld = await bcrypt.compare(newPassword, admin.passwordHash);

    if (sameAsOld) {
      return NextResponse.json(
        { ok: false, message: "New password must be different from current password." },
        { status: 400 }
      );
    }

  const passwordHash = await bcrypt.hash(newPassword, 10);

await writeClient.patch(admin._id).set({ passwordHash }).commit();

clearFailedLoginAttempts(request, "reset-password");

const response = NextResponse.json({
  ok: true,
  message: "Password updated successfully.",
});

response.cookies.set("admin-session", "", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 0,
});

return response;
  } catch (error) {
   console.error("RESET PASSWORD API ERROR:", error);

return NextResponse.json(
  {
    ok: false,
    message: error?.message || "Failed to update password.",
  },
  { status: 500 }
);
  }
}

