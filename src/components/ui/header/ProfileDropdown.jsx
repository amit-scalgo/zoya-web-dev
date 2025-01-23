import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/lib/store/user.store";
import { useSocketStore } from "@/lib/store/socket.store";
import { useAppStore } from "@/lib/store/app.store";

export function ProfileDropdown({ type }) {
  const { setMoodPickerOpen } = useAppStore();
  const { socket } = useSocketStore();
  const { userInfo, setUserInfo } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (socket && userInfo?._id) {
      socket.emit("signout", userInfo._id);
    }
    setUserInfo(null);
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <DropdownMenu modal={false}>
      <div className="flex cursor-pointer flex-col items-center text-[0.67rem] font-extrabold text-black/70">
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer lg:h-9 lg:w-9">
            <AvatarImage src={userInfo?.avatar} alt={userInfo?.name} />
            <AvatarFallback className="bg-zoyaprimary text-white">
              {userInfo?.name?.charAt(0).toUpperCase()}
              {userInfo?.name?.charAt(1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {type !== "admin" && (
          <p className="hidden capitalize md:block">{userInfo?.role}</p>
        )}
      </div>
      <DropdownMenuContent className="mr-2 w-56 md:ml-2">
        <DropdownMenuLabel>{userInfo?.name} - My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              to={`/profile?uid=${userInfo?._id}${type === "admin" && `&type=admin`}`}
            >
              Profile
            </Link>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* <DropdownMenuItem onClick={() => setMoodPickerOpen(true)}>
            Change Mood
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
