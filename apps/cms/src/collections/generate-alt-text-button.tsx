"use client";

import { SparklesIcon } from "@/common/icons";
import {
  Button,
  toast,
  useDocumentInfo,
  useForm,
  useFormModified,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function GenerateAltTextButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { id } = useDocumentInfo();
  const { getData } = useForm();
  const router = useRouter();
  const isModified = useFormModified();

  const { mimeType } = getData();
  if (!mimeType || !mimeType.includes("image/")) {
    return null;
  }

  if (typeof id !== "string") throw new Error("Expected id to be a string");
  return (
    <>
      <Button
        size="medium"
        icon={<SparklesIcon />}
        buttonStyle="secondary"
        onClick={async () => {
          if (
            !window.confirm(
              "This will send the image to OpenAI to generate an alternative text.\n\nThe existing alternative text will be overwritten. Do you want to continue?",
            )
          ) {
            return;
          }

          setIsGenerating(true);

          try {
            const result = await fetch(`/api/media/${id}/update-alt-text`, {
              method: "post",
              credentials: "include",
            });

            if (!result.ok) {
              toast.error("Failed to generate alt text", {
                duration: 3000,
              });
              return;
            }

            router.refresh();
            toast.success("Alt text generated successfully", {
              duration: 3000,
            });
          } finally {
            setIsGenerating(false);
          }
        }}
        disabled={isGenerating || isModified}
      >
        {isGenerating ? "Generating…" : "Generate"}
      </Button>
      {isModified && (
        <p className="field-description">
          Please save your changes to generate the alt text.
        </p>
      )}
    </>
  );
}
