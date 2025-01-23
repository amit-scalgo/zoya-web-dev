import { useState } from "react";
import toast from "react-hot-toast";

const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    banner: null,
    image: null,
  });
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return null;
    if (file.size > 1024 * 1024 * 2) {
      toast.error("File size should not exceed 2MB");
      return null;
    }
    setIsUploading(true);
    const fileUrl = URL.createObjectURL(file);
    setUploadedFiles((prev) => ({ ...prev, [type]: fileUrl }));
    setIsUploading(false);
    return { file, preview: fileUrl };
  };
  return { isUploading, uploadedFiles, handleFileChange, setUploadedFiles };
};

export default useImageUpload;
