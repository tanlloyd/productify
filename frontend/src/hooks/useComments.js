import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "../lib/api";

export const useCreateComment = () => {   // custom hook to create comment
  const queryClient = useQueryClient();   // cache controller

  // mutation = data modification
  return useMutation({    
    mutationFn: createComment,
    onSuccess: (_, variables) => {   // refresh comment list after comment created successfully 
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
};

export const useDeleteComment = (productId) => {    // custom hook to delete comment
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });    // refresh comment list after comment deleted successfully
    },
  });
};

// handle comments data