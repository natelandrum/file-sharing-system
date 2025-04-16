import FileUploader from "@/components/FileUploader";
import { getFiles } from "./lib/actions";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
  // Opt out of static rendering and cache storage
  noStore();
  const files = await getFiles();

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-10 bg-gray-900 min-h-screen text-white">
      <Box className="flex flex-col sm:flex-row items-center max-w-xl mb-6">
        <Image 
          src="/logo.png" 
          alt="logo" 
          width={150} 
          height={150} 
          className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] mb-4 sm:mb-0"
        />
        <Typography variant="h1" sx={{
          fontSize: {xs: "2rem", sm: "3rem", md: "4rem"},
          fontWeight: "bold",
          ml: {xs: 0, sm: 2},
          textAlign: "center",
        }}>
          File Sharing System
        </Typography>
      </Box>
      <FileUploader files={files} />
    </main>
  );
}
