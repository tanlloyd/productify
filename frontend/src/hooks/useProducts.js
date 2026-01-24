import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
} from "../lib/api";

export const useProducts = () => {
  const result = useQuery({ queryKey: ["products"], queryFn: getAllProducts }); // fetch all products, cache them under key "products"
  return result;
};

// cache key = label for react to rmb data that it already fetched

export const useCreateProduct = () => {     
  return useMutation({ mutationFn: createProduct });        // create a new product 
};

export const useProduct = (id) => {
  return useQuery({             // fetch a single product by id
    queryKey: ["product", id],     // cache key
    queryFn: () => getProductById(id),
    enabled: !!id,               // only run this query if id is exists
  });
};

export const useDeleteProduct = () => {     // delete product
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });      // refetch data because cached version is outdated
    },
  });
};

export const useMyProducts = () => {
  return useQuery({ queryKey: ["myProducts"], queryFn: getMyProducts });    // fetch products created by logged in user
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({          // update product
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {   // after update success, refresh
      queryClient.invalidateQueries({ queryKey: ["products"] });    // all products list
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });  // single product page
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });  // my products list
    },
  });
};

// handle products data
