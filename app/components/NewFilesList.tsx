import { Typography } from "@mui/material";
import FileCard from "@/components/FileCard";

interface NewFilesListProps {
    recentFiles: { id: string; filename: string; file_url: string }[]
    selectedFiles: string[]
    toggleFileSelection: (fileId: string) => void
    handleDownload: (fileUrl: string, filename: string) => void
    handleDelete: (fileId: string) => void
}

export default function NewFilesList({
    recentFiles,
    selectedFiles,
    toggleFileSelection,
    handleDownload,
    handleDelete
}: NewFilesListProps) {
    return (
      <>
        {/* File List */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          Recent Files (Last 3 Days)
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {recentFiles.map((file, index) => (
            <FileCard
              key={`${file.id}-${index}`}
              file={file}
              selectedFiles={selectedFiles}
              toggleFileSelection={toggleFileSelection}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </>
    );
}