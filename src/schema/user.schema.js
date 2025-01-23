import * as Yup from "yup";

export const userSchema = (isPasswordRequired) => {
  return Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .nullable()
      .test("is-required", "Password is required", function (value) {
        if (isPasswordRequired) {
          return !!value;
        }
        return true;
      })
      .test(
        "valid-password",
        "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character",
        function (value) {
          if (!value) return true;
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return passwordRegex.test(value);
        },
      ),
    bio: Yup.string(),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });
};
