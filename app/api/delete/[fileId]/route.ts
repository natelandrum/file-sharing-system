import { NextResponse } from "next/server"; 
import { deleteFile } from "@/lib/actions";
import { unstable_noStore as noStore } from 'next/cache';

export async function DELETE(req: Request) {
    // Prevent caching the response
    noStore();
    
    try {
        const { pathname } = new URL(req.url);
        const fileId = pathname.split("/").pop();

        if (!fileId) {
            return NextResponse.json({ message: "File ID is required" }, { status: 400 });
        }
        
        const result = await deleteFile(fileId);
        
        if (!result || result.rowCount === 0) {
            return NextResponse.json({ message: "File not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        throw error;
    }
}
