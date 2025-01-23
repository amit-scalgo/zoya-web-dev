import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SaveUserForm from "../../form/user/SaveUser";

export function SupportSavePopup({
  api,
  type,
  queryKey,
  isOpen,
  setIsOpen,
  selectedId,
  setSelectedId,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-zoyaprimary font-semibold capitalize text-white"
          variant="outline"
        >
          Create {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-min max-h-[90%] overflow-y-auto py-4 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="mt-1 font-bold capitalize">
            {selectedId ? "Update" : "Create"} {type}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="-mt-2.5">
          Information is used for communication purposes only.
        </DialogDescription>
        <SaveUserForm
          api={api}
          type={type}
          queryKey={queryKey}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
