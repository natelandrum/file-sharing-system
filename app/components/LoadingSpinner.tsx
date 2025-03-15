import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Box className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
      <CircularProgress color="secondary" size={60} />
    </Box>
  );
}
