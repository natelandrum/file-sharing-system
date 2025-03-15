import { Button, Collapse, Typography } from "@mui/material";
import FileCard from "@/components/FileCard";
import { DatabaseFile } from "@/lib/definitions";

interface OldFilesListProps {
    selectedFiles: string[]
    toggleFileSelection: (fileId: string) => void
    handleDownload: (fileUrl: string, filename: string) => void
    handleDelete: (fileId: string) => void
    oldFiles: Record<string, DatabaseFile[]>
    expanded: boolean
    setExpanded: (expanded: boolean) => void
}

export default function OldFilesList({
    selectedFiles,
    toggleFileSelection,
    handleDownload,
    handleDelete,
    oldFiles,
    expanded,
    setExpanded,
}: OldFilesListProps) {
    return (
      <>
        {/* Older Files */}
        {Object.keys(oldFiles).length > 0 && (
          <div className="mt-6">
            <Button
              onClick={() => setExpanded(!expanded)}
              sx={{ color: "yellow", "&:hover": { color: "gold" } }}
            >
              {expanded ? "▼ Hide Older Files" : "▶ Show Older Files"}
            </Button>

            <Collapse in={expanded}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {Object.entries(oldFiles).map(([date, files], index) => (
                  <div key={`${date}-${index}`}>
                    <Typography variant="subtitle1" sx={{ color: "gray" }}>
                      {date}
                    </Typography>
                    {files.map((file, fileIndex) => (
                      <FileCard
                        key={`${file.id}-${fileIndex}`}
                        file={file}
                        selectedFiles={selectedFiles}
                        toggleFileSelection={toggleFileSelection}
                        handleDownload={handleDownload}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
        )}
      </>
    );
}