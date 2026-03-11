// //app/api/creator/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/lib/db";
import User from "@/backend/models/User";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    await connectToDatabase();

    const { id } = await context.params;

    const user: any = await User.findOne({ uid: id }).lean();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Creator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      creator: {
        id: user.uid,
        name: user.name || "Anonymous",
        city: user.city || "",
        state: user.state || "",
        profession: user.profession || "",
        age: user.age || "",
        interests: user.interests || "",
      }
    });

  } catch (err) {

    console.error("creator profile error:", err);

    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );

  }
}







// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDatabase } from "@/backend/lib/db";
// import User from "@/backend/models/User";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {

//   try {

//     await connectToDatabase();

//     const { id } = await context.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid creator id" },
//         { status: 400 }
//       );
//     }

//     const user:any = await User.findById(id).lean();

//     if (!user) {
//       return NextResponse.json(
//         { ok: false, error: "Creator not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       ok: true,
//       creator: {
//         id: user._id.toString(),
//         name: user.name || "Anonymous",
//         city: user.city || "",
//         state: user.state || "",
//         profession: user.profession || "",
//         age: user.age || "",
//         interests: user.interests || "",
//       }
//     });

//   } catch (err) {

//     console.error("creator profile error:", err);

//     return NextResponse.json(
//       { ok: false, error: "Internal error" },
//       { status: 500 }
//     );

//   }

// }