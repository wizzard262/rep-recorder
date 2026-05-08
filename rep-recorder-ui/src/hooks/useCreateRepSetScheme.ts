import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "~/hooks/useApi";
import type { CreateRepSetSchemeRequest } from "~/types/rep-set-scheme-types";

export default function useCreateRepSetScheme() {
  const { createRepSetScheme: createRepSetScheme } = useApi();
  const queryClient = useQueryClient();

  const createRepSetSchemeMutation = useMutation({
    mutationFn: (values: CreateRepSetSchemeRequest) => createRepSetScheme(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getRepSetSchemes"],
      });
    },
  });

  return {
    createRepSetSchemeAsync: createRepSetSchemeMutation.mutateAsync,
    isSubmitting: createRepSetSchemeMutation.isPending,
  };
}
