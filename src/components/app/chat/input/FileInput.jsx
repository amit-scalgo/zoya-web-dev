import { FolderInput, Paperclip, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMessageFileStore } from "@/lib/store/file.store";
import imageCompression from "browser-image-compression";

export default function FileInput() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { file, setFile } = useMessageFileStore();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setIsLoading(true);
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(selectedFile, options);

        console.log(
          "Original file size:",
          selectedFile.size / 1024 / 1024,
          "MB",
        );
        console.log(
          "Compressed file size:",
          compressedFile.size / 1024 / 1024,
          "MB",
        );

        setFile(compressedFile);
      } catch (error) {
        console.error("Error compressing file:", error);
        setFile(selectedFile);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFile(selectedFile);
    }

    setPopoverOpen(false);
  };

  return (
    <Popover
      className="w-full"
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
    >
      <PopoverTrigger>
        <div className="mr-3 flex items-center gap-x-4">
          <Paperclip className="size-5 cursor-pointer text-2xl text-black/50 transition-all duration-300 hover:text-zoyaprimary/90" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-48">
        <div className="flex flex-col items-center gap-2">
          {file ? null : (
            <Button className="flex" disabled={isLoading}>
              <label className="flex items-center gap-2" htmlFor="file-image">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FolderInput />
                )}
                {isLoading ? "Compressing..." : "Select Image"}
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="file-image"
                  accept="image/*"
                  className="hidden h-full w-full"
                  disabled={isLoading}
                />
              </label>
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
