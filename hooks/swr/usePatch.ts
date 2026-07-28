import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { patchFetcher } from "@/lib/fetchers/patchFetcher";

type UsePatchOptions = {
  revalidateKey?: string | string[];
};

export const usePatch = (url: string, options?: UsePatchOptions) => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    url,
    patchFetcher,
    {
      onSuccess: () => {
        if (!options?.revalidateKey) return;

        const keys = Array.isArray(options.revalidateKey)
          ? options.revalidateKey
          : [options.revalidateKey];

        keys.forEach((key) => mutate(key));
      },
    },
  );

  return {
    data,
    isLoading: isMutating,
    isError: error,
    mutate: trigger,
  };
};
