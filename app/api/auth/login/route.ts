import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL || "admin@scalyx.in";
    const adminPassword = process.env.ADMIN_PASSWORD || "MzkKa_20_26@#";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Compare email case-insensitively and password strictly
    if (
      email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        { error: "Invalid admin email or password" },
        { status: 401 }
      );
    }

    const token = createSessionToken(adminEmail);
    const response = NextResponse.json({
      success: true,
      email: adminEmail,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "scalyx_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
