import { ToastId, UseToastOptions, createStandaloneToast } from "@chakra-ui/react";
import { getRandomString, isDev, parseStringAsBoolean } from "@pastable/core";
import { AxiosError } from "axios";
import theme from "../theme";

// Toasts
const toast = createStandaloneToast({ theme });
const baseToastConfig = { duration: 3000, isClosable: true, unique: true };

type ToastStatus = Exclude<UseToastOptions["status"], undefined> | "default";
export const toastConfigs: Record<ToastStatus, UseToastOptions> = {
    default: { ...baseToastConfig },
    success: { ...baseToastConfig, status: "success" },
    error: { ...baseToastConfig, status: "error" },
    info: { ...baseToastConfig, status: "info" },
    warning: { ...baseToastConfig, status: "warning" },
};

const toastMap = new Map<ToastId, ToastOptions>();
export type ToastOptions = UseToastOptions & UniqueToastOptions;

export const makeToast = (options: ToastOptions) => {
    if (options.uniqueId) {
        options.id = getRandomString(10);
        const prevToast = toastMap.get(options.uniqueId);
        prevToast && toast.close(prevToast.id!);
        toastMap.set(options.uniqueId, options);
    } else if (options.unique) {
        toast.closeAll();
    }

    return toast(options);
};

export const defaultToast = (options: ToastOptions) =>
    makeToast({ ...toastConfigs.default, ...options });
export const successToast = (options: ToastOptions) =>
    makeToast({ ...toastConfigs.success, unique: false, ...options });
export const errorToast = (options?: ToastOptions) =>
    makeToast({ title: "Une erreur est survenue", ...toastConfigs.error, ...options });
export const infoToast = (options: ToastOptions) => makeToast({ ...toastConfigs.info, ...options });
export const warningToast = (options: ToastOptions) =>
    makeToast({ ...toastConfigs.warning, ...options });

// Errors
export const onError = (description: string) => errorToast({ description });
export const onAxiosError = (err: AxiosError) => {
    if (isDev()) console.error(err);
    onError(err.response?.data?.error) as any;
};

interface UniqueToastOptions {
    /** When provided, will close previous toasts with the same id */
    uniqueId?: ToastId;
    /** When true, will close all other toasts */
    unique?: boolean;
}
