import { useEffect, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorModalProps {
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export default function ErrorModal({ errorMessage, setErrorMessage }: ErrorModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        setTimeout(() => setErrorMessage(null), 1000); // Reset after fade-out
      }, 4000); // 1s in + 3s on screen
      return () => clearTimeout(timer);
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 1 }}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "error.main",
              color: "white",
              p: 3,
              borderRadius: 2,
              boxShadow: 24,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Error</Typography>
            <Typography>{errorMessage}</Typography>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
};

