import { Card, Checkbox, Typography, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";


interface FileCardProps  {
    file: { id: string; filename: string; file_url: string }
    selectedFiles: string[]
    toggleFileSelection: (fileId: string) => void
    handleDownload: (fileUrl: string, filename: string) => void
    handleDelete: (fileId: string) => void
}

export default function FileCard({
    file,
    selectedFiles,
    toggleFileSelection,
    handleDownload,
    handleDelete,
}: FileCardProps) {
  const LightToolTip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      color: "white",
      boxShadow: theme.shadows[1],
      fontSize: 14,
    },
  }));
    return (
      <Card
        className="p-2 sm:p-3 flex relative items-center justify-between"
        sx={{ backgroundColor: "#FFFFE4", maxHeight: { xs: "90px", sm: "80px" }, minHeight: { xs: "70px", sm: "80px" } }}
      >
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1 mr-1">
          <Checkbox
            checked={selectedFiles.includes(file.id)}
            onChange={() => toggleFileSelection(file.id)}
            color="primary"
            size="small"
            sx={{ padding: { xs: "2px", sm: "8px" } }}
          />
          <LightToolTip title={file.filename} arrow placement="top">
            <Typography
              component="a"
              href={file.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline line-clamp-2 break-all hover:text-blue-800 text-xs sm:text-sm"
              sx={{ maxWidth: { xs: "140px", sm: "200px", md: "300px" } }}
            >
              {file.filename}
            </Typography>
          </LightToolTip>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <Button
            onClick={() => handleDownload(file.file_url, file.filename)}
            color="success"
            size="small"
            sx={{
              "&:hover": { color: "lime" },
              minWidth: "auto",
              padding: { xs: "2px", sm: "6px" }
            }}
          >
            <DownloadIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
          </Button>
          <Button
            onClick={() => handleDelete(file.id)}
            size="small"
            color="error"
            sx={{
              "&:hover": { color: "rgba(255, 49, 49, 0.7)" },
              minWidth: "auto",
              padding: { xs: "2px", sm: "6px" }
            }}
          >
            <DeleteIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
          </Button>
        </div>
      </Card>
    );
}