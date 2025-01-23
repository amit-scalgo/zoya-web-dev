import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { newRequest } from "@/endpoints";
import { UPDATE_PASSWORD } from "@/endpoints/user";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export default function ChangePassword() {
  const [loader, setLoader] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoader(true);
      const formData = {
        oldPassword: data.password,
        newPassword: data.newPassword,
      };
      const response = await newRequest.post(UPDATE_PASSWORD, formData);
      if (response.status === 200) {
        setLoader(false);
        reset();
        toast.success(response.data.message);
        queryClient.invalidateQueries(["profile"]);
      } else {
        throw new Error("Invalid");
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      reset();
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card className="w-full rounded-sm border-black/5 shadow-none">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Change Password</h2>
          <div className="flex max-w-sm text-sm font-medium text-black/70">
            To update your password provide it with current and new password and
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Input
                id="password"
                name="password"
                type="text"
                className="h-10"
                placeholder="Enter your old password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="text"
                className="h-10"
                placeholder="Enter your new password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button
            className="mt-7 min-h-10 min-w-32 cursor-pointer font-medium"
            type="submit"
          >
            {loader ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                Updating
              </div>
            ) : (
              "Change"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
