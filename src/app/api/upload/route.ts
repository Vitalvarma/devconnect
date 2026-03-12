import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Removed edge runtime for multer

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Configure Cloudinary if not done
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Multer not needed for manual handling
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0 || !file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Invalid image file" }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "devconnect/profile-images", resource_type: "image" },
        (error, result) => {
          if (error || !result) reject(error || new Error("Upload failed"));
          else resolve(result as UploadApiResponse);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: response.secure_url,
      public_id: response.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}
