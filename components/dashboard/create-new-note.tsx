"use client";

import { useToastContext } from "@/components/providers/toast";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateNoteFormData, createNoteSchema } from "@/lib/validations/note";
import { Loader } from "lucide-react";
import { FormEvent, useState } from "react";
import * as yup from "yup";
import { Textarea } from "../ui/textarea";

function CreateNewNote() {
  const [formData, setFormData] = useState<CreateNoteFormData>({
    content: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateNoteFormData, string>>
  >({});

  const { setToastMessage } = useToastContext();
  const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error for this field when user starts editing
    if (errors[id as keyof CreateNoteFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleCreateNewNote = async (e: FormEvent) => {
    try {
      e.preventDefault();

      // Validate the entire form
      await createNoteSchema.validate(formData, { abortEarly: false });

      setIsCreatingNewNote(true);
      setErrors({});

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create note");
      }

      setToastMessage("Note created successfully!");

      // Reset form
      setFormData({ content: "" });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log("Inside yup Validation Error");
        console.log("error.inner is ", error.inner);
        const newErrors: Partial<Record<keyof CreateNoteFormData, string>> = {};
        error.inner.forEach((err) => {
          console.log("err.path is ", err.path);
          if (err.path) {
            newErrors[err.path as keyof CreateNoteFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
        setToastMessage(error.message);
      }
    } finally {
      setIsCreatingNewNote(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateNewNote}
      className="p-4 space-y-2 w-full max-w-xl"
    >
      <div className="space-y-2">
        <Textarea
          id="content"
          placeholder="Write your note content here..."
          value={formData.content}
          onChange={handleChange}
          className={cn(
            "min-h-[120px] resize-none",
            errors.content ? "border-destructive" : ""
          )}
          rows={6}
        />
        {errors.content && (
          <p className="text-sm text-destructive text-right">
            {errors.content}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isCreatingNewNote}
          className={cn(
            buttonVariants({
              className: "flex-1 rounded tracking-wider relative",
            })
          )}
        >
          {isCreatingNewNote ? (
            <div className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Creating...
            </div>
          ) : (
            "Create Note"
          )}
        </button>
      </div>
    </form>
  );
}

export default CreateNewNote;
