import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUserSchema } from "@/schema/auth.schema";
import { useForm } from "react-hook-form";
import { newFormRequest } from "@/endpoints";
import { REGISTET_USER } from "@/endpoints/user";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import FileInput from "@/components/ui/common/FileInput";
import { Textarea } from "@/components/ui/textarea";
// import VerifyOtp from "@/components/popups/auth/VerifyOtp";

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  // const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerUserSchema),
    mode: "onChange",
  });

  const onsubmit = async (data) => {
    setLoader(true);
    const { name, email, password, phoneNumber, bio } = data;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("bio", bio);
    formData.append("avatar", file);
    try {
      const res = await newFormRequest.post(REGISTET_USER, formData);
      if (res.status === 201) {
        setLoader(false);
        toast.success(res.data.message);
        reset();
        navigate("/auth/login");
        // setOpen(true);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
      reset();
    }
  };

  return (
    <>
      {/* <VerifyOtp open={open} setOpen={setOpen} /> */}
      <div className="flex h-full w-full flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="flex h-full w-1/2 flex-col justify-center gap-2"
        >
          <div className="flex flex-col items-start">
            <h5 className="text-3xl font-semibold">Register Account</h5>
            <p className="mt-3 text-black/50">
              Signup with us, enter basic details.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-1">
            <FileInput
              onFileSelected={setFile}
              type={""}
              givenFile={""}
              userInfo={""}
            />
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="group flex flex-col gap-0.5">
                <label
                  className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  type="text"
                  className="h-10"
                  {...register("name")}
                  placeholder="Your name"
                />
                {errors?.name && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="group flex flex-col gap-0.5">
                <label
                  className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <Input
                  type="email"
                  {...register("email")}
                  className="h-10"
                  placeholder="john@example.com"
                />
                {errors?.email && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="group col-span-2 flex flex-col gap-0.5">
                <label
                  className="mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
                  htmlFor="bio"
                >
                  Bio
                </label>
                <Textarea
                  type="text"
                  {...register("bio")}
                  className="h-16"
                  placeholder="User bio"
                />
                {errors?.bio && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.bio.message}
                  </span>
                )}
              </div>
              <div className="group flex flex-col gap-0.5">
                <label
                  className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
                  htmlFor="phoneNumber"
                >
                  Phone Number
                </label>
                <Input
                  type="text"
                  {...register("phoneNumber")}
                  onKeyPress={(event) => {
                    const regex = /^[0-9]$/;
                    if (!regex.test(event.key)) {
                      event.preventDefault();
                    }
                    const currentValue = event.target.value;
                    if (currentValue.length >= 10) {
                      event.preventDefault();
                    }
                  }}
                  className="h-10"
                  placeholder="Phone number"
                />
                {errors?.phoneNumber && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>
              <div className="group flex flex-col gap-0.5">
                <label
                  className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
                  htmlFor="bio"
                >
                  Password
                </label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="h-10"
                />
                {errors?.password && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            className="mt-7 min-h-11 bg-zoyaprimary font-bold"
            type="submit"
          >
            {loader ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                Registering
              </div>
            ) : (
              "Register"
            )}
          </Button>
          <div className="flex items-center gap-1 text-sm text-black/50">
            <p>Already have an account? </p>
            <Link
              className="font-semibold text-zoyaprimary/80"
              to="/auth/login"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
