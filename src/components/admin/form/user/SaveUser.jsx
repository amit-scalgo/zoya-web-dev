import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileInput from "@/components/ui/common/FileInput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { forwardRef, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { newFormRequest, newRequest } from "@/endpoints";
import { userSchema } from "@/schema/user.schema";
import { ADMIN_SUPPORT_LIST } from "@/endpoints/admin";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetData from "@/hooks/useGetData";
import Loader from "@/components/ui/Loader";
import { useLocation, useNavigate } from "react-router-dom";

export default function SaveUserForm({
  api,
  type,
  queryKey,
  selectedId,
  setSelectedId,
  setIsOpen,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [previouslySelectedSupport, setPreviouslySelectedSupport] =
    useState(null);
  const enableTerm = api ? true : false;
  const { data: supportMembers } = useGetData(
    ADMIN_SUPPORT_LIST,
    "adminSupportList",
    enableTerm,
  );

  // GET DETAILS FOR IN CASE OF UPDATE
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, selectedId],
    queryFn: () =>
      newRequest.get(`${api}/${selectedId}`).then((res) => {
        return res?.data?.data;
      }),
    enabled: !!selectedId,
  });

  const isPasswordRequired = !selectedId;

  useEffect(() => {
    if (data?.dedicatedSupportUserId) {
      setPreviouslySelectedSupport(data?.dedicatedSupportUserId);
    }
  }, [data, setPreviouslySelectedSupport]);

  const [file, setFile] = useState("");
  const [loader, setLoader] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userSchema(isPasswordRequired)) });

  //   PREFETCHING VALUES
  useEffect(() => {
    if (selectedId && data) {
      setValue("name", data?.name);
      setValue("email", data?.email);
      setValue("phoneNumber", data?.phoneNumber);
      setValue("bio", data?.bio);
      setValue("dedicatedSupportUserId", data?.dedicatedSupportUserId);
    }
  }, [data, setValue, selectedId]);

  const onsubmit = async (data) => {
    setLoader(true);
    const { name, email, password, phoneNumber, dedicatedSupportUserId, bio } =
      data;
    if (type === "user") {
      if (!previouslySelectedSupport && !dedicatedSupportUserId) {
        toast.error("Please select a support to continue");
        setLoader(false);
        return false;
      }
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    !selectedId && formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("bio", bio);
    formData.append("avatar", file);
    type === "user" &&
      formData.append("dedicatedSupportUserId", dedicatedSupportUserId);
    type === "user" &&
      selectedId &&
      previouslySelectedSupport &&
      formData.append("previouslySelectedSupport", previouslySelectedSupport);
    try {
      let res;
      res = selectedId
        ? await newFormRequest.patch(`${api}/${selectedId}`, formData)
        : await newFormRequest.post(api, formData);
      if (res.status === 201 || res.status === 200) {
        toast.success(res.data.message);
        queryClient.invalidateQueries([queryKey]);
        reset();
        handleClose();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setLoader(false);
    }
  };

  const ForwardedSelect = forwardRef((props, ref) => (
    <Select {...props}>
      <SelectTrigger
        ref={ref}
        className="h-10 w-full text-black/60 !shadow-none"
      >
        <SelectValue placeholder="Select support" />{" "}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Support Members</SelectLabel>{" "}
          {props.supportMembers?.map((member) => (
            <SelectItem key={member._id} value={member._id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ));

  const handleClose = () => {
    setSelectedId("");
    reset();
    navigate(pathname, { replace: true });
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-2">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <FileInput
            onFileSelected={setFile}
            type=""
            givenFile={data?.avatar}
            userInfo=""
          />
          {type === "user" && (
            <div className="group flex flex-col gap-0.5">
              <label
                htmlFor="support"
                className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
              >
                Support
              </label>
              <Controller
                name="dedicatedSupportUserId"
                defaultValue={data?.dedicatedSupportUserId || ""}
                control={control}
                render={({ field }) => (
                  <ForwardedSelect
                    {...field}
                    supportMembers={supportMembers}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>
          )}
          <div className="grid w-full grid-cols-2 gap-2">
            <div className="group flex flex-col gap-0.5">
              <label
                htmlFor="name"
                className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
              >
                Name
              </label>
              <Input
                type="text"
                {...register("name")}
                placeholder="Name"
                onKeyPress={(event) => {
                  if (event.target.value.length >= 100) {
                    event.preventDefault();
                  }
                }}
                className="h-10 shadow-none"
              />
              {errors?.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="group flex flex-col gap-0.5">
              <label
                htmlFor="email"
                className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
              >
                Email Address
              </label>
              <Input
                type="email"
                {...register("email")}
                placeholder="Email address"
                className="h-10 shadow-none"
              />
              {errors?.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          <div className="5 group flex flex-col gap-0">
            <label
              htmlFor="bio"
              className="mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
            >
              Bio
            </label>
            <Textarea
              {...register("bio")}
              placeholder="User bio"
              className="h-16 shadow-none"
            />
            {errors?.bio && (
              <span className="text-xs text-red-500">{errors.bio.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor="password"
                className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
              >
                Phone Number
              </label>
              <Input
                type="text"
                {...register("phoneNumber")}
                placeholder="Phone number"
                className="h-10 shadow-none"
                onKeyPress={(event) => {
                  const regex = /^[0-9]$/;
                  if (
                    !regex.test(event.key) ||
                    event.target.value.length >= 10
                  ) {
                    event.preventDefault();
                  }
                }}
              />
              {errors?.phoneNumber && (
                <span className="text-xs text-red-500">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
            {selectedId ? null : (
              <div className="flex flex-col gap-0.5">
                <label
                  htmlFor="password"
                  className="required mb-1 text-xs font-semibold text-black/50 transition-all duration-500 group-hover:text-zoyaprimary"
                >
                  Password
                </label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="h-10 shadow-none"
                />
                {errors?.password && (
                  <span className="text-xs text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-7 flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleClose}
              disabled={loader}
              variant="secondary"
              className="h-10 min-w-32 max-w-32"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10 min-w-32 max-w-32 font-bold">
              {loader ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                  <>{selectedId ? "Updating" : "Creating"}</>
                </div>
              ) : (
                <>{selectedId ? "Update" : "Create"}</>
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
