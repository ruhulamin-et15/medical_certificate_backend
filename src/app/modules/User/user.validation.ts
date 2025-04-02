import { z } from "zod";

const CreateUserValidationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().nullable().optional(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
  addressOne: z.string().nullable().optional(),
  addressTwo: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  registeredBy: z.string().nullable().optional(),
  availableAt: z.string().nullable().optional(),
  acceptedBy: z.string().nullable().optional(),
});

const UserLoginValidationSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
};
