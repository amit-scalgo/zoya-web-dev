import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { useChatStore } from "@/lib/store/chat.store";

export default function Header() {
  const { setChatListView } = useChatStore();
  const navigate = useNavigate();
  const handleNavigate = () => {
    setChatListView(true);
    navigate("/");
  };
  return (
    <div className="flex h-16 w-full items-center justify-between border-b border-b-black/5 bg-white px-3 md:hidden lg:px-14">
      <div
        onClick={handleNavigate}
        className="flex h-12 w-12 items-center justify-center rounded-md bg-black text-sm font-extrabold text-white shadow-md"
      >
        Zoya
      </div>
      <ProfileDropdown />
    </div>
  );
}
