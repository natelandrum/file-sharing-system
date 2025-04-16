"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { DatabaseFile } from "@/lib/definitions";
import UploadBox from "@/components/UploadBox";
import DownloadSelectedFiles from "@/components/DownloadSelectedFiles";
import NewFilesList from "@/components/NewFilesList";
import OldFilesList from "@/components/OldFilesList";
import ErrorModal from "@/components/ErrorModal";
import LoadingSpinner from "@/components/LoadingSpinner";

interface FileUploaderProps {
  files: DatabaseFile[];
}


export default function FileUploader({ files }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [recentFiles, setRecentFiles] = useState<DatabaseFile[]>([]);
  const [oldFiles, setOldFiles] = useState<Record<string, DatabaseFile[]>>({});
  const [expanded, setExpanded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const recent_files = files.filter(
      (file) =>
        new Date(file.created_at).getTime() >
        threeDaysAgo
    );

    const old_files = files.reduce((acc, file) => {
      const fileDate = new Date(file.created_at).getTime();
      const threshold = threeDaysAgo;
      const dateKey = new Date(file.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (fileDate <= threshold) {
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(file);
      }

      return acc;
    }, {} as Record<string, DatabaseFile[]>);

    setRecentFiles(recent_files);
    setOldFiles(old_files);
  }, [files]);

  const handleDelete = async (fileId: string) => {
    setLoading(true);
    try {
      const response = await axios.delete(`api/delete/${fileId}`);
      if (response.status !== 200) {
        throw new Error(`Failed to delete file: ${fileId}`);
      }
      setRecentFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
      setOldFiles((prevOldFiles) => {
        const updatedOldFiles = { ...prevOldFiles };
        for (const date in updatedOldFiles) {
          updatedOldFiles[date] = updatedOldFiles[date].filter(
            (file) => file.id !== fileId
          );
          if (updatedOldFiles[date].length === 0) {
            delete updatedOldFiles[date];
          }
        }
        return updatedOldFiles;
      });
    } catch (error) {
      setErrorMessage("Failed to delete file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

const handleDownload = async (fileUrl: string, filename: string) => {
  setLoading(true);
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${filename}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "downloaded-file"; // Ensure filename fallback
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up memory
  } catch (error) {
    setErrorMessage("Failed to download file.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  const handleDownloadSelected = async () => {
    setLoading(true);
    try {
      if (selectedFiles.length === 0) return;

      const zip = new JSZip();
      const downloadPromises = selectedFiles.map(async (fileId) => {
        const file =
          recentFiles.find((f) => f.id === fileId) ||
          Object.values(oldFiles)
            .flat()
            .find((f) => f.id === fileId);

        if (!file) return;

        const response = await fetch(file.file_url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${file.filename}`);
        }
        const blob = await response.blob();
        zip.file(file.filename, blob);
      });

      await Promise.all(downloadPromises);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "downloaded_files.zip");
    } catch (error) {
      setErrorMessage("Failed to download files.");
      console.error(error);
    } finally {
      setLoading(false);
      setSelectedFiles([]);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="p-4 sm:p-6 rounded-lg shadow-lg bg-gray-900 text-white w-full max-w-2xl">
        <UploadBox
          setUploading={setUploading}
          setRecentFiles={setRecentFiles}
          setErrorMessage={setErrorMessage}
          setLoading={setLoading}
          uploading={uploading}
        />
        <DownloadSelectedFiles
          selectedFiles={selectedFiles}
          handleDownloadSelected={handleDownloadSelected}
        />
        <NewFilesList
          recentFiles={recentFiles}
          selectedFiles={selectedFiles}
          toggleFileSelection={toggleFileSelection}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
        />
        <OldFilesList
          selectedFiles={selectedFiles}
          toggleFileSelection={toggleFileSelection}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
          oldFiles={oldFiles}
          expanded={expanded}
          setExpanded={setExpanded}
        />
        <ErrorModal
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </>
  );
}
