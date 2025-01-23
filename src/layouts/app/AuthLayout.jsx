import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col-reverse overflow-x-hidden lg:grid lg:grid-cols-3">
      <div className="col-span-2 flex-grow">
        <Outlet />
      </div>
      <img
        className="col-span-1 h-56 w-full object-cover lg:h-full"
        src="/auth/0.svg"
        alt="auth banner"
        loading="lazy"
      />
    </div>
  );
};

export default AuthLayout;
