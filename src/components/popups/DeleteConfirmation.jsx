import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { newRequest } from "@/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export function DeleteConfirmation({
  selectedId,
  setSelectedId,
  openDeletePopup,
  setOpenDeletePopup,
  queryKey,
  api,
}) {
  const [loader, setLoader] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setLoader(true);
      const res = await newRequest.delete(`${api}/${selectedId}`);
      if (res.status === 200) {
        toast.success("Item deleted successfully");
        setLoader(false);
        setOpenDeletePopup(false);
        setSelectedId(null);
        queryClient.invalidateQueries(queryKey);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      toast.error("Failed to delete item");
    }
  };
  return (
    <Dialog open={openDeletePopup} onOpenChange={setOpenDeletePopup}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription className="pt-3">
            Are you sure you want to delete the item ? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="-my-5 flex items-center justify-center">
          <img
            className="h-40"
            src="https://i.pinimg.com/originals/ff/fa/9b/fffa9b880767231e0d965f4fc8651dc2.gif"
            alt="delete item"
            loading="lazy"
            aria-hidden="true"
          />
        </div>
        <DialogFooter className="w-full justify-between gap-2">
          <Button
            type="button"
            className="min-w-32 bg-red-500 text-white"
            variant="danger"
            onClick={handleDelete}
          >
            {loader ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                Deleting
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
