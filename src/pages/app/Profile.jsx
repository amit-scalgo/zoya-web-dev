import ProfileCard from "@/components/ui/common/profile/Card";
import ChangePassword from "@/components/ui/common/profile/ChangePassword";

export default function Profile() {
  return (
    <div className="container flex w-full gap-4 p-3 lg:p-7">
      <ProfileCard />
      <ChangePassword />
    </div>
  );
}
