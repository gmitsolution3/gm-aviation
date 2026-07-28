import useSWR, { SWRConfiguration } from "swr";
import { fetcher } from "@/lib/fetchers/fetcher";

export const useFetchById = <T = any>(
  url: string,
  id?: string | number,
  options?: SWRConfiguration<T>
) => {
  const key = id ? `${url}/${id}` : null;

  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    ...options,
  });

  return {
    data,
    isLoading: isLoading || isValidating,
    isError: error,
    refetch: mutate,
  };
};
