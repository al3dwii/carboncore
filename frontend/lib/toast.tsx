"use client";
import { Toaster, toast } from "sonner";

export const AppToaster = () => <Toaster position="top-right" richColors />;

export const toastSuccess = (msg: string) => toast.success(msg);
export const toastError = (msg: string) => toast.error(msg);
