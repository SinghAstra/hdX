import * as yup from "yup";

export const createNoteSchema = yup.object({
  content: yup
    .string()
    .required("Content is required")
    .min(1, "Content cannot be empty")
    .max(5000, "Content must be less than 5000 characters"),
});

export type CreateNoteFormData = {
  content: string;
};
