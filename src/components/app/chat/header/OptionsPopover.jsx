import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { useChatStore } from "@/lib/store/chat.store";

export function OptionsPopover() {
  const { setChatUserDetailView } = useChatStore();
  const handleUserDetailView = () => {
    setChatUserDetailView(true);
  };
  return (
    <DropdownMenu modal={false}>
      <div className="flex cursor-pointer flex-col items-center text-[0.67rem] font-extrabold text-black/70">
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="size-5 text-black/70" />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="mr-2 w-40 md:ml-2">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleUserDetailView}
            className="cursor-pointer"
          >
            <span>View Info</span>
            <DropdownMenuShortcut>⇧⌘VI</DropdownMenuShortcut>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Report User</DropdownMenuItem>
          <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem>
            <Link>Chat Theme</Link>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
