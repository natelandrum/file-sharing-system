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
            size="small"
            sx={{ 
              mt: 2, 
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 2, sm: 3 }
            }}
            startIcon={<DownloadIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
          >
            Download Selected (ZIP)
          </Button>
        ) : (
          <div className="h-10 sm:h-13"></div>
        )}
      </>
    );
}