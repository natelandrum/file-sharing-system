import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface DownloadSelectedFilesProps {
    selectedFiles: string[]
    handleDownloadSelected: () => void
}

export default function DownloadSelectedFiles({
    selectedFiles,
    handleDownloadSelected
}: DownloadSelectedFilesProps) {
    return (
      <>
        {/* Download Selected Files */}
        {selectedFiles.length > 0 ? (
          <Button
            onClick={handleDownloadSelected}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            startIcon={<DownloadIcon />}
          >
            Download Selected (ZIP)
          </Button>
        ) : (
          <div className="h-13"></div>
        )}
      </>
    );
}