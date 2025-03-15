import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/actions";

export async function POST(req: Request) {
    try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const uploadResult = await uploadFile(file);
    return NextResponse.json({ 
        id: uploadResult.id,
        filename: uploadResult.filename,
        file_url: uploadResult.file_url,
        created_at: uploadResult.created_at 
    }, { 
        status: 200 
    });
    } catch (error) {
        return NextResponse.json({ error: "An error occurred during file upload" }, { status: 500 });
        throw error;
    }
}