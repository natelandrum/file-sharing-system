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
          <div className="mt-4 sm:mt-6">
            <Button
              onClick={() => setExpanded(!expanded)}
              sx={{ 
                color: "yellow", 
                "&:hover": { color: "gold" },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                py: { xs: 0.5, sm: 1 }
              }}
            >
              {expanded ? "▼ Hide Older Files" : "▶ Show Older Files"}
            </Button>

            <Collapse in={expanded}>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-2">
                {Object.entries(oldFiles).map(([date, files], index) => (
                  <div key={`${date}-${index}`} className="mb-3">
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: "gray",
                        fontSize: { xs: '0.8rem', sm: '1rem' },
                        mb: 1
                      }}
                    >
                      {date}
                    </Typography>
                    <div className="space-y-2 sm:space-y-3">
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
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
        )}
      </>
    );
}