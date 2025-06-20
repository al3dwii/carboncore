"use client";
import { Toaster, toast } from "sonner";

export const AppToaster = () => <Toaster position="top-right" richColors />;

export const toastSuccess = (msg: string) =>
  toast(msg, { className: "bg-green-600 text-white" });
export const toastError = (msg: string) =>
  toast(msg, { className: "bg-red-600 text-white" });
