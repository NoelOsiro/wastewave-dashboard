// components/toast-handler.tsx
'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToastHandler() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const type = searchParams.get("type");

  useEffect(() => {
    if (message && type) {
      if (type === "error") {
        toast.error(message);
      } else if (type === "success") {
        toast.success(message);
      }
    }
  }, [message, type]);

  return null; // This component doesn't render anything
}