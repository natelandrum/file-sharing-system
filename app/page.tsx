import FileUploader from "@/components/FileUploader";
import { getFiles } from "./lib/actions";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

export default async function Home() {
  const files = await getFiles();

  return (
    <main className="flex flex-col items-center justify-center p-10 bg-gray-900 min-h-screen text-white">
      <Box className="flex items-center max-w-xl">
        <Image src="/logo.png" alt="logo" width={200} height={200} />
        <Typography variant="h1" sx={{
          fontSize: "4rem",
          fontWeight: "bold",
          ml: 2,
          textAlign: "center",
        }}>File Sharing System
        </Typography>
      </Box>
      <FileUploader files={files} />
    </main>
  );
}
