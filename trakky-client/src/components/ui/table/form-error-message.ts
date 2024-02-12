import { resultToast } from "@/components/ui/use-toast.ts";

export const errorMessage = (setIsError: (value: boolean) => void, errorMessage?: string) => {
  setIsError(true);

  return resultToast({
    isError: true,
    message: errorMessage ?? "Unknown error",
  });
}