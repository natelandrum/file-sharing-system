import { Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { DatabaseFile } from "@/lib/definitions";

interface UploadBoxProps {
    setUploading: (uploading: boolean) => void;
    setRecentFiles: (prevFiles: (files: DatabaseFile[]) => DatabaseFile[]) => void;
    setErrorMessage: (message: string) => void;
    setLoading: (loading: boolean) => void;
    uploading: boolean;
}

export default function UploadBox(
    {
        setUploading,
        setRecentFiles,
        setErrorMessage,
        setLoading,
        uploading,
    }: UploadBoxProps
) {
      const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        onDrop: async (acceptedFiles) => {
          setUploading(true);
          const uploadedFiles: DatabaseFile[] = [];

          for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append("file", file);
            setLoading(true);
            try {
              const response = await axios.post(
                "api/upload",
                formData,
              );
              if (response.status === 200) {
                uploadedFiles.push({
                  id: response.data.id,
                  filename: response.data.filename,
                  file_url: response.data.file_url,
                  created_at: response.data.created_at,
                });
              }
            } catch (error) {
              setErrorMessage("An error occurred during file upload");
              console.error(error);
            } finally {
                setUploading(false);
                setLoading(false);
            }
          }

          setRecentFiles((prevFiles) => [...uploadedFiles, ...prevFiles]);
        },
      });

    return (
      <>
        {/* Upload Box */}
        <div
          {...getRootProps()}
          className="border-dashed border-2 p-6 text-center cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Typography variant="h6">Uploading...</Typography>
          ) : (
            <>
              <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: "gray" }} />
              <Typography variant="h6">
                Drag & drop files here or click to upload
              </Typography>
            </>
          )}
        </div>
      </>
    );
}