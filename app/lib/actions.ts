import { sql } from "@vercel/postgres";
import { DatabaseFile } from "./definitions";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from "stream";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getFiles(): Promise<DatabaseFile[]> {
    // Use no-store to ensure fresh data on each request
    const result = await sql`SELECT * FROM files ORDER BY created_at DESC`;
    return result.rows as DatabaseFile[];
}

export async function deleteFile(fileId: string): Promise<{ rowCount: number }> {
    let publicId: string | undefined;
    try {
        const fileQuery = await sql`SELECT file_url FROM files WHERE id = ${fileId}`;
        if (fileQuery.rows.length === 0) {
            return { rowCount: 0 };
        }

        const fileUrl = fileQuery.rows[0].file_url;

        publicId = fileUrl.split("/").pop()?.split(".")[0];
        const resourceType = fileUrl.includes("image") ? "image" : fileUrl.includes("video") ? "video" : "raw";

        if (!publicId) {
            throw new Error("Could not extract Cloudinary public ID.");
        }

        const cloudinaryResult = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });

        if (cloudinaryResult.result !== "ok" && cloudinaryResult.result !== "not found") {
            throw new Error(`Failed to delete from Cloudinary: ${cloudinaryResult.result}`);
        }

        const result = await sql`DELETE FROM files WHERE id = ${fileId}`;

        return { rowCount: result.rowCount ?? result.rows.length ?? 0 };

    } catch (error) {
        if (error instanceof Error && error.message !== "Cloudinary" && publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
        throw error;
    }
}

export async function uploadFile(file: File): Promise<DatabaseFile> {
    let cloudinaryResult;
    try {

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileStream = Readable.from(fileBuffer);

        const fileType = file.type.split("/")[0];
        const resourceType = fileType === "image" || fileType === "video" ? fileType: "raw";

        const uploadPromise = new Promise<{ fileUrl: string, publicId: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: resourceType },
                (error, result) => {
                if (error) reject(error);
                else if (result) resolve({ fileUrl: result.secure_url, publicId: result.public_id });
                else reject(new Error("Upload result is undefined"));
                }
            );

            fileStream.pipe(uploadStream);
        });

        const { fileUrl, publicId } = await uploadPromise;

        cloudinaryResult = { public_id: publicId };

        const result = await sql`INSERT INTO files (filename, file_url) 
        VALUES (${file.name}, ${fileUrl}) 
        RETURNING *`;

        return result.rows[0] as DatabaseFile;

    } catch (error) {
        if (error instanceof Error && cloudinaryResult) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }

        throw error;
    }
}