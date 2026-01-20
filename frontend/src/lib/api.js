import api from "./axios";

// USERS API
export const syncUser = async (userData) => {
  const { data } = await api.post("/users/sync", userData);
  return data;
};

// Products API
export const getAllProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const getMyProducts = async () => {
  const { data } = await api.get("/products/my");
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async ({ id, ...productData }) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// Comments API
export const createComment = async ({ productId, content }) => {        // 1. contain the data
  const { data } = await api.post(`/comments/${productId}`, { content });   // 2. send the data to backend (exp: POST http://localhost:5173/api/comments/123)
  return data;                                                     // send data to app.use("/api/comments", commentRoutes); at index.ts
};

export const deleteComment = async ({ commentId }) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

// backend requests from frontend
