// app/api/user/profile/route.ts
import { connectToDatabase } from "@/backend/lib/db";
import { requireAuth } from "@/backend/lib/auth";
import User from "@/backend/models/User";

// helper to normalise hobbies input
function normalizeHobbies(input: any): string[] {
  if (Array.isArray(input)) {
    return input
      .map((h: any) => String(h).trim().toLowerCase())
      .filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function serializeUser(u: any) {
  if (!u) return null;
  return {
    id: u._id.toString(),
    uid: u.uid,
    email: u.email || "",
    name: u.name || "",
    state: u.state || "",
    locality: u.locality || "",
    profession: u.profession || "",
    hobbies: Array.isArray(u.hobbies) ? u.hobbies : [],
    age: typeof u.age === "number" ? u.age : null,
    avatarUrl: u.avatarUrl || "",
    role: u.role || "user",
    isBanned: !!u.isBanned,
    createdAt: u.createdAt?.toISOString?.() || null,
    updatedAt: u.updatedAt?.toISOString?.() || null,
  };
}

// 🔹 GET /api/user/profile -> return current user's profile
export async function GET(req: Request) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const userDoc = await User.findOne({ uid: decoded.uid }).lean();

    if (!userDoc) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Profile not found",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        user: serializeUser(userDoc),
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/user/profile error:", err);
    const msg = err?.message || "Server error";
    const status =
      msg === "Unauthorized" || msg === "Invalid token" ? 401 : 500;
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      { status }
    );
  }
}

// 🔹 POST /api/user/profile -> initial setup (profile-setup page)
export async function POST(req: Request) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const body = await req.json();
    const {
      name,
      state,
      locality,
      profession,
      hobbies,
      age,
      avatarUrl,
    } = body;

    const normalizedHobbies = normalizeHobbies(hobbies);

    const updated = await User.findOneAndUpdate(
      { uid: decoded.uid },
      {
        uid: decoded.uid,
        email: decoded.email || "",
        name: name || "",
        state: state || "",
        locality: locality || "",
        profession: profession || "",
        hobbies: normalizedHobbies,
        age: typeof age === "number" ? age : age ? Number(age) : null,
        avatarUrl: avatarUrl || "",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return new Response(
      JSON.stringify({
        ok: true,
        user: serializeUser(updated),
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/user/profile error:", err);
    const msg = err?.message || "Server error";
    const status =
      msg === "Unauthorized" || msg === "Invalid token" ? 401 : 500;
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      { status }
    );
  }
}

// 🔹 PUT /api/user/profile -> update from /profile page
export async function PUT(req: Request) {
  try {
    const { decoded } = await requireAuth(req);
    await connectToDatabase();

    const body = await req.json();
    const {
      name,
      state,
      locality,
      profession,
      hobbies,
      age,
      avatarUrl,
    } = body;

    const normalizedHobbies = normalizeHobbies(hobbies);

    const updated = await User.findOneAndUpdate(
      { uid: decoded.uid },
      {
        uid: decoded.uid,
        email: decoded.email || "",
        name: name || "",
        state: state || "",
        locality: locality || "",
        profession: profession || "",
        hobbies: normalizedHobbies,
        age: typeof age === "number" ? age : age ? Number(age) : null,
        avatarUrl: avatarUrl || "",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return new Response(
      JSON.stringify({
        ok: true,
        user: serializeUser(updated),
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PUT /api/user/profile error:", err);
    const msg = err?.message || "Server error";
    const status =
      msg === "Unauthorized" || msg === "Invalid token" ? 401 : 500;
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      { status }
    );
  }
}










// I COMMENTED IT AFTER THE /PROFILE PAGE WAS NOT GETTING DATA FROM DB 
// // app/api/user/profile/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/backend/lib/db";
// import { requireAuth } from "@/backend/lib/auth";
// import User from "@/backend/models/User";

// export async function POST(req: NextRequest) {
//   try {
//     const { decoded } = await requireAuth(req); // get uid, email
//     await connectToDatabase();

//     const body = await req.json();
//     const { name, state, locality, profession, hobbies, age } = body;

//     // normalise hobbies (string -> array)
//     let hobbiesArray: string[] = [];
//     if (Array.isArray(hobbies)) {
//       hobbiesArray = hobbies;
//     } else if (typeof hobbies === "string") {
//       hobbiesArray = hobbies
//         .split(",")
//         .map((h: string) => h.trim())
//         .filter(Boolean);
//     }

//     const update = {
//       name: name || undefined,
//       state: state || undefined,
//       locality: locality || undefined,
//       profession: profession || undefined,
//       hobbies: hobbiesArray,
//       age: age ? Number(age) : undefined,
//       email: decoded.email || undefined,
//     };

//     const user = await User.findOneAndUpdate(
//       { uid: decoded.uid },
//       { $set: update, $setOnInsert: { uid: decoded.uid } },
//       { new: true, upsert: true }
//     ).lean();

//     return NextResponse.json({ ok: true, user }, { status: 200 });
//   } catch (err: any) {
//     console.error("POST /api/user/profile error:", err);
//     const message = err?.message || "Internal error";
//     const status =
//       message === "Unauthorized" || message === "Invalid token" ? 401 : 500;
//     return NextResponse.json({ ok: false, error: message }, { status });
//   }
// }
