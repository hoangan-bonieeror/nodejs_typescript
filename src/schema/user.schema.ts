import { object, ref, string } from "yup";

export const schema_createUser = object({
  body: object({
    name: string().required("Name is required"),
    password: string()
      .required("Pass is required")
      .min(6, "Password is required to be at least 6 characters"),
    passwordConfirm: string().oneOf(
      [ref("password"), null],
      "Password musts match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const schema_createUserSession = object({
  body: object({
    password: string()
      .required("Pass is required")
      .min(6, "Password is required to be at least 6 characters"),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});
