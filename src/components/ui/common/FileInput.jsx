import useImageUpload from "@/hooks/useImageUpload";
import { Pencil, UploadCloudIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

const FileInput = ({ onFileSelected, type, givenFile, userInfo }) => {
  const { uploadedFiles, isUploading, handleFileChange, setUploadedFiles } =
    useImageUpload();

  const handleImageSelect = async (event) => {
    const result = handleFileChange(event, "image");
    if (result && onFileSelected) {
      onFileSelected(result.file);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      {type === "round" ? null : (
        <h5 className="text-sm font-medium text-black/70">Profile Avatar</h5>
      )}
      <label
        htmlFor="picture"
        className={`group relative flex max-w-sm items-center justify-center overflow-hidden border transition-all duration-500 hover:border-zoyaprimary/80 ${type === "round" ? "h-14 w-14 rounded-full" : type === "rounded" ? "h-24 w-24 rounded-full" : "h-24 w-24 rounded-md"}`}
      >
        {uploadedFiles?.image || givenFile ? (
          <>
            <Avatar className="h-full w-full">
              <AvatarImage
                src={uploadedFiles?.image || givenFile}
                alt={userInfo?.name}
              />
              <AvatarFallback>
                {userInfo?.name?.charAt(0).toUpperCase()}
                {userInfo?.name?.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
              <Pencil
                onClick={() => setUploadedFiles({ banner: null, image: null })}
                className="absolute cursor-pointer text-white"
              />
            </div>
          </>
        ) : isUploading ? (
          <img
            className="h-full w-full object-contain"
            src="https://cdn.dribbble.com/users/122051/screenshots/5749053/media/1eac0c9541d5b104a36ffc26e8282c5f.gif"
            alt="Uploading"
            loading="lazy"
            aria-hidden="true"
          />
        ) : (
          <UploadCloudIcon className="text-black/50 transition-all duration-500 group-hover:text-zoyaprimary/80" />
        )}
        <input
          onChange={handleImageSelect}
          className="hidden"
          id="picture"
          type="file"
          accept="image/*"
        />
      </label>
    </div>
  );
};

export default FileInput;
